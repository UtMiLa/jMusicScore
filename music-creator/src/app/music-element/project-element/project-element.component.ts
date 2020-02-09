import { Component, OnInit, Input } from '@angular/core';
import { IProject } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-project-element',
  templateUrl: './project-element.component.html',
  styleUrls: ['./project-element.component.scss']
})
export class ProjectElementComponent implements OnInit {

  constructor() { }

  @Input()
  element: IProject;

  ngOnInit() {
  }

}
