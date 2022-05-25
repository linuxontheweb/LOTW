
export const app = function (arg) {


//Decs«

//const log=(...args)=>console.log(...args);
//const wrn=(...args)=>console.warn(...args);
//const cwarn=wrn;
//const err=(...args)=>console.error(...args);
//const cerr=err;

const {Core, Main, NS}=arg;
const{api:capi,KC,kc,log,cwarn,cerr,globals,Desk}=Core;
const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp}=util;
const {fs}=NS.api;
const {poperr}=globals.widgets;

const NUM = Number.isFinite;


//const {mixer, ctx}=globals.audio;

let service_obj;
let speaker_gain;
let volume_inc = 0.025;
let muted;
//»

//DOM«

const mn = Main;
const tw = mn.top;
mn.bgcol="#331717";
mn.tcol="#ccc";
mn.fw="bold";

const sb = tw.status_bar;
sb.fw="bold";
sb.dis="flex";
sb.style.flex="1 1 auto";
sb.style.justifyContent="space-between";
sb.ff="monospace";
sb.fs=16;
sb.padt="2px";
const statbar = mkdv();
sb.add(statbar);

const volbar = mkdv();
volbar.padr=8;
sb.add(volbar);

const path_div = mkdv();
path_div.fs=23;
path_div.padt=5;
path_div.padl=10;
mn.add(path_div);

let NODE_DIVS = {};

const KIDWINS = [];

let current_mod;

let edit_stdin_cb = Core.get_appvar(tw, "EDIT_STDIN_CB");

//»

//DOM Makers«

const make_node = (node, mod) =>{//«
	node._winobj= this;
	let which = node._type;
	let usenode = node;
	let name = node._name;
	if (which=="Sym") {
		usenode = node.ref;
		which = usenode._type;;
	}
const render = ()=>{//«
	if (usenode._type=='Module'){
		let obj = usenode.service_obj;
		let fname = obj.module_path.split("/").pop();
		stat(`${name}:\x20id=${obj.id}\x20\x20file=${fname}`);
		return;
	}
	let out = '';
	if (node._type=="Sym") out = `sym=${node._modname}.${node.ref._name}\x20\x20`;

	if (which=="Noise") out = `${out}\x20\x20type=${usenode._noisetype}`;
	else {
		let ftyp=null;
		let isfilt=false;
		if (which=="BQF") {
			ftyp = usenode.type;
			isfilt=true;
		}
		for (let k in usenode){
			let p = usenode[k];
			let s;
			if (p instanceof AudioParam){
				if (isfilt&&(k=='Q'||k=="gain")){
					if (k=='Q'){
						if (ftyp=="lowshelf"||ftyp=="highshelf")continue;
					}
					else{
						if (!(ftyp=="lowshelf"||ftyp=="highshelf"||ftyp=="peaking"))continue;
					}
				}
				s = `${k.substr(0,4)}=${p.value.toFixed(3)}`
			}
			else if (k==='type'){
				s = `type=${p}`;
			}
			else continue;

			if (!out) out = s;
			else out = `${out}\x20\x20${s}`;
		}
	}
	stat(`${name}:\x20${out}`);
};//»
	let d = mkdv();
	d.dis="inline-block";
	d.bor = "1px solid gray";
	d.pad = 5;
 	d.marr = 5;
 	d.marb = 5;
	d.minw=80;
	const nm = mkdv();
	nm.dis="inline-block";
	nm.fs=18;
	nm.fw="bold";
	nm.innerText = `${name}\x20\x20(${which})`;
	node.off=()=>{
		d.bor = "1px solid gray";
		stat();
	};
	node.on=()=>{
		d.bor = "1px solid #ffc";
		d.scrollIntoViewIfNeeded();
		render();
	};
	node._domelem = d;
	d._node = node;

d.onclick=async ()=>{//«
	if (usenode._type=='Module') {
		get_node_div(current_mod).dis="none";
		current_mod = usenode.service_obj;
		let dv = get_node_div(current_mod);
		dv.dis="block";
		if (dv._curnode >= 0) dv._nodes[dv._curnode].on();

		path_div.innerHTML+="\x20/\x20"+current_mod.id;
		return;
	}
	if (usenode._window){
		usenode._window.zup();
		return;
	}
	let win = await Desk.openApp("audio.XSynth", true, {WID:400,HGT:300}, {NODE: usenode});
	KIDWINS.push(win);
};//»

d.onmouseover=()=>{//«
	let dv = get_node_div(current_mod);
	let curnode = dv._nodes[dv._curnode];
	d.style.cursor="pointer";
	if (curnode===d) return;
	curnode.off();
	let num = dv._nodes.indexOf(node);
	dv._curnode = num;
	node.on();
};//»

	d.add(nm);

	let ndiv = get_node_div(mod);
	if (!ndiv._nodes.length){
		ndiv._curnode = 0;
		node.on();
	}
	ndiv._nodes.push(node);
	ndiv.add(d);

};//»

