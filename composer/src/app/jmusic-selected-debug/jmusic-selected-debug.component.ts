import { Component, OnInit } from '@angular/core';
import { JmusicSelectionService, ISelectionInterface } from '../jmusic-selection.service';

@Component({
  selector: 'app-jmusic-selected-debug',
  templateUrl: './jmusic-selected-debug.component.html',
  styleUrls: ['./jmusic-selected-debug.component.scss']
})
export class JmusicSelectedDebugComponent implements OnInit {

  constructor(private selectionService: JmusicSelectionService) { }

  text = "intet";

  ngOnInit() {
    this.selectionService.selectionChange.subscribe((selection: ISelectionInterface) => {
      this.text = selection.text;
      console.log(this.text);
      /*if (!selection) {
        this.selected = false;
      } else {
        this.selected = selection.element === this.event;
        (<any>this.event).selected = this.selected;
        if (this.selected) {console.log("selectionchange: ", selection, this.selected);}
      }*/
    });
  }

}
