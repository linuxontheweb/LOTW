
//Imports«

const {is_app}=arg;
const{log,cwarn,cerr}=Core;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

//»

//Var«


//»

//DOM«

Main.bgcol="#000";

//»

//OBJ/CB«

this.onkeydown = function(e,s) {//«
}//»
this.onresize = function() {//«
}//»
this.onkill = function() {//«
	URL.revokeObjectURL(audio.src);
	stream.getAudioTracks().forEach(track => {
		track.stop();
	});
	clearInterval(interval);
}//»

//»

//Recording«

let interval;
let stream;
let track;
let mime = 'audio/webm; codecs=opus';
let BPS = 8000;

const start_recording=async()=>{//«
	stream = await navigator.mediaDevices.getUserMedia({audio:true})
	let recorder  = new MediaRecorder(stream, {mimeType: mime,audioBitsPerSecond: BPS});
	recorder.ondataavailable=async e=>{
		let dat = await Core.api.toBuf(e.data);
		buf.appendBuffer(dat);
	}
	interval = setInterval(()=>{
		recorder.requestData();
	},250);

	recorder.start();
}//»

//»

//Playing«

let audio = make('audio');
let source = new MediaSource();
let buf;
source.onsourceopen=(e)=>{

buf = source.addSourceBuffer(mime);
start_recording();

};
audio.src = URL.createObjectURL(source);
audio.play();


//»


