
export interface IVoiceDef {
    voices: string[];
    sections: string[];
};

export interface IVarList {
    [name: string]: string;
};
export interface IStaffDef {
    context: string;
    content: string;
    instrument?: string;
};
export interface ISectionDef {
    voices: IVarList;
    // section metadata
};
export interface ISectionsDef {
    [name: string]: ISectionDef;
};

export interface IModel {
    voices: IVoiceDef;
    scales?: IVarList;
    variables: IVarList;
    sections: ISectionsDef;
    score: IStaffDef[];
};