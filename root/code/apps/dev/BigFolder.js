
let donum=500;

//Imports«

const {is_app}=arg;

Main.top.title="BigFolder";
const{log,cwarn,cerr}=Core;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

let winid = Main.top.id;

//»

//DOM«

let sty = make('style');

Main.bgcol="#666";
Main.overy="auto";
Main.overx="hidden";
Main.tabIndex="-1";
Main.pad=5;
const icondv = mkdv();
icondv.main = Main;
icondv.win = Main.top;
icondv.pos = "relative";
icondv.dis="flex";
icondv.style.flexBasis=`100px`;
icondv.style.flexShrink=0;
icondv.style.flexGrow=0;
icondv.style.flexWrap="wrap";
Main.add(icondv);

//»

//OBJ/CB«

this.onkeydown = function(e,s) {//«
}//»
this.onkill = function() {//«
	icondv.del();
	sty.del();
}//»
this.onresize = function() {//«

}//»
this.onfocus=()=>{
Main.focus();
};
this.onblur=()=>{
Main.blur();
};

//»

//Style«
sty.innerHTML=`
.${winid}_icon {
	height:100px;
	width:100px;
	overflow:hidden;
	display:flex;
	flex-direction:column;
	justify-content:space-around;
	align-items:center;
	padding-left:5px;
	padding-right:5px;
}
.${winid}_label {
	overflow:hidden;
	max-height:37px;
	text-align:center;
	overflow-wrap:break-word;
	width:100%;
	font-size:15;
	background-color:#000;
	color:#ccc;
	padding:1px;
}

`;

document.head.add(sty);
//»

const init=()=>{//«

let s = '';
for (let i=0; i < donum; i++){
//	s+=`<div id=${winid}_${i} class="${winid}_icon"></div>`;
	s+=`<div data-name="${i}" class="${winid}_icon"></div>`;
}
icondv.innerHTML=s;

let options = {
  root: Main,
  rootMargin: '0px',
  threshold: 0.001
}

let callback = (entries, observer) => {
	entries.forEach(ent => {
		let d = ent.target;
		if (ent.isIntersecting){
			let name = d.dataset.name;
			d.innerHTML=`<span style="font-size:38;">📝</span><div class="${winid}_label">${name}</div>`;
			let icn = d.childNodes[0];
			icn.onmousedown=e=>{
log("NAME",name);
			};
			icn.draggable=true;
			icn.ondragstart=e=>{
				e.preventDefault();
cwarn("DRAGGEM");
			};
		}
		else{
			d.innerHTML="";
		}
	});
};

let observer = new IntersectionObserver(callback, options);
for (let kid of icondv.children){
	observer.observe(kid);
}

}//»

Main.focus();
init();

