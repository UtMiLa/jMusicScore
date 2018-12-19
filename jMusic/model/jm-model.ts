/** logical music definition classes and classes for music concepts */
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

import { MusicElement, GlobalContext, MusicContainer, StaffVisitor, VoiceVisitor, MeterVisitor, BarVisitor, KeyVisitor, ClefVisitor, TimedEventVisitor, StructuralNoteVisitor, NoteHeadVisitor, NoteDecorationVisitor, LongDecorationVisitor, TextSyllableVisitor, EventInfo, StructuralStaffVisitor, StructuralVoiceVisitor, KeyEventVisitor, ClefEventVisitor } from './jm-model-base';
import { NoteDecorationElement, NoteLongDecorationElement, TextSyllableElement, NoteElement, NoteheadElement } from './jm-model-notes';


        /*
        Linked list i stedet for Array:

        notehead -> nextHead, lastHead (?)
        note -> nextNote, prevNote, nextEvent, prevEvent, firstHead, lastHead
        bar -> nextBar, prevBar, nextEvent, prevEvent
        voice -> firstNote, lastNote
        staff -> firstVoice, lastVoice
        score -> firstStaff, lastStaff, firstVoice, lastVoice, firstKey, firstMeter, firstClef, firstBar
        notelink: LinkedList<INote>
         */
class BarEventInfo extends EventInfo implements IBarEventInfo{
    source: BarElement;
        
    constructor(source: BarElement){
        super();
        this.source = source;
        this.id = source.id;
        //{ source: this, id: this.id, visitAllEvents: undefined, relTime: this.absTime.fromStart(), getTimeVal: () => { return TimeSpan.noTime;} }
    }

    clone(addId: string): IBarEventInfo {
        let res = new BarEventInfo(this.source);
        res.id = addId + '_' + res.id;
        return res;
    }
    inviteEventVisitor(visitor: IEventVisitor): void {
        visitor.visitBarInfo(this);
    }
}
class ClefEventInfo extends EventInfo implements IClefEventInfo{
    source: ClefElement;
        
    constructor(source: ClefElement){
        super();
        this.source = source;
        this.id = source.id;
    }
    //{ source: this, id: this.id, visitAllEvents: undefined, relTime: this.absTime.fromStart(), }
    getTimeVal(): TimeSpan {
        return TimeSpan.noTime;
    }
    clone(addId: string): IClefEventInfo {
        let res = new ClefEventInfo(this.source);
        res.id = addId + '_' + res.id;
        return res;
    }
    inviteEventVisitor(visitor: IEventVisitor): void {
        visitor.visitClefInfo(this);
    }
}
class MeterEventInfo extends EventInfo implements IMeterEventInfo{
    nextBar(barTime: AbsoluteTime): AbsoluteTime {
        return this.source.nextBar(barTime);
    }
    getMeasureTime(): TimeSpan {
        return this.source.getMeasureTime();
    }
    get definition(): IMeterDefinition { return this.source.definition; }
    get absTime(): AbsoluteTime { return this.source.absTime; }
    source: IMeter;
        
    constructor(source: IMeter){
        super();
        this.source = source;
        this.id = source.id;
    }
    // { source: this, id: this.id, visitAllEvents: undefined, relTime: this.absTime.fromStart(), }
    
    getTimeVal(): TimeSpan {
        return TimeSpan.noTime;
    }
    clone(addId: string): IMeterEventInfo {
        let res = new MeterEventInfo(this.source);
        res.id = addId + '_' + res.id;
        return res;
    }
    inviteEventVisitor(visitor: IEventVisitor): void {
        if (!visitor.visitMeterInfo){
            alert("mangler visitor.visitMeterInfo");
            debugger;
            return;
        }
        visitor.visitMeterInfo(this);
    }
}
class StaffExpressionEventInfo extends EventInfo implements IStaffExpressionEventInfo{
    source: StaffExpression;
        
    constructor(source: StaffExpression){
        super();
        this.source = source;
        this.id = source.id; 
    }
    //{ source: this, id: this.id, visitAllEvents: undefined, relTime: this.absTime.fromStart(),}
    
    getTimeVal(): TimeSpan {
        return TimeSpan.noTime;
    }
    clone(addId: string): IStaffExpressionEventInfo {
        let res = new StaffExpressionEventInfo(this.source);
        res.id = addId + '_' + res.id;
        return res;
    }
    inviteEventVisitor(visitor: IEventVisitor): void {
        visitor.visitStaffExpressionInfo(this);
    }
}
class KeyEventInfo extends EventInfo implements IKeyEventInfo{
    source: KeyElement;
        
    constructor(source: KeyElement){
        super();
        this.source = source;
        this.id = source.id;
    }
    // { source: this, id: this.id, visitAllEvents: undefined, relTime: this.absTime.fromStart(),  }


