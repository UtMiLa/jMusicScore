import { Component, OnInit, Input } from '@angular/core';
import { INote } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-note-element',
  templateUrl: './note-element.component.html',
  styleUrls: ['./note-element.component.scss']
})
export class NoteElementComponent implements OnInit {

  constructor() { }

  @Input()
  note: INote;

  ngOnInit() {
  }

}
