import { Component, OnInit, Input } from '@angular/core';
import { INote } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { SelectionService, ISelectionInterface, ElementKind } from '../selection.service';
import { SelectableElementComponent } from '../selectable-element/selectable-element.component';

@Component({
  selector: 'app-note-element',
  templateUrl: './note-element.component.html',
  styleUrls: ['./note-element.component.scss']
})
export class NoteElementComponent extends SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) { 
    super(selectionService);
  }

  // tslint:disable-next-line:no-input-rename
  @Input()
  element: INote & ISelectionInterface;

  getKind(): ElementKind {
    return ElementKind.Note;
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
