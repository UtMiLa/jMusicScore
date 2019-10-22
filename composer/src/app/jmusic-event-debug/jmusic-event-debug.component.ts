import { Component, OnInit, Input } from '@angular/core';
import { IEventInfo, IGlobalContext } from '../../../../jMusic/model/jm-model-interfaces';

@Component({
  selector: 'app-jmusic-event-debug',
  templateUrl: './jmusic-event-debug.component.html',
  styleUrls: ['./jmusic-event-debug.component.scss']
})
export class JmusicEventDebugComponent implements OnInit {

  constructor() { }

  @Input()
  event: IEventInfo;

  @Input()
  globalContext: IGlobalContext;

  // theScore: IScore;
  // theScoreMemento: string;
  // _memento: IMemento;

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
  }

}
