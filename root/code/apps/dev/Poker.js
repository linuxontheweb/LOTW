/*"Winner Takes All"«

Training for 2-10 players (ie single table)

Everything known about players is: fraction of total pot
Based on percentages of playing and betting amounts. we determine:

play_ratio
bet_ratio

A quautum is a Game, which is either true (won) or false (lost)

»*/
/*2 cards://«

===== For hole cards =====

*** 1 pair ***
1 2high
1 2gap
1 2suited
1 2series

*** 2 singles***
2 1high

= 6

6 total


====== For flop =====

*** 1 trip ***
1 3high
1 3gap
1 3suit
i 3series 

*** 3 pairs ***
3 2high
3 2gap
3 2suit
3 2series

*** 3 singles ***
3 1high

*** 1 hand ***
1 class

= 19

25 total


===== For turn =====

*** 1 quad ***
1 4high
1 4gap
1 4suit
1 4series

*** 3 trips ***
3 3high
3 3gap
3 3suit
3 3series 

*** 6 pairs ***
6 2high
6 2gap
6 2suit
6 2series

*** 4 singles ***
4 1high

*** 1 best hand ***
1 class


= 44

69 total

===== For river =====

*** 1 pent ***
1 5high
1 5gap
1 5suit
1 5series

*** 5 quad ***
5 4high
5 4gap
5 4suit
5 4series

*** 10 trips ***
10 3high
10 3gap
10 3suit
10 3series 

*** 10 pairs ***
10 2high
10 2gap
10 2suit
10 2series

*** 5 singles ***
5 1high

*** 1 best hand ***
1 class


109 total

178 total


Hand rank
How much of the rank is attributed to hole cards

//»*/
/*Turn: x6, River: x15«



6 total cards means try 6 combinatoins

-23456 1 
1-3456 2
12-456 3
123-56 4
1234-6 5
12345- 6




7 cards means 15 combinations:

--3456 12
-2-456 13
-23-56 14
-234-6 15
-2345- 16
1--456 23
1-3-56 24
1-34-6 25
1-345- 26
12--56 34
12-4-6 35
12-45- 36
123--6 45
123-5- 46
1234-- 56

»*/

const CHIPS=[ 40,50,60,10,25,36 ];


const APPNAME="Poker";

