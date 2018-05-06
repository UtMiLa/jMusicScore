import { Component, OnInit, Input } from '@angular/core';
import { parser } from '../datamodel/lilyparser';

@Component({
  selector: 'app-structured-music',
  templateUrl: './structured-music.component.html',
  styleUrls: ['./structured-music.component.css']
})
export class StructuredMusicComponent implements OnInit {

  constructor() { }
  private _selectedObject: {key: string, value: string};

  @Input() set selectedObject(value: {key: string, value: string}) {
    try{
      this.parsedJson = JSON.stringify(parser.parse(value.value, {}));
    }
    catch(e){
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
