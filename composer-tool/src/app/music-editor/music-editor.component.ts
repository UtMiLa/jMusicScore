import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-music-editor',
  templateUrl: './music-editor.component.html',
  styleUrls: ['./music-editor.component.css']
})
export class MusicEditorComponent implements OnInit {

  constructor() { }

  private _selectedObject: {name: string, parent: {}};

  @Input() set selectedObject(value: {name: string, parent: {}}) {
    //console.log(value);
    if (value && value.parent)
    this._selectedObject = value;
  };

  get selectedObject() {
    return this._selectedObject;
  };

  ngOnInit() {
  }

}
