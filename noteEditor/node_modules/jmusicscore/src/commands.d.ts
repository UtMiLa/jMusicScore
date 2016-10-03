declare module JMusicScore {
    module Model {
        class MacroExporter {
            static makeMacro(cmd: {
                args: {};
            }): {
                commandName: string;
                args: {};
            };
            static exportString(s: string): string;
            static exportPitch(pitch: Pitch): string;
            static exportTimespan(timespan: TimeSpan): string;
            static exportTime(time: AbsoluteTime): string;
            static exportRational(rat: Rational): string;
            static exportTuplet(tupletDef: TupletDef): any;
            static exportArgs(args: {}): {};
            static exportMusicElm(elm: Model.IMusicElement): string;
            static exportArg(arg: any): string;
        }
        interface IScoreCommand extends Application.ICommand<IScore, ScoreApplication.ScoreStatusManager, JQuery> {
        }
        interface IMacroCommand {
            commandName: string;
            args: {};
        }
        class BundleCommand implements IScoreCommand {
            constructor(commands: IScoreCommand[]);
            private commands;
            add(cmd: IScoreCommand): void;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo: (app: ScoreApplication.IScoreApplication) => void;
        }
        class ClearScoreCommand implements IScoreCommand {
            private args;
            constructor(args: any);
            private memento;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        interface IAddNoteArgs {
            noteName: string;
            noteTime: TimeSpan;
            rest: boolean;
            dots: number;
            grace: boolean;
            pitches: Pitch[];
            voice: IVoice;
            absTime: AbsoluteTime;
            beforeNote?: INote;
            tuplet?: TupletDef;
        }
        class AddNoteCommand implements IScoreCommand {
            private args;
            constructor(args: IAddNoteArgs);
            private note;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        interface IDeleteNoteArgs {
            note: INote;
        }
        class DeleteNoteCommand implements IScoreCommand {
            private args;
            constructor(args: IDeleteNoteArgs);
            private memento;
            private voice;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class DeleteNoteheadCommand implements IScoreCommand {
            private args;
            constructor(args: {
                head: INotehead;
            });
            private memento;
            private note;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class SetVoiceStemDirectionCommand implements IScoreCommand {
            private args;
            constructor(args: {
                voice: IVoice;
                direction: StemDirectionType;
            });
            private oldDirection;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class SetNoteStemDirectionCommand implements IScoreCommand {
            private args;
            constructor(args: {
                note: INote;
                direction: any;
            });
            private oldDirection;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        interface INoteDurationArgs {
            note: INote;
            noteId: string;
            timeVal: TimeSpan;
            dots: number;
            tuplet?: TupletDef;
        }
        class SetNoteDurationCommand implements IScoreCommand {
            private args;
            constructor(args: INoteDurationArgs);
            private oldDuration;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class AddNoteheadCommand implements IScoreCommand {
            private args;
            constructor(args: {
                note: INote;
                pitch: Pitch;
            });
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class RemoveNoteheadCommand implements IScoreCommand {
            private args;
            constructor(args: {
                head: INotehead;
            });
            private head;
            private note;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        interface ISetPitchCommand {
            head: INotehead;
            pitch: Pitch;
        }
        class SetPitchCommand implements IScoreCommand {
            private args;
            constructor(args: ISetPitchCommand);
            private oldPitch;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class RaisePitchAlterationCommand implements IScoreCommand {
            private args;
            constructor(args: {
                head: INotehead;
                absAlteration?: string;
                deltaAlteration?: number;
            });
            private oldAlteration;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class AddNoteDecorationCommand implements IScoreCommand {
            private args;
            constructor(args: {
                note: INote;
                expression: NoteDecorationKind;
                placement: string;
            });
            private theDeco;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class UpdateStaffCommand implements IScoreCommand {
            private args;
            constructor(args: {
                staff: IStaff;
                index: number;
                title: string;
                initClef?: ClefDefinition;
            });
            private oldIndex;
            private oldTitle;
            private oldClef;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class NewStaffCommand implements IScoreCommand {
            private args;
            constructor(args: {
                index: number;
                title: string;
                initClef: ClefDefinition;
            });
            private theStaff;
            execute(app: ScoreApplication.IScoreApplication): void;
            undo(app: ScoreApplication.IScoreApplication): void;
        }
        class TieNoteheadCommand implements IScoreCommand {
            private args;
            constructor(args: {
                head: INotehead;
                forced?: boolean;
                remove?: boolean;
                toggle: boolean;
            });
            execute(app: ScoreApplication.IScoreApplication): void;
        }
        class TieNoteCommand implements IScoreCommand {
            private args;
            constructor(args: {
                note: INote;
                forced?: boolean;
                remove?: boolean;
                toggle: boolean;
            });
            execute(app: ScoreApplication.IScoreApplication): void;
        }
        class SetMeterCommand implements IScoreCommand {
            private args;
            constructor(args: any);
            execute(app: ScoreApplication.IScoreApplication): void;
        }
        class SetKeyCommand implements IScoreCommand {
            private args;
            constructor(args: {
                key: IKeyDefinition;
                absTime: AbsoluteTime;
                staff?: IStaff;
            });
            execute(app: ScoreApplication.IScoreApplication): void;
        }
        class SetClefCommand implements IScoreCommand {
            private args;
            constructor(args: {
                clef: ClefDefinition;
                absTime: AbsoluteTime;
                staff: IStaff;
            });
            execute(app: ScoreApplication.IScoreApplication): void;
        }
    }
}
