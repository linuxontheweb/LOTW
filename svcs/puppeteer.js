/*Whenever we have page.goto with a waitUntil:"networkidle2", we can stop using that and 
wait for a certain element using one of these two:

page.waitForSelector(selector[, options])//«

selector <string> A selector of an element to wait for

options <Object> Optional waiting parameters

visible <boolean> wait for element to be present in DOM and to be visible, i.e.
to not have display: none or visibility: hidden CSS properties. Defaults to
false.

hidden <boolean> wait for element to not be found in the DOM or to be hidden,
i.e. have display: none or visibility: hidden CSS properties. Defaults to
false.

timeout <number> maximum time to wait for in milliseconds. Defaults to 30000
(30 seconds). Pass 0 to disable timeout. The default value can be changed by
using the page.setDefaultTimeout(timeout) method.

returns: <Promise<?ElementHandle>> Promise which resolves when element
specified by selector string is added to DOM. Resolves to null if waiting for

hidden: true and selector is not found in DOM.

Wait for the selector to appear in page. If at the moment of calling the method
the selector already exists, the method will return immediately. If the
selector doesn't appear after the timeout milliseconds of waiting, the function
will throw.

//»

page.waitForXPath(xpath[, options])//«

xpath <string> A xpath of an element to wait for

options <Object> Optional waiting parameters

visible <boolean> wait for element to be present in DOM and to be visible, i.e.
to not have display: none or visibility: hidden CSS properties. Defaults to
false.

hidden <boolean> wait for element to not be found in the DOM or to be hidden,
i.e. have display: none or visibility: hidden CSS properties. Defaults to
false.

timeout <number> maximum time to wait for in milliseconds. Defaults to 30000
(30 seconds). Pass 0 to disable timeout. The default value can be changed by
using the page.setDefaultTimeout(timeout) method.

returns: <Promise<?ElementHandle>> Promise which resolves when element
specified by xpath string is added to DOM. Resolves to null if waiting for

hidden: true and xpath is not found in DOM.

Wait for the xpath to appear in page. If at the moment of calling the method
the xpath already exists, the method will return immediately. If the xpath
doesn't appear after the timeout milliseconds of waiting, the function will
throw.

//»


*/
//XXX YJEYXBKFKS CHANGE THIS FROM A HARDCODED 4 TO PICK DIFFERENT PARTS OF THE LOBBY


const http = require('http');//«
const fs = require('fs');
const hostname = '192.168.0.14';
const port = 6019;
const pupp = require('puppeteer');

let browser, page;

//»

//Var«

const WID = 800;
const HGT = 800;

let MSGIN;
let cur_res;
let get_messages = false;
//let ws;

//let screenshot_interval;
let shot_iter=0;

//»

//Funcs«

const log=(...args)=>{console.log(...args)};
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

const init = async()=>{//«

	browser = await pupp.launch({
		headless: false,
		userDataDir: "./data",
		args: [`--window-size=${WID},${HGT}`]
	});
	page = await browser.newPage();
	const client = await page.target().createCDPSession();
	await client.send('Network.enable');
	await client.send('Page.enable');
//log(client);
	client.on('Network.webSocketCreated', ({requestId, url}) => {
//log('Network.webSocketCreated', requestId, url);
log('created', requestId, url);
	})
	client.on('Network.webSocketClosed', ({requestId, timestamp}) => {
//log('Network.webSocketClosed', requestId, timestamp);
log('closed', requestId);
	})
	client.on('Network.webSocketFrameSent', ({requestId, timestamp, response}) => {
//log('Network.webSocketFrameSent', requestId, timestamp, response.payloadData);
log('sent', response.payloadData);
	})
	client.on('Network.webSocketFrameReceived', ({requestId, timestamp, response}) => {
//log('Network.webSocketFrameReceived', requestId, timestamp, atob(response.payloadData));
		if (!get_messages) return;
		let s = atob(response.payloadData).slice(8);
//log(s);
		if (cur_res){
			okay(cur_res);
			cur_res.end(s);
			cur_res = null;
			return;
		}
		MSGIN.push(s);
	})

};//»

//»

const server = http.createServer(async(req, res) => {//«

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
        let val = decodeURIComponent(argi[1]);
        if (!val) val = false;
        arg_hash[key] = val;
    }
}//»

if (meth=="GET") {

	if (url=="/ping"){
		okay(res);
		res.end("ACK");
	}
	else if (url=="/click"){
let x = arg_hash.x;
let y = arg_hash.y;
okay(res);
res.end(`UCLICKED: ${x} ${y}`);
	}
	else if (url=="/screenshot"){
//		if (!page) return nogo(res);
		okay(res, "image/png");
		res.end(await page.screenshot({fullPage: true}));
	}
	else if (url=="/setpage"){
		if (!arg_hash.page) return nogo("No page arg given");
		try{
			await page.goto(arg_hash.page, {waitUntil: "networkidle2", timeout: 5000});

		}
		catch(e){
			nogo(res, "The page could not be loaded");
			return;
		}
		okay(res);
		res.end(`OK: ${arg_hash.page}`);
	}

	else if (url=="/content"){
		okay(res);
		res.end(await page.content());
	}
	
	else if (url=="/wrapper"){
/*
This clicks on a type of game on the horizontal bar at the top (Tourneys, Sit&Go's, Ring/Cash Games)
//XXX HARDCODED TO CLICK ON #4 == Free Ring Games !!! XXX

*/
		let handle = await page.$(".keywords-poker-wrapper");
		let elem = (await handle.$$(".icons-list"))[4]; //<-- YJEYXBKFKS
		elem.click();
		okay(res);
		res.end("OK");
	}
	else if (url=="/grid"){
//		let handle = await page.$("grid-poker");

//tiles-desktop is a className of the <ion-col> that contains all of the <ion-col>'s that 
//are the wrappers for the individual game listings.
//Inside of these wrappers are div.buttons-container's (which innerText == "Play") that
//are to be clicked on in order to start playing the game!!!

let handle = await page.$(".tiles-desktop");
let cols = await handle.$$("ion-col");
log(cols);

		okay(res);
		res.end("OK");
	}


	else if (url=="/msgoff"){
		if (cur_res){
			okay(cur_res);
			cur_res.end("{}");
			cur_res = null;
		}
		MSGIN = null;
		get_messages = false;
		okay(res);
		res.end(`OK: OFF`);
	}
	else if (url=="/msgon"){
		MSGIN = [];
		cur_res = null;
		get_messages = true;
		okay(res);
		res.end(`OK: ON`);
	}
	else if (url=="/msgin"){
		if (!get_messages){
			nogo(res, "Must turn on messages with /msgon");
			return;
		}
		let got = MSGIN.shift();
		if (got){
			okay(res);
			res.end(got);
			return;
		}
		else cur_res = res;
	}
	else nogo(res);

}
else nogo(res);


});//»

