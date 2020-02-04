import { Component, OnInit } from '@angular/core';
import { ProjectIoService } from 'src/app/project-io.service';
import { IProject } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(private ioService: ProjectIoService) { }

  project: IProject;

  ngOnInit() {
    this.ioService.loadProject().subscribe(data => this.project = data);
  }

}
