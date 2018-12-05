import {AbsoluteTime, TimeSpan} from './jm-music-basics';
import { IBar, IScore, IVoice, IStaff, IMeter, IKey, INote, INoteSource, INoteContext, ITimedEvent, IBeam, INotehead, IGlobalContext,  IVoiceNote } from './model/jm-model-interfaces';
import {  Music,      BeamElement   } from "./model/jm-model";    
import { IScoreRefiner } from './jm-interfaces';

//module JMusicScore {
 /*   import {Model} from "./jMusicScore";
    import {Commands} from "./commands";
    import {Views} from "./jMusicScore.Views";
    import { ScoreApplication } from "./jMusicScore.Application";
    //import {UI} from "../jApps/Japps.ui";
    import {Application} from "../JApps/application";*/

    export module Validators {
        export interface IScoreValidator extends IScoreRefiner {}

        export class UpdateBarsValidator implements IScoreValidator {
            constructor(private globalContext: IGlobalContext) {}


            public refine(score: IScore) {
                var maxTime = AbsoluteTime.startTime;

                score.withBars((bar: IBar) => {
                    bar.setProperty("updating", true);
                });

                score.withStaves((staff: IStaff): void => {
                    staff.withVoices((voice: IVoice): void => {
                        voice.withNotes(this.globalContext, (note: INoteSource, context: INoteContext): void => {
                            if (context.absTime.add(note.timeVal).gt(maxTime)) maxTime = context.absTime.add(note.timeVal);
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
                    while (toTime.gt(barTime)) {
                        barTime = score.meterElements[iMeter].nextBar(barTime);

                        var bar = score.findBar(barTime);

                        if (bar) {
                            //score.bars[iBar].absTime = barTime;
                            bar.setProperty("updating", false);
                        }
                        else {
                            Music.setBar(score, barTime);
                            //score.addChild(score.bars, new BarElement(score, barTime));
                        }
                    }
                });

                score.removeBars((bar: IBar) => {
                    return bar.getProperty("updating");
                });
            }
        }

        export class CreateTimelineValidator implements IScoreValidator {
            constructor(private globalContext: IGlobalContext) {}

            public refine(score: IScore) {
                var events: ITimedEvent[] = [];
                score.withStaves((staff: IStaff) => {
                    staff.withVoices((voice: IVoice) => {
                        var absTime = AbsoluteTime.startTime;
                        voice.withNotes(this.globalContext, (note: INoteSource, context: INoteContext) => {
                            if (!context.absTime.eq(absTime)) {
                                context.absTime = absTime;
                            }
                            absTime = absTime.add(note.getTimeVal());
                            events.push(context);
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

        export class UpdateAccidentalsValidator implements IScoreValidator {
            constructor(private globalContext: IGlobalContext) {}

            public refine(score: IScore) {
                var currentKey: IKey = null;
                var pitchChanges: string[] = [];
                var pitchClassChanges: string[] = [];

                // for each staff:
                var scoreEvents: ITimedEvent[] = score.getEventsOld(this.globalContext, true);
                score.withStaves((staff: IStaff): void => {
                    // get events (bar lines + notes + keys changes) sorted by absTime from all voices
                    var events = staff.getEventsOld(this.globalContext);
                    events = events.concat(scoreEvents);
                    events.sort(Music.compareEventsOld);
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
                            var note = <IVoiceNote><any>event; // todo: problem
                            note.withHeads(this.globalContext, (head: INotehead): void => {
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
/*
        export class JoinNotesValidator implements IScoreValidator {
            public refine(score: IScore) {
                score.withStaves((staff: IStaff): void => {
                    staff.withVoices((voice: IVoice): void => {
                        voice.withNotes((note: INote): void => {
                            if (note.getProperty('autojoin')) {
                                var tiedNoteTotalDuration = TimeSpan.infiniteNote;
                                var noNotes = 1;
                                note.withHeads((head: INotehead) => {
                                    var tiedNoteheadTotalDuration = note.getTimeVal();
                                    var noNotesTmp = 1;
                                    while (head.tie) { // todo: check om tie er automatisk
                                        var nextHead = head.getProperty("tiedTo");
                                        // make sure tied notes have no decorations/text
                                        if (nextHead && !nextHead.parent.decorationElements.length && !nextHead.parent.syllableElements.length) {
                                            tiedNoteheadTotalDuration = tiedNoteheadTotalDuration.add(nextHead.parent.getTimeVal());
                                            head = nextHead;
                                            noNotesTmp ++;
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                    if (!tiedNoteheadTotalDuration.gt(tiedNoteTotalDuration)) {
                                        tiedNoteTotalDuration = tiedNoteheadTotalDuration;
                                        noNotes = noNotesTmp;
                                    }
                                });
                                if (tiedNoteTotalDuration.eq(TimeSpan.infiniteNote) || noNotes === 1) return;
                                if (tiedNoteTotalDuration.gt(note.timeVal) && (tiedNoteTotalDuration.numerator === 1 || tiedNoteTotalDuration.numerator === 3 || tiedNoteTotalDuration.numerator === 7)) {
                                    var bestNotes: TimeSpan[];
                                    var staffContext = staff.getStaffContext(note.absTime);
                                    if (staffContext.meter) {
                                        var nextAbsTime = staffContext.meter.nextBar(note.absTime, staffContext.meterTime);
                                        var beforeSplit = noNotes;
                                        var afterSplit = 0;
                                        if (note.absTime.add(tiedNoteTotalDuration).gt(nextAbsTime)) {
                                            // timeVal for first note = nextAbsTime - absTime
                                            var timeFirstNotes = SplitNotesValidator.bestNoteValues(nextAbsTime.diff(note.absTime)).reverse();
                                            // timeVal for second note = timeVal - nextAbsTime + absTime
                                            var timeLastNotes = SplitNotesValidator.bestNoteValues(note.absTime.add(tiedNoteTotalDuration).diff(nextAbsTime));
                                            beforeSplit = timeFirstNotes.length;
                                            afterSplit = timeLastNotes.length;
                                            bestNotes = timeFirstNotes.concat(timeLastNotes);
                                        }
                                        else {
                                            bestNotes = SplitNotesValidator.bestNoteValues(tiedNoteTotalDuration);
                                        }

                                        var getNotes: INote[] = [];
                                        var next = note;
                                        var matches = true;
                                        for (var i = 0; i < noNotes; i++) {
                                            getNotes.push(next);
                                            if (bestNotes.length <= i || !next.getTimeVal().eq(bestNotes[i])) matches = false;
                                            next = Music.nextNote(next);
                                        }
                                        // if bestNotes matches actual note values, break
                                        if (matches) return;
                                        // else remove original notes and add bestNotes

                                        // We have noNotes notes who shall be merged to the values in bestNotes
                                        // Best to merge to 1 first and then split

                                    // join notes!
                                        note = Music.mergeNoteWithNext(note, noNotes - 1);

                                        if (bestNotes.length > 0) {
                                            Music.splitNote(note, bestNotes);
                                }
                            }
                                }
                            }
                        });
                    });
                });
            }
        }
*/
/*
        export class SplitNotesValidator implements IScoreValidator { //todo: tjek om der skiftes taktart inden noden ophører

            public static bestNoteValues(time: TimeSpan): Array<TimeSpan> {
                if (new TimeSpan(1, 1024).gt(time)) {
                    throw "Bad time for note: " + time.toString();
                }
                var res: TimeSpan[] = [];
                //var runningTime = 4096;
                var runningTime = new TimeSpan(8,1);
                while (runningTime.gt(time)) {
                    runningTime = runningTime.divideScalar(2);
                }
                if (runningTime.eq(time)) { return [runningTime]; }
                

                return [runningTime].concat(SplitNotesValidator.bestNoteValues(time.sub(runningTime)));
            }

            private splitNote(note: INote, nextAbsTime: AbsoluteTime): void {
                                    // split note in 2 or more
                                    var timeFirstNotes: TimeSpan[];
                                    var timeLastNotes: TimeSpan[];
                if (note.NoteId === 'hidden') {
                    timeFirstNotes = [nextAbsTime.diff(note.absTime)];
                    timeLastNotes = [note.absTime.add(note.getTimeVal()).diff(nextAbsTime)];
                                    }
                                    else {
                                        // timeVal for first note = nextAbsTime - absTime
                    timeFirstNotes = SplitNotesValidator.bestNoteValues(nextAbsTime.diff(note.absTime)).reverse();
                                        // timeVal for second note = timeVal - nextAbsTime + absTime
                    timeLastNotes = SplitNotesValidator.bestNoteValues(note.absTime.add(note.getTimeVal()).diff(nextAbsTime));
                                    }
                                    var notes = timeFirstNotes.concat(timeLastNotes);
                                    Music.splitNote(note, notes);
        
                                    }
            
                                    
            public refine(score: IScore) {
                score.withStaves((staff: IStaff, index: number): void => {
                    staff.withVoices((voice: IVoice, index: number): void => {
                        voice.withNotes((note: INote, index: number): void => {
                            var staffContext = staff.getStaffContext(note.absTime);
                            if (staffContext.meter) {
                                var nextAbsTime = staffContext.meter.nextBar(note.absTime, staffContext.meterTime);                                
                                if (note.absTime.add(note.getTimeVal()).gt(nextAbsTime)) {
                                    this.splitNote(note, nextAbsTime);
                                }
                            }
                        });
                    });
                });
            }
        }
*/
        export class BeamValidator implements IScoreValidator {
            constructor(private globalContext: IGlobalContext) {}

            public refine(score: IScore) {
                score.withStaves((staff: IStaff) => {
                    staff.withVoices((voice: IVoice) => {
                        this.validateVoice(voice);
                    });
                });
            }

            private validateVoice(voice: IVoice) {
                var firstNotes: INote[] = [];
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
                voice.withNotes(this.globalContext, (note: INote, context: INoteContext) => {
                    /*for (var iNote = 0; iNote < voice.getChildren().length; iNote++) {
                        var note: INote = voice.getChild(iNote);*/
                    if (note.graceType) {
                        noOfGraceNotes++;
                        context.getHorizPosition().graceNo = noOfGraceNotes;
                        return;
                    }
                    var staffContext = voice.parent.getStaffContext(context.absTime);
                    // Check if current group is to end
                    //var splitTime = 4 % staffContext.timeInBar.denominator === 0);
                    if (!staffContext.meter) return;
                    var nextB = staffContext.meter.nextBoundary(context.absTime, staffContext.meterTime);
                    var splitTime = nextB.eq(context.absTime);
                    if (firstNotes.length && (!quarterNote.gt(note.timeVal) || splitTime || note.rest)) {
                        // End group
                        endGroup();
                    }
                    // Check if new group must begin
                    if (quarterNote.gt(note.timeVal) && !note.rest) {
                        var index = 0;
                        var beamspan: number[] = [];
                        for (var v = eighthNote; v.ge(note.timeVal); v = v.divideScalar(2)) {
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

                this.checkSyncopeBeaming(voice);
                this.updateBeams(voice);
            }

            private checkSyncopeBeaming(voice: IVoice) {   
                var noteElements = voice.getNoteElements(this.globalContext);
          
                //for (var iNote = 0; iNote < noteElements.length; iNote++) { // todo: problem
                voice.withNotes(this.globalContext, (note: INoteSource, context: INoteContext, iNote: number) => {
                    var beamspan = note.getBeamspan();
                    for (var i = 1; i < beamspan.length; i++) {
                        if (beamspan[i] === 1 && beamspan[0] < 0) {
                            // check syncopation
                            // tjek om det er en synkope // 8 16* 8 *16 8  men 8 *16 4 16* 8 - måske skal designeren tjekke det!
                            var absTime = context.absTime;
                            var res = absTime.fromStart().modulo(note.timeVal.multiplyScalar(2));
                            // todo: check if last in beam group
                            var firstNote = noteElements[iNote + beamspan[0] + 1];
                            var lastInBeamGroup = beamspan[0] + firstNote.getBeamspan()[0] === 0;
                            var syncopation = (res.numerator !== 0);
                            if (syncopation || lastInBeamGroup) {
                                beamspan[i] = -1;
                                note.setBeamspan(beamspan);
                            }
                        }
                    }
                });
            }

            private updateBeams(voice: IVoice) {
                var beams: IBeam[] = [];
                var noteElements = voice.getNoteElements(this.globalContext);

                for (var iNote = 0; iNote < noteElements.length; iNote++) {
                    var note: INote = noteElements[iNote];
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
                                        toNote = noteElements[iNote + beamspan[i] - 1];
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
                                    toNote = noteElements[iNote + beamspan[i] - 1];
                                }
                                note.Beams[i] = new BeamElement(note, toNote, i); // todo: toNote
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


        export class TieValidator implements IScoreValidator {
            constructor(private globalContext: IGlobalContext) {}
            public refine(score: IScore) {
                score.withVoices((voice: IVoice) => {
                    this.validateVoice(voice);
                });
            }

            private validateVoice(voice: IVoice) {
                voice.withNotes(this.globalContext, (note: INoteSource) => {
                    var nextNote = Music.nextNote(this.globalContext, note);
                        /*: NoteElement;
                    if (index < voice.noteElements.length - 1) {
                        nextNote = voice.noteElements[index + 1];
                    }
                    else {
                        nextNote = undefined;
                    }*/
                    note.withHeads(this.globalContext, (head: INotehead, index2: number) => {
                        if (head.tie) {
                            // update slurredTo property
                            head.setProperty("tiedTo", undefined);
                            if (nextNote) {
                                nextNote.withHeads(this.globalContext, (nextHead: INotehead) => {
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

  /*      
        export class CleanHiddenRestsValidator implements IScoreValidator {
            public refine(score: IScore) {
                score.withStaves((staff: IStaff): void => {
                    staff.withVoices((voice: IVoice): void => {
                        voice.withNotes((note: INote): void => {
                            if (note.NoteId === 'hidden') {
                                do {                                    
                                    var nextNote = Music.nextNote(note);
                                    if (!nextNote){
                                        // remove?
                                        break;
                                    }
                                    if (nextNote.NoteId === "hidden"){
                                        // merge
                                        note = Music.mergeNoteWithNext(note, 1);
                                    }
                                    else break;
                                }
                                while (true);
                            }
                        });
                    });
                });
            }
        }
*/
    }
//}