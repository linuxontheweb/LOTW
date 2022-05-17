
//Imports«

const Topwin = Main.top;
const {popup:_popup,popok:_popok,poperr:_poperr,popyesno:_popyesno, popin:_popin,popinarea:_popinarea}=NS.api.widgets;
const popup=(s)=>{return new Promise((y,n)=>{_popup(s,{win:Topwin,cb:y});});};
const popin=(s)=>{return _popin(s,{win:Topwin});};
const popinarea=(tit)=>{return _popinarea("",tit,{win:Topwin});};
const popok=(s)=>{return new Promise((y,n)=>{_popok(s,{win:Topwin,cb:y});});};
const poperr=(s)=>{return new Promise((y,n)=>{_poperr(s,{win:Topwin,cb:y});});};
const popyesno=(s)=>{return new Promise((y,n)=>{_popyesno(s,{win:Topwin,cb:y});});};
const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp}=util;
const log=(...args)=>{console.log(...args)};
const cerr=(...args)=>{console.error(...args)};
const cwarn=(...args)=>{console.warn(...args)};
const getact=()=>document.activeElement;
Topwin.title="Forum";
const NUM=Number.isFinite;
const capi=Core.api;
const isdev=()=>{return dev_mode&&dev_env};

const fs=NS.api.fs;

let MAX_TEXTAREA_LEN = 5000;

//»

//Var«

const mkhr=()=>{return mk('hr');}

const UNICODE_LANG_RE = /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+/;

let DO_NUM_MAIN_ESCAPES = 1;
let num_main_escapes = 0;
const MAX_SUB_LEN = 100;
const TIMES=[];
let topic_tab;
let input_scroll_top;
let last_topic;
let current_topic;
let forum;
let time_interval;
let cur_active_elem;
let cur_topic_row;
let create_topic_but1, create_topic_but2;
let cur_cancel_fn;
let overlay;

let getting_input = false;
let forum_is_initting = false;
let got_all_topics = false;
let forum_is_active;
let getting_topics;

let comment_but_1, comment_but_2;
let input_submit_button, input_cancel_button;
let message_input, subject_input;
let bottom_hr = mkhr();


//»

//DOM«

const statbar = Topwin.status_bar;//«

statbar.w="100%";
statbar.dis="flex";
statbar.jsc="space-between";
const messdiv=mkdv();
statbar.add(messdiv);
const infodiv=mkdv();
infodiv.marr=5;
statbar.add(infodiv);
//»

Main.overy="scroll";
Main.tabIndex="-1";

Main.onscroll=(e)=>{
	if (getting_input) {
		Main.scrollTop = input_scroll_top;
		return;
	}
	if (current_topic) current_topic.last_scroll_top = Main.scrollTop;
	stat();
};
Main.onfocus=()=>{
	stat();
};

const header=mkdv();//«

const body=mkdv();
const forum_div = mkdv();
const topic_div = mkdv();

if(1){
	
let h = header;
h.bgcol="#123";
h.tcol="#e7e7e7";
h.marr=h.marl=h.mart=10;
h.pad=5;

let fnd = mkdv();//Name div
fnd.fs=26;
fnd.fw="bold";
header.set_forum_name=s=>{
	fnd.innerText = `Forum:\xa0${s}`;
}

let tnd = mkdv();//Topic name div
tnd.fs=21;
tnd.fw="bold";
tnd.dis="none";
tnd.mart=5;
tnd.marb=5;
header.set_topic=s=>{
	tnd.dis="";
	tnd.innerText = `Topic:\xa0${s}`;
}
header.unset_topic=s=>{
	tnd.dis="none";
	tnd.innerText = "";
}


header.add(fnd);
header.add(tnd);

}

//»

