/// <reference path="jMusicScore.d.ts" />
/// <reference path="application.d.ts" />
/// <reference path="jMusicScore.UI.d.ts" />
/// <reference path="jMusicScore.Spacing.d.ts" />
/// <reference path="emmentaler.d.ts" />
/// <reference path="commands.d.ts" />
declare module JMusicScore {
    module Lilypond {
        class LilypondWriter implements Application.IWriterPlugIn<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery> {
            constructor();
            private app;
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
            getFormats(): string[];
            supports(type: string): boolean;
            getExtension(type: string): string;
            save(): string;
            private getAsLilypond();
            private getClefAsLilypond(clef);
            private getEventsAsLilypond(voice);
            private getNoteAsLilypond(note);
        }
        class LilypondPlugin implements ScoreApplication.IScorePlugin {
            constructor();
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
    }
}
