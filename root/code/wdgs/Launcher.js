/*
Performance issue: minimized windows with SVG (like Synth) seem to take awhile to do scaling...
*/

//Imports«

const APPOBJ = arg.APPOBJ||{};
const{NS,Core,Desk,main,topwin}=arg;
const{log,cwarn,cerr,globals}=Core;
const{util,widgets}=globals;
const{isstr}=util;
const {popyesno,popup}=widgets;
const capi = Core.api;
const {mk,mkdv,mksp,configPath}=capi;
const fs = NS.api.fs;

//»

let is_deleting=false;
const DEL_TRANS_MS=250;
let INITDELAY=333;
//let INITDELAY=666;
let MSDELAY=250;
//let MSDELAY=999;
let BASEICONFS=16;
let BASEWIDTH=36;
let DEFMAGSCALE=8.0;
//Var«
let first_evt;
let empty_svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="128" height="128"></svg>';
const is_chrome = arg.ISCHROME;
let config_path;
let default_icon_names=[
"sys.Applications",
"sys.Terminal",
"sys.Folder",
"sys.TextEdit",
"audio.Synth",
"sys.Help",
"sys.Settings"
];
let cur_evt;
let context_menu_active=false;
let icon_names;
let CDI=null;
let rect;
let base_rect;
let launcher_is_active=false;
let launcher_is_activating=false;
let usebasefs, usefinalfs;
let MAXFS = 128;
let MINFS = 8;
let use_opacity=0.5;
if (APPOBJ.opacity) use_opacity = APPOBJ.opacity;
if (APPOBJ.baseSize) {
	usebasefs = (APPOBJ.baseSize+"").pi({MAX:MAXFS, MIN: MINFS})
	if (isNaN(usebasefs)) usebasefs = BASEICONFS;
}
else usebasefs = BASEICONFS;
BASEWIDTH=usebasefs;
let SYSICONNAMEFS=17;
let ICONMAXWIDTRANS = `max-width 0.${MSDELAY}s`;
let ICONTRFORMTRANS = `transform 0.${MSDELAY}s, margin 0.${MSDELAY}s`;
let ICONDIMTRANS =`width 0.${MSDELAY}s, height 0.${MSDELAY}s`;

let ICONOPTRANS ="opacity 0."+MSDELAY+"s";
const BORWID="2";
const BORCOL="#ee6";

let TRYMULT = "1.";
let TRYMULTITER=0;
let IFNOSCALE=false;
const MAXSCALE=10.0;
let usefinalsc;
let usebasesc=1;
//if (APPOBJ.magScale) {

if (APPOBJ.finalSize && !APPOBJ.magScale){
	APPOBJ.magScale=APPOBJ.finalSize/usebasefs;
}
if (APPOBJ.magScale) {
	usefinalsc = (APPOBJ.magScale+"").pf({MAX:MAXSCALE, MIN: 1})
	if (isNaN(usefinalsc)) usefinalfs = DEFMAGSCALE;
}
else usefinalsc = DEFMAGSCALE;

if (usefinalsc > usebasesc) {
	(()=>{
		let usei,val,lastval;
		let find_the_mult = ()=>{
			for (let i=0; i <= 9; i++){
				TRYMULTITER++;
				if (TRYMULTITER>1000) {
cerr("WHOA INFINITE LOOPER!!!");
					return;
				}
				let mult = TRYMULT+i;
				val = eval(`${usebasesc}*Math.pow(${mult},5)`);
				if (val > usefinalsc) {
					TRYMULT = TRYMULT+(i-1);
					if (TRYMULT.length >= 7) return;
					find_the_mult();
					return;
				}
			}
			TRYMULT = TRYMULT+9;
			if (TRYMULT.length >= 7) return;
			find_the_mult();
		}
		find_the_mult();
	})();
}
else {
	TRYMULT="1.0";
	IFNOSCALE=true;
}

