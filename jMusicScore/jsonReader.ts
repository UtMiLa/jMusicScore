module JMusicScore {
    export module Model {

        class JsonReader implements Application.IReaderPlugIn<ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            init(app: ScoreApplication.IScoreApplication) {
                this.app = app;
            }

            private app: ScoreApplication.IScoreApplication;

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
                
                this.app.document = <IScore>MusicElementFactory.recreateElement(null, data); // memento format                
            }
        }


        export class JsonPlugin implements ScoreApplication.IScorePlugin {
            constructor() {
            }

            public init(app: ScoreApplication.IScoreApplication) {
                app.addReader(new JsonReader());
                app.addWriter(new JsonWriter())
            }

            getId() {
                return "JsonPlugin";
            }
        }

        class JsonWriter implements Application.IWriterPlugIn<ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            private app: ScoreApplication.IScoreApplication;

            init(app: ScoreApplication.IScoreApplication) { this.app = app; }

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