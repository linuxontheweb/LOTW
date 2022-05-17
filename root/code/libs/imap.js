
export const mod = function(Core, shell_exports, com, args) {

//Imports«

const {NS,globals,log,cwarn,cerr}=Core;
const fsapi=NS.api.fs;
const capi = Core.api;
const MAX_PORT = 2**16-1;
const IMAP_HOST = "http://localhost";

const{
	cbok,
	cberr
} = shell_exports;

//»

const coms={

yimap:async()=>{

let portarg = args.shift();
if (!portarg) return cberr("No port given!");
let port = portarg.ppi({MAX:MAX_PORT});
if (isNaN(port)) return cberr(`${portarg}: invalid port number`);
try{

let got = await fetch(`${IMAP_HOST}:${port}/`);
cbok(await got.text());

}catch(e){cberr(e);return;}
//log(got);
//log(port);

}

}

const coms_help={
}
if (!com) return Object.keys(coms)
if (!args) return coms_help[com];
if (!coms[com]) return cberr("No com: " + com + " in imap!");
if (args===true) return coms[com];
coms[com](args);

}
