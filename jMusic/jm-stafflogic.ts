import { IStaff, IMusicElement, ITimedChangeEvent, IEventVisitor, INoteHeadInfo, INoteInfo, INoteDecorationEventInfo, ILongDecorationEventInfo, ITextSyllableEventInfo, IBeamEventInfo, IBarEventInfo, IClefEventInfo, IMeterEventInfo, IKeyEventInfo, IStaffExpressionEventInfo, ISequence, IGlobalContext, IVoice, IScore } from "./model/jm-model-interfaces";
import { AbsoluteTime, StaffContext, ClefDefinition, IMeterDefinition, TimeSpan, IKeyDefinition } from "./jm-music-basics";
import { ContextEventVisitor } from "./model/jm-model-base";


export interface IControlElement extends ITimedChangeEvent {
}

export class ControlElementRef {
    constructor(public element: IControlElement, public relTime: TimeSpan, staff: IStaff) {
    }
    next: ControlElementRef;
    prev: ControlElementRef;
}

class ControlElementRepository extends ContextEventVisitor {
    elements: ControlElementRef[];

    invalidateRepository() {
        this.elements = undefined;
    }

    getElements(staff: IStaff, fromPosition: AbsoluteTime, toPosition: AbsoluteTime): IControlElement[] {
        return [];
    }

    /*visitNoteHeadInfo(head: INoteHeadInfo): void {
        // Rien
    }
    visitNoteInfo(note: INoteInfo): void {
        // Rien
    }
    visitNoteDecorationInfo(deco: INoteDecorationEventInfo): void {
        // Rien
    }*/
    visitLongDecorationInfo(deco: ILongDecorationEventInfo): void {
        
    }
    /*visitTextSyllableInfo(text: ITextSyllableEventInfo): void {
        // Rien
    }
    visitBeamInfo(beam: IBeamEventInfo): void {
        // Rien
    }
    visitBarInfo(bar: IBarEventInfo): void {
        // Rien de rien
    }*/
    
    private currentClef: ControlElementRef;
    visitClefInfo(clef: IClefEventInfo): void {
        const ref = new ControlElementRef(clef.source, clef.relTime, null);
        ref.prev = this.currentClef;
        if (this.currentClef) this.currentClef.next = ref;
        this.elements.push(ref);
    }

    private currentMeter: ControlElementRef;
    visitMeterInfo(meter: IMeterEventInfo): void {
        const ref = new ControlElementRef(meter.source, meter.relTime, null);
        ref.prev = this.currentMeter;
        if (this.currentMeter) this.currentMeter.next = ref;
        this.elements.push(ref);
    }
    private currentKey: ControlElementRef;
    visitKeyInfo(key: IKeyEventInfo): void {
        const ref = new ControlElementRef(key.source, key.relTime, null);
        ref.prev = this.currentKey;
        if (this.currentKey) this.currentKey.next = ref;
        this.elements.push(ref);
    }
    visitStaffExpressionInfo(staffExpression: IStaffExpressionEventInfo): void {
        
    }
    /*visitSequence(sequence: ISequence, globalContext: IGlobalContext): void {
        
    }
    visitVoice(voice: IVoice): void {
        
    }
    visitStaff(staff: IStaff): void {
        
    }
    visitScore(score: IScore): void {
        
    }*/


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

        this.generateContext();

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