const make_br=(mod)=>{//«
	let ndiv = get_node_div(mod);
	let brdiv = mkdv();
	brdiv.className="break";
	brdiv.add(mk('br'));
	ndiv.add(brdiv);
};//»

const init_node_div=objarg=>{//«
	let d = mkdv();
	d.pad=10;
	d.dis="none";
	mn.add(d);
	let useobj = objarg||service_obj;
	d._nodes = [];
	d._curnode = -1;
	NODE_DIVS[useobj.id]=d;
};//»

const init_interface = ()=>{//«
	init_node_div();
};//»

//»

//«Util

const togmute=()=>{
	let v = speaker_gain.value;
	if (muted === false){
		muted = v;
		speaker_gain.value = 0;
	}
	else{
		speaker_gain.value = muted;
		muted = false;
	}
	statvol();
};
this.toggle_mute = togmute;

const volup=()=>{
	let v = speaker_gain.value;
	v+=volume_inc;
	if (v>1) v = 1;
	speaker_gain.value = v;
	statvol();
};
this.volume_up = volup;

const voldn=()=>{
	let v = speaker_gain.value;
	v-=volume_inc;
	if (v < 0) v=0
	speaker_gain.value = v;
	statvol();
};
this.volume_dn = voldn;

const setvol=(v)=>{
	if (!NUM(v)) return;
	if (v > 1) v = 1;
	else if (v < 0) v=0
	speaker_gain.value = v;
	statvol();

};
this.set_volume = setvol;

const get_node_div = mod =>{
	if (!mod || mod===service_obj) return NODE_DIVS[service_obj.id];
	if (!NODE_DIVS[mod.id]) init_node_div(mod);
	return NODE_DIVS[mod.id];
};

const kill_service = ()=>{
	if (service_obj){
//		globals.fs.stop_service(service_obj.id);
		service_obj.onkill();
		service_obj=null;
	}
};
const statvol=()=>{
	if (!speaker_gain) return;
	if (muted!==false) volbar.innerHTML="Muted";
	else volbar.innerHTML=`Vol:\x20${Math.round(100*speaker_gain.value)}%`;
};
const stat=s=>{statbar.innerHTML=s;};
const staterr=(s,lno)=>{//«
	stat(`<span style="color:#fcc;">${s}</span>`);
};//»

//»

const init = async str => {//«
	muted = false;
	if (!await capi.loadMod("av.synth")){
Main.innerHTML = "Could not load module 'av.synth'!";
	}
//log(obj);

//	let obj = await globals.fs.start_service('synth');
//	let avmod  = new NS.mods["av.synth"](Core);
	let obj = NS.mods["av.synth"](Core).get_synth();
//log(mod);
	obj.is_app = true;
	obj.errout = staterr;
	obj.make_node = make_node;
	obj.make_br = make_br;
	obj._top = obj;
	obj.id="main";
	service_obj = obj;
	init_interface();
	let rv = await service_obj.parse(str);
	if (!rv) return;
	if (obj.speaker){
		speaker_gain = obj.speaker.gain;
	}
	let stdin_func = (str, cb) =>{
		if (str===null) {
			edit_stdin_cb = cb;
			return;
		}
		kill_service();
		for (let k in NODE_DIVS) NODE_DIVS[k].del();
		NODE_DIVS={};
		stat("Reloading...");
		volbar.innerHTML="";
		init(str);
		cb(stdin_func);
	}
	obj.exports.stdin = stdin_func;
	if (edit_stdin_cb){
		edit_stdin_cb(stdin_func);
	}
//	stat("Success");
	statvol();
	path_div.innerHTML=obj.id;
	get_node_div().dis="block";
	current_mod = obj;
};//»

