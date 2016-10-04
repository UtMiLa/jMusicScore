declare module JMusicScore {
    module ScoreApplication {
        interface IScoreApplication extends Application.AbstractApplication<Model.IScore, ScoreStatusManager, JQuery> {
        }
        interface IScorePlugin extends Application.IPlugIn<Model.IScore, ScoreStatusManager, JQuery> {
        }
        interface IScoreEventProcessor extends Application.IEventProcessor<Model.IScore, ScoreStatusManager, JQuery> {
        }
        interface IScoreDesigner extends Application.IDesigner<Model.IScore, ScoreStatusManager, JQuery> {
        }
        interface IMessage extends Application.IMessage {
            note?: Model.INote;
            pitch?: Model.Pitch;
            head?: Model.INotehead;
            voice?: Model.IVoice;
            bar?: Model.IBar;
            keySig?: Model.IKey;
            clef?: Model.IClef;
            meter?: Model.IMeter;
        }
        class ScoreStatusManager implements Application.IStatusManager {
            constructor();
            private feedbackManager;
            setFeedbackManager(f: Application.IFeedbackManager): void;
            private _currentPitch;
            private _currentNote;
            private _currentNotehead;
            private _currentVoice;
            private _currentStaff;
            private _insertPoint;
            private selectionStart;
            private selectionEnd;
            private selectionStartStaff;
            private selectionEndStaff;
            private _rest;
            private _dots;
            private _grace;
            private _currentTuplet;
            private _mouseOverElement;
            private changed(key, val);
            currentPitch: Model.Pitch;
            currentNote: Model.INote;
            currentNotehead: Model.INotehead;
            currentVoice: Model.IVoice;
            currentStaff: Model.IStaff;
            currentTuplet: Model.TupletDef;
            insertPoint: Model.HorizPosition;
            mouseOverElement: Model.IMusicElement;
            rest: boolean;
            dots: number;
            grace: boolean;
            private _notesPressed;
            private noteValSelected;
            notesPressed: Model.Pitch[];
            pressNoteKey(pitch: Model.Pitch): void;
            releaseNoteKey(pitch: Model.Pitch): void;
        }
    }
    module Model {
        interface ILongDecorationSpacingInfo extends ISpacingInfo {
            render?: (deco: ILongDecorationElement, ge: Views.IGraphicsEngine) => void;
        }
    }
    module Views {
        interface IBaseGraphicsEngine {
            setSize(width: number, height: number): void;
            beginDraw(): void;
            endDraw(): void;
            beginGroup(id: string, x: number, y: number, scale: number, className: string): any;
            endGroup(group: any): void;
        }
        interface IGraphicsEngine extends IBaseGraphicsEngine {
            createMusicObject(id: string, item: string, x: number, y: number, scale: number): any;
            createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id?: string): any;
            drawText(id: string, text: string, x: number, y: number, justify: string): any;
        }
        interface ISensorGraphicsEngine extends IBaseGraphicsEngine {
            createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any;
            moveCursor(id: string, x: number, y: number): void;
            showCursor(noteId: string): void;
            hideCursor(): void;
            showInsertionPoint(id: string, x: number, y: number): void;
            hideInsertionPoint(): void;
            calcCoordinates(event: MouseEvent): Model.Point;
        }
        class KeyDrawer {
            private static clefMagicNo;
            static addKeyXy(id: string, graphic: IGraphicsEngine, keyDefinition: Model.IKeyDefinition, clefDefinition: Model.ClefDefinition, x: number, y: number): void;
        }
        class MeterDrawer {
            static meterDefs: string[];
            static addNumberXy(id: string, graphic: IGraphicsEngine, meterChar: string, x: number, y: number): void;
            static addStringXy(id: string, graphic: IGraphicsEngine, meterString: string, x: number, y: number, maxLen: number): void;
            static addMeterXy(id: string, graphic: IGraphicsEngine, meterDefinition: Model.IMeterDefinition, x: number, y: number): any[];
        }
        class ExpressionRenderer implements ScoreApplication.IScoreDesigner {
            private spacer;
            constructor(spacer?: Model.IVisitor);
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class DomCheckSensorsVisitor implements Model.IVisitor {
            sensorEngine: ISensorGraphicsEngine;
            private score;
            private eventReceiver;
            constructor(sensorEngine: ISensorGraphicsEngine, score: Model.IScore, eventReceiver: Application.IEventReceiver);
            visitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo): void;
            visitNote(note: Model.INote, noteSpacing: Model.INoteSpacingInfo): void;
            visitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo): void;
            visitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo): void;
            visitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo): void;
            visitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo): void;
            visitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo): void;
            visitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo): void;
            visitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo): void;
            visitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo): void;
            visitTextSyllable(textSyllable: Model.ITextSyllableElement, textSpacing: Model.ITextSyllableSpacingInfo): void;
            visitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo): void;
            visitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo): void;
            visitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void;
            visitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void;
        }
        class RedrawVisitor implements Model.IVisitor {
            private graphEngine;
            constructor(graphEngine: IGraphicsEngine);
            static getTie(spacing: Model.INoteHeadSpacingInfo): string;
            private accidentalDefs;
            visitNoteHead(head: Model.INotehead, spacing: Model.INoteHeadSpacingInfo): void;
            visitNote(note: Model.INote, noteSpacing: Model.INoteSpacingInfo): void;
            visitLongDecoration(deco: Model.ILongDecorationElement, spacing: Model.ILongDecorationSpacingInfo): void;
            visitNoteDecoration(deco: Model.INoteDecorationElement, spacing: Model.INoteDecorationSpacingInfo): void;
            visitVoice(voice: Model.IVoice, spacing: Model.IVoiceSpacingInfo): void;
            visitClef(clef: Model.IClef, spacing: Model.IClefSpacingInfo): void;
            visitMeter(meter: Model.IMeter, spacing: Model.IMeterSpacingInfo): void;
            visitKey(key: Model.IKey, spacing: Model.IKeySpacingInfo): void;
            visitStaff(staff: Model.IStaff, spacing: Model.IStaffSpacingInfo): void;
            visitScore(score: Model.IScore, spacing: Model.IScoreSpacingInfo): void;
            visitTextSyllable(textSyllable: Model.ITextSyllableElement, textSpacing: Model.ITextSyllableSpacingInfo): void;
            visitBar(bar: Model.IBar, spacing: Model.IBarSpacingInfo): void;
            visitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo): void;
            visitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void;
            visitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void;
        }
        class PrefixVisitor implements Model.IVisitorIterator {
            private visitor;
            private cge;
            private prefix;
            constructor(visitor: Model.IVisitor, cge: IBaseGraphicsEngine, prefix?: string);
            visitPre(element: Model.IMusicElement): (element: Model.IMusicElement) => void;
        }
    }
    module SvgView {
        class DomFeedbackClient implements Application.IFeedbackClient {
            private sensorEngine;
            constructor(sensorEngine: Views.ISensorGraphicsEngine);
            changed(status: ScoreApplication.ScoreStatusManager, key: string, val: any): void;
            mouseOverStyle: string;
            showNoteCursor(noteId: string, voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch): void;
            hideNoteCursor(): void;
            mouseOverElement(elm: Model.IMusicElement, over: boolean): void;
        }
        class SvgViewer implements ScoreApplication.IScorePlugin {
            private $svg;
            constructor($svg: JQuery);
            private svgHelper;
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
        interface IHintArea {
            Staff: Model.IStaff;
            checkVoiceButtons(app: ScoreApplication.IScoreApplication, staff: Model.IStaff): void;
            release(): void;
        }
        interface IHintAreaCreator {
            addStaffButton(y: number, staff: Model.IStaff): IHintArea;
        }
        class HintAreaPlugin implements ScoreApplication.IScorePlugin, IHintAreaCreator {
            init(app: ScoreApplication.IScoreApplication): void;
            private container;
            getId(): string;
            addStaffButton(y: number, staff: Model.IStaff): IHintArea;
        }
        class SvgEditorManager {
            static activateVoiceSensors(voice: Model.IVoice, context: string, activate: boolean): void;
            static activateAllVoiceSensors(score: Model.IScore, context: string, activate: boolean): void;
        }
    }
    module Editors {
        class NoteDecorations {
            private static decorationKeyDefs;
            private static getDef(id);
            static getGlyph(id: Model.NoteDecorationKind, up: boolean): string;
            static getIdFromKey(key: string): Model.NoteDecorationKind;
        }
        class NoteEditor implements ScoreApplication.IScoreEventProcessor {
            context: string;
            constructor(context: string);
            init(app: ScoreApplication.IScoreApplication): void;
            exit(app: ScoreApplication.IScoreApplication): void;
            mouseOverStyle: string;
            private cursorElement;
            mouseovernote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mousemovenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutnote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mousemoveafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mousemovebeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverhead(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseouthead(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class KeyboardNoteEditor extends NoteEditor {
            keymessage(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            keyPressed(app: ScoreApplication.IScoreApplication, key: string): boolean;
        }
        class EditNoteEditor extends KeyboardNoteEditor {
            clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class InsertNoteEditor extends KeyboardNoteEditor {
            context: string;
            noteType: string;
            noteTime: Model.TimeSpan;
            rest: boolean;
            dots: number;
            constructor(context: string, noteType: string, noteTime: Model.TimeSpan, rest: boolean, dots: number);
            clickafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clickbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class EditNoteTextEditor extends NoteEditor {
            constructor();
            editor: HTMLInputElement;
            exit(app: ScoreApplication.IScoreApplication): void;
            getNoteText(note: Model.INote): string;
            private static getNoteRect(note);
            updateNoteText(note: Model.INote, text: string): void;
            private keyUp(event);
            private keyDown(event);
            clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class DeleteNoteEditor extends NoteEditor {
            clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clickhead(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class ChangeMeterEditor implements ScoreApplication.IScoreEventProcessor {
            context: string;
            constructor(context: string);
            init(app: ScoreApplication.IScoreApplication): void;
            exit(app: ScoreApplication.IScoreApplication): void;
            clickbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clickmeter(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseovermeter(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutmeter(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class ChangeKeyEditor implements ScoreApplication.IScoreEventProcessor {
            context: string;
            constructor(context: string);
            init(app: ScoreApplication.IScoreApplication): void;
            exit(app: ScoreApplication.IScoreApplication): void;
            clickbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clickkey(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverkey(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutkey(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
        class ChangeClefEditor implements ScoreApplication.IScoreEventProcessor {
            context: string;
            constructor(context: string);
            init(app: ScoreApplication.IScoreApplication): void;
            exit(app: ScoreApplication.IScoreApplication): void;
            clickbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clickclef(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoverclef(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            mouseoutclef(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
    }
    module CanvasView {
        class CanvasGraphicsEngine implements Views.IGraphicsEngine {
            private canvas;
            constructor(canvas: HTMLCanvasElement);
            private context;
            private setTranslation(x, y);
            setSize(width: number, height: number): void;
            beginDraw(): void;
            endDraw(): void;
            createMusicObject(id: string, item: string, x: number, y: number, scale: number): any;
            private drawPath(path, fillStyle, strokeStyle);
            createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id?: string): any;
            createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any;
            drawText(id: string, text: string, x: number, y: number, justify: string): any;
            beginGroup(id: string, x: number, y: number, scale: number, className: string): any;
            endGroup(group: any): void;
        }
        class CanvasViewer implements ScoreApplication.IScorePlugin {
            private $root;
            constructor($root: JQuery);
            private canvasHelper;
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
    }
}
