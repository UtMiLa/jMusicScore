import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-music-basics';
import { ISpacingInfo, IMusicElement, IVisitor, IBarSpacingInfo, IBar, IEventInfo, IScore, IVoice, IStaff, ISequence, IScoreSpacingInfo, 
    IMeter, IClef, IStaffSpacingInfo, IKey, IStaffExpression, IStaffExpressionSpacingInfo, IVoiceSpacingInfo, INote, 
    INoteSource, INoteContext, IEventEnumerator, ITimedEvent, ISequenceNote, INoteInfo, IClefSpacingInfo, IKeySpacingInfo, IMeterSpacingInfo, 
    IMeterOwner, IBeamSpacingInfo, IBeam, INoteSpacingInfo, INotehead, INoteDecorationElement, ILongDecorationElement, ITextSyllableElement, 
    INoteHeadSpacingInfo, INoteHeadInfo, INoteDecorationSpacingInfo,  ILongDecorationSpacingInfo, ITextSyllableSpacingInfo, 
    IMusicElementCreator, 
    IEventVisitor,
    INoteDecorationEventInfo,
    ILongDecorationEventInfo,
    ITextSyllableEventInfo,
    IBeamEventInfo,
    IBarEventInfo,
    IClefEventInfo,
    IMeterEventInfo,
    IKeyEventInfo,
    IStaffExpressionEventInfo,
    IPoint,
    IGlobalContext,
    IEventVisitorTarget,
    IEventContainer} from './jm-model-interfaces';



/**
 * Id sequence - singleton to generate unique ids
 */
export class IdSequence {
    static id: number = 1;
    static next(): string { return '' + IdSequence.id++; }
}

/**
 * Base music element.
 * 
 * The score composition is made up of music elements of various kinds. The structure can be visited by visitors.
 */
export class MusicElement implements IMusicElement {
    constructor(public parent: IMusicElement) {
        //this.parent = parent;
    }

    public id = IdSequence.next();

    public inviteVisitor(spacer: IVisitor) {
        spacer.visitDefault(this);
    }

    public inviteEventVisitor(spacer: IEventVisitor, globalContext: IGlobalContext) {
    }

    private properties: { [index: string]: any; } = {};

    public getElementName() { return "Element"; }

    public debug() {
        var string = this.getElementName();

        return string;
    }

    public remove(): void {
    }
    public setParent(p: IMusicElement) {
        this.parent = p;
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
        return memento;
    }
    public visitAll(visitorIterator: IVisitorIterator<IMusicElement>) {
        /*if ((<any>visitor).visitNoteInfo) {
            alert("event");
        }
        else {*/
            var postFun: (element: IMusicElement) => void = visitorIterator.visitPre(this);
            if (postFun) {
                postFun(this);
            }
        //}
    }
}

/**
 * Music container that can contain other music elements
 */
export class MusicContainer extends MusicElement implements IEventVisitorTarget, IEventContainer {
    getEventsOld(globalContext: IGlobalContext): ITimedEvent[] {
        throw new Error("Method not implemented.");
    }

    public getEvents(globalContext: IGlobalContext, fromTime?: AbsoluteTime, toTime?: AbsoluteTime): IEventInfo[]{
        return [];
    }

    withEvents(f: (meter: IEventInfo, index: number) => void, globalContext: IGlobalContext): void {
        const events = this.getEvents(globalContext);
        for (var i = 0; i < events.length; i++) {
            f(events[i], i);
        }
    }

    withOwnMeters(f: (meter: IMeter, index: number) => void): void {
        const visitor = new MeterVisitor(f)
        for (var i = 0; i < this.removeThisChildren.length; i++) {
            this.removeThisChildren[i].inviteVisitor(visitor);
        }
    }

    withOwnClefs(f: (clef: IClef, index: number) => void): void {
        const visitor = new ClefVisitor(f)
        for (var i = 0; i < this.removeThisChildren.length; i++) {
            this.removeThisChildren[i].inviteVisitor(visitor);
        }
    }

