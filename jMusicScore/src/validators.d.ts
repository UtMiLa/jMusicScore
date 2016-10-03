declare module JMusicScore {
    module Model {
        interface IScoreValidator extends Application.IValidator<IScore, ScoreApplication.ScoreStatusManager, JQuery> {
        }
        class UpdateBarsValidator implements IScoreValidator {
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class CreateTimelineValidator implements IScoreValidator {
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class UpdateAccidentalsValidator implements IScoreValidator {
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class JoinNotesValidator implements IScoreValidator {
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class SplitNotesValidator implements IScoreValidator {
            static bestNoteValues(time: TimeSpan): Array<TimeSpan>;
            private splitNote(note, nextAbsTime);
            validate(app: ScoreApplication.IScoreApplication): void;
        }
        class BeamValidator implements IScoreValidator {
            validate(app: ScoreApplication.IScoreApplication): void;
            private validateVoice(voice);
            private checkSyncopeBeaming(voice);
            private updateBeams(voice);
        }
        class TieValidator implements IScoreValidator {
            validate(app: ScoreApplication.IScoreApplication): void;
            private validateVoice(voice);
        }
    }
}
