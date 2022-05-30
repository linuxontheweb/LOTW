
// Noisecraft is courtesy of https://github.com/maximecb/noisecraft

import { anyInputActive } from '/root/code/mods/av/noisecraft/utils.js';
import { Dialog, errorDialog } from '/root/code/mods/av/noisecraft/dialog.js';
import { Model, Paste, Play, Stop , MoveNodes} from '/root/code/mods/av/noisecraft/model.js';
import { Editor } from '/root/code/mods/av/noisecraft/editor.js';
import { AudioView } from '/root/code/mods/av/noisecraft/audioview.js';

let model, editor, audioView;

export const app = function(arg) {


//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;
const WDG = NS.api.widgets;
const FS = NS.api.fs;
//log(WDG);

//»

//DOM«
const CUR = mkdv();
CUR.pos="absolute";
CUR.loc(0,0);
CUR.fs=50;
//╋
CUR.innerHTML = "╋";
CUR.z=10000000;
CUR.pad=0;
CUR.tcol="#c00";
CUR.op=1;
Main.add(CUR);
let cur_min_x = -CUR.clientWidth/2;
let cur_min_y = -CUR.clientHeight/2;
Main.bgcol="";
Main.tcol="#fff";
Main.fs=16;

const layout_div = mkdv();
layout_div.dis="flex";
layout_div.style.flexFlow="column";
layout_div.h="100%";
layout_div.w="100%";

Main.add(layout_div);
const editor_div = mkdv();
editor_div.style.flexGrow=1;
editor_div.over="scroll";
editor_div.pos="relative";

layout_div.add(editor_div);

const graph_div = mkdv();
graph_div.pos="absolute";
graph_div.loc(0,0);

const docopy=(e)=>{//«
	if (!focused) return;
	if (!editor.selected.length) return;
	let data = JSON.stringify(model.copy(editor.selected));
	log(data);
	e.clipboardData.setData('text/plain', data);
	e.preventDefault();
};
//»
const docut=(e)=>{//«
	if (!focused) return;
	if (!editor.selected.length) return;
	let data = JSON.stringify(model.copy(editor.selected));
	e.clipboardData.setData('text/plain', data);
	e.preventDefault();
	editor.deleteSelected();
};
//»
const dopaste=(e)=>{//«
	if (!focused) return;
    if (anyInputActive()) return;
	let clipData = e.clipboardData.getData('text/plain');
	try{
		let nodeData = JSON.parse(clipData)
		model.update(new Paste(nodeData, editor_div.scrollLeft, editor_div.scrollTop));
		e.preventDefault();
	}

	catch (err){
		console.log(err);
	}
};
//»

editor_div.add(graph_div);

const graph_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
graph_svg.setAttribute("version","1.1");
graph_svg.style.zIndex=-2;
graph_svg.style.position="absolute";
graph_svg.style.top=0;
graph_svg.style.left=0;
graph_svg.style.backgroundColor="#222";

editor_div.add(graph_svg);

//»

//Var«

const ARROWS=[//«
	"RIGHT_",
	"LEFT_",
	"UP_",
	"DOWN_",
	"RIGHT_C",
	"LEFT_C",
	"UP_C",
	"DOWN_C",
	"RIGHT_CA",
	"LEFT_CA",
	"HOME_",
	"END_"
];//»

let last_selected;
let focused = false;

//»

//Funcs«

const toggle_cursor=()=>{
	if (CUR.op==1) {
		CUR.op=0;
		CUR.z=-1;
	}
	else {
		CUR.op=1;
		CUR.z=10000000;
	}
}
const deselect=()=>{last_selected=editor.selected;editor.deselect();};
const dosave = async(force_popup)=>{//«

	let path = (Win.fullpath());
	let str = model.serialize();
	if (path&&!force_popup){
		await FS.saveFsByPath(path, str);
		await WDG.popok(`Saved: ${str.length} bytes!`);
	}
	else await WDG.popinarea(str, "File text (.ncft format)", {noCancel:true, readOnly:true});

};//»
const init=async()=>{//«

model = new Model();
model.__poperr=WDG.poperr;

editor = new Editor(model, editor_div, graph_div, graph_svg, Main);
audioView = new AudioView(model);

document.addEventListener('copy',docopy,false);
document.addEventListener('cut',docut,false);
document.addEventListener('paste',dopaste,false);

//graph_div.style.transform = "scale(0.5)";
//graph_svg.style.transform = "scale(0.5)";
//log(editor_div);

};//»

//»

//OBJ/CB«

this.onappinit=()=>{//«

	Win.title = "Noisecraft";
	init();
	model.new();

};//»
this.onloadfile=bytes=>{//«
	init();
    try{
//		setTimeout(()=>{
		model.deserialize(Core.api.bytesToStr(bytes));
//		},0);
    }
    catch (e){
        console.log(e.stack);
        model.new();
		WDG.poperr("The file could not be loaded. See the console for error stack!");
    }
};//»
this.onkeydown = async function(e,s) {//«

if (Main.dialog) return;
if (s=="ENTER_"){
	if (CUR.op!=1) return;
	let r = CUR.gbcr();
	let arr = document.elementsFromPoint(r.left+r.width/2, r.top+r.height/2);

	let node = arr[1].__node;
	if (!node) return;
	if (editor.selected.length==1 && editor.selected[0] === node.nodeId){
		node.ondblclick();
	}
	else {
		editor.selectNodes([node.nodeId]);
	}
}
else if (s==="SPACE_"){
	e.preventDefault();
	if (model.playing){
		model.update(new Stop());
	}
	else{
		model.update(new Play());
	}
}
else if (s=="x_"){
	toggle_cursor();
}
else if (s=="s_A"){
	dosave();
}
else if (s=="c_CAS"){
	dosave(true);
}
else if (s=="a_C"){
	deselect();
	editor.selectAll();
}
else if (s=="BACK_"){
	if (editor.selected.length) {
		if (await WDG.popyesno(`Delete ${editor.selected.length} nodes?`)) editor.deleteSelected();
	}
}
/*
else if (s=="n_"){

//	if (editor.selected.length > 0) editor.deselect();
	editor.deselect();

	//editor.createNodeDialog({x:editor_div.scrollLeft+Math.round(editor_div.offsetWidth/2), y:editor_div.scrollTop+Math.round(editor_div.offsetHeight/2)});
	editor.createNodeDialog({x:editor_div.scrollLeft+1, y:editor_div.scrollTop+1});
}
*/
else if (ARROWS.includes(s)){//«
	let dx=0, dy=0;
	if (s=="RIGHT_") dx = 50;
	else if (s=="LEFT_") dx = -50;
	else if (s=="UP_") dy = -50;
	else if (s=="DOWN_") dy = 50;
	else if (s=="RIGHT_C") dx = 7;
	else if (s=="LEFT_C") dx = -7;
	else if (s=="UP_C") dy = -7;
	else if (s=="DOWN_C") dy = 7;
	else if (s=="RIGHT_CA") dx = 1;
	else if (s=="LEFT_CA") dx = -1;
	else if (s=="HOME_") dy = -1;
	else if (s=="END_") dy = 1;
	if (editor.selected.length){
		e.preventDefault();
		for (let nodeId of editor.selected){
			let node = (editor.nodes.get(nodeId));
			node.move(dx,dy);
		}
		editor.resize();	
		model.update(new MoveNodes(
			editor.selected,
			dx,
			dy
		));
	}
	else if (CUR.op==1){
		CUR.x+=dx;
		CUR.y+=dy;
		let r = CUR.gbcr();
		let maxx = editor_div.clientWidth - r.width/2 - 2;
		let maxy = editor_div.clientHeight - r.height/2 - 5;
		if (CUR.x < cur_min_x) CUR.x=cur_min_x;
		else if (CUR.x > maxx) CUR.x = maxx;
		if (CUR.y < cur_min_y) CUR.y=cur_min_y;
		else if (CUR.y > maxy)CUR.y = maxy;
	}
	else{
		editor_div.scrollTop+=dy;
		editor_div.scrollLeft+=dx;

	}
}//»
else if (s=="0_"){

	if (CUR.op==1){
		CUR.x =  editor_div.clientWidth/2 - CUR.clientWidth/2;
		CUR.y =  editor_div.clientHeight/2 - CUR.clientHeight/2;
	}

}

}//»
this.onkeypress=e=>{//«

let k = e.key;
if (Main.dialog) {
	if (Main.dialog.__type=="CREATE"){
		let num = e.charCode;
		if (num >= 65 && num <= 90) num-=39;
		else if (num>=97 && num <= 122) num-=97;
		else return;
		let which = Main.dialog.__arr[num];
		if(which&&which.onclick){
			if (editor.selected.length > 0) editor.deselect();
			Main.dialog.__arr[num].click();
			editor.selectNodes([graph_div.lastChild.nodeId]);
		}
	}
}
else if (k=="c"){
	deselect();
	editor.createNodeDialog({x:editor_div.scrollLeft, y:editor_div.scrollTop});
}
else if (k=="`"){
	if (!editor.selected.length){
		if (last_selected){
			editor.selectNodes(last_selected);
		}
	}
	else{
		deselect();
	}
}

};//»
this.onkill = function() {//«
focused = false;
document.removeEventListener('copy',docopy,false);
document.removeEventListener('cut',docut,false);
document.removeEventListener('paste',dopaste,false);

if (model.playing) model.update(new Stop());


}//»
this.onescape = ()=>{//«
if (Main.dialog){
	Main.dialog.close();
	Main.dialog = null;
	return true;
}
if (editor.selected.length > 0){
//	editor.deselect();
	deselect();
	return true;
}
if (CUR.op==1){
	toggle_cursor();
	return true;
}
return false;
};//»
this.onresize = function() {//«

editor.resize();

}//»
this.onfocus=()=>{//«

focused = true;
//Main.bgcol="#000";
//Main.tcol="#fff";

}//»
this.onblur=()=>{//«

focused = false;
//Main.bgcol="#131313";
//Main.tcol="#e9e9e9";

}//»
this.get_context=()=>{//«
	return [
		`About Noisecraft`, async()=>{
			WDG.popok('Courtesy of: <a href="https://github.com/maximecb/noisecraft">This Github repo</a>');
		}
	]
}//»

//»


}

