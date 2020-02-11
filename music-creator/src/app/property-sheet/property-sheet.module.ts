import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';
import { VoiceComponent } from './voice/voice.component';
import { StaffComponent } from './staff/staff.component';
import { SectionComponent } from './section/section.component';
import { SequenceComponent } from './sequence/sequence.component';
import { MeterComponent } from './meter/meter.component';
import { ClefComponent } from './clef/clef.component';
import { KeyComponent } from './key/key.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [NoteComponent, VoiceComponent, StaffComponent, SectionComponent, SequenceComponent,
    MeterComponent, ClefComponent, KeyComponent],
  exports: [NoteComponent, VoiceComponent, StaffComponent, SectionComponent, SequenceComponent,
    MeterComponent, ClefComponent, KeyComponent],
  imports: [
    CommonModule, SharedModule
  ]
})
export class PropertySheetModule { }
