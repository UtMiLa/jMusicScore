/** logical music definition classes and classes for music concepts */
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base';
import { IVoice, IScore, IStaff, IKey, IClef, IVoiceNote, INote, INotehead, IVisitor, ISpacingInfo, IMusicElement } from './model/jm-model-interfaces';    
import { } from './model/jm-model';





export abstract class ElementDefinition {
    public abstract visit(visitor: IVisitor, spacingInfo: ISpacingInfo): void;
}

export class TimedEventElement implements IMusicElement {
    getAncestor<T extends IMusicElement>(elementName: string): T {
        throw new Error("Method not implemented.");
    }
    id: string;
    parent: IMusicElement;
    getElementName(): string {
        throw new Error("Method not implemented.");
    }
    addChild(theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void {
        throw new Error("Method not implemented.");
    }
    removeChild(theChild: IMusicElement, list?: IMusicElement[]): void {
        throw new Error("Method not implemented.");
    }
    debug(): string {
        throw new Error("Method not implemented.");
    }
    remove(): void {
        throw new Error("Method not implemented.");
    }
    setProperty(name: string, value: any): void {
        throw new Error("Method not implemented.");
    }
    getProperty(name: string) {
        throw new Error("Method not implemented.");
    }
    visitAll(visitor: IVisitorIterator<IMusicElement>): void {
        throw new Error("Method not implemented.");
    }
    getMemento(withChildren?: boolean): IMemento {
        throw new Error("Method not implemented.");
    }
    constructor(public definition: ElementDefinition, public absTime: AbsoluteTime){

    }
    spacingInfo: ISpacingInfo;
    getTotalTime(): TimeSpan {
        return TimeSpan.noTime;
    }
    getEvents(): TimedEventElement[] {
        return [this];
    }
    clone(timeOffset: TimeSpan): TimedEventElement {
        return new TimedEventElement(this.definition, this.absTime.add(timeOffset));
    }
    public inviteVisitor(visitor: IVisitor){
        this.definition.visit(visitor, this.spacingInfo);
    }
}

export class TimedEventStream extends TimedEventElement implements IMusicElement {
    getAncestor<T extends IMusicElement>(elementName: string): T {
        throw new Error("Method not implemented.");
    }
    id: string;
    parent: IMusicElement;
    spacingInfo: ISpacingInfo;
    getElementName(): string {
        throw new Error("Method not implemented.");
    }
    addChild(theChild: IMusicElement, before?: IMusicElement, removeOrig?: boolean): void {
        throw new Error("Method not implemented.");
    }
    removeChild(theChild: IMusicElement, list?: IMusicElement[]): void {
        throw new Error("Method not implemented.");
    }
    debug(): string {
        throw new Error("Method not implemented.");
    }
    remove(): void {
        throw new Error("Method not implemented.");
    }
    setProperty(name: string, value: any): void {
        throw new Error("Method not implemented.");
    }
    getProperty(name: string) {
        throw new Error("Method not implemented.");
    }
    getMemento(withChildren?: boolean): IMemento {
        throw new Error("Method not implemented.");
    }
    inviteVisitor(spacer: IVisitor): void {
        throw new Error("Method not implemented.");
    }

    events: TimedEventElement[] = [];
    getTotalTime(): TimeSpan {
        return TimeSpan.noTime;
    }
    getEvents(): TimedEventElement[] {
        let res = [];
        for (let i = 0; i < this.events.length; i++){                    
            res.push(this.events[i].clone(this.absTime.fromStart()));
        }
        return res;
    }

    public visitAll(visitor: IVisitorIterator<IMusicElement>) {
        var postFun: (element: IMusicElement) => void = visitor.visitPre(this);
        for (var i = 0; i < this.events.length; i++) {                    
            //this.events[i].inviteVisitor(visitor);                    
            visitor.visitPre(this.events[i]);
        }
        if (postFun) {
            postFun(this);
        }
    }            
}

