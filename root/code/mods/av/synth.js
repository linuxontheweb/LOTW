/*JS Modules

They are either source, filter or source/filter. JS modules are not allowed to touch
context.destination!

Need a register_module function on the Synth object, which is like:

register_module(name, func), and does:
FuncMap[name]=func.

They must return a Node object, possibly as a Promise.

We need a way to set the create_error in the main Synth object. We can just
always do this.create_error.

*/
/*Module Nodes:«

Contents of /some/module.txt:

----------------------------------------------------

Gain g;
IN > g > OUT;

----------------------------------------------------

This is a "filter" module because it is a pipe between LINEIN and LINEOUT.
A "source only" module would just use LINEOUT.
A "destination only" module would just use LINEIN.



Using the module in /some/file.synth:

----------------------------------------------------

Osc o;
Module mod("/some/module.txt");
Spk s;

o > mod > s;

----------------------------------------------------
»*/
/*Issues«

Continuously changing Clock BPS via hardware controllers introduces hiccups into 
the pattern. Not sure how much it relates to the work being put into spitting 
out and responding to midi or kb events.

A NoteSequencer is plays a series of single notes at a time, but each of the times can
call different notes.  So then we can figure out how to create composite ChordSequencer notes.

»*/
/*Syntax«

There are currently no internal variable declarations other than for nodes.
We can reference external variables imported into the app environment like:
osc.t = $shape //"sine"
Want to parse this language:

Osc o1,o2,o3;
Gain g1,g2,g3;

Spk s;

o1.f(req)? = NUM;
o1.t(ype)? = sin|tri|saw|sq;

g1.g(ain)? = NUM

o1>g1>s;

//Below are synchronized jobbers that can get unsynched and resynched by pauseresetting on their 
//controlling clocks, while playing with a knob that detunes both in sync.
//«

const MYTESTSTRING=`
Osc o1,o2;
o1.f=50
o2.f=500
(o1,o2).t="square";
Spk s;
o1>s;
o2>s;


`;
//»
//«
const MYTESTSTRING=`
Osc o1()
o1.t = "square" ;
o1.freq  =  "D3" ;
ADSR e1(.05,.05,.1,.1);

Osc o2()
o2.t="square";
o2.freq = "C3";
ADSR e2(.01,.02,.05,.02);

Note n(o1,e1);
Note m(o2,e2);

Clock clk1(4);
Clock clk2(4);
//NoteSequencer seqn('["nnnn"]',true);
//NoteSequencer seqm('["mmmm"]',true);
NoteSequencer seqn('["nnnn","n--n","-nn-","n-n-","----"]',true);
NoteSequencer seqm('["mmmm","m--m","-mm-","m-m-","----"]',true);
//NoteSequencer seqm('["mmmm","m--m","-mm-","--m-"]',true);

clk2 > seqn;
clk1 > seqm;

//KbKey k("a_");
KbKey up("UP_");
KbKey dn("DOWN_");

MidiKnob knb1(1,-1000,1000);
knb1.quant=3;
MidiKnob knb2(2,-2,2);

knb1 > n.det;
knb1 > m.det;

//knb2 > clk1.offset;
up > clk1.testinc;
dn > clk1.testdec;

MidiKeyDown mkd1(48);
mkd1 > clk1.pausereset;
MidiKeyUp mku1(48);
mku1 > clk1.unpause;

//MidiKeyDown mkd2(50);
//mkd2 > clk2.pausereset;
//MidiKeyUp mku2(50);
//mku2 > clk2.unpause;

Gain g; 
m>g;
n>g

Spk s;
g > s;


//n > s;

//Buf b("/home/markee/Desktop/done.ogg");
//Osc mod; 
//mod.t="square"
//mod.f=8;
//mod > g.g;

//o > g > s  
//k > e > g.g;

//g.g=0;

//knb1 > o.det;

//g.g=0;
//mod>g.g
//trg > e > g.g

`

//»

»*/

