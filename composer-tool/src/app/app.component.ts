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
  imageFiles: string[];

  selectedRef(variableDef){
    //console.log(variable);
    this.selectedVar = variableDef;
  }

  saveModel(){
    this.musicProvider.saveModel(this.model).subscribe((data: string[]) => {
      //console.log(data);
      this.imageFiles = data;
    });
  }

  ngOnInit() {
    this.musicProvider.getModel().subscribe((data: IModel) => {
      //console.log(data);
      this.model = data;
    });
  }

}
