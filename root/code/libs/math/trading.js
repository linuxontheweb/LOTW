

const MTRADING = "math.trading";
let trad;
let mods;
let tf;

export const lib = (comarg, args, Core, Shell)=>{

const coms={//«

tf:async()=>{//«

if (!mods["math.tf"]){
	if (!await capi.loadMod("math.tf")) return cberr("Could not load math.tf!");
}
let tf;
if (!globals.tf){
	globals.tf = new mods["math.tf"]().tf;
}
tf = globals.tf;
//log(tf);
let s ='';
let keys = tf.keys;
let funcs=[];
let objs=[];
let strings=[];
for (let k of keys){
let ent = tf[k];
let t = typeof ent;
if (t==="string") strings.push(k);
else if (t==="object") {
	if (ent.keys) objs.push(`${k}:\n    ${ent.keys.join("\n    ")}`);
	else objs.push(`${k}: [none]`);
}
else if (t==="function") funcs.push(k);
else cwarn(t, ent);
}
wout("Objects:\n  "+objs.join("\n  ")+"\n ");
wout("Functions:\n  "+funcs.join("\n  ")+"\n ");
//wout(s);
//wout(tf.keys.join("\n"));
cbok();


},
//»
tech:async()=>{//«

let opts = failopts(args,{SHORT:{t:1}});
if (!opts) return;
if (!mods[MTRADING]){
	if (!await capi.loadMod(MTRADING)) return cberr("Could not load math.trading!");
}
trad = new mods[MTRADING]();
wout(Object.keys(trad).join("\n"));
cbok();


}//»

}//»

/*«
let path = args.shift();
if (!path) return cberr("Need a filename!");

let dat = await fsapi.readFile(normpath(path), {FORCETEXT: (!!opts.t)});
if (!dat) return cberr("File not found: "+path);

if (dat instanceof Blob) return cberr("Use '-t' to force text (got a Blob instead)!");
»*/

//const coms_help={//«
//}
//»

if (!comarg) return Object.keys(coms)

/*
//if (!args) return coms_help[com];
//if (!coms[com]) return cberr("No com: " + com + " in math.trading!");
//if (args===true) return coms[com];
*/

//Imports«

const{NS,xgetobj,globals,log,cwarn,cerr}=Core;
const{fs,util,widgets,dev_env,dev_mode}=globals;
const{strnum,isarr,isobj,isstr,mkdv}=util;
const {
	readFile,
	get_reader,
	fmt,
	read_stdin,
	woutobj,
	woutarr,
	get_path_of_object,
	pathToNode,
	read_file_args_or_stdin,
	serr,
	normpath,
	cur_dir,
	respbr,
	get_var_str,
	refresh,
	failopts,
	cbok,
	cberr,
	wout,
	werr,
	termobj,
	wrap_line,
	kill_register,
	EOF,
	ENV
} = Shell;
const fsapi=NS.api.fs;
const capi = Core.api;
const fileorin = read_file_args_or_stdin;
const stdin = read_stdin;
const NUM = Number.isFinite;

//»

mods=NS.mods;

coms[comarg](args);


}




