import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-music-basics';
import { ISpacingInfo, IMusicElement, IVisitor, IBarSpacingInfo, IBar, IEventInfo, IScore, IVoice, IStaff, ISequence, IScoreSpacingInfo, 
    IMeter, IClef, IStaffSpacingInfo, IKey, IStaffExpression, IStaffExpressionSpacingInfo, IVoiceSpacingInfo, INote, 
    INoteSource, INoteContext, IEventEnumerator, ITimedEvent, ISequenceNote, INoteInfo, IClefSpacingInfo, IKeySpacingInfo, IMeterSpacingInfo, 
    IMeterOwner, IBeamSpacingInfo, IBeam, INoteSpacingInfo, INotehead, INoteDecorationElement, ILongDecorationElement, ITextSyllableElement, 
    INoteHeadSpacingInfo, INoteHeadInfo, INoteDecorationSpacingInfo, ILongDecorationSpacingInfo, ITextSyllableSpacingInfo, 
    IMusicElementCreator, 
    IEventVisitor,
    INoteDecorationEventInfo,
    ILongDecorationEventInfo,
    ITextSyllableEventInfo,
    IBeamEventInfo,
    IBarEventInfo,
    IClefEventInfo,
    IMeterEventInfo,
    IKeyEventInfo, IGlobalContext, 
    IStaffExpressionEventInfo,
    INoteFinder,
    IEventVisitorTarget} from './jm-model-interfaces';

    import { MusicElement, MusicContainer, StaffVisitor, VoiceVisitor, MeterVisitor, BarVisitor, KeyVisitor, ClefVisitor, TimedEventVisitor, NoteVisitor, NoteHeadVisitor, NoteDecorationVisitor, LongDecorationVisitor, TextSyllableVisitor, EventInfo } from './jm-model-base'

    class NoteEventInfo extends EventInfo implements INoteInfo {
        source: INote;
        heads: INoteHeadInfo[];
        decorations: INoteDecorationEventInfo[];
        longDecorations: ILongDecorationEventInfo[];
        syllables: ITextSyllableEventInfo[];
        id: string;
        relTime: TimeSpan;
        getTimeVal(): TimeSpan {
            return this.source.getTimeVal();
        }
        visitAllEvents(visitor: IVisitorIterator<IEventVisitorTarget>): void {
            var postFun: (element: IEventVisitorTarget) => void = visitor.visitPre(this);
            for (var i = 0; i < this.heads.length; i++) {
                //visitor.visitNoteHeadInfo(this.heads[i]);
                const post = visitor.visitPre(this.heads[i]);
                post(this.heads[i]);
            }
            for (var i = 0; i < this.decorations.length; i++) {
                //visitor.visitNoteDecorationInfo(this.decorations[i]);
                const post = visitor.visitPre(this.decorations[i]);
                post(this.decorations[i]);
            }
            for (var i = 0; i < this.longDecorations.length; i++) {
                //visitor.visitLongDecorationInfo(this.longDecorations[i]);
                const post = visitor.visitPre(this.longDecorations[i]);
                post(this.longDecorations[i]);
            }
            for (var i = 0; i < this.syllables.length; i++) {
                //visitor.visitTextSyllableInfo(this.syllables[i]);
                const post = visitor.visitPre(this.syllables[i]);
                post(this.syllables[i]);
            }
            if (postFun) {
                postFun(this);
            }
        }
        inviteEventVisitor(visitor: IEventVisitor): void {
            visitor.visitNoteInfo(this);
        }
        
        constructor(note: NoteElement){
            super();
            this.source = note;
            this.heads = note.noteheadElements.map(h => h.getInfo());
            this.decorations = note.decorationElements.map(h => h.getInfo());
            this.longDecorations = note.longDecorationElements.map(h => h.getInfo());
            this.syllables = note.syllableElements.map(h => h.getInfo());
            this.relTime = note.absTime.fromStart();
            this.id = note.id;
        }
    }


    class NoteHeadInfo extends EventInfo implements INoteHeadInfo {
        source: INotehead;
        pitch: Pitch;
        
        constructor(notehead: NoteheadElement){
            super();
            this.source = notehead;
            this.pitch = notehead.pitch;
            this.id = notehead.id;
        }
        inviteEventVisitor(visitor: IEventVisitor): void {
            visitor.visitNoteHeadInfo(this);
        }
        visitAllEvents(visitor: IVisitorIterator<IEventVisitorTarget>): void {}
    }
