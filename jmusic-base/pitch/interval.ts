import { IntervalType } from "./interval-type";
import { Pitch } from "./logic-pitch";
import { PitchClass } from "./pitch-class";

/**
 * Interval including alterations. Zero-based.
 *                  length   alt                diffPc
 * Pure prime         0      Pure                 0
 * Minor second       1      Minor               -5
 * Diminished fifth   4      Diminished          -6
 * Major seventh      6      Major                5
 * NB: inverse intervals: alteration and length both change polarity:
 * reverse diminished fifth   -4   Augmented
 * diffPc = number of steps around the circle of fifths
 */
 export class Interval {
    constructor (public length: number, public alteration: IntervalType, diffPc?: number) {
        let alt = this.alteration;
        if(alt){
            const baseInterval = this.length % 7;
            if (baseInterval === 0 || baseInterval === 3 || baseInterval === 4) {
                // pure/augm/dim
                if (alt < 0) alt++; else alt--;
            }
            else {
                if (alt > 0) alt--;
            }
        }
        this.realAlteration = alt;
        
        if (diffPc === undefined){
            this.diffPc = PitchClass.pitchToPc[length % 7] + 7 * alt;
        } else {
            this.diffPc = diffPc;
        }

    }
    
    private realAlteration: number;

    private diffPc: number

    static fromPitches(fromPitch: Pitch, toPitch: Pitch): Interval {
        const length = toPitch.pitch - fromPitch.pitch;
        const fromPc = PitchClass.create(fromPitch);
        const toPc = PitchClass.create(toPitch);
        const diffPc = toPc.pitchClass - fromPc.pitchClass;

        /*const part1 = diffPc > 1 ? Math.floor((diffPc - 6) / 7) + 2 : 0;
        const part2 = diffPc < -1 ? Math.floor((-diffPc - 6) / 7) + 2 : 0;*/

        return new Interval(length, this.alterationFromDiffPc(diffPc), diffPc);
    }

    static alterationFromDiffPc(diffPc: number): IntervalType{
        const part1 = diffPc > 1 ? Math.floor((diffPc - 6) / 7) + 2 : 0;
        const part2 = diffPc < -1 ? Math.floor((-diffPc - 6) / 7) + 2 : 0;

        return part1 - part2;
    }

    semitones(): number {
        return Math.floor(12 * (this.length + 1) / 7) - 1 + this.realAlteration;
    }

    inverted(): Interval{        
        return new Interval(-this.length, -this.alteration, -this.diffPc);
    }

    addPitch(pitch: Pitch): Pitch{
        const pc = PitchClass.create(pitch);
        const newpc = pc.pitchClass + this.diffPc;
        const newPitchClass = new PitchClass(newpc);
        const newAccidentals = newPitchClass.accidentals();

        return new Pitch(pitch.pitch + this.length, Pitch.intToStr(newAccidentals));
    }

    addInterval(interval: Interval): Interval { 
        var newDiffPc = this.diffPc + interval.diffPc;
        var alt = Interval.alterationFromDiffPc(newDiffPc);

        return new Interval(this.length + interval.length, alt, newDiffPc);
    }

    toString() {
        const invert = this.semitones() < 0;
        const interval = invert ? this.inverted() : this;
        return "Interval(" + (invert ? 'inv ' : '') +
            interval.length + " " + interval.alteration + ")";
    }
}
