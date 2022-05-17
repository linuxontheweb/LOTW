
//Imports«
const Topwin = Main.top;
const {popup:_popup,popok:_popok,poperr:_poperr,popyesno:_popyesno}=NS.api.widgets;
//const opt = {win:Topwin};
const popup = (s) => {
	return new Promise((y,n)=>{
		_popup(s, {win:Topwin, cb:y});
	});
};
const popok = (s) => {
	return new Promise((y,n)=>{
		_popok(s, {win:Topwin, cb:y});
	});
};
const poperr = (s) => {
	return new Promise((y,n)=>{
		_poperr(s, {win:Topwin, cb: y});
	});
};
const popyesno = (s) => {
	return new Promise((y,n)=>{
		_popyesno(s, {win:Topwin, cb: y});
	});
//	_popyesno(s, opt);
};

//const fsapi=NS.api.fs;
const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp}=util;
const log=(...args)=>{console.log(...args)};
const cerr=(...args)=>{console.error(...args)};
const cwarn=(...args)=>{console.warn(...args)};
const act=()=>document.activeElement;
Topwin.title="Mail";
const NUM=Number.isFinite;
const capi=Core.api;
const isdev=()=>{return dev_mode&&dev_env};
let ifapi;
let stats;
//»

//Var«

const FROM_COL_WID = 200;
const DATE_COL_WID = 200;

const messages={};
let first_id, last_id;
let getting_messages = false;
let got_all_messages = false;
let username;
//»

//Dom«
let appdiv = mkdv();
appdiv.mar=15;

Main.add(appdiv);
Main.overy="scroll";
let refresh_but, compose_but, send_but, can_but, del_but, load_more_but;
let active_div;


const checks = [];
const mkhr=()=>{return mk('hr');}
const mkbut=(str, fn, par, if_active)=>{//«
	let butcol="e7e7e7";
	let butborcol="#ccc";
	let disabled = false;
	let d = mkdv();
	d.tabIndex="0";
	d.bgcol=butcol;
	d.padt=d.padb=3;
	d.padr=d.padl=5;
	d.dis="flex";
	d.ali="center";
	d.jsc="center";
	d.fs=15;
	d.innerText=str;
	d.bor=`3px outset ${butborcol}`;
	d.onmousedown=()=>{if(disabled)return;d.bor=`3px inset ${butborcol}`;};
	d.onmouseup=()=>{if(disabled)return;d.bor=`3px outset ${butborcol}`;};
	d.onmouseout=()=>{if(disabled)return;d.bor=`3px outset ${butborcol}`;};
	d.win=Topwin;
	d.onclick=(e)=>{
		if (disabled) return;
		if (e.isTrusted) return fn();
		d.bor="3px inset #aaa";
		setTimeout(()=>{d.bor="3px outset #aaa";fn();},200);
	};
	if (par) par.add(d);
	d.disable=()=>{
		disabled=true;
		d.tcol="#777";
	};
	if (if_active) setTimeout(()=>{d.focus()},25);
	return d;
}//»
const overdiv = mkdv();//«
overdiv.pos="absolute";
overdiv.loc(0,0);
overdiv.h="100%";
overdiv.w="100%";
overdiv.bgcol="rgba(0,0,0,0.5)";
overdiv.z=100;
overdiv.dis="none";
overdiv.jsc="center";
overdiv.ali="center";
overdiv.over="auto";
Main.add(overdiv);
//»
const add_no_mess_row=()=>{//«
	no_message_row = mkdv();
	no_message_row.tcol="#444";
	no_message_row.w="100%";
	no_message_row.ta="center";
	no_message_row.innerHTML="<i>[no messages]</i>";
	messtab.add(no_message_row);
};//»

const topdiv = mkdv();
topdiv.marb=15;
topdiv.dis="flex";
topdiv.jsc="space-between";
const butdiv = mkdv();
butdiv.innerText
const namediv = mkdv();
namediv.fs=16;
//namediv.innerText="\u{1f464}";
//namediv.innerText="\u{1f464}";
//namediv.fs="21";

appdiv.add(topdiv);

const messtabdiv = mkdv();

messtabdiv.add(mkhr());

