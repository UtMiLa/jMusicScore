import { Injectable } from '@angular/core';
// import { Observable } from '@angular/observable';
import {IModel} from './datamodel/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IScore, ISequence } from '../../../jMusic/model/jm-model-interfaces';
import { GlobalContext } from '../../../jMusic/model/jm-model-base';
import { LilyPondConverter } from '../../../jMusic/jm-lilypond';

@Injectable()
export class MusicProviderService {

  constructor(private http: HttpClient) {
    // this.load();
  }

  constRes = {
    'voices': {
        'voices': ['sopran', 'alt', 'tenor', 'bas'],
        'sections': ['Glory', 'Foerste', 'Amen']
    },
    'scales': {
        'diatonicScale': '{ c d e f g a bes }'
    },
    'sections': {
        'Glory': {
            'voices': {
                'sopranGlory': '{\\modalTranspose c c\' \\diatonicScale { \\Glory r4 \\fullRest\n\\Glory \n\\GloryB\n}\n' +
                '%   \\addlyrics {\n%      Glo -- ry to the Lord,\n%      glo -- ry to the Lord,\n' +
                '%      glo -- ry to the Lord in the high %  -- _ est!\n%      Glo -- ry to the Lord,\n' +
                '%      glo -- ry to the Lord,\n%      glo -- ry to the Lord in the high - %  est!\n%  And peace _ on _ earth,\n' +
                '%  and peace _ _ on \n%    }\n}',
                'altGlory': '{\nr2..\n{\\repeat unfold 5 \\fullRest}\nr4. \n\\transpose c g {c\'8 c\' a g f g a\ng4 f4 } r4 r4 r4.\n\n' +
                '\\repeat unfold 10 \\fullRest\n}',
                'tenorGlory': '{\\repeat unfold 19 \\fullRest\n}',
                'basGlory': '{<c f a>4 r4 r4.\n\n\\basOstinatTo\n\\basOstinatTre\n\n{\\repeat unfold 14 \\fullRest}\n}'
            }
        },
        'Foerste': {
            'voices': {
                'altFoerste': '{<bes e\' g\' c\'\'>2 r4.\n\\relative c\'{ \n\\repeat unfold 4 \\fullRest \n' +
                '\\repeat unfold 4 \\fullRest \n \\FugaTema \\FugaSpin\n \\modalTranspose d c \\diatonicScale { \\FugaSpin }\n' +
                '\\transpose c c\' {\n\\softKontra\n%  e8 d e r e f g \n%  a g a g f g a \nbes8 a bes a g c\' b\na g a g fis bes a\n}}}',
                'tenorFoerste': '{\\modalTranspose c g \\diatonicScale {\n \\repeat unfold 4 \\fullRest  \n\n\\FugaTema \n' +
                '\\FugaSpin \n\\modalTranspose d c \\diatonicScale { \\FugaSpin } \n' +
                '\\modalTranspose e c \\diatonicScale { \\FugaSpin } \n}\n \\modalTranspose c f \\diatonicScale { \\softKontra }\n' +
                '%  a8 g a r a bes c\'\n%  d\' c\' d\' c\' bes c\' d\' \ng8 r bes b c\'4 cis\'8\nd\'4 a b g8\n' +
                '%  \\modalTranspose e c\' \\diatonicScale { \\FugaSpin } \n%  \\modalTranspose e bes \\diatonicScale { \\FugaSpin } \n' +
                'c\'4 r r r8 r4 r r4.\nf4 fis g gis8 a4 r a8 g a\n}',
                'basFoerste': '{     \n{ c2.. c4 f e f8 d2~ d8 e[ f] }\n \\FugaSpin\n' +
                ' \\modalTranspose d c \\diatonicScale { \\FugaSpin }\n\n\\softKontra\n\nbes8 r f4 g f8\ne r c4 f4 e8\nd4 dis e c8\n' +
                '\nf2 r4 r8 \n%   \\modalTranspose c g \\diatonicScale { \\SynkopeSpin }\n \\fullRest \\fullRest \\fullRest \\fullRest\n' +
                ' \\fullRest\n \\fullRest\n%  f4 fis g gis8 a4 \nr4 c8 cis d4 dis8\n\n}',
                'sopranFoerste': '{ \n\\repeat unfold 5 \\fullRest \n\\repeat unfold 8 \\fullRest \n' +
                '\\modalTranspose c g\' \\diatonicScale { \\FugaTema }\n\\transpose c g\' { \\FugaSpin }\n' +
                '\\modalTranspose d g\' \\diatonicScale { \\FugaSpin }\n}'
            }
        },
        'Amen': {
            'voices': {
                'sopranAmen': '{\n\\transpose c des\' {\nc\'2..~ \nc\'4 < a>4 <g>4 <f>8\n<des f bes>2~\n <des f bes>8\n < d a>4\n<bes, d ' +
                'g>4.~\n<bes, c g>2\n<bes, f>2~\n <bes, f>8~\n <a, c f>4  }\n\n\n\\transpose c des {\n\n<bes c\' f\' bes\'>2\n' +
                ' <a c\' f\' a\'>4.\n<a c\' f\' c\'\'>2..\n<bes c\' g\' bes\'>8\n<a c\' f\' f\'\'>8\n<bes c\' g\' bes\'>8\n' +
                '<a c\' a\'>2\n}\n }',
                'altAmen': '\\transpose c des{  \n<f\' a\'>2..\n  \\fullRest  \\fullRest  \\fullRest  \n' +
                '  \\fullRest  \\fullRest  \\fullRest ' +
                ' \n\n\\fullRest  }',
                'tenorAmen': '\\transpose c des{ \nc\'8 c\' a g f g a\ng4 f4 r4.\n' +
                ' \\fullRest   \\fullRest \\fullRest\n  \\fullRest  \\fullRest ' +
                ' \\fullRest  \n}',
                'basAmen': '{ \n\\transpose c des\' {\nc,2..~ \nc,4 <c,>4 <cis, >4 <d, >8\n<es, g, >2~\n' +
                ' <es, g,>8\n <b,, f,>4\n<c, f, bes, >4.~\n<c, e, bes, >2\n<f,, d, bes, >2~\n <f,, d, bes, >8~\n' +
                ' <f,, c, a, >4  }\n\n\n\\transpose c des {\n\n<f, d f bes >2\n <f, c f a >4.\n<f, e a >2..\n' +
                '<f, d f bes >8\n<f, e a >8\n<f, d f bes >8\n<f, c g a >2\n}\n}'
            }
        },
    },
    'variables': {
        'tinyTheme': '{ c4 d4 e f }',
        'rests': ' { r\\brevis r1 r2 r4 r8 r16 r32 r64 r128 r128  }',
        'values': '{ c\\brevis c1 c2 c4 c8 c16 c32 c64 c128 c128 }',
        'chords': '{ r4 <d f g>8 r8 <c f a>4 <d f g>8  }',
        'subSequence': '{ c4 { d4 e } f }',
        'pitches': '{ c4 d e f g a b c\' }',
        'octaves': '{ c\'\'\'4 c\'\' c\' c c, c,, c,,, }',
        'accidentals': '{ ceses4 ces c cis cisis }',
        'dots': '{ c4 c4. c4.. c4... <c e>4. r4.  }',
        'ties': '{ c4~ c16 }',
        'fullRest': '{ s1*7/8 }',
        'timeChange': '{c4 \\time 4/8 c4}',
        'beams': '{ c8[ d e] f g[ a] }',
        'transposition': '{ c4 \\transpose c e { d4 e } f }',
        'variables': '{ c4 \\tinyTheme c4 }',
        'twiceVariable': '{ c4 \\tinyTheme c4 \\tinyTheme }',
        'transposedVariable': '{ c2 \\tinyTheme c2  \\transpose c e { \\tinyTheme } c2 }'
    },
    'score': [{
            'context': 'sopran',
            'content': '\\tempo "Allegretto" 4 = 140 \\key f \\major \\time 7/8 \\sopran'
        }, {
            'context': 'alt',
            'content': '\\key f \\major \\time 7/8 \\alt'
        }, {
            'context': 'tenor',
            'content': '\\key f \\major \\time 7/8 \\clef "treble_8" \\tenor'
        }, {
            'context': 'bas',
            'content': '\\key f \\major \\time 7/8 \\clef "bass" \\bas'
        }
    ]
  };

