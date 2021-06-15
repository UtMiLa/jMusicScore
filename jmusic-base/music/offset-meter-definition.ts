import { AbsoluteTime } from "../time/absolute-time";
import { TimeSpan } from "../time/time-span";
import { IMeterDefinition } from "./meter-definition";
import { RegularMeterDefinition } from "./regular-meter-definition";

    /**
    * Like regular meter definition, but with upbeat
    */
     export class OffsetMeterDefinition extends RegularMeterDefinition {
        constructor(public numerator: number, public denominator: number, public offset: TimeSpan) {
            super(numerator, denominator);
        }
    
        public nextBoundary(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
            return super.nextBoundary(abstime.sub(this.offset), meterTime).add(this.offset);
        }
    
        public nextBar(abstime: AbsoluteTime, meterTime: AbsoluteTime): AbsoluteTime {
            return super.nextBar(abstime.sub(this.offset), meterTime).add(this.offset);
        }
        static createFromMemento(memento: any): IMeterDefinition {
            var offset = TimeSpan.createFromMemento(memento.offs);
            return new OffsetMeterDefinition(memento.num, memento.den, offset);
        }
        public getMemento(): any {
            return {
                t: "OffsetRegular",
                num: this.numerator,
                den: this.denominator,
                offs: this.offset.getMemento()
            }
        }
    }
    