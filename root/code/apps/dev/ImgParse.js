
/*

Check if all opacity values are 255...
for (let i=3; i < arr.length; i+=4){if (arr[i]!==255) log(arr[i]);}

let lum = .2126 * red + .7152 * green + .0722 * blue

*/

const APPNAME="ImgParse";
const SHOTPATH = "/mnt/shots/1.png";

export const app = function(arg) {

//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

Main.top.title=APPNAME;
const{util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;

const fs = NS.api.fs;

//»

//DOM«

Main.over="auto";

//»

//Var«


//»

//Funcs«

/*
return new Promise((Y,N)=>{

});
*/

const get_cropped_data=(filename, row_start, row_end)=>{//«

/*«

w=629
h=585
rowstride = 629*4 = 2516
rowstride*585 = 1471860 bytes

Get rows 177->527

Start @ 177*rowstride = 445332
End @ 527*rowstride = 1325932

»*/

return new Promise(async(Y,N)=>{

let rv = await fs.readFile(filename);
let img = new Image;

img.onload=(e)=>{//«

	let can = mk('canvas');
	let ctx = can.getContext('2d');
	let w = e.target.width;
	let h = e.target.height;
	can.width=w;
	can.height=h;
	ctx.drawImage(img,0,0);

	let rowstride = 4*w;
	let start = row_start*rowstride;
	let end = row_end*rowstride;

	Y([w, ctx.getImageData(0,0,w, h).data.slice(start, end)]);

};//»

img.src = URL.createObjectURL(rv);

});

};//»
const get_rect = (arr, rowstride, x_start, y_start, w, h)=>{//«

	let start = y_start*rowstride + (4*x_start);
	let out = new Uint8ClampedArray(4*h*w);
	for (let i=start, j=0; j < h ;i+=rowstride, j++) out.set(arr.slice(i, i+4*w), 4*w*j);

	let luminosity_thresh = 0.8;
	let val;
	for (let i=0; i < out.length; i+=4){
	//Reduce each pixel to either black or white
	//let lum = .2126 * red + .7152 * green + .0722 * blue

//.2126/255 = 0.0008337254901960785
//.7152/255 = 0.002804705882352941
//.0722/255 = 0.0002831372549019608
//		if ((0.2126*out[i]/255 + 0.7152*out[i+1]/255 + 0.0722*out[i+2]/255) > luminosity_thresh) val = 255;
		if ((out[i]*0.0008337254901960785 + out[i+1]*0.002804705882352941 + out[i+2]*0.0002831372549019608) > luminosity_thresh) val = 255;
		else val = 0;
		out[i]=val;
		out[i+1]=val;
		out[i+2]=val;
	}
	return out;

}//»
const get_chars = (arr, imstride)=>{//«

	let all=[];
	let ch=[];
//	let imstride = 4*w;
	for (let i=0; i < imstride; i+=4){
		let v0 = arr[i+(imstride*0)];
		let v1 = arr[i+(imstride*1)];
		let v2 = arr[i+(imstride*2)];
		let v3 = arr[i+(imstride*3)];
		let v4 = arr[i+(imstride*4)];
		let v5 = arr[i+(imstride*5)];
		let v6 = arr[i+(imstride*6)];
		if (!(v0||v1||v2||v3||v4||v5||v6)) {
			if (ch.length) all.push(ch);
			ch=[];
		}
		else ch.push([v0,v1,v2,v3,v4,v5,v6]);
	}
	if (ch.length) all.push(ch);
	return all;
};//»
const make_image=(arr, w, h, scale_fac)=>{//«

let can = mk('canvas');
let ctx = can.getContext('2d');
can.width = w;
can.height = h;
let dat = ctx.createImageData(w, h);
dat.data.set(arr);
ctx.putImageData(dat, 0, 0);

let can2 = mk('canvas');
let ctx2 = can2.getContext('2d');
can2.width = scale_fac*w;
can2.height = scale_fac*h;
ctx2.imageSmoothingEnabled = false;
ctx2.drawImage(can,0,0,scale_fac*w,scale_fac*h);

Main.add(can2);

}//»


const init=async()=>{//«

let w = 100;
let h = 7;

//let [imgwid, arr] = await get_cropped_data("/home/me/Desktop/1.png", 177, 527);
let [imgwid, arr] = await get_cropped_data(SHOTPATH, 177, 527);
arr = get_rect(arr, 4 * imgwid, 270, 8, w, h);
make_image(arr, w, h, 20);

let chars = get_chars(arr, 4*w);

log("CHARS",chars);


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

