import { IStaff, IMusicElement, ITimedChangeEvent, IEventVisitor, INoteHeadInfo, INoteInfo, INoteDecorationEventInfo, ILongDecorationEventInfo, ITextSyllableEventInfo, IBeamEventInfo, IBarEventInfo, IClefEventInfo, IMeterEventInfo, IKeyEventInfo, IStaffExpressionEventInfo, ISequence, IGlobalContext, IVoice, IScore, IClef, IMeter, IKey } from "./model/jm-model-interfaces";
import { AbsoluteTime, StaffContext, ClefDefinition, IMeterDefinition, TimeSpan, IKeyDefinition } from "./jm-music-basics";
import { ContextEventVisitor } from "./model/jm-model-base";


export interface IControlElement extends ITimedChangeEvent {
}

export class ControlElementRef {
    constructor(public element: IControlElement, public relTime: AbsoluteTime, staff: IStaff) {
    }
    next: ControlElementRef;
    prev: ControlElementRef;
}

class ControlElementRepository extends ContextEventVisitor {
    elements: ControlElementRef[];

    invalidateRepository() {
        this.elements = [];
    }

    getElements(staff: IStaff, fromPosition: AbsoluteTime, toPosition: AbsoluteTime): IControlElement[] {
        const res = this.elements.filter((v) => {
            return (v.element.absTime.ge(fromPosition) && toPosition.ge(v.element.absTime));
        });
        return res.map((v) => v.element);
    }
    visitLongDecorationInfo(deco: ILongDecorationEventInfo): void {
        
    }
    
    private currentClef: ControlElementRef;
    visitClefInfo(clef: IClefEventInfo): void {
        const ref = new ControlElementRef(clef.source, clef.source.absTime, this.staff);
        ref.prev = this.currentClef;
        if (this.currentClef) this.currentClef.next = ref;
        this.elements.push(ref);
    }

    private currentMeter: ControlElementRef;
    visitMeterInfo(meter: IMeterEventInfo): void {
        const ref = new ControlElementRef(meter.source, meter.source.absTime, this.staff);
        ref.prev = this.currentMeter;
        if (this.currentMeter) this.currentMeter.next = ref;
        this.elements.push(ref);
    }
    private currentKey: ControlElementRef;
    visitKeyInfo(key: IKeyEventInfo): void {
        const ref = new ControlElementRef(key.source, key.source.absTime, this.staff);
        ref.prev = this.currentKey;
        if (this.currentKey) this.currentKey.next = ref;
        this.elements.push(ref);
    }
    visitStaffExpressionInfo(staffExpression: IStaffExpressionEventInfo): void {
        
    }
}
/*

Kontrolelementer er:
    Clef
    Meter
    Key
    [LongDecoration som ottava]
    [StaffDecoration/ScoreDecoration som tempo]

Kontrolelementer kan ejes af score, staff, sequence
Kontrolelementer kan scopes til score eller staff

Case 1: Vi står på staff S og position P. Hvad er det aktive kontrolelement?

Case 2: Vi skal space takt T. Giv os en sorteret liste over alle elementer, herunder kontrol-, der skal bidrage til spacingen.

Case 3: Vi skal rendere takt T på staff S. Giv os en sorteret liste over alle elementer, herunder kontrol-, der skal renderes.
*/

export class ControlElementManager{
    constructor(private score: IScore, private globalContext: IGlobalContext){ 
 
    }

    private scopeMeterGlobally: boolean = true;
    private scopeKeyGlobally: boolean = true;

    private repository = new ControlElementRepository(this.globalContext);

    private generateContext() {
        // if cached and not invalidated return cache

        // get alle control events from score recursively and map them to scope
        this.score.visitAllEvents(this.repository, this.globalContext);
    }

    /**
     * Case 1: Vi står på staff S og position P. Hvad er det aktive kontrolelement?
     */
    getStaffContext(staff: IStaff, position: AbsoluteTime): StaffContext {
        var clef: ClefDefinition, key: IKeyDefinition, meter: IMeterDefinition, meterTime: AbsoluteTime, barNo: number, timeInBar: TimeSpan;
        var clefRef: IClef, keyRef: IKey, meterRef: IMeter;

        this.generateContext();
        const elms = this.repository.getElements(staff, AbsoluteTime.startTime, position);

        elms.forEach((elm) => {
            if (elm.getElementName() === "Clef") {
                if (!clefRef || elm.absTime.gt(clefRef.absTime)) {
                    clefRef = <IClef>elm;
                }
            }
            if (elm.getElementName() === "Meter") {
                if (!meterRef || elm.absTime.gt(meterRef.absTime)) {
                    meterRef = <IMeter>elm;
                }
            }
            if (elm.getElementName() === "Key") {
                if (!keyRef || elm.absTime.gt(keyRef.absTime)) {
                    keyRef = <IKey>elm;
                }
            }
        });

        if (clefRef) clef = clefRef.definition;
        if (meterRef) meter = meterRef.definition;
        if (keyRef) key = keyRef.definition;

        return new StaffContext(clef, key, meter, meterTime, barNo, timeInBar);
    }

    /**
     * Returnerer alle kontrolelementer, der er scopet til staff i det pågældende interval.
     * @param staff 
     * @param fromPosition 
     * @param toPosition 
     */
    getControlElements(staff: IStaff, fromPosition: AbsoluteTime, toPosition: AbsoluteTime): IMusicElement[] {
        const res = this.repository.getElements(staff, fromPosition, toPosition);
        return res;
    }

    invalidateRepository(){
        this.repository.invalidateRepository();
    }

}

