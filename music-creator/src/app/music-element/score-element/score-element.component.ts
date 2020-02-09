import { Component, OnInit, Input } from '@angular/core';
import { IScore } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-score-element',
  templateUrl: './score-element.component.html',
  styleUrls: ['./score-element.component.scss']
})
export class ScoreElementComponent implements OnInit {

  constructor() { }

  @Input()
  score: IScore;

  ngOnInit() {
  }

}
