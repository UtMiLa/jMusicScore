import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectElementComponent } from './project-element/project-element.component';
import { ScoreElementComponent } from './score-element/score-element.component';
import { StaffElementComponent } from './staff-element/staff-element.component';
import { VoiceElementComponent } from './voice-element/voice-element.component';
import { SequenceElementComponent } from './sequence-element/sequence-element.component';
import { NoteElementComponent } from './note-element/note-element.component';
import { VariableElementComponent } from './variable-element/variable-element.component';
import { EventElementComponent } from './event-element/event-element.component';
import { SelectionInfoComponent } from './selection-info/selection-info.component';
import { SelectableElementComponent } from './selectable-element/selectable-element.component';



@NgModule({
  declarations: [ProjectElementComponent, ScoreElementComponent, StaffElementComponent, VoiceElementComponent, SequenceElementComponent,
     NoteElementComponent, VariableElementComponent, EventElementComponent, SelectionInfoComponent, SelectableElementComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ProjectElementComponent
  ]
})
export class MusicElementModule { }
