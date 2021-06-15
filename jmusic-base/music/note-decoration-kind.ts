/** Kinds of Note decorations. */
export enum NoteDecorationKind {
    AccN = 0, AccX, AccB, AccXx, AccBb,
    Fermata = 5, ShortFermata, LongFermata, VeryLongFermata,
    Thumb = 9, Sforzato, Espr, Staccato, Staccatissimo, Tenuto, Portato, Marcato,
    Open = 17, Stopped, Upbow, Downbow, Reverseturn, Turn, Trill, Pedalheel, Pedaltoe,
    Flageolet = 26, Rcomma, Prall, Mordent, Prallprall, Prallmordent,
    Upprall = 32, Upmordent, Pralldown, Downprall, Downmordent, Prallup, Lineprall,
    Caesura = 39, Lcomma, Rvarcomma, Lvarcomma,
    Arpeggio = 43, ArpeggioDown, NonArpeggio
};
