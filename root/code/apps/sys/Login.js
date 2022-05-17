

//Imports«

const fsapi=NS.api.fs;
const widgets=NS.api.widgets;
const {popup,popok,poperr,popyesno}=widgets;
const {util,dev_mode,dev_env}=globals;
const {gbid,mk,mkdv,mksp}=util;
const log=(...args)=>{console.log(...args)};
const cerr=(...args)=>{console.error(...args)};
const cwarn=(...args)=>{console.warn(...args)};
const act=()=>document.activeElement;
const Topwin = Main.top;
const NUM=Number.isFinite;
const capi=Core.api;

//»

//Var«
const DOWAITMS=2500;
const USEFS = 17;
//»

//DOM«

let but;

Main.dis="flex";
Main.fld="column";
Main.ali="center";
Main.jsc="center";
//Main.w=500;
//Main.h=400;

const mn = mkdv();
mn.fs=USEFS;
mn.mar=20;
//mn.ta="center";

let tit = mkdv();
tit.fs=21;
tit.fw="bold";
tit.marb=20;
//Main.add(tit);
mn.add(tit);
Main.add(mn);

//»

//Funcs«

const validate_email=(str)=>{
	return /^\S+@\S+[\.][0-9a-z]+$/.test(str);
}

const mkbut=(str, fn, par)=>{//«
    let butcol="e7e7e7";
    let butborcol="#ccc";
    let disabled = false;
    let d = mkdv();
    d.bgcol=butcol;
    d.padt=d.padb=3;
    d.padr=d.padl=5;
    d.fs=15;
    d.innerText=str;
    d.bor=`3px outset ${butborcol}`;
    d.onmousedown=()=>{if(disabled)return;d.bor=`3px inset ${butborcol}`;};
    d.onmouseup=()=>{if(disabled)return;d.bor=`3px outset ${butborcol}`;};
    d.onmouseout=()=>{if(disabled)return;d.bor=`3px outset ${butborcol}`;};
    d.onclick=(e)=>{
        if (disabled) return;
        if (e.isTrusted) return fn();
        d.bor="3px inset #aaa";
        setTimeout(()=>{d.bor="3px outset #aaa";fn();},200);
    };  
    if (par) par.add(d);
	d.tabIndex="0";	
    d.disable=()=>{
        disabled=true;
        d.tcol="#777";
    };
    return d;
}//»    

