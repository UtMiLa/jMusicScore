﻿//module JMusicScore {
    import {Model} from "./jMusicScore";
    import {Views} from "./jMusicScore.Views";
    import { ScoreApplication } from "./jMusicScore.Application";
    import{Application} from "../jApps/application";

    export module Commands {

        export class MacroExporter {
            //todo: StemDirectionType, NoteDecorationKind, ClefDefinition, IMeterDefinition, IKeyDefinition
            //todo: bundleCommand
            //todo: Finale: Add a dot . (period); Show/hide any accidental; Add a note to a chord enter;
            //todo: test menu: Recreate score; Debug to lyrics; 
            static makeMacro(cmd: { args: {} }): { commandName: string; args: {}} {
                var cmdName = cmd.constructor.toString();

                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec(cmdName);
                cmdName = (results && results.length > 1) ? results[1] : "";

                return {
                    commandName: cmdName,
                    args: MacroExporter.exportArgs(cmd.args)
                };
            }

            static exportString(s: string): string {
                return JSON.stringify(s); // `"${s}"`; // todo: escape "
            }
            static exportPitch(pitch: Model.Pitch): string {
                return `new JMusicScore.Model.Pitch(${pitch.pitch},'${pitch.alteration}')`;
            }
            static exportTimespan(timespan: Model.TimeSpan): string {
                return `new JMusicScore.Model.TimeSpan(${timespan.numerator},${timespan.denominator})`;
            }
            static exportTime(time: Model.AbsoluteTime): string {
                return `new JMusicScore.Model.AbsoluteTime(${time.numerator},${time.denominator})`;
            }
            static exportRational(rat: Model.Rational): string {
                return `new JMusicScore.Model.Rational(${rat.numerator},${rat.denominator})`;
            }
            static exportTuplet(tupletDef: Model.TupletDef): any {
                return `new JMusicScore.Model.TupletDef(${this.exportTimespan(tupletDef.fullTime)}, ${this.exportRational(tupletDef.fraction)})`;
            }

            static exportArgs(args: {}): {} {
                var elms: { [key:string]:string; } = {};
                $.each(args, (key: string, val: string) => {
                    elms[key] = MacroExporter.exportArg(val);
                });
                return elms;
            }

            static exportMusicElm(elm: Model.IMusicElement): string {
                var elmName = elm.getElementName();
                var index: number;
                if (elmName === "Score") {
                    return "app.document";
                }
                if (elmName === "Staff") {
                    index = (<Model.IStaff>elm).parent.staffElements.indexOf(<Model.IStaff>elm);
                    return this.exportMusicElm(elm.parent) + '.staffElements[' + index + ']';
                }
                if (elmName === "Voice") {
                    index = (<Model.IVoice>elm).parent.voiceElements.indexOf(<Model.IVoice>elm);
                    return this.exportMusicElm(elm.parent) + '.voiceElements[' + index + ']';
                }
                if (elmName === "Note") {
                    index = (<Model.INote>elm).parent.noteElements.indexOf(<Model.INote>elm);
                    return this.exportMusicElm(elm.parent) + '.noteElements[' + index + ']';
                }
                if (elmName === "Notehead") {
                    index = (<Model.INotehead>elm).parent.noteheadElements.indexOf(<Model.INotehead>elm);
                    return this.exportMusicElm(elm.parent) + '.noteheadElements[' + index + ']';
                }
                
                return `null /*'${elmName}' */ `;
            }

            static exportArg(arg: any): string {
                var typ = typeof (arg);
                switch (typ) {
                case "string":
                    return this.exportString(arg);
                case "number":
                    return arg.toString();
                case "boolean":
                    return arg.toString();
                case "object":
                    if (arg === null) return 'null';
                    if (Array.isArray(arg)) {
                        var resArr: string[] = [];
                        for (var i = 0; i < arg.length; i++) {
                            resArr.push(this.exportArg(arg[i]));
                        }
                        return `[${resArr.join(',')}]`;
                    } else {
                        if (arg.getElementName) {
                            // MusicElement
                            return this.exportMusicElm(<Model.IMusicElement>arg);
                        } else {
                            // non-musicElement object
                            if (arg instanceof Model.Pitch) return this.exportPitch(arg);
                            if (arg instanceof Model.TimeSpan) return this.exportTimespan(arg);
                            if (arg instanceof Model.AbsoluteTime) return this.exportTime(arg);
                            if (arg instanceof Model.TupletDef) return this.exportTuplet(arg);
                            
                            return "OBJECT";
                        }
                    }
                    //break;
                case "function":
                    return "FUNCTION";
                case "symbol":
                    return "SYMBOL";
                case "undefined":
                    return undefined;
                default:
                }
                return "UNKNOWN";
            }

        }

        export interface IScoreCommand extends Application.ICommand<Model.IScore, ScoreApplication.ScoreStatusManager> {}

        export interface IMacroCommand {
            commandName: string;
            args: {};
        }
        
        export class BundleCommand implements IScoreCommand {
            constructor(commands: IScoreCommand[]) {
                for (var i = 0; i < commands.length; i++) {
                    this.add(commands[i]);
                }
            }

            /* args:
            */
            private commands: IScoreCommand[] = [];

            public add(cmd: IScoreCommand) {
                this.commands.push(cmd);
            }

            execute(app: ScoreApplication.IScoreApplication) {
                var canUndo = true;
                for (var i = 0; i < this.commands.length; i++) {
                    this.commands[i].execute(app);
                    canUndo = canUndo && !!this.commands[i].undo;
                }
                if (canUndo) {
                    this.undo = (app1: ScoreApplication.IScoreApplication) => {
                        for (var i = this.commands.length - 1; i >= 0; i--) {
                            this.commands[i].undo(app1);
                        }
                    };
                }
            }

            public undo: (app: ScoreApplication.IScoreApplication) => void;
        }


        export class ClearScoreCommand implements IScoreCommand {
            constructor(private args: any) { }

            /* args:
            */
            private memento: Model.IMemento;

            execute(app: ScoreApplication.IScoreApplication) {
                this.memento = app.document.getMemento();
                app.document.clear();
            }

            undo(app: ScoreApplication.IScoreApplication) {
                app.document = <Model.IScore>Model.MusicElementFactory.recreateElement(null, this.memento);
            }
        }

        export interface IAddNoteArgs {
            noteName: string; /* '1_4' */
            noteTime: Model.TimeSpan;
            rest: boolean;
            dots: number;
            grace: boolean;
            pitches: Model.Pitch[];
            voice: Model.IVoice;
            absTime: Model.AbsoluteTime;
            beforeNote?: Model.INote;
            tuplet?: Model.TupletDef;
        }
        export class AddNoteCommand implements IScoreCommand {
            constructor(private args: IAddNoteArgs) { }

            // todo: fjern absTime eller beforeNote
            private note: Model.INote;

            public execute(app: ScoreApplication.IScoreApplication) {
                this.note = Model.Music.addNote(this.args.voice, this.args.rest ? Model.NoteType.Rest : Model.NoteType.Note, this.args.absTime, 'n' + this.args.noteName, this.args.noteTime,
                    this.args.beforeNote, true, this.args.dots, this.args.tuplet);
                if (this.args.grace) this.note.graceType = "normal";

                for (var i = 0; i < this.args.pitches.length; i++) {
                    this.note.setPitch(this.args.pitches[i]);
                }
            }

            undo(app: ScoreApplication.IScoreApplication) {
                var voice = this.note.parent;
                voice.removeChild(this.note);
            }
        }

        export interface IDeleteNoteArgs {
            note: Model.INote;
        }
        export class DeleteNoteCommand implements IScoreCommand {
            constructor(private args: IDeleteNoteArgs) { }
            
            private memento: Model.IMemento;
            private voice: Model.IVoice;

            execute(app: ScoreApplication.IScoreApplication) {
                this.memento = this.args.note.getMemento();
                this.voice = this.args.note.parent;
                this.voice.removeChild(this.args.note);
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var note = Model.MusicElementFactory.recreateElement(this.voice, this.memento);
            }

        }

        export class DeleteNoteheadCommand implements IScoreCommand {
            constructor(private args: { head:Model.INotehead }) { }

            /* args:
            head
            */
            private memento: Model.IMemento;
            private note: Model.INote;

            execute(app: ScoreApplication.IScoreApplication) {
                var head = this.args.head;
                this.note = head.parent;
                this.memento = head.getMemento();
                this.note.removeChild(head);
            }

            undo(app: ScoreApplication.IScoreApplication) {
                Model.MusicElementFactory.recreateElement(this.note, this.memento);
            }
        }

        export class SetVoiceStemDirectionCommand implements IScoreCommand {
            constructor(private args: { voice: Model.IVoice; direction: Model.StemDirectionType; }) { }

            private oldDirection: Model.StemDirectionType;

            public execute(app: ScoreApplication.IScoreApplication) {
                var direction = this.args.direction;
                var voice = this.args.voice;
                this.oldDirection = voice.getStemDirection();
                voice.setStemDirection(direction);                
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var voice = this.args.voice;
                voice.setStemDirection(this.oldDirection);
            }   
        }

        export class SetNoteStemDirectionCommand implements IScoreCommand {
            constructor(private args: { note: Model.INote; direction: any; }) { }

            /* args:
            note
            direction ['UP','DOWN','FREE']
            */
            private oldDirection: Model.StemDirectionType;

            public execute(app: ScoreApplication.IScoreApplication) {
                var direction = this.args.direction;
                var note = this.args.note;

                this.oldDirection = note.getStemDirection();

                if (typeof (direction) === "number") {
                    note.setStemDirection(<Model.StemDirectionType>direction);
                }
                else if (direction === "UP") {
                    note.setStemDirection(Model.StemDirectionType.StemUp);
                }
                else if (direction === "DOWN") {
                    note.setStemDirection(Model.StemDirectionType.StemDown);
                }
                else {
                    note.setStemDirection(Model.StemDirectionType.StemFree);
                }
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                note.setStemDirection(this.oldDirection);
            }       
        }

        export interface INoteDurationArgs {
            note: Model.INote;
            noteId: string;
            timeVal: Model.TimeSpan;
            dots: number;
            tuplet?: Model.TupletDef;
        }
        export class SetNoteDurationCommand implements IScoreCommand {
            constructor(private args: INoteDurationArgs) { }

            private oldDuration: INoteDurationArgs;

            public execute(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                this.oldDuration = {
                    note: note,
                    noteId: note.NoteId,
                    timeVal: note.timeVal,
                    dots: note.dotNo,
                    tuplet: note.tupletDef
                }
                note.NoteId = this.args.noteId;
                note.timeVal = this.args.timeVal;
                note.tupletDef = this.args.tuplet;
                note.dotNo = this.args.dots;
                note.setSpacingInfo(undefined);
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                note.NoteId = this.oldDuration.noteId;
                note.timeVal = this.oldDuration.timeVal;
                note.tupletDef = this.oldDuration.tuplet;
                note.dotNo = this.oldDuration.dots;
                note.setSpacingInfo(undefined);
            }
        }

        export class AddNoteheadCommand implements IScoreCommand {
            constructor(private args: { note: Model.INote; pitch: Model.Pitch; }) { }

            //private noteMemento: IMemento;

            public execute(app: ScoreApplication.IScoreApplication) {
                var pitch = this.args.pitch;
                var note = this.args.note;
                //this.noteMemento = note.getMemento();
                note.setRest(false);
                note.setPitch(pitch);
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                var pitch = this.args.pitch;
                /*note.parent.removeChild(note); // todo: what if other commands in undo stack refer to note?
                this.args.note = <Model.INote>Model.MusicElementFactory.RecreateElement(note.parent, this.noteMemento);*/
                if (note.matchesPitch(pitch, true) || note.rest) {
                    note.withHeads((head: Model.INotehead) => {
                        if (head.matchesPitch(pitch, false)) {
                            note.removeChild(head);
                        }
                    });
                    note.setRest(note.noteheadElements.length === 0);
                }
            }
        }

        export class RemoveNoteheadCommand implements IScoreCommand {
            constructor(private args: { head: Model.INotehead; }) { }

            private head: Model.INotehead;
            private note: Model.INote;

            public execute(app: ScoreApplication.IScoreApplication) {
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

            public undo(app: ScoreApplication.IScoreApplication) {
                if (this.head) {
                    this.note.addChild(this.note.noteheadElements, this.head);
                    this.note.setRest(this.note.noteheadElements.length === 0);
                }
            }
        }

        export interface ISetPitchCommand {
            head: Model.INotehead;
            pitch: Model.Pitch;
        }
        export class SetPitchCommand implements IScoreCommand {
            constructor(private args: ISetPitchCommand) { }

            private oldPitch: Model.Pitch;

            public execute(app: ScoreApplication.IScoreApplication) {
                this.oldPitch = this.args.head.pitch;
                this.args.head.pitch.pitch = this.args.pitch.pitch;
                this.args.head.pitch.alteration = this.args.pitch.alteration;
            }

            public undo(app: ScoreApplication.IScoreApplication) {                 
                this.args.head.pitch.pitch = this.oldPitch.pitch;
                this.args.head.pitch.alteration = this.oldPitch.alteration;
            }
        }

        export class RaisePitchAlterationCommand implements IScoreCommand {
            constructor(private args: { head: Model.INotehead; absAlteration?: string; deltaAlteration?: number }) { }

            /* args:
            head (Element)
            absAlteration || deltaAlteration
            */
            private oldAlteration: string;

            // execute
            public execute(app: ScoreApplication.IScoreApplication) {
                var head = this.args.head;
                this.oldAlteration = head.pitch.alteration;
                if (this.args.deltaAlteration) {
                    head.pitch.raiseAlteration(this.args.deltaAlteration);
                }
                else if (this.args.absAlteration !== undefined) {
                    head.pitch.alteration = this.args.absAlteration;
                }
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var head = this.args.head;
                head.pitch.alteration = this.oldAlteration;
            }
        }

        export class AddNoteDecorationCommand implements IScoreCommand {
            constructor(private args: { note: Model.INote; expression: Model.NoteDecorationKind; placement: string; }) { }

            private theDeco: Model.INoteDecorationElement;

            public execute(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                this.theDeco = new Model.NoteDecorationElement(note, this.args.expression);
                this.theDeco.placement = this.args.placement;
                note.addChild(note.decorationElements, this.theDeco);
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                note.removeChild(this.theDeco, note.decorationElements);
            }
        }


        export class UpdateStaffCommand implements IScoreCommand {
            constructor(
                private args: {
                    staff: Model.IStaff;
                    index: number;
                    title: string;
                    initClef?: Model.ClefDefinition;
                }) {
            }

            /* args:
            staff
            index
            title
            initClef
            // StaffType (TAB/singleline etc)
            */
            private oldIndex: number;
            private oldTitle: string;
            private oldClef: Model.ClefDefinition;

            public execute(app: ScoreApplication.IScoreApplication) {
                var staff = this.args.staff;
                this.oldTitle = staff.title;
                this.oldIndex = staff.parent.staffElements.indexOf(staff);
                if (this.args.title) {
                    staff.title = this.args.title;
                }
                // staff order
                Model.ScoreElement.placeInOrder(app.document, staff, this.args.index);
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                var staff = this.args.staff;
                staff.title = this.oldTitle;
                Model.ScoreElement.placeInOrder(app.document, staff, this.oldIndex);
            }
        }

        export class NewStaffCommand implements IScoreCommand {
            constructor(private args: {
                index: number;
                title: string;
                initClef: Model.ClefDefinition;
            }) { }

            /* args:
            index
            title
            initClef (ClefDefinition)
            // StaffType (TAB/singleline etc)
            */

            private theStaff: Model.IStaff;

            public execute(app: ScoreApplication.IScoreApplication) {
                var initClef = this.args.initClef;
                this.theStaff = app.document.addStaff(initClef);
                this.theStaff.title = this.args.title;
                this.theStaff.addVoice();
                Model.ScoreElement.placeInOrder(app.document, this.theStaff, this.args.index);
            }

            public undo(app: ScoreApplication.IScoreApplication) {
                this.theStaff.parent.removeChild(this.theStaff, this.theStaff.parent.staffElements);
            }
        }


        export class TieNoteheadCommand implements IScoreCommand {
            constructor(private args: {
                head: Model.INotehead;
                forced?: boolean;
                remove?: boolean;
                toggle: boolean;
            }) { }

            /* args:
            head
            forced
            remove
            toggle
            */

            public execute(app: ScoreApplication.IScoreApplication) {
                var head = this.args.head;
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

        export class TieNoteCommand implements IScoreCommand {
            constructor(private args: {
                note: Model.INote;
                forced?: boolean;
                remove?: boolean;
                toggle: boolean;
            }) { }

            /* args:
            note
            forced
            remove
            toggle
            */

            public execute(app: ScoreApplication.IScoreApplication) {
                var note = this.args.note;
                var forced = this.args.forced || false;
                note.withHeads((head: Model.INotehead, index: number) => {
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

        export class SetMeterCommand implements IScoreCommand {
            constructor(private args: any) { }

            /* args:
            meter: MeterDefinition
            absTime
            staff?
            */

            public execute(app: ScoreApplication.IScoreApplication) {
                var meter = <Model.IMeterDefinition>this.args.meter;
                var absTime = <Model.AbsoluteTime>this.args.absTime;
                var staff = <Model.IStaff>this.args.staff;
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

        export class SetKeyCommand implements IScoreCommand { // todo: KeyDefinition
            constructor(private args: {
                key: Model.IKeyDefinition;
                absTime: Model.AbsoluteTime;
                staff?: Model.IStaff;
            }) { }

            /* args:
            key (definition)
            absTime
            staff?
            */

            public execute(app: ScoreApplication.IScoreApplication) {
                if (this.args.staff) {
                    // staff key
                    this.args.staff.setKey(this.args.key, this.args.absTime);
                }
                else {
                    // score key
                    app.document.setKey(this.args.key, this.args.absTime);
                }
            }
        }

        export class SetClefCommand implements IScoreCommand {
            constructor(private args: {
                clef: Model.ClefDefinition;
                absTime: Model.AbsoluteTime;
                staff: Model.IStaff;
            }) { }

            /* args:
            clef
            absTime
            staff
            */

            public execute(app: ScoreApplication.IScoreApplication) {
                this.args.staff.setClef(this.args.clef, this.args.absTime);
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
//}