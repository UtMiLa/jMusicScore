import { Component, OnInit } from '@angular/core';
import { MusicProviderService } from './music-provider.service';
import { IModel } from './datamodel/model';
// todo: remove:
import { LilyPondConverter } from '../../../jMusic/jm-lilypond';
import { MusicElementFactory, IScore } from '../../../jMusic/jm-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private musicProvider: MusicProviderService) {

  }
  selectedVar: any = {};
  model: IModel;
  imageFiles: string[];
  // todo: remove:
  private _input: string;
  private _output: string;

  selectedRef(variableDef) {
    // console.log(variable);
    this.selectedVar = variableDef;
  }

  saveModel() {
    this.musicProvider.saveModel(this.model).subscribe((data: string[]) => {
      // console.log(data);
      this.imageFiles = data;
    });
  }

  ngOnInit() {
    this.model = this.musicProvider.constRes;
    /*this.musicProvider.getModel().subscribe((data: IModel) => {
      console.log(data);
      this.model = data;
    });*/
  }

  // todo: remove:
  set input(v: string) {
    this._input = v;
    this.output = v.toLocaleUpperCase();


    try {
      const parser = new LilyPondConverter();
      const parsedObject = parser.read(v);
      console.log(parsedObject);
      let maxLen = 0;
      parsedObject.withStaves((staff) => {
        staff.withVoices((voice) => {
          voice.withNotes((note) => {
            const cnt = note.noteheadElements.length;
            if (cnt > maxLen) {
              maxLen = cnt;
            }
          });
        });
      });

      // funktion til at splitte akkorder: tag nr. m ud af n.
      // hvis der er flere eller færre stemmer end n, skal de fordeles efter regler
      // n*j skal altid fordeles med j til hver stemme
      // der er N stemmer, som skal deles med n; stemme m får m*N/n til (m+1)*N/n

      const data = <any>{ "t": "Score", "def": { "metadata": {} }, "children": [
        { "t": "Staff", "def": { "metadata": {} }, "children": [] }] };
      for (let i = 0; i < maxLen; i++) {
        data.children[0].children.push({ "t": "Voice", "def": { "metadata": {} }, "children": [] });
      }

      parsedObject.withStaves((staff) => {
        staff.withVoices((voice) => {
          voice.withNotes((note) => {
            const cnt = note.noteheadElements.length;
            for (let i = 0; i < maxLen; i++) {
              const voiceI = data.children[0].children[i];
              const noteMemento = note.getMemento();
              if (noteMemento.children && i < noteMemento.children.length) {
                const myChildren = noteMemento.children.sort((a, b) => a.def.p - b.def.p);
                noteMemento.children = [myChildren[i]];
                voiceI.children.push(noteMemento);
              }
              else {
                noteMemento.children = [];
                noteMemento.def.rest = true;
                voiceI.children.push(noteMemento);
              }
            }
          });
        });
      });

      const elm = <IScore>MusicElementFactory.recreateElement(null, data);

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


}
