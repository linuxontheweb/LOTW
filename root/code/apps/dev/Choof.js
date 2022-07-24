const APPNAME="TF";
const MODNAME="nn.tensorflow";

export const app = function(arg) {

//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

Main.top.title=APPNAME;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;


//»

//Var«


//»

//Funcs«

const init=async()=>{//«

let rv = await capi.loadMod(MODNAME);
let tf = NS.mods[MODNAME]
await tf.ready();
const dataArray = [8, 6, 7, 5, 3, 0, 9]
const first = tf.tensor(dataArray)
first.print();
//log("Ready");
//if (! await tf.ready()) return cerr("Could not initialize tf");
//log(tf.version.tfjs);

}//»

//»

//OBJ/CB«

this.onappinit=init;

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«
}//»

this.onkeypress=e=>{//«
};//»
this.onkill = function() {//«

}//»
this.onresize = function() {//«
}//»
this.onfocus=()=>{//«
}//»

this.onblur=()=>{//«
}//»

//»

}

