
//Imports«

let _;
let fsapi = NS.api.fs;

//const Core = arg.CORE;
//const _Desk = Core.DESK;

_=Core;
const log = _.log;
const cwarn = _.cwarn;
const cerr = _.cerr;
const{gbid}=Core.api;

_=globals;

const fs = _.fs;
const _root = fs.root;
const checkit=(num)=>{
console.log(`CHECK ${num}`,!!_root.KIDS.home.KIDS.test);
};
//log("ROOT",_root);

const util = _.util;
_=util;
const isobj = _.isobj;
const isstr = _.isstr;
//const gbid = _.gbid;
const make = _.make;

//let Desk=null;
let _Desk = null;
let did_init;

//»

//Var«

const BRANCH_NAME = "test";

const noprop=e=>{e.stopPropagation();}
const main = Main;
const topwin = main.top;
topwin.constant_resize = true;
topwin.constant_move = true;
const winid = topwin.id;
main.bgcol="#210";
//main.pos="relative";
//main.onmousemove=noprop;
//main.onmouseup=noprop;
main.onmousedown=noprop;
main.onclick=noprop;
main.ondblclick=noprop;
main.onmouseover=noprop;
main.onmouseenter=noprop;
main.onmouseleave=noprop;

//main.over = "hidden";
let killed = false;
let w = main.clientWidth;
let h = main.clientHeight;
topwin.over="hidden";
let servobj;
let servid=null;
let fs_root;
let script;

let home_path = "/home/"+Core.get_username();
let desk_path = home_path+"/Desktop";


let keysyms={//«
"`_A": {"ON":1,"NAME": "window_cycle"},
"x_CAS": {"ON": 0, "NAME": "clear_system_cache"},
"c_CA": {"ON":1,"NAME": "toggle_desktop"},
"f_CA":{"ON":1,"NAME": "create_new_folder"},
"o_A": {"ON":1,"NAME": "open_file"},
"t_A": {"ON":1,"NAME": "open_terminal"},
"p_CAS": {"ON":1, "NAME": "reload_app_window"},
"s_A":{"ON":1, "NAME": "save_window"},
"x_A": {"ON":1, "NAME": "close_window"},
"z_A": {"ON":1, "NAME": "minimize_window"},
"m_A": {"ON":1,"NAME": "maximize_window"},
"f_CAS": {"ON":1,"NAME": "fullscreen_window"},
"l_CAS": {"ON":1,"NAME": "toggle_win_layout_mode"},
"r_CAS": {"ON":1,"NAME": "rename_icon"},
"BACK_C": {"ON": 1, "NAME": "delete_icons"},
"m_CAS": {"ON": 1, "NAME": "popmacro"},
"t_CAS": {"ON":1, "NAME": "toggle_window_tiling"},
"z_CAS": {"ON":1, "NAME": "test_function"},
"d_A":{"ON":1,"NAME":"focus_desktop"},
"d_CA":{"ON":1,"NAME":"move_to_desktop"}
}//»
//»
//DOM«



//»

//OBJ/CB«

this.onkeypress=(e,sym)=>{
if (_Desk && did_init) _Desk.keypress(e);
};

this.onkeydown=(e,sym)=>{
if (_Desk && did_init) _Desk.keydown(e);
}
this.onkeyup = (e,sym)=>{
if (_Desk&&did_init) _Desk.keyup(e);
};
this.onresize=()=>{//«
	w = main.clientWidth;
	h = main.clientHeight;
	if (!_Desk) return;
	_Desk.resize(null, w,h);
}//»
this.onmove=()=>{
	if (!_Desk) return;
	_Desk.resize(null, w,h);
};
this.onkill = function() {//«
if (servid !== null) fs.stop_service(servid+"");	
}//»

//»

//Funcs«

const LOTWService=function(){//«
    const exports = {
        name: "LOTW",
        winid: topwin.id+"",
        stdin:(arg)=>{
if (killed){
	cerr("LOTWService was killed!");
	return;
}
            if (!isstr(arg)) return;
			if (!fs_root) return cerr("No fs_root");
			reload(arg);
        }
    };
    this.exports = exports;
    this.kill=()=>{
		killed = true;
	};
    this.setid=(num)=>{
        servid = num;
    }
};
//»

const do_request=()=>{//«
	return new Promise((Y,N)=>{
		window.requestFileSystem(TEMPORARY, 5*1024*1024, fsret=>{
			fsret.root.getDirectory(BRANCH_NAME, {create:true}, Y, e=>{
				cerr("Could not get branch: 'dev' to initialize the LOTW filesystem");
			});
		}, ()=>{cerr("Could not initialize the HTML5 Filesystem API");});
	});
};//»

const reload=arg=>{//«
	if (script) script.del();
	main.innerHTML="";
	NS.mods["sys.devdesk"]=null;
	did_init=false;
    let root = {NAME: "/", APP: "Folder", KIDS: {}, treeroot: true, TYPE: "fs", sys: true};
    root.KIDS['.'] = root;
    root.KIDS['..'] = root;
    root.root = root;

	let str = `window[__OS_NS__].mods["sys.devdesk"]=function(Core,arg){"use strict";${arg}\n}`;
	script = make('script');
	script.onload = () => {
		fs.make_all_trees(async()=>{
			const dsk ={
				desk_path: desk_path,
				home_path: home_path,
				topwin: topwin,
				fs_type: "temporary",
				fs_branch: BRANCH_NAME,
				fspref: `t-${BRANCH_NAME}`,
				root: root,
				fs_root: fs_root,
				body: main,
				winw:()=>{return w},
				winh:()=>{return h},
				historys:{},
				globals:{AppVars:{}},
				popup_queue:[]
			};
			Core.set_fifos(dsk);
			Core.set_links(dsk);
			await fsapi.touchHtml5Dirs([home_path],{reject:true, DSK:dsk});
			await fsapi.touchHtml5Dirs([desk_path], {reject:true, DSK:dsk});
			await fsapi.popHtml5Dirs(['/home'],{DSK:dsk});
			_Desk = new NS.mods["sys.devdesk"](Core, {
				DSK: dsk,
				lotw_mode: true,
				body: main
			});
			_Desk.init(()=>{
				did_init=true;
				_Desk.resize(null, w,h);
				_Desk.set_bgcol("#433");
			});
		}, root, fs_root);
	};
	script.onerror = e => {
cerr(e);
	};
	script.src=URL.createObjectURL(new Blob([str],{type:"application/javascript"}));
	document.head.add(script);

};//»

const init = async()=>{//«

servobj = new LOTWService();
fs.start_service(servobj,(ret,err)=>{
    if (err||!ret) return cerr("Could not launch the service: " + err);
});
fs_root = await do_request();

};//»


//»

init();