//OBJ/CB«

this.onloadfile=bytes=>{init(Core.api.bytesToStr(bytes));};
this.onload=()=>{
	if (arg.TEXT) init(arg.TEXT);
};
this.onfocus=()=>{};
this.onescape=()=>{return false;};

this.onkill=(if_reload)=>{//«
	for (let w of KIDWINS) w.force_kill();
	kill_service();

	delete NS.mods['av.synth'];
	NS.mods['av.synth']=undefined;

	delete NS.apps['audio.XSynth'];
	NS.apps['audio.XSynth']=undefined;

	if (if_reload && edit_stdin_cb){
	    Core.set_appvar(tw, "EDIT_STDIN_CB", edit_stdin_cb);
	}
};//»

this.onkeydown=(e,s)=>{//«
	if (!service_obj) return;
	let trg = service_obj.TRIGGERS[s];
	if (trg) return trg();

let d = get_node_div(current_mod);
if (!d._nodes.length) return;

if (s=="BACK_"){//«

	if (current_mod === service_obj) return;
	d.dis="none";
	current_mod = current_mod._parent;
	d = get_node_div(current_mod)
	d.dis="block";

	let arr = path_div.innerHTML.split(/\x20\/\x20/);
	arr.pop();
	path_div.innerHTML = arr.join("\x20/\x20");

	if (d._curnode!=-1) d._nodes[d._curnode].on();

	return;
}//»

if (s=="ENTER_"){
	if (d._curnode===-1) return;
	d._nodes[d._curnode]._domelem.click();
	return;
}
else if (s=="RIGHT_"){
	if (d._curnode!==-1) d._nodes[d._curnode].off();
	d._curnode++;
	if (d._curnode == d._nodes.length) d._curnode=0;
	d._nodes[d._curnode].on();
	return;
}
else if (s=="LEFT_"){
	if (d._curnode!==-1) {
		d._nodes[d._curnode].off();
		d._curnode--;
	}
	if (d._curnode == -1) d._curnode=d._nodes.length-1;
	d._nodes[d._curnode].on();
	return;
}
else if (s=="DOWN_"){//«
	if (d._curnode==-1) {
		d._curnode=0;
		d._nodes[0].on();
		return;
	}

	let node = d._nodes[d._curnode];
	node.off();
	let next = node._domelem.nextSibling;
	let gotbr = false;
	let iter=0;
	while (next){
		iter++;
		if (iter>100000){
console.error("Infinite Loop!?!?!?!");
			break;
		}
		if (next.className=="break") {
			gotbr=true;
			next = next.nextSibling;
			continue;
		}
		if (gotbr) break;
		next = next.nextSibling;
	}
	if (!next || next.className=="break"){
		d._curnode = 0;
		d._nodes[0].on();
	}
	else{
		node = next._node;
		let num = d._nodes.indexOf(node);
		d._curnode = num;
		node.on();
	}
	return;
}//»
else if (s=="UP_"){//«
	if (d._curnode==-1) {
		d._curnode=0;
		d._nodes[0].on();
		return;
	}

	let node = d._nodes[d._curnode];
	node.off();
	let prev = node._domelem.previousSibling;
	let gotbr = false;
	let iter=0;
	while (prev){
		iter++;
		if (iter>100000){
console.error("Infinite Loop!?!?!?!");
			break;
		}
		if (prev.className=="break") {
			gotbr=true;
			prev = prev.previousSibling;
			continue;
		}
		if (gotbr) {
			while (prev.previousSibling && prev.previousSibling.className!="break") prev = prev.previousSibling;
			break;
		}
		prev = prev.previousSibling;
	}
	if (!prev || prev.className=="break"){
		let last = d._nodes[d._nodes.length-1]._domelem;
		while (last.previousSibling && last.previousSibling.className!="break") last = last.previousSibling;
		let node = last._node;
		let num = d._nodes.indexOf(node);
		d._curnode = num;
		node.on();
	}
	else{
		node = prev._node;
		let num = d._nodes.indexOf(node);
		d._curnode = num;
		node.on();
	}
	return;
}//»


if (!speaker_gain) return;
if (s=="SPACE_") togmute();
if (muted!==false) return
if (s=="=_") volup();
else if (s=="-_") voldn();

};//»


