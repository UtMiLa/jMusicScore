import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-music-basics';

export interface IMusicElement {
    inviteEventVisitor(spacer: IEventVisitor, globalContext: IGlobalContext): void;
    //changed(): void;
    //moved(): void;/**/
    id: string;

    //parent: IMusicElement;
    //spacingInfo: ISpacingInfo;
    //setSpacingInfo(info: ISpacingInfo): void;
    inviteVisitor(spacer: IVisitor): void;
    getElementName(): string;
    debug(): string;
    remove(): void;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    visitAll(visitor: IVisitorIterator<IMusicElement>): void;
    getMemento(withChildren?: boolean): IMemento;
    //getAncestor<T extends IMusicElement>(elementName: string): T;
}

export interface IMusicContainer extends IMusicElement {
    addChild(theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void;
    removeChild(theChild: IMusicElement): void;
}

export interface IGlobalContext{ 
    getVariable(name: string): ISequence;
    addVariable(name: string, value: ISequence):void;
    getSpacingInfo<T extends ISpacingInfo>(element: IMusicElement): T;
    addSpacingInfo(element: IMusicElement, value: ISpacingInfo): void;
}


export interface ITimedEvent extends IMusicElement, IEventEnumerator {
    absTime: AbsoluteTime;
    getElementName(): string;
    debug(): string;
    getSortOrder: () => number;
    /* Ordering of objects when absTime is identical:
    0	Accolade
    10	StartBar
    20	Ambitus
    30	StartClef
    40	StartKey
    50	StartMeter
    60	ChangeClef
    70	Bar
    80	ChangeKey
    90	ChangeMeter
    95  GraceNotes ?
    99  StaffExpression
    100	Note
    */
    //spacingInfo: ISpacingInfo;
    getHorizPosition(): HorizPosition;
}

/**
 * Events that change some parameter - lasting until next change event
 * e.g. clef, meter, tempo marks, dynamic marks
 */
export interface ITimedChangeEvent extends ITimedEvent { 

}

/**
 * Events that begin at the time and lasts a fixed time
 * e.g. notes, sequences, bar lines
 */
export interface ITimedObjectEvent extends ITimedEvent {

}

/*export interface ITimedVoiceEvent extends ITimedEvent {
    getVoice(): IVoice;
    getStaff(): IStaff;
}*/

export interface IEventContainer {
    getEventsOld(globalContext: IGlobalContext): ITimedEvent[];
    //getEvents(globalContext: GlobalContext): IEventInfo[];
}

export interface IBar extends ITimedObjectEvent {
    //parent: IScore;
    absTime: AbsoluteTime;
    //spacingInfo: IBarSpacingInfo;
}



export interface IMeterOwner extends IMusicContainer {
    setMeter(meter: IMeterDefinition, absTime: AbsoluteTime): void;
    withMeters(f: (meter: IMeter, index: number) => void): void;
    meterElements: IMeter[];
}

export interface IScore extends IEventContainer, IMeterOwner {
    bars: IBar[];
    staffElements: IStaff[];
    title: string;
    composer: string;
    author: string;
    subTitle: string;
    metadata: {};
    globalContext: IGlobalContext;

    clear(): void;
    findBar(absTime: AbsoluteTime): IBar;
    getEventsOld(globalContext: IGlobalContext, ignoreStaves?: boolean): ITimedEvent[];
    getEvents(globalContext: IGlobalContext, ignoreStaves: boolean): IEventInfo[];
    withStaves(f: (staff: IStaff, index: number) => void, globalContext: IGlobalContext): void;
    withVoices(f: (voice: IVoice, index: number) => void, globalContext: IGlobalContext): void;
    withBars(f: (bar: IBar, index: number) => void): void;
    removeBars(f: (bar: IBar, index: number) => boolean): void;
    addStaff(clefDef: ClefDefinition): IStaff;
    setKey(key: IKeyDefinition, absTime: AbsoluteTime, globalContext: IGlobalContext): void;
}


export interface IStaff extends IEventContainer, IMeterOwner {
    parent: IScore;
    removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
    //spacingInfo: IStaffSpacingInfo;
    clefElements: IClef[];
    voiceElements: IVoice[];
    title: string;

