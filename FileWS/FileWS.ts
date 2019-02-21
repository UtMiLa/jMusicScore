import express = require('express');
import cors = require('cors');

//import { Express } from 'express';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { writeFile, unlinkSync, exists, readFile, readdir, rename, unlink } from 'fs';
//import {  } from 'url';
import { parse, stringify }  from 'querystring';
import { spawn } from 'child_process';
var replace = require('buffer-replace');

const lilyExe = 'C:\\Program Files (x86)\\LilyPond\\usr\\bin\\lilypond.exe';

// todo: list files
// todo: save json without ly

//{"voices":{"voices":["sopran","alt","tenor","bas"],"sections":["Intro","IntroTo","Glory","GloryA","AlleinA","AlleinB","AlleinCoda","Glory","GloryA","AlleinA","AlleinB","AlleinCodaQui","QuiTollisA","QuiTollisB","Foerste","Anden","Tredje","FugaSlut","AlleinA","AlleinB","AlleinCodaSidst","Amen"]},"scales":{"diatonicScale":"{ c d e f g a bes }"},"sections":{"Glory":{"voices":{"sopranGlory":"{\\modalTranspose c c' \\diatonicScale { \\Glory r4 \\fullRest\n\\Glory \n\\GloryB\n}\n\n}","altGlory":"{\nf2..\n{\\repeat unfold 5 \\fullRest}\nr4. r4\n\\transpose c g {c'8 c' a g f g a\ng4 f4 } r4 r4.\n{\\repeat unfold 10 \\fullRest}\n\n\n}","tenorGlory":"{\\altGlory\n}","basGlory":"{<c f a>4 r4 r4.\n\n\\basOstinatTo\n\\basOstinatTre\n\n{\\repeat unfold 14 \\fullRest}\n}"}},"Foerste":{"voices":{"altFoerste":"{<bes e' g' c''>2 r4.\n\\relative c'{ \n\\repeat unfold 4 \\fullRest \n\\repeat unfold 4 \\fullRest \n \\FugaTema \\FugaSpin\n \\modalTranspose d c \\diatonicScale { \\FugaSpin }\n\\transpose c c' {\n\\softKontra\n%e8 d e r e f g \n%a g a g f g a \nbes8 a bes a g c' b\na g a g fis bes a\n}}}","tenorFoerste":"{\\modalTranspose c g \\diatonicScale {\n \\repeat unfold 4 \\fullRest  \n\n\\FugaTema \n\\FugaSpin \n\\modalTranspose d c \\diatonicScale { \\FugaSpin } \n\\modalTranspose e c \\diatonicScale { \\FugaSpin } \n}\n \\modalTranspose c f \\diatonicScale { \\softKontra }\n%a8 g a r a bes c'\n%d' c' d' c' bes c' d' \ng8 r bes b c'4 cis'8\nd'4 a b g8\n%\\modalTranspose e c' \\diatonicScale { \\FugaSpin } \n%\\modalTranspose e bes \\diatonicScale { \\FugaSpin } \nc'4 r r r8 r4 r r4.\nf4 fis g gis8 a4 r a8 g a\n}","basFoerste":"{     \n{ c2.. c4 f e f8 d2~ d8 e[ f] }\n \\FugaSpin\n \\modalTranspose d c \\diatonicScale { \\FugaSpin }\n\n\\softKontra\n\nbes8 r f4 g f8\ne r c4 f4 e8\nd4 dis e c8\n\nf2 r4 r8 \n% \\modalTranspose c g \\diatonicScale { \\SynkopeSpin }\n \\fullRest \\fullRest \\fullRest \\fullRest\n \\fullRest\n \\fullRest\n%f4 fis g gis8 a4 \nr4 c8 cis d4 dis8\n\n}","sopranFoerste":"{ \n\\repeat unfold 5 \\fullRest \n\\repeat unfold 8 \\fullRest \n\\modalTranspose c g' \\diatonicScale { \\FugaTema }\n\\transpose c g' { \\FugaSpin }\n\\modalTranspose d g' \\diatonicScale { \\FugaSpin }\n}"}},"Anden":{"voices":{"altAnden":"\\transpose c c' {\ngis8 fis gis r r4.\n\\fullRest \\fullRest \\fullRest\n\\modalTranspose c d \\diatonicScale { r2 c4. c4 f e f8 d2~ d8 c[ d] }\n\n\\transpose e d { g8[ fis g fis] eis[ ais gis]}\ne a g f c' b g\na4 a, a g8 \nbes4 g8 a4 f8 g\n\n\\transpose c d { g8[ f g f] e[ a g]}\n\\transpose c c { g8[ f g f] e[ f g]}\n\n\nc4 f e f8\n\nd2~ d8 e f\n\n\\modalTranspose c c \\diatonicScale {\\FugaSpin\n}\n}\n\n\n","tenorAnden":"{\nb4 e' d' e'8\nc'2~ c'8 d' e' \n\\modalTranspose c bes \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c c' \\diatonicScale  { e8[ d e d] cis'[ f e]}\nd' c' d' r a g a\nbes a bes a g a bes\nc' bes c' bes a b cis'\nd'4 gis8 a b4 gis8\na4 e4 e' c'8\n\nd' r4 r2\n\n\\fullRest\nr2 a8 g a\nb4 e' d' e'8\nc'2~ c'8 d' e'\n\n\n\\modalTranspose c bes \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c a \\diatonicScale {\\FugaSpin\n}\n\n}","basAnden":"{\ne4 r e4. e4 a g a8 f2~ f8 e f\n\\modalTranspose c c \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose e d \\diatonicScale  { g8[ f g f] e[ f g]}\ng r4 r2\nr4 a, a g8 \na4 r r r8\ne4 a g a8 f2~ f8 e f\n\\modalTranspose c c \\diatonicScale {\\FugaSpin\n}\n\\modalTranspose d c \\diatonicScale {\\FugaSpin} \n\ne8 d e4 r4 r8\n\ne8 d c d4 bes,8 a, \n\nbes,4 g,4 bes, d8\nc4 c4 c'4.\n}\n","sopranAnden":"{\nb'8 a' b' r r r r\n\\repeat unfold 2 \\fullRest \n\n\\modalTranspose c a' \\diatonicScale { \\FugaTema }\n\\transpose c a' { g8[ f g f] e[ as g]}\n\\transpose c g' { g8[ f g f] e[ a g]}\nc'' b' c''4. d''8 e''\nf'' e'' f'' e'' d'' g'' f''\ne''4 e' e'' d''8 \nf''4 d''8 e''4 e'4\ne''4 c''8[ d''8 e' d'' b'] \nc''4 a'8 bes'4 r8 f'\n\nf'4 bes' a' bes'8\ng'2~ g'8 f' g'\n\n}"}},"Tredje":{"voices":{"altTredje":"\\transpose c c'{\n\\modalTranspose d c \\diatonicScale {\\FugaSpin\n}\n\\modalTranspose e c \\diatonicScale {\\FugaSpin\n}\nd4 d4 e e8\nf8 d f e a g e\n\nfis e fis r fis e fis\ng fis g a g a bes\na g a r g a bes\na g a r g a bes\nc'4 bes8 c'2\n\n\\fullRest \\fullRest \\fullRest \\fullRest \\fullRest \\fullRest \\fullRest \\fullRest \n}","tenorTredje":"{\n\n\\modalTranspose c g \\diatonicScale {\\FugaSpin\n}\n\\modalTranspose c f \\diatonicScale {\\FugaSpin\n}\n\nbes4 b c' cis'8\nd'8 g bes c'4 d'8 e' \nd' c' d' r d' c' d'\n\n\\transpose c c'{\nes d es f es f g\nf es f r es f g\nf es f r es f g\na4 g8 a2\n}\n%r4 d d' c'8 e'4 c'8 d'4 r4\n\\fullRest \\fullRest\n\n\n\\transpose c bes {c4 f e f8\nd2 r4 r8\nd4 g f g8\ne2 r4 r8\ne4 a g a8\n}\n\n\\fullRest \n}","basTredje":"{r4 c4 c'4.\nr4 c4 c'4.\n\n\\transpose c c {\nr4 c c' bes8\nc'4 c c' bes8\nc'4 a8 c'4 a8 c'\nbes4 c8 bes4. d'8\nc'4 c8 c'4 d'8 bes8\nc'4 c8 c'4 d'4\nc'4. c'8 a8 g f \ng8 a8 g4. f4\n\n\\fullRest \\fullRest \\fullRest \\fullRest \\fullRest \\fullRest \n\\fullRest \n}\n}","sopranTredje":"{\n\n\\modalTranspose c e' \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c d' \\diatonicScale {\\FugaSpin\n}\n\n\\modalTranspose c c' \\diatonicScale {\\FugaSpin\n}\n\nf'8[ bes' a'] g'[ c'' bes' c'']\n\n\n%\\repeat unfold 3 \\fullRest \n\\transpose c f {\n% mod orgelpkt c:\n{<e'>8[ <d'> <e'>] r \n<e'>8[ <d'> <e'>] \n|\n<f'>[  <e'> <f'>]  \n<g'>[ <f'>  <g'> <bes'>]\n|\n<g'>[ <f'>  <g'>]\nr\n<f'>[  <g'> <bes'>]\n|\n<g'>[ <f'>  <g'>] r\n<f'>[  <g'> <bes'>]\n|\n<c''>4  <bes'>8 <c''>2 }\n}\n\\fullRest\n\n\\transpose c f' {c4 f e f8\nd2 r4 r8\nd4 g f g8\ne2 r4 r8\ne4 a g a8\nf2~ f8 g a \nc' bes c'4 r4.\n}\n\n}"}},"GloryA":{"voices":{"sopranGloryA":"{\\transpose c c' { \n\\GloryC\n\\GloryD\n}\n}","altGloryA":"{\nf2..\n \\repeat unfold 12 \\fullRest \n}","tenorGloryA":"{\\altGloryA\n}","basGloryA":"{\\altGloryA}"}},"AlleinA":{"voices":{"sopranAlleinA":"{\\transpose c c' { c'4 a8 g4 f\ng a8 f4 f\nf g8 a4 c'\nd'4. c'4 c'\nc'4 a4 g4 f8\ng4 a8 f4 f\nf g8 a4 c'\nd'4. c'4 c'\n}\n}","altAlleinA":"{ f2..\n  \\fullRest   \\fullRest   \\fullRest \n  \\fullRest   \\fullRest   \\fullRest \n\\fullRest   \n}","tenorAlleinA":"{\n \\altAlleinA\n }","basAlleinA":"{  \\altAlleinA\n}"}},"AlleinB":{"voices":{"sopranAlleinB":"{\\transpose c c' { \n\nf'4 e'4 d'4 c'8\nd'4 d'8 c'4 c'\nf'4 e'8 d'4 c'\nd'8 e'8 d'8 c'4 c'\nc'4 a8 g4 f\ng4.~ g4 a8 g\n}\n}","altAlleinB":"{ \n\\transpose c c' {\n f2..  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \n\nd4 <d f>8 <d f>4 e4\n}}","tenorAlleinB":"{  f2..  \\fullRest \n \\fullRest  \\fullRest  \\fullRest \ng4 bes8 bes4 a4\n}","basAlleinB":"{   f2..  \\fullRest \n \\fullRest  \\fullRest  \\fullRest  \nbes,4 g,8 c4 cis\n\n}"}},"AlleinCoda":{"voices":{"sopranAlleinCoda":"{\nf'2 r8 g'4\na'8 g' a' g'4 a'8 g'\nc''8 c''8 a'8 g'8 f'8 g'8 a'8 \nd''2 r4.\nd''8 d'' b' a' g' a' b'\nc''2 r4. \n }","altAlleinCoda":"{ \n\\transpose c c' {\ne8 d e d4 e8 d\nd2 r4.\nf8 e f es4 f8 es\nd2 r4.\nf8 f d c b, c d\nc2 r4.\n}\n\n}","tenorAlleinCoda":"{\na2 r4.\ng8 f g f2\ng8 f g f4 g8 f\na8 a f e d e f\na2 r4.\nc'2 r4.\n }","basAlleinCoda":"{ \nd8 c d c4 d8 c\nbes,2 r4.\na,2 r4.\nbes,2 r4.\nb,2 r4.\nc8 c a, g, f, g, a,\n}"}},"AlleinCodaSidst":{"voices":{"sopranAlleinCodaSidst":"{\n<d a f'>2..\n<bes, d' f a'>2..\n<d a f'>2..\n<b, d' f a'>2..\n }","altAlleinCodaSidst":"{ \ne'8 d' e' d'4 e'8 d'8\n\\fullRest\ne'8 d' e' d'4 e'8 d'8\n\\fullRest\n}","tenorAlleinCodaSidst":"{\n\n\\fullRest\na8 g a g4 a8 g\n\\fullRest\na8 g a g4 a8 g\n }","basAlleinCodaSidst":"{ \n\\fullRest\n\\fullRest\n\\fullRest\n\\fullRest\n}"}},"Amen":{"voices":{"sopranAmen":"{\n\\transpose c c' {\nc'2..~ \nc'4 <c, a>4 <cis, g>4 <d, f>8\n<es, g, des f bes>2~\n <es, g, des f bes>8\n <b,, f, d a>4\n<c, f, bes, d g>4.~\n<c, e, bes, c g>2\n<f,, d, bes, f>2~\n <f,, d, bes, f>8~\n <f,, c, a, c f>4  }\n\n<f, d f bes c' f' bes'>2\n <f, c f a c' f' a'>4.\n<f, e a c' f' c''>2..\n<f, d f bes c' g' bes'>8\n<f, e a c' f' f''>8\n<f, d f bes c' g' bes'>8\n<f, c g a c' a'>2\n\n }","altAmen":"{  \n<f' a'>2..\n  \\fullRest  \\fullRest  \\fullRest  \n\n\n\\fullRest  }","tenorAmen":"{ \nc'8 c' a g f g a\ng4 f4 r4.\n \\fullRest   \\fullRest \\fullRest\n\n}","basAmen":"{ \nc2..~\nc2 \n  \\fullRest  \\fullRest  \n%<f, c f a c' f'>8\n% <f, d f bes c' f'>2\n% <f, c f a c' f'>4\n}"}},"Intro":{"voices":{"sopranIntro":"{\n\\repeat unfold 19 \\fullRest\n }","altIntro":"{\\sopranIntro }","tenorIntro":"{\n\nr4 a8 r8 c'4 b8 \nc'4 r4 r4.\n\nr4 a8 r8 c'4 b8 \nd'4 b8 c'4 r4 \n\nr4 a8 r8 c'4 b8 \nc'4 r4 r4.\n\nr4 a8 r8 c'4 bes8 \na4 r4 r4.\n\n\n\nr4 f8 r8 c'4 bes8 \nc'4 r4 r4.\n\nr4 f8 r8 c'4 bes8 \nd'4 bes8 c'4 r4\n\nr4 f8 r8 c'4 bes8 \nd'4 bes8 c'4 r4\n\nr4 f8 r8 c'4 bes8 \nd'4 bes8 c'4 r8 f8\nd'4 bes8 c'4 d'8 c'\nf'2 c'4 r8\n\n\n\nr4 d'8 c'8 f'4.\n\n}","basIntro":"{\n\\fullRest \n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatTre\n }"}},"QuiTollisA":{"voices":{"sopranQuiTollisA":"{ \n\\fullRest \n\\time 7/4\n\\doubleRest \\doubleRest \n\\transpose c c''{ \n%flyt til alt og sæt en kvart ned\n%qui tollis peccata mundi, miserere nobis;\nr4 g,4 d c8 d4\nr8\ng,4 d c8 es4 c8 d4 r4\nr4 r4 r4\n\n%qui tollis peccata mundi, suscipe deprecationem nostram.\nr4 g,4 d c8 d4\nr8\ng,4 d c8 es4 c8 d4 r1\n\n%Qui sedes ad dexteram Patris, miserere nobis.\nr4 g,4 d c8 d4\nr8\ng,4 d c8 d es4 c8 d4 r2..\n}\n\n}\n\n\n\n","altQuiTollisA":"{ \n\\fullRest \n\\QuiTollisOstinatEt\n\\QuiTollisOstinatEt\n\\QuiTollisOstinatEt\n\\QuiTollisOstinatEt\n}","tenorQuiTollisA":"{ \\fullRest\ng,4 r1. r4 f,4 r2 r2. \\doubleRest \n\\doubleRest \\doubleRest \\doubleRest \n\\doubleRest \\doubleRest\n}","basQuiTollisA":"{\\tenorQuiTollisA\n}"}},"QuiTollisB":{"voices":{"sopranQuiTollisB":"{\n%transponer til es-lydisk\n\n%Quoniam tu solus Sanctus, \nr2 d'8 bes'4 a'8 bes'4 r4 d'8 bes'8~\nbes'8 a' c''4 bes'4 \n%tu solus Dominus, \n r4 r4 r4 r4 d'8 bes'8~   bes'8 a'8 c''4 a'8 bes'4 \n%tu solus Altissimus,\n r4.  d'8 bes'8\n a'8 bes' d''4 bes'8 c''4 r4 r4 r4.\n%Jesu Christe\n\n<f' bes'>2 <e' a'>4\n<f' bes'>2 <e' a'>2\n<g' c''>2 <f' bes'>2\n<g' c''>2 <f' bes'>4\n\n\\time 7/8\n\n\n\n }","altQuiTollisB":"{ \n\\QuiTollisOstinatTo\n\n<g d' f'>4 <bes c' e' >\n<g d' f'>4 <bes c' e' >\n<g d' f'>4 <bes c' e' >\n<g d' f'>4 <bes c' e' >\n<bes es' g' >4 <c' d' f' >\n<bes es' g' >4 <c' d' f' >\n<bes es' g' >4 <c' d' f' >\n\n\n<g d'>2 <bes c'>4\n<g d'>2 <bes c'>2\n<bes e'>2 <c' d'>2\n<bes e'>2 <c' d'>4\n\n\n}","tenorQuiTollisB":"{\\doubleRest \\doubleRest \\doubleRest \\doubleRest \\doubleRest \n\\doubleRest }","basQuiTollisB":"{\\tenorQuiTollisB }"}},"FugaSlut":{"voices":{"sopranFugaSlut":"{ }","altFugaSlut":"{ }","tenorFugaSlut":"{ }","basFugaSlut":"{ }"}},"IntroTo":{"voices":{"sopranIntroTo":"{ \\repeat unfold 19 \\fullRest\n}","altIntroTo":"{ \\sopranIntroTo }","tenorIntroTo":"{\n\nc'2 r8 d' c'\nf' c' d' c' g' f'4\n c'2 r8 d' c'\nf' c' d' c' g' f'4\n\nc'4 d'8 c' g' f'4\nc'4 d'8 c' g' f'4\n\nc'2 r4.\n\n\n\nr4 a8 r8 c'4 b8 \nc'4 r4 r4.\n\nr4 a8 r8 c'4 b8 \nd'4 b8 c'4 r4 \n\na8 r8 d'4 b8 \nc'4 a8 d'8 b8 c'4\n\na8 c' d'4. c'4\na8 c' d'8 b8 d'8 c'4\nd'8 b8 d'4. c'4 d'8 b8\n\n%\\repeat unfold 3 \\fullRest\n\n\n\\fullRest\n\nc'8 c' a g f g a\ng4 f2 r8\n\n}","basIntroTo":"{\n\\basOstinatTo\n\\basOstinatTre\n\\basOstinatTo\n\\basOstinatTre\n\\basOstinatEt\n\\basOstinatEtA\n\\basOstinatEt\n\n{r4 <d f g>8 r8 <c f a>4 <d f b>8 \n<b, f a>4 r4 r4.}\n\n%\\repeat unfold 2 \\fullRest\n\n\n\\fullRest \\fullRest\n\n{r4 <d f bes>4 <es f c'>8 <d f bes>4\n}\n}"}},"AlleinCodaQui":{"voices":{"sopranAlleinCodaQui":"{ }","altAlleinCodaQui":"{ }","tenorAlleinCodaQui":"{ }","basAlleinCodaQui":"{ }"}}},"variables":{"fullRest":"{ s1*7/8 }","FugaTema":"{ r2 c4. c4 f e f8 d2~ d8 e[ f] }","FugaSpin":" { g8[ f g f] e[ a g]}","TripelSpin":"{\\FugaSpin \\modalTranspose d c \\diatonicScale { \\FugaSpin } \\modalTranspose e c \\diatonicScale { \\FugaSpin } d8 c d r2}","SynkopeSpin":"{ c8 bes, c4 d8 c d | e d e f e f g | a g a4 r4. \\fullRest }","KaldKontra":"{ c4 c' bes8 c'4 c4 c' bes8 d'4 bes8 c'4 r2 \\fullRest}","kontrapkt":"{ \\time 4/8\n e8 d e d \n\\time 7/8\nc f e d g f e\n a g f e f g a }","modstemme":"{r4 c' a8 g f \ng a g f g f r}","modOrgelpkt":"% mod orgelpkt c:\n{<f bes d'>8 <e g c'> <f bes d'> r \n<g c' e'> <f bes d'> <g c' e'> \n|\n<bes d' f'>  <g c' e'> <bes d' f'>  \n<c' e' g'> <bes d' f'>  <c' e' g'> <d' f' bes'>\n|\n<c' e' g'> <bes d' f'>  <c' e' g'>\nr\n<bes d' f'>  <c' e' g'> <d' f' bes'>\n|\n<c' e' g'> <bes d' f'>  <c' e' g'> r\n<bes d' f'>  <c' e' g'> <d' f' bes'>\n|\n<e' g' c''>4  <d' f' bes'>8 <e' g' c''> }","softKontra":"{e8[ d e d] c[ f e]\nf[ e f e] d4 f8\n}","Glory":"{c4 f e f8\nd2 r4. \n c4 f8 e4 f \nd2 r4.\nc4 f e f8\nd2~ d8 e f \ng f g4 r8\n\n} ","GloryB":"{c4\nbes4. a4 g8 f \nc4. r4 c\nbes4 a4 g f8 \nc4. r2\n} ","GloryC":"{c4 f e f8\n% \\time 4/8\n d4 r4\n% \\time 7/8 \nd g8 f4 g\n% \\time 4/8 \ne4 r8 r8\n% \\time 6/8 \ne4 a8 g4 a8\n \\time 7/8 \nf2~ f8 g a \nc' bes c'4 r4\n}","GloryD":"{f8\nes'4 d' c' bes8\nf2 r4 f8\ne'8 g'8 f'4 d'8 c' bes\nf2 r4 f8\nf'4.~ f'4 d'8 e'\nf'4 e'8 f'4 a'4\ng'2 r8 c'4\n\n}","doubleRest":"{ r1*7/4 }","basOstinatEt":"{r4 <d f g>8 r8 <c f a>4 <d f g>8 \n<c f a>4 r4 r4.}","basOstinatTo":"{r4 <d f bes>4 <c f a>4 <d f bes>8 \n<c f a>4 r4 r4.}","basOstinatTre":"{r4 <d f bes>4 <es f c'>8 <d f bes>4\n<c f a>4 r4 r4.\n}","basOstinatEtA":"{r4 <d f g>8 r8 <c f a>4 <d f bes>8 \n<c f a>4 r4 r4.}","ensformigTenorIntro":"{\n\nr4 a8 r8 c'4 b8 \nc'4 r4 r4.\n\nr4 a8 r8 c'4 b8 \nc'4 r4 r4.\n\nr4 a8 r8 c'4 b8 \nc'4 r4 r4.\n\nr8 a8 c'4 b8 d'8 b8 \nc'4 r4 r4.\n\n\n\nr4 f8 r8 c'4 bes8 \nc'4 r4 r4.\n\nr4 f8 r8 c'4 bes8 \nd'4 bes8 c'4 r4\n\nr4 f8 r8 c'4 bes8 \nd'4 bes8 c'4 r4\n\nr4 f8 r8 c'4 bes8 \nd'4 bes8 c'4 r8 f8\nd'4 bes8 c'4 d'8 c'\nf'2 c'4 r8\n\n\n\nr4 d'8 c'8 f'4.\nc'2 r8 d' c'\nf' c' d' c' g' f'4\nc'2 r8 d' c'\nf' c' d' c' g' f'4\n\nc'2 r4.\nr4 d'8 c' g' f'4\n\n\\fullRest\n\nc'8 c' a g f g a\ng4 f2 r8\n\n%\\repeat unfold 2 \\fullRest\n}","QuiTollisOstinatEt":"{<g d'>2 <a c'>\n%<g d'> <a c'>\n<g d'>4 <a c'>\n<g d'>4 <a c'>\n<as es'>2 <a d'>4 \n%<as es'>4 <a d'> \n<as es'>2 <a d'>4 }","QuiTollisOstinatTo":"{<g d' f'>2 <bes c' e'>\n%<g d' f'>4 <bes c' e' >\n<g d' f'>4 <bes c' e' >\n<g d' f'>4 <bes c' e' >\n<bes e' g' >2 <c' d' f' >4\n%<bes e' g' >4 <c' d' f' >\n<bes e' g' >2 <c' d' f' >4}"},"score":[{"context":"sopran","content":"\\tempo \"Allegretto\" 4 = 140 \\key f \\major \\time 7/8 \\sopran"},{"context":"alt","content":"\\key f \\major \\time 7/8 \\alt"},{"context":"tenor","content":"\\key f \\major \\time 7/8 \\clef \"treble_8\" \\tenor"},{"context":"bas","content":"\\key f \\major \\time 7/8 \\clef \"bass\" \\bas"}]}
function jsonToLy(filename: string, outName: string, callBack: () => void) {
  readFile(filename, "utf8", function(err, data) {
    var obj = JSON.parse(data);
    var scoreObj = obj.score;
    var bodyText = '\\version "2.18.2"\n';
    var items = [];

    for(var v in obj.scales) {
      items.push({name: v, value:obj.scales[v]});
    }
    for(var v in obj.variables) {
		
		var val = obj.variables[v];
		var txt = "{}";
		var idx = val.indexOf("\\lyricmode");
		if (idx > -1) {
			txt = "{ " + val.substr(idx) + "}";
			val = val.substr(0, idx);
		}		
      items.push({name: v, value:val});
	  items.push({name: v + "txt", value:txt});
    }

    for (var i = 0; i < items.length - 1; i++){
      for (var j = i+1; j < items.length; j++){
        if (items[i].value.indexOf("\\" + items[j].name) > -1){
          var tmp: any = items[j];
          items[j] = items[i];
          items[i] = tmp;
        }
      }  
    }
    for(var v in obj.sections) {
      for(var v1 in obj.sections[v].voices) {

		var val = obj.sections[v].voices[v1];
		var txt = "{}";
		var idx = val.indexOf("\\lyricmode");
		if (idx > -1) {
			txt = "{ " + val.substr(idx) + "}";
			val = val.substr(0, idx);
		}		
      items.push({name: v1, value:val});
	  items.push({name: v1 + "txt", value:txt});



	  items.push({name: v1, value:val});
      }
    }
    /*for(var v in obj.voices) {
      items.push({name: v, value:obj.voices[v]});
    }*/
    for(var i = 0; i < obj.voices.voices.length; i++) {
      var voice = obj.voices.voices[i];
      if (!voice) continue;
      var voiceValue = [];
	  var voiceTxt = []
      for(var j = 0; j < obj.voices.sections.length; j++) {
        var section = obj.voices.sections[j];
        if (!section) continue;
        voiceValue.push("\\" + voice+section);
        voiceTxt.push("\\" + voice+section+"txt");
      }
      items.push({name: voice, value:"{" + voiceValue.join("\n") + "}"});
      items.push({name: voice + "txt", value:"{" + voiceTxt.join("\n") + "}"});
      //"sopran":"{ \n\\sopranFoerste\n\\sopranAnden\n\\sopranTredje\n}",
    }

    for(var i = 0; i < items.length; i++) {
		var val = items[i].value;
		/*var txt = "{}";
		var idx = val.indexOf("\\lyricmode");
		if (idx > -1) {
			txt = "{ " + val.substr(idx) + "}";
			val = val.substr(0, idx);
		}*/
      bodyText += items[i].name + " = " + val + "\n";
	  //bodyText += items[i].name + "txt = " + txt + "\n";
    }

    bodyText += "\\score { \n << \n";  
    /*for (var i = 0; i < scoreObj.length; i++){
//      bodyText += "\\new Staff { "+ scoreObj[i].context +" <<\n" + instrument + "\n" + scoreObj[i].content + "\n >> }\n";
      bodyText += "\\context Staff = "+ scoreObj[i].context +" <<\n" + instrument+ '\n' + scoreObj[i].content + "\n >>\n";
    }*/
	bodyText += makeScore(scoreObj);
    bodyText += ">> \n";
    bodyText += "\\layout {\\context {\\Score \\consists Span_bar_engraver}} \n";
	
	//\consists "Measure_grouping_engraver"
	
    bodyText += "\\midi {} \n";
    bodyText += "}";

    writeFile(outName,  bodyText, callBack);

  });
}


