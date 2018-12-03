import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval} from '../jm-base';
import { ISpacingInfo, IMusicElement, IVisitor, IBarSpacingInfo, IBar, IEventInfo, IScore, IVoice, IStaff, ISequence, IScoreSpacingInfo, 
    IMeter, ITimedVoiceEvent, IClef, IStaffSpacingInfo, IKey, IStaffExpression, IStaffExpressionSpacingInfo, IVoiceSpacingInfo, INote, 
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

export class MusicElement {
    constructor(public parent: IMusicElement) {
        //this.parent = parent;
    }

    public id = IdSequence.next();

    public inviteVisitor(spacer: IVisitor) {
        spacer.visitDefault(this);
    }

    //protected children: IMusicElement[] = [];
    protected removeThisChildren: IMusicElement[] = [];
    private properties: { [index: string]: any; } = {};

    public getElementName() { return "Element"; }

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
        if (withChildren) {
            var children: IMemento[] = [];
            
            this.withChildren((child) => {

//                        for (var j = 0; j < this.children.length; j++) {
                    children.push(child.getMemento(true));
                });
            
            if (children.length) memento.children = children;
        }
        return memento;
    }
    public visitAll(visitor: IVisitorIterator<IMusicElement>) {
        var postFun: (element: IMusicElement) => void = visitor.visitPre(this);
        this.withChildren((child) => {

        //for (var j = 0; j < this.children.length; j++) {
            child.visitAll(visitor);
        });
        if (postFun) {
            postFun(this);
        }

    }
}

export class MusicContainer extends MusicElement {


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