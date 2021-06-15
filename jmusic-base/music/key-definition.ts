import { PitchClass } from "../pitch/pitch-class";

/**
    * Abstract key definition
    */
 export interface IKeyDefinition {
    debug(): string
    getFixedAlteration(pitch: number): string;
    eq(other: IKeyDefinition): boolean;
    enumerateKeys(): Array<PitchClass>;
    getTonic(): PitchClass;
    getMemento(): any;
}
