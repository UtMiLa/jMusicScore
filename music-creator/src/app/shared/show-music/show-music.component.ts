import { Component, OnInit, Input } from '@angular/core';
import { IProject, ISection } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { ScoreElement } from '../../../../../jMusic/model/jm-model';
import { ModelConverter } from '../../../../../jMusic/simple-model/jm-simple-model-converter';

@Component({
  selector: 'app-show-music',
  templateUrl: './show-music.component.html',
  styleUrls: ['./show-music.component.scss']
})
export class ShowMusicComponent implements OnInit {

  constructor() { }

  _music: IProject;
  @Input(  )
  get music(): IProject { return this._music; }
  set music(value: IProject) { 
    if (this._music !== value)    {
      this._music = value;
      if (value) {
        console.log(value);
        const converter = new ModelConverter(value);
        this.converted = converter.convertSection(value.score.sections[0]);
        console.log('converted: ', this.converted);
      } else { this.converted = undefined; }
    }
  }

  converted: ScoreElement;

  ngOnInit() {
  }


}
