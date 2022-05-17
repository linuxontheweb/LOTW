
//Imports«
var _;
_=Core;
var log = _.log;
var cwarn = _.cwarn;
var cerr = _.cerr;
var globals = _.globals;
var util = globals.util;
_ = util;
var isstr = _.isstr;
var strnum = _.strnum;
var isnotneg = _.isnotneg;
var isid = _.isid;
var isarr = _.isarr;
var isobj = _.isobj;
var isnum = _.isnum;
var isnull = _.isnull;
var isint = _.isint;
var ispos = _.ispos;
var isneg = _.isneg;

var fs = globals.fs;

//»


this.GLRenderer=function(objarg, gl_can, if_push){//«
//Var«

var gl = gl_can.getContext('webgl',{preserveDrawingBuffer: true});

var SCREEN_WIDTH;
var SCREEN_HEIGHT;
var ASPECT;
//const SIZE_DELT = 10;
var gl_program;
var vertexShader;

//Frag shaders«
var frag_arr = [
	'precision mediump float;',
	'varying highp vec2 vTexCoord;',
	'uniform sampler2D uSampler;',
	'void main(void) {',
	'  vec4 pixel = texture2D(uSampler, vTexCoord);',
	'',
	'  gl_FragColor = pixel;',
	'}'
];

function make_pix_str(num){//«
	var pix_arr = [
		'precision mediump float;',
		'varying highp vec2 vTexCoord;',
		'uniform sampler2D tex;',
		'void main()',
		'{',
		' float dx = 15.*(1./'+num+'.);',
		' float dy = 10.*(1./'+num+'.);',
		' vec2 coord = vec2(dx*floor(vTexCoord.x/dx),',
		' dy*floor(vTexCoord.y/dy));',
		' gl_FragColor = texture2D(tex, coord);',
		'}'
	];
	return pix_arr.join("\n");
}
//»
//»

//»

//Funcs«

function get_usenum(){//«
	for (let i=1; i < 1024; i++){
		let num = Math.pow(2,i);
		if ((SCREEN_WIDTH/num <= 1)&&(SCREEN_HEIGHT/num<=1)) return num;
	}
}//»

function set_new_shader(str){//«
	gl_program = gl.createProgram();
	gl.attachShader(gl_program, vertexShader);
	let shader = compileShader(gl.FRAGMENT_SHADER, str);
	gl.attachShader(gl_program, shader);
	gl.linkProgram(gl_program);
	if (!gl.getProgramParameter(gl_program, gl.LINK_STATUS)) {
	}
	gl.useProgram(gl_program);
}//»
var compileShader = function(type, source) {//«
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  console.log('compileShader failed: ' + gl.getShaderInfoLog(shader));
	}
	return shader;
};//»

function init_renderer() {//«
	var buffer = gl.createBuffer();

	SCREEN_WIDTH = objarg.width;
	SCREEN_HEIGHT = objarg.height;
	var USENUM = get_usenum();
	var w = SCREEN_WIDTH / USENUM;
	var h = SCREEN_HEIGHT / USENUM;

//	gl.viewport(0,0,SCREEN_WIDTH, SCREEN_HEIGHT)

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		-1, -1,  0, h,
		+1, -1,  w, h,
		-1, +1,  0, 0,
		+1, +1,  w, 0,
	]), gl.STATIC_DRAW);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
	  gl.TEXTURE_2D, 0, gl.RGBA, USENUM, USENUM, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	vertexShader = compileShader(gl.VERTEX_SHADER,//«
	'attribute vec2 aPos;' +
	'attribute vec2 aTexCoord;' +
	'varying highp vec2 vTexCoord;' +
	'void main(void) {' +
	'  gl_Position = vec4(aPos, 0.0, 1.0);' +
	'  vTexCoord = aTexCoord;' +
	'}'
	);//»


