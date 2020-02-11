import { Component, OnInit, Input } from '@angular/core';
import { ISection } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  constructor() { }

  @Input()
  element: ISection;

  ngOnInit() {
  }

}
