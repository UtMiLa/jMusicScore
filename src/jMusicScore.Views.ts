module jMusicScore {

    export module ScoreApplication {
        export interface ScoreApplication extends Application.Application<Model.IScore, ScoreStatusManager, JQuery> { }
        export interface ScorePlugin extends Application.IPlugIn<Model.IScore, ScoreStatusManager, JQuery> { }
        export interface ScoreEventProcessor extends Application.IEventProcessor<Model.IScore, ScoreStatusManager, JQuery> { }
        export interface ScoreDesigner extends Application.IDesigner<Model.IScore, ScoreStatusManager, JQuery> { }

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
            private _selectionStart: Model.AbsoluteTime; // todo: property
            private _selectionEnd: Model.AbsoluteTime; // todo: property
            private _selectionStartStaff: Model.IStaff; // todo: property
            private _selectionEndStaff: Model.IStaff; // todo: property
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
                                return;
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
                                return;
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
                if (!this._currentTuplet || !v || !this._currentTuplet.Eq(v)) {
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
            private _noteValSelected: Model.TimeSpan;

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

    export module Model {
        export interface ILongDecorationSpacingInfo extends ISpacingInfo {
            Render?: (deco: ILongDecorationElement, ge: Views.IGraphicsEngine) => void;
        }
    }

    export module Views {
        export interface IBaseGraphicsEngine {
            SetSize(width: number, height: number): void;
            BeginDraw(): void;
            EndDraw(): void;
            // Parent = altid aktuel gruppe
            BeginGroup(id: string, x: number, y: number, scale: number, className: string): any;// tjekker om der findes en gruppe med givne id og opretter ellers - hvor kommer id fra? Hvert MusicElement skal have en unik id
            EndGroup(group: any): void; // popper gruppestakken - must be balanced!
        }
        export interface IGraphicsEngine extends IBaseGraphicsEngine {
            CreateMusicObject(id: string, item: string, x: number, y: number, scale: number): any;
            CreatePathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id?: string): any;
            DrawText(id: string, text: string, x: number, y: number, justify: string): any;
        }

        export interface ISensorGraphicsEngine extends IBaseGraphicsEngine {
            CreateRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any;
            // Cursor
            MoveCursor(id: string, x: number, y: number): void;
            ShowCursor(noteId: string): void;
            HideCursor(): void;
            // InsertionPoint
            ShowInsertionPoint(id: string, x: number, y: number): void;
            HideInsertionPoint(): void;

            calcCoordinates(event: MouseEvent): Model.Point;
        }

        //todo: still some spacing
        export class KeyDrawer {

            /*private static keydefs = {
                'b': {
                    3: [5, 2, 6, 3, 7, 4, 8], // g
                    5: [7, 4, 8, 5, 9, 6, 10], // f
                    0: [2, 6, 3, 7, 4, 8, 5], // c1
                    2: [4, 1, 5, 2, 6, 3, 7], // c2
                    4: [6, 3, 7, 4, 8, 5, 9], // c3
                    6: [1, 5, 2, 6, 3, 7, 4], // c4
                    1: [3, 0, 4, 1, 5, 2, 6] // c4
                },
                'x': {
                    3: [1, 4, 0, 3, 6, 2, 5],
                    5: [3, 6, 2, 5, 1, 4, 0],
                    0: [5, 1, 4, 7, 3, 6, 2],
                    2: [7, 3, 6, 2, 5, 1, 4],
                    4: [2, 5, 1, 4, 0, 3, 6],
                    6: [4, 7, 3, 6, 2, 5, 1],
                    1: [6, 2, 5, 1, 4, 0, 3]
                }
            };*/
            private static clefMagicNo = {
                'b': [8, 6, 7, 8, 9, 10, 7],
                'x': [7, 6, 7, 6, 6, 6, 7]
            }

            public static addKeyXY(id: string, graphic: Views.IGraphicsEngine, keyDefinition: Model.IKeyDefinition, clefDefinition: Model.ClefDefinition, x: number, y: number) {
                //var staffContext = key.parent.getStaffContext(key.absTime);
                var clefOffset = clefDefinition.PitchOffset();
                var pitchClasses = keyDefinition.enumerateKeys();
                for (var i = 0; i < pitchClasses.length; i++) {
                    var pc = pitchClasses[i];
                    var clefMagicNo: number;
                    var ref: string;
                    var staffLine: number;
                    clefOffset = (clefOffset + 84) % 7;
                    if (pc.pitchClass < 0) {
                        // b
                        ref = 'e_accidentals.M2';
                        clefMagicNo = KeyDrawer.clefMagicNo['b'][clefOffset];
                        staffLine = ((i * 4 + clefOffset + 8 - clefMagicNo) % 7) + clefMagicNo - 6;
                    }
                    else {
                        // x
                        ref = 'e_accidentals.2';
                        clefMagicNo = KeyDrawer.clefMagicNo['x'][clefOffset];
                        staffLine = ((i * 3 + clefOffset + 11 - clefMagicNo) % 7) + clefMagicNo - 6;
                    }
                    graphic.CreateMusicObject(id + '_' + i, ref, x + i * MusicSpacing.Metrics.keyXPerAcc,
                        y + MusicSpacing.Metrics.pitchYFactor * staffLine - MusicSpacing.Metrics.pitchYFactor, 1);
                }
            }
        }

        export class MeterDrawer {
            public static meterDefs: string[] = [
                'e_zero', 'e_one', 'e_two', 'e_three', 'e_four', 'e_five', 'e_six', 'e_seven', 'e_eight', 'e_nine'
            ];

            public static addNumberXY(id: string, graphic: Views.IGraphicsEngine, meterChar: string, x: number, y: number) {
                var symbol: string;
                switch (meterChar) {
                    case 'c': symbol = 'e_timesig.C44';
                        break;
                    case 'C': symbol = 'e_timesig.C22';
                        break;
                    case '+': symbol = 'e_plus';
                        break;
                    default:
                        symbol = MeterDrawer.meterDefs[parseInt(meterChar)];
                }
                graphic.CreateMusicObject(id, symbol, x, y, 1);
            }

            public static addStringXY(id: string, graphic: Views.IGraphicsEngine, meterString: string, x: number, y: number, maxLen: number) {
                var deltaX = 0;
                if (meterString.length < maxLen) {
                    deltaX = (maxLen - meterString.length) * 4;
                }
                for (var i = 0; i < meterString.length; i++) {
                    var chr = meterString[i];
                    this.addNumberXY(id, graphic, chr, x + deltaX + i * 8, y);
                }
            }

            public static addMeterXY(id: string, graphic: Views.IGraphicsEngine, meterDefinition: Model.IMeterDefinition, x: number, y: number) {
                var fracFunc = (num: string, den: string): any => {
                    var len = Math.max(num.length, den.length);
                    this.addStringXY(id + '_1', graphic, num, MusicSpacing.Metrics.meterX + x, MusicSpacing.Metrics.meterY0 + y, len);
                    this.addStringXY(id + '_2', graphic, den, MusicSpacing.Metrics.meterX + x, MusicSpacing.Metrics.meterY1 + y, len);
                    //displayData.width = 4 + len * 8;
                };
                var fullFunc = (full: string): any => {
                    var len = full.length;
                    this.addStringXY(id + '_1', graphic, full, MusicSpacing.Metrics.meterX + x, MusicSpacing.Metrics.meterY0 + y, len);
                };

                return meterDefinition.display(fracFunc, fullFunc);
            }
        }

        class LongDecorationDrawer {
            /*public static CalcSpacing(deco: Model.ILongDecorationElement): void {
                var noteSpacing = deco.parent.spacingInfo;
                var notedecoSpacing = deco.spacingInfo;

                //notedecoSpacing.center.x = 0;

                if (deco.placement === "over") {
                    notedecoSpacing.offset.y = MusicSpacing.NoteSpacer.pitchToStaffLine(noteSpacing.highPitch, deco.parent) * MusicSpacing.Metrics.pitchYFactor - 12;
                    // todo: if stem goes up use stem height
                    if (notedecoSpacing.offset.y > -6) notedecoSpacing.offset.y = -6;
                }
                else {
                    notedecoSpacing.offset.y = MusicSpacing.NoteSpacer.pitchToStaffLine(noteSpacing.lowPitch, deco.parent) * MusicSpacing.Metrics.pitchYFactor + 12;
                    if (notedecoSpacing.offset.y < 30) notedecoSpacing.offset.y = 30;
                }

                if (!notedecoSpacing.endpoint) {
                    notedecoSpacing.endpoint = new Model.Point(0, 0);
                }
                var longDeco = <Model.ILongDecorationElement>deco;


                if (true) { // todo: if length is changed
                    // todo: update slurs after spacing is decided
                    var tieDir = (deco.placement === "over") ? -1 : 1;
                    var x0 = 5; // todo: x0 and x1 based on real notehead sizes
                    var tiedToNoteSpacing = longDeco.EndEvent.spacingInfo;

                    if (tiedToNoteSpacing && tiedToNoteSpacing.offset.x >= noteSpacing.offset.x) {
                        notedecoSpacing.endpoint.x = tiedToNoteSpacing.offset.x + notedecoSpacing.offset.x - noteSpacing.offset.x;
                    }
                    else {
                        notedecoSpacing.endpoint.x = 15;
                    }
                    // todo: observer on tiedToNote
                    notedecoSpacing.endpoint.y = tieDir * 0.4;
                }
            }*/
        }

        class TrillDrawer extends LongDecorationDrawer {
            public static Render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        }
        class CrescDrawer extends LongDecorationDrawer {
            public static Render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                // long deco (cresc)
                var notedecoSpacing = deco.spacingInfo;
                var longDeco = deco;

                var tieDir = (deco.placement === "over") ? -1 : 1;

                var x0 = 1;
                var y0 = tieDir * 1;
                var dy = 1;
                var x1 = notedecoSpacing.distX - 2 * x0;

                if (deco.type === Model.LongDecorationType.cresc) {
                    x0 = notedecoSpacing.distX - x0;
                    x1 = -x1;
                }

                var path = "m " +
                    x0 + "," + y0 +
                    " l " +
                    x1 + "," + dy + " " +
                    " l " +
                    (-x1) + "," + (2 * dy) + " ";

                graphEngine.CreatePathObject(path, 0, 0, 1, "black", null);
            }
        }
        class BracketDrawer extends LongDecorationDrawer {
            public static Render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        }
        class TupletDrawer extends LongDecorationDrawer {
            public static Render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        } 
        class OttavaDrawer extends LongDecorationDrawer {
            public static Render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        }

        class SlurDrawer extends LongDecorationDrawer {
            public static Render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                // long deco (slur)
                var notedecoSpacing = deco.spacingInfo;
                var longDeco = deco;
                // todo: update slurs after spacing is decided
                var slurDir = (deco.placement === "over") ? -1 : 1;
                var x0 = 2; // todo: x0 and x1 based on real notehead sizes
                var y0 = slurDir * 1 + notedecoSpacing.noteY;
                
                var x1 = notedecoSpacing.distX - 2 * x0;
                var yWidth = slurDir * 0.4;
                var y1 = notedecoSpacing.endNoteY - notedecoSpacing.noteY;
                var dx = x1 / 4;
                var dy1 = slurDir * (x1/10);
                var dy2 = slurDir * (x1/10 + 0.5);
                var path = "m " +
                    x0 + "," + y0 +
                    " c " +
                    dx + "," + (dy1 + y1 / 4) + " " +
                    (x1 - dx) + "," + (dy1 + 3*y1 / 4) + " " +
                    x1 + "," + (y1) + " " +
                    "l " +
                    "0," + yWidth +
                    " c " +
                    (-dx) + "," + (dy2 - y1 / 4) + " " +
                    (dx - x1) + "," + (dy2 - 3*y1 / 4) + " " +
                    (-x1) + "," + (- y1) + " z";

                graphEngine.CreatePathObject(path, 0, 0, 1, "", "black");
            }
        }

        class ExpressionFactory implements Model.IVisitorIterator, Model.IVisitor {
            VisitPre(element: Model.IMusicElement): (element: Model.IMusicElement) => void {
                element.InviteVisitor(this);
                return null;
            }

            VisitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
            }
            VisitNote(note: Model.INote, spacing: Model.INoteSpacingInfo) {
            }
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
                // expr
            }
            static longDrawers: any[] = [TrillDrawer, CrescDrawer, CrescDrawer, SlurDrawer, BracketDrawer, TupletDrawer, OttavaDrawer];
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) {
                // expr
                if (spacing && ExpressionFactory.longDrawers[deco.type]) {
                    if (!spacing.Render) spacing.Render = ExpressionFactory.longDrawers[deco.type].Render;
                    //if (!spacing.CalcSpacing) spacing.CalcSpacing = ExpressionFactory.longDrawers[deco.type].CalcSpacing;
                }
            }
            VisitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) {
            }
            VisitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
            }
            VisitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
            }
            VisitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
            }
            VisitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
            }
            VisitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
            }
            VisitTextSyllable(syllable: Model.ITextSyllableElement, spacing: Model.ITextSyllableSpacingInfo) {
            }
            VisitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
            }
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
            }
            VisitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void {
                // expr
            }

            VisitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }
        }

        export class ExpressionRenderer implements ScoreApplication.ScoreDesigner {
            constructor(private spacer: Model.IVisitor = null) {
            }

            public Validate(app: ScoreApplication.ScoreApplication) {
                app.document.VisitAll(new ExpressionFactory()); // add renderer objects to all note/staff expressions
            }
        }

        export interface IEventReceiver {
            ProcessEvent(name: string, event: Event): boolean;
        }

        /** Responsible for making event handlers on DOM (SVG/HTML) sensors */
        export class DOMCheckSensorsVisitor implements Model.IVisitor { // todo: remove event handlers when inactive
            constructor(public sensorEngine: Views.ISensorGraphicsEngine, private score: Model.IScore, private eventReceiver: IEventReceiver) {
            }

            VisitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
                var elm = this.sensorEngine.CreateRectObject("edit_" + head.id, -5, -2, 10, 3, 'NoteheadEdit');
                var evRec = this.eventReceiver;
                var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { head: head/*, feedback: me*/ };
                    evRec.ProcessEvent("mouseoverhead", event);
                })
                    .mouseout(function (event) {
                        event.data = { head: head/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseouthead", event);
                    })
                    .click(function (event) {
                        event.data = { head: head/*, feedback: me*/ };
                        evRec.ProcessEvent("clickhead", event);
                    });
            }
            VisitNote(note: Model.INote, noteSpacing: Model.INoteSpacingInfo) {
                var evRec = this.eventReceiver;
                var me = this.sensorEngine;
                var staffContext = note.parent.parent.getStaffContext(note.absTime);
                var clefDefinition = staffContext.clef.definition;
                var rectLeft = -7;
                var rectTop = -20;
                var rectTopBefore = -30;
                var rectWidth = 14;
                var rectX0Before = -11;
                var rectWidthAfter = 30;
                var rectHeight = 50;
                var rectHeightBefore = 70;
                var staffLineSpacing = 3;

                var elm = this.sensorEngine.CreateRectObject("edit_" + note.id, rectLeft, rectTop, rectWidth, rectHeight, 'NoteEdit');
                $(elm).mouseover(function (event) { //"#edit_" + note.id
                    var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                    var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                    event.data = { note: note/*, feedback: me*/, pitch: pitch };
                    evRec.ProcessEvent("mouseovernote", event);
                })
                    .mouseout(function (event) {
                        event.data = { note: note/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseoutnote", event);
                    })
                    .mousemove(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.ProcessEvent("mousemovenote", event);
                    })
                    .click(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.ProcessEvent("clicknote", event);
                    });
                var x0 = rectX0Before - noteSpacing.preWidth;
                var prevNote = Model.Music.prevNote(note);
                if (prevNote && prevNote.spacingInfo.offset.x - note.spacingInfo.offset.x - rectLeft > x0) {
                    x0 = prevNote.spacingInfo.offset.x - note.spacingInfo.offset.x - rectLeft;
                }
                elm = this.sensorEngine.CreateRectObject("editbefore_" + note.id, x0, rectTopBefore, rectLeft - x0, rectHeightBefore, 'NoteEditBefore');
                $(elm).mouseover(function (event) {
                    var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                    var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                    event.data = { note: note/*, feedback: me*/, pitch: pitch };
                    evRec.ProcessEvent("mouseoverbeforenote", event);
                })
                    .mouseout(function (event) {
                        event.data = { note: note/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseoutbeforenote", event);
                    })
                    .mousemove(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.ProcessEvent("mousemovebeforenote", event);
                    })
                    .click(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / 3)); // todo: abstraher
                        event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.ProcessEvent("clickbeforenote", event);
                    });


                var nextNote = Model.Music.nextNote(note);
                if (!nextNote) {
                    // afternote

                    elm = this.sensorEngine.CreateRectObject("editafter_" + note.id, rectLeft + rectWidth, rectTopBefore, rectWidthAfter, rectHeightBefore, 'NoteEditAfter');
                    $(elm).mouseover(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.ProcessEvent("mouseoverafternote", event);
                    })
                        .mouseout(function (event) {
                            event.data = { note: note/*, feedback: me*/ };
                            evRec.ProcessEvent("mouseoutafternote", event);
                        })
                        .mousemove(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            event.data = { note: note/*, feedback: me*/, pitch: pitch };
                            evRec.ProcessEvent("mousemoveafternote", event);
                        })
                        .click(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            event.data = { note: note, voice: note.parent/*, feedback: me*/, pitch: pitch };
                            evRec.ProcessEvent("clickafternote", event);
                        });
                }
            }
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) {
            }
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
            }
            VisitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) {
                /*var voiceRef = this.sensorFactory.MakeSureVoiceSensor(voice, staffRef, svgHelper, {
                      'click': (event) => {
                          event.data = { voice: voice };
                          app.ProcessEvent("clickvoice", event);
                      }
                  });*/

            }
            VisitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
                var elm = this.sensorEngine.CreateRectObject("edit_" + clef.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'ClefEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { clef: clef/*, feedback: me*/ };
                    evRec.ProcessEvent("mouseoverclef", event);
                })
                    .mouseout(function (event) {
                        event.data = { clef: clef/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseoutclef", event);
                    })
                    .click(function (event) {
                        event.data = { clef: clef/*, feedback: me*/ };
                        evRec.ProcessEvent("clickclef", event);
                    });
            }
            VisitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
                var elm = this.sensorEngine.CreateRectObject("edit_" + meter.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'MeterEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { meter: meter/*, feedback: me*/ };
                    evRec.ProcessEvent("mouseovermeter", event);
                })
                    .mouseout(function (event) {
                        event.data = { meter: meter/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseoutmeter", event);
                    })
                    .click(function (event) {
                        event.data = { meter: meter/*, feedback: me*/ };
                        evRec.ProcessEvent("clickmeter", event);
                    });
            }
            VisitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
                /*this.sensorFactory.MakeSureGraphElementSensor(key, staffRef, svgHelper, {
                    'click': (event: JQueryEventObject) => {
                        event.data = { key: key };
                        app.ProcessEvent("clickkey", event);
                    }
                });*/
                var elm = this.sensorEngine.CreateRectObject("edit_" + key.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'KeyEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { key: key/*, feedback: me*/ };
                    evRec.ProcessEvent("mouseoverkey", event);
                })
                    .mouseout(function (event) {
                        event.data = { key: key/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseoutkey", event);
                    })
                    .click(function (event) {
                        event.data = { key: key/*, feedback: me*/ };
                        evRec.ProcessEvent("clickkey", event);
                    });
            }
            VisitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
            }
            VisitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
            }
            VisitTextSyllable(textSyllable: Model.ITextSyllableElement, textSpacing: Model.ITextSyllableSpacingInfo) {
            }
            VisitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
                var elm = this.sensorEngine.CreateRectObject("edit_" + bar.id, -spacing.preWidth + spacing.extraXOffset - 3, 0, spacing.preWidth + spacing.width, spacing.end.y - spacing.offset.y, 'BarEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { bar: bar/*, feedback: me*/ };
                    evRec.ProcessEvent("mouseoverbar", event);
                })
                    .mouseout(function (event) {
                        event.data = { bar: bar/*, feedback: me*/ };
                        evRec.ProcessEvent("mouseoutbar", event);
                    })
                    .click(function (event) {
                        event.data = { bar: bar/*, feedback: me*/ };
                        evRec.ProcessEvent("clickbar", event);
                    });
            }
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
            }
            VisitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void { }

            VisitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }


                        /*
            private showingLedgerLinesOver: number = 0;
            private showingLedgerLinesUnder: number = 0;
            private ledgerLines: SVGElement;

            private takeLedgerLinesRef(target: Element): void {
                if (this.ledgerLines.parentNode !== target.parentNode) {
                    target.parentNode.insertBefore(this.ledgerLines, target);
                }
            }

            private createLedgerLinesRef(svgHelper: SVGHelper): void {
                this.ledgerLines = svgHelper.createGroupElement();              
            }

            private clearLedgerLines() {
                if (this.showingLedgerLinesUnder || this.showingLedgerLinesOver || (this.ledgerLines && this.ledgerLines.childNodes.length)) {
                    while (this.ledgerLines.childNodes.length) {
                        var removeLine = this.ledgerLines.childNodes[this.ledgerLines.childNodes.length - 1];
                        this.ledgerLines.removeChild(removeLine);
                    }
                    this.showingLedgerLinesUnder = 0;
                    this.showingLedgerLinesOver = 0;
                }
            }

            public calcLedgerLines(event: JQueryEventObject): void { //todo: svghelper væk
                var svgHelper = <SVGHelper>event.data.svgHelper;
                var p = svgHelper.svg.createSVGPoint();
                p.x = event.clientX;
                p.y = event.clientY;

                var m = (<SVGRectElement>event.currentTarget).getScreenCTM();
                p = p.matrixTransform(m.inverse());

                var y = Math.round((p.y + 1) / SVGMetrics.pitchYFactor);

                if (y < -1) {
                    var ledgerOver = Math.floor(-y / 2);
                    if (this.showingLedgerLinesUnder) {
                        while (this.ledgerLines.childNodes.length) {
                            var removeLine = this.ledgerLines.childNodes[this.ledgerLines.childNodes.length - 1];
                            this.ledgerLines.removeChild(removeLine);
                        }
                        this.showingLedgerLinesUnder = 0;
                    }
                    if (this.showingLedgerLinesOver !== ledgerOver) {
                        if (!this.ledgerLines) {
                            this.createLedgerLinesRef(svgHelper);
                        }
                        this.takeLedgerLinesRef(<Element>event.target);
                        while (this.ledgerLines.childNodes.length > ledgerOver) {
                            var removeLine = this.ledgerLines.childNodes[this.ledgerLines.childNodes.length - 1];
                            this.ledgerLines.removeChild(removeLine);
                        }
                        while (this.ledgerLines.childNodes.length < ledgerOver) {
                            var extraLine = SVGNoteOutput.createLedgerLine(SVGMetrics.ledgerLineXLeft, SVGMetrics.ledgerLineXRight, y * SVGMetrics.pitchYFactor, svgHelper);
                            this.ledgerLines.appendChild(extraLine);
                        }
                        SVGHelper.move(this.ledgerLines, p.x, 0);
                    }
                }
                else if (y > 9) {
                    var ledgerUnder = Math.floor((y - 8) / 2);

                    if (this.showingLedgerLinesOver) {
                        while (this.ledgerLines.childNodes.length) {
                            var removeLine = this.ledgerLines.childNodes[this.ledgerLines.childNodes.length - 1];
                            this.ledgerLines.removeChild(removeLine);
                        }
                        this.showingLedgerLinesOver = 0;
                    }
                    if (this.showingLedgerLinesUnder !== ledgerUnder) {
                        if (!this.ledgerLines) {
                            this.createLedgerLinesRef(svgHelper);
                        }
                        this.takeLedgerLinesRef(<Element>event.target);
                        while (this.ledgerLines.childNodes.length > ledgerUnder) {
                            var removeLine = this.ledgerLines.childNodes[this.ledgerLines.childNodes.length - 1];
                            this.ledgerLines.removeChild(removeLine);
                        }
                        while (this.ledgerLines.childNodes.length < ledgerUnder) {
                            var extraLine = SVGNoteOutput.createLedgerLine(SVGMetrics.ledgerLineXLeft, SVGMetrics.ledgerLineXRight, y * SVGMetrics.pitchYFactor, svgHelper);
                            this.ledgerLines.appendChild(extraLine);
                        }
                        SVGHelper.move(this.ledgerLines, p.x, 0);
                    }
                }
                else {
                    this.clearLedgerLines();
                }
                
            }
            */

        }



        export class RedrawVisitor implements Model.IVisitor {
            constructor(private graphEngine: Views.IGraphicsEngine) { }

            static getTie(spacing: Model.INoteHeadSpacingInfo) {
                if (spacing.tieStart) {
                    //var tiedTo = <Model.NoteheadElement>headElm.getProperty("tiedTo");
                    if (true) { // todo: if length is changed
                        // todo: update slurs after spacing is decided
                        var dx = spacing.tieEnd.x / 4;
                        var dy1 = spacing.tieDir * 2;
                        var dy2 = spacing.tieDir * 2.5;
                        var path =
                            "m " +
                            spacing.tieStart.x + "," + spacing.tieStart.y +
                            " c " +
                            dx + "," + dy1 + " " +
                            (spacing.tieEnd.x - dx) + "," + dy1 + " " +
                            spacing.tieEnd.x + ",0 " +
                            "l " +
                            "0," + spacing.tieEnd.y +
                            " c " +
                            (-dx) + "," + dy2 + " " +
                            (dx - spacing.tieEnd.x) + "," + dy2 + " " +
                            (-spacing.tieEnd.x) + ",0 z";
                        return path
                    }
                }
                return undefined;
            }


            private accidentalDefs: { [Index: string]: string } = {
                "bb": "e_accidentals.M4", // bb
                "b": "e_accidentals.M2", // b
                "n": "e_accidentals.0", // nat
                "x": "e_accidentals.2", // x
                "xx": "e_accidentals.4" // xx
            };



            VisitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
                this.graphEngine.CreateMusicObject(null, spacing.headGlyph, spacing.displace.x, spacing.displace.y, spacing.graceScale);
                if (head.getAccidental()) {
                    this.graphEngine.CreateMusicObject(null, this.accidentalDefs[head.getAccidental()], spacing.offset.x + spacing.accidentalX, 0, spacing.graceScale);
                }
                var tiePath = RedrawVisitor.getTie(spacing);
                if (tiePath) {
                    this.graphEngine.CreatePathObject(tiePath, 0, 0, 1, undefined, 'black');
                }
                // dots
                for (var i = 0; i < head.parent.dotNo; i++) {
                    var dot = this.graphEngine.CreateMusicObject(null, 'e_dots.dot', head.parent.spacingInfo.dotWidth + 5/*SVGMetrics.dotSeparation*/ * i, 0, spacing.graceScale);
                }
            }
            VisitNote(note: Model.INote, noteSpacing: Model.INoteSpacingInfo) {
                // note stem
                if (!note.rest) {
                    var dirFactor = noteSpacing.rev ? -1 : 1;
                    this.graphEngine.CreatePathObject("m " + noteSpacing.stemX + "," + noteSpacing.stemRootY
                        + " l 0," + (-dirFactor * noteSpacing.stemLength) + " " + 0.75 /*SVGMetrics.stemWidth*/ + "," + (dirFactor + 0/*SVGMetrics.stemYSlope*/) + " 0," + (dirFactor * noteSpacing.stemLength) + " z", 0, 0, 1, undefined, 'black');
                    // flag
                    if (noteSpacing.flagNo) {
                        var flagSuffix = "" + (noteSpacing.flagNo + 2);
                        if (noteSpacing.rev) {
                            //todo: SVGMetrics
                            this.graphEngine.CreateMusicObject(null, 'e_flags.d' + flagSuffix, noteSpacing.flagDisplacement.x, (3/*SVGMetrics.pitchYFactor*/ * noteSpacing.highPitchY) + noteSpacing.stemLength + noteSpacing.flagDisplacement.y, noteSpacing.graceScale);
                        } else {
                            this.graphEngine.CreateMusicObject(null, 'e_flags.u' + flagSuffix, noteSpacing.flagDisplacement.x, (3/*SVGMetrics.pitchYFactor*/ * noteSpacing.lowPitchY) - noteSpacing.stemLength + noteSpacing.flagDisplacement.y, noteSpacing.graceScale);
                        }
                    }
                }
                // rest
                if (note.rest && note.noteId != 'hidden') {
                    this.graphEngine.CreateMusicObject(null, noteSpacing.restGlyph, -4.5/*SVGMetrics.restXDisplacement*/, 12/*SVGMetrics.restY*/, 1);

                    for (var i = 0; i < note.dotNo; i++) {
                        var dot = this.graphEngine.CreateMusicObject(null, 'e_dots.dot', noteSpacing.dotWidth + 5/*SVGMetrics.dotSeparation*/ * i, 12, 1);
                    }
                }
                // ledger lines
                for (var i = 0; i < noteSpacing.ledgerLinesOver.length; i++) {
                    var l = noteSpacing.ledgerLinesOver[i];
                    this.graphEngine.CreatePathObject("M " + l.xStart + "," + l.y +
                        " L " + l.xEnd + "," + l.y + " z", 0, 0, 1, '#999999', undefined);
                }
                for (var i = 0; i < noteSpacing.ledgerLinesUnder.length; i++) {
                    var l = noteSpacing.ledgerLinesUnder[i];
                    this.graphEngine.CreatePathObject("M " + l.xStart + "," + l.y +
                        " L " + l.xEnd + "," + l.y + " z", 0, 0, 1, '#999999', undefined);
                }

                // beams
                if (!noteSpacing.flagNo)
                    for (var i = 0; i < note.Beams.length; i++) {
                        var beam = note.Beams[i];
                        if (!beam || beam.parent !== note) continue;
                        var beamSpacing = beam.spacingInfo;
                        var step = beam.index * beamSpacing.beamDist;

                        this.graphEngine.CreatePathObject("M " + beamSpacing.start.x + "," + (beamSpacing.start.y + step) +
                            " L " + beamSpacing.end.x + "," + (beamSpacing.end.y + step) +
                            " " + beamSpacing.end.x + "," + (beamSpacing.end.y + 2 + step) +
                            " " + beamSpacing.start.x + "," + (beamSpacing.start.y + 2 + step) +
                            " z", 0, 0, 1, undefined, 'black', 'beam_'+beam.parent.id + '_' + beam.index);
                    }
            }
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) {
                if (spacing.Render) spacing.Render(deco, this.graphEngine);
            }
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
                // short deco
                var decoId = deco.getDecorationId();
                if (decoId >= Model.NoteDecorationKind.arpeggio && decoId <= Model.NoteDecorationKind.nonArpeggio) {
                    // arpeggio
                    if (decoId === Model.NoteDecorationKind.arpeggio || (decoId === Model.NoteDecorationKind.arpeggioDown)) {
                        var yL = deco.parent.spacingInfo.lowPitchY;
                        var yH = deco.parent.spacingInfo.highPitchY;
                        var yStep = 2;
                        var y = yL;
                        while (y >= yH) {
                            if (y === yL && (decoId === Model.NoteDecorationKind.arpeggioDown)) {
                                this.graphEngine.CreateMusicObject(null, 'e_scripts.arpeggio.arrow.M1', -12, y * 3 + 2, 1);
                            }
                            else
                            this.graphEngine.CreateMusicObject(null, 'e_scripts.arpeggio', -12, y*3+2, 1);
                            y -= yStep;
                        }
                        
                    }
                    else if (decoId === Model.NoteDecorationKind.nonArpeggio) {
                        var yL = deco.parent.spacingInfo.lowPitchY;
                        var yH = deco.parent.spacingInfo.highPitchY;
                        var path = 'm -10,' + (yL*3 + 2) + ' l -2,0 0,' + ((yH - yL)*3 - 4) + ' 2,0';
                        this.graphEngine.CreatePathObject(path, 0, 0, 1, 'black', null);
                    }
                }
                else {
                    var ref = Editors.NoteDecorations.getGlyph(decoId, deco.placement === "over");

                    if (ref) {
                        this.graphEngine.CreateMusicObject(null, ref, 0, 0, 1);
                    }
                    else {
                        alert(decoId);
                    }
                }
            }
            VisitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) { }
            VisitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
                this.graphEngine.CreateMusicObject(null, spacing.clefId, 0, 0, 1);
            }
            VisitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
                if (!spacing) { meter.setSpacingInfo(spacing = new MusicSpacing.MeterSpacingInfo(meter)); }
                Views.MeterDrawer.addMeterXY(null, this.graphEngine, meter.definition, 0, 0);
            }
            VisitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
                var staffContext = key.parent.getStaffContext(key.absTime);
                Views.KeyDrawer.addKeyXY(null, this.graphEngine, key.definition, staffContext.clef.definition, 0, 0);
            }
            VisitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
                for (var i = 0; i < 5; i++) {
                    this.graphEngine.CreatePathObject("m 0," + i * spacing.staffSpace * 2 + " l " + spacing.staffLength + ",0", 0, 0, 1, '#888', undefined, 'staffline' + staff.id + ' ' + i);
                }
            }
            VisitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
                //this.graphEngine.SetSize(spacing.width * spacing.scale, spacing.height);
            }
            VisitTextSyllable(textSyllable: Model.ITextSyllableElement, textSpacing: Model.ITextSyllableSpacingInfo) {
                this.graphEngine.DrawText("text" + textSyllable.id, textSyllable.text, 0, 0, "center");
            }
            VisitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
                this.graphEngine.CreatePathObject("m " + spacing.extraXOffset + ",0 l 0," + (spacing.end.y - spacing.offset.y), 0, 0, 1, '#444444', undefined);
            }
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
            }
            VisitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void {
                this.graphEngine.DrawText("text" + staffExpression.id, staffExpression.text, 0, 0, "left");
            }

            VisitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }
        }

        export class PrefixVisitor implements Model.IVisitorIterator {
            constructor(private visitor: Model.IVisitor, private cge: Views.IBaseGraphicsEngine, private prefix = '') {
            }
            public VisitPre(element: Model.IMusicElement): (element: Model.IMusicElement) => void {
                var spacing = element.spacingInfo;
                if (spacing) {
                    var grp = this.cge.BeginGroup(this.prefix + element.id, spacing.offset.x, spacing.offset.y, spacing.scale, element.getElementName());
                    element.InviteVisitor(this.visitor);
                    //spacing.InviteVisitor(this.visitor);
                    return (element: Model.IMusicElement) => { this.cge.EndGroup(grp); };
                }
            }
        }


    }

    /// Music 
    export module SvgView {

        class SVGMetrics { // todo: yt
            // NoteOutput
            static pitchYFactor = MusicSpacing.Metrics.pitchYFactor;
            
            // StaffOutput
            static staffHelperYOffset = MusicSpacing.Metrics.staffHelperYOffset;
            
            // KeyOutput
            static keyXPerAcc = MusicSpacing.Metrics.keyXPerAcc;

            // ClefOutput
            static clefXOffset = MusicSpacing.Metrics.clefXOffset;//-10;
            
            // MeterOutput
            static meterXOffset = MusicSpacing.Metrics.meterXOffset;//-10;
            static meterY0 = MusicSpacing.Metrics.meterY0;
            static meterX = MusicSpacing.Metrics.meterX;
            static meterY1 = MusicSpacing.Metrics.meterY1;

        }


        /***************************************** Notes ****************************************************/


        interface NoteDef {
            dotWidth: number;
            postfix: string;
            timeVal: number;
            stemLengthMin: number;
            baseNote: string;
            baseRest: string;
            editNote: string;
            noteHead: string;
            noteHeadRev: string;
            noteStem: string;
            noteStemRev: string;
            beamCount?: number;
            flag_suffix?: string;
            rest?: boolean;
        };

        //todo: still some spacing
        class SVGClefOutput {
            public static RefId(def: Model.ClefDefinition, change: boolean): string {//todo: væk
                if (change) {
                    switch (def.clefCode) {
                        case Model.ClefType.clefG: {
                            if (def.transposition === -7) { return "tenor-clef"; }
                            else return "e_clefs.G_change";
                        }
                        case Model.ClefType.clefC: return "e_clefs.C_change";
                        case Model.ClefType.clefF: return "e_clefs.F_change";
                        case Model.ClefType.clefNone: return "";
                        case Model.ClefType.clefPercussion: return "e_clefs.percussion_change";
                        case Model.ClefType.clefTab: return "e_clefs.tab_change";
                    }
                }
                else {
                    switch (def.clefCode) {
                        case Model.ClefType.clefG: {
                            if (def.transposition === -7) { return "tenor-clef"; }
                            else return "e_clefs.G";
                        }
                        case Model.ClefType.clefC: return "e_clefs.C";
                        case Model.ClefType.clefF: return "e_clefs.F";
                        case Model.ClefType.clefNone: return "";
                        case Model.ClefType.clefPercussion: return "e_clefs.percussion";
                        case Model.ClefType.clefTab: return "e_clefs.tab";
                    }
                }
            }/**/

        }

                
        class SVGSizeDesigner implements ScoreApplication.ScoreDesigner {
            constructor(private svgHelper: SVGHelper) {
            }

            Validate(app: ScoreApplication.ScoreApplication) {
/*                var height = SVGMetrics.staffYStep * app.score.staffElements.length + SVGMetrics.staffYOffset;
                var pixelHeight = this.svgHelper.unitSvgToHtml(height);
                app.container.find('.clientArea').height(pixelHeight);
                var $svg = $(this.svgHelper.svg);
                var $bg = $(this.svgHelper.music.firstChild);
                (<SVGRectElement>this.svgHelper.music.firstChild).setAttribute('height', "" + height);
                $svg.height(height);
                */
            }
        }

        class SVGFeedbackClient implements Application.IFeedbackClient {
            constructor(private sensorEngine: Views.ISensorGraphicsEngine) { }
            changed(status: ScoreApplication.ScoreStatusManager, key: string, val: any) {
                if (key === "currentNote" || key === "currentPitch") {
                    if (status.currentNote) {
                        var note = status.currentNote;
                        var staffLine = 0;
                        if (status.currentPitch) {
                            var staffContext = note.parent.parent.getStaffContext(note.absTime);
                            staffLine = staffContext.clef.pitchToStaffLine(status.currentPitch);
                        }
                        this.sensorEngine.ShowInsertionPoint(note.id, note.getHorizPosition().beforeAfter * 9, staffLine * SVGMetrics.pitchYFactor);
                    }
                    else if (!status.currentVoice) {
                        this.sensorEngine.HideInsertionPoint();
                    }
                } // todo: note?
                else if (key === "currentNote") {
                    var note = <Model.INote>val;
                    if (note) {
                        this.ShowNoteCursor(note.id, note.parent, note.getHorizPosition(), new Model.Pitch(0, ''));
                    }
                    else {
                        this.HideNoteCursor();
                    }
                }
                else if (key === "insertPoint") {
                    if (status.currentVoice) {
                        var hPos = <Model.HorizPosition>val;
                        var events = status.currentVoice.getEvents(hPos.absTime, hPos.absTime.Add(new Model.TimeSpan(1,1024))); // todo: grimt!
                        if (events.length) {
                            var id = events[0].id;
                            this.sensorEngine.ShowInsertionPoint(id, hPos.beforeAfter * 9, staffLine * SVGMetrics.pitchYFactor);
                        }
                    }
                }
                else if (key === 'currentVoice') {
                    $("#EditLayer .Voice").css('display', 'none');
                    if (val)
                        $("#ed_" + val.id).css('display', 'block');
                }
                else if (key === "currentNotehead") {
                }
                else if (key === "mouseOverElement") {
                    if (status.mouseOverElement)
                        this.MouseOverElement(status.mouseOverElement, true);
                }
                else if (key === "mouseOutElement") {
                    if (val)
                        this.MouseOverElement(val, false);
                }
            }

            public mouseOverStyle: string = "color:#f00;fill:#960;fill-opacity:0.5;stroke:none";

            ShowNoteCursor(noteId: string, voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch) {
                this.sensorEngine.ShowCursor(noteId);
                var events = voice.getEvents();
                for (var i = 0; i < events.length; i++) {
                    var ev = events[i];
                    if (ev.getHorizPosition().Eq(horizPos)) {
                        var staffContext = voice.parent.getStaffContext(horizPos.absTime);
                        var staffLine = staffContext.clef.pitchToStaffLine(pitch);
                        this.sensorEngine.MoveCursor(ev.id, horizPos.beforeAfter * 9, staffLine * SVGMetrics.pitchYFactor); // todo: spacing
                    }
                }
            }
            HideNoteCursor() {
                this.sensorEngine.HideCursor();
            }
            MouseOverElement(elm: Model.IMusicElement, over: boolean) {
                $('#' + elm.id).attr("style", over ? this.mouseOverStyle : "");
                if (elm.getElementName() === "Bar") {
                    $('#' + elm.id + ' path').attr("style", over ? "stroke:#4444ff" : "stroke:#444444");
                    //var bar = <Model.IBar>elm;
                }
                else if (elm.getElementName() === "Note") {
                    var note = <Model.INote>elm;
                    note.withHeads((head: Model.INotehead, i: number) => {
                        var p = head.pitch.toMidi();
                        if (over) {
                            $('#tast' + p).addClass('hover');
                        }
                        else {
                            $('#tast' + p).removeClass('hover');
                        }
                    });
                }
            }


        }

        export class SVGViewer implements ScoreApplication.ScorePlugin {
            constructor(private $svg: JQuery) {
            }

            private svgHelper: SVGHelper;

            public Init(app: ScoreApplication.ScoreApplication) {
                //var $svg = app.container.find('.svgArea');
                if (!this.$svg.length) {
                    var $clientArea = app.container.find('.clientArea');
                    if (!$clientArea.length) {
                        $clientArea = $('<div>').attr('class', 'clientArea').appendTo(app.container);
                    }
                    this.$svg = $('<div>').attr('class', 'svgArea').appendTo($clientArea);
                }
                this.$svg.height(300);

                var svg = <SVGSVGElement>document.createElementNS(SVGHelper.xmlns, "svg");
                svg.setAttributeNS(null, "version", "1.1");
                svg.setAttributeNS(null, "width", "900");
                svg.setAttributeNS(null, "height", "300");
                svg.setAttributeNS(null, "id", "Layer_1");
                this.$svg[0].appendChild(svg);

                this.svgHelper = new SVGHelper(document, svg);

                app.AddDesigner(new MusicSpacing.SpacingDesigner());
                app.AddDesigner(new Views.ExpressionRenderer());
                app.AddDesigner(new TimelineDesigner(this.svgHelper));
                //app.AddDesigner(new BeamDesigner(this.context, this.svgHelper));
                var editors = false;
                if (editors) {
                    //app.AddDesigner(new SVGSensorsValidator(this.svgHelper));
                    app.AddDesigner(new SVGSizeDesigner(this.svgHelper));
                }
                app.AddWriter(new SVGWriter(this.svgHelper));

                app.FeedbackManager.registerClient(new SVGFeedbackClient(this.svgHelper.EditGraphicsHelper));
            }

            public GetId(): string {
                return "Output";
            }

        }

        /********************************* PRIVATE CLASSES ******************************************/

        class SVGGraphicsEngine implements Views.IGraphicsEngine, Views.ISensorGraphicsEngine {
            constructor(svg: any) {
                this._svg = svg;
                this._currentGroup = svg;
            }

            public calcCoordinates(event: MouseEvent): Model.Point {
                var p = this._svg.ownerSVGElement.createSVGPoint();
                p.x = event.clientX;
                p.y = event.clientY;

                var m = (<SVGRectElement>event.currentTarget).getScreenCTM();
                p = p.matrixTransform(m.inverse());

                p.y = Math.round((p.y + 1) / SVGMetrics.pitchYFactor) * SVGMetrics.pitchYFactor;

                return p;
            }

            private groupStack: Element[] = [];
            private _currentGroup: Element;
            get currentGroup(): Element { return this._currentGroup; }
            set currentGroup(v: Element) { this._currentGroup = v; }

            private _svg: any;
            get svg(): any { return this._svg; }

            private TransformElement(elm: Element, x: number, y: number, scale: number) {
                elm.setAttributeNS(null, "transform", 'translate (' + x + ',' + y + '), scale(' + scale + ',' + scale + ')');
            }
            public SetSize(width: number, height: number) {
                /*var pixelHeight = this.unitSvgToHtml(height);
                $('.clientArea').height(pixelHeight);*/
                var $svg = $(this.svg);
                $svg.closest('svg').attr({ 'height': height, 'width': width });

                var $bg = $(this.svg.firstChild);
               // (<SVGRectElement>this.svg.firstChild).setAttribute('height', "" + height);
                $svg.height(height);
            }

            // ISensorEngine members
            private cursorElement: SVGUseElement;
            private insertionElement: SVGGElement;
            public MoveCursor(id: string, x: number, y: number) {
                $('#ed_' + id).prepend(this.cursorElement);
                $(this.cursorElement).attr({ transform: "translate (" + x + ", " + y + ")" });
            }
            public ShowCursor(noteId: string) {
                if (!this.cursorElement) {
                    this.cursorElement = this.CreateMusicObject(noteId, noteId, 0, 0, 1);
                }
                this.cursorElement.style.opacity = '1.0';
            }
            public HideCursor() {
                if (this.cursorElement) {
                    this.cursorElement.style.opacity = '0.0';
                }
            }
            public ShowInsertionPoint(id: string, x: number, y: number) {
                if (!this.insertionElement) {
                    this.insertionElement = <SVGGElement>document.createElementNS(SVGHelper.xmlns, "g");
                    var horiz = document.createElementNS(SVGHelper.xmlns, "path");
                    horiz.setAttributeNS(null, "class", 'horiz');
                    horiz.setAttributeNS(null, "d", 'm -6,0 l 12,0');
                    horiz.setAttributeNS(null, "style", "stroke:#a44");
                    var vert = document.createElementNS(SVGHelper.xmlns, "path");
                    vert.setAttributeNS(null, "d", 'm 0,-6 l 0,36');
                    vert.setAttributeNS(null, "style", "stroke:#a44");
                    this.insertionElement.appendChild(horiz);
                    this.insertionElement.appendChild(vert);
                }
                $('#ed_' + id).prepend(this.insertionElement);
                this.insertionElement.setAttribute('transform', "translate (" + x + ",0)");
                (<SVGPathElement>this.insertionElement.getElementsByTagName('path')[0]).setAttribute('transform', "translate (0, " + y + ")");
                this.insertionElement.setAttribute('display', "inline");
            }
            public HideInsertionPoint() {
                $(this.insertionElement).attr({ display: "none" });
            }

            // IGraphicsEngine members
            public CreateMusicObject(id: string, item: string, x: number, y: number, scale: number): any {
                var curr = this.currentGroup.getElementsByTagNameNS(SVGHelper.xmlns, "path");
                if (id)
                for (var i = 0; i < curr.length; i++) {
                    if (curr[i].attributes.getNamedItem("id") && curr[i].attributes.getNamedItem("id").value === id) {
                        var elm = <Element>curr[i];
                        elm.setAttributeNS(null, "d", emmentaler_notes[item]);
                        this.TransformElement(elm, x, y, scale);
                        return elm;
                    }
                }
                var p = document.createElementNS(SVGHelper.xmlns, "path");
                this.TransformElement(p, x, y, scale);                        
                p.setAttributeNS(null, 'id', id);
                p.setAttributeNS(null, 'd', emmentaler_notes[item]);
                this.currentGroup.appendChild(p);
                return p;
            }
            public CreateRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                // todo: find eksisterende rect
                var rect = document.createElementNS(SVGHelper.xmlns, "rect");
                rect.setAttributeNS(null, "x", "" + x);
                rect.setAttributeNS(null, "width", "" + w);
                rect.setAttributeNS(null, "y", "" + y);
                rect.setAttributeNS(null, "height", "" + h);
                rect.setAttributeNS(null, "id", id);
                rect.setAttributeNS(null, "class", className);
                //rect.setAttributeNS(null, "style", "fill:#0f0;fill-opacity:0.9;stroke:none");
                rect.setAttributeNS(null, "style", "fill:#000;fill-opacity:0;stroke:none");
                this.currentGroup.appendChild(rect);
                return rect;
            }
            public CreatePathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
                if (id) {
                    var exist = document.getElementById(id);
                    if (exist) {
                        if (path !== exist.attributes.getNamedItem("data-path").value) {
                            exist.setAttributeNS(null, "d", path);
                            exist.setAttributeNS(null, "data-path", path);
                        }
                        return exist;
                    }
                }
                var curr = this.currentGroup.getElementsByTagNameNS(SVGHelper.xmlns, "path");
                for (var i = 0; i < curr.length; i++) {
                    if (curr[i].attributes.getNamedItem("data-path")) {
                        var p1 = curr[i].attributes.getNamedItem("data-path").value;
                        if (p1 === path) {
                            return curr[i];
                        }
                    }
                }
                var p = document.createElementNS(SVGHelper.xmlns, "path");
                if (id) p.setAttributeNS(null, "id", id);
                p.setAttributeNS(null, "d", path);
                if (!stroke) stroke = 'none';
                if (!fill) fill = 'none';
                p.setAttributeNS(null, "style", "stroke:" + stroke + "; fill: " + fill);
                p.setAttributeNS(null, "data-path", path);
                this.currentGroup.appendChild(p);
                return p;
            }
            public DrawText(id: string, text: string, x: number, y: number, justify: string): any {
                // todo: find existing
                var textElem = <SVGTextElement>document.createElementNS(SVGHelper.xmlns, "text");
                textElem.appendChild(document.createTextNode(text));
                this.currentGroup.appendChild(textElem);
                textElem.setAttributeNS(null, "x", '' + x);
                textElem.setAttributeNS(null, "y", '' + y);
                //    this.svg.text(x, y, text);
                if (justify !== "left") {
                    var bBox = textElem.getBBox();
                    var xW = bBox.width;
                    var yH = bBox.height;
                    if (justify === "center") {
                        textElem.setAttributeNS(null, "x", "" + (-xW / 2));
                        //textElem.setAttributeNS(null, "y", "" + textSpacing.offset.y);
                    }
                    else if (justify === "right") {
                        textElem.setAttributeNS(null, "x", "" + (-xW));
                    }
                }
                return textElem;
            }

            //private documentFragment: DocumentFragment;
            public BeginDraw() {
                if (true) {
                    $(this.svg).empty(); // todo: slet slettede objekter
                    // todo: beams gentegnes
                    // todo: note stems & flags
                    // todo: meters
                    // todo: bars genoprettes
                    /*this.documentFragment = document.createDocumentFragment();
                    this.currentGroup = <any>this.documentFragment;
                    this.groupStack = [<any>this.documentFragment];*/
                    this.currentGroup = this.svg;
                    this.groupStack = [this.svg];
                }
                else {
                    this.currentGroup = this.svg;
                    this.groupStack = [this.svg];
                }
            }
            public EndDraw() {
                if (true) {
                    //this.svg.appendChild(this.documentFragment);
                    this.groupStack = [];
                }
                else {
                    this.groupStack = [];
                }
            }

            public BeginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                /*var curr = $(this.currentGroup).find('#' + id);
                if (curr.length) {
                    this.currentGroup = curr[0];
                    this.TransformElement(this.currentGroup, x, y, scale);
                }
                else*/ {
                    var newGrp = <Element>document.createElementNS(SVGHelper.xmlns, "g");
                    this.TransformElement(newGrp, x, y, scale);
                    newGrp.setAttributeNS(null, "id", id);
                    newGrp.setAttributeNS(null, "class", className);
                    this.currentGroup.appendChild(newGrp);
                    this.currentGroup = newGrp;
                }
                this.groupStack.push(this.currentGroup);
                return this.currentGroup;
            }
            public EndGroup(group: any) {
                this.groupStack.pop();
                this.currentGroup = this.groupStack[this.groupStack.length - 1];
            }
        }

        class SVGUseGraphicsEngine extends SVGGraphicsEngine {
            constructor(svg: any, private hiddenGroup: SVGElement) { super(svg); }

            public CreateMusicObject(id: string, item: string, x: number, y: number, scale: number): any {


                var curr = this.currentGroup.getElementsByTagNameNS(SVGHelper.xmlns, "use");
                var useElm: Element;
                for (var i = 0; i < curr.length; i++) {
                    if (curr[i].attributes.getNamedItem("id").value === id) {
                        useElm = <Element>curr[i];
                        break;
                    }
                }
                if (!useElm) {
                    useElm = document.createElementNS(SVGHelper.xmlns, "use");
                    this.currentGroup.appendChild(useElm);
                }
                useElm.setAttributeNS(null, "x", "0");
                useElm.setAttributeNS(null, "y", "0");
                useElm.setAttributeNS(null, "height", "300");
                useElm.setAttributeNS(null, "width", "300");
                useElm.setAttributeNS(null, "id", id);
                useElm.setAttributeNS(null, "transform", "translate(" + x + "," + y + ") scale(" + scale + ")");

                var hrefAttr = useElm.attributes.getNamedItem("href");
                if (!hrefAttr || hrefAttr.textContent !== '#' + item) {
                    useElm.setAttributeNS(SVGHelper.xmlnsXpath, "href", '#' + item);
                    /*var curr = this.hiddenGroup.getElementsByTagNameNS(SVGHelper.xmlns, "path");
                    var elm: Element;
                    for (var i = 0; i < curr.length; i++) {
                        if (curr[i].attributes["id"].value === item) {
                            elm = <Element>curr[i];
                            break;
                        }
                    }*/
                    var elm: any = document.getElementById(item);
                    if (!elm) {
                        elm = document.createElementNS(SVGHelper.xmlns, "path");
                        elm.setAttributeNS(null, "d", emmentaler_notes[item]);
                        elm.setAttributeNS(null, "id", item);
                        this.hiddenGroup.appendChild(elm);
                    }

                }
            }

        }


        class SVGHelper {
            constructor(private svgDocument: Document, svg: SVGSVGElement) {
                this.svg = svg;

                this.hiddenLayer = <SVGGElement>document.createElementNS(SVGHelper.xmlns, "g");
                $(this.hiddenLayer).css('display', 'none').attr('id', 'hidden');
                this.svg.appendChild(this.hiddenLayer);

                this.allLayer = <SVGGElement>document.createElementNS(SVGHelper.xmlns, "g");
                $(this.allLayer).attr('id', "MusicLayer_");
                this.svg.appendChild(this.allLayer);

                this.music = <SVGGElement>document.createElementNS(SVGHelper.xmlns, "g");
                $(this.music).attr('id', "MusicLayer");
                this.editLayer = <SVGGElement>document.createElementNS(SVGHelper.xmlns, "g");
                $(this.editLayer).attr('id', "EditLayer");
                this.allLayer.appendChild(this.music);
                this.allLayer.appendChild(this.editLayer);

                var rect = document.createElementNS(SVGHelper.xmlns, "rect");
                rect.setAttributeNS(null, "x", "0");
                rect.setAttributeNS(null, "width", "800");
                rect.setAttributeNS(null, "y", "0");
                rect.setAttributeNS(null, "height", "200");
                rect.setAttributeNS(null, "class", 'musicBackground');
                rect.setAttributeNS(null, "style", "fill:#fff;fill-opacity:0.8;stroke:#ccc;cursor:pointer");
                this.music.appendChild(rect);


                this._MusicGraphicsHelper = new SVGUseGraphicsEngine(this.music, this.hiddenLayer);
                this._EditGraphicsHelper = new SVGGraphicsEngine(this.editLayer);
            }
            
            static xmlns = 'http://www.w3.org/2000/svg';
            static xmlnsXpath = 'http://www.w3.org/1999/xlink';
            public music: SVGGElement;
            public svg: SVGSVGElement;
            public editLayer: SVGGElement;
            public hiddenLayer: SVGGElement;
            public allLayer: SVGGElement;
            
            private _MusicGraphicsHelper: Views.IGraphicsEngine;
            private _EditGraphicsHelper: Views.ISensorGraphicsEngine;
            public get MusicGraphicsHelper(): Views.IGraphicsEngine { return this._MusicGraphicsHelper; }
            public get EditGraphicsHelper(): Views.ISensorGraphicsEngine { return this._EditGraphicsHelper; }

            public createRectElement(): SVGRectElement {
                return <SVGRectElement>(<Document>this.svgDocument).createElementNS(SVGHelper.xmlns, "rect");
            }

            public createGroupElement(): SVGGElement {
                return <SVGGElement>(<Document>this.svgDocument).createElementNS(SVGHelper.xmlns, "g");
            }
        }



        /************************* Designers ********************************/

        interface IHintArea {
            Staff: Model.IStaff;
            checkVoiceButtons(app: ScoreApplication.ScoreApplication, staff: Model.IStaff): void;
            release(): void;
        }

        interface IHintAreaCreator {
            addStaffButton(y: number, staff: Model.IStaff): IHintArea;
        }

        class HintArea {
            constructor(private svgParent: JQuery, private scale: number, private y: number, private staff: Model.IStaff) {
                this.buttonElement = this.createButton();
            }

            public buttonElement: Element;
            public get Staff() { return this.staff; }
            public set Staff(v: Model.IStaff) {
                if (this.staff !== v) {
                    this.staff = v;
                    this.onScroll(null);
                }
            }

            private keyDefinition: Model.IKeyDefinition;
            private clefDefinition: Model.ClefDefinition;
            private meterDefinition: Model.IMeterDefinition;

            private clefElement: Element;
            private meterElement: Element;
            private keyElement: Element;
            private $HelperDiv: any;
            private graphic: Views.IGraphicsEngine;
            private voiceButtons: Element[] = [];

            public checkVoiceButtons(app: ScoreApplication.ScoreApplication, staff: Model.IStaff) {
                while (staff.voiceElements.length < this.voiceButtons.length) {
                    var voiceBtn = this.voiceButtons.pop();
                    var parent = voiceBtn.parentNode;
                    if (parent) parent.removeChild(voiceBtn);
                }
                var $staffBtnDiv = $(this.buttonElement);
                var voiceButtons = this.voiceButtons;
                staff.withVoices((voice: Model.IVoice, indexVoice: number): void => {
                    if (!voiceButtons[indexVoice]) {
                        var $btnDiv = $('<div>')
                            .text('voice ' + indexVoice)
                            .addClass('voiceBtn')
                            .addClass('voiceBtn' + voice.id)
                            .appendTo($staffBtnDiv)
                            .click(function () {
                            app.Status.currentVoice = voice;
                        });
                        var voiceBtn = $btnDiv[0];
                        if (voiceBtn) {
                            voiceBtn.setAttributeNS(null, "style", 'opacity: 0.5');
                            //$(voiceBtn).css('opacity', '0.5');
                            voiceButtons[indexVoice] = voiceBtn;
                        }
                    }
                    else {
                        $(voiceButtons[indexVoice])
                            .addClass('voiceBtn')
                            .addClass('voiceBtn' + voice.id)
                            .text('voice ' + indexVoice);
                    }
                });
            }

            private onScroll(event: Event) {
                var newKey: Model.IKey, newMeter: Model.IMeter, newClef: Model.IClef;
                var scrollLeft = 0;
                if (event) {
                    var s = (<Element>event.target).scrollTop;
                    $('.overlay').css('top', 80 - s);// todo: 80 parameter
                    scrollLeft = (<Element>event.target).scrollLeft;
                }

                var left = -Infinity;
                this.staff.withKeys((key: Model.IKey, i: number) => {
                    var p = MusicSpacing.absolutePos(key, 0, 0);
                    p.x -= scrollLeft;
                    if (p.x < 150 && p.x > left) { newKey = key; left = p.x; }
                });
                var left = -Infinity;
                this.staff.withClefs((clef: Model.IClef, i: number) => {
                    var p = MusicSpacing.absolutePos(clef, 0, 0);
                    p.x -= scrollLeft;
                    if (p.x < 150 && p.x > left) { newClef = clef; left = p.x; }
                });
                var left = -Infinity;
                this.staff.withMeters((meter: Model.IMeter, i: number) => {
                    var p = MusicSpacing.absolutePos(meter, 0, 0);
                    p.x -= scrollLeft;
                    if (p.x < 150 && p.x > left) { newMeter = meter; left = p.x; }
                });
                if (newMeter) {
                    this.setMeter(newMeter.definition);
                }
                if (newClef) {
                    this.setClef(newClef.definition);
                }
                if (newKey) {
                    this.setKey(newKey.definition, newClef.definition);
                }
            }

            public release() {
                $('#appContainer, #clientArea').off("scroll");
            }

            private createButton(): Element {
                var $appContainer = this.svgParent;
                $('#appContainer, #clientArea').on("scroll",(event) => { this.onScroll(event); });

                var $overlayDiv = $appContainer.find('.overlay');
                var scale = this.scale;
                var me = this;
                var $btnDiv = $('<div>')
                    .text('staff')
                    .addClass('staffTitleArea')
                    .css({ top: this.y })
                    .appendTo($overlayDiv);
                this.$HelperDiv = $('<div>')
                    .addClass('helperArea')
                    .appendTo($btnDiv);

                var svg = document.createElementNS(SVGHelper.xmlns, "svg");
                svg.setAttributeNS(null, "version", "1.1");
                svg.setAttributeNS(null, "width", "100");
                svg.setAttributeNS(null, "height", "65");
                this.$HelperDiv.append(svg);


                var hidden = <SVGElement>document.createElementNS(SVGHelper.xmlns, "g");
                hidden.setAttributeNS(null, "display", "none");
                svg.appendChild(hidden);
                var main = <SVGElement>document.createElementNS(SVGHelper.xmlns, "g");
                svg.appendChild(main);
                me.graphic = new SVGUseGraphicsEngine(main, hidden);

                this.onScroll(null);
                var staffContext = this.staff.getStaffContext(Model.AbsoluteTime.startTime);
                if (staffContext.clef) this.setClef(staffContext.clef.definition);
                if (staffContext.meter) this.setMeter(staffContext.meter.definition);
                if (staffContext.key) this.setKey(staffContext.key.definition, staffContext.clef.definition);
                return $btnDiv[0];
            }

            private redraw() {
                this.graphic.BeginDraw();
                var staffLines = this.graphic.BeginGroup('hintstaff' + this.staff.id, 0, 0, this.scale, 'staffLineHelper');
                // staff
                for (var i = 0; i < 5; i++) {
                    this.graphic.CreatePathObject("m 10," + (SVGMetrics.staffHelperYOffset + i * SVGMetrics.pitchYFactor * 2) + " l 80,0", 0, 0, 1, '#bbb', undefined);
                }
                //this.graphic.DrawText('teksterbne', 'Hej', 10, 10, 'left');
                // clef
                if (this.clefDefinition) {
                    var clef = this.graphic.BeginGroup('hintclef' + this.staff.id,(10 + SVGMetrics.clefXOffset), SVGMetrics.staffHelperYOffset + (this.clefDefinition.clefLine - 1) * 2 * SVGMetrics.pitchYFactor, 1, 'clefHelper');
                    this.clefElement = this.graphic.CreateMusicObject('hintclefg' + this.staff.id, SVGClefOutput.RefId(this.clefDefinition, false), 0, 0, 1);
                    this.graphic.EndGroup(clef);
                }
                // meter
                if (this.meterDefinition) {
                    var keyWidth = 0;
                    var index = 0;
                    if (this.keyDefinition) {
                        keyWidth = this.keyDefinition.enumerateKeys().length * SVGMetrics.keyXPerAcc;
                    }
                    var meter = this.graphic.BeginGroup('hintmeter' + this.staff.id, 30 + keyWidth + SVGMetrics.clefXOffset + SVGMetrics.meterX,(SVGMetrics.staffHelperYOffset), 1, 'meterHelper');
                    var fracFunc = (num: string, den: string): any => {
                        var len = Math.max(num.length, den.length);
                        Views.MeterDrawer.addStringXY('hintmeter' + this.staff.id + '_' + index++, this.graphic, num, 0, SVGMetrics.staffHelperYOffset + SVGMetrics.meterY0 - SVGMetrics.pitchYFactor * 6, len);
                        Views.MeterDrawer.addStringXY('hintmeter' + this.staff.id + '_' + index++, this.graphic, den, 0, SVGMetrics.staffHelperYOffset + SVGMetrics.meterY1 - SVGMetrics.pitchYFactor * 6, len);
                    };
                    var fullFunc = (full: string): any => {
                        var len = full.length;
                        Views.MeterDrawer.addStringXY('hintmeter' + this.staff.id + '_' + index++, this.graphic, full, 0, SVGMetrics.staffHelperYOffset + SVGMetrics.meterY0 - SVGMetrics.pitchYFactor * 6, len);
                    };

                    var res = this.meterDefinition.display(fracFunc, fullFunc);
                    $(this.meterElement).data('meter', this.meterDefinition);
                    this.graphic.EndGroup(meter);
                }
                // key
                if (this.keyDefinition && this.clefDefinition) {
                    var key = this.graphic.BeginGroup('hintkey' + this.staff.id, 28 + SVGMetrics.clefXOffset,(SVGMetrics.staffHelperYOffset), 1, 'keyHelper');
                    Views.KeyDrawer.addKeyXY('hintkeyg' + this.staff.id, this.graphic, this.keyDefinition, this.clefDefinition, 0, 0);
                    this.graphic.EndGroup(key);
                }
                this.graphic.EndGroup(staffLines);
                this.graphic.EndDraw();
            }

            public setClef(clefDefinition: Model.ClefDefinition) {
                if (!this.clefDefinition || !this.clefDefinition.Eq(clefDefinition)) {
                    this.clefDefinition = clefDefinition;
                    this.redraw();
                }
            }

            public setKey(keyDefinition: Model.IKeyDefinition, clefDefinition: Model.ClefDefinition) {
                if (!this.keyDefinition || !this.keyDefinition.Eq(keyDefinition)) {
                    this.keyDefinition = keyDefinition;
                    this.redraw();
                }
            }

            public setMeter(meterDefinition: Model.IMeterDefinition) {
                if (!this.meterDefinition || !this.meterDefinition.Eq(meterDefinition)) {
                    this.meterDefinition = meterDefinition;
                    this.redraw();
                }

            }
        }

        export class HintAreaPlugin implements ScoreApplication.ScorePlugin, IHintAreaCreator {
            Init(app: ScoreApplication.ScoreApplication) {
                this.container = $('.appContainer');
                app.AddDesigner(new HintAreaDesigner(app, this));
            }

            private container: JQuery;

            GetId() {
                return "HintArea";
            }

            addStaffButton(y: number, staff: Model.IStaff): IHintArea {
                var svgHintArea = new HintArea(this.container, staff.parent.spacingInfo.scale, y, staff);
                //var svgHintArea = new SVGHintArea($('.appContainer'), staff.parent.spacingInfo.scale, y, staff);
                return svgHintArea;
            }
        }

        class HintAreaDesigner implements ScoreApplication.ScoreDesigner, Application.IFeedbackClient {
            constructor(private app: ScoreApplication.ScoreApplication, private svgHelper: IHintAreaCreator) {
                app.FeedbackManager.registerClient(this);
            }

            private staffButtons: IHintArea[] = [];

            public changed(status: Application.IStatusManager, key: string, val: any) {
                if (key === 'currentVoice') {
                    $('.voiceBtn')
                        .css('opacity', '0.5');
                    if (val)
                        $('.voiceBtn' + val.id).css('opacity','1.0');
                }
            }

            public Validate(app: ScoreApplication.ScoreApplication) {
                var score = app.document;
                while (this.staffButtons.length > score.staffElements.length) {
                    var removeBtn = this.staffButtons.pop();
                    removeBtn.release();
                }

                score.withStaves((staff: Model.IStaff, index: number): void => {
                    var btn: IHintArea;
                    if (index >= this.staffButtons.length) {
                        this.staffButtons.push(btn = this.svgHelper.addStaffButton((staff.spacingInfo.offset.y - 19) * score.spacingInfo.scale, staff));
                    }
                    else {
                        btn = this.staffButtons[index];
                        btn.Staff = staff;
                    }

                    btn.checkVoiceButtons(app, staff);
                });
            }
        }

        class TimelineDesigner implements ScoreApplication.ScoreDesigner {
            constructor(private svgHelper: SVGHelper) {                
            }
            private checkSensors: Views.DOMCheckSensorsVisitor;

            private CheckHintButtons(score: Model.IScore) {
            }

            public Validate(app: ScoreApplication.ScoreApplication) {
                var score = app.document;
                var svgHelper = this.svgHelper;//<SVGHelper>app.GetState("svgHelper:" + this.context); // todo: Svghelper yt

                var visitor = new Views.PrefixVisitor(new Views.RedrawVisitor(svgHelper.MusicGraphicsHelper), svgHelper.MusicGraphicsHelper);
                svgHelper.MusicGraphicsHelper.SetSize(score.spacingInfo.width * score.spacingInfo.scale, score.spacingInfo.height);
                svgHelper.MusicGraphicsHelper.BeginDraw();
                score.VisitAll(visitor);
                svgHelper.MusicGraphicsHelper.EndDraw();

                if (!this.checkSensors) {
                    this.checkSensors = new Views.DOMCheckSensorsVisitor(svgHelper.EditGraphicsHelper, app.document, app);
                    //app.FeedbackManager.registerClient(this.checkSensors);
                }

                var visitor = new Views.PrefixVisitor(this.checkSensors, svgHelper.EditGraphicsHelper, 'ed_');
                svgHelper.EditGraphicsHelper.BeginDraw();
                score.VisitAll(visitor);
                svgHelper.EditGraphicsHelper.EndDraw();

            }
        }
        /*
        class BeamDesigner implements ScoreApplication.ScoreDesigner {
            constructor(private context: string, private svgHelper: SVGHelper) {
                //this.noteOutputHelper = new NoteOutputHelper(this.context, svgHelper);
            }

            //private noteOutputHelper: NoteOutputHelper;

            public Validate(app: ScoreApplication.ScoreApplication) {
                for (var iStaff = 0; iStaff < app.score.staffElements.length; iStaff++) {
                    var staff = app.score.staffElements[iStaff];
                    for (var iVoice = 0; iVoice < staff.voiceElements.length; iVoice++) {
                        var voice = staff.voiceElements[iVoice];
                        this.ValidateVoice(voice);
                        this.ValidateStems(voice);
                    }
                }
            }

            private ValidateVoice(voice: Model.VoiceElement) {
                for (var iNote = 0; iNote < voice.getChildren().length; iNote++) {
                    var note: Model.NoteElement = voice.getChild(iNote);
                    /*var bs = note.getBeamspan();
                    if (bs.length && bs[0] > 0) {
                        // spacing for group
                    }
                    note.sendEvent({ type: MusicEventType.eventType.updateAll, sender: note });* /
                    //var noteOutput = <SvgView.SVGNoteOutput>note.getOutputsByContext(this.context)[0];
                    for (var i = 0; i < note.Beams.length; i++) {
                        var beam = note.Beams[i];
                        if (beam) {
                            //var beamOutput: SvgView.SVGBeamOutput;
                            /*if (beam.getOutputsByContext(this.context).length === 0) {
                                beamOutput = new SvgView.SVGBeamOutput(beam, noteOutput, beam.index);
                            }
                            else beamOutput = <SvgView.SVGBeamOutput>beam.getOutputsByContext(this.context)[0];
                            beamOutput.updateAll();* /
                        }
                    }

                }
            }

            private ValidateStems(voice: Model.VoiceElement) {

            }
        }*/

        /***************************************************** Sensors ************************************************************/

        class SVGEditorMetrics {
            static xPrevFirst = -35;
            static xNextLast = 45;

            static xLeft = -3;
            static xRight = 1;
            static yUp = -20;
            static yDown = 50;

            static xLeftPitch = SVGEditorMetrics.xLeft;
            static xRightPitch = SVGEditorMetrics.xRight;
            static yUpPitch = -3;
            static yDownPitch = 3;

            static xInsertCorrection = -8;
        }

        /*
        Todo: 
        set current note/head after inserting/editing
        dialogs (note, head, voice, staff)       
        */

        class SVGWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            constructor(private svgHelper: SVGHelper) { }

            Init(app: ScoreApplication.ScoreApplication) {
                this.app = app;
            }

            private app: ScoreApplication.ScoreApplication;

            GetId(): string {
                return "SVGWriter";
            }

            GetFormats(): string[] {
                return [
                    "SVG"
                ]
            }

            public Supports(type: string): boolean {
                return type === "SVG";
            }

            GetExtension(type: string): string {
                return "svg";
            }

            public Save() {
                var $svg = $(this.svgHelper.svg.parentNode);
                var xml = $svg.html();
                return xml;
            }
        }

        export class SVGEditorManager {
            public static ActivateVoiceSensors(voice: Model.IVoice, context: string, activate: boolean) {
                //todo: ActivateVoiceSensors
                /*var displayData = <SVGVoiceDisplayData>voice.getDisplayData(context);
                var dispGroupRef = <SensorDisplayData>voice.getDisplayData("Edit:" + context);
                if (activate) {
                    displayData.ref.setAttributeNS(null, "style", 'opacity: 1');
                    displayData.quickBtn.setAttributeNS(null, "style", 'opacity: 1');
                    dispGroupRef.ref.setAttributeNS(null, "style", 'display: svg-g');
                }
                else {
                    displayData.ref.setAttributeNS(null, "style", 'opacity: 0.7');
                    displayData.quickBtn.setAttributeNS(null, "style", 'opacity: 0.7');
                    dispGroupRef.ref.setAttributeNS(null, "style", 'display: none');
                }*/
            }

            public static ActivateAllVoiceSensors(score: Model.IScore, context: string, activate: boolean) {
                score.withVoices((voice: Model.IVoice, index: number) => {
                    this.ActivateVoiceSensors(voice, context, activate);
                });
            }

            /*todo: 
                activate beforenote, afternote, clef, bar
                deactivate everything else

                
            */
        }
    }


    export module Editors {

        export class NoteDecorations {
            private static decorationKeyDefs: { [Index: string]: Model.NoteDecorationKind } = {
                'f': Model.NoteDecorationKind.fermata,
                'q': Model.NoteDecorationKind.thumb,
                '>': Model.NoteDecorationKind.sforzato,
                '<': Model.NoteDecorationKind.espr,
                '.': Model.NoteDecorationKind.staccato,
                ';': Model.NoteDecorationKind.staccatissimo,
                '_': Model.NoteDecorationKind.tenuto,
                'p': Model.NoteDecorationKind.portato,
                'A': Model.NoteDecorationKind.marcato,
                'M': Model.NoteDecorationKind.prall,
                'm': Model.NoteDecorationKind.mordent,
                ',': Model.NoteDecorationKind.caesura,
                '#': Model.NoteDecorationKind.accX,
                'b': Model.NoteDecorationKind.accB,
                't': Model.NoteDecorationKind.trill,
                '§': Model.NoteDecorationKind.turn,
            };

            private static getDef(id: Model.NoteDecorationKind): { u: string; d: string; } {
                switch (id) {
                    case Model.NoteDecorationKind.accX: return {
                        u: 'e_accidentals.2',
                        d: 'e_accidentals.2',
                    };
                    case Model.NoteDecorationKind.accXX: return {
                        u: 'e_accidentals.4',
                        d: 'e_accidentals.4',
                    };
                    case Model.NoteDecorationKind.accB: return {
                        u: 'e_accidentals.M2',
                        d: 'e_accidentals.M2',
                    };
                    case Model.NoteDecorationKind.accBB: return {
                        u: 'e_accidentals.M4',
                        d: 'e_accidentals.M4',
                    };
                    case Model.NoteDecorationKind.fermata: return {
                        u: 'e_scripts.ufermata',
                        d: 'e_scripts.dfermata',
                    };
                    case Model.NoteDecorationKind.shortFermata: return {
                        u: 'e_scripts.ushortfermata',
                        d: 'e_scripts.dshortfermata',
                    };
                    case Model.NoteDecorationKind.longFermata: return {
                        u: 'e_scripts.ulongfermata',
                        d: 'e_scripts.dlongfermata',
                    };
                    case Model.NoteDecorationKind.veryLongFermata: return {
                        u: 'e_scripts.uverylongfermata',
                        d: 'e_scripts.dverylongfermata',
                    };
                    case Model.NoteDecorationKind.thumb: return {
                        u: 'e_scripts.thumb',
                        d: 'e_scripts.thumb',
                    };
                    case Model.NoteDecorationKind.sforzato: return {
                        u: 'e_scripts.sforzato',
                        d: 'e_scripts.sforzato',
                    };
                    case Model.NoteDecorationKind.espr: return {
                        u: 'e_scripts.espr',
                        d: 'e_scripts.espr',
                    };
                    case Model.NoteDecorationKind.staccato: return {
                        u: 'e_scripts.staccato',
                        d: 'e_scripts.staccato',
                    };
                    case Model.NoteDecorationKind.staccatissimo: return {
                        u: 'e_scripts.ustaccatissimo',
                        d: 'e_scripts.dstaccatissimo',
                    };
                    case Model.NoteDecorationKind.tenuto: return {
                        u: 'e_scripts.tenuto',
                        d: 'e_scripts.tenuto',
                    };
                    case Model.NoteDecorationKind.portato: return {
                        u: 'e_scripts.uportato',
                        d: 'e_scripts.dportato',
                    };
                    case Model.NoteDecorationKind.marcato: return {
                        u: 'e_scripts.umarcato',
                        d: 'e_scripts.dmarcato',
                    };
                    case Model.NoteDecorationKind.open: return {
                        u: 'e_scripts.open',
                        d: 'e_scripts.open',
                    };
                    case Model.NoteDecorationKind.stopped: return {
                        u: 'e_scripts.stopped',
                        d: 'e_scripts.stopped',
                    };
                    case Model.NoteDecorationKind.upbow: return {
                        u: 'e_scripts.upbow',
                        d: 'e_scripts.upbow',
                    };
                    case Model.NoteDecorationKind.downbow: return {
                        u: 'e_scripts.downbow',
                        d: 'e_scripts.downbow',
                    };
                    case Model.NoteDecorationKind.reverseturn: return {
                        u: 'e_scripts.reverseturn',
                        d: 'e_scripts.reverseturn',
                    };
                    case Model.NoteDecorationKind.turn: return {
                        u: 'e_scripts.turn',
                        d: 'e_scripts.turn',
                    };
                    case Model.NoteDecorationKind.trill: return {
                        u: 'e_scripts.trill',
                        d: 'e_scripts.trill',
                    };
                    case Model.NoteDecorationKind.pedalheel: return {
                        u: 'e_scripts.upedalheel',
                        d: 'e_scripts.dpedalheel',
                    };
                    case Model.NoteDecorationKind.pedaltoe: return {
                        u: 'e_scripts.upedaltoe',
                        d: 'e_scripts.dpedaltoe',
                    };
                    case Model.NoteDecorationKind.flageolet: return {
                        u: 'e_scripts.flageolet',
                        d: 'e_scripts.flageolet',
                    };
                    case Model.NoteDecorationKind.rcomma: return {
                        u: 'e_scripts.rcomma',
                        d: 'e_scripts.rcomma',
                    };
                    case Model.NoteDecorationKind.prall: return {
                        u: 'e_scripts.prall',
                        d: 'e_scripts.prall',
                    };
                    case Model.NoteDecorationKind.mordent: return {
                        u: 'e_scripts.mordent',
                        d: 'e_scripts.mordent',
                    };
                    case Model.NoteDecorationKind.prallprall: return {
                        u: 'e_scripts.prallprall',
                        d: 'e_scripts.prallprall',
                    };
                    case Model.NoteDecorationKind.prallmordent: return {
                        u: 'e_scripts.prallmordent',
                        d: 'e_scripts.prallmordent',
                    };
                    case Model.NoteDecorationKind.upprall: return {
                        u: 'e_scripts.upprall',
                        d: 'e_scripts.upprall',
                    };
                    case Model.NoteDecorationKind.upmordent: return {
                        u: 'e_scripts.upmordent',
                        d: 'e_scripts.upmordent',
                    };
                    case Model.NoteDecorationKind.pralldown: return {
                        u: 'e_scripts.pralldown',
                        d: 'e_scripts.pralldown',
                    };
                    case Model.NoteDecorationKind.downprall: return {
                        u: 'e_scripts.downprall',
                        d: 'e_scripts.downprall',
                    };
                    case Model.NoteDecorationKind.downmordent: return {
                        u: 'e_scripts.downmordent',
                        d: 'e_scripts.downmordent',
                    };
                    case Model.NoteDecorationKind.prallup: return {
                        u: 'e_scripts.prallup',
                        d: 'e_scripts.prallup',
                    };
                    case Model.NoteDecorationKind.lineprall: return {
                        u: 'e_scripts.lineprall',
                        d: 'e_scripts.lineprall',
                    };
                    case Model.NoteDecorationKind.caesura: return {
                        u: 'e_scripts.caesura',
                        d: 'e_scripts.caesura',
                    };
                }
                return null;
            }

            public static getGlyph(id: Model.NoteDecorationKind, up: boolean): string {
                var def = NoteDecorations.getDef(id);
                if (def) return up ? def.u : def.d;
                return null;
            }

            public static getIdFromKey(key: string): Model.NoteDecorationKind {
                return this.decorationKeyDefs[key];
            }

        }

        /*export interface FeedbackGraphicsEngine {
            //SelectNote(select: boolean);
            //SelectNoteHead(select: boolean);
            //SelectInsertPoint(voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch);
            //SelectVoice(voice: Model.IVoice, select: boolean);
            //SelectStaff(staff: Model.IStaff, select: boolean);
            ShowNoteCursor(noteId: string, voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch): void;
            HideNoteCursor(): void;
            MouseOverElement(elm: Model.IMusicElement, over: boolean): void;
        }*/
        

        export class NoteEditor implements ScoreApplication.ScoreEventProcessor {
            constructor(public context: string) { }

            public Init(app: ScoreApplication.ScoreApplication) {
            }

            public Exit(app: ScoreApplication.ScoreApplication) {
                /*var event: any = { data: { voice: null } }; // todo: any
                this.clickvoice(app, event);*/
            }

            public mouseOverStyle: string = "color:#f00;fill:#0a0;fill-opacity:0.5;stroke:none";
            private cursorElement: SVGUseElement = null;

            public mouseovernote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                app.Status.currentNote = note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(note, true);
                fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition(), event.data.pitch);*/
                app.Status.mouseOverElement = note; // todo: note cursor
                return true;
            }
            public mousemovenote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition(), event.data.pitch);*/
                // todo: note cursor
                return false;
            }
            public mouseoutnote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                app.Status.currentNote = undefined;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(note, false);*/
                if (app.Status.mouseOverElement === note) app.Status.mouseOverElement = null;
                // todo: fb.HideNoteCursor();
                return true;
            }

            public mouseoverafternote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(1), event.data.pitch);*/
                // todo: note cursor
                app.Status.mouseOverElement = note;
                return false;
            }

            public mousemoveafternote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(1), event.data.pitch);*/
                // todo: note cursor
                return false;
            }

            public mouseoutafternote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.HideNoteCursor();*/
                if (app.Status.mouseOverElement === note) app.Status.mouseOverElement = null;
                return false;
            }

            public mousemovebeforenote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(-1), event.data.pitch);*/
                // todo: note cursor
                return false;
            }

            public mouseoverbeforenote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                app.Status.currentNote = undefined;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(-1), event.data.pitch);*/
                app.Status.mouseOverElement = note; // todo: note cursor
                return true;
            }

            public mouseoutbeforenote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.HideNoteCursor();*/
                if (app.Status.mouseOverElement === note) app.Status.mouseOverElement = null;
                return true;
            }
            public mouseoverhead(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var head = <Model.INotehead>event.data.head;
                app.Status.currentNotehead = head;
                app.Status.currentNote = head.parent;

                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(head, true);*/
                app.Status.mouseOverElement = head;
                return false;
            }
            public mouseouthead(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var head = <Model.INotehead>event.data.head;
                app.Status.currentNotehead = undefined;
                app.Status.currentNote = undefined;

                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(head, false);*/
                if (app.Status.mouseOverElement === head) app.Status.mouseOverElement = null;
                return false;
            }

        }



        export class KeyboardNoteEditor extends NoteEditor {
            public keydown(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var theKeyCode = event.keyCode || event.which;
                var keyDefs = <any>$.ui.keyCode;
                for (var key in keyDefs) {
                    if (theKeyCode == keyDefs[key]) {
                        return this.keyPressed(app, key.toUpperCase());
                    }
                }
                return true;
            }

            public keypress(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var key = <string>event.key;
                if (event.ctrlKey || event.altKey) {
                    if (event.altKey) key = 'ALT-' + key;
                    if (event.shiftKey) key = 'SHIFT-' + key;
                    if (event.ctrlKey) key = 'CTRL-' + key;
                }
                return this.keyPressed(app, key);
            }

            public keyPressed(app: ScoreApplication.ScoreApplication, key: string): boolean {
                if (key === 'DELETE') {
                    if (app.Status.currentNotehead) {
                        app.ExecuteCommand(new Model.DeleteNoteheadCommand({
                            head: app.Status.currentNotehead
                        }));
                    }
                    else if (app.Status.currentNote) {
                        app.ExecuteCommand(new Model.DeleteNoteCommand({
                            note: app.Status.currentNote
                        }));
                    }
                    return false;
                }
                else if (key === '+') {
                    if (app.Status.currentNotehead) {
                        app.ExecuteCommand(new Model.RaisePitchAlterationCommand({
                            head: app.Status.currentNotehead,
                            deltaAlteration: 1
                        }));
                    }
                }
                else if (key === '-') // -
                {
                    if (app.Status.currentNotehead) {
                        app.ExecuteCommand(new Model.RaisePitchAlterationCommand({
                            head: app.Status.currentNotehead,
                            deltaAlteration: -1
                        }));
                    }
                }
                else if (key === '=') {
                    if (app.Status.currentNotehead) {
                        app.ExecuteCommand(new Model.TieNoteheadCommand({
                            head: app.Status.currentNotehead,
                            toggle: true,
                            forced: false
                        }));
                    }
                    else
                        if (app.Status.currentNote) {
                            app.ExecuteCommand(new Model.TieNoteCommand({
                                note: app.Status.currentNote,
                                forced: false,
                                toggle: true
                            }));
                        }
                }
                else {
                    if (app.Status.currentNote) {
                        var k = NoteDecorations.getIdFromKey(key);
                        if (k) {
                            app.ExecuteCommand(new Model.AddNoteDecorationCommand({
                                note: app.Status.currentNote,
                                placement: "under",
                                expression: k
                            }));
                            return false;
                        }
                        else if (key === "UP" || key === "DOWN") {
                            var note = app.Status.currentNote;
                            if (note) {
                                //note.setStemDirection(key === "UP" ? Model.StemDirectionType.stemUp : Model.StemDirectionType.stemDown);
                                app.ExecuteCommand(new Model.SetNoteStemDirectionCommand({
                                    note: note,
                                    direction: key
                                }));
                            }
                            return false;
                        }
                        else return true;
                    }
                }
            }
        }

        export class EditNoteEditor extends KeyboardNoteEditor {

            public clicknote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                // note dialog
                var dlg = new UI.NoteDialog("ed", app);
                dlg.setNote(event.data.note).Show();
                return false;
            }

        }

        export class InsertNoteEditor extends KeyboardNoteEditor {
            constructor(public context: string, public noteType: string, public noteTime: Model.TimeSpan, public rest: boolean, public dots: number) {
                super(context);
            }

            public clickafternote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                this.mouseoutafternote(app, event);

                var voice = <Model.IVoice>event.data.voice;

                var absTime = Model.AbsoluteTime.startTime;
                if (voice.noteElements.length) {
                    var lastNote = voice.noteElements[voice.noteElements.length - 1];
                    absTime = lastNote.absTime.Add(lastNote.timeVal);
                }
                var pitch = <Model.Pitch>event.data.pitch; 
                
                var rest = app.Status.rest;
                var dots = app.Status.dots;
                var grace = app.Status.grace;

                var cmd = new Model.AddNoteCommand(
                    {
                        noteName: this.noteType,
                        noteTime: this.noteTime,
                        rest: rest,
                        dots: dots,
                        grace: grace,
                        pitches: [pitch],
                        voice: voice,
                        beforeNote: null,
                        absTime: absTime
                    });
                app.ExecuteCommand(cmd);
                return false;
            }

            public clicknote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                this.mouseoutnote(app, event);

                var note = <Model.INote>event.data.note;

                var absTime = Model.AbsoluteTime.startTime;
                if (note.parent.noteElements.length) {
                    var lastNote = note.parent.noteElements[note.parent.noteElements.length - 1];
                    absTime = lastNote.absTime.Add(lastNote.timeVal);
                }
                
                var pitch = <Model.Pitch>event.data.pitch; 
                if (note.matchesPitch(pitch, true)) {
                    if (!note.matchesOnePitch(pitch, true)) {
                        for (var i = 0; i < note.noteheadElements.length; i++) {
                            if (note.noteheadElements[i].matchesPitch(pitch, true)) {
                                var cmd = new Model.RemoveNoteheadCommand(
                                    {
                                        head: note.noteheadElements[i]
                                    });
                                app.ExecuteCommand(cmd);
                                break;
                            }
                        }
                    }
                }
                else {
                    app.ExecuteCommand(new Model.AddNoteheadCommand(
                        {
                            note: note,
                            pitch: pitch,
                        }));
                }
                return false;
            }

            public clickbeforenote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                this.mouseoutbeforenote(app, event);

                var note = <Model.INote>event.data.note;

                var absTime = Model.AbsoluteTime.startTime;
                if (note.parent.noteElements.length) {
                    var lastNote = note.parent.noteElements[note.parent.noteElements.length - 1];
                    absTime = lastNote.absTime.Add(lastNote.timeVal);
                }
                var pitch = <Model.Pitch>event.data.pitch; 

                var rest = app.Status.rest;
                var dots = app.Status.dots;
                var grace = app.Status.grace;

                var cmd = new Model.AddNoteCommand(
                    {
                        noteName: this.noteType,
                        noteTime: this.noteTime,
                        rest: rest,
                        dots: dots,
                        grace: grace,
                        pitches: [pitch],
                        voice: note.parent,
                        beforeNote: note,
                        absTime: absTime
                    });
                app.ExecuteCommand(cmd);
                return false;
            }

        }


        export class EditNoteTextEditor extends NoteEditor {
            constructor() {
                super('');
                this.editor = document.createElement('input');
                $(this.editor)
                    .data("editor", this)
                    .keydown(this.keyDown)
                    .keyup(this.keyUp);
            }
            public editor: HTMLInputElement;

            public Exit(app: ScoreApplication.ScoreApplication) {
                $(this.editor).hide();
            }

            public getNoteText(note: Model.INote): string {
                var syll: Model.ITextSyllableElement;
                if (note.syllableElements.length) {
                    syll = note.syllableElements[0];
                    return syll.text;
                }
                else {
                    return '';
                }
            }
            // todo: backspace
            // todo: '-' tilføjes til den foregående node - bør aktiveres i keyup eller keypressed
            // todo: fjern editor når der skiftes voice eller tool

            public updateNoteText(note: Model.INote, text: string) {
                var syll: Model.ITextSyllableElement;
                if (note.syllableElements.length) {
                    syll = note.syllableElements[0];
                    syll.text = text;
                    $('#' + syll.id + ' text').text(text);
                }
                else {
                    syll = new Model.TextSyllableElement(note, text);
                    note.addChild(note.syllableElements, syll);
                    
                    var noteElm = document.getElementById(note.id);
                    if (noteElm) {
                        var g = <SVGGElement>document.createElementNS('http://www.w3.org/2000/svg', "g");
                        var textElem = <SVGTextElement>document.createElementNS('http://www.w3.org/2000/svg', "text"); // todo: svghelper
                        textElem.appendChild(document.createTextNode(text));
                        noteElm.appendChild(g);
                        g.appendChild(textElem);
                        g.setAttributeNS(null, "id", syll.id);
                        g.setAttributeNS(null, "transform", "translate (0,50), scale(1,1)");
                        textElem.setAttributeNS(null, "x", '' + 0);
                        textElem.setAttributeNS(null, "y", '' + 0);
                    }
                }
            }

            private keyUp(event: JQueryEventObject) {
                var editor: HTMLInputElement = <HTMLInputElement>event.target;
                var controller: EditNoteTextEditor = <EditNoteTextEditor>$(editor).data("editor");
                if (event.key === "Spacebar" || event.key === " " || event.key === '-') {
                    if (editor.selectionStart === editor.value.length) {
                        var note = <Model.INote>$(editor).data('note');
                        var nextNote = Model.Music.nextNote(note);
                        while (nextNote && nextNote.rest) nextNote = Model.Music.nextNote(nextNote);
                        if (nextNote) {
                            var rect = $('#edit_' + nextNote.id)[0].getBoundingClientRect();
                            var val = $(editor).val();
                            if (val) {
                                controller.updateNoteText(note, val);
                            }
                            $(editor).val(controller.getNoteText(nextNote)).data("note", nextNote).css({ left: rect.left });
                        }
                    }
                }

                var $target = $(editor);
                var $span = $('<span>');
                $span.text($target.val()).appendTo($target.parent());
                $target.css('width', $span[0].getBoundingClientRect().width + 16);
                $span.remove();
                
            }

            private keyDown(event: JQueryEventObject) {
                var editor: HTMLInputElement = <HTMLInputElement>event.target;
                var controller: EditNoteTextEditor = <EditNoteTextEditor>$(editor).data("editor");
                if (event.key === 'Left') {
                    if (editor.selectionStart === 0) {
                        var note = <Model.INote>$(editor).data('note');
                        var prevNote = Model.Music.prevNote(note);
                        while (prevNote && prevNote.rest) prevNote = Model.Music.prevNote(prevNote);
                        if (prevNote) {
                            var rect = $('#edit_' + prevNote.id)[0].getBoundingClientRect();
                            var val = $(editor).val();
                            if (val) {
                                controller.updateNoteText(note, val);
                            }
                            $(editor).val(controller.getNoteText(prevNote)).data("note", prevNote).css({ left: rect.left });
                        }
                    }
                }
                else if (event.key === 'Right') {
                    if (editor.selectionStart === editor.value.length) {
                        var note = <Model.INote>$(editor).data('note');
                        var nextNote = Model.Music.nextNote(note);
                        while (nextNote && nextNote.rest) nextNote = Model.Music.nextNote(nextNote);
                        if (nextNote) {
                            var rect = $('#edit_' + nextNote.id)[0].getBoundingClientRect();
                            var val = $(editor).val();
                            if (val) {
                                controller.updateNoteText(note, val);
                            }
                            $(editor).val(controller.getNoteText(nextNote)).data("note", nextNote).css({ left: rect.left });
                        }
                    }
                }
            }

            public clicknote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                this.mouseoutnote(app, event);
                var note = <Model.INote>event.data.note;
                var text = '';
                if (note.syllableElements.length) {
                    // Edit first syllable
                    if (note.syllableElements[0]) text = note.syllableElements[0].text;
                }
                // Show editor                    
                var rect = $('#edit_' + note.id)[0].getBoundingClientRect();

                $(this.editor)
                    .css({
                        background: "white",
                        border: "solid white thin",
                        position: "absolute",
                        top: rect.bottom + 10,
                        left: rect.left - 8,
                        width: '20px'
                    })
                    .val(text)
                    .data("note", note)
                    .appendTo('body')
                    .show()
                [0].focus();

                return false;
            }

        }

        export class DeleteNoteEditor extends NoteEditor {
            public clicknote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                this.mouseoutnote(app, event);
                var note = <Model.INote>event.data.note;
                app.ExecuteCommand(new Model.DeleteNoteCommand({
                    note: note
                }));
                return false;
            }

            public clickhead(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                this.mouseouthead(app, event);
                var head = <Model.INotehead>event.data.head;
                // todo: slet eneste head bør gøre note til pause
                if (head.parent.matchesOnePitch(head.getPitch(), true) || head.parent.rest) {
                    app.ExecuteCommand(new Model.DeleteNoteCommand({
                        note: head.parent
                    }));
                }
                // Hvis node med mange heades: slet denne head
                else if (head.parent.matchesPitch(head.getPitch(), true) || head.parent.rest) {
                    app.ExecuteCommand(new Model.DeleteNoteheadCommand({
                        head: head
                    }));
                }                
                return false;
            }
        }

        export class ChangeMeterEditor implements ScoreApplication.ScoreEventProcessor {
            constructor(public context: string) { }

            public Init(app: ScoreApplication.ScoreApplication) {
                SvgView.SVGEditorManager.ActivateAllVoiceSensors(app.document, this.context, false);
            }

            public Exit(app: ScoreApplication.ScoreApplication) {
            }


            public clickbar(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var bar = <Model.IBar>event.data.bar;

                var dlg = new UI.MeterDialog("click", app);
                dlg.setTime(bar.absTime).Show();

                return false;
            }

            public clickmeter(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var meter = <Model.IMeter>event.data.meter;

                var dlg = new UI.MeterDialog("click", app);
                dlg.setTime(meter.absTime).setMeter(meter.definition).Show();

                return false;
            }

            public mouseoverbar(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var bar = <Model.IBar>event.data.bar;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(bar, true);*/
                app.Status.mouseOverElement = bar;
                return true;
            }
            public mouseoutbar(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var bar = <Model.IBar>event.data.bar;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(bar, false);*/
                if (app.Status.mouseOverElement === bar) app.Status.mouseOverElement = null;
                return true;
            }
            public mouseovermeter(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var meter = <Model.IMeter>event.data.meter;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(meter, true);*/
                app.Status.mouseOverElement = meter;
                return true;
            }
            public mouseoutmeter(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var meter = <Model.IMeter>event.data.meter;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(meter, false);*/
                if (app.Status.mouseOverElement === meter) app.Status.mouseOverElement = null;
                return true;
            }
        }

        export class ChangeKeyEditor implements ScoreApplication.ScoreEventProcessor {
            constructor(public context: string) { }

            public Init(app: ScoreApplication.ScoreApplication) {
                SvgView.SVGEditorManager.ActivateAllVoiceSensors(app.document, this.context, false);
            }

            public Exit(app: ScoreApplication.ScoreApplication) {
            }


            public clickbar(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var bar = <Model.IBar>event.data.bar;

                var dlg = new UI.KeyDialog("click", app);
                dlg.setTime(bar.absTime).Show();

                return false;
            }

            public clickkey(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var key = <Model.IKey>event.data.key;

                var dlg = new UI.KeyDialog("click", app);
                dlg.setTime(key.absTime).setKey(key).Show();

                return false;
            }
            public mouseoverbar(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var bar = <Model.IBar>event.data.bar;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(bar, true);*/
                app.Status.mouseOverElement = bar;
                return true;
            }
            public mouseoutbar(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var bar = <Model.IBar>event.data.bar;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(bar, false);*/
                if (app.Status.mouseOverElement === bar) app.Status.mouseOverElement = null;
                return true;
            }
            public mouseoverkey(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var key = <Model.IKey>event.data.key;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(key, true);*/
                app.Status.mouseOverElement = key;
                return true;
            }
            public mouseoutkey(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var key = <Model.IKey>event.data.key;
                /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
                fb.MouseOverElement(key, false);*/
                if (app.Status.mouseOverElement === key) app.Status.mouseOverElement = null;
                return true;
            }
        }
        
        
        export class ChangeClefEditor implements ScoreApplication.ScoreEventProcessor {
            constructor(public context: string) { }

            public Init(app: ScoreApplication.ScoreApplication) {
                SvgView.SVGEditorManager.ActivateAllVoiceSensors(app.document, this.context, true);
                // Activate BeforeNote, AfterNote, clef
            }

            public Exit(app: ScoreApplication.ScoreApplication) {
            }


            public clickbeforenote(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var note = <Model.INote>event.data.note;

                var dlg = new UI.ClefDialog("click", app);
                dlg.setTime(note.absTime).setStaff(note.parent.parent).Show();

                return false;
            }

            public clickclef(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var clef = <Model.IClef>event.data.clef;

                var dlg = new UI.ClefDialog("click", app);
                dlg.setClef(clef).setTime(clef.absTime).setStaff(clef.parent).Show();

                return false;
            }


            public mouseoverclef(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var clef = <Model.IClef>event.data.clef;
                //var fb = <FeedbackGraphicsEngine>event.data.feedback;
                //fb.MouseOverElement(clef, true);
                return true;
            }
            public mouseoutclef(app: ScoreApplication.ScoreApplication, event: JQueryEventObject): boolean {
                var clef = <Model.IClef>event.data.clef;
                //var fb = <FeedbackGraphicsEngine>event.data.feedback;
                //fb.MouseOverElement(clef, false);
                return true;
            }

        }
        
                /* TODO: 
            AddStaffExpressionEditor
        */

    }

    export module CanvasView {

        export class CanvasGraphicsEngine implements Views.IGraphicsEngine {
            constructor(private canvas: HTMLCanvasElement) {
                this.context = canvas.getContext('2d');
            }
            private context: CanvasRenderingContext2D;


            private SetTranslation(x: number, y: number) {
                this.context.translate(x, y);
            }
            public SetSize(width: number, height: number) {
                $(this.canvas).attr({ height: height, width: width });
            }
            public BeginDraw() {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            public EndDraw() {
            }
            public CreateMusicObject(id: string, item: string, x: number, y: number, scale: number): any {
                this.SetTranslation(x, y);
                this.context.scale(scale, scale);
                this.DrawPath(jMusicScore.emmentaler_notes[item], 'black', null);
                this.context.scale(1 / scale, 1 / scale);
                this.SetTranslation(-x, -y);
            }
            private DrawPath(path: string, fillStyle: string, strokeStyle: string): any {
                function move(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                    if (stack.length < 2) return false;
                    context.moveTo(stack[0], stack[1]);
                    //$('<li>').text('moveTo(' + Math.round(stack[0]) + ', ' + Math.round(stack[1])).appendTo('#operations');
                    current.x = stack[0];
                    current.y = stack[1];
                    stack.shift();
                    stack.shift();
                    return true;
                }
                function line(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                    if (stack.length < 2) return false;
                    context.lineTo(stack[0], stack[1]);
                    //$('<li>').text('lineTo(' + Math.round(stack[0]) + ', ' + Math.round(stack[1])).appendTo('#operations');
                    current.x = stack[0];
                    current.y = stack[1];
                    stack.shift();
                    stack.shift();
                    return true;
                }
                function horiz(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                    if (stack.length < 1) return false;
                    var x = stack[0] + (relative ? current.x : 0);
                    context.lineTo(x, current.y);
                    //$('<li>').text('horiz(' + Math.round(x) + ', ' + Math.round(current.y)).appendTo('#operations');
                    current.x = x;
                    stack.shift();
                    return true;
                }
                function vert(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                    if (stack.length < 1) return false;
                    var y = stack[0] + (relative ? current.y : 0);
                    context.lineTo(current.x, y);
                    //$('<li>').text('vert(' + Math.round(current.x) + ', ' + Math.round(y)).appendTo('#operations');
                    current.y = y;
                    stack.shift();
                    return true;
                }
                function curve(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                    if (stack.length < 6) return false;
                    context.bezierCurveTo(stack[0], stack[1], stack[2], stack[3], stack[4], stack[5]);
                    /*$('<li>').text(
                        'bezierCurveTo(' + Math.round(stack[0]) + ', ' + Math.round(stack[1]) + ', ' + Math.round(stack[2]) + ', ' + Math.round(stack[3]) + ', ' + Math.round(stack[4])
                        + ', ' + Math.round(stack[5])
                        ).appendTo('#operations');*/
                    current.x = stack[4];
                    current.y = stack[5];
                    stack.shift();
                    stack.shift();
                    stack.shift();
                    stack.shift();
                    stack.shift();
                    stack.shift();
                    return true;
                }
                function close(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                    context.closePath();
                    return true;
                }

                var operations: { [index: string]: (stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean) => boolean } = {
                    'm': move,
                    'M': move,
                    'c': curve,
                    'C': curve,
                    'l': line,
                    'L': line,
                    'H': horiz,
                    'h': horiz,
                    'V': vert,
                    'v': vert,
                    'z': close
                }

                var tokens = path.split(' ');
                var operation: (stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean) => boolean = move;
                var stack: number[] = [];
                var current = { x: 0, y: 0 };
                var relative = false;
                this.context.beginPath();

                for (var i = 0; i < tokens.length; i++) {
                    var token: string = tokens[i];
                    var X = 0;
                    var Y = 0;
                    if (token.match(/^[mclhvMCLHV]$/)) { // todo: support cCsSqQtTaA
                        operation = operations[token];
                        stack = [];
                        relative = (token.match(/^[mclhv]$/)) ? true : false;
                    }
                    else {
                        if (token.match(/^-?\d+(\.\d+)?$/)) {
                            // 1 number
                            stack.push(parseFloat(token) * 1.0);
                        }
                        else if (token.match(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)) {
                            // 2 numbers
                            var numbers = token.split(',');
                            if (relative) {
                                X = current.x + parseFloat(numbers[0]) * 1.0;
                                Y = current.y + parseFloat(numbers[1]) * 1.0;
                            }
                            else {
                                X = parseFloat(numbers[0]) * 1.0;
                                Y = parseFloat(numbers[1]) * 1.0;
                            }
                            stack.push(X);
                            stack.push(Y);
                        }
                    }
                    operation(stack, this.context, current, relative);
                }

                if (fillStyle) {
                    this.context.fillStyle = fillStyle;
                    this.context.fill();
                }
                if (strokeStyle) {
                    this.context.strokeStyle = strokeStyle;
                    this.context.stroke();
                }
            }
            /*public UpdateMusicObject(element: any, item: string, x: number, y: number, scale: number): any {
                this.DrawPath(jMusicScore.emmentaler_notes[item], 'black', null);
            }*/
            public CreatePathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
                this.SetTranslation(x, y);
                this.context.scale(scale, scale);
                this.DrawPath(path, fill, stroke);
                this.context.scale(1 / scale, 1 / scale);
                this.SetTranslation(-x, -y);
            }
            public CreateRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                // todo: canvas rect
            }
            public DrawText(id: string, text: string, x: number, y: number, justify: string): any {
                /*this.context.fillStyle = "black";*/
                this.context.font = "16px Arial";
                var w = this.context.measureText(text).width;
                if (justify === "center") {
                    x -= w / 2;
                }
                else if (justify === "right") {
                    x -= w;
                }
                this.context.fillText(text, x, y);
            }
            public BeginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                this.SetTranslation(x, y);
                this.context.scale(scale, scale);
                return { x: x, y: y, scale: scale };
            }
            public EndGroup(group: any) {
                this.context.scale(1 / group.scale, 1 / group.scale);
                this.SetTranslation(-group.x, -group.y);
            }
        }



        class HtmlGraphicsEngine implements Views.IGraphicsEngine, Views.ISensorGraphicsEngine {
            constructor(private root: HTMLElement, public idPrefix: string) {
                this.currentGroup = $(root);
            }

            private groupStack: JQuery[] = [];
            private currentGroup: JQuery;

            public calcCoordinates(event: MouseEvent): Model.Point {
                var offsetY = event.offsetY;
                var offsetX = event.offsetX;
                if (event.offsetY === undefined) {
                    // Firefox hack
                    var elm = <HTMLDivElement>event.target;
                    var rect = elm.getBoundingClientRect();

                    offsetY = (event.clientY - $(elm).offset().top) * elm.offsetHeight / rect.height;
                    offsetX = (event.clientX - $(elm).offset().left) * elm.offsetHeight / rect.height;
                }

                var p = new Model.Point(offsetX, offsetY + parseInt($(event.target).css('top')));
                return p;
            }
            //CreateRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any;
            // Cursor
            MoveCursor(id: string, x: number, y: number): void { }
            ShowCursor(noteId: string): void { }
            HideCursor(): void { }
            // InsertionPoint
            ShowInsertionPoint(id: string, x: number, y: number): void { }
            HideInsertionPoint(): void { }

            public BeginDraw() {
                //this.scale = 1;
                $(this.root).empty();
                this.currentGroup = $(this.root);
                this.groupStack = [];
            }
            public EndDraw() {
                this.groupStack = [];
            }
            public SetSize(width: number, height: number) {
                $(this.root).css({ height: height, width: width });
            }
            public CreateMusicObject(parent: any, item: string, x: number, y: number, scale: number): any {
                var $img = $('<img>')
                    .attr('src', 'images/symbol1/' + item + '.png')
                    .css({ position: 'absolute', left: x, top: y })
                    .appendTo(this.currentGroup);
                return $img;
            }
            CreatePathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
            }
            CreateRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                var $rect = $('<div>')
                    .css({ position: 'absolute', left: x, top: y, width: w, height: h/*, border: 'solid blue thin'*/ })
                    .attr('id', this.idPrefix + id)
                    .appendTo(this.currentGroup);
                return $rect;
            }
            public DrawText(id: string, text: string, x: number, y: number, justify: string): any { }
            BeginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                var $group = $('<div>').addClass(className).attr('id', this.idPrefix + id).appendTo(this.currentGroup);
                $group.css({ position: "absolute", left: x, top: y, transform: "scale(" + scale + "," + scale + ")" });
                this.groupStack.push($group);
                this.currentGroup = $group;
                return $group;
            }
            EndGroup(group: any) {
                this.groupStack.pop();
                this.currentGroup = this.groupStack[this.groupStack.length - 1];
            }
        }


        class CanvasHelper /*implements SvgView.IHintAreaCreator*/ {
            constructor(private svgDocument: Document, root: HTMLElement) {
                this.root = root;

                this.allLayer = <HTMLElement>document.createElement("div");
                $(this.allLayer).attr('id', "MusicLayer_");
                this.root.appendChild(this.allLayer);

                var $canvas = $('<canvas>').attr({ 'id': 'musicCanvas', 'width': '600px', 'height': '600px' }).appendTo('#svgArea');
                this.music = <HTMLCanvasElement>$canvas[0];

                this.editLayer = document.createElement("div");

                this.allLayer.appendChild(this.music);
                this.allLayer.appendChild(this.editLayer);

                this._MusicGraphicsHelper = new CanvasGraphicsEngine(this.music);
                this._EditGraphicsHelper = new HtmlGraphicsEngine(this.editLayer, 'htmlSensor_');
            }

            public music: HTMLCanvasElement;
            public root: HTMLElement;
            public editLayer: HTMLElement;
            public allLayer: HTMLElement;

            private _MusicGraphicsHelper: Views.IGraphicsEngine;
            private _EditGraphicsHelper: Views.ISensorGraphicsEngine;
            public get MusicGraphicsHelper(): Views.IGraphicsEngine { return this._MusicGraphicsHelper; }
            public get EditGraphicsHelper(): Views.ISensorGraphicsEngine { return this._EditGraphicsHelper; }

            /*public addStaffButton(y: number, staff: Model.IStaff): SVGHintArea {
                var svgHintArea = new SVGHintArea(this.svg, staff.parent.spacingInfo.scale, y, staff);
                return svgHintArea;
            }*/

            public createRectElement(): HTMLElement {
                return document.createElement("div");
            }

            public createGroupElement(): HTMLElement {
                return document.createElement("div");
            }
        }


        class SVGEditorMetrics {
            static xPrevFirst = -35;
            static xNextLast = 45;

            static xLeft = -3;
            static xRight = 1;
            static yUp = -20;
            static yDown = 50;

            static xLeftPitch = SVGEditorMetrics.xLeft;
            static xRightPitch = SVGEditorMetrics.xRight;
            static yUpPitch = -3;
            static yDownPitch = 3;

            static xInsertCorrection = -8;
        }


        class TimelineDesigner implements ScoreApplication.ScoreDesigner {
            constructor(private svgHelper: CanvasHelper) {
            }
            private checkSensors: Views.DOMCheckSensorsVisitor;

            private CheckHintButtons(score: Model.IScore) {
            }

            public Validate(app: ScoreApplication.ScoreApplication) {
                var score = app.document;
                var svgHelper = this.svgHelper;//<SVGHelper>app.GetState("svgHelper:" + this.context); // todo: Svghelper yt

                var visitor = new Views.PrefixVisitor(new Views.RedrawVisitor(svgHelper.MusicGraphicsHelper), svgHelper.MusicGraphicsHelper);
                svgHelper.MusicGraphicsHelper.SetSize(score.spacingInfo.width * score.spacingInfo.scale, score.spacingInfo.height);
                svgHelper.MusicGraphicsHelper.BeginDraw();
                score.VisitAll(visitor);
                svgHelper.MusicGraphicsHelper.EndDraw();

                if (!this.checkSensors) {
                    this.checkSensors = new Views.DOMCheckSensorsVisitor(svgHelper.EditGraphicsHelper, app.document, app);
                    //app.FeedbackManager.registerClient(this.checkSensors);
                }

                var visitor = new Views.PrefixVisitor(this.checkSensors, svgHelper.EditGraphicsHelper, 'ed_');
                svgHelper.EditGraphicsHelper.BeginDraw();
                score.VisitAll(visitor);
                svgHelper.EditGraphicsHelper.EndDraw();

            }
        }


        export class CanvasViewer implements ScoreApplication.ScorePlugin {
            constructor(private $root: JQuery) {
            }

            private canvasHelper: CanvasHelper;

            public Init(app: ScoreApplication.ScoreApplication) {
                //var $svg = app.container.find('.svgArea');
                if (!this.$root.length) {
                    var $clientArea = app.container.find('.clientArea');
                    if (!$clientArea.length) {
                        $clientArea = $('<div>').attr('class', 'clientArea').appendTo(app.container);
                    }
                    this.$root = $('<div>').attr('class', 'svgArea').appendTo($clientArea);
                }
                this.$root.height(300);

                this.canvasHelper = new CanvasHelper(document, this.$root[0]);

                app.AddDesigner(new MusicSpacing.SpacingDesigner());
                app.AddDesigner(new Views.ExpressionRenderer());
                app.AddDesigner(new TimelineDesigner(this.canvasHelper));
                //app.AddDesigner(new HintAreaDesigner(app, this.canvasHelper)); // todo: til egen plugin?
                //app.AddDesigner(new BeamDesigner(this.context, this.svgHelper));
                var editors = false;
                /*if (editors) {
                    //app.AddDesigner(new SVGSensorsValidator(this.svgHelper));
                    app.AddDesigner(new SVGSizeDesigner(this.canvasHelper));
                }
                app.AddWriter(new CanvasWriter(this.canvasHelper));

                app.FeedbackManager.registerClient(new SVGFeedbackClient(this.canvasHelper.EditGraphicsHelper));*/
            }

            public GetId(): string {
                return "Output";
            }

        }


    }
}