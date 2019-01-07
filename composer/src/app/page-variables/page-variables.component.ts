import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';

@Component({
  selector: 'app-page-variables',
  templateUrl: './page-variables.component.html',
  styleUrls: ['./page-variables.component.css']
})
export class PageVariablesComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  selectedVar: any = {};
  model: IModel;

  selectedRef(variableDef) {
    // console.log(variable);
    variableDef.ctx = this.musicProvider.getGlobalContext();
    this.selectedVar = variableDef;
  }

  ngOnInit() {
    this.model = this.musicProvider.constRes;
  }

}
