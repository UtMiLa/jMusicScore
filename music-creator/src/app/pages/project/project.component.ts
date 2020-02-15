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

  files: string[];

  ngOnInit() {
    this.ioService.listProjects().subscribe((list) => this.files = list);
    this.load('project1.mmodel');
  }

  save() {
    this.ioService.saveProject(this.project).subscribe((data) => {console.log(data);});
  }

  load(name: string) {
    this.ioService.loadProject(name).subscribe(data => {
      this.project = data;
      console.log(data);
    });
  }

}
