declare var pegjs: any;

class JSONCleaner {
    public static cleanElement(type: string, element: JMusicScore.Model.IMemento) {
        switch (type) {
            case "Staff":
                // for hver voice:
                var clefExists = false;
                for (var i = 0; i < element.children.length; i++) {
                    var v = element.children[i];
                    if (v.t === "Voice") {
                        // find alle Meter, Clef og Key - fjern fra voice og tilføj til element
                        for (var j = v.children.length - 1; j >= 0; j--) {
                            var c = v.children[j];
                            if (c.t === "Key" || c.t === "Meter" || c.t === "Clef") {
                                element.children.push(c);
                                v.children.splice(j, 1);
                            }
                        }
                    }
                }
                for (var i = 0; i < element.children.length; i++) {
                    var v = element.children[i];
                    if (v.t === "Clef") {
                        clefExists = true;
                    }
                }

                if (!clefExists) {
                    element.children.push(
                        { "id": undefined, "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }); // g clef
                }

                break;
        }
    }
    public static clean(json: JMusicScore.Model.IMemento): JMusicScore.Model.IMemento {
        JSONCleaner.cleanElement(json.t, json);
        var children = <JMusicScore.Model.IMemento[]>[];
        if (json.children) {
            for (var i = 0; i < json.children.length; i++) {
                children.push(JSONCleaner.clean(json.children[i]));
            }
            json.children = children;
        }
        return json;
    }
}

$(() => {
    var app = <JMusicScore.ScoreApplication.IScoreApplication>new JApps.Application.AbstractApplication<JMusicScore.Model.ScoreElement, JMusicScore.ScoreApplication.ScoreStatusManager>(
        //$("#content"),
        new JMusicScore.Model.ScoreElement(null),
        new JMusicScore.ScoreApplication.ScoreStatusManager());

    app.addValidator(new JMusicScore.Model.UpdateBarsValidator());
    app.addValidator(new JMusicScore.Model.CreateTimelineValidator());
    app.addValidator(new JMusicScore.Model.JoinNotesValidator());
    app.addValidator(new JMusicScore.Model.SplitNotesValidator());
    app.addValidator(new JMusicScore.Model.BeamValidator());
    app.addValidator(new JMusicScore.Model.TieValidator());
    app.addValidator(new JMusicScore.Model.UpdateAccidentalsValidator());

    app.addValidator(new JMusicScore.GhostElements.GhostsValidator());

    //app.addPlugin(new JMusicScore.CanvasView.CanvasViewer($('#svgArea')));
    app.addPlugin(new JMusicScore.SvgView.SvgViewer($('#svgArea'), $("#appContainer")));
    $("#importmemento").click(() => {
        var txt = $("#jsoncode").val();
        app.document = <JMusicScore.Model.IScore>JMusicScore.Model.MusicElementFactory.recreateElement(null, JSON.parse(txt)); // memento format
        app.executeCommand({
            execute: (app: JMusicScore.ScoreApplication.IScoreApplication) => { }
        });
    });

    $("#compile").click(() => {
        var text = $("#musicCode").text();
        var res = pegjs.parse(text, { /*"startRule": "Music" */});
        //alert(JSON.stringify(res));
        var m = JSONCleaner.clean(res[0]);
        $("#json").text(JSON.stringify(res));
        $("#jsoncode").val(JSON.stringify(m));
        app.document = <JMusicScore.Model.IScore>JMusicScore.Model.MusicElementFactory.recreateElement(null, m); // memento format
            app.executeCommand({
                execute: (app: JMusicScore.ScoreApplication.IScoreApplication) => { }
            });
            var staff = app.document.addStaff(JMusicScore.Model.ClefDefinition.clefG);
            var voice = staff.addVoice();
    
        /*var notes = text.split(/\s+/);
        var s = "";
        var dur = 1;
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var res = /^(([a-hrs])(is|es|s|isis|eses|ses)?)(\d+)?(\.+)?$/.exec(note);
            if (res && res.length >= 5) {
                if (res[4]) {
                    dur = +(res[4]);
                }
                var dots = 0;
                var dotString = "";
                var alteration = 0;
                var alterationString = "";
                var pitches = [];
                if (res[3]) {
                    switch (res[3]) {
                        case "is": alteration = 1; break;
                        case "isis": alteration = 2; break;
                        case "es": case "s": alteration = -1; break;
                        case "eses": case "ses": alteration = -2; break;
                    }
                    alterationString = "; Alt: " + alteration;
                }
                var rest;
                switch (res[2]) {
                    case "s": case "r":
                        rest = true;
                        break;
                    default:
                        rest = false;
                        pitches.push(new JMusicScore.Model.Pitch(JMusicScore.Model.Pitch.noteNames.indexOf(res[2]), JMusicScore.Model.Pitch.intToStr(alteration)));
                        break;
                }
                if (res[5]) {
                    dots = res[5].length;
                    dotString = "; Dots: " + dots;
                }
                //var s = s + `Note: ${res[2]}${alterationString}; Dur: ${dur}${dotString}\n`;
                
                app.executeCommand(new JMusicScore.Model.AddNoteCommand({
                    noteName: "1_" + dur,
                    noteTime: new JMusicScore.Model.TimeSpan(1, dur),
                    grace: false,
                    pitches: pitches,
                    voice: voice,
                    absTime: voice.getEndTime(),
                    rest: rest,
                    dots: dots,
                    tuplet: undefined
                }));

            }
        }
        //alert(s);*/
            app.executeCommand(new JMusicScore.Model.AddNoteCommand({
                noteName: "1_4",
                noteTime: new JMusicScore.Model.TimeSpan(1, 4),
                grace: false,
                pitches: [new JMusicScore.Model.Pitch(JMusicScore.Model.Pitch.noteNames.indexOf("c"), JMusicScore.Model.Pitch.intToStr(1))],
                voice: voice,
                absTime: voice.getEndTime(),
                rest: false,
                dots: 0,
                tuplet: undefined
            }));

            $("#json1").text(JSON.stringify(app.document.getMemento()));
    });
});