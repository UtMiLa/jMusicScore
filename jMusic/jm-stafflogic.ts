import { IStaff, IMusicElement } from "./model/jm-model-interfaces";
import { AbsoluteTime, StaffContext, ClefDefinition, IMeterDefinition, TimeSpan, IKeyDefinition } from "./jm-music-basics";




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

    /**
     * Case 1: Vi står på staff S og position P. Hvad er det aktive kontrolelement?
     */
    getStaffContext(staff: IStaff, position: AbsoluteTime): StaffContext {
        var clef: ClefDefinition, key: IKeyDefinition, meter: IMeterDefinition, meterTime: AbsoluteTime, barNo: number, timeInBar: TimeSpan;



        return new StaffContext(clef, key, meter, meterTime, barNo, timeInBar);
    }

    /**
     * Returnerer alle kontrolelementer, der er scopet til staff i det pågældende interval.
     * @param staff 
     * @param fromPosition 
     * @param toPosition 
     */
    getControlElements(staff: IStaff, fromPosition: AbsoluteTime, toPosition: AbsoluteTime): IMusicElement[] {

        return [];
    }

}