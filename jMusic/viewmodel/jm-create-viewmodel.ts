import { VScore, VMeasure, VNote, VMeter, VNotehead, VAccidental } from "./jm-viewmodel";
import { IScore, IEventVisitorTarget, IEventVisitor, INoteHeadInfo, INoteInfo, INoteDecorationEventInfo, ILongDecorationEventInfo, ITextSyllableEventInfo, IBeamEventInfo, IBarEventInfo, IClefEventInfo, IMeterEventInfo, IKeyEventInfo, IStaffExpressionEventInfo, ISequence, IGlobalContext, IVoice, IStaff } from "../model/jm-model-interfaces";
import { IVisitorIterator, AbsoluteTime, ClefDefinition, KeyDefinitionFactory, OffsetMeterDefinition, IMeterDefinition, IKeyDefinition, Alteration, Pitch } from "../jm-music-basics";
import { ContextVisitor, GlobalContext } from "../model/jm-model-base";




export class ViewModeller {
    constructor(){

    }
    
    create(score: IScore, globalContext: GlobalContext): VScore {
        let visitor = new ModelViewVisitor(globalContext);
        score.visitAllEvents(visitor, globalContext);
        return visitor.result();
    }
}

class AccidentalContext {
    alteration: Alteration;
    pitch: Pitch;
}

class RunningContext {
    currentClef: ClefDefinition;
    currentKey: IKeyDefinition;
    currentMeter: IMeterDefinition;
    currentAccidentals: AccidentalContext[];
    currentOttava: number;
}

class ContextStore {
    private contexts: RunningContext[] = [];

    setMeter(meter: IMeterDefinition, staff: IStaff) {

    }
    setClef(clef: ClefDefinition, staff: IStaff) {
        
    }
    setKey(key: IKeyDefinition, staff: IStaff) {
        
    }
    setAccidental(alteration: Alteration, pitch: Pitch, staff: IStaff) {
        
    }
    getMeter(staff: IStaff): IMeterDefinition {
        return null;
    }
    getClef(staff: IStaff): ClefDefinition {
        return null;
    }
    getKey(staff: IStaff): IKeyDefinition {
        return null;
    }
    getAccidental(pitch: Pitch, staff: IStaff): Alteration {
        return null;
    }
    clearAccidentals(staff: IStaff){
        
    }
}


class ModelViewVisitor implements IVisitorIterator<IEventVisitorTarget>, IEventVisitor {
    currentTime: AbsoluteTime;
    currentContext = new ContextStore();
    currentNote: VNote;

    visitNoteHeadInfo(head: INoteHeadInfo): void {
        var vHead = new VNotehead(head)
        vHead.accidental = new VAccidental();
        vHead.accidental.type = Alteration.fromString(head.pitch.alteration);
        this.currentNote.heads.push(vHead)
    }
    visitNoteInfo(note: INoteInfo): void {        
        this.currentNote = new VNote(note, this.currentTime)
        this.res.events.push(this.currentNote);
        this.currentTime = this.currentTime.add(note.timeVal);        
    }
    visitNoteDecorationInfo(deco: INoteDecorationEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitLongDecorationInfo(deco: ILongDecorationEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitTextSyllableInfo(text: ITextSyllableEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitBeamInfo(beam: IBeamEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitBarInfo(bar: IBarEventInfo): void {
        //throw new Error("Method not implemented.");
        this.res.measures.push(new VMeasure());
    }
    visitClefInfo(clef: IClefEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitMeterInfo(meter: IMeterEventInfo): void {
        this.res.events.push(new VMeter(meter, this.currentTime));
    }
    visitKeyInfo(key: IKeyEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitStaffExpressionInfo(staffExpression: IStaffExpressionEventInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitSequence(sequence: ISequence, globalContext: IGlobalContext): void {
        //throw new Error("Method not implemented.");
    }
    visitVoice(voice: IVoice): void {
        this.currentTime = AbsoluteTime.startTime;
    }
    visitStaff(staff: IStaff): void {
        //throw new Error("Method not implemented.");
    }
    visitScore(score: IScore): void {
        //throw new Error("Method not implemented.");
    }

    private res = new VScore();

    constructor(private globalContext: GlobalContext){
        this.res.measures = [];
        this.res.events = [];
        this.currentTime = AbsoluteTime.startTime;
    }

    visitPre(element: IEventVisitorTarget): (element: IEventVisitorTarget) => void {
        element.inviteEventVisitor(this, this.globalContext);
        return null;
    }
   
    result(): VScore {
        return this.res;
    }
}