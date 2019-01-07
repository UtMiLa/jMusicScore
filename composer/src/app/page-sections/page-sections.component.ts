import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';

@Component({
  selector: 'app-page-sections',
  templateUrl: './page-sections.component.html',
  styleUrls: ['./page-sections.component.css']
})
export class PageSectionsComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  model: IModel;

  ngOnInit() {
    this.model = this.musicProvider.constRes;
  }

}
