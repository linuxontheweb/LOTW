/*«
<letter>
	abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ  

<digit>
	0123456789  

<number>
	<digit>  
	<number> <digit>  

<word>
	<letter>  
	<word> <letter>  
	<word> '_'  

»*/

//«
const SPEC_STR=`
<word_list>
	<word>  
	<word_list> <word>  

<assignment_word>
	<word> '=' <word>  

<redirection>
	'>' <word>  
	'<' <word>  
	<number> '>' <word>  
	<number> '<' <word>  
	'>>' <word>  
	<number> '>>' <word>  
	'<<' <word>  
	<number> '<<' <word>  
	'<&' <number>  
	<number> '<&' <number>  
	'>&' <number>  
	<number> '>&' <number>  
	'<&' <word>  
	<number> '<&' <word>  
	'>&' <word>  
	<number> '>&' <word>  
	'<<-' <word>  
	<number> '<<-' <word>  
	'>&' '-'  
	<number> '>&' '-'  
	'<&' '-'  
	<number> '<&' '-'  
	'&>' <word>  
	<number> '<>' <word>  
	'<>' <word>  
	'>' <word>  
	<number> '>' <word>  

<simple_command_element>
	<word>  
	<assignment_word>  
	<redirection>  

<redirection_list>
	<redirection>  
	<redirection_list> <redirection>  

<simple_command>
	<simple_command_element>  
	<simple_command> <simple_command_element>  

<command>
	<simple_command>  
	<shell_command>  
	<shell_command> <redirection_list>  

<shell_command>
	<for_command>  
	<case_command>  
	while <compound_list> do <compound_list> done  
	until <compound_list> do <compound_list> done  
	<select_command>  
	<if_command>  
	<subshell>  
	<group_command>  
	<function_def>  

<for_command>
	for <word> <newline_list> do <compound_list> done  
	for <word> <newline_list> '{' <compound_list> '}'  
	for <word> ';' <newline_list> do <compound_list> done  
	for <word> ';' <newline_list> '{' <compound_list> '}'  
	for <word> <newline_list> in <word_list> <list_terminator>  
	<newline_list> do <compound_list> done  
	for <word> <newline_list> in <word_list> <list_terminator>  
	<newline_list> '{' <compound_list> '}'  

<select_command>
	select <word> <newline_list> do <list> done  
	select <word> <newline_list> '{' <list> '}'  
	select <word> ';' <newline_list> do <list> done  
	select <word> ';' <newline_list> '{' list '}'  
	select <word> <newline_list> in <word_list>  
	<list_terminator> <newline_list> do <list> done  
	select <word> <newline_list> in <word_list>  
	<list_terminator> <newline_list> '{' <list> '}'  

<case_command>
	case <word> <newline_list> in <newline_list> esac  
	case <word> <newline_list> in <case_clause_sequence>  
	<newline_list> esac  
	case <word> <newline_list> in <case_clause> esac  

<function_def>
	<word> '(' ')' <newline_list> <group_command>  
	function <word> '(' ')' <newline_list> <group_command>  
	function <word> <newline_list> <group_command>  

<subshell>
	'(' <compound_list> ')'  

<if_command>
	if <compound_list> then <compound_list> fi  
	if <compound_list> then <compound_list> else <compound_list> fi  
	if <compound_list> then <compound_list> <elif_clause> fi  

<group_command>
	'{' <list> '}'  

<elif_clause>
	elif <compound_list> then <compound_list>  
	elif <compound_list> then <compound_list> else <compound_list>  
	elif <compound_list> then <compound_list> <elif_clause> 

<case_clause>
	<pattern_list> 
	<case_clause_sequence> <pattern_list> 

<pattern_list>
	<newline_list> <pattern> ')' <compound_list> 
	<newline_list> <pattern> ')' <newline_list> 
	<newline_list> '(' <pattern> ')' <compound_list> 
	<newline_list> '(' <pattern> ')' <newline_list> 

<case_clause_sequence>
	<pattern_list> ';;' 
	<case_clause_sequence> <pattern_list> ';;' 

<pattern>
	<word> 
	<pattern> '|' <word> 

<list>
	 <newline_list> <list0> 

<compound_list>
	<list> 
	<newline_list> <list1> 

<list0>
	<list1> <newline> <newline_list> 
	<list1> '&' <newline_list> 
	<list1> ';' <newline_list> 

<list1>
	<list1> '&&' <newline_list> <list1> 
	<list1> '||' <newline_list> <list1> 
	<list1> '&' <newline_list> <list1> 
	<list1> ';' <newline_list> <list1> 
	<list1> <newline> <newline_list> <list1> 
	<pipeline_command> 

<simple_list_terminator>
	<newline>
	<eof>

<list_terminator>
	<newline>  
	';'  
	<eof>

<newline_list>
	<none>
	<newline_list> <newline>  

<simple_list>
	<simple_list1>  
	<simple_list1> '&'  
	<simple_list1> ';'  

<simple_list1>
	<simple_list1> '&&' <newline_list> <simple_list1>  
	<simple_list1> '||' <newline_list> <simple_list1>  
	<simple_list1> '&' <simple_list1>  
	<simple_list1> ';' <simple_list1>  
	<pipeline_command>  

<pipeline_command>
	<pipeline>  
	'!' <pipeline>  
	<timespec> <pipeline>  
	<timespec> '!' <pipeline>  
	'!' <timespec> <pipeline>  

<pipeline>
	<pipeline> '|' <newline_list> <pipeline>  
	<command>  

<time_opt>
	'-p'  

<timespec>
	time  
	time <time_opt> 

<inputunit>
	<simple_list> <simple_list_terminator>
`;
//»

const{log,cwarn,cerr}=Core;
const err=s=>{throw new Error(s)};
const jlog=o=>{log(JSON.stringify(o,null,"  "));};
Main.bgcol="#000";


let lns = SPEC_STR.split("\n");	
lns.shift();
const SPEC={};
let cur_op=null;
let cur_arr=[];
let marr;
for (let ln of lns){
if (!ln){
	SPEC[cur_op]=cur_arr;
	cur_op=null;
	cur_arr=[];
	continue;
}
if (marr=ln.match(/^<([a-z][a-z0-9_]*)>$/)) {
	cur_op = marr[1];
	continue;
}
if (!ln.match(/^\t/)) return err("Expected a leading tab!");
ln = ln.regstr().replace(/'(.+?)'/g,"$1");

cur_arr.push(ln.split("\x20"));

}

jlog(SPEC);



