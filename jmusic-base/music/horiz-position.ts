import { AbsoluteTime } from "../time/absolute-time";

/**
    * Sort order for timed events - elements at same time are sorted according to sort order. Multiple grace notes are sorted according to graceNo.
    */
 export class HorizPosition {
    constructor(public absTime: AbsoluteTime, public sortOrder: number, public graceNo: number = 0, public beforeAfter = 0) { }
    
    public static compareEvents(a: HorizPosition, b: HorizPosition): number {
        if (!a.absTime.eq(b.absTime)) return (a.absTime.diff(b.absTime).toNumber());
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.graceNo - b.graceNo;
    }
    public eq(comp: HorizPosition): boolean {
        return this.absTime.eq(comp.absTime) && this.sortOrder === comp.sortOrder && this.graceNo === comp.graceNo;
    }
    public clone(beforeAfter: number): HorizPosition {
        return new HorizPosition(this.absTime, this.sortOrder, this.graceNo, beforeAfter);
    }
}
