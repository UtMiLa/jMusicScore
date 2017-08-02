
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
  variabel1.property = expression
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

Funktioner:
  transponer diatonisk/kromatisk
  udfør matematisk operation på værdi
  forlæng/forkort tidsværdi
  (på selektion/voice/score/musiksekvens)
  konkatener sekvenser
  split sekvens ved antal noder eller tid
  beregn sekvens' længde
  beregn sekvens' højeste og laveste tone

  
Kommandoer:
  ændr tonehøjder
  ændr tidsværdier

Strukturer:
  for alle staff/voice/note/head in expression:
  hvis expression så kommando ellers kommando
  
*/


namespace ScriptRunner {


    export interface ICommandClass {
        new (args: {}): JMusicScore.Model.IScoreCommand;
    }

    export interface ICommandArgDef {
        name: string;
        type: string;
        cls?: {[k: string]: any};
        customParser?: (arg: string) => any;
    }

    export interface ICommandRegistration {
        cls: ICommandClass;
        name: string;
        args: ICommandArgDef[];
    }

    export interface ICommandParameter {
        val: any;
        type: string;
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
            var $inputArea = $('<textarea>').text("SetVoiceStemDir s1v1 StemDown\nSetVoiceStemDir s1v2 StemUp").css({ "height": "80px", "width": "480px" });
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

            var lines = t.split("\n");

            var parse = commandParser.exports.parse;

            var commands: JMusicScore.Model.IScoreCommand[] = [];

            for (var i = 0; i < lines.length; i++) {
                var res = parse(lines[i]);
                if (!res) throw "Syntax Error";

                switch (res.type) {
                    case "assignment":
                        throw "Assignment not supported";
                    //break;
                    case "command":
                        var cmd = ScriptRunnerPlugIn.findCommand(res.c);

                        if (!cmd) throw "Unknown Command: " + res.c;

                        var args: {[k: string]: any} = {};
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
                        commands.push(new cmd.cls(args));
                        break;
                    default: 
                        throw "Unknown Command Type";
                }                
            }
            return new JMusicScore.Model.BundleCommand(commands);
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
            }
            else if (param.type === "voice") {
                var s = param.val.s;
                var v = param.val.v;
                value = app.document.staffElements[s-1].voiceElements[v-1];
            } // todo: voice variables
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