//«Decs
const {NS,globals}=Core;
const log=(...args)=>console.log(...args);
const wrn=(...args)=>console.warn(...args);
const cwarn=wrn;
const err=(...args)=>console.error(...args);
const cerr=err;
const {util,dev_mode,dev_env}=globals;
const {mixer, ctx}=globals.audio;
const {fs}=NS.api;
const NUM = Number.isFinite;
const INT=n=>{return((NUM(n)&&(n+"").match(/^-?[0-9]+$/)));};
const POSINT=n=>{return((NUM(n)&&n>0&&(n+"").match(/^[0-9]+$/)));};
const POS=n=>{return((NUM(n)&&n>0));};
const POSMAX=(n,max)=>{return((NUM(n)&&n>0&&NUM(max)&&max>0&&n<=max));};
const NONNEG=n=>{return((NUM(n)&&n>=0));};
const NONNEGINT=n=>{return((NUM(n)&&n>=0&&(n+"").match(/^[0-9]+$/)));};
const EOF = {EOF: true};

//»

//Var«

let MAX_MODULE_DEPTH = 10;

let NOISE_BUF_SECS = 2;
let noise_buf_sz = ctx.sampleRate*NOISE_BUF_SECS;
let white_noise_buf=null;
let pink_noise_buf=null;
let brown_noise_buf=null;

//»


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


