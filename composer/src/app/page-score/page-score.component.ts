import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';

@Component({
  selector: 'app-page-score',
  templateUrl: './page-score.component.html',
  styleUrls: ['./page-score.component.css']
})
export class PageScoreComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  model: IModel;

  ngOnInit() {
    this.model = this.musicProvider.constRes;
  }

}