interface IScore {
    group: boolean;
    staves: any[];
    instrument: any[];
    name: string;
    shortname: string;
    content: string;
    context: any;
    removeEmpty: boolean;
}

function makeScore(scoreObj: IScore[]) {
	var bodyText = "";
    var instrument = '\\set Staff.midiInstrument = #"cello"';

	for (var i = 0; i < scoreObj.length; i++){
		if (scoreObj[i].group) {
			bodyText += "\\new "+ scoreObj[i].group +" <<\n";
			bodyText += makeScore(scoreObj[i].staves);
			bodyText += " >>\n";
		}
		else {
			/*bodyText += "\\context Staff = "+ scoreObj[i].context +" <<\n" + instrument+ '\n' + scoreObj[i].content + "\n >>\n";*/
			
			instrument = '\\set Staff.midiInstrument = #"'+scoreObj[i].instrument+'"';
			var extra = scoreObj[i].removeEmpty ? "\n \\RemoveEmptyStaves" : ""
			
			bodyText += '\\new Staff \\with { \n	instrumentName = "' + scoreObj[i].name + '" \n	shortInstrumentName = "' + scoreObj[i].shortname + '" ' + extra + '  } {\n' + instrument + '\n'+ scoreObj[i].content + '\n }  \\addlyrics \\' + scoreObj[i].context + 'txt \n'
		}
    }
	return bodyText;
}


