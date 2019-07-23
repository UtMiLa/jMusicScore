import { StemDirectionType, AbsoluteTime, TimeSpan, Alteration } from "../jm-music-basics";

export class VEvent {
    noInMeasure: number;
    measureNo: number;
    absoluteTime: AbsoluteTime;
    timeInMeasure: TimeSpan;
}


export class VNote extends VEvent {
    direction: StemDirectionType;
    heads: VNotehead[];
    beams: VBeam[];
    noteExpressions: VNoteExpression[];
    ledgerOver: number;
    ledgerUnder: number;
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

}

export class VAccidental {
    type: Alteration;
    displacement: number;
}

export class VMeter {

}

export class VClef {
    
}

export class VKey {}

export class VNoteExpression {}

export class VStaffExpression extends VEvent {}

export class VTextSyllable {}

export class VLongDecoration {}

/*export class VNote {}

export class VNote {}

export class VNote {}

export class VNote {}

export class VNote {}*/