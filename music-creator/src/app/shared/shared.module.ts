import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RationalEditComponent } from './rational-edit/rational-edit.component';
import { PitchEditComponent } from './pitch-edit/pitch-edit.component';
import { PianoKbdComponent } from './piano-kbd/piano-kbd.component';



@NgModule({
  declarations: [RationalEditComponent, PitchEditComponent, PianoKbdComponent],
  exports: [RationalEditComponent, PitchEditComponent, PianoKbdComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }