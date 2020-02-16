import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { MusicElementModule } from '../music-element/music-element.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    MusicElementModule,
    SharedModule
  ]
})
export class PagesModule { }
