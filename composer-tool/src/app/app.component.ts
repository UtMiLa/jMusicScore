import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from './music-provider.service';
import {IModel} from './datamodel/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private musicProvider: MusicProviderService) { 

  }
  selectedVar: any = {};
  model: IModel;

  selectedRef(variable){
    //console.log(variable);
    this.selectedVar = variable;
  }

  ngOnInit() {
    this.model=this.musicProvider.getModel();
  }

}
