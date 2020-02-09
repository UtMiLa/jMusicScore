import { Component, OnInit, Input } from '@angular/core';
import { ISequence } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { ISelectionInterface, SelectionService } from '../selection.service';
import { SelectableElementComponent } from '../selectable-element/selectable-element.component';

@Component({
  selector: 'app-sequence-element',
  templateUrl: './sequence-element.component.html',
  styleUrls: ['./sequence-element.component.scss']
})
export class SequenceElementComponent extends SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) {
    super(selectionService);
   }


  @Input()
  element: ISequence & ISelectionInterface;

  ngOnInit() {
    super.ngOnInit();
  }

}
