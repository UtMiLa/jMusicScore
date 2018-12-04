import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-base';
import { ISpacingInfo, IMusicElement, IVisitor, IBarSpacingInfo, IBar, IEventInfo, IScore, IVoice, IStaff, ISequence, IScoreSpacingInfo, 
    IMeter, IClef, IStaffSpacingInfo, IKey, IStaffExpression, IStaffExpressionSpacingInfo, IVoiceSpacingInfo, INote, 
    INoteSource, INoteContext, IEventEnumerator, ITimedEvent, ISequenceNote, INoteInfo, IClefSpacingInfo, IKeySpacingInfo, IMeterSpacingInfo, 
    IMeterOwner, IBeamSpacingInfo, IBeam, INoteSpacingInfo, INotehead, INoteDecorationElement, ILongDecorationElement, ITextSyllableElement, 
    INoteHeadSpacingInfo, INoteHeadInfo, INoteDecorationSpacingInfo, INoteDecoInfo, ILongDecorationSpacingInfo, ITextSyllableSpacingInfo, 
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
    IGlobalContext} from './jm-model-interfaces';



export class IdSequence {
    static id: number = 1;
    static next(): string { return '' + IdSequence.id++; }
}

export class MusicElement implements IMusicElement {
    constructor(public parent: IMusicElement) {
        //this.parent = parent;
    }

    public id = IdSequence.next();

    public inviteVisitor(spacer: IVisitor) {
        spacer.visitDefault(this);
    }

    public inviteEventVisitor(spacer: IEventVisitor) {
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
    public visitAll(visitor: IVisitorIterator<IMusicElement>) {
        var postFun: (element: IMusicElement) => void = visitor.visitPre(this);
        if (postFun) {
            postFun(this);
        }

    }
}

export class MusicContainer extends MusicElement {
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

    public visitAll(visitor: IVisitorIterator<IMusicElement>) {
        var postFun: (element: IMusicElement) => void = visitor.visitPre(this);
        this.withChildren((child) => {
            child.visitAll(visitor);
        });
        if (postFun) {
            postFun(this);
        }

    }
}

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
        return <T>(<any>element).spacingInfo;
        //return <T>this._spacingInfos[element.id];
    }

    addSpacingInfo(element: IMusicElement, value: ISpacingInfo) {
        (<any>element).spacingInfo = value;
        //this._spacingInfos[element.id] = value;
    }
}


/******************************************** Spacing stuff ************************************************************/
export class Point implements IPoint {
    constructor(public x: number, public y: number) { }
}


/***************** Visitors ***************** */



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
    getStaffContext(absTime: AbsoluteTime): StaffContext{
        return this.staff.getStaffContext(absTime);
    }
    visitNoteHead(head: INotehead) {
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(head);
         this.doNoteHead(head, this.noteContext, spacing); 
        }
    visitNote(note: INote) {
        this.noteContext = note.getContext();
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

export class NullEventVisitor implements IEventVisitor, IVisitorIterator<IMusicElement> {
    visitPre(element: IMusicElement): (element: IMusicElement) => void {
        element.inviteEventVisitor(this);
        return null;
    }


    visitNoteHead(head: INoteHeadInfo): void {
    }   
    visitNote(note: INoteInfo): void {
    }
    visitNoteDecoration(deco: INoteDecorationEventInfo): void {
    }
    visitLongDecoration(deco: ILongDecorationEventInfo): void {
    }
    visitTextSyllable(text: ITextSyllableEventInfo): void {
    }
    visitBeam(beam: IBeamEventInfo): void {
    }
    visitBar(bar: IBarEventInfo): void {
    }
    visitClef(clef: IClefEventInfo): void {
    }
    visitMeter(meter: IMeterEventInfo): void {
    }
    visitKey(key: IKeyEventInfo): void {
    }
    visitStaffExpression(staffExpression: IStaffExpressionEventInfo): void {
    }
    visitVoice(voice: IVoice): void {
    }
    visitStaff(staff: IStaff): void {
    }
    visitScore(score: IScore): void {
    }

/*    visitVoice(voice: IVoice) { 
        super.visitVoice(voice);
        const events = voice.getEvents(this.globalContext);
        for (var i = 0; i < events.length; i++){
            events[i].visit(this);
        }
    }



    visitNoteHead(head: INotehead) {
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(head);
         //this.doNoteHead(head, this.noteContext, spacing); 
        }
    visitNote(note: INote) {
        this.noteContext = note.getContext();
        var spacing = this.globalContext.getSpacingInfo<INoteSpacingInfo>(note);
        //this.doNote(note, this.noteContext, spacing); 
    }
    visitNoteDecoration(deco: INoteDecorationElement) { 
        var spacing = this.globalContext.getSpacingInfo<INoteDecorationSpacingInfo>(deco);
        //this.doNoteDecoration(deco, this.noteContext, spacing); 
    }
    visitLongDecoration(deco: ILongDecorationElement) { 
        var spacing = this.globalContext.getSpacingInfo<ILongDecorationSpacingInfo>(deco);
        //this.doLongDecoration(deco, this.noteContext, spacing); 
    }
    visitTextSyllable(textSyllable: ITextSyllableElement) { 
        //this.doTextSyllable(textSyllable, this.noteContext, spacing); 
        //var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(textSyllable);
    }
    visitBeam(beam: IBeam) { 
        var spacing = this.globalContext.getSpacingInfo<IBeamSpacingInfo>(beam);
        //this.doBeam(beam, this.noteContext, spacing); 
    }
*/
}

export class ContextEventVisitor extends NullEventVisitor {
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
    getStaffContext(absTime: AbsoluteTime): StaffContext{
        return this.staff.getStaffContext(absTime);
    }
    /*visitNoteHead(head: INoteHeadInfo) {
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(head);
         this.doNoteHead(head, this.noteContext, spacing); 
        }
    visitNote(note: INoteInfo) {
        this.noteContext = note.getContext();
        var spacing = this.globalContext.getSpacingInfo<INoteSpacingInfo>(note);
        this.doNote(note, this.noteContext, spacing); 
    }
    visitNoteDecoration(deco: INoteDecorationEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<INoteDecorationSpacingInfo>(deco);
        this.doNoteDecoration(deco, this.noteContext, spacing); 
    }
    visitLongDecoration(deco: ILongDecorationEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<ILongDecorationSpacingInfo>(deco);
        this.doLongDecoration(deco, this.noteContext, spacing); 
    }
    visitTextSyllable(textSyllable: ITextSyllableEventInfo) { 
        var spacing = this.globalContext.getSpacingInfo<INoteHeadSpacingInfo>(textSyllable);
        this.doTextSyllable(textSyllable, this.noteContext, spacing); 
    }
    visitBeam(beam: IBeamEventInfo) { 
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
*/
}


export class NoteVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (note:INoteSource, context: INoteContext, index: number, spacing: INoteSpacingInfo) => void) {
        super(globalContext);
    }
    no: number = 0;
    doNote(note:INoteSource, context: INoteContext, spacing: INoteSpacingInfo): void {
        this.callback(note, context, this.no++, spacing);
    }
}   


