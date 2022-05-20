/*

Steps

1) Install
	$ npm install:
		imapflow
		mailparser


2) Edit
	In: node_modules/mailparser/lib/mail-parser.js: line 1108

	Change: 
		result.push(`<a href="${link.url}">${link.text}</a>`);

	To:
		if (link.text.match(/^https?:\x2f\x2f/)) result.push(`<a href="${link.url}">Link</a>`);
		else result.push(`<a href="${link.url}">${link.text}</a>`);

*/

//Imports«

const http = require('http');

const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser;

//»

//Var«

const SERVICE_NAME = "IMAP";
const hostname = "localhost";
let portnum = 20002;

//»

//Args«

try{
	let arg2 = process.argv[2];
	if (arg2){
		portnum = parseInt(arg2);
		if (isNaN(portnum)||portnum>65535) throw "Invalid port argument: " + arg2;
		else if (portnum < 1025) throw "Unsafe port argument: " + arg2;
	}
	if (process.argv[3]) throw "Too many arguments";
}
catch(e){
	console.log(e);
	return;
}

//»

//Funcs«

const log = (...args)=>{console.log(...args);}

const header=(res, code, mimearg)=>{//«
    let usemime = "text/plain";
    if (mimearg) usemime = mimearg;
    if (code == 200) {
        res.writeHead(200, {'Content-Type': usemime, 'Access-Control-Allow-Origin': "*"});
    }
    else res.writeHead(code, {'Content-Type': usemime, 'Access-Control-Allow-Origin': "*"});
}//»
const nogo=(res, mess)=>{//«
	header(res, 404);
	if (!mess) mess = "NO";
	res.end(mess+"\n");
}//»
const okay=(res, usemime)=>{//«
    header(res, 200, usemime);
}//»

//»

const handle_request=(req,res)=>{//«

let meth = req.method;
let body, path, enc, pos;
let marr;
let url_arr = req.url.split("?");
let len = url_arr.length;
//if (len==0||len>2) return nogo(res);
let url = url_arr[0];
let args = url_arr[1];
let arg_hash={};
if (args) {//«
	let args_arr = args.split("&");
	for (let i=0; i < args_arr.length; i++) {
		let argi = args_arr[i].split("=");
		let key = argi[0];
		let val = argi[1];
		if (!val) val = false;
		arg_hash[key] = val;
	}
}//»
if (meth=="GET"){
	if (url=="/") {//«
		okay(res);
		res.end(SERVICE_NAME);
	}//»
	else nogo(res);
}
else if (meth=="POST") nogo(res);
else nogo(res);

}//»

http.createServer(handle_request).listen(portnum, hostname);

log(`${SERVICE_NAME} service listening at http://${hostname}:${portnum}`);





/*ImapFlow Example«

const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser;
const log=(...args)=>{console.log(...args)};

const client = new ImapFlow({
	host: 'imap.mail.yahoo.com',
	port: 993,
	secure: true,
	logger:false,
	auth: {
		user: atob(process.env.VARHUUNT),
		pass: atob(process.env.SKRUMPTH)
	}
});

const main = async () => {

	await client.connect();// Wait until client connects and authorizes
	let lock = await client.getMailboxLock('INBOX');// Select and lock a mailbox. Throws if mailbox does not exist
	try {
	// fetch latest message source client.mailbox includes information about currently selected mailbox "exists" value is also the largest sequence number available in the mailbox
	let mess = await client.fetchOne(client.mailbox.exists, { source: true });
	//let mess = await client.fetchOne(client.mailbox.exists, { envelope: true });
	//log(mess);
	//log(`${mess.uid}: ${mess.envelope.subject}`);

	simpleParser(mess.source, {}, (err, parsed) => {
		if (err) log(err);
		else log(parsed);
	});
	// list subjects for all messages
	// uid value is always included in FETCH response, envelope strings are in unicode.
	//        for await (let message of client.fetch('1:*', { envelope: true })) {
	//            console.log(`${message.uid}: ${message.envelope.subject}`);
	//        }
	} finally {
	// Make sure lock is released, otherwise next `getMailboxLock()` never returns
	lock.release();
	}
	// log out and close connection
	await client.logout();
};

main().catch(err => console.error(err));
//»*/



