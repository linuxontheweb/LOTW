const{log,cwarn,cerr}=Core;
const{api,styler}=Desk;
let imgpath = "/www/img/lotw256.png";

//await fs.cacheFileIfNeeded(imgpath);
styler("bgpos","center");
styler("bgop",0.075);
styler("bgrep","no-repeat");
styler("bgimg",imgpath);
//styler("bgcol","linear-gradient(135deg, #2c3e50 62%, #3498db)");//Blue sky
//styler("bgcol","linear-gradient(135deg, #67115e 50%, #92151e)");//Purple->Red
/*
await api.openApp("chrome.Toolbox",{
	ISCHROME:true,
	XREL:"right",
	X:0,
	Y:0,
	OP:0
});

await api.openApp("chrome.StartButton",{
	ISCHROME:true,
	X:0,
	Y:0,
	OP:0
});

await api.openApp("chrome.Launcher",{
	ISCHROME:true,
	X:0,
	YREL:"bottom",
	Y:0,
	Z:0,
	OP:0,
	WID:"100%",
	HGT: 1
},{
	baseSize:14,
	finalSize:72,
	opacity:0.25
});
*/
succ(true);
