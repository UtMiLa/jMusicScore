import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RationalEditComponent } from './rational-edit/rational-edit.component';
import { PitchEditComponent } from './pitch-edit/pitch-edit.component';



@NgModule({
  declarations: [RationalEditComponent, PitchEditComponent],
  exports: [RationalEditComponent, PitchEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