    withVoices(f: (voice: IVoice, index: number) => void, globalContext: IGlobalContext): void;
    withKeys(f: (key: IKey, index: number) => void): void;
    //withMeters(f: (meter: IMeter, index: number) => void): void;
    withClefs(f: (clef: IClef, index: number) => void): void;
    withTimedEvents(f: (ev: ITimedEvent, index: number) => void): void;
    getStaffContext(absTime: AbsoluteTime): StaffContext;
    //getMeterElements(): IMeter[];
    getKeyElements(): IKey[];
    getEventsOld(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
    getEvents(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): IEventInfo[];
    addVoice(): IVoice;
    //setMeter(meter: MeterDefinition, absTime: AbsoluteTime): void;
    setClef(type: ClefDefinition, absTime: AbsoluteTime): void;
    setKey(key: IKeyDefinition, absTime: AbsoluteTime): void;
    setStaffExpression(type: string, absTime: AbsoluteTime): IStaffExpression;         
}


export interface IStaffExpression extends ITimedChangeEvent {
    //parent: IStaff;
    text: string;
}
export interface IStaffExpressionSpacingInfo extends ISpacingInfo { }

export interface IVoice extends IEventContainer, IMusicContainer {
    getNoteElements(globalContext: IGlobalContext): INote[];
    parent: IStaff;
    withNotes(globalContext: IGlobalContext, f: (note: INoteSource, context: INoteContext, index: number) => void): void;
    getStemDirection(): StemDirectionType;
    setStemDirection(dir: StemDirectionType): void;
    getEventsOld(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
    getEvents(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): IEventInfo[];
    getEndTime(globalContext: IGlobalContext): AbsoluteTime;
    removeChild(child: INote): void;
    getSequence(id: string): ISequence;
    addNote(globalContext: IGlobalContext, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote?: INote, insert?: boolean, dots?: number, tuplet?: TupletDef, segmentId?: string): ISequenceNote;
    addEvent(event: ITimedEvent): void;
}


export interface ISequence extends IEventContainer, IMusicContainer, IEventEnumerator, ITimedObjectEvent {
    noteElements: INote[];
    //parent: IVoice | ISequence;
    withNotes(globalContext: IGlobalContext, f: (note: INoteSource, context: INoteContext, index: number) => void): void;
    getStemDirection(): StemDirectionType;
    setStemDirection(dir: StemDirectionType): void;
    getEventsOld(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
    getEndTime(): AbsoluteTime;
    getNoteElements(globalContext: IGlobalContext): INote[];
    removeChild(child: INote): void;
    addEvent(event: ITimedEvent): void;
    addNote(globalContext: IGlobalContext, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote?: INote, insert?: boolean, dots?: number, tuplet?: TupletDef): ISequenceNote;
}


export interface IClef extends ITimedChangeEvent {
    //parent: IStaff;
    definition: ClefDefinition;            
    pitchToStaffLine(pitch: Pitch): number;
    staffLineToPitch(line: number): Pitch;
}
export interface IKey extends ITimedChangeEvent {
    //parent: IStaff;
    definition: IKeyDefinition;
    getFixedAlteration(pitch: number): string;
    getTonic(): PitchClass;
}

export interface IMeter extends ITimedChangeEvent {
    parent: IMusicElement;
    definition: IMeterDefinition;

    getMeasureTime(): TimeSpan;
    nextBoundary(abstime: AbsoluteTime): AbsoluteTime;
    nextBar(abstime: AbsoluteTime): AbsoluteTime;
}
export interface IBeam extends IMusicElement {
    parent: INote;
    toNote: INote;
    index: number;
    //spacingInfo: IBeamSpacingInfo;
    //setSpacingInfo(spacingInfo: IBeamSpacingInfo): void;
    inviteVisitor(spacer: IVisitor): void;
    remove(): void;
}

export interface INote extends IMusicContainer, ITimedObjectEvent { // todo: fjern ITimedEvent, IMusicContainer => IMusicElement
    NoteId: string;
    timeVal: TimeSpan;
    noteheadElements: INotehead[];
    decorationElements: INoteDecorationElement[];
    longDecorationElements: ILongDecorationElement[];
    syllableElements: ITextSyllableElement[];/**/
    tupletDef: TupletDef;
    dotNo: number;
    rest: boolean;
    graceType: string;
    
    Beams: IBeam[];

    //spacingInfo: INoteSpacingInfo;
    //setSpacingInfo(info: INoteSpacingInfo): INoteSpacingInfo;
    getContext(): INoteContext;

    withHeads(globalContext: IGlobalContext, f: (head: INotehead, index: number) => void): void;
    withDecorations(globalContext: IGlobalContext, f: (deco: INoteDecorationElement, index: number) => void): void;
    withLongDecorations(globalContext: IGlobalContext, f: (deco: ILongDecorationElement, index: number) => void): void;
    withSyllables(globalContext: IGlobalContext, f: (syll: ITextSyllableElement, index: number) => void): void;


    getBeamspan(): number[];
    setBeamspan(beamspan: number[]): void;
    
    setDots(no: number): void;

