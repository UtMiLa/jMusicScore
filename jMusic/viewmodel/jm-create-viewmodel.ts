import { VScore, VMeasure } from "./jm-viewmodel";
import { IScore, IEventVisitorTarget, IEventVisitor, INoteHeadInfo, INoteInfo, INoteDecorationEventInfo, ILongDecorationEventInfo, ITextSyllableEventInfo, IBeamEventInfo, IBarEventInfo, IClefEventInfo, IMeterEventInfo, IKeyEventInfo, IStaffExpressionEventInfo, ISequence, IGlobalContext, IVoice, IStaff } from "../model/jm-model-interfaces";
import { IVisitorIterator } from "../jm-music-basics";
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


class ModelViewVisitor implements IVisitorIterator<IEventVisitorTarget>, IEventVisitor {
    visitNoteHeadInfo(head: INoteHeadInfo): void {
        //throw new Error("Method not implemented.");
    }
    visitNoteInfo(note: INoteInfo): void {
        //throw new Error("Method not implemented.");
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
        //throw new Error("Method not implemented.");
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
        //throw new Error("Method not implemented.");
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
    }

    visitPre(element: IEventVisitorTarget): (element: IEventVisitorTarget) => void {
        element.inviteEventVisitor(this, this.globalContext);
        return null;
    }
   
    result(): VScore {
        return this.res;
    }
}