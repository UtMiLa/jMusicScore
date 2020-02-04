import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-music-basics';
// import { BasePrivateKeyEncodingOptions } from 'crypto';


/**
 * Timed music elements like notes, bars, score expressions, key changes
 */
export interface ITimedEvent {
    absTime?: AbsoluteTime;
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
    events: ITimedEvent[];
}


export enum BarKind {single, dotted, double, endBar, repeatStart, repeatEnd, repeatEndStart}

/**
 * Abstract bar object
 */
export interface IBar extends ITimedObjectEvent {
    absTime: AbsoluteTime;
    kind: BarKind;
}



/**
 * Interface to elements that can own a time change, like score and staff
 */
export interface IMeterOwner {
    meterChanges?: IMeter[]
}




/**
 * Abstract project object
 */
export interface IProject {
    title?: string;
    composer?: string;
    author?: string;
    subTitle?: string;
    metadata?: {};
    score: IScore;
    variables: { [name: string]: ISequence };
}



/**
 * Abstract score object
 */
export interface IScore {
    title?: string;
    composer?: string;
    author?: string;
    subTitle?: string;
    metadata?: {};
    sections: ISection[];
}

export interface ISection extends IMeterOwner {
    bars?: IBar[];
    staves: IStaff[];
    title?: string;
    keyChanges?: IKey[];
}


/**
 * Abstract staff object
 */
export interface IStaff extends IMeterOwner {
    clefChanges?: IClef[];
    keyChanges?: IKey[];
    staffExpressions?: IStaffExpression[];
    voices: IVoice[];
    title?: string;

}


/**
 * Abstract staff expression object (tempo marks etc)
 */
export interface IStaffExpression extends ITimedChangeEvent {
    //parent: IStaff;
    text: string;
}

/**
 * Abstract voice element
 */
export interface IVoice  {
    stemDirection?: StemDirectionType;
    sequences: ISequence[];
}


/**
 * Abstract sequence of events. Can contain music events, variables, other sequences
 */
export interface ISequence extends IEventContainer, ITimedObjectEvent {
}


/**
 * Collection of sequences of events.
 */
export interface ISnippet {
    sequences: ISequence[];
}

/**
 * Abstract clef change element
 */
export interface IClef extends ITimedChangeEvent {
    definition: ClefDefinition;
}

/**
 * Abstract key change element
 */
export interface IKey extends ITimedChangeEvent {
    definition: IKeyDefinition;
}

/**
 * Abstract time change element
 */
export interface IMeter extends ITimedChangeEvent {
    definition: IMeterDefinition;
}

/**
 * Beam information element
 */
export interface IBeam {
    length: TimeSpan;
    index: number;
}

export enum GraceType {none, slashed, unslashed}

/**
 * abstract note element
 */
export interface INote extends ITimedObjectEvent { // todo: fjern ITimedEvent, IMusicContainer => IMusicElement
    noteGlyph: TimeSpan;
    timeVal: TimeSpan;
    noteheads?: INotehead[];
    decorations?: INoteDecorationElement[];
    longDecorations?: ILongDecorationElement[];
    syllables?: ITextSyllableElement[];/**/
    tupletDef?: TupletDef;
    dots?: number;
    rest?: boolean;
    graceType?: GraceType;    
    beams?: IBeam[];
    stemDirection?: StemDirectionType;    
}


/**
 * Abstract notehead element
 */
export interface INotehead {
    pitch: Pitch;
    tie?: boolean;
    tieForced?: boolean;
    forceAccidental?: boolean;
    showAccidental?: boolean;
}

/**
 * Abstract note decoration element
 */
export interface INoteDecorationElement {
    placement: string;
    decorationId: NoteDecorationKind;
}


/** Long note decoration interface, e.g. hairpin, trill extension and slur */
export interface ILongDecorationElement {
    placement: string;
    length: TimeSpan;
    type: LongDecorationType;    
}

/**
 * Abstract syllable element - lyrics assigned to note
 */
export interface ITextSyllableElement {
    placement: number;
    text: string;
}


