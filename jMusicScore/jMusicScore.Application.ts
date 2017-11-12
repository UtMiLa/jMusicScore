import {Application} from "../JApps/application";
import {Model} from "./jMusicScore";
import {JMusicScoreUi} from "./jMusicScore.UI";
import {MusicSpacing} from "./jMusicScore.Spacing";
import {emmentalerNotes} from "./emmentaler";
import {emmentalerCode} from "./emmentaler_code";
import {Commands} from "./commands";

export module ScoreApplication{
    export interface IScoreApplication extends Application.AbstractApplication<Model.IScore, ScoreStatusManager> { }
    export interface IScorePlugin extends Application.IPlugIn<Model.IScore, ScoreStatusManager> { }
    export interface IScoreEventProcessor extends Application.IEventProcessor<Model.IScore, ScoreStatusManager> { }
    export interface IScoreDesigner extends Application.IDesigner<Model.IScore, ScoreStatusManager> { }

    export interface IMessage extends Application.IMessage {
        note?: Model.INote;
        pitch?: Model.Pitch;
        head?: Model.INotehead;
        voice?: Model.IVoice;
        bar?: Model.IBar;
        keySig?: Model.IKey;
        clef?: Model.IClef;
        meter?: Model.IMeter;
    }


    export class ScoreStatusManager implements Application.IStatusManager {
        constructor() { }

        private feedbackManager: Application.IFeedbackManager;

        public setFeedbackManager(f: Application.IFeedbackManager): void {
            this.feedbackManager = f;
        }

        private _currentPitch: Model.Pitch;
        private _currentNote: Model.INote;
        private _currentNotehead: Model.INotehead;
        private _currentVoice: Model.IVoice;
        private _currentStaff: Model.IStaff;
        private _insertPoint: Model.HorizPosition;
        private selectionStart: Model.AbsoluteTime; // todo: property
        private selectionEnd: Model.AbsoluteTime; // todo: property
        private selectionStartStaff: Model.IStaff; // todo: property
        private selectionEndStaff: Model.IStaff; // todo: property
        private _rest: boolean = false;
        private _dots: number = 0;
        private _grace: boolean = false;
        private _currentTuplet: Model.TupletDef;
        private _mouseOverElement: Model.IMusicElement;

        private changed(key: string, val: any) {
            if (this.feedbackManager) {
                this.feedbackManager.changed(this, key, val);
            }
        }

        public get currentPitch(): Model.Pitch { return this._currentPitch; }
        public set currentPitch(v: Model.Pitch) {
            if (this._currentPitch !== v) {
                this._currentPitch = v;
                this.changed("currentPitch", v);
                if (v && this.currentNote && this.currentNote.matchesPitch(v, true)) {
                    this.currentNote.withHeads((head: Model.INotehead) => {
                        if (head.pitch.pitch === v.pitch) {
                            this.currentNotehead = head;

                        }
                    });
                }
                else this.currentNotehead = undefined;
            }
        }
        public get currentNote(): Model.INote { return this._currentNote; }
        public set currentNote(v: Model.INote) {
            if (this._currentNote !== v) {
                this._currentNote = v;
                if (v) {
                    this.currentVoice = v.parent;
                }
                this.changed("currentNote", v);
                if (v && this.currentPitch && v.matchesPitch(this.currentPitch, true)) {
                    v.withHeads((head: Model.INotehead) => {
                        if (head.pitch.pitch === this.currentPitch.pitch) {
                            this.currentNotehead = head;

                        }
                    });
                }
                else this.currentNotehead = undefined;
            }
        }
        public get currentNotehead(): Model.INotehead { return this._currentNotehead; }
        public set currentNotehead(v: Model.INotehead) {
            if (this._currentNotehead !== v) {
                this._currentNotehead = v;
                this.changed("currentNotehead", v);
            }
        }
        public get currentVoice(): Model.IVoice { return this._currentVoice; }
        public set currentVoice(v: Model.IVoice) {
            if (this._currentVoice !== v) {
                this._currentVoice = v;
                this.changed("currentVoice", v);
            }
        }
        public get currentStaff(): Model.IStaff { return this._currentStaff; }
        public set currentStaff(v: Model.IStaff) {
            if (this._currentStaff !== v) {
                this._currentStaff = v;
                this.changed("currentStaff", v);
            }
        }
        public get currentTuplet(): Model.TupletDef { return this._currentTuplet; }
        public set currentTuplet(v: Model.TupletDef) {
            if (!this._currentTuplet || !v || !this._currentTuplet.eq(v)) {
                this._currentTuplet = v;
                this.changed("currentTuplet", v);
            }
        }
        public get insertPoint(): Model.HorizPosition { return this._insertPoint; }
        public set insertPoint(v: Model.HorizPosition) {
            if (this._insertPoint !== v) {
                this._insertPoint = v;
                this.changed("insertPoint", v);
            }
        }

        public get mouseOverElement(): Model.IMusicElement {
            return this._mouseOverElement;
        }
        public set mouseOverElement(v: Model.IMusicElement) {
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
        private _notesPressed: Model.Pitch[] = [];
        private noteValSelected: Model.TimeSpan;

        public get notesPressed(): Model.Pitch[] { return this._notesPressed; }
        public pressNoteKey(pitch: Model.Pitch) {
            this._notesPressed.push(pitch);
            this.changed("pressKey", pitch);
        }
        public releaseNoteKey(pitch: Model.Pitch) {
            for (var i = 0; i < this._notesPressed.length; i++) {
                if (this._notesPressed[i].equals(pitch)) {
                    this._notesPressed.splice(i, 1);
                    this.changed("releaseKey", pitch);
                }
            }
        }
    }

}