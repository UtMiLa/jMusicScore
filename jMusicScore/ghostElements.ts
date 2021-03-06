﻿//module JMusicScore {
    import {Model} from "./jMusicScore";
    //import {Commands} from "./commands";
    import { ScoreApplication } from "./jMusicScore.Application";
    import {Validators} from "./validators";
    //import {UI} from "../jApps/Japps.ui";
//    import {FinaleUi} from "./FinaleEmulator";
    
    export module GhostElements {
        
        export class GhostMeterElement extends Model.MusicElement<Model.IMeterSpacingInfo> implements Model.IMeter {
            constructor(public parent: Model.IMusicElement, private originElement: Model.IMeter) {
                super(parent);
            }

            public get absTime(): Model.AbsoluteTime { return this.originElement.absTime; }
            public get definition(): Model.IMeterDefinition { return this.originElement.definition; }

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

            public nextBoundary(abstime: Model.AbsoluteTime): Model.AbsoluteTime {
                return this.originElement.nextBoundary(abstime);
            }

            public nextBar(abstime: Model.AbsoluteTime): Model.AbsoluteTime {
                return this.originElement.nextBar(abstime);
            }
            public inviteVisitor(spacer: Model.IVisitor) {
                spacer.visitMeter(this, this.spacingInfo);
            }
            getHorizPosition(): Model.HorizPosition { return this.originElement.getHorizPosition(); }
            getVoice(): Model.IVoice { return null; }
            getStaff(): Model.IStaff { return null; } // finde parent?
        }

        //export class GhostVoiceElement { }

        export class GhostsValidator implements Validators.IScoreValidator {
            private addGhostMeter(staff: Model.IStaff, meter: Model.IMeter) {
                // tjek om der er ghostMeter til denne kombination af meter og staff
                var ghostMeter = new GhostMeterElement(staff, meter);
                //staff.setMeter(meter.num, meter.denum, meter.absTime);
                staff.addChild(staff.meterElements, ghostMeter);
            }

            public validate(app: ScoreApplication.IScoreApplication) {

                app.document.withStaves((staff: Model.IStaff, index: number): void => {

                    // First time:
                    if (!staff.meterElements.length) {
                        app.document.withMeters((meter: Model.IMeter, index: number) => {
                            this.addGhostMeter(staff, meter);
                        });
                    }

                    // todo: Register changes:
                    app.document.withMeters((scoreMeter: Model.IMeter, index: number) => {
                        // tjek om der er ghostMeter til denne kombination af meter og staff
                        var found = false;
                        staff.withMeters((staffMeter: Model.IMeter, index: number) => {
                            //if ((<any>staffMeter).originElement && (<any>staffMeter).originElement === scoreMeter) {
                            if (staffMeter.absTime.eq(scoreMeter.absTime)) {
                                found = true;
                            }
                        });
                        if (!found) {
                            this.addGhostMeter(staff, scoreMeter);
                        }
                    });

                    staff.withMeters((staffMeter: Model.IMeter, index: number) => {
                        // tjek om meterElm er ghostMeter og mangler tilhørende score.meter
                        if ((<any>staffMeter).originElement) {
                            var origin = (<any>staffMeter).originElement;
                            if (app.document.meterElements.indexOf(origin) === -1) {
                                // remove ghost
                                staff.removeChild(staffMeter, staff.meterElements);
                            }
                        }
                    });
                });
            }
        }

    }
//}