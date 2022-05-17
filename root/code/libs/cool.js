//Imports«
const{NS,xgetobj,globals,}=Core;
const{fs,util,widgets,dev_env,dev_mode}=globals;
const{strnum,isarr,isobj,isstr,mkdv}=util;
const{fmt,read_stdin, woutobj,get_path_of_object,pathToNode,read_file_args_or_stdin,serr,normpath,cur_dir,respbr,get_var_str,refresh,failopts,cbok,cberr,wout,werr,termobj,wrap_line,kill_register,EOF,ENV}=shell_exports;
const fsapi=NS.api.fs;
const capi = Core.api;
const fileorin = read_file_args_or_stdin;
const stdin = read_stdin;
const NUM = Number.isFinite;
//»
const log = (...args)=>console.log(...args);
const cwarn = (...args)=>console.warn(...args);
const cerr = (...args)=>console.error(...args);
const wrap = fmt;


const coms={

cool:()=>{

cbok("Cool!");

}

}

const coms_help={
}
if (!com) return Object.keys(coms)

if (!args) return coms_help[com];
if (!coms[com]) return cberr("No com: " + com + " in cool!");
if (args===true) return coms[com];
coms[com](args);

