/// <reference path="jMusicScore.ts"/>
/// <reference path="application.ts"/>
/// <reference path="jMusicScore.Views.ts"/>
/// <reference path="jMusicScore.Spacing.ts"/>
module jMusicScore {
    export module Model {
        export interface ScoreValidator extends Application.IValidator<Model.IScore, ScoreApplication.ScoreStatusManager, JQuery> {}

        export class UpdateBarsValidator implements ScoreValidator {
            public Validate(app: ScoreApplication.ScoreApplication) {
                var score = app.document;
                var maxTime = AbsoluteTime.startTime;

                app.document.withBars((bar: IBar) => {
                    bar.setProperty("updating", true);
                });

                app.document.withStaves((staff: IStaff): void => {
                    staff.withVoices((voice: IVoice): void => {
                        voice.withNotes((note: INote): void => {
                            if (note.absTime.Add(note.timeVal).Gt(maxTime)) maxTime = note.absTime.Add(note.timeVal);
                        });
                    });
                });

                // maxTime sat

                var barTime = AbsoluteTime.startTime;

                // Find meter
                score.withMeters((meter: IMeter, iMeter: number): void => {
                    // Tjek at der er bars fra this.meterElements[iMeter].absTime til this.meterElements[iMeter + 1].absTime
                    var toTime = (iMeter === score.meterElements.length - 1) ? maxTime : score.meterElements[iMeter + 1].absTime;
                    // Tjek at der er bars fra this.meterElements[this.meterElements.length-1].absTime til maxTime 
                    while (toTime.Gt(barTime)) {
                        barTime = score.meterElements[iMeter].nextBar(barTime);

                        var bar = app.document.findBar(barTime);

                        if (bar) {
                            //score.bars[iBar].absTime = barTime;
                            bar.setProperty("updating", false);
                        }
                        else {
                            Model.Music.setBar(score, barTime);
                            //score.addChild(score.bars, new BarElement(score, barTime));
                        }
                    }
                });

                app.document.removeBars((bar: IBar) => {
                    return bar.getProperty("updating");
                });
            }
        }

        export class CreateTimelineValidator implements ScoreValidator {
            public Validate(app: ScoreApplication.ScoreApplication) {
                var score = app.document;
                //score.updateBars();
                var events: ITimedEvent[] = [];
                score.withStaves((staff: IStaff) => {
                    staff.withVoices((voice: IVoice) => {
                        var absTime = AbsoluteTime.startTime;
                        voice.withNotes((note: INote) => {
                            if (!note.absTime.Eq(absTime)) {
                                note.absTime = absTime;
                            }
                            absTime = absTime.Add(note.getTimeVal());
                            events.push(note);
                        });
                    });
                });

                /*for (var i = 0; i < score.getChildren().length; i++) {
                    for (var j = 0; j < score.getChild(i).getChildren().length; j++) {
                        var absTime = AbsoluteTime.startTime;
                        for (var k = 0; k < score.getChild(i).getChild(j).getChildren().length; k++) {
                            var note = score.getChild(i).getChild(j).getChild(k);
                            if (!note.absTime.Eq(absTime)) {
                                note.absTime = absTime;
                            }
                            absTime = absTime.Add(note.getTimeVal());
                            events.push(note);

                        }
                    }
                }*/
                //score.sendEvent({ type: MusicEventType.eventType.recalc, sender: score }); // create spacing
            }
        }

