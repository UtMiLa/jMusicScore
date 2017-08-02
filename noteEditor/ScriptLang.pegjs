Statement
  = Assignment
  / Command

Assignment
  = v:VariableName _ "=" _ e:FunctionCall { return { type: "assignment", v: v, e: e } }

Command
  = c:CommandName __ args:Arg* { return { type: "command", c:c, args:args }}
  / c:CommandName { return { type: "command", c:c, args:[] }; }

VariableName
  = Identifier

CommandName
  = Identifier

Identifier
  = _ id:[A-Za-z]+ { return id.join(''); }

Arg
  = t:String _ {return {type: "string", val: t}}
  / r:Rational _ {return {type: "rational", val: r}}
  / i:Integer _ {return {type: "number", val: i}}
  / "<" _ m:Music* _ ">"{return {type: "music", val: m}}
  / v:Voice _ {return {type: "voice", val: v}}
  / s:Staff _ {return {type: "staff", val: s}}
  / f:FunctionCall
  / v:Identifier _ {return {type: "identifier", val: v }; }

FunctionCall
  = f:Identifier _ "(" _ a:Arg* _ ")" {return { type: "function", name: f, args: a }}
  
Voice
  = [s]s:[0-9]+[v]v:[0-9]+ _ {return {s:s.join(''),v:v.join('')}}

Staff
  = [s]s:[0-9]+ _ {return {s:s.join('')}}

Rational
  = i1:Integer "/" i2:Integer { return { num: i1, den: i2};  }

String
  = _ '"' t:([^"]*) '"' {return t.join(""); }

Music
  = note:[a-h] acc:[bx#]? time:[0-9]* dot:[.]* _ {return { note: note, acc: acc, time: time.join(''), dots: dot.join('') }} 

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*

__ "whitespace_required"
  = [ \t\n\r]+
