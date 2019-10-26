import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-music-basics';

/**
 * Music element - abstract element in the score composition structure
 */
export interface IMusicElement {
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
    visitAll(visitorIterator: IVisitorIterator<IMusicElement>): void;
    getMemento(withChildren?: boolean): IMemento;
    //getAncestor<T extends IMusicElement>(elementName: string): T;
}

/**
 * Music container - music element with child elements
 */
export interface IMusicContainer extends IMusicElement, IEventVisitorTarget  {
    addChild(theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void;
    removeChild(theChild: IMusicElement): void;
    getEvents(globalContext: IGlobalContext): IEventInfo[];
}

/**
 * Global context - storing variables and cached [[ISpacingInfo]] objects
 */
export interface IGlobalContext{ 
    getVariable(name: string): ISequence;
    addVariable(name: string, value: ISequence):void;
    getSpacingInfo<T extends ISpacingInfo>(element: {id: string}): T;
    addSpacingInfo(element: {id: string}, value: ISpacingInfo): void;
}


/**
 * Timed music elements like notes, bars, score expressions, key changes
 */
export interface ITimedEvent extends IMusicElement, IEventEnumerator {
    absTime: AbsoluteTime;
    getElementName(): string;
    debug(): string;
    /**  Ordering of objects when absTime is identical:
   - 0	Accolade
   - 10	StartBar
   - 20	Ambitus
   - 30	StartClef
   - 40	StartKey
   - 50	StartMeter
   - 60	ChangeClef
   - 70	Bar
   - 80	ChangeKey
   - 90	ChangeMeter
   - 95  GraceNotes ?
   - 99  StaffExpression
   - 100	Note
    */
    getSortOrder: () => number;
    getHorizPosition(): HorizPosition;
    getEvents(globalContext: IGlobalContext): IEventInfo[];
}

/**
 * Events that change some parameter - lasting until next change event of the same kind
 * e.g. clef, meter, tempo marks, dynamic marks
 */
export interface ITimedChangeEvent extends ITimedEvent { 

}

/**
 * Events that begin at the time and lasts a fixed time
 * e.g. notes, rests, sequences, bar lines
 */
export interface ITimedObjectEvent extends ITimedEvent {

}

/**
 * Event container - stream of [[ITimedEvent]] events
 */
export interface IEventContainer {
    getEventsOld(globalContext: IGlobalContext): ITimedEvent[];
    //getEvents(globalContext: GlobalContext): IEventInfo[];
    withEvents(f: (event: IEventInfo, index: number) => void, globalContext: IGlobalContext): void;
    withOwnMeters(f: (meter: IMeter, index: number) => void): void;
    withOwnClefs(f: (clef: IClef, index: number) => void): void;
    withOwnKeys(f: (key: IKey, index: number) => void): void;
    withAllMeters(f: (meter: IMeterEventInfo, index: number) => void, globalContext: IGlobalContext): void;
    withAllClefs(f: (clef: IClefEventInfo, index: number) => void, globalContext: IGlobalContext): void;
    withAllKeys(f: (key: IKeyEventInfo, index: number) => void, globalContext: IGlobalContext): void;
}

/**
 * Abstract bar object
 */
export interface IBar extends ITimedObjectEvent {
    //parent: IScore;
    absTime: AbsoluteTime;
    //spacingInfo: IBarSpacingInfo;
    // todo: kind (double bar etc)
}



/**
 * Interface to elements that can own a time change, like score and staff
 */
export interface IMeterOwner extends IMusicContainer {
    setMeter(meter: IMeterDefinition, absTime: AbsoluteTime, globalContext: IGlobalContext): void;
    //withMeters(f: (meter: IMeterEventInfo, index: number) => void, globalContext: IGlobalContext): void;
    //getMeterElements(globalContext: IGlobalContext): IMeterEventInfo[];
}

/**
 * Abstract score object
 */
export interface IScore extends IEventContainer, IMeterOwner {
    getMeterElements(globalContext: IGlobalContext): IMeterEventInfo[];
    bars: IBar[];
    staffElements: IStaff[];
    title: string;
    composer: string;
    author: string;
    subTitle: string;
    metadata: {};
    globalContext: IGlobalContext;
    meterElements: IMeter[];

