import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MusicElementFactory, IScore, IMemento, ScoreElement, ClefDefinition, NoteType, AbsoluteTime,
    TimeSpan, Music } from '../../../../jMusic/jm-model';
import { CanvasView } from '../../../../jMusic/jm-CanvasView';    

// import { Model } from '../../../../jMusicScore/jMusicScore';
// import { CanvasView } from '../../../../jMusicScore/jMusicScore.CanvasView';

@Component({
  selector: 'app-jmusic-score-view',
  templateUrl: './jmusic-score-view.component.html',
  styleUrls: ['./jmusic-score-view.component.css']
})
export class JmusicScoreViewComponent implements OnInit {

  constructor() { }

  theScore: IScore;
  theScoreMemento: string;
  _memento: IMemento;



  mus = {
    "id": "89", "t": "Score", "def": { "metadata": {} },
    "children": [
        { "id": "168", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } },
        { "id": "169", "t": "Bar", "def": { "abs": { "num": 7, "den": 4 } } },
        { "id": "92", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } },
        { "id": "93", "t": "Meter", "def": { "abs": { "num": 1, "den": 1 }, "def": { "t": "Regular", "num": 3, "den": 4 } } },
        /*{
            "id": "94", "t": "Staff",
            "children": [
                { "id": "95", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } },
                { "id": "96", "t": "Clef", "def": { "abs": { "num": 1, "den": 1 }, "clef": 2, "lin": 3, "tr": 0 } },
                { "id": "97", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } },
                { "id": "98", "t": "Key", "def": { "abs": { "num": 1, "den": 1 }, "def": { "t": "Regular", "acci": "b", "no": 3 } } },
                {
                    "id": "99", "t": "Voice", "def": { "stem": 1 },
                    "children": [
                        { "id": "100", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 },
                        "noteId": "n1_8", "dots": 1, "rest": true } },
                        {
                            "id": "101", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 3, "den": 16 },
                             "noteId": "n1_16" }, "children": [{ "id": "102", "t": "Notehead", "def": { "p": 2, "a": "" } },
                                { "id": "156", "t": "TextSyllable", "def": { "text": "tænk " } },
                                { "id": "159", "t": "NoteLongDecoration", "def": { "type": 3, "dur": { "num": 5, "den": 16 } } },
                                { "id": "166", "t": "NoteLongDecoration", "def": { "type": 1, "dur": { "num": 5, "den": 16 } } }]
                        },
                        { "id": "103", "t": "Note", "def": { "time": { "num": 1, "den": 8 },
                        "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" },
                         "children": [{ "id": "104", "t": "Notehead", "def": { "p": 4, "a": "" } },
                          { "id": "157", "t": "TextSyllable", "def": { "text": "på " } }] },
                        { "id": "105", "t": "Note", "def": { "time": { "num": 1, "den": 8 },
                        "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [
                            { "id": "106", "t": "Notehead", "def": { "p": 6, "a": "" } },
                             { "id": "158", "t": "TextSyllable", "def": { "text": "teks-" } }] },
                        { "id": "107", "t": "Note", "def": { "time": { "num": 1, "den": 8 },
                        "abs": { "num": 1, "den": 2 }, "noteId": "n1_8", "grace": "normal" }, "children": [
                            { "id": "108", "t": "Notehead", "def": { "p": 5, "a": "" } },
                            { "id": "162", "t": "TextSyllable", "def": { "text": "ten" } }] },
                        {
                            "id": "109", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs":
                            { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [
                                { "id": "110", "t": "Notehead", "def": { "p": 4, "a": "" } },
                                { "id": "111", "t": "Notehead", "def": { "p": 6, "a": "" } },
                                { "id": "167", "t": "NoteLongDecoration", "def": { "type": 2, "dur": { "num": 3, "den": 16 } } }]
                        },

                    ]
                },
                {
                    "id": "131", "t": "Voice", "def": { "stem": 2 },
                    "children": [
                        { "id": "132", "t": "Note", "def": { "time": { "num": 1, "den": 1 }, "abs": { "num": 0, "den": 1 },
                         "noteId": "hidden", "rest": true, "hidden": true } },
                        { "id": "133", "t": "Note", "def": { "time": { "num": 3, "den": 4 }, "abs": { "num": 1, "den": 1 },
                         "noteId": "hidden", "rest": true, "hidden": true } }
                    ]
                },
                { "id": "150", "t": "Meter" },
                { "id": "151", "t": "Meter" },
                { "id": "163", "t": "StaffExpression", "def": { "text": "Allegro", "abs": { "num": 0, "den": 1 } } }
            ]
        },*/
        {
            "id": "134", "t": "Staff",
            "children": [
                { "id": "135", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } },
                { "id": "136", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } },
                { "id": "137", "t": "Key", "def": { "abs": { "num": 1, "den": 1 }, "def": { "t": "Regular", "acci": "b", "no": 3 } } },
                {
                    "id": "138", "t": "Voice", "def": { "stem": 1 },
                    "children": [
                        { "id": "139", "t": "Note", "def": { "time": { "num": 1, "den": 1 }, "abs": { "num": 0, "den": 1 },
                        "noteId": "hidden", "rest": true, "hidden": true } }, { "id": "140", "t": "Note",
                        "def": { "time": { "num": 3, "den": 4 }, "abs": { "num": 1, "den": 1 },
                        "noteId": "hidden", "rest": true, "hidden": true } }
                    ]
                },
                { "id": "152", "t": "Meter" },
                { "id": "153", "t": "Meter" }
            ]
        }
    ]
};





  private parsedObject: any;
  private painter: CanvasView.CanvasQuickPainter;

  @Input() set memento(value: IScore) {
    try {
     console.log(value);

    /*const voiceMemento = value[0].mus;
    voiceMemento.children.reverse();
    const staffMemento = {def: {}, t: "Staff", children: [
        { "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } },
        voiceMemento
    ], id: '2'};
    const scoreMemento = {def: {}, t: "Score", children: [staffMemento], id: '3' };*/
    const score = value; /**ScoreElement>MusicElementFactory.recreateElement(null, <any>scoreMemento);*/

    /*var staff = score.addStaff(Model.ClefDefinition.clefCAlto);
    var voice = staff.addVoice();
    var note = Model.Music.addNote(voice, Model.NoteType.Note, new Model.AbsoluteTime(1,4), "n1_4",  Model.TimeSpan.quarterNote);*/
    const memento = score.getMemento(true);
    this.theScore = score;
    this.theScoreMemento = JSON.stringify(memento);

    this._memento = memento;


    //var divElm = null;
    try{
    //console.log(this.mus);
    //console.log(this.canvas.nativeElement);
    this.painter.paintOnCanvas(score, this.canvas.nativeElement);}
    catch(e1){
      console.log(e1);
    }
  } catch (e) {
    // console.log("Fejlede");
    this.theScore = null;
    this.theScoreMemento = "";
    this._memento = null;
  }
}

  get memento() {
    return this.theScore;
  }

  @ViewChild('theCanvas') canvas: ElementRef;


  ngOnInit() {
    const score = new ScoreElement(null);
    const staff = score.addStaff(ClefDefinition.clefCAlto);
    const voice = staff.addVoice();
    const note = Music.addNote(voice, NoteType.Note, new AbsoluteTime(1, 4), "n1_4",  TimeSpan.quarterNote);
    const memento = score.getMemento(true);
    this.theScore = score;
    this.theScoreMemento = JSON.stringify(memento);

    this.painter = new CanvasView.CanvasQuickPainter();
  }

}
