module jMusicScore {
    export module Model {

        export interface ScoreCommand extends Application.ICommand<IScore, ScoreApplication.ScoreStatusManager, JQuery> {}

        export class ClearScoreCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            */
            private _memento: Model.IMemento;

            Execute(app: ScoreApplication.ScoreApplication) {
                this._memento = app.document.getMemento();
                app.document.clear();
            }

            Undo(app: ScoreApplication.ScoreApplication) {
                app.document = <IScore>Model.MusicElementFactory.RecreateElement(null, this._memento);
            }
        }

        export interface AddNoteArgs {
            noteName: string; /* '1_4' */
            noteTime: Model.TimeSpan;
            rest: boolean;
            dots: number;
            grace: boolean;
            pitches: Pitch[];
            voice: IVoice;
            absTime: AbsoluteTime;
            beforeNote?: INote;
            tuplet?: TupletDef;
        }
        export class AddNoteCommand implements ScoreCommand {
            constructor(private args: AddNoteArgs) { }

            // todo: fjern absTime eller beforeNote
            private _note: INote;

            public Execute(app: ScoreApplication.ScoreApplication) {
                this._note = Music.AddNote(this.args.voice, this.args.rest ? NoteType.rest : NoteType.note, this.args.absTime, 'n' + this.args.noteName, this.args.noteTime,
                    this.args.beforeNote, true, this.args.dots, this.args.tuplet);
                if (this.args.grace) this._note.graceType = "normal";

                for (var i = 0; i < this.args.pitches.length; i++) {
                    this._note.setPitch(this.args.pitches[i]);
                }
            }

            Undo(app: ScoreApplication.ScoreApplication) {
                var voice = this._note.parent;
                voice.removeChild(this._note);
            }
        }

        export interface IDeleteNoteArgs {
            note: INote;
        }
        export class DeleteNoteCommand implements ScoreCommand {
            constructor(private args: IDeleteNoteArgs) { }
            
            private _memento: Model.IMemento;
            private _voice: Model.IVoice;

            Execute(app: ScoreApplication.ScoreApplication) {
                this._memento = this.args.note.getMemento();
                this._voice = this.args.note.parent;
                this._voice.removeChild(this.args.note);
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var note = Model.MusicElementFactory.RecreateElement(this._voice, this._memento);
            }

        }

        export class DeleteNoteheadCommand implements ScoreCommand {
            constructor(private args: { head:INotehead }) { }

            /* args:
            head
            */
            private _memento: IMemento;
            private _note: INote;

            Execute(app: ScoreApplication.ScoreApplication) {
                var head = <Model.INotehead>this.args.head;
                this._note = head.parent;
                this._memento = head.getMemento();
                this._note.removeChild(head);
            }

            Undo(app: ScoreApplication.ScoreApplication) {
                MusicElementFactory.RecreateElement(this._note, this._memento);
            }
        }

        export class SetVoiceStemDirectionCommand implements ScoreCommand {
            constructor(private args: { voice: IVoice; direction: StemDirectionType; }) { }

            private _oldDirection: Model.StemDirectionType;

            public Execute(app: ScoreApplication.ScoreApplication) {
                var direction = this.args.direction;
                var voice = this.args.voice;
                this._oldDirection = voice.getStemDirection();
                voice.setStemDirection(direction);                
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var voice = this.args.voice;
                voice.setStemDirection(this._oldDirection);
            }   
        }

        export class SetNoteStemDirectionCommand implements ScoreCommand {
            constructor(private args: { note: INote; direction: any; }) { }

            /* args:
            note
            direction ['UP','DOWN','FREE']
            */
            private _oldDirection: Model.StemDirectionType;

            public Execute(app: ScoreApplication.ScoreApplication) {
                var direction = this.args.direction;
                var note = <INote>this.args.note;

                this._oldDirection = note.getStemDirection();

                if (typeof (direction) === "number") {
                    note.setStemDirection(<Model.StemDirectionType>direction);
                }
                else if (direction === "UP") {
                    note.setStemDirection(Model.StemDirectionType.stemUp);
                }
                else if (direction === "DOWN") {
                    note.setStemDirection(Model.StemDirectionType.stemDown);
                }
                else {
                    note.setStemDirection(Model.StemDirectionType.stemFree);
                }
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var note = <INote>this.args.note;
                note.setStemDirection(this._oldDirection);
            }       
        }

