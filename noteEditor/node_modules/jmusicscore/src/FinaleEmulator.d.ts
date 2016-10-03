declare module JMusicScore {
    module FinaleUi {
        class FinaleSmartEditPlugin implements ScoreApplication.IScorePlugin {
            init(app: ScoreApplication.IScoreApplication): void;
            private smartEdit;
            getId(): string;
        }
        class FinaleSpeedyEntry implements ScoreApplication.IScoreEventProcessor {
            private noteVals;
            init(app: ScoreApplication.IScoreApplication): void;
            exit(app: ScoreApplication.IScoreApplication): void;
            keymessage(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            keyPressed(app: ScoreApplication.IScoreApplication, key: string): boolean;
        }
    }
}
