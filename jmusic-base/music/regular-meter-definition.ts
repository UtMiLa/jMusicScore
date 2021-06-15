import { AbsoluteTime } from "../time/absolute-time";
import { TimeSpan } from "../time/time-span";
import { IMeterDefinition } from "./meter-definition";

/**
    * Regular meter definition (a/b, where b = 2^n)
    */
 export class RegularMeterDefinition implements IMeterDefinition {
    constructor(public numerator: number, public denominator: number) {
        if (numerator % 3 === 0) {
            this.boundaryInterval = new TimeSpan(3, denominator)
        }
        else {
            this.boundaryInterval = new TimeSpan(1, 4)
        }
    }

    private boundaryInterval: TimeSpan;

    public debug(): string {
        return this.numerator + "/" + this.denominator;
    }

    public getMeasureTime(): TimeSpan {
        return new TimeSpan(this.numerator, this.denominator);
    }

    public nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
        // todo: calculation
        /*
            17/8 mod 1/4:
            17/8 mod 2/8 = 1/8
        
            a/b mod c/d:
            a*d/b*d mod c*b/b*d = (a*d mod c*b)/(b*d)
        */
        var boundaryTime = (abstime.diff(meterTime)).modulo(this.boundaryInterval);
        if (boundaryTime.numerator) { // % 64
            return abstime.sub(boundaryTime).add(this.boundaryInterval);
        }
        else {
            return abstime;
        }
    }

    public nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
        // todo: calculation
        var mtime = this.getMeasureTime();
        var barTime = (abstime.diff(meterTime)).modulo(mtime);
        if (barTime.numerator) {
            //if ((abstime - this.absTime) % mtime) {
            //return abstime - (abstime - this.absTime) % mtime + mtime
            return abstime.sub(barTime).add(mtime);
        }
        else {
            return abstime.add(mtime);
        }
    }

    public eq(other: IMeterDefinition): boolean {
        return this.debug() === other.debug();
    }

    public display(addFraction: (num: string, den: string) => any, addFull: (full: string) => any): any[]{
        var res: any[];
        if (this.numerator === 4 && this.denominator === 4) {
            res = [addFull("c")];
        }
        else if (this.numerator === 2 && this.denominator === 2) {
            res = [addFull("C")];
        }
        else {
            res = [addFraction("" + this.numerator, "" + this.denominator)];
        }
        return res;
    }
    static createFromMemento(memento: any): IMeterDefinition {
        return new RegularMeterDefinition(memento.num, memento.den);
    }
    public getMemento(): any {
        return {
            t: "Regular",
            num: this.numerator,
            den: this.denominator
        }
    }
}
