import { Component, OnInit, Input } from '@angular/core';
import { ISequence } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-sequence-element',
  templateUrl: './sequence-element.component.html',
  styleUrls: ['./sequence-element.component.scss']
})
export class SequenceElementComponent implements OnInit {

  constructor() { }

  @Input()
  sequence: ISequence;

  ngOnInit() {
  }

}