if(1){

let fd = forum_div; //Forum div
fd.marl=fd.marr=fd.marb=10;
fd.padt=fd.padb=5;

body.set_forum_screen=(forum)=>{//«
	current_topic = null;
	forum_is_active = true;
	body.add(fd);
	td.del();
	header.set_forum_name(forum.name);
	header.unset_topic();
	stat();
	info();
};//»

let td = topic_div; //Topic div
td.marl=td.marr=td.marb=10;
td.padt=td.padb=5;

body.set_topic_screen=(topic)=>{//«
	forum_is_active = false;
	td.innerHTML="";
	body.add(td);
	fd.del();
	header.set_topic(atob(topic.subject));
	stat();
	info();
};//»

let od = mkdv();//Overlay div

overlay = od;
od.resize=()=>{
	od.loc(0,Main.scrollTop);
	od.h = Main.clientHeight;
};
od.pos="absolute";
od.w="100%";
od.bgcol="rgba(0,0,0,0.5)";
od.dis="none";
od.z=10000000;
Main.add(od);

body.get_input = (if_topic)=>{//«

return new Promise(async(y,n)=>{

const clear=()=>{
	od.dis="none";
	od.innerHTML="";
	getting_input = false;
};
let subject_ok = true;

input_scroll_top = Main.scrollTop;
getting_input = true;
Main.blur();
od.dis="flex";
od.ali="center";
od.jsc="center";
od.loc(0,Main.scrollTop);
od.h = Main.clientHeight;

let ind = mkdv();//Input div
ind.pad=20;
ind.bgcol="#fff";
let useh = Main.gbcr().height;
if (useh > 200) useh -= 100;
ind.h = useh;
let sd = mkdv();//Subject div
let st = mkdv();//"Subject" text
st.tcol="#333";
st.innerText="Topic";
st.fs=17;
st.fw="bold";
let sinp = mk('input');//Subject input
subject_input = sinp;
sinp.onfocus = () => {
	stat("Enter a topic")
};

sinp.ff="monospace";
sinp.setAttribute("maxlength", MAX_SUB_LEN);
sinp.type="text";
sinp.w="100%";

sd.add(st);
sd.add(sinp);
sd.marb=15;

let md = mkdv();

let mt = mkdv();//"Message" text
mt.tcol="#333";
mt.innerText="Message";
mt.fs=17;
mt.fw="bold";
let mta = mk('textarea');//Message text area
mta.setAttribute("maxlength", MAX_TEXTAREA_LEN);
message_input = mta;
mta.onfocus=()=>{stat("Enter your message")};
mta.ff="monospace";
mta.setAttribute("cols",80);

md.add(mt);
md.add(mta);
sinp.onenter=()=>{
	mta.focus();
};

let bd = mkdv();//Bottom div
bd.dis="flex";
bd.jsc="flex-end";

cur_cancel_fn = ()=>{
	clear();
	y();
	cur_cancel_fn = null;
};

let but;

but = mkbut("Submit", bd,async()=>{

	if (if_topic) {
		if (!UNICODE_LANG_RE.test(sinp.value)){
			await poperr("Invalid topic!");
			sinp.focus();
			return 
		}
	}

	if (!UNICODE_LANG_RE.test(mta.value)){
		await poperr("Invalid message");
		mta.focus();
		return;
	}

	clear();
	let out={message:mta.value}
	if (if_topic) out.subject = btoa(sinp.value.regstr());
	y(out);

},{message:"[Enter] Submit"});
but.marr=10;
but.tabIndex="0";
input_submit_button = but;

but = mkbut("Cancel", bd, cur_cancel_fn,{message:"[Enter] Cancel"});
but.tabIndex="0";
input_cancel_button = but;

od.add(ind);

if (if_topic) {
	ind.add(sd);
	subject_ok = false;
}
else subject_input = null;
ind.add(md);
ind.add(bd);

if (if_topic) sinp.focus();
else mta.focus();
let goth = useh - (sd.clientHeight + bd.clientHeight);
md.h = goth;
mta.h = goth-25;

});



}//»

}

Main.add(header);
Main.add(body);

//»

//Util«

const make_visible = elem =>{//«

	if (is_visible(elem)) return;
	let mr = Main.getBoundingClientRect();
	let r = elem.getBoundingClientRect();

	let dt = mr.top - r.top;
	let db = r.bottom - mr.bottom;
	if (db > 0) Main.scrollTop += (db+1);
	else if (dt > 0) Main.scrollTop -= (dt+1);

};//»
const focus_first = arr => {//«
	for (let t of arr){
		if (is_visible(t)){
			t.focus();
			break;
		}
	}
};//»
const make_tabbable=(elem, level, parent)=>{
	elem.tab_level = level||1;
	elem.tab_parent = parent||Main;
	elem.tabIndex="-1";
	elem.className="tabbable";
};
const get_tabbables=(which,level)=>{
	let arr = Array.from(which.getElementsByClassName("tabbable"));
	if (level) return arr.filter(tab => tab.tab_level === level);
	return arr;
};

const is_visible = which => {
	let mr = Main.getBoundingClientRect();
	let r = which.getBoundingClientRect();
	return (r.top >= mr.top && r.bottom <= mr.bottom);
};
const select_next_topic_tabbable=(if_rev)=>{//«
	let act = document.activeElement;
	let arr = Array.from(Main.getElementsByClassName("tabbable"));
	if (if_rev) arr.reverse();
	if (act===Main){
		let mr = Main.getBoundingClientRect();
		for (let t of arr){
			let r = t.getBoundingClientRect();
			if (r.left >= mr.left && r.right <= mr.right && r.top >= mr.top && r.bottom <= mr.bottom){
				t.focus();
				break;
			}
		}
	}
	else{
		let ind = arr.indexOf(act);
		if (ind > -1){
			if (arr[ind+1]) arr[ind+1].focus();
			else Main.focus();
		}
	}
}//»

