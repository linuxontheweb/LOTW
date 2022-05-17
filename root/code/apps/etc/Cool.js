
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
const NUM=Number.isFinite;
const capi=Core.api;

Topwin.title="Cool";
Topwin.titleimg={BGCOL:"#009",TCOL:"#fff", LETS:"Co"};

//»


Main.dis="flex";
Main.ali="center";
Main.jsc="center";
Main.innerHTML='Coolister: Jumping srart, inna munst!';

this.get_context=()=>{
	return [
		"About", ()=>{
			popup("It's Cool!");
		}
	];
};