    withOwnKeys(f: (key: IKey, index: number) => void): void {
        const visitor = new KeyVisitor(f)
        for (var i = 0; i < this.removeThisChildren.length; i++) {
            this.removeThisChildren[i].inviteVisitor(visitor);
        }
    }

    withAllMeters(f: (meter: IMeterEventInfo, index: number) => void, globalContext: IGlobalContext): void {
        const visitor = new MeterEventVisitor(f, globalContext);
        this.visitAllEvents(visitor, globalContext);
    }
    withAllClefs(f: (clef: IClefEventInfo, index: number) => void, globalContext: IGlobalContext): void {
        const visitor = new ClefEventVisitor(f, globalContext);
        this.visitAllEvents(visitor, globalContext);
    }
    withAllKeys(f: (key: IKeyEventInfo, index: number) => void, globalContext: IGlobalContext): void {
        const visitor = new KeyEventVisitor(f, globalContext);
        this.visitAllEvents(visitor, globalContext);
    }


    //protected children: IMusicElement[] = [];
    protected removeThisChildren: IMusicElement[] = [];

    withChildren(f: (child: IMusicElement) => void) {
        for (var i = 0; i < this.removeThisChildren.length; i++) {
            f(this.removeThisChildren[i]);
        }
    }

    getSpecialElements<T extends IMusicElement>(elementName: string): T[] {
        let res: T[] = [];
        //for (var i = 0; i < this.children.length; i++) {
            this.withChildren((child) => {
                if (child.getElementName() === elementName) res.push(<T>child);
            });
        
        return res;
    }

    /*getAncestor<T extends IMusicElement>(elementName: string): T {
        if (this.getElementName() === elementName) return <T><any>this;
        if (!this.parent) return null;
        return this.parent.getAncestor<T>(elementName);
    }*/

    public getChild(index: number): IMusicElement{
        return this.removeThisChildren[index];
    }

