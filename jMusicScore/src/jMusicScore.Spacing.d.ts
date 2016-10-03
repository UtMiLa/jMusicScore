declare module JMusicScore {
    module MusicSpacing {
        class BaseSpacingInfo implements Model.ISpacingInfo {
            offset: Model.Point;
            width: number;
            height: number;
            left: number;
            top: number;
            scale: number;
            preWidth: number;
        }
        class BarSpacingInfo extends BaseSpacingInfo implements Model.IBarSpacingInfo {
            private parent;
            constructor(parent: Model.IBar);
            barStyle: string;
            end: Model.Point;
            extraXOffset: number;
        }
        class BeamSpacingInfo extends BaseSpacingInfo implements Model.IBeamSpacingInfo {
            private parent;
            constructor(parent: Model.IBeam);
            start: Model.Point;
            end: Model.Point;
            beamCount: number;
            beamDist: number;
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
            flag_suffix?: string;
            rev?: boolean;
        }
        class NoteHeadSpacingInfo extends BaseSpacingInfo implements Model.INoteHeadSpacingInfo {
            private parent;
            constructor(parent: Model.INotehead);
            static noteValues: {
                [index: string]: INoteInfo;
            };
            accidentalX: number;
            dots: Model.Point;
            displacement: boolean;
            displace: Model.Point;
            headGlyph: string;
            dotWidth: number;
            reversed: boolean;
            tieStart: Model.Point;
            tieEnd: Model.Point;
            tieDir: number;
            graceScale: number;
            accidentalStep: number;
        }
        class ScoreSpacingInfo extends BaseSpacingInfo implements Model.IScoreSpacingInfo {
            private parent;
            constructor(parent: Model.IScore);
        }
        class StaffSpacingInfo extends BaseSpacingInfo implements Model.IStaffSpacingInfo {
            private parent;
            constructor(parent: Model.IStaff);
            private _staffLength;
            staffLength: number;
            staffSpace: number;
        }
        class StaffExpressionSpacingInfo extends BaseSpacingInfo implements Model.IStaffExpressionSpacingInfo {
            private parent;
            constructor(parent: Model.IStaffExpression);
        }
        class ClefSpacingInfo extends BaseSpacingInfo implements Model.IClefSpacingInfo {
            private parent;
            constructor(parent: Model.IClef);
            clefId: string;
        }
        class MeterSpacingInfo extends BaseSpacingInfo implements Model.IMeterSpacingInfo {
            private parent;
            constructor(parent: Model.IMeter);
        }
        class KeySpacingInfo extends BaseSpacingInfo implements Model.IKeySpacingInfo {
            private parent;
            constructor(parent: Model.IKey);
        }
        class VoiceSpacingInfo extends BaseSpacingInfo implements Model.IVoiceSpacingInfo {
            private parent;
            constructor(parent: Model.IVoice);
        }
        class TextSpacingInfo extends BaseSpacingInfo implements Model.ITextSyllableSpacingInfo {
            private parent;
            constructor(parent: Model.ITextSyllableElement);
        }
        class NoteSpacingInfo extends BaseSpacingInfo implements Model.INoteSpacingInfo {
            private parent;
            constructor(parent: Model.INote);
            rev: boolean;
            dots: Model.Point;
            flagNo: number;
            lowPitchY: number;
            highPitchY: number;
            ledgerLinesUnder: Model.LedgerLineSpacingInfo[];
            ledgerLinesOver: Model.LedgerLineSpacingInfo[];
            graceScale: number;
            stemX: number;
            stemTipY: number;
            stemRootY: number;
            stemLength: number;
            dotWidth: number;
            restGlyph: string;
            flagDisplacement: Model.Point;
        }
        class NoteDecorationSpacingInfo extends BaseSpacingInfo implements Model.INoteDecorationSpacingInfo {
            private parent;
            constructor(parent: Model.INoteDecorationElement);
        }
        class LongDecorationSpacingInfo extends BaseSpacingInfo implements Model.ILongDecorationSpacingInfo {
            private parent;
            constructor(parent: Model.ILongDecorationElement);
            noteY: number;
            noteheadY: number;
            distX: number;
            endNoteY: number;
            endNoteheadY: number;
            render: (deco: Model.ILongDecorationElement, ge: Views.IGraphicsEngine) => void;
        }
        class Metrics {
            static newPosXStep: number;
            static newPosStep: number;
            static restXDisplacement: number;
            static revFlagXDisplacement: number;
            static flagXDisplacement: number;
            static revFlagYDisplacement: number;
            static flagYDisplacement: number;
            static pitchYFactor: number;
            static graceNoteScale: number;
            static stemLengthReduce: number;
            static restY: number;
            static stemRevX0: number;
            static stemX0: number;
            static stemRevY0: number;
            static stemY0: number;
            static stemWidth: number;
            static stemYSlope: number;
            static preWidthAccidental: number;
            static noteXToleranceRight: number;
            static noteXToleranceLeft: number;
            static dotSeparation: number;
            static firstPos: number;
            static xPosOffset: number;
            static voiceEditBoundLeft: number;
            static voiceEditBoundTop: number;
            static voiceEditBoundRight: number;
            static voiceEditBoundBottom: number;
            static pitchXDisplacement: number;
            static pitchXRevDisplacement: number;
            static pitchX_Displacement: number;
            static pitchXNoDisplacement: number;
            static staffXOffset: number;
            static staffYOffset: number;
            static staffYBottomMargin: number;
            static staffYStep: number;
            static staffHeight: number;
            static barXOffset: number;
            static barStrokeWidth: number;
            static barBeginStrokeWidth: number;
            static barThickStrokeWidth: number;
            static barDoubleDistance: number;
            static staffLineStrokeWidth: number;
            static staffLength: number;
            static ledgerLineStrokeWidth: number;
            static ledgerLineXLeft: number;
            static ledgerLineXRight: number;
            static staffHelperYOffset: number;
            static keyXPerAcc: number;
            static keyXOffset: number;
            static keyWidth0: number;
            static clefXOffset: number;
            static meterWidth0: number;
            static meterWidth1: number;
            static meterXOffset: number;
            static meterX0: number;
            static meterY0: number;
            static meterX1: number;
            static meterX: number;
            static meterY1: number;
            static accidentalX: number;
            static accidentalXstep: number;
            static tieX0: number;
            static tieY0: number;
            static tieX1: number;
            static tieY1: number;
        }
        class SpacingDesigner implements ScoreApplication.IScoreDesigner {
            private spacer;
            constructor(spacer?: Model.IVisitor);
            private checkSpacingInfo(score);
            private checkUpdateAll(score);
            private checkBars(score);
            private calculateSizes(score);
            private makeTimeline(score);
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class NoteSpacer {
            static hasFlag(note: Model.INote): boolean;
            static hasStem(note: Model.INote): boolean;
            static getFlagCount(note: Model.INote): number;
            static pitchToStaffLine(pitch: Model.Pitch, note: Model.INote): number;
            static staffLineToPitch(line: number, note: Model.INote): Model.Pitch;
            static recalcPitches(note: Model.INote): void;
            static recalcLedgerLinesUnder(note: Model.INote): void;
            static recalcLedgerLinesOver(note: Model.INote): void;
            static recalcStem(note: Model.INote, noteSpacing: Model.INoteSpacingInfo): void;
            static recalcHeads(note: Model.INote): void;
            static setDisplace(displace: boolean, headElm: Model.INotehead): void;
            static setRev(headElm: Model.INotehead, rev: boolean): void;
            static recalc(headElm: Model.INotehead): void;
        }
        function absolutePos(elm: Model.IMusicElement, x: number, y: number): Model.Point;
    }
}
