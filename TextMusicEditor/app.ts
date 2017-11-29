import { Model } from "../jmusicscore/jMusicScore";
import { ScoreApplication } from "../jmusicscore/jMusicScore.Application";
import { Application } from "../JApps/application";
import { Validators } from "../jmusicscore/validators";
import { GhostElements } from "../jmusicscore/ghostElements";
import { SvgView } from "../jmusicscore/jMusicScore.SvgView";
import { Commands } from "../jmusicscore/commands";

declare var pegjs: any;

class JSONCleaner {
    public static cleanElement(type: string, element: Model.IMemento) {
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
    public static clean(json: Model.IMemento): Model.IMemento {
        JSONCleaner.cleanElement(json.t, json);
        var children = <Model.IMemento[]>[];
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
    var app = <ScoreApplication.IScoreApplication>new Application.AbstractApplication<Model.ScoreElement, ScoreApplication.ScoreStatusManager>(
        //$("#content"),
        new Model.ScoreElement(null),
        new ScoreApplication.ScoreStatusManager());

    app.addValidator(new Validators.UpdateBarsValidator());
    app.addValidator(new Validators.CreateTimelineValidator());
    app.addValidator(new Validators.JoinNotesValidator());
    app.addValidator(new Validators.SplitNotesValidator());
    app.addValidator(new Validators.BeamValidator());
    app.addValidator(new Validators.TieValidator());
    app.addValidator(new Validators.UpdateAccidentalsValidator());

    app.addValidator(new GhostElements.GhostsValidator());

    //app.addPlugin(new JMusicScore.CanvasView.CanvasViewer($('#svgArea')));
    app.addPlugin(new SvgView.SvgViewer($('#svgArea'), $("#appContainer")));
    $("#importmemento").click(() => {
        var txt = $("#jsoncode").val();
        app.document = <Model.IScore>Model.MusicElementFactory.recreateElement(null, JSON.parse(txt)); // memento format
        app.executeCommand({
            execute: (app: ScoreApplication.IScoreApplication) => { }
        });
    });

    $("#compile").click(() => {
        var text = $("#musicCode").text();
        var res = pegjs.parse(text, { /*"startRule": "Music" */});
        //alert(JSON.stringify(res));
        var m = JSONCleaner.clean(res[0]);
        $("#json").text(JSON.stringify(res));
        $("#jsoncode").val(JSON.stringify(m));
        app.document = <Model.IScore>Model.MusicElementFactory.recreateElement(null, m); // memento format
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => { }
            });
            var staff = app.document.addStaff(Model.ClefDefinition.clefG);
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
            app.executeCommand(new Commands.AddNoteCommand({
                noteName: "1_4",
                noteTime: new Model.TimeSpan(1, 4),
                grace: false,
                pitches: [new Model.Pitch(Model.Pitch.noteNames.indexOf("c"), Model.Pitch.intToStr(1))],
                voice: voice,
                absTime: voice.getEndTime(),
                rest: false,
                dots: 0,
                tuplet: undefined
            }));

            $("#json1").text(JSON.stringify(app.document.getMemento()));
    });
});