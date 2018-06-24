import { Component, OnInit, Input } from '@angular/core';
import { ISectionsDef } from '../datamodel/model';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css']
})
export class SectionListComponent implements OnInit {

  constructor() { }

  @Input() sections: ISectionsDef;

  ngOnInit() {
  }

}