const messtab = mkdv();
if (true) {
	let row = mkdv();
	row.dis="flex";
	row.ali="flex-end"
	messtab.add(row);
	let cktd = mkdv();
	let ck = mk('input');
	ck.type="checkbox";
	ck.onclick=()=>{
		for (let c of checks) c.checked=ck.checked;
	};
	cktd.add(ck);
	row.add(cktd);
	for (let col of [["From",FROM_COL_WID],["Date",DATE_COL_WID],["Subject"]]){
		let td = mkdv()
		td.padl=10;
		td.padt=3;
		td.fw="bold";
		td.fs=16;
		td.innerText = col[0];
		if (col[1]) td.style.flex = `0 0 ${col[1]}px`;
		else td.flg = 1;
		row.add(td);

	}
	messtab.add(mkhr());
}
messtab.w="100%";
messtab.tcol="#000";
let no_message_row;
add_no_mess_row();
messtabdiv.add(messtab);
messtabdiv.add(mkhr());
appdiv.add(messtabdiv);

const botdiv = mkdv();
botdiv.dis="flex";
botdiv.mart=10;

appdiv.add(botdiv);

refresh_but = mkbut("Check for newer",()=>{refresh();},botdiv);
refresh_but.marr=10;

load_more_but = mkbut("Load older", ()=>{load_more()}, botdiv);
load_more_but.marr=10;

del_but = mkbut("Delete",async()=>{//«
	let all=[];
	let idarr=[];
	for (let chk of checks){
		if (chk.checked) {
			idarr.push(chk._messid);
			all.push(chk);
		}
	}
	if (all.length) {
		let rv = await popyesno(`Delete ${all.length} messages?`);
		if (!rv) return;
		rv = await fetch('/_delmessages?ids='+idarr.join(","));
		if (!check_stat(rv)) return;
		let arr = await rv.json();
		for (let chk of all){
			if (arr.includes(chk._messid)){
				chk._row.del();
			}
			else{
console.warn("Problem deleting:",chk._messid);
			}
		}
		if (messtab.childNodes.length==2)add_no_mess_row();
	}
	else popup("Nothing to delete!");
}, botdiv);
//»

del_but.marr=10;

//»

//Funcs«

//Util«

const noprop=e=>{e.stopPropagation()};

const load_more=()=>{//«
	if (got_all_messages) return;
	if (last_id > 1) get_messages(last_id);
}//»
const clear_active=()=>{//«
	active_div.del();
	overdiv.dis="none";
	send_but=can_but=null;
	compose_but.focus();
}//»
const make_link=(str, cb)=>{//«
	let sp = mksp();
	sp.innerText=str;
	sp.tcol="blue";
	sp.td="underline";
	sp.onmouseover=()=>{
		sp.style.cursor="pointer";
	};
	return sp;
};//»

//»

const refresh=async (arg)=>{//«
	if (!NUM(first_id)) return;
	if (getting_messages) return;
	getting_messages = true;
	let rv = await fetch(`/_getmessages?minid=${first_id}`);
	getting_messages = false;
	if (!check_stat(rv)) return;
	let arr = await rv.json();
	if (arr[0]===null) return popok("No newer messages were found!");

	if (arr[arr.length-1]===null) arr.pop();

	if (no_message_row){
		no_message_row.del();
		no_message_row=null;
	}

	for (let mess of arr){
		first_id = mess.id;
		let tr = make_message_row(mess);
		let kids = messtab.childNodes;
		if (kids.length==2) messtab.add(tr);
		else {
			kids[2].style.borderTop="1px dotted #777";
			messtab.insertBefore(tr, kids[2]);
		}
	}
};//»

