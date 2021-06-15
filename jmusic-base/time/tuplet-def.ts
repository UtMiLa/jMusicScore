import { Rational } from "./rational";
import { TimeSpan } from "./time-span";

/** 
    * Tuplet definition
    * nominalValue = shown note; fraction = real value compared to nominal
e.g. 3 quarters to 2: fullTime = 1/2; fraction = 2/3
        5 16th to 3: fullTime = 3/16; fraction = 3/5
        4th + 8th in place of 4th: fullTime = 1/4; fraction = 2/3 (on both notes)
        fullTime is only set on first note in group - rest are null
        real timespan = timeVal*fraction
        total length of group: fullTime
*/
export class TupletDef {
    constructor(public fullTime: TimeSpan, public fraction: Rational) { }
    public eq(other: TupletDef): boolean {
        if (!this.fullTime && !other.fullTime) return true;
        if (!this.fullTime || !other.fullTime) return false;
        return this.fullTime.eq(other.fullTime) && this.fraction.eq(other.fraction);
    }
    }
    