    public addChild(theChild: IMusicElement, before: IMusicElement = null, removeOrig: boolean = false) : void{
        /*var index = this.childLists.indexOf(list);
        if (index >= 0) {
            //this.childLists[index];
        }
        else {
            this.childLists.push(list);
        }*/
        var list = this.removeThisChildren;

        if (before) {
            var i = list.indexOf(before);
            if (i < 0) return /*false*/;
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

    public removeChild(theChild: IMusicElement) {
        var index = this.removeThisChildren.indexOf(theChild);
        if (index >= 0) {
            this.removeThisChildren.splice(index, 1);
            //            this.sendEvent({ type: MusicEventType.eventType.removeChild, sender: this, child: theChild });
        }
        theChild.remove();
    
    }


    public debug() {
        var string = this.getElementName() + ": ";

        this.withChildren((child) => {
            //for (var j = 0; j < this.children.length; j++) {
            string += child.debug();
        });
        string += " :" + this.getElementName() + " ";
        return string;
    }
    public remove(): void {
        this.withChildren((child) => {

        //for (var j = 0; j < this.children.length; j++) {
            child.remove();
        });
    }

    public getMemento(withChildren: boolean = true): IMemento {
        var memento: IMemento = {
            id: this.id,
            t: this.getElementName(),
            def: this.doGetMemento()
        };
        if (withChildren) {
            var children: IMemento[] = [];
            
            this.withChildren((child) => {
                    children.push(child.getMemento(true));
                });
            
            if (children.length) memento.children = children;
        }
        return memento;
    }

    protected visitChildEvents(visitorIterator: IVisitorIterator<IEventVisitorTarget>, globalContext: IGlobalContext){
    }

    visitAllEvents(visitorIterator: IVisitorIterator<IEventVisitorTarget>, globalContext: IGlobalContext): void {
        var postFun: (element: IEventVisitorTarget) => void = visitorIterator.visitPre(this);
        this.visitChildEvents(visitorIterator, globalContext);
        if (postFun) {
            postFun(this);
        }
    }

    public visitAll(visitorIterator: IVisitorIterator<IMusicElement>) {
        var postFun: (element: IMusicElement) => void = visitorIterator.visitPre(this);
        this.withChildren((child) => {
            child.visitAll(visitorIterator);
        });
        if (postFun) {
            postFun(this);
        }

    }
}

/**
 * Global context
 * 
 * Object that contains the variables and caches spacing info objects.
 * Should be replaced by a project object.
 */
export class GlobalContext implements IGlobalContext {
    private _variables: { [key: string]: ISequence } = {};
    private _spacingInfos: { [key: string]: ISpacingInfo } = {};

    getVariable(name: string): ISequence {
        return this._variables[name];
    }
    addVariable(name: string, value: ISequence) {
        this._variables[name] = value;
    }

    getSpacingInfo<T extends ISpacingInfo>(element: IMusicElement): T {
        //return <T>(<any>element).spacingInfo;
        return <T>this._spacingInfos[element.id];
    }

    addSpacingInfo(element: IMusicElement, value: ISpacingInfo) {
        //(<any>element).spacingInfo = value;
        this._spacingInfos[element.id] = value;
    }
}


/******************************************** Spacing stuff ************************************************************/
/**
 * 2D Point
 * 
 * Used for graphical definitions
 */
export class Point implements IPoint {
    constructor(public x: number, public y: number) { }
}


/**
 * Note context
 * 
 * deprecated?
 * This is a helper object that knows of a note and the staff context of the note
 */
export class NoteContext implements INoteContext {
    constructor(public noteInfo: INoteInfo, public note: INote, public voice: IVoice) {
        if (!voice) {
            //debugger;
            //alert("fejl");
            this.voice = (<any>note).voice; // todo: find voice rigtigt
        }
    }

    getStaffContext(globalContext: IGlobalContext): StaffContext {
        return this.voice.parent.getStaffContext(this.absTime, globalContext);
    }        
    get decorationElements() { return this.note.decorationElements; }
    getStemDirection(): StemDirectionType {
        return this.note.getStemDirection();
    }
    get absTime(): AbsoluteTime { return this.note.absTime; }
    set absTime(value: AbsoluteTime) { this.note.absTime = value; } // todo: skal opdatere NoteInfo
    getElementName(): string {
        return this.note.getElementName();
    }
    debug(): string {
        return this.note.debug();
    }
    getSortOrder(): number {return this.note.getSortOrder();}
    getHorizPosition(): HorizPosition {
        return this.note.getHorizPosition();
    }
    getEvents(globalContext: IGlobalContext): IEventInfo[] {
        //return [this.noteInfo];
        return [this.note.getInfo()];//this.note.getEvents();
    }
    get id(): string { return this.noteInfo.id; }
    inviteVisitor(spacer: IVisitor): void {
        return this.note.inviteVisitor(spacer);
    }
    remove(): void {
        this.note.remove();
    }
    setProperty(name: string, value: any): void {
        this.note.setProperty(name, value);
    }
    getProperty(name: string) {
        return this.note.getProperty(name);
    }
    visitAll(visitorIterator: IVisitorIterator<IMusicElement>): void {
        this.note.visitAll(visitorIterator);
    }
    getMemento(withChildren?: boolean): IMemento {
        return this.note.getMemento(withChildren);
    }


}

/***************** Visitors ***************** */



/**
 * Null visitor visits elements without doing anything.
 * 
 * Base class for visitors that only implement few mehods.
 */
class NullVisitor implements IVisitor, IVisitorIterator<IMusicElement> {
    visitPre(element: IMusicElement): (element: IMusicElement) => void {
        element.inviteVisitor(this);
        return null;
    }

    visitNoteHead(head: INotehead) { }
    visitNote(note: INote) { }
    visitNoteDecoration(deco: INoteDecorationElement) { }
    visitLongDecoration(deco: ILongDecorationElement) { }
    visitVoice(voice: IVoice) { }
    visitClef(clef: IClef) { }
    visitMeter(meter: IMeter) { }
    visitKey(key: IKey) { }
    visitStaff(staff: IStaff) { }
    visitScore(score: IScore) { }
    visitTextSyllable(textSyllable: ITextSyllableElement) { }
    visitBar(bar: IBar) { }
    visitBeam(beam: IBeam) { }
    visitStaffExpression(staffExpression: IStaffExpression): void { }

    visitDefault(element: IMusicElement): void { }
    visitVariable(name: string): void {}
}

/**
 * Context visitor
 * 
 * Keeps track of staff and score context while traversing the score composition.
 */
export class ContextVisitor extends NullVisitor {
    score: IScore;
    staff: IStaff;
    voice: IVoice;
    noteContext: INoteContext;
    constructor(public globalContext: IGlobalContext){
        super();
    }
    visitStaff(staff: IStaff) { this.staff = staff; }
    visitScore(score: IScore) { this.score = score; }
    visitVoice(voice: IVoice) { this.voice = voice; }
    getStaffContext(absTime: AbsoluteTime, globalContext: IGlobalContext): StaffContext{
        return this.staff.getStaffContext(absTime, globalContext);
    }
    visitNoteHead(head: INotehead) {
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(head);
         this.doNoteHead(head, this.noteContext, spacing); 
        }
    visitNote(note: INote) {
        this.noteContext = new NoteContext(note.getInfo(), note, this.voice);// */note.getContext();
        var spacing = this.globalContext.getSpacingInfo<INoteSpacingInfo>(note);
        this.doNote(note, this.noteContext, spacing); 
    }
    visitNoteDecoration(deco: INoteDecorationElement) { 
        var spacing = this.globalContext.getSpacingInfo<INoteDecorationSpacingInfo>(deco);
        this.doNoteDecoration(deco, this.noteContext, spacing); 
    }
    visitLongDecoration(deco: ILongDecorationElement) { 
        var spacing = this.globalContext.getSpacingInfo<ILongDecorationSpacingInfo>(deco);
        this.doLongDecoration(deco, this.noteContext, spacing); 
    }
    visitTextSyllable(textSyllable: ITextSyllableElement) { 
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(textSyllable);
        this.doTextSyllable(textSyllable, this.noteContext, spacing); 
    }
    visitBeam(beam: IBeam) { 
        var spacing = this.globalContext.getSpacingInfo<IBeamSpacingInfo>(beam);
        this.doBeam(beam, this.noteContext, spacing); 
    }

    doNote(note: INote, context: INoteContext, spacing: INoteSpacingInfo) { }
    doNoteHead(head: INotehead, context: INoteContext, spacing: INoteHeadSpacingInfo) { }
    doNoteDecoration(deco: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo) { }
    doLongDecoration(deco: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo) { }
    doTextSyllable(textSyllable: ITextSyllableElement, context: INoteContext, spacing: ITextSyllableSpacingInfo) { }
    doBeam(beam: IBeam, context: INoteContext, spacing: IBeamSpacingInfo) { }
    visitVariable(name: string): void {
        let val = this.globalContext.getVariable(name);
        if (val) val.visitAll(this);
    }
}

/**
 * Null event visitor visits events without doing anything.
 * 
 * Base class for visitors that only implement few mehods.
 */
export class NullEventVisitor implements IEventVisitor, IVisitorIterator<IEventVisitorTarget> {
    constructor(protected globalContext: IGlobalContext){}

    visitPre(element: IEventVisitorTarget): (element: IEventVisitorTarget) => void {
        element.inviteEventVisitor(this, this.globalContext);
        return null;
    }


    visitNoteHeadInfo(head: INoteHeadInfo): void {
    }   
    visitNoteInfo(note: INoteInfo): void {
    }
    visitNoteDecorationInfo(deco: INoteDecorationEventInfo): void {
    }
    visitLongDecorationInfo(deco: ILongDecorationEventInfo): void {
    }
    visitTextSyllableInfo(text: ITextSyllableEventInfo): void {
    }
    visitBeamInfo(beam: IBeamEventInfo): void {
    }
    visitBarInfo(bar: IBarEventInfo): void {
    }
    visitClefInfo(clef: IClefEventInfo): void {
    }
    visitMeterInfo(meter: IMeterEventInfo): void {
    }
    visitKeyInfo(key: IKeyEventInfo): void {
    }
    visitStaffExpressionInfo(staffExpression: IStaffExpressionEventInfo): void {
    }
    visitSequence(sequence: ISequence): void {        
    }
    visitVoice(voice: IVoice): void {
    }
    visitStaff(staff: IStaff): void {
    }
    visitScore(score: IScore): void {
    }
}

/**
 * Context event visitor
 * 
 * Keeps track of staff and score context while traversing the events in the score composition.
 */
export class ContextEventVisitor extends NullEventVisitor {
    score: IScore;
    staff: IStaff;
    voice: IVoice;
    noteContext: INoteContext;
    currentNote: INoteInfo;
    constructor(globalContext: IGlobalContext){
        super(globalContext);
    }
    visitStaff(staff: IStaff) { this.staff = staff; this.currentNote = null; }
    visitScore(score: IScore) { this.score = score; this.currentNote = null; }
    visitVoice(voice: IVoice) { this.voice = voice; this.currentNote = null; }
    visitSequence(sequence: ISequence) { }

    getStaffContext(absTime: AbsoluteTime, globalContext: IGlobalContext): StaffContext{
        return this.staff.getStaffContext(absTime, globalContext);
    }
    visitNoteHeadInfo(head: INoteHeadInfo) {
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(head);
         //this.doNoteHead(head.source, this.noteContext, spacing, this.currentNote); 
        }
    visitNoteInfo(note: INoteInfo) {
        this.noteContext = new NoteContext(note, note.source, this.voice);// */note.source.getContext();
        this.currentNote = note;
        var spacing = this.globalContext.getSpacingInfo<INoteSpacingInfo>(note);
        this.doNote(note, this.noteContext, spacing); 
    }
    visitNoteDecorationInfo(deco: INoteDecorationEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<INoteDecorationSpacingInfo>(deco);
        this.doNoteDecoration(deco.source, this.noteContext, spacing); 
    }
    visitLongDecorationInfo(deco: ILongDecorationEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<ILongDecorationSpacingInfo>(deco);
        this.doLongDecoration(deco.source, this.noteContext, spacing); 
    }
    visitTextSyllableInfo(textSyllable: ITextSyllableEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(textSyllable);
        this.doTextSyllable(textSyllable.source, this.noteContext, spacing); 
    }
    visitBeamInfo(beam: IBeamEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<IBeamSpacingInfo>(beam);
        this.doBeam(beam.source, this.noteContext, spacing); 
    }

    doNote(note: INoteInfo, context: INoteContext, spacing: INoteSpacingInfo) { }
    //doNoteHead(head: INotehead, context: INoteContext, spacing: INoteHeadSpacingInfo, noteInfo: INoteInfo) { }
    doNoteDecoration(deco: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo) { }
    doLongDecoration(deco: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo) { }
    doTextSyllable(textSyllable: ITextSyllableElement, context: INoteContext, spacing: ITextSyllableSpacingInfo) { }
    doBeam(beam: IBeam, context: INoteContext, spacing: IBeamSpacingInfo) { }
    visitVariable(name: string): void {
        let val = this.globalContext.getVariable(name);
        if (val) val.visitAllEvents(this, this.globalContext);
    }

}

/**
 * Structural note visitor
 * 
 * Calls the `callback` function for all notes in the structure (physical model)
 */
export class StructuralNoteVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (note:INoteSource, context: INoteContext, index: number, spacing: INoteSpacingInfo) => void) {
        super(globalContext);
    }
    no: number = 0;
    doNote(note:INoteSource, context: INoteContext, spacing: INoteSpacingInfo): void {
        this.callback(note, context, this.no++, spacing);
    }
}   


