﻿module jMusicScore {
    export module Model {

        export class ClearScoreCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            */

            Execute(app: Application.Application) {
                app.score.clear();
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
        export class AddNoteCommand implements Application.ICommand {
            constructor(private args: AddNoteArgs) { }

            // todo: fjern absTime eller beforeNote

            public Execute(app: Application.Application) {
                var note = Music.AddNote(this.args.voice, this.args.rest ? NoteType.rest : NoteType.note, this.args.absTime, 'n' + this.args.noteName, this.args.noteTime,
                    this.args.beforeNote, true, this.args.dots, this.args.tuplet);
                if (this.args.grace) note.graceType = "normal";

                for (var i = 0; i < this.args.pitches.length; i++) {
                    note.setPitch(this.args.pitches[i]);
                }
            }
        }

        export interface IDeleteNoteArgs {
            note: INote;
        }
        export class DeleteNoteCommand implements Application.ICommand {
            constructor(private args: IDeleteNoteArgs) { }
            
            Execute(app: Application.Application) {
                var voice = this.args.note.parent;
                voice.removeChild(this.args.note);
            }
        }

        export class DeleteNoteheadCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            head
            */

            Execute(app: Application.Application) {
                var head = <Model.INotehead>this.args.head;
                var note = head.parent;
                note.removeChild(head);
            }
        }

        export class SetVoiceStemDirectionCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            note
            direction
            */

            public Execute(app: Application.Application) {
                var direction = this.args.direction;
                var voice = <IVoice>this.args.voice;
                voice.setStemDirection(<number>direction);                
            }
        }

        export class SetNoteStemDirectionCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            note
            direction ['UP','DOWN','FREE']
            */

            public Execute(app: Application.Application) {
                var direction = this.args.direction;
                var note = <INote>this.args.note;
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
        }

        export interface NoteDurationArgs {
            note: INote;
            noteId: string;
            timeVal: TimeSpan;
            dots: number;
            tuplet?: TupletDef;
        }
        export class SetNoteDurationCommand implements Application.ICommand {
            constructor(private args: NoteDurationArgs) { }

            public Execute(app: Application.Application) {
                var note = this.args.note;
                note.noteId = this.args.noteId;
                note.timeVal = this.args.timeVal;
                note.tupletDef = this.args.tuplet;
                note.dotNo = this.args.dots;
                note.setSpacingInfo(undefined);
            }
        }

        export class AddNoteheadCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            note
            pitch (Value)
            */

            public Execute(app: Application.Application) {
                var pitch = <Pitch>this.args.pitch;
                var note = <INote>this.args.note;
                note.setRest(false);
                note.setPitch(pitch);
            }
        }

        export class RemoveNoteheadCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            head (Element)
            */

            public Execute(app: Application.Application) {
                var head = <INotehead>this.args.head;
                var note = head.parent;
                var voice = note.parent;

                // Hvis node med én head: slet
                /*if (note.matchesOnePitch(head.getPitch(), true) || note.rest) {
                    var voice = note.parent;
                    voice.removeChild(note);
                }
                // Hvis node med mange heades: slet denne head
                else*/ if (note.matchesPitch(head.getPitch(), true) || note.rest) {
                    note.removeChild(head);
                    note.setRest(note.noteheadElements.length === 0);
                }
            }
        }

        export interface ISetPitchCommand {
            head: INotehead;
            pitch: Pitch;
        }
        export class SetPitchCommand implements Application.ICommand {
            constructor(private args: ISetPitchCommand) { }

            public Execute(app: Application.Application) {
                this.args.head.pitch.pitch = this.args.pitch.pitch;
                this.args.head.pitch.alteration = this.args.pitch.alteration;
            }
        }

        export class RaisePitchAlterationCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            head (Element)
            absAlteration || deltaAlteration
            */

            // execute
            public Execute(app: Application.Application) {
                var head = <INotehead>this.args.head;
                if (this.args.deltaAlteration) {
                    head.pitch.raiseAlteration(this.args.deltaAlteration);
                }
                else if (this.args.absAlteration !== undefined) {
                    head.pitch.alteration = this.args.absAlteration;
                }
            }
        }

        export class AddNoteDecorationCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            note
            expression
            placement
            */

            public Execute(app: Application.Application) {
                var note = <INote>this.args.note;
                var deco = new Model.NoteDecorationElement(note, this.args.expression);
                deco.placement = this.args.placement;
                note.addChild(note.decorationElements, deco);
            }
        }


        export class UpdateStaffCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            staff
            index
            title
            initClef
            // StaffType (TAB/singleline etc)
            */

            public Execute(app: Application.Application) {
                var staff = <IStaff>this.args.staff;
                if (this.args.title) {
                    staff.title = this.args.title;
                }
                // staff order
                ScoreElement.PlaceInOrder(app.score, staff, this.args.index);
            }
        }

        export class NewStaffCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            index
            title
            initClef (ClefDefinition)
            // StaffType (TAB/singleline etc)
            */

            public Execute(app: Application.Application) {
                var initClef = <Model.ClefDefinition>this.args.initClef;
                var staff = app.score.addStaff(initClef);
                staff.title = this.args.title;
                staff.addVoice();
                ScoreElement.PlaceInOrder(app.score, staff, this.args.index);
            }
        }


        export class TieNoteheadCommand implements Application.ICommand {
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

            public Execute(app: Application.Application) {
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

        export class TieNoteCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            note
            forced
            remove
            toggle
            */

            public Execute(app: Application.Application) {
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

        export class SetMeterCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            meter: MeterDefinition
            absTime
            staff?
            */

            public Execute(app: Application.Application) {
                var meter = <IMeterDefinition>this.args.meter;
                var absTime = <AbsoluteTime>this.args.absTime;
                var staff = <IStaff>this.args.staff;
                if (staff) {
                    // staff meter
                    staff.setMeter(meter, absTime);
                }
                else {
                    // score meter
                    app.score.setMeter(meter, absTime);
                }
            }
        }

        export class SetKeyCommand implements Application.ICommand { // todo: KeyDefinition
            constructor(private args: any) { }

            /* args:
            key (definition)
            absTime
            staff?
            */

            public Execute(app: Application.Application) {
                var key = <IKeyDefinition>this.args.key;
                var absTime = <AbsoluteTime>this.args.absTime;
                var staff = <IStaff>this.args.staff;
                if (staff) {
                    // staff key
                    staff.setKey(key, absTime);
                }
                else {
                    // score key
                    app.score.setKey(key, absTime);
                }
            }
        }

        export class SetClefCommand implements Application.ICommand {
            constructor(private args: any) { }

            /* args:
            clef
            absTime
            staff
            */

            public Execute(app: Application.Application) {
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
        //note.addChild(note.decorationElements, deco);
    }
}