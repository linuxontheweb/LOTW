
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
Topwin.title="About";
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
let cursec;
let cursecnum;
let MAX_SECTION_WID="95ch";
const sections=[];
//»

//Funcs«

const check_scroll=()=>{if(cursec.active)cursec.article.scrollIntoView();else cursec.scrollIntoView();};

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
tit.active = false;
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

return tit;

};//»

const init=()=>{//«

cursec = section("Background",[//«
`
Hi, this is Dennis, creator (and currently the lone developer) of the thing
that I like to call "Linux on the Web" (LOTW) :) !

`,
`

Quite simply, LOTW intends to revolutionize the "web app" concept by 
taking the "web" out of "web app". For those who remember, there was a time
before the web invaded our lives that a computer program was really just a
simple series of steps for the computer to execute, as devised by the
programmer. The first personal computers in the late 70's and early 80's (I
remember having a TRS 80 Model III) sat around waiting for people to sit down,
type in programs, and run them.

`,
`

All programs were quite different, and there was quite an ecosystem of them.
But then, software development became a massive enterprise, and the ecosystem
aspect slowly withered away as interfaces became increasingly catered to
non-technically-minded end users. With the advent of Windows 95 and Netscape
Navigator, the idea of what personal computing is (and what it can mean for our
individual lives) started to become fixed in stone.

`,
`

Until about the mid-2000's, web browsers were really only about displaying
static content, ie, electronic documents. (Plugins, such as Java and Flash, which
existed for the insertion of dynamic content and execution of simple programs
were also a part of the web, but because they were foreign objects to be
"plugged in", rather than native to the web, in itself, they are not really a
part of this discussion.) Then, "killer apps" like Gmail and Twitter started to
show up.  These were in position to start putting the web's own scripting
language (JavaScript) to work, so that web pages could be more responsive to
the user's actions (mainly mouse scrolling and clicking).

`,
`

At the end of the 2000's, JavaScript began to take on a life of its own when
there were whispers of an exciting new thing called HTML 5 and when it
developed an ecosystem around Node.js (server-side JavaScript). One of the main
reasons for both of these things was probably the birth of Google's Chrome
browser in 2008.

`,

`

The 2010's were filled with nonstop changes to the web platform, given that
browsers started to get into a regular 6 week update cycle (compare that to the
5 year gap between the releases of Internet Explorer versions 6 and 7). But
with so much change also comes uncertainty, with regard to the question of just
what in the heck the web is <i>really</i> all about. Is it more of an "app"
thing or a "doc" thing?

`,
`

As I see it, the truth is that the web is currently a hopelessly tangled mess
of both kinds of things, and it isn't until a perfectly usable, full-blown
icons-and-windows desktop interface comes onto the scene that the concept of
the "web app" can fully come into its own, and computer programmers who happen
to work with web-based technologies can start understanding themselves
simply as programmers of mechanical devices, rather than as document
authors and layout specialists.

`
]);
//»

cursecnum=0;

section("Features",[//«
`

In order for something to qualify as an computer operating system, it is
essential for there to be some kind of persistent data storage that does not
depend in any way on network conditions. The way that our data is typically
stored comes in the form of a file system abstraction, which involves files
that exist inside of directories (or folders), and directories that exist
inside of other directories.

`,

]);
//»

cursec.on();

}//»

//»

setTimeout(init,0);

//Obj/CB«

this.onkeydown=(e,k)=>{

if (k=="UP_"){
	if (cursecnum==0) return check_scroll();;
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
else if (k=="ENTER_"){

cursec.click();

}


};
//»

