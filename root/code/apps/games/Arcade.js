/*Gamepad

let gp = navigator.getGamepads()[0]
let buts = gp.buttons

buts[12] //UP
buts[13] //DOWN
buts[14] //LEFT
buts[15] //RIGHT

*/

export const app = function(arg) {

let EW_THRESH = 0.05;
let NS_THRESH = 0.25;

//Imports«
//const APPOBJ = arg.APPOBJ||{};
//const{NS,Core,Desk,main,topwin}=arg;
const {Core, Main, NS, Desk}=arg;
const{log,cwarn,cerr, globals}=Core;
const main = Main;
const topwin = main.top;
const{fs,util,widgets}=globals;
const{poperr}=widgets;
const capi = Core.api;
const{make,mkdv,mk,mksp}=util;
const fsapi = NS.api.fs;
let statbar = topwin.status_bar;
const stat=(s)=>{statbar.innerHTML=s;};
let did_init = false;
let memory_interval;
let _;
/*«
let Core = arg.CORE;
_=Core;

let log = _.log;
let cwarn = _.cwarn;

let globals = Core.globals;
_=globals;

let WDG = _.widgets;
let poperr = WDG.poperr;

let fs = globals.fs;
let util = globals.util;
_=util;
let make = _.make;
»*/

let audio_ctx = globals.audio_ctx;
if (!audio_ctx) {
	audio_ctx = new AudioContext();
	globals.audio_ctx = audio_ctx;
}
let outgain = audio_ctx.createGain();
outgain.gain.setValueAtTime(0, audio_ctx.currentTime);
//outgain.gain.value=0;
//log(outgain.gain);
//»

//VAR«

let bUP,bDOWN,bLEFT,bRIGHT;
let UP,DOWN,LEFT,RIGHT;

let gp;
// = globals.gamepad;

var arcade_obj = this;

var ext_to_wasm ={//«
	gb:"binjgb"
}//»
var ext_to_js={//«
	gb: "games.GBEmulator",
	nes: "games.NESEmulator"
}//»
var ext_to_dims={//«
	gb:{
		w:160,
		h:144
	},
	nes:{
		w: 256,
		h: 240
	}
}//»
var wasm_cache = {};
var js_cache = {};

var wasm_mod = null;

var SCREEN_HEIGHT, SCREEN_WIDTH, ASPECT;

/*«
var BUT_A = "A";
var BUT_B = "X";
var BUT_SEL = "Bk";
var BUT_START = "St";
var BUT_UP = "N";
var BUT_LEFT = "W";
var BUT_DOWN = "S";
var BUT_RIGHT = "E";
var str_to_but ={//«
	"A": BUT_A,
	"B": BUT_B,
	"Select": BUT_SEL,
	"Start": BUT_START,
	"Up": BUT_UP,
	"Down": BUT_DOWN,
	"Left": BUT_LEFT,
	"Right": BUT_RIGHT
}//»
»*/

//var kb_map, gp_map;

var norm_kb_map = {//«
	".":"A",
	",":"B",
	"1":"A",
	"2":"B",
	"w":"U",
	"s":"D",
	"a":"L",
	"d":"R",
	"UP":"U",
	"DOWN":"D",
	"LEFT":"L",
	"RIGHT":"R",
	"SPACE":"Start",
	"ENTER":"Start",
	"TAB":"Select",
	"4":"Start",
	"5":"Select"
}//»

///*Q-bert...for diagnols
var qbert_kb_map = {//«
	".":"A",
	",":"B",
	"w":"Up",
	"a":"Down",//s
	"q":"Left",//a
	"s":"Right",//d
	"UP":"Up",
	"DOWN":"Down",
	"LEFT":"Left",
	"RIGHT":"Right",
	"SPACE":"Start",
	"ENTER":"Select"
}//»

var kb_map = norm_kb_map;
//*/

var gp_map={//«
	"A":"A",
	"B":"A",
	"X":"B",
	"Y":"B",
	"U":"Up",
	"D":"Down",
	"L":"Left",
	"R":"Right",
	"Bk":"Select",
	"St":"Start"
}//»

var did_read = false;
var running = true;
var emulator = null;
var gamepad_kill_cb=null;
//»

//DOM«
var canvas;
//var main = arg.MAIN;
//var topwin = arg.TOPWIN;
var w = main.clientWidth;
var h = main.clientHeight;
main.bgcol="#171717";
_ = main.style;
_.display="flex";
_.alignItems="center";
_.justifyContent="center";
_.flexDirection="column";
//log(main);
const handle_drop=(bytes,namearg)=>{
	var name;
	if (!namearg) return;
	if (!bytes) return;
	var arr = namearg.split(".");
	var ext = arr.pop();
	if (!arr.length) return;
	name = arr.join(".");
	var wasm = ext_to_wasm[ext];
	var jsmod = ext_to_js[ext];
	var dims = ext_to_dims[ext];
	if (!(jsmod&&dims)) return;
	if (emulator) {
		emulator.pause();
		emulator.kill();
	}
	topwin.title=name;
	if (!did_init) init_canvas(dims);
	if (wasm) init_wasm(wasm, jsmod, bytes, name);
	else init_js(jsmod, bytes, null, name);
};
main.ondrop = function(e){
	e.preventDefault();
	e.stopPropagation();
	fs.drop_event_to_bytes(e, handle_drop);
}//»

//Funcs«

const init=()=>{//«
	outgain.connect(audio_ctx.destination);
//	try_gp_read();
	resize();
}//»
const init_canvas=(dims)=>{//«
	did_init = true;
	main.innerHTML="";
	SCREEN_WIDTH = dims.w;
	SCREEN_HEIGHT = dims.h;
	ASPECT = SCREEN_WIDTH/SCREEN_HEIGHT;
	canvas = make("canvas"); 
	canvas.width=SCREEN_WIDTH;
	canvas.height=SCREEN_HEIGHT;
	canvas.style.margin="auto";
//	canvas.bor="1px solid gray";
	main.add(canvas);
	outgain.gain.exponentialRampToValueAtTime(0.75, audio_ctx.currentTime+1);
//setTimeout(()=>{
//	outgain.gain.value = 0.8;
//},100);
}//»
const init_gamepad=(cb)=>{//«
	fs.get_json_file('/etc/input/gamepad.json',(gpret,gperr)=>{
//log(gpret, gperr);
		if (gperr) return poperr("Parse error in gamepad.json: " + gperr);
		if (gpret) {
			if (gpret.kb2gp) kb_map = gpret.kb2gp;
			if (gpret.std2nes)	gp_map = gpret.std2nes;
		}
		else {

		}
		cb();
	})
}//»
const init_emulator=(jsmodarg, bytes, wasmmodarg, namearg)=>{//«
	emulator = jsmodarg.init(arcade_obj, bytes, canvas, outgain, (ret,err)=>{
		if (!ret) return poperr("Could not initialize the emulator: " + err);
		init();
	}, wasmmodarg);
}//»
const init_js=(jsarg, bytes, wasmarg, namearg)=>{//«
	var gotjs = js_cache[jsarg];
	if (gotjs){
		init_emulator(gotjs, bytes, wasmarg);
		return;
	}
	fs.getmod(jsarg,(modret)=>{
		if (!modret) return poperr("Could not get the js mod: " + jsarg);
		js_cache[jsarg] = modret;
		init_emulator(modret, bytes, wasmarg, namearg);
	},{STATIC:true});
}//»
const init_wasm=async(wasm, jsmod, bytes, namearg)=>{//«
	var gotwasm = wasm_cache[wasm];
	var gotjs = js_cache[jsmod];
	if (gotwasm&&gotjs) {
		init_emulator(gotjs, gotwasm);
		return;
	}
	let wasmmod = await fsapi.getMod("util.wasm.wasm");
	if (!wasmmod) return poperr("No wasm module!");
	let base_path = '/code/wasms/games/'+wasm+'.wasm';
	let wasmret;
	if (await fsapi.pathToNode(base_path,{isRoot:true})) {
		wasmret = await fsapi.readHtml5File(base_path, {ROOT:true,BLOB:true});
	}
	else {
		wasmret = await capi.xget('/root'+base_path);
		await fsapi.writeHtml5File(base_path, wasmret, {ROOT:true});
	}
	wasmmod.WASM({wasmBinary:wasmret}, wasm, modret=>{
		if (!modret) return poperr("No module!!");
		wasm_mod = modret;
		init_js(jsmod, bytes, wasm_mod, namearg);
	});
}//»

const load_init=(bytes,name,ext)=>{//«
	let wasm = ext_to_wasm[ext];
	let jsmod = ext_to_js[ext];
	let dims = ext_to_dims[ext];
	if (!(jsmod&&dims)) return;
	init_canvas(dims);
	init_gamepad(()=>{
		if (wasm) init_wasm(wasm, jsmod, bytes, name+"."+ext);
		else init_js(jsmod, bytes,null,name+"."+ext);
	});
}//»

const try_gp_read=()=>{//«
//log("TRY");
	if (gamepad_kill_cb) {
		gamepad_kill_cb();
		gamepad_kill_cb = null;
	}
	fs.read_device("/dev/gamepad/1",(ret,kill_cb)=>{
		if (kill_cb) {
log(kill_cb);
			gamepad_kill_cb=kill_cb;
			return 
		}
		if (!emulator) return;
		if (!ret) return;
		var but;
		if (gp_map) but = gp_map[ret.button];
		else but = ret.button;
		emulator.fire(but,(ret.value=="down"?true:false));
		did_read = true;
	},{INTERVAL: 0});
}//»
const resize=()=>{//«
	if (!canvas) return;
	if (h*ASPECT > w) {
		canvas.w = w;
		canvas.h = w/ASPECT;
	}
	else {
		canvas.h = h;
		canvas.w = h*ASPECT;
	}
}//»

const set_buttons = () => {
	let buts = gp.buttons;
	bUP = buts[12];
	bDOWN = buts[13];
	bLEFT = buts[14];
	bRIGHT = buts[15];
};

//»

//OBJ/CB«

this.poll_gp =()=>{//«

gp  = navigator.getGamepads()[0];
if (!gp) return;
let ew = gp.axes[2];
if (ew > EW_THRESH){
	if (LEFT) emulator.fire("L",false);
	LEFT=false;
	if (!RIGHT) emulator.fire("R",true);
	RIGHT=true;
}
else if (ew < -EW_THRESH){
	if (RIGHT) emulator.fire("R",false);
	RIGHT=false;
	if (!LEFT) emulator.fire("L",true);
	LEFT=true;
}
else{
	if (RIGHT) emulator.fire("R",false);
	if (LEFT) emulator.fire("L",false);
	RIGHT=LEFT=false;
}


let ns = gp.axes[3];
if (ns > NS_THRESH){
	if (UP) emulator.fire("U",false);
	UP=false;
	if (!DOWN) emulator.fire("D",true);
	DOWN=true;
}
else if (ns < -NS_THRESH){
	if (DOWN) emulator.fire("D",false);
	DOWN=false;
	if (!UP) emulator.fire("U",true);
	UP=true;
}
else{
	if (DOWN) emulator.fire("D",false);
	if (UP) emulator.fire("U",false);
	DOWN=UP=false;
}

/*
set_buttons();
if (bDOWN.pressed){
	if (!DOWN) {
		emulator.fire("D",true);
		DOWN=true;
	}
}
else {
	if (DOWN) emulator.fire("D",false);
	DOWN = false;
}

if (bUP.pressed){
	if (!UP) {
		emulator.fire("U",true);
		UP=true;
	}
}
else {
	if (UP) emulator.fire("U",false);
	UP = false;
}


if (bLEFT.pressed){
	if (!LEFT) {
		emulator.fire("L",true);
		LEFT=true;
	}
}
else {
	if (LEFT) emulator.fire("L",false);
	LEFT = false;
}


if (bRIGHT.pressed){
	if (!RIGHT) {
		emulator.fire("R",true);
		RIGHT=true;
	}
}
else {
	if (RIGHT) emulator.fire("R",false);
	RIGHT = false;
}
	fs.get_all_gp_events(true);
	try{
		if (did_read) {
			if (!navigator.getGamepads()[0]) did_read = false;
			return;
		}
		if (navigator.getGamepads()[0]) try_gp_read();
	}
	catch(e){}
*/
}//»
this.onloadfile = load_init;
this.onappinit=()=>{//«
//topwin.title="Nineteendo";
main.tcol="#ccc";
let sp=make('sp');
//sp.tcol="#ccc";
sp.fs=32;
sp.innerHTML="Drop an nes or gb file here!";
let info=make('div');
info.innerHTML=`
<br>
To play, either plug in a usb gamepad, or...<br><br>
The arrows are W-A-S-D.<br>
The A button is '.' (period key)<br>
The B button is ',' (comma key)<br>
The Start button is the spacebar<br>
The Select button is the enter key.
`;
info.fs=21;
main.add(sp);
main.add(info);
}//»
this.onicondrop=async(arr)=>{//«
	if (emulator) {
		emulator.kill(); 
		emulator = null;
	}
	for (let p of arr){
		if (p.match(/\.gb$/)||p.match(/\.nes$/)) {
			let name = p.split("/").pop();
			let ret = await fsapi.readFile(p);
			let dat = await Core.api.toBytes(ret);
			handle_drop(dat,name);
			break;
		}
	}
};//»
this.onkeydown = function(e,sym) {//«
//log("DOWN",sym);
	if (sym=="g_") {
		if (navigator.getGamepads()[0]){
			Desk.api.showOverlay("Gamepad connected");
//			globals.gamepad = gp;
//			set_buttons();
		}
		return;
	}
//try_gp_read();
	if (!emulator) return;
	var marr;

//log(e);
	if (sym=="SPACE_A") {
		running = !running;
		if (running) {
			emulator.run();
		}
		else {
			emulator.pause();
		}
	}
	else if (sym=="q_A") {
		if (kb_map === qbert_kb_map) {
			kb_map = norm_kb_map;
		}
		else kb_map = qbert_kb_map;

		cwarn("New keyboard map");
	}
	else if (sym=="q_"){
//log("TOGGLE");
		emulator.toggleSilentMode();
	}
	else if (kb_map && (marr=sym.match(/^(.+)_$/)) && kb_map[marr[1]]) {
//		let but = str_to_but[kb_map[marr[1]]];
//log(marr[1]);
		let but = kb_map[marr[1]];
//log(but);
		if (!but) return;
		if (sym=="TAB_") e.preventDefault();
//log("FIRE",but);
		emulator.fire(but,true);
	}

}//»
this.onkeyup = function(e,sym) {//«
	if (!emulator) return;
//log("UP",sym);
	var marr;
	if (kb_map && (marr=sym.match(/^(.+)_$/)) && kb_map[marr[1]]) {
//		let but = str_to_but[kb_map[marr[1]]];
		let but = kb_map[marr[1]];
//log(but);
		if (!but) return;
		emulator.fire(but,false);
	}
}//»
this.onkill = function() {//«
clearInterval(memory_interval);
	if (emulator) {
		emulator.pause();
		emulator.kill();
	}
	if (gamepad_kill_cb) gamepad_kill_cb();
}//»
this.onresize = function() {//«
	w = main.clientWidth;
	h = main.clientHeight;
	resize();
}//»
//»

//«


this.topwin = topwin;
if (arg.file) {
	let fullpath = arg.file;
	fs.path_to_contents(fullpath, (ret,err)=>{
		if (!ret) return poperr("Could not get the data from: " + fullpath);
		let fullname = fullpath.split("/").pop();
		let arr = fullname.split(".");
		let ext = arr.pop();
		let fname = arr.join(".");
		load_init(ret,fname,ext);
	}, true);
}

//»

if (gp) set_buttons();


}

/*Memory Usage«
let stat_memory=()=>{let MB = 1024*1024;
    let mem = window.performance.memory;
    let lim = mem.jsHeapSizeLimit;
    let used = mem.usedJSHeapSize;
    let per = Math.floor(100*used/lim);

    let limmb = Math.round(lim/MB);
    let usedmb = Math.round(used/MB);
    stat(`Memory: ${usedmb}MB/${limmb}MB  (${per}%)`);
};


memory_interval = setInterval(stat_memory, 250);
»*/

