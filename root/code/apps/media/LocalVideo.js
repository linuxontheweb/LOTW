

const log=(...args)=>console.log(...args);
const wrn=(...args)=>console.warn(...args);
const cwarn=wrn;
const err=(...args)=>console.error(...args);
const cerr=err;
const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp}=util;
const {mixer, ctx}=globals.audio;
const {fs}=NS.api;
const {poperr}=globals.widgets;

const NUM = Number.isFinite;


//const n = arg.NODE || Core.get_appvar(Main.top, "NODE");//Node

const win = Main.top;
const mn = Main;

//Main.innerHTML = type;
Main.bgcol="#000";
Main.tcol="#AAA";
//win.title = `${type}\x20(${name})`;
let loaded = false;
let waiting = false;
let inp = mk('input');
inp.type="text";
mn.add(inp);
let vid;
setTimeout(()=>{
inp.focus();
},0);

let is_fullscreen = false;
let waiting_fullscreen = false;
const toggle_fullscreen=async()=>{
	if (waiting_fullscreen) return;
	if (!is_fullscreen) {
		waiting_fullscreen = true;
		let rv = await vid.requestFullscreen();
		waiting_fullscreen = false;
		is_fullscreen = true;
	}
	else{
		await document.exitFullscreen();
		is_fullscreen = false;
	}
}

const load_video=async(path)=>{
	waiting = true;
	let fullpath = `/loc/vids/${path}`;
	let obj = await fs.pathToNode(fullpath);
	if (!obj) {
		waiting = false;
		return;
	}
	inp.del();
	vid = mk('video');
//	vid.controls=true;
	mn.add(vid);
	vid.onclick=(e)=>{
		e.stopPropagation();
	};
	vid.oncanplay=(e)=>{
//log(e);
		loaded = true;
		vid.play();
//log(vid.seekable);
	};
	vid.src=fullpath.replace(/^.loc/,"/local");
log(vid);
};


this.onkill = ()=>{
	if (vid) vid.del();
};

this.onkeydown=(e,s)=>{

if (s=="ENTER_") {
	if (!loaded){
		if (waiting) return;
		let val = inp.value;
		if (!val) return;
		load_video(val);
		return;
	}
}
else if (s=="SPACE_"){
if (!loaded) return;
if (!vid.paused) vid.pause();
else vid.play();
}
else if (s=="f_"){
toggle_fullscreen();

}
//else if (s=="RIGHT_"){
//	vid.currentTime+=1;
//}

};


