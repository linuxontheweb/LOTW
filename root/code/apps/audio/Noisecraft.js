
// Noisecraft is courtesy of https://github.com/maximecb/noisecraft

import { anyInputActive } from '/root/code/mods/av/noisecraft/utils.js';
import { Dialog, errorDialog } from '/root/code/mods/av/noisecraft/dialog.js';
import { Model, Paste, Play, Stop , MoveNodes} from '/root/code/mods/av/noisecraft/model.js';
import { Editor } from '/root/code/mods/av/noisecraft/editor.js';
import { AudioView } from '/root/code/mods/av/noisecraft/audioview.js';

//let model = new Model();

// Graph editor view
//let editor = new Editor(model);

// Audio view of the model
//let audioView = new AudioView(model);

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



//Main.bgcol="rgba(1,1,1,0)";
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

const deselect = ()=>{
	last_selected = editor.selected;
	editor.deselect();
};

const dosave = async(force_popup)=>{
let path = (Win.fullpath());
let str = model.serialize();
if (path&&!force_popup){
	await FS.saveFsByPath(path, str);
	await WDG.popok(`Saved: ${str.length} bytes!`);
}
else{
	await WDG.popinarea(str, "File text (.ncft format)", {noCancel:true, readOnly:true});
}

//log(Win.nosave);

};

const init=async()=>{
/*
let wins = Array.from(document.getElementsByClassName("topwin"));
for (let w of wins){
	if (w===Win) continue;
	if (w.app==="audio.Noisecraft"){
//		await WDG.poperr("An instance of Noisecraft is already running... please close it first!", {win: Win});
//		Win.force_kill();
		return;
	}
}
*/
//log(Array.from(wins));

model = new Model();
model.__poperr=WDG.poperr;

editor = new Editor(model, editor_div, graph_div, graph_svg, Main);
audioView = new AudioView(model);

document.addEventListener('copy',docopy,false);
document.addEventListener('cut',docut,false);
document.addEventListener('paste',dopaste,false);

};

//»

//OBJ/CB«

this.onappinit=()=>{//«
//log("APP INIT");

Win.title = "Noisecraft";
init();
model.new();
//log(Main.bgcol);
};//»
this.onloadfile=bytes=>{//«
//	graph_div.innerHTML="Loading file...";
	init();
    try
    {
		setTimeout(()=>{
			model.deserialize(Core.api.bytesToStr(bytes));
		},0);
    }
    catch (e)
    {
        console.log(e.stack);

        // If loading failed, we don't want to reload
        // the same data again next time
//        localStorage.removeItem('latestModelData');

        // Reset the project
        model.new();
    }
//log(str);
};//»
this.onkeydown = async function(e,s) {//«

if (Main.dialog) return;

if (s==="SPACE_"){
	e.preventDefault();
	if (model.playing){
		model.update(new Stop());
	}
	else{
		model.update(new Play());
	}
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
else if (ARROWS.includes(s)){
	let dx=0, dy=0;
	if (s=="RIGHT_") dx = 100;
	else if (s=="LEFT_") dx = -100;
	else if (s=="UP_") dy = -100;
	else if (s=="DOWN_") dy = 100;
	else if (s=="RIGHT_C") dx = 10;
	else if (s=="LEFT_C") dx = -10;
	else if (s=="UP_C") dy = -10;
	else if (s=="DOWN_C") dy = 10;
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
	else{
editor_div.scrollTop+=dy;
editor_div.scrollLeft+=dx;

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
else if (k=="n"){
	deselect();
//	editor.deselect();
//	editor.createNodeDialog({x:editor_div.scrollLeft+Math.round(editor_div.offsetWidth/2)-50, y:editor_div.scrollTop+Math.round(editor_div.offsetHeight/2)-50});
	editor.createNodeDialog({x:editor_div.scrollLeft, y:editor_div.scrollTop});

}
else if (k=="`"){
	if (!editor.selected.length){
		if (last_selected){
			editor.selectNodes(last_selected);
		}
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

