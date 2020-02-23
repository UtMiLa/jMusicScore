import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RationalEditComponent } from './rational-edit/rational-edit.component';
import { PitchEditComponent } from './pitch-edit/pitch-edit.component';
import { PianoKbdComponent } from './piano-kbd/piano-kbd.component';
import { ShowMusicComponent } from './show-music/show-music.component';
import { JmusicScoreViewComponent } from '../../../../composer/src/app/jmusic-score-view/jmusic-score-view.component';



@NgModule({
  declarations: [RationalEditComponent, PitchEditComponent, PianoKbdComponent, ShowMusicComponent, JmusicScoreViewComponent],
  exports: [RationalEditComponent, PitchEditComponent, PianoKbdComponent, ShowMusicComponent, JmusicScoreViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
