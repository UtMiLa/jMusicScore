import {Model} from "./jMusicScore";
import {JMusicScoreUi} from "./jMusicScore.UI";
import {MusicSpacing} from "./jMusicScore.Spacing";
import {emmentalerNotes} from "./emmentaler";
import {emmentalerCode} from "./emmentaler_code";
import {Commands} from "./commands";
import { ScoreApplication } from "./jMusicScore.Application";
//import {SvgView} from "./jMusicScore.SvgView";

export module MusicEditors {

    export class NoteDecorations {
        private static decorationKeyDefs: { [index: string]: Model.NoteDecorationKind } = {
            'f': Model.NoteDecorationKind.Fermata,
            'q': Model.NoteDecorationKind.Thumb,
            '>': Model.NoteDecorationKind.Sforzato,
            '<': Model.NoteDecorationKind.Espr,
            '.': Model.NoteDecorationKind.Staccato,
            ';': Model.NoteDecorationKind.Staccatissimo,
            '_': Model.NoteDecorationKind.Tenuto,
            'p': Model.NoteDecorationKind.Portato,
            'A': Model.NoteDecorationKind.Marcato,
            'M': Model.NoteDecorationKind.Prall,
            'm': Model.NoteDecorationKind.Mordent,
            ',': Model.NoteDecorationKind.Caesura,
            '#': Model.NoteDecorationKind.AccX,
            'b': Model.NoteDecorationKind.AccB,
            't': Model.NoteDecorationKind.Trill,
            '§': Model.NoteDecorationKind.Turn
        };

