import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RationalEditComponent } from './rational-edit/rational-edit.component';
import { PitchEditComponent } from './pitch-edit/pitch-edit.component';



@NgModule({
  declarations: [RationalEditComponent, PitchEditComponent],
  exports: [RationalEditComponent, PitchEditComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