function getFile(res: ServerResponse, name: string){
  readFile("./files"+name, function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(404, {});
        res.end();
      
    }
    else {
      switch(name){
        case "soundfont-player.js": res.writeHead(200, {'Content-Type': 'application/javascript'}); break;
        case "temp.png": res.writeHead(200, {'Content-Type': 'image/png'}); break;
      }
      
        res.write(data);
        res.end();
      }
    });
  
}

function cleanUp(fileName: string){
  readdir('./files/', function(err, items) {
    items.forEach((value) => {
      if (value.substring(0, fileName.length) === fileName){
        if (value.indexOf('.json') === -1) {
          console.log('Delete ' + value);
          unlinkSync('./files/' + value);
        }
      }
    });
  });
}

function saveFile(req: IncomingMessage, res: ServerResponse, filename: string, withLy: boolean){
  var body = '';
  /*if (!req.url) req.url = "/temp";
  const filename = req.url.replace('/', '');*/
  const name = filename;

  req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
          req.connection.destroy();
  });

  req.on('end', () => {
    //console.log(body);
      var post = parse(body);
      var bodyText = withLy ? post['text'] : body;

      const jsonFile = name + (withLy ? '.json' : '');
      /*const lyFile = name + '.ly';
      const pngFile = name + '.png';
      const page1File = name + '-page1.png';*/
      console.log("Skriver til " + "./files/" + jsonFile);
      //console.log(bodyText);
      //console.log(body);
      cleanUp(name);

      writeFile("./files/" + jsonFile,  bodyText, (err) => {

        if (!withLy) {
          /*res.writeHead(302, {
            'Location': '/gloria_fuga.html'
            //add other headers here...
          });*/
          res.end();

          return;
        }
        /*jsonToLy("./files/" + jsonFile, "./files/" + lyFile, () => {

          try{
            unlinkSync('./files/' + pngFile);
          }catch(e) {
            console.log(e);
          }
          
          const ls = spawn(lilyExe, ['--png', '-dresolution=80', filename + '.ly'], {cwd: '.\\files'});
    
          ls.stdout.on('data', (data) => {
            //console.log(`stdout: ${data}`);
          });
          
          ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
          
          ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            // wait
            // redirect page
            exists('./temp.png', function(exists) {
              if (!exists) rename('./files/' + page1File, './files/' + pngFile, (err: NodeJS.ErrnoException) => {} );
            });            
  
            res.writeHead(302, {
              'Location': '/gloria_fuga.html'
              //add other headers here...
            });
            res.end();

          });
        });*/
      });
    });
}