//»

}










/*OLD//«

this.onmidiknob=(e)=>{
	let num = e.knob;
	let val = e.val;
	KNOBVALS[num] = val;
	let knob = KNOBS[num+""];
	if (knob) knob(val);
}
this.onmidikeydown=e=>{
	let f = MIDIKEYDOWNS[e.key+""];
	f&&f();
};
this.onmidikeyup=e=>{
	let f = MIDIKEYUPS[e.key+""];
	f&&f();
};

//Need to use MIDIKEYUPS, MIDIKEYDOWNS and KNOBVALS from service_obj, just like with TRIGGERS.

const NODES={};
const KNOBS={};
const MIDIKEYDOWNS={};
const MIDIKEYUPS={};
const KNOBVALS=(globals.AppVars["Synth-KNOBVALS"]||[]);

const make_node = (node) =>{//«
	let which = node._type;
	let name = node._name;
	const d = mkdv();
	d.dis="inline-block";
	d.bor = "1px solid gray";
	d.pad = 5;
 	d.marr = 5;
 	d.marb = 5;
	d.minw=140;
	d.tabIndex="0";
	const nm = mkdv();
	nm.dis="inline-block";
	nm.fs=21;
	nm.fw="bold";
	nm.innerText = `${name}\x20\x20(${which})`;
	d.add(nm);
	const pr = mkdv();
	pr.dis="none";
	d.add(mk('br'));
	d.add(pr);
	if (which==="Osc") make_osc(node, name, pr, d);
	else if (which==="Tone") make_tone(node, name, pr, d);
	d.active=false;
	d.onblur=()=>{
//		if (d.active) d.toggle();
	};
	d.toggle=()=>{
		d.active = !d.active;
		if (d.active) {
			nm.tcol = "#eee";
			pr.dis="inline-block";
		}
		else {
			nm.tcol = "";
			pr.dis="none";
		}
	};
	node_div.add(d);
};//»
const init_speaker = ()=>{//«

let dv = mkdv();
dv.fs=21;

dv.pad=10;
let nm = mksp();
nm.innerText="Volume:\x20";
let val = mksp();
let rng = spk_range;
rng.w="100%";
rng.type="range";
rng.value = 100*speaker_gain.value;
val.innerText = Math.round(rng.value)+"%";
rng.oninput = e =>{
	speaker_gain.linearRampToValueAtTime(rng.value/100, ctx.currentTime+0.05);
	val.innerText = Math.round(rng.value)+"%";
};
dv.add(nm);
dv.add(val);
dv.add(rng);
mn.add(dv);

};//»

//Makers«

const make_prop = (which, vals, node, tbl, par)=>{//«

let r = mk('tr');
let t = mk('td');
t.innerText=which;
r.add(t);

t = mk('td');
let sel = mk('select');
sel.w=100;
for (let v of vals){
	let opt = mk('option');
	opt.innerText = v;
	if (node.type===v) opt.selected=true
	sel.add(opt);
}
sel.onchange=e=>{
	node[which] = sel.value;
};
t.add(sel);
r.add(t);
sel.focusParent = par;
tbl.add(r);

};//»

const make_param = (which, param, tbl, par, opts={})=>{//«
let r = mk('tr');

let t = mk('td');
t.innerText=which;
r.add(t);

t = mk('td');
let n = mk('input');
n.w=100;
n.type="number";
n.focusParent = par;
t.add(n);
r.add(t);
//n.value = param.value;
n.value = param.value.toFixed(3);

n.onchange=e=>{//«

let val = parseFloat(n.value);
if (!isFinite(val)){
	n.value = param.value;
	return;
}
if (val < 0 && !opts.okneg) {
	val = 0;
	n.value = "0";
}
if (val < param.minValue || val > param.maxValue) {
	n.value = param.value.toFixed(3);
	return;
}
param.value = val;

};//»

tbl.add(r);
return n;

};//»

const make_prop_table = elm =>{//«
	let t = mk('table');
	elm.add(t);
	return t;
};//»

const make_osc=(node, name, elm, par)=>{//«

	let t = make_prop_table(elm);
	make_prop('type', ['sine','triangle','square','sawtooth'], node, t, par);
	make_param('freq', node.frequency, t, par);
	make_param('detu', node.detune, t, par);

};//»

const make_tone=(node, name, elm, par)=>{//«

	let t = make_prop_table(elm);

	let all = node.getargs();
	for (let arr of all){
		let inp = make_param(arr[0], arr[1], t, par);
		inp.setAttribute('step',0.05);
//log(inp);
	}

};//»

//»

//OBJ/CB«

this.onkill=()=>{
	globals.AppVars["Synth-KNOBVALS"]=KNOBVALS;
//	killed = true;
	if (service_obj){
		globals.fs.stop_service(service_obj.id);
		service_obj=null;
	}
};

this.onloadfile=async bytes=>{
	let str = Core.api.bytesToStr(bytes);
	let obj = await globals.fs.start_service('synth');
	obj.is_app = true;
	obj.errout = staterr;
	obj.make_node = make_node;
	obj.make_br = make_br;
	service_obj = obj;
	let rv = await service_obj.parse(str);
	if (!rv) return;
	mn.focus();
	if (obj.speaker){
		speaker_gain = obj.speaker.gain;
	}
	init_interface();
};
this.onmidikeydown=e=>{
	let f = MIDIKEYDOWNS[e.key+""];
	f&&f();
};
this.onmidikeyup=e=>{
	let f = MIDIKEYUPS[e.key+""];
	f&&f();
};
this.onfocus=()=>{
	mn.focus();
};
this.onescape=()=>{
	let a = act();
	if (a===mn) return false;
	else if (a.focusParent) a.focusParent.focus();
	else {
		if (a.active) a.toggle();
		mn.focus();
	}
	return true;
};
this.onkeydown=(e,s)=>{
	if (!service_obj) return;
	let trg = service_obj.TRIGGERS[s];
	if (trg) return trg();
	let a = act();
	if (a===mn||a===spk_range){
		if (s=="RIGHT_"||s=="LEFT_"){
			spk_range.focus();
		}
//		else if (s=="SPACE_"){
//			toggle_connect();
//		}
		else if (s=="v_"){
//			let fpar = a.focusParent;
//			if (fpar&&fpar.toggle&&fpar.toggle instanceof Function){
//				fpar.toggle();
//			}
//			else if (a.active) a.toggle();
//			spk_range.focus();
		}
	}
	else{
		if (s=="ENTER_"){
			if (a.toggle instanceof Function){
				a.toggle();
			}
		}
	}

};
this.onmidiknob=(e)=>{
	let num = e.knob;
	let val = e.val;
	KNOBVALS[num] = val;
	let knob = KNOBS[num+""];
	if (knob) knob(val);
}

//log(KNOBVALS);

//»

const statvol=()=>{if(!mixer_plug)return stat("Disconnected");stat(`Volume:\x20${Math.round(100*speaker_gain.value)}%`);};
const getnodes=()=>{let arr=[];for(let k in NODES)arr.push(NODES[k]);return arr;}
const toggle_pause=()=>{//«
	if (!paused){
		for (let n of getnodes()){
			if (n.pauseonly) n.pauseonly();
		}
		paused=true;
		stat("Paused");
	}
	else{
		for (let n of getnodes()){
			if (n.unpause) n.unpause();
		}
		paused = false;
		stat("Playing");
	}
}//»
const toggle_connect=()=>{//«
	if (mixer_plug){
		mixer_plug.disconnect();
		mixer_plug=null;
for (let n of getnodes()){
if (n.pauseonly) n.pauseonly();
}
//		killed=true;
		stat("Disconnected");
	}
	else{
//		killed=false;
for (let n of getnodes()){
if (n.unpause) n.unpause();
}
		mixer_plug = mixer.plug_in(speaker);
		stat("Connected");
	}
}//»

//»*/