    getTimeVal(): TimeSpan {
        return TimeSpan.noTime;
    }
    clone(addId: string): IKeyEventInfo {
        let res = new KeyEventInfo(this.source);
        res.id = addId + '_' + res.id;
        return res;
    }
    inviteEventVisitor(visitor: IEventVisitor): void {
        visitor.visitKeyInfo(this);
    }
}
/**************************************************** MusicElement stuff ****************************************************/

        class BarElement extends MusicElement implements IBar {
            getEvents(): IEventInfo[] {
                let info: IBarEventInfo = new BarEventInfo(this);
                info.visitAllEvents = (visitor: IEventVisitor) => {visitor.visitBarInfo(info)};
                return [info];
            }

            constructor(public parent: IScore, public absTime: AbsoluteTime) {
                super(parent);
            }
            static createFromMemento(parent: IScore, memento: IMemento): IBar {
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                var bar = new BarElement(parent, absTime);
                if (parent) parent.addChild(bar);
                return bar;
            }
            public doGetMemento(): any {
                var val: any = {
                    abs: this.absTime.getMemento()
                };
                return val;
            }

            getElementName(): string { return "Bar"; }
            debug(): string { return "|" }
            public getSortOrder() {
                return this.absTime.numerator ? 70 : 10;
            }
            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return null; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitBar(this);
            }
        }

        //  *  OK  *
        export class ScoreElement extends MusicContainer implements IScore {
            getMeterElements(globalContext: IGlobalContext): IMeterEventInfo[] {
                let meters: IMeterEventInfo[] = [];
                this.withAllMeters((f) => {
                    meters.push(f);
                }, globalContext);
                return meters;
            }
            constructor(public parent: IMusicElement, public globalContext: IGlobalContext) {
                super(parent);
            }
            public bars: IBar[] = [];
            get staffElements(): IStaff[] {
                return this.getSpecialElements("Staff");
            }
            get meterElements(): IMeter[] {
                return this.getSpecialElements("Meter");
            }
            public title: string;
            public composer: string;
            public author: string;
            public subTitle: string;
            public metadata = {};

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitScore(this);
            }

            static createFromMemento(parent: IMusicElement, memento: IMemento, globalContext: IGlobalContext): IScore {
                var score: IScore = new ScoreElement(parent, globalContext);
                if (memento.def) {
                    score.title = memento.def.title;
                    score.composer = memento.def.composer;
                    score.author = memento.def.author;
                    score.subTitle = memento.def.subTitle;
                    if (memento.def.metadata) {
                        score.metadata = memento.def.metadata;
                    }
                }

                return score;
            }

            public doGetMemento(): any {
                var val: any = {};
                val.title = this.title;
                val.composer = this.composer;
                val.author = this.author;
                val.subTitle = this.subTitle;                
                if (this.metadata !== {}) {
                    val.metadata =  this.metadata;
                }
                return val;
            }


            public clear() {
                while (this.removeThisChildren.length)
                    this.removeChild(this.removeThisChildren[0]);
                this.metadata = {};
            }
            
            public findBar(absTime: AbsoluteTime): IBar {
                this.withBars((bar: IBar) => {
                    if (bar.absTime.eq(absTime)) return bar;
                });
                return null;
            }

            public static placeInOrder(score: IScore, staff: IStaff, index: number) {
                // Insert staff at index position
                if (score.staffElements[index] !== staff) {
                    var oldIndex = score.staffElements.indexOf(staff);
                    if (oldIndex >= 0) {
                        score.staffElements.splice(oldIndex, 1);
                    }
                    score.staffElements.splice(index, 0, staff);
                }
            }

            public getEvents(globalContext: IGlobalContext/*, ignoreStaves = false*/): IEventInfo[] {
                var events: IEventInfo[] = [];
                //if (!ignoreStaves) {
                    this.withStaves((staff: IStaff) => {
                        events = events.concat(staff.getEvents(globalContext));
                    }, globalContext);
                //}
                this.bars.forEach((value) => { events = events.concat(value.getEvents(globalContext)); });
                this.meterElements.forEach((value) => { events = events.concat(value.getEvents(globalContext)); });                
                return events;
            }
            public getEventsOld(globalContext: IGlobalContext, ignoreStaves = false): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!ignoreStaves) {
                    this.withStaves((staff: IStaff) => {
                        events = events.concat(staff.getEventsOld(globalContext));
                    }, globalContext);
                }
                events = events.concat(this.bars);
                events = events.concat(this.meterElements);
                return events;
            }
            
            public withStaves(f: (staff: IStaff, index: number) => void, globalContext: IGlobalContext) {
                this.visitAll(new StructuralStaffVisitor(f));

                /*for (var i = 0; i < this.staffElements.length; i++) {
                    f(this.staffElements[i], i);
                }*/
            }

            public withVoices(f: (voice: IVoice, index: number) => void, globalContext: IGlobalContext) {
                this.visitAll(new StructuralVoiceVisitor(f));
                /*this.withStaves((staff: IStaff, index: number): void => {
                    staff.withVoices(f);
                });*/
            }

            /*public withMeters(f: (meter: IMeterEventInfo, index: number) => void, globalContext: IGlobalContext) {
                //this.visitAllEvents(new MeterVisitor(f, globalContext), globalContext);
                var meters = <IMeter[]>this.getSpecialElements("Meter");
                //this.visitAllEvents(new MeterVisitor(f, globalContext), globalContext);
                for (var i = 0; i < meters.length; i++) {
                    const meterEvents = meters[i].getEvents(globalContext);
                    for (var j = 0; j < meterEvents.length; j++) {
                        f(meterEvents[j], i);
                    }
                }
            }*/

            public withBars(f: (bar: IBar, index: number) => void) {
                this.visitAll(new BarVisitor(f));
                /*for (var i = 0; i < this.bars.length; i++) {
                    f(this.bars[i], i);
                }*/
            }

            public removeBars(f: (bar: IBar, index: number) => boolean) {
                for (var i = this.bars.length - 1; i >= 0; i--) {
                    if (f(this.bars[i], i)) this.removeChild(this.bars[i]);
                }
            }

            public updateBars() {

            }

            public addStaff(clefDef: ClefDefinition): IStaff {
                var staff = new StaffElement(this);
                this.addChild(staff);
                var clef: IClef = new ClefElement(staff, clefDef);
                staff.addChild(clef);
                /*for (var i = 0; i < this.bars.length; i++)
                    this.bars[i].changed();*/
                return staff;
            }
            public setMeter(meter: IMeterDefinition, absTime: AbsoluteTime) {
                if (!absTime) absTime = AbsoluteTime.startTime;

                let meterElements = this.meterElements;

                for (var i = 0; i < meterElements.length; i++) {
                    if (meterElements[i].absTime.eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.meterElements[i] });
                        this.removeChild(meterElements[i]);
                        /*meterElements[i].remove();
                        meterElements.splice(i, 1);*/
                    }
                }
                var meterRef = new MeterElement(this, meter, absTime);
                this.addChild(meterRef);
            }

            public getElementName() {
                return "Score";
            }
            public addBarLine(absTime: AbsoluteTime) {
                this.addChild(new BarElement(this, absTime));
            }

            public setKey(key: IKeyDefinition, absTime: AbsoluteTime, globalContext: IGlobalContext) {
                this.withStaves((staff: IStaff) => { 
                    staff.setKey(key, absTime);
                }, globalContext);
            }

            protected visitChildEvents(visitor: IEventVisitor, globalContext: IGlobalContext){
                this.withStaves((child: IStaff) => {
                    child.visitAllEvents(visitor, globalContext);
                }, globalContext);
                this.withOwnMeters((child: IMeter) => {
                    let events = child.getEvents(globalContext);
                    for (let i = 0; i < events.length; i++) {
                        events[i].inviteEventVisitor(visitor);
                    }
                });
            }
        
        }

        class StaffElement extends MusicContainer implements IStaff {
            constructor(public parent: IScore) {
                super(parent);
            }
            private keyRef: IKey;

            get clefElements(): IClef[] {
                return this.getSpecialElements("Clef");
            }
            /*get meterElements(): IMeter[] {
                var res: IMeter[] = [];
                this.withMeters((meter: IMeterEventInfo, index: number) => {
                    res.push(meter.source);
                }, globalContext);
                return res;
            }*/
            get keyElements(): IKey[] {
                return this.getSpecialElements("Key");
            }
            get voiceElements(): IVoice[] {
                return this.getSpecialElements("Voice");
            }


            private expressions: IStaffExpression[] = [];
            public title: string;

            static createFromMemento(parent: IScore, memento: IMemento): IStaff {
                var staff: IStaff = new StaffElement(parent);
                if (memento.def && memento.def.title) { staff.title = memento.def.title; }
                if (parent) parent.addChild(staff); // todo: at index
                return staff;
            }

            public doGetMemento(): any {
                var val: any;
                if (this.title) {
                    val = { title: this.title };
                }
                return val;
            }


            public inviteEventVisitor(visitor: IEventVisitor) {
                visitor.visitStaff(this);
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitStaff(this);
            }

            public withVoices(f: (voice: IVoice, index: number) => void, globalContext: IGlobalContext) {
                this.visitAll(new StructuralVoiceVisitor(f));
                /*for (var i = 0; i < this.voiceElements.length; i++) {
                    f(this.voiceElements[i], i);
                }*/
            }

            /*public withKeys(f: (key: IKeyEventInfo, index: number) => void, globalContext: IGlobalContext) {
                this.visitAllEvents(new KeyEventVisitor(f, globalContext), globalContext);
            }

            public withMeters(f: (meter: IMeterEventInfo, index: number) => void, globalContext: IGlobalContext) {
                var meters = <IMeter[]>this.getSpecialElements("Meter");
                //this.visitAllEvents(new MeterVisitor(f, globalContext), globalContext);
                for (var i = 0; i < meters.length; i++) {
                    const meterEvents = meters[i].getEvents(globalContext);
                    for (var j = 0; j < meterEvents.length; j++) {
                        f(meterEvents[j], i);
                    }
                }
            }

            public withClefs(f: (clef: IClefEventInfo, index: number) => void, globalContext: IGlobalContext) {
                this.visitAllEvents(new ClefEventVisitor(f, globalContext), globalContext);
            }*/

            public withTimedEvents(f: (ev: ITimedEvent, index: number) => void): void {
                this.visitAll(new TimedEventVisitor(f));
                /*for (var i = 0; i < this.keyElements.length; i++) {
                    f(this.keyElements[i], i);
                }
                for (var i = 0; i < this.meterElements.length; i++) {
                    f(this.meterElements[i], i);
                }
                for (var i = 0; i < this.clefElements.length; i++) {
                    f(this.clefElements[i], i);
                }
                for (var i = 0; i < this.expressions.length; i++) {
                    f(this.expressions[i], i);
                }*/
            }

            public getStaffContext(absTime: AbsoluteTime, globalContext: IGlobalContext): StaffContext {
                var clef: IClef;
                let clefElements= this.clefElements;
                clefElements.sort(Music.compareEventsOld);
                for (var i = 0; i < clefElements.length; i++) {
                    if (clefElements[i].absTime.gt(absTime)) break;
                    clef = clefElements[i];
                }
                var key: IKey;
                //var keys = this.keyElements.length ? this.keyElements : this.parent.keyElements;
                let keyElements = this.keyElements;
                keyElements.sort(Music.compareEventsOld);
                for (var i = 0; i < keyElements.length; i++) {
                    if (keyElements[i].absTime.gt(absTime)) break;
                    key = keyElements[i];
                }
                var meter: IMeter;
                var meters = this.getMeterElements(globalContext);
                if (!meters.length) { 
                    meters = this.parent.getMeterElements(globalContext); 
                }
                meters.sort(Music.compareEvents);
                var barNo = 0;
                var timeInBar = new TimeSpan(0);
                var oldTime = AbsoluteTime.startTime;
                var oldMeasureTime = new TimeSpan(1);
                for (var i = 0; i < meters.length; i++) {
                    if (meters[i].absTime.gt(absTime)) {
                        break;
                    }
                    var meterTime: TimeSpan = meters[i].absTime.diff(oldTime);
                    var deltaBars = i ? meterTime.divide(oldMeasureTime) : 0;
                    barNo += deltaBars;
                    oldTime = meters[i].absTime;
                    oldMeasureTime = meters[i].getMeasureTime();
                    meter = meters[i].source;
                }
                var deltaBars = Math.floor((absTime.diff(oldTime)).divide(oldMeasureTime));
                barNo += deltaBars;
                timeInBar = absTime.diff(oldTime).sub(oldMeasureTime.multiplyScalar(deltaBars));
                return new StaffContext(
                    clef ? clef.definition : undefined, 
                    key ? key.definition : undefined, 
                    meter ? meter.definition : undefined,
                    meter ? meter.absTime : AbsoluteTime.startTime,
                    barNo,
                    timeInBar);
            }
            public getMeterElements(globalContext: IGlobalContext): IMeterEventInfo[] {
                let meters:IMeterEventInfo[] = [];
                this.withAllMeters((f) => {
                    meters.push(f);
                }, globalContext);
                return meters;
            }
            public getKeyElements(): IKey[] {
                return this.keyElements;
            }
            public getEvents(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): IEventInfo[]{
                var events: IEventInfo[] = [];
                this.withVoices((voice: IVoice) => {
                    events = events.concat(voice.getEvents(globalContext));
                }, globalContext);
            
                this.getMeterElements(globalContext).forEach((value) => { events = events.concat(value); });                
                this.keyElements.forEach((value) => { events = events.concat(value.getEvents(globalContext)); });                
                this.clefElements.forEach((value) => { events = events.concat(value.getEvents(globalContext)); });                
                this.expressions.forEach((value) => { events = events.concat(value.getEvents(globalContext)); });                
                return events;
            }
            public getEventsOld(globalContext: IGlobalContext, fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;

                this.withVoices((voice: IVoice, index: number) => {
                    events = events.concat(voice.getEventsOld(globalContext, fromTime, toTime));
                }, globalContext);

                var f = (elm: ITimedEvent, index: number) => {
                    if (elm.absTime.ge(fromTime) && toTime.gt(elm.absTime)) events.push(elm);
                }

                this.withTimedEvents(f);

                return events;
            }
            public getElementName() { return "Staff"; }
            public addVoice(): IVoice {
                var voice = new VoiceElement(this);
                this.addChild(voice);
                return voice;
            }

            public setMeter(meter: IMeterDefinition, absTime: AbsoluteTime, globalContext: IGlobalContext) {
                if (!absTime) absTime = AbsoluteTime.startTime;
                let meterElements = this.getMeterElements(globalContext);
                for (var i = 0; i < meterElements.length; i++) {
                    if (meterElements[i].source.absTime.eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.meterElements[i] });
                        this.removeChild(meterElements[i].source);
                        /*meterElements[i].remove();
                        meterElements.splice(i, 1);*/
                    }
                }
                var meterRef = new MeterElement(this, meter, absTime);
                //meterRef.changed();
                this.addChild(meterRef);
            }
            public setStaffExpression(type: string, absTime: AbsoluteTime): IStaffExpression {
                var exp = new StaffExpression(this, type, absTime);
                this.addChild(exp);
                return exp;
            }
            public setClef(type: ClefDefinition, absTime: AbsoluteTime) {
                if (!absTime) absTime = new AbsoluteTime(0, 1);
                var prevClef: IClef;
                for (var i = 0; i < this.clefElements.length; i++) {
                    var clef = this.clefElements[i];
                    if (absTime.gt(clef.absTime) && (!prevClef || clef.absTime.gt(prevClef.absTime))) {
                        prevClef = clef;
                    }
                    if (clef.absTime.eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.clefElements[i] });
                        clef.remove();
                        this.clefElements.splice(i, 1);
                    }
                }
                if (prevClef && prevClef.definition.eq(type)) {
                    // no change
                    return;
                }
                var clefRef = new ClefElement(this, type, absTime);
                //clefRef.changed();
                this.addChild(clefRef);
            }
            public setKey(key: IKeyDefinition, absTime: AbsoluteTime) {
                for (var i = 0; i < this.keyElements.length; i++) {
                    if (this.keyElements[i].absTime.eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.keyElements[i] });
                        this.keyElements[i].remove();
                        this.keyElements.splice(i, 1);
                    }
                }
                var keyRef = new KeyElement(this, key, absTime);
                //keyRef.changed();
                this.addChild(keyRef);
            }

            protected visitChildEvents(visitor: IEventVisitor, globalContext: IGlobalContext){
                //console.log("staff.visitChildEvents", this);

                const voices = <IVoice[]>this.getSpecialElements("Voice");
                for (var i = 0; i < voices.length; i++){
                    voices[i].visitAllEvents(visitor, globalContext);
                }
                const keys = <IKey[]>this.getSpecialElements("Key");
                for (var i = 0; i < keys.length; i++){
                    const keyEvents = keys[i].getEvents(globalContext);
                    for (var j = 0; j < keyEvents.length; j++){
                        const event = keyEvents[j];
                        event.inviteEventVisitor(visitor);
                    }
                }
                this.withOwnMeters((child: IMeter) => {
                    let events = child.getEvents(globalContext);
                    for (let i = 0; i < events.length; i++) {
                        events[i].inviteEventVisitor(visitor);
                    }
                });

                this.withOwnClefs((child: IClef) => {
                    let events = child.getEvents(globalContext);
                    for (let i = 0; i < events.length; i++) {
                        events[i].inviteEventVisitor(visitor);
                    }
                });

            }

        }


        class StaffExpression extends MusicElement implements IStaffExpression {
            constructor(public parent: IStaff, public text: string, public absTime: AbsoluteTime) {
                super(parent);
            }

            getEvents(): IEventInfo[] {
                let info: IStaffExpressionEventInfo = new StaffExpressionEventInfo(this);
                //info.visitAllEvents = (visitor: IEventVisitor) => {visitor.visitStaffExpressionInfo(info)};
                return [info];
            }


            visit(visitor: IVisitor): void{
                this.inviteVisitor(visitor);
            }

            public getElementName() { return "StaffExpression"; }
            public getSortOrder() {
                return 99;
            }
            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return this.parent; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitStaffExpression(this);
            }
            static createFromMemento(parent: IStaff, memento: IMemento): IStaffExpression {
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                //var exp = new StaffExpression(parent, memento.def.text, absTime);

                //if (memento.def.placement) deco.placement = memento.def.placement;
                //if (parent) parent.addChild(parent.setStaffExpression, exp);
                var exp = parent.setStaffExpression(memento.def.text, absTime);
                return exp;
            }
            public doGetMemento(): any {
                var val: any = {
                    text: this.text,
                    abs: this.absTime.getMemento()
                };
                //if (this.placement) { val.placement = this.placement; }
                return val;
            }
        }


        // VoiceElement
        class VoiceElement extends MusicContainer implements IVoice {
            constructor(public parent: IStaff) {
                super(parent);
                //this.meterElements = { push: (meter: MeterElement) => { parent.addChild(parent.meterElements, meter); } };
                this.addChild(this.sequence);
            }

            static createFromMemento(parent: IStaff, memento: IMemento): IVoice {
                var voice: IVoice = new VoiceElement(parent);
                if (memento.def && memento.def.stem) { voice.setStemDirection(memento.def.stem); }
                if (parent) parent.addChild(voice); // todo: at index
                return voice;
            }

            public doGetMemento(): any {
                var val: any;
                if (this.stemDirection) {
                    val = { stem: this.stemDirection };
                }
                return val;
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitVoice(this);
            }

            public inviteEventVisitor(visitor: IEventVisitor) {
                visitor.visitVoice(this);
            }

            private sequence = new SequenceElement(this);

            public getSequence(id: string): ISequence { //todo: multi sqeuences
                return this.sequence;
            }

            private stemDirection: StemDirectionType = StemDirectionType.StemFree;
            //public meterElements: { push: (meter: MeterElement) => void; };

            public getNoteElements(globalContext: IGlobalContext): INote[] {
                let res: INote[] = [];
                this.withNotes(globalContext, (note, index) => {res.push(note);})
                return res;
            }


            get noteElements(): INote[] {
                return this.getSpecialElements("Note");
            }

            public withNotes(globalContext: IGlobalContext, f: (note: INoteSource, context: INoteContext, index: number) => void) {
                /*const enumerator = new EventEnumerator(globalContext);
                enumerator.doVoice(this, new NoteVisitor(globalContext, f));*/
                this.visitAll(new StructuralNoteVisitor(globalContext, f));
            }

            public addChild(theChild: IMusicElement, before: IMusicElement = null, removeOrig: boolean = false): void {
                //if (theChild.getElementName() === "Note" /*|| theChild.getElementName() === "Sequence"*/) {
                if (theChild !== this.sequence) {
                    this.sequence.addChild(theChild, before, removeOrig);    
                }
                else super.addChild(theChild, before, removeOrig);
            }

            public getStemDirection(): StemDirectionType {
                return this.stemDirection;
            }
            public setStemDirection(dir: StemDirectionType) {
                if (this.stemDirection != dir) {
                    this.stemDirection = dir;
                //    this.changed();
                }
            }

            public getEvents(globalContext: IGlobalContext, fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): IEventInfo[] {
                var events: IEventInfo[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;
                this.withChildren((child) => {
                    let addedEvents = (<IEventEnumerator><any>child).getEvents(globalContext);
                    events = events.concat(addedEvents);
                });
                /*this.withNotes(globalContext, (note: INoteSource, context: INoteContext, index: number) => {
                    if (!fromTime.gt(context.absTime) && toTime.gt(context.absTime)) {
                        events.concat(note.getEvents(globalContext));
                    }
                });*/
                return events;
            }


            public getEventsOld(globalContext: IGlobalContext, fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;
                this.withNotes(globalContext, (note: INoteSource, context: INoteContext, index: number) => {
                    if (!fromTime.gt(context.absTime) && toTime.gt(context.absTime)) {
                        events.push(<any>note);
                    }
                });
                return events;
            }
            public getElementName() { return "Voice"; }

            public getEndTime(globalContext: IGlobalContext): AbsoluteTime {
                let noteElements = this.getNoteElements(globalContext);
                if (noteElements.length) {
                    var lastNote = noteElements[noteElements.length - 1];
                    return lastNote.absTime.add(lastNote.getTimeVal());
                }
                else return AbsoluteTime.startTime;
            }

            public addEvent(event: ITimedEvent) {
                this.sequence.addEvent(event);
            }


            public addNote(globalContext: IGlobalContext, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote?: INote, insert?: boolean, dots?: number, tuplet?: TupletDef, segmentId?: string): ISequenceNote{
                let segment = this.getSequence(segmentId);
                let seqNote = segment.addNote(globalContext, noteType, absTime, noteId, timeVal, beforeNote, insert, dots, tuplet);
                return seqNote; // new NoteProxy(seqNote, this);
            }
            protected visitChildEvents(visitor: IEventVisitor, globalContext: IGlobalContext){
                this.sequence.visitAllEvents(visitor, globalContext);
            }

        }

        // SequenceElement
        class SequenceElement extends MusicContainer implements ISequence {
            constructor(public parent: IVoice | ISequence) {
                super(parent);
            }
            public absTime: AbsoluteTime;
            //debug(): string { return }
            getSortOrder() { return 100; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }

            static createFromMemento(parent: IVoice, memento: IMemento): ISequence {
                var seq = new SequenceElement(parent);
                //if (memento.def && memento.def.stem) { voice.setStemDirection(memento.def.stem); }
                if (parent) {
                    if (parent.getElementName() === "Staff") {
                        let voice = new VoiceElement(<IStaff><any>parent);
                        //voice.setSequence(seq);
                        voice.addChild(seq);
                        seq.parent = voice;
                        parent.addChild(voice);
                    }
                    /*else if ((<ISequence><any>parent).noteElements) {
                        parent.addChild(seq); // todo: at index
                    }*/
                    else {
                        parent.addChild(seq); // todo: at index
                    }
                }
                return seq;
            }

            public doGetMemento(): any {
                var val: any;
                if (this.stemDirection) {
                    val = { stem: this.stemDirection };
                }
                return val;
            }

            public inviteEventVisitor(visitor: IEventVisitor, globalContext: IGlobalContext) {
                visitor.visitSequence(this, globalContext);
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitDefault(this);
            }

            get noteElements(): INote[] {
                return this.getSpecialElements("Note");
            }

            public getNoteElements(globalContext: IGlobalContext): INote[] { 
                var res: INote[] = [];
                this.withNotes(globalContext, (note) => {
                    res.push(note);
                });
                return res;
            };
            private stemDirection: StemDirectionType = StemDirectionType.StemFree;

            public withNotes(globalContext: IGlobalContext, f: (note: INoteSource, context: INoteContext, index: number) => void) {
                /*const enumerator = new EventEnumerator(globalContext);
                enumerator.doSequence(this, new NoteVisitor(globalContext, f));*/

                this.visitAll(new StructuralNoteVisitor(globalContext, f));
            }
            public getStemDirection(): StemDirectionType {
                return this.stemDirection;
            }
            public setStemDirection(dir: StemDirectionType) {
                if (this.stemDirection != dir) {
                    this.stemDirection = dir;
                //    this.changed();
                }
            }

            private updateEvents(events: IEventInfo[]){
                let time = new TimeSpan(0, 1);
                for(var i = 0; i < events.length; i++){
                    events[i].relTime = time;//events[i].absTime.add(this.absTime)
                    time = time.add(events[i].getTimeVal())
                }
            }

            public getEvents(globalContext: IGlobalContext, fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): IEventInfo[] {
                var events: IEventInfo[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;
                this.withChildren((child) => {
                    let addedEvents = (<IEventEnumerator><any>child).getEvents(globalContext);
                    events = events.concat(addedEvents);
                });
                this.updateEvents(events);
                return events;
            }
            public getEventsOld(globalContext: IGlobalContext, fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;
                this.withNotes(globalContext, (note: INoteSource, context: INoteContext, index: number) => {
                    if (!fromTime.gt(context.absTime) && toTime.gt(context.absTime)) {
                        events.push(context);
                    }
                });
                return events;
            }
            public getElementName() { return "Sequence"; }

            public getEndTime(): AbsoluteTime {
                if (this.noteElements.length) {
                    var lastNote = this.noteElements[this.noteElements.length - 1];
                    return lastNote.absTime.add(lastNote.getTimeVal());
                }
                else return AbsoluteTime.startTime;
            }


            public addEvent(event: ITimedEvent){
                //this.children.push(<INote>event);
                this.addChild(event);
            }


            public addNote(globalContext: IGlobalContext, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote: INote = null, insert: boolean = true, dots: number = 0, tuplet: TupletDef = null): ISequenceNote {
                if (!absTime){
                    absTime = this.getEndTime();
                }
                var note = new NoteElement(this, noteId, timeVal);
                note.absTime = absTime;

                note.tupletDef = tuplet;            

                var fraction = Music.inTupletArea(globalContext, this, absTime);
                if (fraction) {
                    note.tupletDef = new TupletDef(null, fraction);
                }
                var voiceTime = this.getEndTime();
                if (absTime.gt(voiceTime)) {
                    // add placeholders between voiceTime and absTime
                    var restNote = new NoteElement(null, 'hidden', absTime.diff(voiceTime));
                    restNote.setParent(this);
                    restNote.setRest(true);
                    restNote.absTime = AbsoluteTime.startTime;
                    this.addChild(restNote, null, false); // todo: change
                }
                var oldNote: INote = beforeNote;
                if (!oldNote && voiceTime.gt(absTime)) {
                    // find note at absTime
                    oldNote = Music.findNote(globalContext, this, absTime);
                    // if placeholder shorten it
                    if (oldNote) { // todo: shorten placeholder
                        if (oldNote.NoteId === "hidden") {
                            var oldTime = oldNote.getTimeVal();
                            if (oldTime.gt(timeVal)) {
                                oldNote.timeVal = oldTime.sub(timeVal);
                            }
                            else if (oldTime.eq(timeVal)) {
                            }
                        }
                    }
                }
                note.dotNo = dots;
                this.addChild(note, oldNote); // todo: change
                if (noteType === NoteType.Rest) {
                    note.setRest(true);
                }
                else if (noteType === NoteType.Placeholder) {
                    note.setRest(true);
                }
                else {
                }
                return note;
                // = { note: 0, rest: 1, placeholder: 2 };
            }


            protected visitChildEvents(visitor: IEventVisitor, globalContext: IGlobalContext){
                let events = this.getEvents(globalContext);
                for (let i = 0; i < events.length; i++) {
                    events[i].visitAllEvents(visitor);
                }
            }

        }

        export class TransposeElement extends MusicContainer implements ISequence {
            constructor(public parent: IVoice | ISequence, private sequence: ISequence, public interval: Interval){
                super(parent);
            }
            
            public absTime: AbsoluteTime;
            //debug(): string { return }
            getSortOrder() { return 100; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }

            static createFromMemento(parent: IVoice, memento: IMemento): ISequence {
                const interval = new Interval(memento.def.interval, memento.def.alteration);
                var seq = new TransposeElement(parent, null, interval);
                //if (memento.def && memento.def.stem) { voice.setStemDirection(memento.def.stem); }
                if (parent) {
                    if (parent.getElementName() === "Staff") {
                        let voice = new VoiceElement(<IStaff><any>parent);
                        //voice.setSequence(seq);
                        voice.addChild(seq);
                        seq.parent = voice;
                        parent.addChild(voice);
                    }
                    else if ((<ISequence><any>parent).noteElements) {
                        parent.addChild(seq); // todo: at index
                    }
                    else {
                        parent.addChild(seq); // todo: at index
                    }
                }
                return seq;
            }

            public doGetMemento(): any {
                var val: any; // todo: serialize interval
                /*if (this.stemDirection) {
                    val = { stem: this.stemDirection };
                }*/
                return val;
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitDefault(this);
            }


            get noteElements(): INote[] {
                return this.sequence.noteElements;
            }
            withNotes(globalContext: IGlobalContext, f: (note: INoteSource, context: INoteContext, index: number) => void): void {
                this.sequence.withNotes(globalContext, f);
            }
            getStemDirection(): StemDirectionType {
                return this.sequence.getStemDirection();
            }
            setStemDirection(dir: StemDirectionType): void {
                this.sequence.setStemDirection(dir);
            }
            getEventsOld(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[] {
                return this.sequence.getEventsOld(globalContext, fromTime, toTime);
            }
            getEndTime(): AbsoluteTime {
                return this.sequence.getEndTime();
            }
            getNoteElements(globalContext: IGlobalContext): INote[] {
                return this.sequence.getNoteElements(globalContext);
            }
            addChild(child: IMusicElement){
                this.sequence = <ISequence>child;
                super.addChild(child);
            }
            addEvent(event: ITimedEvent): void {
                throw new Error("Cannot add event to transposeElement");
            }
            addNote(globalContext: IGlobalContext, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote?: INote, insert?: boolean, dots?: number, tuplet?: TupletDef): ISequenceNote {
                throw new Error("Cannot add event to transposeElement");
            }
            getEvents(globalContext: IGlobalContext): IEventInfo[] {
                let events = this.sequence.getEvents(globalContext);
                for (let i = 0; i < events.length; i++){
                    if ((<any>events[i]).heads){
                        const note = <INoteInfo>events[i];
                        for (let j = 0; j < note.heads.length; j++){
                            const head = note.heads[j];
                            head.pitch = this.interval.addPitch(head.pitch);
                        }
                    }
                }
                return events;
            }
            public getElementName() { return "Transpose"; }
        }

        // ClefElement
        export class ClefElement extends MusicElement implements IClef {
            constructor(public parent: IStaff, public definition: ClefDefinition, public absTime: AbsoluteTime = null) {
                super(parent);
                if (!this.absTime) this.absTime = AbsoluteTime.startTime;
            }
            getEvents(): IEventInfo[] {
                let info: IClefEventInfo = new ClefEventInfo(this);
                //info.visitAllEvents = (visitor: IEventVisitor) => {visitor.visitClefInfo(info)};
                return [info];
            }

            visit(visitor: IVisitor): void{
                this.inviteVisitor(visitor);
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitClef(this);
            }
            static createFromMemento(parent: IStaff, memento: IMemento): IClef {
                var def = new ClefDefinition(memento.def.clef, memento.def.lin, memento.def.tr);
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                var clef: IClef = new ClefElement(parent, def, absTime);
                if (parent) parent.addChild(clef);
                return clef;
            }

            public doGetMemento(): any {
                var val: any = {
                    abs: this.absTime.getMemento(),
                    clef: this.definition.clefCode,
                    lin: this.definition.clefLine,
                    tr: this.definition.transposition
                };
                return val;
            }

            public getSortOrder() {
                return this.absTime ? 60 : 30;
            }

            public getElementName() { return "Clef"; }

            /*public makeSureExists() {
                //this.changed();
            }*/
            public setClef(clef: ClefDefinition) {
                this.definition = clef;
                //this.changed();
            }
            public pitchToStaffLine(pitch: Pitch): number {
                return this.definition.pitchToStaffLine(pitch);
            }
            public staffLineToPitch(line: number): Pitch {
                return this.definition.staffLineToPitch(line);
            }
            public debug() {
                return "[" + this.definition.debug() + "]";
            }
            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return this.parent; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }
        }


        // KeyElement
        export class KeyElement extends MusicElement implements IKey {
            constructor(public parent: IStaff, public definition: IKeyDefinition, public absTime: AbsoluteTime = null) {
                super(parent);
                if (!absTime) this.absTime = AbsoluteTime.startTime;
            }
            getEvents(): IEventInfo[] {
                let info: IKeyEventInfo = new KeyEventInfo(this);
                //info.visitAllEvents = (visitor: IEventVisitor) => {visitor.visitKeyInfo(info)};
                return [info];
            }


            visit(visitor: IVisitor): void{
                this.inviteVisitor(visitor);
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitKey(this);
            }
            static createFromMemento(parent: IStaff, memento: IMemento): IKey {
                var def = KeyDefinitionFactory.createKeyDefinition(memento.def.def);
                var absTime: AbsoluteTime;
                if (memento.def.abs) {
                    absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                }
                var key: IKey = new KeyElement(parent, def, absTime);
                if (parent) parent.addChild(key);
                return key;
            }

            public doGetMemento(): any {
                var val: any = {
                    abs: this.absTime.getMemento(),
                    def: this.definition.getMemento()
                };
                return val;
            }

            public getSortOrder() {
                return this.absTime ? 80 : 40;
            }

            public getElementName() { return "Key"; }
            public debug() {
                return "[" + this.definition.debug() + "]";
            }

            public getFixedAlteration(pitch: number): string {
                return this.definition.getFixedAlteration(pitch);
            }

            public getTonic(): PitchClass {
                return this.definition.getTonic();
            }

            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return this.parent; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }
        }

        // MeterElement
        export class MeterElement extends MusicElement implements IMeter {
            constructor(public parent: IMeterOwner, public definition: IMeterDefinition, public absTime: AbsoluteTime) {
                super(parent);
            }
            getEvents(): IMeterEventInfo[] {
                let info: IMeterEventInfo = new MeterEventInfo(this);
                //info.visitAllEvents = (visitor: IEventVisitor) => {visitor.visitMeterInfo(info)};
                return [info];
            }

            visit(visitor: IVisitor): void{
                this.inviteVisitor(visitor);
            }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitMeter(this);
            }

            static createFromMemento(parent: IMeterOwner, memento: IMemento): IMeter {
                if (!memento.def) return null;
                var def = MeterDefinitionFactory.createMeterDefinition(memento.def.def);
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                var meter: IMeter = new MeterElement(parent, def, absTime);// todo: add to parent
                if (parent) parent.addChild(meter);
                return meter;
            }

            public doGetMemento(): any {
                var val: any = {
                    abs: this.absTime.getMemento(),
                    def: this.definition.getMemento()
                };
                return val;
            }

            public getSortOrder() {
                return this.absTime ? 90 : 50;
            }

            public getElementName() { return "Meter"; }

            public debug() {
                return "[" + this.definition.debug() + "]";
            }

            public getMeasureTime(): TimeSpan {
                return this.definition.getMeasureTime();
            }

            public nextBoundary(abstime: AbsoluteTime): AbsoluteTime {
                return this.definition.nextBoundary(abstime, this.absTime);
            }

            public nextBar(abstime: AbsoluteTime): AbsoluteTime {
                return this.definition.nextBar(abstime, this.absTime);
            }

            getVoice(): IVoice { return null; }

            getStaff(): IStaff { return null; } // todo: staff meter

            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }
        }

        export class BeamElement extends MusicElement implements IBeam {
            get source(): IBeam { return this; }
            getHorizPosition(): HorizPosition {
                throw new Error("Method not implemented.");
            }
            relTime: TimeSpan;
            inviteEventVisitor(visitor: IEventVisitor){
                visitor.visitBeamInfo(this);
            }
            getTimeVal(): TimeSpan {
                throw new Error("Method not implemented.");
            }
            visitAllEvents(visitor: IVisitorIterator<IEventVisitorTarget>): void {
                //throw new Error("Method not implemented.");
            }
            clone(addId: string): IEventInfo {
                throw new Error("Method not implemented.");
            }
            constructor(public parent: INote, public fromNote: INoteInfo, public toNote: INoteInfo, public index: number) {
                super(parent);
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitBeam(this);
            }
            public remove(): void {
                /*var note: INote = this.parent;
                while (note) {
                    note.Beams[this.index] = undefined;
                    if (note === this.toNote) return;
                    note = Music.nextNote(new GlobalContext(), note); // todo: problem
                }*/
            }
        }


