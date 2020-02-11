import { Component, OnInit, Input } from '@angular/core';
import { IKey } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  constructor() { }

  @Input()
  element: IKey;

  ngOnInit() {
  }

}
