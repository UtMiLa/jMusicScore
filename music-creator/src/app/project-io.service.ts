import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProject, INote } from '../../../jMusic/simple-model/jm-simple-model-interfaces';
import { AbsoluteTime, TimeSpan, Pitch } from '../../../jMusic/jm-music-basics';
import { FileIoService } from './file-io.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectIoService {

  constructor(private ioService: FileIoService) { 

  }

  loadProject(name: string): Observable<IProject> {
    if (!name) return this.loadTestProject();
    return this.ioService.load(name).pipe(
     /* map((data) => {
        return JSON.parse(data);
      })*/
    );
  }

  saveProject(data: IProject) {
    return this.ioService.save('project.mmodel', JSON.stringify(data));
  }

  listProjects() {
    return this.ioService.list('json');
  }

  loadTestProject(): Observable<IProject> {




    const note1: INote = {
      noteGlyph: TimeSpan.quarterNote,
      timeVal: TimeSpan.quarterNote,
      noteheads: [{
          pitch: new Pitch(16, ''),
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
          pitch: new Pitch(17, ''),
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
  title: "Mit projekt",
  subTitle: "med musik",
  /*author: "",
  composer: "",
  metadata: {}*/
};

    return of(testProject);

  }

}