const info = (arg, opts={})=>{//«
	let use_ms = opts.timeout || 2000;
	if (!arg) arg = "";
	if (opts.tcol) messdiv.tcol=opts.tcol;
	else messdiv.tcol="";
	if (use_ms) setTimeout(()=>{
		messdiv.innerText="";
		messdiv.tcol="";
		stat();
	},use_ms);
	messdiv.innerText = arg;
};//»
const stat = (arg)=>{//«

	if (Desk && (Topwin !== Desk.CWIN)) return;
	if (forum_is_initting) return;
	const NBS = "\xa0\xa0\xa0";
	let act = document.activeElement;
	let mess;
	if (arg) mess = arg;
	else if (getting_input) mess = "Enter your message.";
	else if (act.active_message) mess = act.active_message;
	else mess = "";

	if (getting_input){}
	else if (forum_is_active) {
		if (act===Main) {
			if (mess) mess+=NBS;
			mess+="[Tab] Begin page navigation"

		}
		else if (act===cur_topic_row){
			if (mess) mess+=NBS;
			mess+="[Enter] Select topic" 
			if (!cur_topic_row.nextSibling && !got_all_topics)  mess+=NBS+"[Space] Load more topics";
		}
		if (last_topic) {
			if (mess) mess+=NBS;
			mess+="[Right] Go forward"
		}
		mess+=NBS+"[Alt+r] Refresh the forum";
	}
	else{
		if (mess) mess+=NBS;
		if (act===Main) mess+="[Tab] Begin page navigation"+NBS;
		mess += "[Left] Go back"+NBS;
		if (current_topic&&current_topic.last_child) mess+="[Right] Go forward"+NBS;
		mess +="[Alt+r] Refresh the topic";
	}
	messdiv.innerText=mess;
};//»

const update_times=()=>{for(let t of TIMES)t.update();}
const at_bottom=()=>{return((Main.scrollTop+Main.clientHeight+2)>=Main.scrollHeight);}
const at_top=()=>{return(Main.scrollTop===0);}

const mkbut = (str, par, fn, opts={})=>{//«

	let butcol="e7e7e7";
	let butborcol="#ccc";
	let disabled = false;
	let d = mkdv();
	make_tabbable(d, opts.tabLevel, opts.tabParent);
	d.bgcol=butcol;
	d.padt=d.padb=3;
	d.padr=d.padl=5;
	d.dis="inline-flex";
	d.ali="center";
	d.jsc="center";
	d.fs=15;
	d.innerText=str;
	d.bor=`3px outset ${butborcol}`;
	d.onmousedown=()=>{if(disabled)return;d.bor=`3px inset ${butborcol}`;};
	d.onmouseup=()=>{if(disabled)return;d.bor=`3px outset ${butborcol}`;};
	d.onmouseout=()=>{if(disabled)return;d.bor=`3px outset ${butborcol}`;};
	d.win=Topwin;
	d.tcol="#000";
	d.active_message = opts.message;
	d.onfocus=(e)=>{
		if (current_topic&&!getting_input) current_topic.last_active_elem = d;
		d.tcol="#00c";
		stat();
	};
	d.onblur=(e)=>{
		d.tcol="#000";
		stat();
	};
	d.onclick=(e)=>{
		if (disabled) return;
		if (e.isTrusted||e===true) {
			fn();
			stat();
			return 
		}
		d.bor="3px inset #aaa";
		setTimeout(() => {
			d.bor = "3px outset #aaa";
			fn();
			stat();
		}, 200);
	};
	if (par) par.add(d);
	d.disable=()=>{
		disabled=true;
		d.tcol="#777";
	};
	d.enable=()=>{
		disabled=false;
	};

	return d;

}//»

//»

