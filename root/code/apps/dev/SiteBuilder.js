//Docs«
/*Minmax«

The minmax() CSS function defines a size range greater than or equal to min and less than or equal to max. It is used with CSS Grids.

/ <inflexible-breadth>, <track-breadth> values
minmax(200px, 1fr)
minmax(400px, 50%)
minmax(30%, 300px)
minmax(100px, max-content)
minmax(min-content, 400px)
minmax(max-content, auto)
minmax(auto, 300px)
minmax(min-content, auto)

// <fixed-breadth>, <track-breadth> values
minmax(200px, 1fr)
minmax(30%, 300px)
minmax(400px, 50%)
minmax(50%, min-content)
minmax(300px, max-content)
minmax(200px, auto)

// <inflexible-breadth>, <fixed-breadth> values
minmax(400px, 50%)
minmax(30%, 300px)
minmax(min-content, 200px)
minmax(max-content, 200px)
minmax(auto, 300px)
Syntax
A function taking two parameters, min and max.

Each parameter can be a <length>, a <percentage>, a <flex> value, or one of the keyword values max-content, min-content, or auto.

If max < min, then max is ignored and minmax(min,max) is treated as min. As a maximum, a <flex> value sets the flex factor of a grid track; it is invalid as a minimum.

Values
<length>
A non-negative length.
<percentage>
A non-negative percentage relative to the inline size of the grid container in column grid tracks, and the block size of the grid container in row grid tracks. If the size of the grid container depends on the size of its tracks, then the <percentage> must be treated as auto. The user agent may adjust the intrinsic size contributions of the track to the size of the grid container and increase the final size of the track by the minimum amount that would result in honoring the percentage.
<flex>
A non-negative dimension with the unit fr specifying the track’s flex factor. Each <flex>-sized track takes a share of the remaining space in proportion to its flex factor.
max-content
Represents the largest max-content contribution of the grid items occupying the grid track.
min-content
Represents the largest min-content contribution of the grid items occupying the grid track.
auto
As a maximum, identical to max-content. As a minimum it represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.
Formal syntax
minmax( [ <length> | <percentage> | <flex> | min-content | max-content | auto ] , [ <length> | <percentage> | <flex> | min-content | max-content | auto ] )
CSS properties
minmax() function can be used within: 

grid-template-columns
grid-template-rows
grid-auto-columns
grid-auto-rows

»*/
/*Units«

Unit	Name	Equivalent to
cm	Centimeters	1cm = 96px/2.54
mm	Millimeters	1mm = 1/10th of 1cm
Q	Quarter-millimeters	1Q = 1/40th of 1cm
in	Inches	1in = 2.54cm = 96px
pc	Picas	1pc = 1/16th of 1in
pt	Points	1pt = 1/72th of 1in
px	Pixels	1px = 1/96th of 1in

Most of these values are more useful when used for print, rather than screen output.
For example we don't typically use cm (centimeters) on screen. The only value that you 
will commonly use is px (pixels).

Relative length units
Relative length units are relative to something else, perhaps the size of the parent element's 
font, or the size of the viewport. The benefit of using relative units is that with some careful 
planning you can make it so the size of text or other elements scale relative to everything else 
on the page. Some of the most useful units for web development are listed in the table below.

Unit	Relative to
em	Font size of the parent element.
ex	x-height of the element's font.
ch	The advance measure (width) of the glyph "0" of the element's font.
rem	Font size of the root element.
lh	Line height of the element.
vw	1% of the viewport's width.
vh	1% of the viewport's height.
vmin	1% of the viewport's smaller dimension.
vmax	1% of the viewport's larger dimension.
fr		fraction of the available space in the grid container
»*/
//»
//Import«
const log=(...args)=>{console.log(...args)};
const cwarn=(...args)=>{console.warn(...args)};
const cerr=(...args)=>{console.err(...args)};
const{util}=globals;
const widgets = NS.api.wdg;
const fs = NS.api.fs;
const{popin, popinarea, popyesno}=widgets;
const topwin = Main.top;
const WINID = topwin.id;
const{randCol}=Core.api;
/*
opts.defTxt,
opts.title,
opts.win
*/
const{make,mkdv,mksp}=util;
const cfgdir = `/home/${Core.get_username()}/.config/apps/SiteBuilder`;
const vals_file = `${cfgdir}/cssvals.json`;
const noop=()=>{};
let mn = mkdv();
//»

