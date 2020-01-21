import { EventEmitter, Injectable, Output } from '@angular/core';
import { MusicElement } from '../../../jMusic/model/jm-model-base';
import { IMusicElement } from '../../../jMusic/model/jm-model-interfaces';
import { Observable } from 'rxjs';


export interface ISelectionInterface {
  element: any;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class JmusicSelectionService {

  constructor() { }

  _selection: ISelectionInterface;

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
