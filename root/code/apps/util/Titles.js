export const app = function(arg) {


//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

Main.fw="900";
Main.top.title="Titles";
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;

Win.no_shadow = true;

//»

//Var«

let blink_interval;
let BLINK_DELAY_MS = 500;

//»

//Funcs«

const init=()=>{//«
}//»

const do_set=(fs, html, x, y, b, r)=>{
Main.fs=fs;
Main.innerHTML=html;
Win.x=x;
Win.y=y;
Win.b=b;
Win.r=r;
};

//»

//OBJ/CB«

this.onappinit=()=>{
//Main.bgcol="#fff";
Main.bgcol="#000";
Main.tcol="#fff";
Win.op=1;
Main.w="";
Main.h="";
Main.pad=10;
Main.fs=75;
Main.innerHTML="Titles!";
Main.top.toggle_chrome();
Win.center();
};

this.onkeydown = function(e,s) {//«
if (s=="b_A"){
if (blink_interval){
clearInterval(blink_interval);
blink_interval = null;
Win.op=1;
}
else{
Win.op=0;
blink_interval = setInterval(()=>{
		if (Win.op==="0") Win.op=1;
		else Win.op = 0;
	}, BLINK_DELAY_MS);
}

}
}//»

this.onkeypress=e=>{//«

let k = e.key;
if (k=="0"){
Main.fs=75;
Main.innerHTML="Titles!";
Win.b="";
Win.r="";
Win.center();
}

else if (k=="a"){
do_set(42,`🡇 See Keystrokes Here! 🡇`
,"","",55,20);
}
};//»
this.onkill = function() {//«
if (blink_interval) clearInterval(blink_interval);

}//»
this.onresize = function() {//«
}//»


this.onfocus=()=>{//«

Main.bgcol="#000";
Main.tcol="#fff";

}//»

this.onblur=()=>{//«

Main.bgcol="#131313";
Main.tcol="#e9e9e9";

}//»

//»


}

