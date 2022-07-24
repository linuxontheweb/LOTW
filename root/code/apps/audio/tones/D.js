//NoiseSweeper

//White Noise with a oscillating bqf frequency sweeper

//Holding the space bar turns the gain on

const APPNAME="D";

export const app = function(arg) {

//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

Main.top.title=APPNAME;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;

//»

//Var«


if (!globals.audio) Core.api.mkAudio();
const {mixer, ctx}=globals.audio;
const OUT = ctx.createBiquadFilter();
OUT.frequency.value=1000;
const LINEOUT = ctx.createGain();
const OUTGAIN = LINEOUT.gain;
OUTGAIN.value=0;

const PLUG = mixer.plug_in(OUT);
LINEOUT.connect(OUT);
//OUT.connect(LINEOUT);

let NOISE_BUF_SECS = 2;
let noise_buf_sz = ctx.sampleRate*NOISE_BUF_SECS;
let white_noise_buf=null;
let pink_noise_buf=null;
let brown_noise_buf=null;

let AMP_CURVE;
let AMP_CURVE_DECAY = 0.5;
let AMP_CURVE_ITERS = 10;
//let AMP_CURVE=[0.15,0.5,0.25,0.125,0.0625,0.1,0.05,0];
let CURVE_SECS=4;

let rafId;

//»

//Funcs«

const make_noise = (which) => {//«
	//	if (!audio_ctx) get_audio_ctx();
	//	let ctx = audio_ctx;
	let samp_rate = ctx.sampleRate;
	if (which == "white") {
		if (white_noise_buf) return white_noise_buf;
		white_noise_buf = ctx.createBuffer(1, noise_buf_sz, samp_rate);
		let outbuf = white_noise_buf.getChannelData(0);
		for (let i=0; i < noise_buf_sz; i++) outbuf[i] = Math.random() * 2- 1;
		return white_noise_buf;
	}
	else if (which=="pink") {
		if (pink_noise_buf) return pink_noise_buf;
		let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
		pink_noise_buf = ctx.createBuffer(1, noise_buf_sz, samp_rate);
		let outbuf = pink_noise_buf.getChannelData(0);
		for (let i = 0; i < noise_buf_sz; i++) {
			let rand = Math.random() * 2 - 1;
			b0 = 0.99886 * b0 + rand * 0.0555179;
			b1 = 0.99332 * b1 + rand * 0.0750759;
			b2 = 0.96900 * b2 + rand * 0.1538520;
			b3 = 0.86650 * b3 + rand * 0.3104856;
			b4 = 0.55000 * b4 + rand * 0.5329522;
			b5 = -0.7616 * b5 - rand * 0.0168980;
			outbuf[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + rand * 0.5362;
			outbuf[i] *= 0.11;
			b6 = rand * 0.115926;
		}
		return pink_noise_buf;
	}
	else if (which=="brown") {
		if (brown_noise_buf) return brown_noise_buf;
		let last=0;
		brown_noise_buf = ctx.createBuffer(1, noise_buf_sz, samp_rate);
		let outbuf = brown_noise_buf.getChannelData(0);
		for (let i = 0; i < noise_buf_sz; i++) {
			let rand = Math.random() * 2 - 1;
			outbuf[i] = (last + (0.02 * rand)) / 1.02;
			last = outbuf[i];
			outbuf[i] *= 3.5; // (roughly) compensate for gain
		}
		return brown_noise_buf;
	}
	return null;
}
//»

const gn = (val)=>{//«
    let g = ctx.createGain();
    if (Number.isFinite(val)) g.gain.value = val;
    return g;
};//»

const con=(node1,node2)=>{node1.connect(node2);};
const cons=(arr)=>{let to=arr.length-1;for(let i=0;i<to;i++)arr[i].connect(arr[i+1]);};

const conp=(arg1,arg2)=>{//«
	let arr1;
	if (arg1.connect) arr1 = [arg1];
	else if (arg1.length) arr1 = arg1;
	else throw "Bad arg1";

	let arr2;
	if (arg2.connect) arr2 = [arg2];
	else if (arg2.length) arr2 = arg2;
	else throw "Bad arg2";

	for (let n1 of arr1){
		for (let n2 of arr2) n1.connect(n2);
	}
};//»

const getcurve=()=>{//«
	let NUM=100;
	let NUM_HALF=50;
	let USEMULT=-2.5;
//	let USEMULT=-2.5;
	let USECLIP=false;
	const CURVE=(x,opts={mult:1, clip:true})=>{
		let num_half_cycles = 1;
		let val = 1-(0.5*(1-Math.cos((num_half_cycles*x*Math.PI/NUM))));
		let flat = (x-NUM_HALF)/NUM_HALF;
		let got = 1+(2*-val);
		let diff = got-flat;
		let isneg = x < NUM_HALF;
		let mdf = opts.mult*diff-flat;
		if (opts.clip) {
			if (isneg) {
				if( mdf < 0) mdf = 0;
			}
			else {
				if (mdf > 0) mdf = 0;
			}
		}

		let rv = 0.5*(mdf)+0.5;
		if (rv > 1 && opts.clip) rv = 1;
		else if (rv < 0 && opts.clip) rv = 0;
		return rv;
	};
    let arr = new Float32Array(NUM+1);
    for (let i=0; i<=NUM; i++){
        let y = CURVE(i,{mult:USEMULT, clip: USECLIP});
        arr[i]=2*(0.5-y);
    };
    return arr;
//log(arr);
}//»
//Osc«

const osc = (type, freq)=>{//«
    let o = ctx.createOscillator();
    o.frequency.value = freq;
    o.type=type;
    o.start();
    return o;
};//»

const sin = freq=>{return   osc("sine", freq)};
const tri = (freq)=>{return osc("triangle", freq);};
const saw = (freq)=>{return osc("sawtooth", freq);};
const sqr = (freq)=>{return osc("square", freq);};

//»

const now=(add)=>{if(!add)add=0;return ctx.currentTime+add;};
const vol=val=>{//«
	if(OUTGAIN.value===val) return;
	OUTGAIN.value=val;
///	OUTGAIN.exponentialRampToValueAtTime(1, ctx.currentTime+0.5);
};//»
const bqf=(freq,type)=>{let f=ctx.createBiquadFilter();if(freq)f.frequency.value=freq;if(type)f.type=type;return f;};


//»

const init=()=>{//«

let buf = make_noise("white");
if (!buf) return cerr(`Invalid noise type: ${args[0]}`);
let n = ctx.createBufferSource();
n.buffer = buf;
n.loop = true;
n.start();

let g = gn(0.75);

let f = bqf(500,"bandpass");

let mod = sin(3);
let shaper = ctx.createWaveShaper();
shaper.curve = new Float32Array([0,1000,2000]);
mod.connect(shaper);
shaper.connect(f.frequency);
cons([n,f,g,LINEOUT]);


}//»

//OBJ/CB«
this.onappinit=init;

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
	if (s==="SPACE_") {

vol(1);

	}
}//»
this.onkeyup=(e)=>{//«
	if (e.code=="Space") vol(0);
};//»
this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«
	cancelAnimationFrame(rafId);
	PLUG.disconnect();
}//»
this.onresize = function() {//«
}//»
this.onfocus=()=>{//«
}//»

this.onblur=()=>{//«
}//»

//»

}

