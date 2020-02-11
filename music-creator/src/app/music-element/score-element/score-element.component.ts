import { Component, OnInit, Input } from '@angular/core';
import { IScore } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { ISelectionInterface, SelectionService, ElementKind } from '../selection.service';
import { SelectableElementComponent } from '../selectable-element/selectable-element.component';

@Component({
  selector: 'app-score-element',
  templateUrl: './score-element.component.html',
  styleUrls: ['./score-element.component.scss']
})
export class ScoreElementComponent extends SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) {
    super(selectionService);
   }


  @Input()
  element: IScore & ISelectionInterface;

  getKind(): ElementKind {
    return ElementKind.Note;
  }


  ngOnInit() {
    super.ngOnInit();
  }

}
