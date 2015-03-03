module jMusicScore {
    export module MusicXml {

        /* todo:

        Beethoven:
            Forslag
            Taktart i staff
            Expressions
            Legatobuer
            Titler m.m.
        */

        export class MusicXmlReader implements UtMiLa.IReaderPlugIn {
            private app: UtMiLa.Application;

            Init(app: UtMiLa.Application) {
                this.app = app;
            }

            GetId(): string {
                return "MusicXMLReader";
            }
            public Supports(type: string): boolean {
                return type === "MusicXML";
            }

            static getChildValue(elm: Element, childTag: string, defVal: string): string {
                var childElms = elm.getElementsByTagName(childTag);
                if (childElms.length) return childElms[0].textContent;
                return defVal;
            }

            private ImportNote(elm: Element, staves: Model.StaffElement[], partAttr: any, absTime: number): number {
                var voiceNo = parseInt(MusicXmlReader.getChildValue(elm, "voice", "1")) - 1;

                var staffNo = parseInt(MusicXmlReader.getChildValue(elm, "staff", "1"));
                var staff = staves[staffNo - 1];

                while (staff.voiceElements.length <= voiceNo) {
                    staff.addVoice();
                }
                var voice = staff.voiceElements[voiceNo];

                // todo: get all of these from elm
                /*
                <note>
                    <pitch>
                        <step>E</step>
                        <octave>5</octave>
                    </pitch>
                    <duration>1</duration>
                    <voice>1</voice>
                    <type>eighth</type>
                    <stem>down</stem>
                </note>
                <note>
                    <rest/>
                    <duration>1</duration>
                    <voice>1</voice>
                    <type>eighth</type>
                </note>
                */
                var noteTypes = {
                    "1024th": "1_1024",
                    "512th": "1_512",
                    "256th": "1_256",
                    "128th": "1_128",
                    "64th": "1_64",
                    "32nd": "1_32",
                    "16th": "1_16",
                    "eighth": "1_8",
                    "quarter": "1_4",
                    "half": "1_2",
                    "whole": "1_1",
                    "breve": "2_1",
                    "long": "4_1",
                    "maxima": "8_1"
                };
                var noteTimes = {
                    "1_1024": 0.25,
                    "1_512": 0.5,
                    "1_256": 1,
                    "1_128": 2,
                    "1_64": 4,
                    "1_32": 8,
                    "1_16": 16,
                    "1_8": 32,
                    "1_4": 64,
                    "1_2": 128,
                    "1_1": 256,
                    "2_1": 512,
                    "4_1": 1024,
                    "8_1": 2048
                };
                var notations = elm.getElementsByTagName("notations");
                var notationList = [];
                var tie = false;
                if (notations.length) {
                    var notation = <Element>notations[0];
                    var tiedElm = notation.getElementsByTagName("tied");
                    if (tiedElm.length) {
                        // <tied orientation = "over" type ="start"/ >
                        if (tiedElm[0].attributes['type'].textContent === "start") tie = true;
                    }
                }

                var grace = elm.getElementsByTagName("grace").length > 0;

                var noteName = noteTypes[MusicXmlReader.getChildValue(elm, "type", "quarter")];
                if (noteName == undefined) {
                    alert("");
                }
                var noteTime = noteTimes[noteName];

                var chord = elm.getElementsByTagName("chord").length > 0;
                var rest = elm.getElementsByTagName("rest").length > 0;
                var measureRest = false;
                if (rest) {
                    var restElm = elm.getElementsByTagName("rest")[0];
                    var measureRestAttr = restElm.attributes['measure'];
                    measureRest = measureRestAttr && measureRestAttr.textContent === "yes";
                    if (measureRest) {
                        noteName = "1_1";
                        var duration = parseInt(MusicXmlReader.getChildValue(elm, "duration", "free"));
                        noteTime = (duration * 64) / partAttr['divisions'];
                    }
                }

                var dots = elm.getElementsByTagName("dot").length;
                var pitchElms = elm.getElementsByTagName("pitch");
                var direction = MusicXmlReader.getChildValue(elm, "stem", "free");

                var pitches = [];
                for (var i = 0; i < pitchElms.length; i++) {
                    var pitchElm = <Element>pitchElms[i];
                    var step = MusicXmlReader.getChildValue(pitchElm, "step", "C");
                    var stepVal = "CDEFGAB".indexOf(step);
                    var alter = parseInt(MusicXmlReader.getChildValue(pitchElm, "alter", "0"));
                    var octave = parseInt(MusicXmlReader.getChildValue(pitchElm, "octave", "0")) - 4;
                    pitches.push(new Model.Pitch(stepVal + 7 * octave, Model.Pitch.alterationInts[alter + 2]));
                }
                var note: Model.NoteElement;
                if (chord) {
                    note = voice.noteElements[voice.noteElements.length - 1];
                }
                else {
                    note = new Model.NoteElement(null, 'n' + noteName, noteTime);
                    note.setParent(voice);
                    note.setRest(rest);
                    note.setDots(dots);
                    note.absTime = absTime;
                    if (grace) note.graceType = "normal";
                    if (voice.getEndTime() < absTime) {
                        var restNote = new Model.NoteElement(null, 'hidden', absTime - voice.getEndTime());
                        restNote.setParent(voice);
                        restNote.setRest(true);
                        restNote.absTime = 0;
                        voice.addChild(voice.noteElements, restNote, null, false);
                    }
                    voice.addChild(voice.noteElements, note, null, false);
                }

                var lyricsElms = elm.getElementsByTagName("lyric");
                for (var i = 0; i < lyricsElms.length; i++) {
                    var syllabic = MusicXmlReader.getChildValue(<Element>lyricsElms[i], "syllabic", "single"); // single, begin, middle, end
                    var text = MusicXmlReader.getChildValue(<Element>lyricsElms[i], "text", "");
                    if (syllabic === "begin" || syllabic === "middle") text += '-';
                    var syllElm = new Model.TextSyllableElement(note, text);
                    note.addChild(note.syllableElements, syllElm);
                }

                if (direction === "down") { note.setStemDirection(Model.Enum.stemDirectionType.stemDown); }
                else if (direction === "up") { note.setStemDirection(Model.Enum.stemDirectionType.stemUp); }

                for (var i = 0; i < pitches.length; i++) {
                    var p = note.setPitch(pitches[i]);
                    p.tie = tie;
                }

                if (chord) {
                    return absTime;
                }
                else {
                    /*if (voiceNo === 2) {
                        $('<li>').text(absTime).appendTo('#events');
                    }*/
                    return absTime + note.getTimeVal();
                }
            }

            private ImportPartwise(doc: XMLDocument) {
                var parts = doc.getElementsByTagName("part");
                //this.app.score.setMeter(3, 4, 0); // todo: chg
                for (var i = 0; i < parts.length; i++) {
                    var part = <Element>parts[i];
                    var partId = part.attributes['id'].textContent;
                    var partAttr = {
                        clef: []
                    };
                    var staff = this.app.score.addStaff("g");
                    var partStaves = [staff];
                    var absTime = 0;
                    staff.title = partId;
                    var measures = part.getElementsByTagName('measure');
                    for (var j = 0; j < measures.length; j++) {
                        var measure = <Element>measures[j];
                        var measureNo = measure.attributes['number'].textContent;
                        for (var k = 0; k < measure.childNodes.length; k++) {
                            var child = measure.childNodes[k];
                            if (child.nodeType === 1) {
                                var elm = <Element>child;
                                if (elm.tagName === "attributes") {
                                    partAttr['divisions'] = MusicXmlReader.getChildValue(elm, "divisions", partAttr['divisions']);

                                    partAttr['staves'] = MusicXmlReader.getChildValue(elm, "staves", "1");
                                    if (partAttr['staves']) partAttr['staves'] = parseInt(partAttr['staves']);

                                    var clefElms = elm.getElementsByTagName('clef');
                                    for (var iClef = 0; iClef < clefElms.length; iClef++) {
                                        var clefElm = <Element>clefElms[iClef];

                                        var no = clefElm.attributes['number'];
                                        if (no) no = parseInt(no.textContent); else no = 1;

                                        partAttr['clef'][no] = {
                                            sign: MusicXmlReader.getChildValue(clefElm, "sign", "g"),
                                            line: MusicXmlReader.getChildValue(clefElm, "line", "0")
                                        };
                                    }
                                    while (partStaves.length < partAttr['staves']) {
                                        var clef: string = partAttr['clef'][partStaves.length + 1].sign;
                                        partStaves.push(this.app.score.addStaff(clef.toLowerCase()));
                                    }

                                    var keyElms = elm.getElementsByTagName('key');
                                    if (keyElms.length) {
                                        partAttr['key'] = {
                                            fifths: parseInt(MusicXmlReader.getChildValue(<Element>keyElms[0], "fifths", "0")),
                                            mode: MusicXmlReader.getChildValue(<Element>keyElms[0], "mode", "major")
                                        };
                                        var fifths: number = partAttr['key'].fifths;
                                        if (partAttr['key'].fifths < 0) {
                                            this.app.score.withStaves((staff: Model.StaffElement, index: number) => {
                                                staff.setKey(-fifths, 'b', absTime);
                                            });
                                        }
                                        else if (partAttr['key'].fifths >= 0) {
                                            this.app.score.withStaves((staff: Model.StaffElement, index: number) => {
                                                staff.setKey(fifths, 'x', absTime);
                                            });
                                        }
                                    }

                                    var timeElms = elm.getElementsByTagName('time');
                                    if (timeElms.length) {
                                        partAttr['time'] = {
                                            beats: MusicXmlReader.getChildValue(<Element>timeElms[0], "beats", "4"),
                                            beatType: MusicXmlReader.getChildValue(<Element>timeElms[0], "beat-type", "4")
                                        };
                                        this.app.score.setMeter(partAttr['time'].beats, partAttr['time'].beatType, absTime);
                                    }
                                }
                                else if (elm.tagName === "sound") { }
                                else if (elm.tagName === "backup") {
                                    var duration = parseInt(MusicXmlReader.getChildValue(elm, 'duration', '1'));
                                    absTime -= (duration * 64) / partAttr['divisions'];
                                }
                                else if (elm.tagName === "forward") {
                                    var duration = parseInt(MusicXmlReader.getChildValue(elm, 'duration', '1'));
                                    var voiceNo = parseInt(MusicXmlReader.getChildValue(elm, 'voice', '1'));
                                    var staffNo = parseInt(MusicXmlReader.getChildValue(elm, 'staff', '1'));
                                    absTime += (duration * 64) / partAttr['divisions'];
                                }
                                else if (elm.tagName === "note") {
                                    absTime = this.ImportNote(elm, partStaves, partAttr, absTime);
                                }
                            }
                        }
                    }
                }
            }

            public Load(data: any) {
                // parse
                if (data.documentElement.tagName === "score-partwise") {
                    this.ImportPartwise(<XMLDocument>data);
                }
                else if (data.documentElement.tagName === "score-partwise") {
                }
            }
        }

    }
}