//Var«
let cur = mn;
let menu_hold, stat_hold;
//let layout_mode = false;

let VALS = Core.get_appvar(topwin, "CSSVALS");
//if (!VALS) VALS = {};
let curvals;
let menu=null;
let rv;
let curstat;
let m0,m1,m2,m3,m4,m5,m6,m7,m8,m9;
let s0,s1,s2,s3,s4,s5,s6,s7,s8,s9;
let MAIN_ON_COL="#aaa";
let MAIN_OFF_COL="#888";
//»
//Dom«
let msty=Main.style;
Main.dis="flex";
Main.bgcol="#000";
//log(Main);
msty.alignItems="center";
msty.justifyContent="center";

const statbar = Main.top.status_bar;
statbar.padr=5;
statbar.dis="flex";
statbar.style.justifyContent="space-between";
statbar.w="100%";
//statbar.style.justifyContent="center";
//log(statbar);
statbar.padt=1;
statbar.fw="bold";
statbar.fs=15;
statbar.tcol="#ccc";
const menubar = mkdv();
const curbar = mkdv();
const endbar = mkdv();
const BOR_ON ="1.5px solid red";
const BOR_OFF="1.5px solid black";
statbar.add(menubar);
statbar.add(curbar);
//statbar.add(endbar);
//mn.pos="absolute";
mn.w="99%";
mn.h="99%";
//mn.loc(0,0);
mn.bgcol=MAIN_ON_COL;
mn.bor=BOR_ON;
mn.off=()=>{
//	mn.bgcol=MAIN_OFF_COL;
	mn.bor=BOR_OFF;
};
mn.on=()=>{
	cur.off();
//	mn.bgcol=MAIN_ON_COL;
	mn.bor=BOR_ON;
	cur=mn;
};
Main.add(mn);
//»
//Funcs«

