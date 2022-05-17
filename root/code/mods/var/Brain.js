
//Imports«

const{Desk,log,cwarn,cerr,globals}=Core;
const{util,fs}=globals;
const{make}=util;
let usecache;

//»

//VARS«
const getkeys=obj=>{let arr=Object.keys(obj);let ret=[];for(let i=0;i<arr.length;i++){if(obj.hasOwnProperty(arr[i]))ret.push(arr[i]);}return ret;};
let batch_mode = false;
let save_objs;
let adjs;

let logging = arg['LOGGING'];//«
let errcb = logging.ERR;
let info = logging.INFO;
let warn = logging.WARN;
info("Brain module initialization...");

//»

//CBs«

var save_cb = arg['SAVECB'];
var speak_cb = arg['SPEAKCB'];
var spwordoff_cb = arg['SPWORDOFFCB'];
var thinkon_cb = arg['THONCB']
var thinkoff_cb = arg['THOFFCB']

//»

//«ENV
var VARS = {};

var is_termenv = arg['ISTERMENV'];

var topwin = arg['TOPWIN'];

var UNIENV = arg['UNIENV'];
var APPENV = arg['APPENV'];
//Has the opening intro ever been completed? BOOL

//Location«

var LOCATION_EARTH = {
	NAM: {
		US: {}
	},
	SAM: {},
	EUR: {},
	AFR: {},
	ASA: {},
	AUS: {}
};

var loc_us = LOCATION_EARTH.NAM.US;

//»

//»
//CUROBJS«
//"The boy/The girl"

//var sys_name_bertie = ["bertie","bertram","birdie","birdy","wilberforce","wooster"];
////var sys_name_dennis = ["dennis","kane"];
//var sys_names = sys_name_bertie.concat(sys_name_dennis).sort().uniq();

//var sys_name_bertie = ["bertie","bertram","birdie","wilberforce","wooster"];


var cur_names = UNIENV['NAMES'];
if (!cur_names) cur_names = [];
//else cur_names = cur_names.concat(sys_names).sort().uniq();
var cur_objs = {};

var nametok_index = {};
if (UNIENV["NAMETOKIDX"]) nametok_index = JSON.parse(UNIENV["NAMETOKIDX"]);

var adj_index = {};
if (UNIENV["ADJIDX"]) adj_index = JSON.parse(UNIENV["ADJIDX"]);

//desc: m#n, 
//where m == the position in class_index

var class_index = [];
if (UNIENV["CLASSIDX"]) class_index = JSON.parse(UNIENV["CLASSIDX"]);

var cur_male;
var cur_fem;

var cur_self;
if (UNIENV["CURSELF"]) cur_self = JSON.parse(UNIENV["CURSELF"]);

var cur_other;
if (UNIENV["CUROTHER"]) cur_other = UNIENV["CUROTHER"];
//"It"
var cur_neut;
//"They/Those"
var cur_grp;

//»

//TIME«
var WAIT_NEXT = 1500;
var WAIT_SPEECH_1 = 2000;
var WAIT_SPEECH_2 = 3000;
//»
//MODES«
var is_restate = null;
var is_error = false;
//»
//Schema«
var obj_iter=0;
if (UNIENV['OBJ_ITER']) obj_iter = UNIENV['OBJ_ITER'];

var sctokobj = {};
var schema = new Schema();
var scobjs = schema.init();
//log(scobjs);
var sctypes = getkeys(scobjs);
var sctokarr = [];
var scobjarr = [];
for (var i=0; i < sctypes.length; i++) {
	var typestr = sctypes[i];
	var typearr = typestr.split("_");
	var arrlen = typearr.length;
	var obj = scobjs[typestr];
	sctokarr = sctokarr.concat(sctypes[i].split("_"));
	for (var j=0; j<arrlen; j++) scobjarr.push(obj);
}


for (var i=0; i < sctokarr.length; i++) {
//	var gotobj = sctokobj
	var tok = sctokarr[i];
	var arr = sctokobj[tok];
	if (!arr) arr = [];
//	arr.push(scobjarr[i]);
	arr = arr.concat(scobjarr[i]);
	sctokobj[tok] = arr;
}

delete sctokobj.Of;
delete sctokobj.And;

//log(sctokobj);

/*


sctokobj is the thing that cross references individual tokens to the real world
classes whose names are composed of them.


*/



//»

//LOC«
var US_statecodes = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
var US_statenames = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District_of_Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New_Hampshire","New_Jersey","New_Mexico","New_York","North_Carolina","North_Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode_Island","South_Carolina","South_Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West_Virginia","Wisconsin","Wyoming"]
//»

//»

