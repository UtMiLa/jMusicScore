import { NoteDecorationKind } from "./jm-music-basics";


export class NoteDecorations {
    private static decorationKeyDefs: { [index: string]: NoteDecorationKind } = {
        'f': NoteDecorationKind.Fermata,
        'q': NoteDecorationKind.Thumb,
        '>': NoteDecorationKind.Sforzato,
        '<': NoteDecorationKind.Espr,
        '.': NoteDecorationKind.Staccato,
        ';': NoteDecorationKind.Staccatissimo,
        '_': NoteDecorationKind.Tenuto,
        'p': NoteDecorationKind.Portato,
        'A': NoteDecorationKind.Marcato,
        'M': NoteDecorationKind.Prall,
        'm': NoteDecorationKind.Mordent,
        ',': NoteDecorationKind.Caesura,
        '#': NoteDecorationKind.AccX,
        'b': NoteDecorationKind.AccB,
        't': NoteDecorationKind.Trill,
        '§': NoteDecorationKind.Turn
    };

    private static getDef(id: NoteDecorationKind): { u: string; d: string; } {
        switch (id) {
            case NoteDecorationKind.AccX: return {
                u: 'e_accidentals.2',
                d: 'e_accidentals.2'
            };
            case NoteDecorationKind.AccXx: return {
                u: 'e_accidentals.4',
                d: 'e_accidentals.4'
            };
            case NoteDecorationKind.AccB: return {
                u: 'e_accidentals.M2',
                d: 'e_accidentals.M2'
            };
            case NoteDecorationKind.AccBb: return {
                u: 'e_accidentals.M4',
                d: 'e_accidentals.M4'
            };
            case NoteDecorationKind.Fermata: return {
                u: 'e_scripts.ufermata',
                d: 'e_scripts.dfermata'
            };
            case NoteDecorationKind.ShortFermata: return {
                u: 'e_scripts.ushortfermata',
                d: 'e_scripts.dshortfermata'
            };
            case NoteDecorationKind.LongFermata: return {
                u: 'e_scripts.ulongfermata',
                d: 'e_scripts.dlongfermata'
            };
            case NoteDecorationKind.VeryLongFermata: return {
                u: 'e_scripts.uverylongfermata',
                d: 'e_scripts.dverylongfermata'
            };
            case NoteDecorationKind.Thumb: return {
                u: 'e_scripts.thumb',
                d: 'e_scripts.thumb'
            };
            case NoteDecorationKind.Sforzato: return {
                u: 'e_scripts.sforzato',
                d: 'e_scripts.sforzato'
            };
            case NoteDecorationKind.Espr: return {
                u: 'e_scripts.espr',
                d: 'e_scripts.espr'
            };
            case NoteDecorationKind.Staccato: return {
                u: 'e_scripts.staccato',
                d: 'e_scripts.staccato'
            };
            case NoteDecorationKind.Staccatissimo: return {
                u: 'e_scripts.ustaccatissimo',
                d: 'e_scripts.dstaccatissimo'
            };
            case NoteDecorationKind.Tenuto: return {
                u: 'e_scripts.tenuto',
                d: 'e_scripts.tenuto'
            };
            case NoteDecorationKind.Portato: return {
                u: 'e_scripts.uportato',
                d: 'e_scripts.dportato'
            };
            case NoteDecorationKind.Marcato: return {
                u: 'e_scripts.umarcato',
                d: 'e_scripts.dmarcato'
            };
            case NoteDecorationKind.Open: return {
                u: 'e_scripts.open',
                d: 'e_scripts.open'
            };
            case NoteDecorationKind.Stopped: return {
                u: 'e_scripts.stopped',
                d: 'e_scripts.stopped'
            };
            case NoteDecorationKind.Upbow: return {
                u: 'e_scripts.upbow',
                d: 'e_scripts.upbow'
            };
            case NoteDecorationKind.Downbow: return {
                u: 'e_scripts.downbow',
                d: 'e_scripts.downbow'
            };
            case NoteDecorationKind.Reverseturn: return {
                u: 'e_scripts.reverseturn',
                d: 'e_scripts.reverseturn'
            };
            case NoteDecorationKind.Turn: return {
                u: 'e_scripts.turn',
                d: 'e_scripts.turn'
            };
            case NoteDecorationKind.Trill: return {
                u: 'e_scripts.trill',
                d: 'e_scripts.trill'
            };
            case NoteDecorationKind.Pedalheel: return {
                u: 'e_scripts.upedalheel',
                d: 'e_scripts.dpedalheel'
            };
            case NoteDecorationKind.Pedaltoe: return {
                u: 'e_scripts.upedaltoe',
                d: 'e_scripts.dpedaltoe'
            };
            case NoteDecorationKind.Flageolet: return {
                u: 'e_scripts.flageolet',
                d: 'e_scripts.flageolet'
            };
            case NoteDecorationKind.Rcomma: return {
                u: 'e_scripts.rcomma',
                d: 'e_scripts.rcomma'
            };
            case NoteDecorationKind.Prall: return {
                u: 'e_scripts.prall',
                d: 'e_scripts.prall'
            };
            case NoteDecorationKind.Mordent: return {
                u: 'e_scripts.mordent',
                d: 'e_scripts.mordent'
            };
            case NoteDecorationKind.Prallprall: return {
                u: 'e_scripts.prallprall',
                d: 'e_scripts.prallprall'
            };
            case NoteDecorationKind.Prallmordent: return {
                u: 'e_scripts.prallmordent',
                d: 'e_scripts.prallmordent'
            };
            case NoteDecorationKind.Upprall: return {
                u: 'e_scripts.upprall',
                d: 'e_scripts.upprall'
            };
            case NoteDecorationKind.Upmordent: return {
                u: 'e_scripts.upmordent',
                d: 'e_scripts.upmordent'
            };
            case NoteDecorationKind.Pralldown: return {
                u: 'e_scripts.pralldown',
                d: 'e_scripts.pralldown'
            };
            case NoteDecorationKind.Downprall: return {
                u: 'e_scripts.downprall',
                d: 'e_scripts.downprall'
            };
            case NoteDecorationKind.Downmordent: return {
                u: 'e_scripts.downmordent',
                d: 'e_scripts.downmordent'
            };
            case NoteDecorationKind.Prallup: return {
                u: 'e_scripts.prallup',
                d: 'e_scripts.prallup'
            };
            case NoteDecorationKind.Lineprall: return {
                u: 'e_scripts.lineprall',
                d: 'e_scripts.lineprall'
            };
            case NoteDecorationKind.Caesura: return {
                u: 'e_scripts.caesura',
                d: 'e_scripts.caesura'
            };
        }
        return null;
    }

    public static getGlyph(id: NoteDecorationKind, up: boolean): string {
        var def = NoteDecorations.getDef(id);
        if (def) return up ? def.u : def.d;
        return null;
    }

    public static getIdFromKey(key: string): NoteDecorationKind {
        return this.decorationKeyDefs[key];
    }

}
