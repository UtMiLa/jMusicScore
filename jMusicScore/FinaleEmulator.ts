//module JMusicScore {
    import {Model} from "./jMusicScore";
    import {Commands} from "./commands";
    import {Views, ScoreApplication} from "./jMusicScore.Views";
    import {UI} from "../jApps/Japps.ui";
    import {Validators} from "./validators";

    export module FinaleUi {

        class FillEmptySpaceValidator implements Validators.IScoreValidator {
            public validate(app: ScoreApplication.IScoreApplication) {
                var scoreDuration: Model.AbsoluteTime;
                if (app.document.bars.length) {
                    var lastBar = app.document.bars[app.document.bars.length - 1];
                    scoreDuration = lastBar.absTime;
                }
                else {
                    scoreDuration = Model.AbsoluteTime.startTime;
                }
                app.document.withVoices((voice: Model.IVoice) => {
                    // Fill voice with placeholders until last bar
                    var voiceLength = voice.getEndTime();
                    while (scoreDuration.gt(voiceLength)) {
                        // Add placeholder until next bar
                        var staffContext = voice.parent.getStaffContext(voiceLength);
                        var meter = staffContext.meter;
                        var timeInBar = staffContext.timeInBar;
                        var restTime = meter.getMeasureTime().sub(staffContext.timeInBar);
                        var newNote = Model.Music.addNote(voice, Model.NoteType.Placeholder, voiceLength, "hidden", restTime);
                        voiceLength = voice.getEndTime();
                    }
                });
            }
        }

        export class FinaleSmartEditPlugin implements ScoreApplication.IScorePlugin {
            init(app: ScoreApplication.IScoreApplication) {
                app.FeedbackManager.registerClient(this.smartEdit);
                app.registerEventProcessor(this.smartEdit);
                app.addValidator(new FillEmptySpaceValidator);
            }

            private smartEdit: FinaleSmartEdit = new FinaleSmartEdit();

            getId(): string { return "FinaleSmartEditPlugin"; }        
        }


        export class FinaleSpeedyEntry implements ScoreApplication.IScoreEventProcessor {
            private noteVals: { [index: string]: { noteId: string; timeVal: Model.TimeSpan; } } = {
                '1': { noteId: 'n1_64', timeVal: new Model.TimeSpan(1, 64) },
                '2': { noteId: 'n1_32', timeVal: new Model.TimeSpan(1, 32) },
                '3': { noteId: 'n1_16', timeVal: new Model.TimeSpan(1, 16) },
                '4': { noteId: 'n1_8', timeVal: Model.TimeSpan.eighthNote },
                '5': { noteId: 'n1_4', timeVal: Model.TimeSpan.quarterNote },
                '6': { noteId: 'n1_2', timeVal: Model.TimeSpan.halfNote },
                '7': { noteId: 'n1_1', timeVal: Model.TimeSpan.wholeNote },
                '8': { noteId: 'n2_1', timeVal: new Model.TimeSpan(2, 1) }
            };

            public init(app: ScoreApplication.IScoreApplication) {
                $('#toolitem40').on('mousedown touchstart', function (ev) {
                    ev.key = "RIGHT";
                    app.processEvent("keypress", { key: "RIGHT" });
                    ev.stopPropagation();
                    ev.preventDefault();
                });
                $('#toolitem41').on('mousedown touchstart', function (ev) {
                    ev.key = "LEFT";
                    app.processEvent("keypress", { key: "LEFT" });
                    ev.stopPropagation();
                    ev.preventDefault();
                });
                $('#toolitem42').on('mousedown touchstart', function (ev) {
                    ev.key = "UP";
                    app.processEvent("keypress", { key: "UP" });
                    ev.stopPropagation();
                    ev.preventDefault();
                });
                $('#toolitem43').on('mousedown touchstart', function (ev) {
                    ev.key = "DOWN";
                    app.processEvent("keypress", { key: "DOWN" });
                    ev.stopPropagation();
                    ev.preventDefault();
                });
                $('#toolitem19').on('mousedown touchstart', function (ev) {
                    ev.key = "ENTER";
                    app.processEvent("keypress", { key: "ENTER" });
                    ev.stopPropagation();
                    ev.preventDefault();
                });
            }

            public exit(app: ScoreApplication.IScoreApplication) {
            }
            /*
            public keydown(app: ScoreApplication.ScoreApplication, event: AbstractApplication.IMessage): boolean {
                var theKeyCode = event.keyCode || event.which;
                var keyDefs = <any>$.ui.keyCode;
                for (var key in keyDefs) {
                    if (theKeyCode == keyDefs[key]) {
                        if (event.altKey) key = 'ALT-' + key;
                        if (event.shiftKey) key = 'SHIFT-' + key;
                        if (event.ctrlKey) key = 'CTRL-' + key;

                        //return this.keyPressed(app, key.toUpperCase());
                        return app.ProcessEvent("keymessage", { key: key });
                    }
                }
                return true;
            }

            public keypress(app: ScoreApplication.ScoreApplication, event: AbstractApplication.IMessage): boolean {
                var key = <string>event.key;
                if (event.ctrlKey || event.altKey) {
                    if (event.altKey) key = 'ALT-' + key;
                    if (event.shiftKey) key = 'SHIFT-' + key;
                    if (event.ctrlKey) key = 'CTRL-' + key;
                }
                return app.ProcessEvent("keymessage", {key: key}); //this.keyPressed(app, key);
            }
            */
            public keymessage(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
                return this.keyPressed(app, event.key);
            }

            public clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
                // note dialog: dblclick
                /*var dlg = new Dialogs.NoteDialog("ed", app);
                dlg.Show(event.data.note);*/
                app.Status.currentPitch = event.pitch;
                app.Status.currentNote = event.note;
                return false;
            }

            public keyPressed(app: ScoreApplication.IScoreApplication, key: string): boolean {
                if (key === 'UP') {//Up a step ↑
                    if (app.Status.currentPitch) {
                        app.Status.currentPitch = new Model.Pitch(app.Status.currentPitch.pitch + 1, "");
                        return false;
                    }
                }
                else if (key === 'DOWN') {//Down a step ↓
                    if (app.Status.currentPitch) {
                        app.Status.currentPitch = new Model.Pitch(app.Status.currentPitch.pitch - 1, "");
                        return false;
                    }
                }
                else if (key === 'RIGHT') {
                    if (app.Status.currentNote) {
                        var nextNote = Model.Music.nextNote(app.Status.currentNote);
                        if (nextNote) {
                            app.Status.currentNote = nextNote;
                            return false;
                        }
                        else {
                            /*var horizPos = app.Status.currentNote.getHorizPosition();
                            horizPos.beforeAfter = 1;
                            app.Status.insertPoint = horizPos;
                            app.Status.currentNote = undefined;
                            app.Status.currentNotehead = undefined;*/
                        }
                    }
                }
                else if (key === 'LEFT') {
                    if (app.Status.currentNote) {
                        var prevNote = Model.Music.prevNote(app.Status.currentNote);
                        if (prevNote)
                            app.Status.currentNote = prevNote;
                        return false;
                    }
                }
                else if (key === 'ENTER') {//Add a note to a chord enter
                    //todo: Change a rest to a note enter
                    if (app.Status.currentNote) {
                        if (app.Status.notesPressed.length) {
                            // replace noteheads with pressed chord
                            var newPitches: Model.Pitch[] = [];
                            for (var i = 0; i < app.Status.notesPressed.length; i++) {
                                newPitches.push(app.Status.notesPressed[i]);
                            }
                            app.executeCommand({
                                oldPitches: [],
                                newPitches: newPitches,
                                execute: function(app: ScoreApplication.IScoreApplication) {
                                    var note = app.Status.currentNote;
                                    this.oldPitches = [];
                                    while (note.noteheadElements.length) {
                                        this.oldPitches.push(note.noteheadElements[0]);
                                        note.removeChild(note.noteheadElements[0]);
                                    }
                                    note.setRest(false);
                                    for (var i = 0; i < this.newPitches.length; i++) {
                                        note.setPitch(this.newPitches[i]);
                                    }
                                },
                                undo: function(app: ScoreApplication.IScoreApplication)  {
                                    var note = app.Status.currentNote;
                                    while (note.noteheadElements.length) { note.removeChild(note.noteheadElements[0]); }
                                    note.setRest(false);
                                    for (var i = 0; i < this.oldPitches.length; i++) {
                                        note.addChild(note.noteheadElements, this.oldPitches[i]);
                                            //.setPitch(app.Status.notesPressed[i]);
                                    }
                                }
                            });
                        }
                        else if (app.Status.currentPitch) {
                            // toggle notehead at insert point
                            if (app.Status.currentNotehead) {
                                app.executeCommand(new Commands.RemoveNoteheadCommand({ head: app.Status.currentNotehead }));
                                app.Status.currentNotehead = undefined;
                            }
                            else {
                                var staffContext = app.Status.currentNote.parent.parent.getStaffContext(app.Status.currentNote.absTime);
                                var alt = staffContext.key.getFixedAlteration(app.Status.currentPitch.pitch);
                                var pitch = new Model.Pitch(app.Status.currentPitch.pitch, alt);
                                app.executeCommand(new Commands.AddNoteheadCommand({
                                    note: app.Status.currentNote,
                                    pitch: pitch
                                }));
                            }
                        }
                    }
                }
                else if (key === '+' || key === "NUMPAD_ADD" || key === 'S') {//Raise by a half step + (plus) or shift-S
                    if (app.Status.currentNotehead) {
                        app.executeCommand(new Commands.RaisePitchAlterationCommand({
                            head: app.Status.currentNotehead,
                            deltaAlteration: 1
                        }));
                        return true;
                    }
                }
                else if (key === 'CTRL-Add' || key === "ALT-Add") { //todo: Raise by a half step (for entire measure) Ctrl - + (plus) - er allerede shortcut til zoom; kan ikke fanges
                }
                else if (key === '-' || key === "NUMPAD_SUBTRACT" || key === 'F') {//Lower by a half step – (minus) or shift - F
                    if (app.Status.currentNotehead) {
                        app.executeCommand(new Commands.RaisePitchAlterationCommand({
                            head: app.Status.currentNotehead,
                            deltaAlteration: -1
                        }));
                        return true;
                    }
                }
                else if (key === 'CTRL--' || key === "ALT-Add") { //todo: Lower by a half step (for entire measure) Ctrl- – (minus) - er allerede shortcut til zoom; kan ikke fanges
                }
                else if (key === 'L' || key === "l") { //Flip stem in opposite direction L
                    if (app.Status.currentNote) {
                        app.executeCommand(new Commands.SetNoteStemDirectionCommand({
                            note: app.Status.currentNote,
                            direction: app.Status.currentNote.spacingInfo.rev ? "UP" : "DOWN"
                        }));
                    }
                }
                else if (key === 'CTRL-l' || key === 'ALT-l') { //Restore stem direction to “floating” status Ctrl - L: duer ikke - er shortcut for adressefeltet
                    if (app.Status.currentNote) {
                        app.executeCommand(new Commands.SetNoteStemDirectionCommand({
                            note: app.Status.currentNote,
                            direction: "FREE"
                        }));
                    }
                }
                else if (key === '9') {//Flip a note to its enharmonic equivalent 9
                    if (app.Status.currentNotehead) {
                        app.executeCommand(new Commands.SetPitchCommand({
                            head: app.Status.currentNotehead,
                            pitch: app.Status.currentNotehead.pitch.getEnharmonicPitch()
                        }));
                    }
                }
                else if (key === 'CTRL-9') {//todo: Flip enharmonic throughout measure Ctrl - 9(cursor on first note in measure)
                    if (app.Status.currentNotehead) {
                        app.executeCommand(new Commands.SetPitchCommand({
                            head: app.Status.currentNotehead,
                            pitch: app.Status.currentNotehead.pitch.getEnharmonicPitch()
                        }));
                    }
                }
                

                else if (key >= '1' && key <= '8') {//Add or change note (64th–double whole note) 1–8
                    var noteType = this.noteVals[key];
                    if (app.Status.currentNote) {
                        var tuplet = app.Status.currentTuplet;
                        if (tuplet) {
                            if (tuplet.fullTime.denominator === 0) {
                                // first note in tuplet - new fulltime = notetime * numereator
                                // note: 1/4, fraction: 2/3: fulltime = 1/2
                                tuplet.fullTime = noteType.timeVal.multiplyScalar(tuplet.fraction.numerator);
                            }
                        }
                        if (app.Status.currentNote.NoteId === 'hidden') {
                            var pitches: Model.Pitch[] = [];
                            if (app.Status.notesPressed.length) {
                                // pressed chord
                                for (var i = 0; i < app.Status.notesPressed.length; i++) {
                                    pitches.push(app.Status.notesPressed[i]);
                                }
                            }
                            app.executeCommand(new Commands.AddNoteCommand({
                                //note: app.Status.currentNote,
                                noteName: noteType.noteId.substr(1),
                                noteTime: noteType.timeVal,
                                grace: false,
                                pitches: pitches,
                                voice: app.Status.currentNote.getVoice(),
                                absTime: app.Status.currentNote.absTime,
                                rest: (pitches.length === 0),
                                dots: 0,
                                tuplet: tuplet
                            }));
                        }
                        else {
                            app.executeCommand(new Commands.SetNoteDurationCommand({
                                note: app.Status.currentNote,
                                noteId: noteType.noteId,
                                timeVal: noteType.timeVal,
                                dots: 0,
                                tuplet: tuplet
                            }));
                        }
                        app.Status.currentTuplet = undefined;
                    }
                }
                else if (key === 'NUMPAD_MULTIPLY' || key === '*') { //Show/hide any accidental * (asterisk)
                    if (app.Status.currentNotehead) {
                        app.executeCommand({
                            execute: (app: ScoreApplication.IScoreApplication) => { app.Status.currentNotehead.forceAccidental = !app.Status.currentNotehead.forceAccidental; },
                            undo: (app: ScoreApplication.IScoreApplication) => { app.Status.currentNotehead.forceAccidental = !app.Status.currentNotehead.forceAccidental; }
                        });
                    }
                }
                else if (key === '.') {//Add a dot . (period)
                    if (app.Status.currentNote) {
                        app.executeCommand({
                            execute: (app: ScoreApplication.IScoreApplication) => {
                                if (app.Status.currentNote.dotNo)
                                    app.Status.currentNote.dotNo++;
                                else app.Status.currentNote.dotNo = 1;
                            },
                            undo: (app: ScoreApplication.IScoreApplication) => {
                                if (app.Status.currentNote.dotNo > 0)
                                    app.Status.currentNote.dotNo--;
                            }
                        });
                    }
                }
                else if (key === 'a') { //todo: Show/hide a courtesy accidental A
                }
                else if (key === 'DELETE') {//Remove note, rest or chord delete
                    if (app.Status.currentNote) {
                        var nextNote = Model.Music.nextNote(app.Status.currentNote);
                        app.executeCommand(new Commands.DeleteNoteCommand({ note: app.Status.currentNote }));
                        app.Status.currentNote = nextNote;
                    }
                }
                else if (key === '=' || key === 't' || key === 'T') {//Tie / untie to next note = (equals) or T
                    /* todo:
Tie / untie to previous note Ctrl = (equals) or shift - T
Flip a tie Ctrl - F
Restore tie direction to automatic Ctrl - shift - F*/
                    if (app.Status.currentNotehead) {
                        app.executeCommand(new Commands.TieNoteheadCommand({
                            head: app.Status.currentNotehead,
                            toggle: true,
                            forced: false
                        }));
                    }
                    else
                        if (app.Status.currentNote) {
                            app.executeCommand(new Commands.TieNoteCommand({
                                note: app.Status.currentNote,
                                forced: false,
                                toggle: true
                            }));
                        }
                }
                else if (key === "'") {
                    if (app.Status.currentVoice) {
                        var voice = app.Status.currentVoice;
                        var staff = voice.parent;
                        if (staff.voiceElements.length > 1) {
                            var i = staff.voiceElements.indexOf(voice);
                            if (++i >= staff.voiceElements.length) i = 0;
                            app.Status.currentVoice = staff.voiceElements[i];
                        }
                    }
                }
                else if (key === 'CTRL-2') {//Begin a tuplet (duplet–octuplet) Ctrl-2 through Ctrl-8
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(3, 2));
                }
                else if (key === 'CTRL-3') {
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(2, 3));
                }
                else if (key === 'CTRL-4') {
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(3, 4));
                }
                else if (key === 'CTRL-5') {
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(4, 5));
                }
                else if (key === 'CTRL-6') {
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(4, 6));
                }
                else if (key === 'CTRL-7') {
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(4, 7));
                }
                else if (key === 'CTRL-8') {
                    app.Status.currentTuplet = new Model.TupletDef(new Model.TimeSpan(1, 0), new Model.Rational(6, 8));
                }
                else if (key === 'SHIFT-DOWN') {
                    alert("Ned");
                }
                else if (key === 'SHIFT-UP') {
                    alert("Ned");
                }
                else if (key === 'NUMPAD_MULTIPLY') {
                }
                else if (key === 'NUMPAD_MULTIPLY') {
                }
                else { // '='
                    //$('');
                }
                /*
Display the Edit Frame dialog box Ctrl-click any measure that contains music
Hide/show note or rest letter O or H
Add or remove accidental parentheses P
Jump to previous measure [ (left square bracket) or shift-←
Jump to next measure ] (right square bracket) or shift-→
Change to/from a grace note ; (semicolon) or G2
Change to/from a slashed flagged grace note ` (accent) or ; (semicolon) or G
Voice 1/2 ' (apostrophe)
Switch to next layer shift–' (apostrophe)
Move editing frame down a staff shift-↓
Move editing frame up a staff shift-↑
Add or change 128th note Ctrl-0 (zero)
Insert 64th note–whole note shift-1 through shift-7 (on keyboard only) (with MIDI, while playing note)
Insert 128th note (without MIDI) Ctrl-0 (zero) (in insert mode only)
Add 64th rest–whole rest (with MIDI) shift-1 through shift-7 without pressing note
Add rest (with or without MIDI) Ctrl-shift-1-7 (on keyboard only)
Add 128th rest (with MIDI) Ctrl-0 (zero)
Add a rest (with Hands-Free MIDI) play any three note cluster
Toggle Insert mode insert (or shift-0 (zero) Num Pad only)
Constrain dragging a note (horizontal/vertical) shift-drag
Define a tuplet Ctrl-1
Flat note F
Sharp note S
Natural note N
Double-sharp X
Double-flat V
Move to first note or rest in measure Ctrl-¨
Move just beyond last note or rest in measure Ctrl-Æ
Remove note from chord backspace
Change single note to rest backspace or R
Break/join beam from previous note / (backslash) or B
Restore default beaming Shift-B
Flatten a beam \ (forward slash) or M
Restore courtesy accidental to optional status Ctrl-* (asterisk)
#Return a rest to its default position * (asterisk)
Exit measure and redraw/re-enter measure 0 (zero)

Specify a pitch, high C–B (without MIDI) Q-W-E-R-T-Y-U (with Caps Lock)                
Specify a pitch, middle C–B (without MIDI) A-S-D-F-G-H-J (with Caps Lock)
Specify a pitch, low C–B (without MIDI) Z-X-C-V-B-N-M (with Caps Lock)
Raise all pitch keys an octave , (comma) (with Caps Lock)
Lower all pitch keys an octave I (letter I) (with Caps Lock)
Restore all pitch keys to normal register K (with Caps Lock)
                */
                return true;
            }
        }

        class FinaleSmartEdit implements JApps.Application.IFeedbackClient, ScoreApplication.IScoreEventProcessor {
            changed(status: JApps.Application.IStatusManager, key: string, val: any) {
                if (key === "currentNote") {
                    // flyt denne til 
                }
            }

            init(app: ScoreApplication.IScoreApplication): void { }
            exit(app: ScoreApplication.IScoreApplication): void { }

            /*public clicknote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                app.Status.currentNote = note;
                return true;
            }*/

            /*midinoteoff (app: ScoreApplication.ScoreApplication, event: Event): boolean { return false; }
            keypressed (app: ScoreApplication.ScoreApplication, event: Event): boolean { return false; }
            keyup (app: ScoreApplication.ScoreApplication, event: Event): boolean { return false; }
            keydown (app: ScoreApplication.ScoreApplication, event: Event): boolean { return false; }*/
        }
    }
//}