    clear(): void;
    findBar(absTime: AbsoluteTime): IBar;
    getEventsOld(globalContext: IGlobalContext, ignoreStaves?: boolean): ITimedEvent[];
    //getEvents(globalContext: IGlobalContext, ignoreStaves: boolean): IEventInfo[];
    withStaves(f: (staff: IStaff, index: number) => void, globalContext: IGlobalContext): void;
    withVoices(f: (voice: IVoice, index: number) => void, globalContext: IGlobalContext): void;
    withBars(f: (bar: IBar, index: number) => void): void;
    removeBars(f: (bar: IBar, index: number) => boolean): void;
    addStaff(clefDef: ClefDefinition): IStaff;
    setKey(key: IKeyDefinition, absTime: AbsoluteTime, globalContext: IGlobalContext): void;
}


/**
 * Abstract staff object
 */
export interface IStaff extends IEventContainer, IMeterOwner {
    getMeterElements(globalContext: IGlobalContext): IMeterEventInfo[];
    parent: IScore;
    removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
    //spacingInfo: IStaffSpacingInfo;
    clefElements: IClef[];
    voiceElements: IVoice[];
    title: string;

    withVoices(f: (voice: IVoice, index: number) => void, globalContext: IGlobalContext): void;
    //withKeys(f: (key: IKeyEventInfo, index: number) => void): void;
    //withMeters(f: (meter: IMeter, index: number) => void): void;
    //withClefs(f: (clef: IClefEventInfo, index: number) => void): void;
    withTimedEvents(f: (ev: ITimedEvent, index: number) => void): void;
    getStaffContext(absTime: AbsoluteTime, globalContext: IGlobalContext): StaffContext;
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


/**
 * Abstract staff expression object (tempo marks etc)
 */
export interface IStaffExpression extends ITimedChangeEvent {
    //parent: IStaff;
    text: string;
}
/**
 * Spacing info for staff expressions
 */
export interface IStaffExpressionSpacingInfo extends ISpacingInfo { }

/**
 * Abstract voice element
 */
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


/**
 * Abstract sequence of events. Can contain music events, variables, other sequences
 */
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


/**
 * Abstract clef change element
 */
export interface IClef extends ITimedChangeEvent {
    //parent: IStaff;
    definition: ClefDefinition;
    getEvents(globalContext: IGlobalContext): IClefEventInfo[];
    pitchToStaffLine(pitch: Pitch): number;
    staffLineToPitch(line: number): Pitch;
}
/**
 * Abstract key change element
 */
export interface IKey extends ITimedChangeEvent {
    //parent: IStaff;
    definition: IKeyDefinition;
    getEvents(globalContext: IGlobalContext): IKeyEventInfo[];
    getFixedAlteration(pitch: number): string;
    getTonic(): PitchClass;
}

/**
 * Abstract time change element
 */
export interface IMeter extends ITimedChangeEvent {
    parent: IMusicElement;
    definition: IMeterDefinition;

