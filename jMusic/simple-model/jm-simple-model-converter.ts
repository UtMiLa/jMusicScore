import { ISection, IProject, IVoice, IStaff, ISequence, INote, IKey, IMeter, IClef, IStaffExpression, IBar } from './jm-simple-model-interfaces';
import { ScoreElement, Music } from '../model/jm-model';
import { IGlobalContext, IVoice as IVoiceElement, IEventInfo, ITimedEvent, ITimedObjectEvent,
    IBar as IBarElement, INote as INoteElement } from '../model/jm-model-interfaces';
import { ClefDefinition, TimeSpan } from '../jm-music-basics';
import { NoteElement, NoteheadElement } from '../model/jm-model-notes';
import { GlobalContext } from '../model/jm-model-base';


export class ModelConverter  {
    
    constructor (private project: IProject) {}

    globalContext = new GlobalContext();

    convertSection(from: ISection): ScoreElement {
        const score = new ScoreElement(null, this.globalContext);
        for(let staff of from.staves) {
            const toStaff = score.addStaff(ClefDefinition.clefG);
            for (let voice of staff.voices) {
                const toVoice = toStaff.addVoice();
                this.convertVoice(voice, toVoice);
            }
        }
        return score;
    }

    convertVoice(fromVoice: IVoice, toVoice: IVoiceElement): void {
        for(let sequence of fromVoice.sequences) {
            for (let event of this.getSequenceEvents(sequence, toVoice))
            toVoice.addEvent(event);
        }
    }

    getSequenceEvents(sequence: ISequence, voice: IVoiceElement): ITimedEvent[] {
        let res: ITimedEvent[] = [];

        for (let event of sequence.events) {
            switch (ModelConverter.getEventType(event)) {
                case 'Sequence': 
                    const extraEvents = this.getSequenceEvents(event as ISequence, voice);
                    res = res.concat(extraEvents);
                    break;
                case 'Note': 
                    let note = this.getNote(event as INote, voice);
                    console.log(note);
                    res.push(note);
                    break;
                case 'Bar':
                    break;
                case 'StaffExpression':
                    break;
                case 'Clef':
                    break;
                case 'Key':
                    break;
                case 'Meter': 
                    break;
                default: 
                break;
            }            
        }
        return res;
    }

    getNote(note: INote, voice: IVoiceElement): INoteElement{
        // debugger;
        const noteHeadMementos = note.noteheads.map(nh => ({
            id: "",
            t: "Notehead",
            def: {p: nh.pitch.pitch, a: nh.pitch.alteration}
        }));
        const noteMemento = {
            id: "",
            t: "Note",
            def: {
                time: { num: note.timeVal.numerator, den: note.timeVal.denominator },
                abs: note.absTime ? { num: note.absTime.numerator, den: note.absTime.denominator } : null,
                noteId: NoteElement.calcNoteId( new TimeSpan(note.timeVal.numerator, note.timeVal.denominator) )
            }/*,
            children: 
            if (this.dotNo) { val.dots = this.dotNo; }
            if (this.tupletDef) {
                val.tuplet = this.tupletDef.fraction.getMemento();
                if (this.tupletDef.fullTime) {
                    val.tuplet.fullTime = this.tupletDef.fullTime.getMemento();
                }
            }
            if (this.graceType) {
                val.grace = this.graceType;
            }
            if (this.rest) {
                val.rest = true;
            }
            if (this.noteId === 'hidden') {
                val.hidden = true;
            }
            // todo: beams
            if (this.stemDirection) {
                val.stem = this.stemDirection;
            }
            return val;*/
        };
        const n = NoteElement.createFromMemento(voice, noteMemento, this.globalContext);
        for (let nh of noteHeadMementos) {
            const noteHead = NoteheadElement.createFromMemento(n, nh);
            //n.addChild
        }
        // console.log(note, noteMemento, n);
        return n;
    }

    getBar(bar: IBar): IBarElement{
        return null; // new BarElement( null, null);
    }

    getStaffExpression(expr: IStaffExpression): NoteElement{
        return new NoteElement(null, null, null);
    }

    getClef(clef: IClef): NoteElement{
        return new NoteElement(null, null, null);
    }

    getKey(key: IKey): NoteElement{
        return new NoteElement(null, null, null);
    }

    getMeter(meter: IMeter): NoteElement{
        return new NoteElement(null, null, null);
    }

    static getEventType(event: ITimedEvent | any): string {
        if (event.events) return "Sequence";
        if (event.noteGlyph) return "Note";
        if (event.barKind) return "Bar";
        if (event.text) return "StaffExpression";
        if (event.clefDef) return "Clef";
        if (event.keyDef) return "Key";
        if (event.meterDef) return "Meter";
        return "Unknown";
    }
}
