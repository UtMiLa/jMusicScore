import { Component, OnInit, Input } from '@angular/core';
import { ITimedEvent } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { SelectableElementComponent } from '../selectable-element/selectable-element.component';
import { ISelectionInterface, SelectionService, ElementKind } from '../selection.service';

@Component({
  selector: 'app-event-element',
  templateUrl: './event-element.component.html',
  styleUrls: ['./event-element.component.scss']
})
export class EventElementComponent extends SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) {
    super(selectionService);
   }


  @Input()
  element: ITimedEvent & ISelectionInterface;

  getKind(): ElementKind {
    return ElementKind.Note;
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
