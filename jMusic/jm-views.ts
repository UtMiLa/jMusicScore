import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'
import { ISpacingInfo, IMusicElement, IVisitor, IBarSpacingInfo, IBar, IEventInfo, IScore, IVoice, IStaff, ISequence, IScoreSpacingInfo,
        IMeter, ITimedVoiceEvent, IClef, IStaffSpacingInfo, IKey, IStaffExpression, IStaffExpressionSpacingInfo, IVoiceSpacingInfo, 
        INote, INoteSource, INoteContext, IEventEnumerator, ITimedEvent, ISequenceNote, INoteInfo, IClefSpacingInfo, IKeySpacingInfo, 
        IMeterSpacingInfo, IMeterOwner, IBeamSpacingInfo, IBeam, INoteSpacingInfo, INotehead, INoteDecorationElement, ILongDecorationElement, 
        ITextSyllableElement, INoteHeadSpacingInfo, INoteHeadInfo, INoteDecorationSpacingInfo, INoteDecoInfo, ILongDecorationSpacingInfo, 
        ITextSyllableSpacingInfo, IMusicElementCreator, IVoiceNote } from './model/jm-model-interfaces';
import {ContextVisitor, IGlobalContext, Point, Music     } from "./model/jm-model";    
import {MusicSpacing} from "./jm-spacing";
import {  IScoreDesigner } from './jm-interfaces';
import { NoteDecorations } from './jm-glyph-details';
import { IEventReceiver } from "./jap-application";


