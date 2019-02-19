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
  fileManager = 'Server';

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
    this.musicProvider.fileCenter.getFileList(this.fileManager, (data: string[]) => {
      this.filelist = data.map((s: string) => ({name: s, selected: false}) );
    });
  }

  select(file: {name: string}) {
    this.selectedFile = file;
    this.musicProvider.fileCenter.loadString(file.name, this.fileManager, (data: any, name: string) => {
      this.fileName = name;
      this.editedText = JSON.stringify(data);
      this.musicProvider.constRes = data;
    });
  }

  saveFile() {
    this.musicProvider.fileCenter.saveString(this.fileName, this.fileManager, this.editedText);
    this.updateFileNames();
  }

  changeFileManager() {
    this.updateFileNames();
  }

}
