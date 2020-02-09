import { Component, OnInit } from '@angular/core';
import { SelectionService, ISelectionInterface } from '../selection.service';

@Component({
  selector: 'app-selectable-element',
  templateUrl: './selectable-element.component.html',
  styleUrls: ['./selectable-element.component.scss']
})
export class SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) { }

  element: ISelectionInterface;
  
  selected: boolean = false;

  ngOnInit() {
    this.selectionService.selectionChange.subscribe((selection: ISelectionInterface) => {
      console.log("selectionchange: ", selection, this.selected);
      if (!selection) {
        this.selected = false;
      } else {
        this.selected = selection.element === this.element;
        (this.element as any).selected = this.selected;
        if (this.selected) {console.log("selectionchange: ", selection, this.selected);}
      }
    });
  }
  
  selectThis($event) {
    this.selectionService.selection = { element: this.element, text: JSON.stringify(this.element) };
    $event.stopPropagation();
  }

}