    matchesOnePitch(pitch: Pitch, ignoreAlteration: boolean): boolean;
    matchesPitch(pitch: Pitch, ignoreAlteration: boolean): boolean;

    setPitch(pitch: Pitch): INotehead;
    getTimeVal(): TimeSpan;

    setRest(newRest: boolean): void;
    getStemDirection(): StemDirectionType;
    setStemDirection(dir: StemDirectionType): void;
    getPrev(globalContext: IGlobalContext): INote;
    getNext(globalContext: IGlobalContext): INote;
    getInfo(): INoteInfo;
}



export interface INoteSource  extends INote, ITimedObjectEvent {
}
export interface INoteHeadInfo {
    source: INotehead;
    pitch: Pitch;
    //visit(visitor: IEventVisitor): void;
    id: string;
}
export interface INoteDecoInfo<T> {
    source: T;
    id: string;
    //visit(visitor: IEventVisitor): void;
}


export interface IEventInfo {
    id: string;
    relTime: TimeSpan;
    source: IMusicElement;
    getTimeVal(): TimeSpan;
    visit(visitor: IEventVisitor): void;
}

export interface IKeyEventInfo extends IEventInfo { source: IKey; }
export interface IClefEventInfo extends IEventInfo {source: IClef; }
export interface IMeterEventInfo extends IEventInfo { source: IMeter;}
export interface IBarEventInfo extends IEventInfo { source: IBar;}
export interface IBeamEventInfo extends IEventInfo { source: IBeam; }
export interface INoteDecorationEventInfo extends IEventInfo {source: INoteDecorationElement; }
export interface ILongDecorationEventInfo extends IEventInfo { source: ILongDecorationElement; }
export interface IStaffExpressionEventInfo extends IEventInfo { source: IStaffExpression; }
export interface ITextSyllableEventInfo extends IEventInfo { source: ITextSyllableElement; }

/**INoteInfo: nodens indhold, som kan være transformeret. Hver instans af en node, der gentages af en transformation eller variabel, har ét INoteInfo-objekt. 
 *      Id er konkateneret af variables og NoteElement's Id. NoteSpacingInfo og AbsTime er knyttet til denne. 
 *      Holder en reference til NoteElement (nødvendigt?)
 *      Linker til foregående og næste node og Voice.
 *      Hver Sequence og variabel kopierer INoteInfo (og transformerer evt.). */
export interface INoteInfo extends IEventInfo {
    source: INote;
    heads: INoteHeadInfo[];
    decorations: INoteDecoInfo<INoteDecorationElement>[];
    longDecorations: INoteDecoInfo<ILongDecorationElement>[];
    syllables: INoteDecoInfo<ITextSyllableElement>[];
}

export interface IEventEnumerator {
    getEvents(globalContext: IGlobalContext): IEventInfo[];
    //visitEvents(globalContext: IGlobalContext, f: (visitor: IEventVisitor) => void): void;
}
export interface INoteContext extends INote,  ITimedObjectEvent {
    //spacingInfo: INoteSpacingInfo;
    getStaffContext(): StaffContext;
    voice: IVoice;
}


export interface IVoiceNote extends INote {
    parent: IVoice;
    getVoice(): IVoice;
    getStaff(): IStaff;
}

export interface ISequenceNote extends INote {
    parent: ISequence;
}
export interface INotehead extends IMusicElement {
    parent: INote;
    pitch: Pitch;
    //dotNo: number;
    tie: boolean;
    tieForced: boolean;
    forceAccidental: boolean;
    showAccidental: boolean;
    getPitch(): Pitch;
    getAccidental(): string;
    matchesPitch(pitch: Pitch, ignoreAlteration?: boolean): boolean;
    getInfo(): INoteHeadInfo;
    //spacingInfo: INoteHeadSpacingInfo;
}

export interface INoteDecorationElement extends IMusicElement {
    parent: INote;
    placement: string;
    getDecorationId(): NoteDecorationKind;
    getInfo(): INoteDecoInfo<INoteDecorationElement>;
}

export interface INoteFinder{
    nextNote(note: INote): INote;
}

/** Long note decoration interface, e.g. hairpin, trill extension and slur */
export interface ILongDecorationElement extends IMusicElement {
    parent: INote;
    placement: string;
    //spacingInfo: ILongDecorationSpacingInfo;
    getEndEvent(noteFinder: INoteFinder): ITimedEvent;
    type: LongDecorationType;
    getInfo(): INoteDecoInfo<ILongDecorationElement>;
}
export interface ITextSyllableElement extends IMusicElement {
    placement: string;
    Text: string;
    parent: INote;
    getInfo(): INoteDecoInfo<ITextSyllableElement>;
}

export interface IVisitor {
    visitNoteHead(head: INotehead): void;
    visitNote(note: INoteSource): void;
    visitNoteDecoration(deco: INoteDecorationElement): void;
    visitLongDecoration(deco: ILongDecorationElement): void;
    visitVoice(voice: IVoice): void;
    visitClef(clef: IClef): void;
    visitMeter(meter: IMeter): void;
    visitKey(key: IKey,): void;
    visitStaff(staff: IStaff): void;
    visitScore(score: IScore): void;
    visitTextSyllable(text: ITextSyllableElement): void;
    visitBar(bar: IBar): void;
    visitBeam(beam: IBeam): void;
    visitStaffExpression(staffExpression: IStaffExpression): void;

