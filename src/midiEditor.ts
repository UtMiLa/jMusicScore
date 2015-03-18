module jMusicScore {
    export module Editors {
        //declare var $: any;

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
        interface MidiEvent {
            time: Model.AbsoluteTime;
            midi: number;
            on: boolean;
            velo: number;
        }
        interface ConcurrentEvent {
            time: Model.AbsoluteTime;
            onEvents: MidiEvent[];
            offEvents: MidiEvent[];
        }
        export class MidiPlayer {
            /*GetMenuObj(app: ScoreApplication.ScoreApplication): any {
                // ****************** midi out ******************* //
                var me = this;
                return {
                    Id: "PlayMenu",
                    Caption: "Play",
                    action: (): void => {
                        me.playAll(app);
                    }
                };
            }*/

            // todo: midi channels and patches
            // todo: tied notes on/off
            // todo: set tempo
            // todo: graphic feedback

            public playAll(app: ScoreApplication.ScoreApplication) {
                var events = app.document.getEvents();
                //events.sort(Model.Music.compareEvents);
                var allEvents: MidiEvent[] = [];
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if (event.getElementName() === "Note") {
                        var note = <Model.INote>event;
                        note.withHeads((head: Model.INotehead) => {
                            allEvents.push({ time: note.absTime, midi: head.pitch.toMidi(), on: true, velo: 100 });
                            allEvents.push({ time: note.absTime.Add(note.getTimeVal()), midi: head.pitch.toMidi(), on: false, velo: 0 });
                        });
                    }
                }
                allEvents.sort((a, b) => {
                    if (a.time.Eq(b.time)) return 0;
                    return a.time.Gt(b.time) ? 1 : -1;
                });
                var concurrentOnEvents: MidiEvent[] = [];
                var concurrentOffEvents: MidiEvent[] = [];
                var absTime = Model.AbsoluteTime.startTime;
                while (allEvents.length) {
                    var theEvent = allEvents.shift();
                    if (!theEvent.time.Eq(absTime)) {
                        this._midiEvents.push({ time: absTime, onEvents: concurrentOnEvents, offEvents: concurrentOffEvents });
                        concurrentOnEvents = [];
                        concurrentOffEvents = [];
                        absTime = theEvent.time;
                    }
                    if (theEvent.on) {
                        concurrentOnEvents.push(theEvent);
                    }
                    else {
                        concurrentOffEvents.push(theEvent);
                    }
                }
                this._midiEvents.push({ time: absTime, onEvents: concurrentOnEvents, offEvents: concurrentOffEvents });
                this.PlayNextNote();
            }

            private _midiEvents: ConcurrentEvent[] = [];

            private PlayNextNote() {
                var nextEvents = this._midiEvents.shift();
                var me = this;

                for (var i = 0; i < nextEvents.offEvents.length; i++) {
                    var ev = nextEvents.offEvents[i];
                    (<any>$).midiIn('send', { code: 0x80, a1: ev.midi, a2: ev.velo });
                }

                for (var i = 0; i < nextEvents.onEvents.length; i++) {
                    var ev = nextEvents.onEvents[i];
                    (<any>$).midiIn('send', { code: 0x90, a1: ev.midi, a2: ev.velo });
                }

                if (me._midiEvents.length) {
                    var time = 3000 * (me._midiEvents[0].time.ToNumber() - nextEvents.time.ToNumber());
                    setTimeout(() => {
                        me.PlayNextNote();
                    }, time);
                }
            }

            GetId() { return "MidiPlayer"; }
        }


        
        /* todo: export midi file
        jsmidi-master function getMidiTrack(voice) {
            var noteEvents = [];
            var restDur = 60;
            var tempo = 1.414022;
            for (var i = 0; i < voice.noteElements.length; i++) {
                var note = voice.noteElements[i];
                if (note.rest) {
                    restDur += note.getTimeVal();
                }
                else {
                    for (var j = 0; j < note.pitchElements.length; j++) {
                        noteEvents.push(MidiEvent.noteOn({ channel: 2, pitch: note.pitchElements[j].pitch.toMidi(), duration: restDur * tempo, volume: 64 }));
                        restDur = 0;
                    }
                    restDur = note.getTimeVal();
                    for (var j = 0; j < note.pitchElements.length; j++) {
                        noteEvents.push(MidiEvent.noteOff({ channel: 2, pitch: note.pitchElements[j].pitch.toMidi(), duration: restDur * tempo, volume: 64 }));
                        restDur = 0;
                    }
                    restDur = 0;
                }
            }
            noteEvents.push(MidiEvent.noteOff({ channel: 2, pitch: 68, duration: 100, volume: 64 }));
            // Create a track that contains the events to play the notes above
            return new MidiTrack({ events: noteEvents });
        }*/
                                /*{
                            Id: "MusicXmlMenu",
                            Caption: "Midi",
                            Dialog: {
                                Title: "Midi",
                                Controls: [
                                    {
                                        tag: "<audio>",
                                        id: "midiPlayer"
                                    }
                                ],
                                buttonSettings: [
                                    {
                                        id: 'BtnOk_MusicXmlDialog',
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    {
                                        id: 'BtnCancel_MusicXmlDialog',
                                        text: "Cancel",
                                        click: function () { $(this).dialog("close"); }
                                    }
                                ],
                                okFunction: function () { },
                                cancelFunction: function () { },
                                initFunction: function (application: ScoreApplication.ScoreApplication) {

                                    // We pass some notes to |MidiWriter.createNote| to create the MIDI
                                    // events that define the notes that will be in the final MIDI stream. If
                                    // no other parameters are specified to |createNote|, a NoteOff event
                                    // will be inserted automatically, instead of letting the note ring forever.

                                    // Disregard the |push.apply|, it is used here simply to flatten the
                                    // resulting array, since |createNote| returns an array of events.

                                    // Create a track that contains the events to play the notes above
                                    var trackses = [];
                                    var score = application.getScore();
                                    for (var i = 0; i < score.staffElements.length; i++) {
                                        for (var j = 0; j < score.staffElements[i].voiceElements.length; j++) {
                                            trackses.push(getMidiTrack(score.staffElements[i].voiceElements[j]));
                                        }
                                    }

                                    // Creates an object that contains the final MIDI track in base64 and some
                                    // useful methods.
                                    var song = MidiWriter({ tracks: trackses });

                                    var embed = document.getElementById("midiPlayer");
                                    embed.setAttribute("src", "data:audio/midi;base64," + song.b64);
                                    embed.setAttribute("type", "audio/midi");
                                    document.body.appendChild(embed);
                                },
                                width: 350,
                                height: 300
                            }
                        },*/

    }
}