import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';
import { LilyPondConverter } from '../../../../jMusic/jm-lilypond';
import { IScore } from '../../../../jMusic/model/jm-model-interfaces';
import { MusicElementFactory } from '../../../../jMusic/model/jm-model';

@Component({
  selector: 'app-page-project',
  templateUrl: './page-project.component.html',
  styleUrls: ['./page-project.component.css']
})
export class PageProjectComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  selectedVar: any = {};
  model: IModel;
  imageFiles: string[];
  // todo: remove:
  private _input: string;
  private _output: string;

  selectedRef(variableDef) {
    // console.log(variable);
    variableDef.ctx = this.musicProvider.getGlobalContext();
    this.selectedVar = variableDef;
  }

  saveModel() {
    this.musicProvider.saveModel(this.model).subscribe((data: string[]) => {
      // console.log(data);
      this.imageFiles = data;
    });
  }

  // todo: remove:
  set input(v: string) {
    this._input = v;
    this.output = v.toLocaleUpperCase();
    const globalCtx = this.musicProvider.getGlobalContext();


    try {
      const parser = new LilyPondConverter(globalCtx);
      const parsedObject = parser.read(v);
      console.log(parsedObject);
      let maxLen = 0;
      parsedObject.withStaves((staff) => {
        staff.withVoices((voice) => {
          voice.withNotes(globalCtx, (note) => {
            const cnt = note.noteheadElements.length;
            if (cnt > maxLen) {
              maxLen = cnt;
            }
          });
        }, globalCtx);
      }, globalCtx);

      // funktion til at splitte akkorder: tag nr. m ud af n.
      // hvis der er flere eller færre stemmer end n, skal de fordeles efter regler
      // n*j skal altid fordeles med j til hver stemme
      // der er N stemmer, som skal deles med n; stemme m får m*N/n til (m+1)*N/n

      const data = <any>{ 't': 'Score', 'def': { 'metadata': {} }, 'children': [
        { 't': 'Staff', 'def': { 'metadata': {} }, 'children': [] }] };
      for (let i = 0; i < maxLen; i++) {
        data.children[0].children.push({ 't': 'Voice', 'def': { 'metadata': {} }, 'children': [] });
      }

      parsedObject.withStaves((staff) => {
        staff.withVoices((voice) => {
          voice.withNotes(globalCtx, (note) => {
            const cnt = note.noteheadElements.length;
            for (let i = 0; i < maxLen; i++) {
              const voiceI = data.children[0].children[i];
              const noteMemento = note.getMemento();
              if (noteMemento.children && i < noteMemento.children.length) {
                const myChildren = noteMemento.children.sort((a, b) => a.def.p - b.def.p);
                noteMemento.children = [myChildren[i]];
                voiceI.children.push(noteMemento);
              } else {
                noteMemento.children = [];
                noteMemento.def.rest = true;
                voiceI.children.push(noteMemento);
              }
            }
          });
        }, globalCtx);
      }, globalCtx);

      const elm = <IScore>MusicElementFactory.recreateElement(null, data, globalCtx);

      this.output = parser.write(elm);
    } catch (e) {
      /*this.parsedObject = [];
      this.parsedJson = e.message;*/
      console.log(e);
      this.output = '';
    }
  }

  get input(): string {
    return this._input;
  }

  set output(v: string) {
    this._output = v;
  }

  get output(): string {
    return this._output;
  }



  ngOnInit() {
    this.model = this.musicProvider.constRes;
  }

}