server.listen(port, hostname, () => {//«

console.log(`Server running at http://${hostname}:${port}/`);

});//»



init();














/*Old«
//const WebSocketServer = require('ws').WebSocketServer;
//const SCREENSHOT_PATH="/dev/shm/PPT.jpg";


const sleep=ms=>{return new Promise((Y,N)=>{setTimeout(Y,ms);});};

const open_page=async (url, id)=>{//«
if (!page) return;

try{
//	await Promise.all([
	await page.goto(url, {waitUntil: "networkidle2"});
//		page.waitForNavigation()
//	]);
}
catch(e){
log(e);
return;
}

ws.send(JSON.stringify({opened: url}));

};//»
const click=async(arg)=>{//«
//  | 'load'
//  | 'domcontentloaded'
//  | 'networkidle0'
//  | 'networkidle2';
try{
//await Promise.all([
	await page.mouse.click(arg.x, arg.y);
//		page.waitForNavigation({waitUntil:'networkidle0'})
//		page.waitForNavigation()
//	]);
}
catch(e){
log(e);
return;
}
//  page.waitForNavigation({waitUntil: 'networkidle0'})

//	setTimeout(screenshot, 100);

//	screenshot();
};//»

//(async () => {//«
//	pupp.defaultArgs({userDataDir: "./data"});
//	await page.setViewport({
//		width: 500,
//		height: 400
//	});
//log(page);
	browser = await pupp.launch({
		headless: false,
		userDataDir: "./data",
		args: [`--window-size=${WID},${HGT}`]
	});
	page = await browser.newPage();
	await page.goto('https://google.com');
	screenshots(20, 250);
//	let rv = await page.screenshot();
//log(rv);
//	await browser.close();

//})();
//»


const wss = new WebSocketServer({ server });//«

wss.on('connection', function connection(wsarg) {//«
	ws = wsarg;

log("connected");
//*
	ws.on('close', async()=>{
		ws = null;
		if (browser) await browser.close();
log("closed");
	});

	ws.on('message',async(data)=>{
		let com = JSON.parse(data.toString());
		if (com.open) open_page(com.open, com.id);
		else if (com.screenshot){
			if (com.screenshot === true) screenshot();
		}
		else if (com.click) click(com.click);
		else if (com.setinterval){
//!
//			clearTimeout(screenshot_timeout);
//			screenshot_timeout = com.setinterval;
//			do_screenshot();
			clearInterval(screenshot_interval);
			screenshot_interval = setInterval(screenshot, com.setinterval);
		}
		else if (com.clearinterval) clearInterval(screenshot_interval);
		else if (com.launch) {
			browser = await pupp.launch({
		//		defaultViewport: {width: WID, height:HGT},
				headless: false,
				userDataDir: "./data",
				args: [`--window-size=${WID},${HGT}`]
			});
			page = await browser.newPage();
		}

	});
});//»

//»

const screenshot=()=>{if(!ws)return;page.screenshot({fullPage:true}).then(rv=>{ws.send(rv);});};
const screenshot = async()=>{//«
if (!ws) return;
//clip:{
//	x: x_coord,
//	y: y_coord,
//	width: width_pixels,
//	height: height_pixels
//}

//const rv = await page.screenshot({path:SCREENSHOT_PATH, quality: 25, fullPage: true});
const rv = await page.screenshot({fullPage: true});
ws.send(rv);

};//»
const screenshot = () => {//«
	let PATH = "/dev/shm/screenshot.png";
	if (!ws) return;

	page.screenshot({path:PATH, fullPage: true});
	fs.readFile(PATH,(err, rv)=>{
		if (err) {
log("Error reading file!");
			return;
		}
		ws.send(rv);
	});
};//»
const screenshots = (iter, msarg) => {

//setTimeout(async()=>{
setTimeout(()=>{
	iter--;
	if (iter==0) return;
log(iter, msarg);
	screenshots(iter, msarg);
}, msarg);
//log(iter, msarg);
//	if (iter==0) return;
//	let rv = await page.screenshot();
//	await sleep(msarg);
//	screenshots(--iter, msarg);

}


const do_screenshot=async()=>{
	
//	screenshot_timeout = setTimeout(async()=>{
	if (!screenshot_timeout) return;
	const rv = await page.screenshot({fullPage: true});
	if (!screenshot_timeout) return;
//	log(shot_iter++);
	ws.send(rv);
	await sleep(screenshot_timeout);
	do_screenshot();
//		do_screenshot(msarg);
//	}, msarg);

};

»*/


