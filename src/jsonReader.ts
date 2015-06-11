module JMusicScore {
    export module Model {

        class JsonReader implements Application.IReaderPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            init(app: ScoreApplication.ScoreApplication) {
                this.app = app;
            }

            private app: ScoreApplication.ScoreApplication;

            getFormats(): string[] {
                return [
                    "JSON"
                ]
            }

            getId(): string {
                return "JSONReader";
            }

            public supports(type: string): boolean {
                return type === "JSON";
            }

            getExtension(type: string): string {
                return "json";
            }

            public load(data: any) {
                if (typeof (data) === "string") {
                    data = JSON.parse(data);
                }
                var score = this.app.document;
                while (score.staffElements.length)
                    score.removeChild(score.staffElements[0], score.staffElements);
                
                this.app.document = <Model.IScore>Model.MusicElementFactory.RecreateElement(null, data); // memento format                
            }
        }


        export class JsonPlugin implements ScoreApplication.ScorePlugin {
            constructor() {
            }

            public init(app: ScoreApplication.ScoreApplication) {
                app.AddReader(new JsonReader());
                app.AddWriter(new JsonWriter())
            }

            getId() {
                return "JsonPlugin";
            }
        }

        class JsonWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            private app: ScoreApplication.ScoreApplication;

            init(app: ScoreApplication.ScoreApplication) { this.app = app; }

            getId(): string {
                return "JSONReader";
            }


            getFormats(): string[] {
                return [
                    "JSON"
                ]
            }

            public supports(type: string): boolean {
                return type === "JSON";
            }

            getExtension(type: string): string {
                return "json";
            }

            public save() {
                var seen: any[] = [];
                var text = JSON.stringify(this.app.document.getMemento());
                return text;
            }
        }
        
    }
}