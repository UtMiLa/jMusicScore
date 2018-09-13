
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'

import { IMusicElement, IMeterSpacingInfo, IMeter, ScoreElement,
    IVisitor, IVoice, IStaff, IScore, ILongDecorationElement, ISpacingInfo, 
    IClefSpacingInfo, Point, INotehead, INote, INoteHeadSpacingInfo, INoteSpacingInfo,
    INoteDecorationElement, INoteDecorationSpacingInfo, IVoiceSpacingInfo, IKeySpacingInfo,
    IStaffSpacingInfo, IScoreSpacingInfo, ITextSyllableElement, ITextSyllableSpacingInfo, IBar, IBarSpacingInfo,
    IBeam, IBeamSpacingInfo, IStaffExpression, IStaffExpressionSpacingInfo, IClef, IKey, 
    NoteDecorationElement, TextSyllableElement,
    NoteLongDecorationElement, ITimedEvent, Music } from "./jm-model";    
import { IFileConverter } from './jm-interfaces';
import { IWriterPlugIn, IReaderPlugIn } from './jap-application';
import {  IScoreApplication, ScoreStatusManager, IScorePlugin } from './jm-application';



export class MusicXmlConverter implements IFileConverter {    
    read(data: any): IScore{
        /*if (typeof (data) === "string") {
            data = jQuery.parseXML(data);
        }*/

        var score = new ScoreElement(null);
        var helper = new MusicXmlHelper(score);

        // parse
        if (data.documentElement.tagName === "score-partwise") {
            helper.importPartwise(<XMLDocument>data);
        }
        else if (data.documentElement.tagName === "score-partwise") {
        }

        return score;
    }
    write(score: IScore): string{
        var helper = new MusicXmlHelper(score);
        return helper.getAsXml();
    }

}



        /* todo:

        Beethoven:
            Expressions
            Ped
            <>
            Titler m.m.

        Dichterliebe:
            Optakt! 
                Ved hver ny takt: tjek absTime. Hvis den ikke passer med taktarten, så sæt en speciel taktart (der ikke vises) i den nys afsluttede takt

        Adam:
            Bør øge afstanden mellem systemer med mange vers

        export: slur

        */

        class MusicXmlHelper {
            constructor(public document: IScore){
            }

            static noteTypes: { [index: string]: string } = {
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
            static noteTimes: { [index: string]: TimeSpan } = {
                "1_1024": new TimeSpan(1, 1024), 
                "1_512": new TimeSpan(1, 512), 
                "1_256": new TimeSpan(1, 256), 
                "1_128": new TimeSpan(1, 128), 
                "1_64": new TimeSpan(1, 64), 
                "1_32": new TimeSpan(1, 32), 
                "1_16": new TimeSpan(1, 16), 
                "1_8": new TimeSpan(1, 8), 
                "1_4": new TimeSpan(1, 4), 
                "1_2": new TimeSpan(1, 2), 
                "1_1": new TimeSpan(1, 1), 
                "2_1": new TimeSpan(2, 1), 
                "4_1": new TimeSpan(4, 1), 
                "8_1": new TimeSpan(8, 1)
            };

            static noteTypeToName(type: string): string {
                return this.noteTypes[type];
            }
            static noteNameToType(name: string): string {
                for (var type in this.noteTypes) {
                    if ("n" + this.noteTypes[type] === name) {
                        return type;
                    }
                }
                return null;
            }
            static noteNameToDuration(name: string): TimeSpan {
                return this.noteTimes[name];
            }



            static getChildValue(elm: Element, childTag: string, defVal: string): string {
                var childElms = elm.getElementsByTagName(childTag);
                if (childElms.length) return childElms[0].textContent;
                return defVal;
            }

            static getAttributeValue(elm: Element, name: string): string {
                var attr = elm.attributes.getNamedItem(name);
                if (attr) return attr.textContent;
                return null;
            }

            static withChildElements(elm: Element, f: (child: Element) => void) {
                var child: Element = elm.firstElementChild;
                while (child) {
                    f(child);
                    child = child.nextElementSibling;
                }
            }

            private slurs: { note: INote; placement: string; }[] = [];

            private importNote(elm: Element, context: ImportContext): void {
                var voiceNo = parseInt(MusicXmlHelper.getChildValue(elm, "voice", "1")) - 1;

                var staffNo = parseInt(MusicXmlHelper.getChildValue(elm, "staff", "1"));
                var staff = context.partStaves[staffNo - 1];

                while (staff.voiceElements.length <= voiceNo) {
                    staff.addVoice();
                }
                var voice = staff.voiceElements[voiceNo];

                var notat: { tied: boolean; decos: NoteDecorationKind[]; } = { tied: false, decos: [] }; 
                var grace = false;
                var chord = false; //elm.getElementsByTagName("chord").length > 0;
                var rest = false; //elm.getElementsByTagName("rest").length > 0;
                var measureRest = false;
                var duration = parseInt(MusicXmlHelper.getChildValue(elm, "duration", "free"));
                var dots = 0;                

                MusicXmlHelper.withChildElements(elm, (child: Element) => {
                    switch (child.tagName) {
                        case 'notations': notat = this.checkNoteNotations(child); break;
                        case 'grace': grace = true; break;
                        case 'chord': chord = true; break;
                        case 'dot': dots++; break;
                        case 'rest': rest = true; break;
                        case 'tie': if (MusicXmlHelper.getAttributeValue(child, 'type') === "start") notat.tied = true; break;
                    }
                });
                //var dots = elm.getElementsByTagName("dot").length;

                var noteName = MusicXmlHelper.noteTypeToName(MusicXmlHelper.getChildValue(elm, "type", "whole"));
                if (noteName == undefined) {
                    alert("");
                }
                var noteTime = MusicXmlHelper.noteNameToDuration(noteName);

                if (rest) {
                    var restElm = <Element>elm.getElementsByTagName("rest")[0];
                    var measureRestAttr = MusicXmlHelper.getAttributeValue(restElm, 'measure');//restElm.attributes.getNamedItem('measure');
                    measureRest = measureRestAttr === "yes";
                    if (measureRest) {
                        noteName = "1_1";
                    }
                    noteTime = new TimeSpan(duration, 4 * context.divisions).reduce();
                    switch (dots) {
                        case 1: noteTime = noteTime.multiplyRational(new Rational(2, 3)); break;
                        case 2: noteTime = noteTime.multiplyRational(new Rational(4, 9)); break;
                        case 3: noteTime = noteTime.multiplyRational(new Rational(8, 27)); break;
                    }
                }

                var pitchElms = elm.getElementsByTagName("pitch");
                var direction = MusicXmlHelper.getChildValue(elm, "stem", "free");

                var pitches: Pitch[] = [];
                for (var i = 0; i < pitchElms.length; i++) {
                    var pitchElm = <Element>pitchElms[i];
                    var step = MusicXmlHelper.getChildValue(pitchElm, "step", "C");
                    var stepVal = "CDEFGAB".indexOf(step);
                    var alter = parseInt(MusicXmlHelper.getChildValue(pitchElm, "alter", "0"));
                    var octave = parseInt(MusicXmlHelper.getChildValue(pitchElm, "octave", "0")) - 4;
                    pitches.push(new Pitch(stepVal + 7 * octave, Pitch.alterationInts[alter + 2]));
                }
                var tuplets = elm.getElementsByTagName("time-modification");
                var tupletdef: TupletDef = null;
                if (tuplets.length === 1) {
                    var tuplet = <Element>tuplets[0];
                    var actualNotes = parseInt(MusicXmlHelper.getChildValue(tuplet, "actual-notes", "0"));
                    var normalNotes = parseInt(MusicXmlHelper.getChildValue(tuplet, "normal-notes", "0"));
                    if (actualNotes && normalNotes) {
                        tupletdef = new TupletDef(null, new Rational(normalNotes, actualNotes));
                    }
                }
                var note: INote;
                if (chord) {
                    var noteElements = voice.getNoteElements();
                    note = noteElements[noteElements.length - 1];
                }
                else {
                    note = Music.addNote(voice, rest ? NoteType.Rest : NoteType.Note, context.absTime, 'n' + noteName, noteTime, null, true, dots, tupletdef);
                    /*new NoteElement(null, 'n' + noteName, noteTime);
                    note.setParent(voice);
                    note.setRest(rest);
                    note.setDots(dots);
                    note.absTime = absTime;*/
                    if (grace) note.graceType = "normal";
                    /*if (absTime.Gt(voice.getEndTime())) {
                        var restNote = new NoteElement(null, 'hidden', absTime.Diff(voice.getEndTime()));
                        restNote.setParent(voice);
                        restNote.setRest(true);
                        restNote.absTime = AbsoluteTime.startTime;
                        voice.addChild(voice.noteElements, restNote, null, false);
                    }*/
                    //voice.addChild(voice.noteElements, note, null, false);
                }

                var notations = elm.getElementsByTagName("notations"); // todo: to checkNotations
                if (notations.length) {
                    var notation = <Element>notations[0];
                    this.importSlurs(notation, note);
                }

                if (!chord) {
                    for (var i = 0; i < notat.decos.length; i++) {
                        note.addChild(note.decorationElements, new NoteDecorationElement(note, notat.decos[i]));
                    }
                }

                var lyricsElms = elm.getElementsByTagName("lyric");
                for (var i = 0; i < lyricsElms.length; i++) {
                    var syllabic = MusicXmlHelper.getChildValue(<Element>lyricsElms[i], "syllabic", "single"); // single, begin, middle, end
                    var text = MusicXmlHelper.getChildValue(<Element>lyricsElms[i], "text", "");
                    if (syllabic === "begin" || syllabic === "middle") text += '-';
                    var syllElm = new TextSyllableElement(note, text);
                    note.addChild(note.syllableElements, syllElm);
                }

                if (direction === "down") { note.setStemDirection(StemDirectionType.StemDown); }
                else if (direction === "up") { note.setStemDirection(StemDirectionType.StemUp); }

                for (var i = 0; i < pitches.length; i++) {
                    var p = note.setPitch(pitches[i]);
                    p.tie = notat.tied;
                }

                if (chord) {
                    //return context.absTime;
                }
                else {
                    context.forward(note.getTimeVal(), duration);
                    //return absTime.Add(note.getTimeVal());
                }
            }

            private checkNoteNotations(notation: Element): { tied: boolean; decos: NoteDecorationKind[]; } {
                var res = {
                    tied: false,
                    decos: <NoteDecorationKind[]>[],
                };

                for (var i = 0; i < notation.childNodes.length; i++) {
                    var def = <Element>notation.childNodes[i];
                    //if (def.nodeType ===) { }
                    var tag = def.tagName;
                    if (tag) {
                        if (['technical', 'ornaments', 'articulations'].indexOf(tag) > -1) {
                            // check all def's children
                            for (var i = 0; i < def.childNodes.length; i++) {
                                var note = <Element>def.childNodes[i];
                                if (note.tagName) {
                                    var decoDefs = <{ [index: string]: { type: string; code: NoteDecorationKind } }>{
                                        //articulations 
                                        'staccato': { type: 'short', code: NoteDecorationKind.Staccato },
                                        'staccatissimo': { type: 'short', code: NoteDecorationKind.Staccatissimo },
                                        'accent': { type: 'short', code: NoteDecorationKind.Marcato },
                                        'strong-accent': { type: 'short', code: NoteDecorationKind.Sforzato }, // eller omvendt?
                                        'tenuto': { type: 'short', code: NoteDecorationKind.Tenuto },
                                        'detached-legato': { type: 'short', code: NoteDecorationKind.Portato },
                                        //'spiccato' 'scoop' 'plop' 'doit''falloff'
                                        'breath-mark': { type: 'short', code: NoteDecorationKind.Rcomma }, //todo:?
                                        'caesura': { type: 'short', code: NoteDecorationKind.Caesura },
                                        /*'stress': { type: 'short', code: NoteDecorationKind.staccatissimo },
                                        'unstress': { type: 'short', code: NoteDecorationKind.staccatissimo },
                                        'other-articulation': { type: 'short', code: NoteDecorationKind.staccatissimo },*/

                                        // technical: 
                                        'up-bow': { type: 'short', code: NoteDecorationKind.Upbow },
                                        'down-bow': { type: 'short', code: NoteDecorationKind.Downbow },
                                        //'harmonic': { type: 'short', code: NoteDecorationKind. },
                                        'open-string': { type: 'short', code: NoteDecorationKind.Open },
                                        //'thumb-position': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'fingering': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'pluck': { type: 'short', code: NoteDecorationKind.upbow },
                                        //  'double-tongue': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'triple-tongue': { type: 'short', code: NoteDecorationKind.upbow },
                                        'stopped': { type: 'short', code: NoteDecorationKind.Stopped },
                                        //'snap-pizzicato': { type: 'short', code: NoteDecorationKind. },
                                        //'fret': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'string': { type: 'short', code: NoteDecorationKind.upbow },
                                        //  'hammer-on': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'pull-off': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'bend': { type: 'short', code: NoteDecorationKind.upbow },
                                        //'tap': { type: 'short', code: NoteDecorationKind.upbow },
                                        'heel': { type: 'short', code: NoteDecorationKind.Pedalheel },
                                        'toe': { type: 'short', code: NoteDecorationKind.Pedaltoe },
                                        /*'fingernails': { type: 'short', code: NoteDecorationKind.upbow },
                                    'hole': { type: 'short', code: NoteDecorationKind.upbow },
                                        'arrow': { type: 'short', code: NoteDecorationKind.upbow },
                                    'handbell: { type: 'short', code: NoteDecorationKind.upbow },
                                        'other-technical': { type: 'short', code: NoteDecorationKind.upbow },*/

                                        // ornaments:
                                        'trill-mark': { type: 'short', code: NoteDecorationKind.Trill },
                                        'turn': { type: 'short', code: NoteDecorationKind.Turn },
                                        'delayed-turn': { type: 'short', code: NoteDecorationKind.Turn },// todo:
                                        'inverted-turn': { type: 'short', code: NoteDecorationKind.Reverseturn },
                                        'delayed-inverted-turn': { type: 'short', code: NoteDecorationKind.Reverseturn },// todo:
                                        'vertical-turn': { type: 'short', code: NoteDecorationKind.Turn }, // todo:
                                        'shake': { type: 'short', code: NoteDecorationKind.Turn },// todo:
                                        'wavy-line': { type: 'short', code: NoteDecorationKind.Turn },//todo:
                                        'mordent': { type: 'short', code: NoteDecorationKind.Mordent },
                                        'inverted-mordent': { type: 'short', code: NoteDecorationKind.Prall },
                                        'schleifer': { type: 'short', code: NoteDecorationKind.Turn }, //?
                                        'tremolo': { type: 'short', code: NoteDecorationKind.Turn }, //?

                                    };
                                    var decoDef = decoDefs[note.tagName];
                                    if (decoDef) {
                                        if (decoDef.type === 'short') {
                                            res.decos.push(decoDef.code);
                                        }
                                    }
                                }
                            }
                        }
                        else if (tag === 'tied') {
                            // <tied orientation = "over" type ="start"/ >
                            if (MusicXmlHelper.getAttributeValue(def, 'type') === "start") res.tied = true;
                        }
                        else if (tag === 'slur') {
                        }
                        else if (tag === 'tuplet') {
                        }
                        else if (tag === 'arpeggiate') {
                            //var dir = def.attributes.getNamedItem('direction');
                            if (MusicXmlHelper.getAttributeValue(def, 'direction') === "down")
                                res.decos.push(NoteDecorationKind.ArpeggioDown);
                            else
                                res.decos.push(NoteDecorationKind.Arpeggio);
                        }
                        else if (tag === 'non-arpeggiate') {
                            res.decos.push(NoteDecorationKind.NonArpeggio);
                        }
                        else if (tag === 'glissando') {
                        } else if (tag === 'slide') {
                        } else if (tag === 'dynamics') {
                        } else if (tag === 'fermata') {
                            var type = MusicXmlHelper.getAttributeValue(def, 'type');
                            res.decos.push(NoteDecorationKind.Fermata);
                        } else if (tag === 'accidental-mark') {
                        }
                    }
                }

                return res;
            }

            private importSlurs(notation: Element, note: INote) {
                if (notation) {
                    var slurElements = notation.getElementsByTagName("slur");
                    for (var i = 0; i < slurElements.length; i++) {
                        var slurElement = <Element>slurElements[i];
                        var slurNumber = parseInt(MusicXmlHelper.getAttributeValue(slurElement,'number')); // 1 ...
                        //var slurPlacement = MusicXmlReader.getAttributeValue(slurElement,'placement'); // above - below
                        var slurType = MusicXmlHelper.getAttributeValue(slurElement, 'type'); // start - stop - continue
                        if (slurType === 'start') {
                            var placement: string = null;
                            var placeAttr = MusicXmlHelper.getAttributeValue(slurElement, 'placement');
                            //var placementAttr = slurElement.attributes.getNamedItem('placement');
                            //if (placementAttr) {
                            if (placeAttr === 'above') placement = "over";
                            else if (placeAttr === 'below') placement = "under";
                            //}
                            this.slurs[slurNumber] = { note: note, placement: placement };
                        }
                        else if (slurType === 'stop') {
                            var fromSlur = this.slurs[slurNumber];
                            if (fromSlur) { // todo: slurs kan godt gå fra en senere defineret stemme til denne node
                                var fromNote = fromSlur.note;
                                var nd = new NoteLongDecorationElement(fromNote, note.absTime.diff(fromNote.absTime), LongDecorationType.Slur);
                                nd.placement = fromSlur.placement;
                                fromNote.addChild(fromNote.longDecorationElements, nd);
                            }
                        }
                    }
                }
            }

            public importPartwise(doc: XMLDocument) {
                var parts = doc.getElementsByTagName("part");
                var context = new ImportContext();
                for (var i = 0; i < parts.length; i++) {
                    var part = <Element>parts[i];
                    var partId = MusicXmlHelper.getAttributeValue(part, 'id');

                    var staff = this.document.addStaff(ClefDefinition.clefG);
                    context.partStaves = [staff];
                    context.goToStart();
                    var absTimeLastBar = AbsoluteTime.startTime;
                    //var absMeasureTime = new TimeSpan(0, 1);
                    staff.title = partId;
                    var measures = part.getElementsByTagName('measure');
                    for (var j = 0; j < measures.length; j++) {
                        context.newMeasure();
                        var measure = <Element>measures[j];
                        var measureNo = MusicXmlHelper.getAttributeValue(measure, 'number');
                        var lastBarTime = context.absTime.diff(absTimeLastBar);

                        var staffContext = staff.getStaffContext(absTimeLastBar);
                        if (staffContext.meter && j > 0) {
                            // Check whether last bar time is equal to meter time
                            var nextBar = staffContext.meter.nextBar(absTimeLastBar, staffContext.meterTime);
                            if (!nextBar.eq(context.absTime)) {
                                if (j === 1) {
                                    // Create offset meter in last bar
                                    var defi = <RegularMeterDefinition>staffContext.meter;
                                    this.document.setMeter(new OffsetMeterDefinition(defi.numerator, defi.denominator, context.absTime.diff(absTimeLastBar)), absTimeLastBar);
                                    staffContext = staff.getStaffContext(absTimeLastBar);
                                    nextBar = staffContext.meter.nextBar(absTimeLastBar, staffContext.meterTime);
                                }
                                else {
                                    context.absTime = nextBar;// todo: check
                                }
                                if (!nextBar.eq(context.absTime)) {
                                    alert("problem!");
                                }
                            }
                        }
                        absTimeLastBar = context.absTime;
                        Music.setBar(staff, context.absTime);

                        MusicXmlHelper.withChildElements(measure, (elm: Element) => {
                            switch (elm.tagName) {
                                case "attributes":
                                    //partAttr.divisions = MusicXmlHelper.getChildValue(elm, "divisions", partAttr.divisions);
                                    context.divisions = parseInt(MusicXmlHelper.getChildValue(elm, "divisions", '' + context.divisions));

                                    context.staves = parseInt(MusicXmlHelper.getChildValue(elm, "staves", "1"));

                                    var clefElms = elm.getElementsByTagName('clef');
                                    for (var iClef = 0; iClef < clefElms.length; iClef++) {
                                        var clefElm = <Element>clefElms[iClef];

                                        var noAttr = MusicXmlHelper.getAttributeValue(clefElm, 'number');
                                        var no: number;
                                        if (noAttr !== null) no = parseInt(noAttr); else no = 1;

                                        context.clef[no] = {
                                            sign: MusicXmlHelper.getChildValue(clefElm, "sign", "g"),
                                            line: parseInt(MusicXmlHelper.getChildValue(clefElm, "line", "0")),
                                            octaveChange: parseInt(MusicXmlHelper.getChildValue(clefElm, 'clef-octave-change', "0"))
                                        };
                                    }

                                    for (var iClef = 0; iClef < context.staves; iClef++) {
                                        var clef: string = context.clef[iClef + 1].sign;
                                        var clefTransposition = context.clef[iClef + 1].octaveChange || 0;
                                        clefTransposition *= 7;
                                        var clefLine = 1;
                                        if (context.clef[iClef + 1].line) clefLine = 6 - context.clef[iClef + 1].line;
                                        var clefDef = new ClefDefinition(ClefDefinition.clefNameToType(clef), clefLine, clefTransposition);
                                        if (iClef >= context.partStaves.length) {
                                            context.partStaves.push(this.document.addStaff(clefDef));
                                        }
                                        else {
                                            var oldClef = context.partStaves[iClef].getStaffContext(context.absTime).clef;
                                            if (!oldClef.eq(clefDef)) {
                                                context.partStaves[iClef].setClef(clefDef, context.absTime);
                                            }
                                        }
                                    }

                                    var keyElms = elm.getElementsByTagName('key');
                                    if (keyElms.length) {
                                        context.key = {
                                            fifths: parseInt(MusicXmlHelper.getChildValue(<Element>keyElms[0], "fifths", "0")),
                                            mode: MusicXmlHelper.getChildValue(<Element>keyElms[0], "mode", "major")
                                        };
                                        var fifths: number = context.key.fifths;
                                        var keyDef: IKeyDefinition = (context.key.fifths < 0) 
                                            ? new RegularKeyDefinition('b', -fifths)
                                            : new RegularKeyDefinition('x', fifths);
                                        for (var iKey = 0; iKey < context.staves; iKey++) {
                                            if (iKey < context.partStaves.length) {
                                                    context.partStaves[iKey].setKey(keyDef, context.absTime);
                                            }
                                        }
                                    }
                                    /*
                                    Se:
                                    https://github.com/Philomelos/lilypond-musicxml2ly-dev/blob/master/MusicXML-TestSuite/46d-PickupMeasure-ImplicitMeasures.xml
                                    for optakt og lign.
                                    */

                                    var timeElms = elm.getElementsByTagName('time');
                                    if (timeElms.length) {
                                        context.meter = {
                                            beats: parseInt(MusicXmlHelper.getChildValue(<Element>timeElms[0], "beats", "4")),
                                            beatType: parseInt(MusicXmlHelper.getChildValue(<Element>timeElms[0], "beat-type", "4"))
                                        };
                                        this.document.setMeter(new RegularMeterDefinition(context.meter.beats, context.meter.beatType), context.absTime);
                                    }
                                    break;
                                case "sound": break;
                                case "backup":
                                    var duration = parseInt(MusicXmlHelper.getChildValue(elm, 'duration', '1'));
                                    context.backward(new TimeSpan(duration, 4 * context.divisions/*partAttr['divisions']*/), duration);
                                    break;
                                case "forward":
                                    var duration = parseInt(MusicXmlHelper.getChildValue(elm, 'duration', '1'));
                                    var voiceNo = parseInt(MusicXmlHelper.getChildValue(elm, 'voice', '1'));
                                    var staffNo = parseInt(MusicXmlHelper.getChildValue(elm, 'staff', '1'));
                                    context.forward(new TimeSpan(duration, 4 * context.divisions), duration);
                                    break;
                                case "note":
                                    this.importNote(elm, context);
                                    break;
                                case "directions":
                                    // todo: score expressions
                                    break;
                                /*                
                      <direction placement="below">
                        <direction-type>
                          <wedge default-y="-70" spread="0" type="crescendo"/>
                        </direction-type>
                        <staff>1</staff>
                      </direction>
                      <direction>
                        <direction-type>
                          <wedge spread="15" type="stop"/>
                        </direction-type>
                        <offset>-8</offset>
                        <staff>1</staff>
                      </direction>

                      <direction placement="below">
                        <direction-type>
                          <wedge default-y="-70" spread="15" type="diminuendo"/>
                        </direction-type>
                        <staff>1</staff>
                      </direction>
                      <direction>
                        <direction-type>
                          <wedge spread="0" type="stop"/>
                        </direction-type>
                        <offset>-17</offset> (målt i divisions)
                        <staff>1</staff>
                      </direction>                                
                                */
                            }
                        });                        
                    }
                    Music.setBar(staff, context.absTime);
                }
            }
/*************************************************Writer methods ****************************************/
            private doc: XMLDocument;

            public getAsXml() {
                // use this document for creating XML
                this.doc = document.implementation.createDocument(null, null, null);
                this.findDivision();
                var xml = this.doc.createElement('score-partwise');
                this.addPartList(xml);
                this.addParts(xml);
                var s = new XMLSerializer().serializeToString(xml);
                return s;
            }

            private smallestDivision = 1;

            private findDivision() {
                var events: ITimedEvent[] = this.document.getEvents();
                var commonDenominator: number = 1;
                for (var i = 0; i < events.length; i++) {
                    commonDenominator *= events[i].absTime.denominator / Rational.gcd(commonDenominator, events[i].absTime.denominator);
                    //commonDenominator = Rational.gcd(commonDenominator, events[i].absTime.denominator);
                }
                this.smallestDivision = commonDenominator; //2048 / division;
            } // todo: test!


            /*static smallestDivisor(d1: number, d2: number): number {
                if (d1 < d2) { var d = d1; d1 = d2; d2 = d; }
                if (d2 == 0) return d1;
                var remainder: number = d1 % d2;
                if (remainder) {
                    return this.smallestDivisor(d2, remainder);
                }
                else return d2;
            }*/

            private addPartList(scorePartwise: Element) {
                var partList = this.addChildElement(scorePartwise, 'part-list');
                
                for (var i = 0; i < this.document.staffElements.length; i++) {
                    var part = this.addChildElement(partList, 'score-part');
                    part.setAttribute('id', 'P' + i);
                    
                    var name = this.addChildElement(part, 'part-name', 'Staff ' + i);
                }
            }

            private addParts(scorePartwise: Element) {
                for (var i = 0; i < this.document.staffElements.length; i++) {
                    var part = this.addChildElement(scorePartwise, 'part');
                    part.setAttribute('id', 'P' + i);
                    var name = this.addChildElement(part, 'part-name', 'Staff ' + i);
                    this.addMeasures(part, this.document.staffElements[i]);
                }
            }

            private addMeasures(part: Element, staffElement: IStaff) {
                var absTime = AbsoluteTime.startTime;
                for (var i = 0; i < this.document.bars.length; i++) {
                    var bar = this.document.bars[i];
                    var measure = this.addChildElement(part, 'measure');
                    measure.setAttribute('number', "" + (i + 1));

                    var startTime = !i ? AbsoluteTime.startTime : this.document.bars[i - 1].absTime;
                    var endTime = i === this.document.bars.length - 1 ? AbsoluteTime.infinity : this.document.bars[i].absTime;
                    var events = staffElement.getEvents(startTime, endTime);
                    events.sort(Music.compareEventsByVoice);

                    var str = "";
                    var updateMeter = false;
                    var updateKey = false;
                    var updateClef = false;
                    for (var j = 0; j < events.length; j++) {
                        var event = events[j];
                        if (event.getElementName() === "Clef") {
                            if (event.absTime.eq(startTime)) {
                                updateClef = true;
                            }
                            else {
                                // mid-measure clef change
                                this.addAttributes(measure, staffElement.getStaffContext(event.absTime), false, false, true, false);
                            }
                        }
                        else if (event.getElementName() === "Key") {
                            updateKey = true;
                        }
                        else if (event.getElementName() === "Meter") {
                            updateMeter = true;
                        }
                        else if (event.getElementName() === "Note") {
                            var note = <INote>event;
                            if (!note.absTime.eq(absTime)) {
                                // insert forward/back
                                if (absTime.gt(note.absTime)) {
                                    var backupElm = this.addChildElement(measure, 'backup');
                                    this.addChildElement(backupElm, 'duration', '' + (absTime.diff(note.absTime)).multiplyScalar(this.smallestDivision).numerator*4);// / 64);
                                }
                                absTime = note.absTime;
                            }

                            this.addNote(measure, note);
                            absTime = absTime.add(note.getTimeVal());

                            str += event.debug();
                        }
                        else {
                            str += event.debug();
                        }
                        
                    }
                    this.addAttributes(measure, staffElement.getStaffContext(startTime), updateMeter, updateKey, updateClef);
                    //if (str) measure.setAttribute('content', str);

                }
            }

            private addNote(measure: Element, note: INote) {
                var noteXml = this.addChildElement(measure, 'note');

                if (note.rest) {
                    var restXml = this.addChildElement(noteXml, 'rest');
                    this.addNoteAttributes(noteXml, note, null);
                }
                else {
                    // pitch (første)
                    var head = note.noteheadElements[0];
                    this.addNoteAttributes(noteXml, note, head);
                }

                for (var i = 1; i < note.noteheadElements.length; i++) {
                    var head = note.noteheadElements[i];
                    noteXml = this.addChildElement(measure, 'note');
                    this.addNoteAttributes(noteXml, note, head, true);
                }

                /*
            <note default-x="139">
            <pitch>
            <step>E</step>
            <alter>-1</alter>
            <octave>4</octave>
            </pitch>
            <duration>2</duration>
            <voice>1</voice>
            <type>16th</type>
            <accidental>flat</accidental>
            <stem default-y="-50">down</stem>
            <beam number="1">continue</beam>
            <beam number="2">continue</beam>
            <lyric default-y="-80" justify="left" number="1">
            <syllabic>end</syllabic>
            <text font-size="11.3">ger</text>
            <extend type="start"/>
            </lyric>
            </note>
            
                */
            }

            private addNoteAttributes(noteXml: Element, note: INote, head: INotehead, chord: boolean = false) {
                /* todo:
                    voice
                    beam
                    notations
                */
                if (chord) {
                    this.addChildElement(noteXml, 'chord');
                }
                var tie = false;

                if (note.dotNo) {
                    for (var k = 0; k < note.dotNo; k++) {
                        this.addChildElement(noteXml, 'dot');
                    }
                }


                // pitch
                if (head) {
                    var pitch = head.pitch;

                    var pitchXml = this.addChildElement(noteXml, 'pitch');

                    if (pitch.alteration) {
                        this.addChildElement(pitchXml, 'alter', "" + (Pitch.alterationInts.indexOf(pitch.alteration) - 2));
                    }


            //<accidental>flat</accidental>

                        //this.addChildElement(noteXml, 'accidental', acci);// flat sharp

                    var octave = Math.floor(pitch.pitch / 7);
                    var step = pitch.pitch - 7 * octave;

                    this.addChildElement(pitchXml, 'step', "CDEFGAB".charAt(step));

                    this.addChildElement(pitchXml, 'octave', "" + (octave + 4));

                    if (head.tie) {
                        var tieXml = this.addChildElement(noteXml, 'tie');
                        tieXml.setAttribute("type", "start");
                        tie = true;
                    }
                }
                this.addChildElement(noteXml, 'duration', "" + note.getTimeVal().multiplyScalar(this.smallestDivision).numerator*4); // * this.smallestDivision / 64);
                    
                var noteType = MusicXmlHelper.noteNameToType(note.NoteId);
                if (noteType) {
                    this.addChildElement(noteXml, 'type', noteType);
                }                    

                if (note.graceType === "normal") {
                    this.addChildElement(noteXml, 'grace');
                }

                // voice
                var voice = note.parent;
                var voiceIndex = voice.parent.voiceElements.indexOf(voice);
                if (voiceIndex >= 0) {
                    this.addChildElement(noteXml, 'voice', "" + (voiceIndex + 1));
                }

                // stem         <stem>up</stem> down, up, none, or double
                var stemDir = note.getStemDirection();
                var stem: string = null;
                if (stemDir === StemDirectionType.StemUp)
                {
                    stem = 'up';
                }
                else if (stemDir === StemDirectionType.StemDown)
                {
                    stem = 'down';
                }
                if (stem) {
                    this.addChildElement(noteXml, 'stem', stem);
                }

                if (chord) {
                    return;
                }

                if (!head) return;

                // beam

                // accidental

                // lyric
                if (note.syllableElements.length && !chord) {
                    var lyricXml = this.addChildElement(noteXml, 'lyric');
                    this.addChildElement(lyricXml, 'text', note.syllableElements[0].Text);
                }

                // notations
                if (tie) { // || articulations || ornaments || slur ...
                    var notationsXml = this.addChildElement(noteXml, 'notations');

                    if (tie) {
                        var tiedXml = this.addChildElement(noteXml, 'tied');
                        tiedXml.setAttribute("type", "start");
                    }

                }
                
                /*
                        <notations>
            <slur number="1" placement="above" type="start"/>
            </notations>

                        <notations>
            <articulations>
            <staccato default-y="-48" placement="below"/>
            </articulations>
            </notations>
                */
            }

            private addChildElement(element: Element, tag: string, text: string = null): Element {
                var childXml = this.doc.createElement(tag);
                if (text) {
                    childXml.textContent = text;
                }
                element.appendChild(childXml);
                return childXml;
            }

            private addAttributes(measure: Element, staffContext: StaffContext, updateMeter: boolean, updateKey: boolean, updateClef: boolean, first: boolean = true) {
                var attributes = this.doc.createElement('attributes');
                if (first) {
                    measure.insertBefore(attributes, measure.childNodes.length ? measure.childNodes[0] : null);
                }
                else {
                    measure.appendChild(attributes);
                }

                if (first) {
                    // divisions
                    var divisions = this.s('divisions', "" + this.smallestDivision);
                    attributes.appendChild(divisions);
                }
                // key
                if (updateKey) {
                    var keyDef = staffContext.key;
                    var regularDefinition = <RegularKeyDefinition>keyDef; // todo: change when NonStandardKeyDefinition is implemented
                    var key = this.s('key', this.s('fifths', "" + (regularDefinition.acci === 'b' ? -regularDefinition.number : regularDefinition.number)));
                    attributes.appendChild(key);
                }

                // time
                if (updateMeter) {
                    var timeDef = staffContext.meter;
                    var definition: any = timeDef;
                    if (definition.numerator) {
                        var time = this.s('time', this.s('beats', "" + definition.numerator), this.s('beat-type', "" + definition.denominator));
                    attributes.appendChild(time);
                    } // todo: else?
                }

                // clef
                if (updateClef) {
                    var clefDef = staffContext.clef;//MusicXmlWriter.clefDefs[staffContext.clef.clefCode];
                    var clef = this.s('clef', this.s('sign', clefDef.clefName().toUpperCase()), this.s('line', 6 - clefDef.clefLine));
                    attributes.appendChild(clef);
                }
            }

            // function that creates the XML structure
            public s(a: any, b: any = null, c: any = null) {
                var node = this.doc.createElement(arguments[0]), child: any;

                for (var i = 1; i < arguments.length; i++) {
                    child = arguments[i];
                    if (typeof child == 'number') {
                        child = '' + child;
                    }
                    if (typeof child == 'string') {
                        child = this.doc.createTextNode(child);
                    }
                    node.appendChild(child);
                }

                return node;
            }


        }

        class ImportContext {
            constructor() {
                this.measureDuration = 0;
                this.absTime = AbsoluteTime.startTime;
                this.measureTime = new TimeSpan(0, 1);
            }
            newMeasure() {
                this.measureDuration = 0;
                this.measureTime = new TimeSpan(0, 1);
            }
            goToStart() {
                this.measureDuration = 0;
                this.absTime = AbsoluteTime.startTime;
                this.measureTime = new TimeSpan(0, 1);
                //this.divisions = null;
                this.clef = [];
                this.meter = {beats: null, beatType: null};
                this.key = null;
            }
            forward(time: TimeSpan, duration: number) {
                if (duration) {
                    this.measureDuration += duration;
                    if (new TimeSpan(this.measureDuration, this.divisions*4).eq(this.measureTime))
                        return; // some implementations of tuplets inserts <forward> after tuplets with imprecise durations to synchronize time
                }
                if (time) {
                    this.absTime = this.absTime.add(time);
                    this.measureTime = this.measureTime.add(time);
                }
            }
            backward(time: TimeSpan, duration: number) {
                if (time) {
                    this.absTime = this.absTime.sub(time);
                    this.measureTime = this.measureTime.sub(time);
                }
                if (duration) this.measureDuration -= duration;
            }
            measureDuration: number;
            absTime: AbsoluteTime;
            measureTime: TimeSpan;
            currentNote: INote;
            currentStaff: IStaff;
            divisions: number;
            clef: { sign: string; line: number; octaveChange: number; }[];
            meter: { beats: number; beatType: number; };
            key: { fifths: number; mode: string };
            staves: number;
            partStaves: IStaff[];
        }
/*
        class MusicXmlReader implements IReaderPlugIn<ScoreElement, ScoreStatusManager> {
            //private app: IScoreApplication;
            private document: IScore;

            init(app: IScoreApplication) { this.document = app.document; }

            getId(): string {
                return "MusicXMLReader";
            }

            getFormats(): string[]{
                return [
                    "MusicXML"
                ]
            }

            public supports(type: string): boolean {
                return type === "MusicXML";
            }

            getExtension(type: string): string {
                return "xml";
            }


            public load(data: any) {
                if (typeof (data) === "string") {
                    data = jQuery.parseXML(data);
                }

                var helper = new MusicXmlHelper(this.document);
                // parse
                if (data.documentElement.tagName === "score-partwise") {
                    helper.importPartwise(<XMLDocument>data);
                }
                else if (data.documentElement.tagName === "score-partwise") {
                }
            }
        }
*/

/*
        export class MusicXmlWriter implements IWriterPlugIn<ScoreElement, ScoreStatusManager> {
            constructor() {
            }

            // todo: problems with attributes in bar 1 of Beethoven
            
            //private app: IScoreApplication;
            private document: IScore;

            init(app: IScoreApplication) { this.document = app.document; }

            getId(): string {
                return "XMLWriter";
            }

            getFormats(): string[] {
                return [
                    "MusicXML"
                ]
            }

            public supports(type: string): boolean {
                return type === "MusicXML";
            }

            getExtension(type: string): string {
                return "xml";
            }

            public save() {
                var helper = new MusicXmlHelper(this.document);
                return helper.getAsXml();
            }

        }



        export class MusicXmlPlugin implements IScorePlugin {
            constructor() {
            }

            public init(app: IScoreApplication) {
                app.addReader(new MusicXmlReader());
                app.addWriter(new MusicXmlWriter());
            }

            getId() {
                return "MusicXml";
            }
        }
    }*/
