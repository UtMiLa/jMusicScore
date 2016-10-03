declare module JMusicScore {
    module Editors {
        class KeybordInputPlugin implements ScoreApplication.IScorePlugin {
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
    }
}