const Time = function(SECS,par){//«

const time_arr=(secs)=>{//«
	let arr;
	if (secs) arr = new Date(secs*1000).toString().split(" ");
	else arr = new Date().toString().split(" ");
	let tm = arr[4].split(":");
	return [arr[3],arr[1],arr[2].replace(/^0/,""),tm[0],tm[1],tm[2]];
};//»


let d = mksp();
let TMARR = time_arr(SECS);

/*
this.update=()=>{//«

if (!d.isConnected) {
//cwarn("SKIPPING...");
	return;
}
let now = time_arr();
let arr = TMARR.slice();
while(arr[0]){
	if (arr[0]!==now[0]) break;
	arr.shift();
	now.shift();
}
let val="???";

if (!arr.length){
	val="now";
}
else if (arr.length==1) {
	let ds = now[0].pi() - arr[0].pi();
	val = `${ds} secs ago`;
}
else if (arr.length==2) {
	let dm = now[0].pi() - arr[0].pi();
	let mins = (dm+((now[1].pi() - arr[1].pi())/60));
	if (((mins+"").match(/^0/))) mins = mins.toFixed(1)
	else mins = mins.toFixed(0);
	val = `${mins} mins ago`;
}
else if (arr.length==3) {
	let dh = now[0].pi() - arr[0].pi();

	let hrs = (dh+((now[1].pi() - arr[1].pi())/60));
	if (((hrs+"").match(/^0/))) hrs = hrs.toFixed(1)
	else hrs = hrs.toFixed(0);

	val = `${hrs} hrs ago`;
}

d.innerText = val;

};//»
*/

this.update=()=>{
if (!d.isConnected) return;

let now = Math.floor(Date.now()/1000);
let diff = now - SECS;
//let val;
let num, unit;
let val;
let pref="";
if (diff <= 15) val = "just now";
else if (diff < 60){
//	num = diff;
//	unit = "sec";
	pref="<";
	num = 1;
	unit = "min";
}
else if (diff < 3600){
	num = Math.floor(diff/60);
	unit="min";
}
else if (diff < 86400){
	num = Math.floor(diff/3600);
	unit = "hr";
}
else{
	num = Math.floor(diff/86400);
	unit = "day";
}
if (!val) {
	if (num!==1) unit = unit+"s";
	val = `${pref}${num}\xa0${unit}\xa0ago`
}

d.innerText = val;

};

this.kill=()=>{
	TIMES.splice(TIMES.indexOf(this), 1);
};

par.add(d);

TIMES.push(this);

this.update();

};//»