const getid=()=>{//«
	if (cur.id){
		let arr = cur.id.split("-")
		arr.shift();
		return arr.join("-");
	}
	return;
}//»
const stat=s=>{//«
	let useid = getid()||"[none]"
	menubar.innerText=s;
	curbar.innerText = useid;
	return s;
};//»
const clear=()=>{statbar.innerText="";}
const s=()=>{return cur.style;}
const up=(s,m)=>{stat(s);menu=m;};
const mkelem = (which)=>{//«
	let elm = make(which);
	elm.on=()=>{
		cur.off();
		cur=elm;
		elm.bor=BOR_ON;;
//		elm.bgcol="#fff";
	};
	elm.off=()=>{
		elm.bor=BOR_OFF;
//		elm.bgcol="";
	};
	if (cur==mn){}
	else if(cur.childNodes[0] instanceof HTMLElement){}
	else cur.innerHTML="";
	elm.bor=BOR_OFF;
	cur.add(elm);
	let nkids = elm.parentNode.childNodes.length;
	if (elm.parentNode!==mn) nkids--;
	elm.innerHTML=`${which} ${nkids}`;
};//»
const set_layout_options=()=>{//«
	if (cur.dis=="flex"){//«
		s2=stat("Flex: [f]lex [j]ustify [d]irection [a]lign-items align-[s]elf");
		m2=menu={
			f:async()=>{
				curvals = VALS.flex;
				if (!curvals){
					curvals = [];
					VALS.flex=curvals;
				}
				rv = await popin("",{title:"Set flex", choices:curvals, defTxt:s().flex});
				if(!rv) return;
				if (!curvals.includes(rv)) curvals.push(rv);
				s().flex = rv;
			},
			j:()=>{
				stat(`Justify-Content(${s().justifyContent}): [s]tart [e]nd [c]tr [a]round [b]etween e[v]enly`);
				menu={
					s:()=>{s().justifyContent="flex-start";m2.j()},
					e:()=>{s().justifyContent="flex-end";m2.j()},
					c:()=>{s().justifyContent="center";m2.j()},
					a:()=>{s().justifyContent="space-around";m2.j()},
					b:()=>{s().justifyContent="space-between";m2.j()},
					v:()=>{s().justifyContent="space-evenly";m2.j()},
					u:()=>{up(s2,m2)}
				}
			},
			d:()=>{
				stat(`Flex-Direction(${s().flexDirection}): [r]ow [c]ol ro[w]-rev co[l]-rev`);
				menu={
					r:()=>{s().flexDirection="row";m2.d();},
					w:()=>{s().flexDirection="row-reverse";m2.d();},
					c:()=>{s().flexDirection="column";m2.d();},
					l:()=>{s().flexDirection="column-reverse";m2.d();},
					u:()=>{up(s2,m2)}
				};
			},
			a:()=>{
				stat(`Align-Items(${s().alignItems}): [s]tart [e]nd [c]enter s[t]retch`);
				menu={
					t:()=>{s().alignItems="stretch";m2.a();},
					s:()=>{s().alignItems="flex-start";m2.a();},
					e:()=>{s().alignItems="flex-end";m2.a();},
					c:()=>{s().alignItems="center";m2.a();},
					u:()=>{up(s2,m2)}
				};
			},
			s:()=>{
				stat(`Align-Self(${s().alignSelf}): [s]tart [e]nd [c]enter s[t]retch`);
				menu={
					t:()=>{s().alignSelf="stretch";m2.s();},
					s:()=>{s().alignSelf="flex-start";m2.s();},
					e:()=>{s().alignSelf="flex-end";m2.s();},
					c:()=>{s().alignSelf="center";m2.s();},
					u:()=>{up(s2,m2)}
				};
			},
			u:()=>{up(s1,m1)}
		}
	}//»
	else if (cur.dis=="grid"){//«
		s3=stat("Grid: [f]lex [a]lign-items template-[c]ols template-[r]ows aut[o]-rows au[t]o-cols [m]ore");
		m3=menu={
			f:async()=>{
				curvals = VALS.flex;
				if (!curvals){
					curvals = [];
					VALS.flex=curvals;
				}
				rv = await popin("",{title:"Set flex", choices:curvals, defTxt:s().flex});
				if(!rv) return;
				if (!curvals.includes(rv)) curvals.push(rv);
				s().flex = rv;
			},
			a:()=>{
				stat(`Align-Items(${s().alignItems}): s[t]retch [s]tart [e]nd [c]enter`);
				menu={
					t:()=>{s().alignItems="stretch";m3.a();},
					s:()=>{s().alignItems="start";m3.a();},
					e:()=>{s().alignItems="end";m3.a();},
					c:()=>{s().alignItems="center";m3.a();},
					u:()=>{up(s3,m3)}
				};
			},
			c:async()=>{
				curvals = VALS.gridTemplateColumns;
				if (!curvals){
					curvals = [];
					VALS.gridTemplateColumns=curvals;
				}
				rv = await popin("[nUnit || repeat(x,nUnit)]+",{title:"Set grid-template-columns", choices: curvals, defTxt:s().gridTemplateColumns});
				if(!rv) return;
				if (!curvals.includes(rv)) curvals.push(rv);
				s().gridTemplateColumns = rv;
			},
			r:async()=>{
				curvals = VALS.gridTemplateRows;
				if (!curvals){
					curvals = [];
					VALS.gridTemplateRows=curvals;
				}
				rv = await popin("[nUnit || repeat(x,nUnit)]+",{title:"Set grid-template-rows"});
				if(!rv) return;
				if (!curvals.includes(rv)) curvals.push(rv);
				s().gridTemplateRows = rv;
			},
			o:async()=>{
				curvals = VALS.gridAutoRows;
				if (!curvals){
					curvals = [];
					VALS.gridAutoRows=curvals;
				}
				rv = await popin("nUnit || minmax(a,b)",{title:"Set grid-auto-rows"});
				if(!rv) return;
				if (!curvals.includes(rv)) curvals.push(rv);
				s().gridAutoRows = rv;
			},
			t:async()=>{
				curvals = VALS.gridAutoColumns;
				if (!curvals){
					curvals = [];
					VALS.gridAutoColumns=curvals;
				}
				rv = await popin("nUnit || minmax(a,b)",{title:"Set grid-auto-columns"});
				if(!rv) return;
				s().gridAutoColumns = rv;
			},
			m:()=>{
				stat("More Grid: [g]ap col-g[a]p row-ga[p] grid-ar[e]a [t]emplate-areas");
				menu={
					t:async()=>{
						rv = await popinarea("Layout string","Set grid-template-areas");
						if(!rv) return;
						let rows = rv.split("\n");
						let str = '';
						for (let row of rows) str+=` "${row}" `
						s().gridTemplateAreas = str;
					},
					e:async()=>{
						rv = await popin("Name",{title:"Set grid-area name"});
						if(!rv) return;
						s().gridArea = rv;
					},
					g:async()=>{
						rv = await popin("nUnit",{title:"Set gap"});
						if(!rv) return;
						s().gap = rv;
					},
					a:async()=>{
						rv = await popin("nUnit",{title:"Set column-gap"});
						if(!rv) return;
						s().columnGap = rv;
					},
					p:async()=>{
						rv = await popin("nUnit",{title:"Set row-gap"});
						if(!rv) return;
						s().rowGap = rv;
					},
					u:()=>{up(s3,m3)}
				}
			},
			u:()=>{up(s1,m1)}
		}
	}//»
	else if (cur.dis=="contents"){//«
		stat("Contents: ");
		menu={
			u:()=>{up(s1,m1)}
		};
	}//»
	else{//«
		s5=stat("None: [g]row s[h]rink [b]asis [f]lex [c]ol-start co[l]-end [r]ow-start ro[w]-end grid-[a]rea align-[s]elf");
		m5=menu={
			f:async()=>{
				curvals = VALS.flex;
				if (!curvals){
					curvals = [];
					VALS.flex=curvals;
				}
				rv = await popin("",{title:"Set flex", choices:curvals, defTxt:s().flex});
				if(!rv) return;
				if (!curvals.includes(rv)) curvals.push(rv);
				s().flex = rv;
			},
			g:async()=>{
				rv = await popin("Number",{title:"Set flex-grow"});
				if(!rv) return;
				s().flexGrow = rv;
			},
			h:async()=>{
				rv = await popin("Number",{title:"Set flex-shrink"});
				if(!rv) return;
				s().flexShrink = rv;
			},
			b:async()=>{
				rv = await popin("nUnit/ auto/ initial",{title:"Set flex-basis"});
				if(!rv) return;
				s().flexBasis = rv;
			},
			s:()=>{
				stat(`Align-Self(${s().alignSelf}): [s]tart [e]nd [c]enter s[t]retch`);
				menu={
					t:()=>{
						s().alignSelf="stretch";m5.s();
					},
					s:()=>{
						if (cur.parentNode.dis=="flex") s().alignSelf="flex-start";
						else s().alignSelf = "start";
						m5.s();
					},
					e:()=>{
						if (cur.parentNode.dis=="flex") s().alignSelf="flex-end";
						else s().alignSelf = "end";
						m5.s();
					},
					c:()=>{
						s().alignSelf="center";m5.s();
					},
					u:()=>{up(s5,m5)}
				};
			},
			c:async()=>{
				rv = await popin("Number",{title:"Set column-start"});
				if(!rv) return;
				s().gridColumnStart = rv;
			},
			l:async()=>{
				rv = await popin("Number",{title:"Set column-end"});
				if(!rv) return;
				s().gridColumnEnd = rv;
			},
			r:async()=>{
				rv = await popin("Number",{title:"Set row-start"});
				if(!rv) return;
				s().gridRowStart = rv;
			},
			w:async()=>{
				rv = await popin("Number",{title:"Set row-end"});
				if(!rv) return;
				s().gridRowEnd = rv;
			},
			a:async()=>{
				rv = await popin("Name",{title:"Set grid-area name"});
				if(!rv) return;
				s().gridArea = rv;
			},
			u:()=>{up(s1,m1)}
		};
	}//»
};//»
const set_menu=()=>{//«
	const setit=()=>{
		return stat("Init: [c]reate [l]ayout [s]tyle [i]d");
	}
	s0=setit();
	m0=menu = {
		s:()=>{
			s4=stat("Style: [b]gcol [t]col [f]s");
			m4=menu={
				b:async()=>{
					rv = await popin("Hex or rgb[a]",{title:"Set background color"});
					if(!rv) return;
					if (rv=="none") rv = "";
					s().backgroundColor = rv;
				},
				t:async()=>{
					rv = await popin("Hex or rgb[a]",{title:"Set text color"});
					if(!rv) return;
					s().color = rv;
				},
				f:async()=>{
					rv = await popin("nUnit",{title:"Set font size"});
					if(!rv) return;
					s().fontSize = rv;
				},
				u:()=>{up(s0,m0)}
			}
		},
		l:()=>{
			const setit=()=>{
				return stat(`Layout(${cur.dis||"none"}): [f]lex [g]rid [c]ontents [n]one [o]ptions`);
			}
			s1=setit();
			m1=menu = {
				f:async()=>{
					if (cur.dis && cur.dis!=="flex"){
						let rv = await popyesno(`Really change it from ${cur.dis}?`,{title:"SiteBuilder"});
						if (!rv) return;
					}
					cur.dis="flex";
					s1 = setit();
				},
				g:async()=>{
					if (cur.dis && cur.dis!=="grid"){
						let rv = await popyesno(`Really change it from ${cur.dis}?`,{title:"SiteBuilder"});
						if (!rv) return;
					}
					cur.dis="grid";
					s1 = setit();
				},
				c:async()=>{
					if (cur.dis && cur.dis!=="contents"){
						let rv = await popyesno(`Really change it from ${cur.dis}?`,{title:"SiteBuilder"});
						if (!rv) return;
					}
					cur.dis="contents";
					s1 = setit();
				},
				n:()=>{
					cur.style.display="";
					s1 = setit();
				},
				o:set_layout_options,
				u:()=>{up(s0,m0)}
			};
		},
		i:async()=>{
			rv = await popin("",{title:"Set a unique id"});
			if(!rv) return;
			cur.id = WINID+"-"+rv;
			if (cur!=mn){
				if (!(cur.childNodes[0] instanceof HTMLElement)) cur.innerText = getid();
			}
			s0=setit();
		},
		c:()=>{
			stat("Create: [d]iv [s]pan [b]utton");
			menu = {
				d:()=>{
					mkelem("DIV");
				},
				s:()=>{
					mkelem("SPAN");
				},
				b:()=>{
					mkelem("BUTTON");
				},
				u:()=>{up(s0,m0)}
			}
		}
	};
}//»
const init=async()=>{//«
	topwin.title="SiteBuilder";
	await fs.touchHtml5Dir(cfgdir);
	if (!VALS) {
		let ret = await fs.readHtml5File(vals_file);
//log(ret);
		if (ret){
			try{
				VALS = JSON.parse(ret);
			}
			catch(e){
err("Parse error");
log(ret);
				VALS={};
			}
		}
		else VALS={};
	}
	set_menu();
}//»