let ICONFSMULT = parseFloat(TRYMULT);
//cwarn("TRYMULT",TRYMULT);
let FS6=usebasesc;
let FS5=FS6*ICONFSMULT;
let FS4=FS5*ICONFSMULT;
let FS3=FS4*ICONFSMULT;
let FS2=FS3*ICONFSMULT;
let FS1=FS2*ICONFSMULT;

let FS1_5 = (FS1+FS2)/2;
let FS2_5 = (FS2+FS3)/2;
let FS3_5 = (FS3+FS4)/2;
let FS4_5 = (FS4+FS5)/2;
let FS5_5 = (FS5+FS6)/2;

let FS1_5_diff = FS1 - FS1_5;
let FS2_5_diff = FS2 - FS2_5;
let FS3_5_diff = FS3 - FS3_5;
let FS4_5_diff = FS4 - FS4_5;
let FS5_5_diff = FS5 - FS5_5;

let icon_arr = [];
let icon_arr_left = [];
let icon_arr_right = [];
let num_icons, num_icons_min1, num_icons_min2, num_icons_min3, num_icons_min4, num_icons_min5
//»

//Dom«

main.bgcol="#114";
main.tcol="#ccc";
const body = mkdv();//«
main.add(body);
body.pos="absolute";
body.b=0;
body.w="100%";

body.dis="flex";

body.style.cssText+=`
flex-direction:column;
align-items:center;
`;

//»
const sys_foot=mkdv();
sys_foot.dis="flex";
sys_foot.style.cssText+=`
flex: 0 0 auto;
justify-content:space-between;
align-items:flex-end;
`;

//log(sys_foot);
body.add(sys_foot);

const bardiv = mkdv();
//bardiv.bgcol="rgba(255,0,0,0.25)";
const sys_foot_center = mkdv();
sys_foot_center.add(bardiv);

//sys_foot_center.b=0;
const sys_foot_left = mkdv();
sys_foot_left.pad=5;
const sys_foot_right = mkdv();
sys_foot_right.pad=5;

sys_foot.add(sys_foot_left);
sys_foot.add(sys_foot_center);
sys_foot.add(sys_foot_right);

sys_foot_center.bgcol="rgba(255,255,255,0.15)"
sys_foot_center.op=use_opacity;
sys_foot_center.vis="hidden";
sys_foot_center.op=0;
sys_foot_center.pad=5;

sys_foot_left.style.cssText+=`
align-items:flex-end;
display:flex;
flex:0 1 auto;
`;

bardiv.style.cssText+=`
align-items:flex-end;
display:flex;
flex:0 1 auto;
`
sys_foot_center.style.cssText+=`
align-items:flex-end;
display:flex;
flex:0 1 auto;
`;

sys_foot_right.style.cssText+=`
align-items:flex-end;
display:flex;
flex:0 1 auto;
`;

sys_foot_center.onmouseenter = e => {
	let ret = Desk.get_drag_img();
//	if (!(ret&& ret.copyto)) return;
	if (!ret) return;
	CDI = ret;
if (CDI.copyto){
	let app = CDI.app;
	for (let icn of icon_arr) {
		if (icn.name === app) return;
	}
	sys_foot_center.style.cursor = "copy";
	sys_foot_center.op=1;
	CDI.copyto("Launcher");
}
//else if (CDI.dragwin) sys_foot_center.style.cursor = "copy";
};
sys_foot_center.onmouseleave = e => {
	if (Desk.get_drag_img()) sys_foot_center.op=use_opacity;
	sys_foot_center.style.cursor = "";
	if (CDI&&CDI.clear) {
		CDI.clear();
		CDI = null;
	}
};


//»

