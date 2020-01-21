import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import { IMemento, ClefDefinition, NoteType, AbsoluteTime, TimeSpan, RegularKeyDefinition } from '../../../../jMusic/jm-music-basics';
import { MusicElementFactory,  ScoreElement, Music } from '../../../../jMusic/model/jm-model';
import { GlobalContext } from '../../../../jMusic/model/jm-model-base';
import { IScore, IGlobalContext } from '../../../../jMusic/model/jm-model-interfaces';
import { CanvasView } from '../../../../jMusic/jm-CanvasView';
import { VariableRef } from '../../../../jMusic/jm-ghost-elements';
import { ViewModeller } from '../../../../jMusic/viewmodel/jm-create-viewmodel';
import { VScore } from '../../../../jMusic/viewmodel/jm-viewmodel';

@Component({
  selector: 'app-jmusic-score-debug',
  templateUrl: './jmusic-score-debug.component.html',
  styleUrls: ['./jmusic-score-debug.component.css']
})
export class JmusicScoreDebugComponent implements OnInit {

  constructor() { }


  theScore: IScore;
  theScoreMemento: string;
  globalContext: IGlobalContext;
  _memento: IMemento;


  viewModel: VScore;



  ngOnInit() {
  }

  showData(data){
    return JSON.stringify(data);
  }

  @Input() set memento(value: IScore) {
    try {
      // console.log(MusicElementFactory.mementoCreators);

      let score = value;
      if (!score || !score.staffElements || !score.staffElements.length  || !score.globalContext) {
          score = <ScoreElement>MusicElementFactory.recreateElement(null, <any>{}, new GlobalContext());
      }
      this.globalContext = score.globalContext;
      //this.painter = new CanvasView.CanvasQuickPainter(score.globalContext);

      const key = new RegularKeyDefinition('b', 1);
      score.setKey(key, AbsoluteTime.startTime, score.globalContext);

      const memento = score.getMemento(true);
      this.theScore = score;
      this.theScoreMemento = JSON.stringify(memento);

      const viewModeller = new ViewModeller();
      this.viewModel = viewModeller.create(score, score.globalContext);

      this._memento = memento;

      // console.log(MusicElementFactory.mementoCreators);

      // var divElm = null;
      try {
        //this.div.nativeElement.textContent = this.theScore.debug();
          // console.log(this.mus);
          // console.log(this.canvas.nativeElement);
          //this.painter.paintOnCanvas(score, this.canvas.nativeElement);
      } catch (e1) {
        console.log(e1);
      }
    } catch (e) {
      // console.log("Fejlede");
      console.log(e);
      this.theScore = null;
      this.theScoreMemento = '';
      this._memento = null;
    }
  }

}
