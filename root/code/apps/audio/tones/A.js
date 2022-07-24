/*Mean/Gritty Tone


Here are 3 closely tuned oscillators, with up to a semitone gap on each side of the central
frequency.

So, setting the gap at 600 versus 700 cents makes a world of difference in terms of the quality
of the output tone.

The function is:

const makecrazything=(basefreq, centsoff, basegain, gaindiv, curvemult)=>{...}

The basegain is the gain given to the central oscillator and the side oscillators are given
the gain basegain/gaindiv. The higher the basegain, the more electic distortion there ibs'er'loibsed-erpsed.

curvemult sets the shape of the function of the waveshaper that all 3 oscillators go through.




Ways of researching what is going on here:

1) Changing the basefreq by cents while the centsoff remain the same
2) Changing the centsoff by cents while the basefreq remains the same
	- Changing them symmetrically
	- Changing them at different rates, so that we need two centsoff variables






USEMULT, when it is more positive in getcurve makes the tone warmer

gaindiv in init, above 1, makes it more acoustic/mellow, and closer to 1
makes it more electric/distorted. Actually, need to play around with the 
combinations of basegain and gaindiv. 0.33 seems a pretty good setting
for basegain. Putting it around 0.5 definitely jacks up the distortion 
factor.


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
OUTGAIN.value=1;
const PLUG = mixer.plug_in(LINEOUT);

let outgn1,outgn2;

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

const getcurve=(mult)=>{//«
	let NUM=100;
	let NUM_HALF=50;
	let USEMULT=mult;
//	let USEMULT=2.5;
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

const vol=val=>{//«
	if(OUTGAIN.value===val) return;
	OUTGAIN.value=val;
};//»

const makecrazything=(basefreq, centsoff, basegain, gaindiv, curvemult)=>{

//let basegain = 0.33;
//let gaindiv = 3.5;

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


const shaper = ctx.createWaveShaper();
shaper.curve = getcurve(curvemult);

conp([g1,g2,g3], shaper);

return shaper;

};

const init=()=>{//«

outgn1 = gn(0);
outgn2 = gn(0);

//log(getcurve());

//let basefreq = 110;
//let centsoff = 1200;

//let basefreq = 440;
//let centsoff = 700;

//const makecrazything=(basefreq, centsoff, basegain, gaindiv, curvemult)
//When the centsoff are slightly above and below "sweet spots" like 1200 and 700, then it makes
//a more ambiguos tone
let crazything1 = makecrazything(110, 1175, 0.5, 2.5, 1);
let crazything2 = makecrazything(440, 675, 0.5, 2.5, 2);
//let crazything2 = makecrazything(440,300);


con(crazything1,outgn1);
con(crazything2,outgn2);
conp([outgn1,outgn2], LINEOUT);


//con(g1,LINEOUT);
//con(shaper,LINEOUT);

}//»

//»

//OBJ/CB«

this.onappinit=init;

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
	if (s==="1_") outgn1.gain.value=1;
	else if (s==="2_") outgn2.gain.value=1;
}//»
this.onkeyup=(e)=>{//«
//log(e.code);
	if (e.code==="Digit1") outgn1.gain.value=0;
	else if (e.code==="Digit2") outgn2.gain.value=0;
//	if (e.code=="1") vol(0);
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

