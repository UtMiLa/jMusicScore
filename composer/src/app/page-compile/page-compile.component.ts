import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';

@Component({
  selector: 'app-page-compile',
  templateUrl: './page-compile.component.html',
  styleUrls: ['./page-compile.component.scss']
})
export class PageCompileComponent implements OnInit {
  model: IModel;

  constructor(private musicProvider: MusicProviderService) { 
    this.model = this.musicProvider.constRes;
  }

  ngOnInit() {
  }

}
