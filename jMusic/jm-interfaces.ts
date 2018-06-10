import { IScore } from "./jm-model";

/** Interface for objects that check and refines the model after every change (like beam calculation) */
/*export interface IValidator<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
    validate(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void;
}*/
export interface IScoreRefiner {
    refine(document: IScore): void;
}

export interface IFileConverter {
    read(data: any): IScore;
    write(score: IScore): string;
}
