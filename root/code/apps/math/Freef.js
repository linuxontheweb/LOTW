const APPNAME="Freef";

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

const getrand=()=>{
	return 2*(Math.random()-0.5);
};


const init=()=>{//«

//Get 1000 values between -1 and 1 and find the average
let donum = 100;
let tot=0;
for (let i=0; i < donum; i++) {
	tot+=getrand();
}
log(tot/donum);



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

