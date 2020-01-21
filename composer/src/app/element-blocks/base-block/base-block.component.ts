import { Component, OnInit, Input } from '@angular/core';
import { IMusicElement } from '../../../../../jMusic/model/jm-model-interfaces';

@Component({
  selector: 'app-base-block',
  templateUrl: './base-block.component.html',
  styleUrls: ['./base-block.component.scss']
})
export class BaseBlockComponent implements OnInit {

  constructor() { }

  @Input()
  element: any;


  ngOnInit() {
  }

}
