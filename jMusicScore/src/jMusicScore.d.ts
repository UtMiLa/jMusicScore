declare module JMusicScore {
    module Model {
        class Rational {
            numerator: number;
            denominator: number;
            constructor(numerator: number, denominator?: number);
            static gcd(a: number, b: number): number;
            toNumber(): number;
            toString(): string;
            reduce(): Rational;
            eq(other: Rational): boolean;
            gt(other: Rational): boolean;
            ge(other: Rational): boolean;
            static createFromMemento(def: any): Rational;
            getMemento(): any;
        }
        class AbsoluteTime extends Rational {
            static startTime: AbsoluteTime;
            static infinity: AbsoluteTime;
            diff(other: AbsoluteTime): TimeSpan;
            sub(other: TimeSpan): AbsoluteTime;
            add(other: TimeSpan): AbsoluteTime;
            reduce(): AbsoluteTime;
            static createFromMemento(def: any): AbsoluteTime;
        }
        class TimeSpan extends Rational {
            static quarterNote: TimeSpan;
            static eighthNote: TimeSpan;
            static halfNote: TimeSpan;
            static wholeNote: TimeSpan;
            static infiniteNote: TimeSpan;
            sub(other: TimeSpan): TimeSpan;
            add(other: TimeSpan): TimeSpan;
            reduce(): TimeSpan;
            divide(other: TimeSpan): number;
            modulo(other: TimeSpan): TimeSpan;
            divideScalar(scalar: number): TimeSpan;
            multiplyScalar(scalar: number): TimeSpan;
            multiplyRational(fraction: Rational): TimeSpan;
            static createFromMemento(def: any): TimeSpan;
        }
        class HorizPosition {
            absTime: AbsoluteTime;
            sortOrder: number;
            graceNo: number;
            beforeAfter: number;
            constructor(absTime: AbsoluteTime, sortOrder: number, graceNo?: number, beforeAfter?: number);
            static compareEvents(a: HorizPosition, b: HorizPosition): number;
            eq(comp: HorizPosition): boolean;
            clone(beforeAfter: number): HorizPosition;
        }
        interface IVisitorIterator {
            visitPre(element: IMusicElement): (element: IMusicElement) => void;
        }
        interface IMemento {
            id: string;
            t: string;
            def: any;
            children?: IMemento[];
        }
        interface IMusicElement {
            changed(): void;
            moved(): void;
            id: string;
            parent: IMusicElement;
            spacingInfo: ISpacingInfo;
            setSpacingInfo(info: ISpacingInfo): void;
            inviteVisitor(spacer: IVisitor): void;
            getElementName(): string;
            addChild(list: IMusicElement[], theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void;
            removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
            debug(): string;
            remove(): void;
            setProperty(name: string, value: any): void;
            getProperty(name: string): any;
            visitAll(visitor: IVisitorIterator): void;
            getMemento(withChildren?: boolean): IMemento;
        }
        class IdSequence {
            static id: number;
            static next(): string;
        }
        class MusicElement<TSpacingInfo extends ISpacingInfo> {
            parent: IMusicElement;
            constructor(parent: IMusicElement);
            private _spacingInfo;
            id: string;
            spacingInfo: TSpacingInfo;
            setSpacingInfo(info: TSpacingInfo): TSpacingInfo;
            inviteVisitor(spacer: IVisitor): void;
            changed(): void;
            moved(): void;
            private childLists;
            private properties;
            getElementName(): string;
            addChild(list: IMusicElement[], theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): boolean;
            removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
            debug(): string;
            remove(): void;
            setParent(p: IMusicElement): void;
            getParent(): IMusicElement;
            setProperty(name: string, value: any): void;
            getProperty(name: string): any;
            doGetMemento(): any;
            getMemento(withChildren?: boolean): IMemento;
            visitAll(visitor: IVisitorIterator): void;
        }
        interface ITimedEvent extends IMusicElement {
            absTime: AbsoluteTime;
            getElementName(): string;
            debug(): string;
            getSortOrder: () => number;
            getVoice(): IVoice;
            getStaff(): IStaff;
            spacingInfo: ISpacingInfo;
            getHorizPosition(): HorizPosition;
        }
        interface IEventContainer {
            getEvents(): ITimedEvent[];
        }
        interface IBar extends ITimedEvent {
            parent: IScore;
            absTime: AbsoluteTime;
            spacingInfo: IBarSpacingInfo;
        }
        interface IMeterOwner extends IMusicElement {
            setMeter(meter: IMeterDefinition, absTime: AbsoluteTime): void;
            withMeters(f: (meter: IMeter, index: number) => void): void;
            meterElements: IMeter[];
        }
        interface IScore extends IEventContainer, IMeterOwner {
            bars: IBar[];
            staffElements: IStaff[];
            title: string;
            composer: string;
            author: string;
            subTitle: string;
            metadata: {};
            clear(): void;
            findBar(absTime: AbsoluteTime): IBar;
            getEvents(ignoreStaves?: boolean): ITimedEvent[];
            withStaves(f: (staff: IStaff, index: number) => void): void;
            withVoices(f: (voice: IVoice, index: number) => void): void;
            withBars(f: (bar: IBar, index: number) => void): void;
            removeBars(f: (bar: IBar, index: number) => boolean): void;
            addStaff(clefDef: ClefDefinition): IStaff;
            setKey(key: IKeyDefinition, absTime: AbsoluteTime): void;
        }
        class ScoreElement extends MusicElement<IScoreSpacingInfo> implements IScore {
            parent: IMusicElement;
            constructor(parent: IMusicElement);
            bars: IBar[];
            staffElements: IStaff[];
            meterElements: IMeter[];
            title: string;
            composer: string;
            author: string;
            subTitle: string;
            metadata: {};
            inviteVisitor(visitor: IVisitor): void;
            static createFromMemento(parent: IMusicElement, memento: IMemento): IScore;
            doGetMemento(): any;
            clear(): void;
            findBar(absTime: AbsoluteTime): IBar;
            static placeInOrder(score: IScore, staff: IStaff, index: number): void;
            getEvents(ignoreStaves?: boolean): ITimedEvent[];
            withStaves(f: (staff: IStaff, index: number) => void): void;
            withVoices(f: (voice: IVoice, index: number) => void): void;
            withMeters(f: (meter: IMeter, index: number) => void): void;
            withBars(f: (bar: IBar, index: number) => void): void;
            removeBars(f: (bar: IBar, index: number) => boolean): void;
            updateBars(): void;
            addStaff(clefDef: ClefDefinition): IStaff;
            setMeter(meter: IMeterDefinition, absTime: AbsoluteTime): void;
            getElementName(): string;
            addBarLine(absTime: AbsoluteTime): void;
            setKey(key: IKeyDefinition, absTime: AbsoluteTime): void;
        }
        class StaffContext {
            clef: IClef;
            key: IKey;
            meter: IMeter;
            barNo: number;
            timeInBar: TimeSpan;
            constructor(clef: IClef, key: IKey, meter: IMeter, barNo: number, timeInBar: TimeSpan);
            equals(staffContext: StaffContext): boolean;
        }
        interface IStaff extends IEventContainer, IMusicElement, IMeterOwner {
            parent: IScore;
            removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
            spacingInfo: IStaffSpacingInfo;
            clefElements: IClef[];
            voiceElements: IVoice[];
            title: string;
            withVoices(f: (voice: IVoice, index: number) => void): void;
            withKeys(f: (key: IKey, index: number) => void): void;
            withClefs(f: (clef: IClef, index: number) => void): void;
            withTimedEvents(f: (ev: ITimedEvent, index: number) => void): void;
            getStaffContext(absTime: AbsoluteTime): StaffContext;
            getKeyElements(): IKey[];
            getEvents(fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
            addVoice(): IVoice;
            getParent(): IScore;
            setClef(type: ClefDefinition, absTime: AbsoluteTime): void;
            setKey(key: IKeyDefinition, absTime: AbsoluteTime): void;
            setStaffExpression(type: string, absTime: AbsoluteTime): IStaffExpression;
        }
        interface IStaffExpression extends ITimedEvent {
            parent: IStaff;
            text: string;
        }
        interface IStaffExpressionSpacingInfo extends ISpacingInfo {
        }
        interface IVoice extends IEventContainer, IMusicElement {
            noteElements: INote[];
            parent: IStaff;
            withNotes(f: (note: INote, index: number) => void): void;
            getStemDirection(): StemDirectionType;
            setStemDirection(dir: StemDirectionType): void;
            getEvents(fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
            getEndTime(): AbsoluteTime;
            removeChild(child: INote): void;
        }
        enum ClefType {
            ClefNone = 0,
            ClefG = 1,
            ClefC = 2,
            ClefF = 3,
            ClefPercussion = 4,
            ClefTab = 5,
        }
        class ClefDefinition {
            clefCode: ClefType;
            clefLine: number;
            transposition: number;
            constructor(clefCode: ClefType, clefLine: number, transposition?: number);
            static clefG: ClefDefinition;
            static clefGTenor: ClefDefinition;
            static clefF: ClefDefinition;
            static clefCAlto: ClefDefinition;
            static clefPerc: ClefDefinition;
            clefDef(): number;
            clefName(): string;
            static clefNameToType(name: string): ClefType;
            pitchOffset(): number;
            pitchToStaffLine(pitch: Pitch): number;
            staffLineToPitch(line: number): Pitch;
            eq(other: ClefDefinition): boolean;
            debug(): string;
        }
        interface IClef extends ITimedEvent {
            parent: IStaff;
            definition: ClefDefinition;
            pitchToStaffLine(pitch: Pitch): number;
            staffLineToPitch(line: number): Pitch;
        }
        interface IKeyDefinition {
            debug(): string;
            getFixedAlteration(pitch: number): string;
            eq(other: IKeyDefinition): boolean;
            enumerateKeys(): Array<PitchClass>;
            getTonic(): PitchClass;
            getMemento(): any;
        }
        class RegularKeyDefinition implements IKeyDefinition {
            acci: string;
            number: number;
            constructor(acci: string, number: number);
            debug(): string;
            getFixedAlteration(pitch: number): string;
            enumerateKeys(): Array<PitchClass>;
            eq(other: IKeyDefinition): boolean;
            getTonic(): PitchClass;
            static createFromMemento(memento: any): IKeyDefinition;
            getMemento(): any;
        }
        interface IKeyDefCreator {
            createFromMemento: (memento: any) => IKeyDefinition;
        }
        class KeyDefinitionFactory {
            private static keyClasses;
            static register(key: string, cls: IKeyDefCreator): void;
            static createKeyDefinition(memento: any): IKeyDefinition;
        }
        interface IKey extends ITimedEvent {
            parent: IStaff;
            definition: IKeyDefinition;
            getFixedAlteration(pitch: number): string;
            getTonic(): PitchClass;
        }
        interface IMeterDefinition {
            debug(): string;
            getMeasureTime(): TimeSpan;
            nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            eq(other: IMeterDefinition): boolean;
            display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[];
            getMemento(): any;
        }
        class RegularMeterDefinition implements IMeterDefinition {
            numerator: number;
            denominator: number;
            constructor(numerator: number, denominator: number);
            private boundaryInterval;
            debug(): string;
            getMeasureTime(): TimeSpan;
            nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            eq(other: IMeterDefinition): boolean;
            display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[];
            static createFromMemento(memento: any): IMeterDefinition;
            getMemento(): any;
        }
        class OffsetMeterDefinition extends RegularMeterDefinition {
            numerator: number;
            denominator: number;
            offset: TimeSpan;
            constructor(numerator: number, denominator: number, offset: TimeSpan);
            nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            static createFromMemento(memento: any): IMeterDefinition;
            getMemento(): any;
        }
        interface IMeterDefCreator {
            createFromMemento: (memento: any) => IMeterDefinition;
        }
        class MeterDefinitionFactory {
            private static meterClasses;
            static register(key: string, cls: IMeterDefCreator): void;
            static createMeterDefinition(memento: any): IMeterDefinition;
        }
        interface IMeter extends ITimedEvent {
            parent: IMusicElement;
            definition: IMeterDefinition;
            getMeasureTime(): TimeSpan;
            nextBoundary(abstime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime): AbsoluteTime;
        }
        enum NoteType {
            Note = 0,
            Rest = 1,
            Placeholder = 2,
        }
        enum StemDirectionType {
            StemFree = 0,
            StemUp = 1,
            StemDown = 2,
        }
        class PitchClass {
            pitchClass: number;
            constructor(pitchClass: number);
            static create(pitch: Pitch): PitchClass;
            noteNameLilypond(): string;
            static noteNames: string[];
            static suffices: string[];
            static pitchToPc: number[];
        }
        class Pitch {
            pitch: number;
            alteration: string;
            constructor(pitch: number, alteration: string);
            diff(pitch: Pitch): number;
            equals(pitch: Pitch, ignoreAlteration?: boolean): boolean;
            gt(pitch: Pitch): boolean;
            lt(pitch: Pitch): boolean;
            static strToInt(a: string): number;
            static intToStr(n: number): string;
            toMidi(): number;
            static createFromMidi(midiNo: number): Pitch;
            raiseAlteration(n: number): void;
            getEnharmonicPitch(n?: number): Pitch;
            static alterationInts: string[];
            static noteNames: string[];
            static alterations: {
                [index: string]: string;
            };
            static octaves: string[];
            debug(): string;
        }
        interface IBeam {
            parent: INote;
            toNote: INote;
            index: number;
            spacingInfo: IBeamSpacingInfo;
            setSpacingInfo(spacingInfo: IBeamSpacingInfo): void;
            inviteVisitor(spacer: IVisitor): void;
            remove(): void;
        }
        class BeamElement extends MusicElement<IBeamSpacingInfo> implements IBeam {
            parent: INote;
            toNote: INote;
            index: number;
            constructor(parent: INote, toNote: INote, index: number);
            inviteVisitor(visitor: IVisitor): void;
            remove(): void;
        }
        interface INote extends ITimedEvent {
            parent: IVoice;
            NoteId: string;
            timeVal: TimeSpan;
            noteheadElements: INotehead[];
            decorationElements: INoteDecorationElement[];
            longDecorationElements: ILongDecorationElement[];
            syllableElements: ITextSyllableElement[];
            tupletDef: TupletDef;
            dotNo: number;
            rest: boolean;
            graceType: string;
            Beams: IBeam[];
            withHeads(f: (head: INotehead, index: number) => void): void;
            withDecorations(f: (deco: INoteDecorationElement, index: number) => void): void;
            withLongDecorations(f: (deco: ILongDecorationElement, index: number) => void): void;
            withSyllables(f: (syll: ITextSyllableElement, index: number) => void): void;
            spacingInfo: INoteSpacingInfo;
            setSpacingInfo(info: INoteSpacingInfo): INoteSpacingInfo;
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
        }
        class TupletDef {
            fullTime: TimeSpan;
            fraction: Rational;
            constructor(fullTime: TimeSpan, fraction: Rational);
            eq(other: TupletDef): boolean;
        }
        interface INotehead extends IMusicElement {
            parent: INote;
            pitch: Pitch;
            tie: boolean;
            tieForced: boolean;
            forceAccidental: boolean;
            showAccidental: boolean;
            getPitch(): Pitch;
            getAccidental(): string;
            matchesPitch(pitch: Pitch, ignoreAlteration?: boolean): boolean;
            spacingInfo: INoteHeadSpacingInfo;
        }
        enum NoteDecorationKind {
            AccN = 0,
            AccX = 1,
            AccB = 2,
            AccXx = 3,
            AccBb = 4,
            Fermata = 5,
            ShortFermata = 6,
            LongFermata = 7,
            VeryLongFermata = 8,
            Thumb = 9,
            Sforzato = 10,
            Espr = 11,
            Staccato = 12,
            Staccatissimo = 13,
            Tenuto = 14,
            Portato = 15,
            Marcato = 16,
            Open = 17,
            Stopped = 18,
            Upbow = 19,
            Downbow = 20,
            Reverseturn = 21,
            Turn = 22,
            Trill = 23,
            Pedalheel = 24,
            Pedaltoe = 25,
            Flageolet = 26,
            Rcomma = 27,
            Prall = 28,
            Mordent = 29,
            Prallprall = 30,
            Prallmordent = 31,
            Upprall = 32,
            Upmordent = 33,
            Pralldown = 34,
            Downprall = 35,
            Downmordent = 36,
            Prallup = 37,
            Lineprall = 38,
            Caesura = 39,
            Lcomma = 40,
            Rvarcomma = 41,
            Lvarcomma = 42,
            Arpeggio = 43,
            ArpeggioDown = 44,
            NonArpeggio = 45,
        }
        interface INoteDecorationElement extends IMusicElement {
            parent: INote;
            placement: string;
            getDecorationId(): NoteDecorationKind;
        }
        class NoteDecorationElement extends MusicElement<INoteDecorationSpacingInfo> implements INoteDecorationElement {
            parent: INote;
            private notedecorationId;
            constructor(parent: INote, notedecorationId: NoteDecorationKind);
            inviteVisitor(visitor: IVisitor): void;
            static createFromMemento(parent: INote, memento: IMemento): INoteDecorationElement;
            doGetMemento(): any;
            placement: string;
            getDecorationId(): NoteDecorationKind;
            getElementName(): string;
        }
        enum LongDecorationType {
            TrillExt = 0,
            Cresc = 1,
            Decresc = 2,
            Slur = 3,
            Bracket = 4,
            Tuplet = 5,
            Ottava = 6,
        }
        interface ILongDecorationElement extends IMusicElement {
            parent: INote;
            placement: string;
            spacingInfo: ILongDecorationSpacingInfo;
            endEvent: ITimedEvent;
            type: LongDecorationType;
        }
        class NoteLongDecorationElement extends MusicElement<ILongDecorationSpacingInfo> implements ILongDecorationElement {
            parent: INote;
            private duration;
            type: LongDecorationType;
            constructor(parent: INote, duration: TimeSpan, type: LongDecorationType);
            inviteVisitor(visitor: IVisitor): void;
            static createFromMemento(parent: INote, memento: IMemento): ILongDecorationElement;
            doGetMemento(): any;
            placement: string;
            endEvent: ITimedEvent;
            getElementName(): string;
        }
        interface ITextSyllableElement extends IMusicElement {
            placement: string;
            Text: string;
            parent: INote;
        }
        class TextSyllableElement extends MusicElement<ITextSyllableSpacingInfo> implements ITextSyllableElement {
            parent: INote;
            private text;
            constructor(parent: INote, text: string);
            inviteVisitor(visitor: IVisitor): void;
            static createFromMemento(parent: INote, memento: IMemento): ITextSyllableElement;
            doGetMemento(): any;
            placement: string;
            Text: string;
            getElementName(): string;
        }
        class Point {
            x: number;
            y: number;
            constructor(x: number, y: number);
        }
        interface ISpacingInfo {
            offset: Point;
            width: number;
            height: number;
            left: number;
            top: number;
            scale: number;
            preWidth: number;
        }
        interface IVisitor {
            visitNoteHead(head: INotehead, spacing: INoteHeadSpacingInfo): void;
            visitNote(note: INote, spacing: INoteSpacingInfo): void;
            visitNoteDecoration(deco: INoteDecorationElement, spacing: INoteDecorationSpacingInfo): void;
            visitLongDecoration(deco: ILongDecorationElement, spacing: ILongDecorationSpacingInfo): void;
            visitVoice(voice: IVoice, spacing: IVoiceSpacingInfo): void;
            visitClef(clef: IClef, spacing: IClefSpacingInfo): void;
            visitMeter(meter: IMeter, spacing: IMeterSpacingInfo): void;
            visitKey(key: IKey, spacing: IKeySpacingInfo): void;
            visitStaff(staff: IStaff, spacing: IStaffSpacingInfo): void;
            visitScore(score: IScore, spacing: IScoreSpacingInfo): void;
            visitTextSyllable(text: ITextSyllableElement, spacing: ITextSyllableSpacingInfo): void;
            visitBar(bar: IBar, spacing: IBarSpacingInfo): void;
            visitBeam(beam: IBeam, spacing: IBeamSpacingInfo): void;
            visitStaffExpression(staffExpression: IStaffExpression, spacing: IStaffExpressionSpacingInfo): void;
            visitDefault(element: IMusicElement, spacing: ISpacingInfo): void;
        }
        interface INoteHeadSpacingInfo extends ISpacingInfo {
            accidentalX: number;
            dots: Point;
            dotWidth: number;
            displacement: boolean;
            displace: Point;
            headGlyph: string;
            reversed: boolean;
            tieStart: Point;
            tieEnd: Point;
            tieDir: number;
            graceScale: number;
            accidentalStep: number;
        }
        interface IBeamSpacingInfo extends ISpacingInfo {
            start: Point;
            end: Point;
            beamDist: number;
            beamCount: number;
        }
        class LedgerLineSpacingInfo {
            xStart: number;
            xEnd: number;
            y: number;
            constructor(xStart: number, xEnd: number, y: number);
        }
        interface INoteSpacingInfo extends ISpacingInfo {
            dots: Point;
            rev: boolean;
            flagNo: number;
            ledgerLinesUnder: LedgerLineSpacingInfo[];
            ledgerLinesOver: LedgerLineSpacingInfo[];
            highPitchY: number;
            lowPitchY: number;
            graceScale: number;
            stemX: number;
            stemTipY: number;
            stemRootY: number;
            stemLength: number;
            dotWidth: number;
            restGlyph: string;
            flagDisplacement: Point;
        }
        interface INoteDecorationSpacingInfo extends ISpacingInfo {
        }
        interface ILongDecorationSpacingInfo extends ISpacingInfo {
            noteY: number;
            noteheadY: number;
            distX: number;
            endNoteY: number;
            endNoteheadY: number;
        }
        interface IVoiceSpacingInfo extends ISpacingInfo {
        }
        interface IClefSpacingInfo extends ISpacingInfo {
            clefId: string;
        }
        interface IMeterSpacingInfo extends ISpacingInfo {
        }
        interface IKeySpacingInfo extends ISpacingInfo {
        }
        interface IStaffSpacingInfo extends ISpacingInfo {
            staffLength: number;
            staffSpace: number;
        }
        interface IBarSpacingInfo extends ISpacingInfo {
            barStyle: string;
            end: Point;
            extraXOffset: number;
        }
        interface IScoreSpacingInfo extends ISpacingInfo {
        }
        interface ITextSyllableSpacingInfo extends ISpacingInfo {
        }
        class Music {
            static prevNote(note: INote): INote;
            static nextNote(note: INote): INote;
            static changeNoteDuration(note: INote, nominalDuration: TimeSpan, actualDuration: TimeSpan): INote;
            static splitNote(note: INote, notes: TimeSpan[]): void;
            static mergeNoteWithNext(note: INote, no?: number): INote;
            static calcNoteId(timeVal: TimeSpan): string;
            static findNote(voice: IVoice, absTime: AbsoluteTime): INote;
            static inTupletArea(voice: IVoice, absTime: AbsoluteTime): Rational;
            static addNote(voice: IVoice, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote?: INote, insert?: boolean, dots?: number, tuplet?: TupletDef): INote;
            static getText(voice: IVoice): string;
            static compareEvents(a: ITimedEvent, b: ITimedEvent): number;
            static compareEventsByVoice(a: ITimedEvent, b: ITimedEvent): number;
            static setBar(owner: IStaff, absTime: AbsoluteTime): IBar;
            static setBar(owner: IScore, absTime: AbsoluteTime): IBar;
        }
        interface IMusicElementCreator {
            createFromMemento: (parent: IMusicElement, memento: any) => IMusicElement;
        }
        class MusicElementFactory {
            private static mementoCreators;
            static register(key: string, creator: IMusicElementCreator): void;
            static recreateElement(parent: IMusicElement, memento: IMemento): IMusicElement;
        }
    }
}
