import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { MusicElementModule } from '../music-element/music-element.module';



@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    MusicElementModule
  ]
})
export class PagesModule { }
