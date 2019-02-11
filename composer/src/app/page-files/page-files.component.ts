import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';

@Component({
  selector: 'app-page-files',
  templateUrl: './page-files.component.html',
  styleUrls: ['./page-files.component.css']
})
export class PageFilesComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  selectedFile = null;
  editedText = 'Demo';
  fileName = 'fileName';
  model: IModel;

  modelText: string;

  filelist = [
    {name: 'File1', selected: false},
    {name: 'File2', selected: true},
  ];

  ngOnInit() {
    this.updateFileNames();
    this.model = this.musicProvider.constRes;
    this.editedText = JSON.stringify(this.model);
  }

  updateFileNames() {
    this.musicProvider.fileCenter.getFileList('local storage', (data: string[]) => {
      this.filelist = data.map((s: string) => ({name: s, selected: false}) );
    });
  }

  select(file: {name: string}) {
    this.selectedFile = file;
    this.musicProvider.fileCenter.loadString(file.name, 'local storage', (data: string, name: string) => {
      this.fileName = name;
      this.editedText = data;
    });
  }

  saveFile() {
    // alert(this.editedText);
    this.musicProvider.fileCenter.saveString(this.fileName, 'local storage', this.editedText);
    this.updateFileNames();
  }

}
