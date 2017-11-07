//module JMusicScore {

    import {Model} from "./jMusicScore";
    //import {JMusicScoreUi} from "./jMusicScore.UI";
    import {Views, ScoreApplication} from "./jMusicScore.Views";
    //import {MusicSpacing} from "./jMusicScore.Spacing";
    //import {emmentalerNotes} from "./emmentaler";
    //import {Commands} from "./commands";
    import {Editors} from "./midiIn";
    

    export module Players {
        interface IMidiEvent {
            time: Model.AbsoluteTime;
            midi: number;
            on: boolean;
            velo: number;
        }
        interface IConcurrentEvent {
            time: Model.AbsoluteTime;
            onEvents: IMidiEvent[];
            offEvents: IMidiEvent[];
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
            private midiHelper: Editors.MidiHelper;

            public playAll(app: ScoreApplication.IScoreApplication) {
                var events = app.document.getEvents();
                //events.sort(Model.Music.compareEvents);
                this.midiHelper = Editors.MidiInputPlugin.getMidiHelper(app);
                var allEvents: IMidiEvent[] = [];
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if (event.getElementName() === "Note") {
                        var note = <Model.INote>event;
                        note.withHeads((head: Model.INotehead) => {
                            allEvents.push({ time: note.absTime, midi: head.pitch.toMidi(), on: true, velo: 100 });
                            allEvents.push({ time: note.absTime.add(note.getTimeVal()), midi: head.pitch.toMidi(), on: false, velo: 0 });
                        });
                    }
                }
                allEvents.sort((a, b) => {
                    if (a.time.eq(b.time)) return 0;
                    return a.time.gt(b.time) ? 1 : -1;
                });
                var concurrentOnEvents: IMidiEvent[] = [];
                var concurrentOffEvents: IMidiEvent[] = [];
                var absTime = Model.AbsoluteTime.startTime;
                while (allEvents.length) {
                    var theEvent = allEvents.shift();
                    if (!theEvent.time.eq(absTime)) {
                        this.midiEvents.push({ time: absTime, onEvents: concurrentOnEvents, offEvents: concurrentOffEvents });
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
                this.midiEvents.push({ time: absTime, onEvents: concurrentOnEvents, offEvents: concurrentOffEvents });
                this.playNextNote();
            }

            private midiEvents: IConcurrentEvent[] = [];

            private playNextNote() {
                var nextEvents = this.midiEvents.shift();
                var me = this;

                for (var i = 0; i < nextEvents.offEvents.length; i++) {
                    var ev = nextEvents.offEvents[i];
                    this.midiHelper.midiSend({ code: 0x80, a1: ev.midi, a2: ev.velo });
                }

                for (var i = 0; i < nextEvents.onEvents.length; i++) {
                    var ev = nextEvents.onEvents[i];
                    this.midiHelper.midiSend({ code: 0x90, a1: ev.midi, a2: ev.velo });
                }

                if (me.midiEvents.length) {
                    var time = 3000 * (me.midiEvents[0].time.toNumber() - nextEvents.time.toNumber());
                    setTimeout(() => {
                        me.playNextNote();
                    }, time);
                }
            }

            getId() { return "MidiPlayer"; }
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
//}