//Obj/CB«
this.get_base_size=()=>{
return BASEWIDTH;
};
this.next_loc=()=>{
let r = sys_foot_center.gbcr();
return {x:r.right,y:r.top};
};
this.add_window=async (win,slot_num)=>{
	await add_icon(win, num_icons);
	if (isFinite(slot_num)){
		if(slot_num < num_icons){
			let nexticn=icon_arr[slot_num];
			let newicon=icon_arr.pop();
			bardiv.insertBefore(newicon.wrapdiv,nexticn.wrapdiv);
			icon_arr.splice(slot_num,0,newicon);
			for (let i=0; i <icon_arr.length; i++){
				let icn = icon_arr[i];
				icn.iter=i;
			}
			update_num_icons(1);
			set_fs(newicon,cur_evt);
		}
		else {
			update_num_icons(1);
			set_fs(icon_arr[icon_arr.length-1],cur_evt);
		}
	}
	else update_num_icons(1);
};
this.click_icon=num=>{
	let icn = icon_arr[num-1];
	if (!icn)return;
	if (icn.div) icn.div.bor=BORWID+"px solid "+BORCOL;
	else icn.bor=BORWID+"px solid "+BORCOL;
	setTimeout(()=>{
		if (icn.div) icn.div.bor=BORWID+"px solid transparent";
		else icn.bor=BORWID+"px solid transparent";
	},333);
	icn.wrapdiv.click();
};
this.kill=()=>{
};
//»

//Funcs«

