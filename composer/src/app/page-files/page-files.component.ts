import { Component, OnInit } from '@angular/core';
import {IO} from '../../../../jApps/Browser/jApps.BrowserFileSystem';

@Component({
  selector: 'app-page-files',
  templateUrl: './page-files.component.html',
  styleUrls: ['./page-files.component.css']
})
export class PageFilesComponent implements OnInit {

  constructor() { }

  selectedFile = null;
  editedText = 'Demo';
  fileName = 'fileName';
  fileSystem: any;//IO.LocalStorageFileManager;

  filelist = [
    {name: 'File1', selected: false},
    {name: 'File2', selected: true},
  ];

  ngOnInit() {
    this.fileSystem = new IO.LocalStorageFileManager('local storage');
    this.updateFileNames();
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
    this.fileSystem.saveFile(this.fileName, this.editedText);
    this.updateFileNames();
  }

}