//»
//App/CB«

this.onkill=async(if_reload)=>{//«
	if (if_reload) Core.set_appvar(topwin, "CSSVALS", VALS);
	else{
		let ret = await fs.writeHtml5File(vals_file, JSON.stringify(VALS,null,"  "));
//		cwarn("Saved to ~/.congig/SiteBuilder/cssvals.json:",ret);
	}
};//»

this.onkeypress=(e,k)=>{//«

menu[k]&&menu[k]();

};//»

this.onkeydown=(e,s)=>{//«
if (s=="DOWN_"){
	let kid = cur.childNodes[0];
	if (!(kid&&kid.on)) {
		kid = cur.childNodes[1];
		if (!(kid&&kid.on)) return;
	}
	kid.on();
	set_menu();
}
else if (s=="UP_"){
	if (cur === mn) return;
	cur.parentNode.on();
	set_menu();
}
else if (s=="RIGHT_"){
	let nxt = cur.nextSibling;
	if (nxt) nxt.on();
	set_menu();
}
else if (s=="LEFT_"){
	let prv = cur.previousSibling;
	if (prv&&prv.on) prv.on();
	set_menu();
}
else if (s=="SPACE_"){
log(cur);
}
else if (s=="BACK_C"){
	if (cur!=mn) {
		let prv = cur.previousSibling;
		let nxt = cur.nextSibling;
		cur.del();
		if (prv) prv.on();
		else if (nxt) nxt.on();
		else mn.on();
	}
}

};//»


//»

init();

