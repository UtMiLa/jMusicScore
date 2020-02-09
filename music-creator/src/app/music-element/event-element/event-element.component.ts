import { Component, OnInit, Input } from '@angular/core';
import { ITimedEvent } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-event-element',
  templateUrl: './event-element.component.html',
  styleUrls: ['./event-element.component.scss']
})
export class EventElementComponent implements OnInit {

  constructor() { }

  @Input()
  event: ITimedEvent;

  ngOnInit() {
  }

}