    visitDefault(element: IMusicElement): void;

    visitVariable(name: string): void;
}

export interface IEventVisitor {
    visitNoteHeadInfo(head: INoteHeadInfo): void;
    visitNoteInfo(note: INoteInfo): void;
    visitNoteDecorationInfo(deco: INoteDecorationEventInfo): void;
    visitLongDecorationInfo(deco: ILongDecorationEventInfo): void;
    visitTextSyllableInfo(text: ITextSyllableEventInfo): void;
    visitBeamInfo(beam: IBeamEventInfo): void;

    visitBarInfo(bar: IBarEventInfo): void;
    visitClefInfo(clef: IClefEventInfo): void;
    visitMeterInfo(meter: IMeterEventInfo): void;
    visitKeyInfo(key: IKeyEventInfo): void;
    visitStaffExpressionInfo(staffExpression: IStaffExpressionEventInfo): void;

    visitSequence(sequence: ISequence, globalContext: IGlobalContext): void;
    visitVoice(voice: IVoice): void;
    visitStaff(staff: IStaff): void;
    visitScore(score: IScore): void;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface ISpacingInfo {
    /// Center x,y - like center of notehead or clef
    offset: IPoint;
    width: number;
    height: number;
    left: number;
    top: number;
    scale: number;
    preWidth: number;
    //InviteVisitor(spacer: Model.IVisitor): void;
}

export interface INoteHeadSpacingInfo extends ISpacingInfo {
    accidentalX: number;
    dots: IPoint;
    dotWidth: number;
    displacement: boolean;
    displace: IPoint;
    headGlyph: string;
    reversed: boolean;
    tieStart: IPoint;
    tieEnd: IPoint;
    tieDir: number;
    graceScale: number;
    accidentalStep: number;
}
export interface IBeamSpacingInfo extends ISpacingInfo {
    start: IPoint;
    end: IPoint;
    beamDist: number;
    beamCount: number;
}
export class LedgerLineSpacingInfo {
    constructor(public xStart: number, public xEnd: number, public y: number) { }
}
export interface INoteSpacingInfo extends ISpacingInfo {
    dots: IPoint;
    rev: boolean;
    flagNo: number;
    ledgerLinesUnder: LedgerLineSpacingInfo[];
    ledgerLinesOver: LedgerLineSpacingInfo[];
    //lowPitch: Model.Pitch;
    //highPitch: Model.Pitch;
    highPitchY: number;
    lowPitchY: number;
    graceScale: number;
    stemX: number;
    stemTipY: number;
    stemRootY: number;
    stemLength: number;
    dotWidth: number;
    restGlyph: string;
    flagDisplacement: IPoint;
}

export interface INoteDecorationSpacingInfo extends ISpacingInfo {
    //endpoint: Model.Point;
}
export interface ILongDecorationSpacingInfo extends ISpacingInfo {
    //endpoint: Model.Point;
    noteY: number;
    noteheadY: number;
    distX: number;
    endNoteY: number;
    endNoteheadY: number;
    //Render?: (deco: ILongDecorationElement, ge: Views.IGraphicsEngine) => void;
    //CalcSpacing?: (deco: ILongDecorationElement) => void;
}
export interface IVoiceSpacingInfo extends ISpacingInfo { }
export interface IClefSpacingInfo extends ISpacingInfo {
    clefId: string;
}
export interface IMeterSpacingInfo extends ISpacingInfo { }
export interface IKeySpacingInfo extends ISpacingInfo { }
export interface IStaffSpacingInfo extends ISpacingInfo {
    staffLength: number;
    staffSpace: number;
}
export interface IBarSpacingInfo extends ISpacingInfo {
    barStyle: string;
    end: IPoint;
    extraXOffset: number;
}
export interface IScoreSpacingInfo extends ISpacingInfo { }
export interface ITextSyllableSpacingInfo extends ISpacingInfo { }

export interface IMusicElementCreator { createFromMemento: (parent: any, memento: any, globalContext: IGlobalContext) => IMusicElement }

