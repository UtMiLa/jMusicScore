import { Rational } from "./rational";

/**
    * Relative time - difference between two absolute times. Is a rational number.
    */
 export class TimeSpan extends Rational {
    static quarterNote = new TimeSpan(1, 4);
    static eighthNote = new TimeSpan(1, 8);
    static halfNote = new TimeSpan(1, 2);
    static wholeNote = new TimeSpan(1, 1);
    static infiniteNote = new TimeSpan(1, 0);
    static noTime = new TimeSpan(0, 1);

    public sub(other: TimeSpan): TimeSpan {
        return new TimeSpan(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public add(other: TimeSpan): TimeSpan {
        return new TimeSpan(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator).reduce();
    }
    public reduce(): TimeSpan {
        return <TimeSpan>super.reduce();
    }
    public divide(other: TimeSpan): number {
        return (this.numerator * other.denominator) / (this.denominator * other.numerator);
    }
    public modulo(other: TimeSpan): TimeSpan {
        var x = this.numerator * other.denominator;
        var y = this.denominator * other.numerator;
        if (x < 0) {
            x += Math.ceil(-x / y) * y;
        }
        return new TimeSpan(x % y, this.denominator * other.denominator).reduce();
    }
    public divideScalar(scalar: number): TimeSpan {
        return new TimeSpan(this.numerator, this.denominator * scalar).reduce();
    }
    public multiplyScalar(scalar: number): TimeSpan {
        return new TimeSpan(scalar * this.numerator, this.denominator).reduce();
    }
    public multiplyRational(fraction: Rational): TimeSpan {
        return new TimeSpan(fraction.numerator * this.numerator, fraction.denominator * this.denominator).reduce();
    }
    static createFromMemento(def: any): TimeSpan {
        return new TimeSpan(def.num, def.den);
    }
    /*public fromStart(): AbsoluteTime {  ==>  AbsoluteTime.fromTimeSpan(this)
        return new AbsoluteTime(this.numerator, this.denominator);
    }*/
}
