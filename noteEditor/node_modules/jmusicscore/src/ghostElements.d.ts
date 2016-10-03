declare module JMusicScore {
    module GhostElements {
        class GhostMeterElement extends Model.MusicElement<Model.IMeterSpacingInfo> implements Model.IMeter {
            parent: Model.IMusicElement;
            private originElement;
            constructor(parent: Model.IMusicElement, originElement: Model.IMeter);
            absTime: Model.AbsoluteTime;
            definition: Model.IMeterDefinition;
            getSortOrder(): number;
            getElementName(): string;
            debug(): string;
            getMeasureTime(): Model.TimeSpan;
            nextBoundary(abstime: Model.AbsoluteTime): Model.AbsoluteTime;
            nextBar(abstime: Model.AbsoluteTime): Model.AbsoluteTime;
            inviteVisitor(spacer: Model.IVisitor): void;
            getHorizPosition(): Model.HorizPosition;
            getVoice(): Model.IVoice;
            getStaff(): Model.IStaff;
        }
        class GhostsValidator implements Model.IScoreValidator {
            private addGhostMeter(staff, meter);
            validate(app: ScoreApplication.IScoreApplication): void;
        }
    }
}
