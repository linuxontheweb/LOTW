
// Noisecraft is courtesy of https://github.com/maximecb/noisecraft

import { anyInputActive } from '/root/code/mods/av/noisecraft/utils.js';
import { Dialog, errorDialog } from '/root/code/mods/av/noisecraft/dialog.js';
import { Model, Paste, Play, Stop } from '/root/code/mods/av/noisecraft/model.js';
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

editor_div.addEventListener('mousewheel', function(e) {
  e.stopPropagation();
//  e.preventDefault();
/*
  var max = this.scrollWidth - this.offsetWidth; // this might change if you have dynamic content, perhaps some 
  
  if (this.scrollLeft + e.deltaX < 0 || this.scrollLeft + e.deltaX > max) {
    e.preventDefault();
    this.scrollLeft = Math.max(0, Math.min(max, this.scrollLeft + e.deltaX));
  }
*/
}, false);
//editor_div.onscroll=e=>{
//log(e);
//};
layout_div.add(editor_div);

const graph_div = mkdv();
graph_div.pos="absolute";
graph_div.loc(0,0);
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


//»

//Funcs«

const dosave = async()=>{
//log(str);
let path = (Win.fullpath());
let str = model.serialize();
if (path){
//log("SAVING: "+str.length+" bytes");
await FS.saveFsByPath(path, str);
await WDG.popok(`Saved: ${str.length} bytes!`, {win: Win});
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
editor = new Editor(model, editor_div, graph_div, graph_svg, Main);
audioView = new AudioView(model);

//log(model);
//log(editor);
//log(audioView);

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
//    let str = Core.api.bytesToStr(bytes);
	init();
    try
    {
        model.deserialize(Core.api.bytesToStr(bytes));
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
this.onkeydown = function(e,s) {//«

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
/*
let blob = new Blob(
	[str],
	{type: 'application/json'}
);
*/
}
else if (s=="DOWN_"){
//log("Down!");
//graph_div.scrollTop+=100;
//log(graph_div.scrollTop);
//log(graph_div.scrollHeight);
}

}//»
this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«

if (model.playing) model.update(new Stop());


}//»
this.onescape = ()=>{
if (Main.dialog){
Main.dialog.close();
Main.dialog = null;
return true;
}
if (editor.selected.length > 0){
	editor.deselect();
	return true;
}
return false;
};
this.onresize = function() {//«

editor.resize();

}//»
this.onfocus=()=>{//«

//Main.bgcol="#000";
//Main.tcol="#fff";

}//»
this.onblur=()=>{//«

//Main.bgcol="#131313";
//Main.tcol="#e9e9e9";

}//»
this.get_context=()=>{
	return [
		`About Noisecraft`, async()=>{
			this.onblur();
			await WDG.popok('Courtesy of: <a href="https://github.com/maximecb/noisecraft">This Github repo</a>',{win:Win});
			this.onfocus();
		}
	]
}

//»


}

