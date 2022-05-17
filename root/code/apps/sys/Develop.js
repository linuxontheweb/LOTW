

//Imports«

//const{NS,Core,Desk,main,topwin}=arg;
const{log,cwarn,cerr,api:capi}=Core;
const{fs,util,widgets}=globals;
const{poperr}=widgets;
const{isobj,isstr,make,mkdv,mk,mksp}=util;
const fsapi = NS.api.fs;
//»
//Var«
let servid, servobj, script, win, appobj={};
let filename, filetype;
const noop=()=>{};
//»
//DOM«
let topwin = Main.top;
Main.bgcol="#000";
Main.tcol="#ccc";

topwin.title="Develop";

//»
//Obj/CB«

this.kill = function() {
if (servid !== null) fs.stop_service(servid+"");
if (!win) return;
if (win.obj&&win.obj.kill) win.obj.kill();
}
this.onkeydown=(e,k)=>{
if (!win) return;
if (win.obj&&win.obj.onkeydown) win.obj.onkeydown(e,k);
}
this.onkeypress=(e,k)=>{
if (win.obj&&win.obj.onkeypress) win.obj.onkeypress(e,k);
};
this.onresize=()=>{
if (!win) return;
if (win.obj&&win.obj.onresize) {
	win.main.w = Main.w;
	win.main.h = Main.h;
	win.obj.onresize();
}
};
//»

//Funcs«

