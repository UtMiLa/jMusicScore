import { Interval } from "./interval";
import { PitchClass } from "./pitch-class";

/**
    * Pitch including alterations
    * Middle C = C4 = c' = midi 60 = pitch 0
    * Octave up = +7
    */
 export class Pitch {
    constructor(public pitch: number, public alteration: string) {
    }
    public diff(pitch: Pitch): Interval {
        return Interval.fromPitches(pitch, this);
    }
    public add(interval: Interval): Pitch {
        return interval.addPitch(this);
    }
    public equals(pitch: Pitch, ignoreAlteration: boolean = false): boolean {
        return this.pitch == pitch.pitch && (ignoreAlteration || this.alteration == pitch.alteration);
    }
    public gt(pitch: Pitch): boolean {
        return this.pitch > pitch.pitch || (this.pitch == pitch.pitch && this.alteration > pitch.alteration);
    }
    public lt(pitch: Pitch): boolean {
        return this.pitch < pitch.pitch || (this.pitch == pitch.pitch && this.alteration < pitch.alteration);
    }
    static strToInt(a: string): number {
        return Pitch.alterationInts.indexOf(a) - 2;
    }
    static intToStr(n: number): string {
        return Pitch.alterationInts[n + 2];
    }
    public toMidi(): number {
        return Math.floor(12 * (this.pitch + 1) / 7) + 59 + Pitch.strToInt(this.alteration);
    }
    public static createFromMidi(midiNo: number): Pitch {
        var pitch = Math.floor(7 * (midiNo - 56) / 12) - 2;
        var alterationNo = midiNo - Math.floor(12 * (pitch + 1) / 7) - 59;
        return new Pitch(pitch, Pitch.alterationInts[alterationNo + 2]);
    }
    public raiseAlteration(n: number) {
        this.alteration = Pitch.intToStr(Pitch.strToInt(this.alteration) + n);
    }
    public getEnharmonicPitch(n?: number): Pitch {
        var res: Pitch = this;
        if (this.alteration === 'x')
            res = new Pitch(this.pitch + 1, '');
        else if (this.alteration === 'b')
            res = new Pitch(this.pitch - 1, '');
        else {
            var pc = PitchClass.create(this);
            if (!n) {
                n = 0;
            }
            if (pc.pitchClass > 1) {
                res = new Pitch(this.pitch + 1, '');
            }
            else { res = new Pitch(this.pitch - 1, '');}
        }
        var a = this.toMidi();
        var b = res.toMidi();
        res.alteration = Pitch.intToStr(a - b);
        return res;
    }
    static alterationInts = ['bb', 'b', '', 'x', 'xx'];
    static noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    static alterations: { [index: string]: string } = { 'bb': 'eses', 'b': 'es', 'n': '', 'x': 'is', 'xx': 'isis', '': '', '0': '' };
    static octaves = [',,,,,', ',,,,', ',,,', ',,', ',', '', "'", "''", "'''", "''''", "'''''", "''''''"];
    static pitchToNoteNameOctave(pitch: number): {noteName: string; octave: number} {
        var noteName = Pitch.noteNames[(pitch + 98) % 7];
        var octave = Math.floor(pitch / 7);
        return {noteName, octave};
    }
    static noteNameOctaveToPitch(noteName: string, octave: number): number {
        var pitch = Pitch.noteNames.indexOf(noteName);
        if (pitch=== -1) throw "Illegal note name";
        pitch += octave * 7;
        return pitch;
    }
    public debug(): string {
        var noteName = Pitch.noteNames[(this.pitch + 98) % 7];
        var octave = Math.floor(this.pitch / 7);
        var octString: string = "" + octave;
        if (octave >= -6 && octave <= 5) {
            octString = Pitch.octaves[octave + 6];
        }
        var alteration = Pitch.alterations[this.alteration];
        return noteName + alteration + octString;
    }
}