const compose = (arg)=>{//«

let reply_to;
let reply_sub;
let replies;
if (arg){
	reply_to = arg.from;
	if (arg.replies) reply_sub = atob(arg.subject);
	else reply_sub = `Re: ${atob(arg.subject)}`
	let messid = `${username}:${arg.id}`;
	if (!arg.replies) replies = messid;
	else replies = `${arg.replies},${messid}`;
}
active_div=mkdv();

overdiv.dis="flex";
overdiv.fld="column";

active_div.bgcol="#fff";
active_div.pad=10;
let tab = mk('table');
tab.tcol="#000";
let rw;
let td1,td2;

let toinp = mk('input');
if (reply_to) {
	toinp.value = reply_to;
	toinp.disabled = true;
}
toinp.placeholder="e.g. dennis";
toinp.w=500;
toinp.type="text";
rw = mk('tr');td1 = mk('td');td2 = mk('td');
td1.innerText="To:";
td2.add(toinp);
rw.add(td1);
rw.add(td2);
tab.add(rw);

let subinp = mk('input');
if (reply_sub){
	subinp.value = reply_sub;
	subinp.disabled = true;
}
subinp.w=500;
subinp.type="text";
rw = mk('tr');td1 = mk('td');td2 = mk('td');
td1.innerText="Subject:";
td2.add(subinp);
rw.add(td1);
rw.add(td2);
tab.add(rw);

let messinp = mk('textarea');
messinp.w=500;
messinp.h=300;
rw = mk('tr');td1 = mk('td');td2 = mk('td');
td1.setAttribute("valign","top");
td1.innerText="Message:";
td2.add(messinp);
rw.add(td1);
rw.add(td2);
tab.add(rw);

active_div.add(tab);
send_but = mkbut("Send",async()=>{
	let uname = toinp.value.regstr();
//	if (!uname) return poperr("No user specified");
	if (!uname) {
		await poperr("No user specified");
		toinp.focus();
		return 
	}
	if (!uname.match(/^[a-z][a-z_0-9]+$/i)) {
		await poperr("Invalid username");
		toinp.focus();
		return 
	}
	let rv = await fetch(`/_checkuser?user=${uname}`);
	if (!check_stat(rv)) return;
	let sub = subinp.value.regstr();
	if (!sub) sub="[no subject]";
	let mess = messinp.value;
	if (!mess.match(/[a-z]/i)) {
		await poperr("Invalid message");
		messinp.focus();
		return 
	}
	let url = `/_sendtouser?user=${uname}&sub=${encodeURIComponent(btoa(sub))}`;
	if (replies) url+=`&replies=${encodeURIComponent(replies)}`;
	rv = await fetch(url,{method:"POST",body:`${mess}`});
	if (!check_stat(rv)) return;
//	active_div.del();
	clear_active();
	await popok("Message sent!");
	compose_but.focus();
},active_div);

send_but.mart=7;
send_but.marl=7;
send_but.dis="inline-flex";
send_but.style.cssFloat="right";
can_but = mkbut("Cancel",()=>{
	clear_active();
},active_div);
can_but.mart=7;
can_but.dis="inline-flex";
can_but.style.cssFloat="right";

overdiv.add(active_div);

setTimeout(()=>{
	if (replies) messinp.focus();
	else toinp.focus();
},50);


};//»

const make_message_row = m =>{//«

let id = m.id;

let usefw =  m.read?"":"bold";
let from = m.from;
let tm = m.time;
let sub = atob(m.subject);

let tr = mkdv();
tr.dis="flex";

tr.padb=tr.padt=5;
tr.fs=18;

let td1,td2,td3,td4;
td1=mkdv();
td1.style.flex="0 0 auto";
td2=mkdv();
td2.style.flex = `0 0 ${FROM_COL_WID}px`;
td2.over="hidden";
td3=mkdv();
td3.style.flex = `0 0 ${DATE_COL_WID}px`;
td3.over="hidden";
td4=mkdv();
td4.flg=1;
td4.over="hidden";
tr.fw = usefw;

td2.padl=td3.padl=td4.padl=10;

td1.onmouseover=noprop;
td1.onclick=noprop;
td1.w=20;
let chk = mk('input');
chk.type="checkbox";
chk._messid = id;
chk._row = tr;

checks.push(chk);

td1.ta="center";
td1.add(chk);
td2.innerText= from;
td3.innerText = time_str(1000*tm);
if (sub.length > 38) sub = sub.slice(0,35)+"...";
td4.innerText = sub;
tr.add(td1);
tr.add(td2);
tr.add(td3);
tr.add(td4);

tr.onmouseover=()=>{tr.bgcol="ddf";tr.style.cursor="pointer";};
tr.onmouseout=()=>{tr.bgcol="";};
tr.onclick=async()=>{//«
	let mess = messages[id+""];
	if (mess) return render_message(mess, tr, true);
	let rv = await fetch(`/_getmessage?id=${id}`);
	if (!check_stat(rv)) return;
	
	mess = await rv.json();
	messages[id+""]=mess;
	render_message(mess, tr, false);
	if (!mess.read) {
		if (await fetch(`/_markasread?id=${id}`)) tr.fw="";
	}

};//»
return tr;

};//»