function compileFile(req: IncomingMessage, res: ServerResponse, filename: string, withLy: boolean){
  var body = '';
  /*if (!req.url) req.url = "/temp";
  const filename = req.url.replace('/', '');*/
  const name = filename;

  req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
          req.connection.destroy();
  });

  req.on('end', () => {
    //console.log(body);
      var post = parse(body);
      var bodyText = /*withLy ? post['text'] :*/ body;

      const jsonFile = name + (withLy ? '.json' : '');
      const lyFile = name + '.ly';
      const pngFile = name + '.png';
      const page1File = name + '-page1.png';
      console.log("Skriver til " + "./files/" + jsonFile);
      //console.log(bodyText);
      //console.log(body);
      cleanUp(name);

      writeFile("./files/" + jsonFile,  bodyText, (err) => {

        if (!withLy) {
          /*res.writeHead(302, {
            'Location': '/gloria_fuga.html'
            //add other headers here...
          });*/
          res.end();

          return;
        }
        jsonToLy("./files/" + jsonFile, "./files/" + lyFile, () => {

          try{
            unlinkSync('./files/' + pngFile);
          }catch(e) {
            console.log(e);
          }
          
          const ls = spawn(lilyExe, ['--png', '-dresolution=80', filename + '.ly'], {cwd: '.\\files'});
    
          ls.stdout.on('data', (data) => {
            //console.log(`stdout: ${data}`);
          });
          
          ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
          
          ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            // wait
            // redirect page
            /*exists('./temp.png', function(exists) {
              if (!exists) rename('./files/' + page1File, './files/' + pngFile, (err: NodeJS.ErrnoException) => {} );
            });            
  
            res.writeHead(302, {
              'Location': '/gloria_fuga.html'
              //add other headers here...
            });*/
            
            const pattern = new RegExp(filename + '.*\.png$');
            readdir('./files/', function(err, items) {
              items.sort((a,b) => { return a.length != b.length ? a.length - b.length : a.localeCompare(b) });
              items = items.filter((value) => value.match(pattern));
              res.write(JSON.stringify(items));
              res.end();
            });
          
          });
        });
      });
    });
}

