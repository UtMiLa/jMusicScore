import { Injectable } from '@angular/core';
// import { Observable } from '@angular/observable';
import {IModel} from './datamodel/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IScore, ISequence } from '../../../jMusic/model/jm-model-interfaces';
import { GlobalContext } from '../../../jMusic/model/jm-model-base';
import { LilyPondConverter } from '../../../jMusic/jm-lilypond';

@Injectable()
export class MusicProviderService {

  constructor(private http: HttpClient) {
    // this.load();
  }

  constRes = {'voices': {'voices': ['sopran', 'alt', 'tenor', 'bas'], 'sections': ['Intro', 'IntroTo', 'Glory', 'GloryA', 'AlleinA', 'AlleinB', 'AlleinCoda', 'GloryAnden', 'GloryAAnden', 'AlleinAAnden', 'AlleinBAnden', 'QuiTollisA', 'QuiTollisB', 'Foerste', 'Anden', 'Tredje', 'FugaSlut', 'AlleinATredje', 'AlleinBTredje', 'AlleinCodaSidst', 'Amen']}, 'scales': {'diatonicScale': '{ c d e f g a bes }'}, 'sections': {'Glory': {'voices': {'sopranGlory': '{\\modalTranspose c c\' \\diatonicScale { \\Glory r4 \\fullRest\n\\Glory \n\\GloryB\n}\n%    \\addlyrics {\n%      Glo -- ry to the Lord,\n%      glo -- ry to the Lord,\n%      glo -- ry to the Lord in the high %  -- _ est!\n%      Glo -- ry to the Lord,\n%      glo -- ry to the Lord,\n%      glo -- ry to the Lord in the high - %  est!\n%  And peace _ on _ earth,\n%  and peace _ _ on \n%    }\n}', 'altGlory': '{\nr2..\n{\\repeat unfold 5 \\fullRest}\nr4. \n\\transpose c g {c\'8 c\' a g f g a\ng4 f4 } r4 r4 r4.\n\n\\repeat unfold 10 \\fullRest\n}', 'tenorGlory': '{\\repeat unfold 19 \\fullRest\n}', 'basGlory': '{<c f a>4 r4 r4.\n\n\\basOstinatTo\n\\basOstinatTre\n\n{\\repeat unfold 14 \\fullRest}\n}'}}, 'Foerste': {'voices': {'altFoerste': '{<bes e\' g\' c\'\'>2 r4.\n\\relative c\'{ \n\\repeat unfold 4 \\fullRest \n\\repeat unfold 4 \\fullRest \n \\FugaTema \\FugaSpin\n \\modalTranspose d c \\diatonicScale { \\FugaSpin }\n\\transpose c c\' {\n\\softKontra\n%  e8 d e r e f g \n%  a g a g f g a \nbes8 a bes a g c\' b\na g a g fis bes a\n}}}', 'tenorFoerste': '{\\modalTranspose c g \\diatonicScale {\n \\repeat unfold 4 \\fullRest  \n\n\\FugaTema \n\\FugaSpin \n\\modalTranspose d c \\diatonicScale { \\FugaSpin } \n\\modalTranspose e c \\diatonicScale { \\FugaSpin } \n}\n \\modalTranspose c f \\diatonicScale { \\softKontra }\n%  a8 g a r a bes c\'\n%  d\' c\' d\' c\' bes c\' d\' \ng8 r bes b c\'4 cis\'8\nd\'4 a b g8\n%  \\modalTranspose e c\' \\diatonicScale { \\FugaSpin } \n%  \\modalTranspose e bes \\diatonicScale { \\FugaSpin } \nc\'4 r r r8 r4 r r4.\nf4 fis g gis8 a4 r a8 g a\n}', 'basFoerste': '{     \n{ c2.. c4 f e f8 d2~ d8 e[ f] }\n \\FugaSpin\n \\modalTranspose d c \\diatonicScale { \\FugaSpin }\n\n\\softKontra\n\nbes8 r f4 g f8\ne r c4 f4 e8\nd4 dis e c8\n\nf2 r4 r8 \n%   \\modalTranspose c g \\diatonicScale { \\SynkopeSpin }\n \\fullRest \\fullRest \\fullRest \\fullRest\n \\fullRest\n \\fullRest\n%  f4 fis g gis8 a4 \nr4 c8 cis d4 dis8\n\n}', 'sopranFoerste': '{ \n\\repeat unfold 5 \\fullRest \n\\repeat unfold 8 \\fullRest \n\\modalTranspose c g\' \\diatonicScale { \\FugaTema }\n\\transpose c g\' { \\FugaSpin }\n\\modalTranspose d g\' \\diatonicScale { \\FugaSpin }\n}'}}, 'Anden': {'voices': {'altAnden': '\\transpose c c\' {\ngis8 fis gis r r4.\n\\fullRest \\fullRest \\fullRest\n\\modalTranspose c d \\diatonicScale { r2 c4. c4 f e f8 d2~ d8 c[ d] }\n\n\\transpose e d { g8[ fis g fis] eis[ ais gis]}\ne a g f c\' b g\na4 a, a g8 \nbes4 g8 a4 f8 g\n\n\\transpose c d { g8[ f g f] e[ a g]}\n\\transpose c c { g8[ f g f] e[ f g]}\n\n\nc4 f e f8\n\nd2~ d8 e f\n\n\\modalTranspose c c \\diatonicScale {\\FugaSpin\n}\n}\n\n\n', 'tenorAnden': '{\nb4 e\' d\' e\'8\nc\'2~ c\'8 d\' e\' \n\\modalTranspose c bes \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c c\' \\diatonicScale  { e8[ d e d] cis\'[ f e]}\nd\' c\' d\' r a g a\nbes a bes a g a bes\nc\' bes c\' bes a b cis\'\nd\'4 gis8 a b4 gis8\na4 e4 e\' c\'8\n\nd\' r4 r2\n\n\\fullRest\nr2 a8 g a\nb4 e\' d\' e\'8\nc\'2~ c\'8 d\' e\'\n\n\n\\modalTranspose c bes \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c a \\diatonicScale {\\FugaSpin\n}\n\n}', 'basAnden': '{\ne4 r e4. e4 a g a8 f2~ f8 e f\n\\modalTranspose c c \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose e d \\diatonicScale  { g8[ f g f] e[ f g]}\ng r4 r2\nr4 a, a g8 \na4 r r r8\ne4 a g a8 f2~ f8 e f\n\\modalTranspose c c \\diatonicScale {\\FugaSpin\n}\n\\modalTranspose d c \\diatonicScale {\\FugaSpin} \n\ne8 d e4 r4 r8\n\ne8 d c d4 bes,8 a, \n\nbes,4 g,4 bes, d8\nc4 c4 c\'4.\n}\n', 'sopranAnden': '{\nb\'8 a\' b\' r r r r\n\\repeat unfold 2 \\fullRest \n\n\\modalTranspose c a\' \\diatonicScale { \\FugaTema }\n\\transpose c a\' { g8[ f g f] e[ as g]}\n\\transpose c g\' { g8[ f g f] e[ a g]}\nc\'\' b\' c\'\'4. d\'\'8 e\'\'\nf\'\' e\'\' f\'\' e\'\' d\'\' g\'\' f\'\'\ne\'\'4 e\' e\'\' d\'\'8 \nf\'\'4 d\'\'8 e\'\'4 e\'4\ne\'\'4 c\'\'8[ d\'\'8 e\' d\'\' b\'] \nc\'\'4 a\'8 bes\'4 r8 f\'\n\nf\'4 bes\' a\' bes\'8\ng\'2~ g\'8 f\' g\'\n\n}'}}, 'Tredje': {'voices': {'altTredje': '\\transpose c c\'{\n\\modalTranspose d c \\diatonicScale {\\FugaSpin\n}\n\\modalTranspose e c \\diatonicScale {\\FugaSpin\n}\nd4 d4 e e8\nf8[ d f] e[ a g e]\n\nfis[ e fis] r fis[ e fis]\ng[ fis g] a[ g a bes]\na[ g a] r g[ a bes]\na[ g a] r g[ a bes]\nc\'4 bes8 c\'2\n\n\\fullRest \n\nd4 c8 bes, c4 d8\nes2 r4 r8\n\nes4 d8 c d4 e8\nf2 r4 r8\n\nfis4 e8 d e4 fis8\ng2~ g8 a <g bes>\n\n<ges bes>8 as <ges bes>4 r8 <ges bes>4\n}', 'tenorTredje': '{\n\n\\modalTranspose c g \\diatonicScale {\\FugaSpin\n}\n\\modalTranspose c f \\diatonicScale {\\FugaSpin\n}\n\nbes4 b c\' cis\'8\nd\'8[ g bes] c\'4 d\'8 e\' \nd\'[ c\' d\'] r d\'[ c\' d\']\n\n\\transpose c c\'{\nes[ d es] f[ es f g]\nf[ es f] r es[ f g]\nf[ es f] r es[ f g]\na4 g8 a2\n}\n%  r4 d d\' c\'8 e\'4 c\'8 d\'4 r4\n\\fullRest \\fullRest\n\n\n\\transpose c bes {c4 f e f8\nd2 r4 r8\nd4 g f g8\ne2 r4 r8\ne4 a g a8\n}\n\nc\'2~ c\'8 c\' d\'\n}', 'basTredje': '{r4 c4 c\'4.\nr4 c4 c\'4.\n\n\\transpose c c {\nr4 c c\' bes8\nc\'4 c c\' bes8\nc\'4 a8 c\'4 a8 c\'\nbes4 c8 bes4. d\'8\nc\'4 c8 c\'4 d\'8 bes8\nc\'4 c8 c\'4 d\'4\nc\'4. c\'8 a8 g f \ng8 a8 g4. f4~\n\nf4 r4 r4.\n\ng4 f8 es f4 g8\nc\'2 r4 r8\n\na4 g8 f g4 a8\nd\'2 r4 r8\n\nbes4 a8 g a4 bes8\nes2 r8 es8 d\n\n}\n}', 'sopranTredje': '{\n\n\\modalTranspose c e\' \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c d\' \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c c\' \\diatonicScale {\\FugaSpin\n}\n\nf\'8[ bes\' a\'] g\'[ c\'\' bes\' c\'\']\n\n\n%  \\repeat unfold 3 \\fullRest \n\\transpose c f {\n%   mod orgelpkt c:\n{<e\'>8[ <d\'> <e\'>] r \n<e\'>8[ <d\'> <e\'>] \n|\n<f\'>[  <e\'> <f\'>]  \n<g\'>[ <f\'>  <g\'> <bes\'>]\n|\n<g\'>[ <f\'>  <g\'>]\nr\n<f\'>[  <g\'> <bes\'>]\n|\n<g\'>[ <f\'>  <g\'>] r\n<f\'>[  <g\'> <bes\'>]\n|\n<c\'\'>4  <bes\'>8 <c\'\'>2 }\n}\n\\fullRest\n\n\\transpose c f\' {c4 f e f8\nd2 r4 r8\nd4 g f g8\ne2 r4 r8\ne4 a g a8\nf2~ f8 g a \nbes a bes4 r8 bes4\n}\n\n}'}}, 'GloryA': {'voices': {'sopranGloryA': '{\\transpose c c\' { \n\\GloryC\n\\GloryD\n}\n\n%   \\addlyrics {\n%      Glo -- ry to the Lord,\n%      glo -- ry to the Lord,\n%      glo -- ry to the Lord in the high -- _ est!\n\n%  And peace _ on _ earth,\n%  and peace _ _ on _ _ earth,\n%  good -- will, good -- _ will, good -- %  will towards men!\n%    }\n\n}', 'altGloryA': '{\nf2..\n \\repeat unfold 12 \\fullRest \n}', 'tenorGloryA': '{\\altGloryA\n}', 'basGloryA': '{\\altGloryA}'}}, 'AlleinA': {'voices': {'sopranAlleinA': '{\\AlleinSop\n}', 'altAlleinA': '{ \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest\n}', 'tenorAlleinA': '{\n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest\n }', 'basAlleinA': '{  \\AlleinBas\n}'}}, 'AlleinB': {'voices': {'sopranAlleinB': '{\n <f\'\' c\' f\'>4 <e\'\' c\' g\'>4 <d\'\' f\' f>4 <c\'\' e\' c\'>8 \n<d\'\' g\' bes>4 <d\'\' a\' bes>8 <c\'\' g\' c\'>4 <c\'\' a\' c\'>8~ <c\'\' g\' c\'>8 \n<f\'\' a f\'>8~ <f\'\' b f\'>8 <e\'\' g\' c\'>4 <d\'\' a\' c\'>4 <c\'\' a\' d\'>8 \n<d\'\' b\' d\'>8~ <e\'\' b\' d\'>8 <d\'\' b\' e\'>8 <c\'\' a\' e\'>4 <c\'\' bes\' e\'>4 \n\n<c\'\' a\' f\'>4 <a\' f\' c\'>8 <g\' e\' c\'>4 <f\' d\'>4\n\n\n\\transpose c c\' { g4.~ g4 a8 g}\n}', 'altAlleinB': '{ \n\\transpose c c\' {\n f2..  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n\nd4 <d f>8 <d f>4 e4\n}}', 'tenorAlleinB': '{  f2..  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \ng4 bes8 bes4 a4\n}', 'basAlleinB': '{ \n\n\na,4 a,4 bes,4 c8\ng,8 g8 f8 e4 f8 e8 \nd4 e4 f4 fis8\ng4 gis8 a4 g4 \nf4 f8 c4 d4\nbes,4 g,8 c4 cis4 \n\n}'}}, 'AlleinCoda': {'voices': {'sopranAlleinCoda': '{\nf\'2 r8 g\'4\na\'8 g\' a\' g\'4 a\'8 g\'\nc\'\'8 c\'\'8 a\'8 g\'8 f\'8 g\'8 a\'8 \nd\'\'2 r4.\nd\'\'8 d\'\' b\' a\' g\' a\' b\'\nr4 r4 r4. \n\\fullRest\n }', 'altAlleinCoda': '{ \n\\transpose c c\' {\ne8 d e d4 e8 d\nd2 r4.\nf8 e f es4 f8 es\nd2 r4.\nf8 f d c b, c d\nr4 r4 r4.\n\\fullRest\n}\n\n}', 'tenorAlleinCoda': '{\na2 r4.\ng8 f g f2\ng8 f g f4 g8 f\na8 a f e d e f\na2 r4.\nr4 r4 r4.\n\\fullRest\n }', 'basAlleinCoda': '{ \nd8 c d c4 d8 c\nbes,2 r4.\na,2 r4.\nbes,2 r4.\nb,2 r4.\nr2..\nc8 c a, g, f, g, a,\n}'}}, 'AlleinCodaSidst': {'voices': {'sopranAlleinCodaSidst': '\\transpose c des{\n<d a f\'>2..\n<bes, d\' f a\'>2..\n<d a f\'>2..\n<b, d\' f a\'>2..\n }', 'altAlleinCodaSidst': '\\transpose c des{ \ne\'8 d\' e\' d\'4 e\'8 d\'8\n\\fullRest\ne\'8 d\' e\' d\'4 e\'8 d\'8\n\\fullRest\n}', 'tenorAlleinCodaSidst': '\\transpose c des{\n\n\\fullRest\na8 g a g4 a8 g\n\\fullRest\na8 g a g4 a8 g\n }', 'basAlleinCodaSidst': '\\transpose c des\'{ \n\\fullRest\n\\fullRest\n\\fullRest\n\\fullRest\n}'}}, 'Amen': {'voices': {'sopranAmen': '{\n\\transpose c des\' {\nc\'2..~ \nc\'4 < a>4 <g>4 <f>8\n<des f bes>2~\n <des f bes>8\n < d a>4\n<bes, d g>4.~\n<bes, c g>2\n<bes, f>2~\n <bes, f>8~\n <a, c f>4  }\n\n\n\\transpose c des {\n\n<bes c\' f\' bes\'>2\n <a c\' f\' a\'>4.\n<a c\' f\' c\'\'>2..\n<bes c\' g\' bes\'>8\n<a c\' f\' f\'\'>8\n<bes c\' g\' bes\'>8\n<a c\' a\'>2\n}\n }', 'altAmen': '\\transpose c des{  \n<f\' a\'>2..\n  \\fullRest  \\fullRest  \\fullRest  \n  \\fullRest  \\fullRest  \\fullRest  \n\n\\fullRest  }', 'tenorAmen': '\\transpose c des{ \nc\'8 c\' a g f g a\ng4 f4 r4.\n \\fullRest   \\fullRest \\fullRest\n  \\fullRest  \\fullRest  \\fullRest  \n}', 'basAmen': '{ \n\\transpose c des\' {\nc,2..~ \nc,4 <c,>4 <cis, >4 <d, >8\n<es, g, >2~\n <es, g,>8\n <b,, f,>4\n<c, f, bes, >4.~\n<c, e, bes, >2\n<f,, d, bes, >2~\n <f,, d, bes, >8~\n <f,, c, a, >4  }\n\n\n\\transpose c des {\n\n<f, d f bes >2\n <f, c f a >4.\n<f, e a >2..\n<f, d f bes >8\n<f, e a >8\n<f, d f bes >8\n<f, c g a >2\n}\n}'}}, 'Intro': {'voices': {'sopranIntro': '{\n\\repeat unfold 19 \\fullRest\n }', 'altIntro': '{\\sopranIntro }', 'tenorIntro': '{\n\nr4 a8 r8 c\'4 b8 \nc\'4 r4 r4.\n\nr4 a8 r8 c\'4 b8 \nd\'4 b8 c\'4 r4 \n\nr4 a8 r8 c\'4 b8 \nc\'4 r4 r4.\n\nr4 a8 r8 c\'4 bes8 \na4 r4 r4.\n\n\n\nr4 f8 r8 c\'4 bes8 \nc\'4 r4 r4.\n\nr4 f8 r8 c\'4 bes8 \nd\'4 bes8 c\'4 r4\n\nr4 f8 r8 c\'4 bes8 \nd\'4 bes8 c\'4 r4\n\nr4 f8 r8 c\'4 bes8 \nd\'4 bes8 c\'4 r8 f8\nd\'4 bes8 c\'4 d\'8 c\'\nf\'2 c\'4 r8\n\n\n\nr4 d\'8 c\'8 f\'4.\n\n}', 'basIntro': '{\n\\fullRest \n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatTre\n }'}}, 'QuiTollisA': {'voices': {'sopranQuiTollisA': '{ \n\\time 4/2\nf\'2 r2 r1 r1.\n%  r1 r1 r1.\n\\transpose c g\'{ \n%  flyt til alt og sæt en kvart ned\n%  qui tollis peccata mundi, miserere nobis;\nr4 g,4 d c8 d4\nr8\ng,8 d4 c8 es4 c8 d4. r4\nr4 r4 r4\n\n%  qui tollis peccata mundi, suscipe deprecationem nostram.\nr4 g,4 d c8 d4\nr8\ng,8 d4 c8 es4 c8 d4. r1\n\n%  Qui sedes ad dexteram Patris, miserere nobis.\nr4 g,4 d c8 d4\nr8\ng,8 d4 c8 d es4 c8 d4. r2..\n}\n\n}\n\n\n\n', 'altQuiTollisA': '{ \n\\doubleRest \\doubleRest \n\\doubleRest \\doubleRest\n}', 'tenorQuiTollisA': '{ \n\\doubleRest \\doubleRest \n\\doubleRest \\doubleRest\n}', 'basQuiTollisA': '{\n\n\n\\transpose c g,{\n\\QuiTollisOstinatEt\n\\QuiTollisOstinatEt\n\\QuiTollisOstinatEt\n\\QuiTollisOstinatEt\n}\n}'}}, 'QuiTollisB': {'voices': {'sopranQuiTollisB': '{\n%  transponer til es-lydisk\n\n%  Quoniam tu solus Sanctus, \nr2 d\'8 bes\'4 a\'8 bes\'4 r4 d\'8 bes\'4\n a\'8 c\'\'4 bes\'4 \n%  tu solus Dominus, \n r4 r4 r4 r4 d\'8 bes\'4 a\'8 c\'\'4 a\'8 bes\'4 \n%  tu solus Altissimus,\n r4.  d\'8 bes\'8\n a\'8 bes\' d\'\'4 bes\'8 c\'\'4 r4 r4 r4.\n%  Jesu Christe\n\n<f\' bes\'>2 <e\' a\'>4\n<f\' bes\'>2 <e\' a\'>2\n<g\' c\'\'>2 <f\' bes\'>2\n<g\' d\'\'>2 <f\' bes\'>4\n\n\\time 7/8\n\n\n\n }', 'altQuiTollisB': '{ \n\\doubleRest \\doubleRest \n\\time 7/4\nr1*7/4 r1*7/4\n}', 'tenorQuiTollisB': '{\\doubleRest \\doubleRest \n\\time 7/4\nr1*7/4 r1*7/4\n  }', 'basQuiTollisB': '{\\QuiTollisOstinatTo\n\n<f d\'>2 <g bes>\n<f d\'>4 <g c\'>\n<f d\'>4 <g bes>\n<ges es\'>4 <bes d\'>\n<ges es\'>4 <bes c\'>\n<ges d\'>4 <bes es\'>\n\n\n<g d\'>2 <bes c\'>4\n<g d\'>2 <bes c\'>2\n<bes e\'>2 <c\' d\'>2\n<bes e\'>2 <c\' d\'>4\n\n}'}}, 'FugaSlut': {'voices': {'sopranFugaSlut': '{ \n\\transpose c c\' {\nd\'4 c\' bes ges8\nf2 r4 f8\nd\'8 f\' es\'4 c\'8 bes ges\nf2 r4 f8\nes\'2~ es\'8 c\' d\'\nes\'4 d\'8 es\'4 c\'\ng\'2~ g\'8 es\' f\'\ng\'4 f\'8 g\'4 es\'\n<bes>2 r8 <bes>8 <bes>\n<as des\'>2 r8 <bes des\'>4\n}\n}', 'altFugaSlut': '{ \n\\transpose c c\' {\n<ges bes>4 <f as> <es ges> es8\nd2 r8 d4\n<ges bes>2 <es ges>4 es8\nd2 r8 d4\nges2~ ges8 es f\nges4 f8 ges4 es\nc\'2~ c\'8 g a \nbes4 a8 bes4 g\nf2 r8 f f \nges2 r8 f4\n}\n}', 'tenorFugaSlut': '{\nes\'4 d\' c\' bes8\nc\'4 bes8 a4 bes\nc\'4 r4 c\'4.\nc\'4 bes8 a4 bes\nc\'4 r4 r8 as bes\nc\'4 bes8 c\'4 as\nes\'2~ es\'8 c\' d\'\nes\'4 d\'8 es\'4 c\'\nes\'2 r8 es\' es\'\ndes\'2 r8 des\' ces\'\n }', 'basFugaSlut': '{\nc4 d es f8\n<bes, f>2 r4 r8\nc4 d es f8\n<bes, f>2 r4 r8\nas,4 as,8 as4 as,4\n\nas4 g8 as4 as,8 as\na4 a,8 a4 a8 bes8\n\nc\'4 bes8 c\'4 a\n\nbes4 bes,8 bes4 bes,8 bes\ndes4 des8 des\'4 des4\n}'}}, 'IntroTo': {'voices': {'sopranIntroTo': '{ \\repeat unfold 19 \\fullRest\n}', 'altIntroTo': '{ \\sopranIntroTo }', 'tenorIntroTo': '{\n\nc\'2 r8 d\' c\'\nf\' c\' d\' c\' g\' f\'4\n c\'2 r8 d\' c\'\nf\' c\' d\' c\' g\' f\'4\n\nc\'4 d\'8 c\' g\' f\'4\nc\'4 d\'8 c\' g\' f\'4\n\nc\'2 r4.\n\n\n\nr4 a8 r8 c\'4 b8 \nc\'4 r4 r4.\n\nr4 a8 r8 c\'4 b8 \nd\'4 b8 c\'4 r4 \n\nr8 a8 d\'4 b8 \nc\'4 a8 c\' d\'4 c\'4\na8 c\' d\'8 c\' f\'4 c\'4\na8 c\' d\'8 c\' f\'4. c\'4\nd\'8 c\' g\'8 f\'4\n\n%  a8 r8 d\'4 b8 \n%  c\'4 a8 d\'8 b8 c\'4\n\n%  a8 c\' d\'4. c\'4\n%  a8 c\' d\'8 b8 d\'8 c\'4\n%  d\'8 b8 d\'4. c\'4 d\'8 b8\n\n%  \\repeat unfold 3 \\fullRest\n\n\n\\fullRest\n\nc\'8 c\' a g f g a\ng4 f2 r8\n\n}', 'basIntroTo': '{\n\\basOstinatTo\n\\basOstinatTre\n\\basOstinatTo\n\\basOstinatTre\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\n{r4 <d f g>8 r8 <c f a>4 <d f g>8 \n<c f a>4 r4 r4.}\n\n%  \\repeat unfold 2 \\fullRest\n\n\n\\fullRest \\fullRest\n\n{r4 <d f bes>4 <es f c\'>8 <d f bes>4\n}\n}'}}, 'AlleinCodaQui': {'voices': {'sopranAlleinCodaQui': '{r2.. }', 'altAlleinCodaQui': '{r2.. }', 'tenorAlleinCodaQui': '{ r2..}', 'basAlleinCodaQui': '{ r2..}'}}, 'GloryAnden': {'voices': {'sopranGloryAnden': '{\\sopranGlory }', 'altGloryAnden': '{\\altGlory \n\n\n}', 'tenorGloryAnden': '{ \\tenorGlory\n\n\n}', 'basGloryAnden': '{\\basGlory }'}}, 'GloryAAnden': {'voices': {'sopranGloryAAnden': '{ \\sopranGloryA}', 'altGloryAAnden': '{\\altGloryA }', 'tenorGloryAAnden': '{\\tenorGloryA }', 'basGloryAAnden': '{\\basGloryA }'}}, 'AlleinAAnden': {'voices': {'sopranAlleinAAnden': '{\\AlleinSop }', 'altAlleinAAnden': '{ \n r2..  \\fullRest  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest\n}', 'tenorAlleinAAnden': '{\n\n r2..  \\fullRest  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest  \n  }', 'basAlleinAAnden': '{\\AlleinBas }'}}, 'AlleinBAnden': {'voices': {'sopranAlleinBAnden': '{ <f\'\' c\' f\'>4 <e\'\' c\' g\'>4 <d\'\' f\' f>4 <c\'\' e\' c\'>8 \n<d\'\' g\' bes>4 <d\'\' a\' bes>8 <c\'\' g\' c\'>4 <c\'\' a\' c\'>8~ <c\'\' g\' c\'>8 \n<f\'\' a f\'>8~ <f\'\' b f\'>8 <e\'\' g\' c\'>4 <d\'\' a\' c\'>4 <c\'\' a\' d\'>8 \n<d\'\' b\' d\'>8~ <e\'\' b\' d\'>8 <d\'\' b\' e\'>8 <c\'\' a\' e\'>4 <c\'\' bes\' e\'>4 \n\n<c\'\' a\' f\'>4 <a\' f\' c\'>4 <g\' e\' c\'>4 <f\' d\'>8\ng\'2~ g\'8 a\'8 g\'8\n}', 'altAlleinBAnden': '{  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest   }', 'tenorAlleinBAnden': '{  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n \\fullRest  \\fullRest   }', 'basAlleinBAnden': '{\n\na,4 a,4 bes,4 c8\ng,8 g8 f8 e4 f8 e8 \nd4 e4 f4 fis8\ng4 gis8 a4 g4 \nf4 f4 c4 d8\nbes,4 g,8 c4 cis4 \n }'}}, 'AlleinATredje': {'voices': {'sopranAlleinATredje': '{\n\\key ges \\major\n\\transpose f ges {\n\n<c\'\' a\' f\'>4 <a\' f\' c\'>4 <g\' e\' c\'>4 <f\' d\' a>8 \n<g\' d\' g>4 <a\' e\' c\'>8 <f\' d\' a>2\n\nr4. <f\'>2\n<f\'>4 <g\' e\'>4 <a\' f\'>4 <c\'\' g\' c\'>8\n<d\'\' f\' a>4~ <d\'\' g\' bes>8 <c\'\' e\' g>2\n\nr4.  <c\'\' g\' c\'>2\n\n<c\'\' a\' f\'>4 <a\' f\' c\'>4 <g\' e\' c\'>4 <f\' d\' a>8 \n<g\' e\' c\'>4 <a\' e\' cis\'>8 <f\' d\' a>2 \n\nr4. <f\' d\' a>2\n<f\' d\' bes>4 <g\' d\' bes>4 <a\' f\' c\'>4 <c\'\' g\' c\'>8\n<d\'\' a\' c\'>4 <d\'\' g\' b>8 <c\'\' e\' c\'>2 \n\nr4. <c\'\' g\' e\'>2\n\n\n\n\n} }', 'altAlleinATredje': '{ \n\\key ges \\major\n\\transpose f ges\' {\n\n \\fullRest  \\fullRest  \nr4. r4 <e g>8 <d f>8\n<c e> <bes, d> <a, c> <g, bes,> <f, c>4 r8\n\\fullRest  \\fullRest \n \\fullRest  \\fullRest \\fullRest  \\fullRest \n \\fullRest  \\fullRest\n\n}\n}', 'tenorAlleinATredje': '{\n\\key ges \\major\n\\transpose f ges {\n\\fullRest \nr4. r4 <f a>8 <f a>\n <bes g>8 <f a> <bes g>8 <f a> r4.\n\\fullRest\n\\fullRest  \\fullRest \n \\fullRest  \nr4. r4 <f a>8 <f a>\n <bes g>8 <f a> <bes g>8 <f a> r4.\n\n\\fullRest \n \\fullRest  \\fullRest}}', 'basAlleinATredje': '{\n\\key ges \\major\n\\transpose f ges {\n\nf4 f4 c4 d8 \nbes,4 a,8 d2\nr4. d2\nbes,4 g,4 f,8 f8 e8\nd4 bes,8 c2\nr4.  e2\nf4 f4 c4 d8\nc4 a,8 d2\nr4. d2\nbes,4 g,4 f,8 f8 e8\nd4 g8 c2\nr4.  bes,2\n\n\n}\n\n }'}}, 'AlleinBTredje': {'voices': {'sopranAlleinBTredje': '{\n\\transpose f ges \\sopranAlleinB\n}', 'altAlleinBTredje': '{\n\\transpose f ges \\altAlleinB }', 'tenorAlleinBTredje': '{\n\\transpose f ges \\tenorAlleinB }', 'basAlleinBTredje': '{\\transpose f ges \\basAlleinB }'}}}, 'variables': {'fullRest': '{ s1*7/8 }', 'FugaTema': '{ r2 c4. c4 f e f8 d2~ d8 e[ f] }', 'FugaSpin': ' { g8[ f g f] e[ a g]}', 'TripelSpin': '{\\FugaSpin \\modalTranspose d c \\diatonicScale { \\FugaSpin } \\modalTranspose e c \\diatonicScale { \\FugaSpin } d8 c d r2}', 'SynkopeSpin': '{ c8 bes, c4 d8 c d | e d e f e f g | a g a4 r4. \\fullRest }', 'KaldKontra': '{ c4 c\' bes8 c\'4 c4 c\' bes8 d\'4 bes8 c\'4 r2 \\fullRest}', 'kontrapkt': '{ \\time 4/8\n e8 d e d \n\\time 7/8\nc f e d g f e\n a g f e f g a }', 'modstemme': '{r4 c\' a8 g f \ng a g f g f r}', 'modOrgelpkt': '%   mod orgelpkt c:\n{<f bes d\'>8 <e g c\'> <f bes d\'> r \n<g c\' e\'> <f bes d\'> <g c\' e\'> \n|\n<bes d\' f\'>  <g c\' e\'> <bes d\' f\'>  \n<c\' e\' g\'> <bes d\' f\'>  <c\' e\' g\'> <d\' f\' bes\'>\n|\n<c\' e\' g\'> <bes d\' f\'>  <c\' e\' g\'>\nr\n<bes d\' f\'>  <c\' e\' g\'> <d\' f\' bes\'>\n|\n<c\' e\' g\'> <bes d\' f\'>  <c\' e\' g\'> r\n<bes d\' f\'>  <c\' e\' g\'> <d\' f\' bes\'>\n|\n<e\' g\' c\'\'>4  <d\' f\' bes\'>8 <e\' g\' c\'\'> }', 'softKontra': '{e8[ d e d] c[ f e]\nf[ e f e] d4 f8\n}', 'Glory': '{c4 f e f8\nd2 r4. \n c4 f8 e4 f \nd2 r4.\nc4 f e f8\nd2~ d8 e f \ng f g4 r8\n\n} ', 'GloryB': '{c4\nbes4. a4 g8 f \nc4. r4 c\nbes4 a4 g f8 \nc4. r2\n} ', 'GloryC': '{c4 f e f8\n \\time 4/8\n d4 r4\n \\time 7/8 \nd g8 f4 g\n \\time 4/8 \ne4 r8 r8\n \\time 6/8 \ne4 a8 g4 a8\n \\time 7/8 \nf2~ f8 g a \nc\' bes c\'4 r4\n}', 'GloryD': '{f8\nes\'4 d\' c\' bes8\nf2 r4 f8\ne\'8 g\'8 f\'4 d\'8 c\' bes\nf2 r4 f8\nf\'4.~ f\'4 d\'8 e\'\nf\'4 e\'8 f\'4 a\'4\ng\'2 r8 c\'4\n\n}', 'doubleRest': '{ \n\\time 4/2 r1*2 \\time 3/2  r1*3/2\n}', 'basOstinatEt': '{r4 <d f g>8 r8 <c f a>4 <d f g>8 \n<c f a>4 r4 r4.}', 'basOstinatTo': '{r4 <d f bes>4 <c f a>4 <d f bes>8 \n<c f a>4 r4 r4.}', 'basOstinatTre': '{r4 <d f bes>4 <es f c\'>8 <d f bes>4\n<c f a>4 r4 r4.\n}', 'basOstinatEtA': '{r4 <d f g>8 r8 <c f a>4 <d f bes>8 \n<c f a>4 r4 r4.}', 'ensformigTenorIntro': '{\n\nr4 a8 r8 c\'4 b8 \nc\'4 r4 r4.\n\nr4 a8 r8 c\'4 b8 \nc\'4 r4 r4.\n\nr4 a8 r8 c\'4 b8 \nc\'4 r4 r4.\n\nr8 a8 c\'4 b8 d\'8 b8 \nc\'4 r4 r4.\n\n\n\nr4 f8 r8 c\'4 bes8 \nc\'4 r4 r4.\n\nr4 f8 r8 c\'4 bes8 \nd\'4 bes8 c\'4 r4\n\nr4 f8 r8 c\'4 bes8 \nd\'4 bes8 c\'4 r4\n\nr4 f8 r8 c\'4 bes8 \nd\'4 bes8 c\'4 r8 f8\nd\'4 bes8 c\'4 d\'8 c\'\nf\'2 c\'4 r8\n\n\n\nr4 d\'8 c\'8 f\'4.\nc\'2 r8 d\' c\'\nf\' c\' d\' c\' g\' f\'4\nc\'2 r8 d\' c\'\nf\' c\' d\' c\' g\' f\'4\n\nc\'2 r4.\nr4 d\'8 c\' g\' f\'4\n\n\\fullRest\n\nc\'8 c\' a g f g a\ng4 f2 r8\n\n%  \\repeat unfold 2 \\fullRest\n}', 'QuiTollisOstinatEt': '{<g d\'>2 <a c\'>\n<g d\'>4 <a c\'>\n<g d\'>4 <a c\'>\n<as es\'>4 <bes d\'>4 \n<as es\'>2 <a c\'>2 }', 'QuiTollisOstinatTo': '{<f d\'>2 <g bes>\n<f d\'>4 <g c\'>\n<f d\'>4 <g bes>\n<ges es\'>4 <bes d\'>4\n<ges es\'>2 <bes c\'>2}', 'AlleinSop': '{\n<c\'\' a\' f\'>4 <a\' f\' c\'>4 <g\' e\' c\'>4 <f\' d\' a>8 \n<g\' d\' g>4 <a\' e\' c\'>8 <f\' d\' a>4 <f\' d\' a>4 \n<f\' d\' bes>4 <g\' e\' bes>4 <a\' f\' c\'>4 <c\'\' g\' c\'>8\n<d\'\' f\' a>4~ <d\'\' g\' bes>8 <c\'\' e\' g>4 <c\'\' g\' c\'>4 \n\n<c\'\' a\' f\'>4 <a\' f\' c\'>4 <g\' e\' c\'>4 <f\' d\' a>8 \n<g\' e\' c\'>4 <a\' e\' cis\'>8 <f\' d\' a>4 <f\' d\' a>4 \n<f\' d\' bes>4 <g\' d\' bes>4 <a\' f\' c\'>4 <c\'\' g\' c\'>8\n<d\'\' a\' c\'>4 <d\'\' g\' b>8 <c\'\' e\' c\'>4 <c\'\' a\' e\'>8~ <c\'\' g\' e\'>8 \n\n\n}', 'AlleinBas': '{\nf4 f4 c4 d8 \nbes,4 a,8 d4 d4 \nbes,4 g,4 f,8 f8 e8\nd4 bes,8 c4 e4 \nf4 f4 c4 d8\nc4 a,8 d4 d4 \nbes,4 g,4 f,8 f8 e8\nd4 g8 c4 bes,4\n\n\n}'}, 'score': [{'context': 'sopran', 'content': '\\tempo "Allegretto" 4 = 140 \\key f \\major \\time 7/8 \\sopran'}, {'context': 'alt', 'content': '\\key f \\major \\time 7/8 \\alt'}, {'context': 'tenor', 'content': '\\key f \\major \\time 7/8 \\clef "treble_8" \\tenor'}, {'context': 'bas', 'content': '\\key f \\major \\time 7/8 \\clef "bass" \\bas'}]};

