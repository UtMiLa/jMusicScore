import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';
import {ScoreStatusManager } from '../../../../jMusic/jm-application';
import { GlobalContext } from '../../../../jMusic/model/jm-model-base';

@Component({
  selector: 'app-page-score',
  templateUrl: './page-score.component.html',
  styleUrls: ['./page-score.component.css']
})
export class PageScoreComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  model: IModel;
  status: ScoreStatusManager = new ScoreStatusManager(new GlobalContext());

  ngOnInit() {
    this.model = this.musicProvider.constRes;
  }

}
