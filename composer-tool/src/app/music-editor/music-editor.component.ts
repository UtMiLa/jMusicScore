import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-music-editor',
  templateUrl: './music-editor.component.html',
  styleUrls: ['./music-editor.component.css']
})
export class MusicEditorComponent implements OnInit {

  constructor() { }

  private _selectedObject: {key: string, value: string};

  @Input() set selectedObject(value: {key: string, value: string}) {
    this._selectedObject = value;
  };

  get selectedObject() {
    return this._selectedObject;
  };

  ngOnInit() {
  }

}