const Topic = function(arg, forumname, use_orig_post){//«

//Var«

let last_comment_id;
if (use_orig_post) last_comment_id = 0;
else last_comment_id = 1;

const comments = [];
const topic_key = arg.key;

const {topic_row} = arg;

this.topic_row = topic_row;

let orig_post_key;
let getting_comments = false;
let reply_to;

if (use_orig_post) reply_to = use_orig_post.key;


//»

//DOM«

const main_div = mkdv();
const orig_post_div = mkdv();
const comments_div = mkdv();

let no_comments_div = mkdv();

if (1){
	let md = main_div;
	let opd = orig_post_div;
	opd.bor="1px solid #666";
	opd.pad=5;
	opd.marb=10;

	let ncd = no_comments_div;
	ncd.ta="center";
	ncd.tcol="#555";
	ncd.innerHTML="<i>[no comments]</i>";
	let cd = comments_div;
	cd.add(ncd);
}

main_div.add(orig_post_div);
comment_but_1 = mkbut("Comment",main_div,()=>comment(),{message:"[Enter] Make a comment"});
main_div.add(mkhr());
main_div.add(comments_div);
main_div.add(mkhr());
comment_but_2 = mkbut("Comment",main_div,()=>comment(),{message:"[Enter] Make a comment"});

//»

const comment=async()=>{//«

let inp = await body.get_input();
if (!inp) return;
let mess = inp.message;
if (!mess.match(/[a-z0-9]/)) return poperr("Invalid message");

//let rv = await fetch(`/_replytotopic?forum=${forumname}&topic=${topic_key}&replyto=${orig_post_key}`,{method:"POST",body:mess});
let url = `/_replytotopic?forum=${forumname}&topic=${topic_key}`;
if (reply_to) url+=`&replyto=${reply_to}`;
let rv = await fetch(url,{method:"POST",body:mess});
let txt = await rv.text();
if (rv.ok!==true) return poperr(txt);

await popok("Reply submitted!");
setTimeout(()=>{
	Main.focus();
},0);

};//»

const make_title=(name, time, name_fs, time_fs)=>{//«
	let tit = mkdv();
	tit.dis="flex";
	tit.jsc="space-between";
	tit.marb=5;
	let auth = mksp();
	auth.innerText = name;
	let td = mksp();
	auth.fs=name_fs;
	td.fs=time_fs;
	tit.add(auth);
	tit.add(td);
	tit.auth = auth;
	new Time(time, td);
	return tit;
};//»

const set_orig_post=(post)=>{//«

const do_copy = ()=>{//«
	capi.clipCopy(post.contents);
	cp.innerText="\u{2713}";
	cp.title="Copied!";
	setTimeout(()=>{
		cp.title="Copy to clipboard";
		cp.innerText="\u{1f4cb}";
	},1000);
	Main.focus();
};//»

let cont = mkdv();
cont.style.userSelect="text";
cont.pos="relative";
cont.fs=16;
cont.minh=100;
cont.marr=10;

let tit = make_title("By: "+post.author, post.time, 21, 19);
cont.innerText = post.contents;

orig_post_key = post.key;
orig_post_div.add(tit);

let cp = mkdv();//«
cp.innerText="\u{1f4cb}";
cp.dis="inline-block";
cp.marb=5;
orig_post_div.add(cp);
cp.title="Copy to clipboard";
make_tabbable(cp);
cp.onmouseover=()=>{
	cp.style.cursor="pointer";
};
cp.onclick = do_copy;
cp.onenter = () => {
	do_copy();
	cp.focus();
};
cp.active_message = "[Enter] Copy post";
cp.onfocus=()=>{
	stat();
};
//»

orig_post_div.add(cont);


};//»

const add_comment = com => {//«
	let topic;

	if (no_comments_div){
		no_comments_div.del();
		no_comments_div = null;
	}

	let com_but, exp_but;
	let com_div = mkdv();
	make_tabbable(com_div);
	com_div.onenter=()=>{
		if (exp_but) exp_but.focus();
		else com_but.focus();
	};

	com_div.onfocus=()=>{
		make_visible(com_div);
		stat();
	};

	com_div.active_message="[Enter] Select this post";

	com_div.bor="1px solid #999";
	com_div.pad=5;
	com_div.mar=10;

	let cont = mkdv();
	cont.style.userSelect="text";
	cont.pos="relative";
	cont.fs=15;
	cont.maxh = 52.8;
	cont.over = "hidden";

	let tit = make_title(`${com.author} commented:`, com.time, 17, 15);
	cont.innerText = com.contents;


	let bot = mkdv();
	bot.dis="flex";
	bot.jsc="flex-end";

	com_div.add(tit);
	com_div.add(cont);
	com_div.add(bot);
	comments_div.add(com_div);
	if (cont.scrollHeight > cont.clientHeight) {
		exp_but = mkbut("Show all", bot, ()=>{
			if (exp_but.is_expanded){
				cont.maxh = 50;
				exp_but.innerText = "Show all";
				exp_but.active_message = "[Enter] View entire comment";
			}
			else {
				cont.maxh = "";
				exp_but.innerText = "Show less";
				exp_but.active_message = "[Enter] View less";
			}
			stat();
			exp_but.is_expanded = !exp_but.is_expanded;
		},{message:"[Enter] View entire comment", tabLevel:2, tabParent: com_div});
		exp_but.is_expanded = false;
		exp_but.marr = 10;
		com.expand_button = exp_but;
	}
	com_but = mkbut(`Comments (${com.nreps})`, bot, async()=>{
		main_div.del();
		bot.dis="none";
		if (!topic) {
			com.bot_div = bot;
			topic = new Topic(arg, forumname, com);
			topic.set_posts();
			topic.comments_button = com_but;
			topic.parent = current_topic;
			current_topic = topic;
			await topic.init();
		}
		else {
			topic.set_posts();
			current_topic = topic;
		}
		Main.focus();
		info();
		stat();
	}, {message:"[Enter] Go to comments page", tabLevel:2, tabParent: com_div});
	comments.push({key: com.key, combut: com_but, nreps: com.nreps});
};//»

const add_comments = (arr, from_load) =>{//«

	if (arr.length && (arr[arr.length-1]===null)){
		arr.pop();
	}
	for (let i=0; i < arr.length; i++){
		let com = arr[i];
		add_comment(com);
		if (i+1===arr.length){
			last_comment_id = com.id;
			if (from_load){
				topic_row.update_last_reply(com.author, com.time);
			}
		}
	}
}//»

//Obj/CB«

this.unset_posts=()=>{
	if (use_orig_post) {
		use_orig_post.bot_div.dis="flex";
	}
	main_div.del();

};

this.set_posts=()=>{//«
	topic_div.add(main_div);
}//»

const update_comments=()=>{//«
	return new Promise(async(y,n)=>{
		let gotmore = false;
		for (let com of comments){
			let rv = await fetch(`/_gettopic?forum=${forumname}&id=${arg.key}&postid=${com.key}&nreps=1`);
			if (rv.ok===true){
				let num = (await rv.text()).pi();
				if (num > com.nreps) {
					com.combut.innerText = `Comments (${num})`;
					com.nreps = num;
					gotmore = true;
				}
			}
		}
		y(gotmore);
	});
};//»

this.load_more_comments=()=>{//«
	return new Promise(async(y,n)=>{
		const done_getting = ()=>{
			setTimeout(()=>{getting_comments = false;},1000);
		};
		if (getting_comments) return y();
		getting_comments = true;
		let url = `/_gettopic?forum=${forumname}&id=${arg.key}&fromid=${last_comment_id}`;
		if (reply_to) url+=`&replies=${reply_to}`;
		let rv = await fetch(url);
		let txt = await rv.text();
		if (rv.ok!==true) {
			done_getting();
			return poperr(txt);
		}
		let arr = JSON.parse(txt);
		await add_comments(arr,true);
		update_times();
		if (!arr.length) {
			let rv = await update_comments();
			y(rv);
			done_getting();
		}
		else {
			y(true);
			await update_comments();
			done_getting();
		}
	});
};//»

this.init=()=>{//«
	return new Promise(async(y,n)=>{
		let url = `/_gettopic?forum=${forumname}&id=${arg.key}`;
		if (reply_to) url+=`&replies=${reply_to}`;
		let rv = await fetch(url);
		let txt = await rv.text();
		if (rv.ok!==true) return poperr(txt);
		let arr = JSON.parse(txt);
		if (use_orig_post) {
			set_orig_post(use_orig_post);
		}
		else{ 
			set_orig_post(arr.shift());
		}
		add_comments(arr);
		y();
		stat();
	});
}//»

//»

}//»

