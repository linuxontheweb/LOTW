

//Imports«
const{api:capi,log,cwarn,cerr,fs_url}=Core;
const{util}=globals;
const{make}=util;
//»

//Var«

const MAX_LINK_ITERS = 16;
const mnt_path = globals.home_path+"/mnt";
const rootid = "0";
const root_path = mnt_path+"/"+rootid;
const fs_tops = [ "bin", "lib", "tmp", "var", "etc", "home", "root", "sbin", "usr" ];
const DIRAPP = "sys.Explorer";

//»

//DOM«

Main.bgcol="#000";

//»

this.onkill=()=>{
	Core.set_appvar(Main.top, "TERMWIN", _main);
};

//Util«

const isStr=v=>{return (typeof v === "string" || v instanceof String);};
const isPath=v=>{return (isStr(v)&&v[0]==="/");};

//»

//Fs«

const mkSysDir=path=>{return new Promise((Y,N)=>{globals.fs_root.getDirectory(path,{create:1},Y,N);});};
const getRoot=id=>{return new Promise(async(Y,N)=>{let mnt=await mkSysDir((mnt_path).slice(1));mnt.getDirectory(id,{create:1},Y,N);});};

const mkFsDir=(path,excl)=>{return new Promise((Y,N)=>{let o={create:true};if(excl)o.exclusive=true;root.getDirectory(path,o,Y,N);});};
const mkFsDirExcl=path=>{return mkFsDir(path,true);}
const _getFsEntry=(path,opts={})=>{//«
	return new Promise((Y,N)=>{
		let url;
		if (!path){
			if (opts && opts.par) url = opts.par.entry.fullPath;
			else throw new Error("No path or opts.par!");
		}
		else url = fs_url(`${root_path}${path}`);
		webkitResolveLocalFileSystemURL(url,Y,(e)=>{
			if (opts.reject) return N(e);
			NS.error.message=e;
			Y();
		});
	});
};//»
const statFsFile = (path, opts={}) => {//«
return new Promise(async(Y,N)=>{

let {getlink,getdir}=opts;
if (getlink&&getdir) return N("Cannot specify both 'getlink' and 'getdir'");

if (!isPath(path)) return N("Invalid path");
if (path.match(/\.lnk$/)) return N("Cannot directly stat a file with a '.lnk' suffix");
path = path.replace(/[^\/]+\/+$/,"").replace(/\/+/g,"/");
let arr = path.split("/");
arr.shift();
let top = arr.shift();
if (!top) return Y(root);
if (!fs_tops.includes(top)) return N(`${top}:\x20not a toplevel directory`);
if (!arr.length) return Y(_getFsEntry(`/${top}`));

let name=arr.shift();
let curpath=`/${top}`;
let islink = false;
let ent;
let link_iters;
let inf_loop=0;
let INF_LOOPS=10000;
while(name){
	inf_loop++;
	if (inf_loop >= INF_LOOPS) return N(`Infinite loop protection activated ${INF_LOOPS} (code: UJR467)`);
	ent = await _getFsEntry(`${curpath}/${name}.lnk`);
	if (ent){
		curpath = await readFsFile(ent);
		if (!isPath(curpath)) return N(`Invalid path from link '${curpath}/${name}'`);
		curpath = curpath.replace(/[^\/]+\/+$/,"").replace(/\/+/g,"/");
		if (!islink) link_iters=0;
		else {
			link_iters++;
			if (link_iters >= MAX_LINK_ITERS) return N(`The number of internal link traversals exceeded the maximum (${MAX_LINK_ITERS})`);
		}
		islink = true;
	}
	else{
		let path = `${curpath}/${name}`;
		ent = await _getFsEntry(path);
		if ((!ent)||(arr.length && !ent.isDirectory)) return N(`${path}:\x20invalid path 1`);
		curpath = `${curpath}/${name}`
		islink = false;
	}
	name=arr.shift();
}
if (getlink){
	if (!islink) return N("The entry is not a link");
	return Y(ent);
}
if (islink) {
	ent = await _getFsEntry(curpath);
	if (!ent) return N(`${curpath}:\x20invalid path 2`);
}
if (getdir && !ent.isDirectory) return N("The entry is not a directory");
Y(ent);


});
};//»
const statFsDir=(path,opts={})=>{opts.getdir=true;return statFsFile(path,opts);};

const readFsFileData=(path, opts={})=>{//«
return new Promise(async(Y,N)=>{


	let fent = await _getFsEntry(path, opts);
	if (!fent) return Y();
	if (!fent.isFile){
		let mess = `The entry is not a File! (isDirectory==${fent.isDirectory})`;
		if (opts.reject) return N(mess);
		else{
			NS.error.message=mess;
			Y();
			return;
		}
	}
	let file = await _getFsFileFromEntry(fent);
	if (!file) throw new Error("Could not get filesystem File object from the Entry");
	Y(await _readFsFile(file, opts.format, opts.start, opts.end));


});
};//»
const getFsDirKids=(path, opts={})=>{//«
return new Promise(async(Y,N)=>{

	let cb = opts.streamCb;
	let dent = await _getFsEntry(path, opts);
	if (!dent) return Y();
	if (!dent.isDirectory){
		let mess = `The entry is not a Directory! (isFile==${dent.isFile})`;
		if (opts.reject) return N(mess);
		else{
			NS.error.message=mess;
			Y();
			return;
		}
	}
	let rdr = dent.createReader();
	let entries=[];
	const do_read_entries=()=>{
		return new Promise((Y,N)=>{
			rdr.readEntries(arr=>{
				if (cb) cb(arr);
				if (!arr.length) return Y();
				entries = entries.concat(arr);
				return Y(true);
			});
		});
	};
	while(await do_read_entries()){}
	Y(entries);

});
};//»