        private static getDef(id: Model.NoteDecorationKind): { u: string; d: string; } {
            switch (id) {
                case Model.NoteDecorationKind.AccX: return {
                    u: 'e_accidentals.2',
                    d: 'e_accidentals.2'
                };
                case Model.NoteDecorationKind.AccXx: return {
                    u: 'e_accidentals.4',
                    d: 'e_accidentals.4'
                };
                case Model.NoteDecorationKind.AccB: return {
                    u: 'e_accidentals.M2',
                    d: 'e_accidentals.M2'
                };
                case Model.NoteDecorationKind.AccBb: return {
                    u: 'e_accidentals.M4',
                    d: 'e_accidentals.M4'
                };
                case Model.NoteDecorationKind.Fermata: return {
                    u: 'e_scripts.ufermata',
                    d: 'e_scripts.dfermata'
                };
                case Model.NoteDecorationKind.ShortFermata: return {
                    u: 'e_scripts.ushortfermata',
                    d: 'e_scripts.dshortfermata'
                };
                case Model.NoteDecorationKind.LongFermata: return {
                    u: 'e_scripts.ulongfermata',
                    d: 'e_scripts.dlongfermata'
                };
                case Model.NoteDecorationKind.VeryLongFermata: return {
                    u: 'e_scripts.uverylongfermata',
                    d: 'e_scripts.dverylongfermata'
                };
                case Model.NoteDecorationKind.Thumb: return {
                    u: 'e_scripts.thumb',
                    d: 'e_scripts.thumb'
                };
                case Model.NoteDecorationKind.Sforzato: return {
                    u: 'e_scripts.sforzato',
                    d: 'e_scripts.sforzato'
                };
                case Model.NoteDecorationKind.Espr: return {
                    u: 'e_scripts.espr',
                    d: 'e_scripts.espr'
                };
                case Model.NoteDecorationKind.Staccato: return {
                    u: 'e_scripts.staccato',
                    d: 'e_scripts.staccato'
                };
                case Model.NoteDecorationKind.Staccatissimo: return {
                    u: 'e_scripts.ustaccatissimo',
                    d: 'e_scripts.dstaccatissimo'
                };
                case Model.NoteDecorationKind.Tenuto: return {
                    u: 'e_scripts.tenuto',
                    d: 'e_scripts.tenuto'
                };
                case Model.NoteDecorationKind.Portato: return {
                    u: 'e_scripts.uportato',
                    d: 'e_scripts.dportato'
                };
                case Model.NoteDecorationKind.Marcato: return {
                    u: 'e_scripts.umarcato',
                    d: 'e_scripts.dmarcato'
                };
                case Model.NoteDecorationKind.Open: return {
                    u: 'e_scripts.open',
                    d: 'e_scripts.open'
                };
                case Model.NoteDecorationKind.Stopped: return {
                    u: 'e_scripts.stopped',
                    d: 'e_scripts.stopped'
                };
                case Model.NoteDecorationKind.Upbow: return {
                    u: 'e_scripts.upbow',
                    d: 'e_scripts.upbow'
                };
                case Model.NoteDecorationKind.Downbow: return {
                    u: 'e_scripts.downbow',
                    d: 'e_scripts.downbow'
                };
                case Model.NoteDecorationKind.Reverseturn: return {
                    u: 'e_scripts.reverseturn',
                    d: 'e_scripts.reverseturn'
                };
                case Model.NoteDecorationKind.Turn: return {
                    u: 'e_scripts.turn',
                    d: 'e_scripts.turn'
                };
                case Model.NoteDecorationKind.Trill: return {
                    u: 'e_scripts.trill',
                    d: 'e_scripts.trill'
                };
                case Model.NoteDecorationKind.Pedalheel: return {
                    u: 'e_scripts.upedalheel',
                    d: 'e_scripts.dpedalheel'
                };
                case Model.NoteDecorationKind.Pedaltoe: return {
                    u: 'e_scripts.upedaltoe',
                    d: 'e_scripts.dpedaltoe'
                };
                case Model.NoteDecorationKind.Flageolet: return {
                    u: 'e_scripts.flageolet',
                    d: 'e_scripts.flageolet'
                };
                case Model.NoteDecorationKind.Rcomma: return {
                    u: 'e_scripts.rcomma',
                    d: 'e_scripts.rcomma'
                };
                case Model.NoteDecorationKind.Prall: return {
                    u: 'e_scripts.prall',
                    d: 'e_scripts.prall'
                };
                case Model.NoteDecorationKind.Mordent: return {
                    u: 'e_scripts.mordent',
                    d: 'e_scripts.mordent'
                };
                case Model.NoteDecorationKind.Prallprall: return {
                    u: 'e_scripts.prallprall',
                    d: 'e_scripts.prallprall'
                };
                case Model.NoteDecorationKind.Prallmordent: return {
                    u: 'e_scripts.prallmordent',
                    d: 'e_scripts.prallmordent'
                };
                case Model.NoteDecorationKind.Upprall: return {
                    u: 'e_scripts.upprall',
                    d: 'e_scripts.upprall'
                };
                case Model.NoteDecorationKind.Upmordent: return {
                    u: 'e_scripts.upmordent',
                    d: 'e_scripts.upmordent'
                };
                case Model.NoteDecorationKind.Pralldown: return {
                    u: 'e_scripts.pralldown',
                    d: 'e_scripts.pralldown'
                };
                case Model.NoteDecorationKind.Downprall: return {
                    u: 'e_scripts.downprall',
                    d: 'e_scripts.downprall'
                };
                case Model.NoteDecorationKind.Downmordent: return {
                    u: 'e_scripts.downmordent',
                    d: 'e_scripts.downmordent'
                };
                case Model.NoteDecorationKind.Prallup: return {
                    u: 'e_scripts.prallup',
                    d: 'e_scripts.prallup'
                };
                case Model.NoteDecorationKind.Lineprall: return {
                    u: 'e_scripts.lineprall',
                    d: 'e_scripts.lineprall'
                };
                case Model.NoteDecorationKind.Caesura: return {
                    u: 'e_scripts.caesura',
                    d: 'e_scripts.caesura'
                };
            }
            return null;
        }

        public static getGlyph(id: Model.NoteDecorationKind, up: boolean): string {
            var def = NoteDecorations.getDef(id);
            if (def) return up ? def.u : def.d;
            return null;
        }