/******************************************************** Helper classes **************************************************************/
        export class Music { // facade object
            /*constructor() {
            }*/
            /*private static _music: Music;
            public static Music(): Music {
                if (!this._music) {
                    this._music = new Music();
                }
                return this._music;
            }*/

            static prevNote(globalContext: IGlobalContext, note: INote): INote {
                /*var voice = note.parent;
                var noteElements = voice.getNoteElements();
                var i = noteElements.indexOf(note);
                if (i > 0) {
                    return noteElements[i - 1];
                }
                return null;*/
                return note.getPrev(globalContext);
            }
            static nextNote(globalContext: IGlobalContext, note: INote): INote { // (noteIndex >= note.parent.noteElements.length) ? null : note.parent.noteElements[noteIndex + 1];
                /*var voice = note.parent;
                var noteElements = voice.getNoteElements();
                var i = noteElements.indexOf(note);
                if (i >= 0 && i < noteElements.length - 1) {
                    return noteElements[i + 1];
                }
                return null;*/
                return note.getNext(globalContext);
            }

            public static changeNoteDuration(globalContext: IGlobalContext, note: ISequenceNote, nominalDuration: TimeSpan, actualDuration: TimeSpan): ISequenceNote {
                if (note.getTimeVal().eq(actualDuration) && note.timeVal.eq(nominalDuration)) return; // no change

                //note.timeVal = nominalDuration;
                //note.NoteId = Music.calcNoteId(note.timeVal);
                //note.setSpacingInfo(undefined);

                var noteId = note.NoteId === 'hidden' ? 'hidden' : Music.calcNoteId(actualDuration);
                var noteType = note.NoteId === 'hidden' ? NoteType.Placeholder : note.rest ? NoteType.Rest : NoteType.Note;

                var dots = 0;
                if (actualDuration.numerator === 3) {
                    dots = 1;
                    nominalDuration = actualDuration.multiplyRational(new Rational(2, 3));
                }
                if (actualDuration.numerator === 7) {
                    dots = 2;
                    nominalDuration = actualDuration.multiplyRational(new Rational(4, 7));
                }

                var note1 = note.parent.addNote(globalContext, noteType, note.absTime, noteId, nominalDuration,
                    note, true, dots, note.tupletDef);
                note1.graceType = note.graceType;

                var a = note.getProperty('autojoin');
                if (a) {
                    note1.setProperty('autojoin', a);
                }

                note.withDecorations(globalContext, (decoration: INoteDecorationElement) => {
                    note1.addChild(decoration);
                });
                
                note.withSyllables(globalContext, (syl: ITextSyllableElement) => {
                    note1.addChild(syl);
                });                

                note.withHeads(globalContext, (head: INotehead) => {
                    var head1 = note1.setPitch(head.pitch);
                    head1.tie = head.tie;
                    head1.forceAccidental = head.forceAccidental;
                    head1.setProperty("tiedTo", head.getProperty("tiedTo"));
                });

                note.parent.removeChild(note);
                return note1;
            }

            public static splitNote(globalContext: IGlobalContext, note: ISequenceNote, notes: TimeSpan[]): void {
                if (notes.length <= 1) return;
                var absTime = note.absTime;
                var nextNote = Music.nextNote(globalContext, note);
                note = Music.changeNoteDuration(globalContext, note, notes[0], notes[0]);
                var alreadyAutojoin = note.getProperty('autojoin');
                note.setProperty('autojoin', note.absTime);
                note.withHeads(globalContext, (head: INotehead, index: number) => {
                    head.tie = true;
                });
                for (var i = 1; i < notes.length; i++) {
                    absTime = absTime.add(notes[i - 1]);
                    var newNote = note.parent.addNote(globalContext, 
                        note.NoteId === 'hidden' ? NoteType.Placeholder : note.rest ? NoteType.Rest : NoteType.Note,
                        absTime, note.NoteId, notes[i]);

                    // copy heads but not expressions and text
                    var join = /*alreadyAutojoin ||*/ i < notes.length - 1;
                    newNote.setProperty('autojoin', join);
                    note.withHeads(globalContext, (head: INotehead, index: number) => {
                        var newHead = newNote.setPitch(head.pitch);
                        // tie heads
                        newHead.tie = join;
                        newHead.setProperty('autojoin', join);
                    });
                }

            }

            public static mergeNoteWithNext(globalContext: IGlobalContext, note: ISequenceNote, no: number = 1): ISequenceNote {
                var nextNotes: INote[] = [];
                var nextNote = Music.nextNote(globalContext, note);
                var time = note.getTimeVal();
                for (var i = 0; i < no; i++) {                    
                    time = time.add(nextNote.getTimeVal());
                    nextNotes.push(nextNote);
                    nextNote = Music.nextNote(globalContext, nextNote);
                }
                note = Music.changeNoteDuration(globalContext, note, time, time);
                note.withHeads(globalContext, (head: INotehead) => {
                    var tie = head;
                    for (var i = 0; i < no; i++) {
                        tie = tie.getProperty("tiedTo");
                    }
                    head.tie = tie.tie;
                    head.setProperty("tiedTo", tie.getProperty("tiedTo"));
                });
                
                for (var i = 0; i < nextNotes.length; i++) {
                    note.parent.removeChild(nextNotes[i]);
                }
                return note;
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
            static findNote(globalContext: IGlobalContext, sequence: ISequence, absTime: AbsoluteTime): INote {
                var res: INote;
                var noteElements = sequence.noteElements;

                for (var i = 0; i < noteElements.length; i++) {
                    var note = noteElements[i];
                    if (note.absTime.add(note.getTimeVal()).gt(absTime)) {
                        return note;
                    }
                }
                sequence.withNotes(globalContext, (note: INoteSource, context: INoteContext) => {
                    if (absTime.ge(context.absTime) && context.absTime.add(note.timeVal).gt(absTime)) {
                        res = note;
                    }
                });
                return res;
            }

            /** Check if absTime is in an area with unfinished tuplets and return the current tuplet fraction at this absTime */
            static inTupletArea(globalContext: IGlobalContext, sequence: ISequence, absTime: AbsoluteTime): Rational {
                // Find first note in the bar
                //var staffContext = sequence.parent.getStaffContext(absTime);
                var barBegin: AbsoluteTime = absTime/*.sub(staffContext.timeInBar)*/;
                var firstNoteInBar: INote = Music.findNote(globalContext, sequence, barBegin);
                if (firstNoteInBar) {
                    //var tupletFraction: Rational = null;
                    var note = firstNoteInBar;
                    while (note && !note.absTime.ge(absTime)) {
                        if (note.tupletDef) { // todo: nested tuplets
                            if (note.tupletDef.fullTime) {
                                var endTime = note.absTime.add(note.tupletDef.fullTime);
                                if (endTime.gt(absTime)) {
                                    return note.tupletDef.fraction;
                                }
                                while (note && !note.absTime.ge(endTime)) {
                                    note = this.nextNote(globalContext, note);
                                }
                            }
                            if (!note) return null;
                        }
                        note = this.nextNote(globalContext, note);
                    }
                }
                return null;
            }

            /** Add a note to voice at a specified absTime */
            /*static addNoteX(globalContext: IGlobalContext, sequence: ISequence, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote: INote = null, insert: boolean = true, dots: number = 0, tuplet: TupletDef = null): ISequenceNote {
                return sequence.addNote(globalContext, noteType, absTime, noteId, timeVal, beforeNote, insert, dots, tuplet);     
            }*/

            static getText(globalContext: IGlobalContext, voice: IVoice) {
                if (voice) {
                    var txt = "";
                    voice.withNotes(globalContext, (note: INote) => {
                        if (note.syllableElements.length)
                            txt += note.syllableElements[0].Text + ' ';
                        else
                            txt += ' ';
                    });
                    return txt.replace(/\s+$/, "");
                }
            }

            public static compareEvents(a: IEventInfo, b: IEventInfo): number {
                return HorizPosition.compareEvents(a.getHorizPosition(), b.getHorizPosition());
            }

            public static compareEventsOld(a: ITimedEvent, b: ITimedEvent): number {
                return HorizPosition.compareEvents(a.getHorizPosition(), b.getHorizPosition());
            }

            public static compareEventsByVoice(a: ITimedEvent, b: ITimedEvent) {
                if (!(<any>a).getVoice || !(<any>b).getVoice) {
                    return Music.compareEventsOld(a, b);
                }
                var va = (<any>a).getVoice();
                var vb = (<any>b).getVoice();
                if (va !== null && vb !== null && va === vb) {
                    return Music.compareEventsOld(a, b);
                }
                else if (!va && !!vb) {
                    if (vb === vb.parent.voiceElements[0])
                        return Music.compareEventsOld(a, b);
                    return -1;
                }
                else if (!!va && !vb) {
                    if (va === va.parent.voiceElements[0])
                        return Music.compareEventsOld(a, b);
                    return 1;
                }
                else if (!va && !vb) {
                    return Music.compareEventsOld(a, b);
                }
                else {
                    var staffa = va.parent;
                    var staffb = vb.parent;
                    if (staffa === staffb) {
                        return staffa.voiceElements.indexOf(va) - staffa.voiceElements.indexOf(vb);
                    }
                    else {
                        var score = staffa.parent;
                        return score.staffElements.indexOf(staffa) - score.staffElements.indexOf(staffb);
                    }
                }
            }

            static setBar(owner: IStaff, absTime: AbsoluteTime): IBar;
            static setBar(owner: IScore, absTime: AbsoluteTime): IBar;
            static setBar(owner: IMusicElement, absTime: AbsoluteTime): IBar {
                var score: IScore;
                if (owner.getElementName() === "Staff") {
                    score = (<IStaff>owner).parent;
                }
                else {
                    score = <IScore>owner;
                }
                var bar = score.findBar(absTime);
                if (!bar) score.addChild(new BarElement(score, absTime));
                return bar;
            }
        }


        var mementoCreators: { [i: string]: IMusicElementCreator } = {
            "Score": ScoreElement,
            "Staff": StaffElement,
            "Voice": VoiceElement,
            "Note": NoteElement,
            "Notehead": NoteheadElement,
            "Sequence": SequenceElement,
            "Transpose": TransposeElement,
            "Pitch": NoteheadElement,
            "Meter": MeterElement,
            "Key": KeyElement,
            "Clef": ClefElement,
            "NoteDecoration": NoteDecorationElement,
            "NoteLongDecoration": NoteLongDecorationElement,
            "TextSyllable": TextSyllableElement,
            "Bar": BarElement,
            "StaffExpression": StaffExpression
        };


        export class MusicElementFactory {
            static register(key: string, creator: IMusicElementCreator) {
                mementoCreators[key] = creator;
            }
            public static recreateElement(parent: IMusicElement, memento: IMemento, globalContext: IGlobalContext): IMusicElement {
                var res: IMusicElement;
                var creator = mementoCreators[memento.t];
                if (creator) {
                    res = creator.createFromMemento(parent, memento, globalContext);
                    var children = memento.children;
                    if (children) {
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child) {
                                MusicElementFactory.recreateElement(res, child, globalContext);
                            }
                        }
                    }
                }
                return res;
            }
        }

