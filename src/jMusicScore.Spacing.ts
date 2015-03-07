module jMusicScore {
    /// Music spacing classes - independent of graphics methods
    export module MusicSpacing {

        export class BaseSpacingInfo implements Model.ISpacingInfo {
            offset = new Model.Point(0, 0);
            width = Metrics.newPosStep * Metrics.newPosXStep;
            height: number;
            left: number;
            top: number;
            scale = 1;
            preWidth = 0;
        }

        export class BarSpacingInfo extends BaseSpacingInfo implements Model.IBarSpacingInfo {
            constructor(private parent: Model.IBar) { super(); }
            barStyle: string;
            end = new Model.Point(0, 0);
            extraXOffset: number = Metrics.barXOffset;
        }

        export class BeamSpacingInfo extends BaseSpacingInfo implements Model.IBeamSpacingInfo {
            constructor(private parent: Model.IBeam) { super(); }
            start = new Model.Point(0, 0);
            end = new Model.Point(0, 0);
            beamCount = 1;
            public beamDist: number;
        }

        interface INoteInfo {
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
        }

        export class NoteHeadSpacingInfo extends BaseSpacingInfo implements Model.INoteHeadSpacingInfo {
            constructor(private parent: Model.INotehead) { super(); }

            static noteValues: { [Index: string]: INoteInfo } = {
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
                    flag_suffix: "7",
                }
            };


            accidentalX: number;
            dots: Model.Point;
            displacement: boolean;
            public get displace(): Model.Point { return new Model.Point(this.displacement ? Metrics.pitchX_Displacement * this.graceScale : Metrics.pitchX_Displacement * this.graceScale , 0); }
            public get headGlyph(): string {
                var notedef = NoteHeadSpacingInfo.noteValues[this.parent.parent.noteId];
                return this.reversed ? notedef.noteHeadRev : notedef.noteHead;
            }
            public get dotWidth(): number {
                var notedef = NoteHeadSpacingInfo.noteValues[this.parent.parent.noteId];
                return notedef.dotWidth;
            }
            reversed: boolean;
            tieStart: Model.Point;
            tieEnd: Model.Point;
            tieDir: number;
            graceScale: number = 1;
            accidentalStep: number = 0;
        }


        export class ScoreSpacingInfo extends BaseSpacingInfo implements Model.IScoreSpacingInfo {
            constructor(private parent: Model.IScore) {
                super();
                this.scale = 1.2;
                this.height = 100;
            }
        }


        export class StaffSpacingInfo extends BaseSpacingInfo implements Model.IStaffSpacingInfo {
            constructor(private parent: Model.IStaff) {
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


        export class StaffExpressionSpacingInfo extends BaseSpacingInfo implements Model.IStaffExpressionSpacingInfo {
            constructor(private parent: Model.IStaffExpression) {
                super();
                this.offset.y = -8; // todo:
                this.width = 0;
                //this.offset.x = Metrics.staffXOffset;
            }
        }

        export class ClefSpacingInfo extends BaseSpacingInfo implements Model.IClefSpacingInfo {
            constructor(private parent: Model.IClef) { super(); }
            clefId: string;
        }


        export class MeterSpacingInfo extends BaseSpacingInfo implements Model.IMeterSpacingInfo {
            constructor(private parent: Model.IMeter) { super(); }
        }


        export class KeySpacingInfo extends BaseSpacingInfo implements Model.IKeySpacingInfo {
            constructor(private parent: Model.IKey) { super(); }
        }


        export class VoiceSpacingInfo extends BaseSpacingInfo implements Model.IVoiceSpacingInfo {
            constructor(private parent: Model.IVoice) { super(); }
        }

        export class TextSpacingInfo extends BaseSpacingInfo implements Model.ITextSyllableSpacingInfo {
            constructor(private parent: Model.ITextSyllableElement) { super(); }
        }
        export class NoteSpacingInfo extends BaseSpacingInfo implements Model.INoteSpacingInfo {
            constructor(private parent: Model.INote) { super(); }
            rev = false;
            dots: Model.Point;
            flagNo: number;
            lowPitchY: number;
            highPitchY: number;
            ledgerLinesUnder: Model.LedgerLineSpacingInfo[] = [];
            ledgerLinesOver: Model.LedgerLineSpacingInfo[] = [];
            graceScale: number = 1;
            public stemX: number;
            public stemTipY: number;
            public stemRootY: number;
            public stemLength: number;
            public get dotWidth(): number {
                var notedef = NoteHeadSpacingInfo.noteValues[this.parent.noteId];
                return notedef.dotWidth;
            }
            public get restGlyph(): string {
                var notedef = NoteHeadSpacingInfo.noteValues[this.parent.noteId];
                return notedef.baseRest;
            }
            public flagDisplacement = new Model.Point(0, 0);
        }

        export class NoteDecorationSpacingInfo extends BaseSpacingInfo implements Model.INoteDecorationSpacingInfo {
            constructor(private parent: Model.INoteDecorationElement) { super(); }
            //endpoint: Model.Point;
        }
        export class LongDecorationSpacingInfo extends BaseSpacingInfo implements Model.ILongDecorationSpacingInfo {
            constructor(private parent: Model.ILongDecorationElement) { super(); }
            //endpoint: Model.Point;
            noteY: number;
            noteheadY: number;
            distX: number;
            endNoteY: number;
            endNoteheadY: number;
            Render: (deco: Model.ILongDecorationElement, ge: Views.IGraphicsEngine) => void;
        }


        class NullSpacer implements Model.IVisitor {
            VisitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) { }
            VisitNote(note: Model.INote, spacing: Model.INoteSpacingInfo) { }
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) { }
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) { }
            VisitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) { }
            VisitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) { }
            VisitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) { }
            VisitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) { }
            VisitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) { }
            VisitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) { }
            VisitTextSyllable(textSyllable: Model.ITextSyllableElement, spacing: Model.ITextSyllableSpacingInfo) { }
            VisitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) { }
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) { }
            VisitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void { }

            VisitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }
        }

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

        class MinimalSpacer extends NullSpacer {

            public VisitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
                spacing.accidentalX = -head.spacingInfo.offset.x * 2 + Metrics.accidentalX + head.spacingInfo.accidentalStep * Metrics.accidentalXstep;
                spacing.graceScale = head.parent.spacingInfo.graceScale;

                spacing.offset.y = head.parent.rest ? 
                Metrics.restY : MusicSpacing.NoteSpacer.pitchToStaffLine(head.pitch, head.parent) * Metrics.pitchYFactor;


                if (head.tie) {
                    var tiedTo = <Model.INotehead>head.getProperty("tiedTo");
                    if (true) { // todo: if length is changed
                        // todo: update slurs after spacing is decided
                        spacing.tieDir = (head.getProperty("tieDirection") === "UP") ? -1 : 1;
                        var x0 = Metrics.tieX0; // todo: x0 and x1 based on real notehead sizes
                        var y0 = spacing.tieDir * Metrics.tieY0;
                        spacing.tieStart = new Model.Point(x0, y0);

                        var x1 = Metrics.tieX1;
                        if (tiedTo) {
                            var tiedToSpacing = tiedTo.spacingInfo;
                            var tiedToNoteSpacing = tiedTo.parent.spacingInfo;
                            var noteSpacing = head.parent.spacingInfo;

                            x1 = tiedToNoteSpacing.offset.x + tiedToSpacing.offset.x - spacing.offset.x - noteSpacing.offset.x - 2 * x0;
                        }
                        var y1 = spacing.tieDir * Metrics.tieY1;

                        spacing.tieEnd = new Model.Point(x1, y1);
                    }
                }
                else {
                    spacing.tieStart = undefined;
                    spacing.tieEnd = undefined;
                }
            }

            public static getSyllableWidth(syllable: Model.ITextSyllableElement) {
                return syllable.text.length * 10;
                /*var displayData = <SVGTextSyllableDisplayData>syllable.getDisplayData(context);
                if (!displayData.ref) return syllable.getText().length; // todo: handle
                var bBox = (<SVGLocatable><any>displayData.ref).getBBox();
                return bBox.width;*/ //todo: width
            }

            public static doGetWidth(note: Model.INote) {
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

            public static doGetPreWidth(note: Model.INote) {
                //var displayData = <SVGNoteDisplayData>note.getDisplayData(context);
                var width = 0;
                for (var i = 0; i < note.syllableElements.length; i++) {
                    var syllable = note.syllableElements[i];
                    var syllWidth = this.getSyllableWidth(syllable);
                    if (syllWidth > width * 2) {
                        width = syllWidth / 2;
                    }
                }
                note.withDecorations((deco: Model.INoteDecorationElement) => {
                    var w1 = MinimalSpacer.getNoteDecoWidth(deco);
                    if (w1 > width) width = w1;
                });

                var heads = note.noteheadElements;
                heads.sort(function (a, b) { return b.getPitch().diff(a.getPitch()); });
                var accidentalStep = width / 10; // todo: constant
                for (var i = 0; i < heads.length; i++) {
                    var head = heads[i];
                    if (head.getAccidental()) {
                        head.spacingInfo.accidentalStep = accidentalStep++;
                    }
                }
                
                if (accidentalStep) {
                    var w1 = Metrics.preWidthAccidental - accidentalStep * Metrics.accidentalXstep;
                    if (w1 > width) return w1;
                }
                return width;
            }

            public static doGetDotWidth(note: Model.INote): number {
                if (note.timeVal.denominator === 1) return 10; // todo: konstanter
                return 6;
            }

            public ClefRefId(def: Model.ClefDefinition, change: boolean): string {
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
            }
            public static LongDecoCalculations(deco: Model.ILongDecorationElement) {
                var noteSpacing = deco.parent.spacingInfo;
                var notedecoSpacing = deco.spacingInfo;
                var tiedToNoteSpacing = deco.EndEvent.spacingInfo; //todo: if (deco.EndEvent)
                var stemDir = deco.parent.spacingInfo.rev;

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

            public static getNoteDecoWidth(deco: Model.INoteDecorationElement) {
                if (deco.getDecorationId() >= Model.NoteDecorationKind.arpeggio && deco.getDecorationId() <= Model.NoteDecorationKind.nonArpeggio) {
                    return 10;
                }
                else {
                    return 0;
                }
            }

            public static NoteDecoCalculations(deco: Model.INoteDecorationElement) {
                var noteSpacing = deco.parent.spacingInfo;
                var notedecoSpacing = deco.spacingInfo;

                //notedecoSpacing.center.x = 0;
                if (deco.getDecorationId() >= Model.NoteDecorationKind.arpeggio && deco.getDecorationId() <= Model.NoteDecorationKind.nonArpeggio) {
                    //noteSpacing.preWidth += 10;
                }
                else {
                    if (deco.placement === "over") {
                        notedecoSpacing.offset.y = noteSpacing.lowPitchY * Metrics.pitchYFactor - 12;
                        // todo: if stem goes up use stem height
                        if (notedecoSpacing.offset.y > -6) notedecoSpacing.offset.y = -6;
                        if (deco.parent.decorationElements.length > 1) {
                            notedecoSpacing.offset.y -= 10 * deco.parent.decorationElements.indexOf(deco);
                        }
                    }
                    else {
                        notedecoSpacing.offset.y = noteSpacing.highPitchY * Metrics.pitchYFactor + 12;
                        if (notedecoSpacing.offset.y < 30) notedecoSpacing.offset.y = 30;
                        if (deco.parent.decorationElements.length > 1) { // todo: søg kun i dekorationer under
                            notedecoSpacing.offset.y += 10 * deco.parent.decorationElements.indexOf(deco);
                        }
                    }
                }
            }

            VisitNote(note: Model.INote, spacing: Model.INoteSpacingInfo) {
                //(<NoteSpacingInfo>spacing).calcMetrics(note);
                spacing.preWidth = MinimalSpacer.doGetPreWidth(note);
                spacing.width = MinimalSpacer.doGetWidth(note);

                NoteSpacer.recalcPitches(note);
                NoteSpacer.recalcHeads(note);
                NoteSpacer.recalcStem(note, spacing);
                NoteSpacer.recalcLedgerLinesUnder(note);
                NoteSpacer.recalcLedgerLinesOver(note);
            }
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) {
                /*if (spacing.CalcSpacing) {
                    spacing.CalcSpacing(deco);
                }
                else {*/
                MinimalSpacer.LongDecoCalculations(deco);
                //}
            }
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
                MinimalSpacer.NoteDecoCalculations(deco);
            }
            VisitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) { }
            VisitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
                spacing.offset.y = Metrics.pitchYFactor * (clef.definition.clefLine - 1) * 2;
                spacing.clefId = this.ClefRefId(clef.definition, !!clef.absTime.numerator);
            }
            VisitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
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
            VisitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
                spacing.width = -Metrics.meterXOffset + key.definition.enumerateKeys().length * Metrics.keyXPerAcc;
            }
            VisitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
                spacing.staffSpace = Metrics.pitchYFactor;
            }
            VisitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
                spacing.height = Metrics.staffYStep * score.staffElements.length + Metrics.staffYOffset + Metrics.staffYBottomMargin;
                if (score.staffElements.length) spacing.width = score.staffElements[0].spacingInfo.staffLength + Metrics.staffXOffset;
            }
            VisitTextSyllable(textSyllable: Model.ITextSyllableElement, spacing: Model.ITextSyllableSpacingInfo) {
                spacing.offset.y = 50;

                if (textSyllable.parent.syllableElements.length > 1) {
                    spacing.offset.y += 12 * textSyllable.parent.syllableElements.indexOf(textSyllable); // todo: konstanter
                }
            }
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
                var beamSpacing = beam.spacingInfo;
                var noteSpacing = beam.parent.spacingInfo;
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
                    var lastNoteSpacing = noteBeam.toNote.spacingInfo;
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
                        note.spacingInfo.stemTipY = this.yValue(note.spacingInfo.stemX + note.spacingInfo.offset.x, beam);
                        note.spacingInfo.stemLength = Math.abs(note.spacingInfo.stemRootY - note.spacingInfo.stemTipY);
                        note = Model.Music.nextNote(note);
                    }
                }

            }
            VisitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
                var score = bar.parent;
                if (score.staffElements.length > 0) {
                    //this.checkRef(bar, context, svgHelper);
                    var barSpacing = bar.spacingInfo;
                    var firstStaff = score.staffElements[0];
                    var lastStaff = score.staffElements[score.staffElements.length - 1];
                    var firstStaffSpacing = firstStaff.spacingInfo;
                    barSpacing.offset.y = firstStaffSpacing.offset.y; //s0.y;
                    barSpacing.end.y = lastStaff.spacingInfo.offset.y + Metrics.staffHeight;
                    
                    if (firstStaffSpacing.staffLength < barSpacing.offset.x) {
                        for (var i = 0; i < score.staffElements.length; i++) {
                            var staffLine = score.staffElements[i];
                            staffLine.spacingInfo.staffLength = barSpacing.offset.x;
                        }
                        score.spacingInfo.width = barSpacing.offset.x + Metrics.staffXOffset;
                    }
                }
            }

            public yValue(xValue: number, refBeam: Model.IBeam): number {
                var fromNote = refBeam.parent;
                var toNote = refBeam.toNote;
                var fromNoteSpacing = fromNote.spacingInfo;
                var beamSpacing = refBeam.spacingInfo;
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

        class SpacingFactory implements Model.IVisitorIterator, Model.IVisitor {
            VisitPre(element: Model.IMusicElement): (element: Model.IMusicElement) => void {
                element.InviteVisitor(this);
                return null;
            }

            VisitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo) {
                if (!spacing) {
                    head.setSpacingInfo(new NoteHeadSpacingInfo(head));
                }
            }
            VisitNote(note: Model.INote, spacing: Model.INoteSpacingInfo) {
                if (!spacing) {
                    note.setSpacingInfo(new NoteSpacingInfo(note));
                }
                 // todo: visit in VisitAll - after all notes have been visited?
                for (var i = 0; i < note.Beams.length; i++) {
                    if (note.Beams[i])
                        note.Beams[i].InviteVisitor(this);
                }
            }
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo) {
                if (!spacing) {
                    deco.setSpacingInfo(new NoteDecorationSpacingInfo(deco));
                }
            }
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo) {
                var notedecoSpacing = deco.spacingInfo;
                if (!notedecoSpacing) {
                    deco.setSpacingInfo(new LongDecorationSpacingInfo(deco));
                }
            }
            VisitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo) {
                if (!spacing) {
                    voice.setSpacingInfo(new VoiceSpacingInfo(voice));
                }
            }
            VisitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo) {
                if (!spacing) {
                    clef.setSpacingInfo(new ClefSpacingInfo(clef));
                }
            }
            VisitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo) {
                if (meter.parent.getElementName() === "Score") return;
                if (!spacing) {
                    meter.setSpacingInfo(new MeterSpacingInfo(meter));
                }
            }
            VisitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo) {
                if (!spacing) {
                    key.setSpacingInfo(new KeySpacingInfo(key));
                }
            }
            VisitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo) {
                if (!spacing) {
                    staff.setSpacingInfo(new StaffSpacingInfo(staff));
                }
            }
            VisitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo) {
                if (!spacing) {
                    score.setSpacingInfo(new ScoreSpacingInfo(score));
                }
            }
            VisitTextSyllable(syllable: Model.ITextSyllableElement, spacing: Model.ITextSyllableSpacingInfo) {
                if (!spacing) {
                    syllable.setSpacingInfo(new TextSpacingInfo(syllable));
                }
            }
            VisitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo) {
                if (!spacing) {
                    bar.setSpacingInfo(new BarSpacingInfo(bar));
                }
            }
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo) {
                if (!spacing) {
                    beam.setSpacingInfo(new BeamSpacingInfo(beam)); // todo: visit in VisitAll - after all notes have been visited?
                }                
            }
            VisitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void {
                if (!spacing) {
                    staffExpression.setSpacingInfo(new StaffExpressionSpacingInfo(staffExpression));
                }
            }

            VisitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void { }
        }

        export class SpacingDesigner implements ScoreApplication.ScoreDesigner {
            constructor(private spacer: Model.IVisitor = null) {
                if (!spacer) {
                    this.spacer = new MinimalSpacer();
                }
            }

            private CheckSpacingInfo(score: Model.IScore) {
                score.VisitAll(new SpacingFactory());
            }

            private CheckUpdateAll(score: Model.IScore) {
                var spacer = this.spacer;

                score.VisitAll({
                    VisitPre: (element: Model.IMusicElement): (element: Model.IMusicElement) => void => {
                        var spacing = element.spacingInfo;
                        if (spacing) {
                            element.InviteVisitor(spacer);
                            return null;
                        }
                    }
                });
                score.withStaves((staff: Model.IStaff, index: number): void => {
                    staff.withVoices((voice: Model.IVoice, index: number): void => {
                        voice.withNotes((note: Model.INote, index: number): void => {
                            for (var i = 0; i < note.Beams.length; i++) {
                                var beam = note.Beams[i];
                                if (beam) {
                                    beam.InviteVisitor(spacer);
                                }
                            }
                        });
                    });
                });
            }


            private CheckBars(score: Model.IScore) {
                score.withBars((bar: Model.IBar) => {
                    var barSpacing = bar.spacingInfo;
                    this.spacer.VisitBar(bar, barSpacing);
                });
            }

            private CalculateSizes(score: Model.IScore) {
                score.withStaves((staff: Model.IStaff, index: number): void => {
                    staff.withTimedEvents((elm: Model.ITimedEvent, index: number) => {
                        elm.InviteVisitor(this.spacer);
                    });

                    staff.withVoices((voice: Model.IVoice, index: number): void => {
                        voice.withNotes((note: Model.INote, index: number): void => {
                            note.InviteVisitor(this.spacer);
                        });
                    });
                });
            }

            private MakeTimeline(score: Model.IScore) {
                var beginPos = 0;
                score.withStaves((staff: Model.IStaff, index: number): void => {
                    var staffBeginPos = 0; //todo: staffSpacingInfo
                    if (beginPos < staffBeginPos) beginPos = staffBeginPos;
                    staff.spacingInfo.offset.y = Metrics.staffYOffset + index * Metrics.staffYStep; // todo: index
                });

                var events: Model.ITimedEvent[] = score.getEvents();
                events.sort(Model.Music.compareEvents);

                var pos = Metrics.firstPos;
                var oldpos = pos;
                var eventWidth = 0;
                for (var i = 0; i < events.length; i++) {
                    if (i > 0) {
                        if (Model.Music.compareEvents(events[i], events[i - 1]) == 0) {
                            pos = oldpos;
                        }
                        else {
                            pos += eventWidth;
                            eventWidth = 0;
                            // Find getPreWidth()
                            var j = i;
                            while (j < events.length && Model.Music.compareEvents(events[i], events[j]) == 0) {
                                //var eventDisplayData = <SVGBaseDisplayData>(<any>events[j]).getDisplayData(this.context);
                                var eventSpacing = events[j].spacingInfo;
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
                    var eventSpacing = events[i].spacingInfo;
                    if (eventSpacing) {
                        eventSpacing.offset.x = pos + beginPos; // todo: move svg
                        //SVGOutput.move(<Model.MusicElement><any>events[i], eventDisplayData);
                        eventWidth = eventSpacing.width;
                    }
                    else {
                        //alert(events[i].getElementName());
                    }
                }
                score.withVoices((voice: Model.IVoice, index: number): void => {
                    voice.spacingInfo.offset.x = 0;
                    voice.withNotes((note: Model.INote, index: number): void => {
                        /*todo: if (note.beam) {
                            note.beam.updateAll();
                        }*/
                    });
                });
            }

            public Validate(app: ScoreApplication.ScoreApplication) {
                var score = app.document;

                this.CheckSpacingInfo(score); // create displayData and spacingInfo for all elements
                this.CalculateSizes(score); // calculate metrics
                this.MakeTimeline(score); // position all svg elements
                // update multi-dependent objects (beams, slurs etc.)
                this.CheckUpdateAll(score); // update svg elements


                var test = false;
                if (!test) {
                    this.CheckBars(score);
                }
            }

        }

        export class NoteSpacer {

            static hasFlag(note: Model.INote): boolean {
                if (note.rest) return false;
                var bs = note.getBeamspan();
                var b = bs.length >= 1 && bs[0] === 0;
                var c = bs.length >= 1 && bs[0] === 1;
                return (!bs || bs.length === 0 || b || c);
            }
            static hasStem(note: Model.INote): boolean {
                return !note.rest && note.timeVal.denominator >= 2;
            }

            static GetFlagCount(note: Model.INote): number {
                var denom = note.timeVal.denominator;
                var no = 0;
                while (denom > 4) {
                    denom >>= 1;
                    no++;
                }
                return no;
            }

            public static pitchToStaffLine(pitch: Model.Pitch, note: Model.INote) {
                var clef = note.parent.parent.getStaffContext(note.absTime).clef;
                return clef.pitchToStaffLine(pitch);
            }
            public static staffLineToPitch(line: number, note: Model.INote) {
                var clef = note.parent.parent.getStaffContext(note.absTime).clef;
                return clef.staffLineToPitch(line);
            }

            public static recalcPitches(note: Model.INote) {
                var noteSpacing = note.spacingInfo;

                var lowPitch = 99;
                var highPitch = -99;
                note.withHeads((head: Model.INotehead) => {
                    var thePitch = MusicSpacing.NoteSpacer.pitchToStaffLine(head.getPitch(), note);
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
                if (note.getStemDirection() == Model.StemDirectionType.stemFree) {
                    if (note.parent.getStemDirection() == Model.StemDirectionType.stemFree) {
                        noteSpacing.rev = highPitch + lowPitch < 10;
                    }
                    else noteSpacing.rev = (note.parent.getStemDirection() == Model.StemDirectionType.stemDown);
                }
                else noteSpacing.rev = (note.getStemDirection() == Model.StemDirectionType.stemDown);
            }


            public static recalcLedgerLinesUnder(note: Model.INote) {
                if (note.rest) return;
                var noteSpacing = note.spacingInfo;
                
                var antalLedelinjer = Math.floor(noteSpacing.lowPitchY / 2 - 4);
                if (antalLedelinjer < 1) antalLedelinjer = 0;
                if (antalLedelinjer < noteSpacing.ledgerLinesUnder.length) {
                    // fjern alle ledelinjer
                    noteSpacing.ledgerLinesUnder.length = 0;
                }
                while (antalLedelinjer > noteSpacing.ledgerLinesUnder.length) {
                    // tilføj ledelinjer
                    var ledg = new Model.LedgerLineSpacingInfo(Metrics.ledgerLineXLeft, Metrics.ledgerLineXRight, 10 * Metrics.pitchYFactor + noteSpacing.ledgerLinesUnder.length * Metrics.pitchYFactor * 2);
                    noteSpacing.ledgerLinesUnder.push(ledg);
                }
            }
            public static recalcLedgerLinesOver(note: Model.INote) {
                if (note.rest) return;
                var noteSpacing = note.spacingInfo;


                var antalLedelinjer = Math.floor(-noteSpacing.highPitchY / 2);
                if (antalLedelinjer < 1) antalLedelinjer = 0;
                if (antalLedelinjer < noteSpacing.ledgerLinesOver.length) {
                    // fjern alle ledelinjer
                    noteSpacing.ledgerLinesOver.length = 0;
                }
                while (antalLedelinjer > noteSpacing.ledgerLinesOver.length) {
                    // tilføj ledelinjer
                    var ledg = new Model.LedgerLineSpacingInfo(Metrics.ledgerLineXLeft, Metrics.ledgerLineXRight, (-noteSpacing.ledgerLinesOver.length - 1) * Metrics.pitchYFactor * 2);
                    noteSpacing.ledgerLinesOver.push(ledg);
                }
            }

            public static recalcStem(note: Model.INote, noteSpacing: Model.INoteSpacingInfo) {
                var noteDef = NoteHeadSpacingInfo.noteValues[note.noteId]; // todo: fjern
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
                        var beamSpacing = beam.spacingInfo;
                        if (beamSpacing) { // todo: spacer!
                            //noteSpacing.stemTipY = SVGBeamDesigner.yValue(noteSpacing.stemX + noteSpacing.offset.x, beam);
                            //length = noteSpacing.stemRootY - noteSpacing.stemTipY;
                        }
                    }

                    if (NoteSpacer.hasFlag(note)) {
                        noteSpacing.flagNo = NoteSpacer.GetFlagCount(note);
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

            public static recalcHeads(note: Model.INote) {
                var noteSpacing = note.spacingInfo;
                var heads = note.noteheadElements;
                if (heads.length == 0) return;
                var displace = true;
                var lastPitch: Model.Pitch;
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
                        this.setDisplace(false, head);
                        this.setRev(head, noteSpacing.rev);
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
                        this.setDisplace(displace, head);
                        this.setRev(head, noteSpacing.rev);
                        lastPitch = head.getPitch();
                    }
                    /*if (head.getAccidental()) {
                        head.spacingInfo.accidentalStep = accidentalStep++;
                    }*/
                }
            }

            public static setDisplace(displace: boolean, headElm: Model.INotehead) {
                var spacingInfo = headElm.spacingInfo;
                if (spacingInfo.displacement != displace) {
                    spacingInfo.displacement = displace;
                    this.recalc(headElm);
                }
            }
            public static setRev(headElm: Model.INotehead, rev: boolean) {
                //var displayData = <SVGNoteheadDisplayData>headElm.getDisplayData(context);
                var spacingInfo = headElm.spacingInfo;
                if (spacingInfo.reversed != rev) {
                    spacingInfo.reversed = rev;
                    this.recalc(headElm);
                }
            }
            public static recalc(headElm: Model.INotehead) {
                //var displayData = <SVGNoteheadDisplayData>headElm.getDisplayData(context);
                //var parentDisplayData = <SVGNoteDisplayData>headElm.parent.getDisplayData(context);
                var spacingInfo = headElm.spacingInfo;
                var noteSpacingInfo = headElm.parent.spacingInfo;
                if (spacingInfo.reversed) {
                    spacingInfo.offset.x = spacingInfo.displacement ? Metrics.pitchXRevDisplacement : Metrics.pitchXNoDisplacement;
                }
                else {
                    spacingInfo.offset.x = spacingInfo.displacement ? Metrics.pitchXDisplacement : Metrics.pitchXNoDisplacement;
                }
                spacingInfo.offset.y = headElm.parent.rest ? Metrics.restY : MusicSpacing.NoteSpacer.pitchToStaffLine(headElm.pitch, headElm.parent) * Metrics.pitchYFactor;
                //if (displayData.ref) displayData.ref.setAttribute("transform", "translate(" + spacingInfo.center.x + "," + spacingInfo.center.y + ")");                
            }
        }

        export function absolutePos(elm: Model.IMusicElement, x: number, y: number): Model.Point {
            x *= elm.spacingInfo.scale;
            y *= elm.spacingInfo.scale;
            x += elm.spacingInfo.offset.x;
            y += elm.spacingInfo.offset.y;
            if (elm.parent) {
                return this.absolutePos(elm.parent, x, y);
            }
            else {
                return new Model.Point(x, y);
            }
        }

    }
}