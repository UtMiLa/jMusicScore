import { Rational } from "./rational";
import { TimeSpan } from "./time-span";

/**
    * Absolute time from start of piece - is a rational number
    */
 export class AbsoluteTime extends Rational {
    static startTime = new AbsoluteTime(0);
    static infinity = new AbsoluteTime(1, 0);

    public diff(other: AbsoluteTime): TimeSpan {
        return new TimeSpan(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public sub(other: TimeSpan): AbsoluteTime {
        return new AbsoluteTime(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public add(other: TimeSpan): AbsoluteTime {
        return new AbsoluteTime(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public reduce(): AbsoluteTime {
        return <AbsoluteTime>super.reduce();
    }
    static createFromMemento(def: any): AbsoluteTime {
        return new AbsoluteTime(def.num, def.den);
    }
    public fromStart(): TimeSpan {
        return new TimeSpan(this.numerator, this.denominator);
    }
    static fromTimeSpan(ts: TimeSpan) {
        return new AbsoluteTime(ts.numerator, ts.denominator);
    }
}