const hard_reset=if_fast=>{//«
if (if_fast) unset_icon_transitions();
else set_icon_transitions();
	sys_foot_center.op=use_opacity;
	for (let d of icon_arr) {
		delete d.active;
		(d.do_scale&&d.do_scale(BASEWIDTH))||
			(d.style.maxWidth=BASEWIDTH+"px");
		d.name_span.op=0;
		if (d.div) d.div.bor=BORWID+"px solid transparent";
		else d.bor=BORWID+"px solid transparent";
	}
	for (let d of icon_arr_left) d.style.maxWidth=BASEWIDTH+"px";
	for (let d of icon_arr_right) d.style.maxWidth=BASEWIDTH+"px";
	launcher_is_active=false;
	launcher_is_deactivating=false;
	launcher_is_activating=false;
};
this.hard_reset=hard_reset;
//»
const clear_actives=e=>{//«
    for (let img of icon_arr) {
		delete img.active;
		if (img.div) img.div.bor=BORWID+"px solid transparent";
		else img.bor=BORWID+"px solid transparent";
    }
}//»
const set_fs=(elem,e,if_init)=>{//«

if (is_deleting) return;
if (launcher_is_deactivating) return;
if (launcher_is_activating) return;
let iter = elem.iter;
let namesp = elem.name_span;
if (!launcher_is_active) return;
if (!if_init){
	sys_foot_center.op=1;
	if ((Desk.CWIN&&Desk.CWIN.is_dragging)||Desk.get_drag_img()){
		if (elem.div) elem.div.bor=BORWID+"px solid transparent";
		else elem.bor=BORWID+"px solid transparent";
	}
	else{
		if (elem.div) elem.div.bor=BORWID+"px solid "+BORCOL;
		else elem.bor=BORWID+"px solid "+BORCOL;
		namesp.op=1;
	}
}

namesp.x = -((namesp.clientWidth-elem.wrapdiv.gbcr().width)/2);

if (IFNOSCALE) return;

let rect = elem.wrapdiv.getBoundingClientRect();
let l = rect.left;
let r = rect.right;
let c = (l+r)/2;
let w = rect.width;
let w_2 = w/2;
let x = e.clientX;
let dx= x-c;
let is_west = (dx < 0);
let abs_dx = Math.abs(dx);
let per = (w_2-abs_dx)/w_2;
if (per < 0) per= 0;

let fs = FS1_5 + (per*FS1_5_diff);
let near_fs = FS1_5 - (per*FS1_5_diff);
let near_fs_2 = FS2_5 - (per*FS2_5_diff);
let near_fs_3 = FS3_5 - (per*FS3_5_diff);
let near_fs_4 = FS4_5 - (per*FS4_5_diff);

let far_fs = FS2_5 + (per*FS2_5_diff);
let far_fs_2 = FS3_5 + (per*FS3_5_diff);
let far_fs_3 = FS4_5 + (per*FS4_5_diff);
let far_fs_4 = FS5_5 + (per*FS5_5_diff);
(elem.do_scale&&elem.do_scale(BASEWIDTH*fs))||
	(elem.style.maxWidth=(BASEWIDTH*fs)+"px");
//If on west, smaller numbers will get the larger value
//If on east, larger numbers will get the larger value

let diffp = num_icons-iter-1;
let diffm = iter;
let icon_p1=icon_arr[iter+1]||icon_arr_right[0],
	icon_p2=icon_arr[iter+2]||icon_arr_right[1-diffp],
	icon_p3=icon_arr[iter+3]||icon_arr_right[2-diffp],
	icon_p4=icon_arr[iter+4]||icon_arr_right[3-diffp],
	icon_p5=icon_arr[iter+5]||icon_arr_right[4-diffp];
let icon_m1=icon_arr[iter-1]||icon_arr_left[4], 
	icon_m2=icon_arr[iter-2]||icon_arr_left[3+diffm], 
	icon_m3=icon_arr[iter-3]||icon_arr_left[2+diffm], 
	icon_m4=icon_arr[iter-4]||icon_arr_left[1+diffm], 
	icon_m5=icon_arr[iter-5]||icon_arr_left[0+diffm];
if (is_west){
(icon_p1.do_scale&&icon_p1.do_scale(BASEWIDTH*far_fs))||
	(icon_p1.style.maxWidth=BASEWIDTH*far_fs+"px");
(icon_p2.do_scale&&icon_p2.do_scale(BASEWIDTH*far_fs_2))||
	(icon_p2.style.maxWidth=BASEWIDTH*far_fs_2+"px");
(icon_p3.do_scale&&icon_p3.do_scale(BASEWIDTH*far_fs_3))||
	(icon_p3.style.maxWidth=BASEWIDTH*far_fs_3+"px");
(icon_p4.do_scale&&icon_p4.do_scale(BASEWIDTH*far_fs_4))||
	(icon_p4.style.maxWidth=BASEWIDTH*far_fs_4+"px");
(icon_p5.do_scale&&icon_p5.do_scale(BASEWIDTH*usebasesc))||
	(icon_p5.style.maxWidth=BASEWIDTH*usebasesc+"px");

(icon_m1.do_scale&&icon_m1.do_scale(BASEWIDTH*near_fs))||
	(icon_m1.style.maxWidth=BASEWIDTH*near_fs+"px");
(icon_m2.do_scale&&icon_m2.do_scale(BASEWIDTH*near_fs_2))||
	(icon_m2.style.maxWidth=BASEWIDTH*near_fs_2+"px");
(icon_m3.do_scale&&icon_m3.do_scale(BASEWIDTH*near_fs_3))||
	(icon_m3.style.maxWidth=BASEWIDTH*near_fs_3+"px");
(icon_m4.do_scale&&icon_m4.do_scale(BASEWIDTH*near_fs_4))||
	(icon_m4.style.maxWidth=BASEWIDTH*near_fs_4+"px");
(icon_m5.do_scale&&icon_m5.do_scale(BASEWIDTH*usebasesc))||
	(icon_m5.style.maxWidth=BASEWIDTH*usebasesc+"px");
}
else {
(icon_p1.do_scale&&icon_p1.do_scale(BASEWIDTH*near_fs))||
	(icon_p1.style.maxWidth=BASEWIDTH*near_fs+"px");
(icon_p2.do_scale&&icon_p2.do_scale(BASEWIDTH*near_fs_2))||
	(icon_p2.style.maxWidth=BASEWIDTH*near_fs_2+"px");
(icon_p3.do_scale&&icon_p3.do_scale(BASEWIDTH*near_fs_3))||
	(icon_p3.style.maxWidth=BASEWIDTH*near_fs_3+"px");
(icon_p4.do_scale&&icon_p4.do_scale(BASEWIDTH*near_fs_4))||
	(icon_p4.style.maxWidth=BASEWIDTH*near_fs_4+"px");
(icon_p5.do_scale&&icon_p5.do_scale(BASEWIDTH*usebasesc))||
	(icon_p5.style.maxWidth=BASEWIDTH*usebasesc+"px");

(icon_m1.do_scale&&icon_m1.do_scale(BASEWIDTH*far_fs))||
	(icon_m1.style.maxWidth=BASEWIDTH*far_fs+"px");
(icon_m2.do_scale&&icon_m2.do_scale(BASEWIDTH*far_fs_2))||
	(icon_m2.style.maxWidth=BASEWIDTH*far_fs_2+"px");
(icon_m3.do_scale&&icon_m3.do_scale(BASEWIDTH*far_fs_3))||
	(icon_m3.style.maxWidth=BASEWIDTH*far_fs_3+"px");
(icon_m4.do_scale&&icon_m4.do_scale(BASEWIDTH*far_fs_4))||
	(icon_m4.style.maxWidth=BASEWIDTH*far_fs_4+"px");
(icon_m5.do_scale&&icon_m5.do_scale(BASEWIDTH*usebasesc))||
	(icon_m5.style.maxWidth=BASEWIDTH*usebasesc+"px");
}
};//»
const check_active = () => {//«
    for (let dv of icon_arr) {
        if (dv.active) return dv;
    }
    return false;
};//»
const set_icon_transitions=()=>{//«
	for (let icn of icon_arr_left){
		icn.style.transition=ICONMAXWIDTRANS;
	}
	for (let icn of icon_arr){
		if (icn.div) {
			icn.div.style.transition=ICONDIMTRANS;
			icn.style.transition=ICONTRFORMTRANS;
		}
		else icn.style.transition=ICONMAXWIDTRANS;
	}
	for (let icn of icon_arr_right){
		icn.style.transition=ICONMAXWIDTRANS;
	}
};//»
const unset_icon_transitions=()=>{//«
	for (let icn of icon_arr_left){
		icn.style.transition="";
	}
	for (let icn of icon_arr){
		if (icn.div) {
			icn.div.style.transition="";
			icn.style.transition="";
		}
		else icn.style.transition="";
	}
	for (let icn of icon_arr_right){
		icn.style.transition="";
	}
};//»
const reset_bar=(which)=>{//«
	if (context_menu_active) return;
	for (let d of icon_arr) {
		delete d.active;
		(d.do_scale&&d.do_scale(BASEWIDTH))||
			(d.style.maxWidth=BASEWIDTH+"px");
		setTimeout(()=>{
			d.name_span.op=0;
			if (d.div) d.div.bor=BORWID+"px solid transparent";
			else d.bor=BORWID+"px solid transparent";
		},MSDELAY);
	}
	for (let d of icon_arr_left) d.style.maxWidth=BASEWIDTH+"px";
	for (let d of icon_arr_right) d.style.maxWidth=BASEWIDTH+"px";
	
	setTimeout(()=>{
		if (check_active()) return;
		launcher_is_active=false;
		if (is_chrome){
//			let cdi = Desk.get_drag_img();
//			if (!(cdi&&cdi.dragwin)) topwin.z=0;
			if (!(Desk.CWIN&&Desk.CWIN.is_dragging)) topwin.z=0;
		}
	},MSDELAY+50);
};//»
const update_num_icons=inc=>{//«
	num_icons+=inc;
};//»
const add_empty_icon=(where)=>{//«
	let dv = mkdv();
	dv.pos="relative";
	let icondv = mkdv();
//	icondv.bgcol="rgba(255,0,0,0.25)";
	let img = new Image();
	img.bor=BORWID+"px solid transparent";
	img.style.maxWidth=BASEWIDTH;
//	img.style.transition=ICONMAXWIDTRANS;
	icondv.add(img);
	img.src=URL.createObjectURL(new Blob([empty_svg],{type:"image/svg+xml;charset=utf-8"}));
	dv.add(icondv);
	where.add(dv);
	if (where===sys_foot_left) icon_arr_left.push(img);
	else icon_arr_right.push(img);
};//»
const add_icon=(app_or_win,i)=>{//«

	return new Promise(async(Y,N)=>{
		let is_app=false;
		const rm_icon=async()=>{//«
			let new_names = [];
			let new_arr=[];
			let iter=0;
			for (let icn of icon_arr){
				if (icn===img) {
					let d = wrapdiv.cloneNode();
					let s = wrapdiv.nextSibling;
let r = wrapdiv.gbcr();
if (s) bardiv.insertBefore(d,s);
else bardiv.add(d);
					wrapdiv.del();
d.w=r.width;
d.h=0;
is_deleting=true;
d.style.transition=`width 0.${DEL_TRANS_MS}s`;
d.addEventListener('transitionend',e=>{
d.del();
is_deleting=false;
if (!check_active()) hard_reset();
});
setTimeout(()=>{
d.w=0;
},0);
				}
				else {
					icn.iter = iter;
					new_arr.push(icn);
					if (icn.is_app) new_names.push(icn.name);
					iter++;
				}
			}
			icon_arr=new_arr;
			update_num_icons(-1);
			if (is_chrome&&is_app) await fs.writeHtml5File(config_path,new_names.join("\n"),{ROOT:true});
		};//»
		let wrapdiv=mkdv();//«
		let dv = mkdv();
		wrapdiv.add(dv);
		wrapdiv.pos="relative";
		let icondv = mkdv();
		let name;
		let img;
		if (isstr(app_or_win)){
			is_app=true;
			name = app_or_win.split(".").pop();
			await Desk.iconGen.attach({PAR:icondv,APP:app_or_win});
			img = icondv.img;
			img.style.maxWidth=BASEWIDTH;
			img.is_app=true;
			img.bor=BORWID+"px solid transparent";
		}
		else{
			name = app_or_win.name;
			icondv.add(app_or_win);
			icondv.img=app_or_win.win;
			img=icondv.img;
			img.div.bor=BORWID+"px solid transparent";
		}
		img.wrapdiv=wrapdiv;
		img.iter=i;
		dv.add(icondv);
		img.wrapdiv=wrapdiv;
		icon_arr.push(img);
//»
		wrapdiv.onclick=e=>{//«
			reset_bar(1);
			if (is_app) Desk.open_app(app_or_win,()=>{});
			else{
				img.unminimize();
				let iter = 0;
				let new_arr=[];
				for (let icn of icon_arr){
					if (icn===img) {
						wrapdiv.del();
						delete img.wrapdiv;
					}
					else {
						icn.iter = iter;
						new_arr.push(icn);
						iter++;
					}
				}
				icon_arr=new_arr;
				update_num_icons(-1);
			}
		};//»
		wrapdiv.oncontextmenu=e=>{//«
			if (!is_chrome) return;
			if (!is_app) return;
			let elem = Desk.deskcontext({
				x: e.clientX,
				y: e.clientY
			}, {
			items: [`Remove '${name}' from the Launcher`, rm_icon]

		});
		context_menu_active = true;
		Desk.desk_menu.kill_cb=()=>{
			context_menu_active = false;
			reset_bar(2);
		};

		};//»
		wrapdiv.onmousemove=e=>{//«
			cur_evt=e;
			if(launcher_is_active) set_fs(img,e);
		};//»
		wrapdiv.onmouseenter=e=>{//«
			namesp.dis="block";
			if (launcher_is_active) set_fs(img,e,i);
			img.active=true;
		};//»
		wrapdiv.onmouseleave=e=>{//«
			cur_evt=e;
			if (context_menu_active) return;
			delete img.active;
			namesp.dis="none";
			namesp.op=0;
			if (img.div) img.div.bor=BORWID+"px solid transparent";
			else img.bor=BORWID+"px solid transparent";
		};//»
		wrapdiv.onmouseup=async e=>{//«
			let CDI = Desk.get_drag_img();
			let cwin = Desk.CWIN;
if (CDI){
			if (CDI.copyto) {//«

				sys_foot_center.style.cursor = "";
				let app = CDI.app;
				CDI.del();
				CDI = null;
				Desk.clear_drag_img();
				for (let icn of icon_arr) {
					if (icn.name === app) {
						popup("The application shortcut already exists!");
						return;
					}
				}
				let r = dv.gbcr();
				let is_before = e.clientX<((r.left+r.right)/2);
				await add_icon(app, num_icons);
				let newicon=icon_arr.pop();
				if(is_before){
					bardiv.insertBefore(newicon.wrapdiv,wrapdiv);
					icon_arr.splice(img.iter,0,newicon);
				}
				else if (img.iter < num_icons-1){
					bardiv.insertBefore(newicon.wrapdiv,wrapdiv.nextSibling);
					icon_arr.splice(img.iter+1,0,newicon);
				}
				else {
					icon_arr.push(newicon);
				}
				let names=[];
				for (let i=0; i <icon_arr.length; i++){
					let icn = icon_arr[i];
					icn.iter=i;
					if (icn.is_app) names.push(icn.name);
				}
				update_num_icons(1);
				set_fs(newicon,e);
				setTimeout(()=>{
					let namesp = newicon.name_span;
					namesp.x = -((namesp.clientWidth-newicon.gbcr().width)/2);
					newicon.style.transition="";
					if (newicon.div) newicon.div.style.transition="";
				},MSDELAY+10);
				if (is_chrome) await fs.writeHtml5File(config_path, names.join("\n"), {
					ROOT: true
				});
			}//»
else{
//console.warn("WUTCDI",CDI);
}
}
			else if (cwin&&cwin.is_minimized&&cwin.is_dragging){

				let r = dv.gbcr();
				let is_before = e.clientX<((r.left+r.right)/2);
				let num=img.iter;
				if (!is_before) num++;
				let w = cwin;
				w.op=0;
				w.unminimize(true);
				w.minimize(true,()=>{
					w.op=1;
					delete w.active;
				},num);
			}

			sys_foot_center.style.cursor = "";
		};//»
		let namesp = mkdv();//«
		wrapdiv.add(namesp);
		namesp.dis="none";
		namesp.ta="center";
		namesp.style.minWidth="100%";
		namesp.ff="sans-serif";
		namesp.mart=-(2*SYSICONNAMEFS)+"px";
		namesp.fs=SYSICONNAMEFS;
		namesp.bgcol="#000";
		namesp.tcol="#ccc";
		namesp.fw="bold";
		namesp.style.borderRadius="10px";
		namesp.padb=namesp.padt="3px";
		namesp.padl=namesp.padr="5px";
		namesp.pos="absolute";
		namesp.loc(0,0);
//		namesp.style.transition=ICONOPTRANS;
		namesp.op=0;
		namesp.innerHTML=name;
		dv.name_span = namesp;
		img.name_span = namesp;
//»
		if (is_app) img.name=app_or_win;
		bardiv.add(wrapdiv);
		dv.draggable=true;
		dv.ondragstart=async e=>{//«
			e.preventDefault();
			let r = dv.getBoundingClientRect();
			rm_icon();
			wrapdiv.onclick=null;
			wrapdiv.pos="absolute";
			wrapdiv.loc(e.clientX,e.clientY);
			dv.onmouseup=null;
			dv.onmouseenter=null;
			dv.onmouseleave=null;
			dv.onmousemove=null;
//			(img.do_scale&&img.do_scale(100))||(img.style.maxWidth=(100)+"px");
			(img.do_scale&&img.do_scale(100))||(img.style.maxWidth=(65)+"px");
			if (img.div) img.div.bor="1px solid #ff0";
			else img.bor="1px solid #ff0";
			if (is_app){
				wrapdiv.marl=5;
				wrapdiv.mart=5;
				let tooldiv = mkdv();
				tooldiv.pos="absolute";
				tooldiv.op=0;
				tooldiv.bgcol="#000";
				tooldiv.tcol="#ccc";
				tooldiv.pad=3;
				tooldiv.borrad="5px";
				tooldiv.fs=14;
				tooldiv.style.transition="opacity 0.333s";
				wrapdiv.add(tooldiv);
				namesp.dis="none";
				wrapdiv.app=app_or_win;
				wrapdiv.copyto=where=>{
					tooldiv.op=0.85;
					tooldiv.innerHTML=`Create\xa0shortcut\xa0to\xa0${name}\xa0in\xa0${where}`;
				};
				wrapdiv.save=async path=>{
					let fname = name+".app";
					let fullpath = path+"/"+fname;
					if (await fs.pathToNode(fullpath)) return;
					if (!(await fs.writeFile(fullpath,`{"app":"${app_or_win}"}`))) return cerr("Could not save!")
				};
				wrapdiv.clear=()=>{
					tooldiv.op=0;
				};
				Desk.set_drag_img(wrapdiv);
				tooldiv.loc(25,-25);
				namesp.x = -((namesp.clientWidth-wrapdiv.gbcr().width)/2);
			}
			else {
				await Desk.return_minwin_to_desk(img, r);
//				Desk.CWIN = img;
				img.overdiv.start_drag(e);
			}
		};//»
		Y();
	});

};//»
let launcher_is_deactivating=false;
bardiv.onmouseenter=e=>{//«
let cdi = Desk.get_drag_img();
if (cdi){
if (!cdi.copyto) return;
}
if (launcher_is_deactivating) {
if (sys_foot_center.added_listener){
sys_foot_center.removeEventListener('transitionend',sys_foot_center.added_listener);
launcher_is_deactivating=false;
launcher_is_activating=false;
launcher_is_active=false;
sys_foot_center.op=1;
    for (let dv of icon_arr) {
        delete dv.active;
    }
}
else{
console.error("!!!?????");
}
//return;
}
	cur_evt=e;
	if (!check_active()) {
		setTimeout(()=>{
			let elem = check_active();
			if (!elem) return;
			if (launcher_is_active) return;
			if (is_chrome){
				topwin.z=9999998;
			}
			launcher_is_active=true;
			sys_foot_center.op=1;
			first_evt = cur_evt;
			set_icon_transitions();

			const transend=()=>{
				sys_foot_center.op=1;
				launcher_is_activating=false;
				sys_foot_center.removeEventListener('transitionend',transend);
				unset_icon_transitions();
				elem = check_active();
				if (!elem) return;
				set_fs(elem,cur_evt);
			};
			sys_foot_center.addEventListener('transitionend',transend);
			set_fs(elem,cur_evt, true);
			launcher_is_activating=true;
		},INITDELAY);
	}
};//»
bardiv.onmouseleave=e=>{//«
	if (launcher_is_deactivating) return;
	
	setTimeout(()=>{
		if (check_active()) return;
		launcher_is_deactivating=true;
		set_icon_transitions();
		const transend=e=>{
			delete sys_foot_center.added_listener;
			unset_icon_transitions();
			launcher_is_deactivating=false;
			sys_foot_center.removeEventListener('transitionend',transend);
			sys_foot_center.op=use_opacity;
		};
		sys_foot_center.added_listener = transend;
		sys_foot_center.addEventListener('transitionend',transend);
		reset_bar(4);
		sys_foot_center.op=use_opacity;
	},10);
};//»

//»

const init=async()=>{//«
	config_path = await configPath("desk/launcher.txt");
	let str = await fs.readHtml5File(config_path);
	if (str){
		let arr = str.split("\n");
		for (let i=0; i < arr.length; i++) arr[i]=arr[i].trim();
		icon_names=[];
		for (let nm of arr){
			if (nm) icon_names.push(nm);
		}

	}
	else{
		await fs.writeHtml5File(config_path,default_icon_names.join("\n"),{ROOT:true});
		icon_names = default_icon_names;
	}

	num_icons = icon_names.length;

for (let i=0; i < 5; i++){
add_empty_icon(sys_foot_left);
}

	for (let i=0; i < num_icons; i++) {
		await add_icon(icon_names[i], i);
	}
	sys_foot_center.style.maxHeight=sys_foot_center.gbcr().height;


for (let i=0; i < 5; i++){
add_empty_icon(sys_foot_right);
}
setTimeout(()=>{
sys_foot_center.vis="visible";
sys_foot_center.op=use_opacity;
sys_foot_center.style.transition= "opacity 0."+MSDELAY+"s";
},0);

};//»

init();
if (is_chrome) {
	Desk.api.setLauncher(this);
//	main.onmouseup="";
}

