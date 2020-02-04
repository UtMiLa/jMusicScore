import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProject, INote } from '../../../jMusic/simple-model/jm-simple-model-interfaces';
import { AbsoluteTime, TimeSpan, Pitch } from '../../../jMusic/jm-music-basics';

@Injectable({
  providedIn: 'root'
})
export class ProjectIoService {
  loadProject(): Observable<IProject> {





    const note1: INote = {
      noteGlyph: TimeSpan.quarterNote,
      timeVal: TimeSpan.quarterNote,
      noteheads: [{
          pitch: new Pitch(1, ''),
          /*tie: false,
          tieForced: false,
          forceAccidental: false,
          showAccidental: false,*/
      }],
      /*decorations: [],
      longDecorations: [],
      syllables: [],
      tupletDef: undefined,
      dots: 0,
      rest: false,
      graceType: GraceType.none,
      beams: [],
      stemDirection: StemDirectionType.StemDown */
  };



    const note2: INote = {
      noteGlyph: TimeSpan.quarterNote,
      timeVal: TimeSpan.quarterNote,
      noteheads: [{
          pitch: new Pitch(1, ''),
          /*tie: false,
          tieForced: false,
          forceAccidental: false,
          showAccidental: false,*/
      }],
      /*decorations: [],
      longDecorations: [],
      syllables: [],
      tupletDef: undefined,
      dots: 0,
      rest: false,
      graceType: GraceType.none,
      beams: [],
      stemDirection: StemDirectionType.StemDown */
  };


    const testProject: IProject = {
  score: {
      sections: [{
          /*bars: [],
              //= loadFromLily("{ \\time 4/4 g'4 a' b' f' c'' d'' e'' f'' }", 1, 1)
          keyChanges: [],
          meterChanges: [],*/
          staves: [{
              /*keyChanges: [],
              meterChanges: [],*/
              /*clefChanges: [],
              staffExpressions: [],
              title: "",*/
              voices: [{
                  sequences: [{
                      absTime: AbsoluteTime.startTime,
                      events: [
                          note1,
                          note2
                      ]
                  }
                  ],
                  // stemDirection: StemDirectionType.StemFree
              }]
          }],
          title: ''
      }],
      /*author: "John",
      composer: "John",
      subTitle: "",
      metadata: {},
      "title": "The project"*/
  },
  variables: {},
  /*title: "",
  subTitle: "",
  author: "",
  composer: "",
  metadata: {}*/
};

    return of(testProject);

  }

  constructor() { }
}
