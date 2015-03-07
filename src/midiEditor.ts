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
    export module Players {

        

        export class MidiPlayer extends Menus.MenuPlugin {
            GetMenuObj(app: ScoreApplication.ScoreApplication): any {
                // ****************** midi out ******************* //
                var me = this;
                return {
                    Id: "PlayMenu",
                    Caption: "Play",
                    action: (): void => {
                        var events = app.document.getEvents();
                        events.sort(Model.Music.compareEvents);
                        var absTime = Model.AbsoluteTime.startTime;
                        var concurrentEvents = [];
                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];
                            if (event.getElementName() === "Note") {
                                /*if (!event.absTime.Eq(absTime)) {
                                    me._midiEvents.push({ time: absTime, events: concurrentEvents });
                                    concurrentEvents = [];
                                    absTime = event.absTime;
                                }
                                var note = <Model.INote>event;
                                note.withHeads((head: Model.INotehead) => {
                                    concurrentEvents.push({ midi: head.pitch.toMidi(), on: true, velo: 100 });
                                });*/
                            }
                        }

                        this.PlayNextNote();
                    }
                };
            }

            private _midiEvents = [];

            private PlayNextNote() {
                var nextEvents = this._midiEvents.shift();
                var me = this;

                for (var i = 0; i < nextEvents.events.length; i++) {
                    (<any>$).midiIn('send', { code: 0x90, a1: nextEvents.events[i].midi, a2: nextEvents.events[i].velo });
                }
                /*setTimeout(() => {
                    (<any>$).midiIn('send', { code: 0x80, a1: nextEvents.events[i].midi, a2: 0 });
                }, 200);*/

                if (me._midiEvents.length) {
                    var time = 2000 * (me._midiEvents[0].time.ToNumber() - nextEvents.time.ToNumber());
                    setTimeout(() => {
                        me.PlayNextNote();
                    }, time);
                }
            }

            GetId() { return "MidiPlayer"; }
        }
    }
}