export const app = function(arg) {//«

//Imports«

const {Core, Main, NS}=arg;
const{log,cwarn,cerr,api:capi, globals, Desk}=Core;

Main.top.title=APPNAME;
const{fs,util}=globals;
const{make,mkdv,mk,mksp}=util;

const Win = Main.top;

//»

//Var«
let last_chips;
let last_player;
let last_button;
let current_bet = 0;

const SUITS=["Hearts","Clubs","Diamonds","Spades"];
//const SUITS_UNICODE = ["♥","♣","♦","♠"];
const SUITS_UNICODE = ["&#9829;","&#9827;","&#9830;","♠"];
const RANKS=[ "Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King","Ace" ];
const CLASS_NAMES=[ "Donk","Pair","TwoPair","Trips","Straight","Flush","FullHouse","Quads","StraightFlush" ];

const MIN_BET = 2;
const BIG_BLIND = 2;
const SMALL_BLIND = 1;

const DEF_CHIP_STACK = 20;

let cur_table;

//»

//DOM«
//Main.fs=21;
Main.bgcol="#09000a";
Main.fs=21;
Main.tcol="#ccc";
Main.dis="flex";
Main.style.justifyContent="space-around";
Main.style.alignItems="center";
Main.style.flexDirection="column";
//log(Main);
let playertab;
let tabdiv;
let infodiv;
let potdiv;
let cardsdiv;
let betdiv;
let rnddiv;

//»

//Funcs«

const new_table = () =>{//«
	last_chips = null;
	cur_table = new Table(6);
	for (let s of cur_table.seats) add_player(s);
	cur_table.start();
	cur_table.init_round();
};//»

const showdown = (all_pot, arr)=>{//«
if (all_pot < 0){
cerr("ALL POT < 0 ????!?!?!?", all_pot);
return;
}
	let p1;
try{
p1 = arr[0].player;
}catch(e){
cerr("CAUGHT ERROR IN SHOWDOWN!!!");
log(arr);
return;
}
	let cur_pot = all_pot;
	let is_final = !!p1.chips;

	if (!is_final) {
		cur_pot =  p1.tot_bet * arr.length;
		if (cur_pot > all_pot) {
			cur_pot = all_pot;
			is_final = true;
		}
	}
//if (cur_pot == all_pot) cwarn(`SHOWDOWN:  ${cur_pot}`);
//else cwarn(`SHOWDOWN:  ${cur_pot}  (${all_pot})`);
	let winners = evaluate(arr);
	let share = Math.floor(cur_pot/winners.length);
	for (let w of winners) w.player.chips += share;
	if (!is_final){
		while (arr[0]&&arr[0].player.tot_bet == p1.tot_bet) arr.shift();
		if (arr.length) showdown(all_pot-cur_pot, arr);
		else {
//cwarn("NO arr.length with all_pot-cur_pot ==", (all_pot - cur_pot));
			share = Math.floor((all_pot - cur_pot)/winners.length);
			for (let w of winners) w.player.chips += share;
		}
	}
};//»

const restart=()=>{//«
	Main.innerHTML="";
	make_dom();
	for (let s of cur_table.seats){
		add_player(s);
		s._setchips(s.chips);
	}
	cur_table.finalized = false;
	cur_table.start();
	cur_table.init_round();
};//»

const step = ()=>{//«

	if (cur_table.step()) return;

	if (cur_table.round_num===3){
		if (cur_table.finalized) return restart();
		cur_table.finalize();
		return;
	}

	if (last_player) last_player._act(true);
	cur_table.round_num++;
	cur_table.init_round();

}//»

const scan_to_cur = (cur) => {//«
	let seats = cur_table.seats;
	if (cur==seats.length) cur=0;
	let player = seats[cur];
if (!player){
cerr("!!!!!!!! NO PLAYER AT CUR="+cur + " (resetting to 0)  !!!!!!!!!");
cur = 0;
player = seats[0];
//cerr();
//log(seats);
//throw new Error("No player found at "+cur);
}
	if (player.folded || player.allin){
		let c = cur+1;
		if (c==seats.length) c=0;
		let gotplayer = seats[c];
		while (gotplayer.folded || gotplayer.allin){
			c++;
			if (c==seats.length) c=0;
			gotplayer = seats[c];
			if (gotplayer === player) return false;
		}
		player = gotplayer;
	}
	return player;
};//»

const make_dom = ()=>{//«


tabdiv = mkdv();

let infowrap = mkdv();
infowrap.w="100%";

infodiv = mkdv();
infodiv.dis="flex";
infodiv.style.flexDirection="row";
infodiv.style.justifyContent="space-around";
infodiv.style.alignItems="center";


playertab = make("table");
//log(playertab);
playertab.bor="1px solid #ccc";
playertab.style.borderCollapse="collapse";
playertab.w="600px";
playertab.fs=21;
playertab.cellPadding='3';
let row = mk("tr"); 
row.bor="1px solid #ccc";
row.ta="center";
let t1=mk("td");
t1.bor="1px solid #999";
t1.innerHTML="Player";
let t2=mk("td");
t2.innerHTML="Cards";
let t3=mk("td");
t3.innerHTML="Chips";
let t4=mk("td");
t4.innerHTML="Bet";
let t5=mk("td");
t5.innerHTML="Tot";
let t6=mk("td");
t6.innerHTML="All-In";

row.add(t1);
row.add(t2);
row.add(t4);
row.add(t5);
row.add(t3);
//row.add(t6);
playertab.add(row);
Main.add(tabdiv);
tabdiv.add(playertab);

Main.add(infowrap);
infowrap.add(infodiv);


rnddiv=mkdv();
//infodiv.add(rnddiv);
rnddiv.innerHTML="Round: -";
rnddiv.fs=24;
rnddiv.padl=10;

cardsdiv=mkdv();
infodiv.add(cardsdiv);
cardsdiv.innerHTML="\xa0";
cardsdiv.fs=24;
cardsdiv.padl=10;
cardsdiv.h=66;


let betwrap = mkdv();
betwrap.innerText="Bet";
betwrap.pos="absolute";
//betwrap.r=10;
//betwrap.b=5;
betwrap.fs=36;
betwrap.x=10;
betwrap.b=5;
betdiv=mkdv();
//betdiv.pos="absolute";
//betdiv.marr=10;
//betdiv.loc(0,0);
Main.add(betwrap);
betwrap.add(betdiv);
//infodiv.add(betdiv);
betdiv.innerHTML="?";
betdiv.fs=36;
//betdiv.padl=10;

let potwrap = mkdv();
potwrap.innerText="Pot";
potwrap.pos="absolute";
potwrap.r=10;
potwrap.b=5;
potwrap.fs=36;
potdiv=mkdv();
//potdiv.loc(0,0);
Main.add(potwrap);
potwrap.add(potdiv);
potdiv.innerHTML="0";
potdiv.fs=36;
//potdiv.padl=10;


}//»

const add_player=(player)=>{//«
let USEFS = 28;

let row = mk("tr"); 
row.fs = USEFS;
row.bor="1px solid #999";
row.ta="center";
row.h="66px";
let t1=mk("td");

t1.innerHTML=player.id;
t1.tcol="#ccc";
t1.bor="1px solid #999";

let t2=mk("td");
t2.innerHTML="\xa0";
let t3=mk("td");
t3.innerHTML=player.chips;
let t4=mk("td");
t4.innerHTML="\xa0";
let t5=mk("td");
t5.innerHTML="\xa0";
let t6=mk("td");
t6.innerHTML="\xa0";

row.add(t1);
row.add(t2);
row.add(t4);
row.add(t5);
row.add(t3);
//row.add(t6);
playertab.add(row);
player._act = (if_off)=>{
//return;
	if (if_off) {
		row.fw="";
		row.style.backgroundColor="";
		return;
	}
//log("ACTING",player.id);
	row.fw=900;
	row.style.backgroundColor="#000";
	if (last_player) last_player._act(true);
	last_player = player;
};
//player.off = ()=>{
//};
player._button=(if_off)=>{
	if (if_off){
		t1.tcol="#ccc";
		return;
	}
	if (last_button) last_button._act(true);
	t1.tcol="#fff";
	last_button = player;
};
player._setcards=(s)=>{
t2.innerHTML=s;
};
player._setchips=(s)=>{
t3.innerHTML=s;
};
player._setbet=(s)=>{
	t4.innerHTML=s;
	if (s > current_bet) {
		betdiv.innerHTML=s;
		current_bet = s;
	}
};
player._settot=(s)=>{
t5.innerHTML=s;
};
player._setallin=(if_unset)=>{
if (if_unset) {
t2.op=1;
t3.tcol="";
t3.fw="";
return;
}
//log(s);
t2.op=0.3;
t3.tcol="#555";
t3.fw=900;

};
player._setfold=(s)=>{
t2.innerHTML = "\xa0";
};

//log(player);
};//»

const INF_LOOP=()=>{throw new Error("Infinite loop detected!");};

const evaluate = (hands, if_test) =>{//«

//log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
let hi = -Infinity;
let arr=[];
let best;
for (let h of hands){
//log(h.toString());
	let cl = h.class;
	if (cl < hi) continue;
	if (cl > hi) {
		hi = cl;
		arr=[];
	}
	arr.push(h);
}

//log(hands);
if (!if_test && (arr.length == 1)) {
	arr[0].player.winner = true;
	return arr;
}
hands = arr;

//log(`TIE (${hands.length}) ${hands[0].className} `)
//let vals = [];

hi = -Infinity;

arr = [];
for (let i=0; i < hands.length; i++){
	let hand = hands[i];
	let val = hand.value;
	if (val < hi) continue;
	if (val > hi){
		hi = val;
		arr = [];
	}
	arr.push(hand);
}
//log(arr);
if (!if_test) {
	for (let h of arr) h.player.winner = true;
}	
return arr;


};//»

//»

const Card = function(num){//«
	let rank = num%13;
	let rank_str;
	switch (rank+2){
		case 14: rank_str = "A"; break;
		case 13: rank_str = "K"; break;
		case 12: rank_str = "Q"; break;
		case 11: rank_str = "J"; break;
		default: rank_str = rank+2+"";
	}
	let rank_long_str = RANKS[rank];
	let suit = Math.floor(num/13);
	let suit_long_str = SUITS[suit];
	let suit_str = SUITS_UNICODE[suit];;

	this.rank=rank;
	this.suit=suit;
	
	this.toString=(if_long)=>{
		if (if_long) return `${rank_long_str} ${suit_long_str}`;
		let suit_col="#000";
		if (suit_str == "&#9829;") suit_col="#b00";
		else if (suit_str == "&#9830;") suit_col = "#009";
		if (suit_str == "&#9827;") suit_col="#005000";

		let text_size = 36;
		let suit_size = 48;

		return `<span style="background-color:#a3a3a3;color:#000;font-size:${text_size};font-weight:900;padding-left:3;padding-right:3;">${rank_str}<span style="font-size:${suit_size};color:${suit_col}">${suit_str}</span></span>`;
	};


};//»
const Deck = function(){//«
	let cards=[];
	for (let i=0; i < 52; i++) cards[i] = new Card(i);
	this.cards = cards;
	let num_dealt = 0;
	const random_card = () => {//«
		if (num_dealt >= 52){
throw new Error("Empty deck: "+ num_dealt);
			return;
		}
		let card;
		let num;
		let iter=0;
		do{
			iter++;
			if (iter > 1000000) return INF_LOOP();
			num = Math.floor(Math.random()*52);
			card = cards[num];
		} while (!card)
		cards[num] = undefined;
		num_dealt++;
//log(num_dealt);
		return card;
	}//»
	this.random=random_card;
	this.deal=(num)=>{
		let arr=[];
		for (let i=0; i < num; i++) arr[i] = random_card();
		return arr;
	};
};//»
const Hand = function(cards, player){//«

this.player = player;
const byrank=(a,b)=>{//«
	if (a.rank < b.rank) return -1;
	if (a.rank > b.rank) return 1;
	return 0;
};//»
const bysuit=(a,b)=>{//«
	if (a.suit < b.suit) return -1;
	if (a.suit > b.suit) return 1;
	return 0;
};//»

let isstraight = false;//«
//let all = hole.concat(cards);
let all_str_arr = [];
let all=[];
for (let c of cards) c&&all.push(c);


for (let c of all) {
	all_str_arr.push(c.toString());
}
let card_str=`${all[0].toString()} ${all[1].toString()} ${all[2].toString()} ${all[3].toString()} ${all[4].toString()}`;
this.toString=()=>{return card_str;};

all = all.sort(byrank);
let ranks=[];
for (let c of all) ranks.push(c.rank);
let inarow;
//»
let seqs=[];//«
inarow = 1;
ranks.reduce((prev,cur)=>{
	if (cur===prev+1) {
		inarow++;
	}
	else {
		seqs.push(inarow);
		inarow=1;
	}
	return cur;
});
seqs.push(inarow);
let seqlen = seqs.length;
//»
let rank_match=[];//«
inarow = 1;
ranks.reduce((prev,cur)=>{
	if (cur===prev) {
		inarow++;
	}
	else {
		rank_match.push(inarow);
		inarow=1;
	}
	return cur;
});
rank_match.push(inarow);
let rnkmatchlen = rank_match.length;
//»

let hi = ranks[ranks.length-1];//«
let lo = ranks[0];
let delta = ranks[ranks.length-1]-ranks[0];

all = all.sort(bysuit);
let suits=[];
for (let c of all) suits.push(c.suit);
//»

let suit_match=[];//«
inarow = 1;
suits.reduce((prev,cur)=>{
	if (cur===prev) {
		inarow++;
	}
	else {
		suit_match.push(inarow);
		inarow=1;
	}
	return cur;
});
suit_match.push(inarow);
let suitmatchlen = suit_match.length;
//»
//Funcs«
const isStraight=()=>{//«
	if (isstraight || (seqlen === 2 && seqs[0]===4 && hi === 12 && lo === 0)) {
		isstraight = true;
		this.isstraight = true;
		ranks.pop();
//		ranks.unshift(-1);
		ranks.unshift(0);
		return true;
	}
	return seqlen===1;
};//»
const isFlush=()=>{return suitmatchlen===1;};
const isQuads=()=>{return rnkmatchlen===2 &&(rank_match[0]===4 || rank_match[1]===4);};
const isFullHouse=()=>{return rnkmatchlen===2 &&(rank_match[0]===3 || rank_match[1]===3);};
const isTrips=()=>{return rnkmatchlen===3 &&(rank_match[0]===3 || rank_match[1]===3 || rank_match[2]===3);};
const isTwoPair=()=>{return rnkmatchlen===3 &&(rank_match[0]===2 || rank_match[1]===2 || rank_match[2]===2);};
const isPair=()=>{return rnkmatchlen===4;};
const getPairRank=()=>{//«
	let ln = ranks.length;
	let arr = [];
	let prrnk;
	for (let i=0; i < ln; i++){
		let ri = ranks[i];
		if (ri==ranks[i+1]) {
			prrnk = ri;
			i++;
		}
		else arr.push(ri);
	}
	arr.push(prrnk);
	return arr;
};//»
const getTripRank=()=>{//«
	let ln = ranks.length;
	let arr = [];
	let trprnk;
	for (let i=0; i < ln; i++){
		let ri = ranks[i];
		if ((ri==ranks[i+1]) && (ri==ranks[i+2])) {
			trprnk = ri;
			i+=2;
		}
		else arr.push(ri);
	}
	arr.push(trprnk);
	return arr;
};//»
const getQuadRank=()=>{//«
	let ln = ranks.length;
	let quadrnk;
	let arr=[];
	for (let i=0; i < ln; i++){
		let ri = ranks[i];
		if ((ri==ranks[i+1]) && (ri==ranks[i+2]) && (ri==ranks[i+3])) {
			arr.push(ri);
			i+=3;
		}
		else arr.unshift(ri);
	}
	return arr;
};//»
const getTwoPairRank=()=>{//«
	let arr=[];
	let ln = ranks.length;
	let pr1, pr2;
	for (let i=0; i < ln; i++){
		let ri = ranks[i];
		if (ri==ranks[i+1]) {
			if (!pr1) pr1 = ri;
			else pr2 = ri;
			i+=1;
		}
		else arr.push(ri);
	}
	if (pr1 > pr2) {
		arr.push(pr2);
		arr.push(pr1);
	}
	else{
		arr.push(pr1);
		arr.push(pr2);
	}
	return arr;
};//»
const getFullHouseRank=()=>{//«
	let arr=[];
	let ln = ranks.length;
	for (let i=0; i < ln; i++){
		let ri = ranks[i];
		if ((ri==ranks[i+1]) && (ri==ranks[i+2])) {
			arr[1]=ranks[i]
			i+=2;
		}
		else if (ri==ranks[i+1]) {
			arr[0]=ranks[i]
			i++;
		}
	}
	return arr;
};//»
const isStraightFlush=()=>{return(suitmatchlen===1 && isStraight());};
//»

let clnum;//«

if (isStraightFlush()) clnum =  8;//0
else if (isQuads()) clnum =  7;//1
else if (isFullHouse()) clnum =  6;//2
else if (isFlush()) clnum =  5;//3
else if (isStraight()) clnum =  4;//4
else if (isTrips()) clnum =  3;//5
else if (isTwoPair()) clnum =  2;//6
else if (isPair()) clnum =  1;//7
else clnum =  0;//8

this.class = clnum;
this.className = CLASS_NAMES[clnum];
//»

const get_rank = ()=>{//«
	if (clnum===0||clnum===4||clnum===8||clnum===5) return ranks;
	if (clnum===1) return getPairRank();
	if (clnum===2) return getTwoPairRank();
	if (clnum===3) return getTripRank();
	else if (clnum===7) return getQuadRank();
	else if (clnum===6) return getFullHouseRank();
};//»

this.rank=get_rank;

{
	let r = get_rank();
	let s=`${clnum}.`;
	let arr = r.reverse();
	for (let v of arr) {
		if (v < 10) s+=`0${v}`;
		else s+=v;
	}
	this.value = parseFloat(s);
}


};

//»
const Player = function(table, chips, id){//«


let cards;
this.chips = chips;

this.id=id;

const bet = (num)=>{//«
	if (num >= this.chips) {
		num = this.chips;
		table.num_all_in++;
	}
	this.chips -= num;
	this._setchips(this.chips);
	if (this.chips < 0) throw new Error("Player has negative chips?????");
if (!this.chips){
//this._setallin('<span style="color:#0c0">\u2713</span>');
this._setallin();
this.allin = true;
//cwarn("ALLIN:",id);
}
	table.pot += num;
potdiv.innerHTML=table.pot;
	this.cur_bet += num;
this._setbet(this.cur_bet);
	this.tot_bet += num;
this._settot(this.tot_bet);

	if (this.cur_bet > table.cur_bet) {
		table.cur_bet = this.cur_bet;
	}
}//»

this.post = bet;
this.set_cards=(arg)=>{//«
	cards = arg;
	this.cur_bet = 0;
	this.tot_bet = 0;
	this.folded = false;
	this.allin = false;
try{
	this._setcards(`${cards[0].toString()} ${cards[1].toString()}`);
}
catch(e){}
};//»
this.get_cards=()=>{return cards;};
const call=()=>{bet(table.cur_bet-this.cur_bet);};

const fold=()=>{
	this.folded = true;
	table.fold();
//	table.num_folded++;
	this._setfold();
};

this.act = ()=>{//«

//	this._act();
	if (this.folded) return;
	if (!this.chips) return;
	let rval = Math.random();
//log(rval);
//fold();

	if (table.seats.length==2 || this.chips <= 10 || rval < 0.05){
		bet(this.chips);
	}
	else if (rval < 0.33) fold();
	else {
		if (!table.cur_bet) bet(2*MIN_BET);
		else call();
	}

/*
Want to see if this is the last logical action.

Scan forward to see who is not all in and has not folded

*/
	cur_table.next(null);

};//»

this.toString=()=>{
let s = `id: ${this.id}  chips: ${this.chips}`
if (this.tot_bet) s+=`  tot: ${this.tot_bet}`;
if (this.winner) s+=`  won: ${this.winner}`;
return s;
//tot: ${this.tot_bet}  won: ${this.winner}`;
};

};//»
const Table = function(num){//«

let seats = [];
let butpos;
let sbpos;
let bbpos
let cards = [];
let deck;
let cur;
//log();
//log(CHIPS[0]+CHIPS[1]+CHIPS[2]+CHIPS[3]+CHIPS[4]+CHIPS[5]);
seats.push(new Player(this, CHIPS[0], 0));
seats.push(new Player(this, CHIPS[1], 1));
seats.push(new Player(this, CHIPS[2], 2));
seats.push(new Player(this, CHIPS[3], 3));
seats.push(new Player(this, CHIPS[4], 4));
seats.push(new Player(this, CHIPS[5], 5));
/*
for (let i=0; i < num; i++){
	let player = new Player(this, DEF_CHIP_STACK, i);
	seats.push(player);
}
*/

this.fold = ()=>{//«
	this.num_folded++;
	if (this.num_folded == seats.length - 1){
		this.game_over = true;
	}
	else if (this.num_folded > seats.length - 1){
		throw new Error("num_folded > seats.length-1 !!!");
	}
};//»
this.start = ()=>{//«
	cards = [];
	cardsdiv.innerHTML="\xa0";
let tot_chips = 0;
	for (let s of seats) {
tot_chips += s.chips;
		s._setbet("\xa0");
		s._settot("\xa0");
//		s._setallin("\xa0");
		s._setallin(true);
//		s._setfold("\xa0");
	}
//log(seats.length, tot_chips);
//log(tot_chips);
if (last_chips){
let diff = last_chips - tot_chips;
/*
It looks like these come in pairs. If there is first a diff == 9, then there will follow a diff == -9 !!!
*/
if(Math.abs(diff) > 1) cwarn("POT VARIANCE", diff);
}
	last_chips = tot_chips;
	this.round_num = 0;
	this.game_over = false;
	rnddiv.innerHTML=`Round: 1`;
	deck = new Deck();
	this.num_folded = 0;
	this.num_all_in = 0;
	this.pot=0;
	potdiv.innerHTML="0";
	butpos++;
	if (butpos>=seats.length) butpos=0;
	if (seats.length===2){
		sbpos = butpos;
	}
	else {
		sbpos = butpos+1;
		if (sbpos>=seats.length) sbpos=0;
	}

//	seats[butpos]._button();

	bbpos = sbpos+1;
	if (bbpos>=seats.length) bbpos = 0;

	for (let i=0; i < seats.length; i++) seats[i].set_cards(deck.deal(2));

	let next = bbpos+1;
	if (next == seats.length) next = 0;
	seats[next]._button();

};//»

this.init_round = () => {//«

//	let next = bbpos+1;
//	if (next == seats.length) next = 0;

//	let player = scan_to_cur(next);
//log("PLAYER",player);
//	player&&player._act();

//	seats[next]._button();
//	seats[next]._act();
//cwarn("init_round()");
if (seats.length===1){
Main.innerHTML="";
make_dom();
new_table();
return;
}

	for (let seat of seats) {
		seat.cur_bet = 0;
		seat._setbet("\xa0");
	}

	if (this.round_num == 0){
		seats[sbpos].post(SMALL_BLIND);
		seats[bbpos].post(BIG_BLIND);
//		seats[bbpos]._on();
		this.cur_bet = BIG_BLIND;
	}
	else{
		betdiv.innerHTML="?";
		current_bet = 0;
	}
	cur = bbpos+1;

	if (cur == seats.length) cur = 0;
	if (this.round_num === 1) {
		cards.push(...deck.deal(3));
		let s='';
		for (let c of cards) s+=c.toString()+"\xa0";
		cardsdiv.innerHTML=`${s}`;
	}
	else if (this.round_num > 1) {
		cards.push(deck.deal(1)[0]);
		let s='';
		for (let c of cards) s+=c.toString()+"\xa0";
		cardsdiv.innerHTML=`${s}`;
	}
	this.next(bbpos);
};//»

this.step = () => {//«
/*
Both return false conditions means that the round is over
*/
	if (this.game_over) return false;

	if ((this.num_folded + this.num_all_in) > seats.length - 1) {
//log(1);
		return false;
	}
	let player = scan_to_cur(cur);
	if (!player){
cerr("NO PLAYER AT CUR: ", cur);
	}
	else if (player.cur_bet == this.cur_bet) {
		return false;
	}
	else if (player.folded){
//log("FOLDED: "+player.id);
player._on();
	}
	else player.act();

if (this.game_over){
//cwarn("GAMEOVER");
return false;
}

	cur++;
	if (cur == seats.length) cur=0;

	player = seats[cur];

	if (player.folded || player.allin){
		let c = cur+1;
		if (c==seats.length) c=0;
		let gotplayer = seats[c];
		while (gotplayer.folded || gotplayer.allin){
			c++;
			if (c==seats.length) c=0;
			gotplayer = seats[c];
			if (gotplayer === player) return false;
		}
	}
//	player._act();


	return true;

};//»

this.finalize = ()=>{//«
/*//«
Need to get the best 5 cards (out of 4 possibilities) from the player,
then create a new hand with just 5 cards.
*/
//		arr.push(new Hand(seat.get_cards(), cards, seat));
//1234567
/*

--3456 12
-2-456 13
-23-56 14
-234-6 15
-2345- 16
1--456 23
1-3-56 24
1-34-6 25
1-345- 26
12--56 34
12-4-6 35
12-45- 36
123--6 45
123-5- 46
1234-- 56

1234567
12
13
14

//»*/
//cwarn("WINNERS");
	this.finalized = true;
	let allwinners;
	if (this.num_folded == this.seats.length-1) {
//cwarn("POT TO LAST MAN: ", this.pot);
		let gotwinner;
		for (let seat of seats) {
			if (!seat.folded){
				if (gotwinner) throw new Error("BUG IN LOGIC: ALL BUT ONE SHOULD HAVE FOLDED!!!");
				gotwinner = seat;
				seat.chips+=this.pot;
seat._setchips(seat.chips);
//log(seat.toString());
//allwinners = seat;
//log(seat);
//winners.push(seat);
			}
		}
		allwinners=[gotwinner];
	}
	else {
//log(`*****************           SHOWDOWN (${this.pot} chips)        ***********`);

		let allbest = [];

		for (let seat of seats){
			if (!seat.folded){
				let hole = seat.get_cards();
				let all = cards.concat(hole);
				let arr=[];
				for (let i=0; i < 6; i++){
					for (let j=i+1;j < 7; j++) {
						let tmp = all.slice();
						tmp[i]=undefined;
						tmp[j]=undefined;
						arr.push(new Hand(tmp, seat));
					}
				}
				allbest.push(evaluate(arr, true)[0]);
			}
		}
		let arr = allbest.sort((a,b)=>{ return a.player.tot_bet - b.player.tot_bet; });
if (!arr.length){
cerr("NO ARR.LENGTH... SAME FOR ALLBEST BELOW??????");
log("POT IS: "+this.pot);
log(allbest);
return;
}
//log(`********************   ${arr.length} PLAYER SHOWDOWN FOR: ${this.pot}   *******************`);
//log(arr);
		showdown(this.pot, arr);
	}

	for (let i=0; i < seats.length; i++){
		seats[i].tot_bet = 0;
		delete seats[i].winner;
		if (!seats[i].chips){
			seats.splice(i,1);
			if (cur==seats.length) {
				cur--;
//log("cur--", cur);
			}
			i--;
		}
	}

};//»

this.next = (_cur)=>{//«
	let from_init;
	if (_cur===null) {
		_cur = cur;
		from_init = true;
	}
	let c = _cur+1;
	if (c==seats.length) c = 0;

	let player = seats[c];
if (!player){

cerr("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
cerr("NO PLAYER AT SEAT: "+c+" (resetting cur to 0)");
log(from_init);
cerr("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
cur=0;
//cur--;
//c=0;
//cur=0;
//c=0;
//player = seats[0];
return;
}
	let start_player = player;
	let starting = true;
	let iter = 0;
	let numseats = seats.length;
	let last;
	while(1){
//		if (iter>1000) return INF_LOOP();
//		if (!starting && (player === start_player)) {
		if (iter > numseats) {
			this.done = true;
//log("DONE", last.id);
//			start_player._act(true);
			last._act(true);

//			if (!from_init && this.round_num < 3) {
//				this.round_num++;
//				this.init_round();
//			}
			return;
		}
		iter++;
		last = player;
//		starting = false;
		if (player.folded || player.allin) {
			player._act();
			continue;
		}
//log(`${player.id}: ${player.cur_bet} < ${this.cur_bet}`);
		if (player.cur_bet < this.cur_bet) {
			player._act();
			return;
		}
		c++;
		if (c==seats.length) c = 0;
		player = seats[c];
//log(player.id);
	}

};//»

this.seats = seats;
this.cards = cards;

butpos = seats.length-1;

this.toString = ()=>{
	let str="";
	for (let s of seats){
		str+=s.toString()+"\n";
	}
	return str;
};

};//»


const init = async()=>{//«


new_table();


/*
let deck = new Deck();

let p1 = new Player(null, 10, 1);
let h1 = deck.deal(2);
p1.set_cards(h1);
p1.tot_bet = 20;

let p2 = new Player(null, 0, 2);
let h2 = deck.deal(2);
p2.set_cards(h2);
p2.tot_bet = 10;

let p3 = new Player(null, 20, 3);
let h3 = deck.deal(2);
p3.set_cards(h3);
p3.tot_bet = 30;

let p4 = new Player(null, 0, 4);
let h4 = deck.deal(2);
p4.set_cards(h4);
p4.tot_bet = 10;


let cards = deck.deal(3);
let hand1 = new Hand(h1.concat(cards), p1);
let hand2 = new Hand(h2.concat(cards), p2);
let hand3 = new Hand(h3.concat(cards), p3);
let hand4 = new Hand(h4.concat(cards), p4);

let arr = [hand1,hand2,hand3,hand4].sort((a,b)=>{
	return a.player.tot_bet - b.player.tot_bet;
});
//log(arr);
*/

///*

//log(p1);

//showdown(120, arr);
//*/

//let all_pot = 120;



//log()

//log(arr);
//while (arr)


//log(cur_pot);
//log(win);
//log(hand1, hand2, hand3);
//log(h1.concat(cards));



//log(p1,p2,p3);


//log(p1);
//log(h1.toString());
//let h2

}//»

//OBJ/CB«

this.onappinit=init;

this.onloadfile=bytes=>{};

this.onkeydown = function(e,s) {//«

if (s=="ENTER_"){
step();

//log("STEP");


}

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

make_dom();

}//»









/*
this.play_round = () => {//«

return new Promise(async(Y,N)=>{


for (let seat of seats) seat.cur_bet = 0;

if (this.round_num == 0){
	seats[sbpos].post(SMALL_BLIND);
	seats[bbpos].post(BIG_BLIND);
	this.cur_bet = BIG_BLIND;
//	this.last_bet_pos = bbpos;
}

let cur = bbpos+1;

if (cur == seats.length) cur = 0;
if (this.round_num === 1) cards.push(...deck.deal(3));
else if (this.round_num > 1) cards.push(deck.deal(1)[0]);


//Keep betting around the table until: 
//a) the player at last_bet_pos has equaled curbet
//b) there is only 1 player left


let iter=0;
while (true) {
iter++;
if (iter>1000) return INF_LOOP();
	if ((this.num_folded + this.num_all_in) >= seats.length - 1) break;
	let player = seats[cur];
	if (player.cur_bet == this.cur_bet){
		break;
	}
	player.act();
	cur++;
	if (cur == seats.length) cur=0;
}

//log(`${this.round_num})  POT: ${this.pot}`);
this.round_num++;
//cerr(this.round_num);
Y(this.num_folded === seats.length - 1 || this.round_num === 4);


});

};//»
*/