const _getFsFileFromEntry=(ent)=>{return new Promise((Y,N)=>{ent.file(Y);});};
const writeFsFile=(fent,val)=>{//«
return new Promise(async(Y,N)=>{

fent.createWriter(writer=>{
	let truncated=false;
	writer.onerror=N;
	writer.onwriteend=e=>{
		if (!truncated){
			truncated=true;
			writer.truncate(writer.position);
			return;
		}
		Y(writer.position);
	};
	if (!(val instanceof Blob)) val = new Blob([val]);
	writer.write(val);
})

});
};//»
const readFsFile=fent=>{//«
return new Promise(async(Y,N)=>{

fent.file(file=>{
let rdr = new FileReader();
rdr.onloadend=e=>{
Y(e.target.result);
};
rdr.readAsText(file);
},N);


});
};//»
const createFsFile=(dent,name,excl)=>{//«
return new Promise(async(Y,N)=>{

	if (name.match(/\.lnk$/)) return N("'.lnk' is a reserved extension");
	let o ={create:true};
	if (excl) o.exclusive=true;
	dent.getFile(name,o,Y,N);

});
}//»
const createFsFileExcl=(dent,name)=>{return createFsFile(dent,name,true);}
const createFsLink=(dent, name, val, excl)=>{//«
return new Promise(async(Y,N)=>{

	if (!isPath(val)) return N("Invalid link target");
	if (name.match(/\.lnk$/)) return N("'.lnk' is a reserved extension");
	let o ={create:true};
	if (excl) o.exclusive=true;
	dent.getFile(`${name}.lnk`,o ,async fent=>{
		await writeFsFile(fent, val);
		Y(ent);
	},N);

});
}//»
const createFsLinkExcl=(dent, name, val)=>{return createFsLink(dent,name,val,true);}

const _readFsFile=(file,format,start,end)=>{//«
	return new Promise(async(Y,N)=>{
		const OK_FORMATS=["blob","bytes","text","binarystring","dataurl","arraybuffer"];
		const def_format="arraybuffer";
		if (!format) {
cwarn("Format not given, defaulting to 'arraybuffer'");
			format=def_format;
		}
		if (!OK_FORMATS.includes(format)) return N(`Unrecognized format: ${format}`);
		let reader = new FileReader();
		reader.onloadend = function(e) {
			let val = this.result;
			if (format==="blob") return Y(new Blob([val],{type: "blob"}));
			if (format==="bytes") return Y(new Uint8Array(val));
			return Y(val);
		};
		if (Number.isFinite(start)) {
			if (Number.isFinite(end)) {
				file = file.slice(start, end);
			}
			else file = file.slice(start);
		}
		if (format==="text") reader.readAsText(file);
		else if (format=="binarystring") reader.readAsBinaryString(file);
		else if (format=="dataurl") reader.readAsDataURL(file);
		else reader.readAsArrayBuffer(file);
	});
};//»

//»

//Init«
const root = await getRoot(rootid);
const Root = {name: "/", app: DIRAPP, kids: {}, root: true, entry: root};
Root.par=Root;
const Rkids=Root.kids;

for (let d of fs_tops) {
	let r = await mkFsDir(d);
	let o = {name:d, app: DIRAPP, kids:{}, entry: r};
	o.par=Root;
	Rkids[d]=o;
}
//»


let termid = `${Main.top.id}_Terminal`;
let rv = await fetch(Core.sys_url("/apps/sys/Terminal.js"));
//log(Main.top.id);
let app_str = `window[__OS_NS__].apps["${termid}"] = function (arg,NS,globals,Core,Desk,Main){(async()=>{"use strict";${await rv.text()}\n})()}`;
let _main =  Core.get_appvar(Main.top, "TERMWIN");

let termobj;
let response;

const execute=(str,curdir,opts={})=>{
	const strout=(s)=>{
		response({SUCC:[s]});
	};
	return new Promise((Y,N)=>{
		if (str==="pwd") strout(curdir);
		else strout(str.length+"");
		Y(0);
	});
};
const shell={
	execute:execute
};
const _arg={
	is_core_app:true,
	get_shell:()=>{
		return shell;
	}
};
const username="slice";
const _Core={
	get_username:()=>{return username;},
	api:Core.api,
	save_shell_com:Core.save_shell_com,
	do_update:()=>{},
	get_appvar:Core.get_appvar,
	set_appvar:Core.set_appvar,
	KC:Core.KC,
	kc:Core.kc,
	log:log,
	cwarn:cwarn,
	cerr:cerr
};
let is_reload=true;
if (!_main) {
	is_reload=false;
	_main = make('div');
	_main.top=Main.top;
	_main.pos="absolute";
	_main.w="100%";
	_main.h="100%";
	_main.loc(0,0);
	Main.add(_main);
	await capi.makeScript(URL.createObjectURL(new Blob([app_str])));
	let _globals = {util:util,fs:globals.fs};
	_globals.home_path = `/home/${username}`;

	_main.obj = new NS.apps[termid](_arg, NS, _globals, _Core, null, _main);
}

Main.add(_main);
termobj=_main.obj;
response=termobj.response;
this.onkeydown=(e,sym,mod)=>{
	termobj.onkeydown(e,sym,mod)
;}
this.onkeypress=(e)=>{termobj.onkeypress(e);}
this.onkeyup=(e,sym)=>{termobj.onkeyup(e,sym);}
this.onresize=(a1,a2,a3,a4)=>{termobj.onresize(a1,a2,a3,a4);};

if (is_reload){
	termobj.set_shell(shell);
}
Main.top.title="Core";
