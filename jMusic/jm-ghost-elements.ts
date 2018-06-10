import {MusicElement, IMusicElement, IMeterSpacingInfo, IMeterDefinition, IMeter, AbsoluteTime,
    IVisitor, HorizPosition, IVoice, IStaff, IScore } from "./jm-model";
import { IScoreRefiner } from "./jm-interfaces";

        export class GhostMeterElement extends MusicElement<IMeterSpacingInfo> implements IMeter {
            constructor(public parent: IMusicElement, private originElement: IMeter) {
                super(parent);
            }

            public get absTime(): AbsoluteTime { return this.originElement.absTime; }
            public get definition(): IMeterDefinition { return this.originElement.definition; }

            public getSortOrder() {
                return this.absTime ? 90 : 50;
            }

            public getElementName() { return "Meter"; }
            public debug() {
                return this.originElement.debug();
            }

            public getMeasureTime() {
                return this.originElement.getMeasureTime();
            }

            public nextBoundary(abstime: AbsoluteTime): AbsoluteTime {
                return this.originElement.nextBoundary(abstime);
            }

            public nextBar(abstime: AbsoluteTime): AbsoluteTime {
                return this.originElement.nextBar(abstime);
            }
            public inviteVisitor(spacer: IVisitor) {
                spacer.visitMeter(this, this.spacingInfo);
            }
            getHorizPosition(): HorizPosition { return this.originElement.getHorizPosition(); }
            getVoice(): IVoice { return null; }
            getStaff(): IStaff { return null; } // finde parent?
        }

        export class GhostsValidator implements IScoreRefiner {
            private addGhostMeter(staff: IStaff, meter: IMeter) {
                // tjek om der er ghostMeter til denne kombination af meter og staff
                var ghostMeter = new GhostMeterElement(staff, meter);
                //staff.setMeter(meter.num, meter.denum, meter.absTime);
                staff.addChild(staff.meterElements, ghostMeter);
            }

            public refine(document: IScore) {

                document.withStaves((staff: IStaff, index: number): void => {

                    // First time:
                    if (!staff.meterElements.length) {
                        document.withMeters((meter: IMeter, index: number) => {
                            this.addGhostMeter(staff, meter);
                        });
                    }

                    // todo: Register changes:
                    document.withMeters((scoreMeter: IMeter, index: number) => {
                        // tjek om der er ghostMeter til denne kombination af meter og staff
                        var found = false;
                        staff.withMeters((staffMeter: IMeter, index: number) => {
                            //if ((<any>staffMeter).originElement && (<any>staffMeter).originElement === scoreMeter) {
                            if (staffMeter.absTime.eq(scoreMeter.absTime)) {
                                found = true;
                            }
                        });
                        if (!found) {
                            this.addGhostMeter(staff, scoreMeter);
                        }
                    });

                    staff.withMeters((staffMeter: IMeter, index: number) => {
                        // tjek om meterElm er ghostMeter og mangler tilhørende score.meter
                        if ((<any>staffMeter).originElement) {
                            var origin = (<any>staffMeter).originElement;
                            if (document.meterElements.indexOf(origin) === -1) {
                                // remove ghost
                                staff.removeChild(staffMeter, staff.meterElements);
                            }
                        }
                    });
                });
            }
        }
