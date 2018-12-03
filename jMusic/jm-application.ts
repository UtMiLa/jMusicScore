import {Application} from "../JApps/application";
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'
import { IVoice, IScore, IStaff, IKey, IClef, IVoiceNote, INote, INotehead, IBar, IMeter, IMusicElement } from './model/jm-model-interfaces';
import { ScoreElement} from "./model/jm-model";
import { GlobalContext } from "./model/jm-model-base";
    export interface IScoreApplication extends Application.AbstractApplication<IScore, ScoreStatusManager> { }
    export interface IScorePlugin extends Application.IPlugIn<IScore, ScoreStatusManager> { }
    export interface IScoreEventProcessor extends Application.IEventProcessor<IScore, ScoreStatusManager> { }
    export interface IScoreDesigner extends Application.IDesigner<IScore, ScoreStatusManager> { }

    export interface IMessage extends Application.IMessage {
        note?: INote;
        pitch?: Pitch;
        head?: INotehead;
        voice?: IVoice;
        bar?: IBar;
        keySig?: IKey;
        clef?: IClef;
        meter?: IMeter;
    }


    export class ScoreStatusManager implements Application.IStatusManager {
        constructor(private globalContext: GlobalContext) {}

        private feedbackManager: Application.IFeedbackManager;

        public setFeedbackManager(f: Application.IFeedbackManager): void {
            this.feedbackManager = f;
        }

        private _currentPitch: Pitch;
        private _currentNote: IVoiceNote;
        private _currentNotehead: INotehead;
        private _currentVoice: IVoice;
        private _currentStaff: IStaff;
        private _insertPoint: HorizPosition;
        private selectionStart: AbsoluteTime; // todo: property
        private selectionEnd: AbsoluteTime; // todo: property
        private selectionStartStaff: IStaff; // todo: property
        private selectionEndStaff: IStaff; // todo: property
        private _rest: boolean = false;
        private _dots: number = 0;
        private _grace: boolean = false;
        private _currentTuplet: TupletDef;
        private _mouseOverElement: IMusicElement;

        private changed(key: string, val: any) {
            if (this.feedbackManager) {
                this.feedbackManager.changed(this, key, val);
            }
        }

        public get currentPitch(): Pitch { return this._currentPitch; }
        public set currentPitch(v: Pitch) {
            if (this._currentPitch !== v) {
                this._currentPitch = v;
                this.changed("currentPitch", v);
                if (v && this.currentNote && this.currentNote.matchesPitch(v, true)) {
                    this.currentNote.withHeads(this.globalContext, (head: INotehead) => {
                        if (head.pitch.pitch === v.pitch) {
                            this.currentNotehead = head;

                        }
                    });
                }
                else this.currentNotehead = undefined;
            }
        }
        public get currentNote(): IVoiceNote { return this._currentNote; }
        public set currentNote(v: IVoiceNote) {
            if (this._currentNote !== v) {
                this._currentNote = v;
                if (v) {
                    this.currentVoice = v.parent;
                }
                this.changed("currentNote", v);
                if (v && this.currentPitch && v.matchesPitch(this.currentPitch, true)) {
                    v.withHeads(this.globalContext, (head: INotehead) => {
                        if (head.pitch.pitch === this.currentPitch.pitch) {
                            this.currentNotehead = head;

                        }
                    });
                }
                else this.currentNotehead = undefined;
            }
        }
        public get currentNotehead(): INotehead { return this._currentNotehead; }
        public set currentNotehead(v: INotehead) {
            if (this._currentNotehead !== v) {
                this._currentNotehead = v;
                this.changed("currentNotehead", v);
            }
        }
        public get currentVoice(): IVoice { return this._currentVoice; }
        public set currentVoice(v: IVoice) {
            if (this._currentVoice !== v) {
                this._currentVoice = v;
                this.changed("currentVoice", v);
            }
        }
        public get currentStaff(): IStaff { return this._currentStaff; }
        public set currentStaff(v: IStaff) {
            if (this._currentStaff !== v) {
                this._currentStaff = v;
                this.changed("currentStaff", v);
            }
        }
        public get currentTuplet(): TupletDef { return this._currentTuplet; }
        public set currentTuplet(v: TupletDef) {
            if (!this._currentTuplet || !v || !this._currentTuplet.eq(v)) {
                this._currentTuplet = v;
                this.changed("currentTuplet", v);
            }
        }
        public get insertPoint(): HorizPosition { return this._insertPoint; }
        public set insertPoint(v: HorizPosition) {
            if (this._insertPoint !== v) {
                this._insertPoint = v;
                this.changed("insertPoint", v);
            }
        }

        public get mouseOverElement(): IMusicElement {
            return this._mouseOverElement;
        }
        public set mouseOverElement(v: IMusicElement) {
            if (this._mouseOverElement !== v) {
                if (this._mouseOverElement) this.changed("mouseOutElement", this._mouseOverElement);
                this._mouseOverElement = v;
                if (v) this.changed("mouseOverElement", v);
            }
        }

        public get rest(): boolean { return this._rest; }
        public set rest(v: boolean) {
            if (this._rest !== v) {
                this._rest = v;
                this.changed("rest", v);
            }
        }
        public get dots(): number { return this._dots; }
        public set dots(v: number) {
            if (this._dots !== v) {
                this._dots = v;
                this.changed("dots", v);
            }
        }
        public get grace(): boolean { return this._grace; }
        public set grace(v: boolean) {
            if (this._grace !== v) {
                this._grace = v;
                this.changed("grace", v);
            }
        }
        private _notesPressed: Pitch[] = [];
        private noteValSelected: TimeSpan;

        public get notesPressed(): Pitch[] { return this._notesPressed; }
        public pressNoteKey(pitch: Pitch) {
            this._notesPressed.push(pitch);
            this.changed("pressKey", pitch);
        }
        public releaseNoteKey(pitch: Pitch) {
            for (var i = 0; i < this._notesPressed.length; i++) {
                if (this._notesPressed[i].equals(pitch)) {
                    this._notesPressed.splice(i, 1);
                    this.changed("releaseKey", pitch);
                }
            }
        }
    }

