
//Imports«
const {is_app}=arg;
Main.top.title="HelloWorld";
const{log,cwarn,cerr}=Core;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

//»

//Var«

let rafId;

let SCREEN_HEIGHT, SCREEN_WIDTH, ASPECT;

let cx,cy;
let cwid = 6;
let cwid_half = cwid/2;

let did_read = false;
let gamepad_kill_cb=null;

//»

//DOM«

let canvas, ctx;
let w = Main.clientWidth;
let h = Main.clientHeight;

Main.bgcol="#171717";

let _ = Main.style;
_.display="flex";
_.alignItems="center";
_.justifyContent="center";
_.flexDirection="column";

//»

//Funcs«

const stat=s=>{
if (is_app) return console.log(s);
	Main.top.status_bar.innerHTML=s;
};

const poll_gp =()=>{//«
	fs.get_all_gp_events(true);
	rafId = requestAnimationFrame(poll_gp);
	try{
		if (did_read) {
			if (!navigator.getGamepads()[0]){
				did_read = false;
				stat("Gamepad disconnected");
			}
			return;
		}
		if (navigator.getGamepads()[0]) try_gp_read();
	}
	catch(e){}
};//»
const try_gp_read=()=>{//«
	if (gamepad_kill_cb) {
		gamepad_kill_cb();
		gamepad_kill_cb = null;
	}
	fs.read_device("/dev/gamepad/1",(e,kill_cb)=>{
		if (kill_cb) {
			did_read = true;
			stat("Gamepad detected");
			gamepad_kill_cb=kill_cb;
			return 
		}
		if (!e) return;
		move_cursor(e);
	},{INTERVAL: 0});
}//»

const draw=()=>{//«
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,w,h);
	if (cy < 0) cy=0;
	else if (cy > SCREEN_HEIGHT) cy = SCREEN_HEIGHT;
	if (cx < 0) cx=0;
	else if (cx > SCREEN_WIDTH) cx = SCREEN_WIDTH;
	ctx.fillStyle = 'white';
	ctx.fillRect(cx-cwid_half,cy-cwid_half,cwid,cwid);
};//»
const move_cursor = e =>{//«
	let val = e.value;
	let typ = e.type;
	if (typ=="gpaxis"){
		if (e.axis=="lX"){
			cx=SCREEN_WIDTH*(0.5+(val/2));
			draw();
		}
		else if (e.axis=="lY"){
			cy=SCREEN_HEIGHT*(0.5+(val/2));
			draw();
		}
		return;
	}
	if (typ=="gpbutton"){
		if (val=="up") return;
		let b = e.button;
		if (b=="U")cy-=cwid;
		else if (b=="D")cy+=cwid;
		else if (b=="L")cx-=cwid;
		else if (b=="R")cx+=cwid;
		draw();
	}
};//»

const init=()=>{//«
	SCREEN_WIDTH = w;
	SCREEN_HEIGHT = h;
	ASPECT = SCREEN_WIDTH/SCREEN_HEIGHT;
	canvas = make("canvas"); 
	canvas.width=SCREEN_WIDTH;
	canvas.height=SCREEN_HEIGHT;
	canvas.onclick=e=>{
		cx = e.offsetX;
		cy = e.offsetY;
		draw();
	};
	cx = SCREEN_WIDTH/2;
	cy = SCREEN_HEIGHT/2;
	canvas.style.margin="auto";
	Main.add(canvas);
	ctx = canvas.getContext('2d');
	draw();
	if (!is_app) rafId = requestAnimationFrame(poll_gp);
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
	draw();
}//»

//»

//OBJ/CB«

this.onkeydown = function(e,s) {//«
	if (s=="LEFT_") {cx-=cwid;draw();}
	else if (s=="RIGHT_") {cx+=cwid;draw();}
	else if (s=="UP_") {cy-=cwid;draw();}
	else if (s=="DOWN_") {cy+=cwid;draw();}
	else if (s=="o_"){
		cx = SCREEN_WIDTH/2;
		cy = SCREEN_HEIGHT/2;
		draw();
	}
}//»
this.onkill = function() {//«
	cancelAnimationFrame(rafId);
	if (gamepad_kill_cb) gamepad_kill_cb();
}//»
this.onresize = function() {//«
	w = Main.clientWidth;
	h = Main.clientHeight;
	resize();
}//»

//»

//log(arg);
	if (!is_app) stat("Try plugging in a USB gamepad!");
	init();

