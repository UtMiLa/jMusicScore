import { Component, OnInit, Input } from '@angular/core';
import { INote } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  constructor() { }

  @Input()
  element: INote;

  ngOnInit() {
  }

}
