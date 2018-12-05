import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-music-basics';
import { IVoice, IScore, IStaff, IGlobalContext, IKey, IClef, IVoiceNote, INote, INotehead, IMeterSpacingInfo, IMeter, IMusicElement, IEventInfo, IVisitor, ITimedEvent, IEventContainer, ISequence, IEventVisitor, ITimedObjectEvent, IMeterEventInfo } from './model/jm-model-interfaces';    
import {
    Music, MusicElementFactory, ClefElement,
    KeyElement, 
    MeterElement,
    } from "./model/jm-model";
import {Point, MusicElement, GlobalContext } from "./model/jm-model-base";    
import { IScoreRefiner } from "./jm-interfaces";

        export class GhostMeterElement extends MusicElement implements IMeter {
            constructor(public parent: IMusicElement, private originElement: IMeter) {
                super(parent);
            }

            
            getEvents(): IEventInfo[] {
                let info: IMeterEventInfo = { source: this, id: this.id, visit: undefined, relTime: this.absTime.fromStart(), getTimeVal: () => {return TimeSpan.noTime;} };
                info.visit = (visitor: IEventVisitor) => {visitor.visitMeter(info)};
                return [info];
            }


            visit(visitor: IVisitor): void{
                this.inviteVisitor(visitor);
            }

            public get absTime(): AbsoluteTime { return this.originElement.absTime; }
            public get definition(): IMeterDefinition { return this.originElement.definition; }

            public getSortOrder() {
                return this.absTime ? 90 : 50;
            }

            public getElementName() { return "Meter"; }
            public debug() {
                return this.originElement.debug();
            }

            public getMeasureTime() {
                return this.originElement.getMeasureTime();
            }

            public nextBoundary(abstime: AbsoluteTime): AbsoluteTime {
                return this.originElement.nextBoundary(abstime);
            }

            public nextBar(abstime: AbsoluteTime): AbsoluteTime {
                return this.originElement.nextBar(abstime);
            }
            public inviteVisitor(spacer: IVisitor) {
                spacer.visitMeter(this);
            }
            getHorizPosition(): HorizPosition { return this.originElement.getHorizPosition(); }
            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return null; } // finde parent?
        }

        export class GhostsValidator implements IScoreRefiner {
            private addGhostMeter(staff: IStaff, meter: IMeter) {
                // tjek om der er ghostMeter til denne kombination af meter og staff
                var ghostMeter = new GhostMeterElement(staff, meter);
                //staff.setMeter(meter.num, meter.denum, meter.absTime);
                staff.addChild(ghostMeter);
            }

            public refine(document: IScore) {

                document.withStaves((staff: IStaff, index: number): void => {

                    // First time:
                    if (!staff.meterElements.length) {
                        document.withMeters((meter: IMeter, index: number) => {
                            this.addGhostMeter(staff, meter);
                        });
                    }

                    // todo: Register changes:
                    document.withMeters((scoreMeter: IMeter, index: number) => {
                        // tjek om der er ghostMeter til denne kombination af meter og staff
                        var found = false;
                        staff.withMeters((staffMeter: IMeter, index: number) => {
                            //if ((<any>staffMeter).originElement && (<any>staffMeter).originElement === scoreMeter) {
                            if (staffMeter.absTime.eq(scoreMeter.absTime)) {
                                found = true;
                            }
                        });
                        if (!found) {
                            this.addGhostMeter(staff, scoreMeter);
                        }
                    });

                    staff.withMeters((staffMeter: IMeter, index: number) => {
                        // tjek om meterElm er ghostMeter og mangler tilhørende score.meter
                        if ((<any>staffMeter).originElement) {
                            var origin = (<any>staffMeter).originElement;
                            if (document.meterElements.indexOf(origin) === -1) {
                                // remove ghost
                                staff.removeChild(staffMeter, staff.meterElements);
                            }
                        }
                    });
                });
            }
        }

/*todo:
MusicSnippetElement skal være forfader til voice og variable, og løsrevet fra staff
StaffContext skal kun have oplysninger om definitionerne, ikke om staff/parent
Alle gennemløb af events/noder m.m. skal ske rekursivt: en node eller anden enkeltevent returnerer sig selv, en snippet returnerer en liste af events
*/
export class VariableSpacing {
    offset: Point;
    width: number;
    height: number;
    left: number;
    top: number;
    scale: number;
    preWidth: number;
}
export class VariableRef extends MusicElement implements ITimedObjectEvent, IEventContainer {
    absTime: AbsoluteTime = new AbsoluteTime(1, 4); // todo: calculate absTime og timeSpan for container
    private name: string;
    private ref: ISequence;