/**
 * Note event visitor
 * 
 * Calls the `callback` function for all note events in the structure (logical model, variables and transformations are applied)
 */
export class NoteEventVisitor extends ContextEventVisitor {
    constructor(globalContext: IGlobalContext, private callback: (note:INoteInfo, context: INoteContext, index: number, spacing: INoteSpacingInfo) => void) {
        super(globalContext);
    }
    no: number = 0;
    doNote(note:INoteInfo, context: INoteContext, spacing: INoteSpacingInfo): void {
        this.callback(note, context, this.no++, spacing);
    }
}   


/**
 * Structural staff visitor
 * 
 * Calls the `callback` function for all staves in the structure (physical model)
 */
export class StructuralStaffVisitor extends NullVisitor {
    constructor(private callback: (node:IStaff, index: number) => void) {
        super();
    }
    no: number = 0;
    visitStaff(note: IStaff): void {
        this.callback(note, this.no++);
    }
}   

/*export class StaffVisitor extends NullEventVisitor {
    constructor(private callback: (node:IStaff, index: number) => void, globalContext: IGlobalContext) {
        super(globalContext);
    }
    no: number = 0;
    visitStaff(note: IStaff): void {
        this.callback(note, this.no++);
    }
} */  

/**
 * Bar visitor
 * 
 * Calls the `callback` function for all bars in the structure (physical model)
 */
