//Rich/Mellow Tone
//Periodic waves for even/odd harmonics to enrich the base tone in different ways

//Holding the space bar turns the gain on

const APPNAME="C";

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
let AMP_CURVE;
let AMP_CURVE_DECAY = 0.5;
let AMP_CURVE_ITERS = 10;
//let AMP_CURVE=[0.15,0.5,0.25,0.125,0.0625,0.1,0.05,0];
let CURVE_SECS=4;

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

const init=()=>{//«
{
	AMP_CURVE=[0.15];
	let CURAMP=0.5;
	for (let i=0; i < AMP_CURVE_ITERS; i++){
		AMP_CURVE.push(CURAMP);
		CURAMP*=AMP_CURVE_DECAY;
	}
	AMP_CURVE.push(0);
}

let basefreq = 110;

let o = sin(basefreq);

//Even harmonics (higher ring)
//let real = new Float32Array([0,1,0.66,0,0.33,0,0.166]);
//let imag = new Float32Array([0,0,0,0,0,0,0]);

//Odd harmonics (a gong)
let real = new Float32Array([0,1,0,0.66,0,0.33,0,0.166]);
let imag = new Float32Array([0,0,0,0,0,0,0,0]);


let wave = ctx.createPeriodicWave(real, imag, {disableNormalization: true});

o.setPeriodicWave(wave);

let g = gn(0.75);
con(o,g);

//const shaper = ctx.createWaveShaper();
//shaper.curve = getcurve();
//shaper.curve = new Float32Array([0,0,1]);
//con(g,shaper);

//con(shaper,LINEOUT);
//con(shaper,LINEOUT);

con(g,LINEOUT);

}//»


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

