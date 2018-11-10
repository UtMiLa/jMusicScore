import { Component, OnInit, Input } from '@angular/core';
import { LilyPondConverter } from '../../../../jMusic/jm-lilypond';
import { GlobalContext } from '../../../../jMusic/jm-model';

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
    const globalCtx = new GlobalContext();
    try {
      const parser = new LilyPondConverter(globalCtx);
      this.parsedObject = parser.read(value.parent[value.name]);
      console.log(this.parsedObject);
      console.log(value.parent[value.name]);
      this.parsedJson = null; // JSON.stringify(this.parsedObject);
    } catch (e) {
      this.parsedObject = [];
      this.parsedJson = e.message;
    }

    this._selectedObject = value;
  }

  get selectedObject() {
    return this._selectedObject;
  }

  parsedJson: string;

  ngOnInit() {
  }

}
