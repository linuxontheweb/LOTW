/*Weird/Random Tone

3 closely space oscillators, with each one getting its detune factor randomly set in an
requestAnimationFrame interval.  Setting the frequency and detune factors at different
levels give different effects like doves cooing or a chaotic robotic beep/bloop thing
that verges on a liquidy feel. There are various parameters to set the gains of the
side oscillators to much lower levels than the central oscillator.

*/
//Holding the space bar turns the gain on
const APPNAME="B";

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
let AMP_CURVE=[0.125,0.5,0.25,0.20,0.15,0.1,0.05,0];
let CURVE_SECS=1;
let rafId;

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

//»

//Funcs«

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

const now=(add)=>{
	if (!add) add=0;
	return ctx.currentTime + add;
};
const vol=val=>{//«
	if(OUTGAIN.value===val) return;
	OUTGAIN.value=val;
///	OUTGAIN.exponentialRampToValueAtTime(1, ctx.currentTime+0.5);
};//»

/*
const init=()=>{//«

//log(getcurve());

let basefreq = 140;

let o = sin(basefreq);

//let real = new Float32Array([0,1,0.75,0,0.5,0,0.25,0,0.125]);
//let imag = new Float32Array([0,0.1,0.3,0,0.5,0,0.7,0,0.9]);

//let real = new Float32Array([0,1,1]);
//let imag = new Float32Array([0,0,0.5]);

//let ac = new AudioContext();
//let osc = ac.createOscillator();

//real[0] = 0;
//imag[0] = 0;
//real[1] = 1;
//imag[1] = 0;

//let wave = ctx.createPeriodicWave(real, imag, {disableNormalization: true});

//o.setPeriodicWave(wave);

let g = gn(0.75);
con(o,g);

const shaper = ctx.createWaveShaper();
shaper.curve = getcurve();
//shaper.curve = new Float32Array([0,0,1]);
//con(g,shaper);

//con(shaper,LINEOUT);
//con(shaper,LINEOUT);
con(g,LINEOUT);

}//»
*/
const init=()=>{

let det_mult = 1500;
let det_add = 700;

let det_mult_half = det_mult/2;
let base_gain = 0.5;
let gain_div = 10;
let base_freq = 440;
const looper=()=>{
//Doves cooing at 1000
//Mechanical robotic bordering on liquid at 10000
//	o1.detune.value = Math.random()*100-50;
	o1.detune.value = Math.random()*50-25;
//	o1.detune.value = (Math.random()*det_mult/2-det_mult_half);
	o2.detune.value = (Math.random()*det_mult-det_mult_half) + det_add;
	o3.detune.value = (Math.random()*det_mult-det_mult_half) - det_add;
	rafId=requestAnimationFrame(looper);
};


//const shaper = ctx.createWaveShaper();
//shaper.curve = getcurve();

let o1 = sin(base_freq);
let g1 = gn(base_gain);
o1.connect(g1);
//o1.connect(shaper);
let o2 = sin(base_freq);
let g2 = gn(base_gain/gain_div);
o2.connect(g2);
//o2.connect(shaper);
let o3 = sin(base_freq);
let g3 = gn(base_gain/gain_div);
o3.connect(g3);
//o3.connect(shaper);
//con(o1, LINEOUT);
conp([g1,g2,g3],LINEOUT);
//conp([o1,o2,o3],shaper);
//con(shaper,LINEOUT);

rafId=requestAnimationFrame(looper);

};

//»

//OBJ/CB«
this.onappinit=init;

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
//	if (s==="SPACE_") vol(1);
	if (s==="SPACE_") {

//let now 

//		OUTGAIN.exponentialRampToValueAtTime(0.5, now(0));
//		OUTGAIN.linearRampToValueAtTime(0.25, now(0.25));
//		OUTGAIN.linearRampToValueAtTime(0, now(0.5));
//		OUTGAIN.linearRampToValueAtTime(0, now(2));
try{
		OUTGAIN.setValueCurveAtTime(AMP_CURVE, now(0), CURVE_SECS);
}catch(e){
	OUTGAIN.cancelScheduledValues(now(0));
	OUTGAIN.setValueCurveAtTime(AMP_CURVE, now(0), CURVE_SECS);
}

	}
}//»
this.onkeyup=(e)=>{//«
//	if (e.code=="Space") vol(0);
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

