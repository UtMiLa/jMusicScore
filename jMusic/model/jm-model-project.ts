import { IGlobalContext, ISequence, ISpacingInfo, IMusicElement, IScore } from "./jm-model-interfaces";
import { IMemento } from "../jm-music-basics";


export interface IProjectMemento{
    vars: any[];
    score: IMemento;
}

export class MusicProject implements IGlobalContext{
    private _variables: { [key: string]: ISequence } = {};
    private _spacingInfos: { [key: string]: ISpacingInfo } = {};

    getVariable(name: string): ISequence {
        return this._variables[name];
    }
    addVariable(name: string, value: ISequence) {
        this._variables[name] = value;
    }

    getSpacingInfo<T extends ISpacingInfo>(element: IMusicElement): T {
        //return <T>(<any>element).spacingInfo;
        return <T>this._spacingInfos[element.id];
    }

    addSpacingInfo(element: IMusicElement, value: ISpacingInfo) {
        //(<any>element).spacingInfo = value;
        this._spacingInfos[element.id] = value;
    }

    public score: IScore;

    public getMemento(withChildren: boolean = true): IProjectMemento {
        let vars = [];
        for (var p in Object.getOwnPropertyNames(this._variables)) {
            vars.push({name: p, val: this._variables[p].getMemento()});
        }
        var memento: IProjectMemento = {
            vars: vars,
            score: this.score.getMemento()
        };
        return memento;
    }


    public loadFromMemento(memento: IProjectMemento){

    }


    public clearVariables(){
        this._variables = {};
    }

    public clearScore() {
        this.score = null;
    }

    
    
}