import { PitchClass } from "../pitch/pitch-class";
import { IKeyDefinition } from "./key-definition";

/**
    * Regular key definition (in the circle of fifths)
    */
 export class RegularKeyDefinition implements IKeyDefinition {
    constructor(public acci: string, public number: number) {
    }

    public debug(): string {
        return this.number + " " + this.acci;
    }

    public getFixedAlteration(pitch: number): string {
        if (!this.number) return "n";
        pitch += 98;
        var det = (pitch * 2 + 1) % 7;
        if (this.acci === "x") {
            if (det < this.number) return "x";
            return "n";
        }
        if (this.acci === "b") {
            if (6 - det < this.number) return "b";
            return "n";
        }
        return "n";
    }

    public enumerateKeys(): Array<PitchClass> {
        // 0 = c, 1 = g, -1 = f etc.
        var res: Array<PitchClass> = [];
        // #: -1 0 1 2 3 4 5 6
        // b: 5 4 3 2 1 0 -1 -2
        var p = this.acci === "x" ? 6 : -2;
        var dp = this.acci === "x" ? 1 : -1;
        for (var i = 0; i < this.number; i++) {
            res.push(new PitchClass(p));
            p += dp;
        }
        return res;
    }

    public eq(other: IKeyDefinition): boolean {
        return this.debug() === other.debug();
    }

    public getTonic(): PitchClass {
        if (this.acci === "x") {
            return new PitchClass(this.number);
        }
        else
            return new PitchClass(-this.number);
    }
    static createFromMemento(memento: any): IKeyDefinition {
        return new RegularKeyDefinition(memento.acci, memento.no);
    }
    public getMemento(): any {
        return {
            t: "Regular",
            acci: this.acci,
            no: this.number
        }
    }
}