const Forum = function(forumname){//«

//Var«

let last_topic_id;
//let got_all_topics;

//»

//DOM«

let fd = forum_div;
let ntr;
let ctb1;
let ctb2

//»

//Funcs«

const make_topic_head=()=>{//«
	let row = mk('tr');
	topic_tab.add(row);
	for (let which of ["Original","Latest","Topic"+"\xa0".repeat(80)]){
		let td = mk('td');
		td.fw="bold";
		td.innerText = which;
		row.add(td);
	}
}//»

const create_topic=async()=>{//«

	let inp = await body.get_input(true);
	if (!inp) return;
	let sub = inp.subject.regstr();
	if (!sub) return poperr("No topic given!");
	if (!sub.match(/^[\x20-\x7e]+$/)) return poperr("Invalid topic (ascii text only)");
	if (sub.length > MAX_SUB_LEN) return poperr("Topic length is too long!");

	let mess = inp.message;
	if (!mess.match(/[a-z0-9]/)) return poperr("Invalid message");

	let rv = await fetch(`/_createtopic?forum=${forumname}&sub=${encodeURIComponent(sub)}`,{method:"POST",body:mess});
	let txt = await rv.text();
	if (rv.ok!==true) return poperr(txt);
	popok("Topic created!");

};//»

const make_topic_row=(arg)=>{//«
	const{key}=arg;
	let row = mk('tr');
	let topic;
	let last_time;
	let last_time_cell;
	make_tabbable(row);
	row.bor="1px solid #777";
	let orig_cell = mk('td');
	orig_cell.setAttribute("valign","top");
	row.add(orig_cell);
	let auth_sp = mksp(arg.author);
	auth_sp.fw="bold";
	orig_cell.add(auth_sp);
	let orig_tmsp = mksp();
	orig_tmsp.marl=10;
	orig_cell.add(orig_tmsp);
	new Time(arg.time, orig_tmsp);

	let latest_cell = mk('td');
	latest_cell.setAttribute("valign","top");
	row.add(latest_cell);
	if (arg.lastrep){
		let arr = arg.lastrep.split(" ");
		auth_sp = mksp(arr[0]);
		auth_sp.fw="bold";
		latest_cell.add(auth_sp);
		let tm = mksp();
		tm.marl=10;
		latest_cell.add(tm);
		last_time = new Time(arr[1],tm);
	}
	let sub_cell = mk('td');
	sub_cell.innerText = atob(arg.subject);
	row.add(sub_cell);

	topic_tab.add(row);
	row.win=Topwin;
	row.onfocus=()=>{
		cur_topic_row = row;
		row.bgcol="#ffc";
		make_visible(row);
		stat();
	};
	row.update_last_reply=(who, time)=>{
		let lc = latest_cell;
		if (last_time) last_time.kill();
		lc.innerHTML="";
		auth_sp = mksp(who);
		auth_sp.fw="bold";
		lc.add(auth_sp);
		let tm = mksp();
		lc.add(tm);
		tm.marl=10;
		last_time = new Time(time,tm);
	};
	row.onblur=()=>{
		cur_topic_row = null;
		row.bgcol="";
	};
	row.off=()=>{
		sub_cell.tcol="";
		sub_cell.style.textDecoration="";
	};
	row.onmouseout=()=>{
		row.off();
	};
	row.onmouseover=()=>{
		sub_cell.tcol="blue";
		sub_cell.style.textDecoration="underline";
		row.style.cursor="pointer";
	};
	row.onclick=async()=>{
		row.off();
		arg.topic_row = row;
		body.set_topic_screen(arg);
		let lastscr, lastelem;
		if (!topic) {
			topic = new Topic(arg, forumname);
			topic.set_posts();
			current_topic = topic;
			await topic.init();
		}
		else {
			topic.set_posts();
			current_topic = topic;
			lastscr = topic.last_scroll_top;
			lastelem = topic.last_active_elem;
		}
		if (lastscr) Main.scrollTop = lastscr;
		if (lastelem) {
			lastelem.focus();
			stat();
		}
		else setTimeout(()=>{
			Main.focus();
			stat();
		},0);
		info();
	};

};//»

const add_topics = arr =>{//«

	for (let t of arr){
		if (t===null){
			got_all_topics = true;
			if (!ntr){
				let d = mkdv();//No topic row
				d.tcol="#444";
				d.w="100%";
				d.ta="center";
				d.innerHTML="<i>[no more topics]</i>";
				forum_div.insertBefore(d, bottom_hr);
			}
			break;
		}
		if (ntr){
			ntr.del();
			ntr=null;
			make_topic_head();
		}
		make_topic_row(t);
		last_topic_id = t.id;
	}

};//»

//»

//Obj/CB«

this.first_topic_row=()=>{
	if (ntr) return null;
	return topic_tab.childNodes[1];
};
this.last_topic_row=()=>{
	if (ntr) return null;
	return topic_tab.lastChild;
};

this.name = forumname;

this.load_more_topics=()=>{//«

	return new Promise(async(y,n)=>{
		if (got_all_topics) return y();
		if (getting_topics) return y();
		getting_topics = true;
		let url = `/_gettopics?forum=${forumname}&fromid=${last_topic_id}`;
		let rv = await fetch(url);
		getting_topics = false;
		let txt = await rv.text();
		if (rv.ok!==true) {
			poperr(txt);
			y();
			return;
		}
		let arr = JSON.parse(txt);
		if (!arr.length) {
			y(true);
			return;
		}
		add_topics(arr);
		update_times();
		y(true);
	});

};//»

this.init=()=>{//«

last_topic_id = null;
got_all_topics = false;
getting_topics = false;
forum_is_initting = true;

ntr = mkdv();//No topic row
ntr.tcol="#444";
ntr.w="100%";
ntr.ta="center";
ntr.innerHTML="<i>[no topics]</i>";

topic_tab = mk('table');
if (1){
	let tt = topic_tab;
	tt.bor="none";
	tt.tcol="#000";
	tt.setAttribute("cellpadding",5);
	tt.w="100%";
}
fd.innerHTML = "";
ctb1 = mkbut("Create topic", fd, ()=>{create_topic()},{message:"[Enter] Create a topic"});//Create Topic Button 1
fd.add(mkhr());
fd.add(ntr);
fd.add(topic_tab);
fd.add(bottom_hr);
ctb2  = mkbut("Create topic", fd, ()=>{create_topic()},{message:"[Enter] Create a topic"});//Create Topic Button 1

create_topic_but1 = ctb1;
create_topic_but2 = ctb2;

return new Promise(async(y,n)=>{
	let url = `/_gettopics?forum=${forumname}`;
	let rv = await fetch(url);
	let txt = await rv.text();
	if (rv.ok!==true) {
		poperr(txt);
		y();
//		noinit();
		return;
	}
	let arr = JSON.parse(txt);
	if (!arr.length) {
		noinit();
		y(true);
		return;
	}
	add_topics(arr);
//	noinit();
	y(true);
});

};//»

//»

};//»

