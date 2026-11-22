// 01 — Ocena poszkodowanego: bezpieczeństwo → przytomność → oddech → 112.
import { m, S, FLOOR, STAND, floor, liczba, lezacy, kleczacy, arkusz, ZRODLO_ERC } from './wspolne.mjs';

// 1. Bezpieczeństwo: ratownik stoi, rozgląda się, zanim podejdzie.
function bezpieczenstwo() {
  const ofiara = lezacy(110);
  const ratownik = m.figure({ at: [254, STAND], scale: S, tone: 'b', facing: -1, pose: { head: -12, armNear: [176, 182], armFar: [184, 178] } });
  return [floor, ofiara.svg, ratownik.svg, m.callout(ratownik.at.forehead, 'rozejrzyj się', { dx: -40, dy: -14 }), m.callout([96, 206], 'ruch, prąd, ogień, gaz?', { dx: 0, dy: -96, anchor: 'middle' }), liczba('!')];
}

// 2. Reakcja: dłonie na barkach, potrząśnij delikatnie i zapytaj głośno.
function reakcja() {
  return m.animated(reakcjaAt, { frames: 12, seconds: 1.0, still: 0.25 });
}
function reakcjaAt(t) {
  const ofiara = lezacy(196);
  const bark = ofiara.at.shoulder;
  const ruch = m.keyed(t, [[0, 0], [0.25, 1], [0.5, 0], [0.75, 1]]) * 4;
  const r = kleczacy(bark[0] + 56, { pochylenie: 68, glowa: 96, rekaBliz: [bark[0] + ruch, bark[1] - 6], rekaDal: [bark[0] - 6 + ruch, bark[1] - 2], lit: ['armNear', 'armFar'] });
  const P = r.parts;
  return [floor, P.legFar, P.legNear, P.torso, P.head, ofiara.svg, P.armFar, P.armNear, m.target(bark, 10), m.callout(r.at.mouth, '„Czy wszystko w porządku?”', { dx: -20, dy: -52, anchor: 'middle' }), liczba('?')];
}

// 3. Drogi oddechowe i oddech: ręka na czole, palce pod brodą, oceń oddech do 10 s.
function oddech() {
  const ofiara = lezacy(206, { glowa: -115 });
  const { forehead, chin, mouth } = ofiara.at;
  const r = kleczacy(forehead[0] + 84, { pochylenie: 70, glowa: 104, rekaBliz: [chin[0] + 4, chin[1] + 2], rekaDal: [forehead[0] + 2, forehead[1] - 4], lit: ['armNear', 'armFar'] });
  const P = r.parts;
  return [floor, P.legFar, P.legNear, P.torso, P.head, ofiara.svg, P.armFar, P.armNear, m.target(mouth, 8), m.callout(mouth, 'patrz, słuchaj, wyczuj', { dx: -6, dy: -78, anchor: 'start' }), liczba('10 s')];
}

// 4. Nie oddycha prawidłowo: dzwoń 112 na głośnomówiącym, wyślij po AED.
function dzwon() {
  const ofiara = lezacy(196);
  const r = kleczacy(ofiara.at.sternum[0] + 44, { pochylenie: 12, glowa: 20, lit: [] });
  return [floor, r.svg, ofiara.svg, m.phone([62, 100], 74), m.label([62, 152], 'głośnomówiący'), m.arrow([96, 112], [150, 112], { dashed: true }), m.label([122, 104], 'AED'), liczba('112')];
}

arkusz({
  plik: '01-ocena.html',
  title: 'Ocena poszkodowanego',
  lede: 'Ktoś upadł albo leży bez ruchu. Ta kolejność trwa kilkanaście sekund i decyduje, co robisz dalej.',
  call: 'Numer alarmowy 112 (pogotowie ratunkowe także 999). Włącz tryb głośnomówiący — dyspozytor medyczny poprowadzi cię krok po kroku do przyjazdu zespołu ratownictwa medycznego (ZRM).',
  panels: [
    m.panel({ n: 1, title: 'Sprawdź, czy jest bezpiecznie', text: 'Rozejrzyj się: ruch uliczny, prąd, ogień, gaz. Nie podchodź, jeśli grozi ci niebezpieczeństwo.', body: bezpieczenstwo() }),
    m.panel({ n: 2, title: 'Potrząśnij za barki, zapytaj głośno', text: 'Delikatnie potrząśnij za ramiona i zapytaj: „Czy wszystko w porządku?”. Brak reakcji — wołaj o pomoc.', body: reakcja() }),
    m.panel({ n: 3, title: 'Udrożnij drogi oddechowe, oceń oddech', text: 'Ręka na czole, palce pod brodą, odegnij głowę. Patrz, słuchaj i wyczuwaj oddech najwyżej 10 sekund.', body: oddech() }),
    m.panel({ n: 4, kind: 'warn', title: 'Nie oddycha prawidłowo? Dzwoń 112', text: 'Wyślij kogoś po AED i zacznij RKO (arkusz 02). Oddycha prawidłowo — pozycja bezpieczna (arkusz 04).', body: dzwon() }),
  ],
  donts: ['Nie sprawdzaj oddechu dłużej niż 10 sekund.', 'Nie traktuj rzadkich, głośnych westchnień jako oddechu — to nie jest prawidłowy oddech.', 'Nie zostawiaj nieprzytomnej, oddychającej osoby na plecach.'],
  notes: ['Wskaż konkretną osobę do dzwonienia: „Pan w niebieskiej kurtce — proszę dzwonić 112!”.', 'Powiedz dyspozytorowi: co się stało, gdzie (adres, charakterystyczne miejsca), ile osób, czy oddychają. Nie rozłączaj się pierwszy.'],
  source: ZRODLO_ERC,
  wybory: ['Kolejność i czas oceny oddechu (do 10 s) według ERC 2025, rozdział „Podstawowe zabiegi resuscytacyjne u dorosłych”.', 'Numer alarmowy 112; wytyczne ERC dla Polski wymieniają także 999.'],
});
