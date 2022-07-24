/*Theory

(()=>{

const NUM_STEPS_PER_OCTAVE = 12;
const HIGH_FREQ = 880;
const LOW_FREQ = 110;

let n = NUM_STEPS_PER_OCTAVE;
let mult = 1- Math.pow(2, -1/n);

let val = HIGH_FREQ;
let low = LOW_FREQ;
let notes = [HIGH_FREQ];

for (let i=1; val >= low; i++){
	val = val - val*mult;
	notes[i]=val;
}
console.log(notes);

})();

*/
const APPNAME="JustABeep";

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

const MIDINOTES=(()=>{//«
//const noteToFreq=note=>{
//    let a = 440; //frequency of A (common value is 440Hz)
//    return (a / 32) * (2 ** ((note - 9) / 12));
//}
	let arr = [];
	for (let i=0; i < 128; i++) arr[i]=13.75*(2**((i-9)/12));
	return arr;
})();//»


const MIDINOTES2=(()=>{//«
//const noteToFreq=note=>{
//    let a = 440; //frequency of A (common value is 440Hz)
//    return (a / 32) * (2 ** ((note - 9) / 12));
//}
	let arr = [];
	for (let i=0; i < 128; i++) arr[i]=13.75*(2**((i-9)/16));
	return arr;
})();//»

const n = MIDINOTES;
const n2 = MIDINOTES2;

/*
const midicents=(()=>{//«
	let arr = [];
	for (let i=0; i < 12800; i++) arr[i]=(1375*(2**((i-900)/1200)))/100;
	return arr;
})();//»
*/

const NOTEMAP=(()=>{//«
	let notes=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
	let obj = {};
	let iter=0;
	OUTERLOOP: for (let j=-1; j <= 9; j++){
		for (let i=0; i < notes.length; i++){
			if (iter>127) break OUTERLOOP;
			let n = notes[i];
			let s = `${n}${j}`;
			let v = MIDINOTES[iter];
			obj[s] = v;
			if (n=="C#") obj[`Db${j}`]=v;
			else if (n=="D#") obj[`Eb${j}`]=v;
			else if (n=="F#") obj[`Gb${j}`]=v;
			else if (n=="G#") obj[`Ab${j}`]=v;
			else if (n=="A#") obj[`Bb${j}`]=v;
			else if (n=="E") obj[`Fb${j}`] = v;
			else if (n=="F") obj[`E#${j}`] = v;
			else if (n=="C") obj[`B#${j}`] = MIDINOTES[iter+12];
			else if (n=="B") obj[`Cb${j}`] = MIDINOTES[iter-12];
			iter++;
		}
	}
	return obj;
})();//»

//»

//Funcs«

const note_to_midi=(which)=>{//«
//note_to_midi("Db-1") -> 1
//note_to_midi("c#-1") -> 1
//note_to_midi("A4") -> 69
//note_to_midi("a4") -> 69
//note_to_midi("gb9") -> 126
//note_to_midi("F#9") -> 126
	let first = which[0].toUpperCase();
	let rest = which.slice(1);
	let freq = NOTEMAP[`${first}${rest}`];
	if (!freq) return;
	return MIDINOTES.indexOf(freq);
};//»

const vol=val=>{if(OUTGAIN.value===val)return;OUTGAIN.value=val;};
const togglevol=()=>{//«
	if(OUTGAIN.value===1)OUTGAIN.value=0;
	else OUTGAIN.value=1;
};//»
const GN = (val)=>{//«
	let g = ctx.createGain();
	if (Number.isFinite(val)) g.gain.value = val;
	return g;
};//»
//Osc«

const OSC = (type, freq)=>{//«
	let o = ctx.createOscillator();
	o.frequency.value = freq;
	o.type=type;
	o.start();
	return o;
};//»
const SIN = freq=>{return OSC("sine", freq)};
const TRI = (freq)=>{return OSC("triangle", freq);};
const SAW = (freq)=>{return OSC("sawtooth", freq);};
const SQR = (freq)=>{return OSC("square", freq);};

