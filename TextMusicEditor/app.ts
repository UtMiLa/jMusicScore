

$(() => {
    var app = <JMusicScore.ScoreApplication.IScoreApplication>new JApps.Application.AbstractApplication<JMusicScore.Model.ScoreElement, JMusicScore.ScoreApplication.ScoreStatusManager, JQuery>(
        $("#content"),
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

    var staff = app.document.addStaff(JMusicScore.Model.ClefDefinition.clefG);
    var voice = staff.addVoice();
    
    //app.addPlugin(new JMusicScore.CanvasView.CanvasViewer($('#svgArea')));
    app.addPlugin(new JMusicScore.SvgView.SvgViewer($('#svgArea')));

    $("#compile").click(() => {
        var text = $("#musicCode").text();
        var res = Lily.parser.parse(text, {});
        alert(JSON.stringify(res));
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
    });
});