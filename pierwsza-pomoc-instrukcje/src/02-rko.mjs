// 02 — RKO u dorosłego: 30 uciśnięć : 2 oddechy, 100–120/min, 5–6 cm.
import { m, floor, liczba, lezacy, kleczacy, arkusz, ZRODLO_ERC } from './wspolne.mjs';

// Ratownik nad klatką piersiową; `down` — ile px wciśnięta klatka (6 px ≈ 5–6 cm w tej skali).
function uciski(down = 0) {
  const ofiara = lezacy(196);
  const mostek = ofiara.at.sternum;
  const r = kleczacy(mostek[0] + 40, { pochylenie: 35 + down * 0.9, glowa: 60 + down * 0.9, rekaBliz: [mostek[0] + 2, mostek[1] - 8 + down], rekaDal: [mostek[0] - 3, mostek[1] - 6 + down], lit: ['armNear', 'armFar'] });
  const P = r.parts;
  return { ofiara, mostek, r, svg: [floor, P.legFar, P.legNear, P.torso, P.head, ofiara.svg, P.armFar, P.armNear] };
}

function dlonieNaMostku() {
  const u = uciski(0);
  return [...u.svg, m.target(u.mostek, 9), m.callout(u.mostek, 'dolna połowa mostka', { dx: -20, dy: -96, anchor: 'middle' }), liczba('30')];
}

function glebokosc() {
  return m.animated((t) => {
    const u = uciski(m.keyed(t, [[0, 0], [0.5, 6], [1, 0]]));
    return [...u.svg, m.target(u.mostek, 9), m.arrow([u.mostek[0] - 30, u.mostek[1] - 60], [u.mostek[0] - 30, u.mostek[1] - 16], { both: true }), liczba('5–6 cm')];
  }, { frames: 12, seconds: 0.55, still: 0.5 }); // 0,55 s na uciśnięcie ≈ 110 na minutę
}

function oddechy() {
  const ofiara = lezacy(206, { glowa: -115 });
  const { forehead, chin, mouth } = ofiara.at;
  const r = kleczacy(mouth[0] + 92, { pochylenie: 84, glowa: 150, rekaBliz: [chin[0] + 4, chin[1] + 2], rekaDal: [forehead[0] + 2, forehead[1] - 4], lit: ['armNear', 'armFar'] });
  const P = r.parts;
  return [floor, P.legFar, P.legNear, P.torso, P.head, ofiara.svg, P.armFar, P.armNear, m.target(mouth, 8), m.callout(forehead, 'zaciśnij nos', { dx: -10, dy: -90, anchor: 'middle' }), liczba('2')];
}

function tempo() {
  return m.animated((t) => {
    const u = uciski(m.keyed(t, [[0, 0], [0.5, 6], [1, 0]]));
    return [...u.svg, m.arrow([u.mostek[0] - 30, u.mostek[1] - 60], [u.mostek[0] - 30, u.mostek[1] - 16], { both: true }), liczba('100–120', [248, 54]), m.label([248, 72], 'na minutę', { tone: 'accent' })];
  }, { frames: 12, seconds: 0.55, still: 0.5 });
}

arkusz({
  plik: '02-rko.html',
  title: 'RKO u dorosłego',
  lede: 'Osoba nie reaguje i nie oddycha prawidłowo. Każda minuta bez uciskania klatki piersiowej zmniejsza szansę na przeżycie.',
  call: 'Najpierw 112 na głośnomówiącym i wyślij kogoś po AED. Potem od razu uciskaj.',
  panels: [
    m.panel({ n: 1, title: 'Dłonie na środku klatki piersiowej', text: 'Uklęknij obok. Nasada dłoni na dolnej połowie mostka, druga dłoń na niej, palce splecione. 30 uciśnięć.', body: dlonieNaMostku() }),
    m.panel({ n: 2, title: 'Uciskaj mocno na 5–6 cm', text: 'Ramiona proste, barki nad dłońmi. Po każdym uciśnięciu pozwól klatce wrócić, nie odrywając dłoni.', body: glebokosc() }),
    m.panel({ n: 3, title: 'Dwa oddechy ratownicze', text: 'Odegnij głowę, zaciśnij nos, wdmuchuj powietrze przez ok. 1 s, aż klatka się uniesie. Przerwa krótsza niż 10 s.', body: oddechy() }),
    m.panel({ n: 4, kind: 'warn', title: 'Tempo 100–120 na minutę, bez przerw', text: '30 uciśnięć : 2 oddechy do przyjazdu pomocy, użycia AED albo powrotu oddechu. Nie umiesz oddechów — uciskaj bez przerwy.', body: tempo() }),
  ],
  donts: ['Nie zginaj łokci.', 'Nie uciskaj żeber, końca mostka ani brzucha.', 'Nie przerywaj uciśnięć na dłużej niż 10 sekund.'],
  notes: ['Gdy się zmęczysz, niech zmieni cię ktoś inny — najlepiej co 2 minuty.', 'Gdy dotrze AED, włącz go i postępuj według poleceń (arkusz 03).', 'RKO prowadź do przyjazdu ZRM lub osób z uprawnieniami KPP (np. strażaków), które przejmą działania.'],
  source: ZRODLO_ERC,
  wybory: ['Głębokość 5–6 cm, tempo 100–120/min, stosunek 30:2, przerwa na oddechy poniżej 10 s — ERC 2025 (BLS dorośli).', 'Osoba nieprzeszkolona: same uciśnięcia bez przerw (ERC 2025).'],
});
