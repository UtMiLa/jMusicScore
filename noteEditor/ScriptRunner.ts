
declare var commandParser: any;
/*declare var $: any;
declare interface JQueryEventObject { originalEvent: any; }
declare interface JQuery { append(x: any):any }*/

/*
Hører til i jApps

Typer af kommandoer:
  KOMMANDO val1 val2 val3...                    # udfør kommando via kommandokøen
  variabel1 = FUNKTION val1 val2...             # find en værdi uden sideeffekter
  variabel1 = CREATE-objecttype init1 init2...  # konstruktør til objekt
Typer af udtryk:
  1
  4/8
  "streng"
  c''4.
  variabel
  objekt.property
  aritmetiske operationer?
  enums?
  < musiksekvens >
  CREATE object params (eller syntaks var1 = OBJEKTTYPE { param1: val1, param2: val2 } )
Commands kan registrere tilhørende script (pattern) i factory
*/

/*

Statement
  = Assignment
  / Command

Assignment
  = v:VariableName _"=" _ e:Command { return { type: "assignment", v: v, e: e } }

Command
  = c:CommandName _ args:Arg* { return { type: "command", c:c, args:args }}

VariableName
  = Identifier

CommandName
  = Identifier

Identifier
  = _ id:[A-Za-z]+ { return id.join(''); }

Arg
  = t:String {return {type: "string", val: t}}
  / r:Rational {return {type: "rational", val: r}}
  / i:Integer {return {type: "number", val: i}}
  / "<" _ m:Music* _ ">"{return {type: "music", val: m}}
  / v:Identifier _ {return {type: "identifier", val: v }; }
  / v:[^ ]+ _ {return {type: "expression", val: v.join('') }; }

Rational
  = i1:Integer "/" i2:Integer { return { num: i1, den: i2};  }

String
  = _ '"' t:([^"]*) '"' {return t.join(""); }

Music
  = "c"

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*

 */

namespace ScriptRunner {


    export interface ICommandClass {
        new (args: {}): JMusicScore.Model.IScoreCommand;
    }

    export interface ICommandArgDef {
        name: string;
        type: string;
        cls?: {};
        customParser?: (arg: string) => any;
    }

    export interface ICommandRegistration {
        cls: ICommandClass;
        name: string;
        args: ICommandArgDef[];
    }

    export interface ICommandParameter {
        val: string;
    }

    export interface IDataTypeRegistration {
        name: string;
        valueGetter: (arg: ICommandArgDef, param: ICommandParameter, app: JMusicScore.ScoreApplication.IScoreApplication) => any;
    }

    export class ScriptRunnerPlugIn implements JMusicScore.ScoreApplication.IScorePlugin, JApps.Application.IFeedbackClient {
        
        init(app: JMusicScore.ScoreApplication.IScoreApplication) {
            var $root = (<any>$('<div>').addClass('scripteditor').appendTo('#footer'));
            this.createInputArea($root, { tgWidth: 40 }, app);
            app.FeedbackManager.registerClient(this);
        }

        public changed(status: JApps.Application.IStatusManager, key: string, val: any) {
        }

        private createInputArea($root: JQuery, param: { tgWidth: number }, app: JMusicScore.ScoreApplication.IScoreApplication) {
            var $inputArea = $('<textarea>').text("SetVoiceStemDir . StemDown");
            var $inputButton = $('<button>').text("Execute");
            $root.append(
                $('<div>').append($inputArea).append($inputButton)
            );
            $inputButton.click(() => {
                var t = $inputArea.val();
                try {
                    var command = this.parseScript(t, app);
                    app.executeCommand(command);
                }
                catch (e) {                    
                    alert("Fejl: " + e);
                }
            });

            return this;
        }

        static findCommand(t: string): ICommandRegistration {
            for (var i = 0; i < ScriptRunnerPlugIn.commands.length; i++) {
                var cmd = ScriptRunnerPlugIn.commands[i];
                if (cmd.name.toLowerCase() === t.toLowerCase()) {
                    return cmd;
                }
            }
            return null;
        }

        static findDataType(t: string): IDataTypeRegistration {
            for (var i = 0; i < ScriptRunnerPlugIn.dataTypes.length; i++) {
                var dt = ScriptRunnerPlugIn.dataTypes[i];
                if (dt.name.toLowerCase() === t.toLowerCase()) {
                    return dt;
                }
            }
            return null;
        }

        parseScript(t: string, app: JMusicScore.ScoreApplication.IScoreApplication): JMusicScore.Model.IScoreCommand {

            var parse = commandParser.exports.parse;
            var res = parse(t);
            if (!res) throw "Syntax Error";

            switch (res.type) {
                case "assignment":
                    throw "Assignment not supported";
                    //break;
                case "command":
                    var cmd = ScriptRunnerPlugIn.findCommand(res.c);

                    if (!cmd) throw "Unknown Command: " + res.c;

                    var args = {};
                    for (var j = 0; j < cmd.args.length; j++) {
                        var value;
                        var arg = cmd.args[j];
                        var param: ICommandParameter = null;
                        if (res.args.length > j) param = res.args[j];
                        
                        var dt = ScriptRunnerPlugIn.findDataType(arg.type);
                        if (!dt) throw "Unknown Type: " + arg.type;

                        value = dt.valueGetter(arg, param, app);                        
                        args[arg.name] = value;
                    }
                    return new cmd.cls(args);
            }
            
            throw "Unknown Command Type";
        }

        getId(): string {
            return "ScriptRunnerPlugin";
        }

        static commands: ICommandRegistration[] = [];

        static registerCommand(cls: ICommandRegistration) {
            this.commands.push(cls);
        }

        static dataTypes: IDataTypeRegistration[] = [];

        static registerDataType(dt: IDataTypeRegistration) {
            this.dataTypes.push(dt);
        }

    }

    ScriptRunnerPlugIn.registerCommand({
        cls: JMusicScore.Model.SetVoiceStemDirectionCommand,
        name: "SetVoiceStemDir",
        args: [{ name: "voice", type: "Voice" },
            { name: "direction", type: "Enum", cls: JMusicScore.Model.StemDirectionType }]
    });

    ScriptRunnerPlugIn.registerDataType({
        name: "Voice",
        valueGetter: (arg: ICommandArgDef, param: ICommandParameter, app: JMusicScore.ScoreApplication.IScoreApplication): any => {
            var value;
            if (param.val === ".") {
                value = app.Status.currentVoice;
            } // todo: voice variables or voice literal
            if (!value) throw "No voice selected"

            return value;
        }
    });
    ScriptRunnerPlugIn.registerDataType({
        name: "Enum",
        valueGetter: (arg: ICommandArgDef, param: ICommandParameter, app: JMusicScore.ScoreApplication.IScoreApplication): any => {
            return arg.cls[param.val];;
        }
    });
}
