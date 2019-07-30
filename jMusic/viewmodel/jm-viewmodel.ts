import { StemDirectionType, AbsoluteTime, TimeSpan, Alteration } from "../jm-music-basics";
import { INote, INoteInfo, IMeterEventInfo } from "../model/jm-model-interfaces";

export class VEvent {
    noInMeasure: number;
    measureNo: number;
    absoluteTime: AbsoluteTime;
    timeInMeasure: TimeSpan;
    constructor (time: AbsoluteTime) {
        this.absoluteTime = time;
    }
}


export class VNote extends VEvent {
    direction: StemDirectionType;
    heads: VNotehead[];
    beams: VBeam[];
    noteExpressions: VNoteExpression[];
    ledgerOver: number;
    ledgerUnder: number;

    constructor(note: INoteInfo, time: AbsoluteTime){
        super(time);
    }
}

export class VBeam {

}

export class VNotehead {
    line: number;
    displaced: boolean;
}

export class VMeasure {
    events: VEvent[];
}

export class VScore {
    measures: VMeasure[];
    events: VEvent[];
}

export class VAccidental {
    type: Alteration;
    displacement: number;
}

export class VMeter  extends VEvent {
    constructor(meter: IMeterEventInfo, time: AbsoluteTime){
        super(time);
    }
}

export class VClef extends VEvent {
    
}

export class VKey extends VEvent {}

export class VNoteExpression {}

export class VStaffExpression extends VEvent {}

export class VTextSyllable {}

export class VLongDecoration extends VEvent {}

/*export class VNote {}

export class VNote {}

export class VNote {}

export class VNote {}

export class VNote {}*/