const get_messages=(fromid)=>{//«
	return new Promise(async(y,n)=>{
		if (getting_messages) return y();
		getting_messages = true;
		let url='/_getmessages';
		if (fromid) url += `?maxid=${fromid}`;

		let rv = await fetch(url);
		getting_messages = false;
		if (!rv&&rv.ok===true) return y();

		let txt = await rv.text();
		let arr;
		try {
			arr = JSON.parse(txt);
		}
		catch(e){
			console.error(e);
			y();
			return;
		}
		if (arr[0]===null) {
			first_id = 0;
			last_id = 0;
			load_more_but.disable();
			got_all_messages=true;
			y();
			return;
		}
		if (no_message_row){
			no_message_row.del();
			no_message_row=null;
		}
		if (arr[arr.length-1]===null){
			arr.pop();
			load_more_but.disable();
			got_all_messages=true;
		}
		if (!fromid) first_id = arr[0].id;
		for (let m of arr){
			last_id = m.id;
			let tr = make_message_row(m);
			if (messtab.childNodes.length > 2) tr.style.borderTop="1px dotted #777";
			messtab.add(tr);
		}
		y();
	});
}//»

const render_message=(mess, row, cached)=>{//«
active_div=mkdv();
let act = active_div;

overdiv.dis="flex";
overdiv.fld="column";

act.bgcol="#fff";
act.pad=10;
act.over="scroll";
act.maxw=500;
act.w=500;
let d;
d=mkdv();
d.innerText=`From: ${mess.from} (${time_str(1000*mess.time)})`;
act.add(d);
d=mkdv();
d.innerText = `Subject: ${atob(mess.subject)}`;
act.add(d);
act.add(mk('hr'));

if (mess.replies){//«

let reps = mess.replies.split(",");
let reptog = make_link("+\xa0Show\xa0Thread");
let repdv = mkdv();
repdv.marl=10;
repdv.dis="none";

for (let rep of reps){//«
	let repln = make_link(`+\xa0${rep}`);
	let d = mkdv();
	d.dis="none";
	d.bor="1px solid #999";
	repln.onclick=async()=>{//«
		let arr = rep.split(":");
		let rv = await fetch(`/_getmessage?id=${arr[1]}&user=${arr[0]}`);
		if (!check_stat(rv)) return;
		let repmess = await rv.json();
		repln.innerText = `-\xa0${rep}`;
		d.dis="block";
		d.innerText=repmess.message;
		repln.onclick=()=>{
			if (d.dis=="none"){
				d.dis="block";
				repln.innerText = `-\xa0${rep}`;
			}
			else{
				d.dis="none";
				repln.innerText = `+\xa0${rep}`;
			}
		};
	};//»
	repdv.add(repln);
	repdv.add(mk('br'));
	repdv.add(d);
}//»
reptog.onclick = ()=>{//«
	if (repdv.dis==="none") {
		reptog.innerText="-\xa0Hide\xa0Thread";
		repdv.dis="block";
	}
	else {
		reptog.innerText="+\xa0Show\xa0Thread";
		repdv.dis="none";
	}
};//»

d=mkdv();
d.add(reptog);
d.add(mk('br'));
d.add(repdv);

act.add(d);
act.add(mk('hr'));

}//»

d=mkdv();
d.pos="relative";
d.maxh=500;
d.minh=100;
d.over = "auto";
d.style.userSelect="text";
d.innerText = mess.message;

let cp = mkdv();
cp.innerText="\u{1f4cb}";
cp.pos="absolute";
cp.r=0;
cp.y=0;
cp.title="Copy to clipboard";
cp.onmouseover=()=>{
	cp.style.cursor="pointer";
};
cp.onclick=()=>{
	capi.clipCopy(mess.message);
	cp.innerText="\u{2713}";
	cp.title="Copied!";
};
d.add(cp);

act.add(d);
act.add(mk('hr'));

let okbut = mkbut("OK",clear_active,act, true);
//okbut.focus();
okbut.marl=7;
okbut.dis="inline-flex";
okbut.style.cssFloat="right";

let repbut = mkbut("Reply",async()=>{
	clear_active();
	compose(mess)
},act);

repbut.marl=7;
repbut.dis="inline-flex";
repbut.style.cssFloat="right";


let delbut = mkbut("Delete",async()=>{
	if (!(await popyesno(`Delete this message?`))) return;
	let rv = await fetch('/_delmessages?ids='+mess.id);
	if (!check_stat(rv)) return;
	let arr = await rv.json();
	if (arr.includes(mess.id)){
		row.del();
		clear_active();
		if (messtab.childNodes.length==2)add_no_mess_row();
	}
	else poperr("There was a problem deleting the message");
},act);
delbut.marl=7;
delbut.dis="inline-flex";
delbut.style.cssFloat="right";
overdiv.add(active_div);
}//»