export class StaffVisitor extends NullVisitor {
    constructor(private callback: (node:IStaff, index: number) => void) {
        super();
    }
    no: number = 0;
    visitStaff(note: IStaff): void {
        this.callback(note, this.no++);
    }
}   

export class BarVisitor extends NullVisitor {
    constructor(private callback: (bar:IBar, index: number) => void) {
        super()
    }
    no: number = 0;
    visitBar(bar: IBar): void {
        this.callback(bar, this.no++);
    }
}   

export class VoiceVisitor extends NullVisitor {
    constructor(private callback: (voice:IVoice, index: number) => void) {
        super()
    }
    no: number = 0;
    visitVoice(voice: IVoice): void {
        this.callback(voice, this.no++);
    }
}   

export class NoteHeadVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:INotehead, index: number, spacing: INoteHeadSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doNoteHead(notehead: INotehead, context: INoteContext, spacing: INoteHeadSpacingInfo): void {
        this.callback(notehead, this.no++, spacing);
    }
}   

export class MeterVisitor extends NullVisitor {
    constructor(private callback: (node:IMeter, index: number) => void) {
        super();
    }
    no: number = 0;
    visitMeter(meter: IMeter): void {
        this.callback(meter, this.no++);
    }
}   

export class KeyVisitor extends NullVisitor {
    constructor(private callback: (node:IKey, index: number) => void) {
        super()
    }
    no: number = 0;
    visitKey(key: IKey): void {
        this.callback(key, this.no++);
    }
}   

export class ClefVisitor extends NullVisitor {
    constructor(private callback: (node:IClef, index: number) => void) {
        super()
    }
    no: number = 0;
    visitClef(clef: IClef): void {
        this.callback(clef, this.no++);
    }
}   

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

export class NoteDecorationVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:INoteDecorationElement, index: number, spacing: INoteDecorationSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doNoteDecoration(clef: INoteDecorationElement, context: INoteContext, spacing: INoteDecorationSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

export class LongDecorationVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:ILongDecorationElement, index: number, spacing: ILongDecorationSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doLongDecoration(clef: ILongDecorationElement, context: INoteContext, spacing: ILongDecorationSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   

export class TextSyllableVisitor extends ContextVisitor {
    constructor(globalContext: IGlobalContext, private callback: (node:ITextSyllableElement, index: number, spacing: ITextSyllableSpacingInfo) => void) {
        super(globalContext)
    }
    no: number = 0;
    doTextSyllable(clef: ITextSyllableElement, context: INoteContext, spacing: ITextSyllableSpacingInfo): void {
        this.callback(clef, this.no++, spacing);
    }
}   