class DOMHelper {
    constructor(private elm: HTMLElement) {}
    mouseout(eventHandler: (event: any) => void) { return this; }
    mouseover(eventHandler: (event: any) => void) { return this; }
    mousemove(eventHandler: (event: any) => void) { return this; }
    click(eventHandler: (event: any) => void) { return this; }

}
function $(elm: HTMLElement): DOMHelper {
    return new DOMHelper(elm);
}

    
        export module MyModel {
            export interface ILongDecorationSpacingInfo extends ISpacingInfo {
                render?: (deco: ILongDecorationElement, ge: IGraphicsEngine, globalContext: IGlobalContext) => void;
            }
        }
    
        
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
    
                calcCoordinates(event: MouseEvent): Point;
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
    
                public static addKeyXy(id: string, graphic: IGraphicsEngine, keyDefinition: IKeyDefinition, clefDefinition: ClefDefinition, x: number, y: number) {
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
    
                public static addMeterXy(id: string, graphic: IGraphicsEngine, meterDefinition: IMeterDefinition, x: number, y: number) {
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
                /*public static CalcSpacing(deco: ILongDecorationElement): void {
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
                        notedecoSpacing.endpoint = new Point(0, 0);
                    }
                    var longDeco = <ILongDecorationElement>deco;
    
    
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
                public static render(deco: ILongDecorationElement, graphEngine: IGraphicsEngine, globalContext: IGlobalContext): void {
                    var path: string;
                }
            }
            class CrescDrawer extends LongDecorationDrawer {
                public static render(deco: ILongDecorationElement, graphEngine: IGraphicsEngine, globalContext: IGlobalContext): void {
                    // long deco (cresc)
                    var notedecoSpacing = globalContext.getSpacingInfo<ILongDecorationSpacingInfo>(deco);
                    var longDeco = deco;
    
                    var tieDir = (deco.placement === "over") ? -1 : 1;
    
                    var x0 = 1;
                    var y0 = tieDir * 1;
                    var dy = 1;
                    var x1 = notedecoSpacing.distX - 2 * x0;
    
                    if (deco.type === LongDecorationType.Cresc) {
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
                public static render(deco: ILongDecorationElement, graphEngine: IGraphicsEngine, globalContext: IGlobalContext): void {
                    var path: string;
                }
            }
            class TupletDrawer extends LongDecorationDrawer {
                public static render(deco: ILongDecorationElement, graphEngine: IGraphicsEngine, globalContext: IGlobalContext): void {
                    var path: string;
                }
            } 
            class OttavaDrawer extends LongDecorationDrawer {
                public static render(deco: ILongDecorationElement, graphEngine: IGraphicsEngine, globalContext: IGlobalContext): void {
                    var path: string;
                }
            }
    
            class SlurDrawer extends LongDecorationDrawer {
                public static render(deco: ILongDecorationElement, graphEngine: IGraphicsEngine, globalContext: IGlobalContext): void {
                    // long deco (slur)
                    var notedecoSpacing = globalContext.getSpacingInfo<ILongDecorationSpacingInfo>(deco);
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
    
            class ExpressionFactory implements IVisitorIterator<IMusicElement>, IVisitor {
                constructor(private globalContext: IGlobalContext){

                }

                visitPre(element: IMusicElement): (element: IMusicElement) => void {
                    element.inviteVisitor(this);
                    return null;
                }
    
                visitNoteHead(head: INotehead) {
                }
                visitNote(note: INoteSource) {
                }
                visitNoteDecoration(deco: INoteDecorationElement) {
                    // expr
                }
                static longDrawers: any[] = [TrillDrawer, CrescDrawer, CrescDrawer, SlurDrawer, BracketDrawer, TupletDrawer, OttavaDrawer];
                visitLongDecoration(deco: ILongDecorationElement) {
                    // expr
                    const spacing = this.globalContext.getSpacingInfo<MyModel.ILongDecorationSpacingInfo>(deco);
                    if (spacing && ExpressionFactory.longDrawers[deco.type]) {
                        if (!spacing.render) spacing.render = ExpressionFactory.longDrawers[deco.type].Render;
                        //if (!spacing.CalcSpacing) spacing.CalcSpacing = ExpressionFactory.longDrawers[deco.type].CalcSpacing;
                    }
                }
                visitVoice(voice: IVoice) {
                }
                visitClef(clef: IClef) {
                }
                visitMeter(meter: IMeter) {
                }
                visitKey(key: IKey) {
                }
                visitStaff(staff: IStaff) {
                }
                visitScore(score: IScore) {
                }
                visitTextSyllable(syllable: ITextSyllableElement) {
                }
                visitBar(bar: IBar) {
                }
                visitBeam(beam: IBeam) {
                }
                visitStaffExpression(staffExpression: IStaffExpression): void {
                    // expr
                }
    
                visitDefault(element: IMusicElement): void { }

                visitVariable(name: string): void {}
            }
    
            export class ExpressionRenderer implements IScoreDesigner {
                constructor(private globalContext: IGlobalContext, private spacer: IVisitor = null) {
                }
    
                public design(document: IScore): void {
                    document.visitAll(new ExpressionFactory(this.globalContext)); // add renderer objects to all note/staff expressions
                }
            }
    
            /** Responsible for making event handlers on DOM (SVG/HTML) sensors */  
            export class DomCheckSensorsVisitor extends ContextVisitor { // todo: remove event handlers when inactive
                constructor(globalContext: IGlobalContext, public sensorEngine: ISensorGraphicsEngine, private _score: IScore, private eventReceiver: IEventReceiver) {
                    super(globalContext);
                }
    
                doNoteHead(head: INotehead, context: INoteContext, spacing: INoteHeadSpacingInfo) {
                    var elm = this.sensorEngine.createRectObject("edit_" + head.id, -5, -2, 10, 3, 'NoteheadEdit');
                    var evRec = this.eventReceiver;
                    var me = this;
                    $(elm).mouseover(function (event) {
                        event.data = { head: head };
                        evRec.processEvent("mouseoverhead", { head: head });
                    })
                        .mouseout(function (event) {
                            event.data = { head: head };
                            evRec.processEvent("mouseouthead", { head: head });
                        })
                        .click(function (event) {
                            event.data = { head: head };
                            evRec.processEvent("clickhead", { head: head });
                        });
                }
                doNote(note: INoteSource, context: INoteContext, noteSpacing: INoteSpacingInfo) {
                    var evRec = this.eventReceiver;
                    var me = this.sensorEngine;
                    //var staffContext = (<any>note.parent.parent).getStaffContext(context.absTime); // todo: context!
                    var staffContext = context.getStaffContext(); // todo: context!
                    var clefDefinition = staffContext.clef;
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
                        //event.data = { note: note, pitch: pitch };
                        evRec.processEvent("mouseovernote", { note: note, pitch: pitch });
                    })
                        .mouseout(function (event) {
                            //event.data = { note: note };
                            evRec.processEvent("mouseoutnote", { note: note });
                        })
                        .mousemove(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            //event.data = { note: note, pitch: pitch };
                            evRec.processEvent("mousemovenote", { note: note, pitch: pitch });
                        })
                        .click(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            //event.data = { note: note, pitch: pitch };
                            evRec.processEvent("clicknote", { note: note, pitch: pitch });
                        });
                    var x0 = rectX0Before - noteSpacing.preWidth;
                    var prevNote = Music.prevNote(this.globalContext, note);
                    var prevNoteSpacing = this.globalContext.getSpacingInfo<INoteSpacingInfo>(prevNote);
                    var noteSpacingInfo = this.globalContext.getSpacingInfo<INoteSpacingInfo>(note);
                    if (prevNote && prevNoteSpacing.offset.x - noteSpacingInfo.offset.x - rectLeft > x0) {
                        x0 = prevNoteSpacing.offset.x - noteSpacingInfo.offset.x - rectLeft;
                    }
                    elm = this.sensorEngine.createRectObject("editbefore_" + note.id, x0, rectTopBefore, rectLeft - x0, rectHeightBefore, 'NoteEditBefore');
                    $(elm).mouseover(function (event) {
                        var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                        var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                        //event.data = { note: note, pitch: pitch };
                        evRec.processEvent("mouseoverbeforenote", { note: note, pitch: pitch });
                    })
                        .mouseout(function (event) {
                            //event.data = { note: note };
                            evRec.processEvent("mouseoutbeforenote", { note: note });
                        })
                        .mousemove(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            //event.data = { note: note, pitch: pitch };
                            evRec.processEvent("mousemovebeforenote", { note: note, pitch: pitch });
                        })
                        .click(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / 3)); // todo: abstraher
                            //event.data = { note: note, pitch: pitch };
                            evRec.processEvent("clickbeforenote", { note: note, pitch: pitch });
                        });
    
    
                    var nextNote = Music.nextNote(this.globalContext, note);
                    if (!nextNote) {
                        // afternote
    
                        elm = this.sensorEngine.createRectObject("editafter_" + note.id, rectLeft + rectWidth, rectTopBefore, rectWidthAfter, rectHeightBefore, 'NoteEditAfter');
                        $(elm).mouseover(function (event) {
                            var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                            var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                            event.data = { note: note, pitch: pitch };
                            evRec.processEvent("mouseoverafternote", { note: note, pitch: pitch });
                        })
                            .mouseout(function (event) {
                                event.data = { note: note };
                                evRec.processEvent("mouseoutafternote", { note: note });
                            })
                            .mousemove(function (event) {
                                var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                                var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                                event.data = { note: note, pitch: pitch };
                                evRec.processEvent("mousemoveafternote", { note: note, pitch: pitch });
                            })
                            .click(function (event) {
                                var pt = me.calcCoordinates(<any>event); // todo: undgå cast
                                var pitch = clefDefinition.staffLineToPitch(Math.round(pt.y / staffLineSpacing)); // todo: abstraher
                                event.data = { note: note, voice: context.voice, pitch: pitch };
                                evRec.processEvent("clickafternote", { note: note, pitch: pitch, voice: context.voice });
                            });
                    }
                }
                doLongDecoration(deco: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo) {
                }
                doNoteDecoration(deco: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo) {
                }
                visitVoice(voice: IVoice) {
   
                }
                visitClef(clef: IClef) {
                    const spacing = this.globalContext.getSpacingInfo(clef);
                    var elm = this.sensorEngine.createRectObject("edit_" + clef.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'ClefEdit');
                    var evRec = this.eventReceiver;
                    //var me = this;
                    $(elm).mouseover(function (event) {
                        event.data = { clef: clef };
                        evRec.processEvent("mouseoverclef", { clef: clef });
                    })
                        .mouseout(function (event) {
                            event.data = { clef: clef };
                            evRec.processEvent("mouseoutclef", { clef: clef });
                        })
                        .click(function (event) {
                            event.data = { clef: clef };
                            evRec.processEvent("clickclef", { clef: clef });
                        });
                }
                visitMeter(meter: IMeter) {
                    const spacing = this.globalContext.getSpacingInfo(meter);
                    var elm = this.sensorEngine.createRectObject("edit_" + meter.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'MeterEdit');
                    var evRec = this.eventReceiver;
                    //var me = this;
                    $(elm).mouseover(function (event) {
                        event.data = { meter: meter };
                        evRec.processEvent("mouseovermeter", { meter: meter });
                    })
                        .mouseout(function (event) {
                            event.data = { meter: meter };
                            evRec.processEvent("mouseoutmeter", { meter: meter });
                        })
                        .click(function (event) {
                            event.data = { meter: meter };
                            evRec.processEvent("clickmeter", { meter: meter });
                        });
                }
                visitKey(key: IKey) {
                    const spacing = this.globalContext.getSpacingInfo(key);
                    var elm = this.sensorEngine.createRectObject("edit_" + key.id, spacing.preWidth, -12, spacing.preWidth + spacing.width, 24, 'KeyEdit');
                    var evRec = this.eventReceiver;
                    //var me = this;
                    $(elm).mouseover(function (event) {
                        event.data = { key: key };
                        evRec.processEvent("mouseoverkey", { keySig: key});
                    })
                        .mouseout(function (event) {
                            event.data = { key: key };
                            evRec.processEvent("mouseoutkey", { keySig: key });
                        })
                        .click(function (event) {
                            event.data = { key: key };
                            evRec.processEvent("clickkey", { keySig: key });
                        });
                }
                visitStaff(staff: IStaff) {
                }
                visitScore(score: IScore) {
                }
                doTextSyllable(textSyllable: ITextSyllableElement, context: INoteContext, textSpacing: ITextSyllableSpacingInfo) {
                }
                visitBar(bar: IBar) {
                    const spacing = this.globalContext.getSpacingInfo<IBarSpacingInfo>(bar);
                    var elm = this.sensorEngine.createRectObject("edit_" + bar.id, -spacing.preWidth + spacing.extraXOffset - 3, 0, spacing.preWidth + spacing.width, spacing.end.y - spacing.offset.y, 'BarEdit');
                    var evRec = this.eventReceiver;
                    //var me = this;
                    $(elm).mouseover(function (event) {
                        event.data = { bar: bar };
                        evRec.processEvent("mouseoverbar", { bar: bar });
                    })
                        .mouseout(function (event) {
                            event.data = { bar: bar };
                            evRec.processEvent("mouseoutbar", { bar: bar });
                        })
                        .click(function (event) {
                            event.data = { bar: bar };
                            evRec.processEvent("clickbar", { bar: bar });
                        });
                }
                doBeam(beam: IBeam, context: INoteContext, spacing: IBeamSpacingInfo) {
                }
                visitStaffExpression(staffExpression: IStaffExpression): void { }
    
                visitDefault(element: IMusicElement): void { }
    
    
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
    
    
    
            export class RedrawVisitor extends ContextVisitor {
                constructor(globalContext: IGlobalContext, private graphEngine: IGraphicsEngine) { super(globalContext); }
    
                static getTie(spacing: INoteHeadSpacingInfo): string {
                    if (spacing.tieStart) {
                        //var tiedTo = <NoteheadElement>headElm.getProperty("tiedTo");
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
    
    
    
                doNoteHead(head: INotehead, context: INoteContext, spacing: INoteHeadSpacingInfo) {
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
                        var dot = this.graphEngine.createMusicObject(null, 'e_dots.dot', this.globalContext.getSpacingInfo<INoteSpacingInfo>(context).dotWidth + 5/*SVGMetrics.dotSeparation*/ * i, 0, spacing.graceScale);
                    }
                }
                doNote(note: INoteSource, context: INoteContext, noteSpacing: INoteSpacingInfo) {
                    // note stem
                    //console.log("note");
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
                            var beamSpacing = this.globalContext.getSpacingInfo<IBeamSpacingInfo>(beam);
                            var step = beam.index * beamSpacing.beamDist;
    
                            this.graphEngine.createPathObject("M " + beamSpacing.start.x + "," + (beamSpacing.start.y + step) +
                                " L " + beamSpacing.end.x + "," + (beamSpacing.end.y + step) +
                                " " + beamSpacing.end.x + "," + (beamSpacing.end.y + 2 + step) +
                                " " + beamSpacing.start.x + "," + (beamSpacing.start.y + 2 + step) +
                                " z", 0, 0, 1, undefined, 'black', 'beam_'+beam.parent.id + '_' + beam.index);
                        }
                }
                doLongDecoration(deco: ILongDecorationElement, context: INoteContext, spacing: MyModel.ILongDecorationSpacingInfo) {
                    if (spacing.render) spacing.render(deco, this.graphEngine, this.globalContext);
                }
                doNoteDecoration(deco: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo) {
                    // short deco
                    var noteSpacing = this.globalContext.getSpacingInfo<INoteSpacingInfo>(context);
                    var decoId = deco.getDecorationId();
                    if (decoId >= NoteDecorationKind.Arpeggio && decoId <= NoteDecorationKind.NonArpeggio) {
                        // arpeggio
                        if (decoId === NoteDecorationKind.Arpeggio || (decoId === NoteDecorationKind.ArpeggioDown)) {
                            var yL = noteSpacing.lowPitchY;
                            var yH = noteSpacing.highPitchY;
                            var yStep = 2;
                            var y = yL;
                            while (y >= yH) {
                                if (y === yL && (decoId === NoteDecorationKind.ArpeggioDown)) {
                                    this.graphEngine.createMusicObject(null, 'e_scripts.arpeggio.arrow.M1', -12, y * 3 + 2, 1);
                                }
                                else
                                this.graphEngine.createMusicObject(null, 'e_scripts.arpeggio', -12, y*3+2, 1);
                                y -= yStep;
                            }
                            
                        }
                        else if (decoId === NoteDecorationKind.NonArpeggio) {
                            var yL = noteSpacing.lowPitchY;
                            var yH = noteSpacing.highPitchY;
                            var path = 'm -10,' + (yL*3 + 2) + ' l -2,0 0,' + ((yH - yL)*3 - 4) + ' 2,0';
                            this.graphEngine.createPathObject(path, 0, 0, 1, 'black', null);
                        }
                    }
                    else {
                        var ref = NoteDecorations.getGlyph(decoId, deco.placement === "over");
    
                        if (ref) {
                            this.graphEngine.createMusicObject(null, ref, 0, 0, 1);
                        }
                        else {
                            alert("Error: " + decoId);
                        }
                    }
                }
    //            visitVoice(voice: IVoice) { }
                visitClef(clef: IClef) {
                    const spacing = this.globalContext.getSpacingInfo<IClefSpacingInfo>(clef);
                    this.graphEngine.createMusicObject(null, spacing.clefId, 0, 0, 1);
                }
                visitMeter(meter: IMeter) {
                    let spacing = this.globalContext.getSpacingInfo<IMeterSpacingInfo>(meter);
                    if (!spacing) { 
                        this.globalContext.addSpacingInfo(meter, (spacing = new MusicSpacing.MeterSpacingInfo(meter))); 
                        //meter.spacingInfo = 
                    }
                    MeterDrawer.addMeterXy(null, this.graphEngine, meter.definition, 0, 0);
                }
                visitKey(key: IKey) {
                    const spacing = this.globalContext.getSpacingInfo<IKeySpacingInfo>(key);
                    var staffContext = /*key.parent*/this.staff.getStaffContext(key.absTime);
                    KeyDrawer.addKeyXy(null, this.graphEngine, key.definition, staffContext.clef, 0, 0);
                }
                visitStaff(staff: IStaff) {
                    const spacing = this.globalContext.getSpacingInfo<IStaffSpacingInfo>(staff);
                    //console.log("staff");
                    for (var i = 0; i < 5; i++) {
                        this.graphEngine.createPathObject("m 0," + i * spacing.staffSpace * 2 + " l " + spacing.staffLength + ",0", 0, 0, 1, '#888', undefined, 'staffline' + staff.id + ' ' + i);
                    }
                }
                visitScore(score: IScore) {
                    //this.graphEngine.SetSize(spacing.width * spacing.scale, spacing.height);
                }
                doTextSyllable(textSyllable: ITextSyllableElement, context: INoteContext, textSpacing: ITextSyllableSpacingInfo) {
                    this.graphEngine.drawText("text" + textSyllable.id, textSyllable.Text, 0, 0, "center");
                }
                visitBar(bar: IBar) {
                    const spacing = this.globalContext.getSpacingInfo<IBarSpacingInfo>(bar);
                    this.graphEngine.createPathObject("m " + spacing.extraXOffset + ",0 l 0," + (spacing.end.y - spacing.offset.y), 0, 0, 1, '#444444', undefined);
                }
                doBeam(beam: IBeam, context: INoteContext, spacing: IBeamSpacingInfo) {
                }
                visitStaffExpression(staffExpression: IStaffExpression): void {
                    const spacing = this.globalContext.getSpacingInfo<IClefSpacingInfo>(staffExpression);
                    this.graphEngine.drawText("text" + staffExpression.id, staffExpression.text, 0, 0, "left");
                }
    
                visitDefault(element: IMusicElement): void { }
            }
    
            export class PrefixVisitor implements IVisitorIterator<IMusicElement> {
                constructor(private globalContext: IGlobalContext, private visitor: IVisitor, private cge: IBaseGraphicsEngine, private prefix = '') {
                }
                public visitPre(element: IMusicElement): (element: IMusicElement) => void {
                    //var spacing = element.spacingInfo;
                    var spacing = this.globalContext.getSpacingInfo(element);
                    if (spacing) {
                        var grp = this.cge.beginGroup(this.prefix + element.id, spacing.offset.x, spacing.offset.y, spacing.scale, element.getElementName());
                        element.inviteVisitor(this.visitor);
                        //spacing.InviteVisitor(this.visitor);
                        return (element: IMusicElement) => { this.cge.endGroup(grp); };
                    }
                }
            }
    
    
        
    
    