export class BarVisitor extends NullVisitor {
    constructor(private callback: (bar:IBar, index: number) => void) {
        super()
    }
    no: number = 0;
    visitBar(bar: IBar): void {
        this.callback(bar, this.no++);
    }
}   

/**
 * Structural voice visitor
 * 
 * Calls the `callback` function for all voices in the structure (physical model)
 */
export class StructuralVoiceVisitor extends NullVisitor {
    constructor(private callback: (voice:IVoice, index: number) => void) {
        super();
    }
    no: number = 0;
    visitVoice(voice: IVoice): void {
        this.callback(voice, this.no++);
    }
}   
/*
export class VoiceVisitor extends NullEventVisitor {
    constructor(private callback: (voice:IVoice, index: number) => void, globalContext: IGlobalContext) {
        super(globalContext)
    }
    no: number = 0;
    visitVoice(voice: IVoice): void {
        this.callback(voice, this.no++);
    }
}   */

/**
 * Note head visitor
 * 
 * Calls the `callback` function for all note heads in the structure (physical model)
 */
export class NoteHeadVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:INotehead, index: number, spacing: INoteHeadSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doNoteHead(notehead: INotehead, context: INoteContext, spacing: INoteHeadSpacingInfo): void {
        this.callback(notehead, this.no++, spacing);
    }
}   