const init = async() => {//«

	if (!arg.forum) return;

	forum = new Forum(arg.forum);

	if (!await forum.init()) return;
	forum_is_initting = false;
	body.set_forum_screen(forum);
	update_times();
	time_interval = setInterval(update_times,1000);
	Main.focus();
	stat();
};//»

const select_next_tabbable = if_rev =>{//«

	let len, arr, ind, lvl;

	let act = document.activeElement;

	if (!(act===Main||Main.contains(act))) return;

	if (forum_is_active){
		arr = get_tabbables(Main);
		if (if_rev) arr.reverse();

		len = arr.length;
		if (act===Main) focus_first(arr);
		else {
			ind = arr.indexOf(act);
			if (is_visible(act)){
				if (ind < len-1) arr[ind+1].focus();
				else arr[ind].tab_parent.focus();
			}
			else focus_first(arr);
		}
	}
	else{
		if (act===Main){
			arr = get_tabbables(Main,1);
			if (if_rev) arr.reverse();
			focus_first(arr);
		}
		else{
			lvl = act.tab_level;
			if (lvl===1){
				arr = get_tabbables(Main,1);
				len = arr.length;
				if (if_rev) arr.reverse();
				ind = arr.indexOf(act);
				if (is_visible(act)){
					if (ind < len-1) arr[ind+1].focus();
					else arr[ind].tab_parent.focus();
				}
				else focus_first(arr);
			}
			else{
				arr = get_tabbables(act.tab_parent, act.tab_level);
				len = arr.length;
				if (if_rev) arr.reverse();
				ind = arr.indexOf(act);
				if (is_visible(act)){
					if (ind < len-1) arr[ind+1].focus();
					else arr[ind].tab_parent.focus();
				}
				else focus_first(arr);
			}
		}
	}

};//»

