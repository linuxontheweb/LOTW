const APPNAME="Munny";

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

const init=()=>{//«

let all = [1,2,3,4,5,6,7,8,9,10,11,12,13];
let hands=[];
for (let a of all){
	for (let b of all){
		for (let c  of all){
			for (let d  of all){
				for (let e  of all){
					if (!(a==b && b==c && c==d) && !(b==c && c==d && d==e)){
						let arr = [a,b,c,d,e].sort((a,b)=>{return a-b;});
						if (arr[0]==1 && arr[1]==2 && arr[2]==3 && arr[3]==4 && arr[4]==13) arr=[0,1,2,3,4];
if (arr[0]==1&&arr[1]==1&&arr[2]==1&&arr[3]==1) log(arr);
//						hands.push(arr);
					}
				}
			}
		}
	}
}

/*
Here are all the unique numerical combinations.
Number of flushes: 5108
Number of straight flushes: 40

Only issue, all 1,2,3,4,13 are really 0,1,2,3,4

22223
2d2d2d2d3h
2h2h2h2h3d
2s2s2s2s3h

*/
//log(hands);

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