export class EventEnumerator {
    constructor(private globalContext: IGlobalContext){}
    public doScore(score: IScore, visitor: IEventVisitor){
        visitor.visitScore(score);
        // todo: score.meters, score.keys
        score.withStaves((staff) => { this.doStaff(staff, visitor); }, this.globalContext);        
    }
    public doStaff(staff: IStaff, visitor: IEventVisitor){
        visitor.visitStaff(staff);
        // todo: staff.meters, staff.keys, staff.clefs
        staff.withVoices((voice) => { this.doVoice(voice, visitor); }, this.globalContext);
    }
    public doVoice(voice: IVoice, visitor: IEventVisitor){
        /*visitor.visitScore(voice.parent.parent);
        visitor.visitStaff(voice.parent);*/
        visitor.visitVoice(voice);
        let events = voice.getEvents(this.globalContext);
        for (let i = 0; i < events.length; i++){
            events[i].visitAllEvents(visitor);
        }
    }
    public doSequence(sequence: ISequence, visitor: IEventVisitor){
        /*visitor.visitScore(voice.parent.parent);
        visitor.visitStaff(voice.parent);*/
        visitor.visitSequence(sequence, this.globalContext);
        let events = sequence.getEvents(this.globalContext);
        for (let i = 0; i < events.length; i++){
            events[i].visitAllEvents(visitor);
        }
    }
}
