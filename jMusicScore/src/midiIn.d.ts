declare module JMusicScore {
    module Editors {
        class MidiHelper {
            private eventReceiver;
            constructor(eventReceiver: Application.IEventReceiver);
            private trigger(eventtype, event);
            private midiProc(t, a, b, c);
            private jazz;
            private midiInVars;
            midiOpen(newMidiIn: any): any;
            midiSend(arg2: {
                code: number;
                a1: number;
                a2: number;
            }): void;
            midiClose(): void;
            midiInList(): string[];
            releaseKey(arg: number): void;
            pressKey(arg: number): void;
            currentIn: string;
            keysPressed: number[];
        }
        class MidiInputPlugin implements ScoreApplication.IScorePlugin {
            private static _midiHelper;
            static getMidiHelper(app: Application.IEventReceiver): MidiHelper;
            private midiChannel;
            private midiHelper;
            setMidiChannel(val: string): void;
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
    }
}
