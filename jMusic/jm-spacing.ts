import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'
import {MusicElement, IMusicElement, IMeterSpacingInfo, IMeter, 
        IVisitor,  IVoice, IVoiceNote, IStaff, IScore, ILongDecorationElement, ISpacingInfo,
    IClefSpacingInfo, Point, INotehead, INote, INoteHeadSpacingInfo, INoteSpacingInfo,
    INoteDecorationElement, INoteDecorationSpacingInfo, IVoiceSpacingInfo, IKeySpacingInfo,
    IStaffSpacingInfo, IScoreSpacingInfo, ITextSyllableElement, ITextSyllableSpacingInfo, IBar, IBarSpacingInfo,
    IBeam, IBeamSpacingInfo, IStaffExpression, IStaffExpressionSpacingInfo, IClef, IKey, LedgerLineSpacingInfo,
    ILongDecorationSpacingInfo, ITimedEvent, Music, INoteSource, INoteContext, ContextVisitor, GlobalContext } from "./jm-model";

import  { IGraphicsEngine , IScoreDesigner } from './jm-interfaces';
//todo: pitchToStaffLine skal ikke kaldes med <any>


        /// Music spacing classes - independent of graphics methods
        export module MusicSpacing {
    
            export class BaseSpacingInfo implements ISpacingInfo {
                offset = new Point(0, 0);
                width = Metrics.newPosStep * Metrics.newPosXStep;
                height: number;
                left: number;
                top: number;
                scale = 1;
                preWidth = 0;
            }
    
            export class BarSpacingInfo extends BaseSpacingInfo implements IBarSpacingInfo {
                constructor(private parent: IBar) { super(); }
                barStyle: string;
                end = new Point(0, 0);
                extraXOffset: number = Metrics.barXOffset;
            }
    
            export class BeamSpacingInfo extends BaseSpacingInfo implements IBeamSpacingInfo {
                constructor(private parent: IBeam) { super(); }
                start = new Point(0, 0);
                end = new Point(0, 0);
                beamCount = 1;
                public beamDist: number;
            }
    
            export interface INoteContextInfo {
                postfix: string;
                timeVal: number;
                dotWidth: number;
                stemLengthMin: number;
                baseNote: string;
                baseRest: string;
                editNote: string;
                noteHead: string;
                noteHeadRev: string;
                noteStem: string;
                beamCount: number;
                noteStemRev: string;
                flag_suffix?: string;
                rev?: boolean;
            }
    
            export class NoteHeadSpacingInfo extends BaseSpacingInfo implements INoteHeadSpacingInfo {
                constructor(private parent: INotehead) { super(); }
    
                static noteValues: { [index: string]: INoteContextInfo } = {
                    hidden: {
                        postfix: "",
                        timeVal: 1,
                        dotWidth: 10,
                        stemLengthMin: 0,
                        baseNote: "",
                        baseRest: "",
                        editNote: "",
                        noteHead: "",
                        noteHeadRev: "",
                        noteStem: "",
                        beamCount: 0,
                        noteStemRev: ""
                    },
                    n2_1: {
                        postfix: "2_1",
                        timeVal: 512,
                        dotWidth: 10,
                        stemLengthMin: 0,
                        baseNote: "e_noteheads.sM1",
                        baseRest: "e_rests.M1",
                        editNote: "edit2_1",
                        noteHead: "e_noteheads.sM1",
                        noteHeadRev: "e_noteheads.sM1",
                        noteStem: "",
                        beamCount: 0,
                        noteStemRev: ""
                    },
                    n1_1: {
                        postfix: "1_1",
                        timeVal: 256,
                        dotWidth: 10,
                        stemLengthMin: 0,
                        baseNote: "e_noteheads.s0",
                        baseRest: "e_rests.0",
                        editNote: "edit1_1",
                        noteHead: "e_noteheads.s0",
                        noteHeadRev: "e_noteheads.s0",
                        noteStem: "",
                        beamCount: 0,
                        noteStemRev: ""
                    },
                    n1_2: {
                        postfix: "1_2",
                        timeVal: 128,
                        dotWidth: 6,
                        stemLengthMin: 20.3,
                        baseNote: "e_noteheads.s1",
                        baseRest: "e_rests.1",
                        editNote: "edit1_2",
                        noteHead: "e_noteheads.s1",
                        noteHeadRev: "e_noteheads.s1",
                        noteStem: "notestem",
                        beamCount: 0,
                        noteStemRev: "notestemrev"
                    },
                    n1_4: {
                        postfix: "1_4",
                        timeVal: 64,
                        dotWidth: 6,
                        stemLengthMin: 20.3,
                        baseNote: "e_note_1_4_head",
                        baseRest: "e_rests.2",
                        editNote: "edit1_4",
                        noteHead: "e_noteheads.s2",
                        noteHeadRev: "e_noteheads.s2",
                        noteStem: "notestem",
                        beamCount: 0,
                        noteStemRev: "notestemrev"
                    },
                    n1_8: {
                        postfix: "1_8",
                        timeVal: 32,
                        dotWidth: 6,
                        stemLengthMin: 20.3,
                        baseNote: "8thnote",
                        baseRest: "e_rests.3",
                        editNote: "edit1_8",
                        noteHead: "e_noteheads.s2",
                        noteHeadRev: "e_noteheads.s2",
                        noteStem: "notestem",
                        noteStemRev: "notestemrev",
                        flag_suffix: "3",
                        beamCount: 1,
                        rev: false
                    },
                    n1_16: {
                        postfix: "1_16",
                        timeVal: 16,
                        dotWidth: 6,
                        stemLengthMin: 20.3,
                        baseNote: "16thnote",
                        baseRest: "e_rests.4",
                        editNote: "edit1_16",
                        noteHead: "e_noteheads.s2",
                        noteHeadRev: "e_noteheads.s2",
                        noteStem: "notestem",
                        noteStemRev: "notestemrev",
                        beamCount: 2,
                        flag_suffix: "4"
                    },
                    n1_32: {
                        postfix: "1_32",
                        timeVal: 8,
                        dotWidth: 6,
                        stemLengthMin: 26.3,
                        baseNote: "32thnote",
                        baseRest: "e_rests.5",
                        editNote: "edit1_32",
                        noteHead: "e_noteheads.s2",
                        noteHeadRev: "e_noteheads.s2",
                        noteStem: "notestem",
                        noteStemRev: "notestemrev",
                        beamCount: 3,
                        flag_suffix: "5"
                    },
                    n1_64: {
                        postfix: "1_64",
                        timeVal: 4,
                        dotWidth: 6,
                        stemLengthMin: 31,
                        baseNote: "64thnote",
                        baseRest: "e_rests.6",
                        editNote: "edit1_64",
                        noteHead: "e_noteheads.s2",
                        noteHeadRev: "e_noteheads.s2",
                        noteStem: "notestem",
                        noteStemRev: "notestemrev",
                        beamCount: 4,
                        flag_suffix: "6"
                    },
                    n1_128: {
                        postfix: "1_128",
                        timeVal: 2,
                        dotWidth: 6,
                        stemLengthMin: 37,
                        baseNote: "128thnote",
                        baseRest: "128threst",
                        editNote: "edit1_128",
                        noteHead: "e_noteheads.s2",
                        noteHeadRev: "e_noteheads.s2",
                        noteStem: "notestem",
                        noteStemRev: "notestemrev",
                        beamCount: 5,
                        flag_suffix: "7"
                    }
                };
    
    
                accidentalX: number;
                dots: Point;
                displacement: boolean;
                public get displace(): Point { return new Point(this.displacement ? Metrics.pitchX_Displacement * this.graceScale : Metrics.pitchX_Displacement * this.graceScale , 0); }
                public get headGlyph(): string {
                    var notedef = NoteHeadSpacingInfo.noteValues[this.parent.parent.NoteId];
                    return this.reversed ? notedef.noteHeadRev : notedef.noteHead;
                }
                public get dotWidth(): number {
                    var notedef = NoteHeadSpacingInfo.noteValues[this.parent.parent.NoteId];
                    return notedef.dotWidth;
                }
                reversed: boolean;
                tieStart: Point;
                tieEnd: Point;
                tieDir: number;
                graceScale: number = 1;
                accidentalStep: number = 0;
            }
    
    
            export class ScoreSpacingInfo extends BaseSpacingInfo implements IScoreSpacingInfo {
                constructor(private parent: IScore) {
                    super();
                    this.scale = 1.2;
                    this.height = 100;
                }
            }
    
    
            export class StaffSpacingInfo extends BaseSpacingInfo implements IStaffSpacingInfo {
                constructor(private parent: IStaff) {
                    super();
                    this.offset.x = Metrics.staffXOffset;
                }
                private _staffLength: number = Metrics.staffLength;
                get staffLength(): number { return this._staffLength; }
                set staffLength(v: number) {
                    if (this._staffLength !== v) {
                        this._staffLength = v;
                        // this.changed();
                    }
                }
                staffSpace: number;
            }
    
    
            export class StaffExpressionSpacingInfo extends BaseSpacingInfo implements IStaffExpressionSpacingInfo {
                constructor(private parent: IStaffExpression) {
                    super();
                    this.offset.y = -8; // todo:
                    this.width = 0;
                    //this.offset.x = Metrics.staffXOffset;
                }
            }
    
            export class ClefSpacingInfo extends BaseSpacingInfo implements IClefSpacingInfo {
                constructor(private parent: IClef) { super(); }
                clefId: string;
            }
    
    
            export class MeterSpacingInfo extends BaseSpacingInfo implements IMeterSpacingInfo {
                constructor(private parent: IMeter) { super(); }
            }
    
    
            export class KeySpacingInfo extends BaseSpacingInfo implements IKeySpacingInfo {
                constructor(private parent: IKey) { super(); }
            }
    
    
            export class VoiceSpacingInfo extends BaseSpacingInfo implements IVoiceSpacingInfo {
                constructor(private parent: IVoice) { super(); }
            }
    
            export class TextSpacingInfo extends BaseSpacingInfo implements ITextSyllableSpacingInfo {
                constructor(private parent: ITextSyllableElement) { super(); }
            }
            export class NoteSpacingInfo extends BaseSpacingInfo implements INoteSpacingInfo {
                constructor(private parent: INote) { super(); }
                rev = false;
                dots: Point;
                flagNo: number;
                lowPitchY: number;
                highPitchY: number;
                ledgerLinesUnder: LedgerLineSpacingInfo[] = [];
                ledgerLinesOver: LedgerLineSpacingInfo[] = [];
                graceScale: number = 1;
                public stemX: number;
                public stemTipY: number;
                public stemRootY: number;
                public stemLength: number;
                public get dotWidth(): number {
                    var notedef = NoteHeadSpacingInfo.noteValues[this.parent.NoteId];
                    return notedef.dotWidth;
                }
                public get restGlyph(): string {
                    var notedef = NoteHeadSpacingInfo.noteValues[this.parent.NoteId];
                    return notedef.baseRest;
                }
                public flagDisplacement = new Point(0, 0);
            }
    
            export class NoteDecorationSpacingInfo extends BaseSpacingInfo implements INoteDecorationSpacingInfo {
                constructor(private parent: INoteDecorationElement) { super(); }
                //endpoint: Point;
            }
            export class LongDecorationSpacingInfo extends BaseSpacingInfo implements ILongDecorationSpacingInfo {
                constructor(private parent: ILongDecorationElement) { super(); }
                //endpoint: Point;
                noteY: number;
                noteheadY: number;
                distX: number;
                endNoteY: number;
                endNoteheadY: number;
                render: (deco: ILongDecorationElement, ge: IGraphicsEngine) => void;
            }
    
    
            /*class NullSpacer implements IVisitor {
                visitNoteHead(head: INotehead,spacing: INoteHeadSpacingInfo) { }
                visitNote(note: INoteInfo, spacing: INoteSpacingInfo) { }
                visitNoteDecoration(deco: INoteDecorationElement, spacing: INoteDecorationSpacingInfo) { }
                visitLongDecoration(deco: ILongDecorationElement, spacing: ILongDecorationSpacingInfo) { }
                visitVoice(voice: IVoice, spacing: IVoiceSpacingInfo) { }
                visitClef(clef: IClef, spacing: IClefSpacingInfo) { }
                visitMeter(meter: IMeter, spacing: IMeterSpacingInfo) { }
                visitKey(key: IKey, spacing: IKeySpacingInfo) { }
                visitStaff(staff: IStaff, spacing: IStaffSpacingInfo) { }
                visitScore(score: IScore, spacing: IScoreSpacingInfo) { }
                visitTextSyllable(textSyllable: ITextSyllableElement, spacing: ITextSyllableSpacingInfo) { }
                visitBar(bar: IBar, spacing: IBarSpacingInfo) { }
                visitBeam(beam: IBeam, spacing: IBeamSpacingInfo) { }
                visitStaffExpression(staffExpression: IStaffExpression, spacing: IStaffExpressionSpacingInfo): void { }
    
                visitDefault(element: IMusicElement, spacing: ISpacingInfo): void { }
            }*/
    
            export class Metrics {
                // NoteOutput
                static newPosXStep = 9;
                static newPosStep = 2;
                static restXDisplacement = -4.5;
                //static noteXDisplacement = 10;
                static revFlagXDisplacement = -3.8;
                static flagXDisplacement = 3.5;
                static revFlagYDisplacement = 0.5;
                static flagYDisplacement = -0.5;
                static pitchYFactor = 3;
                static graceNoteScale = 0.66;
                static stemLengthReduce = 3;
                static restY = 4 * Metrics.pitchYFactor;
                static stemRevX0 = -4.53;
                static stemX0 = 2.95;
                static stemRevY0 = 0.9;
                static stemY0 = -0.9;
                static stemWidth = 0.75;
                static stemYSlope = 0;
                static preWidthAccidental = 8;
                static noteXToleranceRight = 5;
                static noteXToleranceLeft = 5;
                static dotSeparation = 5;
    
                // ScoreOutput
                static firstPos = 0;
                static xPosOffset = 0;
    
                // VoiceOutput
                static voiceEditBoundLeft = 15;
                static voiceEditBoundTop = -10;
                static voiceEditBoundRight = 300;
                static voiceEditBoundBottom = 39;
    
                // PitchOutput
                static pitchXDisplacement = 8;
                static pitchXRevDisplacement = -8;
                static pitchX_Displacement = -4.8;
                static pitchXNoDisplacement = 0;
    
                // StaffOutput
                static staffXOffset = 100;
                static staffYOffset = 66;
                static staffYBottomMargin = 66;
                static staffYStep = 72;
                static staffHeight = Metrics.pitchYFactor * 8;
                static barXOffset = Metrics.staffXOffset;
                static barStrokeWidth = 0.59;
                static barBeginStrokeWidth = 1.0;
                static barThickStrokeWidth = 2.0;
                static barDoubleDistance = 5.0;
                static staffLineStrokeWidth = 0.59;
                static staffLength = 300;
                static ledgerLineStrokeWidth = 0.59;
                static ledgerLineXLeft = -6;
                static ledgerLineXRight = 6;
                static staffHelperYOffset = 18;
    
                // KeyOutput
                static keyXPerAcc = 6;
                static keyXOffset = -10;
                static keyWidth0 = 8;
    
                // ClefOutput
                static clefXOffset = 0;
    
                // MeterOutput
                static meterWidth0 = 12;
                static meterWidth1 = 20;
                static meterXOffset = 0;
                static meterX0 = Metrics.meterXOffset;
                static meterY0 = Metrics.pitchYFactor * 4;
                static meterX1 = Metrics.meterXOffset + 8;
                static meterX = Metrics.meterXOffset + 4;
                static meterY1 = Metrics.pitchYFactor * 8;
    
                // Notehead
                static accidentalX = -16;
                static accidentalXstep = -8;
                static tieX0 = 5;
                static tieY0 = 1;
                static tieX1 = 9;
                static tieY1 = 0.4;
            }
    
            class MinimalSpacer extends ContextVisitor {

                /*public getSpacingInfo<T extends ISpacingInfo>(element: IMusicElement): T{
                    return <T>element.spacingInfo;
                }*/
    
                public doNoteHead(head: INotehead, noteCtx: INoteContext, spacing: INoteHeadSpacingInfo) {
                    const headSpacingInfo = this.globalContext.getSpacingInfo<NoteHeadSpacingInfo>(head);
                    const noteSpacingInfo = this.globalContext.getSpacingInfo<NoteSpacingInfo>(noteCtx);

                    spacing.accidentalX = -headSpacingInfo.offset.x * 2 + Metrics.accidentalX + headSpacingInfo.accidentalStep * Metrics.accidentalXstep;
                    spacing.graceScale = noteSpacingInfo.graceScale;
    
                    spacing.offset.y = head.parent.rest ? 
                    Metrics.restY : NoteSpacer.pitchToStaffLine(head.pitch, <any>head.parent, noteCtx) * Metrics.pitchYFactor;
    
    
                    if (head.tie) {
                        var tiedTo = <INotehead>head.getProperty("tiedTo");
                        if (true) { // todo: if length is changed
                            // todo: update slurs after spacing is decided
                            spacing.tieDir = (head.getProperty("tieDirection") === "UP") ? -1 : 1;
                            var x0 = Metrics.tieX0; // todo: x0 and x1 based on real notehead sizes
                            var y0 = spacing.tieDir * Metrics.tieY0;
                            spacing.tieStart = new Point(x0, y0);
    
                            var x1 = Metrics.tieX1;
                            if (tiedTo) {
                                var tiedToSpacing = this.globalContext.getSpacingInfo(tiedTo);
                                var tiedToNoteSpacing = this.globalContext.getSpacingInfo(tiedTo.parent);
                                var noteSpacing = this.globalContext.getSpacingInfo(head.parent);
    
                                x1 = tiedToNoteSpacing.offset.x + tiedToSpacing.offset.x - spacing.offset.x - noteSpacing.offset.x - 2 * x0;
                            }
                            var y1 = spacing.tieDir * Metrics.tieY1;
    
                            spacing.tieEnd = new Point(x1, y1);
                        }
                    }
                    else {
                        spacing.tieStart = undefined;
                        spacing.tieEnd = undefined;
                    }
                }
    
                public static getSyllableWidth(syllable: ITextSyllableElement) {
                    return syllable.Text.length * 10;
                    /*var displayData = <SVGTextSyllableDisplayData>syllable.getDisplayData(context);
                    if (!displayData.ref) return syllable.getText().length; // todo: handle
                    var bBox = (<SVGLocatable><any>displayData.ref).getBBox();
                    return bBox.width;*/ //todo: width
                }
    
                public static doGetWidth(note: INote) {
                    //var displayData = <SVGNoteDisplayData>note.getDisplayData(context);
                    var width = Metrics.newPosStep * Metrics.newPosXStep + note.dotNo * this.doGetDotWidth(note);
                    for (var i = 0; i < note.syllableElements.length; i++) {
                        var syllable = note.syllableElements[i];
                        var syllWidth = this.getSyllableWidth(syllable);
                        if (syllWidth > width * 2) {
                            width = syllWidth / 2;
                        }
                    }
                    return width;
                }
    
                public static doGetPreWidth(globalContext: GlobalContext, note: INote) {
                    //var displayData = <SVGNoteDisplayData>note.getDisplayData(context);
                    var width = 0;
                    for (var i = 0; i < note.syllableElements.length; i++) {
                        var syllable = note.syllableElements[i];
                        var syllWidth = this.getSyllableWidth(syllable);
                        if (syllWidth > width * 2) {
                            width = syllWidth / 2;
                        }
                    }
                    note.withDecorations(globalContext, (deco: INoteDecorationElement) => {
                        var w1 = MinimalSpacer.getNoteDecoWidth(deco);
                        if (w1 > width) width = w1;
                    });
    
                    var heads = note.noteheadElements;
                    heads.sort(function (a, b) { return b.getPitch().diff(a.getPitch()); });
                    var accidentalStep = width / 10; // todo: constant
                    for (var i = 0; i < heads.length; i++) {
                        var head = heads[i];
                        if (head.getAccidental()) {
                            globalContext.getSpacingInfo<NoteHeadSpacingInfo>(head).accidentalStep = accidentalStep++;
                        }
                    }
                    
                    if (accidentalStep) {
                        var w1 = Metrics.preWidthAccidental - accidentalStep * Metrics.accidentalXstep;
                        if (w1 > width) return w1;
                    }
                    return width;
                }
    
                public static doGetDotWidth(note: INote): number {
                    if (note.timeVal.denominator === 1) return 10; // todo: konstanter
                    return 6;
                }
    
                public clefRefId(def: ClefDefinition, change: boolean): string {
                    if (change) {
                        switch (def.clefCode) {
                            case ClefType.ClefG: {
                                if (def.transposition === -7) { return "tenor-clef"; }
                                else return "e_clefs.G_change";
                            }
                            case ClefType.ClefC: return "e_clefs.C_change";
                            case ClefType.ClefF: return "e_clefs.F_change";
                            case ClefType.ClefNone: return "";
                            case ClefType.ClefPercussion: return "e_clefs.percussion_change";
                            case ClefType.ClefTab: return "e_clefs.tab_change";
                        }
                    }
                    else {
                        switch (def.clefCode) {
                            case ClefType.ClefG: {
                                if (def.transposition === -7) { return "tenor-clef"; }
                                else return "e_clefs.G";
                            }
                            case ClefType.ClefC: return "e_clefs.C";
                            case ClefType.ClefF: return "e_clefs.F";
                            case ClefType.ClefNone: return "";
                            case ClefType.ClefPercussion: return "e_clefs.percussion";
                            case ClefType.ClefTab: return "e_clefs.tab";
                        }
                    }
                    return null;
                }
                public static longDecoCalculations(deco: ILongDecorationElement, noteCtx: INoteContext, globalContext: GlobalContext) {
                    var noteSpacing = globalContext.getSpacingInfo<NoteSpacingInfo>(noteCtx);
                    var notedecoSpacing = globalContext.getSpacingInfo<LongDecorationSpacingInfo>(deco);
                    var tiedToNoteSpacing = globalContext.getSpacingInfo(deco.endEvent); //todo: if (deco.EndEvent)
                    var stemDir = globalContext.getSpacingInfo<NoteSpacingInfo>(noteCtx).rev;
    
                    // todo: if length is changed
    
                    if (deco.placement === "over") {
                        notedecoSpacing.offset.y = 0;
                        //notedecoSpacing.offset.y = MusicSpacing.NoteSpacer.pitchToStaffLine(noteSpacing.highPitch, deco.parent) * Metrics.pitchYFactor - 12;
                        // todo: if stem goes up use stem height
                        //if (notedecoSpacing.offset.y > -6) notedecoSpacing.offset.y = -6;
    
                        notedecoSpacing.noteY = (stemDir ? noteSpacing.stemRootY : noteSpacing.stemTipY) || 0;
                        notedecoSpacing.noteheadY = 0;
                        if (tiedToNoteSpacing && (<any>tiedToNoteSpacing).stemRootY) 
                            notedecoSpacing.endNoteY = ((<any>tiedToNoteSpacing).rev ? (<any>tiedToNoteSpacing).stemRootY : (<any>tiedToNoteSpacing).stemTipY) || 0;
                        notedecoSpacing.endNoteheadY = 0;
                    }
                    else {
                        notedecoSpacing.offset.y = 0;
                        //notedecoSpacing.offset.y = MusicSpacing.NoteSpacer.pitchToStaffLine(noteSpacing.lowPitch, deco.parent) * Metrics.pitchYFactor + 12;
                        //if (notedecoSpacing.offset.y < 30) notedecoSpacing.offset.y = 30;
    
                        // todo: calculate top/bottom if no stem
                        // todo: note.rev
                        notedecoSpacing.noteY = (stemDir ? noteSpacing.stemTipY : noteSpacing.stemRootY) || 0;
                        notedecoSpacing.noteheadY = 0;
                    if (tiedToNoteSpacing && (<any>tiedToNoteSpacing).stemRootY) 
                        notedecoSpacing.endNoteY = ((<any>tiedToNoteSpacing).rev ? (<any>tiedToNoteSpacing).stemTipY : (<any>tiedToNoteSpacing).stemRootY) || 0;
                        notedecoSpacing.endNoteheadY = 0;
                    }
    
                    notedecoSpacing.distX = 0;
                    
                    // todo: update slurs after spacing is decided
                    //var tieDir = (deco.placement === "over") ? -1 : 1;
    
                    if (tiedToNoteSpacing && tiedToNoteSpacing.offset.x >= noteSpacing.offset.x) {
                        notedecoSpacing.distX = tiedToNoteSpacing.offset.x + notedecoSpacing.offset.x - noteSpacing.offset.x;
                    }
                    else {
                        notedecoSpacing.distX = 15;
                    }
                    // todo: observer on tiedToNote
                    /*if ((<any>tiedToNoteSpacing).stemRootY)
                        notedecoSpacing.endNoteY = (<any>tiedToNoteSpacing).stemRootY;*/
                }
    
                public static getNoteDecoWidth(deco: INoteDecorationElement) {
                    if (deco.getDecorationId() >= NoteDecorationKind.Arpeggio && deco.getDecorationId() <= NoteDecorationKind.NonArpeggio) {
                        return 10;
                    }
                    else {
                        return 0;
                    }
                }
    
                public static noteDecoCalculations(deco: INoteDecorationElement, noteCtx: INoteContext, globalContext: GlobalContext) {
                    var noteSpacing = globalContext.getSpacingInfo<NoteSpacingInfo>(noteCtx);
                    var notedecoSpacing = globalContext.getSpacingInfo(deco);
    
                    //notedecoSpacing.center.x = 0;
                    if (deco.getDecorationId() >= NoteDecorationKind.Arpeggio && deco.getDecorationId() <= NoteDecorationKind.NonArpeggio) {
                        //noteSpacing.preWidth += 10;
                    }
                    else {
                        if (deco.placement === "over") {
                            notedecoSpacing.offset.y = noteSpacing.lowPitchY * Metrics.pitchYFactor - 12;
                            // todo: if stem goes up use stem height
                            if (notedecoSpacing.offset.y > -6) notedecoSpacing.offset.y = -6;
                            if (noteCtx.decorationElements.length > 1) {
                                notedecoSpacing.offset.y -= 10 * noteCtx.decorationElements.indexOf(deco);
                            }
                        }
                        else {
                            notedecoSpacing.offset.y = noteSpacing.highPitchY * Metrics.pitchYFactor + 12;
                            if (notedecoSpacing.offset.y < 30) notedecoSpacing.offset.y = 30;
                            if (noteCtx.decorationElements.length > 1) { // todo: søg kun i dekorationer under
                                notedecoSpacing.offset.y += 10 * noteCtx.decorationElements.indexOf(deco);
                            }
                        }
                    }
                }
    
                doNote(note: INoteSource, context: INoteContext, spacing: INoteSpacingInfo) {
                    //(<NoteSpacingInfo>spacing).calcMetrics(note);
                    spacing.preWidth = MinimalSpacer.doGetPreWidth(this.globalContext, note);
                    spacing.width = MinimalSpacer.doGetWidth(note);
    
                    NoteSpacer.recalcPitches(this.globalContext, note, context);
                    NoteSpacer.recalcHeads(note, context, this.globalContext);
                    NoteSpacer.recalcStem(this.globalContext, note, spacing);
                    NoteSpacer.recalcLedgerLinesUnder(note, context, this.globalContext);
                    NoteSpacer.recalcLedgerLinesOver(note, context, this.globalContext);
                }
                doLongDecoration(deco: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo) {
                    /*if (spacing.CalcSpacing) {
                        spacing.CalcSpacing(deco);
                    }
                    else {*/
                    MinimalSpacer.longDecoCalculations(deco, context, this.globalContext);
                    //}
                }
                doNoteDecoration(deco: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo) {
                    MinimalSpacer.noteDecoCalculations(deco, context, this.globalContext);
                }
                visitVoice(voice: IVoice) { }
                visitClef(clef: IClef) {
                    const spacing = this.globalContext.getSpacingInfo<IClefSpacingInfo>(clef);
                    spacing.offset.y = Metrics.pitchYFactor * (clef.definition.clefLine - 1) * 2;
                    spacing.clefId = this.clefRefId(clef.definition, !!clef.absTime.numerator);
                }
                visitMeter(meter: IMeter) {
                    const spacing = this.globalContext.getSpacingInfo(meter);
                    spacing.width = Metrics.meterWidth0;
                    var fracFunc = (num: string, den: string): any => {
                        var len = Math.max(num.length, den.length);
                        spacing.width += 4 + len * 8;
                    };
                    var fullFunc = (full: string): any => {
                        spacing.width += 4 + full.length * 8;
                    };
    
                    meter.definition.display(fracFunc, fullFunc);
                }
                visitKey(key: IKey) {
                    const spacing = this.globalContext.getSpacingInfo(key);
                    spacing.width = -Metrics.meterXOffset + key.definition.enumerateKeys().length * Metrics.keyXPerAcc;
                }
                visitStaff(staff: IStaff) {
                    const spacing = this.globalContext.getSpacingInfo<IStaffSpacingInfo>(staff);
                    spacing.staffSpace = Metrics.pitchYFactor;
                }
                visitScore(score: IScore) {
                    const spacing = this.globalContext.getSpacingInfo<IScoreSpacingInfo>(score);
                    spacing.height = Metrics.staffYStep * score.staffElements.length + Metrics.staffYOffset + Metrics.staffYBottomMargin;
                    if (score.staffElements.length) spacing.width = this.globalContext.getSpacingInfo<StaffSpacingInfo>(score.staffElements[0]).staffLength + Metrics.staffXOffset;
                }
                doTextSyllable(textSyllable: ITextSyllableElement, context: INoteContext, spacing: ITextSyllableSpacingInfo) {
                    spacing.offset.y = 50;
    
                    if (textSyllable.parent.syllableElements.length > 1) {
                        spacing.offset.y += 12 * textSyllable.parent.syllableElements.indexOf(textSyllable); // todo: konstanter
                    }
                }
                doBeam(beam: IBeam, context: INoteContext, spacing: IBeamSpacingInfo) {
                    var beamSpacing = this.globalContext.getSpacingInfo<BeamSpacingInfo>(beam);
                    var noteSpacing = this.globalContext.getSpacingInfo<NoteSpacingInfo>(context);
                    // find noder
                    var noteBeam = beam.parent.Beams[beam.index];
                    beamSpacing.start.x = noteSpacing.offset.x + noteSpacing.stemX - noteSpacing.offset.x;
                    beamSpacing.start.y = noteSpacing.offset.y + noteSpacing.stemTipY;
                    beamSpacing.end.x = 0;
                    beamSpacing.end.y = 0;
                    if (noteBeam.toNote === noteBeam.parent) {
                        // short beam ending in this note
                        beamSpacing.end.x = beamSpacing.start.x - 5;
                        beamSpacing.end.y = beamSpacing.start.y;
                    }
                    else if (noteBeam.toNote === undefined) {
                        // short beam beginning in this note
                        beamSpacing.end.x = beamSpacing.start.x + 5;
                        beamSpacing.end.y = beamSpacing.start.y;
                    }
                    else {
                        var lastNoteSpacing = this.globalContext.getSpacingInfo<NoteSpacingInfo>(noteBeam.toNote);
                        if (lastNoteSpacing) {
                            beamSpacing.start.x = noteSpacing.stemX;
                            beamSpacing.start.y = noteSpacing.offset.y + noteSpacing.stemTipY;
                            beamSpacing.end.x = lastNoteSpacing.offset.x + lastNoteSpacing.stemX - noteSpacing.offset.x;
                            beamSpacing.end.y = lastNoteSpacing.offset.y + lastNoteSpacing.stemTipY;
                        }
                    }
                    if (beam.index > 0) {
                        // recalc slope
                        var refBeam = beam.parent.Beams[0];
                        if (refBeam) {
                            beamSpacing.start.y = this.yValue(beamSpacing.start.x + noteSpacing.offset.x, refBeam);
                            beamSpacing.end.y = this.yValue(beamSpacing.end.x + noteSpacing.offset.x, refBeam);
                        }
                    }
                    beamSpacing.beamDist = (noteSpacing.rev ? -5 : 5);
    
                    if (beam.toNote && beam.index === 0) {
                        var note = beam.parent;
                        while (note && note !== beam.toNote) {
                            const noteSpacingInfo = this.globalContext.getSpacingInfo<NoteSpacingInfo>(note);
                            noteSpacingInfo.stemTipY = this.yValue(noteSpacingInfo.stemX + noteSpacingInfo.offset.x, beam);
                            noteSpacingInfo.stemLength = Math.abs(noteSpacingInfo.stemRootY - noteSpacingInfo.stemTipY);
                            note = Music.nextNote(this.globalContext, note);
                        }
                    }
    
                }
                visitBar(bar: IBar) {
                    const spacing = this.globalContext.getSpacingInfo<IBarSpacingInfo>(bar);
                    var score = bar.parent;
                    if (score.staffElements.length > 0) {
                        //this.checkRef(bar, context, svgHelper);
                        var barSpacing = this.globalContext.getSpacingInfo<BarSpacingInfo>(bar);
                        var firstStaff = score.staffElements[0];
                        var lastStaff = score.staffElements[score.staffElements.length - 1];
                        var firstStaffSpacing = this.globalContext.getSpacingInfo<StaffSpacingInfo>(firstStaff);
                        barSpacing.offset.y = firstStaffSpacing.offset.y; //s0.y;
                        barSpacing.end.y = this.globalContext.getSpacingInfo(lastStaff).offset.y + Metrics.staffHeight;
                        
                        if (firstStaffSpacing.staffLength < barSpacing.offset.x) {
                            for (var i = 0; i < score.staffElements.length; i++) {
                                var staffLine = score.staffElements[i];
                                this.globalContext.getSpacingInfo<StaffSpacingInfo>(staffLine).staffLength = barSpacing.offset.x;
                            }
                            this.globalContext.getSpacingInfo<ScoreSpacingInfo>(score).width = barSpacing.offset.x + Metrics.staffXOffset;
                        }
                    }
                }
    
                public yValue(xValue: number, refBeam: IBeam): number {
                    var fromNote = refBeam.parent;
                    var toNote = refBeam.toNote;
                    var fromNoteSpacing = this.globalContext.getSpacingInfo<NoteSpacingInfo>(fromNote);
                    var beamSpacing = this.globalContext.getSpacingInfo<BeamSpacingInfo>(refBeam);
                    if (!fromNoteSpacing) return;
                    var startX = fromNoteSpacing.offset.x + beamSpacing.start.x;
                    var startY = fromNoteSpacing.offset.y + beamSpacing.start.y;
                    var endX = fromNoteSpacing.offset.x + beamSpacing.end.x;
                    var endY = fromNoteSpacing.offset.y + beamSpacing.end.y;
    
                    if (startX === endX) {
                        return startY;
                    }
                    else {
                        return startY + (endY - startY) / (endX - startX) * (xValue - startX);
                    }
                }
    
            }
    
            class SpacingFactory extends ContextVisitor implements IVisitorIterator<IMusicElement>, IVisitor {
                visitPre(element: IMusicElement): (element: IMusicElement) => void {
                    element.inviteVisitor(this);
                    return null;
                }
    
                doNoteHead(head: INotehead, noteCtx: INoteContext, spacing: INoteHeadSpacingInfo) {
                    if (!spacing) {
                        //head.spacingInfo = new NoteHeadSpacingInfo(head);
                        this.globalContext.addSpacingInfo(head, new NoteHeadSpacingInfo(head));
                    }
                }
                doNote(note: INoteSource, context: INoteContext, spacing: INoteSpacingInfo) {
                    if (!spacing) {
                        //note.spacingInfo = new NoteSpacingInfo(note);
                        this.globalContext.addSpacingInfo(note, new NoteSpacingInfo(note));
                    }
                     // todo: visit in VisitAll - after all notes have been visited?
                    for (var i = 0; i < note.Beams.length; i++) {
                        if (note.Beams[i])
                            note.Beams[i].inviteVisitor(this);
                    }
                }
                doNoteDecoration(deco: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo) {
                    if (!spacing) {
                        //deco.spacingInfo = new NoteDecorationSpacingInfo(deco);
                        this.globalContext.addSpacingInfo(deco, new NoteDecorationSpacingInfo(deco));
                    }
                }
                doLongDecoration(deco: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo) {
                    var notedecoSpacing = this.globalContext.getSpacingInfo(deco);
                    if (!notedecoSpacing) {
                        //deco.spacingInfo = new LongDecorationSpacingInfo(deco);
                        this.globalContext.addSpacingInfo(deco, new LongDecorationSpacingInfo(deco));
                    }
                }
                visitVoice(voice: IVoice) {
                    const spacing = this.globalContext.getSpacingInfo(voice);
                    if (!spacing) {
                        //voice.spacingInfo = new VoiceSpacingInfo(voice);
                        this.globalContext.addSpacingInfo(voice, new VoiceSpacingInfo(voice));
                    }
                }
                visitClef(clef: IClef) {
                    const spacing = this.globalContext.getSpacingInfo(clef);
                    if (!spacing) {
                        //clef.spacingInfo = new ClefSpacingInfo(clef);
                        this.globalContext.addSpacingInfo(clef, new ClefSpacingInfo(clef));
                    }
                }
                visitMeter(meter: IMeter) {                    
                    if (meter.parent.getElementName() === "Score") return;
                    const spacing = this.globalContext.getSpacingInfo(meter);
                    if (!spacing) {
                        //meter.spacingInfo = new MeterSpacingInfo(meter);
                        this.globalContext.addSpacingInfo(meter, new MeterSpacingInfo(meter));
                    }
                }
                visitKey(key: IKey) {
                    const spacing = this.globalContext.getSpacingInfo(key);
                    if (!spacing) {
                        //key.spacingInfo = new KeySpacingInfo(key);
                        this.globalContext.addSpacingInfo(key, new KeySpacingInfo(key));
                    }
                }
                visitStaff(staff: IStaff) {
                    const spacing = this.globalContext.getSpacingInfo(staff);
                    if (!spacing) {
                        //staff.spacingInfo = new StaffSpacingInfo(staff);
                        this.globalContext.addSpacingInfo(staff, new StaffSpacingInfo(staff));
                    }
                }
                visitScore(score: IScore) {
                    const spacing = this.globalContext.getSpacingInfo(score);
                    if (!spacing) {
                        //score.spacingInfo = new ScoreSpacingInfo(score);
                        this.globalContext.addSpacingInfo(score, new ScoreSpacingInfo(score));
                    }
                }
                doTextSyllable(syllable: ITextSyllableElement, context: INoteContext, spacing: ITextSyllableSpacingInfo) {
                    if (!spacing) {
                        //syllable.spacingInfo = new TextSpacingInfo(syllable);
                        this.globalContext.addSpacingInfo(syllable, new TextSpacingInfo(syllable));
                    }
                }
                visitBar(bar: IBar) {
                    const spacing = this.globalContext.getSpacingInfo(bar);
                    if (!spacing) {
                        //bar.spacingInfo = new BarSpacingInfo(bar);
                        this.globalContext.addSpacingInfo(bar, new BarSpacingInfo(bar));
                    }
                }
                doBeam(beam: IBeam, context: INoteContext, spacing: IBeamSpacingInfo) {
                    if (!spacing) {
                        //beam.spacingInfo = new BeamSpacingInfo(beam); // todo: visit in VisitAll - after all notes have been visited?
                        this.globalContext.addSpacingInfo(beam, new BeamSpacingInfo(beam));
                    }                
                }
                visitStaffExpression(staffExpression: IStaffExpression): void {
                    const spacing = this.globalContext.getSpacingInfo(staffExpression);
                    if (!spacing) {
                        //staffExpression.spacingInfo = new StaffExpressionSpacingInfo(staffExpression);
                        this.globalContext.addSpacingInfo(staffExpression, new StaffExpressionSpacingInfo(staffExpression));
                    }
                }
    
                visitDefault(element: IMusicElement): void { }
            }
    
            export class SpacingDesigner implements IScoreDesigner {
                constructor(private globalContext: GlobalContext, private spacer: IVisitor = null) {
                    if (!spacer) {
                        this.spacer = new MinimalSpacer(globalContext);
                    }
                }
    
                private checkSpacingInfo(score: IScore) {
                    score.visitAll(new SpacingFactory(this.globalContext));
                }
    
                private checkUpdateAll(score: IScore) {
                    var spacer = this.spacer;
    
                    score.visitAll({
                        visitPre: (element: IMusicElement): (element: IMusicElement) => void => {
                            var spacing = this.globalContext.getSpacingInfo(element);
                            if (spacing) {
                                element.inviteVisitor(spacer);
                                return null;
                            }
                        }
                    });
                    score.withStaves((staff: IStaff): void => {
                        staff.withVoices((voice: IVoice): void => {
                            voice.withNotes(this.globalContext, (note: INote): void => {
                                for (var i = 0; i < note.Beams.length; i++) {
                                    var beam = note.Beams[i];
                                    if (beam) {
                                        beam.inviteVisitor(spacer);
                                    }
                                }
                            });
                        });
                    });
                }
    
    
                private checkBars(score: IScore) {
                    score.withBars((bar: IBar) => {
                        var barSpacing = this.globalContext.getSpacingInfo<BarSpacingInfo>(bar);
                        this.spacer.visitBar(bar);
                    });
                }
    
                private calculateSizes(score: IScore) {
                    score.withStaves((staff: IStaff, index: number): void => {
                        staff.withTimedEvents((elm: ITimedEvent, index: number) => {
                            elm.inviteVisitor(this.spacer);
                        });
    
                        staff.withVoices((voice: IVoice, index: number): void => {
                            voice.withNotes(this.globalContext, (note: INoteSource, context: INoteContext, index: number): void => {
                                note.inviteVisitor(this.spacer);
                            });
                        });
                    });
                }
    
                private makeTimeline(score: IScore) {
                    var beginPos = 0;
                    score.withStaves((staff: IStaff, index: number): void => {
                        var staffBeginPos = 0; //todo: staffSpacingInfo
                        if (beginPos < staffBeginPos) beginPos = staffBeginPos;
                        this.globalContext.getSpacingInfo(staff).offset.y = Metrics.staffYOffset + index * Metrics.staffYStep; // todo: index
                    });
    
                    var events: ITimedEvent[] = score.getEvents(this.globalContext);
                    events.sort(Music.compareEvents);
    
                    var pos = Metrics.firstPos;
                    var oldpos = pos;
                    var eventWidth = 0;
                    for (var i = 0; i < events.length; i++) {
                        if (i > 0) {
                            if (Music.compareEvents(events[i], events[i - 1]) == 0) {
                                pos = oldpos;
                            }
                            else {
                                pos += eventWidth;
                                eventWidth = 0;
                                // Find getPreWidth()
                                var j = i;
                                while (j < events.length && Music.compareEvents(events[i], events[j]) == 0) {
                                    //var eventDisplayData = <SVGBaseDisplayData>(<any>events[j]).getDisplayData(this.context);
                                    var eventSpacing = this.globalContext.getSpacingInfo(events[j]);
                                    if (eventSpacing) {
                                        var preWidth = eventSpacing.preWidth;
                                        if (eventWidth < preWidth) {
                                            eventWidth = preWidth;
                                        }
                                    }
                                    j++;
                                }
                                pos += eventWidth;
                                eventWidth = 0;
                            }
                        }
                        oldpos = pos;
                        var eventSpacing = this.globalContext.getSpacingInfo(events[i]);
                        if (eventSpacing) {
                            eventSpacing.offset.x = pos + beginPos; // todo: move svg
                            //SVGOutput.move(<MusicElement><any>events[i], eventDisplayData);
                            eventWidth = eventSpacing.width;
                        }
                        else {
                            //alert(events[i].getElementName());
                        }
                    }
                    score.withVoices((voice: IVoice, index: number): void => {
                        this.globalContext.getSpacingInfo(voice).offset.x = 0;
                        voice.withNotes(this.globalContext, (note: INoteSource, context: INoteContext, index: number): void => {
                            /*todo: if (note.beam) {
                                note.beam.updateAll();
                            }*/
                        });
                    });
                }
    
                public design(score: IScore) {
                    this.checkSpacingInfo(score); // create displayData and spacingInfo for all elements
                    this.calculateSizes(score); // calculate metrics
                    this.makeTimeline(score); // position all svg elements
                    // update multi-dependent objects (beams, slurs etc.)
                    this.checkUpdateAll(score); // update svg elements    
    
                    var test = false;
                    if (!test) {
                        this.checkBars(score);
                    }
                }
    
            }
    
            export class NoteSpacer {
    
                static hasFlag(note: INote): boolean {
                    if (note.rest) return false;
                    var bs = note.getBeamspan();
                    var b = bs.length >= 1 && bs[0] === 0;
                    var c = bs.length >= 1 && bs[0] === 1;
                    return (!bs || bs.length === 0 || b || c);
                }
                static hasStem(note: INote): boolean {
                    return !note.rest && note.timeVal.denominator >= 2;
                }
    
                static getFlagCount(note: INote): number {
                    var denom = note.timeVal.denominator;
                    var no = 0;
                    while (denom > 4) {
                        denom >>= 1;
                        no++;
                    }
                    return no;
                }

                /*private static getStaffContext(elm: IMusicElement, time: AbsoluteTime): StaffContext{
                    if ((<any>elm).getStaffContext) return (<any>elm).getStaffContext(time);
                    if (!elm.parent) return undefined;
                    return this.getStaffContext(elm.parent, time);
                }*/
    
                public static pitchToStaffLine(pitch: Pitch, note: INoteSource, noteCtx: INoteContext) {
                    var clef = noteCtx.getStaffContext().clef;
                    return clef.pitchToStaffLine(pitch);
                }
                public static staffLineToPitch(line: number, note: INoteSource, noteCtx: INoteContext) {
                    var clef = noteCtx.getStaffContext().clef;
                    return clef.staffLineToPitch(line);
                }
    
                public static recalcPitches(globalContext: GlobalContext, note: INoteSource, noteCtx: INoteContext) {
                    var noteSpacing = globalContext.getSpacingInfo<NoteSpacingInfo>(noteCtx);
    
                    var lowPitch = 99;
                    var highPitch = -99;
                    note.withHeads(globalContext, (head: INotehead) => {
                        var thePitch = NoteSpacer.pitchToStaffLine(head.getPitch(), note, noteCtx);
                        if (thePitch < lowPitch) {
                            lowPitch = thePitch;
                        }
                        if (thePitch > highPitch) {
                            highPitch = thePitch;
                        }
                    });
                    /*for (var i = 0; i < note.getChildren().length; i++) {
                        var thePitch = MusicSpacing.NoteSpacer.pitchToStaffLine(note.getChild(i).getPitch(), note);
                        if (thePitch < lowPitch) {
                            lowPitch = thePitch;
                        }
                        if (thePitch > highPitch) {
                            highPitch = thePitch;
                        }
                    }*/
                    //noteSpacing.lowPitch = MusicSpacing.NoteSpacer.staffLineToPitch(lowPitch, note);
                    //noteSpacing.highPitch = MusicSpacing.NoteSpacer.staffLineToPitch(highPitch, note);
                    noteSpacing.highPitchY = lowPitch;
                    noteSpacing.lowPitchY = highPitch;
                    if (note.getStemDirection() == StemDirectionType.StemFree) {
                        if (noteCtx.getStemDirection() == StemDirectionType.StemFree) {
                            noteSpacing.rev = highPitch + lowPitch < 10;
                        }
                        else noteSpacing.rev = (noteCtx.getStemDirection() == StemDirectionType.StemDown);
                    }
                    else noteSpacing.rev = (note.getStemDirection() == StemDirectionType.StemDown);
                }
    
    
                public static recalcLedgerLinesUnder(note: INote, context: INoteContext, globalContext: GlobalContext) {
                    if (note.rest) return;
                    var noteSpacing = globalContext.getSpacingInfo<NoteSpacingInfo>(context);
                    
                    var antalLedelinjer = Math.floor(noteSpacing.lowPitchY / 2 - 4);
                    if (antalLedelinjer < 1) antalLedelinjer = 0;
                    if (antalLedelinjer < noteSpacing.ledgerLinesUnder.length) {
                        // fjern alle ledelinjer
                        noteSpacing.ledgerLinesUnder.length = 0;
                    }
                    while (antalLedelinjer > noteSpacing.ledgerLinesUnder.length) {
                        // tilføj ledelinjer
                        var ledg = new LedgerLineSpacingInfo(Metrics.ledgerLineXLeft, Metrics.ledgerLineXRight, 10 * Metrics.pitchYFactor + noteSpacing.ledgerLinesUnder.length * Metrics.pitchYFactor * 2);
                        noteSpacing.ledgerLinesUnder.push(ledg);
                    }
                }
                public static recalcLedgerLinesOver(note: INote, context: INoteContext, globalContext: GlobalContext) {
                    if (note.rest) return;
                    var noteSpacing = globalContext.getSpacingInfo<NoteSpacingInfo>(context);
    
    
                    var antalLedelinjer = Math.floor(-noteSpacing.highPitchY / 2);
                    if (antalLedelinjer < 1) antalLedelinjer = 0;
                    if (antalLedelinjer < noteSpacing.ledgerLinesOver.length) {
                        // fjern alle ledelinjer
                        noteSpacing.ledgerLinesOver.length = 0;
                    }
                    while (antalLedelinjer > noteSpacing.ledgerLinesOver.length) {
                        // tilføj ledelinjer
                        var ledg = new LedgerLineSpacingInfo(Metrics.ledgerLineXLeft, Metrics.ledgerLineXRight, (-noteSpacing.ledgerLinesOver.length - 1) * Metrics.pitchYFactor * 2);
                        noteSpacing.ledgerLinesOver.push(ledg);
                    }
                }
    
                public static recalcStem(globalContext: GlobalContext, note: INote, noteSpacing: INoteSpacingInfo) {
                    var noteDef = NoteHeadSpacingInfo.noteValues[note.NoteId]; // todo: fjern
                    //var hasFlag = NoteSpacer.hasFlag(note);
                    //var hasStem = !note.rest && note.timeVal.denominator >= 2;//NoteSpacer.hasStem(note);
    
                    if (this.hasStem(note)) {
                        if (note.graceType) { noteSpacing.graceScale = Metrics.graceNoteScale; }
                        var length = Metrics.pitchYFactor * (noteSpacing.lowPitchY - noteSpacing.highPitchY) - Metrics.stemLengthReduce;
                        if (length < 0) length = 0;
                        noteSpacing.stemLength = (length + noteDef.stemLengthMin) * noteSpacing.graceScale;
    
                        if (noteSpacing.rev) {
                            noteSpacing.stemX = Metrics.stemRevX0 * noteSpacing.graceScale;
                            noteSpacing.stemRootY = (Metrics.stemRevY0 + noteSpacing.highPitchY * Metrics.pitchYFactor);
                            noteSpacing.stemTipY = noteSpacing.stemRootY + noteSpacing.stemLength;
                        }
                        else {
                            noteSpacing.stemX = Metrics.stemX0 * noteSpacing.graceScale;
                            noteSpacing.stemRootY = (Metrics.stemY0 + noteSpacing.lowPitchY * Metrics.pitchYFactor);
                            noteSpacing.stemTipY = noteSpacing.stemRootY - noteSpacing.stemLength;
                        }
    
                        var beam = note.Beams[0];
                        if (beam && beam.parent !== note && beam.toNote !== note) {
                            var beamSpacing = globalContext.getSpacingInfo<BeamSpacingInfo>(beam);
                            if (beamSpacing) { // todo: spacer!
                                //noteSpacing.stemTipY = SVGBeamDesigner.yValue(noteSpacing.stemX + noteSpacing.offset.x, beam);
                                //length = noteSpacing.stemRootY - noteSpacing.stemTipY;
                            }
                        }
    
                        if (NoteSpacer.hasFlag(note)) {
                            noteSpacing.flagNo = NoteSpacer.getFlagCount(note);
                            if (noteSpacing.rev) {
                                noteSpacing.flagDisplacement.x = Metrics.revFlagXDisplacement * noteSpacing.graceScale;
                                noteSpacing.flagDisplacement.y = Metrics.revFlagYDisplacement;
                            } else {
                                noteSpacing.flagDisplacement.x = Metrics.flagXDisplacement * noteSpacing.graceScale;
                                noteSpacing.flagDisplacement.y = Metrics.flagYDisplacement;
                            }
                            
                        }
                        else {
                            noteSpacing.flagNo = 0;
                        }
                    }
                }
    
                public static recalcHeads(note: INote, noteCtx: INoteContext, globalContext: GlobalContext) {
                    var noteSpacing = globalContext.getSpacingInfo<NoteSpacingInfo>(noteCtx);
                    var heads = note.noteheadElements;
                    if (heads.length == 0) return;
                    var displace = true;
                    var lastPitch: Pitch;
                    //var accidentalStep = 0;
                    if (!noteSpacing.rev) {
                        // Sorter nedefra
                        heads.sort(function (a, b) { return a.getPitch().diff(b.getPitch()); });
                    }
                    else {
                        // Sorter oppefra
                        heads.sort(function (a, b) { return b.getPitch().diff(a.getPitch()); });
                    }
                    // Start forfra og sæt noden normal. For hvert sekundinterval sættes noden forskubbet. Næste node sættes normal.
                    for (var i = 0; i < heads.length; i++) {
                        var head = heads[i];
                        if (displace) {
                            this.setDisplace(false, head, noteCtx, globalContext);
                            this.setRev(head, noteSpacing.rev, noteCtx, globalContext);
                            lastPitch = head.getPitch();
                            displace = false;
                        }
                        else {
                            if (Math.abs(head.getPitch().pitch - lastPitch.pitch) == 1) {
                                displace = true;
                            }
                            else {
                                displace = false;
                            }
                            this.setDisplace(displace, head, noteCtx, globalContext);
                            this.setRev(head, noteSpacing.rev, noteCtx, globalContext);
                            lastPitch = head.getPitch();
                        }
                        /*if (head.getAccidental()) {
                            head.spacingInfo.accidentalStep = accidentalStep++;
                        }*/
                    }
                }
    
                public static setDisplace(displace: boolean, headElm: INotehead, noteCtx: INoteContext, globalContext: GlobalContext) {
                    var spacingInfo = globalContext.getSpacingInfo<NoteHeadSpacingInfo>(headElm);
                    if (spacingInfo.displacement != displace) {
                        spacingInfo.displacement = displace;
                        this.recalc(headElm, noteCtx, globalContext);
                    }
                }
                public static setRev(headElm: INotehead, rev: boolean, noteCtx: INoteContext, globalContext: GlobalContext) {
                    //var displayData = <SVGNoteheadDisplayData>headElm.getDisplayData(context);
                    var spacingInfo = globalContext.getSpacingInfo<NoteHeadSpacingInfo>(headElm);
                    if (spacingInfo.reversed != rev) {
                        spacingInfo.reversed = rev;
                        this.recalc(headElm, noteCtx, globalContext);
                    }
                }
                public static recalc(headElm: INotehead, noteCtx: INoteContext, globalContext: GlobalContext) {
                    //var displayData = <SVGNoteheadDisplayData>headElm.getDisplayData(context);
                    //var parentDisplayData = <SVGNoteDisplayData>headElm.parent.getDisplayData(context);
                    var spacingInfo = globalContext.getSpacingInfo<NoteHeadSpacingInfo>(headElm);
                    var noteSpacingInfo = globalContext.getSpacingInfo<NoteSpacingInfo>(headElm.parent);
                    if (spacingInfo.reversed) {
                        spacingInfo.offset.x = spacingInfo.displacement ? Metrics.pitchXRevDisplacement : Metrics.pitchXNoDisplacement;
                    }
                    else {
                        spacingInfo.offset.x = spacingInfo.displacement ? Metrics.pitchXDisplacement : Metrics.pitchXNoDisplacement;
                    }
                    spacingInfo.offset.y = headElm.parent.rest ? Metrics.restY : NoteSpacer.pitchToStaffLine(headElm.pitch, <any>headElm.parent, noteCtx) * Metrics.pitchYFactor;
                    //if (displayData.ref) displayData.ref.setAttribute("transform", "translate(" + spacingInfo.center.x + "," + spacingInfo.center.y + ")");                
                }
            }
    
            export function absolutePos(elm: IMusicElement, x: number, y: number, globalContext: GlobalContext): Point {
                const spacingInfo = globalContext.getSpacingInfo(elm);
                x *= spacingInfo.scale;
                y *= spacingInfo.scale;
                x += spacingInfo.offset.x;
                y += spacingInfo.offset.y;
                if (elm.parent) {
                    return absolutePos(elm.parent, x, y, globalContext);
                }
                else {
                    return new Point(x, y);
                }
            }    
        }
    //}