function OO(obj) {//«
/*«
This is a generic ontology definer, such that a user can use it inside of a
higher level interface that may:
1) Define a strict, deeply embedded Unix pathlike heirarchical model 
(eg, for animal taxonomy)
2) Be a simple flat namespace of everyday common objects

We can create arbitrary OO's that may each have flat namespaces, but
that exist within a higher level ENV that tests them individually.


The class objects that are generated internally use either:
wdType = WikiData type
comType = common type
taxType = taxonomic schema type
»*/

	if (obj) {
		if (obj['NAME']) this.name = obj['NAME'];
	}

	var _classdefs = {}
	var _classes = {};

		var fbody = [//«
			'{',

			'var _wdType = arg["WDTYPE"]; this.wdType=_wdType;',
			'var _comType = arg["COMTYPE"]; this.comType=_comType;',
			'var _taxType = arg["TAXTYPE"]; this.taxType=_taxType;',
			'var _instances = {};',
			'var _subtypes = arg["SUBTYPES"];',
			'var _self = this;',
			'var _par = arg["PAR"]',
			'var usedat = {};',
			'if (typeof arg["DAT"] == "object") usedat=arg["DAT"];',
			'this.data=usedat;',
			'this.new = function(idarg, scobjarg, datarg) {',
			'	var useid;',
			'	if (idarg) {',
			'		if (_instances[idarg]) {',
//			'			var usetype = _wdType || _taxType || _comType || "_NOTYPE"',
//			'			throw new Error("OOInstance: " + usetype + " exists");',
			'			return _instances[idarg];',
			'		}',
			'		useid = idarg;',
			'	}',
			'	else useid = Desk.uuid();',
			'	if (typeof datarg != "object") datarg = {};',
			'	var obj = {"CLASS": _self, "ID": useid, "DATA": datarg, "TREE": scobjarg};',
			'	Object.freeze(obj);',
			'	_instances[useid] = obj;',
			'	return obj;',
			'}',

			'this.getinstances = function() {',
			'	return getkeys(_instances);',
			'}',

			'this.getinstance = function(idarg) {',
			'	return _instances[idarg];',
			'}',

			'}'
		];//»
	function mkclassdef(key) {//«
		if (!key) throw new Error("OO: No classkey given");
		if (!key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) throw new Error('OO: Invalid classkey: "' + key+ '"');
		if (_classes[key]) return key;
//throw new Error("OO: The classdef exists: " + key);
		var str = 'function ' + key + '(arg)' + fbody.join("\n");
		var def = eval( '(' + str + ')' );
		_classdefs[key] = def;
		return key;
	}//»
	this.mkclassobj = function(key, arg) {//«
		if (_classes[key]) {
			return _classes[key];
		}
		var gotdef = _classdefs[key];
		if (!gotdef) mkclassdef(key);
		gotdef = _classdefs[key];
		if (!arg) arg = {};
		var obj = new gotdef(arg);
		Object.freeze(obj);
		_classes[key] = obj;
		return obj;
	}//»
	this.getclassobj = function(key) {//«
		return _classes[key];
	}//»

}//»
function Schema() {//«

/*«

var oo = new OO();
oo.mkclassdef("Thing__Animal__Bear");
oo.mkclassobj("Thing__Animal__Bear",{PAR:getclassobj("Thing__Animal"),SUBTYPES:["GrizzlyBear","PolarBear"]});
var bearclass = oo.getclassobj("Thing__Animal__Bear");
var  = anim.new("id-Snoopy");

We can parse the input and dynamically create classes when we get them

We are either:
1) using the generic class features (What is a Dog/What are Dogs like?)
2) creating and using instances (there is a dog named Joe)


To name instances:
The X is [named|called|knownAs]
The name of the X is ...
The X's name is ...


»*/

//Schema«

var __animals = [//«
	{i:"Bear",a:[{i:"Grizzly_Bear"},{i:"Polar_Bear"}]},
	{i:"Cat"},
	{i:"Dog"},
	{i:"Horse"},
	{i:"Lion"},
	{i:"Monkey"},
	{i:"Rat"},
	{i:"Snake"},
	{i:"Spider"}
];//»
var __working_person = [//«
	{i:"Engineer"}
];//»
var __people = [//«
	{i:"Boy",g:"m"},
	{i:"Girl",g:"f"},
	{i:"Man",g:"m"},
	{i:"Woman",g:"f"},
	{i:"Infant_OR_Baby"},
	{i:"Toddler"},
	{i:"Child"},
	{i:"Teenager"},
	{i:"Adult"},
	{i:"Nerd"},
//	{i:"Engineer"}
	{i:"Working_Person", a: __working_person}
];//»
var __sports = [//«
	{i:"Football"},
	{i:"Soccer"},
	{i:"Baseball"},
	{i:"Basketball"},
	{i:"Hockey"}
];//»
var __group_workouts = [//«
	{i:"Yoga_Class"},
	{i:"Karate_Class"}
];//»
var __organized_activities = [//«
	{i:"Sport",a:__sports},
	{i:"Group_Workout",a:__group_workouts}
];//»
var __gen_categories = [//«
	{i:"Music"},
	{i:"Relationships"},
	{i:"Lifestyles"},
	{i:"Arts"},
	{i:"Entertainment"},
	{i:"Education"},
	{i:"Business"},
	{i:"Science_OR_Research"},
	{i:"Money"},
	{i:"Technology"},
	{i:"History"},
	{i:"Trivia"},
	{i:"Sports"},
	{i:"Housing"},
	{i:"Travel"},
	{i:"Local"}
]//»
var __fake = [//«
	{i:"Demon"},
	{i:"Unicorn"},
	{i:"Angel"}
]//»

var __schema = {i:"Thing",x:1,a:[{i:"Fake",x:1,a:__fake},{i:"Person",a:__people},{i:"Organized_Activity",x:1,a:__organized_activities},{i:"Animal",a:__animals},{i:"Creative_Work",x:1,a:[{i:"Answer"},{i:"Tweet"},{i:"Article",a:[{i:"Blog_Post"},{i:"News_Article"}]},{i:"Blog"},{i:"Book"},{i:"Clip",a:[{i:"Radio_Clip"},{i:"TV_Clip"}]},{i:"Code"},{i:"Comment"},{i:"Email"},{i:"Episode",x:1,a:[{i:"TV_Episode"}]},{i:"Game",a:[{i:"Video_Game"}]},{i:"Map"},{i:"Movie"},{i:"Music_Composition"},{i:"Music_Playlist",x:1,a:[{i:"Album"}]},{i:"Music_Recording"},{i:"Painting"},{i:"Photograph"},{i:"Question"},{i:"Recipe"},{i:"Review"},{i:"Sculpture"},{i:"Season",a:[{i:"TV_Season"}]},{i:"Series",x:1,a:[{i:"Periodical"},{i:"TV_Series"}]},{i:"Software_Application",a:[{i:"Mobile_Application"},{i:"Video_Game"},{i:"Web_Application"}]},{i:"TV_Season"},{i:"TV_Series"},{i:"Web_Page"},{i:"Web_Site"}]},{i:"Organization",x:1,a:[{i:"Airline"},{i:"Corporation"},{i:"Educational_Organization",x:1,a:[{i:"College_OR_University"},{i:"Elementary_School"},{i:"High_School"},{i:"Middle_School"},{i:"Preschool"},{i:"School"}]},{i:"Government_Organization"},{i:"Local_Business",x:1,a:[{i:"Animal_Shelter"},{i:"Automotive_Business",x:1,a:[{i:"Auto_Body_Shop"},{i:"Auto_Dealer"},{i:"Auto_Parts_Store"},{i:"Auto_Rental"},{i:"Auto_Repair"},{i:"Auto_Wash"},{i:"Gas_Station"},{i:"Motorcycle_Dealer"},{i:"Motorcycle_Repair"}]},{i:"Child_Care"},{i:"Dry_Cleaning_OR_Laundry"},{i:"Emergency_Service",a:[{i:"Fire_Station"},{i:"Hospital"},{i:"Police_Station"}]},{i:"Employment_Agency"},{i:"Entertainment_Business",a:[{i:"Amusement_Park"},{i:"Art_Gallery"},{i:"Casino"},{i:"Comedy_Club"},{i:"Movie_Theater"},{i:"Night_Club"}]},{i:"Financial_Service",a:[{i:"Accountant"},{i:"Automated_Teller"},{i:"Bank_OR_Credit_Union"},{i:"Insurance_Agency"}]},{i:"Food_Establishment",x:1,a:[{i:"Bakery"},{i:"Bar_OR_Pub"},{i:"Brewery"},{i:"Cafe_OR_Coffee_Shop"},{i:"Fast_Food_Restaurant"},{i:"Ice_Cream_Shop"},{i:"Restaurant"},{i:"Winery"}]},{i:"Government_Office",a:[{i:"Post_Office"}]},{i:"Health_And_Beauty_Business",a:[{i:"Beauty_Salon"},{i:"Day_Spa"},{i:"Hair_Salon"},{i:"Health_Club"},{i:"Nail_Salon"},{i:"Tattoo_Parlor"}]},{i:"Home_And_Construction_Business",a:[{i:"Electrician"},{i:"General_Contractor"},{i:"HVAC_Business"},{i:"House_Painter"},{i:"Locksmith"},{i:"Moving_Company"},{i:"Plumber"},{i:"Roofing_Contractor"}]},{i:"Internet_Cafe"},{i:"Library"},{i:"Lodging_Business",x:1,a:[{i:"Bed_And_Breakfast"},{i:"Hostel"},{i:"Hotel"},{i:"Motel"}]},{i:"Medical_Organization",x:1,a:[{i:"Dentist"},{i:"Diagnostic_Lab"},{i:"Hospital"},{i:"Medical_Clinic"},{i:"Optician"},{i:"Pharmacy"},{i:"Physician"},{i:"Veterinary_Care"}]},{i:"Legal_Service",x:1,a:[{i:"Attorney"},{i:"Notary"}]},{i:"Radio_Station"},{i:"Real_Estate_Agent"},{i:"Recycling_Center"},{i:"Self_Storage"},{i:"Shopping_Center"},{i:"Sports_Activity_Location",x:1,a:[{i:"Bowling_Alley"},{i:"Exercise_Gym"},{i:"Golf_Course"},{i:"Health_Club"},{i:"Swimming_Pool"},{i:"Ski_Resort"},{i:"Sports_Club"},{i:"Stadium_OR_Arena"},{i:"Tennis_Complex"}]},{i:"Store",a:[{i:"Bike_Store"},{i:"Book_Store"},{i:"Clothing_Store"},{i:"Computer_Store"},{i:"Convenience_Store"},{i:"Department_Store"},{i:"Electronics_Store"},{i:"Florist"},{i:"Furniture_Store"},{i:"Garden_Store"},{i:"Grocery_Store"},{i:"Hardware_Store"},{i:"Hobby_Shop"},{i:"Home_Goods_Store"},{i:"Jewelry_Store"},{i:"Liquor_Store"},{i:"Clothing_Store"},{i:"Mobile_Phone_Store"},{i:"Video_Rental_Store"},{i:"Music_Store"},{i:"Office_Equipment_Store"},{i:"Outlet_Store"},{i:"Pawn_Shop"},{i:"Pet_Store"},{i:"Shoe_Store"},{i:"Sporting_Goods_Store"},{i:"Tire_Shop"},{i:"Toy_Store"},{i:"Wholesale_Store"}]},{i:"Television_Station"},{i:"Tourist_Information_Center"},{i:"Travel_Agency"}]},{i:"NGO"},{i:"Performing_Group",x:1,a:[{i:"Dance_Group"},{i:"Music_Group"},{i:"Theater_Group"}]},{i:"Sports_Organization",x:1,a:[{i:"Sports_Team"}]}]},{i:"Place",x:1,a:[{i:"Heavenly_Body",x:1,a:[{i:"Moon"},{i:"Asteroid"},{i:"Comet"},{i:"Solar_System"},{i:"Constellation"},{i:"Star"},{i:"Galaxy"},{i:"Planet"}]},{i:"Administrative_Area",x:1,a:[{i:"City"},{i:"County"},{i:"State_OR_Province"},{i:"Country"}]},{i:"Civic_Structure",x:1,a:[{i:"Airport"},{i:"Aquarium"},{i:"Beach"},{i:"Bus_Station"},{i:"Bus_Stop"},{i:"Campground"},{i:"Cemetery"},{i:"Crematorium"},{i:"Event_Venue"},{i:"Fire_Station"},{i:"Government_Building",a:[{i:"City_Hall"},{i:"Courthouse"},{i:"Embassy"},{i:"Legislative_Building"}]},{i:"Hospital"},{i:"Movie_Theater"},{i:"Museum"},{i:"Music_Venue"},{i:"Park"},{i:"Parking_Facility"},{i:"Performing_Arts_Theater"},{i:"Place_Of_Worship",x:1,a:[{i:"Buddhist_Temple"},{i:"Catholic_Church"},{i:"Church"},{i:"Hindu_Temple"},{i:"Mosque"},{i:"Synagogue"}]},{i:"Playground"},{i:"Police_Station"},{i:"RV_Park"},{i:"Stadium_OR_Arena"},{i:"Subway_Station"},{i:"Taxi_Stand"},{i:"Train_Station"},{i:"Zoo"}]},{i:"Landform",a:[{i:"Body_Of_Water",x:1,a:[{i:"Canal"},{i:"Lake"},{i:"Ocean"},{i:"Pond"},{i:"Reservoir"},{i:"River"},{i:"Sea"},{i:"Waterfall"}]},{i:"Continent"},{i:"Mountain"},{i:"Volcano"}]},{i:"Landmark_OR_Historical_Building"},{i:"Home_OR_Residence",a:[{i:"Apartment"},{i:"House"}]}]}]};

//»

//Need a flat hash of strings to pathnames...
var allobjs = {};
var oo;
function init() {//«
	oo = new OO();
	var parr =[];
	var curobj = __schema;
	var curpar = null;
	function do_obj(objarg, usepar) {//«
		var id = objarg.i;
//		if (id.match(/Action/) || id.match(/Medical/) || id.match(/Intangible/) || id.match(/Event/)) return;
//		iter++;
		objarg['p'] = usepar;
		var id1 = id;
		var id2 = null;
		var arr = objarg.a;
		var name_arr = null;
		var no_idx = objarg.x;
		if (id.match(/_OR_/)) {
			name_arr = id.split(/_OR_/);
			id1 = name_arr[0];
			id2 = name_arr[1];
		}
		var curpath = parr.join("/");
		var obj = {PATH: "/"+curpath+"/"+id, OBJ: objarg};
		var gotobj = allobjs[id1];
		if (!gotobj) gotobj = [];
		gotobj.push(obj);

		if (!no_idx) {
			allobjs[id1] = gotobj;
//			gotobj[".."] = allobjs;
			if (id2) {
				gotobj = allobjs[id2];
				if (!gotobj) gotobj = [];
				gotobj.push(obj);
				allobjs[id2] = gotobj;
//				gotobj[".."] = allobjs;
			}
		}

		parr.push(id);
		if (arr) {
			for (var i=0; i < arr.length; i++) {
				do_obj(arr[i], objarg);
			}
		}
		parr.pop();
	}//»
	do_obj(__schema, __schema);
	return allobjs;
}//»
this.init = init;

this.mkclassobj = function(path, comType) {//«
	var usepath = path_to_const(path);
	if (!comType) comType = usepath.split("__").pop().firstup();
	return oo.mkclassobj(usepath, {'COMTYPE': comType});
}
//»
this.getclassobj = function(path) {//«
	var usepath = path_to_const(path);
	return oo.getclassobj(usepath);
}//»
this.getscobj = function(path) {//«
	var arr = path_to_const(path).split("__");
//Get rid of "Thing"... this might need to change
	arr.shift();
	var curarr = __schema.a;
	var obj;
	while (arr.length) {
		if (!curarr) {
log("\n\nERROR: NO CURARR IN GETSCOBJ: " + path + "!!!!!\n\n");
			return;
		}
		var tok = arr.shift();
//log("TRYTOK: " + tok);
		for (var i=0; i < curarr.length; i++) {
			obj = curarr[i];
			if (obj.i == tok) {
				curarr = obj.a;
				break;
			}			
		}
	}
//log("GOTSCOBJ");
//log(obj);
	return obj;
}//»
this.getinstancebyid = function(path, id) {//«
	var usepath = path_to_const(path);
	var clobj = oo.getclassobj(usepath);
	if (clobj) return clobj[id];
	else {
log("\nNO CLOBJ IN SCHEMA.GETINSTANCEBYID!!!\n");
	}
}//»
this.loadinstance = function(desc, dat) {//«
	var arr = desc.split("#");
	var usepath = arr[0];
	var id = arr[1];
}//»
this.getinstance = function(desc, noarg) {//«
	if (typeof noarg != "undefined") {
log("\nSCHEMA.GETINSTANCE REQUIRES 1 ARG: DESC!!!\n");
		return null;
	}
	var arr = desc.split("#");
	var usepath = arr[0];
	var id = arr[1];
//	var usepath = path_to_const(path);
	var clobj = oo.getclassobj(usepath);
	if (clobj) return clobj[id];
	else {
log("\nNO CLOBJ IN SCHEMA.GETINSTANCE!!!\n");
	}
}//»

//FUNCS«
function path_to_const(path) {
	return path.replace(/^\/+/, "").replace(/\//g, "__");
}
//»

}//»

//FUNCS«

//Util«

/*«
function get_US_cities(cb, num) {//«
	var name = "US__state_city";
	Desk.xget('/static/online/data/'+name+'.gz', function(ret) {
		if (ret) {
			var obj = JSON.parse(ret);
			loc_us = obj;
			info("US loc data installed");
			save_cb("data", {'STR': ret, 'NAME': name});
			cb(true);
log(loc_us);
		}
	});
}//»
function get_data(which, cb, num) {//«
	if (which == "US__state_city") {
		get_US_cities(cb, num);
	}
	else {
		log("\n\nNO DATA: " + which + "\n\n");
		cb();
	}
}
this.get_data = get_data;
//»
function load_data(which, obj) {//«
	if (which == "US__state_city") {
		loc_us = obj;
		info("US loc data loaded");
log(loc_us);
	}
}
this.load_data = load_data;
//»
»*/

this.clear_universe = function() {//«
//	cur_names = sys_names;
	cur_names = [];
	cur_objs = {};
	adj_index = {};
	nametok_index = {};
	class_index = [];
	cur_male = "";
	cur_fem = "";
	cur_self = "";
	cur_other = "";
	cur_neut = "";
	cur_grp = "";
}//»

function new_objnum() {//«
	obj_iter++;
	UNIENV['OBJ_ITER'] = obj_iter;
	svuni();
	return obj_iter;
}//»

function svbatch(cb) {//«
log("SVBATCH");
	var keys = getkeys(save_objs);
	var iter = -1;
	function dosave() {//«
		iter++;
		if (iter == keys.length) {
log("DONE SVBATCH");
			cb();
			return;
		}
		var key = keys[iter];
		if (key == "UNIENV") save_cb("unienv", null, dosave);
		else {
//log("KEY");
//log(key);
			var val = save_objs[key];
			var arr = key.split("/");
			var id = arr.pop();
			var path = arr.join("/");
			if (val && path && id && id.match(/^[0-9]+$/)) save_cb("obj", {'PATH': path, 'DATA': val, 'ID': id}, dosave);
			else {
log("\nWHAT KIND OF KEY/VAL IN SVBATCH()???");
log("KEY:");
log(key);
log("VAL:");
log(val);
log("\n");
				dosave();
			}
		}
	}//»
	dosave();
}//»

function svobj(sub) {//«
//	var sub = objarg.SUB;

	var path = sub.CLASS.constructor.name.replace(/__/g,"/");
	var id = sub.ID;

	var dat = sub.DATA;

	if (!dat) dat = {};
	if (batch_mode) {
		var fullpath = path + "/" + id;
log("SAVE OBJ LATER: " + fullpath);	
		save_objs[fullpath] = dat;
	}
	else save_cb("obj", {'PATH': path, 'DATA': dat, 'ID': id});
}//»
function svuni() {//«
	if (batch_mode) {
log("SAVE UNI LATER");
		save_objs["UNIENV"] = true;
	}
	else save_cb("unienv");
}//»
function svidx(which) {//«
	var str = "";
	var useidx,usestr;
	if (which == "adj") {useidx = adj_index;usestr="ADJ";}
	else if (which == "nametok") {useidx = nametok_index;usestr="NAMETOK";}
	else {
		err("Bad index in svidx(): " + which);
		return;
	}
	str = JSON.stringify(useidx, function(k,v) {
		if (k == "obj") return undefined;
		return v;
	});
	UNIENV[usestr+"IDX"] = str;
	svuni();
}//»

function desc2sub(desc, cb) {//«
/*«
Given a descriptor like Thing__Person__Boy#9, look it up in the classobj cache first,
and goto the universe appdata (filesystem) for the data next

Say we have a desc in a cache (name/adj), but no matching sub... we need to
go to the file sys
»*/
//log("DESCIN: " + desc);
	var arr = desc.split("#");
//log(arr);
//	var cname = arr[0];
	var cname;
	if (arr[0].match(/^[0-9]+$/)) cname = class_index[parseInt(arr[0])];
	else cname = arr[0];
//log(cname);
	var num = arr[1];
	var clobj;
	var clobj = schema.getclassobj(cname);
	if (!clobj) clobj = schema.mkclassobj(cname);
	var sub = schema.getinstancebyid(cname, num);
	if (sub) {cb(sub);return;}
	var path = APPENV['CURUNI']+'/'+cname.replace(/__/g, "/");
	Desk.get_appdata(topwin, num+"", function(subret) {
		if (subret) {
			var obj = JSON.parse(subret);
			var scobj = schema.getscobj(cname);
			var newobj = clobj["new"](num, scobj, obj);
//{"CLASS": _self, "ID": useid, "DATA": datarg, "TREE": scobjarg};
			cb(newobj);
		}
		else {
			err("Could not find object: ["+desc+"] !!!");
		}
	}, path);
}//»
function sub2desc(sub, if_simple) {//«
	var cname = sub.CLASS.constructor.name;
	var pos = class_index.indexOf(cname);
	if (pos == -1) {
		pos = class_index.length;
		class_index.push(cname);
		UNIENV['CLASSIDX'] = JSON.stringify(class_index);
		svuni();
	}
	if (if_simple) return pos+"#"+sub.ID;
	return  cname + "#"+ sub.ID;
}//»

function set_cur_type(sub) {//«
//	if (!sub.TREE) return;
	if (sub.TREE) {
		var gen = sub.TREE.g;
		if (gen=="f") cur_fem = sub;
		else if (gen=="m") cur_male = sub;
		else cur_neut = sub;
	}
//	else if (sub.DENNIS) cur_male = sub;
//	else if (sub.OTHER) cur_male = sub;
}//»
function name_from_sub(sub, num) {//«
//log(sub);
	if (!sub.DATA.NAME) return null;
	var name = sub.DATA.NAME;
	var len = name.length;
	if (!len) return null;
	if (name) {
		var first = name[0].firstup();
		if (len == 1 || num == 1) return first;
		else if (len >= 2) {
			var last = name[name.length-1].firstup();
			if (len == 2 || num == 2) return first + " " + last;
			else if (len > 2){
				var mid = name[1].firstup();
				return first+" "+mid+" "+last;
			}
		}
	}
	return null;
}//»
function adj_from_sub(sub) {//«
	var adjs = sub.DATA.ADJS;
	if (adjs) return adjs[0];
	return "";
}//»

function art_for_type(type) {//«
	if (type.match(/^[aeiouAEIUO]/)) return "an";
	return "a";
}//»
function sub_to_str(sub) {//«
	if (sub.CLASS) {
		return ctype_to_str(sub.CLASS.constructor.name);
	}
}//»
function ctype_to_str(str) {//«
	return type_to_str(str.split("__").pop());
}//»
function type_to_str(typearg) {//«
	return typearg.toLowerCase().replace(/_/g, " ");
}//»

function err(str) {//«
	is_error = true;
	errcb(str);
}//»

//Bertie specific«
function alloff() {//«
	if (is_termenv) return;
	thinkoff_cb();
	spwordoff_cb();
}//»
function tryimgthink(sub) {//«
	var img = sub.DATA.IMG;
	if (img) {
		var marr;
		if (marr = img.match(/\.(png|jpg|webp|gif)$/i)) {
			img.replace(/\.[a-z]+$/i, "");
			thimg(img, marr[1]);
		}
		else {
			thimg(img);
		}
	}
}//»
function thimg(which, ext) {//«
	if (is_termenv) return;
//«

if (!ext) ext = "webp";
var img = make('img');
var name = which+"."+ext;
img.src = "/static/online/img/"+name;
img.onerror = function() {
	err("Could not load: " + name);
}
img.onload = function() {
	this.isimg = true;
	thinkon_cb(this);
}

//»
}//»
function thques() {//«
	if (is_termenv) return;
	thinkon_cb(null, "QUES");
}//»
function spk(arr_or_str, cb, if_stayon, use_timer) {//«
	if (is_termenv) return;
	if (!use_timer) use_timer = 500;
	setTimeout(function() {
		speak_cb(arr_or_str, cb, if_stayon);
	}, use_timer);
}//»
//»

//»

function regen_cache(which, cb) {//«

	var cache;
	if (which == "adj") usecache = adj_index;
	else if (which == "nametok") usecache = nametok_index;
	else return;

	var cacheiter = -1;
	var cachekeys = getkeys(usecache);
	function do_cache() {//«
		cacheiter++;
		if (cacheiter >= cachekeys.length) {
			if (cb) cb(); return;
		}
		var cache = usecache[cachekeys[cacheiter]];
		var iter = -1;
		function do_sub() {//«
			iter++;
			if (iter >= cache.length) {do_cache();return;}
			var obj = cache[iter];
			var desc = obj.d;
			desc2sub(obj.d, function(subret) {
				if (!subret) {
log("\n\nERROR: NO SUB FOUND IN REGEN CACHE: "+which + ": " + obj.d + "!!!\n\n");
				}
				else {
					obj.obj = subret;
					do_sub();
				}
			});
		}//»
		do_sub();
	}//»
	do_cache();

}//»

function handle_batch(arr, cb) {//«
	batch_mode = true;
	save_objs = {};
	var iter = -1;
	function dostr() {
		iter++;
		if (iter == arr.length){
			batch_mode = false;
			svbatch(function(){cb(true);});
//			cb(true);
			return;
		}
		var str = arr[iter];
		if (typeof str == "object") {
			if (str.TXT) handle_text(str, dostr);
			else if (str.COM) handle_command(str.COM, dostr);
		}
		else if (typeof str == "string") handle_text({TXT: str}, dostr, true);
	}
	dostr();
}
this.handle_batch = handle_batch;
//»
function handle_text(obj, cb, if_nospeak) {//«
	is_error = false;
	simple_parse(obj['TXT'], ret=>{
		if (is_termenv || if_nospeak || !ret) {
			if (cb) cb(ret);
		}
		else {
			speak_cb(ret, cb);
		}
	});
}
this.handle_text = handle_text;

//»
function handle_command(str, cb) {//«
	function sendout() {//«
		if (out) {
			log("\n<===============     COMMAND OUTPUT     ===============>\n\n");
			log(out);
			log("<===============       OUTPUT END       ===============>\n");
			if (cb) cb(true);
		}
		else {
			log("??????????????????????");
			if (cb) cb();
		}
	}//»
	function log(strarg) {//«
		console.log(strarg);
	}//»

	var arr = str.split(" ");

	var ret;
	var com = arr.shift();
log("\nCOMMAND IN: <<< " + com + " >>>");
	var out = "";
	var arg1=arr.shift(),arg2,arg3,arg4;
	if (com.match(/^[0-9]+$/)) {
		var comarrs = {
			"0": [//«
				"load y combinator"
//				"there is a boy named joe",
//				"he is wild"
			],//»
			"1": [//«
		        "there is a smart man named paul graham", 
        		"he is rich", 
        		"there is a cool man named sam altman",
				{COM: "setimg paulg paul"}, 
				{COM: "setimg sama sam"}
    		],//»
			"2": ["you are bertie"],
//			"2": ["you are bertie","who are you"]
			"3": ["who are you"]
		}
		var comarr = comarrs[com];
		if (comarr) handle_batch(comarr, cb) ;
		else cb();
	}
	else if (com == "setimg") {//«
		var url = arg1;
		var name = arr.join(" ");
		simple_parse(name, null, function(subret) {
			if (url && subret && subret.DATA && subret.DATA[0] && subret.DATA[0].SUB) {
				var sub = subret.DATA[0].SUB;
				sub.DATA.IMG = url;
				svobj(sub);
				if (cb) cb(true);
			}
		});
	}//»
	else if (com == "dump") {//«
		ret = tag_input(null, true);
		var tags = ret[0];
		var obj = ret[1];
		if (arg1 == "all") {
			for (var i=0; i < tags.length; i++) {
				var tag = tags[i];
				out += tag+" := " + obj[tag].join(" | ")+"\n\n";
			}
		}
		else if (arg1 == "tags") {
			out += "TAGS := " + tags.join(" | ") + "\n\n";
		}
		else if (arg1) {
			var uparg = arg1.toUpperCase();
			var usearr = obj[uparg];
			if (usearr) {
				out+= uparg + " := " + usearr.join(" | ") + "\n\n";
			}
		}
		sendout();
	}//»

}
this.handle_command = handle_command;
//»

//MOD«
function mod_sub(sub, op, type, val, if_save) {//«
	var dat = sub.DATA;
	if (type == "name") {//«
		if (op == "add") {
			var gotname = dat['NAME'];
			if (!gotname) {
				var uniq = val.slice().sort().uniq();
				for (var i=0; i < uniq.length; i++) {
					var tok = uniq[i];
					if (!nametok_index[tok]) nametok_index[tok] = [];
					nametok_index[tok].push({d:sub2desc(sub,true), obj:sub});
				}
				cur_names = cur_names.concat(val).sort().uniq();
				UNIENV['NAMES'] = cur_names;
				svidx("nametok");
				dat['NAME'] = val;
				if (if_save) svobj(sub);
				return false;
			}
			else {
				for (var i=0; i < val.length; i++) {
					if (!gotname.has(val[i])) return null;
				}
				return true;
			}
		}
	}//»
	else if (type == "adj") {//«
		if (op == "add") {
			if (!dat['ADJS']) {
				adjs = [];
				dat['ADJS'] = adjs;
			}
			else adjs = dat['ADJS'] ;
			if (adjs.has(val)) {
				return true;
			}
			else {
				var notval = null;

				var is_male = false;
				if (val == "male") {notval = "female";is_male=true;}
				else if (val == "female") {notval = "male";}
				if (notval) {
					if (adjs.has(notval)) return null;
					if (is_male) cur_male = sub;
					else cur_fem = sub;
				}

				adjs.push(val);
				if (!adj_index[val]) adj_index[val] = [];
				adj_index[val].push({d:sub2desc(sub,true),obj:sub});
				svidx("adj");
				if (if_save) svobj(sub);
				return false;
			}
		}
		else err("Unknown op in adj mod_sub(): "+op);
	}//»
	else err("Unknown type in mod_sub(): "+type);
	
}//»
//»
//QUERY«
function resolve_query(qtype, subarg, vrbarg, is_like, cb) {//«
//log(subarg);
	var subtype = subarg.TYPE;

	if (subarg.SUB && subarg.SUB.SUB) subarg = subarg.SUB;
	
	var resp = null;
	var db = null;

	var sub = subarg.SUB;
//	var is_virtual = sub.DENNIS || sub.OTHER || sub.SELF;
	var is_virtual = sub.SELF || sub.OTHER;

	var noget = false;
	
	var ctype, art, adj;
	if (sub) {
//log(subarg);
//log(subtype);
		set_cur_type(sub);
		if (!is_virtual) {
			ctype = sub_to_str(sub);
			art = art_for_type(ctype);
		}
		if (qtype == "who") {

/*«
			if (sub.DENNIS) {
				if (subtype == "NAMETOK") resp = "My creator.";
				else resp = "Dennis Kane.";
				thme();
			}
			else if (sub.SELF) resp = "I don't know!";
			else if (sub.OTHER) {
				if (subtype == "NAMETOK") resp = "The same.";
				else resp = "Bertie Wooster.";
			}
»*/
			if (sub.SELF || sub.OTHER) {
err("Not handling SELF/OTHER refs: #1");
			}
			else if (subtype == "NAMETOK") {
				adj = adj_from_sub(sub);
				resp = art.firstup() + " " + adj + " " + ctype+".";
				tryimgthink(sub);
			}
			else if (subtype == "CLASS" || subtype == "PRO") {
				var name = name_from_sub(sub,1);
				if (name) {
					resp = name+".";
					tryimgthink(sub);
				}
				else db = "No name found for object: " + sub2desc(sub);
			}
			else {
//log(subarg);
				err("Unhandled class in resolve_query() #1");
			}
		}
		else if (qtype == "what") {
/*«
			if (sub.DENNIS) {
				resp = "My creator.";
				thme();
			}
			else if (sub.SELF) resp = "I don't know!";
			else if (sub.OTHER) resp = "A handsome man!";
»*/
			if (sub.SELF) {
err("Not handling SELF refs: #2");
			}
			else if (is_like) {
//log("GOT LIKE");
//log(subarg);
				var dat = sub.DATA;
				if (sub.DATA && sub.DATA.ADJS && sub.DATA.ADJS.length) {
					var adjs = sub.DATA.ADJS;
					adjs[0] = adjs[0].firstup();
					if (adjs.length > 1) {
						adjs.splice(adjs.length-1, 0, "and");
						resp = adjs.join(" ");
					}
					else resp = adjs[0]
					resp += "."
				}
			}
			else if (subtype == "NAMETOK" || subtype == "PRO") {
				resp = art.firstup() + " " + ctype+".";
				tryimgthink(sub);
			}
			else if (subtype == "CLASS") {
				var subtree = sub.TREE;
				if (subtree && subtree.p && subtree.p.i) resp = "A type of " + subtree.p.i.replace(/_/g," ").toLowerCase()+".";
				else err("No subtree.p.i found with: " + sub.CLASS.constructor.name);
			}
			else {
log(subarg);
				err("Unhandled class in resolve_query() #2");
			}
		}
		else db = "Not [currently] handling query type: " + qtype;
	}
	else db="No subject found in resolve_query()";

	cb(resp,db);
}//»
//»
//ACK«
function do_ack(ack, sub, cb) {//«

	var atok = ack.TOK;
	var ishi = false;
	if (atok.match(/^h/) || atok=="yo") ishi=true;

	var isbert = false;
	if (!sub || sub.SUB.OTHER) isbert = true;

	if (isbert) {
		if (ishi) cb("Greetings!");
		else cb("So long!");
	}
	else cb();
}//»
//»
//PARSE«

function tag_input(arr, if_get_toks) {//«
	var toks = {//«
		"ADJ": [//«
			"black", 
			"blue", 
			"cool",
			"crazy",
			"dumb", 
			"evil",
			"female", 
			"funny", 
			"good", 
			"gray", 
			"green", 
			"male", 
			"orange", 
			"purple", 
			"red", 
			"rich",
			"sexy",
			"short", 
			"smart", 
			"stupid", 
			"tall", 
			"white",
			"wild",
			"yellow"
		],//»
		"PRO": ["we", "he", "she", "it", "i", "me", "myself", "you", "her", "him", "they", "that", "those", "these"],
		"CNJ": ["and", "or"],
		"ART": ["a", "an", "the"],
		"PNT": ["there", "that", "this"],
		"IS": ["is", "am", "exists", "are"],
		"PREP": ["in", "on", "around", "atop", "against", "to", "from", "at"],
		"QUER": ["who", "what", "where", "when", "why"],
		"NAMED": ["named", "called"],
		"ACK": ["yo", "hello", "hi", "bye", "goodbye"],
		"LIKE": ['like'],
		"NAMETOK": cur_names,
		"COM": ["load", "initialize", "init"]
	};//»
//	var tags = ["PRO", "NOUN", "CNJ", "ART", "PNT", "IS", "ADJ", "PREP", "QUER", "NAMED"];


//I am = I'm	you are = you're	she is = she's	it is = it's
//do not = don't	she would = she'd	he would have = he would've
//let us = let's	who is = who's	she will = she'll	they had = they'd

	var apos_lets = ["m","re","s","t","d","ve","ll"];

	var tags = ["ACK", "LIKE", "PRO", "CNJ", "ART", "PNT", "IS", "ADJ", "PREP", "QUER", "NAMED", "NAMETOK", "COM"];
	if (if_get_toks) return [tags, toks];
	var all_tags = [];
	var is_com = false;
	for (var i=0; i < arr.length; i++) {
		var tok = arr[i];

/*«
		var aposarr = arr[i].split("'");
		if (aposarr.length > 2) {
log(aposarr);
			throw new Error("Apostrophe array > 2");
		}
		var tok = aposarr[0];
		var gotap = null;
		if (aposarr[1]) gotap = aposarr[1];
		if (gotap) {
			if (!apos_lets.has(gotap)) throw new Error("Unknown apostrophe letter: " + gotap);

//I: 			I'm 		I'd 		I've
//You:		  	you're		you'd		you've
//he/she		he's		he'd
//it:			it's
			var newchar;
			var goterr;
			if (tok == "i") {
				if (gotap == "m") newchar="am";
				else if (gotap == "d") newchar="would";
				else if (gotap == "ve") newchar="have";
				else goterr = arr[i];
			}
			else if (tok == "you") {
				if (gotap == "re") newchar="are";
				else if (gotap == "d") newchar="would";
				else if (gotap == "ve") newchar="have";
				else goterr = arr[i];
			}
			else if (tok == "he" || tok == "she") {
				if (gotap == "s") newchar="is";
				else if (gotap == "d") newchar="would";
				else goterr = arr[i];
			}

			else if (tok == "it" || tok == "there" || tok == "that") {
				if (gotap == "s") newchar="is";
				else goterr = arr[i];
			}

			if (goterr) throw new Error("Unknown apostrophe pronoun usage: " + goterr);

			if (newchar) arr.splice(i+1, 0, newchar);
		}
»*/
		
		var captok = tok.firstup();
//charAt(0).toUpperCase()+tok.substring(1);
		var obj = {'TOK': tok};
//		if (gotap) obj['APOS'] = gotap;
		if (typeof(tok) == "string" && tok.match(/^[a-z]+/)) {
			var tag_arr = [];
			if (sctokobj[captok]) tag_arr.push("TOK");
			for (var j=0; j < tags.length; j++) {
				var tag = tags[j];
				if (toks[tag].indexOf(tok) != -1) tag_arr.push(tag);

			}
			if (!tag_arr.length) tag_arr.push("UNK");
			obj['TAGS'] = tag_arr;
			all_tags[i] = obj;
		}
		else all_tags[i] = tok;
	}
	return all_tags;
}//»
function tag_splitter(arr) {//«
	var all = [];
	for (var i=0; i < arr.length; i++) {
		var all_len = all.length;
		var tags = arr[i]['TAGS'];
		var new_all = [];
		for (var j=0, total=0; j < tags.length; j++) {
			var word = tags[j];
			if (i==0) all[j] = word;
			else {
				for (var k=0; k < all_len; k++,total++) new_all[total] = all[k] + " " + word;
			}
		}
		if (i > 0) all = new_all;
	}
	var good = [];
	for (var i=0; i < all.length; i++) {
		var tags = all[i].split(" ");
		var new_arr = [];
		for (var j=0; j < arr.length; j++) {
//			new_arr[j] = {'TOK': arr[j]['TOK'], 'APOS': arr[j]['APOS'], 'TAG': tags[j]};
			new_arr[j] = {'TOK': arr[j]['TOK'], 'TAG': tags[j]};
			if (arr[j]['APOS']) new_arr[j]['APOS'] = arr[i]['APOS'];
			if (arr[j]['OBJS']) new_arr[j]['OBJS'] = arr[j]['OBJS'];
		}
		good.push(new_arr);
	}
	var gotcom = false;
	for (var i=0; i < good.length; i++) {
		var arr = good[i];
		for (var j=0; j < arr.length; j++) {
			if (j == 0 && arr[j].TAG == "COM") {
				if (gotcom) {
log("GOTCOM!!!");
					good.splice(i, 1);
					i--;
					break;
				}
				else {				
					gotcom = true;
					var args = [];
					while (arr.length > 1) {
						var arg = arr.pop();
						args.unshift(arg.TOK);
					}
					arr[0].ARGS = args;				
				}
			}
		}
	}
	return good;
}//»
function class_subs(all_arr) {//«
function get_class(arr_arg) {//«
/*«

We have an array of toks like:
["Blah", "Yeet", "Nooger"]
so that we can see if it can build up to a specific classpath name (classname).

The best thing is that the tokens are the same and in the same order as the
the classname, so that "Blah_Yeet_Nooger" is the key to an object array in scobjs.
sctokobj consist of tokens that point to an array of classpath objs.  We need
to see how many of these objs are at play, and if there are different objs,
we need to see if we can delete, add, or substitute specific toks in order to
return a single classpath.  This is where we can use an ENV var that includes
recent classpath hits, or just general categories. Each specific classpath obj
can include an array of numbers that represent to the relevant categories.

We can have a "c" field (along with i,x,a) that is an array of general categories 
that relate to our user.


Each tok points to an array of classpath objects.


The goal is to construct a token in the form of "The_Tok_String", that is a key 
in scobjs.  If it forms a key in a way that passes the strictness parameter,
then we put that class into gotclass, and then ship it along to see if we can
form a statement, and use the class by way of 
1) generating the classobj (if it doesn't exist)
2) generating an instance (if there is an instantiation)
3) using an existing class or instance

»*/

	var gotclasses = null;

/*
Each position in class_arr is an array of classpaths that use the given tok
As a first iteration, we can strip out all unique classpaths, and see if any of
them occur at every position.
*/

	var path_arr = [];
	var all_arr = [];
	for (var i=0; i < arr_arg.length; i++) {
		var arr = sctokobj[arr_arg[i]];
		all_arr.push(arr);
		for (var j=0; j < arr.length; j++) {
			path_arr.push(arr[j].PATH);
		}
	}
	path_arr = path_arr.uniq();
/*
If any of the elements in path_arr occur in all of the elements in all_arr, then that
is the one to go with.
*/
	var allgood = [];
	for (var i=0; i < path_arr.length; i++) {
		var pstr = path_arr[i];
		var nohit = false;
		for (var j=0; j < all_arr.length; j++) {
			var arr = all_arr[j];
			var gothit = null;
			for (var k=0; k < arr.length; k++) {
				if (pstr == arr[k].PATH) {
					gothit = true;
					break;
				}
			}
			if (!gothit) nohit = true;
		}
		if (!nohit) allgood.push(pstr);
	}

/*

Now we have an array of tokens and paths.
If there is a one-to-one correspondence between concatenated arr_arg sequence,
and a single path in allgood, then that is the perfect match.

*/

	var goodlen = allgood.length;
	var arg_str = arr_arg.join("_");
	var exact_hits = [];
	for (var i=0; i < goodlen; i++) {
		var goodpath = allgood[i];
		var goodname = goodpath.split("/").pop();
		if (arg_str == goodname) {
			exact_hits = exact_hits.concat(scobjs[goodname]);
		}
	}

	if (exact_hits.length) gotclasses = exact_hits;
	else {
log("\nNO EXACT HITS... NEED TO DO MORE ANALYSIS ON:");
log(arr_arg);
	}

	return {"TAG":"CLASS", "CLASSES": gotclasses, "TOK": arg_str};
}//»
	for (var i=0; i < all_arr.length; i++) {
		var arr = all_arr[i];
		var oarr, gotclass, apos;
		for (var j=0; j < arr.length; j++) {
			var objj = arr[j];
			if (objj.TAG == "TOK") {
				oarr = [objj.TOK.firstup()];
				apos = objj['APOS'];
				var start=j;
				if (apos) {
					if (apos != "s") throw new Error("Unknown apostrophe character: " + apos);
				}
				else {
					for (var k=j+1;;k++) {
						var objk = arr[k];
						if (objk && objk.TAG == "TOK") {
							apos = objk['APOS'];
							oarr.push(objk.TOK.firstup());
							if (apos) {
								if (apos != "s") throw new Error("Unknown apostrophe character: " + apos);
							}
							j++;
						}
						else break;
					}
				}
				gotclass = get_class(oarr);
				if (apos) gotclass['APOS'] = apos;
				arr.splice(start, j-start+1, gotclass);
			}
		}
	}
	return all_arr;
}//»
function group_subs(all) {//«
	var tag, tag1, tag2, obj, arttok, indef;
	for (var i=0; i < all.length; i++) {
		var arr = all[i];
		for (var j=0; j < arr.length; j++) {
			tag = arr[j]['TAG'];
			if (tag == "PRO") {//«
				obj = {
						'TAG': 'SUB', 
						'DATA': [arr[j]], 
						'TYPE': "PRO"
					  };
				arr[j] = obj;
			}//»
			else if (tag == "ART") {//«
				arttok = arr[j].TOK;
				if (arr[j+1]) {
					tag1 = arr[j+1]['TAG'];
					if (arttok.match(/^an?$/)) indef = true;
					else indef = false;
					if (tag1 == "CLASS") {//«
						obj = 	{
									'INDEF': indef, 
									'CLASS': arr[j+1].TOK, 
									'TAG': "SUB", 
									'DATA' :[arr[j], arr[j+1]], 
									'TYPE': "CLASS"
								};
						arr[j] = obj;
						arr.splice(j+1, 1);
					}//»
					else if (tag1 == "ADJ" && arr[j+2]) {//«
						tag2 = arr[j+2]['TAG'];
						if (tag2 == "CLASS") {
							arr[j+2]['ADJ'] = arr[j+1].TOK;
							obj = 	{
										'INDEF': indef, 
										'CLASS': arr[j+2].TOK, 
										'TAG': "SUB", 
										'DATA': [arr[j], arr[j+2]], 
										'TYPE': "CLASS",
										'ADJ': arr[j+1].TOK
									};
							arr[j] = obj;
							arr.splice(j+1, 2);
						}
					}//»
				}
			}//»
		}
	}
	return all;
}//»
function group_names(all) {//«
//Here we can do a MAX_NAMES_AFTER_NAMES var
//Also, certain words that cannot be names like "who" and "and"

	var tag,name;
	for (var i=0; i < all.length; i++) {
		var arr = all[i];
		for (var j=0; j < arr.length; j++) {
			tag = arr[j]['TAG'];
			if (tag == "NAMED") {
				name = [];
				for (var k=j+1; k < arr.length;) {
					name.push(arr[k]);
					arr.splice(k,1);
				}
				arr[j+1] = {'TAG':"NAME", 'NAME': name}
			}
		}
		var apos;
		for (var j=0; j < arr.length; j++) {
			tag = arr[j].TAG;

			if (tag == "NAMETOK") {
				name = [];
				for (var k=j; arr[k] && arr[k].TAG == "NAMETOK";) {
					apos = arr[k].APOS;
					name.push(arr[k]);
					arr.splice(k,1);
					if (apos) {
						if (apos != "s") throw new Error("Unknown apostrophe in group_names:"+ apos);
						else break;
					}
				}
				arr.splice(j, 0, {'TAG':"SUB", 'DATA': name, 'TYPE': "NAMETOK", 'APOS': apos});
			}
		}
	}
	return all;
}//»
function prep_phrase(all) {//«
	for (var i=0; i < all.length; i++) {
		var line = all[i];
		for (var j=0; j < line.length; j++) {
			var tokj = line[j];
			var tokj1 = line[j+1];
			if (tokj.TAG == "PREP" && tokj1)  {
				if (tokj1.TAG == "SUB") {
					var obj = {
						'TAG': "PREPPHR", 
						'DATA' :[tokj.TOK, tokj1]
					};
					line[j] = obj;
					line.splice(j+1, 1);
				}
				else if (tokj1.TAG == "UNK") {
					var namearr = [];
					for (var k=j+1; line[k] && line[k].TAG == "UNK"; k++) namearr.push(line[k].TOK);
					var obj = {
						'TAG': "PREPPHR", 
						'DATA' :[tokj.TOK, namearr]
					};
					line[j] = obj;
					line.splice(j+1, namearr.length);
				}
			}
		}
	}
	return all;
}//»
function filter_forms(all) {//«
	var valid_forms = ['COM', 'SUB', 'SUB-IS', 'ACK', 'SUB-ACK', 'ACK-SUB', 'SUB-IS-SUB', 'SUB-IS-ADJ', 'PNT-IS-SUB', 'PNT-IS-SUB-NAMED-NAME', 'QUER-IS-SUB', 'QUER-IS-SUB-LIKE', 'SUB-IS-NAMED-NAME'];
	var types = ['com', 'sub', 'sub-is', 'ack', 'sub-ack', 'ack-sub', 'sub-ident', 'adjmod', 'make', 'make-named', 'query', 'query-like', 'named'];
	var forms = [];
	for (var i=0; i < all.length; i++) {
		var line = all[i];
		var preps = [];
		for (var j=0; j < line.length; j++) {
			var tokj = line[j];

			if (tokj.TAG == "PREPPHR") {
				preps.push(tokj.DATA)
				line.splice(j, 1);
			}
			else if (tokj.TAG == "SUB") {
				var usesub;
				var posschain=null;
				if (tokj.APOS && line[j+1]) {
					if (line[j+1].TAG == "CLASS") {
						var prevsub = tokj;
						posschain = [];
						for (var k=j+1; k < line.length;k++) {
							var tokk = line[k];
							if (tokk.TAG == "CLASS") {
								posschain.push(prevsub);
								line.splice(k-1, 1);
								k--;
								if (!tokk.APOS) {
									usesub = tokk;
									break;
								}
							}
							else if (tokk.TAG == "ADJ") {
								usesub = prevsub;
								line.splice(k, 0, {'TAG': "IS", 'TOK': "is"});
								break;
							}
							prevsub = tokk;
						}
						line[j] = {'SUB': usesub, 'POSS': posschain};
					}
					else if (line[j+1].TAG == "ADJ") {
						usesub = tokj;
						line.splice(j+1, 0, {'TAG': "IS", 'TOK': "is"});
						j++;
					}
				}
			}
		}
		var str = "";
		if (line[0].TAG == "COM") forms[i] = {'SEQ': "COM", 'PREPS': []};
		else {
			for (var j=0; j < line.length; j++) {
				if (j==0) str = line[j]['TAG'];
				else str = str + "-" + line[j]['TAG'];
			}
			forms[i] = {'SEQ': str, 'PREPS': preps};
		}
	}
	var ret = [];
	var obj;
	var gotind,gotpreps;
	for (var i=0; i < forms.length; i++) {
		gotind = valid_forms.indexOf(forms[i].SEQ);
		gotpreps = forms[i].PREPS;
		if (gotind > -1) {
			var arr = all[i];
			var type = types[gotind];
			if (type == "make-named") {
				type = "make";
				var name = arr.pop();
				arr[2].DATA[1].NAME = name.NAME;
				arr.pop();
			}

			if (gotpreps.length) {
				if (type != "sub-is") continue;
			}
			else {
				if (type == "sub-is") continue;
			}

			info("Found valid statement form: [" + type + "]");

			ret.push({'TYPE': type, 'DATA': arr, 'PREPS': gotpreps});
		}
	}
	return ret;
}//»
function get_sub(arrarg, cb) {//«
//log("GETSUB");
	make_sub(arrarg, cb, true);
}//»
function get_obj_from_class(clobj, cb) {//«
	var instarr = clobj.getinstances();
	if (instarr && instarr.length == 1) {
		var inst = clobj.getinstance(instarr[0]);
		if (inst){cb(inst, "CLASS");return;}
	}
	cb(clobj,"CLASS");
}//»
function make_sub(arrarg, cb, ifget) {//«
	var obj0 = arrarg[0];
	var tag0 = obj0.TAG;
	var tok0 = obj0.TOK;
	var obj1,tag1,tok1,adj=null,name=null;
	var classes,class0,clobj,clpath,scobj;
	var gotobj;

	if (tag0 == "ART") {//«
		var indef = false;
		if (tok0.match(/^an?$/)) indef = true;
		if ( indef || (ifget && !indef) ) {
			obj1 = arrarg[1];
			if (obj1) {
				tag1=obj1.TAG;
				tok1=obj1.TOK;
				adj=obj1.ADJ;	
				name=obj1.NAME;	
				if (tag1=="CLASS") {
					classes = obj1.CLASSES;
					if (classes.length == 1) {
						class0=classes[0];
						clobj=class0.CLOBJ;
						scobj=class0.OBJ;
						clpath=class0.PATH;
						if (!clobj) {
							clobj = schema.mkclassobj(clpath, tok1);
							class0.CLOBJ = clobj;
						}
						if (!clobj) {
							err('Could not generate a class object for token: '+tok1+'"');
							cb();
						}
						else {
							if (ifget) {
								if (adj) {
									if (indef) cb({'CLASS':clobj,'ADJ':adj,'INDEF':true, 'TREE': scobj},'CLASS');
									else {
										var cache = adj_index[adj];
										if (!cache) cache = [];
										var allhits = [];
										for (var i=0; i < cache.length; i++) {
											var subi = cache[i].obj;
											if (clobj === subi.CLASS) allhits.push(subi);
										}
										if (allhits.length == 1) cb(allhits[0], "CLASS");
										else {
											if (allhits.length > 1) err('More than one hit for mod: "'+adj+'" and classname: "'+clobj.constructor.name+'"');
											else err('No hits for mod: "'+adj+'" and classname: "'+clobj.constructor.name+'"');
											cb();
										}

									}
								}
								else {
									if (indef) cb({'CLASS':clobj,'INDEF':true, 'TREE': scobj},'CLASS');
									else {
										gotobj = cur_objs[clpath];
										if (gotobj) cb(gotobj,"CLASS");
										else get_obj_from_class(clobj, cb);
									}
								}
							}
							else {
								var num = new_objnum();
								var newobj = clobj["new"](num, scobj);
								var gend = newobj.TREE.g;
								if (gend) {
									if (gend=="m") cur_male = newobj;
									else if (gend=="f") cur_fem = newobj;
								}
								else cur_neut = newobj;

								if (adj) mod_sub(newobj, "add", "adj", adj);
								if (name) {
									var name_arr=[];
									for (var i=0; i < name.length; i++) name_arr.push(name[i].TOK);
									mod_sub(newobj, "add", "name", name_arr);
								}
								cur_objs[clpath] = newobj;
//log(newobj);
								cb(newobj,"CLASS");
							}
						}
					}
					else {
						err('Not [currently] handling multiple class choices for token: "'+tok1+'"')
						cb();
					}
				}
				else {
					err("Expecting a CLASS tag after the article, found: " + tag1)
					cb();
				}
			}
			else {
				err("Expecting a CLASS type object after the article, nothing found!")
				cb();
			}
		}
		else {
			if (!ifget) err("Expecting article 'a' or 'an', got: " + tok0)
			else err("Expecting article 'the', got: " + tok0);
			cb();
		}
	}//»
	else if (tag0 == "PRO") {//«
//		"PRO": ["he", "she", "it", "i", "me", "you", "her", "him", "they", "that", "those", "these"],
//if ()
		if (tok0=="he"||tok0=="him") {
			if (cur_male) cb(cur_male,"PRO");
			else {
				err("Invalid male pronoun usage");
				cb();
			}
		}
		else if (tok0=="she"||tok0=="her") {
			if (cur_fem) cb(cur_fem,"PRO");
			else {
				err("Invalid female pronoun usage");
				cb();
			}
		}
		else if (tok0=="i"||tok0=="me"||tok0=="myself") {
			if (cur_self) {
				if (typeof cur_self == "string") {
					desc2sub(cur_self, function(selfret) {
						cur_self = selfret;
						cb(cur_self, "PRO");
					});
				}
				else cb(cur_self, "PRO");
			}
			else cb({'SELF': true},"PRO");
		}
		else if (tok0=="you") {
			if (cur_other) {
				if (typeof cur_other == "string") {
					desc2sub(cur_other, function(otherret) {
						cur_other = otherret;
						cb(cur_other, "PRO");
					});
				}
				else cb(cur_other, "PRO");
			}
			else cb({'OTHER': true},"PRO");
		}
		else if (tok0=="it") {
			if (cur_neut) cb(cur_neut,"PRO");
			else {
				err("Invalid gender neutral pronoun usage");
				cb();
			}
		}
		else {
			err("Only [currently] handling male/female pronouns!");
			cb();
		}
	}//»
	else if (tag0 == "NAMETOK") {//«
		var name = [];
		var namelen = arrarg.length;
		var tok;

//		var syshit = null;
//		var nosyshit = null;

//		var hitden = null;
//		var nohitden = null;
//		var hitbert = null;
//		var nohitbert = null;

		for (var i=0; i < arrarg.length; i++) {
			tok = arrarg[i].TOK;
//«			if (sys_names.has(tok)) {
//				syshit = true;
//				if (sys_name_dennis.has(tok)) {hitden=true;nohitbert=true;}
//				else if (sys_name_bertie.has(tok)) {nohitden=true;hitbert=true;}
//			}
//			else nosyshit = true; //»
			name.push(tok);
		}
		var cache_subs = [];

		for (var i=0; i < name.length; i++) {
			var arr = [];
			var ntarr = nametok_index[name[i]];
			if (ntarr) {
				for (var j=0; j < ntarr.length; j++) arr.push(ntarr[j].obj);
			}
			cache_subs.push(arr);
		}

		var cache0 = cache_subs[0];
		var found={};
		var notfound={};

		for (var i=0; i < cache0.length; i++) found[cache0[i].ID] = {HITS:1, OBJ: cache0[i]};

		for (var i=1; i < cache_subs.length; i++) {
			var cachei = cache_subs[i];
			for (var j=0; j < cache0.length; j++) {
				var isfound = null;
				var cache0j = cache0[j];
				var id = cache0j.ID;
				for (var k=0; k < cachei.length; k++) {
					if (cache0j === cachei[k]) {
						isfound = true;
						break;
					}
				}
				if (!isfound) {
					notfound[id] = true;
					delete found[id];
				}
				else {
					if (!notfound[id]) {
						found[id].HITS++;
					}
				}
			}
		}

		var foundkeys = getkeys(found);
		if (foundkeys.length == 1) {
			var obj = found[foundkeys[0]];
			if (obj.HITS == namelen) {
				info('Name match successful: ' + sub2desc(obj.OBJ) + ' == "'+name.join(' ')+'"');
				cb(obj.OBJ,"NAMETOK");
			}
			else {
				err("Not all names were found");
				cb();
			}
		}
		else if (foundkeys.length > 1){
			err("More than 1 hit for the name");
			cb();
		}
		else {
/*«
			if (syshit && !nosyshit) {
				if (hitden && !nohitden) {
					cb({'DENNIS': true},"NAMETOK");
				}
				else if (hitbert && !nohitbert) {
					cb({'OTHER': true},"NAMETOK");
				}
				else {
					err("No hits were found for the name");
					cb();
				}
			}
»*/
//			else {

			err("No hits were found for the name");
			cb();

//			}
		}

	}//»
	else {//«
		err("Expecting an initial ART/PRO/NAME type object, found: " + tok0 + "("+tag0+")")
		cb();
	}//»
}//»
function sub_subs(objarg, cb) {//«
	var type = objarg['TYPE'];
//log("TYPE: " + type);
	var arr = objarg['DATA'];
//log(arr);
	var iter = -1;
	function do_subs() {//«
		function handle_ret(ret, subtype) {
			arr[iter] = {'SUB': ret, 'DATA': obj['DATA'], 'TYPE': subtype};
			do_subs();
		}
		var sub;
		iter++;
		if (iter == arr.length) {
			objarg['DATA'] = arr;
			cb(objarg);
			return;
		}
		var obj=arr[iter];
		var tag = obj.TAG;
		var dat = obj.DATA;
		if (tag == "SUB") {
			if (type == "make") make_sub(dat, handle_ret);
			else get_sub(dat, handle_ret);
		} 
		else do_subs();
	}//»
	do_subs();
}//»
function ident_subs(sub1, sub2, vrb, cb) {//«
	function compare(s1,s2) {//«
		var cname, cname2, adj, adjs;
/*«
		if (s1 == "OTHER") {
			if (s2.INDEF) {
				cname = sub_to_str(s2); 
				if (cname == CUR_OTHER_CNAME) return true;
			}
		}
		else if (s1 == "DENNIS") {
			if (s2.INDEF) {
				cname = sub_to_str(s2); 
				if (cname == CUR_DENNIS_CNAME) return true;
			}
		}
»*/
//		else {
//			if (!s1.INDEF && s2.INDEF) {

		if (s1.CLASS === s2.CLASS) {
			adj = s2.ADJ;
			if (adj) {
				adjs = s1.DATA.ADJS;
				if (adjs && adjs.has(adj)) return true;
				return false;
			}
			return true;
		}

//			}
//		}
		return false;
	}//»

	var resp,db;

//if ()
	if (sub1.SUB.SUB) sub1 = sub1.SUB;
	if (sub2.SUB.SUB) sub2 = sub2.SUB;

	var self1 = sub1.SUB.SELF;
	var self2 = sub2.SUB.SELF;

	var other1 = sub1.SUB.OTHER;
	var other2 = sub2.SUB.OTHER;

//	var dennis1 = sub1.SUB.DENNIS;
//	var dennis2 = sub2.SUB.DENNIS;

//	var have_self = false;
//	if (self1 || self2) have_self = true;

//	var have_other = false;
//	if (other1 || other2) have_other = true;

//	var have_dennis = false;
//	if (dennis1 || dennis2) have_dennis = true;

//	var sub1_class=false;
//	if (self1 || other1){}
//	else sub1_class = true;
//	var sub1_class=true;

	var sub1_indef = sub1.SUB.INDEF;
//	if (sub1_class && sub1.SUB.INDEF) sub1_indef = true;

//	var sub2_class=false;
//	if (self2 || other2){}
//	else sub2_class = true;
//	var sub2_class=true;

	var sub2_indef = sub2.SUB.INDEF;
//	if (sub2_class && sub2.SUB.INDEF) sub2_indef = true;

	var retval;
/*«
	if (have_self && have_other) resp = "That's just silly!";
	else if (self1 && self2 || other1 && other2 || dennis1 && dennis2) {
		resp = "Things are obviously themselves!";
//		err("Circular reference");
	}
	else if (have_dennis) {
		if (dennis1) {
			if (sub2_indef) {
				if(compare("DENNIS", sub2.SUB)) resp = "Right ho!";
				if (!resp) resp = "Not so!";
			}
			else resp = "He would beg to differ.";
		}
	}
	else if (have_other) {
		if (other1) {
			if (sub2_indef) {
				if(compare("OTHER", sub2.SUB)) resp = "Of course!";
				if (!resp) resp = "I don't think so!";
			}
			else resp = "Quite impossible!";
		}
	}
	else if (have_self) {
		var gotsub = self1?sub2.SUB:sub1.SUB;
		cur_self = gotsub;
		var fulldesc = sub2desc(gotsub);
		info("The current self is set to object: " + fulldesc);
		UNIENV['CURSELF'] = JSON.stringify(sub2desc(gotsub,true));
		svuni();

		resp="And so you are!";
	}
»*/
	if (other1 || other2) {
		if (other1 && other2) {resp="Of course."}
		else if (!cur_other){
			if (other1) cur_other = sub2;
			else cur_other = sub1;
			resp = "Okay.";
//log(cur_other);

			UNIENV["CUROTHER"] = sub2desc(cur_other.SUB);
			svuni();

		}
		else err("Should not be here in ident_subs() 1erf");
		
	}
	else if (sub2_indef) {
		if (!sub1_indef) {
			if(compare(sub1.SUB, sub2.SUB)) resp="True.";
			else resp="False.";
		}
		else {
			if(compare(sub1.SUB, sub2.SUB)) resp="Affirmative.";
			else resp="Negative.";
		}
	}
	else {
//log("CHECK: " + sub1.SUB.ID + " == " + sub2.SUB.ID);
log(sub1);
log(sub2);
		if (sub1.SUB.ID == sub2.SUB.ID) resp = "Right.";
		else resp = "Wrong.";
	}
	cb(resp,db);

}//»
function handle_com(com, args, cb) {cb(null, "Handle command: " + com + " (" + args.join(",") +")");}
function evaluate_statement(objarg, cb) {//«
	var type = objarg['TYPE'];
	var arr = objarg['DATA'];
	var preps = objarg['PREPS'];

	var sub, ack, adj, adjs, cname, id, dat, art, type, desc,name,vrb;
	var resp="";
	var db="";
	var ret,emess;

if (type == "sub-is") {//«

log("\nSUB-IS");

sub = arr[0].SUB;
vrb = arr[1];
log(sub);
log(vrb.TOK);

if (preps.length == 1) {
var prp = preps[0];
var prptok = prp[0];
var prpobj = prp[1];

log("<<< " + prptok + " >>>");

if (typeof prpobj.length != "undefined")  {
Desk.jlog(prpobj);

if (prptok == "in" || prptok == "from") {

}
else err("Not handling UNK tokens without 'in' or 'from'");

}
else {
log(prpobj);
}

}
else {
err("Not handling > 1 prepositions");
//cb();
}

cb();
}//»
	else if (type == "sub") {//«
		tryimgthink(arr[0].SUB);
		cb();
	}//»
	else if (type == "com") {
		var com = arr[0];
		handle_com(com.TOK, com.ARGS, cb);
	}
	else if (type == "make") {//«
		sub = arr[2].SUB;
		desc = sub2desc(sub);

		dat = arr[2].DATA;
		art = dat[0].TOK;
		type = type_to_str(dat[1].TOK);

		resp = "Oh, "+ art + " " + type + "!";
		db = "Object: " +  desc + " has been instantiated";
		svobj(sub);
		set_cur_type(sub);
		cb(resp, db);
	}//»
	else if (type == "adjmod") {//«
		sub = arr[0].SUB;
		adj = arr[2].TOK;
		if (!sub) err("No subject found for mod: " + adj);
		else if (!sub.CLASS) {
			if (sub.comType) {
				resp="I do not know any "+type_to_str(sub.comType)+" types.";
				db="Nothing of type: " + sub.comType + " has been instantiated";
			}
			else err('Evaluate error: no sub.comType');
		}
		else {
			ret = mod_sub(sub, "add", "adj", adj);
			desc = sub2desc(sub);
			if (ret == null) {
				resp="I don't think so.";
				db='Mod: "'+adj+'" is a contradiction in object: ' + desc;
			}
			else if (ret==true) {
				resp="I know!";
				db='Mod: "'+adj+'" already exists in object: ' + desc;
			}
			else if (ret==false) {
				resp="Oh okay...";
				db='Mod: "'+adj+'" added to object: ' + desc;
				svobj(sub);
			}
			set_cur_type(sub);
		}
		cb(resp, db);
	}//»
	else if (type == "named") {//«
		sub = arr[0].SUB;
		name = arr[3].NAME;
		var name_arr=[];
		for (var i=0; i < name.length; i++) name_arr.push(name[i].TOK);
		ret = mod_sub(sub, "add", "name", name_arr);
		desc = sub2desc(sub);
		var usename = name_arr.join(" ")
		if (ret == true) {
			resp="Of course it is!";
			db='Name: "'+usename+'" already exists in object: ' + desc;
		}
		else if (ret == false) {
			resp="Nice name.";
			db='Name: "'+usename+'" added to object: ' + desc;
			svobj(sub);
		}
		else {
			resp="No way!";
			db='Name: "'+usename+'" conflicts with name: "' + sub.DATA.NAME.join(" ")+'"';
		}
		set_cur_type(sub);
		cb(resp, db);
	}//»

	else if (type == "query") {//«
		var qtype = arr[0].TOK;
		var sub = arr[2];
		resolve_query(arr[0].TOK, sub, arr[1], null, cb);
	}//»
	else if (type == "query-like") {//«
		var qtype = arr[0].TOK;
		var sub = arr[2];
		resolve_query(arr[0].TOK, sub, arr[1], true, cb);
	}//»
	else if (type == "sub-ident") {//«
		ident_subs(arr[0],arr[2],arr[1],cb);
	}//»
	else if (type.match(/\back\b/)) {//«
		if (type == "ack-sub") {ack=arr[0];sub = arr[1];}
		else if (type == "sub-ack") {ack=arr[1];sub = arr[0];}
		else {sub = null;ack=arr[0];}
		do_ack(ack, sub, cb);
	}//»
else {
err("NO TYPE: " + type);
}
}//»
function simple_parse(rawtxt, cb, sub_cb) {//«

//log("<================================================================================>");
	info("Brain Input  <<< " + rawtxt + " >>>");
	var arr = rawtxt.toLowerCase().split(/ +/);
	arr = tag_input(arr);	
	if (!is_error) arr = tag_splitter(arr);

//These are the different options...«
//for (var i=0; i < arr.length; i++) {
//log("");
//var str="";
//for (var j=0; j < arr[i].length; j++) str += arr[i][j].TOK + "." + arr[i][j].TAG + " ";
//	log("<<< "+str+ " >>>");
//}
//»

	if (!is_error) arr = class_subs(arr);
	if (!is_error) arr = group_subs(arr);
	if (!is_error) arr = group_names(arr)
	if (!is_error) arr = prep_phrase(arr)
	if (!is_error) arr = filter_forms(arr)
	var ret;

	if (is_error) thques();
	
	else if (arr.length == 1) {
		sub_subs(arr[0], subret=>{
			if (!is_error) {
				if (subret) {
					if (sub_cb) sub_cb(subret);
					else {
						evaluate_statement(subret, (stateret, dbret)=>{
							if (!is_error) {
								if (dbret) info(dbret);
								if (stateret) {
									info("Brain Response  <<< " + stateret + " >>>");
									cb(stateret);
								}
								else {
									warn("No Brain Response");
									thques();
									cb();
								}
							}
							else {thques();cb();}

						});
					}
				}
				else {
					if (sub_cb) sub_cb();
					else {
						thques();
						cb();
					}
				}
			}
			else {
				if (sub_cb) sub_cb();
				else {
					thques();
					cb();
				}
			}

//			else 

//{thques();cb();}
		});
	}
	else if (!arr.length) {
		thques();
		warn("There are no valid statement forms");
		cb();
	}
	else {
		thques();
		err("There were: " + arr.length + " valid statement forms");
		cb();
	}
	return arr;

}//»

//»

//»

//«
regen_cache("adj", function() {
	regen_cache("nametok", function() {
		if (!is_termenv) info("Done!");
	});
});
//»



