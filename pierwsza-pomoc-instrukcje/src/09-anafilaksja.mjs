// 09 — Anafilaksja: autostrzykawka z adrenaliną.
import { m, S, FLOOR, floor, liczba, arkusz, ZRODLO_ERC } from './wspolne.mjs';

const SIEDZISKO = [124, 178];
const krzeslo = m.chair(SIEDZISKO, 1);
// Poszkodowany siedzi zwrócony w prawo.
const siedzi = (pose = {}, lit = []) => m.figure({ at: [SIEDZISKO[0], SIEDZISKO[1] - 12], scale: S, pose: { torso: 6, head: 10, legNear: [90, 180], legFar: [92, 178], footNear: 90, footFar: 90, armNear: [160, 150], armFar: [166, 156], ...pose }, lit });

function rozpoznaj() {
  const f0 = siedzi();
  const f = siedzi({ armNear: { to: f0.at.throat, bend: 1 }, armFar: { to: [f0.at.throat[0] - 4, f0.at.throat[1] + 4], bend: 1 } });
  return [floor, krzeslo, f.svg, m.target(f.at.throat, 14), m.callout(f.at.mouth, 'duszność, obrzęk', { dx: 40, dy: -24 }), liczba('!')];
}

function wstrzyknij() {
  return m.animated((t) => {
    const nacisk = m.keyed(t, [[0, 0], [0.35, 1, 'in'], [0.85, 1], [1, 0]]);
    const udo = siedzi().at.thighNear;
    const pen = m.pen([udo[0], udo[1] - 9 - 10 * (1 - nacisk)], { length: 96, width: 16, pressed: nacisk > 0.5 });
    const f = siedzi({ armNear: { to: [pen.at.window[0] + 2, pen.at.window[1] + 18], bend: 1 } }, ['armNear']);
    const P = f.parts;
    return [floor, krzeslo, P.armFar, P.legFar, P.torso, P.head, P.legNear, pen.svg, P.armNear, m.target([udo[0], udo[1] - 8], 9), m.callout([udo[0], udo[1] - 8], 'zewnętrzna część uda', { dx: -96, dy: 58, anchor: 'start' }), liczba('udo')];
  }, { frames: 12, seconds: 2.4, still: 0.6 });
}

function pozycja() {
  const f = m.figure({ at: [176, FLOOR - 14], scale: S, pose: { torso: -90, head: -90, armNear: [92, 90], armFar: [92, 90], legNear: [40, 80], legFar: [44, 84], footNear: 0, footFar: 0 } });
  return [floor, f.svg, m.callout(f.at.kneeNear, 'nogi uniesione', { dx: 20, dy: -50 }), m.phone([56, 106], 60), liczba('112')];
}

function druga() {
  const f = siedzi();
  return [floor, krzeslo, f.svg, m.pen([258, 190], { length: 96, width: 16 }).svg, m.label([258, 212], 'druga dawka'), liczba('5 min')];
}

arkusz({
  plik: '09-anafilaksja.html',
  title: 'Ciężka reakcja alergiczna (anafilaksja)',
  lede: 'Po ukąszeniu owada, jedzeniu lub leku pojawia się duszność, świszczący oddech, obrzęk ust, języka lub szyi, nagłe osłabienie.',
  call: 'Dzwoń 112 i powiedz: „reakcja anafilaktyczna”. Jeśli poszkodowany ma autostrzykawkę z adrenaliną — użyjcie jej od razu.',
  panels: [
    m.panel({ n: 1, title: 'Rozpoznaj: duszność, obrzęk, osłabienie', text: 'Objawy narastają szybko po kontakcie z alergenem. Zapytaj, czy ma przy sobie autostrzykawkę.', body: rozpoznaj() }),
    m.panel({ n: 2, title: 'Autostrzykawka w zewnętrzną część uda', text: 'Zdejmij zabezpieczenie, przyłóż mocno do boku uda — można przez ubranie — aż kliknie. Przytrzymaj tyle, ile podaje ulotka.', body: wstrzyknij() }),
    m.panel({ n: 3, title: 'Dzwoń 112, połóż albo posadź', text: 'Osłabiony — połóż z uniesionymi nogami. Duszność — niech siedzi. Nie pozwól mu wstawać ani chodzić.', body: pozycja() }),
    m.panel({ n: 4, kind: 'warn', title: 'Brak poprawy po 5 minutach', text: 'Podaj drugą autostrzykawkę, jeśli jest. Gdy straci przytomność i nie oddycha prawidłowo — RKO (arkusz 02).', body: druga() }),
  ],
  donts: ['Nie wstrzykuj w pośladek, żyłę, dłonie ani stopy.', 'Nie przykładaj kciuka do końcówki, z której wychodzi igła.', 'Nie pozwól poszkodowanemu wstać ani iść.'],
  notes: ['Dawkę i rodzaj autostrzykawki określa lekarz — arkusz pokazuje tylko sposób użycia.'],
  source: ZRODLO_ERC,
  wybory: ['Adrenalina domięśniowo w zewnętrzną część uda, powtórzenie po 5 minutach, pozycja siedząca lub leżąca — ERC 2025 (rozdział „Pierwsza pomoc”, schemat postępowania w ciężkiej reakcji alergicznej).'],
  doSprawdzenia: ['Czas przytrzymania autostrzykawki zależy od modelu (3–10 s) — zawsze według ulotki.'],
});
