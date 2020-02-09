import { Component, OnInit, Input } from '@angular/core';
import { IStaff } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { SelectableElementComponent } from '../selectable-element/selectable-element.component';
import { ISelectionInterface, SelectionService } from '../selection.service';

@Component({
  selector: 'app-staff-element',
  templateUrl: './staff-element.component.html',
  styleUrls: ['./staff-element.component.scss']
})
export class StaffElementComponent extends SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) {
    super(selectionService);
   }

  // tslint:disable-next-line:no-input-rename
  @Input()
  element: IStaff & ISelectionInterface;

  ngOnInit() {
    super.ngOnInit();
  }

}
