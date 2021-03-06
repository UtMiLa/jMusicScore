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
  s:[ \t\n\r]+ { return undefined; } 
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
	= "{" __ notes:MusicElement* __ "}" { return {
			t: "Voice",
			def: {
				stem: "dir"
			},
			children: notes.reverse() // kommer underligt nok i omvendt rækkefølge
		};
	} /
     "{" __ "<<" __ StaffExpression* ">>" __ "}"
MusicElement
	= Note /
    Chord /
    ClefDef /
    KeyDef /
    TimeDef /
    Command
Command
	= "\\numericTimeSignature" _ /
    "~" _ /
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
	= "\\time" _ s:[0-9]+ "/" d:[0-9]+ _ { 
	return {"t":"Meter","def":{"abs":{"num":0,"den":1},"def":{"t":"Regular","num":s,"den":d}}};
	}
    
StaffExpression
	= "\\new" _ "Staff" __ m:Music __ { return m }     
    
Note 
	= p:Pitch o:Octave d:Duration? __ { return {
                    t: "Note",
					def: {
						time: { num: 1, den: 4 },
						abs: {num:0, den:1},
						noteId: "n1_4",
					},
					children: [p]
					}}
Chord
	= "<" n:(Note+) ">" d:Duration? __ { return {
					t: "Note",
					def: {
						time: { num: 1, den: 4 },
						abs: {num:0, den:1},
						noteId: "n1_4",
					},
					children: function(n){ var arr = []; for (var i = 0; i < n.length; i++) {arr.push(n[i].children[0]); } return arr; }(n)
					}; }
Duration
	= d:([0-9]+) dot:Dots? { return { dur: d, dots: dot } }
Dots 
	= "."+
Pitch "pitch"
	= pit:[a-hrs] i:Inflection? { 
				    var alteration = 0;
					switch (i) {
                        case "is": alteration = "x"; break;
                        case "isis": alteration = "xx"; break;
                        case "es": case "s": alteration = "b"; break;
                        case "eses": case "ses": alteration = "bb"; break;
                    }
					return {
						t: "Notehead",
						def: {
							p: JMusicScore.Model.Pitch.noteNames.indexOf(pit),
							a: alteration,
							forceAcc: false,
							tie: false,
							tieForced: false
						}
					};
				}
Inflection
	= "s" / "f" / "is" / "es"
    
Octave "sup_quotes_sub_quotes"
	= s:[\',]* { return s.join(""); }
    
Relative "relative_music"
	= rel:"\\relative" _ s:Note __ {
  	return { rel: s }
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
	= [ \t\n\r]+ / Comment
    