var app = express();
app.use(cors());

app.listen(3000);

app.get('/list/:ext', function(req: any, res: any) {
  const pattern = new RegExp('\.' + req.params.ext + '$');
  readdir('./files/', function(err, items) {
    items = items.filter((value) => value.match(pattern));
    res.write(JSON.stringify(items));
    res.end();
  });
});


app.get('/load/:file', function(req: any, res: any) {
  console.log('/load/:file');
  const fileName = '/' + req.params['file'];
  console.log(req.params);
  if (fileName) getFile(res, fileName);
});
  
  
app.get('/gloria_fuga.html', function(req: IncomingMessage, res: any) {
//  res.render('about');
console.log('/gloria_fuga.html');
  //if (req.url) getFile(res, "/temp.json");
  readFile("./files"+req.url, "utf8", function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(err);
    readFile("./files/temp.json", "utf8", function(err1, data1) {
        console.log(err1);
      data = replace(data, '"**PLACEHOLDER**"', JSON.stringify(data1));
      res.write(data);
      res.end();
      });

  });
});

app.post('/compile/:file', function (req: any, res: any) {
  compileFile(req, res, req.params['file'], true);
});

app.post('/save/:file', function (req: any, res: any) {
  console.log(req.params);
  saveFile(req, res, req.params['file'], false);
});


