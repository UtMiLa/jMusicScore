import { Component, OnInit, Input } from '@angular/core';
import { parser } from '../datamodel/lilyparser';

@Component({
  selector: 'app-structured-music-editor',
  templateUrl: './structured-music-editor.component.html',
  styleUrls: ['./structured-music-editor.component.css']
})
export class StructuredMusicEditorComponent implements OnInit {


  constructor() { }
  private _selectedObject: {key: string, value: string};
  private parsedObject: any;

  @Input() set selectedObject(value: {key: string, value: string}) {
    try{
      this.parsedObject = parser.parse(value.value, {});
      this.parsedJson = JSON.stringify(this.parsedObject);
    }
    catch(e){
      this.parsedObject =[];
      this.parsedJson = e.message;
    }

    this._selectedObject = value;
  };

  get selectedObject() {
    return this._selectedObject;
  };

  parsedJson: string;

  ngOnInit() {
  }

}
