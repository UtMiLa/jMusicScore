//module JMusicScore {

    import {Model} from "./jMusicScore";
    import {JMusicScoreUi} from "./jMusicScore.UI";
    import {Views} from "./jMusicScore.Views";
    import { ScoreApplication } from "./jMusicScore.Application";
    import {UI} from "../jApps/Japps.ui";
    //import {MusicSpacing} from "./jMusicScore.Spacing";
    //import {emmentalerNotes} from "./emmentaler";
    //import {Commands} from "./commands";
    import {Application} from "../JApps/application";

    export module Editors {

        export interface MidiInDevice{

        }

        export interface MidiOutDevice{

        }
        
        /*export interface MidiInterface{
            midiOpenIn(newMidiIn: MidiInDevice);
            midiOpenOut(newMidiIn: MidiOutDevice);
            midiInitialize();
            midiSend(arg2: { code: number; a1: number; a2: number; });
            midiCloseAll();
            midiListInDevices(): MidiInDevice[];
            midiListOutDevices(): MidiOutDevice[];
        }*/

        export abstract class MidiHelper /*implements MidiInterface*/ {
            constructor(private eventReceiver: Application.IEventReceiver) { }

            // Kaldes lokalt - send event til applikation
            protected trigger(eventtype: string, event: Application.IMessage) {
                //var eventtype: string = event.type;
                this.eventReceiver.processEvent(eventtype.toLowerCase(), event);
            }

            protected midiInVars: {
                current_in: any;
                midiKeysPressed: number[];
                currentChord: number[];
            } = {
                current_in: "0",
                midiKeysPressed: [],
                currentChord: []
            };


            // Ved midi-input: del op i cases
            protected midiProc(t: number, a: number, b: number, c: number) {
                //debugger;
                this.trigger("rawMidiIn",
                    {
                        param1: a,
                        param2: b,
                        param3: c,
                        time: t
                    });

                var cmd = Math.floor(a / 16);
                var noteB = b;
                //var note = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][b % 12] + Math.floor(b / 12);
                var i: number;
                //var a1 = a.toString(16);
                var b1: string = (b < 16 ? '0' : '') + b.toString(16);
                var c1 = (c < 16 ? '0' : '') + c.toString(16);
                if (cmd == 8) {
                    this.releaseKey(noteB);
                    this.trigger("midiNoteOff",
                        {
                            noteInt: noteB,
                            //noteName: note,
                            time: t

                        });
                }
                else if (cmd == 9) {
                    if (c == 0) {
                        this.releaseKey(noteB);
                        this.trigger("midiNoteOff", {
                            noteInt: noteB,
                            //noteName: note,
                            time: t

                        });
                    }
                    else {
                        this.pressKey(noteB);
                        this.trigger("midiNoteOn", {
                            noteInt: noteB,
                            //noteName: note,
                            time: t

                        });
                    }
                }
                else if (cmd == 10) {
                    this.trigger("midiAftertouch", {
                        aftNote: noteB,
                        aftValue: c1,
                        time: t

                    });
                }
                else if (cmd == 11) {
                    this.trigger("midiControl", {
                        ctlNo: b1,
                        ctlValue: c1,
                        time: t

                    });
                }
                else if (cmd == 12) {
                    this.trigger("midiProgramChg", {
                        progNo: b1,
                        progValue: c1,
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
            

            // Åbner midi og åbner input-kanal nr. newMidiIn. Initialiserer midiInVars
            public abstract midiOpen(newMidiIn: any): any;
             
            // Sender midi-msg til hvilken kanal?
            abstract midiSend(arg2: { code: number; a1: number; a2: number; }): void;

            // Lukker alle MidiIn-devices
            abstract midiClose(): void;

            // Returnerer id'r for alle in-devices
            abstract midiInList(): string[];

            // in: der er sluppet en tangent
            releaseKey(arg: number) {
                var i: number;
                while ((i = this.midiInVars.midiKeysPressed.indexOf(arg)) > -1) {
                    this.midiInVars.midiKeysPressed.splice(i, 1);
                }
                if (this.midiInVars.midiKeysPressed.length == 0) {
                    this.trigger("midiChordReleased", {
                        chord: this.midiInVars.currentChord.sort()
                    });
                    //{ chord: this.midiInVars.currentChord.sort() });
                    this.midiInVars.currentChord = [];
                }
            }

            // in: der er trykket en tangent
            pressKey(arg: number) {
                this.midiInVars.currentChord.push(arg);
                this.midiInVars.midiKeysPressed.push(arg);
            }

            // returnerer id for aktuelle input-device
            get currentIn(): string {
                return this.midiInVars.current_in;
            }

            // returnerer et array med alle aktuelt nedtrykkede tangenter
            get keysPressed(): number[] {
                return this.midiInVars.midiKeysPressed.sort();
            }
        }

        export class WebMidiHelper extends MidiHelper {
            private midi: any;

            public midiOpen(newMidiIn: any): any {
                (<any>navigator).requestMIDIAccess().then( ( midiAccess: any ) => this.onMIDISuccess(midiAccess), (msg: string) => this.onMIDIFailure(msg) );  
                this.midiInVars.current_in = "0";
            }

            private onMIDISuccess( midiAccess: any ) {
                console.log( "MIDI ready!" );
                //debugger;
                this.midi = midiAccess;  // store in the object instance

                setTimeout(() =>
                this.midi.inputs.forEach( (entry: any) => {entry.onmidimessage = ( event: any ) => {
                    //var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
                    //debugger;
                    var args = [event.timeStamp, 0, 0, 0];
                    for (var i=0; i<event.data.length; i++) {
                      //str += "0x" + event.data[i].toString(16) + " ";
                      if (event.data[i]) args[i+1] = event.data[i];
                    }
                    //console.log( str );
                    //this.midiProc(...args)
                    if (args[1] != 254) 
                        this.midiProc.apply(this, args);
                  };
                }), 0);
              }
              
              private onMIDIFailure(msg: string) {
                console.log( "Failed to get MIDI access - " + msg );
              }
              


            // Sender midi-msg til hvilken kanal?
            midiSend(arg2: { code: number; a1: number; a2: number; }) {
                
            }

            // Lukker alle MidiIn-devices
            midiClose(): void {
            }

            // Returnerer id'r for alle in-devices
            midiInList(): string[] {
                var res: string[] = [];

                this.midi.inputs.forEach((element: any) => {
                    res.push(element.id);
                });
                /*for (var entry of this.midi.inputs) {
                    var input = entry[1];
                    res.push(input.id);
                }*/
                                
                return res;
            }

        }

        export class JazzMidiHelper extends MidiHelper {
            /*constructor(private eventReceiver: Application.IEventReceiver) { }

            // Kaldes lokalt - send event til applikation
            private trigger(eventtype: string, event: Application.IMessage) {
                //var eventtype: string = event.type;
                this.eventReceiver.processEvent(eventtype.toLowerCase(), event);
            }*/


            private jazz: any;
            /*private midiInVars: {
                current_in: any;
                midiKeysPressed: number[];
                currentChord: number[];
            };*/

            // Åbner midi og åbner input-kanal nr. newMidiIn. Initialiserer midiInVars
            public midiOpen(newMidiIn: any): any {
                if (!this.jazz) {
                    var r = $('<object>')
                        .attr('classid', "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90")
                        .addClass("hidden");
                    var s = $('<object>')
                        .attr('type', "audio/x-jazz")
                        .addClass("hidden");
                    s.append('<p style="visibility:visible;">This page requires <a href="http://jazz-soft.net/">Jazz-Plugin</a> ...</p>');
                    r.append(s);
                    $('#MidiInStuff').append(r);
                    this.jazz = r[0];
                    if (!this.jazz || !this.jazz.isJazz) this.jazz = s[0];
                }
                this.midiInVars = {
                    current_in: this.jazz.MidiInOpen(newMidiIn,(t: number, a: number, b: number, c: number) => {
                        this.midiProc(t, a, b, c);
                    }),
                    midiKeysPressed: [],
                    currentChord: []
                };
                //this.current_in = this.Jazz.MidiInOpen(newMidiIn, _midiProc);
                return this.jazz;
            }

            // Sender midi-msg til hvilken kanal?
            midiSend(arg2: { code: number; a1: number; a2: number; }) {
                this.jazz.MidiOut(arg2.code, arg2.a1, arg2.a2);
            }

            // Lukker alle MidiIn-devices
            midiClose(): void {
                this.jazz.MidiInClose();
                this.midiInVars.current_in = '';
            }

            // Returnerer id'r for alle in-devices
            midiInList(): string[] {
                return this.jazz.MidiInList();
            }

            // in: der er sluppet en tangent
            /*releaseKey(arg: number) {
                var i: number;
                while ((i = this.midiInVars.midiKeysPressed.indexOf(arg)) > -1) {
                    this.midiInVars.midiKeysPressed.splice(i, 1);
                }
                if (this.midiInVars.midiKeysPressed.length == 0) {
                    this.trigger("midiChordReleased", {
                        chord: this.midiInVars.currentChord.sort()
                    });
                    //{ chord: this.midiInVars.currentChord.sort() });
                    this.midiInVars.currentChord = [];
                }
            }

            // in: der er trykket en tangent
            pressKey(arg: number) {
                this.midiInVars.currentChord.push(arg);
                this.midiInVars.midiKeysPressed.push(arg);
            }

            // returnerer id for aktuelle input-device
            get currentIn(): string {
                return this.midiInVars.current_in;
            }

            // returnerer et array med alle aktuelt nedtrykkede tangenter
            get keysPressed(): number[] {
                return this.midiInVars.midiKeysPressed.sort();
            }*/
        }


        export class MidiInputPlugin implements ScoreApplication.IScorePlugin {
            private static _midiHelper: MidiHelper;

            public static getMidiHelper(app: Application.IEventReceiver): MidiHelper {
                if (!this._midiHelper) this._midiHelper = new WebMidiHelper(app);
                return this._midiHelper;
            }

            private midiChannel: string;
            private midiHelper: MidiHelper;

            public setMidiChannel(val: string) {
                if (this.midiChannel !== val) {
                }
                this.midiChannel = val;
            }

            public init(app: ScoreApplication.IScoreApplication) {
                var activeElement: Element;
                this.midiHelper = MidiInputPlugin.getMidiHelper(app);
                var me = this;

                function connectMidiIn() {
                    //alert("connect midi");
                }

                function disconnectMidiIn() {

                }

                function onFocusIe() {
                    this.active_element = document.activeElement;
                    connectMidiIn();
                }
                function onBlurIe() {
                    if (this.active_element != document.activeElement) { activeElement = document.activeElement; return; }
                    disconnectMidiIn();
                }
                setTimeout(
                    () => {
                        try {
                            me.midiHelper.midiOpen(0);
                            app.addPlugin(new MidiMenuPlugin(me.midiHelper));
                        }
                        catch (err) {
                            // Jazz Midi In not supported
                            $('#MidiInStuff').hide();
                            return;
                        }

                        /*$(document).on("midiNoteOn", function (e: Event) {
                            app.ProcessEvent("midinoteon", e);
                        });
                        $(document).on("midiNoteOff", function (e: Event) {
                            app.ProcessEvent("midinoteoff", e);
                        });
                        $(document).on("midiControl", function (e: Event) {
                            app.ProcessEvent("midicontrol", e);
                        });
                        $(document).on("midiChordReleased", function (e: Event) {
                            app.ProcessEvent("midichordreleased", e);
                        });*/

                        if (navigator.appName == 'Microsoft Internet Explorer') { (<any>document).onfocusin = onFocusIe; (<any>document).onfocusout = onBlurIe; }
                        else { window.onfocus = connectMidiIn; window.onblur = disconnectMidiIn; }
                    }
                    , 100); // Safari initializes new window from the "new window" button faster than old plugin disconnects.


            }

            public getId(): string { return 'MidiInputPlugin'; }
        }

        class MidiSettingsDialog extends JMusicScoreUi.ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication, private helper: MidiHelper) {
                super(idPrefix, app);
                this.dialogId = "MidiDialog";
                this.dialogTitle = "MIDI Setup";
                this.height = 500;
                this.width = 750;
                this.createControls();
            }

            private midiInCtl: JMusicScoreUi.DropdownWidget;

            setHelper(helper: MidiHelper): MidiSettingsDialog {
                this.helper = helper;
                return this;
            }

            public createControls() {
                var values: { [index: string]: string } = {
                    "": ' Not connected ',
                };

                try {
                    var list = this.helper.midiInList();
                    for (var i in list) {
                        values[list[i]] = list[i];
                    }

                    this.addWidget(this.midiInCtl = new JMusicScoreUi.DropdownWidget(values), "midiIn", "Midi in");
                    this.midiInCtl.value = this.helper.currentIn;
                }
                catch (err) {
                    alert("error4");
                }
            }

            public onOk(): boolean {
                // Vælg Midi-kanal
                var midiChannel = this.midiInCtl.value;
                
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
        class MidiMenuPlugin extends JMusicScoreUi.MenuPlugin<Model.ScoreElement, ScoreApplication.ScoreStatusManager> {
            constructor(private helper: MidiHelper) { super(); }

            getMenuObj(app: ScoreApplication.IScoreApplication): JMusicScoreUi.IMenuDef {
                // ****************** staves ******************* //
                var me = this;
                return {
                    id: "MidiMenu",
                    caption: "MIDI Setup",
                    action: () => {
                        new MidiSettingsDialog('menu', app, me.helper).show();
                    },
                };
            }
        }




        export class MidiEditor implements ScoreApplication.IScoreEventProcessor {
            public init(app: ScoreApplication.IScoreApplication) {
            }
            public exit(app: ScoreApplication.IScoreApplication) {
            }
            private noCtrl = 0;
            public midicontrol(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
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
            public midinoteon(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
                app.Status.pressNoteKey(Model.Pitch.createFromMidi((<any>event).noteInt));
                return true;
            }
            public midinoteoff(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
                app.Status.releaseNoteKey(Model.Pitch.createFromMidi((<any>event).noteInt));
                return true;
            }
            public midichordreleased(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
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
//}