
//Imports«
//const APPOBJ = arg.APPOBJ||{};
//const {Core,Desk,main,topwin} = arg;
//const{NS,log,cwarn,cerr,globals}=Core;
const main = Main;
const topwin = main.top;
const {mk,mkdv,mksp}=Core.api;
const {fs,FSPREF,FSLET,FSBRANCH}=globals;
const fsapi = NS.api.fs;
//const cur_dir=APPOBJ.PATH;;
const cur_dir=arg.PATH;;
//»
//Var«
let zip;
let but;
//»
//DOM«
let contdiv=mkdv();
contdiv.overy="scroll";
contdiv.bgcol="#000";
contdiv.tcol="#ccc";
contdiv.pad=10;
main.bgcol="#333";
main.add(contdiv);
main.tcol="#ccc";
main.fs="1.25em";
main.dis="flex";
main.style.cssText+=`
justify-content:center;
`;
//main.padt=15;

//»

//Funcs«
let logit=(str,if_error)=>{
let d = mkdv();
if (if_error) {
	d.tcol="red";
	str=`Error: ${str}<br>Aborting!`;
}
d.innerHTML=str;
contdiv.add(d);
};

const doents=(ents, base_path,opts={})=>{//«
let logger=opts.logger;
if (!logger) logger=()=>{}
let cb=opts.cb;
let is_root = opts.isRoot;
logger("Extracting into: "+base_path);
let iter = -1;
async function doent(){//«
	iter++;
	if (iter==ents.length) {
		logger("Done");
		cb&&cb();
		return;
	}
	let ent = ents[iter];
	let parr = ent.filename.replace(/\/$/,"").split("/");
	if (!parr[0]) parr.shift();
	let fname = parr.pop();
	let path = parr.join("/");
	let fullpath
	if (path) fullpath = base_path+"/"+path;
	else fullpath = base_path;
	let savepath=fullpath+"/"+fname;
	if (ent.directory) {
		if (await fsapi.pathToNode(savepath)) return logger("Folder path exists: "+savepath,true);
		fs.mk_fs_dir(fullpath, fname, null, (ret, err)=>{
			if (!ret) return logger(err,true)
			logger(ent.filename)
			doent();
		},null,is_root);
	}
	else {
		if (await fsapi.pathToNode(savepath)) return logger("File path exists: "+savepath,true);
		ent.getData(new zip.BlobWriter(), blob=>{
			fs.savefile(savepath, blob, ret=>{
				if (!ret) return logger("Could not save: " + ent.filename,true);
				logger(ent.filename)
				Desk.make_icon_if_new(savepath);
				doent();
			},{MKDIR:true, ROOT:is_root});
		})
	}
}//»
doent();
};//»

let dounzip=async(buf)=>{//«
await Core.api.loadMod("util.zip.ZipJS");
await Core.api.loadMod("util.zip.ZipJSInflate");
if (!globals.zip)new NS.mods["util.zip.ZipJS"](Core);
zip = globals.zip;
if (!zip.Inflater)new NS.mods["util.zip.ZipJSInflate"](Core);
zip.createReader(new zip.BlobReader(new Blob([buf.buffer], {type:"zip"})), zipReader=>{
	zipReader.getEntries(ents=>{
		logit('Extract '+ents.length+" entr"+(ents.length===1?"y":"ies")+" into directory:\xa0"+cur_dir+"?<br>");
		but=mk('button');
		but.innerHTML="Extract";
		contdiv.add(but);
		let str='';
		for (let ent of ents){
			str+=ent.filename;
			if (!ent.directory)str+=`\xa0\xa0\xa0(${ent.uncompressedSize}\xa0bytes)`;
			str+="<br>";
		}
		logit(str);
		but.onclick=()=>{
			but=null;
			contdiv.innerHTML="";
			doents(ents, cur_dir, {logger:logit});
		}
	});
}, 
err=>{
logit("Error: "+err);
cerr(err);
});
/*«
model.getEntries((new Blob([buf.buffer], {type:"zip"})), ents=>{
	logit('Extract '+ents.length+" entr"+(ents.length===1?"y":"ies")+" into directory:\xa0"+cur_dir+"?<br>");
	but=mk('button');
	but.innerHTML="Extract";
	contdiv.add(but);
	let str='';
	for (let ent of ents){
		str+=ent.filename;
		if (!ent.directory)str+=`\xa0\xa0\xa0(${ent.uncompressedSize}\xa0bytes)`;
		str+="<br>";
	}
	logit(str);
	but.onclick=()=>{
		but=null;
		doents(ents);
	}
});
»*/
}//»
//»

this.onloadfile=buf=>{//«
	if (!cur_dir){
cerr("WHAT THE HELL NO APPOBJ.path!?!?!?!?");
		return;
	}
	dounzip(buf);
}//»
this.onkeydown=(e,sym)=>{
if (sym==="ENTER_"){
if (but) but.click();
}
};
if (!cur_dir) topwin.title="Unzip";