/**
 * Meter visitor
 * 
 * Calls the `callback` function for all time changes in the structure (physical model)
 */
export class MeterVisitor extends NullVisitor {
    constructor(private callback: (node:IMeter, index: number) => void) {
        super();
    }
    no: number = 0;
    visitMeter(meter: IMeter): void {
        this.callback(meter, this.no++);
    }
}   

/**
 * Meter event visitor
 * 
 * Calls the `callback` function for all time change events in the structure (logical model)
 */
export class MeterEventVisitor extends NullEventVisitor {
    constructor(private callback: (node:IMeterEventInfo, index: number) => void, globalContext: IGlobalContext) {
        super(globalContext);
    }
    no: number = 0;
    visitMeterInfo(meter: IMeterEventInfo): void {
        this.callback(meter, this.no++);
    }
}   


/**
 * Key visitor
 * 
 * Calls the `callback` function for all key changes in the structure (physical model)
 */
export class KeyVisitor extends NullVisitor {
    constructor(private callback: (node:IKey, index: number) => void) {
        super();
    }
    no: number = 0;
    visitKey(key: IKey): void {
        this.callback(key, this.no++);
    }
}  

/**
 * Key event visitor
 * 
 * Calls the `callback` function for all key change events in the structure (logical model)
 */
export class KeyEventVisitor extends NullEventVisitor {
    constructor(private callback: (node:IKeyEventInfo, index: number) => void, globalContext: IGlobalContext) {
        super(globalContext);
    }
    no: number = 0;
    visitKeyInfo(key: IKeyEventInfo): void {
        console.log("keyVisitor visit", key);

        this.callback(key, this.no++);
    }
}   

