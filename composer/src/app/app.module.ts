import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { GalleriaModule } from 'primeng/galleria';

import { MapToIterable } from './map-to-iterable';

import { AppComponent } from './app.component';
import { JmusicScoreViewComponent } from './jmusic-score-view/jmusic-score-view.component';
import { SectionListComponent } from './section-list/section-list.component';
import { SectionVoiceListComponent } from './section-voice-list/section-voice-list.component';
import { VoiceListComponent } from './voice-list/voice-list.component';
import { VarListComponent } from './var-list/var-list.component';
import { ScoreViewComponent } from './score-view/score-view.component';
import { MusicEditorComponent } from './music-editor/music-editor.component';
import { MusicProviderService } from './music-provider.service';
import { StructuredMusicEditorComponent } from './structured-music-editor/structured-music-editor.component';
import { JmusicScoreDebugComponent } from './jmusic-score-debug/jmusic-score-debug.component';
import { ComposerNavigationComponent } from './composer-navigation/composer-navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { PageVariablesComponent } from './page-variables/page-variables.component';
import { PageFilesComponent } from './page-files/page-files.component';
import { PageProjectComponent } from './page-project/page-project.component';
import { PageScoreComponent } from './page-score/page-score.component';
import { PageSectionsComponent } from './page-sections/page-sections.component';
import { AngularSplitModule } from 'angular-split';
import { PianoCtlComponent } from './piano-ctl/piano-ctl.component';

@NgModule({
  declarations: [
    AppComponent,
    JmusicScoreViewComponent,
    SectionListComponent,
    SectionVoiceListComponent,
    VoiceListComponent,
    VarListComponent,
    ScoreViewComponent,
    MusicEditorComponent,
    MapToIterable,
    StructuredMusicEditorComponent,
    JmusicScoreDebugComponent,
    ComposerNavigationComponent,
    PageVariablesComponent,
    PageFilesComponent,
    PageProjectComponent,
    PageScoreComponent,
    PageSectionsComponent,
    PianoCtlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PanelModule,
    GalleriaModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AngularSplitModule.forRoot()
  ],
  providers: [MusicProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
