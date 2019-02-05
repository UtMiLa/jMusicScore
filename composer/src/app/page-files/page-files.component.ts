import { Component, OnInit } from '@angular/core';
import { IO } from '../../../../jApps/Browser/jApps.BrowserFileSystem';
import { Application, IFileManager } from '../../../../jApps/application';
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
  fileSystem: Application.IFileManager;
  model: IModel;

  modelText: string;

  filelist = [
    {name: 'File1', selected: false},
    {name: 'File2', selected: true},
  ];

  ngOnInit() {
    this.fileSystem = new IO.LocalStorageFileManager('local storage');
    this.updateFileNames();
    this.model = this.musicProvider.constRes;
    this.editedText = JSON.stringify(this.model);
  }

  updateFileNames() {
    this.fileSystem.getFileList((data: string[]) => {
      this.filelist = data.map((s: string) => ({name: s, selected: false}) );
    });
  }

  select(file) {
    this.selectedFile = file;
    this.fileSystem.loadFile(file.name, (data: string, name: string) => {
      this.fileName = name;
      this.editedText = data;
    });
  }

  saveFile() {
    // alert(this.editedText);
    this.fileSystem.saveFile(this.fileName, this.editedText, (res: string) => { });
    this.updateFileNames();
  }

}