//»
//Bqf«
const BQF = (type, freq, opts={})=>{//«
/*Filter types«
lowpass	
Standard second-order resonant lowpass filter with 12dB/octave rolloff. Frequencies below the cutoff pass through; frequencies above it are attenuated.	
freq: The cutoff frequency.	
Q: Indicates how peaked the frequency is around the cutoff. The greater the value is, the greater is the peak.	
gain: Not used

highpass
Standard second-order resonant highpass filter with 12dB/octave rolloff. Frequencies below the cutoff are attenuated; frequencies above it pass through
freq: The cutoff frequency.
Q: Indicates how peaked the frequency is around the cutoff. The greater the value, the greater the peak.
gain: Not used

bandpass
Standard second-order bandpass filter. Frequencies outside the given range of frequencies are attenuated; the frequencies inside it pass through.
freq: The center of the range of frequencies.
Q: Controls the width of the frequency band. The greater the Q value, the larger the frequency band.
gain: Not used

lowshelf
Standard second-order lowshelf filer. Frequencies lower than the frequency get a boost, or an attenuation; frequencies over it are unchanged.
freq: The upper limit of the frequencies getting a boost or an attenuation.	
Q: Not used	
gain: The boost, in dB, to be applied; if negative, it will be an attenuation.

highshelf
Standard second-order highshelf filer. Frequencies higher than the frequency get a boost or an attenuation; frequencies lower than it are unchanged.
freq: The lower limit of the frequencies getting a boost or an attenuation.
Q: Not used
gain: The boost, in dB, to be applied; if negative, it will be an attenuation.

peaking
Frequencies inside the range get a boost or an attenuation; frequencies outside it are unchanged.
freq: The middle of the frequency range getting a boost or an attenuation.
Q: Controls the width of the frequency band. The greater the Q value, the larger the frequency band.
gain: The boost, in dB, to be applied; if negative, it will be an attenuation.

notch
Standard notch filter, also called a band-stop or band-rejection filter. It is the opposite of a bandpass filter: frequencies outside the give range of frequencies pass through; frequencies inside it are attenuated.
freq: The center of the range of frequencies.
Q: Controls the width of the frequency band. The greater the Q value, the larger the frequency band.
gain: Not used

allpass
Standard second-order allpass filter. It Lets all frequencies through, but changes the phase-relationship between the various frequencies.
freq: The frequency with the maximal group delay, that is, the frequency where the center of the phase transition occurs.
Q: Controls how sharp the transition is at the medium frequency. The larger this parameter is, the sharper and larger the transition will be.
gain: Not user
»*/
/*
gains are -40 -> 40
Qs are 0.0001 to 1000
*/
	let f = ctx.createBiquadFilter();
	f.frequency.value = freq;
	f.type = type;
	let q = opts.q;
	if (Number.isFinite(q)){
		if (q < 0.0001 || q > 1000){
			throw Error("BQF Q is out of range");
			f.Q.value = q;
		}
	}
	let g = opts.g;
	if (Number.isFinite(g)){
		if (g < -40 || g > 40){
			throw Error("BQF gain is out of range");
			f.gain.value = g;
		}
	}
	return f;
};//»
const LPF = (freq,q) => BQF("lowpass",freq,{q:q});
const HPF = (freq,q) => BQF("highpass",freq,{q:q});
const BPF = (freq,q) => BQF("bandpass",freq,{q:q});
const APF = (freq,q) => BQF("allpass",freq,{q:q});
const NF = (freq,q) => BQF("notch",freq,{q:q});
const LSF = (freq,g) => BQF("lowshelf",freq,{g:g});
const HSF = (freq,g) => BQF("highshelf",freq,{g:g});
const PKF = (freq,g, q) => BQF("peaking",freq,{g:g, q:q});
//»
const con=(node1,node2)=>{node1.connect(node2);};
const cons=(arr)=>{let to=arr.length-1;for(let i=0;i<to;i++)arr[i].connect(arr[i+1]);};
const conp=(arg1,arg2)=>{
//log(arg1, arg2);
//log (arg1 instanceof AudioNode)
let arr1;
if (arg1.connect) arr1 = [arg1];
else if (arg1.length) arr1 = arg1;
else throw "Bad arg1";

let arr2;
if (arg2.connect) arr2 = [arg2];
else if (arg2.length) arr2 = arg2;
else throw "Bad arg2";

for (let n1 of arr1){
	for (let n2 of arr2){
//log(n1,n2);
		n1.connect(n2);
	}
}

};

//»

const start=()=>{

	let o1 = SIN(NOTEMAP["C4"]);//261
	let o2 = SIN(NOTEMAP["E4"]);//329
	let o3 = SIN(NOTEMAP["G4"]);//392
	let o4 = SIN(NOTEMAP["B4"]);//493

//	let f1 = LPF(2000, 1);
	let g = GN(0.25);

	cons([g,LINEOUT]);
//	con(f1,g)
	conp([o1,o2,o3,o4],g);	


}

//OBJ/CB«

this.onappinit=()=>{
//start();
};

this.onkill = function() {//«
	PLUG.disconnect();
}//»

this.onkeydown = (e,s)=>{//«
	if (s==="SPACE_"){
		togglevol();
	}
}//»

this.onkeyup=(e,s)=>{//«
//	if (e.code=="Space"){
//		vol(0);
//	}
};//»
this.onkeypress=e=>{//«
};//»
this.onresize = function() {//«
}//»
this.onfocus=()=>{//«
}//»
this.onblur=()=>{//«
}//»

//»

//log(NOTEMAP);

//log(MIDINOTES[0]);
//log(MIDINOTES[1]);
//log(MIDINOTES[2]);
//log(MIDINOTES);
/*
log(MIDICENTS[0]);
log(MIDICENTS[1]);
log(MIDICENTS[2]);
log(MIDICENTS[3]);
log(MIDICENTS[4]);
log(MIDICENTS[5]);
log(MIDICENTS[6]);
log(MIDICENTS[7]);
log(MIDICENTS[8]);
log(MIDICENTS[9]);
log(MIDICENTS[10]);
*/
//for (let i=0; i <= 100; i++) log(MIDICENTS[i]);
//log(MIDINOTES[10]-MIDINOTES[9]);
//log(MIDICENTS[1200]-MIDICENTS[0]);
//log(MIDINOTES[127]);
//log(MIDICENTS[12700]-MI);
//log(MIDICENTS[12600]);
//log(MIDICENTS);
//log(MIDICENTS[100]);
//log(MIDICENTS[200]);
//log(MIDINOTES[0]);
//log(MIDINOTES[1]);
//log("...");
//log(MIDICENTS[0]);
//log(MIDICENTS[100]);

//for (let i=0; i <= 127; i++){
//log(Math.abs(parseFloat((MIDICENTS[i*100]-MIDINOTES[i]).toFixed(5))));
//}

//log(MIDINOTES[127]);
//log(MIDICENTS[12799]);

//log(MIDICENTS.length);

//log((n[7]-n[0])/(n[12]-n[0]));
//log(MIDINOTES2[89]);

log((n[0]/n[1]));
log((n[51]/n[52]));
log((n[21]/n[22]));
log((n[121]/n[122]));

//log(n2[89]);

}

