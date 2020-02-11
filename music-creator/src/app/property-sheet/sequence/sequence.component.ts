import { Component, OnInit, Input } from '@angular/core';
import { ISequence } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnInit {

  constructor() { }

  @Input()
  element: ISequence;

  ngOnInit() {
  }

}