    getEvents(globalContext: IGlobalContext): IMeterEventInfo[];
    getMeasureTime(): TimeSpan;
    nextBoundary(abstime: AbsoluteTime): AbsoluteTime;
    nextBar(abstime: AbsoluteTime): AbsoluteTime;
}
/**
 * Beam information element
 */
export interface IBeam extends IMusicElement, IBeamEventInfo {
    parent: INote;
    fromNote: INoteInfo;
    toNote: INoteInfo;
    index: number;
    //spacingInfo: IBeamSpacingInfo;
    //setSpacingInfo(spacingInfo: IBeamSpacingInfo): void;
    inviteVisitor(spacer: IVisitor): void;
    remove(): void;
}

/**
 * abstract note element
 */
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
    //getContext(): INoteContext;

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



/**
 * note source - ???
 */
export interface INoteSource  extends INote, ITimedObjectEvent {
}

/*export interface INoteDecoInfo<T> {
    source: T;
    id: string;
    //visit(visitor: IEventVisitor): void;
}*/


/**
 * Event info base interface.
 * 
 * The methods getEvents return events of this type. Variables, transformation have been applied to the data.
 */
export interface IEventInfo extends IEventVisitorTarget {
    getHorizPosition(): HorizPosition;
    id: string;
    relTime: TimeSpan;
    source: IMusicElement;
    getElementName(): string;
    getTimeVal(): TimeSpan;
    visitAllEvents(visitorIterator: IVisitorIterator<IEventVisitorTarget>): void;
    inviteEventVisitor(visitor: IEventVisitor): void;
    clone(addId: string): IEventInfo;
    voice: IVoice;
}
/**
 * notehead event info
 */
export interface INoteHeadInfo extends IEventInfo {
    tie: any;
    getAccidental(): string;
    getPitch(): Pitch;
    source: INotehead;
    pitch: Pitch;
    //visit(visitor: IEventVisitor): void;
    id: string;
    inviteEventVisitor(visitor: IEventVisitor): void;
    visitAllEvents(visitorIterator: IVisitorIterator<IEventVisitorTarget>): void;
    clone(addId: string): INoteHeadInfo;
}
/**
 * key event info
 */
export interface IKeyEventInfo extends IEventInfo { source: IKey; }
/**
 * clef event info
 */
export interface IClefEventInfo extends IEventInfo {source: IClef; }
/**
 * meter event info
 */
export interface IMeterEventInfo extends IEventInfo {
    nextBar(barTime: AbsoluteTime): AbsoluteTime;
    getMeasureTime(): TimeSpan;
    definition: IMeterDefinition;
    absTime: AbsoluteTime; source: IMeter;}
/**
 * bar event info
 */
export interface IBarEventInfo extends IEventInfo { source: IBar;}
/**
 * beam event info
 */
export interface IBeamEventInfo extends IEventInfo {
    toNote: INoteInfo;
    index: number; source: IBeam; }
/**
 * note decoration event info
 */
export interface INoteDecorationEventInfo extends IEventInfo {
    source: INoteDecorationElement; 
    clone(addId: string): INoteDecorationEventInfo;
}
/**
 * long decoration event info
 */
export interface ILongDecorationEventInfo extends IEventInfo { 
    source: ILongDecorationElement; 
    clone(addId: string): ILongDecorationEventInfo;
}
/**
 * staff expression event info
 */
export interface IStaffExpressionEventInfo extends IEventInfo { source: IStaffExpression; }
/**
 * Lyric syllable event info
 */
export interface ITextSyllableEventInfo extends IEventInfo { 
    source: ITextSyllableElement; 
    clone(addId: string): ITextSyllableEventInfo;
}

/** Note Event info
 * 
 * INoteInfo: nodens indhold, som kan være transformeret. Hver instans af en node, der gentages af en transformation eller variabel, har ét INoteInfo-objekt. 
 *      Id er konkateneret af variables og NoteElement's Id. NoteSpacingInfo og AbsTime er knyttet til denne. 
 *      Holder en reference til NoteElement (nødvendigt?)
 *      Linker til foregående og næste node og Voice.
 *      Hver Sequence og variabel kopierer INoteInfo (og transformerer evt.). */
export interface INoteInfo extends IEventInfo {
    setBeamspan(beamspan: number[]): any;
    dotNo: number;
    NoteId: string;
    Beams: IBeam[];
    graceType: string;
    timeVal: TimeSpan;
    getBeamspan(): number[];
    getStemDirection(): StemDirectionType
    rest: boolean;
    source: INote;
    heads: INoteHeadInfo[];
    decorations: INoteDecorationEventInfo[];
    longDecorations: ILongDecorationEventInfo[];
    syllables: ITextSyllableEventInfo[];
}

/**
 * Interface for objects who can enumerate [[IEventInfo]] events
 */
export interface IEventEnumerator {
    getEvents(globalContext: IGlobalContext): IEventInfo[];
    //visitEvents(globalContext: IGlobalContext, f: (visitor: IEventVisitor) => void): void;
}
/**
 * Inote context - deprecated?
 */
export interface INoteContext extends /*INote,*/  ITimedObjectEvent {
    //spacingInfo: INoteSpacingInfo;
    getStaffContext(globalContext: IGlobalContext): StaffContext;
    voice: IVoice;

