import { Component, OnInit, Input } from '@angular/core';
import { IEventInfo, IGlobalContext } from '../../../../jMusic/model/jm-model-interfaces';
import { JmusicSelectionService, ISelectionInterface } from '../jmusic-selection.service';

@Component({
  selector: 'app-jmusic-event-debug',
  templateUrl: './jmusic-event-debug.component.html',
  styleUrls: ['./jmusic-event-debug.component.scss']
})
export class JmusicEventDebugComponent implements OnInit {

  constructor(private selectionService: JmusicSelectionService) { }

  @Input()
  event: IEventInfo;

  @Input()
  globalContext: IGlobalContext;

  selected: boolean = false;

  theFunction(event) {
    if (!this.globalContext) { return '[NO globalContext]'; }
    if (!event.id) { return '[NO id]'; }
    const obj = this.globalContext.getSpacingInfo(event);
    if (!obj) { return '[NONE]'; }
    // obj = event;
    return JSON.stringify(obj, function(k, v) {
      if (k === 'source') { return null; }
      if (k === 'parent') { return null; }
      return v;
    });
   }

  ngOnInit() {
    this.selectionService.selectionChange.subscribe((selection: ISelectionInterface) => {
      if (!selection) {
        this.selected = false;
      } else {
        this.selected = selection.element === this.event;
        (<any>this.event).selected = this.selected;
        // if (this.selected) {console.log("selectionchange: ", selection, this.selected);}
      }
    });
  }

  selectThis() {
    this.selectionService.selection = { element: this.event, text:  this.event.source.debug() + ' - ' + this.theFunction(this.event) };
  }

}
