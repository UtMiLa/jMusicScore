//module JMusicScore {
import {Model} from "./jMusicScore";
import {JMusicScoreUi} from "./jMusicScore.UI";
import {MusicSpacing} from "./jMusicScore.Spacing";
import {emmentalerNotes} from "./emmentaler";
import {emmentalerCode} from "./emmentaler_code";
import {Commands} from "./commands";
import { ScoreApplication } from "./jMusicScore.Application";
import {Application} from "../JApps/application";
import {Editors} from "./jMusicScore.Editors";


    export module MyModel {
        export interface ILongDecorationSpacingInfo extends Model.ISpacingInfo {
            render?: (deco: Model.ILongDecorationElement, ge: Views.IGraphicsEngine) => void;
        }
    }

    export module Views {
        export interface IBaseGraphicsEngine {
            setSize(width: number, height: number): void;
            beginDraw(): void;
            endDraw(): void;
            // Parent = altid aktuel gruppe
            beginGroup(id: string, x: number, y: number, scale: number, className: string): any;// tjekker om der findes en gruppe med givne id og opretter ellers - hvor kommer id fra? Hvert MusicElement skal have en unik id
            endGroup(group: any): void; // popper gruppestakken - must be balanced!
        }
        export interface IGraphicsEngine extends IBaseGraphicsEngine {
            createMusicObject(id: string, item: string, x: number, y: number, scale: number): any;
            createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id?: string): any;
            drawText(id: string, text: string, x: number, y: number, justify: string): any;
        }

        export interface ISensorGraphicsEngine extends IBaseGraphicsEngine {
            createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any;
            // Cursor
            moveCursor(id: string, x: number, y: number): void;
            showCursor(noteId: string): void;
            hideCursor(): void;
            // InsertionPoint
            showInsertionPoint(id: string, x: number, y: number): void;
            hideInsertionPoint(): void;

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
            };

            public static addKeyXy(id: string, graphic: IGraphicsEngine, keyDefinition: Model.IKeyDefinition, clefDefinition: Model.ClefDefinition, x: number, y: number) {
                //var staffContext = key.parent.getStaffContext(key.absTime);
                var clefOffset = clefDefinition.pitchOffset();
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
                    graphic.createMusicObject(id + '_' + i, ref, x + i * MusicSpacing.Metrics.keyXPerAcc,
                        y + MusicSpacing.Metrics.pitchYFactor * staffLine - MusicSpacing.Metrics.pitchYFactor, 1);
                }
            }
        }

        export class MeterDrawer {
            public static meterDefs: string[] = [
                'e_zero', 'e_one', 'e_two', 'e_three', 'e_four', 'e_five', 'e_six', 'e_seven', 'e_eight', 'e_nine'
            ];

            public static addNumberXy(id: string, graphic: IGraphicsEngine, meterChar: string, x: number, y: number) {
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
                graphic.createMusicObject(id, symbol, x, y, 1);
            }

            public static addStringXy(id: string, graphic: IGraphicsEngine, meterString: string, x: number, y: number, maxLen: number) {
                var deltaX = 0;
                if (meterString.length < maxLen) {
                    deltaX = (maxLen - meterString.length) * 4;
                }
                for (var i = 0; i < meterString.length; i++) {
                    var chr = meterString[i];
                    MeterDrawer.addNumberXy(id, graphic, chr, x + deltaX + i * 8, y);
                }
            }

            public static addMeterXy(id: string, graphic: IGraphicsEngine, meterDefinition: Model.IMeterDefinition, x: number, y: number) {
                var fracFunc = (num: string, den: string): any => {
                    var len = Math.max(num.length, den.length);
                    MeterDrawer.addStringXy(id + '_1', graphic, num, MusicSpacing.Metrics.meterX + x, MusicSpacing.Metrics.meterY0 + y, len);
                    MeterDrawer.addStringXy(id + '_2', graphic, den, MusicSpacing.Metrics.meterX + x, MusicSpacing.Metrics.meterY1 + y, len);
                    //displayData.width = 4 + len * 8;
                };
                var fullFunc = (full: string): any => {
                    var len = full.length;
                    MeterDrawer.addStringXy(id + '_1', graphic, full, MusicSpacing.Metrics.meterX + x, MusicSpacing.Metrics.meterY0 + y, len);
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
            public static render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        }
        class CrescDrawer extends LongDecorationDrawer {
            public static render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                // long deco (cresc)
                var notedecoSpacing = deco.spacingInfo;
                var longDeco = deco;

                var tieDir = (deco.placement === "over") ? -1 : 1;

                var x0 = 1;
                var y0 = tieDir * 1;
                var dy = 1;
                var x1 = notedecoSpacing.distX - 2 * x0;

                if (deco.type === Model.LongDecorationType.Cresc) {
                    x0 = notedecoSpacing.distX - x0;
                    x1 = -x1;
                }

                var path = "m " +
                    x0 + "," + y0 +
                    " l " +
                    x1 + "," + dy + " " +
                    " l " +
                    (-x1) + "," + (2 * dy) + " ";

                graphEngine.createPathObject(path, 0, 0, 1, "black", null);
            }
        }
        class BracketDrawer extends LongDecorationDrawer {
            public static render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        }
        class TupletDrawer extends LongDecorationDrawer {
            public static render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        } 
        class OttavaDrawer extends LongDecorationDrawer {
            public static render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
                var path: string;
            }
        }

        class SlurDrawer extends LongDecorationDrawer {
            public static render(deco: Model.ILongDecorationElement, graphEngine: IGraphicsEngine): void {
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

                graphEngine.createPathObject(path, 0, 0, 1, "", "black");
            }
        }

        class ExpressionFactory implements Model.IVisitorIterator, Model.IVisitor {
            visitPre(element: Model.IMusicElement): (element: Model.IMusicElement) => void {
                element.inviteVisitor(this);
                return null;
            }

            visitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
            }
            visitNote(note: Model.INote, spacing: Model.INoteSpacingInfo) {
            }
            visitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
                // expr
            }
            static longDrawers: any[] = [TrillDrawer, CrescDrawer, CrescDrawer, SlurDrawer, BracketDrawer, TupletDrawer, OttavaDrawer];
            visitLongDecoration(deco: Model.ILongDecorationElement, spacing: MyModel.ILongDecorationSpacingInfo) {
                // expr
                if (spacing && ExpressionFactory.longDrawers[deco.type]) {
                    if (!spacing.render) spacing.render = ExpressionFactory.longDrawers[deco.type].Render;
                    //if (!spacing.CalcSpacing) spacing.CalcSpacing = ExpressionFactory.longDrawers[deco.type].CalcSpacing;
                }
            }
            visitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) {
            }
            visitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
            }
            visitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
            }
            visitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
            }
            visitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
            }
            visitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
            }
            visitTextSyllable(syllable: Model.ITextSyllableElement, spacing: Model.ITextSyllableSpacingInfo) {
            }
            visitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
            }
            visitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
            }
            visitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void {
                // expr
            }

            visitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }
        }

        export class ExpressionRenderer implements ScoreApplication.IScoreDesigner {
            constructor(private spacer: Model.IVisitor = null) {
            }

            public validate(app: ScoreApplication.IScoreApplication) {
                app.document.visitAll(new ExpressionFactory()); // add renderer objects to all note/staff expressions
            }
        }

        /** Responsible for making event handlers on DOM (SVG/HTML) sensors */
        export class DomCheckSensorsVisitor implements Model.IVisitor { // todo: remove event handlers when inactive
            constructor(public sensorEngine: ISensorGraphicsEngine, private score: Model.IScore, private eventReceiver: Application.IEventReceiver) {
            }

            visitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
                var elm = this.sensorEngine.createRectObject("edit_" + head.id, -5, -2, 10, 3, 'NoteheadEdit');
                var evRec = this.eventReceiver;
                var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { head: head/*, feedback: me*/ };
                    evRec.processEvent("mouseoverhead", { head: head });
                })
                    .mouseout(function (event) {
                        event.data = { head: head/*, feedback: me*/ };
                        evRec.processEvent("mouseouthead", { head: head });
                    })
                    .click(function (event) {
                        event.data = { head: head/*, feedback: me*/ };
                        evRec.processEvent("clickhead", { head: head });
                    });
            }
            visitNote(note: Model.INote, noteSpacing: Model.INoteSpacingInfo) {
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

                var elm = this.sensorEngine.createRectObject("edit_" + note.id, rectLeft, rectTop, rectWidth, rectHeight, 'NoteEdit');
                $(elm).mouseover(function (event) { //"#edit_" + note.id
                    var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                    var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                    //event.data = { note: note/*, feedback: me*/, pitch: pitch };
                    evRec.processEvent("mouseovernote", { note: note, pitch: pitch });
                })
                    .mouseout(function (event) {
                        //event.data = { note: note/*, feedback: me*/ };
                        evRec.processEvent("mouseoutnote", { note: note });
                    })
                    .mousemove(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        //event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.processEvent("mousemovenote", { note: note, pitch: pitch });
                    })
                    .click(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        //event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.processEvent("clicknote", { note: note, pitch: pitch });
                    });
                var x0 = rectX0Before - noteSpacing.preWidth;
                var prevNote = Model.Music.prevNote(note);
                if (prevNote && prevNote.spacingInfo.offset.x - note.spacingInfo.offset.x - rectLeft > x0) {
                    x0 = prevNote.spacingInfo.offset.x - note.spacingInfo.offset.x - rectLeft;
                }
                elm = this.sensorEngine.createRectObject("editbefore_" + note.id, x0, rectTopBefore, rectLeft - x0, rectHeightBefore, 'NoteEditBefore');
                $(elm).mouseover(function (event) {
                    var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                    var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                    //event.data = { note: note/*, feedback: me*/, pitch: pitch };
                    evRec.processEvent("mouseoverbeforenote", { note: note, pitch: pitch });
                })
                    .mouseout(function (event) {
                        //event.data = { note: note/*, feedback: me*/ };
                        evRec.processEvent("mouseoutbeforenote", { note: note });
                    })
                    .mousemove(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        //event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.processEvent("mousemovebeforenote", { note: note, pitch: pitch });
                    })
                    .click(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / 3)); // todo: abstraher
                        //event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.processEvent("clickbeforenote", { note: note, pitch: pitch });
                    });


                var nextNote = Model.Music.nextNote(note);
                if (!nextNote) {
                    // afternote

                    elm = this.sensorEngine.createRectObject("editafter_" + note.id, rectLeft + rectWidth, rectTopBefore, rectWidthAfter, rectHeightBefore, 'NoteEditAfter');
                    $(elm).mouseover(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        event.data = { note: note/*, feedback: me*/, pitch: pitch };
                        evRec.processEvent("mouseoverafternote", { note: note, pitch: pitch });
                    })
                        .mouseout(function (event) {
                            event.data = { note: note/*, feedback: me*/ };
                            evRec.processEvent("mouseoutafternote", { note: note });
                        })
                        .mousemove(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            event.data = { note: note/*, feedback: me*/, pitch: pitch };
                            evRec.processEvent("mousemoveafternote", { note: note, pitch: pitch });
                        })
                        .click(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            event.data = { note: note, voice: note.parent/*, feedback: me*/, pitch: pitch };
                            evRec.processEvent("clickafternote", { note: note, pitch: pitch, voice: note.parent });
                        });
                }
            }
            visitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) {
            }
            visitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
            }
            visitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) {
                /*var voiceRef = this.sensorFactory.MakeSureVoiceSensor(voice, staffRef, svgHelper, {
                      'click': (event) => {
                          event.data = { voice: voice };
                          app.ProcessEvent("clickvoice", event);
                      }
                  });*/

            }
            visitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
                var elm = this.sensorEngine.createRectObject("edit_" + clef.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'ClefEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { clef: clef/*, feedback: me*/ };
                    evRec.processEvent("mouseoverclef", { clef: clef });
                })
                    .mouseout(function (event) {
                        event.data = { clef: clef/*, feedback: me*/ };
                        evRec.processEvent("mouseoutclef", { clef: clef });
                    })
                    .click(function (event) {
                        event.data = { clef: clef/*, feedback: me*/ };
                        evRec.processEvent("clickclef", { clef: clef });
                    });
            }
            visitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
                var elm = this.sensorEngine.createRectObject("edit_" + meter.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'MeterEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { meter: meter/*, feedback: me*/ };
                    evRec.processEvent("mouseovermeter", { meter: meter });
                })
                    .mouseout(function (event) {
                        event.data = { meter: meter/*, feedback: me*/ };
                        evRec.processEvent("mouseoutmeter", { meter: meter });
                    })
                    .click(function (event) {
                        event.data = { meter: meter/*, feedback: me*/ };
                        evRec.processEvent("clickmeter", { meter: meter });
                    });
            }
            visitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
                /*this.sensorFactory.MakeSureGraphElementSensor(key, staffRef, svgHelper, {
                    'click': (event: JQueryEventObject) => {
                        event.data = { key: key };
                        app.ProcessEvent("clickkey", event);
                    }
                });*/
                var elm = this.sensorEngine.createRectObject("edit_" + key.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'KeyEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { key: key/*, feedback: me*/ };
                    evRec.processEvent("mouseoverkey", { keySig: key});
                })
                    .mouseout(function (event) {
                        event.data = { key: key/*, feedback: me*/ };
                        evRec.processEvent("mouseoutkey", { keySig: key });
                    })
                    .click(function (event) {
                        event.data = { key: key/*, feedback: me*/ };
                        evRec.processEvent("clickkey", { keySig: key });
                    });
            }
            visitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
            }
            visitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
            }
            visitTextSyllable(textSyllable: Model.ITextSyllableElement, textSpacing: Model.ITextSyllableSpacingInfo) {
            }
            visitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
                var elm = this.sensorEngine.createRectObject("edit_" + bar.id, -spacing.preWidth + spacing.extraXOffset - 3, 0, spacing.preWidth + spacing.width, spacing.end.y - spacing.offset.y, 'BarEdit');
                var evRec = this.eventReceiver;
                //var me = this;
                $(elm).mouseover(function (event) {
                    event.data = { bar: bar/*, feedback: me*/ };
                    evRec.processEvent("mouseoverbar", { bar: bar });
                })
                    .mouseout(function (event) {
                        event.data = { bar: bar/*, feedback: me*/ };
                        evRec.processEvent("mouseoutbar", { bar: bar });
                    })
                    .click(function (event) {
                        event.data = { bar: bar/*, feedback: me*/ };
                        evRec.processEvent("clickbar", { bar: bar });
                    });
            }
            visitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
            }
            visitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void { }

            visitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }


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
            constructor(private graphEngine: IGraphicsEngine) { }

            static getTie(spacing: Model.INoteHeadSpacingInfo): string {
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


            private accidentalDefs: { [index: string]: string } = {
                "bb": "e_accidentals.M4", // bb
                "b": "e_accidentals.M2", // b
                "n": "e_accidentals.0", // nat
                "x": "e_accidentals.2", // x
                "xx": "e_accidentals.4" // xx
            };



            visitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
                this.graphEngine.createMusicObject(null, spacing.headGlyph, spacing.displace.x, spacing.displace.y, spacing.graceScale);
                if (head.getAccidental()) {
                    this.graphEngine.createMusicObject(null, this.accidentalDefs[head.getAccidental()], spacing.offset.x + spacing.accidentalX, 0, spacing.graceScale);
                }
                var tiePath = RedrawVisitor.getTie(spacing);
                if (tiePath) {
                    this.graphEngine.createPathObject(tiePath, 0, 0, 1, undefined, 'black');
                }
                // dots
                for (var i = 0; i < head.parent.dotNo; i++) {
                    var dot = this.graphEngine.createMusicObject(null, 'e_dots.dot', head.parent.spacingInfo.dotWidth + 5/*SVGMetrics.dotSeparation*/ * i, 0, spacing.graceScale);
                }
            }
            visitNote(note: Model.INote, noteSpacing: Model.INoteSpacingInfo) {
                // note stem
                if (!note.rest) {
                    var dirFactor = noteSpacing.rev ? -1 : 1;
                    this.graphEngine.createPathObject("m " + noteSpacing.stemX + "," + noteSpacing.stemRootY
                        + " l 0," + (-dirFactor * noteSpacing.stemLength) + " " + 0.75 /*SVGMetrics.stemWidth*/ + "," + (dirFactor + 0/*SVGMetrics.stemYSlope*/) + " 0," + (dirFactor * noteSpacing.stemLength) + " z", 0, 0, 1, undefined, 'black');
                    // flag
                    if (noteSpacing.flagNo) {
                        var flagSuffix = "" + (noteSpacing.flagNo + 2);
                        if (noteSpacing.rev) {
                            //todo: SVGMetrics
                            this.graphEngine.createMusicObject(null, 'e_flags.d' + flagSuffix, noteSpacing.flagDisplacement.x, (3/*SVGMetrics.pitchYFactor*/ * noteSpacing.highPitchY) + noteSpacing.stemLength + noteSpacing.flagDisplacement.y, noteSpacing.graceScale);
                        } else {
                            this.graphEngine.createMusicObject(null, 'e_flags.u' + flagSuffix, noteSpacing.flagDisplacement.x, (3/*SVGMetrics.pitchYFactor*/ * noteSpacing.lowPitchY) - noteSpacing.stemLength + noteSpacing.flagDisplacement.y, noteSpacing.graceScale);
                        }
                    }
                }
                // rest
                if (note.rest && note.NoteId != 'hidden') {
                    this.graphEngine.createMusicObject(null, noteSpacing.restGlyph, -4.5/*SVGMetrics.restXDisplacement*/, 12/*SVGMetrics.restY*/, 1);

                    for (var i = 0; i < note.dotNo; i++) {
                        var dot = this.graphEngine.createMusicObject(null, 'e_dots.dot', noteSpacing.dotWidth + 5/*SVGMetrics.dotSeparation*/ * i, 12, 1);
                    }
                }
                // ledger lines
                for (var i = 0; i < noteSpacing.ledgerLinesOver.length; i++) {
                    var l = noteSpacing.ledgerLinesOver[i];
                    this.graphEngine.createPathObject("M " + l.xStart + "," + l.y +
                        " L " + l.xEnd + "," + l.y + " z", 0, 0, 1, '#999999', undefined);
                }
                for (var i = 0; i < noteSpacing.ledgerLinesUnder.length; i++) {
                    var l = noteSpacing.ledgerLinesUnder[i];
                    this.graphEngine.createPathObject("M " + l.xStart + "," + l.y +
                        " L " + l.xEnd + "," + l.y + " z", 0, 0, 1, '#999999', undefined);
                }

                // beams
                if (!noteSpacing.flagNo)
                    for (var i = 0; i < note.Beams.length; i++) {
                        var beam = note.Beams[i];
                        if (!beam || beam.parent !== note) continue;
                        var beamSpacing = beam.spacingInfo;
                        var step = beam.index * beamSpacing.beamDist;

                        this.graphEngine.createPathObject("M " + beamSpacing.start.x + "," + (beamSpacing.start.y + step) +
                            " L " + beamSpacing.end.x + "," + (beamSpacing.end.y + step) +
                            " " + beamSpacing.end.x + "," + (beamSpacing.end.y + 2 + step) +
                            " " + beamSpacing.start.x + "," + (beamSpacing.start.y + 2 + step) +
                            " z", 0, 0, 1, undefined, 'black', 'beam_'+beam.parent.id + '_' + beam.index);
                    }
            }
            visitLongDecoration(deco: Model.ILongDecorationElement, spacing: MyModel.ILongDecorationSpacingInfo) {
                if (spacing.render) spacing.render(deco, this.graphEngine);
            }
            visitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
                // short deco
                var decoId = deco.getDecorationId();
                if (decoId >= Model.NoteDecorationKind.Arpeggio && decoId <= Model.NoteDecorationKind.NonArpeggio) {
                    // arpeggio
                    if (decoId === Model.NoteDecorationKind.Arpeggio || (decoId === Model.NoteDecorationKind.ArpeggioDown)) {
                        var yL = deco.parent.spacingInfo.lowPitchY;
                        var yH = deco.parent.spacingInfo.highPitchY;
                        var yStep = 2;
                        var y = yL;
                        while (y >= yH) {
                            if (y === yL && (decoId === Model.NoteDecorationKind.ArpeggioDown)) {
                                this.graphEngine.createMusicObject(null, 'e_scripts.arpeggio.arrow.M1', -12, y * 3 + 2, 1);
                            }
                            else
                            this.graphEngine.createMusicObject(null, 'e_scripts.arpeggio', -12, y*3+2, 1);
                            y -= yStep;
                        }
                        
                    }
                    else if (decoId === Model.NoteDecorationKind.NonArpeggio) {
                        var yL = deco.parent.spacingInfo.lowPitchY;
                        var yH = deco.parent.spacingInfo.highPitchY;
                        var path = 'm -10,' + (yL*3 + 2) + ' l -2,0 0,' + ((yH - yL)*3 - 4) + ' 2,0';
                        this.graphEngine.createPathObject(path, 0, 0, 1, 'black', null);
                    }
                }
                else {
                    var ref = Editors.NoteDecorations.getGlyph(decoId, deco.placement === "over");

                    if (ref) {
                        this.graphEngine.createMusicObject(null, ref, 0, 0, 1);
                    }
                    else {
                        alert("Error: " + decoId);
                    }
                }
            }
            visitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) { }
            visitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
                this.graphEngine.createMusicObject(null, spacing.clefId, 0, 0, 1);
            }
            visitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
                if (!spacing) { meter.setSpacingInfo(spacing = new MusicSpacing.MeterSpacingInfo(meter)); }
                MeterDrawer.addMeterXy(null, this.graphEngine, meter.definition, 0, 0);
            }
            visitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
                var staffContext = key.parent.getStaffContext(key.absTime);
                KeyDrawer.addKeyXy(null, this.graphEngine, key.definition, staffContext.clef.definition, 0, 0);
            }
            visitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
                for (var i = 0; i < 5; i++) {
                    this.graphEngine.createPathObject("m 0," + i * spacing.staffSpace * 2 + " l " + spacing.staffLength + ",0", 0, 0, 1, '#888', undefined, 'staffline' + staff.id + ' ' + i);
                }
            }
            visitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
                //this.graphEngine.SetSize(spacing.width * spacing.scale, spacing.height);
            }
            visitTextSyllable(textSyllable: Model.ITextSyllableElement, textSpacing: Model.ITextSyllableSpacingInfo) {
                this.graphEngine.drawText("text" + textSyllable.id, textSyllable.Text, 0, 0, "center");
            }
            visitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
                this.graphEngine.createPathObject("m " + spacing.extraXOffset + ",0 l 0," + (spacing.end.y - spacing.offset.y), 0, 0, 1, '#444444', undefined);
            }
            visitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
            }
            visitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void {
                this.graphEngine.drawText("text" + staffExpression.id, staffExpression.text, 0, 0, "left");
            }

            visitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }
        }

        export class PrefixVisitor implements Model.IVisitorIterator {
            constructor(private visitor: Model.IVisitor, private cge: IBaseGraphicsEngine, private prefix = '') {
            }
            public visitPre(element: Model.IMusicElement): (element: Model.IMusicElement) => void {
                var spacing = element.spacingInfo;
                if (spacing) {
                    var grp = this.cge.beginGroup(this.prefix + element.id, spacing.offset.x, spacing.offset.y, spacing.scale, element.getElementName());
                    element.inviteVisitor(this.visitor);
                    //spacing.InviteVisitor(this.visitor);
                    return (element: Model.IMusicElement) => { this.cge.endGroup(grp); };
                }
            }
        }


    }

    /// Music 
    export module SvgView {

        class SvgMetrics { // todo: yt
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


        interface INoteDef {
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
            flagSuffix?: string;
            rest?: boolean;
        }
        //todo: still some spacing
        class SvgClefOutput {
            public static refId(def: Model.ClefDefinition, change: boolean): string {//todo: væk
                if (change) {
                    switch (def.clefCode) {
                        case Model.ClefType.ClefG: {
                            if (def.transposition === -7) { return "tenor-clef"; }
                            else return "e_clefs.G_change";
                        }
                        case Model.ClefType.ClefC: return "e_clefs.C_change";
                        case Model.ClefType.ClefF: return "e_clefs.F_change";
                        case Model.ClefType.ClefNone: return "";
                        case Model.ClefType.ClefPercussion: return "e_clefs.percussion_change";
                        case Model.ClefType.ClefTab: return "e_clefs.tab_change";
                    }
                }
                else {
                    switch (def.clefCode) {
                        case Model.ClefType.ClefG: {
                            if (def.transposition === -7) { return "tenor-clef"; }
                            else return "e_clefs.G";
                        }
                        case Model.ClefType.ClefC: return "e_clefs.C";
                        case Model.ClefType.ClefF: return "e_clefs.F";
                        case Model.ClefType.ClefNone: return "";
                        case Model.ClefType.ClefPercussion: return "e_clefs.percussion";
                        case Model.ClefType.ClefTab: return "e_clefs.tab";
                    }
                }
            }/**/

        }

                
        class SvgSizeDesigner implements ScoreApplication.IScoreDesigner {
            constructor(private svgHelper: SvgHelper) {
            }

            validate(app: ScoreApplication.IScoreApplication) {
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

        export class DomFeedbackClient implements Application.IFeedbackClient {
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
                        this.sensorEngine.showInsertionPoint(note.id, note.getHorizPosition().beforeAfter * 9, staffLine * SvgMetrics.pitchYFactor);
                    }
                    else if (!status.currentVoice) {
                        this.sensorEngine.hideInsertionPoint();
                    }
                } // todo: note?
                else if (key === "currentNote") {
                    var note = <Model.INote>val;
                    if (note) {
                        this.showNoteCursor(note.id, note.parent, note.getHorizPosition(), new Model.Pitch(0, ''));
                    }
                    else {
                        this.hideNoteCursor();
                    }
                }
                else if (key === "insertPoint") {
                    if (status.currentVoice) {
                        var hPos = <Model.HorizPosition>val;
                        var events = status.currentVoice.getEvents(hPos.absTime, hPos.absTime.add(new Model.TimeSpan(1,1024))); // todo: grimt!
                        if (events.length) {
                            var id = events[0].id;
                            this.sensorEngine.showInsertionPoint(id, hPos.beforeAfter * 9, staffLine * SvgMetrics.pitchYFactor);
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
                        this.mouseOverElement(status.mouseOverElement, true);
                }
                else if (key === "mouseOutElement") {
                    if (val)
                        this.mouseOverElement(val, false);
                }
            }

            public mouseOverStyle: string = "color:#f00;fill:#960;fill-opacity:0.5;stroke:none";

            showNoteCursor(noteId: string, voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch) {
                this.sensorEngine.showCursor(noteId);
                var events = voice.getEvents();
                for (var i = 0; i < events.length; i++) {
                    var ev = events[i];
                    if (ev.getHorizPosition().eq(horizPos)) {
                        var staffContext = voice.parent.getStaffContext(horizPos.absTime);
                        var staffLine = staffContext.clef.pitchToStaffLine(pitch);
                        this.sensorEngine.moveCursor(ev.id, horizPos.beforeAfter * 9, staffLine * SvgMetrics.pitchYFactor); // todo: spacing
                    }
                }
            }
            hideNoteCursor() {
                this.sensorEngine.hideCursor();
            }
            mouseOverElement(elm: Model.IMusicElement, over: boolean) {
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

        export class SvgViewer implements ScoreApplication.IScorePlugin {
            constructor(private $svg: JQuery, public container: JQuery) {
            }

            private svgHelper: SvgHelper;

            public init(app: ScoreApplication.IScoreApplication) {
                //var $svg = app.container.find('.svgArea');
                if (!this.$svg.length) {
                    var $clientArea = this.container.find('.clientArea');
                    if (!$clientArea.length) {
                        $clientArea = $('<div>').attr('class', 'clientArea').appendTo(this.container);
                    }
                    this.$svg = $('<div>').attr('class', 'svgArea').appendTo($clientArea);
                }
                this.$svg.height(300);

                var svg = <SVGSVGElement>document.createElementNS(SvgHelper.xmlns, "svg");
                svg.setAttributeNS(null, "version", "1.1");
                svg.setAttributeNS(null, "width", "900");
                svg.setAttributeNS(null, "height", "300");
                svg.setAttributeNS(null, "id", "Layer_1");
                this.$svg[0].appendChild(svg);

                this.svgHelper = new SvgHelper(document, svg);

                app.addDesigner(new MusicSpacing.SpacingDesigner());
                app.addDesigner(new Views.ExpressionRenderer());
                app.addDesigner(new TimelineDesigner(this.svgHelper));
                //app.AddDesigner(new BeamDesigner(this.context, this.svgHelper));
                var editors = false;
                if (editors) {
                    //app.AddDesigner(new SVGSensorsValidator(this.svgHelper));
                    app.addDesigner(new SvgSizeDesigner(this.svgHelper));
                }
                app.addWriter(new SvgWriter(this.svgHelper));

                app.FeedbackManager.registerClient(new DomFeedbackClient(this.svgHelper.EditGraphicsHelper));
            }

            public getId(): string {
                return "Output";
            }

        }

        /********************************* PRIVATE CLASSES ******************************************/

        class SvgGraphicsEngine implements Views.IGraphicsEngine, Views.ISensorGraphicsEngine {
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

                p.y = Math.round((p.y + 1) / SvgMetrics.pitchYFactor) * SvgMetrics.pitchYFactor;

                return p;
            }

            private groupStack: Element[] = [];
            private _currentGroup: Element;
            get currentGroup(): Element { return this._currentGroup; }
            set currentGroup(v: Element) { this._currentGroup = v; }

            private _svg: any;
            get svg(): any { return this._svg; }

            private transformElement(elm: Element, x: number, y: number, scale: number) {
                elm.setAttributeNS(null, "transform", 'translate (' + x + ',' + y + '), scale(' + scale + ',' + scale + ')');
            }
            public setSize(width: number, height: number) {
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
            public moveCursor(id: string, x: number, y: number) {
                $('#ed_' + id).prepend(this.cursorElement);
                $(this.cursorElement).attr({ transform: "translate (" + x + ", " + y + ")" });
            }
            public showCursor(noteId: string) {
                if (!this.cursorElement) {
                    this.cursorElement = this.createMusicObject(noteId, noteId, 0, 0, 1);
                }
                this.cursorElement.style.opacity = '1.0';
            }
            public hideCursor() {
                if (this.cursorElement) {
                    this.cursorElement.style.opacity = '0.0';
                }
            }
            public showInsertionPoint(id: string, x: number, y: number) {
                if (!this.insertionElement) {
                    this.insertionElement = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
                    var horiz = document.createElementNS(SvgHelper.xmlns, "path");
                    horiz.setAttributeNS(null, "class", 'horiz');
                    horiz.setAttributeNS(null, "d", 'm -6,0 l 12,0');
                    horiz.setAttributeNS(null, "style", "stroke:#a44");
                    var vert = document.createElementNS(SvgHelper.xmlns, "path");
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
            public hideInsertionPoint() {
                $(this.insertionElement).attr({ display: "none" });
            }

            // IGraphicsEngine members
            public createMusicObject(id: string, item: string, x: number, y: number, scale: number): any {
                var curr = this.currentGroup.getElementsByTagNameNS(SvgHelper.xmlns, "path");
                if (id)
                for (var i = 0; i < curr.length; i++) {
                    if (curr[i].attributes.getNamedItem("id") && curr[i].attributes.getNamedItem("id").value === id) {
                        var elm = <Element>curr[i];
                        elm.setAttributeNS(null, "d", emmentalerNotes[item]);
                        this.transformElement(elm, x, y, scale);
                        return elm;
                    }
                }
                var p = document.createElementNS(SvgHelper.xmlns, "path");
                this.transformElement(p, x, y, scale);                        
                p.setAttributeNS(null, 'id', id);
                p.setAttributeNS(null, 'd', emmentalerNotes[item]);
                this.currentGroup.appendChild(p);
                return p;
            }
            public createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                // todo: find eksisterende rect
                var rect = document.createElementNS(SvgHelper.xmlns, "rect");
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
            public createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
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
                var curr = this.currentGroup.getElementsByTagNameNS(SvgHelper.xmlns, "path");
                for (var i = 0; i < curr.length; i++) {
                    if (curr[i].attributes.getNamedItem("data-path")) {
                        var p1 = curr[i].attributes.getNamedItem("data-path").value;
                        if (p1 === path) {
                            return curr[i];
                        }
                    }
                }
                var p = document.createElementNS(SvgHelper.xmlns, "path");
                if (id) p.setAttributeNS(null, "id", id);
                p.setAttributeNS(null, "d", path);
                if (!stroke) stroke = 'none';
                if (!fill) fill = 'none';
                p.setAttributeNS(null, "style", "stroke:" + stroke + "; fill: " + fill);
                p.setAttributeNS(null, "data-path", path);
                this.currentGroup.appendChild(p);
                return p;
            }
            public drawText(id: string, text: string, x: number, y: number, justify: string): any {
                // todo: find existing
                var textElem = <SVGTextElement>document.createElementNS(SvgHelper.xmlns, "text");
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
            public beginDraw() {
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
                /*else {
                    this.currentGroup = this.svg;
                    this.groupStack = [this.svg];
                }*/
            }
            public endDraw() {
                if (true) {
                    //this.svg.appendChild(this.documentFragment);
                    this.groupStack = [];
                }
                /*else {
                    this.groupStack = [];
                }*/
            }

            public beginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                /*var curr = $(this.currentGroup).find('#' + id);
                if (curr.length) {
                    this.currentGroup = curr[0];
                    this.TransformElement(this.currentGroup, x, y, scale);
                }
                else*/ {
                    var newGrp = document.createElementNS(SvgHelper.xmlns, "g");
                    this.transformElement(newGrp, x, y, scale);
                    newGrp.setAttributeNS(null, "id", id);
                    newGrp.setAttributeNS(null, "class", className);
                    this.currentGroup.appendChild(newGrp);
                    this.currentGroup = newGrp;
                }
                this.groupStack.push(this.currentGroup);
                return this.currentGroup;
            }
            public endGroup(group: any) {
                this.groupStack.pop();
                this.currentGroup = this.groupStack[this.groupStack.length - 1];
            }
        }

        class SvgUseGraphicsEngine extends SvgGraphicsEngine {
            constructor(svg: any, private hiddenGroup: SVGElement) { super(svg); }

            public createMusicObject(id: string, item: string, x: number, y: number, scale: number): any {


                var curr = this.currentGroup.getElementsByTagNameNS(SvgHelper.xmlns, "use");
                var useElm: Element = undefined;
                for (var i = 0; i < curr.length; i++) {
                    if (curr[i].attributes.getNamedItem("id").value === id) {
                        useElm = <Element>curr[i];
                        break;
                    }
                }
                if (!useElm) {
                    useElm = document.createElementNS(SvgHelper.xmlns, "use");
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
                    useElm.setAttributeNS(SvgHelper.xmlnsXpath, "href", '#' + item);
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
                        elm = document.createElementNS(SvgHelper.xmlns, "path");
                        elm.setAttributeNS(null, "d", emmentalerNotes[item]);
                        elm.setAttributeNS(null, "id", item);
                        this.hiddenGroup.appendChild(elm);
                    }

                }
            }

        }


        class SvgHelper {
            constructor(private svgDocument: Document, svg: SVGSVGElement) {
                this.svg = svg;

                this.hiddenLayer = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
                $(this.hiddenLayer).css('display', 'none').attr('id', 'hidden');
                this.svg.appendChild(this.hiddenLayer);

                this.allLayer = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
                $(this.allLayer).attr('id', "MusicLayer_");
                this.svg.appendChild(this.allLayer);

                this.music = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
                $(this.music).attr('id', "MusicLayer");
                this.editLayer = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
                $(this.editLayer).attr('id', "EditLayer");
                this.allLayer.appendChild(this.music);
                this.allLayer.appendChild(this.editLayer);

                var rect = document.createElementNS(SvgHelper.xmlns, "rect");
                rect.setAttributeNS(null, "x", "0");
                rect.setAttributeNS(null, "width", "800");
                rect.setAttributeNS(null, "y", "0");
                rect.setAttributeNS(null, "height", "200");
                rect.setAttributeNS(null, "class", 'musicBackground');
                rect.setAttributeNS(null, "style", "fill:#fff;fill-opacity:0.8;stroke:#ccc;cursor:pointer");
                this.music.appendChild(rect);


                this.musicGraphicsHelper = new SvgUseGraphicsEngine(this.music, this.hiddenLayer);
                this.editGraphicsHelper = new SvgGraphicsEngine(this.editLayer);
            }
            
            static xmlns = 'http://www.w3.org/2000/svg';
            static xmlnsXpath = 'http://www.w3.org/1999/xlink';
            public music: SVGGElement;
            public svg: SVGSVGElement;
            public editLayer: SVGGElement;
            public hiddenLayer: SVGGElement;
            public allLayer: SVGGElement;
            
            private musicGraphicsHelper: Views.IGraphicsEngine;
            private editGraphicsHelper: Views.ISensorGraphicsEngine;
            public get MusicGraphicsHelper(): Views.IGraphicsEngine { return this.musicGraphicsHelper; }
            public get EditGraphicsHelper(): Views.ISensorGraphicsEngine { return this.editGraphicsHelper; }

            public createRectElement(): SVGRectElement {
                return <SVGRectElement>(this.svgDocument).createElementNS(SvgHelper.xmlns, "rect");
            }

            public createGroupElement(): SVGGElement {
                return <SVGGElement>(this.svgDocument).createElementNS(SvgHelper.xmlns, "g");
            }
        }



        /************************* Designers ********************************/

        export interface IHintArea {
            Staff: Model.IStaff;
            checkVoiceButtons(app: ScoreApplication.IScoreApplication, staff: Model.IStaff): void;
            release(): void;
        }

        export interface IHintAreaCreator {
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

            public checkVoiceButtons(app: ScoreApplication.IScoreApplication, staff: Model.IStaff) {
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
                left = -Infinity;
                this.staff.withClefs((clef: Model.IClef, i: number) => {
                    var p = MusicSpacing.absolutePos(clef, 0, 0);
                    p.x -= scrollLeft;
                    if (p.x < 150 && p.x > left) { newClef = clef; left = p.x; }
                });
                left = -Infinity;
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

                var svg = document.createElementNS(SvgHelper.xmlns, "svg");
                svg.setAttributeNS(null, "version", "1.1");
                svg.setAttributeNS(null, "width", "100");
                svg.setAttributeNS(null, "height", "65");
                this.$HelperDiv.append(svg);


                var hidden = <SVGElement>document.createElementNS(SvgHelper.xmlns, "g");
                hidden.setAttributeNS(null, "display", "none");
                svg.appendChild(hidden);
                var main = <SVGElement>document.createElementNS(SvgHelper.xmlns, "g");
                svg.appendChild(main);
                me.graphic = new SvgUseGraphicsEngine(main, hidden);

                this.onScroll(null);
                var staffContext = this.staff.getStaffContext(Model.AbsoluteTime.startTime);
                if (staffContext.clef) this.setClef(staffContext.clef.definition);
                if (staffContext.meter) this.setMeter(staffContext.meter.definition);
                if (staffContext.key) this.setKey(staffContext.key.definition, staffContext.clef.definition);
                return $btnDiv[0];
            }

            private redraw() {
                this.graphic.beginDraw();
                var staffLines = this.graphic.beginGroup('hintstaff' + this.staff.id, 0, 0, this.scale, 'staffLineHelper');
                // staff
                for (var i = 0; i < 5; i++) {
                    this.graphic.createPathObject("m 10," + (SvgMetrics.staffHelperYOffset + i * SvgMetrics.pitchYFactor * 2) + " l 80,0", 0, 0, 1, '#bbb', undefined);
                }
                //this.graphic.DrawText('teksterbne', 'Hej', 10, 10, 'left');
                // clef
                if (this.clefDefinition) {
                    var clef = this.graphic.beginGroup('hintclef' + this.staff.id,(10 + SvgMetrics.clefXOffset), SvgMetrics.staffHelperYOffset + (this.clefDefinition.clefLine - 1) * 2 * SvgMetrics.pitchYFactor, 1, 'clefHelper');
                    this.clefElement = this.graphic.createMusicObject('hintclefg' + this.staff.id, SvgClefOutput.refId(this.clefDefinition, false), 0, 0, 1);
                    this.graphic.endGroup(clef);
                }
                // meter
                if (this.meterDefinition) {
                    var keyWidth = 0;
                    var index = 0;
                    if (this.keyDefinition) {
                        keyWidth = this.keyDefinition.enumerateKeys().length * SvgMetrics.keyXPerAcc;
                    }
                    var meter = this.graphic.beginGroup('hintmeter' + this.staff.id, 30 + keyWidth + SvgMetrics.clefXOffset + SvgMetrics.meterX,(SvgMetrics.staffHelperYOffset), 1, 'meterHelper');
                    var fracFunc = (num: string, den: string): any => {
                        var len = Math.max(num.length, den.length);
                        Views.MeterDrawer.addStringXy('hintmeter' + this.staff.id + '_' + index++, this.graphic, num, 0, SvgMetrics.staffHelperYOffset + SvgMetrics.meterY0 - SvgMetrics.pitchYFactor * 6, len);
                        Views.MeterDrawer.addStringXy('hintmeter' + this.staff.id + '_' + index++, this.graphic, den, 0, SvgMetrics.staffHelperYOffset + SvgMetrics.meterY1 - SvgMetrics.pitchYFactor * 6, len);
                    };
                    var fullFunc = (full: string): any => {
                        var len = full.length;
                        Views.MeterDrawer.addStringXy('hintmeter' + this.staff.id + '_' + index++, this.graphic, full, 0, SvgMetrics.staffHelperYOffset + SvgMetrics.meterY0 - SvgMetrics.pitchYFactor * 6, len);
                    };

                    var res = this.meterDefinition.display(fracFunc, fullFunc);
                    $(this.meterElement).data('meter', this.meterDefinition);
                    this.graphic.endGroup(meter);
                }
                // key
                if (this.keyDefinition && this.clefDefinition) {
                    var key = this.graphic.beginGroup('hintkey' + this.staff.id, 28 + SvgMetrics.clefXOffset,(SvgMetrics.staffHelperYOffset), 1, 'keyHelper');
                    Views.KeyDrawer.addKeyXy('hintkeyg' + this.staff.id, this.graphic, this.keyDefinition, this.clefDefinition, 0, 0);
                    this.graphic.endGroup(key);
                }
                this.graphic.endGroup(staffLines);
                this.graphic.endDraw();
            }

            public setClef(clefDefinition: Model.ClefDefinition) {
                if (!this.clefDefinition || !this.clefDefinition.eq(clefDefinition)) {
                    this.clefDefinition = clefDefinition;
                    this.redraw();
                }
            }

            public setKey(keyDefinition: Model.IKeyDefinition, clefDefinition: Model.ClefDefinition) {
                if (!this.keyDefinition || !this.keyDefinition.eq(keyDefinition)) {
                    this.keyDefinition = keyDefinition;
                    this.redraw();
                }
            }

            public setMeter(meterDefinition: Model.IMeterDefinition) {
                if (!this.meterDefinition || !this.meterDefinition.eq(meterDefinition)) {
                    this.meterDefinition = meterDefinition;
                    this.redraw();
                }

            }
        }

        export class HintAreaPlugin implements ScoreApplication.IScorePlugin, IHintAreaCreator {
            init(app: ScoreApplication.IScoreApplication) {
                this.container = $('.appContainer');
                app.addDesigner(new HintAreaDesigner(app, this));
            }

            private container: JQuery;

            getId() {
                return "HintArea";
            }

            addStaffButton(y: number, staff: Model.IStaff): IHintArea {
                var svgHintArea = new HintArea(this.container, staff.parent.spacingInfo.scale, y, staff);
                //var svgHintArea = new SVGHintArea($('.appContainer'), staff.parent.spacingInfo.scale, y, staff);
                return svgHintArea;
            }
        }

        class HintAreaDesigner implements ScoreApplication.IScoreDesigner, Application.IFeedbackClient {
            constructor(private app: ScoreApplication.IScoreApplication, private svgHelper: IHintAreaCreator) {
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

            public validate(app: ScoreApplication.IScoreApplication) {
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

        class TimelineDesigner implements ScoreApplication.IScoreDesigner {
            constructor(private svgHelper: SvgHelper) {                
            }
            private checkSensors: Views.DomCheckSensorsVisitor;

            private checkHintButtons(score: Model.IScore) {
            }

            public validate(app: ScoreApplication.IScoreApplication) {
                var score = app.document;
                var svgHelper = this.svgHelper;//<SVGHelper>app.GetState("svgHelper:" + this.context); // todo: Svghelper yt

                var visitor = new Views.PrefixVisitor(new Views.RedrawVisitor(svgHelper.MusicGraphicsHelper), svgHelper.MusicGraphicsHelper);
                svgHelper.MusicGraphicsHelper.setSize(score.spacingInfo.width * score.spacingInfo.scale, score.spacingInfo.height);
                svgHelper.MusicGraphicsHelper.beginDraw();
                score.visitAll(visitor);
                svgHelper.MusicGraphicsHelper.endDraw();

                if (!this.checkSensors) {
                    this.checkSensors = new Views.DomCheckSensorsVisitor(svgHelper.EditGraphicsHelper, app.document, app);
                    //app.FeedbackManager.registerClient(this.checkSensors);
                }

                var visitor = new Views.PrefixVisitor(this.checkSensors, svgHelper.EditGraphicsHelper, 'ed_');
                svgHelper.EditGraphicsHelper.beginDraw();
                score.visitAll(visitor);
                svgHelper.EditGraphicsHelper.endDraw();

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

        class SvgEditorMetrics {
            static xPrevFirst = -35;
            static xNextLast = 45;

            static xLeft = -3;
            static xRight = 1;
            static yUp = -20;
            static yDown = 50;

            static xLeftPitch = SvgEditorMetrics.xLeft;
            static xRightPitch = SvgEditorMetrics.xRight;
            static yUpPitch = -3;
            static yDownPitch = 3;

            static xInsertCorrection = -8;
        }

        /*
        Todo: 
        set current note/head after inserting/editing
        dialogs (note, head, voice, staff)       
        */

        class SvgWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager> {
            constructor(private svgHelper: SvgHelper) { }

            init(app: ScoreApplication.IScoreApplication) {
                this.app = app;
            }

            private app: ScoreApplication.IScoreApplication;

            getId(): string {
                return "SVGWriter";
            }

            getFormats(): string[] {
                return [
                    "SVG"
                ]
            }

            public supports(type: string): boolean {
                return type === "SVG";
            }

            getExtension(type: string): string {
                return "svg";
            }

            public save() {
                var $svg = $(this.svgHelper.svg.parentNode);
                var xml = $svg.html();
                return xml;
            }
        }

        export class SvgEditorManager {
            public static activateVoiceSensors(voice: Model.IVoice, context: string, activate: boolean) {
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

            public static activateAllVoiceSensors(score: Model.IScore, context: string, activate: boolean) {
                score.withVoices((voice: Model.IVoice, index: number) => {
                    SvgEditorManager.activateVoiceSensors(voice, context, activate);
                });
            }

            /*todo: 
                activate beforenote, afternote, clef, bar
                deactivate everything else

                
            */
        }
    }


  

    export module CanvasView {

        export class CanvasGraphicsEngine implements Views.IGraphicsEngine {
            constructor(private canvas: HTMLCanvasElement) {
                this.context = canvas.getContext('2d');
            }
            private context: CanvasRenderingContext2D;


            private setTranslation(x: number, y: number) {
                this.context.translate(x, y);
            }
            public setSize(width: number, height: number) {
                $(this.canvas).attr({ height: height, width: width });
            }
            public beginDraw() {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            public endDraw() {
            }
            public createMusicObject(id: string, item: string, x: number, y: number, scale: number): any {
                var useMusicFonts = true;
                if (!useMusicFonts) {
                    this.setTranslation(x, y);
                this.context.scale(scale, scale);
                    this.drawPath(emmentalerNotes[item], 'black', null);
                this.context.scale(1 / scale, 1 / scale);
                    this.setTranslation(-x, -y);
                }
                else {
                    var char: string = emmentalerCode[item.substr(2)];
                    if (char === undefined) {
                        char = 'u';
                    }
                    var fontsize = Math.round(24 * scale);
                    this.context.font = fontsize + "px Emmentaler";
                    this.context.fillText(char, x, y);
                }
            }
            private drawPath(path: string, fillStyle: string, strokeStyle: string): any {
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
                };

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
            public createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
                this.setTranslation(x, y);
                this.context.scale(scale, scale);
                this.drawPath(path, fill, stroke);
                this.context.scale(1 / scale, 1 / scale);
                this.setTranslation(-x, -y);
            }
            public createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                // todo: canvas rect
                var x1 = x + 1;
            }
            public drawText(id: string, text: string, x: number, y: number, justify: string): any {
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
            public beginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                this.setTranslation(x, y);
                this.context.scale(scale, scale);
                return { x: x, y: y, scale: scale };
            }
            public endGroup(group: any) {
                this.context.scale(1 / group.scale, 1 / group.scale);
                this.setTranslation(-group.x, -group.y);
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
            moveCursor(id: string, x: number, y: number): void { }
            showCursor(noteId: string): void { }
            hideCursor(): void { }
            // InsertionPoint
            showInsertionPoint(id: string, x: number, y: number): void {
                var $insertPoint = $('#insertionPoint');
                if (!$insertPoint.length) {
                    $insertPoint = $('<div>').attr('id', 'insertionPoint').css({
                        position: 'relative',
                        'margin-left': '-4px',
                        'margin-top': '-4px',
                        width: '5px',
                        height: '5px',
                        border: 'solid blue 1px'
                   });
                }
                $insertPoint.css({
                    top: y,
                    left: x
                }).appendTo('#htmlSensor_ed_' + id);
            }
            hideInsertionPoint(): void {
                $('#insertionPoint').remove();
            }

            public beginDraw() {
                //this.scale = 1;
                $(this.root).empty();
                this.currentGroup = $(this.root);
                this.groupStack = [];
            }
            public endDraw() {
                this.groupStack = [];
            }
            public setSize(width: number, height: number) {
                $(this.root).css({ height: height, width: width });
            }
            public createMusicObject(parent: any, item: string, x: number, y: number, scale: number): any {
                var $img = $('<img>')
                    .attr('src', 'images/symbol1/' + item + '.png')
                    .css({ position: 'absolute', left: x, top: y })
                    .appendTo(this.currentGroup);
                return $img;
            }
            createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
            }
            createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                var $rect = $('<div>')
                    .css({ position: 'absolute', left: x, top: y, width: w, height: h/*, border: 'solid blue thin'*/ })
                    //.css({ position: 'absolute', 'margin-top': y, 'margin-left': x, left: 0, top: 0, width: w, height: h, border: 'solid blue thin' })
                    .attr('id', this.idPrefix + id)
                    .appendTo(this.currentGroup);
                return $rect;
            }
            public drawText(id: string, text: string, x: number, y: number, justify: string): any { }
            beginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                var $group = $('<div>').addClass(className).attr('id', this.idPrefix + id).appendTo(this.currentGroup);
                $group.css({ position: "absolute", left: x, top: y, transform: "scale(" + scale + "," + scale + ")" });
                this.groupStack.push($group);
                this.currentGroup = $group;
                return $group;
            }
            endGroup(group: any) {
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


        class TimelineDesigner implements ScoreApplication.IScoreDesigner {
            constructor(private svgHelper: CanvasHelper) {
            }
            private checkSensors: Views.DomCheckSensorsVisitor;

            private CheckHintButtons(score: Model.IScore) {
            }

            public validate(app: ScoreApplication.IScoreApplication) {
                var score = app.document;
                var svgHelper = this.svgHelper;//<SVGHelper>app.GetState("svgHelper:" + this.context); // todo: Svghelper yt

                var visitor = new Views.PrefixVisitor(new Views.RedrawVisitor(svgHelper.MusicGraphicsHelper), svgHelper.MusicGraphicsHelper);
                svgHelper.MusicGraphicsHelper.setSize(score.spacingInfo.width * score.spacingInfo.scale, score.spacingInfo.height);
                svgHelper.MusicGraphicsHelper.beginDraw();
                score.visitAll(visitor);
                svgHelper.MusicGraphicsHelper.endDraw();

                if (!this.checkSensors) {
                    this.checkSensors = new Views.DomCheckSensorsVisitor(svgHelper.EditGraphicsHelper, app.document, app);
                    //app.FeedbackManager.registerClient(this.checkSensors);
                }

                var visitor = new Views.PrefixVisitor(this.checkSensors, svgHelper.EditGraphicsHelper, 'ed_');
                svgHelper.EditGraphicsHelper.beginDraw();
                score.visitAll(visitor);
                svgHelper.EditGraphicsHelper.endDraw();

            }
        }


        export class CanvasViewer implements ScoreApplication.IScorePlugin {
            constructor(private $root: JQuery, public container: JQuery) {
            }

            private canvasHelper: CanvasHelper;

            public init(app: ScoreApplication.IScoreApplication) {
                //var $svg = app.container.find('.svgArea');
                if (!this.$root.length) {
                    var $clientArea = this.container.find('.clientArea');
                    if (!$clientArea.length) {
                        $clientArea = $('<div>').attr('class', 'clientArea').appendTo(this.container);
                    }
                    this.$root = $('<div>').attr('class', 'svgArea').appendTo($clientArea);
                }
                this.$root.height(300);

                this.canvasHelper = new CanvasHelper(document, this.$root[0]);

                app.addDesigner(new MusicSpacing.SpacingDesigner());
                app.addDesigner(new Views.ExpressionRenderer());
                app.addDesigner(new TimelineDesigner(this.canvasHelper));
                //app.AddDesigner(new HintAreaDesigner(app, this.canvasHelper)); // todo: til egen plugin?
                //app.AddDesigner(new BeamDesigner(this.context, this.svgHelper));
                var editors = false;
                /*if (editors) {
                    //app.AddDesigner(new SVGSensorsValidator(this.svgHelper));
                    app.AddDesigner(new SVGSizeDesigner(this.canvasHelper));
                }
                app.AddWriter(new CanvasWriter(this.canvasHelper));
                */
                app.FeedbackManager.registerClient(new SvgView.DomFeedbackClient(this.canvasHelper.EditGraphicsHelper));
            }

            public getId(): string {
                return "Output";
            }

        }


    }
