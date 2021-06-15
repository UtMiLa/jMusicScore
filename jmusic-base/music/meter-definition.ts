import { AbsoluteTime } from "../time/absolute-time";
import { TimeSpan } from "../time/time-span";

/**
    * Abstract meter definition
    */
 export interface IMeterDefinition {
    debug(): string;
    getMeasureTime(): TimeSpan;
    nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
    nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime;
    eq(other: IMeterDefinition): boolean;
    display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[];
    getMemento(): any;
}
