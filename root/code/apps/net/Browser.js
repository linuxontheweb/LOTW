
//Imports«
const Topwin = Main.top;

const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp}=util;
const log=(...args)=>{console.log(...args)};
const cerr=(...args)=>{console.error(...args)};
const cwarn=(...args)=>{console.warn(...args)};
const act=()=>document.activeElement;
const NUM=Number.isFinite;
const capi=Core.api;
const isdev=()=>{return dev_mode&&dev_env};
const fsapi=NS.api.fs;
//»

//Var«
const ALL={};
let cur_div;
//»

//Dom«
const APPNAME="Browser";
const TCOL="#d7d7d7";
const index_div = mk('div');
index_div.w=Main.w;
index_div.pos="absolute";
index_div.loc(0,0);
index_div.pad=10;
Main.add(index_div);
Topwin.title=APPNAME;
Main.fs=21;
Main.tabIndex="-1";
Main.bgcol="#171717";
Main.tcol=TCOL;
Main.over="auto";

//»

//Funcs«
const remove_attrs=(elem)=>{
	let tag = elem.tagName;
	for (let att of elem.attributes) {
		let nm = att.name;
		if (tag==="A"&&(nm==="href"||nm==="name")) continue;
		else elem.removeAttribute(att.name);
	}
	for (let child of elem.children)remove_attrs(child);
};

const init_folder=async(parpath)=>{//«
let par = await fsapi.pathToNode(parpath);
let kids=par.KIDS.keys.sort();

for (let k of kids){//«
if (k=="."||k=="..")continue;
let a = mk('a');
let d = mkdv();
a.innerText = k;
a.onclick=async()=>{//«
Topwin.title=k;
if (ALL[k]){
cur_div=ALL[k];
Main.scrollTop=cur_div._scrtophold;
index_div.del();
Main.add(cur_div);
return;
}
let path = `${parpath}/${k}`;
let rv = await fsapi.readFile(path);
if (!rv){
cerr("???");
return;
}
if (!(rv instanceof Array && typeof rv[0] === "string")){
log(rv);
cerr("What value???");
return;
}
let div = mk('div');
div.style.userSelect="text";
div.w=Main.w-20;
//div.w="100%";
div.pos="absolute";
div.loc(0,0);
div.pad=10;
let str = rv.join("\n");
let parser = new DOMParser()//«
let doc = parser.parseFromString(str, "text/html");
let metas = doc.getElementsByTagName("META");
for (let i=metas.length-1; i>=0; i--) metas[i].parentNode.removeChild(metas[i]);
let scripts = doc.getElementsByTagName("SCRIPT");
for (let i=scripts.length-1; i>=0; i--) scripts[i].parentNode.removeChild(scripts[i]);
let styles = doc.getElementsByTagName("STYLE");
for (let i=styles.length-1; i>=0; i--) styles[i].parentNode.removeChild(styles[i]);
let inputs = doc.getElementsByTagName("INPUT");
for (let i=inputs.length-1; i>=0; i--) inputs[i].parentNode.removeChild(inputs[i]);
const TITLE = doc.getElementsByTagName("TITLE")[0];
let elems = Array.from(doc.body.children);
//»
for (let e of elems){
	remove_attrs(e);
	div.add(e);
}
div.ondblclick=()=>{
log(div.innerHTML);
};
//index_div.dis="none";
index_div._scrtophold=Main.scrollTop;
index_div.del();
Main.add(div);
let anchors = Array.from(div.getElementsByTagName("A"));
for (let a of anchors){//«
a.tcol=TCOL;
a.onmousedown=()=>{};
a.onclick=(e)=>{
let ishash=false;
let islocal=false;
if (a.href && (a.href.split("?")[0]===window.location.href.split("?")[0])){
if (a.href.match(/#\w+$/)) ishash=true;
else islocal=true;
}
if (!ishash) {
	e.preventDefault();
	if (islocal) log("DOWEHAVEIT?");
	else cwarn("GOTO",a.href);
}
};
};//»
ALL[k]=div;
cur_div = div;
Main.scrollTop=0;
};//»
d.add(a);
index_div.add(d);
}//»

};
//»

//»

//Obj/CB«

this.onresize=()=>{
index_div.w=Main.w;
let kids = ALL.keys;
for(let k of kids) {
	ALL[k].w=Main.w-20;
}
};
this.onfocus=()=>{
Main.focus();
};
this.onblur=()=>{
Main.blur();
};
this.onescape=()=>{
	return false;
};

this.onlogin=(name)=>{
};

this.onlogout=()=>{
};

this.onkeydown=(e,k)=>{
	let act = document.activeElement;
	if (k=="LEFT_"){
if (cur_div){
cur_div._scrtophold=Main.scrollTop;
cur_div.del();
cur_div=null;
Main.add(index_div);
Main.scrollTop=index_div._scrtophold;
Topwin.title=APPNAME;
}
	}
//	if (k==="ENTER_"){
//	}
};

//»

//init();
//log("ARGS", arg);
if (arg.FOLDER) init_folder(arg.FOLDER);
 
