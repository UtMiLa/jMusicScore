/*
node ..\node_modules\pegjs\bin\pegjs -o .\peg\lilypond.js .\peg\lilypond.pegjs
copy .\peg\lilypond.js .\dist\jMusic\peg\lilypond.js 

Todo:

parse [ ] efter node
s1*7/8
variable
\modalTranspose og \transpose
\time

*/
{
	var lastTime = 4;
  function theTime(d){
    //this.lastTime = 4;
   	if (d) { 
        if (d.dur == "\\brevis") {
        	lastTime = { num: 2, den: 1 };
        } else {
	        let dur = d.dur.join("");
        	lastTime = { num: 1, den: +dur };
        }
      }
    return { num: lastTime.num, den: lastTime.den };
  } 	

}



File
	= ex:Expression * { return ex; }
    
Expression
  = version:Version /
  include:Include /
  relative: Relative /
  score:Score /
  things: ScoreThings /
  music:Music { return {mus: music}; } /
  notes:MusicElement+ { return {n: notes}; } /
  comment:Comment { return {t:"Comment", def: comment}; }  /
  s:[ \t\n\r]+ { return undefined; } 
  
TransposeFunction
    = "\\transpose" _ Pitch _ Pitch _ Music _ /
    "\\modalTranspose" _ Pitch _ Pitch _ Music Music _
RepeatFunction
	= "\\repeat" _ "unfold" _ no:[0-9]+ _ Music {return {"t": "repeat"}; }
Score
	= "\\score" _ m:ScoreMusic { 
		var res = {
			t: "Score",
			def: {
				title: "t",
				composer: "c",
				author: "a",
				subTitle: "s",
				metadata: {}
			},
			children: m
		};
		return res;
	}
ScoreMusic
	= "{" __ t:ScoreThings* "}" { return t; }
ScoreThings
	= "\\new" _ "Staff" _ m:Music __ { return {
		t: "Staff",
		def: {},
		children: [m]
	}; }
Music
	= Sequence /
    "{" __ "<<" __ StaffExpression* ">>" __ "}" /
    variable: VariableRef
Sequence
	= "{" __ notes:MusicElement* __ "}" { return {
			t: "Sequence",
			def: {
				stem: "dir"
			},
			children: notes.reverse() // kommer underligt nok i omvendt rækkefølge
		};
	} 
MusicElement
	= Note /
    Rest /
    transpose: TransposeFunction /
    repeat: RepeatFunction /
    Chord /
    ClefDef /
    KeyDef /
    TimeDef /
    Command /
    Sequence /
    Music
VariableRef
	= "\\" name:[a-zA-Z]+ __ { return { t: "Variable", def: {name: name.join('')}}; }
Command
	= "\\numericTimeSignature" _ /
    "[" __ /
    "]" __ /
    "\\(" __ /
    "\\)" __ /
    "(" __ /
    ")" __ /
    "|" __ /
    "\\arpeggio" __
Comment =
	"%" c:([^\n]*) "\n" { return { "Comment": c.join('') }; }
ClefDef "command_element_clef"
	= "\\clef" _ s:String _ { return { clef: s } }
    
KeyDef "command_event_key"
	= "\\key" _ s:Note m:Mode _ { return { key: s, mode: m } }
    
Mode
	= "\\major" / "\\minor"
    
TimeDef "command_element_time"
	= "\\time" _ s:Integer "/" d:Integer _ { 
	return {"t":"Meter","def":{"abs":{"num":0,"den":1},"def":{"t":"Regular","num":s,"den":d}}};
	}
    
StaffExpression
	= "\\new" _ "Staff" __ m:Music __ { return m }     
Rest
	= [rs] o:Octave d:Duration? __ { 
		var lastDur = theTime(d);
        var mul;
		return {
                    t: "Note",
					def: {
						time: lastDur,
						noteId: "n" + lastDur.num + "_" + lastDur.den,
                        dots: d && d.dots ? d.dots.length : undefined,
                        rest: true,
                        tuplet: d ? d.mul : undefined
					},
					children: []
				}
		}
Note 
	= p:Pitch d:Duration? tie:"~"? __ { 
   		var lastDur = theTime(d);
        if (tie) p.def.tie = true;
		return {
                    t: "Note",
					def: {
						time: lastDur,
						noteId: "n" + lastDur.num + "_" + lastDur.den,
                        dots: d && d.dots ? d.dots.length : undefined,
                        tuplet: d ? d.mul : undefined
					},
					children: [p]
					}}
Chord
	= "<" n:(Pitch MultiPitch*) ">" d:Duration? tie:"~"? __ { 
		var lastDur = theTime(d);
		if (tie) {
			n[0].tie  = true;
		}
		var childItems = [n[0]];
		for (var i = 0; i < n[1].length; i++) {
			if (tie) {
				n[1][i].tie  = true;
			}
			childItems.push(n[1][i]); 
		}
		return {
					t: "Note",
					def: {
						time: lastDur,
						noteId: "n" + lastDur.num + "_" + lastDur.den,
                        dots: d && d.dots ? d.dots.length : undefined,
                        tuplet: d ? d.mul : undefined
					},
                    n: n,
					children: childItems
					}; }
MultiPitch
	= _ p:Pitch { return p; }
Duration
	= d:([0-9]+ / "\\brevis") dot:Dots? mul:Multiplier? { return { dur: d, dots: dot, mul: mul } }    
Dots 
	= "."+
Multiplier
	= "*" num:Integer "/" den:Integer { return {num:num, den:den}; }
	/ "*" num:Integer { return {num:num, den:1}; }
Pitch "pitch"
	= pit:[a-h] i:Inflection? o:Octave tie:"~"? { 
				    var alteration = 0;
					switch (i) {
                        case "is": alteration = "x"; break;
                        case "isis": alteration = "xx"; break;
                        case "es": case "s": alteration = "b"; break;
                        case "eses": case "ses": alteration = "bb"; break;
                    }
                    var octave = -7;
                    for (var i = 0; i < o.length; i++) {
                    	switch(o[i]){
                        	case "'": octave += 7; break;
                        	case ",": octave -= 7; break;
                        }
                    }
					return {
						t: "Notehead",
						def: {
							p: ['c', 'd', 'e', 'f', 'g', 'a', 'b'].indexOf(pit) + octave,
							a: alteration,
							forceAcc: false,
							tie: tie? true : false,
							tieForced: false
						}
					};
				}
Inflection
	= "s" / "f" / "isis" / "eses" / "is" / "es"
    
Octave "sup_quotes_sub_quotes"
	= s:[\',]* { return s.join(""); }
    
Relative "relative_music"
	= rel:"\\relative" _ s:Note __ m: Music {
  	return { rel: s, mus: m }
    }
Version
	= version:"\\version" _ s:String {
  	return { version: s }
    }
Include
	= version:"\\include" _ s:String {
  	return { include: s }
    }    
String
	= "\"" s:StringChar* "\"" { return s.join(""); }
Integer
	= n:[0-9]+ { return +n.join(''); }
StringChar
	= StringEscape c:. { return c; }
    /
    c:[^"] { return c }

StringEscape
	= "\\"

_ "whitespace"
  = s:(WhitespaceItem+) { return " " }
  
__ "optional_whitespace"
	= s:(WhitespaceItem*) { return {"WS": s}; }

WhitespaceItem
	= [ \t\n\r]+
    