/**
 * Clef visitor
 * 
 * Calls the `callback` function for all clef changes in the structure (physical model)
 */
export class ClefVisitor extends NullVisitor {
    constructor(private callback: (node:IClef, index: number) => void) {
        super();
    }
    no: number = 0;
    visitClef(clef: IClef): void {
        this.callback(clef, this.no++);
    }
}   

/**
 * Clef event visitor
 * 
 * Calls the `callback` function for all clef change events in the structure (logical model)
 */
export class ClefEventVisitor extends NullEventVisitor {
    constructor(private callback: (node:IClefEventInfo, index: number) => void, globalContext: IGlobalContext) {
        super(globalContext);
    }
    no: number = 0;
    visitClefInfo(clef: IClefEventInfo): void {
        this.callback(clef, this.no++);
    }
}   

/**
 * Timed event visitor
 * 
 * Calls the `callback` function for all timed events in the structure (physical model)
 */
export class TimedEventVisitor extends NullVisitor {
    constructor(private callback: (node: ITimedEvent, index: number) => void) {
        super()
    }
    no: number = 0;
    visitKey(key: IKey): void {
        this.callback(key, this.no++);
    }
    visitMeter(meter: IMeter): void {
        this.callback(meter, this.no++);
    }
    visitClef(clef: IClef): void {
        this.callback(clef, this.no++);
    }
    visitStaffExpression(exp: IStaffExpression): void {
        this.callback(exp, this.no++);
    }
}   

/**
 * Note decoration visitor
 * 
 * Calls the `callback` function for all note decoration in the structure (physical model)
 */
export class NoteDecorationVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:INoteDecorationElement, index: number, spacing: INoteDecorationSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doNoteDecoration(clef: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

/**
 * Long decoration visitor
 * 
 * Calls the `callback` function for all long decorations in the structure (physical model)
 */
export class LongDecorationVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:ILongDecorationElement, index: number, spacing: ILongDecorationSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doLongDecoration(clef: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

/**
 * Text syllable visitor
 * 
 * Calls the `callback` function for all lyric syllables in the structure (physical model)
 */
export class TextSyllableVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:ITextSyllableElement, index: number, spacing: ITextSyllableSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doTextSyllable(clef: ITextSyllableElement, context: INoteContext, spacing: ITextSyllableSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

/**
 * Event info
 * 
 * Base class for event info objects - used by logical event visitors
 */
export abstract class EventInfo implements IEventInfo {
    getHorizPosition(): HorizPosition {
        if (!this.relTime) return new HorizPosition(AbsoluteTime.startTime, 0);
        if ((<ITimedEvent>this.source).getSortOrder)  return new HorizPosition(this.relTime.fromStart(), (<ITimedEvent>this.source).getSortOrder());
        return new HorizPosition(this.relTime.fromStart(), 0);
    }
    id: string;        
    relTime: TimeSpan;
    source: IMusicElement;
    getElementName(): string { 
        return this.source.getElementName(); 
    }
    getTimeVal(): TimeSpan {
        throw new Error("Method not implemented.");
    }
    abstract inviteEventVisitor(visitor: IEventVisitor): void;    
    visitAllEvents(visitorIterator: IVisitorIterator<IEventVisitorTarget>): void {
        visitorIterator.visitPre(this);
    }
    abstract clone(addId: string): IEventInfo;
    voice: IVoice;
}

