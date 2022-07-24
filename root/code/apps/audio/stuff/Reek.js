const APPNAME="HorpFoolp!!!";

export const app = function(arg) {

//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

Main.top.title=APPNAME;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;


const Win = Main.top;
let PT;
let UI;
//Main.bgcol="#333";
//Win.bgcol="rgba(0,0,0,0)";

//»

//Var«


//»
//DOM«
let box=mkdv();
box.pos="absolute";
box.w=50;
box.h=50;
box.loc(642-20,236-20);
box.bgcol="#fff";
//log(box);
//»

//Funcs«

const set_ui_styles=()=>{//«
	let _ = UI._tractUI._container.style;
	_.display="flex";
	_.alignItems="center";
	_.justifyContent="center";
	_.flexDirection="column";
}//»

const init=async()=>{//«

if (window.innerHeight !== 492) cwarn("Want window.innerHeight == 492, got: "+window.innerHeight);

if (!await capi.loadMod("av.voice.pinktrombone")) return cerr("PinkTrombone could not be loaded!");

let mod = NS.mods["av.voice.pinktrombone"];
PT = make('pink-trombone');
log(PT);
Main.add(PT);
try{
let got = await PT.setAudioContext();
}catch(e){
log(e);
cerr(e);
return;
}
PT.enableUI();
UI = PT.UI;
PT.add(UI._container);
set_ui_styles();
///*

//let proc = await PT.getProcessor();
//UI._tractUI._processor = proc;
//UI._glottisUI._processor = proc;
//PT.startUI();
PT.start();

//Main.add(box);
//*/
//log(PT);
//log(Main);

//UI._tractUI._doDraw();

//PT.UI._container.dispatchEvent(new CustomEvent("didGetProcessor", {detail: {processor: proc}}));
////for (let p in PT){
//if (PT.hasOwnProperty(p)) log(p);
//}

//PT.connect();
//log(PT.constrictions);
//log(PT.parameters);
//log(PT.pinkTrombone);
//log(PT.setupAudioGraph);
//log(PT.prototype);
//log(mod);

}//»

//»

//OBJ/CB«

this.onappinit=(if_app_mode)=>{//«
	if (if_app_mode){
		let inp = make('input');
		inp.op=0;
		Main.tcol="#ccc";
		Main.innerHTML="<center><h2>Type or click!</h2></center>";
		Main.add(inp);
		const doinit=()=>{
Main.tcol="#000";
			Main.innerHTML="";
			Main.onmousedown = inp.onkeydown = null;
			inp.del();
			init();
		};
		inp.focus();
		Main.onmousedown = doinit;
		inp.onkeydown = doinit;
	}
	else init();
};//»

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«

}//»

this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«
/*
NS.mods["av.voice.pinktrombone"]._script.del();
NS.mods["av.voice.pinktrombone"] = undefined;
delete NS.mods["av.voice.pinktrombone"];
*/
}//»
this.onresize = function() {//«
//log("RS");
//if (PT) PT.UI._tractUI._doDraw();
}//»
this.onfocus=()=>{//«
}//»

this.onblur=()=>{//«
}//»

//»

}