        export interface NoteDurationArgs {
            note: INote;
            noteId: string;
            timeVal: TimeSpan;
            dots: number;
            tuplet?: TupletDef;
        }
        export class SetNoteDurationCommand implements ScoreCommand {
            constructor(private args: NoteDurationArgs) { }

            private oldDuration: NoteDurationArgs;

            public Execute(app: ScoreApplication.ScoreApplication) {
                var note = this.args.note;
                this.oldDuration = {
                    note: note,
                    noteId: note.noteId,
                    timeVal: note.timeVal,
                    dots: note.dotNo,
                    tuplet: note.tupletDef
                }
                note.noteId = this.args.noteId;
                note.timeVal = this.args.timeVal;
                note.tupletDef = this.args.tuplet;
                note.dotNo = this.args.dots;
                note.setSpacingInfo(undefined);
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var note = this.args.note;
                note.noteId = this.oldDuration.noteId;
                note.timeVal = this.oldDuration.timeVal;
                note.tupletDef = this.oldDuration.tuplet;
                note.dotNo = this.oldDuration.dots;
                note.setSpacingInfo(undefined);
            }
        }

        export class AddNoteheadCommand implements ScoreCommand {
            constructor(private args: { note: Model.INote; pitch: Model.Pitch; }) { }

            //private noteMemento: IMemento;

            public Execute(app: ScoreApplication.ScoreApplication) {
                var pitch = this.args.pitch;
                var note = this.args.note;
                //this.noteMemento = note.getMemento();
                note.setRest(false);
                note.setPitch(pitch);
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var note = this.args.note;
                var pitch = this.args.pitch;
                /*note.parent.removeChild(note); // todo: what if other commands in undo stack refer to note?
                this.args.note = <Model.INote>Model.MusicElementFactory.RecreateElement(note.parent, this.noteMemento);*/
                if (note.matchesPitch(pitch, true) || note.rest) {
                    note.withHeads((head: INotehead) => {
                        if (head.matchesPitch(pitch, false)) {
                            note.removeChild(head);
                        }
                    });
                    note.setRest(note.noteheadElements.length === 0);
                }
            }
        }

        export class RemoveNoteheadCommand implements ScoreCommand {
            constructor(private args: { head: Model.INotehead; }) { }

            private head: INotehead;
            private note: INote;

            public Execute(app: ScoreApplication.ScoreApplication) {
                var head = this.args.head;
                var note = head.parent;
                var voice = note.parent;
                
                if (note.matchesPitch(head.getPitch(), true) || note.rest) {
                    this.head = head;
                    this.note = note;
                    note.removeChild(head);
                    note.setRest(note.noteheadElements.length === 0);
                }
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                if (this.head) {
                    this.note.addChild(this.note.noteheadElements, this.head);
                    this.note.setRest(this.note.noteheadElements.length === 0);
                }
            }
        }

        export interface ISetPitchCommand {
            head: INotehead;
            pitch: Pitch;
        }
        export class SetPitchCommand implements ScoreCommand {
            constructor(private args: ISetPitchCommand) { }

            private oldPitch: Pitch;

            public Execute(app: ScoreApplication.ScoreApplication) {
                this.oldPitch = this.args.head.pitch;
                this.args.head.pitch.pitch = this.args.pitch.pitch;
                this.args.head.pitch.alteration = this.args.pitch.alteration;
            }

            public Undo(app: ScoreApplication.ScoreApplication) {                 
                this.args.head.pitch.pitch = this.oldPitch.pitch;
                this.args.head.pitch.alteration = this.oldPitch.alteration;
            }
        }

        export class RaisePitchAlterationCommand implements ScoreCommand {
            constructor(private args: { head: INotehead; absAlteration?: string; deltaAlteration?: number }) { }

            /* args:
            head (Element)
            absAlteration || deltaAlteration
            */
            private oldAlteration: string;

            // execute
            public Execute(app: ScoreApplication.ScoreApplication) {
                var head = this.args.head;
                this.oldAlteration = head.pitch.alteration;
                if (this.args.deltaAlteration) {
                    head.pitch.raiseAlteration(this.args.deltaAlteration);
                }
                else if (this.args.absAlteration !== undefined) {
                    head.pitch.alteration = this.args.absAlteration;
                }
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var head = this.args.head;
                head.pitch.alteration = this.oldAlteration;
            }
        }

        export class AddNoteDecorationCommand implements ScoreCommand {
            constructor(private args: { note: INote; expression: NoteDecorationKind; placement: string; }) { }

            private theDeco: INoteDecorationElement;