const doit = (which, usetit, useuname)=>{//«

//if (usetit) tit.innerHTML = usetit;

let isup, isin;

if (which=="up")isup = true;
else isin = true;


let tabdiv = mkdv();
let tab = mk('table');
tab.tcol="#000";
tab.fs=USEFS;
let tr, td, userinp, passinp1, passinp2, emailinp;
let email_row;
let forgotchk;
if (isup){
	Topwin.title="Sign up";
	tit.innerHTML=usetit||"Sign up";
}
else if (isin){
	Topwin.title="Sign in";
	tit.innerHTML=usetit||"Sign in";
}
tr = mk('tr');
td = mk('td');
td.innerText = "Username: ";
tr.add(td);
userinp = mk('input');
if (useuname) userinp.value = useuname;
userinp.type = "text";
td = mk('td');
td.add(userinp);
tr.add(td)
tab.add(tr);
tr = mk('tr');
td = mk('td');
//let password_tr = td;
td.innerText = "Password: ";
tr.add(td);
passinp1 = mk('input');
passinp1.type = "password";
td = mk('td');
let password_td = td;
td.add(passinp1);
tr.add(td)
tab.add(tr);

if (isup){

	tr = mk('tr');
	td = mk('td');
	td.innerText = "Confirm: ";
	tr.add(td);
	passinp2 = mk('input');
	passinp2.type = "password";
	td = mk('td');
	td.add(passinp2);
	tr.add(td)
	tab.add(tr);
	tr = mk('tr');
	email_row = tr;
	td = mk('td');
	td.innerHTML = `Email <b><sup style="color:#a00;">*</sup></b>: `;
	tr.add(td);
	emailinp = mk('input');
	emailinp.type = "text";
	td = mk('td');
	td.add(emailinp);
	tr.add(td)
	tab.add(tr);

}

tr = mk('tr');
td = mk('td');
tr.add(td);
td = mk('td');
td.setAttribute("align","right");
but = mkbut("Submit",async()=>{//«
	const err=s=>{tit.innerHTML=`<span style="color:#900">${s}</span>`;};
	let uname = userinp.value.regstr();
	let pass1 = passinp1.value;
	let email;
	if (emailinp) email = emailinp.value.regstr();
	let rv;
	if (!(uname&&pass1)) {
		if (!uname) {
			err("Username is required");
			userinp.focus();
			return;
		}
		else {
			if (isin && forgotchk.checked){}
			else {
				err("Password is required");
				passinp1.focus();
				return;
			}
		}
	}
	if (!uname.match(/^[a-z][a-z0-9_]*$/i)) {
		err("Invalid username");
		userinp.focus();
		return;
	}
	if (isin && forgotchk.checked){}
	else if (!pass1.match(/^[\x21-\x7e]+$/)){
		err("Invalid password (printable ascii only)");
		passinp1.focus();
		passinp1.select();
		return;
	}
	if (isup){
		if (!passinp2.value) {
			err("Please confirm your password");
			passinp2.focus();
			return 
		}
		if (pass1!==passinp2.value)
		return err("Mismatching passwords");
		if (email && !validate_email(email)) {
			err("The email address appears invalid");
			emailinp.focus();
			emailinp.select();
			return 
		}
		rv = await fetch(`/_checkavailable?name=${uname}`);
		if (!rv){
			err("There is a server problem");
			return;
		}
		if (rv.ok!==true){
			err(await rv.text());
			userinp.select();
			return;
		}
	}
	tit.innerText="Submitting...";
	tabdiv.del();
	if (isin && forgotchk.checked) rv = await fetch(`/_forgot?name=${uname}`);
	else {
		let url;
		let body = `${uname}\n${pass1}`;
		if (isup) {
			url="/_signup";
			if (email) body =`${body}\n${email}`;
		}
		else url = '/_signin';
		rv = await fetch(url, {
			method: "POST",
			body: body
		});
	}
	if (!rv) return err("Network error");
	let txt = await rv.text();
	if (!rv.ok) {
		err(txt);
		return;
	}
	if (isin && forgotchk.checked) {
		tit.innerText = txt;
		setTimeout(()=>{
			doit("in");
		},DOWAITMS);
	}
	else if (isin){
		globals.stats.USERNAME = txt;
		Desk.update_status(txt);
		tit.innerText="You are signed in as: "+txt+"!";
		setTimeout(()=>{
			Topwin.force_kill();
		}, DOWAITMS);
	}
	else {
//username uname;
		doit("in", txt+"<br>You may now sign in.", uname);
	}
},td);
//»
but.mart=10;
but.w="50px";
but.ta="center";
tr.add(td);
tab.add(tr)

if (isin){

	tr = mk('tr');
	td = mk('td');

	tr.add(td);
	td = mk('td');
	td.padt=10;
	td.setAttribute("align","right");
	let forgotsp = mksp();
	forgotsp.fs=16;
//	forgotsp.mart=5;
	forgotsp.innerText="Forgot password";
	forgotchk = mk('input');
	forgotchk.type="checkbox";
	forgotchk.onchange=()=>{
//		passinp1.value="";
		passinp1.disabled = forgotchk.checked;
		if (passinp1.disabled) {
			passinp1.del();
			password_td.innerHTML="<i>Check your email</i>";
			password_td.tcol="#900";
		}
		else {
			password_td.tcol="";
			password_td.innerHTML="";
			password_td.add(passinp1);
		}
	};
	td.add(forgotsp);
	td.add(forgotchk);

	tr.add(td);
	tab.add(tr)

}

/*
*/

tabdiv.add(tab);
mn.add(tabdiv);

if (isup){
	let d = mkdv();
	d.innerHTML= `<b><sup style="color:#a00;">*</sup></b> Email is optional.<br>\xa0\xa0<span style="font-size:85%;">(Password recovery purposes only.)</span>`;
	d.mart=10;
	tabdiv.add(d);
}

setTimeout(()=>{
	if (useuname) passinp1.focus();
	else userinp.focus();
},25);


}//»

//»

//Init«

if (arg.UP) doit("up");
else if (arg.IN) doit("in");
else {
	tit.innerText="Nothing to do!";
	return;
}

//»

//Obj/CB«

this.onkeydown=(e,k)=>{
	if (k==="ENTER_"){
		if (document.activeElement===but){
			but.click();
		}
	}
};

//»


