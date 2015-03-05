module jMusicScore {
    export module Editors {
        declare var $: any;

        export class MidiEditor implements ScoreApplication.ScoreEventProcessor {
            public Init(app: ScoreApplication.ScoreApplication) {
            }
            public Exit(app: ScoreApplication.ScoreApplication) {
            }
            private noCtrl = 0;
            public midicontrol(app: ScoreApplication.ScoreApplication, event: Event): boolean {
                /*v pedal ned: 
                ctlNo "43"
                ctlValue "7f"

                v pedal op: 
                ctlNo "43"
                ctlValue "00"


                h pedal ned: 
                ctlNo "40"
                ctlValue "7f"

                h pedal op: 
                ctlNo "40"
                ctlValue "00"

                */
                var ctlNo = (<any>event).ctlNo;
                var ctlValue = (<any>event).ctlValue;

                 // todo: set as quickenter_editor
                /*if (ctlNo === "40" && ctlValue === "7f") {
                    var arr = $.midiIn('keys_pressed');
                    if (!arr.length) {
                        var cmd = new Model.AddNoteCommand({
                            noteName: '1_8',
                            noteTime: Model.TimeSpan.eighthNote,
                            rest: true,
                            dots: 0,
                            grace: false,
                            pitches: [Model.Pitch.createFromMidi(60)],
                            voice: app.Status.currentVoice,
                            absTime: Model.AbsoluteTime.startTime,
                            beforeNote: null
                        });
                        app.ExecuteCommand(cmd);
                        this.noCtrl = 0;
                    }
                    else {
                        this.noCtrl++;
                    }
                }*/
                return true;
            }
            public midinoteon(app: ScoreApplication.ScoreApplication, event: Event): boolean {
                app.Status.pressNoteKey(Model.Pitch.createFromMidi((<any>event).noteInt));
                return true;
            }
            public midinoteoff(app: ScoreApplication.ScoreApplication, event: Event): boolean {
                app.Status.releaseNoteKey(Model.Pitch.createFromMidi((<any>event).noteInt));
                return true;
            }
            public midichordreleased(app: ScoreApplication.ScoreApplication, event: Event): boolean {
                if (app.Status.currentVoice) { // todo: set as quickenter_editor
                    /*var rest = app.Status.rest;
                    var dots = app.Status.dots;
                    var grace = app.Status.grace;

                    var pitches: Model.Pitch[] = [];
                    var chord = (<any>event).chord
                    for (var i = 0; i < chord.length; i++) {
                        pitches.push(Model.Pitch.createFromMidi(chord[i]));
                    }
                    var noteName = '1_8';
                    var noteTime = Model.TimeSpan.eighthNote;
                    dots = 0;

                    if (this.noCtrl === 1) {
                        noteName = '1_4';
                        noteTime = Model.TimeSpan.quarterNote;
                    }
                    else if (this.noCtrl === 2) {
                        noteName = '1_4';
                        noteTime = Model.TimeSpan.quarterNote;
                        dots = 1;
                    }
                    else if (this.noCtrl > 2) {
                        noteName = '1_2';
                        noteTime = Model.TimeSpan.halfNote;                        
                    }

                    var cmd = new Model.AddNoteCommand({
                        noteName: noteName,
                        noteTime: noteTime,
                        rest: rest,
                        dots: dots,
                        grace: grace,
                        pitches: pitches,
                        voice: app.Status.currentVoice,
                        absTime: Model.AbsoluteTime.startTime, // NB
                        beforeNote: null
                    });
                    app.ExecuteCommand(cmd);
                    this.noCtrl = 0;*/
                }
                //JSON.stringify($.midiIn('keys_pressed')));
                return true;
            }/* */


        }


    }
}