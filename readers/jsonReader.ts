module jMusicScore {
    export module Model {

        class JSONReader implements Application.IReaderPlugIn {
            Init(app: Application.Application) {
                this.app = app;
            }

            private app: Application.Application;
            /*private typeMapObjects: { [Index: string]: any } = {
                // Arrays af objekter:
                "pitch": Model.Pitch,
                "absTime": Model.AbsoluteTime,
                "timeVal": Model.TimeSpan
            };
            private typeMapArrays = Model.Music.getTypeMapping();
        */

            GetFormats(): string[] {
                return [
                    "JSON"
                ]
            }

            GetId(): string {
                return "JSONReader";
            }

            public Supports(type: string): boolean {
                return type === "JSON";
            }

            GetExtension(type: string): string {
                return "json";
            }

            public Load(data: any) {
                if (typeof (data) === "string") {
                    data = JSON.parse(data);
                }
                var score = this.app.score;
                while (score.staffElements.length)
                    score.removeChild(score.staffElements[0], score.staffElements);
                /*if (data.staffElements) {
                    this.updateElement(this.app.score, data); // old json format - deprecated
                }
                else*/ {
                    this.app.score = <Model.IScore>Model.MusicElementFactory.RecreateElement(null, data); // memento format
                }
            }
            /*
            private updateElement(musicElement: IMusicElement, init: any) {
                for (var key in init) {
                    if (key === "id") { 
                        // ignore
                    }
                    else
                        if (init[key] instanceof Array) {
                            
                        if (key in this.typeMapArrays) {
                            var cls = this.typeMapArrays[key];
                            for (var i = 0; i < init[key].length; i++) {
                                if (init[key][i]) {
                                    var obj: any = new cls;
                                    obj.parent = musicElement;
                                    this.updateElement(obj, init[key][i]);
                                    musicElement.addChild((<any>musicElement)[key], obj);
                                }
                            }
                        }
                        else if (key === "absTime") {
                            (<any>musicElement)[key] = new Model.AbsoluteTime(init[key][0], init[key][1]).Reduce();
                        }
                        else if (key === "timeVal") {
                            (<any>musicElement)[key] = new Model.TimeSpan(init[key][0], init[key][1]).Reduce();
                        }
                        else if (key === "definition") {
                            if (musicElement.getElementName() === "Meter") {
                                (<any>musicElement)[key] = new Model.RegularMeterDefinition(init[key][0], init[key][1]);
                            }
                            else if (musicElement.getElementName() === "Key") {
                                (<any>musicElement)[key] = new Model.RegularKeyDefinition(init[key][0], init[key][1]);
                            }
                            else if (musicElement.getElementName() === "Clef") {
                                (<any>musicElement)[key] = new Model.ClefDefinition(init[key][0], init[key][1], init[key][2]);
                            }
                        }
                    }
                    else if (init[key] instanceof Object) {
                        if (key in this.typeMapObjects) {
                            var cls = this.typeMapObjects[key];
                            var obj = new cls;
                            this.updateElement(obj, init[key]);
                            (<any>musicElement)[key] = obj;
                        }
                        else if (key === 'definition') {
                            if (init[key].acci) {
                                (<any>musicElement)[key] = new Model.RegularKeyDefinition(init[key].acci, init[key].number);
                            }
                            else if (init[key].clefCode) {
                                (<any>musicElement)[key] = new Model.ClefDefinition(init[key].clefCode, init[key].clefLine);
                                this.updateElement((<any>musicElement)[key], init[key]);
                            }
                            else {
                                (<any>musicElement)[key] = new Model.RegularMeterDefinition(init[key].numerator, init[key].denominator);
                            }
                        }                 }
                    else if (key === "absTime") {
                        (<any>musicElement)[key] = new Model.AbsoluteTime(init[key], 256).Reduce();
                    }
                    else if (key === "timeVal") {
                        (<any>musicElement)[key] = new Model.TimeSpan(init[key], 256).Reduce();
                    }
                    else {
                        (<any>musicElement)[key] = init[key];
                    }
                }
            }*/
        }


        export class JsonPlugin implements Application.IPlugIn {
            constructor() {
            }

            public Init(app: Application.Application) {
                app.AddReader(new JSONReader());
                app.AddWriter(new JSONWriter())
            }

            GetId() {
                return "JsonPlugin";
            }
        }

        class JSONWriter implements Application.IWriterPlugIn {
            private app: Application.Application;

            Init(app: Application.Application) { this.app = app; }

            GetId(): string {
                return "JSONReader";
            }


            GetFormats(): string[] {
                return [
                    "JSON"
                ]
            }

            public Supports(type: string): boolean {
                return type === "JSON";
            }

            GetExtension(type: string): string {
                return "json";
            }

            public Save() {
                var seen: any[] = [];
                var text = JSON.stringify(this.app.score.getMemento());
                /*var text = JSON.stringify(this.app.score, function (key: string, val: any) {
                    if (typeof val == "object") {
                        if (key == "outputViews") return undefined;
                        if (val && val.originElement) return undefined;
                        if (key == "displayData") return undefined;
                        if (key == "spacingInfo") return undefined;
                        if (key == "_spacingInfo") return undefined;
                        if (key == "properties") return undefined;
                        if (key == "application") return undefined;
                        if (key == "beams") return undefined;
                        if (key == "parent") return undefined;
                        if (key == "childLists") return undefined;
                        if (seen.indexOf(val) >= 0)
                            return "UNDEF_REF";
                        seen.push(val)
						}
                    return val;
                }, 4);*/

                return text;
            }
        }
        
    }
}