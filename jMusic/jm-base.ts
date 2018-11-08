/* Basic Music definitions and helper classes */


/**
* Rational number numerator/denominator; numerator and denominator must be integers
*/
export class Rational {
    constructor(public numerator: number, public denominator: number = 1) {
        if (denominator < 0) {
            throw "Illegal denominator: " + this.toString();
        }
    }

    static gcd(a: number, b: number): number {
        if (b === 0) return a;
        return this.gcd(b, a % b);
    }

    public toNumber() {
        return this.numerator / this.denominator;
    }

    public toString() {
        return this.numerator + "/" + this.denominator;
    }

    public reduce(): Rational {
        if (this.denominator < 0) {
            this.denominator = -this.denominator;
            this.numerator = -this.numerator;
        }
        if (this.numerator) {
            var gcd = Rational.gcd(this.numerator, this.denominator);
            gcd = Math.abs(gcd);
            this.numerator /= gcd;
            this.denominator /= gcd;
        }
        else {
            this.denominator = 1;
        }
        return this;
    }

    public eq(other: Rational) {
        return this.denominator * other.numerator === this.numerator * other.denominator;
    }

    public gt(other: Rational) {
        return this.numerator * other.denominator > this.denominator * other.numerator;
    }
    public ge(other: Rational) {
        return this.numerator * other.denominator >= this.denominator * other.numerator;
    }

    static createFromMemento(def: any): Rational {
        return new Rational(def.num, def.den);
    }

    public getMemento(): any {
        return { num: this.numerator, den: this.denominator };
    }

}

/**
    * Absolute time from start of piece - is a rational number
    */
export class AbsoluteTime extends Rational {
    static startTime = new AbsoluteTime(0);
    static infinity = new AbsoluteTime(1, 0);

