import { IFileConverter } from './jm-interfaces';
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'

import {MusicElement, IMusicElement, IMeterSpacingInfo, IMeter, MusicElementFactory,
    IVisitor, IVoice, IStaff, IScore, IKey, IClef, INote, INotehead, ScoreElement } from "./jm-model";
import { parse } from './peg/lilypond';

export class LilyPondConverter implements IFileConverter {    
    read(data: any): IScore{
        var parsed = parse(data);
        var voiceMemento = parsed[0].mus; // tjek om mus er voice eller noget andet
        voiceMemento.children.reverse();
        var staffMemento = {def:{}, t:"Staff", children:[{ "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, voiceMemento], id: '2'};
        var scoreMemento = {def:{}, t:"Score", children:[staffMemento], id: '3' };
        var score = <IScore>MusicElementFactory.recreateElement(null, scoreMemento);
    
        return score;
    }
    write(score: IScore): string{
        return LilypondHelper.getAsLilypond(score);
    }

}






class LilypondHelper {
    static noteTypes: { [Index: string]: string } = {
        "1024": "1_1024",
        "512": "1_512",
        "256": "1_256",
        "128": "1_128",
        "64": "1_64",
        "32": "1_32",
        "16": "1_16",
        "8": "1_8",
        "4": "1_4",
        "2": "1_2",
        "1": "1_1",
        "\\breve": "2_1",
        "\\longa": "4_1",
        "\\maxima": "8_1"
    };
    static noteTimes: { [Index: string]: TimeSpan } = {
        "1_1024": new TimeSpan(1, 1024), 
        "1_512": new TimeSpan(1, 512), 
        "1_256": new TimeSpan(1, 256), 
        "1_128": new TimeSpan(1, 128), 
        "1_64": new TimeSpan(1, 64), 
        "1_32": new TimeSpan(1, 32), 
        "1_16": new TimeSpan(1, 16), 
        "1_8": new TimeSpan(1, 8), 
        "1_4": new TimeSpan(1, 4), 
        "1_2": new TimeSpan(1, 2), 
        "1_1": new TimeSpan(1, 1), 
        "2_1": new TimeSpan(4, 1), 
        "4_1": new TimeSpan(4, 1), 
        "8_1": new TimeSpan(8, 1)
    };

    static NoteTypeToName(type: string): string {
        return this.noteTypes[type];
    }
    static NoteNameToType(name: string): string {
        for (var type in this.noteTypes) {
            if ("n" + this.noteTypes[type] === name) {
                return type;
            }
        }
        return null;
    }
    static NoteNameToDuration(name: string): TimeSpan {
        return this.noteTimes[name];
    }
    static NoteDurationToType(dur: TimeSpan): string {
        if (dur.numerator === 1) {
            return "" + dur.denominator;
        }
        else if (dur.denominator === 1) {
            if (dur.numerator === 2) return "\\breve";
            if (dur.numerator === 4) return "\\longa";
            if (dur.numerator === 8) return "\\maxima";
        }
        else {
            // error
            return "1";
        }
    }


    static getAsLilypond(document: IScore): string {
        var res = "<<\n";
        document.withStaves((staff: IStaff, indexS: number) => {
            res += "\\new Staff {\n"; // relative c"første tones oktav"
            
            // add Key
            var key: IKey;
            if (staff.getKeyElements().length) {
                key = staff.getKeyElements()[0];
            }
            if (key && (key.absTime.numerator === 0)) {
                var tonic: PitchClass = key.getTonic();
                res += "\t\\key " + tonic.noteNameLilypond() + " \\major\n"; // todo: other modes!
            }

            // add Clef
            var clef: IClef;
            if (staff.clefElements.length) {
                clef = staff.clefElements[0];
            }
            if (clef && (clef.absTime.numerator === 0)) {
                res += this.getClefAsLilypond(clef);
            }

            // add Meter?
            if (staff.voiceElements.length > 1) {
                res += "\t<<\n";
                staff.withVoices((voice: IVoice, indexV: number) => {

                    res += '\t\t\\new Voice = "Voice' + indexS + '_' + indexV +'" {';
                    res += "\t\t" + this.getEventsAsLilypond(voice) + "\n";
                    res += "\t\t}\n";

                });
                res += "\t>>\n";
            }
            else if (staff.voiceElements.length === 1) {
                res += "\t" + this.getEventsAsLilypond(staff.voiceElements[0]) + "\n";
            }
            res += "}\n";
        });
        res += ">>\n";
        return res;
    }

    private static getClefAsLilypond(clef: IClef): string {
                var def = clef.definition;
                var c = def.clefName() + def.clefLine;
                var clefName = "unknown";
                switch (c) {
            case "g4": clefName = 'treble'; break;
                    case "g5": clefName = 'french'; break;

                    case "f1": clefName = 'subbass'; break;
                    case "f2": clefName = 'bass'; break;
                    case "f3": clefName = 'varbaritone'; break;

                    case "c1": clefName = 'baritone'; break;
                    case "c2": clefName = 'tenor'; break;
                    case "c3": clefName = 'alto'; break;
                    case "c4": clefName = 'mezzosoprano'; break;
                    case "c5": clefName = 'soprano'; break;
                    //default: alert(c);
                }
                if (def.transposition > 0) {
                    clefName += '^' + (def.transposition + 1)
                }
                else if (def.transposition < 0) {
                    clefName += '_' + (-def.transposition + 1)
                }
        return '\t\\clef "' + clefName + '" \n';
    }

    private static getEventsAsLilypond(voice: IVoice): string {
        var res = "";
        var events = voice.getEvents(); // + staff.keys, .meters, .clefs, + score.bars
        for (var i = 0; i < events.length; i++) {
            var ev = events[i];
            if (ev.getElementName() === "Note") {
                res += this.getNoteAsLilypond(<INote>ev);
            }
            else if (ev.getElementName() === "Clef") {
                res += this.getClefAsLilypond(<IClef>ev);
            }
        }

        return res;
    }

    private static getNoteAsLilypond(note: INote): string {
        var res = "";
        if (note.graceType) res += '\\grace ';
        if (note.NoteId === "hidden") {
            res += "s";
        }
        else if (note.rest) {
            res += "r";
        }                
            else if (note.noteheadElements.length === 1) {
                res += note.noteheadElements[0].pitch.debug();
            if (note.noteheadElements[0].tie) res += "~";
            }
            else {
                res += "<";
                note.withHeads((head: INotehead, indexH: number) => {
                    if (indexH) res += " ";
                    res += head.pitch.debug();
                if (head.tie) res += "~";
                });
                res += ">";
            }
        //res += LilypondHelper.NoteNameToType(note.noteId);
        res += LilypondHelper.NoteDurationToType(note.timeVal);
        for (var i = 0; i < note.dotNo; i++) res += ".";
        res += " ";
        return res;
    }


}


/*var obj = "{c4 d e c}";
var converter = new LilyPondConverter();

var parsed = converter.read(obj);
console.log(parsed);*/