    /*id: string;
    absTime: AbsoluteTime;*/
    decorationElements: INoteDecorationElement[];
    getStemDirection(): StemDirectionType;
}


/**
 * note in a voice - deprecated ???
 */
export interface IVoiceNote extends INote {
    parent: IVoice;
    getVoice(): IVoice;
    getStaff(): IStaff;
}

/**
 * Note in a sequence - deprecated ???
 */
export interface ISequenceNote extends INote {
    parent: ISequence;
}
/**
 * Abstract notehead element
 */
export interface INotehead extends IMusicElement {
    parent: INote;
    pitch: Pitch;
    tie: boolean;
    tieForced: boolean;
    forceAccidental: boolean;
    showAccidental: boolean;
    getPitch(): Pitch;
    getAccidental(): string;
    matchesPitch(pitch: Pitch, ignoreAlteration?: boolean): boolean;
    getInfo(): INoteHeadInfo;
}

/**
 * Abstract note decoration element
 */
export interface INoteDecorationElement extends IMusicElement {
    parent: INote;
    placement: string;
    getDecorationId(): NoteDecorationKind;
    getInfo(): INoteDecorationEventInfo;
}

/**
 * Objects that can find next note (used by long decorations) - deprecated???
 */
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
    getInfo(): ILongDecorationEventInfo;
}
/**
 * Abstract syllable element - lyrics assigned to note
 */
export interface ITextSyllableElement extends IMusicElement {
    placement: string;
    Text: string;
    parent: INote;
    getInfo(): ITextSyllableEventInfo;
}

/**
 * Abstract visitor to the model object structure
 * 
 * The actual notes, variable refs etc are visited, not the transformed values.
 */
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

/**
 * Abstract visitor to the model logical structure
 * 
 * Transformations and variable evaluations are applied
 */
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

/**
 * Target for event visitors
 */
export interface IEventVisitorTarget { // både IEvent og IMusicContainer skal understøtte denne - og Sequence skal sende videre til events
    visitAllEvents(visitorIterator: IVisitorIterator<IEventVisitorTarget>, globalContext: IGlobalContext): void;
    inviteEventVisitor(visitor: IEventVisitor, globalContext: IGlobalContext): void;
    getElementName(): string;
    id: string;
}

/************************** Geometry and metrics **********************************/

/**
 * Geometric point
 */
export interface IPoint {
    x: number;
    y: number;
}

/**
 * Abstract spacing info
 */
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

/**
 * note head spacing info
 */
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
/**
 * beam spacing info
 */
export interface IBeamSpacingInfo extends ISpacingInfo {
    start: IPoint;
    end: IPoint;
    beamDist: number;
    beamCount: number;
}
/**
 * Ledger line spacing info
 */
export class LedgerLineSpacingInfo {
    constructor(public xStart: number, public xEnd: number, public y: number) { }
}
/**
 * note spacing info
 */
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

/**
 * note decoration spacing info
 */
export interface INoteDecorationSpacingInfo extends ISpacingInfo {
    //endpoint: Model.Point;
}
/**
 * long decoration spacing info
 */
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
/**
 * voice spacing info
 */
export interface IVoiceSpacingInfo extends ISpacingInfo { }
/**
 * clef spacing info
 */
export interface IClefSpacingInfo extends ISpacingInfo {
    clefId: string;
}
/**
 * meter spacing info
 */
export interface IMeterSpacingInfo extends ISpacingInfo { }
/**
 * key spacing info
 */
export interface IKeySpacingInfo extends ISpacingInfo { }
/**
 * staff spacing info
 */
export interface IStaffSpacingInfo extends ISpacingInfo {
    staffLength: number;
    staffSpace: number;
}
/**
 * bar spacing info
 */
export interface IBarSpacingInfo extends ISpacingInfo {
    barStyle: string;
    end: IPoint;
    extraXOffset: number;
}
/**
 * score spacing info
 */
export interface IScoreSpacingInfo extends ISpacingInfo { }
/**
 * text syllable spacing info
 */
export interface ITextSyllableSpacingInfo extends ISpacingInfo { }

/**
 * music element creator
 * 
 * Factory that can create music elements from mementos
 */
export interface IMusicElementCreator { createFromMemento: (parent: any, memento: any, globalContext: IGlobalContext) => IMusicElement }

