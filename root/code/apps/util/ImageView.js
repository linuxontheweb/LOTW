
//Var«

const{log,cwarn,cerr}=Core;
const{util}=globals;
const{make}=util;
const topwin = Main.top;
const statbar = topwin.status_bar;
const lines = [];

const winid = topwin.id;

let did_load = false;

//»

//DOM«
let textarea = make('textarea');
textarea._noinput = true;
textarea.width = 1;
textarea.height = 1;
textarea.style.opacity = 0;
textarea.onpaste=e=>{
	let file = e.clipboardData.files[ 0 ];
	if (!file) return;
	log(file);
	let reader = new FileReader();
	reader.onload = function (ev) {
		load_bytes(new Uint8Array(ev.target.result));
	}; 
	reader.readAsArrayBuffer(file);
}

let areadiv = make('div');
areadiv.pos="absolute";
areadiv.loc(0,0);
areadiv.z=-1;
areadiv.add(textarea);
//Main.tcol="black";
Main.bgcol="black";
Main.add(areadiv);

//»

//Funcs«

const load_bytes=bytes=>{
	if (did_load){
cwarn("Already loaded!");
		return;
	}
	did_load=true;
	let blob = new Blob([bytes]);
	let url = URL.createObjectURL(blob);
	let img = new Image;
	img.src = url;
	Main.add(img);
};

//»

//CBs«

this.onfocus=()=>{
	textarea.focus();
};
this.onblur=()=>{
	textarea.blur();
};

this.onresize=()=>{
}

this.onkill=()=>{
};

this.onappinit=()=>{
//log("APPINIT");
};
this.onloadfile=load_bytes;;

this.onkeydown=(e,k)=>{
};

setTimeout(()=>{
	textarea.focus();
},0);

//»

