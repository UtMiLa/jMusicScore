import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { ScoreViewComponent } from './score-view/score-view.component';
import { VarListComponent } from './var-list/var-list.component';
import { MidiPlayerComponent } from './midi-player/midi-player.component';
import { SectionVoiceListComponent } from './section-voice-list/section-voice-list.component';
import { SectionListComponent } from './section-list/section-list.component';
import { VoiceListComponent } from './voice-list/voice-list.component';
import { MusicEditorComponent } from './music-editor/music-editor.component';
import { StructuredMusicEditorComponent } from './structured-music-editor/structured-music-editor.component';
import { MusicProviderService } from './music-provider.service';
import { MapToIterable } from './map-to-iterable';
//import {AccordionModule} from 'primeng/accordion';

import {PanelModule} from 'primeng/panel';
import { StructuredMusicComponent } from './structured-music/structured-music.component';


@NgModule({
  declarations: [
    AppComponent,
    ScoreViewComponent,
    VarListComponent,
    MidiPlayerComponent,
    SectionVoiceListComponent,
    SectionListComponent,
    VoiceListComponent,
    MusicEditorComponent,
    StructuredMusicEditorComponent,
    MapToIterable,
    StructuredMusicComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PanelModule,
    FormsModule
  ],
  providers: [MusicProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
