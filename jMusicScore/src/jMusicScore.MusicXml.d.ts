declare module JMusicScore {
    module MusicXml {
        class MusicXmlWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            constructor();
            private doc;
            private app;
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
            getFormats(): string[];
            supports(type: string): boolean;
            getExtension(type: string): string;
            save(): string;
            getAsXml(): string;
            private smallestDivision;
            private findDivision();
            private addPartList(scorePartwise);
            private addParts(scorePartwise);
            private addMeasures(part, staffElement);
            private addNote(measure, note);
            private addNoteAttributes(noteXml, note, head, chord?);
            private addChildElement(element, tag, text?);
            private addAttributes(measure, staffContext, updateMeter, updateKey, updateClef, first?);
            s(a: any, b?: any, c?: any): HTMLAnchorElement;
        }
        class MusicXmlPlugin implements ScoreApplication.IScorePlugin {
            constructor();
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
    }
}
