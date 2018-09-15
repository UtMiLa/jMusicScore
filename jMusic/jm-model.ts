/** logical music definition classes and classes for music concepts */
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'

        // todo: Spacers out of this file
        // todo: NoteId away

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


/**************************************************** MusicElement stuff ****************************************************/
        export interface IMusicElement {
            //changed(): void;
            //moved(): void;/**/
            id: string;

            parent: IMusicElement;
            spacingInfo: ISpacingInfo;
            //setSpacingInfo(info: ISpacingInfo): void;
            inviteVisitor(spacer: IVisitor): void;
            getElementName(): string;
            addChild(list: IMusicElement[], theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void;
            removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
            debug(): string;
            remove(): void;
            setProperty(name: string, value: any): void;
            getProperty(name: string): any;
            visitAll(visitor: IVisitorIterator<IMusicElement>): void;
            getMemento(withChildren?: boolean): IMemento;
        }


        export class IdSequence {
            static id: number = 1;
            static next(): string { return '' + IdSequence.id++; }
        }

        export class MusicElement<TSpacingInfo extends ISpacingInfo> {
            constructor(public parent: IMusicElement) {
                //this.parent = parent;
            }

            private _spacingInfo?: TSpacingInfo;
            public id = IdSequence.next();

            public get spacingInfo(): TSpacingInfo {
                return this._spacingInfo;
            }
            public set spacingInfo(info: TSpacingInfo) {
                this._spacingInfo = info;
            }
            public inviteVisitor(spacer: IVisitor) {
                spacer.visitDefault(this, this._spacingInfo);
            }

            /*public changed() { }
            public moved() { }*/

            private childLists: IMusicElement[][] = [];
            private properties: { [index: string]: any; } = {};

            public getElementName() { return "Element"; }

            public addChild(list: IMusicElement[], theChild: IMusicElement, before: IMusicElement = null, removeOrig: boolean = false) {
                var index = this.childLists.indexOf(list);
                if (index >= 0) {
                    //this.childLists[index];
                }
                else {
                    this.childLists.push(list);
                }

                if (before) {
                    var i = list.indexOf(before);
                    if (i < 0) return false;
                    if (removeOrig) {
                        before.remove();
                        list.splice(i, 1, theChild);
                    }
                    else {
                        list.splice(i, 0, theChild);
                    }
                }
                else {
                    list.push(theChild);
                }

                //list.push(theChild);
                //                this.sendEvent({ type: MusicEventType.eventType.addChild, sender: this, child: theChild });
            }

            public removeChild(theChild: IMusicElement, list?: IMusicElement[]) {
                if (list) {
                    var index = list.indexOf(theChild);
                    if (index >= 0) {
                        list.splice(index, 1);
                        //            this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: theChild });
                    }
                    theChild.remove();
                }
                else {
                    for (var i = 0; i < this.childLists.length; i++) {
                        var index = this.childLists[i].indexOf(theChild);
                        if (index >= 0) {
                            this.removeChild(theChild, this.childLists[i]);
                            return;
                        }
                    }
                }
            }

            public debug() {
                var string = this.getElementName() + ": ";

                for (var i = 0; i < this.childLists.length; i++) {
                    for (var j = 0; j < this.childLists[i].length; j++) {
                        string += this.childLists[i][j].debug();
                    }
                }
                string += " :" + this.getElementName() + " ";
                return string;
            }

            public remove(): void {
                for (var i = 0; i < this.childLists.length; i++) {
                    for (var j = 0; j < this.childLists[i].length; j++) {
                        this.childLists[i][j].remove();
                    }
                }
            }
            public setParent(p: IMusicElement) {
                this.parent = p;
            }
            public getParent(): IMusicElement {
                return this.parent;
            }
            public setProperty(name: string, value: any) {
                this.properties[name] = value;
            }
            public getProperty(name: string): any {
                return this.properties[name];
            }
            ///* Override this to return any parameters with non-default values. Can be a string, number, boolean or object */
            public doGetMemento(): any {
                return undefined;
            }
            public getMemento(withChildren: boolean = true): IMemento {
                var memento: IMemento = {
                    id: this.id,
                    t: this.getElementName(),
                    def: this.doGetMemento()
                };
                if (withChildren) {
                    var children: IMemento[] = [];
                    for (var i = 0; i < this.childLists.length; i++) {
                        for (var j = 0; j < this.childLists[i].length; j++) {
                            children.push(this.childLists[i][j].getMemento(true));
                        }
                    }
                    if (children.length) memento.children = children;
                }
                return memento;
            }
            public visitAll(visitor: IVisitorIterator<IMusicElement>) {
                var postFun: (element: IMusicElement) => void = visitor.visitPre(this);
                for (var i = 0; i < this.childLists.length; i++) {
                    for (var j = 0; j < this.childLists[i].length; j++) {
                        this.childLists[i][j].visitAll(visitor);
                    }
                }
                if (postFun) {
                    postFun(this);
                }

            }
        }


        export interface ITimedEvent extends IMusicElement {
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
            getVoice(): IVoice;
            getStaff(): IStaff;
            spacingInfo: ISpacingInfo;
            getHorizPosition(): HorizPosition;
        }

        export interface IEventContainer {
            getEvents(): ITimedEvent[];
        }

        export interface IBar extends ITimedEvent {
            parent: IScore;
            absTime: AbsoluteTime;
            spacingInfo: IBarSpacingInfo;
        }

        class BarElement extends MusicElement<IBarSpacingInfo> implements IBar {
            constructor(public parent: IScore, public absTime: AbsoluteTime) {
                super(parent);
            }
            static createFromMemento(parent: IScore, memento: IMemento): IBar {
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                var bar = new BarElement(parent, absTime);
                if (parent) parent.addChild(parent.bars, bar);
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
                visitor.visitBar(this, this.spacingInfo);
            }
        }

        export interface IMeterOwner extends IMusicElement {
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

        //  *  OK  *
        export class ScoreElement extends MusicElement<IScoreSpacingInfo> implements IScore {
            constructor(public parent: IMusicElement) {
                super(parent);
            }
            public bars: IBar[] = [];
            public staffElements: IStaff[] = [];
            public meterElements: IMeter[] = [];
            public title: string;
            public composer: string;
            public author: string;
            public subTitle: string;
            public metadata = {};

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitScore(this, this.spacingInfo);
            }

            static createFromMemento(parent: IMusicElement, memento: IMemento): IScore {
                var score: IScore = new ScoreElement(parent);
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
                while (this.staffElements.length)
                    this.removeChild(this.staffElements[0], this.staffElements);
                while (this.bars.length)
                    this.removeChild(this.bars[0], this.bars);
                while (this.meterElements.length)
                    this.removeChild(this.meterElements[0], this.meterElements);
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

            public getEvents(ignoreStaves = false): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!ignoreStaves) {
                    this.withStaves((staff: IStaff) => {
                        events = events.concat(staff.getEvents());
                    });
                }
                events = events.concat(this.bars);
                events = events.concat(this.meterElements);
                return events;
            }
            
            public withStaves(f: (staff: IStaff, index: number) => void) {
                this.visitAll(new StaffVisitor(f));

                /*for (var i = 0; i < this.staffElements.length; i++) {
                    f(this.staffElements[i], i);
                }*/
            }

            public withVoices(f: (voice: IVoice, index: number) => void) {
                this.visitAll(new VoiceVisitor(f));
                /*this.withStaves((staff: IStaff, index: number): void => {
                    staff.withVoices(f);
                });*/
            }

            public withMeters(f: (meter: IMeter, index: number) => void) {
                this.visitAll(new MeterVisitor(f));
                /*for (var i = 0; i < this.meterElements.length; i++) {
                    f(this.meterElements[i], i);
                }*/
            }

            public withBars(f: (bar: IBar, index: number) => void) {
                this.visitAll(new BarVisitor(f));
                /*for (var i = 0; i < this.bars.length; i++) {
                    f(this.bars[i], i);
                }*/
            }

            public removeBars(f: (bar: IBar, index: number) => boolean) {
                for (var i = this.bars.length - 1; i >= 0; i--) {
                    if (f(this.bars[i], i)) this.removeChild(this.bars[i], this.bars);
                }
            }

            public updateBars() {

            }

            public addStaff(clefDef: ClefDefinition): IStaff {
                var staff = new StaffElement(this);
                this.addChild(this.staffElements, staff);
                var clef: IClef = new ClefElement(staff, clefDef);
                staff.addChild(staff.clefElements, clef);
                /*for (var i = 0; i < this.bars.length; i++)
                    this.bars[i].changed();*/
                return staff;
            }
            /*private getChild(i: number): IStaff {
                return this.staffElements[i];
            }
            private getChildren(): IStaff[] {
                return this.staffElements;
            }*/
            public setMeter(meter: IMeterDefinition, absTime: AbsoluteTime) {
                if (!absTime) absTime = AbsoluteTime.startTime;
                for (var i = 0; i < this.meterElements.length; i++) {
                    if (this.meterElements[i].absTime.eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.meterElements[i] });
                        this.meterElements[i].remove();
                        this.meterElements.splice(i, 1);
                    }
                }
                var meterRef = new MeterElement(this, meter, absTime);
                this.addChild(this.meterElements, meterRef);
            }

            public getElementName() {
                return "Score";
            }
            public addBarLine(absTime: AbsoluteTime) {
                this.addChild(this.bars, new BarElement(this, absTime));
            }

            public setKey(key: IKeyDefinition, absTime: AbsoluteTime) {
                this.withStaves((staff: IStaff) => { 
                    staff.setKey(key, absTime);
                });
            }
        }


        export interface IStaff extends IEventContainer, IMusicElement, IMeterOwner {
            parent: IScore;
            removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
            spacingInfo: IStaffSpacingInfo;
            clefElements: IClef[];
            voiceElements: IVoice[];
            title: string;

            withVoices(f: (voice: IVoice, index: number) => void): void;
            withKeys(f: (key: IKey, index: number) => void): void;
            //withMeters(f: (meter: IMeter, index: number) => void): void;
            withClefs(f: (clef: IClef, index: number) => void): void;
            withTimedEvents(f: (ev: ITimedEvent, index: number) => void): void;
            getStaffContext(absTime: AbsoluteTime): StaffContext;
            //getMeterElements(): IMeter[];
            getKeyElements(): IKey[];
            getEvents(fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
            addVoice(): IVoice;
            //setMeter(meter: MeterDefinition, absTime: AbsoluteTime): void;
            getParent(): IScore;
            setClef(type: ClefDefinition, absTime: AbsoluteTime): void;
            setKey(key: IKeyDefinition, absTime: AbsoluteTime): void;
            setStaffExpression(type: string, absTime: AbsoluteTime): IStaffExpression;         
        }


        class StaffElement extends MusicElement<IStaffSpacingInfo> implements IStaff {
            constructor(public parent: IScore) {
                super(parent);
            }
            private keyRef: IKey;
            public clefElements: IClef[] = [];
            public meterElements: IMeter[] = [];
            private keyElements: IKey[] = [];
            public voiceElements: IVoice[] = [];
            private expressions: IStaffExpression[] = [];
            public title: string;

            static createFromMemento(parent: IScore, memento: IMemento): IStaff {
                var staff: IStaff = new StaffElement(parent);
                if (memento.def && memento.def.title) { staff.title = memento.def.title; }
                if (parent) parent.addChild(parent.staffElements, staff); // todo: at index
                return staff;
            }

            public doGetMemento(): any {
                var val: any;
                if (this.title) {
                    val = { title: this.title };
                }
                return val;
            }


            public inviteVisitor(visitor: IVisitor) {
                visitor.visitStaff(this, this.spacingInfo);
            }

            public withVoices(f: (voice: IVoice, index: number) => void) {
                this.visitAll(new VoiceVisitor(f));
                /*for (var i = 0; i < this.voiceElements.length; i++) {
                    f(this.voiceElements[i], i);
                }*/
            }

            public withKeys(f: (key: IKey, index: number) => void) {
                this.visitAll(new KeyVisitor(f));
                /*for (var i = 0; i < this.keyElements.length; i++) {
                    f(this.keyElements[i], i);
                }*/
            }

            public withMeters(f: (meter: IMeter, index: number) => void) {
                this.visitAll(new MeterVisitor(f));
                /*for (var i = 0; i < this.meterElements.length; i++) {
                    f(this.meterElements[i], i);
                }*/
            }

            public withClefs(f: (clef: IClef, index: number) => void) {
                this.visitAll(new ClefVisitor(f));
                /*for (var i = 0; i < this.clefElements.length; i++) {
                    f(this.clefElements[i], i);
                }*/
            }

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

            public getStaffContext(absTime: AbsoluteTime): StaffContext {
                var clef: IClef;
                this.clefElements.sort(Music.compareEvents);
                for (var i = 0; i < this.clefElements.length; i++) {
                    if (this.clefElements[i].absTime.gt(absTime)) break;
                    clef = this.clefElements[i];
                }
                var key: IKey;
                //var keys = this.keyElements.length ? this.keyElements : this.parent.keyElements;
                this.keyElements.sort(Music.compareEvents);
                for (var i = 0; i < this.keyElements.length; i++) {
                    if (this.keyElements[i].absTime.gt(absTime)) break;
                    key = this.keyElements[i];
                }
                var meter: IMeter;
                var meters = this.meterElements.length ? this.meterElements : this.parent.meterElements;
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
                    meter = meters[i];
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
            public getMeterElements(): IMeter[] {
                return this.meterElements;
            }
            public getKeyElements(): IKey[] {
                return this.keyElements;
            }
            public getEvents(fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;

                this.withVoices((voice: IVoice, index: number) => {
                    events = events.concat(voice.getEvents(fromTime, toTime));
                });

                var f = (elm: ITimedEvent, index: number) => {
                    if (elm.absTime.ge(fromTime) && toTime.gt(elm.absTime)) events.push(elm);
                }

                this.withTimedEvents(f);

                return events;
            }
            public getElementName() { return "Staff"; }
            public addVoice(): IVoice {
                var voice = new VoiceElement(this);
                this.addChild(this.voiceElements, voice);
                return voice;
            }

            public setMeter(meter: IMeterDefinition, absTime: AbsoluteTime) {
                if (!absTime) absTime = AbsoluteTime.startTime;
                for (var i = 0; i < this.meterElements.length; i++) {
                    if (this.meterElements[i].absTime.eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.meterElements[i] });
                        this.meterElements[i].remove();
                        this.meterElements.splice(i, 1);
                    }
                }
                var meterRef = new MeterElement(this, meter, absTime);
                //meterRef.changed();
                this.addChild(this.meterElements, meterRef);
            }
            public setStaffExpression(type: string, absTime: AbsoluteTime): IStaffExpression {
                var exp = new StaffExpression(this, type, absTime);
                this.addChild(this.expressions, exp);
                return exp;
            }
            public getParent(): IScore {
                return <IScore>super.getParent();
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
                this.addChild(this.clefElements, clefRef);
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
                this.addChild(this.keyElements, keyRef);
            }
        }


        export interface IStaffExpression extends ITimedEvent {
            parent: IStaff;
            text: string;
        }
        export interface IStaffExpressionSpacingInfo extends ISpacingInfo { }

        class StaffExpression extends MusicElement<IStaffExpressionSpacingInfo> implements IStaffExpression {
            constructor(public parent: IStaff, public text: string, public absTime: AbsoluteTime) {
                super(parent);
            }
            public getElementName() { return "StaffExpression"; }
            public getSortOrder() {
                return 99;
            }
            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return this.parent; }
            getHorizPosition(): HorizPosition { return new HorizPosition(this.absTime, this.getSortOrder()); }

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitStaffExpression(this, this.spacingInfo);
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


        export interface IVoice extends IEventContainer, IMusicElement {
            getNoteElements(): INote[];
            parent: IStaff;
            withNotes(f: (note: INote, index: number) => void): void;
            getStemDirection(): StemDirectionType;
            setStemDirection(dir: StemDirectionType): void;
            getEvents(fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
            getEndTime(): AbsoluteTime;
            removeChild(child: INote): void;
        }

        // VoiceElement
        class VoiceElement extends MusicElement<IVoiceSpacingInfo> implements IVoice {
            constructor(public parent: IStaff) {
                super(parent);
                //this.meterElements = { push: (meter: MeterElement) => { parent.addChild(parent.meterElements, meter); } };
                this.addChild([], this.sequence);
            }

            static createFromMemento(parent: IStaff, memento: IMemento): IVoice {
                var voice: IVoice = new VoiceElement(parent);
                if (memento.def && memento.def.stem) { voice.setStemDirection(memento.def.stem); }
                if (parent) parent.addChild(parent.voiceElements, voice); // todo: at index
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
                visitor.visitVoice(this, this.spacingInfo);
            }

            private sequence = new SequenceElement(this);

            private stemDirection: StemDirectionType = StemDirectionType.StemFree;
            //public meterElements: { push: (meter: MeterElement) => void; };

            public getNoteElements(): INote[] {
                let res: INote[] = [];
                this.withNotes((note, index) => {res.push(note);})
                return res;
            }
            public withNotes(f: (note: INote, index: number) => void) {
                this.visitAll(new NoteVisitor(f));
            }

            public addChild(list: IMusicElement[], theChild: IMusicElement, before: IMusicElement = null, removeOrig: boolean = false): boolean {
                if (theChild.getElementName() === "Note") {
                    return this.sequence.addChild(this.sequence.noteElements, theChild, before, removeOrig);    
                }
                return super.addChild(list, theChild, before, removeOrig);
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
            public getEvents(fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;
                this.withNotes((note: INote, index: number) => {
                    if (!fromTime.gt(note.absTime) && toTime.gt(note.absTime)) {
                        events.push(note);
                    }
                });
                return events;
            }
            public getElementName() { return "Voice"; }

            public getEndTime(): AbsoluteTime {
                let noteElements = this.getNoteElements();
                if (noteElements.length) {
                    var lastNote = noteElements[noteElements.length - 1];
                    return lastNote.absTime.add(lastNote.getTimeVal());
                }
                else return AbsoluteTime.startTime;
            }
        }


        export interface ISequence extends IEventContainer, IMusicElement {
            noteElements: INote[];
            parent: IVoice | ISequence;
            withNotes(f: (note: INote, index: number) => void): void;
            getStemDirection(): StemDirectionType;
            setStemDirection(dir: StemDirectionType): void;
            getEvents(fromTime?: AbsoluteTime, toTime?: AbsoluteTime): ITimedEvent[];
            getEndTime(): AbsoluteTime;
            removeChild(child: INote): void;
        }

        // SequenceElement
        class SequenceElement extends MusicElement<ISpacingInfo> implements ISequence {
            constructor(public parent: IVoice | ISequence) {
                super(parent);
            }

            static createFromMemento(parent: IStaff, memento: IMemento): IVoice {
                var voice: IVoice = new VoiceElement(parent);
                if (memento.def && memento.def.stem) { voice.setStemDirection(memento.def.stem); }
                if (parent) parent.addChild(parent.voiceElements, voice); // todo: at index
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
                visitor.visitDefault(this, this.spacingInfo);
            }

            public noteElements: INote[] = [];
            private stemDirection: StemDirectionType = StemDirectionType.StemFree;

            public withNotes(f: (note: INote, index: number) => void) {
                this.visitAll(new NoteVisitor(f));
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
            public getEvents(fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.infinity;
                this.withNotes((note: INote, index: number) => {
                    if (!fromTime.gt(note.absTime) && toTime.gt(note.absTime)) {
                        events.push(note);
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
        }
        export interface IClef extends ITimedEvent {
            parent: IStaff;
            definition: ClefDefinition;            
            pitchToStaffLine(pitch: Pitch): number;
            staffLineToPitch(line: number): Pitch;
        }

        // ClefElement
        export class ClefElement extends MusicElement<IClefSpacingInfo> implements IClef {
            constructor(public parent: IStaff, public definition: ClefDefinition, public absTime: AbsoluteTime = null) {
                super(parent);
                if (!this.absTime) this.absTime = AbsoluteTime.startTime;
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitClef(this, this.spacingInfo);
            }
            static createFromMemento(parent: IStaff, memento: IMemento): IClef {
                var def = new ClefDefinition(memento.def.clef, memento.def.lin, memento.def.tr);
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                var clef: IClef = new ClefElement(parent, def, absTime);
                if (parent) parent.addChild(parent.clefElements, clef);
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
        export interface IKey extends ITimedEvent {
            parent: IStaff;
            definition: IKeyDefinition;
            getFixedAlteration(pitch: number): string;
            getTonic(): PitchClass;
        }

        // KeyElement
        export class KeyElement extends MusicElement<IKeySpacingInfo> implements IKey {
            constructor(public parent: IStaff, public definition: IKeyDefinition, public absTime: AbsoluteTime = null) {
                super(parent);
                if (!absTime) this.absTime = AbsoluteTime.startTime;
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitKey(this, this.spacingInfo);
            }
            static createFromMemento(parent: IStaff, memento: IMemento): IKey {
                var def = KeyDefinitionFactory.createKeyDefinition(memento.def.def);
                var absTime: AbsoluteTime;
                if (memento.def.abs) {
                    absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                }
                var key: IKey = new KeyElement(parent, def, absTime);
                if (parent) parent.addChild(parent.getKeyElements(), key);
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
        export interface IMeter extends ITimedEvent {
            parent: IMusicElement;
            definition: IMeterDefinition;

            getMeasureTime(): TimeSpan;
            nextBoundary(abstime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime): AbsoluteTime;
        }

        // MeterElement
        export class MeterElement extends MusicElement<IMeterSpacingInfo> implements IMeter {
            constructor(public parent: IMeterOwner, public definition: IMeterDefinition, public absTime: AbsoluteTime) {
                super(parent);
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitMeter(this, this.spacingInfo);
            }
            static createFromMemento(parent: IMeterOwner, memento: IMemento): IMeter {
                if (!memento.def) return null;
                var def = MeterDefinitionFactory.createMeterDefinition(memento.def.def);
                    //new RegularMeterDefinition(memento.def.num, memento.def.den); // todo: factory
                var absTime = AbsoluteTime.createFromMemento(memento.def.abs);
                var meter: IMeter = new MeterElement(parent, def, absTime);// todo: add to parent
                if (parent) parent.addChild(parent.meterElements, meter);
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
        export interface IBeam {
            parent: INote;
            toNote: INote;
            index: number;
            spacingInfo: IBeamSpacingInfo;
            //setSpacingInfo(spacingInfo: IBeamSpacingInfo): void;
            inviteVisitor(spacer: IVisitor): void;
            remove(): void;
        }

        export class BeamElement extends MusicElement<IBeamSpacingInfo> implements IBeam {
            constructor(public parent: INote, public toNote: INote, public index: number) {
                super(parent);
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitBeam(this, this.spacingInfo);
            }
            public remove(): void {
                var note: INote = this.parent;
                while (note) {
                    note.Beams[this.index] = undefined;
                    if (note === this.toNote) return;
                    note = Music.nextNote(note);
                }
            }
        }

        export interface INote extends ITimedEvent {
            parent: IVoice;
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

            withHeads(f: (head: INotehead, index: number) => void): void;
            withDecorations(f: (deco: INoteDecorationElement, index: number) => void): void;
            withLongDecorations(f: (deco: ILongDecorationElement, index: number) => void): void;
            withSyllables(f: (syll: ITextSyllableElement, index: number) => void): void;

            spacingInfo: INoteSpacingInfo;
            //setSpacingInfo(info: INoteSpacingInfo): INoteSpacingInfo;

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

        class NoteElement extends MusicElement<INoteSpacingInfo> implements INote {
            constructor(public parent: IVoice, private noteId: string, public timeVal: TimeSpan) {
                super(parent);
                if (!noteId && timeVal) {
                    this.noteId = Music.calcNoteId(timeVal);
//                    if (!this.noteId) this.noteId = "hidden";
                }
            }
            static createFromMemento(parent: IVoice, memento: IMemento): INote {
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
                    var note = Music.addNote(parent, noteType, AbsoluteTime.createFromMemento(memento.def.abs), memento.def.noteId,
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

            getVoice(): IVoice { return this.parent; }

            getStaff(): IStaff { return this.parent.parent; }

            getHorizPosition(): HorizPosition {
                return new HorizPosition(this.absTime, this.getSortOrder()); // todo: grace note position
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitNote(this, this.spacingInfo);
            }

            public get NoteId(): string { return this.noteId; }
            public set NoteId(v: string) {
                if (this.noteId !== v) {
                    this.noteId = v;
                    this.spacingInfo = undefined;
                }
            }

            public getSortOrder() {
                return this.graceType ? 95 : 100;
            }
            public noteheadElements: INotehead[] = [];
            public decorationElements: INoteDecorationElement[] = [];
            public longDecorationElements: ILongDecorationElement[] = [];
            public syllableElements: ITextSyllableElement[] = [];
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

            public withHeads(f: (head: INotehead, index: number) => void) {
                this.visitAll(new NoteHeadVisitor(f));
                /*for (var i = 0; i < this.noteheadElements.length; i++) {
                    f(this.noteheadElements[i], i);
                }*/
            }

            public withDecorations(f: (deco: INoteDecorationElement, index: number) => void) {
                this.visitAll(new NoteDecorationVisitor(f));
                /*for (var i = 0; i < this.decorationElements.length; i++) {
                    f(this.decorationElements[i], i);
                }*/
            }

            public withLongDecorations(f: (deco: ILongDecorationElement, index: number) => void) {
                this.visitAll(new LongDecorationVisitor(f));
                /*for (var i = 0; i < this.longDecorationElements.length; i++) {
                    f(this.longDecorationElements[i], i);
                }*/
            }

            public withSyllables(f: (syll: ITextSyllableElement, index: number) => void) {
                this.visitAll(new TextSyllableVisitor(f));
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

            private getChild(i: number): INotehead {
                return this.noteheadElements[i];
            }
            private getChildren(): INotehead[] {
                return this.noteheadElements;
            }
            debug() {
                var string = "N" + this.noteId + "(";
                for (var i = 0; i < this.getChildren().length; i++) {
                    string += this.getChild(i).debug();
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
                if (this.getChildren().length != 1) return false;
                if (this.getChild(0).matchesPitch(pitch, ignoreAlteration)) return true;
                return false;
            }
            matchesPitch(pitch: Pitch, ignoreAlteration: boolean = false) {
                if (this.rest) return true;
                for (var i = 0; i < this.getChildren().length; i++) {
                    if (this.getChild(i).matchesPitch(pitch, ignoreAlteration)) return true;
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
                    for (var i = 0; i < this.getChildren().length; i++) {
                        if (this.getChild(i).getPitch().equals(pitch)) return this.getChild(i);
                    }
                    var newpitch = new NoteheadElement(this, pitch);
                    //newpitch.setPitch(pitch);
                    //newpitch.setDots(this.dotNo);
                    this.addChild(this.noteheadElements, newpitch);
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
            spacingInfo: INoteHeadSpacingInfo;
        }

        // NoteheadElement
        class NoteheadElement extends MusicElement<INoteHeadSpacingInfo> implements INotehead {
            constructor(public parent: INote/*, noteId: string*/, public pitch: Pitch) {
                super(parent);
            }
            static createFromMemento(parent: INote, memento: IMemento): NoteheadElement {
                var pitch = new Pitch(memento.def.p, memento.def.a);
                var head = new NoteheadElement(parent,pitch);
                //head.setDots(parent.dotNo);
                if (memento.def.tie) head.tie = true;
                if (memento.def.tieForced) head.tieForced = true;
                if (memento.def.forceAcc) head.forceAccidental = true;
                if (parent) parent.addChild(parent.noteheadElements, head);
                return head;
            }
            
            public tie: boolean = false;
            public tieForced: boolean = false;
            public forceAccidental: boolean = false;
            public showAccidental: boolean = true;

            public inviteVisitor(visitor: IVisitor) {
                visitor.visitNoteHead(this, this.spacingInfo);
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


        export interface INoteDecorationElement extends IMusicElement {
            parent: INote;
            placement: string;
            getDecorationId(): NoteDecorationKind;
        }

        /** Note decoration, e.g. staccato dot, fermata */
        export class NoteDecorationElement extends MusicElement<INoteDecorationSpacingInfo> implements INoteDecorationElement {
            constructor(public parent: INote, private notedecorationId: NoteDecorationKind) {
                super(parent);
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitNoteDecoration(this, this.spacingInfo);
            }

            static createFromMemento(parent: INote, memento: IMemento): INoteDecorationElement {
                var deco = new NoteDecorationElement(parent, memento.def.id);
                if (memento.def.placement) deco.placement = memento.def.placement;
                if (parent) parent.addChild(parent.decorationElements, deco);
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

        /** Long note decoration interface, e.g. hairpin, trill extension and slur */
        export interface ILongDecorationElement extends IMusicElement {
            parent: INote;
            placement: string;
            spacingInfo: ILongDecorationSpacingInfo;
            endEvent: ITimedEvent;
            type: LongDecorationType;
        }

        /** Long note decoration implementation, e.g. hairpin, trill extension and slur */
        export class NoteLongDecorationElement extends MusicElement<ILongDecorationSpacingInfo> implements ILongDecorationElement {
            constructor(public parent: INote, private duration: TimeSpan, public type: LongDecorationType) {
                super(parent);
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitLongDecoration(this, this.spacingInfo);
            }

            static createFromMemento(parent: INote, memento: IMemento): ILongDecorationElement {
                var duration = TimeSpan.createFromMemento(memento.def.dur);
                var deco = new NoteLongDecorationElement(parent, duration, memento.def.type);
                if (memento.def.placement) deco.placement = memento.def.placement;
                if (parent) parent.addChild(parent.longDecorationElements, deco);
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

            public get endEvent(): ITimedEvent {
                var note = this.parent;
                var endTime = note.absTime.add(this.duration);
                while (note) {
                    var newNote = Music.nextNote(note);
                    if (newNote && endTime.gt(note.absTime)) {
                        note = newNote;
                    }
                    else return note;
                }
                return null;
            }

            public getElementName() { return "NoteLongDecoration"; }
        }

        export interface ITextSyllableElement extends IMusicElement {
            placement: string;
            Text: string;
            parent: INote;
        }

        /** Text syllable from lyrics, shown under or over a note */
        export class TextSyllableElement extends MusicElement<ITextSyllableSpacingInfo> implements ITextSyllableElement {
            constructor(public parent: INote, private text: string) {
                super(parent);
            }
            public inviteVisitor(visitor: IVisitor) {
                visitor.visitTextSyllable(this, this.spacingInfo);
            }

            static createFromMemento(parent: INote, memento: IMemento): ITextSyllableElement {
                var deco = new TextSyllableElement(parent, memento.def.text);
                if (memento.def.placement) deco.placement = memento.def.placement;
                if (parent) parent.addChild(parent.syllableElements, deco);
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


        export interface IVisitor {
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


/******************************************** Spacing stuff ************************************************************/
        export class Point {
            constructor(public x: number, public y: number) { }
        }

        export interface ISpacingInfo {
            /// Center x,y - like center of notehead or clef
            offset: Point;
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
        export interface IBeamSpacingInfo extends ISpacingInfo {
            start: Point;
            end: Point;
            beamDist: number;
            beamCount: number;
        }
        export class LedgerLineSpacingInfo {
            constructor(public xStart: number, public xEnd: number, public y: number) { }
        }
        export interface INoteSpacingInfo extends ISpacingInfo {
            dots: Point;
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
            flagDisplacement: Point;
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
            end: Point;
            extraXOffset: number;
        }
        export interface IScoreSpacingInfo extends ISpacingInfo { }
        export interface ITextSyllableSpacingInfo extends ISpacingInfo { }

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

            static prevNote(note: INote): INote {
                var voice = note.parent;
                var noteElements = voice.getNoteElements();
                var i = noteElements.indexOf(note);
                if (i > 0) {
                    return noteElements[i - 1];
                }
                return null;
            }
            static nextNote(note: INote): INote { // (noteIndex >= note.parent.noteElements.length) ? null : note.parent.noteElements[noteIndex + 1];
                var voice = note.parent;
                var noteElements = voice.getNoteElements();
                var i = noteElements.indexOf(note);
                if (i >= 0 && i < noteElements.length - 1) {
                    return noteElements[i + 1];
                }
                return null;
            }

            public static changeNoteDuration(note: INote, nominalDuration: TimeSpan, actualDuration: TimeSpan): INote {
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

                var note1 = Music.addNote(note.parent, noteType, note.absTime, noteId, nominalDuration,
                    note, true, dots, note.tupletDef);
                note1.graceType = note.graceType;

                var a = note.getProperty('autojoin');
                if (a) {
                    note1.setProperty('autojoin', a);
                }

                note.withDecorations((decoration: INoteDecorationElement) => {
                    note1.addChild(note1.decorationElements, decoration);
                });
                
                note.withSyllables((syl: ITextSyllableElement) => {
                    note1.addChild(note1.syllableElements, syl);
                });                

                note.withHeads((head: INotehead) => {
                    var head1 = note1.setPitch(head.pitch);
                    head1.tie = head.tie;
                    head1.forceAccidental = head.forceAccidental;
                    head1.setProperty("tiedTo", head.getProperty("tiedTo"));
                });

                note.parent.removeChild(note);
                return note1;
            }

            public static splitNote(note: INote, notes: TimeSpan[]): void {
                if (notes.length <= 1) return;
                var absTime = note.absTime;
                var nextNote = Music.nextNote(note);
                note = Music.changeNoteDuration(note, notes[0], notes[0]);
                var alreadyAutojoin = note.getProperty('autojoin');
                note.setProperty('autojoin', note.absTime);
                note.withHeads((head: INotehead, index: number) => {
                    head.tie = true;
                });
                for (var i = 1; i < notes.length; i++) {
                    absTime = absTime.add(notes[i - 1]);
                    var newNote = Music.addNote(note.parent,
                        note.NoteId === 'hidden' ? NoteType.Placeholder : note.rest ? NoteType.Rest : NoteType.Note,
                        absTime, note.NoteId, notes[i]);

                    // copy heads but not expressions and text
                    var join = /*alreadyAutojoin ||*/ i < notes.length - 1;
                    newNote.setProperty('autojoin', join);
                    note.withHeads((head: INotehead, index: number) => {
                        var newHead = newNote.setPitch(head.pitch);
                        // tie heads
                        newHead.tie = join;
                        newHead.setProperty('autojoin', join);
                    });
                }

            }

            public static mergeNoteWithNext(note: INote, no: number = 1): INote {
                var nextNotes: INote[] = [];
                var nextNote = Music.nextNote(note);
                var time = note.getTimeVal();
                for (var i = 0; i < no; i++) {                    
                    time = time.add(nextNote.getTimeVal());
                    nextNotes.push(nextNote);
                    nextNote = Music.nextNote(nextNote);
                }
                note = Music.changeNoteDuration(note, time, time);
                note.withHeads((head: INotehead) => {
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
            static findNote(voice: IVoice, absTime: AbsoluteTime): INote {
                var res: INote;
                var noteElements = voice.getNoteElements();

                for (var i = 0; i < noteElements.length; i++) {
                    var note = noteElements[i];
                    if (note.absTime.add(note.getTimeVal()).gt(absTime)) {
                        return note;
                    }
                }
                voice.withNotes((note: INote) => {
                    if (absTime.ge(note.absTime) && note.absTime.add(note.timeVal).gt(absTime)) {
                        res = note;
                    }
                });
                return res;
            }

            /** Check if absTime is in an area with unfinished tuplets and return the current tuplet fraction at this absTime */
            static inTupletArea(voice: IVoice, absTime: AbsoluteTime): Rational {
                // Find first note in the bar
                // todo: maybe add support for tuplets crossing bar lines
                var staffContext = voice.parent.getStaffContext(absTime);
                var barBegin: AbsoluteTime = absTime.sub(staffContext.timeInBar);
                var firstNoteInBar: INote = Music.findNote(voice, barBegin);
                if (firstNoteInBar) {
                    var tupletFraction: Rational = null;
                    var note = firstNoteInBar;
                    while (note && !note.absTime.ge(absTime)) {
                        if (note.tupletDef) { // todo: nested tuplets
                            if (note.tupletDef.fullTime) {
                                var endTime = note.absTime.add(note.tupletDef.fullTime);
                                if (endTime.gt(absTime)) {
                                    return note.tupletDef.fraction;
                                }
                                while (note && !note.absTime.ge(endTime)) {
                                    note = this.nextNote(note);
                                }
                            }
                            if (!note) return null;
                        }
                        note = this.nextNote(note);
                    }
                }
                return null;
            }

            /** Add a note to voice at a specified absTime */
            static addNote(voice: IVoice, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote: INote = null, insert: boolean = true, dots: number = 0, tuplet: TupletDef = null): INote {
                var note = new NoteElement(voice, noteId, timeVal);
                note.absTime = absTime;

                note.tupletDef = tuplet;

                var fraction = Music.inTupletArea(voice, absTime);
                if (fraction) {
                    note.tupletDef = new TupletDef(null, fraction);
                }
                var voiceTime = voice.getEndTime();
                if (absTime.gt(voiceTime)) {
                    // add placeholders between voiceTime and absTime
                    var restNote = new NoteElement(null, 'hidden', absTime.diff(voiceTime));
                    restNote.setParent(voice);
                    restNote.setRest(true);
                    restNote.absTime = AbsoluteTime.startTime;
                    voice.addChild(voice.getNoteElements(), restNote, null, false); // todo: change
                }
                var oldNote: INote = beforeNote;
                if (!oldNote && voiceTime.gt(absTime)) {
                    // find note at absTime
                    oldNote = Music.findNote(voice, absTime);
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
                voice.addChild(voice.getNoteElements(), note, oldNote); // todo: change
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
            static getText(voice: IVoice) {
                if (voice) {
                    var txt = "";
                    voice.withNotes((note: INote) => {
                        if (note.syllableElements.length)
                            txt += note.syllableElements[0].Text + ' ';
                        else
                            txt += ' ';
                    });
                    return txt.replace(/\s+$/, "");
                }
            }

            public static compareEvents(a: ITimedEvent, b: ITimedEvent): number {
                return HorizPosition.compareEvents(a.getHorizPosition(), b.getHorizPosition());
            }

            public static compareEventsByVoice(a: ITimedEvent, b: ITimedEvent) {
                var va = a.getVoice();
                var vb = b.getVoice();
                if (va !== null && vb !== null && va === vb) {
                    return Music.compareEvents(a, b);
                }
                else if (!va && !!vb) {
                    if (vb === vb.parent.voiceElements[0])
                        return Music.compareEvents(a, b);
                    return -1;
                }
                else if (!!va && !vb) {
                    if (va === va.parent.voiceElements[0])
                        return Music.compareEvents(a, b);
                    return 1;
                }
                else if (!va && !vb) {
                    return Music.compareEvents(a, b);
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
                if (!bar) score.addChild(score.bars, new BarElement(score, absTime));
                return bar;
            }
        }

        export interface IMusicElementCreator { createFromMemento: (parent: any, memento: any) => IMusicElement }



        var mementoCreators: { [i: string]: IMusicElementCreator } = {
            "Score": ScoreElement,
            "Staff": StaffElement,
            "Voice": VoiceElement,
            "Note": NoteElement,
            "Notehead": NoteheadElement,
            "Sequence": SequenceElement,
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
            public static recreateElement(parent: IMusicElement, memento: IMemento): IMusicElement {
                var res: IMusicElement;
                var creator = mementoCreators[memento.t];
                if (creator) {
                    res = creator.createFromMemento(parent, memento);
                    var children = memento.children;
                    if (children) {
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child) {
                                MusicElementFactory.recreateElement(res, child);
                            }
                        }
                    }
                }
                return res;
            }
        }
   /***************** Visitors ***************** */



   class NullVisitor implements IVisitor, IVisitorIterator<IMusicElement> {
    visitPre(element: IMusicElement): (element: IMusicElement) => void {
        element.inviteVisitor(this);
        return null;
    }

    visitNoteHead(head: INotehead, spacing: INoteHeadSpacingInfo) { }
    visitNote(note: INote, spacing: INoteSpacingInfo) { }
    visitNoteDecoration(deco: INoteDecorationElement, spacing: INoteDecorationSpacingInfo) { }
    visitLongDecoration(deco: ILongDecorationElement, spacing: ILongDecorationSpacingInfo) { }
    visitVoice(voice: IVoice, spacing: IVoiceSpacingInfo) { }
    visitClef(clef: IClef, spacing: IClefSpacingInfo) { }
    visitMeter(meter: IMeter, spacing: IMeterSpacingInfo) { }
    visitKey(key: IKey, spacing: IKeySpacingInfo) { }
    visitStaff(staff: IStaff, spacing: IStaffSpacingInfo) { }
    visitScore(score: IScore, spacing: IScoreSpacingInfo) { }
    visitTextSyllable(textSyllable: ITextSyllableElement, spacing: ITextSyllableSpacingInfo) { }
    visitBar(bar: IBar, spacing: IBarSpacingInfo) { }
    visitBeam(beam: IBeam, spacing: IBeamSpacingInfo) { }
    visitStaffExpression(staffExpression: IStaffExpression, spacing: IStaffExpressionSpacingInfo): void { }

    visitDefault(element: IMusicElement, spacing: ISpacingInfo): void { }
}

export class NoteVisitor extends NullVisitor {
    constructor(private callback: (node:INote, index: number, spacing: INoteSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitNote(note: INote, spacing: INoteSpacingInfo): void {
        this.callback(note, this.no++, spacing);
    }
}   


export class StaffVisitor extends NullVisitor {
    constructor(private callback: (node:IStaff, index: number, spacing: IStaffSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitStaff(note: IStaff, spacing: IStaffSpacingInfo): void {
        this.callback(note, this.no++, spacing);
    }
}   

export class BarVisitor extends NullVisitor {
    constructor(private callback: (bar:IBar, index: number, spacing: IBarSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitBar(bar: IBar, spacing: IBarSpacingInfo): void {
        this.callback(bar, this.no++, spacing);
    }
}   

export class VoiceVisitor extends NullVisitor {
    constructor(private callback: (voice:IVoice, index: number, spacing: IVoiceSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitVoice(voice: IVoice, spacing: IVoiceSpacingInfo): void {
        this.callback(voice, this.no++, spacing);
    }
}   

export class NoteHeadVisitor extends NullVisitor {
    constructor(private callback: (node:INotehead, index: number, spacing: INoteHeadSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitNoteHead(notehead: INotehead, spacing: INoteHeadSpacingInfo): void {
        this.callback(notehead, this.no++, spacing);
    }
}   

export class MeterVisitor extends NullVisitor {
    constructor(private callback: (node:IMeter, index: number, spacing: IMeterSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitMeter(meter: IMeter, spacing: IMeterSpacingInfo): void {
        this.callback(meter, this.no++, spacing);
    }
}   

export class KeyVisitor extends NullVisitor {
    constructor(private callback: (node:IKey, index: number, spacing: IKeySpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitKey(key: IKey, spacing: IKeySpacingInfo): void {
        this.callback(key, this.no++, spacing);
    }
}   

export class ClefVisitor extends NullVisitor {
    constructor(private callback: (node:IClef, index: number, spacing: IClefSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitClef(clef: IClef, spacing: IClefSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

export class TimedEventVisitor extends NullVisitor {
    constructor(private callback: (node:ITimedEvent, index: number, spacing: ISpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitKey(key: IKey, spacing: ISpacingInfo): void {
        this.callback(key, this.no++, spacing);
    }
    visitMeter(meter: IMeter, spacing: IMeterSpacingInfo): void {
        this.callback(meter, this.no++, spacing);
    }
    visitClef(clef: IClef, spacing: IClefSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
    visitStaffExpression(exp: IStaffExpression, spacing: IStaffExpressionSpacingInfo): void {
        this.callback(exp, this.no++, spacing);
    }
}   

export class NoteDecorationVisitor extends NullVisitor {
    constructor(private callback: (node:INoteDecorationElement, index: number, spacing: INoteDecorationSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitNoteDecoration(clef: INoteDecorationElement, spacing: INoteDecorationSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

export class LongDecorationVisitor extends NullVisitor {
    constructor(private callback: (node:ILongDecorationElement, index: number, spacing: ILongDecorationSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitLongDecoration(clef: ILongDecorationElement, spacing: ILongDecorationSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

export class TextSyllableVisitor extends NullVisitor {
    constructor(private callback: (node:ITextSyllableElement, index: number, spacing: ITextSyllableSpacingInfo) => void) {
        super()
    }
    no: number = 0;
    visitTextSyllable(clef: ITextSyllableElement, spacing: ITextSyllableSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