  json: IModel;
  loadUrl = 'http://localhost:8081/getFile/users1.json';
  saveUrl = 'http://localhost:8081/saveFile/users1.json';
  globalContext = new GlobalContext();

  load(): Observable<IModel> {
      const model = this.http.get<IModel>(this.loadUrl);
      return model;
  }

  saveModel(model: IModel): Observable<string[]> {
        return this.http.post<string[]>(this.saveUrl, 'text=' + JSON.stringify(model));
  }

  getVariables(id: string) {
    const varList = this.json[id];
    return varList;
  }
  getModel(): Observable<IModel> {
    return this.load();
  }

  loadFromLily(input: string) {
    const parser = new LilyPondConverter(this.globalContext);
    const parsedObject = parser.read(input);
    return parsedObject;
  }



  getGlobalContext(): GlobalContext {
    for (const key in this.constRes.variables) {
        if (this.constRes.variables.hasOwnProperty(key)) {
            const val = this.constRes.variables[key];
            try {
                const score = this.loadFromLily(val);
                const voice = score.staffElements[0].voiceElements[0];
                this.globalContext.addVariable(key, voice.getSequence('0'));
            } catch (_) { }
        }
    }
      return this.globalContext;
  }

  dummy() {
/*
    function appendObjToList(listId, obj) {
      //  alert("append");
        var list = document.getElementById(listId);
        for(var v in obj) {
            var $li = $("<li>").appendTo(list);

            $li.text(v).data("name", v).click(function(ev) {
                var $target = $(ev.target);
                var name = $target.data("name");
                var data = obj[name];
                $(vartext).val(data).data("varName", $target.text()).data("obj", obj);
            });
        }
    }
    //alert("b");

        for(var v in data.sections) {
            $('<option>').text(v).val("sections_"+v).appendTo("#sectionChooser");
            var $li = $("<li>").appendTo("#sections");
            var $list = $("<ul>").appendTo($li).attr("id", "sections_"+v);
            appendObjToList("sections_"+v, data.sections[v].voices);
        }

    $("#sectionChooser").change(function(){
        var v = $("#sectionChooser").val();
        $("#sections>li").hide();
        $("#" + v).parent().show();
    });
    //alert("c");
    $("#sections>li").hide();
    if (data.voices.sections.length){
        $("#sectionChooser").val("sections_" + data.voices.sections[0]);
        $("#sections_" + data.voices.sections[0]).parent().show();
    }

    elm.value = JSON.stringify(data);

    $("#addNewVar").click(function(){
        //alert("click");
        var name= $("#newVar").val();
        data.variables[name] = "";
        $("#variables").empty();
        appendObjToList("variables", data.variables);
        $(elm).val(JSON.stringify(data));
    });
    //alert("d");

    $("#sectionlist").val(data.voices.sections.join("\n")).change(function(){
        data.voices.sections = $("#sectionlist").val().split("\n");
        $(elm).val(JSON.stringify(data));
    });
    $("#voices").val(data.voices.voices.join("\n")).change(function(){
        data.voices.voices = $("#voices").val().split("\n");
        $(elm).val(JSON.stringify(data));
    });

    $("#opretSecVoices").click(function(){
        var changed = false;
        for(var j = 0; j < data.voices.sections.length; j++) {
            var section = data.voices.sections[j];
            if (!data.sections[section]){
                data.sections[section] = {voices: {}};
                changed = true;
            }
            var theSection = data.sections[section];
            for(var i = 0; i < data.voices.voices.length; i++) {
                var voice = data.voices.voices[i];
                if (!theSection.voices[voice + section]){
                    theSection.voices[voice + section] = "{ }";
                    changed = true;
                }
            }
        }
        if (changed) $(elm).val(JSON.stringify(data));

    });*/
      }



}