const time_str=(time)=>{//«
	let arr = new Date(time).toString().split(" ");
	let mon = arr[1];
	let d = arr[2].replace(/^0/,"");
	let tmarr = arr[4].split(":");
	let yr = arr[3];

	let thisyr = new Date().toDateString().split(" ").pop();
	if (yr == thisyr) yr="";
	else yr = yr+", ";

	let ampm="a";
	let hr = parseInt(tmarr[0]);
	if (hr >= 12){
		ampm = "p";
		if (hr >= 13) hr-=12;
	}
	return `${mon} ${d} ${yr}${hr}:${tmarr[1]}${ampm}`;
};//»

const check_stat=rv=>{//«
	if (!rv) return poperr("Network error");
	if (!rv.ok===true) {
		if (rv.status===500) return poperr("Server error");
		if (rv.status===404) {
			(async()=>{
				poperr(await rv.text());
			})();
			return;
		}
		else return poperr("Unknown error");
	}
	return true;
};//»
const not_signed_in=()=>{//«
	namediv.innerText="";
//	namediv.fs="21";

	let d = overdiv;
	d.dis="flex";
	let dv = mkdv();
	dv.fs=24;
	dv.pad=20;
	dv.bgcol="#000";
	dv.tcol="#ccc";
	dv.ta="center";
	dv.innerHTML=`
You are not signed in!
<br>
<span style="font-size:17;">(Sign in or sign up by clicking "\u{1f464}" below)</span>
`;
	d.add(dv);
};//»
const get_username=()=>{//«
	return new Promise(async(y,n)=>{
		let rv = await fetch('/_status?nameonly=1');
		if (rv && rv.ok===true) username = await rv.text();
		if (!username){
			not_signed_in();
			return y();
		}
		namediv.fs=16;
		namediv.innerText=`Signed in as: ${username}`;
		y(true);
	});
};//»

const init=async()=>{//«
	compose_but = mkbut("Compose",compose,topdiv, true);
	topdiv.add(namediv);
	if (!await get_username()) return;
	get_messages();
}
//»

//»

//Obj/CB«

this.onescape=()=>{
	if (can_but){
		can_but.click();
		return true;
	}
	return false;
};

this.onlogin=(name)=>{
	overdiv.innerHTML="";
	overdiv.dis="none";
	username = name;
	namediv.innerText=`Signed in as: ${username}`;
	get_messages();
};

this.onlogout=()=>{
	username=null;
	let kids = Array.from(messtab.childNodes);
	let ln = kids.length;
	for (let i=2; i < ln; i++){
		kids[i].del();
	}
	add_no_mess_row();
	not_signed_in();
};

this.onkeydown=(e,k)=>{
	if (!username) return;
	let act = document.activeElement;
	if (k==="ENTER_"){
		if (act.win===Topwin) act.click();
	}
	else if (k=="SPACE_CAS") {
		if (isdev&&!send_but) compose_but.click();
	}
	else if (k=="ENTER_A"){
		if (isdev&&send_but) return send_but.click();
	}
	else if (k=="DOWN_") load_more();
};

//»

init();
 
