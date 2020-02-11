import { Injectable, EventEmitter } from '@angular/core';

export enum ElementKind {Project, Score, Staff, Section, Voice, Sequence, Note, Key, Clef, Meter, StaffExpression, 
  ScoreExpression, NoteExpression };

export interface ISelectionInterface {
  element: any;
  text: string;
  kind: ElementKind;
}


@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  private _selection: ISelectionInterface;

  set selection(value: ISelectionInterface) {
    if (this._selection !== value) {
      if (this._selection && value && this._selection.element === value.element) { return; }
      this._selection = value;
      this.selectionChange.next(value);
    }
  }

  get selection(): ISelectionInterface {
    return this._selection;
  }


  public selectionChange = new EventEmitter<ISelectionInterface>();

}
