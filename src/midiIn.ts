﻿module jMusicScore {
    export module Editors {

        class MidiHelper {
            constructor(private eventReceiver: Application.IEventReceiver) { }

            private trigger(event: any) {
                //(<any>$).event.trigger(event); // todo: send event directly to app and don't use $.event.trigger
                this.eventReceiver.ProcessEvent(event.type, event);
            }

            private _midiProc(t: any, a: any, b: any, c: any) {
                this.trigger({
                    type: "rawMidiIn",
                    param1: a,
                    param2: b,
                    param3: c,
                    time: t
                });

                var cmd = Math.floor(a / 16);
                var noteB = b;
                var note = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][b % 12] + Math.floor(b / 12);
                var i: number;
                a = a.toString(16);
                b = (b < 16 ? '0' : '') + b.toString(16);
                c = (c < 16 ? '0' : '') + c.toString(16);
                if (cmd == 8) {
                    this.releaseKey(noteB);
                    this.trigger({
                        type: "midiNoteOff",

                        noteInt: noteB,
                        noteName: note,
                        time: t

                    });
                }
                else if (cmd == 9) {
                    if (c == 0) {
                        this.releaseKey(noteB);
                        this.trigger({
                            type: "midiNoteOff",

                            noteInt: noteB,
                            noteName: note,
                            time: t

                        });
                    }
                    else {
                        this.pressKey(noteB);
                        this.trigger({
                            type: "midiNoteOn",

                            noteInt: noteB,
                            noteName: note,
                            time: t

                        });
                    }
                }
                else if (cmd == 10) {
                    this.trigger({
                        type: "midiAftertouch",

                        aftNote: noteB,
                        aftValue: c,
                        time: t

                    });
                }
                else if (cmd == 11) {
                    this.trigger({
                        type: "midiControl",

                        ctlNo: b,
                        ctlValue: c,
                        time: t

                    });
                }
                else if (cmd == 12) {
                    this.trigger({
                        type: "midiProgramChg",

                        progNo: b,
                        progValue: c,
                        time: t

                    });
                }
                else if (cmd == 13) {
                    //str+="Aftertouch";
                }
                else if (cmd == 14) {
                    //str+="Pitch Wheel";
                }
            }

            private Jazz: any;
            private midiInVars: any;

            midiOpen(newMidiIn: any): any {
                if (!this.Jazz) {
                    var r = $('<object>')
                        .attr('classid', "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90")
                        .addClass("hidden");
                    var s = $('<object>')
                        .attr('type', "audio/x-jazz")
                        .addClass("hidden");
                    s.append('<p style="visibility:visible;">This page requires <a href="http://jazz-soft.net/">Jazz-Plugin</a> ...</p>');
                    r.append(s);
                    $('#MidiInStuff').append(r);
                    this.Jazz = r[0];
                    if (!this.Jazz || !this.Jazz.isJazz) this.Jazz = s[0];
                }
                this.midiInVars = {
                    current_in: this.Jazz.MidiInOpen(newMidiIn,(t: any, a: any, b: any, c: any) => {
                        this._midiProc(t, a, b, c);
                    }),
                    midiKeysPressed: new Array(),
                    currentChord: new Array()
                };
                //this.current_in = this.Jazz.MidiInOpen(newMidiIn, _midiProc);
                return this.Jazz;
            }

            midiSend(arg2: { code: number; a1: number; a2: number; }) {
                this.Jazz.MidiOut(arg2.code, arg2.a1, arg2.a2);
            }

            midiClose(): void {
                this.Jazz.MidiInClose();
                this.midiInVars.current_in = '';
            }

            midiInList(): string[] {
                return this.Jazz.MidiInList();
            }

            releaseKey(arg: number) {
                var i: any;
                while ((i = this.midiInVars.midiKeysPressed.indexOf(arg)) > -1) {
                    this.midiInVars.midiKeysPressed.splice(i, 1);
                }
                if (this.midiInVars.midiKeysPressed.length == 0) {
                    this.trigger({
                        type: "midiChordReleased",
                        chord: this.midiInVars.currentChord.sort()
                    });
                    //{ chord: this.midiInVars.currentChord.sort() });
                    this.midiInVars.currentChord = new Array();
                }
            }

            pressKey(arg: number) {
                this.midiInVars.currentChord.push(arg);
                this.midiInVars.midiKeysPressed.push(arg);
            }

            get CurrentIn(): string {
                return this.midiInVars.current_in;
            }
            get KeysPressed(): any[] {
                return this.midiInVars.midiKeysPressed.sort();
            }

        }




        export class MidiInputPlugin implements ScoreApplication.ScorePlugin {

            private midiChannel: string;
            private midiHelper: MidiHelper;

            public SetMidiChannel(val: string) {
                if (this.midiChannel !== val) {
                }
                this.midiChannel = val;
            }

            public Init(app: ScoreApplication.ScoreApplication) {
                var active_element: Element;
                this.midiHelper = new MidiHelper(app);
                var me = this;

                function connectMidiIn() {
                    //alert("connect midi");
                }

                function disconnectMidiIn() {

                }

                function onFocusIE() {
                    this.active_element = document.activeElement;
                    connectMidiIn();
                }
                function onBlurIE() {
                    if (this.active_element != document.activeElement) { active_element = document.activeElement; return; }
                    disconnectMidiIn();
                }
                setTimeout(
                    () => {
                        try {
                            me.midiHelper.midiOpen(0);
                            app.AddPlugin(new MidiMenuPlugin(me.midiHelper));
                        }
                        catch (err) {
                            // Jazz Midi In not supported
                            $('#MidiInStuff').hide();
                            return;
                        }

                        $(document).on("midiNoteOn", function (e: Event) {
                            app.ProcessEvent("midinoteon", e);
                            /*$('#tast' + e.noteInt).addClass('down');
                            $('#Chord')
                                .text(JSON.stringify($.midiIn('keys_pressed')));*/
                        });
                        $(document).on("midiNoteOff", function (e: Event) {
                            app.ProcessEvent("midinoteoff", e);
                            /*$('#tast' + e.noteInt).removeClass('down');
                            $('#Chord')
                                .text(JSON.stringify($.midiIn('keys_pressed')));*/
                        });
                        $(document).on("midiControl", function (e: Event) {
                            app.ProcessEvent("midicontrol", e);
                            /*$('#msg')
                                .append("Control    " + e.ctlNo + " " + e.ctlValue + "<br>")
                                .scrollTop($('#msg').prop('scrollHeight'));*/
                        });
                        $(document).on("midiChordReleased", function (e: Event) {
                            app.ProcessEvent("midichordreleased", e);
                            /*$('#Chord1')
                                .text(JSON.stringify(e.chord));*/
                        });

                        if (navigator.appName == 'Microsoft Internet Explorer') { document.onfocusin = onFocusIE; document.onfocusout = onBlurIE; }
                        else { window.onfocus = connectMidiIn; window.onblur = disconnectMidiIn; }
                    }
                    , 100); // Safari initializes new window from the "new window" button faster than old plugin disconnects.


            }

            public GetId(): string { return 'MidiInputPlugin'; }
        }

        class MidiSettingsDialog extends UI.ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication, private helper: MidiHelper) {
                super(idPrefix, app);
                this.dialogId = "MidiDialog";
                this.dialogTitle = "MIDI Setup";
                this.height = 500;
                this.width = 750;
                this.CreateControls();
            }

            private midiInCtl: UI.DropdownWidget;

            setHelper(helper: MidiHelper): MidiSettingsDialog {
                this.helper = helper;
                return this;
            }

            public CreateControls() {
                var values: { [index: string]: string } = {
                    "": ' Not connected ',
                };

                try {
                    var list = this.helper.midiInList();
                    for (var i in list) {
                        values[list[i]] = list[i];
                    }

                    this.AddWidget(this.midiInCtl = new UI.DropdownWidget(values), "midiIn", "Midi in");
                    this.midiInCtl.Value = this.helper.CurrentIn;
                }
                catch (err) {
                    alert("error4");
                }
            }

            public onOk(): boolean {
                // Vælg Midi-kanal
                var midiChannel = this.midiInCtl.Value;
                
                try {
                    if (midiChannel) {
                        this.helper.midiOpen(midiChannel);
                    } else {
                        this.helper.midiClose();
                    }
                }
                catch (err) {
                    alert("error1: " + err.message);
                }

                return true;
            }
        }



        // ****************** Midi ******************* //
        class MidiMenuPlugin extends UI.MenuPlugin {
            constructor(private helper: MidiHelper) { super(); }

            GetMenuObj(app: ScoreApplication.ScoreApplication): UI.IMenuDef {
                // ****************** staves ******************* //
                var me = this;
                return {
                    Id: "MidiMenu",
                    Caption: "MIDI Setup",
                    action: () => {
                        new MidiSettingsDialog('menu', app, me.helper).Show();
                    },
                };
            }
        }

    }
}