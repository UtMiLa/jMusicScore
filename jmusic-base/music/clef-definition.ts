import { Pitch } from "../pitch/logic-pitch";
import { ClefType } from "./clef-type";

/**
    * Clef definition: clef type, placement and transposition
    */
 export class ClefDefinition {
    constructor(public clefCode: ClefType, public clefLine: number, public transposition: number = 0) { // clefline: top line is 1
    }

    static clefG = new ClefDefinition(ClefType.ClefG, 4);
    static clefGTenor = new ClefDefinition(ClefType.ClefG, 4, -7);
    static clefF = new ClefDefinition(ClefType.ClefF, 2);
    static clefCAlto = new ClefDefinition(ClefType.ClefC, 3);
    static clefPerc = new ClefDefinition(ClefType.ClefPercussion, 0);

    public clefDef(): number {
        switch (this.clefCode) {
            case ClefType.ClefG: return 2;
            case ClefType.ClefC: return -2;
            case ClefType.ClefF: return -6;
            case ClefType.ClefNone: return -2;
            case ClefType.ClefPercussion: return -2;
            case ClefType.ClefTab: return -2;
        }
    }

    public clefName(): string {
        switch (this.clefCode) {
            case ClefType.ClefG: return "g";
            case ClefType.ClefC: return "c";
            case ClefType.ClefF: return "f";
            case ClefType.ClefNone: return "n";
            case ClefType.ClefPercussion: return "p";
            case ClefType.ClefTab: return "t";
        }
    }

    public static clefNameToType(name: string): ClefType {
        switch (name.toLowerCase()) {
            case "g": return ClefType.ClefG;
            case "c": return ClefType.ClefC;
            case "f": return ClefType.ClefF;
            case "n": return ClefType.ClefNone;
            case "p": return ClefType.ClefPercussion;
            case "t": return ClefType.ClefTab;
        }
        throw "Unknown clef: " + name;
    }

    public pitchOffset(): number {
        return this.clefDef() + this.transposition + 2 * this.clefLine;
        /*
        g4 = 10
        g4/-7 = 3
        f2 = -2
        c3 = 4
        */
    }

    public pitchToStaffLine(pitch: Pitch): number {
        return -pitch.pitch + this.pitchOffset();
    }

    public staffLineToPitch(line: number): Pitch {
        return new Pitch(-line + this.pitchOffset(), "");
    }

    public eq(other: ClefDefinition): boolean {
        return this.clefCode === other.clefCode && this.clefLine === other.clefLine && this.transposition === other.transposition;
    }

    public debug(): string {
        return this.clefName() + this.clefLine + (this.transposition ? ("/" + this.transposition) : "");
    }
}