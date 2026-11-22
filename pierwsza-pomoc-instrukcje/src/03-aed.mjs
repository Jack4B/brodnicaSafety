// 03 — Użycie AED.
import { m, S, FLOOR, floor, liczba, lezacy, kleczacy, arkusz, aed, ZRODLO_ERC } from './wspolne.mjs';

function wlacz() {
  const ofiara = lezacy(206);
  const r = kleczacy(ofiara.at.sternum[0] + 44, { pochylenie: 40, glowa: 70, rekaBliz: [92, 196], lit: ['armNear'] });
  const P = r.parts;
  return [floor, P.legFar, P.legNear, P.torso, P.head, P.armFar, ofiara.svg, aed([82, 206], 60), P.armNear, m.callout([82, 186], 'słuchaj poleceń', { dx: 10, dy: -70 }), liczba('WŁĄCZ', [244, 54])];
}

// Widok z góry: postać „stojąca” w widoku z przodu = leżąca na plecach widziana z góry.
function elektrody() {
  const f = m.figure({ at: [160, 170], scale: S, view: 'front', face: false, pose: { armL: [200, 180], armR: [160, 180] } });
  const { neck, sternum } = f.at;
  // lewa strona rysunku = prawa strona poszkodowanego
  const p1 = [neck[0] - 18, neck[1] + 24];
  const p2 = [sternum[0] + 28, sternum[1] + 26];
  const pad = ([x, y], rot) => `<g transform="rotate(${rot} ${x} ${y})">${m.prop(m.box(x - 14, y - 18, 28, 36, 6), { fill: 'accent', tone: 'accent' })}</g>`;
  return [f.svg, pad(p1, 0), pad(p2, -20), m.callout(p1, 'pod obojczykiem', { dx: -34, dy: -40, anchor: 'end' }), m.callout(p2, 'pod pachą', { dx: 34, dy: 30 }), m.label([160, 252], 'widok z góry', { tone: 'mid' }), liczba('2')];
}

function nieDotykaj() {
  const ofiara = lezacy(196);
  const r = m.figure({ at: [ofiara.at.sternum[0] + 44, FLOOR - 50], scale: S, tone: 'b', facing: -1, pose: { torso: 8, head: 20, armNear: [20, -10], armFar: [10, -20], legNear: [176, -90], legFar: [184, -90], footNear: -90, footFar: -90 }, lit: ['armNear', 'armFar'] });
  return [floor, r.svg, ofiara.svg, aed([60, 200], 52), m.forbid([ofiara.at.sternum[0] - 4, ofiara.at.sternum[1] - 26], 18), m.label([ofiara.at.sternum[0] - 60, ofiara.at.sternum[1] - 70], 'nikt nie dotyka'), liczba('STOP', [250, 54])];
}

function wrocDoRko() {
  return m.animated((t) => {
    const down = m.keyed(t, [[0, 0], [0.5, 6], [1, 0]]);
    const ofiara = lezacy(196);
    const mostek = ofiara.at.sternum;
    const r = kleczacy(mostek[0] + 40, { pochylenie: 35 + down * 0.9, glowa: 60 + down * 0.9, rekaBliz: [mostek[0] + 2, mostek[1] - 8 + down], rekaDal: [mostek[0] - 3, mostek[1] - 6 + down], lit: ['armNear', 'armFar'] });
    const P = r.parts;
    return [floor, P.legFar, P.legNear, P.torso, P.head, ofiara.svg, P.armFar, P.armNear, aed([46, 206], 44), m.arrow([mostek[0] - 30, mostek[1] - 60], [mostek[0] - 30, mostek[1] - 16], { both: true }), liczba('30 : 2', [244, 54])];
  }, { frames: 12, seconds: 0.55, still: 0.5 });
}

arkusz({
  plik: '03-aed.html',
  title: 'Użycie AED (defibrylatora)',
  lede: 'AED sam ocenia rytm serca i nie wykona wyładowania, jeśli nie jest potrzebne. Użyj go, gdy tylko dotrze — RKO prowadź do tego momentu.',
  call: '112 i RKO zaczynasz od razu. Po AED wysyłasz kogoś innego; sam idziesz tylko wtedy, gdy przyniesiesz go i włączysz w ciągu minuty.',
  panels: [
    m.panel({ n: 1, title: 'Włącz AED i słuchaj poleceń', text: 'Otwórz pokrywę albo naciśnij przycisk. Urządzenie mówi, co robić krok po kroku.', body: wlacz() }),
    m.panel({ n: 2, title: 'Przyklej dwie elektrody', text: 'Odsłoń i osusz klatkę piersiową. Jedna pod prawym obojczykiem, druga na lewym boku pod pachą — jak na rysunku na elektrodach.', body: elektrody() }),
    m.panel({ n: 3, kind: 'warn', title: 'Analiza i wyładowanie: nikt nie dotyka', text: 'Upewnij się, że nikt nie dotyka poszkodowanego. Gdy AED każe — naciśnij przycisk wyładowania.', body: nieDotykaj() }),
    m.panel({ n: 4, title: 'Od razu wróć do RKO', text: 'Uciskaj dalej 30 : 2. AED co 2 minuty sam ponownie oceni rytm — znów słuchaj poleceń.', body: wrocDoRko() }),
  ],
  donts: ['Nie dotykaj poszkodowanego podczas analizy i wyładowania.', 'Nie przerywaj RKO na szukanie AED, gdy jesteś sam.', 'Nie przyklejaj elektrody na plaster z lekiem ani bezpośrednio na wszczepione urządzenie pod skórą.'],
  notes: ['Gdy pomaga druga osoba, niech uciska klatkę, a ty przyklejasz elektrody.', 'Dzieci: elektrody lub tryb dziecięcy, jeśli są; inaczej elektrody dla dorosłych.', 'Miejsce z AED oznacza znak E010 według PN-EN ISO 7010: zielony, białe serce z błyskawicą i krzyżem. Użyć AED może każdy — nie potrzeba szkolenia.'],
  source: ZRODLO_ERC,
  wybory: ['Położenie elektrod i kontynuacja RKO podczas ich przyklejania — ERC 2025 (BLS dorośli).', 'Pójście po AED samemu tylko, gdy zajmie to do 1 minuty — ERC 2025.'],
});
