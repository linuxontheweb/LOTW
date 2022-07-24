const APPNAME="ToneYoan";
let Tone;

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

let outgain;
let node;

//»

//Funcs«

//let node;
const trigger=()=>{
	node.triggerAttackRelease("C3", 1.5);
};

const init=async()=>{//«

if (!await capi.loadMod("av.synth.Tone")) return cerr("Tone could not be loaded!");
Tone = NS.mods["av.synth.Tone"];

//let outnode = new Tone.Gain(1).toDestination();
//outgain = outnode.gain;
///*
/*
const plucky = new Tone.PluckSynth().toDestination();
//log(Tone.Destination.volume.value);
plucky.attackNoise = 0.9;
plucky.dampening = 1000;
plucky.release = 100;
plucky.resonance = 0.95;
node=plucky;
//plucky.triggerAttack("G1", "+0.05"); 
*/
//frequency, octaves, sensitivity(decibels)
const autoWah = new Tone.AutoWah(440, 2, -30).toDestination(); 
// initialize the synth and connect to autowah 
const synth = new Tone.Synth().connect(autoWah); 
// Q value influences the effect of the wah - default is 2 
autoWah.Q.value = 10; 
node = synth;
//node = autoWah;
// more audible on higher notes 
//synth.triggerAttackRelease("C4", "8n");

//const crusher = new Tone.BitCrusher(4).toDestination(); 
//const synth = new Tone.Synth().connect(crusher); 

//const cheby = new Tone.Chebyshev(30).toDestination(); // create a monosynth connected to our cheby 

//const input = new Tone.Oscillator(130, "sine").start(); 
//input.connect(cheby);

//const synth = new Tone.MonoSynth().connect(cheby); 

//const synth = new Tone.MonoSynth().toDestination(); 
//synth.triggerAttackRelease("C2", 0.4); 
//node = input;

//*/
//log(plucky.resonance);
/*
plucky.triggerAttack("C4", "+0.5");
plucky.triggerAttack("C3", "+1");
plucky.triggerAttack("C2", "+1.5");
plucky.triggerAttack("C1", "+2"); 
*/
//log(outgain);
//node = new Tone.AMOscillator(100, "sine", "square").toDestination().start();
///*
/*
let amOsc = new Tone.AMOscillator("D2").start();
node = amOsc;
amOsc.connect(outnode);
Tone.Transport.scheduleRepeat(time => {
	amOsc.harmonicity.setValueAtTime(1, time);
	amOsc.harmonicity.setValueAtTime(0.5, time + 0.5);
	amOsc.harmonicity.setValueAtTime(1.5, time + 1);
	amOsc.harmonicity.setValueAtTime(1, time + 2);
	amOsc.harmonicity.linearRampToValueAtTime(2, time + 4);
}, 4);
Tone.Transport.start();
*/

//const node = new Tone.AMSynth().toDestination(); 
//node.triggerAttackRelease("C4", "4n");

//const dist = new Tone.Distortion(0.25).toDestination();
//const fm = new Tone.FMSynth().connect(dist);
//fm.triggerAttackRelease("C5", "8n");

//const freeverb = new Tone.Freeverb().toDestination();
//freeverb.dampening = 1000; 
// routing synth through the reverb 
//const synth = new Tone.NoiseSynth().connect(freeverb); 
//synth.triggerAttackRelease(0.25);

//const input = new Tone.Oscillator(130, "triangle").start(); 
//const shift = new Tone.FrequencyShifter(10).toDestination();
//input.connect(shift);

//const oscillator = new Tone.Oscillator().toDestination().start(); 
//const freqEnv = new Tone.FrequencyEnvelope({ attack: 1, exponent: 0.1, baseFrequency: "C4", octaves: 1 }); 
//freqEnv.connect(oscillator.frequency); freqEnv.triggerAttack();


// initialize crusher and route a synth through it 


// create a new cheby 


//const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start(); 
//aconst synth = new Tone.PolySynth().connect(chorus); 
//synth.triggerAttackRelease(["C3", "E3", "G3"], "8n");

//const synth = new Tone.PolySynth().toDestination(); 
// set the attributes across all the voices using 'set' 
//synth.set({ detune: -1200 }); // play a chord 
//synth.triggerAttackRelease(["C4", "E4", "A4"], 1);

//const synth = new Tone.PolySynth(Tone.FMSynth).toDestination(); 
// trigger a chord immediately with a velocity of 0.2 
//synth.triggerAttack(["Ab3", "C4", "F5"], Tone.now(), 0.2);

//const poly = new Tone.PolySynth(Tone.AMSynth).toDestination(); 
// can pass in an array of durations as well 
//poly.triggerAttackRelease(["Eb3", "G4", "Bb4", "D5"], [4, 3, 2, 1]);

//const poly = new Tone.PolySynth(Tone.AMSynth).toDestination(); 
//poly.triggerAttack(["Ab3", "C4", "F5"]); 
// trigger the release of the given notes. 
//poly.triggerRelease(["Ab3", "C4"], "+1"); 
//poly.triggerRelease("F5", "+3");


//const synth = new Tone.PolySynth().toDestination();
//const chordEvent = new Tone.ToneEvent(((time, chord) => { 
// the chord as well as the exact time of the event 
// are passed in as arguments to the callback function
//synth.triggerAttackRelease(chord, 0.5, time); }), ["D4", "E4", "G#4"]); 
// start the chord at the beginning of the transport timeline 
//chordEvent.start(); // loop it every measure for 8 measures 
//chordEvent.loop = 8; 
//chordEvent.loopEnd = "1m";
//Tone.Transport.start(); 


//const feedbackDelay = new Tone.FeedbackDelay("8n", 0.9).toDestination(); 
//const tom = new Tone.MembraneSynth({ octaves: 2, pitchDecay: 0.25 }).connect(feedbackDelay); 

//octaves: 1 is the center point. Below makes the pitch go up. Above makes it go down.

//const tom = new Tone.MembraneSynth({ octaves: 1, pitchDecay: 0.25 }).toDestination();
//tom.triggerAttackRelease("C2", "1000n");



//log(tom);
//Tone.Transport.start();
//const phaser = new Tone.Phaser({ frequency: 15, octaves: 5, baseFrequency: 1000 }).toDestination(); 
//const synth = new Tone.FMSynth().connect(phaser); 
//synth.triggerAttackRelease("E3", "2n"); 

//const pitchShift = new Tone.PitchShift().toDestination(); 
//const osc = new Tone.Oscillator().connect(pitchShift).start().toDestination(); 
//pitchShift.pitch = -12; 
// down one octave pitchShift.pitch = 7; 
// up a fifth

//return Tone.Offline(() => { 
//const omniOsc = new Tone.OmniOscillator("C#2", "pwm").toDestination().start(); 
//omniOsc.modulationFrequency.value = 26.5;

//const omniOsc = new Tone.OmniOscillator(110, "fmsquare").start().toDestination();
//console.log(omniOsc.sourceType); 
//}, 0.1, 1);

//const pwm = new Tone.PWMOscillator(160, 0.1).toDestination().start();

//const scaleExp = new Tone.ScaleExp(0, 100, 2); 
//const signal = new Tone.Signal(0.5).connect(scaleExp);

//const synth = new Tone.Synth().toDestination(); 
//const seq = new Tone.Sequence(
//	(time, note) => { 
//		synth.triggerAttackRelease(note, 0.1, time); 
// subdivisions are given as subarrays 
//	}, ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]]
//).start(0); 
//Tone.Transport.start(); 

//const osc = new Tone.Oscillator().toDestination().start(); 
// a scheduleable signal which can be connected to control an AudioParam or another Signal 
//const signal = new Tone.Signal({ value: "C5", units: "frequency" }).connect(osc.frequency); // the scheduled ramp controls the connected signal signal.rampTo("C2", 4, "+0.5");

//const synth = new Tone.Synth().toDestination(); synth.triggerAttackRelease("C4", "8n");

//node = synth;

//setTimeout(()=>{node.stop()}, 2000);
//*/
//log(node);

}//»

//»

//OBJ/CB«

this.onappinit=()=>{
init();
};

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
if (s=="SPACE_"){
//if (outgain.value===0) outgain.value = 1;
//else outgain.value = 0;
trigger();
}

}//»

this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«
try{
node.stop();
}
catch(e){}
}//»
this.onresize = function() {//«
}//»
this.onfocus=()=>{//«
}//»

this.onblur=()=>{//«
}//»

//»

}

