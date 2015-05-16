
describe("Viewer", function() {
    var app: jMusicScore.Application.AbstractApplication/*, score: jMusicScore.Model.IScore*/;
  
    
  beforeEach(function() {
      app = new jMusicScore.Application.AbstractApplication($('#application'));
      //score = app.score;
      app.AddPlugin(new jMusicScore.Model.JsonPlugin());

      app.AddValidator(new jMusicScore.Model.UpdateBarsValidator());
      app.AddValidator(new jMusicScore.Model.CreateTimelineValidator());

      app.AddPlugin(new jMusicScore.SvgView.SVGViewer($('<svg>').appendTo('body')));
  });

    
  describe("Note view", function () {
      var voice: jMusicScore.Model.IVoice;
      var note1: jMusicScore.Model.INote, note2: jMusicScore.Model.INote;
     // var noteView1, noteView2;

      beforeEach(function () {
          var initScore = { "id": "197", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "198", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "235", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "236", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "202", "t": "Staff", "children": [{ "id": "203", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "204", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "205", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "206", "t": "Voice", "def": { "stem": 1 }, "children": [{ "id": "207", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "208", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "209", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "210", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "211", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_16" }, "children": [{ "id": "212", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "213", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 5, "den": 16 }, "noteId": "n1_8" }, "children": [{ "id": "214", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "215", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 7, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "216", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "217", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "218", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "219", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "220", "t": "Notehead", "def": { "p": 5, "a": "" } }] }, { "id": "221", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "222", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "223", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "224", "t": "Notehead", "def": { "p": 3, "a": "" } }] }, { "id": "225", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 1 }, "children": [{ "id": "226", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "227", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 15, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "228", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "229", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "230", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "231", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 9, "den": 8 }, "noteId": "n1_4" }, "children": [{ "id": "232", "t": "Notehead", "def": { "p": 1, "a": "" } }] }, { "id": "233", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 11, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "234", "t": "Notehead", "def": { "p": 2, "a": "" } }] }] }] }] };

          app.LoadFromString(initScore, 'JSON');
          voice = app.score.staffElements[0].voiceElements[0];
          note1 = voice.noteElements[0];
          note2 = voice.noteElements[1];
      });

      it('should create view objects to notes', function () {
          expect(note1).not.toEqual(null);
          expect(note1.noteId).toEqual("n1_8");
      });
  });

});