const DevelopService=function(){//«
    const exports = {
        name: "Develop",
        winid: topwin.id+"",
        stdin:(arg)=>{
            if (!isstr(arg)) return;
            reload(arg);
        },
		setfile:async arg=>{
			if (arg.EOF) return;
			if (!isstr(arg)&&arg.match(/^\//)) return;
			if (! await fsapi.pathExists(arg)) {
cerr("Path does not exist: "+arg);
				return;
			}
			filename = arg;
		},
		setargs:arg=>{
			if (!(arg&&isobj(arg))) return;
			if (arg.lines&&arg.lines.EOF===true) return;
			let obj = arg.object;
			if (!obj)return;
			appobj=obj;
		}
    };

    this.exports = exports;
    this.kill=()=>{};
    this.setid=(num)=>{
        servid = num;
    }
};
//»

const reload=instr=>{//«
	topwin.status_bar.innerHTML="";
    if (script) script.del();
	if (win) {
		if (win.obj&&win.obj.kill) win.obj.kill();
		win.del();
	}
    NS.devapps["someapp"]=null;
    
    let str = `window[__OS_NS__].devapps["someapp"]=function(arg,NS,globals,Core,Desk,Main){"use strict";${instr}\n}`;
    script = make('script');
    script.onload = async() => {
		let objarg = {
			NAME: "&lt;namehere&gt;",
			APP: "None",
			X:0,
			Y:0,
			WID: 300,
			HGT: 200,
			CB: noop,
			TYPE: "window"
		};
//	    win = Desk.make_window(objarg);
win = mkdv();
win.type="dev-window";
Object.defineProperty(win, "title", {
	get: () => {
		return topwin.namespan.innerHTML.trim();
	},
	set: arg => {
		topwin.namespan.innerHTML = "Develop - "+arg.regstr().replace(/\x20/g, "\xa0");
	}
});
win.status_bar = topwin.status_bar;
win.pos="absolute";
win.loc(0,0);
let mainwin = mkdv();
mainwin.pos="absolute";
mainwin.loc(0,0);
mainwin.w = Main.w;
mainwin.h = Main.h;
win.main=mainwin;
win.img_div=mkdv();
win.namespan=mkdv();
win.add(mainwin);

Main.add(win);

try{
	win.obj = new NS.devapps["someapp"](appobj,NS,globals,Core,Desk,mainwin);
//	win.obj = new NS.devapps["someapp"]({APPOBJ: appobj, NS:NS,CORE:Core,DESK:Desk,TOPWIN:win, MAIN:win.main, topwin:win, main:mainwin});
}
catch(e){
//topwin.barferror(e);
//console.log(e.stack);
Main.innerHTML=`<pre><b>${e.stack}</b></pre>`;
console.error(e);
return;
}
		Desk.set_win_defs(win);
		if (filename){
			let rv = await fsapi.readFile(filename);
			if (rv) {
				let arr = filename.split("/");
				if (filetype=="string") rv= rv.join("\n");
				win.obj.loadfile(rv);
				let name = arr.pop();
				topwin.title = "Develop - "+name;
				win.icon={
					app:"None",
					name:name,
					path:arr.join("/"),
					fullpath:()=>{return filename;}
				};
			}
		}
		
    };
    script.onerror = e => {
cerr(e);
    };
    script.src=URL.createObjectURL(new Blob([str],{type:"application/javascript"}));
    document.head.add(script);
};//»

//»


servobj = new DevelopService();
fs.start_service(servobj,(ret,err)=>{
    if (err||!ret) return cerr("Could not launch the service: " + err);
});

//topwin.set_winname("Develop!")
if (arg.APPOBJ){
	let args = arg.APPOBJ.args;
	filename  = args.file;
	filetype = args.filetype;
	appobj = args.args;
let strargs="None given";
if (appobj){
strargs = "<pre>"+JSON.stringify(appobj,null,"  ")+"</pre>";
}
Main.innerHTML=`
<div style="font-size:21;padding:10px;">
File path: ${filename||"No file"}<br><br>
File type: ${filetype||"None given"}<br><br>
Args: ${strargs}
</div>
`;
//log(win.main);
//cwarn(args);

}
 
/*
//Get some file here 
let icon = {
app: "SomeApp",
name: fname,
path: path,
fullpath:()=>{return (path + "/" + name).regpath();}
}
win.icon=icon;

const open_folder_win = (name, path) => {//«
    let win = open_new_window({
        app: "Folder",
        name: name,
        path: path,
        fullpath: () => {
            (path + "/" + name).regpath()
        }   
    }); 
    winon(win);
}//»
const open_new_window = (icon, cb) => {//«
    if (!(icon.fullpath instanceof Function)) {
        poperr("Fatal:check the error stack in the console!");
        throw new Error("open_new_window()\x20called without a fakeicon with a fullpath function");
        return;
    }
    let useid = null;
    let app = icon.app;
    if (icon.linkapp) app = icon.linkapp;
    if (app == "AppFolder") useid = "win_AppFolder";
    let usemime = null;
    let usename = icon.name;
    if (icon.linkname) usename = icon.linkname;
    let Appobj = {
        PATH: icon.path
    };
    if (icon.service_obj) {
        Appobj.SERVICE_OBJ = icon.service_obj;
        delete icon.service_obj
    }
    let objarg = {
        ID: useid,
        NAME: usename,
        APP: app,
        ROOTTYPE: icon.roottype,
        APPOBJ: Appobj,
        CB: cb,
        TYPE: "window"
    };
    let winargs = icon.winargs;
    let geomstr;
    if (winargs && isnum(winargs.X) && isnum(winargs.Y) && isnum(winargs.WID) && isnum(winargs.HGT)) {
        objarg.X = winargs.X;
        objarg.Y = winargs.Y;
        objarg.WID = winargs.WID;
        objarg.HGT = winargs.HGT;
    } else get_newwin_obj(objarg);
    let win = make_window(objarg);
    win.name = usename;
    win.path = icon.path;
    if (app == "Folder") reload_icons(win);
    icon.win = win;
    win.icon = icon;
    window_off(Desk.CWIN);
    window_on(win);
    return win;
}//»


let winargs = icon.winargs;
let geomstr;
if (winargs && isnum(winargs.X) && isnum(winargs.Y) && isnum(winargs.WID) && isnum(winargs.HGT)) {
    objarg.X = winargs.X;
    objarg.Y = winargs.Y;
    objarg.WID = winargs.WID;
    objarg.HGT = winargs.HGT;
} else get_newwin_obj(objarg);


*/
