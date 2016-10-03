declare module JMusicScore {
    module Editors {
        class MidiEditor implements ScoreApplication.IScoreEventProcessor {
            init(app: ScoreApplication.IScoreApplication): void;
            exit(app: ScoreApplication.IScoreApplication): void;
            private noCtrl;
            midicontrol(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            midinoteon(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            midinoteoff(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
            midichordreleased(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean;
        }
    }
    module Players {
        class MidiPlayer {
            private midiHelper;
            playAll(app: ScoreApplication.IScoreApplication): void;
            private midiEvents;
            private playNextNote();
            getId(): string;
        }
    }
}