  json: IModel;
  loadUrl = 'http://localhost:8081/getFile/users1.json';
  saveUrl = 'http://localhost:8081/saveFile/users1.json';
  globalContext = new GlobalContext();

  load(): Observable<IModel> {
      const model = this.http.get<IModel>(this.loadUrl);
      return model;
  }

  saveModel(model: IModel): Observable<string[]> {
        return this.http.post<string[]>(this.saveUrl, 'text=' + JSON.stringify(model));
  }

  getVariables(id: string) {
    const varList = this.json[id];
    return varList;
  }
  getModel(): Observable<IModel> {
    return this.load();
  }

  loadFromLily(input: string) {
    const parser = new LilyPondConverter(this.globalContext);
    const parsedObject = parser.read(input);
    return parsedObject;
  }



  getGlobalContext(): GlobalContext {
    for (const key in this.constRes.variables) {
        if (this.constRes.variables.hasOwnProperty(key)) {
            const val = this.constRes.variables[key];
            try {
                const score = this.loadFromLily(val);
                const voice = score.staffElements[0].voiceElements[0];
                this.globalContext.addVariable(key, voice.getSequence('0'));
            } catch (_) { }
        }
    }
      return this.globalContext;
  }

  dummy() {
/*
    function appendObjToList(listId, obj) {
      //  alert("append");
        var list = document.getElementById(listId);
        for(var v in obj) {
            var $li = $("<li>").appendTo(list);

            $li.text(v).data("name", v).click(function(ev) {
                var $target = $(ev.target);
                var name = $target.data("name");
                var data = obj[name];
                $(vartext).val(data).data("varName", $target.text()).data("obj", obj);
            });
        }
    }
    //alert("b");

        for(var v in data.sections) {
            $('<option>').text(v).val("sections_"+v).appendTo("#sectionChooser");
            var $li = $("<li>").appendTo("#sections");
            var $list = $("<ul>").appendTo($li).attr("id", "sections_"+v);
            appendObjToList("sections_"+v, data.sections[v].voices);
        }

    $("#sectionChooser").change(function(){
        var v = $("#sectionChooser").val();
        $("#sections>li").hide();
        $("#" + v).parent().show();
    });
    //alert("c");
    $("#sections>li").hide();
    if (data.voices.sections.length){
        $("#sectionChooser").val("sections_" + data.voices.sections[0]);
        $("#sections_" + data.voices.sections[0]).parent().show();
    }

    elm.value = JSON.stringify(data);

    $("#addNewVar").click(function(){
        //alert("click");
        var name= $("#newVar").val();
        data.variables[name] = "";
        $("#variables").empty();
        appendObjToList("variables", data.variables);
        $(elm).val(JSON.stringify(data));
    });
    //alert("d");

    $("#sectionlist").val(data.voices.sections.join("\n")).change(function(){
        data.voices.sections = $("#sectionlist").val().split("\n");
        $(elm).val(JSON.stringify(data));
    });
    $("#voices").val(data.voices.voices.join("\n")).change(function(){
        data.voices.voices = $("#voices").val().split("\n");
        $(elm).val(JSON.stringify(data));
    });

    $("#opretSecVoices").click(function(){
        var changed = false;
        for(var j = 0; j < data.voices.sections.length; j++) {
            var section = data.voices.sections[j];
            if (!data.sections[section]){
                data.sections[section] = {voices: {}};
                changed = true;
            }
            var theSection = data.sections[section];
            for(var i = 0; i < data.voices.voices.length; i++) {
                var voice = data.voices.voices[i];
                if (!theSection.voices[voice + section]){
                    theSection.voices[voice + section] = "{ }";
                    changed = true;
                }
            }
        }
        if (changed) $(elm).val(JSON.stringify(data));

    });*/
      }



}
