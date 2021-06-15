/**
* Rational number numerator/denominator; numerator and denominator must be integers
*/
export class Rational {
    constructor(public numerator: number, public denominator: number = 1) {
        if (denominator < 0) {
            throw "Illegal denominator: " + this.toString();
        }
    }

    static gcd(a: number, b: number): number {
        if (b === 0) return a;
        return this.gcd(b, a % b);
    }

    public toNumber() {
        return this.numerator / this.denominator;
    }

    public toString() {
        return this.numerator + "/" + this.denominator;
    }

    public reduce(): Rational {
        if (this.denominator < 0) {
            this.denominator = -this.denominator;
            this.numerator = -this.numerator;
        }
        if (this.numerator) {
            var gcd = Rational.gcd(this.numerator, this.denominator);
            gcd = Math.abs(gcd);
            this.numerator /= gcd;
            this.denominator /= gcd;
        }
        else {
            this.denominator = 1;
        }
        return this;
    }

    public eq(other: Rational) {
        return this.denominator * other.numerator === this.numerator * other.denominator;
    }

    public gt(other: Rational) {
        return this.numerator * other.denominator > this.denominator * other.numerator;
    }
    public ge(other: Rational) {
        return this.numerator * other.denominator >= this.denominator * other.numerator;
    }

    static createFromMemento(def: any): Rational {
        return new Rational(def.num, def.den);
    }

    public getMemento(): any {
        return { num: this.numerator, den: this.denominator };
    }

}