        export class UpdateAccidentalsValidator implements ScoreValidator {
            public Validate(app: ScoreApplication.ScoreApplication) {
                var currentKey: IKey = null;
                var pitchChanges: string[] = [];
                var pitchClassChanges: string[] = [];

                // for each staff:
                var scoreEvents: ITimedEvent[] = app.document.getEvents(true);
                app.document.withStaves((staff: IStaff, index: number): void => {
                    // get events (bar lines + notes + keys changes) sorted by absTime from all voices
                    var events = staff.getEvents();
                    events = events.concat(scoreEvents);
                    events.sort(Model.Music.compareEvents);
                    // for each event:
                    for (var iEvent = 0; iEvent < events.length; iEvent++) {
                        var event = events[iEvent];

                        // if bar line: reset all accidental changes
                        if (event.getElementName() === "Bar") {
                            pitchChanges = [];
                            pitchClassChanges = [];
                        }
                        // if key: change current key & reset all accidental changes
                        else if (event.getElementName() === "Key") {
                            currentKey = <IKey>event;
                            pitchChanges = [];
                            pitchClassChanges = [];
                        }
                        // if note:
                        else if (event.getElementName() === "Note") {
                            // for each pitch:
                            var note = <INote>event;
                            note.withHeads((head: INotehead, index: number): void => {
                                var alteration = head.pitch.alteration;
                                alteration = alteration ? alteration : "n";
                                var pitchAbsolute = head.pitch.pitch;
                                var pitchClass = head.pitch.pitch % 7;
                                head.showAccidental = false;

                                if (pitchClassChanges[pitchClass]) {
                                    // if current pitch class has accidental change != this pitch, showAccidental = true
                                    if (pitchClassChanges[pitchClass] !== alteration) {
                                        pitchClassChanges[pitchClass] = alteration;
                                        pitchChanges[pitchAbsolute] = alteration;
                                        head.showAccidental = true;
                                    }
                                    // if current pitch class has accidental change = this pitch but not absolute pitch = this pitch, showAccidental = true
                                    else if (pitchChanges[pitchAbsolute] !== alteration) {
                                        pitchChanges[pitchAbsolute] = alteration;
                                        head.showAccidental = true;
                                    }
                                }
                                else {
                                    // use Key element
                                    if (currentKey) {
                                        var fixedAlt = currentKey.getFixedAlteration(pitchAbsolute);
                                        // if current pitch class has no accidental change:
                                        // if this pitch has same alteration as current key: showAccidental = false
                                        // if this pitch has other alteration than current key: showAccidental = true & set accidental change = pitch & pitch class
                                        if (alteration !== fixedAlt) {
                                            pitchClassChanges[pitchClass] = alteration;
                                            pitchChanges[pitchAbsolute] = alteration;
                                            head.showAccidental = true;
                                        }
                                    }
                                    else {
                                        head.showAccidental = true;
                                    }

                                    // otherwise: showAccidental = false
                                }
                            });
                        }
                    }
                });
            }
        }

