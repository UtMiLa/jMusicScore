import { IStaff, IMusicElement, ITimedChangeEvent } from "./model/jm-model-interfaces";
import { AbsoluteTime, StaffContext, ClefDefinition, IMeterDefinition, TimeSpan, IKeyDefinition } from "./jm-music-basics";


export interface IControlElement extends ITimedChangeEvent {
}

export class ControlElementRef {
    element: IControlElement;
    staves: IStaff[] = [];
    next: ControlElementRef;
    prev: ControlElementRef;
}

export class ControlElementRepository {
    elements: ControlElementRef[];

    invalidateRepository() {
        this.elements = undefined;
    }

    getElements(staff: IStaff, fromPosition: AbsoluteTime, toPosition: AbsoluteTime): IControlElement[] {
        return [];
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
    constructor(){ 
 
    }

    private scopeMeterGlobally: boolean = true;
    private scopeKeyGlobally: boolean = true;

    private repository = new ControlElementRepository();

    private generateContext() {
        // if cached and not invalidated return cache

        // get alle control events from score recursively and map them to scope
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