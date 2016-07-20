module jMusicScore {
    /** logical music definition classes and classes for music concepts */
    export module Model {

        export class Rational {
            constructor(public numerator: number, public denominator: number = 1) {
                if (denominator < 0) {
                    throw "Illegal denominator: " + this.ToString();
                }
            }

            static gcd(a: number, b: number): number {
                if (b === 0) return a;
                return this.gcd(b, a % b);
            }

            public ToNumber() {
                return this.numerator / this.denominator;
            }

            public ToString() {
                return this.numerator + "/" + this.denominator;
            }

            public Reduce(): Rational {
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

            public Eq(other: Rational) {
                return this.denominator * other.numerator === this.numerator * other.denominator;
            }

            public Gt(other: Rational) {
                return this.numerator * other.denominator > this.denominator * other.numerator;
            }
            public Ge(other: Rational) {
                return this.numerator * other.denominator >= this.denominator * other.numerator;
            }

            static createFromMemento(def: any): Rational {
                return new Rational(def.num, def.den);
            }

            public getMemento(): any {
                return { num: this.numerator, den: this.denominator };
            }

        }

        export class AbsoluteTime extends Rational {
            static startTime = new AbsoluteTime(0);
            static Infinity = new AbsoluteTime(1, 0);

            public Diff(other: AbsoluteTime): TimeSpan {
                return new TimeSpan(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).Reduce();
            }
            public Sub(other: TimeSpan): AbsoluteTime {
                return new AbsoluteTime(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).Reduce();
            }
            public Add(other: TimeSpan): AbsoluteTime {
                return new AbsoluteTime(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator).Reduce();
            }
            public Reduce(): AbsoluteTime {
                return <AbsoluteTime>super.Reduce();
            }
            static createFromMemento(def: any): AbsoluteTime {
                return new AbsoluteTime(def.num, def.den);
            }
        }

        export class TimeSpan extends Rational {
            static quarterNote = new TimeSpan(1, 4);
            static eighthNote = new TimeSpan(1, 8);
            static halfNote = new TimeSpan(1, 2);
            static wholeNote = new TimeSpan(1, 1);
            static infiniteNote = new TimeSpan(1, 0);

            public Sub(other: TimeSpan): TimeSpan {
                return new TimeSpan(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).Reduce();
            }
            public Add(other: TimeSpan): TimeSpan {
                return new TimeSpan(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator).Reduce();
            }
            public Reduce(): TimeSpan {
                return <TimeSpan>super.Reduce();
            }
            public Divide(other: TimeSpan): number {
                return (this.numerator * other.denominator) / (this.denominator * other.numerator);
            }
            public Modulo(other: TimeSpan): TimeSpan {
                var x = this.numerator * other.denominator;
                var y = this.denominator * other.numerator;
                if (x < 0) {
                    x += Math.ceil(-x / y) * y;
                }
                return new TimeSpan(x % y, this.denominator * other.denominator).Reduce();
            }
            public DivideScalar(scalar: number): TimeSpan {
                return new TimeSpan(this.numerator, this.denominator * scalar).Reduce();
            }
            public MultiplyScalar(scalar: number): TimeSpan {
                return new TimeSpan(scalar * this.numerator, this.denominator).Reduce();
            }
            public MultiplyRational(fraction: Rational): TimeSpan {
                return new TimeSpan(fraction.numerator * this.numerator, fraction.denominator * this.denominator).Reduce();
            }
            static createFromMemento(def: any): TimeSpan {
                return new TimeSpan(def.num, def.den);
            }
        }

        export class HorizPosition {
            constructor(public absTime: AbsoluteTime, public sortOrder: number, public graceNo: number = 0, public beforeAfter = 0) { }
            
            public static compareEvents(a: HorizPosition, b: HorizPosition): number {
                if (!a.absTime.Eq(b.absTime)) return (a.absTime.Diff(b.absTime).ToNumber());
                if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
                return a.graceNo - b.graceNo;
            }
            public Eq(comp: HorizPosition): boolean {
                return this.absTime.Eq(comp.absTime) && this.sortOrder === comp.sortOrder && this.graceNo === comp.graceNo;
            }
            public clone(beforeAfter: number): HorizPosition {
                return new HorizPosition(this.absTime, this.sortOrder, this.graceNo, beforeAfter);
            }
        }

        export interface IVisitorIterator {
            VisitPre(element: IMusicElement): (element: IMusicElement) => void;
        }

        export interface IMemento {
            id: string;
            t: string;
            def: any;
            children?: IMemento[];
        }

        export interface IMusicElement {
            changed(): void;
            moved(): void;/**/
            id: string;

            parent: IMusicElement;
            spacingInfo: ISpacingInfo;
            setSpacingInfo(info: ISpacingInfo): void;
            InviteVisitor(spacer: IVisitor): void;
            getElementName(): string;
            addChild(list: IMusicElement[], theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void;
            removeChild(theChild: IMusicElement, list?: IMusicElement[]): void;
            debug(): string;
            remove(): void;
            setProperty(name: string, value: any): void;
            getProperty(name: string): any;
            VisitAll(visitor: IVisitorIterator): void;
            getMemento(withChildren?: boolean): IMemento;
        }


        export class IdSequence {
            static _id: number = 1;
            static Next(): string { return '' + this._id++; }
        }

        export class MusicElement<SpacingInfo extends ISpacingInfo> {
            constructor(public parent: IMusicElement) {
                //this.parent = parent;
            }

            private _spacingInfo: SpacingInfo;
            public id = IdSequence.Next();

            public get spacingInfo(): SpacingInfo {
                return this._spacingInfo;
            }
            public setSpacingInfo(info: SpacingInfo): SpacingInfo {
                return this._spacingInfo = info;
            }
            public InviteVisitor(spacer: IVisitor) {
                spacer.VisitDefault(this, this._spacingInfo);
            }

            public changed() { }
            public moved() { }

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
            public VisitAll(visitor: IVisitorIterator) {
                var PostFun: (element: IMusicElement) => void = visitor.VisitPre(this);
                for (var i = 0; i < this.childLists.length; i++) {
                    for (var j = 0; j < this.childLists[i].length; j++) {
                        this.childLists[i][j].VisitAll(visitor);
                    }
                }
                if (PostFun) {
                    PostFun(this);
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

            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitBar(this, this.spacingInfo);
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

            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitScore(this, this.spacingInfo);
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
                    if (bar.absTime.Eq(absTime)) return bar;
                });
                return null;
            }

            public static PlaceInOrder(score: IScore, staff: IStaff, index: number) {
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
                for (var i = 0; i < this.staffElements.length; i++) {
                    f(this.staffElements[i], i);
                }
            }

            public withVoices(f: (voice: IVoice, index: number) => void) {
                this.withStaves((staff: IStaff, index: number): void => {
                    staff.withVoices(f);
                });
            }

            public withMeters(f: (meter: IMeter, index: number) => void) {
                for (var i = 0; i < this.meterElements.length; i++) {
                    f(this.meterElements[i], i);
                }
            }

            public withBars(f: (bar: IBar, index: number) => void) {
                for (var i = 0; i < this.bars.length; i++) {
                    f(this.bars[i], i);
                }
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
                for (var i = 0; i < this.bars.length; i++)
                    this.bars[i].changed();
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
                    if (this.meterElements[i].absTime.Eq(absTime)) {
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


        export class StaffContext {
            constructor(public clef: IClef, public key: IKey, public meter: IMeter, public barNo: number, public timeInBar: TimeSpan) {
            }

            public equals(staffContext: StaffContext): boolean {
                return this.clef.definition.Eq(staffContext.clef.definition)
                    && this.key.definition.Eq(staffContext.key.definition)
                    && this.meter.definition.Eq(staffContext.meter.definition)
                    && this.barNo === staffContext.barNo && this.timeInBar.Eq(staffContext.timeInBar);
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


            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitStaff(this, this.spacingInfo);
            }

            public withVoices(f: (voice: IVoice, index: number) => void) {
                for (var i = 0; i < this.voiceElements.length; i++) {
                    f(this.voiceElements[i], i);
                }
            }

            public withKeys(f: (key: IKey, index: number) => void) {
                for (var i = 0; i < this.keyElements.length; i++) {
                    f(this.keyElements[i], i);
                }
            }

            public withMeters(f: (meter: IMeter, index: number) => void) {
                for (var i = 0; i < this.meterElements.length; i++) {
                    f(this.meterElements[i], i);
                }
            }

            public withClefs(f: (clef: IClef, index: number) => void) {
                for (var i = 0; i < this.clefElements.length; i++) {
                    f(this.clefElements[i], i);
                }
            }

            public withTimedEvents(f: (ev: ITimedEvent, index: number) => void): void {
                for (var i = 0; i < this.keyElements.length; i++) {
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
                }
            }

            public getStaffContext(absTime: AbsoluteTime): StaffContext {
                var clef: IClef;
                this.clefElements.sort(Music.compareEvents);
                for (var i = 0; i < this.clefElements.length; i++) {
                    if (this.clefElements[i].absTime.Gt(absTime)) break;
                    clef = this.clefElements[i];
                }
                var key: IKey;
                //var keys = this.keyElements.length ? this.keyElements : this.parent.keyElements;
                this.keyElements.sort(Music.compareEvents);
                for (var i = 0; i < this.keyElements.length; i++) {
                    if (this.keyElements[i].absTime.Gt(absTime)) break;
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
                    if (meters[i].absTime.Gt(absTime)) {
                        break;
                    }
                    var meterTime: TimeSpan = meters[i].absTime.Diff(oldTime);
                    var deltaBars = i ? meterTime.Divide(oldMeasureTime) : 0;
                    barNo += deltaBars;
                    oldTime = meters[i].absTime;
                    oldMeasureTime = meters[i].getMeasureTime();
                    meter = meters[i];
                }
                var deltaBars = Math.floor((absTime.Diff(oldTime)).Divide(oldMeasureTime));
                barNo += deltaBars;
                timeInBar = absTime.Diff(oldTime).Sub(oldMeasureTime.MultiplyScalar(deltaBars));
                return new StaffContext(clef, key, meter, barNo, timeInBar);
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
                if (!toTime) toTime = AbsoluteTime.Infinity;

                this.withVoices((voice: IVoice, index: number) => {
                    events = events.concat(voice.getEvents(fromTime, toTime));
                });

                var f = (elm: ITimedEvent, index: number) => {
                    if (elm.absTime.Ge(fromTime) && toTime.Gt(elm.absTime)) events.push(elm);
                };

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
                    if (this.meterElements[i].absTime.Eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.meterElements[i] });
                        this.meterElements[i].remove();
                        this.meterElements.splice(i, 1);
                    }
                }
                var meterRef = new MeterElement(this, meter, absTime);
                meterRef.changed();
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
                    if (absTime.Gt(clef.absTime) && (!prevClef || clef.absTime.Gt(prevClef.absTime))) {
                        prevClef = clef;
                    }
                    if (clef.absTime.Eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.clefElements[i] });
                        clef.remove();
                        this.clefElements.splice(i, 1);
                    }
                }
                if (prevClef && prevClef.definition.Eq(type)) {
                    // no change
                    return;
                }
                var clefRef = new ClefElement(this, type, absTime);
                clefRef.changed();
                this.addChild(this.clefElements, clefRef);
            }
            public setKey(key: IKeyDefinition, absTime: AbsoluteTime) {
                for (var i = 0; i < this.keyElements.length; i++) {
                    if (this.keyElements[i].absTime.Eq(absTime)) {
                        //this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: this.keyElements[i] });
                        this.keyElements[i].remove();
                        this.keyElements.splice(i, 1);
                    }
                }
                var keyRef = new KeyElement(this, key, absTime);
                keyRef.changed();
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

            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitStaffExpression(this, this.spacingInfo);
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
            noteElements: INote[];
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

            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitVoice(this, this.spacingInfo);
            }

            public noteElements: INote[] = [];
            private stemDirection: StemDirectionType = StemDirectionType.stemFree;

            public withNotes(f: (note: INote, index: number) => void) {
                for (var i = 0; i < this.noteElements.length; i++) {
                    f(this.noteElements[i], i);
                }
            }
            public getStemDirection(): StemDirectionType {
                return this.stemDirection;
            }
            public setStemDirection(dir: StemDirectionType) {
                if (this.stemDirection != dir) {
                    this.stemDirection = dir;
                    this.changed();
                }
            }
            public getEvents(fromTime: AbsoluteTime = null, toTime: AbsoluteTime = null): ITimedEvent[] {
                var events: ITimedEvent[] = [];
                if (!fromTime) fromTime = AbsoluteTime.startTime;
                if (!toTime) toTime = AbsoluteTime.Infinity;
                this.withNotes((note: INote, index: number) => {
                    if (!fromTime.Gt(note.absTime) && toTime.Gt(note.absTime)) {
                        events.push(note);
                    }
                });
                return events;
            }
            public getElementName() { return "Voice"; }

            public getEndTime(): AbsoluteTime {
                if (this.noteElements.length) {
                    var lastNote = this.noteElements[this.noteElements.length - 1];
                    return lastNote.absTime.Add(lastNote.getTimeVal());
                }
                else return AbsoluteTime.startTime;
            }
        }

        export enum ClefType { clefNone, clefG, clefC, clefF, clefPercussion, clefTab }
        export class ClefDefinition {
            constructor(public clefCode: ClefType, public clefLine: number, public transposition: number = 0) { // clefline: top line is 1
            }

            static clefG = new ClefDefinition(Model.ClefType.clefG, 4);
            static clefGTenor = new ClefDefinition(Model.ClefType.clefG, 4, -7);
            static clefF = new ClefDefinition(Model.ClefType.clefF, 2);
            static clefCAlto = new ClefDefinition(Model.ClefType.clefC, 3);
            static clefPerc = new ClefDefinition(Model.ClefType.clefPercussion, 0);

            public clefDef(): number {
                switch (this.clefCode) {
                    case ClefType.clefG: return 2;
                    case ClefType.clefC: return -2;
                    case ClefType.clefF: return -6;
                    case ClefType.clefNone: return -2;
                    case ClefType.clefPercussion: return -2;
                    case ClefType.clefTab: return -2;
                }
            }

            public clefName(): string {
                switch (this.clefCode) {
                    case ClefType.clefG: return "g";
                    case ClefType.clefC: return "c";
                    case ClefType.clefF: return "f";
                    case ClefType.clefNone: return "n";
                    case ClefType.clefPercussion: return "p";
                    case ClefType.clefTab: return "t";
                }
            }

            public static ClefNameToType(name: string): ClefType {
                switch (name.toLowerCase()) {
                    case "g": return ClefType.clefG;
                    case "c": return ClefType.clefC;
                    case "f": return ClefType.clefF;
                    case "n": return ClefType.clefNone;
                    case "p": return ClefType.clefPercussion;
                    case "t": return ClefType.clefTab;
                }
            }

            public PitchOffset(): number {
                return this.clefDef() + this.transposition + 2 * this.clefLine;
                /*
                g4 = 10
                g4/-7 = 3
                f2 = -2
                c3 = 4
                */
            }

            public pitchToStaffLine(pitch: Pitch): number {
                return -pitch.pitch + this.PitchOffset();
            }

            public staffLineToPitch(line: number): Pitch {
                return new Pitch(-line + this.PitchOffset(), "");
            }

            public Eq(other: ClefDefinition): boolean {
                return this.clefCode === other.clefCode && this.clefLine === other.clefLine && this.transposition === other.transposition;
            }

            public debug(): string {
                return this.clefName() + this.clefLine + (this.transposition ? ("/" + this.transposition) : "");
            }
        }

        export interface IClef extends ITimedEvent {
            parent: IStaff;
            definition: ClefDefinition;            
            pitchToStaffLine(pitch: Pitch): number;
            staffLineToPitch(line: number): Pitch;
        }

        // ClefElement
        class ClefElement extends MusicElement<IClefSpacingInfo> implements IClef {
            constructor(public parent: IStaff, public definition: ClefDefinition, public absTime: AbsoluteTime = null) {
                super(parent);
                if (!this.absTime) this.absTime = AbsoluteTime.startTime;
            }
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitClef(this, this.spacingInfo);
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

            public makeSureExists() {
                this.changed();
            }
            public setClef(clef: ClefDefinition) {
                this.definition = clef;
                this.changed();
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

        export interface IKeyDefinition {
            debug(): string
            getFixedAlteration(pitch: number): string;
            Eq(other: IKeyDefinition): boolean;
            enumerateKeys(): Array<PitchClass>;
            getTonic(): PitchClass;
            getMemento(): any;
        }

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

            public Eq(other: IKeyDefinition): boolean {
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

        export interface IKeyDefCreator {
            createFromMemento: (memento: any) => IKeyDefinition
        }

        export class KeyDefinitionFactory {
            private static keyClasses: { [i: string]: IKeyDefCreator } = {
                "Regular": RegularKeyDefinition
            };

            public static Register(key: string, cls: IKeyDefCreator) {
                this.keyClasses[key] = cls;
            }

            public static CreateKeyDefinition(memento: any): IKeyDefinition {
                if (memento.t) {
                    var m = this.keyClasses[memento.t];
                    if (m) return m.createFromMemento(memento);
                }
                return null;
            }
        }

        export interface IKey extends ITimedEvent {
            parent: IStaff;
            definition: IKeyDefinition;
            getFixedAlteration(pitch: number): string;
            getTonic(): PitchClass;
        }

        // KeyElement
        class KeyElement extends MusicElement<IKeySpacingInfo> implements IKey {
            constructor(public parent: IStaff, public definition: IKeyDefinition, public absTime: AbsoluteTime = null) {
                super(parent);
                if (!absTime) this.absTime = AbsoluteTime.startTime;
            }
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitKey(this, this.spacingInfo);
            }
            static createFromMemento(parent: IStaff, memento: IMemento): IKey {
                var def = KeyDefinitionFactory.CreateKeyDefinition(memento.def.def);
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

        export interface IMeterDefinition {
            debug(): string;
            getMeasureTime(): TimeSpan;
            nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
            Eq(other: IMeterDefinition): boolean;
            display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[];
            getMemento(): any;
        }

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
                var boundaryTime = (abstime.Diff(meterTime)).Modulo(this.boundaryInterval);
                if (boundaryTime.numerator) { // % 64
                    return abstime.Sub(boundaryTime).Add(this.boundaryInterval);
                }
                else {
                    return abstime;
                }
            }

            public nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
                // todo: calculation
                var mtime = this.getMeasureTime();
                var barTime = (abstime.Diff(meterTime)).Modulo(mtime);
                if (barTime.numerator) {
                    //if ((abstime - this.absTime) % mtime) {
                    //return abstime - (abstime - this.absTime) % mtime + mtime
                    return abstime.Sub(barTime).Add(mtime);
                }
                else {
                    return abstime.Add(mtime);
                }
            }

            public Eq(other: IMeterDefinition): boolean {
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

        export class OffsetMeterDefinition extends RegularMeterDefinition {
            constructor(public numerator: number, public denominator: number, public offset: TimeSpan) {
                super(numerator, denominator);
            }

            public nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
                return super.nextBoundary(abstime.Sub(this.offset), meterTime).Add(this.offset);
            }

            public nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
                return super.nextBar(abstime.Sub(this.offset), meterTime).Add(this.offset);
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

        export interface IMeterDefCreator {
            createFromMemento: (memento: any) => IMeterDefinition
        }

        export class MeterDefinitionFactory {
            private static meterClasses: { [i: string]: IMeterDefCreator } = {
                "Regular": RegularMeterDefinition,
                "OffsetRegular": OffsetMeterDefinition
            };

            public static Register(key: string, cls: IMeterDefCreator) {
                this.meterClasses[key] = cls;
            }

            public static CreateMeterDefinition(memento: any): IMeterDefinition {
                if (memento.t) {
                    var m = this.meterClasses[memento.t];
                    if (m) return m.createFromMemento(memento);
                }
                return null;
            }
        }       


        export interface IMeter extends ITimedEvent {
            parent: IMusicElement;
            definition: IMeterDefinition;

            getMeasureTime(): TimeSpan;
            nextBoundary(abstime: AbsoluteTime): AbsoluteTime;
            nextBar(abstime: AbsoluteTime): AbsoluteTime;
        }

        // MeterElement
        class MeterElement extends MusicElement<IMeterSpacingInfo> implements IMeter {
            constructor(public parent: IMeterOwner, public definition: IMeterDefinition, public absTime: AbsoluteTime) {
                super(parent);
            }
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitMeter(this, this.spacingInfo);
            }
            static createFromMemento(parent: IMeterOwner, memento: IMemento): IMeter {
                if (!memento.def) return null;
                var def = MeterDefinitionFactory.CreateMeterDefinition(memento.def.def);
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

        export enum NoteType { note, rest, placeholder }
        export enum StemDirectionType { stemFree, stemUp, stemDown }
        export class PitchClass {
            // 0 = c, 1 = g, -1 = f etc.
            constructor(public pitchClass: number) {
                this.pitchClass = pitchClass;
            }

            static Create(pitch: Pitch) {
                var p1 = pitch.pitch % 7;
                return new PitchClass(PitchClass.pitchToPC[p1] + 7 * Pitch.strToInt(pitch.alteration));
            }

            public noteNameLilypond(): string {
                var x = this.pitchClass + 15;
                var noteNameRoot = PitchClass.noteNames[x % 7];
                var accidentalSuffixNo = Math.floor(x / 7);
                return noteNameRoot + PitchClass.suffices[accidentalSuffixNo];
            }

            static noteNames = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
            static suffices = ['eses', 'es', '', 'is', 'isis'];
            static pitchToPC = [0, 2, 4, -1, 1, 3, 5];
        }

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
                    var pc = PitchClass.Create(this);
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
            static alterations: { [Index: string]: string } = { 'bb': 'eses', 'b': 'es', 'n': '', 'x': 'is', 'xx': 'isis', '': '' };
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

        export interface IBeam {
            parent: INote;
            toNote: INote;
            index: number;
            spacingInfo: IBeamSpacingInfo;
            setSpacingInfo(spacingInfo: IBeamSpacingInfo): void;
            InviteVisitor(spacer: IVisitor): void;
            remove(): void;
        }

        export class BeamElement extends MusicElement<IBeamSpacingInfo> implements IBeam {
            constructor(public parent: INote, public toNote: INote, public index: number) {
                super(parent);
            }
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitBeam(this, this.spacingInfo);
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
            noteId: string;
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

        /** nominalValue = shown note; fraction = real value compared to nominal
        e.g. 3 quarters to 2: fullTime = 1/2; fraction = 2/3
             5 16th to 3: fullTime = 3/16; fraction = 3/5
             4th + 8th in place of 4th: fullTime = 1/4; fraction = 2/3 (on both notes)
             fullTime is only set on first note in group - rest are null
             real timespan = timeVal*fraction
             total length of group: fullTime
        */
        export class TupletDef {
            constructor(public fullTime: TimeSpan, public fraction: Rational) { }
            public Eq(other: TupletDef): boolean {
                if (!this.fullTime && !other.fullTime) return true;
                if (!this.fullTime || !other.fullTime) return false;
                return this.fullTime.Eq(other.fullTime) && this.fraction.Eq(other.fraction);
            }
        }

        class NoteElement extends MusicElement<INoteSpacingInfo> implements ITimedEvent {
            constructor(public parent: IVoice, private _noteId: string, public timeVal: TimeSpan) {
                super(parent);
                if (!_noteId && timeVal) {
                    this._noteId = Music.calcNoteId(timeVal);
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
                    var noteType: NoteType = memento.def.hidden ? NoteType.placeholder : memento.def.rest ? NoteType.rest : NoteType.note;
                    var beforeNote: INote = null;
                    var note = Music.AddNote(parent, noteType, AbsoluteTime.createFromMemento(memento.def.abs), memento.def.noteId,
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
                    noteId: this._noteId                    
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
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitNote(this, this.spacingInfo);
            }

            public get noteId(): string { return this._noteId; }
            public set noteId(v: string) {
                if (this._noteId !== v) {
                    this._noteId = v;
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
            private stemDirection = StemDirectionType.stemFree;

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
                for (var i = 0; i < this.noteheadElements.length; i++) {
                    f(this.noteheadElements[i], i);
                }
            }

            public withDecorations(f: (deco: INoteDecorationElement, index: number) => void) {
                for (var i = 0; i < this.decorationElements.length; i++) {
                    f(this.decorationElements[i], i);
                }
            }

            public withLongDecorations(f: (deco: ILongDecorationElement, index: number) => void) {
                for (var i = 0; i < this.longDecorationElements.length; i++) {
                    f(this.longDecorationElements[i], i);
                }
            }

            public withSyllables(f: (syll: ITextSyllableElement, index: number) => void) {
                for (var i = 0; i < this.syllableElements.length; i++) {
                    f(this.syllableElements[i], i);
                }
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
                    this.changed();
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
                    this.changed();
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
                    this.changed();
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
                    this.changed();
                    return newpitch;
                }
            }
            getTimeVal(): TimeSpan {
                if (this.graceType) return new TimeSpan(0);
                var timeVal = this.timeVal;
                if (this.dotNo > 0) timeVal = timeVal.Add(this.timeVal.DivideScalar(2));
                if (this.dotNo > 1) timeVal = timeVal.Add(this.timeVal.DivideScalar(4));
                if (this.dotNo > 2) timeVal = timeVal.Add(this.timeVal.DivideScalar(8));
                if (this.tupletDef) {
                    timeVal = timeVal.MultiplyRational(this.tupletDef.fraction);
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

            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitNoteHead(this, this.spacingInfo);
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
                this.moved();
            }
            recalc() {
                this.changed();
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

        /** Kinds of Note decorations. */
        export enum NoteDecorationKind {
            accN = 0, accX, accB, accXX, accBB,
            fermata = 5, shortFermata, longFermata, veryLongFermata,
            thumb = 9, sforzato, espr, staccato, staccatissimo, tenuto, portato, marcato,
            open = 17, stopped, upbow, downbow, reverseturn, turn, trill, pedalheel, pedaltoe,
            flageolet = 26, rcomma, prall, mordent, prallprall, prallmordent,
            upprall = 32, upmordent, pralldown, downprall, downmordent, prallup, lineprall,
            caesura = 39, lcomma, rvarcomma, lvarcomma,
            arpeggio = 43, arpeggioDown, nonArpeggio
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
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitNoteDecoration(this, this.spacingInfo);
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

        /** Long note decoration type, e.g. hairpin, trill extension and slur */
        export enum LongDecorationType { trillExt, cresc, decresc, slur, bracket, tuplet, ottava }
        /** Long note decoration interface, e.g. hairpin, trill extension and slur */
        export interface ILongDecorationElement extends IMusicElement {
            parent: INote;
            placement: string;
            spacingInfo: ILongDecorationSpacingInfo;
            EndEvent: ITimedEvent;
            type: LongDecorationType;
        }

        /** Long note decoration implementation, e.g. hairpin, trill extension and slur */
        export class NoteLongDecorationElement extends MusicElement<ILongDecorationSpacingInfo> implements ILongDecorationElement {
            constructor(public parent: INote, private duration: TimeSpan, public type: LongDecorationType) {
                super(parent);
            }
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitLongDecoration(this, this.spacingInfo);
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

            public get EndEvent(): ITimedEvent {
                var note = this.parent;
                var endTime = note.absTime.Add(this.duration);
                while (note) {
                    var newNote = Music.nextNote(note);
                    if (newNote && endTime.Gt(note.absTime)) {
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
            text: string;
            parent: INote;
        }

        /** Text syllable from lyrics, shown under or over a note */
        export class TextSyllableElement extends MusicElement<ITextSyllableSpacingInfo> implements ITextSyllableElement {
            constructor(public parent: INote, private _text: string) {
                super(parent);
            }
            public InviteVisitor(visitor: IVisitor) {
                visitor.VisitTextSyllable(this, this.spacingInfo);
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
            public get text(): string {
                return this._text;
            }
            public set text(id: string) {
                if (this._text !== id) {
                    this._text = id;
                    this.changed();
                }
            }
            public getElementName(): string { return "TextSyllable"; }
        }

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

        export interface IVisitor {
            VisitNoteHead(head: Model.INotehead, spacing: INoteHeadSpacingInfo): void;
            VisitNote(note: Model.INote, spacing: INoteSpacingInfo): void;
            VisitNoteDecoration(deco: Model.INoteDecorationElement, spacing: INoteDecorationSpacingInfo): void;
            VisitLongDecoration(deco: Model.ILongDecorationElement, spacing: ILongDecorationSpacingInfo): void;
            VisitVoice(voice: Model.IVoice, spacing: IVoiceSpacingInfo): void;
            VisitClef(clef: Model.IClef, spacing: IClefSpacingInfo): void;
            VisitMeter(meter: Model.IMeter, spacing: IMeterSpacingInfo): void;
            VisitKey(key: Model.IKey, spacing: IKeySpacingInfo): void;
            VisitStaff(staff: Model.IStaff, spacing: IStaffSpacingInfo): void;
            VisitScore(score: Model.IScore, spacing: IScoreSpacingInfo): void;
            VisitTextSyllable(text: Model.ITextSyllableElement, spacing: ITextSyllableSpacingInfo): void;
            VisitBar(bar: Model.IBar, spacing: IBarSpacingInfo): void;
            VisitBeam(beam: Model.IBeam, spacing: Model.IBeamSpacingInfo): void;
            VisitStaffExpression(staffExpression: Model.IStaffExpression, spacing: Model.IStaffExpressionSpacingInfo): void;

            VisitDefault(element: Model.IMusicElement, spacing: Model.ISpacingInfo): void;
        }


        export interface INoteHeadSpacingInfo extends ISpacingInfo {
            accidentalX: number;
            dots: Point;
            dotWidth: number;
            displacement: boolean;
            displace: Model.Point;
            headGlyph: string;
            reversed: boolean;
            tieStart: Point;
            tieEnd: Point;
            tieDir: number;
            graceScale: number;
            accidentalStep: number;
        }
        export interface IBeamSpacingInfo extends Model.ISpacingInfo {
            start: Model.Point;
            end: Model.Point;
            beamDist: number;
            beamCount: number;
        }
        export class LedgerLineSpacingInfo {
            constructor(public xStart: number, public xEnd: number, public y: number) { }
        }
        export interface INoteSpacingInfo extends Model.ISpacingInfo {
            dots: Model.Point;
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
            end: Model.Point;
            extraXOffset: number;
        }
        export interface IScoreSpacingInfo extends ISpacingInfo { }
        export interface ITextSyllableSpacingInfo extends ISpacingInfo { }

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
                var i = voice.noteElements.indexOf(note);
                if (i > 0) {
                    return voice.noteElements[i - 1];
                }
                return null;
            }
            static nextNote(note: INote): INote { // (noteIndex >= note.parent.noteElements.length) ? null : note.parent.noteElements[noteIndex + 1];
                var voice = note.parent;
                var i = voice.noteElements.indexOf(note);
                if (i >= 0 && i < voice.noteElements.length - 1) {
                    return voice.noteElements[i + 1];
                }
                return null;
            }
            /*static getTypeMapping(): { [Index: string]: any } { // remove when JSON load uses Mementos
                return {
                    "clefElements": ClefElement,// IClef
                    "meterElements": MeterElement,// IMeter
                    "keyElements": KeyElement,//IKey
                    "noteElements": NoteElement,// INote
                    "decorationElements": NoteDecorationElement,// INoteDecorationElement - export
                    "longDecorationElements": NoteLongDecorationElement,//ILongDecorationElement - export
                    "syllableElements": TextSyllableElement,//ITextSyllableElement -export
                    "noteheadElements": NoteheadElement,//INotehead
                    "bars": BarElement,//IBar
                    "staffElements": StaffElement,// IStaff
                    "voiceElements": VoiceElement//IVoice
                };
            }*/
            public static calcNoteId(timeVal: TimeSpan): string {
                timeVal.Reduce();

                // check tuplets:
                var denom = timeVal.denominator;
                while (denom % 2 === 0) denom /= 2;
                if (denom !== 1) return null;

                if (timeVal.numerator === 3) {
                    timeVal = timeVal.MultiplyRational(new Rational(2, 3));
                }
                if (timeVal.numerator === 7) {
                    timeVal = timeVal.MultiplyRational(new Rational(4, 7));
                }

                if ((timeVal.numerator === 2 && timeVal.denominator === 1) || timeVal.numerator === 1) {
                    return "n" + timeVal.numerator + "_" + timeVal.denominator;
                }
                return null;
            }
            static FindNote(voice: IVoice, absTime: AbsoluteTime): INote {
                var res: INote;
                for (var i = 0; i < voice.noteElements.length; i++) {
                    var note = voice.noteElements[i];
                    if (note.absTime.Add(note.getTimeVal()).Gt(absTime)) {
                        return note;
                    }
                }
                voice.withNotes((note: INote) => {
                    if (absTime.Ge(note.absTime) && note.absTime.Add(note.timeVal).Gt(absTime)) {
                        res = note;
                    }
                });
                return res;
            }

            /** Check if absTime is in an area with unfinished tuplets and return the current tuplet fraction at this absTime */
            static InTupletArea(voice: IVoice, absTime: AbsoluteTime): Rational {
                // Find first note in the bar
                // todo: maybe add support for tuplets crossing bar lines
                var staffContext = voice.parent.getStaffContext(absTime);
                var barBegin: AbsoluteTime = absTime.Sub(staffContext.timeInBar);
                var firstNoteInBar: INote = this.FindNote(voice, barBegin);
                if (firstNoteInBar) {
                    var tupletFraction: Rational = null;
                    var note = firstNoteInBar;
                    while (note && !note.absTime.Ge(absTime)) {
                        if (note.tupletDef) { // todo: nested tuplets
                            if (note.tupletDef.fullTime) {
                                var endTime = note.absTime.Add(note.tupletDef.fullTime);
                                if (endTime.Gt(absTime)) {
                                    return note.tupletDef.fraction;
                                }
                                while (note && !note.absTime.Ge(endTime)) {
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
            static AddNote(voice: IVoice, noteType: NoteType, absTime: AbsoluteTime, noteId: string, timeVal: TimeSpan, beforeNote: INote = null, insert: boolean = true, dots: number = 0, tuplet: TupletDef = null): INote {
                var note = new NoteElement(voice, noteId, timeVal);
                note.absTime = absTime;

                note.tupletDef = tuplet;

                var fraction = this.InTupletArea(voice, absTime);
                if (fraction) {
                    note.tupletDef = new TupletDef(null, fraction);
                }
                var voiceTime = voice.getEndTime();
                if (absTime.Gt(voiceTime)) {
                    // add placeholders between voiceTime and absTime
                    var restNote = new NoteElement(null, 'hidden', absTime.Diff(voiceTime));
                    restNote.setParent(voice);
                    restNote.setRest(true);
                    restNote.absTime = Model.AbsoluteTime.startTime;
                    voice.addChild(voice.noteElements, restNote, null, false);
                }
                var oldNote: INote = beforeNote;
                if (!oldNote && voiceTime.Gt(absTime)) {
                    // find note at absTime
                    oldNote = this.FindNote(voice, absTime);
                    // if placeholder shorten it
                    if (oldNote) { // todo: shorten placeholder
                        if (oldNote.noteId === "hidden") {
                            var oldTime = oldNote.getTimeVal();
                            if (oldTime.Gt(timeVal)) {
                                oldNote.timeVal = oldTime.Sub(timeVal);
                            }
                            else if (oldTime.Eq(timeVal)) {
                            }
                        }
                    }
                }
                note.dotNo = dots;
                voice.addChild(voice.noteElements, note, oldNote);
                if (noteType === NoteType.rest) {
                    note.setRest(true);
                }
                else if (noteType === NoteType.placeholder) {
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
                            txt += note.syllableElements[0].text + ' ';
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

        export interface IMusicElementCreator { createFromMemento: (parent: IMusicElement, memento: any) => IMusicElement }
        export class MusicElementFactory {
            private static mementoCreators: { [i: string]: IMusicElementCreator } = {
                "Score": ScoreElement,
                "Staff": StaffElement,
                "Voice": VoiceElement,
                "Note": NoteElement,
                "Notehead": NoteheadElement,
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
            static register(key: string, creator: IMusicElementCreator) {
                this.mementoCreators[key] = creator;
            }
            public static RecreateElement(parent: IMusicElement, memento: IMemento): IMusicElement {
                var res: IMusicElement;
                var creator = this.mementoCreators[memento.t];
                if (creator) {
                    res = creator.createFromMemento(parent, memento);
                    var children = memento.children;
                    if (children) {
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            var elm = this.RecreateElement(res, child);
                        }
                    }
                }
                return res;
            }
        }
   }

}