        public static getIdFromKey(key: string): Model.NoteDecorationKind {
            return this.decorationKeyDefs[key];
        }

    }

    /*export interface FeedbackGraphicsEngine {
        //SelectNote(select: boolean);
        //SelectNoteHead(select: boolean);
        //SelectInsertPoint(voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch);
        //SelectVoice(voice: Model.IVoice, select: boolean);
        //SelectStaff(staff: Model.IStaff, select: boolean);
        ShowNoteCursor(noteId: string, voice: Model.IVoice, horizPos: Model.HorizPosition, pitch: Model.Pitch): void;
        HideNoteCursor(): void;
        MouseOverElement(elm: Model.IMusicElement, over: boolean): void;
    }*/
    

    export class NoteEditor implements ScoreApplication.IScoreEventProcessor {
        constructor(public context: string) { }

        public init(app: ScoreApplication.IScoreApplication) {
        }

        public exit(app: ScoreApplication.IScoreApplication) {
            /*var event: any = { data: { voice: null } }; // todo: any
            this.clickvoice(app, event);*/
        }

        public mouseOverStyle: string = "color:#f00;fill:#0a0;fill-opacity:0.5;stroke:none";
        private cursorElement: SVGUseElement = null;

        public mouseovernote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            app.Status.currentNote = note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(note, true);
            fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition(), event.data.pitch);*/
            app.Status.mouseOverElement = note; // todo: note cursor
            return true;
        }
        public mousemovenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition(), event.data.pitch);*/
            // todo: note cursor
            return false;
        }
        public mouseoutnote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            app.Status.currentNote = undefined;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(note, false);*/
            if (app.Status.mouseOverElement === note) app.Status.mouseOverElement = null;
            // todo: fb.HideNoteCursor();
            return true;
        }

        public mouseoverafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(1), event.data.pitch);*/
            // todo: note cursor
            app.Status.mouseOverElement = note;
            return false;
        }

        public mousemoveafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(1), event.data.pitch);*/
            // todo: note cursor
            return false;
        }

        public mouseoutafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.HideNoteCursor();*/
            if (app.Status.mouseOverElement === note) app.Status.mouseOverElement = null;
            return false;
        }

        public mousemovebeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(-1), event.data.pitch);*/
            // todo: note cursor
            return false;
        }

        public mouseoverbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            app.Status.currentNote = undefined;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.ShowNoteCursor('edit1_8', note.parent, note.getHorizPosition().clone(-1), event.data.pitch);*/
            app.Status.mouseOverElement = note; // todo: note cursor
            return true;
        }

        public mouseoutbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.HideNoteCursor();*/
            if (app.Status.mouseOverElement === note) app.Status.mouseOverElement = null;
            return true;
        }
        public mouseoverhead(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var head = event.head;
            app.Status.currentNotehead = head;
            app.Status.currentNote = head.parent;

            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(head, true);*/
            app.Status.mouseOverElement = head;
            return false;
        }
        public mouseouthead(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var head = event.head;
            app.Status.currentNotehead = undefined;
            app.Status.currentNote = undefined;

            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(head, false);*/
            if (app.Status.mouseOverElement === head) app.Status.mouseOverElement = null;
            return false;
        }

    }



    export class KeyboardNoteEditor extends NoteEditor {
        public keymessage(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            return this.keyPressed(app, event.key);
        }

        public keyPressed(app: ScoreApplication.IScoreApplication, key: string): boolean {
            if (key === 'DELETE') {
                if (app.Status.currentNotehead) {
                    app.executeCommand(new Commands.DeleteNoteheadCommand({
                        head: app.Status.currentNotehead
                    }));
                }
                else if (app.Status.currentNote) {
                    app.executeCommand(new Commands.DeleteNoteCommand({
                        note: app.Status.currentNote
                    }));
                }
                return false;
            }
            else if (key === '+') {
                if (app.Status.currentNotehead) {
                    app.executeCommand(new Commands.RaisePitchAlterationCommand({
                        head: app.Status.currentNotehead,
                        deltaAlteration: 1
                    }));
                }
            }
            else if (key === '-') // -
            {
                if (app.Status.currentNotehead) {
                    app.executeCommand(new Commands.RaisePitchAlterationCommand({
                        head: app.Status.currentNotehead,
                        deltaAlteration: -1
                    }));
                }
            }
            else if (key === '=') {
                if (app.Status.currentNotehead) {
                    app.executeCommand(new Commands.TieNoteheadCommand({
                        head: app.Status.currentNotehead,
                        toggle: true,
                        forced: false
                    }));
                }
                else
                    if (app.Status.currentNote) {
                        app.executeCommand(new Commands.TieNoteCommand({
                            note: app.Status.currentNote,
                            forced: false,
                            toggle: true
                        }));
                    }
            }
            else {
                if (app.Status.currentNote) {
                    var k = NoteDecorations.getIdFromKey(key);
                    if (k) {
                        app.executeCommand(new Commands.AddNoteDecorationCommand({
                            note: app.Status.currentNote,
                            placement: "under",
                            expression: k
                        }));
                        return false;
                    }
                    else if (key === "UP" || key === "DOWN") {
                        var note = app.Status.currentNote;
                        if (note) {
                            //note.setStemDirection(key === "UP" ? Model.StemDirectionType.stemUp : Model.StemDirectionType.stemDown);
                            app.executeCommand(new Commands.SetNoteStemDirectionCommand({
                                note: note,
                                direction: key
                            }));
                        }
                        return false;
                    }
                    else return true;
                }
            }
        }
    }

    export class EditNoteEditor extends KeyboardNoteEditor {

        public clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            // note dialog
            var dlg = new JMusicScoreUi.NoteDialog("ed", app);
            dlg.setNote(event.note).show();
            return false;
        }

    }

    export class InsertNoteEditor extends KeyboardNoteEditor {
        constructor(public context: string, public noteType: string, public noteTime: Model.TimeSpan, public rest: boolean, public dots: number) {
            super(context);
        }

        public clickafternote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            this.mouseoutafternote(app, event);

            var voice = event.voice;

            var absTime = Model.AbsoluteTime.startTime;
            if (voice.noteElements.length) {
                var lastNote = voice.noteElements[voice.noteElements.length - 1];
                absTime = lastNote.absTime.add(lastNote.timeVal);
            }
            var pitch = event.pitch; 
            
            var rest = app.Status.rest;
            var dots = app.Status.dots;
            var grace = app.Status.grace;

            var cmd = new Commands.AddNoteCommand(
                {
                    noteName: this.noteType,
                    noteTime: this.noteTime,
                    rest: rest,
                    dots: dots,
                    grace: grace,
                    pitches: [pitch],
                    voice: voice,
                    beforeNote: null,
                    absTime: absTime
                });
            app.executeCommand(cmd);
            return false;
        }

        public clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            this.mouseoutnote(app, event);

            var note = event.note;

            var absTime = Model.AbsoluteTime.startTime;
            if (note.parent.noteElements.length) {
                var lastNote = note.parent.noteElements[note.parent.noteElements.length - 1];
                absTime = lastNote.absTime.add(lastNote.timeVal);
            }
            
            var pitch = event.pitch; 
            if (note.matchesPitch(pitch, true)) {
                if (!note.matchesOnePitch(pitch, true)) {
                    for (var i = 0; i < note.noteheadElements.length; i++) {
                        if (note.noteheadElements[i].matchesPitch(pitch, true)) {
                            var cmd = new Commands.RemoveNoteheadCommand(
                                {
                                    head: note.noteheadElements[i]
                                });
                            app.executeCommand(cmd);
                            break;
                        }
                    }
                }
            }
            else {
                app.executeCommand(new Commands.AddNoteheadCommand(
                    {
                        note: note,
                        pitch: pitch
                    }));
            }
            return false;
        }

        public clickbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            this.mouseoutbeforenote(app, event);

            var note = event.note;

            var absTime = Model.AbsoluteTime.startTime;
            if (note.parent.noteElements.length) {
                var lastNote = note.parent.noteElements[note.parent.noteElements.length - 1];
                absTime = lastNote.absTime.add(lastNote.timeVal);
            }
            var pitch = event.pitch; 

            var rest = app.Status.rest;
            var dots = app.Status.dots;
            var grace = app.Status.grace;

            var cmd = new Commands.AddNoteCommand(
                {
                    noteName: this.noteType,
                    noteTime: this.noteTime,
                    rest: rest,
                    dots: dots,
                    grace: grace,
                    pitches: [pitch],
                    voice: note.parent,
                    beforeNote: note,
                    absTime: absTime
                });
            app.executeCommand(cmd);
            return false;
        }

    }


    export class EditNoteTextEditor extends NoteEditor {
        constructor() {
            super('');
            this.editor = document.createElement('input');
            $(this.editor)
                .data("editor", this)
                .keydown(this.keyDown)
                .keyup(this.keyUp);
        }
        public editor: HTMLInputElement;

        public exit(app: ScoreApplication.IScoreApplication) {
            $(this.editor).hide();
        }

        public getNoteText(note: Model.INote): string {
            var syll: Model.ITextSyllableElement;
            if (note.syllableElements.length) {
                syll = note.syllableElements[0];
                return syll.Text;
            }
            else {
                return '';
            }
        }

        private static getNoteRect(note: Model.INote): ClientRect {
            return $('#edit_' + note.id + ', #htmlSensor_edit_' + note.id)[0].getBoundingClientRect(); // todo: more portable!
        }

        // todo: backspace
        // todo: '-' tilføjes til den foregående node - bør aktiveres i keyup eller keypressed
        // todo: fjern editor når der skiftes voice eller tool

        public updateNoteText(note: Model.INote, text: string) {
            var syll: Model.ITextSyllableElement;
            if (note.syllableElements.length) {
                syll = note.syllableElements[0];
                syll.Text = text;
                $('#' + syll.id + ' text').text(text);
            }
            else {
                syll = new Model.TextSyllableElement(note, text);
                note.addChild(note.syllableElements, syll);
                
                var noteElm = document.getElementById(note.id);
                if (noteElm) {
                    var g = <SVGGElement>document.createElementNS('http://www.w3.org/2000/svg', "g");
                    var textElem = <SVGTextElement>document.createElementNS('http://www.w3.org/2000/svg', "text"); // todo: svghelper
                    textElem.appendChild(document.createTextNode(text));
                    noteElm.appendChild(g);
                    g.appendChild(textElem);
                    g.setAttributeNS(null, "id", syll.id);
                    g.setAttributeNS(null, "transform", "translate (0,50), scale(1,1)");
                    textElem.setAttributeNS(null, "x", '' + 0);
                    textElem.setAttributeNS(null, "y", '' + 0);
                }
            }
        }

        private keyUp(event: JQueryEventObject) {
            var editor: HTMLInputElement = <HTMLInputElement>event.target;
            var controller: EditNoteTextEditor = <EditNoteTextEditor>$(editor).data("editor");
            if (event.key === "Spacebar" || event.key === " " || event.key === '-') {
                if (editor.selectionStart === editor.value.length) {
                    var note = <Model.INote>$(editor).data('note');
                    var nextNote = Model.Music.nextNote(note);
                    while (nextNote && nextNote.rest) nextNote = Model.Music.nextNote(nextNote);
                    if (nextNote) {
                        var rect = EditNoteTextEditor.getNoteRect(nextNote);// $('#edit_' + nextNote.id)[0].getBoundingClientRect();
                        var val = $(editor).val();
                        if (val) {
                            controller.updateNoteText(note, val);
                        }
                        $(editor).val(controller.getNoteText(nextNote)).data("note", nextNote).css({ left: rect.left });
                    }
                }
            }

            var $target = $(editor);
            var $span = $('<span>');
            $span.text($target.val()).appendTo($target.parent());
            $target.css('width', $span[0].getBoundingClientRect().width + 16);
            $span.remove();
            
        }

        private keyDown(event: JQueryEventObject) {
            var editor: HTMLInputElement = <HTMLInputElement>event.target;
            var controller: EditNoteTextEditor = <EditNoteTextEditor>$(editor).data("editor");
            if (event.key === 'Left') {
                if (editor.selectionStart === 0) {
                    var note = <Model.INote>$(editor).data('note');
                    var prevNote = Model.Music.prevNote(note);
                    while (prevNote && prevNote.rest) prevNote = Model.Music.prevNote(prevNote);
                    if (prevNote) {
                        var rect = EditNoteTextEditor.getNoteRect(prevNote); //$('#edit_' + prevNote.id)[0].getBoundingClientRect();
                        var val = $(editor).val();
                        if (val) {
                            controller.updateNoteText(note, val);
                        }
                        $(editor).val(controller.getNoteText(prevNote)).data("note", prevNote).css({ left: rect.left });
                    }
                }
            }
            else if (event.key === 'Right') {
                if (editor.selectionStart === editor.value.length) {
                    var note = <Model.INote><any>($(editor).data('note'));
                    var nextNote = Model.Music.nextNote(note);
                    while (nextNote && nextNote.rest) nextNote = Model.Music.nextNote(nextNote);
                    if (nextNote) {
                        var rect = EditNoteTextEditor.getNoteRect(nextNote);// $('#edit_' + nextNote.id)[0].getBoundingClientRect();
                        var val = $(editor).val();
                        if (val) {
                            controller.updateNoteText(note, val);
                        }
                        $(editor).val(controller.getNoteText(nextNote)).data("note", nextNote).css({ left: rect.left });
                    }
                }
            }
        }

        public clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            this.mouseoutnote(app, event);
            var note = event.note;
            var text = '';
            if (note.syllableElements.length) {
                // Edit first syllable
                if (note.syllableElements[0]) text = note.syllableElements[0].Text;
            }
            // Show editor                    
            var rect = EditNoteTextEditor.getNoteRect(note);// $('#edit_' + note.id+ ', #htmlSensor_edit_' + note.id)[0].getBoundingClientRect();

            $(this.editor)
                .css({
                    background: "white",
                    border: "solid white thin",
                    position: "absolute",
                    top: rect.bottom + 10,
                    left: rect.left - 8,
                    width: '20px'
                })
                .val(text)
                .data("note", note)
                .appendTo('body')
                .show()
            [0].focus();

            return false;
        }

    }

    export class DeleteNoteEditor extends NoteEditor {
        public clicknote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            this.mouseoutnote(app, event);
            var note = event.note;
            app.executeCommand(new Commands.DeleteNoteCommand({
                note: note
            }));
            return false;
        }

        public clickhead(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            this.mouseouthead(app, event);
            var head = event.head;
            // todo: slet eneste head bør gøre note til pause
            if (head.parent.matchesOnePitch(head.getPitch(), true) || head.parent.rest) {
                app.executeCommand(new Commands.DeleteNoteCommand({
                    note: head.parent
                }));
            }
            // Hvis node med mange heades: slet denne head
            else if (head.parent.matchesPitch(head.getPitch(), true) || head.parent.rest) {
                app.executeCommand(new Commands.DeleteNoteheadCommand({
                    head: head
                }));
            }                
            return false;
        }
    }

    export class ChangeMeterEditor implements ScoreApplication.IScoreEventProcessor {
        constructor(public context: string) { }

        public init(app: ScoreApplication.IScoreApplication) {
            //SvgView.SvgEditorManager.activateAllVoiceSensors(app.document, this.context, false);
        }

        public exit(app: ScoreApplication.IScoreApplication) {
        }


        public clickbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var bar = event.bar;

            var dlg = new JMusicScoreUi.MeterDialog("click", app);
            dlg.setTime(bar.absTime).show();

            return false;
        }

        public clickmeter(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var meter = event.meter;

            var dlg = new JMusicScoreUi.MeterDialog("click", app);
            dlg.setTime(meter.absTime).setMeter(meter.definition).show();

            return false;
        }

        public mouseoverbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var bar = event.bar;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(bar, true);*/
            app.Status.mouseOverElement = bar;
            return true;
        }
        public mouseoutbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var bar = event.bar;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(bar, false);*/
            if (app.Status.mouseOverElement === bar) app.Status.mouseOverElement = null;
            return true;
        }
        public mouseovermeter(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var meter = event.meter;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(meter, true);*/
            app.Status.mouseOverElement = meter;
            return true;
        }
        public mouseoutmeter(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var meter = event.meter;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(meter, false);*/
            if (app.Status.mouseOverElement === meter) app.Status.mouseOverElement = null;
            return true;
        }
    }

    export class ChangeKeyEditor implements ScoreApplication.IScoreEventProcessor {
        constructor(public context: string) { }

        public init(app: ScoreApplication.IScoreApplication) {
            //SvgView.SvgEditorManager.activateAllVoiceSensors(app.document, this.context, false);
        }

        public exit(app: ScoreApplication.IScoreApplication) {
        }


        public clickbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var bar = event.bar;

            var dlg = new JMusicScoreUi.KeyDialog("click", app);
            dlg.setTime(bar.absTime).show();

            return false;
        }

        public clickkey(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var key = event.keySig;

            var dlg = new JMusicScoreUi.KeyDialog("click", app);
            dlg.setTime(key.absTime).setKey(key).show();

            return false;
        }
        public mouseoverbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var bar = event.bar;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(bar, true);*/
            app.Status.mouseOverElement = bar;
            return true;
        }
        public mouseoutbar(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var bar = event.bar;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(bar, false);*/
            if (app.Status.mouseOverElement === bar) app.Status.mouseOverElement = null;
            return true;
        }
        public mouseoverkey(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var key = event.keySig;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(key, true);*/
            app.Status.mouseOverElement = key;
            return true;
        }
        public mouseoutkey(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var key = event.keySig;
            /*var fb = <FeedbackGraphicsEngine>event.data.feedback;
            fb.MouseOverElement(key, false);*/
            if (app.Status.mouseOverElement === key) app.Status.mouseOverElement = null;
            return true;
        }
    }
    
    
    export class ChangeClefEditor implements ScoreApplication.IScoreEventProcessor {
        constructor(public context: string) { }

        public init(app: ScoreApplication.IScoreApplication) {
//            SvgView.SvgEditorManager.activateAllVoiceSensors(app.document, this.context, true);
            // Activate BeforeNote, AfterNote, clef
        }

        public exit(app: ScoreApplication.IScoreApplication) {
        }


        public clickbeforenote(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var note = event.note;

            var dlg = new JMusicScoreUi.ClefDialog("click", app);
            dlg.setTime(note.absTime).setStaff(note.parent.parent).show();

            return false;
        }

        public clickclef(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var clef = event.clef;

            var dlg = new JMusicScoreUi.ClefDialog("click", app);
            dlg.setClef(clef).setTime(clef.absTime).setStaff(clef.parent).show();

            return false;
        }


        public mouseoverclef(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var clef = event.clef;
            //var fb = <FeedbackGraphicsEngine>event.data.feedback;
            //fb.MouseOverElement(clef, true);
            return true;
        }
        public mouseoutclef(app: ScoreApplication.IScoreApplication, event: ScoreApplication.IMessage): boolean {
            var clef = event.clef;
            //var fb = <FeedbackGraphicsEngine>event.data.feedback;
            //fb.MouseOverElement(clef, false);
            return true;
        }

    }
    
            /* TODO: 
        AddStaffExpressionEditor
    */

} 

    
