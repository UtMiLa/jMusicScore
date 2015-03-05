module jMusicScore {

    /*
    Eksport: format

    todo: import

    \key som event
    \clef
    \time 3/4
    \relative
    slur node1( node2)
    lyric
    barlines
    spacer s i stedet for node
    fuld-takt-pause R1*13/8*12 (12 takter i 13/8) R i stedet for r
    optakt \partial 8 (varighed) efter \time a/b
    noteExpressions
    
    for hver staff:
        \new Staff \relative "første tone" {
            \key ...
            \clef ...
            <<
                    \new Voice = "first" { \voiceOne . . . }
                    \new Voice = "second" { \voiceTwo . . . }
            >>
        }
    
    
    */

    export module Lilypond {

        class LilypondHelper {
            static noteTypes: { [Index: string]: string } = {
                "1024": "1_1024",
                "512": "1_512",
                "256": "1_256",
                "128": "1_128",
                "64": "1_64",
                "32": "1_32",
                "16": "1_16",
                "8": "1_8",
                "4": "1_4",
                "2": "1_2",
                "1": "1_1",
                "\\breve": "2_1",
                "\\longa": "4_1",
                "\\maxima": "8_1"
            };
            static noteTimes: { [Index: string]: Model.TimeSpan } = {
                "1_1024": new Model.TimeSpan(1, 1024), 
                "1_512": new Model.TimeSpan(1, 512), 
                "1_256": new Model.TimeSpan(1, 256), 
                "1_128": new Model.TimeSpan(1, 128), 
                "1_64": new Model.TimeSpan(1, 64), 
                "1_32": new Model.TimeSpan(1, 32), 
                "1_16": new Model.TimeSpan(1, 16), 
                "1_8": new Model.TimeSpan(1, 8), 
                "1_4": new Model.TimeSpan(1, 4), 
                "1_2": new Model.TimeSpan(1, 2), 
                "1_1": new Model.TimeSpan(1, 1), 
                "2_1": new Model.TimeSpan(4, 1), 
                "4_1": new Model.TimeSpan(4, 1), 
                "8_1": new Model.TimeSpan(8, 1)
            };

            static NoteTypeToName(type: string): string {
                return this.noteTypes[type];
            }
            static NoteNameToType(name: string): string {
                for (var type in this.noteTypes) {
                    if ("n" + this.noteTypes[type] === name) {
                        return type;
                    }
                }
                return null;
            }
            static NoteNameToDuration(name: string): Model.TimeSpan {
                return this.noteTimes[name];
            }
            static NoteDurationToType(dur: Model.TimeSpan): string {
                if (dur.numerator === 1) {
                    return "" + dur.denominator;
        }
                else if (dur.denominator === 1) {
                    if (dur.numerator === 2) return "\\breve";
                    if (dur.numerator === 4) return "\\longa";
                    if (dur.numerator === 8) return "\\maxima";
                }
                else {
                    // error
                    return "1";
                }
            }
        }

        class LilypondReader implements Application.IReaderPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            private app: ScoreApplication.ScoreApplication;

            Init(app: ScoreApplication.ScoreApplication) {
                this.app = app;
            }

            GetId(): string {
                return "LilypondReader";
            }

            GetFormats(): string[]{
                return [
                    "Lilypond"
                ]
            }

            public Supports(type: string): boolean {
                return type === "Lilypond";
            }

            GetExtension(type: string): string {
                return "ly";
            }

            public Load(data: any) {
                // parse data
            }
        }



        export class LilypondWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            constructor(public score: Model.IScore) {
            }

            //private doc;


            Init(app: ScoreApplication.ScoreApplication) { /*this.app = app;*/ }

            GetId(): string {
                return "LilypondWriter";
            }

            GetFormats(): string[] {
                return [
                    "Lilypond"
                ]
            }

            public Supports(type: string): boolean {
                return type === "Lilypond";
            }

            GetExtension(type: string): string {
                return "ly";
            }

            public Save() {
                return this.getAsLilypond();
            }


            private getAsLilypond(): string {
                var res = "<<\n";
                this.score.withStaves((staff: Model.IStaff, indexS: number) => {
                    res += "\\new Staff {\n"; // relative c"første tones oktav"
                    
                    // add Key
                    var key: Model.IKey;
                    if (staff.getKeyElements().length) {
                        key = staff.getKeyElements()[0];
                    }
                    if (key && (key.absTime.numerator === 0)) {
                        var tonic: Model.PitchClass = key.getTonic();
                        res += "\t\\key " + tonic.noteNameLilypond() + " \\major\n"; // todo: other modes!
                    }

                    // add Clef
                    // add Meter?
                    if (staff.voiceElements.length > 1) {
                        res += "\t<<\n";
                        staff.withVoices((voice: Model.IVoice, indexV: number) => {

                            res += '\t\t\\new Voice = "Voice' + indexS + '_' + indexV +'" {';
                            res += "\t\t" + this.getEventsAsLilypond(voice) + "\n";
                            res += "\t\t}\n";

                        });
                        res += "\t>>\n";
                    }
                    else if (staff.voiceElements.length === 1) {
                        res += "\t" + this.getEventsAsLilypond(staff.voiceElements[0]) + "\n";
                    }
                    res += "}\n";
                });
                res += ">>\n";
                return res;
            }

            private getEventsAsLilypond(voice: Model.IVoice): string {
                var res = "";
                var events = voice.getEvents();
                for (var i = 0; i < events.length; i++) {
                    var ev = events[i];
                    if (ev.getElementName() === "Note") {
                        res += this.getNoteAsLilypond(<Model.INote>ev);
                    }
                    else if (ev.getElementName() === "Clef") {
                        res += this.getClefAsLilypond(<Model.IClef>ev);
                    }
                }

                return res;
            }

            private getNoteAsLilypond(note: Model.INote): string {
                var res = "";
                if (note.graceType) res += '\\grace ';
                if (note.rest) {
                    res += "r";
                }
                else if (note.noteId === "hidden") {
                    res += "s";
                }
                    else if (note.noteheadElements.length === 1) {
                        res += note.noteheadElements[0].pitch.debug();
                    if (note.noteheadElements[0].tie) res += "~";
                    }
                    else {
                        res += "<";
                        note.withHeads((head: Model.INotehead, indexH: number) => {
                            if (indexH) res += " ";
                            res += head.pitch.debug();
                        if (head.tie) res += "~";
                        });
                        res += ">";
                    }
                //res += LilypondHelper.NoteNameToType(note.noteId);
                res += LilypondHelper.NoteDurationToType(note.timeVal);
                for (var i = 0; i < note.dotNo; i++) res += ".";
                res += " ";
                return res;
            }

            private getClefAsLilypond(clef: Model.IClef): string {
                var res = "\\clef g";
                    res += " ";
                return res;
            }

        }



        export class LilypondPlugin implements ScoreApplication.ScorePlugin {
            constructor() {
            }

            public Init(app: ScoreApplication.ScoreApplication) {
                app.AddReader(new LilypondReader());
                app.AddWriter(new LilypondWriter(app.document));
            }

            GetId() {
                return "Lilypond";
            }
        }
    }
}