        export class JoinNotesValidator implements ScoreValidator {
            public Validate(app: ScoreApplication.ScoreApplication) {
                app.document.withStaves((staff: IStaff, index: number): void => {
                    staff.withVoices((voice: IVoice, index: number): void => {
                        voice.withNotes((note: INote, index: number): void => {
                            if (note.getProperty('autojoin')) {
                                var tiedNoteTotalDuration = Model.TimeSpan.infiniteNote;
                                note.withHeads((head: Model.INotehead, index: number) => {
                                    var tiedNoteheadTotalDuration = note.timeVal;
                                    while (head.tie) { // todo: check om tie er automatisk
                                        var nextHead = head.getProperty("tiedTo");
                                        if (nextHead) {
                                            tiedNoteheadTotalDuration = tiedNoteheadTotalDuration.Add(nextHead.parent.timeVal);
                                            head = nextHead;
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                    if (!tiedNoteheadTotalDuration.Gt(tiedNoteTotalDuration)) {
                                        tiedNoteTotalDuration = tiedNoteheadTotalDuration;
                                    }
                                });
                                if (tiedNoteTotalDuration.Eq(Model.TimeSpan.infiniteNote)) return;
                                if (tiedNoteTotalDuration.Gt(note.timeVal) && (tiedNoteTotalDuration.numerator === 1 || tiedNoteTotalDuration.numerator === 3 || tiedNoteTotalDuration.numerator === 7)) {
                                    var notes = SplitNotesValidator.BestNoteValues(tiedNoteTotalDuration);
                                    // join notes!
                                    var nextNote = Model.Music.nextNote(note);
                                    note.timeVal = note.timeVal.Add(nextNote.timeVal);
                                    note.withHeads((head: Model.INotehead, index: number) => {
                                        head.tie = head.getProperty("tiedTo").tie;
                                    });
                                    note.noteId = Music.calcNoteId(note.timeVal);
                                    note.setSpacingInfo(undefined);
                                    voice.removeChild(nextNote);
                                }
                            }
                        });
                    });
                });
            }
        }

        export class SplitNotesValidator implements ScoreValidator { //todo: tjek om der skiftes taktart inden noden ophører

            public static BestNoteValues(time: TimeSpan): Array<TimeSpan> {
                if (new TimeSpan(1, 1024).Gt(time)) {
                    throw "Bad time for note: " + time.ToString();
                }
                var res: TimeSpan[] = [];
                //var runningTime = 4096;
                var runningTime = new TimeSpan(8,1);
                while (runningTime.Gt(time)) {
                    runningTime = runningTime.DivideScalar(2);
                }
                if (runningTime.Eq(time)) { return [runningTime]; }
                
                /* try dots ?
                var dotTime = runningTime / 2;
                var totalDotTime = 0;
                var noDots = 0;
                while (runningTime + totalDotTime >= time) {
                    if (runningTime + totalDotTime === time) { return [runningTime + totalDotTime]; }
                    totalDotTime += dotTime;
                    dotTime /= 2;
                    noDots++;
                }*/

                return [runningTime].concat(this.BestNoteValues(time.Sub(runningTime)));
            }

            public Validate(app: ScoreApplication.ScoreApplication) {
                app.document.withStaves((staff: IStaff, index: number): void => {
                    staff.withVoices((voice: IVoice, index: number): void => {
                        voice.withNotes((note: INote, index: number): void => {
                            var staffContext = staff.getStaffContext(note.absTime);
                            if (staffContext.meter) {
                                var nextAbsTime = staffContext.meter.nextBar(note.absTime);
                                if (note.absTime.Add(note.getTimeVal()).Gt(nextAbsTime)) {
                                    // split note in 2 or more
                                    var timeFirstNotes: TimeSpan[];
                                    var timeLastNotes: TimeSpan[];
                                    if (note.noteId === 'hidden') {
                                        timeFirstNotes = [nextAbsTime.Diff(note.absTime)];
                                        timeLastNotes = [note.absTime.Add(note.getTimeVal()).Diff(nextAbsTime)];
                                    }
                                    else {
                                        // timeVal for first note = nextAbsTime - absTime
                                        timeFirstNotes = SplitNotesValidator.BestNoteValues(nextAbsTime.Diff(note.absTime)).reverse();
                                        // timeVal for second note = timeVal - nextAbsTime + absTime
                                        timeLastNotes = SplitNotesValidator.BestNoteValues(note.absTime.Add(note.getTimeVal()).Diff(nextAbsTime));
                                    }
                                    var notes = timeFirstNotes.concat(timeLastNotes);
                                    var absTime = note.absTime;
                                    var nextNote = Model.Music.nextNote(note);
                                    note.timeVal = notes[0];
                                    if (note.noteId !== 'hidden')
                                        note.noteId = Music.calcNoteId(note.timeVal);
                                    var alreadyAutojoin = note.getProperty('autojoin');
                                    note.setProperty('autojoin', true);
                                    note.dotNo = 0;
                                    note.withHeads((head: Model.INotehead, index: number) => {
                                        head.tie = true;
                                    });
                                    for (var i = 1; i < notes.length; i++) {
                                        absTime = absTime.Add(notes[i-1]);
                                        var newNote = Music.AddNote(note.parent,
                                            note.noteId === 'hidden' ? NoteType.placeholder : note.rest ? NoteType.rest : NoteType.note,
                                            absTime, note.noteId, notes[i]);

                                        // copy heads but not expressions and text
                                        var join = alreadyAutojoin || i < notes.length - 1;
                                        newNote.setProperty('autojoin', join);
                                        note.withHeads((head: Model.INotehead, index: number) => {
                                            var newHead = newNote.setPitch(head.pitch);
                                            // tie heads
                                            newHead.tie = join;
                                            newHead.setProperty('autojoin', join);
                                        });
                                    }
                                }
                            }
                        });
                    });
                });
            }
        }

        export class BeamValidator implements ScoreValidator {
            public Validate(app: ScoreApplication.ScoreApplication) {
                app.document.withStaves((staff: Model.IStaff) => {
                    staff.withVoices((voice: Model.IVoice) => {
                        this.ValidateVoice(voice);
                    });
                });
            }

            private ValidateVoice(voice: Model.IVoice) {
                var firstNotes: Model.INote[] = [];
                var noNotes: number[] = [0];

                function endGroup(fromIndex = 0) {
                    for (var i = fromIndex; i < firstNotes.length; i++) {
                        var firstnote = firstNotes[i];
                        if (firstnote) {
                            var bs = firstnote.getBeamspan();
                            if (noNotes[i] === 1) {
                                /*if (firstnote === firstNotes[0]) {*/
                                bs[i] = 1;
                                /*}
                                else {
                                    bs[i] = -1;
                                }*/
                            }
                            else {
                                bs[i] = noNotes[i];
                            }
                            firstnote.setBeamspan(bs);
                            firstNotes[i] = null;
                        }
                    }
                    firstNotes = firstNotes.slice(0, fromIndex);
                }

                var quarterNote = TimeSpan.quarterNote;
                var eighthNote = TimeSpan.eighthNote;
                var noOfGraceNotes = 0;
                voice.withNotes((note: INote) => {
                    /*for (var iNote = 0; iNote < voice.getChildren().length; iNote++) {
                        var note: INote = voice.getChild(iNote);*/
                    if (note.graceType) {
                        noOfGraceNotes++;
                        note.getHorizPosition().graceNo = noOfGraceNotes;
                        return;
                    }
                    var staffContext = voice.parent.getStaffContext(note.absTime);
                    // Check if current group is to end
                    //var splitTime = 4 % staffContext.timeInBar.denominator === 0);
                    if (!staffContext.meter) return;
                    var nextB = staffContext.meter.nextBoundary(note.absTime);
                    var splitTime = nextB.Eq(note.absTime);
                    if (firstNotes.length && (!quarterNote.Gt(note.timeVal) || splitTime || note.rest)) {
                        // End group
                        endGroup();
                    }
                    // Check if new group must begin
                    if (quarterNote.Gt(note.timeVal) && !note.rest) {
                        var index = 0;
                        var beamspan: number[] = [];
                        for (var v = eighthNote; v.Ge(note.timeVal); v = v.DivideScalar(2)) {
                            if (firstNotes[index]) {
                                //noNotes[index]++;
                                noNotes[index] += 1 + noOfGraceNotes;
                                beamspan[index] = -noNotes[index];
                            }
                            else {
                                // Begin group
                                firstNotes[index] = note;
                                noNotes[index] = 1;
                            }
                            index++;
                        }
                        noOfGraceNotes = 0;
                        // End group
                        endGroup(index);

                        note.setBeamspan(beamspan);
                    }
                    else {
                        if (note.getBeamspan()[0]) {
                            note.setBeamspan([0]);
                            for (var i = 0; i < note.Beams.length; i++) {
                                if (note.Beams[i]) note.Beams[i].parent = undefined;
                                note.Beams[i] = undefined;
                            }
                        }
                    }
                });
                endGroup();

                this.CheckSyncopeBeaming(voice);
                this.UpdateBeams(voice);
            }

            private CheckSyncopeBeaming(voice: Model.IVoice) {             
                for (var iNote = 0; iNote < voice.noteElements.length; iNote++) {
                    var note: INote = voice.noteElements[iNote];
                    var staffContext = voice.parent.getStaffContext(note.absTime);
                    var beamspan = note.getBeamspan();
                    for (var i = 1; i < beamspan.length; i++) {
                        if (beamspan[i] === 1 && beamspan[0] < 0) {
                            // check syncopation
                            // tjek om det er en synkope // 8 16* 8 *16 8  men 8 *16 4 16* 8 - måske skal designeren tjekke det!
                            var absTime = note.absTime;
                            var noteTime = note.timeVal;
                            var res = absTime.Diff(AbsoluteTime.startTime).Modulo(note.timeVal.MultiplyScalar(2));
                            // todo: check if last in beam group
                            var firstNote = voice.noteElements[iNote + beamspan[0] + 1];
                            var lastInBeamGroup = beamspan[0] + firstNote.getBeamspan()[0] === 0;
                            var syncopation = (res.numerator !== 0);
                            if (syncopation || lastInBeamGroup) {
                                beamspan[i] = -1;
                                note.setBeamspan(beamspan);
                            }
                        }
                    }
                }
            }

            private UpdateBeams(voice: Model.IVoice) {
                var beams: IBeam[] = [];
                for (var iNote = 0; iNote < voice.noteElements.length; iNote++) {
                    var note: INote = voice.noteElements[iNote];
                    var beamspan = note.getBeamspan();
                    for (var i = 0; i < beamspan.length; i++) {
                        if (beamspan[i] > 0 || beamspan[i] === -1) {
                            // check if Beam exists
                            var beam = note.Beams[i];
                            if (beam) {
                                if (beam.parent === note) {
                                    var toNote: INote;
                                    if (beamspan[i] === -1) {
                                        toNote = note;
                                    }
                                    else if (beamspan[i] === 1) {
                                        toNote = undefined;
                                    }
                                    else {
                                        toNote = voice.noteElements[iNote + beamspan[i] - 1];
                                    }
                                    // update beam
                                    if (note.Beams[i].toNote !== toNote) {
                                        note.Beams[i].toNote = toNote;
                                    }
                                    beams[i] = beam;
                                }
                                else {
                                    // delete beam and create new
                                    //beam.remove();
                                    //SvgView.SVGBeamDesigner.remove(beam, 'SVGcontext1');// todo: generaliser
                                    beam = undefined;
                                    note.Beams[i] = undefined;
                                }
                            }
                            if (!beam) {
                                // create new Beam
                                var toNote: INote;
                                if (beamspan[i] === -1) {
                                    toNote = note;
                                }
                                else if (beamspan[i] === 1) {
                                    toNote = undefined;
                                }
                                else {
                                    toNote = voice.noteElements[iNote + beamspan[i] - 1];
                                }
                                note.Beams[i] = new Model.BeamElement(note, toNote, i); // todo: toNote
                                beams[i] = note.Beams[i];
                            }
                        }
                        else if (beamspan[i] < -1) {
                            // connect to beam
                            var beam = note.Beams[i];
                            if (beam && beam !== beams[i]) {
                                //beam.remove();
                                //SvgView.SVGBeamDesigner.remove(beam, 'SVGcontext1');// todo: generaliser
                            }
                            note.Beams[i] = beams[i];
                        }
                        else {
                            // 0: clear beam
                            var beam = note.Beams[i];
                            if (beam && beam !== beams[i]) {
                                //beam.remove();
                                //SvgView.SVGBeamDesigner.remove(beam, 'SVGcontext1');// todo: generaliser
                            }
                            beams[i] = undefined;
                        }
                    }
                }
            }
        }


        export class TieValidator implements ScoreValidator {
            public Validate(app: ScoreApplication.ScoreApplication) {
                app.document.withVoices((voice: IVoice, index: number) => {
                    this.ValidateVoice(voice);
                });
            }

            private ValidateVoice(voice: Model.IVoice) {
                voice.withNotes((note: INote, index: number) => {
                    var nextNote = Model.Music.nextNote(note);
                        /*: NoteElement;
                    if (index < voice.noteElements.length - 1) {
                        nextNote = voice.noteElements[index + 1];
                    }
                    else {
                        nextNote = undefined;
                    }*/
                    note.withHeads((head: INotehead, index2: number) => {
                        if (head.tie) {
                            // update slurredTo property
                            head.setProperty("tiedTo", undefined);
                            if (nextNote) {
                                nextNote.withHeads((nextHead: INotehead, nextHeadIndex: number) => {
                                    if (nextHead.pitch.equals(head.pitch)) {
                                        head.setProperty("tiedTo", nextHead);
                                    }
                                });
                            }
                            // slurDirection afgøres af: 1. nodens retning 2. stemme 3. position i akkorden
                            if (index2 * 2 > note.noteheadElements.length) {
                                if (note.getProperty("stemDirection")) {
                                    head.setProperty("tieDirection", "DOWN");
                                }
                                else {
                                    head.setProperty("tieDirection", "UP");
                                }
                            }
                            else {
                                if (note.getProperty("tieDirection")) {
                                    head.setProperty("tieDirection", "UP");
                                }
                                else {
                                    head.setProperty("tieDirection", "DOWN");
                                }
                            }
                        }
                    });
                });

            }
        }

    }
}