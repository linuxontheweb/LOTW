
//Imports«
const http = require('http');
const spawn = require('child_process').spawn;
const fs = require('fs');
const qs = require('querystring');

const BASE_PAGE=`
The server is live!<br>You might want to go to <a href="/desk">the desktop</a> or <a href="/shell">the shell</a>!
`;

//»

//Var«

const OS_HTML=`
<html>
<head>
<title>
</title>
<meta name="description" content="This is an operating system that runs inside of most modern web browsers">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="www/css/os.css" rel="stylesheet">
</head>
<body>
<div style="z-index:100000000;position:absolute;left:0;top:0;overflow:hidden;">
<table style="font-family:monospace;font-size:18;" id="initlog"></table>
</div>
<script src="root/code/mods/sys/core.js" type="module"></script>
<a name="_"></a>
</body>
</html>
`;

const OKAY_DIRS=["root","www"];
const log = (...args)=>{console.log(...args)}
const debug = (...args)=>{if (!if_debug) return;console.log(...args);}


const hostname = "localhost";

let port = 8080;
let if_debug = false;

if (process.argv[2]){
	let arg2 = process.argv[2];
	port = parseInt(arg2);
	if (isNaN(port)||port>65535||port<1) {
		log("Invalid port argument: " + arg2);
		return;
	}
}
if (process.argv[3]){
	log("Too many arguments");
	return;
}

let arr = process.argv[1].split("/");arr.pop();
const BINPATH = arr.join("/")+"/root/bin";
const EXAMPLESPATH = arr.join("/")+"/www/examples";
const APPPATH = arr.join("/")+"/root/code/apps";
log(BINPATH);
//»

//Util«

const mime_from_path=(path, force_bin)=>{//«
	if (path.match(/\.jpg$/i)) return "image/jpeg"
	else if (path.match(/\.gif$/i)) return "image/gif"
	else if (path.match(/\.png$/i)) return "image/png"
	else if (path.match(/\.webp$/i)) return "image/webp"
	else if (force_bin) return "application/octet-stream";
	else return "text/plain"
}//»
const okay=(res, usemime)=>{//«
	header(res, 200, usemime);
}//»
const okaybin=(res)=>{//«
	header(res, 200, "application/octet-stream");
}//»
const nogo=(res, mess)=>{//«
	header(res, 404);
	if (!mess) mess = "NO";
	res.end(mess+"\n");
}//»
const header=(res, code, mimearg)=>{//«
	let usemime = "text/plain";
	if (mimearg) usemime = mimearg;
	if (code == 200) {
		res.writeHead(200, {'Content-Type': usemime, 'Access-Control-Allow-Origin': "*"});
	}
	else res.writeHead(code, {'Content-Type': usemime, 'Access-Control-Allow-Origin': "*"});
}//»
const readdir=(path, opts={}, pattern)=>{//«

return new Promise(async(Y,N)=>{
let pathext="";
let regexp = null;

if (pattern){
if (pattern.match("\.")){
let arr = pattern.split(".");
let fname = arr.pop();
if (fname) regexp = new RegExp("^" + fname.replace(/\./g,"\\."));
path = `${path}/`+arr.join("/");
}
else regexp = new RegExp("^" + pattern.replace(/\./g,"\\."));
}
//log(regexp);

    let dir = fs.opendirSync(path);
    let ent = await dir.read();
	let arr = [];
    while(ent){
        let name = ent.name;
        if (opts.getDir || opts.getRaw || ent.name.match(/\.js$/)) {
            if (ent.isSymbolicLink()){
                try{
                    ent = fs.statSync(`${path}/${name}`);
                }catch(e){}
            }
            if (ent) {
				if (regexp && !regexp.test(name)) {
        			ent = await dir.read();
					continue;
				}
				if (ent.isFile()) {
					if (!name.match(/^\./)) {
						if (opts.getRaw) arr.push(name);
						else arr.push(name.replace(/\.js$/,""));
					}
				}
				else if (ent.isDirectory()){
					if (opts.getDir) arr.push(name);
				}
			}
        }   
        ent = await dir.read();
    }               
	Y(arr);
    dir.close();
});

};//»

//»

const handle_request=async(req, res, url, args)=>{//«
	"use strict";
	let meth = req.method;
	let body, path, enc, pos;
	let marr;
	if (meth == "GET") {//«
		if (url=="/") {okay(res, "text/html");return res.end(BASE_PAGE);}
//		if (url.match(/^\/(desk|shell)$/)) return res.end(fs.readFileSync('./os.html', 'utf8'));
		if (url.match(/^\/(desk|shell)$/)) return res.end(OS_HTML);
		if (url.match(/^\/_/)){
			if (url == "/_getbin") res.end(JSON.stringify(await readdir(BINPATH)));
			else if (url == "/_getapp") res.end(JSON.stringify(await readdir(APPPATH, {getDir:true, getRaw:true}, args.path)));
			else if (url == "/_getexamples") res.end(JSON.stringify(await readdir(EXAMPLESPATH, {getRaw: true})));
			else if (url == "/_ip") {
				let rv = await fetch("https://ifconfig.me/ip");
				if (!(rv && rv.ok)) return nogo(res, "Could not get ip address");
				res.end(await rv.text());
			}
//res.end(JSON.stringify(await readdir(BINPATH)));
			else nogo(res, "Bad command");
			return;
		}
		let parts = url.split("/");
		parts.shift();
		let dir = parts.shift();
		if (!(dir&&OKAY_DIRS.includes(dir))) return nogo(res,"Not found");
		let usemime = "application/octet-stream";
		let str;
		let ext_to_mime = {
			"js": "application/javascript",
			"json": "application/javascript",
			"html": "text/html",
			"txt": "text/plain",
			"synth": "text/plain",
			"sh": "text/plain",
			"gz": "application/gzip",
			"wav": "audio/wav"
		}
		if (marr = url.match(/\.(js|html|json|txt|sh|mf|synth)$/)) {
			usemime = ext_to_mime[marr[1]];
			try {
				str = fs.readFileSync("."+decodeURIComponent(url), 'utf8');
			}
			catch(e) {
				str=null
			}
		}
		else {
			if (marr = url.match(/\.(wav|gz)$/)) usemime = ext_to_mime[marr[1]];
			try {
				str = fs.readFileSync("."+decodeURIComponent(url));
			}
			catch(e) {
				str = null
			}
		}
		if (!str) {
			nogo(res, "404: File not found: " + url);
debug("Not found");
			return;
		}
debug("OK: " + (str.length) + " bytes");
		okay(res, usemime);
		res.end(str);
	}//»
	else if (meth == "POST") nogo(res);
	else nogo(res);
}//»

http.createServer((req, res)=>{//«
	let url_arr = req.url.split("?");
	let len = url_arr.length;
	if (len == 1 || len == 2) {
		let base = url_arr[0];
		let args = url_arr[1];
		let arg_hash = {};
		if (args) {
			let args_arr = args.split("&");
			for (let i=0; i < args_arr.length; i++) {
				let argi = args_arr[i].split("=");
				let key = argi[0];
				let val = argi[1];
				if (!val) val = false;
				arg_hash[key] = val;
			}
		}
		handle_request(req, res, base, arg_hash);
	}
	else {
		nogo(res);
	}
}).listen(port, hostname);
//»

log(`Site server listening at http://${hostname}:${port}`);


