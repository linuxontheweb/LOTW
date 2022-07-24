/*

I don't know what 3 oscillators, each 1/2 semitone apart with various gain contributions will
sound like!!!


Smooth tone theory:


a) Band pass filter of a noise source, of varying widths/Q
b) Creating a microtonal range that spans n semitones centered around a given frequency.



What is the narrowest frequency band, and the smallest numbers of subdivisions within that band
that will create a sense of noise rather than definite pitch.


Start with a range of equally spaced frequencies in an octave, which are the
numbered notes. There are 12 tones in a Western octave and 1200 in its
cent-based variant.

Using nothing but Oscillators, find the transition point between uncomfortably
cacophanous disharmony and soothing noise.


How should the gains be adjusted?

//«
(()=>{
const STEPS_PER_OCTAVE = 12;
const HIGH_FREQ = 880;
let mult = 1- Math.pow(2, -1/STEPS_PER_OCTAVE);
let notes = new Array(STEPS_PER_OCTAVE);
let val = HIGH_FREQ;
for (let i=0; i < STEPS_PER_OCTAVE; i++){
    val = val - val*mult;
    notes[STEPS_PER_OCTAVE-i - 1]=val;
//notes.unshift(val);
}
console.log(notes);
})();


(()=>{

const STEPS_PER_OCTAVE = 12;
const HIGH_FREQ = 440;
const NUM_NOTES = 100;
let mult = 1- Math.pow(2, -1/STEPS_PER_OCTAVE);
let notes = new Array(NUM_NOTES);
let val = HIGH_FREQ;
for (let i=0; i < NUM_NOTES; i++){
    val = val - val*mult;
    notes[NUM_NOTES-i-1]=val;
}
log(notes[0],notes[notes.length-1]);
log(100*((1-notes[0]/notes[notes.length-1]).toFixed(4)).pf());

})();
(()=>{

const NUM_STEPS_PER_OCTAVE = 12;
const HIGH_FREQ = 880;
//const LOW_FREQ = 220;

let mult = 1- Math.pow(2, -1/NUM_STEPS_PER_OCTAVE);

let val = HIGH_FREQ;
//let low = LOW_FREQ;
let notes = [HIGH_FREQ];
let n = NUM_STEPS_PER_OCTAVE*4;

for (let i=1; i <= n; i++){
    val = val - val*mult;
//	if (val > low) break;
    notes[i]=val;
}
console.log(notes);

})();
//»

*/
//Holding the space bar turns the gain on
const APPNAME="A";

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
const LINEOUT = ctx.createGain();
const OUTGAIN = LINEOUT.gain;
OUTGAIN.value=0;
const PLUG = mixer.plug_in(LINEOUT);

//»

//Funcs«

const gn = (val)=>{//«
    let g = ctx.createGain();
    if (Number.isFinite(val)) g.gain.value = val;
    return g;
};//»
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
//	let USEMULT=0;
	let USEMULT=2.5;
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
//»

const vol=val=>{//«
	if(OUTGAIN.value===val) return;
	OUTGAIN.value=val;
};//»

const init=()=>{//«

//log(getcurve());

let basefreq = 440;
let centsoff = 700;
let basegain = 0.5;
let gaindiv = 2;


let o = sin(basefreq);
let g = gn(1);
con(o,g);

let o1 = sin(basefreq);
let g1 = gn(basegain);
con(o1,g1);

let o2 = sin(basefreq);
o2.detune.value = -centsoff;
let g2 = gn(basegain/gaindiv);
con(o2,g2);

let o3 = sin(basefreq);
o3.detune.value = centsoff;
let g3 = gn(basegain/gaindiv);
con(o3,g3);

/*
let o4 = sin(base);
o4.detune.value = -(4/3)*centsoff;
let g4 = gn(0.5/8);
con(o4,g4);

let o5 = sin(base);
o5.detune.value = (4/3)*centsoff;
let g5 = gn(0.5/8);
con(o5,g5);

let o6 = sin(base);
o6.detune.value = -(5/3)*centsoff;
let g6 = gn(0.5/16);
con(o6,g6);

let o7 = sin(base);
o7.detune.value = (5/3)*centsoff;
let g7 = gn(0.5/16);
con(o7,g7);
*/



const shaper = ctx.createWaveShaper();
shaper.curve = getcurve();

//conp([g1,g2,g3,g4,g5,g6,g7], LINEOUT);
//con(g,LINEOUT);
conp([g1,g2,g3], shaper);
con(shaper,LINEOUT);
//conp([g1,g2,g3], LINEOUT);


//con(g1,LINEOUT);
//con(shaper,LINEOUT);

}//»

//»

//OBJ/CB«

this.onappinit=init;

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
	if (s==="SPACE_") vol(1);
}//»
this.onkeyup=(e)=>{//«
	if (e.code=="Space") vol(0);
};//»
this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«
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