/*
var fragmentShader = compileShader(gl.FRAGMENT_SHADER,//«
'precision mediump float;'+
'varying highp vec2 vTexCoord;' +
'uniform sampler2D uSampler;' +
'void main(void) {' +
'  vec4 pixel = texture2D(uSampler, vTexCoord);'+
//'  pixel.r=0.0;'+
//'  pixel *= 0.5;'+
'  gl_FragColor = pixel;' +
//'  gl_FragColor = texture2D(uSampler, vTexCoord);' +
'}'
);//»
*/
	var fragmentShader = compileShader(gl.FRAGMENT_SHADER, frag_arr.join("\n"));
//	var fragmentShader = compileShader(gl.FRAGMENT_SHADER, pix_arr.join("\n"));
	gl_program = gl.createProgram();
	gl.attachShader(gl_program, vertexShader);
	gl.attachShader(gl_program, fragmentShader);
	gl.linkProgram(gl_program);
	if (!gl.getProgramParameter(gl_program, gl.LINK_STATUS)) {
log('program link failed: ' + gl.getProgramInfoLog(gl_program));
	}
	gl.useProgram(gl_program);

	var aPos = gl.getAttribLocation(gl_program, 'aPos');
	var aTexCoord = gl.getAttribLocation(gl_program, 'aTexCoord');
	var uSampler = gl.getUniformLocation(gl_program, 'uSampler');

	gl.enableVertexAttribArray(aPos);
	gl.enableVertexAttribArray(aTexCoord);
	gl.vertexAttribPointer(aPos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, gl.FALSE, 16, 8);
	gl.uniform1i(uSampler, 0);
}//»
var renderTexture = function() {//«
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};//»
var uploadTexture = function(buffer) {//«
//log(buffer);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
};//»

/*
function resize(ifmax){//«
	var usew, useh;
    if (h*ASPECT > w) {
		usew = w;
		useh = w/ASPECT;
    }
    else {
		useh = h;
		usew = h*ASPECT;
    }
	gl_can.width = usew;
	gl_can.height = useh;
	gl.viewport(0, 0, usew, useh)
	if (!ifmax) {
		main.w = usew;
		main.h = useh;
	}
}//»
function init() {//«
	var constraints = { //«
		audio: false, 
		video: true
	};//»
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {//«
	function render(){
		if (killed) return;
		ctx.drawImage(vid,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		uploadTexture(new Uint8Array(ctx.getImageData(0,0,SCREEN_WIDTH,SCREEN_HEIGHT).data.buffer));
		renderTexture();
		requestAnimationFrame(render);
	}
	vidtrack = stream.getTracks()[0];
	vid.oncanplay=(e)=>{
		SCREEN_WIDTH = e.target.videoWidth;
		SCREEN_HEIGHT = e.target.videoHeight;
		gl_can.width = can.width = SCREEN_WIDTH;
		gl_can.height = can.height = SCREEN_HEIGHT;
		ASPECT = SCREEN_WIDTH/SCREEN_HEIGHT;
//e.target.videoWidth/e.target.videoHeight
//		w = e.target.videoWidth;
//		h = e.target.videoHeight;
		resize();
		init_service();
		init_renderer();
		requestAnimationFrame(render);
	};
	vid.srcObject = stream;
	vid.play();

})//»
.catch(function(err) {//«
cerr(err);
	window.innerHTML = err.message;
})//»

}//»
*/

//»

//OBJ/CB«

this.init=()=>{
	init_renderer();
	resize(SCREEN_WIDTH, SCREEN_HEIGHT);
}
function render(){
	if (!if_push) objarg.render();
//log("YO");
//	uploadTexture(objarg.getbuffer()
	uploadTexture(objarg.getbuffer());
	renderTexture();
}
this.render=render;
function resize(w,h){//«
	gl_can.width = w;
	gl_can.height = h;
	gl.viewport(0, 0, w, h)
}
this.resize=resize;

//»

//»

}//»


