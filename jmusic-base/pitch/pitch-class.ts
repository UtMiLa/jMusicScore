import { Pitch } from "./logic-pitch";

/**
    * Pitch class, that is pitch independent of the octave
    */
 export class PitchClass {
    // According to circle of fifths: 0 = c, 1 = g, -1 = f etc.
    constructor(public pitchClass: number) {
        this.pitchClass = pitchClass;
    }

    static create(pitch: Pitch) {
        var p1 = (pitch.pitch + 700) % 7;
        return new PitchClass(PitchClass.pitchToPc[p1] + 7 * Pitch.strToInt(pitch.alteration));
    }

    public accidentals() {
        var x = this.pitchClass + 15;
        var accidentalSuffixNo = Math.floor(x / 7);
        return accidentalSuffixNo - 2;
    }

    public noteNameLilypond(): string {
        var x = this.pitchClass + 15;
        var noteNameRoot = PitchClass.noteNames[x % 7];
        var accidentalSuffixNo = Math.floor(x / 7);
        return noteNameRoot + PitchClass.suffices[accidentalSuffixNo];
    }

    static noteNames = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
    static suffices = ['eses', 'es', '', 'is', 'isis'];
    static pitchToPc = [0, 2, 4, -1, 1, 3, 5];
}