/*

            getInfo(): ITextSyllableEventInfo {
                return {
                    id: this.id,
                    source: this
                };
            }

*/

    class NoteDecorationEventInfo extends EventInfo implements INoteDecorationEventInfo {
        source: NoteDecorationElement;
        
        constructor(deco: NoteDecorationElement){
            super();
            this.source = deco;
            this.id = deco.id;
        }
        inviteEventVisitor(visitor: IEventVisitor): void {
            visitor.visitNoteDecorationInfo(this);
        }
        
    }

    class LongDecorationEventInfo extends EventInfo implements ILongDecorationEventInfo {
        source: NoteLongDecorationElement;
        
        constructor(deco: NoteLongDecorationElement){
            super();
            this.source = deco;
            this.id = deco.id;
        }
        inviteEventVisitor(visitor: IEventVisitor): void {
            visitor.visitLongDecorationInfo(this);
        }
        
    }

    class TextSyllableEventInfo extends EventInfo implements ITextSyllableEventInfo {
        source: TextSyllableElement;
        
        constructor(txt: TextSyllableElement){
            super();
            this.source = txt;
            this.id = txt.id;
        }
        inviteEventVisitor(visitor: IEventVisitor): void {
            visitor.visitTextSyllableInfo(this);
        }
        
    }

        /*
         * NoteElement: det faktiske element, uden transformationer. Bruges af værktøjer, der arbejder direkte på musikken. Kan bo på en Voice, Sequence eller Variable.
         * INoteInfo: nodens indhold, som kan være transformeret. Hver instans af en node, der gentages af en transformation eller variabel, har ét INoteInfo-objekt. 
         *      Id er konkateneret af variables og NoteElement's Id. NoteSpacingInfo og AbsTime er knyttet til denne. 
         *      Holder en reference til NoteElement (nødvendigt?)
         *      Linker til foregående og næste node og Voice.
         *      Hver Sequence og variabel kopierer INoteInfo (og transformerer evt.).
         * NoteHeadElement: det faktiske element, uden transformationer. Bruges af værktøjer, der arbejder direkte på musikken. Kan bo på NoteElement. 
         * INoteHeadInfo: transformeret version, bor på INoteInfo. Holder Pitch, Tie, Accidentals, NoteHeadSpacingInfo.
         * Ditto for andre Note-children. De vil blot indeholde en SpacingInfo og en reference til dekorationen.
         * BeamOverrides: bor på NoteElement, og bestemmer, hvor bjælkeregler skal overtrumfes.
         * Beams: bor på INoteInfo. 
         */


    /** NoteHeadElement: det faktiske element, uden transformationer. Bruges af værktøjer, der arbejder direkte på musikken. Kan bo på NoteElement.  */
        export class NoteElement extends MusicContainer implements ISequenceNote { // todo: ikke MusicContainer

/** TODO: flyt til NoteContext */
//(<any>note.parent.parent).getStaffContext(context.absTime); // todo: context!

public getStaffContext(): StaffContext{
    let p: any = this.parent; // todo: ændres
    while (p){
        if ((<any>p).getStaffContext) return (<any>p).getStaffContext(this.absTime);
        p = p.parent;
    }
    return undefined;
}
public get voice(): IVoice {
    let p: any = this.parent; // todo: ændres
    while (p) {
        if (p.getElementName() === "Voice") return <IVoice>p;
        p = p.parent;
    }
    return undefined;
}
public getContext(): INoteContext {
    return this;
}
public visitAllEvents(visitor: IEventVisitor, globalContext: IGlobalContext): void {
    alert("Should not come here");
    throw "Visitor error";
}

public inviteEventVisitor(spacer: IEventVisitor, globalContext: IGlobalContext): void {
    spacer.visitNoteInfo(this.getInfo());
}

            getEvents(): IEventInfo[] {
                return [this.getInfo()];
            }

            getInfo(): INoteInfo {
                /*let info: INoteInfo = { 
                    source: this,
                    heads: this.noteheadElements.map(h => h.getInfo()),
                    decorations: this.decorationElements.map(h => h.getInfo()),
                    longDecorations: this.longDecorationElements.map(h => h.getInfo()),
                    syllables: this.syllableElements.map(h => h.getInfo()),
                    relTime: this.absTime.fromStart(), 
                    getTimeVal: () => { return this.getTimeVal(); },
                    id: this.id,
                    visitAllEvents: undefined 
                };
                info.visitAllEvents = (visitor: IEventVisitor) => {visitor.visitNoteInfo(info)};*/
                return new NoteEventInfo(this);                
            }



            constructor(public parent: ISequence, private noteId: string, public timeVal: TimeSpan) {
                super(parent);
                if (!noteId && timeVal) {
                    this.noteId = NoteElement.calcNoteId(timeVal);
//                    if (!this.noteId) this.noteId = "hidden";
                }
            }

            public static calcNoteId(timeVal: TimeSpan): string {
                timeVal.reduce();

                // check tuplets:
                var denom = timeVal.denominator;
                while (denom % 2 === 0) denom /= 2;
                if (denom !== 1) return null;

                if (timeVal.numerator === 3) {
                    timeVal = timeVal.multiplyRational(new Rational(2, 3));
                }
                if (timeVal.numerator === 7) {
                    timeVal = timeVal.multiplyRational(new Rational(4, 7));
                }

                if ((timeVal.numerator === 2 && timeVal.denominator === 1) || timeVal.numerator === 1) {
                    return "n" + timeVal.numerator + "_" + timeVal.denominator;
                }
                return null;
            }


            getPrev(globalContext: IGlobalContext): INote {
                var voice = this.parent;
                var noteElements = voice.getNoteElements(globalContext);
                var i = noteElements.indexOf(this);
                if (i > 0) {
                    return noteElements[i - 1];
                }
                return null;
            }
            getNext(globalContext: IGlobalContext): INote{
                var voice = this.parent;
                var noteElements = voice.getNoteElements(globalContext);
                var i = noteElements.indexOf(this);
                if (i >= 0 && i < noteElements.length - 1) {
                    return noteElements[i + 1];
                }
                return null;
            }

            static createFromMemento(parent: IVoice, memento: IMemento, globalContext: IGlobalContext): INote {
                //var timeVal = TimeSpan.createFromMemento(memento.def.time);
                //var note: INote = new NoteElement(parent, memento.def.noteId, timeVal);
                //note.absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                //if (memento.def.dots) note.setDots(memento.def.dots);
                // todo: tuplet
                var tupletDef: TupletDef;
                if (memento.def.tuplet) {
                    var fullTime: TimeSpan;
                    if (memento.def.tuplet.fullTime) fullTime = TimeSpan.createFromMemento(memento.def.tuplet.fullTime);
                    var fraction = Rational.createFromMemento(memento.def.tuplet);
                    var tuplet = new TupletDef(fullTime, fraction);
                    tupletDef = tuplet;
                }
                //if (memento.def.grace) { note.graceType = memento.def.grace; }
                //if (memento.def.rest) { note.rest = true; }
                //if (memento.def.hidden) { note.noteId = "hidden"; }
                // todo: beams
                if (parent) {//parent.addChild(parent.noteElements, note); // todo: at index
                    var noteType: NoteType = memento.def.hidden ? NoteType.Placeholder : memento.def.rest ? NoteType.Rest : NoteType.Note;
                    var beforeNote: INote = null;
                    var absTime = memento.def.abs ? AbsoluteTime.createFromMemento(memento.def.abs) : null;
                    var note = parent.addNote(globalContext, noteType, absTime, memento.def.noteId, //todo: problem
                        TimeSpan.createFromMemento(memento.def.time), beforeNote, true, memento.def.dots, tupletDef);
                    if (memento.def.grace) { note.graceType = memento.def.grace; }
                    if (memento.def.stem) { note.setStemDirection(memento.def.stem); }
                    return note;
                }
            }

            public doGetMemento(): any {
                var val: any = {
                    time: this.timeVal.getMemento(),
                    abs: this.absTime.getMemento(),
                    noteId: this.noteId                    
                };
                if (this.dotNo) { val.dots = this.dotNo; }
                if (this.tupletDef) {
                    val.tuplet = this.tupletDef.fraction.getMemento();
                    if (this.tupletDef.fullTime) {
                        val.tuplet.fullTime = this.tupletDef.fullTime.getMemento();
                    }
                }
                if (this.graceType) {
                    val.grace = this.graceType;
                }
                if (this.rest) {
                    val.rest = true;
                }
                if (this.noteId === 'hidden') {
                    val.hidden = true;
                }
                // todo: beams
                if (this.stemDirection) {
                    val.stem = this.stemDirection;
                }
                return val;
            }

            tupletDef: TupletDef;            

            /*getVoice(): IVoice { return this.parent; }

            getStaff(): IStaff { return this.parent.parent; }*/

            getHorizPosition(): HorizPosition {
                return new HorizPosition(this.absTime, this.getSortOrder()); // todo: grace note position
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitNote(this);
            }

            public get NoteId(): string { return this.noteId; }
            public set NoteId(v: string) {
                if (this.noteId !== v) {
                    this.noteId = v;
                    throw "cannot change noteid";
                    //this.spacingInfo = undefined; // todo: change note id
                }
            }

            public getSortOrder() {
                return this.graceType ? 95 : 100;
            }
            
            get noteheadElements(): INotehead[] {
                return this.getSpecialElements("Notehead");
            }
            get decorationElements(): INoteDecorationElement[] {
                return this.getSpecialElements("NoteDecoration");
            }
            get longDecorationElements(): ILongDecorationElement[] {
                return this.getSpecialElements("LongDecoration");
            }
            get syllableElements(): ITextSyllableElement[] {
                return this.getSpecialElements("Syllable");
            }

            dotNo: number = 0;
            absTime: AbsoluteTime = null;
            rest = false;
            public graceType: string;
            private beams: IBeam[] = [];
            private stemDirection = StemDirectionType.StemFree;

            get Beams() { return this.beams; }

            /*public VisitAll(visitor: IVisitorIterator) {
                super.VisitAll(visitor);

                for (var i = 0; i < this.beams.length; i++) {
                    //this.beams[i].VisitAll(visitor);
                    visitor.VisitPre(this.beams[i]);
                }
            }*/

            getElementName() { return "Note"; }

            public withHeads(globalContext: IGlobalContext, f: (head: INotehead, index: number) => void) {
                this.visitAll(new NoteHeadVisitor(globalContext, f));
                /*for (var i = 0; i < this.noteheadElements.length; i++) {
                    f(this.noteheadElements[i], i);
                }*/
            }

            public withDecorations(globalContext: IGlobalContext, f: (deco: INoteDecorationElement, index: number) => void) {
                this.visitAll(new NoteDecorationVisitor(globalContext,f));
                /*for (var i = 0; i < this.decorationElements.length; i++) {
                    f(this.decorationElements[i], i);
                }*/
            }

            public withLongDecorations(globalContext: IGlobalContext, f: (deco: ILongDecorationElement, index: number) => void) {
                this.visitAll(new LongDecorationVisitor(globalContext,f));
                /*for (var i = 0; i < this.longDecorationElements.length; i++) {
                    f(this.longDecorationElements[i], i);
                }*/
            }

            public withSyllables(globalContext: IGlobalContext, f: (syll: ITextSyllableElement, index: number) => void) {
                this.visitAll(new TextSyllableVisitor(globalContext,f));
                /*for (var i = 0; i < this.syllableElements.length; i++) {
                    f(this.syllableElements[i], i);
                }*/
            }

            public getBeamspan(): number[] {
                var bs = this.getProperty('beamspan'); // this.beamspan; 
                if (bs) return bs;
                return [0];
            }
            public setBeamspan(beamspan: number[]) {
                this.setProperty('beamspan', beamspan);
                /*
                if (this.beamspan != beamspan) {
                    this.beamspan = beamspan;
                    this.sendEvent({ type: MusicEventType.eventType.attributeChanged, sender: this, attribute: "beamspan" });
                } //*/
            }

            /*private getChild(i: number): INotehead {
                return this.noteheadElements[i];
            }
            private getChildren(): INotehead[] {
                return this.noteheadElements;
            }*/
            debug() {
                var string = "N" + this.noteId + "(";
                for (var i = 0; i < this.noteheadElements.length; i++) {
                    string += this.noteheadElements[i].debug();
                }
                string += ") ";
                return string;
            }
            setDots(no: number) {
                if (no != this.dotNo) {
                    this.dotNo = no;
                    //this.changed();
                }
            }

            matchesOnePitch(pitch: Pitch, ignoreAlteration: boolean = false) {
                if (this.rest) return false;
                if (this.noteheadElements.length != 1) return false;
                if (this.noteheadElements[0].matchesPitch(pitch, ignoreAlteration)) return true;
                return false;
            }
            matchesPitch(pitch: Pitch, ignoreAlteration: boolean = false) {
                if (this.rest) return true;
                for (var i = 0; i < this.noteheadElements.length; i++) {
                    if (this.noteheadElements[i].matchesPitch(pitch, ignoreAlteration)) return true;
                }
                return false;
            }
            public setRest(newRest: boolean) {
                if (this.rest != newRest) {
                    this.rest = newRest;
                    //if (!this.rest) {
                    // fjern pause og tilføj hals 
                 //   this.changed();
                    //}
                }
            }
            public getStemDirection(): StemDirectionType {
                if (this.Beams && this.Beams[0] && this.Beams[0].parent && this.Beams[0].parent !== this)
                    return this.Beams[0].parent.getStemDirection();
                return this.stemDirection;
            }
            public setStemDirection(dir: StemDirectionType) {
                if (this.stemDirection != dir) {
                    this.stemDirection = dir;
             //       this.changed();
                }
            }
            /*setRev(force: boolean, newRev: boolean) {
                var changed = false;
                if (this.forceRev != force) {
                    this.forceRev = force;
                    changed = true;
                }
                if (force && (this.rev != newRev)) {
                    this.rev = newRev;
                    changed = true;
                }
                if (changed) {
                    this.sendEvent({type: MusicEventType.eventType.recalc, sender: this});
                }
            }*/
            setPitch(pitch: Pitch): INotehead {
                if (this.rest) {
                    return null;
                }
                else {
                    for (var i = 0; i < this.noteheadElements.length; i++) {
                        if (this.noteheadElements[i].getPitch().equals(pitch)) return this.noteheadElements[i];
                    }
                    var newpitch = new NoteheadElement(this, pitch);
                    //newpitch.setPitch(pitch);
                    //newpitch.setDots(this.dotNo);
                    this.addChild(newpitch);
                //    this.changed();
                    return newpitch;
                }
            }
            getTimeVal(): TimeSpan {
                if (this.graceType) return new TimeSpan(0);
                var timeVal = this.timeVal;
                if (this.dotNo > 0) timeVal = timeVal.add(this.timeVal.divideScalar(2));
                if (this.dotNo > 1) timeVal = timeVal.add(this.timeVal.divideScalar(4));
                if (this.dotNo > 2) timeVal = timeVal.add(this.timeVal.divideScalar(8));
                if (this.tupletDef) {
                    timeVal = timeVal.multiplyRational(this.tupletDef.fraction);
                }
                return timeVal;
            }

        }


        // NoteheadElement
        export class NoteheadElement extends MusicElement implements INotehead {
            constructor(public parent: INote/*, noteId: string*/, public pitch: Pitch) {
                super(parent);
            }
            getInfo(): INoteHeadInfo {
                return new NoteHeadInfo(this);/* {
                    id: this.id,
                    source: this,
                    pitch: this.pitch,
                    //visit: (visitor: IEventVisitor) => { this.inviteEventVisitor(visitor); }
                };*/
            }


            static createFromMemento(parent: INote, memento: IMemento): NoteheadElement {
                var pitch = new Pitch(memento.def.p, memento.def.a);
                var head = new NoteheadElement(parent,pitch);
                //head.setDots(parent.dotNo);
                if (memento.def.tie) head.tie = true;
                if (memento.def.tieForced) head.tieForced = true;
                if (memento.def.forceAcc) head.forceAccidental = true;
                if (parent) parent.addChild(head);
                return head;
            }
            
            public tie: boolean = false;
            public tieForced: boolean = false;
            public forceAccidental: boolean = false;
            public showAccidental: boolean = true;

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitNoteHead(this);
            }

            getElementName() {
                return "Notehead";
            }
            debug() {
                return this.pitch.debug() + ' ';
            }
            matchesPitch(pitch: Pitch, ignoreAlteration: boolean = false): boolean {
                return this.pitch.equals(pitch, ignoreAlteration);
            }
            getPitch(): Pitch {
                return this.pitch;
            }

            setPitch(pitch: Pitch) {
                this.pitch = pitch;
        //        this.moved();
            }
            recalc() {
        //        this.changed();
            }
            public getAccidental(): string { // todo: use StaffContext.Key
                if (this.forceAccidental || this.showAccidental) {
                    return this.pitch.alteration ? this.pitch.alteration : "n";
                }
                else {
                    return "";
                }
            }
            public doGetMemento(): any {
                var val: any = {
                    p: this.pitch.pitch,
                    a: this.pitch.alteration
                };
                if (this.forceAccidental) { val.forceAcc = true; }
                if (this.tie) { val.tie = true; }
                if (this.tieForced) { val.tieForced = true; }
                return val;
            }
        }


        /** Note decoration, e.g. staccato dot, fermata */
        export class NoteDecorationElement extends MusicElement implements INoteDecorationElement {
            constructor(public parent: INote, private notedecorationId: NoteDecorationKind) {
                super(parent);
            }

            getInfo(): INoteDecorationEventInfo{
                return new NoteDecorationEventInfo(this);/* {
                    id: this.id,
                    source: this,
                    relTime: null
                };*/
            }


            public inviteVisitor(visitor: IVisitor) {
                visitor.visitNoteDecoration(this);
            }

            static createFromMemento(parent: INote, memento: IMemento): INoteDecorationElement {
                var deco = new NoteDecorationElement(parent, memento.def.id);
                if (memento.def.placement) deco.placement = memento.def.placement;
                if (parent) parent.addChild(deco);
                return deco;
            }
            public doGetMemento(): any {
                var val: any = {
                    id: this.notedecorationId
                };
                if (this.placement) { val.placement = this.placement; }
                return val;
            }

            /** "over", "under" or null */
            public placement: string;

            public getDecorationId(): NoteDecorationKind {
                return this.notedecorationId;
            }
            /*public setDecorationId(id: string) {
                if (this.notedecorationId !== id) {
                    this.notedecorationId = id;
                    this.changed();
                }
            }*/
            public getElementName() { return "NoteDecoration"; }
        }


        /** Long note decoration implementation, e.g. hairpin, trill extension and slur */
        export class NoteLongDecorationElement extends MusicElement implements ILongDecorationElement {
            constructor(public parent: INote, private duration: TimeSpan, public type: LongDecorationType) {
                super(parent);
            }

            getInfo(): ILongDecorationEventInfo {
                return new LongDecorationEventInfo(this);/* {
                    id: this.id,
                    source: this
                };*/
            }


            public inviteVisitor(visitor: IVisitor) {
                visitor.visitLongDecoration(this);
            }

            static createFromMemento(parent: INote, memento: IMemento): ILongDecorationElement {
                var duration = TimeSpan.createFromMemento(memento.def.dur);
                var deco = new NoteLongDecorationElement(parent, duration, memento.def.type);
                if (memento.def.placement) deco.placement = memento.def.placement;
                if (parent) parent.addChild(deco);
                return deco;
            }
            public doGetMemento(): any {
                var val: any = {
                    type: this.type,
                    dur: this.duration.getMemento()
                };
                if (this.placement) { val.placement = this.placement; }
                return val;
            }
            public placement: string;

            public getEndEvent(noteFinder: INoteFinder): ITimedEvent {
                var note = this.parent;
                var endTime = note.absTime.add(this.duration);
                while (note) {
                    var newNote = noteFinder.nextNote(note);
                    if (newNote && endTime.gt(note.absTime)) {
                        note = newNote;
                    }
                    else return note;
                }
                return null;
            }

            public getElementName() { return "NoteLongDecoration"; }
        }


        /** Text syllable from lyrics, shown under or over a note */
        export class TextSyllableElement extends MusicElement implements ITextSyllableElement {
            constructor(public parent: INote, private text: string) {
                super(parent);
            }

            getInfo(): ITextSyllableEventInfo {
                return new TextSyllableEventInfo(this);/*{
                    id: this.id,
                    source: this
                };*/
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitTextSyllable(this);
            }

            static createFromMemento(parent: INote, memento: IMemento): ITextSyllableElement {
                var deco = new TextSyllableElement(parent, memento.def.text);
                if (memento.def.placement) deco.placement = memento.def.placement;
                if (parent) parent.addChild(deco);
                return deco;
            }
            public doGetMemento(): any {
                var val: any = {
                    text: this.text
                };
                if (this.placement) { val.placement = this.placement; }
                return val;
            }


            public placement: string;
            public get Text(): string {
                return this.text;
            }
            public set Text(id: string) {
                if (this.text !== id) {
                    this.text = id
                //    this.changed();
                }
            }
            public getElementName(): string { return "TextSyllable"; }
        }
