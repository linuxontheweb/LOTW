
export const app = function(arg) {

//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;
const {makeIcon} = Desk.api;
const {getAppIcon}= capi;
const{util}=globals;
const{FOLDER_APP}=globals;
const{make,mkdv,mk,mksp}=util;
const {fs}=NS.api;
let topwin = Main.top;
let winid = topwin.id;
let path = topwin._fullpath;
let statbar = topwin.status_bar;
let num_entries = 0;

//»

//DOM«

let WDIE;
let dd = mkdv();
dd.pos = 'absolute';
dd.bor = '1px solid white';
dd.bgcol = 'gray';
dd.op = 0.5;
dd.loc(-1, -1);
dd.w = 0;
dd.h = 0;
Main.add(dd);

//Main.bgcol="#332323";
//Main.bgcol="#544";
Main.overy="auto";
Main.overx="hidden";
Main.tabIndex="-1";
//Main.pad=5;
const icondv = mkdv();
icondv.mar=5;
icondv.main = Main;
icondv.win = Main.top;
icondv.pos = "relative";
icondv.dis="flex";
icondv.style.flexBasis=`100px`;
icondv.style.flexShrink=0;
icondv.style.flexGrow=0;
icondv.style.flexWrap="wrap";
Main.add(icondv);

topwin.drag_div = dd;
topwin.icon_div = icondv;
Main.icon_div = icondv;
//log(topwin);

//»
//Var«

//let ICONS=[];
let is_loading = false;
let drag_timeout;
let dir;
let kids;
let curnum;
let observer;
//»
//Funcs«

const reload = ()=>{//«
	if (is_loading) return;
	is_loading = true;
	Main.scrollTop=0;
	icondv.innerHTML="";
	init();
	stat(`${dir.KIDS._keys.length-2} entries`);
	if (topwin.CURSOR) topwin.CURSOR.set();
};//»

const stat=(s)=>{statbar.innerHTML=s;};
const NOOP=()=>{};

const load_dir=()=>{//«

let typ = dir.root.TYPE;
kids = dir.KIDS;
let keys = kids._keys;
keys.splice(keys.indexOf("."),1);
keys.splice(keys.indexOf(".."),1);
keys.sort();
curnum = keys.length

let s = '';
for (let i=0; i < curnum; i++){
	s+=`<div data-name="${keys[i]}" class="icon"></div>`;
}
icondv.innerHTML=s;
const options = {
	root: Main,
	rootMargin: '0px',
	threshold: 0.001
}

observer = new IntersectionObserver((ents)=>{
	ents.forEach(ent => {
		let d = ent.target;
		if (d.selected) return;
		if (ent.isIntersecting) {
			let icn = makeIcon(kids[d.dataset.name], d, observer);
			icn.parwin = topwin;
		}
		else {
//log(d.selected);
			d.innerHTML="";
		}
	});
}, options);

for (let kid of icondv.children) observer.observe(kid);

is_loading = false;

}//»
const stat_num=()=>{//«
if (!num_entries) stat("Empty");
else if (num_entries==1) stat("1 entry");
else stat(`${num_entries} entries`);
};//»
const init=async()=>{//«
	dir = await fs.pathToNode(path);
	if (!dir) {
console.error(`Directory not found: ${path}`);
		return;
	}
	if (!dir.done){
		stat("Getting entries...");
		let cb=(ents)=>{
			num_entries+=ents.length;
			stat_num();
		};
		await fs.populateDirObjByPath(path, {par:dir,streamCb:cb});
		dir.done=true;
		load_dir();
	}
	else{
		load_dir();
	}
	if (dir.root.TYPE!=="fs") {
		num_entries = Object.keys(dir.KIDS).length-2;
		stat_num();
	}
}//»

//»

//OBJ/CB«

this.reload=reload;

this.onkeydown = function(e,s) {//«
if (s=="r_")reload();
else if (s=="0_"){
	if (topwin.CURSOR) {
		topwin.CURSOR.zero();
	}
//topwin.CURSOR.set();
}


}//»
this.onkill = function() {//«
	icondv.del();
}//»
this.onresize = function() {//«

}//»

this.onfocus=()=>{
Main.focus();
};
this.onblur=()=>{
Main.blur();
};
this.onload=()=>{
init();
};
this.update=()=>{
	stat(`${dir.KIDS._keys.length-2} entries`);
};

this.add_icon=(icn)=>{
Main.scrollTop=0;

};
this.stat=stat;
//»

Main.focus();
Desk.add_folder_listeners(topwin);

}

