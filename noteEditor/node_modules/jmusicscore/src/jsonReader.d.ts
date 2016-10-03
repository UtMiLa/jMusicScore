declare module JMusicScore {
    module Model {
        class JsonPlugin implements ScoreApplication.IScorePlugin {
            constructor();
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
    }
}
