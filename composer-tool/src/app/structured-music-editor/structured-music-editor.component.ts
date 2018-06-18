import { Component, OnInit, Input } from '@angular/core';
import { LilyPondConverter } from '../../../../jMusic/jm-lilypond';

// declare  function require(path: string): any;
// const LilyPondConverter = require('../../../../jMusic/dist/peg/jm-lilypond.js');

@Component({
  selector: 'app-structured-music-editor',
  templateUrl: './structured-music-editor.component.html',
  styleUrls: ['./structured-music-editor.component.css']
})
export class StructuredMusicEditorComponent implements OnInit {


  constructor() { }
  private _selectedObject: {name: string, parent: {}};
  private parsedObject: any;

  @Input() set selectedObject(value: {name: string, parent: {}}) {
    try {
      const parser = new LilyPondConverter();
      this.parsedObject = parser.read(value.parent[value.name]);
      this.parsedJson = null; // JSON.stringify(this.parsedObject);
    } catch (e) {
      this.parsedObject = [];
      this.parsedJson = e.message;
    }

    this._selectedObject = value;
  };

  get selectedObject() {
    return this._selectedObject;
  }

  parsedJson: string;

  ngOnInit() {
  }

}
