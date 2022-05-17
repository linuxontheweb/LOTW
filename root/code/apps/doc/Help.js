
//Imports«
const fsapi=NS.api.fs;
const widgets=NS.api.widgets;
const {popup,popok,poperr,popyesno}=widgets;
const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp,mkbut}=util;
const log=(...args)=>{console.log(...args)};
const cerr=(...args)=>{console.error(...args)};
const cwarn=(...args)=>{console.warn(...args)};
const act=()=>document.activeElement;
const Topwin = Main.top;
Topwin.title="Help";
const winid = Topwin.id;
const NUM=Number.isFinite;
const capi=Core.api;
let ifapi;
let stats;
//»

//DOM«
const mn = Main;
mn.style.userSelect="text";
mn.padt=10;
mn.overy="scroll";
//»

//Var«
const link_class = `${winid}-app_link`;
let cursec;
let cursecnum;
let MAX_SECTION_WID="95ch";
const sections=[];
//»

//Funcs«

const check_scroll = () => {
	if (cursec.active) cursec.article.scrollIntoView();
	else cursec.scrollIntoView();
};

const section=(title,paras)=>{//«

let d = mkdv();
d.marl=d.marr="auto";
d.maxw=MAX_SECTION_WID;
d.minw=500;
d.ta="justify";

let tit = mkdv();
tit.dis="inline-block";
tit.padt=2;
tit.padb=2;
tit.padr=10;
tit.padl=10;
tit.pos="relative";
tit.marl="-2ch";
tit.marb=5;
tit.fs=19;
tit.fw="bold";

let pmsp = mkdv();
pmsp.pos="absolute";
pmsp.innerText = "\u{ff0b}";
pmsp.fs=12;
pmsp.loc(5,4);

let titsp = mksp();
titsp.innerText = `\xa0\xa0\xa0${title}`;
tit.add(pmsp);
tit.add(titsp);
tit.onmouseover=()=>{
	tit.style.cursor="pointer";
};
tit.active=false;
tit.onclick=()=>{
	if (pdiv.dis=="none"){
		pdiv.dis="";
		pmsp.innerText = "\u{ff0d}";
	}
	else{
		pdiv.dis="none";
		pmsp.innerText = "\u{ff0b}";
	}
	tit.active = !tit.active;
};
tit.on=()=>{
	tit.bgcol="#ff9";
};
tit.off=()=>{
	tit.bgcol="";
};
d.add(tit);

let pdiv = mkdv();
tit.article = pdiv;
pdiv.dis="none";
d.add(pdiv);

for (let str of paras){
	let p = mkdv();
	p.fs=17;
	p.innerHTML=str;
	p.marb=15;
	pdiv.add(p);
}


mn.add(d);

sections.push(tit);

let links = Topwin.getElementsByClassName(link_class);
for (let ln of links){
	let app = ln.attributes["data-app"].value;
	ln.td="underline";
	ln.tcol="blue";
	ln.onmouseover=()=>{
		ln.style.cursor="pointer";
	};
	ln.onclick=()=>{
		if (app) Desk.openApp(app);
	};
}
return tit;

};//»

const init=()=>{//«


cursec = section("System Overview",[

`

A local, sandboxed filesystem lives at the heart of LOTW. Every operating system includes
a command line interface as the main entryway into its filesystem, and LOTW is no different in
that regard. There are historically two major kinds of command line interfaces: Unix-like and
DOS-like. The LOTW System offers a Unix-like version.


`


]);

cursecnum=0;

section("The Shell Environment",[

`

The shell environment is built atop a subset of the POSIX standard, Shell Command
Language. Its main purpose is for interactive use rather than for scripting, 
and for that reason, algorithmic control structures like "if...then", "for...do", and 
"while...do" are not offered (JavaScript is a much better choice for writing algorithms in
LOTW).

`

]);

section("The Desktop Environment",[

`

The desktop environment is an amalgam of several influences, notably the Windows 95-like 
taskbar at the bottom of the screen.

`

]);

section("Help Wanted",[

`

This is obviously not a complete help system.
People who enjoy helping others are needed! If you like writing technical documentation,
please send me (dennis) a message from the <span class="${link_class}" data-app="net.Mail">Mail app</span>, which is an internal messaging system, and <i>not</i> an email client!
(You can sign up for an LOTW account by clicking "\u{1f464}" at the bottom-right.)  

`

]);


cursec.on();

Topwin.status_bar.innerText = "Up/Down arrows to navigate. Space or Enter to toggle.";

}//»

//»

setTimeout(init,0);

//Obj/CB«

this.onkeydown=(e,k)=>{

if (k=="UP_"){
	if (cursecnum==0) return check_scroll();
	cursec.off();
	cursecnum--;
	cursec = sections[cursecnum];
	cursec.on();
	check_scroll();
}

else if (k=="DOWN_"){
	if (cursecnum==sections.length-1) return check_scroll();
	cursec.off();
	cursecnum++;
	cursec = sections[cursecnum];
	cursec.on();
	check_scroll();
}
else if (k=="SPACE_"||k=="ENTER_"){
	cursec.click();
}


};
//»


