import { StemDirectionType, AbsoluteTime, TimeSpan, Alteration } from "../jm-music-basics";
import { INote, INoteInfo, IMeterEventInfo } from "../model/jm-model-interfaces";

/*
Viewmodel er en kontekstfri repræsentation af nodebilledet.
Hvert symbol i nodebilledet er repræsenteret af et objekt.
Fortolkningen af objektet er ikke afhængigt af konteksten, fx tidligere angivne nøgler/taktarter m.m.
Deres nøjagtige placering er ikke beregnet, kun deres relative placering (absolut tid, nr. event i takten, og ikke mm eller pixels).
Alle variable er erstattet af deres værdi.
Alle faste fortegn, metre m.m. er dubleret i hvert system, de er knyttet til.
Alle noder er placeret på linjenummer i stedet for absolut tone.
Alle hjælpelinjer er beregnet.
Nodehoveder på modsat side af halsen er beregnet (displacement).
Alle løse fortegn er beregnet efter gældende regler.
Alle tekster er delt ud på stavelser, og evt. bindestreger er angivet.
*/

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
    accidental: VAccidental;
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
