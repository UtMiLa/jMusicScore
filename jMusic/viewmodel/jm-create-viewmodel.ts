import { VScore, VMeasure, VNote, VMeter, VNotehead, VAccidental } from "./jm-viewmodel";
import { IScore, IEventVisitorTarget, IEventVisitor, INoteHeadInfo, INoteInfo, INoteDecorationEventInfo, ILongDecorationEventInfo, ITextSyllableEventInfo, IBeamEventInfo, IBarEventInfo, IClefEventInfo, IMeterEventInfo, IKeyEventInfo, IStaffExpressionEventInfo, ISequence, IGlobalContext, IVoice, IStaff } from "../model/jm-model-interfaces";
import { IVisitorIterator, AbsoluteTime, ClefDefinition, KeyDefinitionFactory, OffsetMeterDefinition, IMeterDefinition, IKeyDefinition, Alteration, Pitch, StaffContext } from "../jm-music-basics";
import { ContextVisitor, GlobalContext } from "../model/jm-model-base";




export class ViewModeller {
    constructor(){

    }
    
    create(score: IScore, globalContext: IGlobalContext): VScore {
        let visitor = new ModelViewVisitor(globalContext);
        score.visitAllEvents(visitor, globalContext);
        return visitor.result();
    }
}

class AccidentalContext {
    constructor(public alteration: Alteration, public pitch: Pitch) {
    }
}

class RunningContext {
    currentClef: ClefDefinition;
    currentKey: IKeyDefinition;
    currentMeter: IMeterDefinition;
    currentAccidentals: AccidentalContext[] = [];
    currentOttava: number;
}

class ContextStore {
    private contexts: { [key: string]: RunningContext } = {};

    getContext(staff: IStaff): RunningContext{
        if (!this.contexts[staff.id]) {
            this.contexts[staff.id] = new RunningContext();
        }
        return this.contexts[staff.id];
    }

    setMeter(meter: IMeterDefinition, staff: IStaff) {

    }
    setClef(clef: ClefDefinition, staff: IStaff) {
        
    }
    setKey(key: IKeyDefinition, staff: IStaff) {
        
    }
    setAccidental(alteration: Alteration, pitch: Pitch, staff: IStaff) {
        var acc = this.getContext(staff).currentAccidentals;
        for (let i = 0; i < acc.length; i++){
            if (acc[i].pitch.equals(pitch, true)){
                acc[i].alteration = alteration;
                return;
            }
        }
        acc.push(new AccidentalContext(alteration, pitch));
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
        var acc = this.getContext(staff).currentAccidentals;
        for (let i = 0; i < acc.length; i++){
            if (acc[i].pitch.equals(pitch, true))
                return acc[i].alteration;
        }
        // todo: return according to current key
        return Alteration.None;
    }
    clearAccidentals(staff: IStaff){
        this.getContext(staff).currentAccidentals = [];
    }
}


class ModelViewVisitor implements IVisitorIterator<IEventVisitorTarget>, IEventVisitor {
    currentTime: AbsoluteTime;
    currentStaff: IStaff;
    currentVoice: IVoice;
    currentContext = new ContextStore();
    currentNote: VNote;
    staffContext: StaffContext;

    visitNoteHeadInfo(head: INoteHeadInfo): void {
        var vHead = new VNotehead(head);
        vHead.line = this.staffContext.clef.pitchToStaffLine(head.pitch);

        vHead.accidental = new VAccidental();
        vHead.accidental.type = Alteration.fromString(head.pitch.alteration);
        var acc = this.currentContext.getAccidental(head.getPitch(), this.currentStaff);
        // skal kun vises, hvis den er forskellig fra tidligere fortegn eller hvis "force"
        let doShow = true;
        //console.log(vHead.accidental.type, acc);
        if (vHead.accidental.type.equals(acc)) {
            doShow = head.source.forceAccidental;
        }
        if (doShow){
            if (vHead.accidental.type.equals(Alteration.None)) {
                vHead.accidental.type = Alteration.Natural;
            }
            this.currentContext.setAccidental(vHead.accidental.type, head.getPitch(), this.currentStaff);
        }
        else {
            vHead.accidental.type = Alteration.None;
        }
        //console.log(doShow);
        //console.log(JSON.stringify(vHead));
        this.currentNote.heads.push(vHead);
    }
    visitNoteInfo(note: INoteInfo): void {
        const staffContext = this.currentStaff.getStaffContext(this.currentTime, this.globalContext);
        if (!this.staffContext || this.staffContext.barNo !== staffContext.barNo) {
            this.currentContext.clearAccidentals(this.currentStaff);
        }

        this.staffContext = staffContext;
        //console.log(this.staffContext);
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
        this.currentContext.clearAccidentals(this.currentStaff);
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
        this.currentVoice = voice;
    }
    visitStaff(staff: IStaff): void {
        this.currentStaff = staff;
    }
    visitScore(score: IScore): void {
        //throw new Error("Method not implemented.");
    }

    private res = new VScore();

    constructor(private globalContext: IGlobalContext){
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


/*
export class AlternativeViewCreator {

    createViewModel(model: IScore): VScore{


    }
}*/