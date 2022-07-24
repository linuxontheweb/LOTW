const APPNAME="Plot";
const USENUM = 100;
let PTDIM=3;
let AXIS_COL="#666";
let PTCOL="#fff";
let USEMULT = -1;
//let USEMULT = 0;
//let USECLIP = false;
let USECLIP = true;
let f1=250, f2=300, f3=350;

export const app = function(arg) {

//Imports«

const {Core, Main, NS}=arg;
const{cwarn,cerr,api:capi, globals, Desk}=Core;
if (!globals.audio) Core.api.mkAudio();
const {mixer, ctx}=globals.audio;

Main.top.title=APPNAME;
//Main.padb=10;
//Main.padt=10;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;
Main.bgcol="#000000";


//»

const log=(...args)=>{//«
let arr=[];
for (let arg of args){
	if (Number.isFinite(arg)){
		arr.push(parseFloat(arg.toFixed(3)));
	}
	else arr.push(arg);
}
console.log(...arr);
};//»

//DOM«

let Graph = mkdv();
Main.add(Graph);
Graph.pos="relative";

let X_AXIS = mkdv();
X_AXIS.pos="absolute";
X_AXIS.h=1;
X_AXIS.bgcol=AXIS_COL;

let Y_AXIS = mkdv();
Y_AXIS.pos="absolute";
Y_AXIS.w=1;
Y_AXIS.bgcol=AXIS_COL;


//log(X_AXIS);
//log(Y_AXIS);

//»

//Var«

let H;
let H_HALF;
let W;
let NUM;
let NUM_HALF;
let NUM_FOURTH;
let Q1;
let Q2;
let Q3;
let Q4;
let XINC;
let SLOPE;


const out = ctx.createGain();

const osc1 = ctx.createOscillator();
const osc2 = ctx.createOscillator();
const osc3 = ctx.createOscillator();
const shaper = ctx.createWaveShaper();

//»




//Funcs«

const rnd=(n)=>parseFloat(n.toFixed(2));

const pt = (x,y, col=PTCOL)=>{//«
//log(x, parseFloat((2*(y/H-0.5)).toFixed(3)) );
	let d = mkdv();
	d.pos="absolute";
	d.w=PTDIM;
	d.h=PTDIM;

	d.x=x*XINC;
	d.y=H*y;
	d.bgcol=col;
	Graph.add(d);

};//»

const newpt = (x,y)=>{//«
	let d = mkdv();
	d.pos="absolute";
	d.w=PTDIM;
	d.h=PTDIM;

	d.x=x*XINC;
	d.y=-H_HALF*y+H_HALF;
	d.bgcol="#fff";
	Graph.add(d);

};//»

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
//log(2*(0.5-rv));
	return rv;

};//»

const fn=(x)=>{//«
//	return SIN(x);
	return ASIN(x);
};//»
const redraw=()=>{//«
	resize();
	Graph.innerHTML="";
	Graph.add(X_AXIS);
	Graph.add(Y_AXIS);
	let arr = new Float32Array(NUM+1);
	for (let i=0; i<=NUM; i++){
//		pt(i,CURVE(i,{mult:2.25, clip: false}),"#ff0");
//		pt(i,CURVE(i,{mult:1.5, clip: false}),"#0f0");
//		pt(i,CURVE(i,{mult:1, clip: false}),"#f70");
		let y = CURVE(i,{mult:USEMULT, clip: USECLIP});
		pt(i, y, "#f70");
		arr[i]=2*(0.5-y);
//		pt(i,CURVE(i,{mult:0, clip: true}),"#fff");
//		pt(i,CURVE(i,{mult:-1, clip: false}),"#f0f");
//		pt(i,CURVE(i,{mult:-1.5, clip: false}),"#00f");
//		pt(i,CURVE(i,{mult:-2.25, clip: true}),"#f00");
//		let y = CURVE(i,{mult:-1.1, clip: false});
//		arr.push(2*(0.5-y));
//		pt(i, y);
	};
	return arr;
//log(arr);
}//»

const resize=()=>{//«
	Graph.h = Main.clientHeight-40;
	Graph.w = Main.clientWidth-20;
	Graph.x=10;
	Graph.y=20;
	H = Graph.clientHeight;
	H_HALF = H/2;
	W = Graph.clientWidth;
	SLOPE = H/W;
	NUM = USENUM ? USENUM : W/2;
	NUM_HALF = Math.floor(0.5*NUM);
	Q1 = Math.floor(0.25*NUM);
	NUM_FOURTH = 0.25*NUM;
	Q2 = NUM_HALF;
	Q3 = Math.floor(0.75*NUM);
	Q4 = Math.floor(NUM);

	XINC = W/NUM;
	X_AXIS.w=W;
	Y_AXIS.h=H;
	X_AXIS.loc(0, H/2-0.5);
	Y_AXIS.loc(W/2-0.5, 0);
};//»

//»

//OBJ/CB«
this.onappinit=()=>{

let arr = redraw()
shaper.curve = arr;
shaper.oversample = '4x';
osc1.frequency.value=f1;
osc2.frequency.value=f2;
osc3.frequency.value=f3;
osc1.connect(shaper);
osc2.connect(shaper);
osc3.connect(shaper);
shaper.connect(out);
mixer.plug_in(out);
osc1.start();
osc2.start();
osc3.start();

};

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
	if (s=="SPACE_"){
		if (out.gain.value==0) out.gain.value=1;
		else out.gain.value=0;
	}
}//»

this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«

out.disconnect();

}//»
this.onresize = function() {//«
	redraw();
}//»
this.onfocus=()=>{//«
}//»

this.onblur=()=>{//«
}//»

//»


}