const Synth = function() {

const exports = {name: "synth"};
this.exports = exports;

/*
const ENV = {//«
	shape:"sine",
	freq:"1000"
};//»
*/

const ENV={};

//Decs«

const servobj = this;
let speaker;
let mixer_plug;
const linein = ctx.createGain();
const lineout = ctx.createGain();

const MODULES = [];
const SKIP_MAKE_NODE=[];
const INIT_ARR = [];
this.TRIGGERS={};
const KNOBS={};
const MIDIKEYDOWNS={};
const MIDIKEYUPS={};
const NODES={};
this.NODES = NODES;
NODES.IN = linein;
NODES.OUT = lineout;
this.linein = linein;
this.lineout = lineout;
const KNOBVALS=(globals.AppVars["Synth-KNOBVALS"]||[]);
let create_error = null;
let VOL_INC = 0.05;
let killed = false;
let paused = false;
let lines;

this.errout = cerr;
this.make_br=()=>{};

const get_or_set = (arg, param)=>{//«
	if (!arg) return;
	if (arg.EOF===true) return;

	if (arg instanceof Function){
		arg(param.value+"");
		arg(EOF);
		return;
	}

	let val = parseFloat(arg);
	if (!isFinite(val)) return;
	if (val < param.minValue || val > param.maxValue) return;
	param.value = val;
};//»

const get_or_set_default = (arg, node)=>{//«
	if (!arg) return;
	if (arg.EOF===true) return;

	if (arg instanceof Function){
		arg(`Get value of: ${node._name}`);
		arg(EOF);
		return;
	}
cwarn(`${node._name} = ${arg}`);
};//»

this.make_node=(node)=>{//«

//This is the default "maker" function that is called via the command line synth library
//GUI apps must override this in order to interact with (update, etc) the nodes.

let typ = node._type.toLowerCase();
let nm = node._name;
let k = `${typ}/${nm}`;
if (typ=='osc'){
	exports[`${k}/freq`]=arg1=>{get_or_set(arg1, node.frequency);}
	exports[`${k}/detu`]=arg1=>{get_or_set(arg1, node.detune);}
}
else if (typ=='gain'){
	exports[`${k}`]=arg1=>{get_or_set(arg1, node.gain);}
}
else if (typ=="clip"){
	exports[`${k}/play`]=arg=>{
		if (!arg||arg.EOF===true) return;
		if (arg instanceof Function){
cwarn("Reading: play!?!");
			arg(EOF);
			return;
		}
		node.play();
	}
	exports[`${k}/stop`]=arg=>{
		if (!arg||arg.EOF===true) return;
		if (arg instanceof Function){
cwarn("Reading: stop!?!");
			arg(EOF);
			return;
		}
		node.stop();
	}
}
else {
	exports[`${k}`]=arg1=>{
		get_or_set_default(arg1, node);
	};
}

};//»

//»

//«Util

const note_to_freq=(note)=>{//«

let noteToScaleIndex = {//«
	'cb': -1,
	'c': 0,
	'c#': 1,
	'db': 1,
	'd': 2,
	'd#': 3,
	'eb': 3,
	'e': 4,
	'e#': 5,
	'fb': 4,
	'f': 5,
	'f#': 6,
	'gb': 6,
	'g': 7,
	'g#': 8,
	'ab': 8,
	'a': 9,
	'a#': 10,
	'bb': 10,
	'b': 11,
	'b#': 12
};//»
	let marr = note.match(/^([a-g]{1}(?:b|#)?)(-?[0-9]+)/i);
	if (!(marr && marr[1] && marr[2])) return null;
	let ind = noteToScaleIndex[marr[1].toLowerCase()];
	let noteNumber = ind + (parseInt(marr[2]) + 1) * 12;
	return (440 * Math.pow(2, (noteNumber - 69)/12));
}
//»

//»

//Constructors«

const Clock = function(_bps){//«
this.connect=(to)=>{
	let ctr=to.constructor.name;
	if (ctr!="NoteSequencer") throw new Error("Bad connectee: "+ctr);
	conns.push(to);
}
let cur_bps = _bps;

/*«
let offobj={};
this.offset=offobj;

Object.defineProperty(offobj,"value",{
//	get:()=>{
//		return offset;
//	},
	set:val=>{
cur_bps=bps+val;
nbeats=0;
pause_tot=0;
start = null;
	}
});
»*/
const mod_bps = d =>{
	cur_bps+=d;
	if (cur_bps<0)cur_bps=0.001;
	start = ctx.currentTime;
	pause_tot=0;
	nbeats=0;
};

let conns = [];
let start;
let nbeats=0;
let paused = false;
let pause_tot = 0;
let pause_time;
let rafId;
const beat=()=>{
	for (let con of conns) con.beat();
};
const ticker=()=>{
	if (killed||paused) return;
	let now = ctx.currentTime;

	if (!start) {
		start = now;
		beat();
		rafId = requestAnimationFrame(ticker);
		return;
	}

	let dt = now-start-pause_tot;
	let tick_num = Math.floor(cur_bps*dt);
	if (tick_num > nbeats) {
		beat();
		nbeats++;
	}
	
	rafId = requestAnimationFrame(ticker);
};
this.testinc=()=>{
	mod_bps(1);
};
this.testdec=()=>{
	mod_bps(-1);
};
this.pauseonly = ()=>{
	pause_time = ctx.currentTime;
	paused = true;
};
this.pausereset = ()=>{
	cur_bps = _bps;
	pause_time=null;
	paused = true;
	nbeats = 0;
	pause_tot=0;
	start = null;
	for (let con of conns) con.reset();
};
this.unpause=()=>{
	if (pause_time) pause_tot+=ctx.currentTime-pause_time;
	paused = false;
	requestAnimationFrame(ticker);
};
this.reset = ()=>{
	cur_bps = _bps;
	nbeats = 0;
	pause_tot=0;
	start = null;
	for (let con of conns) con.reset();
};

this.start = ticker;
//ticker();
};//»

const NoteSequencer = function(measures, if_repeat){//«

const err=s=>{throw new Error(s);}


if (measures.constructor.name!=="Array") err("Need an array arg");
if (!measures.length) err("Empty array");

let done = false;
let len = measures[0].length;
let nbeat=0;
let nmeas=0;

for (let ln of measures){
	if (ln.length!=len) err("Invalid array");
}
this.reset=()=>{
	nbeat=nmeas=0;
};

this.beat=()=>{
	if (done) return;
	let meas = measures[nmeas];
	if (!meas){
		if (if_repeat){
			nbeat=nmeas=0;
			meas = measures[nmeas];
		}
		else {
			done=true;
			return;
		}
	}
	let nstr = meas[nbeat%len];
	if (nstr !="-"){
		let node = NODES[nstr];
		if (!(node&&node.trigger)) wrn("Dropping note: "+nstr);
		else node.trigger();
	}
	nbeat++;
	if (Math.floor(nbeat/len) > nmeas) nmeas++;
};

};//»

const ADSR=function(a,d,s,r){//«
	const now = (dt)=>{
		if (!dt) dt=0;
		return ctx.currentTime+dt;
	};
	let conns = [];
	this.connect=(to)=>{
		to.value=0;
		conns.push(to);
	}
	this.trigger=()=>{
		for (let con of conns) {
			con.linearRampToValueAtTime(1, now(a));
			con.linearRampToValueAtTime(0.5, now(a+d));
			con.setTargetAtTime(0,now(a+d+s),r);
		}
	}
};//»

const Tone=function(inargs){//«

	let gn = ctx.createGain();
	const args = [];
	for (let arg of inargs){
		let o = arg[0];
		let g = ctx.createGain();
		g.gain.value = arg[1];
		o.connect(g);
		g.connect(gn);
		args.push([o._name, g.gain]);
	}
	this.connect=(to)=>{
		gn.connect(to);
	}
	this.getargs = ()=>{
		return args;
	};

};//»

const Note=function(src,env){//«
	let gn = ctx.createGain();
	env.connect(gn.gain);
	src.connect(gn);
	this.connect=(to)=>{
		gn.connect(to);
	}
	this.trigger=env.trigger;
	if (src instanceof OscillatorNode){
		this.frequency = src.frequency;
		this.detune = src.detune;
	}
};//»

const KbKey=function(which){//«
	this.connect=to=>{
		let fn = to.trigger || to;
		if (!(fn instanceof Function)) throw new Error("KbKey found no callable function!");
		servobj.TRIGGERS[which]=fn;
	};
}//»
const MidiKnob=function(which,min,max){//«
	let span = max-min;
	let conns = [];
	const getval=(v)=>{
		let raw=min+(span*(v/128))
		if (this.quant == 128) return raw;
		return min+(span*Math.floor(v/(128/this.quant))/this.quant);
	};
	this.connect = to =>{
		if (!to instanceof AudioParam) throw new Error("Only connecting knobs to AudioParam");
		let v = KNOBVALS[which];
		if (NONNEGINT(v)) to.setValueAtTime(getval(v),ctx.currentTime);
		conns.push(to);
	};
	this.quant=128;
	KNOBS[which+""] = val =>{
		let v = getval(val);
		for (let con of conns) con.setValueAtTime(v,ctx.currentTime);
	};
};//»
const MidiKeyDown = function(which){//«
	let conns = [];
	this.connect=to=>{
		conns.push(to);
	}
	MIDIKEYDOWNS[which+""]=(val)=>{
		for (let f of conns) f();
	};
};//»
const MidiKeyUp = function(which){//«
	let conns = [];
	this.connect=to=>{
		conns.push(to);
	}
	MIDIKEYUPS[which+""]=(val)=>{
		for (let f of conns) f();
	};

};//»


const Module = function(obj){

	this.connect=(to)=>{
		obj.lineout.connect(to);
	}

	this.linein = obj.linein;

	this.service_obj = obj;

};

const Symbol = function(node){
	this.ref = node;
};

const Clip=function(){//«

	let node;
	let to_nodes=[];
	this.connect=to=>{
		to_nodes.push(to);
	}

	this.play=()=>{
		if (this.decode_error){
			return console.error("The Clip cannot play because of this error", e);
		}
		else if (!this.buffer){
			return console.warn("The Clip's audio buffer is decoding");
		}

		if (node) node.disconnect();
		node = ctx.createBufferSource();
		node.buffer = this.buffer;
		node.loop=false;
		for (let n of to_nodes) node.connect(n);
		node.start();
	};
	this.stop=()=>{
		if (!node) return;
		node.stop();
	};

};//»

//»

const FuncMap={//«

	NoteSequencer:(...args)=>{//«
		const err=s=>{create_error="NoteSequencer:"+s;};
		let nargs = args.length;
		if (nargs<1||nargs>2) return err("Bad number of args");
		return new NoteSequencer(...args);
	},//»
	Clock:(...args)=>{//«
		const err=s=>{create_error="Clock:"+s;};
		if (args.length!=1) return err("Bad number of args");
		let bps = args[0];
		if (!POS(bps)) return err("Bad bps");
		return new Clock(bps);
	},//»
	MidiKeyDown:(...args)=>{//«
		const err=s=>{create_error="MidiKeyDown:"+s;};
		return new MidiKeyDown(...args);

	},//»
	MidiKeyUp:(...args)=>{//«
		return new MidiKeyUp(...args);
	},//»
	MidiKnob:(...args)=>{//«
		const err=s=>{create_error="MidiKnob:"+s;};
		let which = args[0];
		let min=0, max=127;
		if (!(POSINT)) return err("Invalid number: "+which);
		if (args.length==3){
			min = args[1];
			max = args[2];
			if (!(NUM(min)&&NUM(max)&&max>min)) return err("Invalid range");
		}
		else if (args.length!=1) return err("Invalid number of arguments");

		return new MidiKnob(which,min,max);
	},//»
	Note:(...args)=>{//«
		const err=s=>{create_error="Note: "+s;};
		const ok_sources=["OscillatorNode","AudioBufferSourceNode","Tone"];
		const ok_envs = ["ADSR"];
		if (args.length!=2) return err("Wrong number of args");
		let src = args[0];
		let env = args[1];
		if (!ok_sources.includes(src.constructor.name)) return err("Bad first arg (source node)");
		if (!ok_envs.includes(env.constructor.name)) return err("Bad second arg (envelope node)");
		return new Note(...args);
	},//»
	KbKey:(...args)=>{//«
		return new KbKey(...args);
	},//»
	ADSR:(...args)=>{//«
		const err=s=>{create_error="ADSR:"+s;};
		if (!(args.length == 4 || args.length==6)) return err("Wrong number of args");
		if (!(POS(args[0])&&POS(args[1])&&POS(args[2])&&POS(args[3]))) return err("Invalid values for a,d,s,r");
		if (args.length==6){
			if (!(POSMAX(args[4],1)&&POSMAX(args[5],1))) return err("Invalid values for a and d levels");
		}
		return new ADSR(...args);
	},//»

	Osc:(...args)=>{//«
		if (args.length) return;
		return ctx.createOscillator();
	},//»
	BQF:(...args)=>{//«
		if (args.length) return;
		return ctx.createBiquadFilter();
	},//»
	Noise:(...args)=>{//«
		const err=s=>{create_error="Noise:\x20"+s;};
		if (args>1) return err("Expected 0 or 1 args");
		let t = (args[0]||"white").toLowerCase();
		let buf = make_noise(t);
		if (!buf) return err(`Invalid noise type: ${args[0]}`);
		let node = ctx.createBufferSource();
		node._noisetype = t;
		node.buffer = buf;
		node.loop=true;
		return node;
	},//»
	Gain:(...args)=>{//«
		if (args.length) return;
		return ctx.createGain();
	},//»

	Tone:(...args)=>{//«
//		if (args.length % 2) return err("Need an even # of args");
		return new Tone(args);
	},//»

	Module:(...args)=>{//«
		return new Promise(async(y,n)=>{
			const err=s=>{
				create_error="Module:\x20"+s;
				y();
			};
			let npar = 0;
			let obj = servobj;
			while (obj){
				if (!obj._parent) break;
				npar++;
				obj = obj._parent;
			}
			if (npar >= MAX_MODULE_DEPTH){
				let s = `Exceeded MAX_MODULE_DEPTH (${MAX_MODULE_DEPTH})`;
console.error(s);
				return err(s);
			}
			if (args.length>2) {
				err("Too many args");
				return y();
			}
			let path = args[0];
			if (!path.match(/^\//)) return err("Not a fullpath: "+path);
			
			let arr = await fs.readFile(path);
			if (!arr) return err("File not found: "+path);
			let serv;
			try{
				serv = await globals.fs.start_service('synth', args[1]);
			}
			catch(e){
				return err(e);
			}
			serv._parent = servobj;
			serv._top = servobj._top;
			serv.is_app = true;
			serv.errout = servobj.errout;
			serv.module_path = path;
			serv.make_node = (node, servarg)=>{
				servobj.make_node(node, servarg||serv);
			};
			serv.make_br = (servarg)=>{
				servobj.make_br(servarg||serv);
			};
			MODULES.push(serv);
			let rv = await serv.parse(arr.join("\n"));
			if (!rv) return err("Could not parse the file");
			y(new Module(serv));
		});
	},//»

/*
	Clip: async (...args)=>{//«
		const err=s=>{
			create_error="Clip:\x20"+s;
//			y();
		};

		if (args.length!=1) {
			return err("Need a filename!");
		}
		let path = args[0];
		if (!path.match(/^\//)) return err("Not a fullpath: "+path);
		
		let blob = await fs.readFile(path);
		if (!blob) return err("File not found: "+path);
		if (!(blob instanceof Blob)) return err(`Expected a Blob!`);
		let buf = await Core.api.toBuf(blob);

ctx.decodeAudioData();
		
		let node = ctx.createBufferSource();
//		node._noisetype = t;
//		node.buffer = buf;
//		node.loop=true;
log(node);
		return node;

	},//»
*/
///*
	Sym:(...args)=>{//«
		if (args.length!=1) return;
		return new Symbol(args[0]);
	},//»
//*/
	Clip:async (...args)=>{//«
		const err=s=>{
			create_error="Clip:\x20"+s;
		};
		if (args.length!=1) return err("Need a filename!");
		let path = args[0];
		if (!path.match(/^\//)){
			return err("Not a fullpath: "+path);
		}
		let bytes = await fs.readHtml5File(path,{BLOB:true});
		if (!bytes) return err("File not found: "+path);
		let node = new Clip();
//		node.decoding = true;
		ctx.decodeAudioData(bytes.buffer, buf=>{
//			node.decoding = false;
			node.buffer = buf;
		},
		e=>{
console.error(e);
			node.decode_error = e;
		});
//		let node = ctx.createBufferSource();
//		node.buffer = buf;
//		node.loop=true;
//		return node;
//		return new Clip(node);
		return node;
	},//»

	Spk:()=>{
		if (!speaker){
			speaker = ctx.createGain();
			servobj.speaker = speaker;
			mixer_plug = mixer.plug_in(speaker);
		}
		return speaker;
	}

};//»

const parse = str =>{//«

return new Promise(async (Y,N)=>{

	const staterr=(s,lno)=>{//«
		if (NUM(lno)) {
			if (servobj.module_path) {
				let fname = servobj.module_path.split("/").pop();
				s += `\x20(${fname}:${lno+1})`;
			}
			else s += `\x20(line\x20${lno+1})`;
		}
		else{
cerr(`staterr called without 'lno' (${s})`);
		}
		if (!servobj._top._did_error) {
//log(servobj);
			this.errout(s);
			servobj._top._did_error = true;
		}
		Y(false);
	};//»

	let in_paren=false;
	let multi_comment = null;
	let quote = null;
	const STRINGS=[];
	const PARENS=[];
	const jlog=o=>{log(JSON.stringify(o,null,"  "));}
	const getstr = (s)=>{
		let marr;
		if (marr=s.match(/\/\/([0-9]+)/)) return STRINGS[parseInt(marr[1])];
		return s;
	};
	const node_from_str = (s,lno) =>{
		let arr = s.split(".");
		let n = arr.pop();
		let mod = servobj;
		let str = '';
		while (arr.length){
			let m = arr.shift();
			str += `.${m}`;
			let node = mod.NODES[m];
			if (node && node._type=="Module") mod = node.service_obj;
			else return staterr(`Not a module: ${str}`,lno);
		}
		let got = mod.NODES[n];
		if (got) {
			if (got._type=="Sym") return got.ref;
			return got;
		}
		staterr(`Invalid value:\x20'${s}'`,lno);

	};
	const getval=(s, lno, if_num, if_arg, typ)=>{//«
		const err=s=>{
			throw new Error(s);
		};
		let marr;
		s=s.trim();
		if (marr=s.match(/\/\/([0-9]+)/)) {
			let val = STRINGS[parseInt(marr[1])];
			if (if_num) {
				if (val.match(/^[a-gA-G]/)) return note_to_freq(val);
				return JSON.parse(val);
			}
			if (if_arg){
				try{
					return JSON.parse(val);
				}
				catch(e){
					return val;
				}
			}
			return val;
		}
		if (s.match(/^\.[0-9]+$/)) s = "0"+s;
		if (!(s==="true"||s===false||s.match(/^-?[0-9]+$/)||s.match(/^-?[0-9]*\.[0-9]+$/))) {
			let marr;
			if (marr=s.match(/^\$(.+)$/)){
				let gotit = ENV[marr[1]];
				if (gotit.match(/^\./)) gotit = "0"+gotit;
				if (if_num) return JSON.parse(gotit);
				if (gotit) return gotit;
			}
			if (s.match(/=/)){

//For stuff like this:
//Tone t(a = 0.1, b = 0.2, c = 0.3, d = 0.1);

				marr = s.split(/ *= */);
				if (marr.length==2){
					return [node_from_str(marr[0]), getval(marr[1], lno)];
				}
			}
			if (typ=="Sym"){
				let node = node_from_str(s, lno);
				if (!node) return err(`Invalid symbol: ${s}`);
				let arr = s.split(".");
				arr.pop();
				node._modname = arr.join(".");
				return node;
			}
			return node_from_str(s, lno);
		}
		return JSON.parse(s);
	};//»
	const str_to_prop=(str, lno, if_node_ok)=>{//«

		let arr = str.split(".");
		let propstr = arr.pop();
		let nodestr = arr.join(".");
		let node = node_from_str(nodestr, lno);
		if (!node) {
			return staterr(`Not a node: '${nodestr}'`,lno);
		}

		if (node._type=="Module"&&if_node_ok){
			let kid = node.service_obj.NODES[propstr];
			if (!kid) return staterr(`Node '${propstr}' not found in ${nodestr}`);
			return kid;
		}
		if (!(propstr&&propstr.match(/^[a-zA-Z]+$/))) return staterr(`Invalid property: '${propstr}'`,lno);
		let re = new RegExp("^"+propstr);
		let prop;
		for (let k in node){
			if (re.exec(k)){
				propstr = k;
				prop = node[k];
				break;
			}
		}
		if (!prop) return staterr(`Not a valid property name: '${propstr}'`, lno);
		return [node, prop, propstr];
	};//»
	const str_to_param_or_node=(str,lno)=>{//«
		if (str.match(/\./)) return str_to_prop(str, lno, true);
		let node = NODES[str];
		if (!node) return staterr(`Not a node: '${str}'`,lno);
		return node;
	};//»
	const parse_statement=(ln,lno)=>{//«
		return new Promise(async(y,n)=>{
			let arr = ln.split(" ");
			const _typ = arr[0];
			if (_typ==='br'&&!arr[1]){
				INIT_ARR.push(this.make_br);
				return y(true);
			}
			let func = FuncMap[_typ]
			if (func){//«
				arr.shift();
				let decs = arr.join(" ").split(",");
				for (let n of decs){
					n=n.regstr();
					let marr;
					if (!(marr=n.match(/^([_a-zA-Z][_a-zA-Z0-9]*)(\/\*([0-9]+))?$/))){
						return staterr(`Invalid symbol:\x20'${n}'`,lno);
					}
					n=marr[1];
					let argn=parseInt(marr[3]);
					let args=[];
					if (NUM(argn)) {
						let arr = PARENS[argn].join("").split(",");
						if (!(arr.length==1&&arr[0].match(/^ *$/))) {
							for (let arg of arr){
								try {
									args.push(getval(arg, lno, false,true,_typ));
								}
								catch(e){
									staterr("Reference error #1: "+e, lno);
									return;
								}
							}
						}
					}
					if (NODES[n]){
						staterr("The node exists: "+n,lno);
						return;
					}

					create_error=null;
					let gotnode = await func(...args);
					if (!servobj._top._create_error) servobj._top._create_error = create_error;
					if (!gotnode) {
						let err = servobj._top._create_error||"???";
						return staterr(`${err}`,lno);
					}
					NODES[n] = gotnode;
					gotnode._type = _typ;
					gotnode._name = n;

					if (_typ=="Sym"){
						gotnode._modname = gotnode.ref._modname;
						delete gotnode.ref._modname;
						gotnode.ref._modname=undefined;
					}

					INIT_ARR.push(()=>{
						if (gotnode.start) gotnode.start();
						this.make_node(gotnode);
					});
				}
				return y(true);
			}//»


			if (ln.match(/=/)){//«
				let arr = ln.split("=");
				if (!(arr&&arr[0]&&arr[1])) return staterr("Syntax error",lno);
				let val = arr.pop();

				for (let nodeprop of arr) {
					let proppart;
					let nodeparts=[];
					let marr;

					if (marr = nodeprop.match(/^\/\*([0-9]+)\.(.+)$/)){
						nodeparts = [...(PARENS[marr[1]].join("").split(","))];
						proppart = marr[2];
					}
					else{
						let arr = nodeprop.split(".");
						if (arr.length < 2) return staterr(`Invalid assignment to '${nodeprop}'`,lno);

						proppart = arr.pop();
						nodeparts = [arr.join(".")];
					}
					for (let nodepart of nodeparts) {
						let node_and_prop = nodepart+"."+proppart;
						let rv = str_to_prop(node_and_prop.regstr(),lno);
						if (!rv) return;
						let node = rv[0];
						let prop = rv[1];
						let propstr = rv[2];
						if (prop instanceof AudioParam){
							let num;
							if (!val) return staterr(`No value given`,lno);
							try {
								num = getval(val, lno, true);
							}
							catch(e){
								return staterr("Reference error #2: "+val,lno);
							}
							if (!NUM(num)) return staterr(`Illegal value: '${getstr(val)}'`,lno);
							if (num < prop.minValue || num > prop.maxValue) return staterr(`Value out of bounds: '${num}'`,lno);
							prop.value = num;
						}
						else if (typeof prop === "string") {
							try {
								node[propstr]=getval(val, lno);
							}
							catch(e){
								return staterr("Reference error #3: "+e,lno);
							}
						}
						else if (NUM(prop)) {
							try {
								node[propstr]=getval(val,lno,true);
							}
							catch(e){
								return staterr("Reference error #4: "+e,lno);
							}
						}
						else{
							return staterr("Unknown property",lno);
						}
					}
				}
				return y(true);
			}//»

			if (ln.match(/>/)){//«
				let syms = ln.split(">");
				let last=null;
				for (let sym of syms){
					let prop_or_node = str_to_param_or_node(sym.regstr(),lno);
					if (!prop_or_node) {
						y();
						return;
					}
					if (last){
						try{
//							if (prop_or_node.length==3) last.connect(prop_or_node[1])
//							else last.connect(prop_or_node);
							if (prop_or_node.length==3) last.connect(prop_or_node[1].linein||prop_or_node[1])
							else last.connect(prop_or_node.linein||prop_or_node);
						}
						catch(e){
wrn(last, prop_or_node);
log(e);
							staterr("Connect error:",lno);
							return y();
						}
					}
					last = prop_or_node;
				}
				return y(true);
			}//»

			staterr(`Syntax error`,lno);
			y();
		});
	}//»

	const strip_comments=arr=>{//«
		let lns=[];
		for (let j = 0; j < arr.length; j++) {
			let ln = arr[j];
			let lnout = [];
			for (let i=0; i < ln.length; i++){
				let c1=ln[i];
				let c2=ln[i+1];
				if (multi_comment===null) {
					if (c1=="/"&&c2=="*"){
						multi_comment=j;
						i++;
					}
					else if (c1=="/"&&c2=="/") break;
					else lnout.push(c1);
				}
				else if (c1=="*"&&c2=="/"){
					multi_comment=null;
					i++;
				}
			}
			lns.push(lnout);
		}
		return lns;
	};//»
	const collect_strings=arr=>{//«
		let lns = [];
		for (let j = 0; j < arr.length; j++) {
			let ln=arr[j];
			let out=[];
			let cur_quote;
			for (let i=0; i < ln.length; i++) {
				let c1=ln[i];
				if (!quote){
					if (c1=='"'||c1=="'") {
						quote=c1;
						cur_quote="";
					}
					else out.push(c1);
				}
				else if (c1==quote) {
					if (!(i>0 && ln[i-1]=="\\")) {
						out.push(`//${STRINGS.length}`);
						STRINGS.push(cur_quote);
						quote=null;
					}
				}
				else cur_quote+=c1;
				if (quote && i+1==ln.length) return staterr("Unterminated quote",j);
			}
			lns.push(out);
		}
		return lns;
	};//»
	const collect_parens=arr=>{//«
		let lns=[];
		let cur_paren;
		for (let j = 0; j < arr.length; j++) {
			let ln = arr[j];
			let lnout = [];
			let cur_str="";
			for (let i=0; i < ln.length; i++){
				let c1=ln[i];
				let c2=ln[i+1];
				if (!NUM(in_paren)){ 
					if (c1=="("){
						in_paren=j;
						cur_paren=[];
					}
					else lnout.push(c1);
				}
				else if (c1==")"){
					in_paren=false;
					lnout.push(`/*${PARENS.length}`);
					PARENS.push(cur_paren);
				}
				else cur_paren.push(c1);
			}
			lns.push(lnout);
		}
		return lns;
	}//»
	const execute=(all)=>{//«
		return new Promise(async(y,n)=>{
			for (let i=0; i < all.length; i++){
				let ln = all[i];
				let arr = ln.split(";");
				for (let statement of arr){
					let state = statement.regstr();
					if (!state) continue;
					if (!await parse_statement(state,i)) return y();
				}
			}
			y(true);
		});
	};//»

	lines = str.split("\n");

	let arr = lines;
	let out=[];
	let num=0;
	let all;
	all = collect_strings(arr);
	if (!all) return;
	all = strip_comments(all);
	all = collect_parens(all);
	if (NUM(multi_comment)) return staterr("Unterminated multiline comment", multi_comment);
	if (NUM(in_paren)) return staterr("Unterminated parenthesis", in_paren);
	for (let ln of all) out.push(ln.join(""));

	if (!await execute(out)) return;
	for (let f of INIT_ARR){
		f();
	}
	Y(true);
});


};//»

//Obj«

this.parse = parse;

this.onkill=()=>{
	for (let mod of MODULES){
		globals.fs.stop_service(mod.id);
	}
	killed = true;
	if (mixer_plug) mixer_plug.disconnect();
};

//»

}

this.get_synth = function(){
	return new Synth();
}


