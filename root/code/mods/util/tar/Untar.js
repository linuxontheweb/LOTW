
function k(b){function f(a){for(var c=0,b=d.length;c<b;++c)d[c](a);e.push(a)}if("function"!==typeof Promise)throw Error("Promise implementation not available in this environment.");var d=[],e=[],c=new Promise(function(a,c){b(a,c,f)});c.progress=function(a){if("function"!==typeof a)throw Error("cb is not a function.");for(var b=0,f=e.length;b<f;++b)a(e[b]);d.push(a);return c};var g=c.then;c.then=function(a,b,d){g.call(c,a,b);void 0!==d&&c.progress(d);return c};return c}function l(b){if(!(b instanceof
ArrayBuffer))throw new TypeError("arrayBuffer is not an instance of ArrayBuffer.");if(!window.Worker)throw Error("Worker implementation not available in this environment.");return new k(function(f,d,e){var c=new Worker(m),g=[];c.onerror=function(a){d(a)};c.onmessage=function(a){a=a.data;switch(a.type){case "log":console[a.data.level]("Worker: "+a.data.msg);break;case "extract":a=a.data;Object.defineProperties(a,n);g.push(a);e(a);break;case "complete":f(g);break;case "error":d(Error(a.data.message));
break;default:d(Error("Unknown message from worker: "+a.type))}};c.postMessage({type:"extract",buffer:b},[b])})}var h=window.URL||window.webkitURL,m=h.createObjectURL(new Blob(['function UntarWorker(){}UntarWorker.prototype={onmessage:function(a){try{if("extract"===a.data.type)this.untarBuffer(a.data.buffer);else throw Error("Unknown message type: "+a.data.type);}catch(b){this.postError(b)}},postError:function(a){this.postMessage({type:"error",data:{message:a.message}})},postLog:function(a,b){console.info("postLog");this.postMessage({type:"log",data:{level:a,msg:b}})},untarBuffer:function(a){try{for(var b=new UntarFileStream(a);b.hasNext();){var c=b.next();this.postMessage({type:"extract",data:c},[c.buffer])}this.postMessage({type:"complete"})}catch(d){this.postError(d)}},postMessage:function(a,b){self.postMessage(a,b)}};if("undefined"!==typeof self){var worker=new UntarWorker;self.onmessage=function(a){worker.onmessage(a)}}function TarFile(){}function UntarStream(a){this._bufferView=new DataView(a);this._position=0}UntarStream.prototype={readString:function(a){for(var b=1*a,c=[],d=0;d<a;++d){var e=this._bufferView.getUint8(this.position()+1*d,!0);if(0!==e)c.push(e);else break}this.seek(b);return String.fromCharCode.apply(null,c)},readBuffer:function(a){var b;if("function"===typeof ArrayBuffer.prototype.slice)b=this._bufferView.buffer.slice(this.position(),this.position()+a);else{b=new ArrayBuffer(a);var c=new Uint8Array(b),d=new Uint8Array(this._bufferView.buffer,this.position(),a);c.set(d)}this.seek(a);return b},seek:function(a){this._position+=a},peekUint32:function(){return this._bufferView.getUint32(this.position(),!0)},position:function(a){if(void 0===a)return this._position;this._position=a},size:function(){return this._bufferView.byteLength}};function UntarFileStream(a){this._stream=new UntarStream(a)}UntarFileStream.prototype={hasNext:function(){return this._stream.position()+4<this._stream.size()&&0!==this._stream.peekUint32()},next:function(){var a=this._stream,b=new TarFile,c=a.position()+512;b.name=a.readString(100);b.mode=a.readString(8);b.uid=a.readString(8);b.gid=a.readString(8);b.size=parseInt(a.readString(12),8);b.modificationTime=parseInt(a.readString(12),8);b.checksum=a.readString(8);b.type=a.readString(1);b.linkname=a.readString(1);b.ustarFormat=a.readString(6);"ustar"===b.ustarFormat&&(b.version=a.readString(2),b.uname=a.readString(32),b.gname=a.readString(32),b.devmajor=a.readString(8),b.devminor=a.readString(8),b.namePrefix=a.readString(155),0<b.namePrefix.length&&(b.name=b.namePrefix+b.name));a.position(c);if("0"===b.type||"\x00"===b.type)b.buffer=a.readBuffer(b.size);void 0===b.buffer&&(b.buffer=new ArrayBuffer(0));a.position(c+(0<b.size?b.size+(512-b.size%512):0));return b}};'],
{type:"text/javascript"})),n={blob:{get:function(){return this._blob||(this._blob=new Blob([this.buffer]))}},getBlobUrl:{value:function(){return this._blobUrl||(this._blubUrl=h.createObjectURL(blob))}},readAsString:{value:function(){for(var b=this.buffer,f=b.byteLength,b=new DataView(b),d=[],e=0;e<f;++e){var c=b.getUint8(1*e,!0);d.push(c)}return this._string=String.fromCharCode.apply(null,d)}},readAsJSON:{value:function(){return JSON.parse(this.readAsString())}}};this.untar=function(b){return l(b)}

