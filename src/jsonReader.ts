module jMusicScore {
    export module Model {

        class JSONReader implements Application.IReaderPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            Init(app: ScoreApplication.ScoreApplication) {
                this.app = app;
            }

            private app: ScoreApplication.ScoreApplication;

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
                var score = this.app.document;
                while (score.staffElements.length)
                    score.removeChild(score.staffElements[0], score.staffElements);
                
                this.app.document = <Model.IScore>Model.MusicElementFactory.RecreateElement(null, data); // memento format                
            }
        }


        export class JsonPlugin implements ScoreApplication.ScorePlugin {
            constructor() {
            }

            public Init(app: ScoreApplication.ScoreApplication) {
                app.AddReader(new JSONReader());
                app.AddWriter(new JSONWriter())
            }

            GetId() {
                return "JsonPlugin";
            }
        }

        class JSONWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            private app: ScoreApplication.ScoreApplication;

            Init(app: ScoreApplication.ScoreApplication) { this.app = app; }

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
                var text = JSON.stringify(this.app.document.getMemento());
                return text;
            }
        }
        
    }
}