//Obj/CB«

this.onkeydown=async(e,k)=>{//«
	num_main_escapes=0;
	let act = document.activeElement;
	if (k=="ENTER_"){
		if (act.onenter) {
			e.preventDefault();
			act.onenter();
		}
		else if (act.win===Topwin) act.click();
		return;
	}
	if (getting_input) {
		if (k==="UP_"||k==="DOWN_") {
			if (!(act instanceof HTMLTextAreaElement)) e.preventDefault();
		}
		return;
	}

	if (k==="TAB_"){
		if (getting_input) return;
		e.preventDefault();
		select_next_tabbable();
	}
	else if (k==="TAB_S"){
		if (getting_input) return;
		e.preventDefault();
		select_next_tabbable(true);
	}
	else if (k==="LEFT_"){//«
		if (!forum_is_active) {
			let ct = current_topic;
			let par = ct.parent;
			if (par){
				par.last_child = ct;
				ct.unset_posts();
				current_topic = par;
				current_topic.set_posts();
				if (current_topic.last_scroll_top) Main.scrollTop = current_topic.last_scroll_top;
				if (current_topic.last_active_elem) current_topic.last_active_elem.focus();
			}
			else {
				last_topic = current_topic;
				body.set_forum_screen(forum);
				last_topic.topic_row.focus();
			}
		}
		info();
		stat();
	}//»
	else if (k==="RIGHT_"){//«
		if (forum_is_active){
			if (last_topic){
				last_topic.topic_row.click();
				last_topic = null;
			}
		}
		else if (current_topic && current_topic.last_child){
			let lc = current_topic.last_child;
			lc.comments_button.onclick(true);
			Main.scrollTop = lc.last_scroll_top;
		}
		stat();
	}//»
	else if (k==="SPACE_"){
		if (forum_is_active) {
			if (act===Main){return;}
			if (cur_topic_row && !cur_topic_row.nextSibling && !getting_topics && !got_all_topics){
				if (await forum.load_more_topics()) stat();
			}
		}

	}

};//»

this.onrefresh = async () =>{
	if (getting_input) return;
	if (forum_is_active) {
		if (forum_is_initting) return;
		messdiv.innerText="";
		await forum.init();
		setTimeout(()=>{
			forum_is_initting = false;
			Main.focus();
			stat();
		},1000);
	}
	else{
		info("Getting new comments...");
		if (await current_topic.load_more_comments()) info("New comments found!");
		else info("No new comments",{tcol:"#f88"});
	}
};

this.onescape=()=>{//«
	if (cur_cancel_fn){
		cur_cancel_fn();
		Main.focus();
		stat();
		return true;
	}
	let act = document.activeElement;
	if (act===Main){
		if (num_main_escapes==DO_NUM_MAIN_ESCAPES){
			num_main_escapes=0;
			return false;
		}
		num_main_escapes++;
		return true;
	}
	act.tab_parent.focus();
	return true;
};//»

this.onresize=()=>{overlay.resize();};
this.onkill=()=>{clearInterval(time_interval);};
this.onfocus = () => {

	num_main_escapes = 0;
	if (cur_active_elem) cur_active_elem.focus();
	else Main.focus();

};
this.onblur = () => {
	let act = document.activeElement;
	if (act.win === Topwin) cur_active_elem = act;
	messdiv.innerText="";
};

//»

init();

