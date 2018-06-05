import { Component, OnInit, Input } from '@angular/core';
//import { parser } from '../datamodel/lilyparser';

@Component({
  selector: 'app-structured-music',
  templateUrl: './structured-music.component.html',
  styleUrls: ['./structured-music.component.css']
})
export class StructuredMusicComponent implements OnInit {

  constructor() { }
  @Input() private parsedObject: any;

  ngOnInit() {
  }

}