    public diff(other: AbsoluteTime): TimeSpan {
        return new TimeSpan(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public sub(other: TimeSpan): AbsoluteTime {
        return new AbsoluteTime(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public add(other: TimeSpan): AbsoluteTime {
        return new AbsoluteTime(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public reduce(): AbsoluteTime {
        return <AbsoluteTime>super.reduce();
    }
    static createFromMemento(def: any): AbsoluteTime {
        return new AbsoluteTime(def.num, def.den);
    }
}

/**
    * Relative time - difference between two absolute times. Is a rational number.
    */
export class TimeSpan extends Rational {
    static quarterNote = new TimeSpan(1, 4);
    static eighthNote = new TimeSpan(1, 8);
    static halfNote = new TimeSpan(1, 2);
    static wholeNote = new TimeSpan(1, 1);
    static infiniteNote = new TimeSpan(1, 0);
    static noTime = new TimeSpan(0, 1);

    public sub(other: TimeSpan): TimeSpan {
        return new TimeSpan(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public add(other: TimeSpan): TimeSpan {
        return new TimeSpan(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public reduce(): TimeSpan {
        return <TimeSpan>super.reduce();
    }
    public divide(other: TimeSpan): number {
        return (this.numerator * other.denominator) / (this.denominator * other.numerator);
    }
    public modulo(other: TimeSpan): TimeSpan {
        var x = this.numerator * other.denominator;
        var y = this.denominator * other.numerator;
        if (x < 0) {
            x += Math.ceil(-x / y) * y;
        }
        return new TimeSpan(x % y, this.denominator * other.denominator).reduce();
    }
    public divideScalar(scalar: number): TimeSpan {
        return new TimeSpan(this.numerator, this.denominator * scalar).reduce();
    }
    public multiplyScalar(scalar: number): TimeSpan {
        return new TimeSpan(scalar * this.numerator, this.denominator).reduce();
    }
    public multiplyRational(fraction: Rational): TimeSpan {
        return new TimeSpan(fraction.numerator * this.numerator, fraction.denominator * this.denominator).reduce();
    }
    static createFromMemento(def: any): TimeSpan {
        return new TimeSpan(def.num, def.den);
    }
}

/**
    * Sort order for timed events - elements at same time are sorted according to sort order. Multiple grace notes are sorted according to graceNo.
    */
export class HorizPosition {
    constructor(public absTime: AbsoluteTime, public sortOrder: number, public graceNo: number = 0, public beforeAfter = 0) { }
    
    public static compareEvents(a: HorizPosition, b: HorizPosition): number {
        if (!a.absTime.eq(b.absTime)) return (a.absTime.diff(b.absTime).toNumber());
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.graceNo - b.graceNo;
    }
    public eq(comp: HorizPosition): boolean {
        return this.absTime.eq(comp.absTime) && this.sortOrder === comp.sortOrder && this.graceNo === comp.graceNo;
    }
    public clone(beforeAfter: number): HorizPosition {
        return new HorizPosition(this.absTime, this.sortOrder, this.graceNo, beforeAfter);
    }
}

/**
    * Visitor for an object structure
    */
export interface IVisitorIterator<Type> {
    visitPre(element: Type): (element: Type) => void;
}

/**
    * Generic memento for serializing objects
    */
export interface IMemento {
    id: string;
    t: string;
    def: any;
    children?: IMemento[];
}

/**
    * Context at a given point in a score: current clef, key, meter, bar number and time in current bar.
    */
export class StaffContext {
    constructor(public clef: ClefDefinition, public key: IKeyDefinition, public meter: IMeterDefinition, public meterTime: AbsoluteTime, public barNo: number, public timeInBar: TimeSpan) {
    }

    public equals(staffContext: StaffContext): boolean {
        return this.clef.eq(staffContext.clef)
            && this.key.eq(staffContext.key)
            && this.meter.eq(staffContext.meter)
            && this.meterTime.eq(staffContext.meterTime)
            && this.barNo === staffContext.barNo && this.timeInBar.eq(staffContext.timeInBar);
    }
}

/**
    * Clef types (excluding different placements)
    */
export enum ClefType { ClefNone, ClefG, ClefC, ClefF, ClefPercussion, ClefTab };

/**
    * Clef definition: clef type, placement and transposition
    */
export class ClefDefinition {
    constructor(public clefCode: ClefType, public clefLine: number, public transposition: number = 0) { // clefline: top line is 1
    }

    static clefG = new ClefDefinition(ClefType.ClefG, 4);
    static clefGTenor = new ClefDefinition(ClefType.ClefG, 4, -7);
    static clefF = new ClefDefinition(ClefType.ClefF, 2);
    static clefCAlto = new ClefDefinition(ClefType.ClefC, 3);
    static clefPerc = new ClefDefinition(ClefType.ClefPercussion, 0);

    public clefDef(): number {
        switch (this.clefCode) {
            case ClefType.ClefG: return 2;
            case ClefType.ClefC: return -2;
            case ClefType.ClefF: return -6;
            case ClefType.ClefNone: return -2;
            case ClefType.ClefPercussion: return -2;
            case ClefType.ClefTab: return -2;
        }
    }

    public clefName(): string {
        switch (this.clefCode) {
            case ClefType.ClefG: return "g";
            case ClefType.ClefC: return "c";
            case ClefType.ClefF: return "f";
            case ClefType.ClefNone: return "n";
            case ClefType.ClefPercussion: return "p";
            case ClefType.ClefTab: return "t";
        }
    }

    public static clefNameToType(name: string): ClefType {
        switch (name.toLowerCase()) {
            case "g": return ClefType.ClefG;
            case "c": return ClefType.ClefC;
            case "f": return ClefType.ClefF;
            case "n": return ClefType.ClefNone;
            case "p": return ClefType.ClefPercussion;
            case "t": return ClefType.ClefTab;
        }
    }

    public pitchOffset(): number {
        return this.clefDef() + this.transposition + 2 * this.clefLine;
        /*
        g4 = 10
        g4/-7 = 3
        f2 = -2
        c3 = 4
        */
    }

    public pitchToStaffLine(pitch: Pitch): number {
        return -pitch.pitch + this.pitchOffset();
    }

    public staffLineToPitch(line: number): Pitch {
        return new Pitch(-line + this.pitchOffset(), "");
    }

    public eq(other: ClefDefinition): boolean {
        return this.clefCode === other.clefCode && this.clefLine === other.clefLine && this.transposition === other.transposition;
    }

    public debug(): string {
        return this.clefName() + this.clefLine + (this.transposition ? ("/" + this.transposition) : "");
    }
}


/**
    * Abstract key definition
    */
export interface IKeyDefinition {
    debug(): string
    getFixedAlteration(pitch: number): string;
    eq(other: IKeyDefinition): boolean;
    enumerateKeys(): Array<PitchClass>;
    getTonic(): PitchClass;
    getMemento(): any;
}

/**
    * Regular key definition (in the circle of fifths)
    */
export class RegularKeyDefinition implements IKeyDefinition {
    constructor(public acci: string, public number: number) {
    }

    public debug(): string {
        return this.number + " " + this.acci;
    }

    public getFixedAlteration(pitch: number): string {
        if (!this.number) return "n";
        pitch += 98;
        var det = (pitch * 2 + 1) % 7;
        if (this.acci === "x") {
            if (det < this.number) return "x";
            return "n";
        }
        if (this.acci === "b") {
            if (6 - det < this.number) return "b";
            return "n";
        }
        return "n";
    }

    public enumerateKeys(): Array<PitchClass> {
        // 0 = c, 1 = g, -1 = f etc.
        var res: Array<PitchClass> = [];
        // #: -1 0 1 2 3 4 5 6
        // b: 5 4 3 2 1 0 -1 -2
        var p = this.acci === "x" ? 6 : -2;
        var dp = this.acci === "x" ? 1 : -1;
        for (var i = 0; i < this.number; i++) {
            res.push(new PitchClass(p));
            p += dp;
        }
        return res;
    }

    public eq(other: IKeyDefinition): boolean {
        return this.debug() === other.debug();
    }

    public getTonic(): PitchClass {
        if (this.acci === "x") {
            return new PitchClass(this.number);
        }
        else
            return new PitchClass(-this.number);
    }
    static createFromMemento(memento: any): IKeyDefinition {
        return new RegularKeyDefinition(memento.acci, memento.no);
    }
    public getMemento(): any {
        return {
            t: "Regular",
            acci: this.acci,
            no: this.number
        }
    }
}

/**
    * Objects that can create a key from a memento
    */
export interface IKeyDefCreator {
    createFromMemento: (memento: any) => IKeyDefinition
}

/**
    * Factory that can create Keys of registered types from mementos
    */
export class KeyDefinitionFactory {
    private static keyClasses: { [i: string]: IKeyDefCreator } = {
        "Regular": RegularKeyDefinition
    };

    public static register(key: string, cls: IKeyDefCreator) {
        this.keyClasses[key] = cls;
    }

    public static createKeyDefinition(memento: any): IKeyDefinition {
        if (memento.t) {
            var m = this.keyClasses[memento.t];
            if (m) return m.createFromMemento(memento);
        }
        return null;
    }
}

/**
    * Abstract meter definition
    */
export interface IMeterDefinition {
    debug(): string;
    getMeasureTime(): TimeSpan;
    nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
    nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
    eq(other: IMeterDefinition): boolean;
    display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[];
    getMemento(): any;
}

/**
    * Regular meter definition (a/b, where b = 2^n)
    */
export class RegularMeterDefinition implements IMeterDefinition {
    constructor(public numerator: number, public denominator: number) {
        if (numerator % 3 === 0) {
            this.boundaryInterval = new TimeSpan(3, denominator)
        }
        else {
            this.boundaryInterval = new TimeSpan(1, 4)
        }
    }

    private boundaryInterval: TimeSpan;

    public debug(): string {
        return this.numerator + "/" + this.denominator;
    }

    public getMeasureTime(): TimeSpan {
        return new TimeSpan(this.numerator, this.denominator);
    }

    public nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
        // todo: calculation
        /*
            17/8 mod 1/4:
            17/8 mod 2/8 = 1/8
        
            a/b mod c/d:
            a*d/b*d mod c*b/b*d = (a*d mod c*b)/(b*d)
        */
        var boundaryTime = (abstime.diff(meterTime)).modulo(this.boundaryInterval);
        if (boundaryTime.numerator) { // % 64
            return abstime.sub(boundaryTime).add(this.boundaryInterval);
        }
        else {
            return abstime;
        }
    }

    public nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
        // todo: calculation
        var mtime = this.getMeasureTime();
        var barTime = (abstime.diff(meterTime)).modulo(mtime);
        if (barTime.numerator) {
            //if ((abstime - this.absTime) % mtime) {
            //return abstime - (abstime - this.absTime) % mtime + mtime
            return abstime.sub(barTime).add(mtime);
        }
        else {
            return abstime.add(mtime);
        }
    }

    public eq(other: IMeterDefinition): boolean {
        return this.debug() === other.debug();
    }

    public display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[]{
        var res: any[];
        if (this.numerator === 4 && this.denominator === 4) {
            res = [addFull("c")];
        }
        else if (this.numerator === 2 && this.denominator === 2) {
            res = [addFull("C")];
        }
        else {
            res = [addFraction("" + this.numerator, "" + this.denominator)];
        }
        return res;
    }
    static createFromMemento(memento: any): IMeterDefinition {
        return new RegularMeterDefinition(memento.num, memento.den);
    }
    public getMemento(): any {
        return {
            t: "Regular",
            num: this.numerator,
            den: this.denominator
        }
    }
}

    /**
    * Like regular meter definition, but with upbeat
    */
export class OffsetMeterDefinition extends RegularMeterDefinition {
    constructor(public numerator: number, public denominator: number, public offset: TimeSpan) {
        super(numerator, denominator);
    }

    public nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
        return super.nextBoundary(abstime.sub(this.offset), meterTime).add(this.offset);
    }

    public nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
        return super.nextBar(abstime.sub(this.offset), meterTime).add(this.offset);
    }
    static createFromMemento(memento: any): IMeterDefinition {
        var offset = TimeSpan.createFromMemento(memento.offs);
        return new OffsetMeterDefinition(memento.num, memento.den, offset);
    }
    public getMemento(): any {
        return {
            t: "OffsetRegular",
            num: this.numerator,
            den: this.denominator,
            offs: this.offset.getMemento()
        }
    }
}

/**
    * Objects that can create a meter from a memento
    */
export interface IMeterDefCreator {
    createFromMemento: (memento: any) => IMeterDefinition
}

/**
    * Factory that can create Keys of registered types from mementos
    */
export class MeterDefinitionFactory {
    private static meterClasses: { [i: string]: IMeterDefCreator } = {
        "Regular": RegularMeterDefinition,
        "OffsetRegular": OffsetMeterDefinition
    };

    public static register(key: string, cls: IMeterDefCreator) {
        this.meterClasses[key] = cls;
    }

    public static createMeterDefinition(memento: any): IMeterDefinition {
        if (memento.t) {
            var m = this.meterClasses[memento.t];
            if (m) return m.createFromMemento(memento);
        }
        return null;
    }
}       


/**
    * Note types
    */
export enum NoteType { Note, Rest, Placeholder };

/**
    * Stem direction types
    */
export enum StemDirectionType { StemFree, StemUp, StemDown };

/**
    * Pitch class, that is pitch independent of the octave
    */
export class PitchClass {
    // According to circle of fifths: 0 = c, 1 = g, -1 = f etc.
    constructor(public pitchClass: number) {
        this.pitchClass = pitchClass;
    }

    static create(pitch: Pitch) {
        var p1 = pitch.pitch % 7;
        return new PitchClass(PitchClass.pitchToPc[p1] + 7 * Pitch.strToInt(pitch.alteration));
    }

    public noteNameLilypond(): string {
        var x = this.pitchClass + 15;
        var noteNameRoot = PitchClass.noteNames[x % 7];
        var accidentalSuffixNo = Math.floor(x / 7);
        return noteNameRoot + PitchClass.suffices[accidentalSuffixNo];
    }

    static noteNames = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
    static suffices = ['eses', 'es', '', 'is', 'isis'];
    static pitchToPc = [0, 2, 4, -1, 1, 3, 5];
}

/**
    * Pitch including alterations
    * Middle C = C4 = c' = midi 60 = pitch 0
    * Octave up = +7
    */
export class Pitch {
    constructor(public pitch: number, public alteration: string) {
    }
    public diff(pitch: Pitch): number {
        return this.pitch - pitch.pitch;
    }
    public equals(pitch: Pitch, ignoreAlteration: boolean = false): boolean {
        return this.pitch == pitch.pitch && (ignoreAlteration || this.alteration == pitch.alteration);
    }
    public gt(pitch: Pitch): boolean {
        return this.pitch > pitch.pitch || (this.pitch == pitch.pitch && this.alteration > pitch.alteration);
    }
    public lt(pitch: Pitch): boolean {
        return this.pitch < pitch.pitch || (this.pitch == pitch.pitch && this.alteration < pitch.alteration);
    }
    static strToInt(a: string): number {
        return Pitch.alterationInts.indexOf(a) - 2;
    }
    static intToStr(n: number): string {
        return Pitch.alterationInts[n + 2];
    }
    public toMidi(): number {
        return Math.floor(12 * (this.pitch + 1) / 7) + 59 + Pitch.strToInt(this.alteration);
    }
    public static createFromMidi(midiNo: number): Pitch {
        var pitch = Math.floor(7 * (midiNo - 56) / 12) - 2;
        var alterationNo = midiNo - Math.floor(12 * (pitch + 1) / 7) - 59;
        return new Pitch(pitch, Pitch.alterationInts[alterationNo + 2]);
    }
    public raiseAlteration(n: number) {
        this.alteration = Pitch.intToStr(Pitch.strToInt(this.alteration) + n);
    }
    public getEnharmonicPitch(n?: number): Pitch {
        var res: Pitch = this;
        if (this.alteration === 'x')
            res = new Pitch(this.pitch + 1, '');
        else if (this.alteration === 'b')
            res = new Pitch(this.pitch - 1, '');
        else {
            var pc = PitchClass.create(this);
            if (!n) {
                n = 0;
            }
            if (pc.pitchClass > 1) {
                res = new Pitch(this.pitch + 1, '');
            }
            else { res = new Pitch(this.pitch - 1, '');}
        }
        var a = this.toMidi();
        var b = res.toMidi();
        res.alteration = Pitch.intToStr(a - b);
        return res;
    }
    static alterationInts = ['bb', 'b', '', 'x', 'xx'];
    static noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    static alterations: { [index: string]: string } = { 'bb': 'eses', 'b': 'es', 'n': '', 'x': 'is', 'xx': 'isis', '': '', '0': '' };
    static octaves = [',,,,,', ',,,,', ',,,', ',,', ',', '', "'", "''", "'''", "''''", "'''''", "''''''"];
    public debug(): string {
        var noteName = Pitch.noteNames[(this.pitch + 98) % 7];
        var octave = Math.floor(this.pitch / 7);
        var octString: string = "" + octave;
        if (octave >= -6 && octave <= 5) {
            octString = Pitch.octaves[octave + 6];
        }
        var alteration = Pitch.alterations[this.alteration];
        return noteName + alteration + octString;
    }
}


/** 
    * Tuplet definition
    * nominalValue = shown note; fraction = real value compared to nominal
e.g. 3 quarters to 2: fullTime = 1/2; fraction = 2/3
        5 16th to 3: fullTime = 3/16; fraction = 3/5
        4th + 8th in place of 4th: fullTime = 1/4; fraction = 2/3 (on both notes)
        fullTime is only set on first note in group - rest are null
        real timespan = timeVal*fraction
        total length of group: fullTime
*/
export class TupletDef {
constructor(public fullTime: TimeSpan, public fraction: Rational) { }
public eq(other: TupletDef): boolean {
    if (!this.fullTime && !other.fullTime) return true;
    if (!this.fullTime || !other.fullTime) return false;
    return this.fullTime.eq(other.fullTime) && this.fraction.eq(other.fraction);
}
}

/** Kinds of Note decorations. */
export enum NoteDecorationKind {
    AccN = 0, AccX, AccB, AccXx, AccBb,
    Fermata = 5, ShortFermata, LongFermata, VeryLongFermata,
    Thumb = 9, Sforzato, Espr, Staccato, Staccatissimo, Tenuto, Portato, Marcato,
    Open = 17, Stopped, Upbow, Downbow, Reverseturn, Turn, Trill, Pedalheel, Pedaltoe,
    Flageolet = 26, Rcomma, Prall, Mordent, Prallprall, Prallmordent,
    Upprall = 32, Upmordent, Pralldown, Downprall, Downmordent, Prallup, Lineprall,
    Caesura = 39, Lcomma, Rvarcomma, Lvarcomma,
    Arpeggio = 43, ArpeggioDown, NonArpeggio
};


/** Long note decoration type, e.g. hairpin, trill extension and slur */
export enum LongDecorationType { TrillExt, Cresc, Decresc, Slur, Bracket, Tuplet, Ottava };