    private updateEvents(events: IEventInfo[]){
        for(var i = 0; i < events.length; i++){
            events[i].relTime = events[i].relTime.add(this.absTime.fromStart());
        }
    }

    getEvents(globalContext: GlobalContext): IEventInfo[] {
        let events = this.getRef(globalContext).getEvents(globalContext);//todo: concatenate ids
        this.updateEvents(events);
        return events;
    }
    getElementName(): string {
        return "VariableRef";
    }
    debug(): string {
        return "VariableRef " + this.name;
    }
    getSortOrder: () => number;
    getVoice(): IVoice {
        return null;
    }
    getStaff(): IStaff {
        return null;
    }
    //spacingInfo: VariableSpacing;
    getHorizPosition(): HorizPosition {
        throw new Error("Method not implemented.");
    }
    /*changed(): void {
        throw new Error("Method not implemented.");
    }
    moved(): void {
        throw new Error("Method not implemented.");
    }*/
    id: string;
    parent: IMusicElement;
    inviteVisitor(spacer: IVisitor): void {
        spacer.visitVariable(this.name);
        //this.ref.inviteVisitor(spacer);
    }


    public inviteEventVisitor(visitor: IEventVisitor, globalContext: IGlobalContext) {
        //visitor.visitSequence(this.getRef(globalContext), globalContext);
        const events = this.getRef(globalContext).getEvents(globalContext);
        for ( var i = 0; i < events.length; i++){
            events[i].visit(visitor);
        }
    }

    public visitAll(visitor: IVisitorIterator<IMusicElement>) {
        var postFun: (element: IMusicElement) => void = visitor.visitPre(this);
        //this.visitAll(visitor);
        //this.ref.visitAll(visitor);
        if (postFun) {
            postFun(this);
        }
    }

    getEventsOld(globalContext: GlobalContext): ITimedEvent[] {
        return this.getRef(globalContext).getEventsOld(globalContext);
    }

    getStaffContext(absoluteTime: AbsoluteTime) {
        return new StaffContext(
            new ClefDefinition(ClefType.ClefG, 4),
            new RegularKeyDefinition("b", 0),
            new RegularMeterDefinition(4,4),
            AbsoluteTime.startTime,
            0, 
            TimeSpan.noTime );
    }

    static createFromMemento(parent: IVoice, memento: IMemento): VariableRef {
        var varRef: VariableRef = new VariableRef(parent);
        if (memento.def && memento.def.name) { 
            varRef.name = memento.def.name;       
        }
        
        if (parent) parent.addEvent(varRef); // todo: at index - ændres
        return varRef;
    }

    private getRef(globalContext: IGlobalContext) {
        if (!this.ref) {
            this.ref = globalContext.getVariable(this.name);
        }
        return this.ref;
    }

    public doGetMemento(): any {
        var val = { t: "VariableRef", def: { name: this.name} };
        return val;
    }

    static register(){
        MusicElementFactory.register("Variable", VariableRef);
    }
}

VariableRef.register();

/*export class VariableValidator implements IScoreRefiner {

    public refine(document: IScore) {

        document.withStaves((staff: IStaff, index: number): void => {

            // First time:
            if (!staff.meterElements.length) {
                document.withMeters((meter: IMeter, index: number) => {
                    this.addGhostMeter(staff, meter);
                });
            }

            // todo: Register changes:
            document.withMeters((scoreMeter: IMeter, index: number) => {
                // tjek om der er ghostMeter til denne kombination af meter og staff
                var found = false;
                staff.withMeters((staffMeter: IMeter, index: number) => {
                    //if ((<any>staffMeter).originElement && (<any>staffMeter).originElement === scoreMeter) {
                    if (staffMeter.absTime.eq(scoreMeter.absTime)) {
                        found = true;
                    }
                });
                if (!found) {
                    this.addGhostMeter(staff, scoreMeter);
                }
            });

            staff.withMeters((staffMeter: IMeter, index: number) => {
                // tjek om meterElm er ghostMeter og mangler tilhørende score.meter
                if ((<any>staffMeter).originElement) {
                    var origin = (<any>staffMeter).originElement;
                    if (document.meterElements.indexOf(origin) === -1) {
                        // remove ghost
                        staff.removeChild(staffMeter, staff.meterElements);
                    }
                }
            });
        });
    }
}
*/

