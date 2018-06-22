import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JmusicScoreViewComponent } from './jmusic-score-view/jmusic-score-view.component';
import { SectionListComponent } from './section-list/section-list.component';
import { SectionVoiceListComponent } from './section-voice-list/section-voice-list.component';
import { VoiceListComponent } from './voice-list/voice-list.component';
import { VarListComponent } from './var-list/var-list.component';
import { ScoreViewComponent } from './score-view/score-view.component';
import { MusicEditorComponent } from './music-editor/music-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    JmusicScoreViewComponent,
    SectionListComponent,
    SectionVoiceListComponent,
    VoiceListComponent,
    VarListComponent,
    ScoreViewComponent,
    MusicEditorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
