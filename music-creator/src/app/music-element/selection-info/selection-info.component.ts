import { Component, OnInit } from '@angular/core';
import { SelectionService, ISelectionInterface } from '../selection.service';

@Component({
  selector: 'app-selection-info',
  templateUrl: './selection-info.component.html',
  styleUrls: ['./selection-info.component.scss']
})
export class SelectionInfoComponent implements OnInit {

  constructor(private selectionService: SelectionService) { }

  
  text = "";

  ngOnInit() {
    this.selectionService.selectionChange.subscribe((selection: ISelectionInterface) => {
      this.text = selection.text;
      //console.log(this.text);
    });
  }

}