            public Execute(app: ScoreApplication.ScoreApplication) {
                var note = this.args.note;
                this.theDeco = new Model.NoteDecorationElement(note, this.args.expression);
                this.theDeco.placement = this.args.placement;
                note.addChild(note.decorationElements, this.theDeco);
            }

            public Undo(app: ScoreApplication.ScoreApplication) {
                var note = this.args.note;
                note.removeChild(this.theDeco, note.decorationElements);
            }
        }


        export class UpdateStaffCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            staff
            index
            title
            initClef
            // StaffType (TAB/singleline etc)
            */

            public Execute(app: ScoreApplication.ScoreApplication) {
                var staff = <IStaff>this.args.staff;
                if (this.args.title) {
                    staff.title = this.args.title;
                }
                // staff order
                ScoreElement.PlaceInOrder(app.document, staff, this.args.index);
            }
        }

        export class NewStaffCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            index
            title
            initClef (ClefDefinition)
            // StaffType (TAB/singleline etc)
            */

            public Execute(app: ScoreApplication.ScoreApplication) {
                var initClef = <Model.ClefDefinition>this.args.initClef;
                var staff = app.document.addStaff(initClef);
                staff.title = this.args.title;
                staff.addVoice();
                ScoreElement.PlaceInOrder(app.document, staff, this.args.index);
            }
        }


        export class TieNoteheadCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            head
            forced
            remove
            toggle
            */

            /*public static SetTie(head: INotehead, forced: boolean) {
                head.tie = true;
                head.tieForced = forced;
            }

            public static RemoveTie(head: INotehead) {
                head.tie = false;
            }*/

            public Execute(app: ScoreApplication.ScoreApplication) {
                var head = <INotehead>this.args.head;
                var forced = this.args.forced || false;
                var remove = this.args.remove || (this.args.toggle && head.tie);
                if (remove) {
                    //TieNoteheadCommand.RemoveTie(head);
                    head.tie = false;

                }
                else {
                    //TieNoteheadCommand.SetTie(head, forced);
                    head.tie = true;
                    head.tieForced = forced;
                }
            }
        }

        export class TieNoteCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            note
            forced
            remove
            toggle
            */

            public Execute(app: ScoreApplication.ScoreApplication) {
                var note = <INote>this.args.note;
                var forced = this.args.forced || false;
                note.withHeads((head: INotehead, index: number) => {
                    var remove = this.args.remove || (this.args.toggle && head.tie);
                    if (remove) {
                        //TieNoteheadCommand.RemoveTie(head);
                        head.tie = false;
                    }
                    else {
                        //TieNoteheadCommand.SetTie(head, forced);
                        head.tie = true;
                        head.tieForced = forced;
                    }
                });
            }
        }

        export class SetMeterCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            meter: MeterDefinition
            absTime
            staff?
            */

            public Execute(app: ScoreApplication.ScoreApplication) {
                var meter = <IMeterDefinition>this.args.meter;
                var absTime = <AbsoluteTime>this.args.absTime;
                var staff = <IStaff>this.args.staff;
                if (staff) {
                    // staff meter
                    staff.setMeter(meter, absTime);
                }
                else {
                    // score meter
                    app.document.setMeter(meter, absTime);
                }
            }
        }

        export class SetKeyCommand implements ScoreCommand { // todo: KeyDefinition
            constructor(private args: any) { }

            /* args:
            key (definition)
            absTime
            staff?
            */

            public Execute(app: ScoreApplication.ScoreApplication) {
                var key = <IKeyDefinition>this.args.key;
                var absTime = <AbsoluteTime>this.args.absTime;
                var staff = <IStaff>this.args.staff;
                if (staff) {
                    // staff key
                    staff.setKey(key, absTime);
                }
                else {
                    // score key
                    app.document.setKey(key, absTime);
                }
            }
        }

        export class SetClefCommand implements ScoreCommand {
            constructor(private args: any) { }

            /* args:
            clef
            absTime
            staff
            */

            public Execute(app: ScoreApplication.ScoreApplication) {
                var clef = <ClefDefinition>this.args.clef;
                var absTime = <AbsoluteTime>this.args.absTime;
                var staff = <IStaff>this.args.staff;
                staff.setClef(clef, absTime);
            }
        }

        //NoteElement.setBeamspan setDots setPitch setStemDirection
        //PitchElement.recalc setdots setPitch
        //Notedeco setDecorationId
        //TextSyllableElement settext
        //MeasureMap generateMap
        //Score addBarLine 
        //Voice setStemDirection
        //ClefElement setclef
    }
}