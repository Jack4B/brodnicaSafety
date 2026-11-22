// 06 — Zadławienie: niemowlę (do 1 roku).
import { m, S, FLOOR, floor, liczba, arkusz, ZRODLO_ERC } from './wspolne.mjs';

const SIEDZISKO = [104, 178];
const krzeslo = m.chair(SIEDZISKO, 1);
// Ratownik siedzi zwrócony w prawo; udo poziomo.
const ratownik = (pose, lit) => m.figure({ at: [SIEDZISKO[0], SIEDZISKO[1] - 12], scale: S, tone: 'b', pose: { torso: 14, head: 40, legNear: [90, 180], legFar: [92, 178], footNear: 90, footFar: 90, ...pose }, lit });

// Niemowlę na przedramieniu nad udem, głowa niżej niż tułów.
function plecy() {
  return m.animated((t) => {
    const lift = m.keyed(t, [[0, 1], [0.45, 0, 'in'], [0.6, 0], [1, 1, 'out']]);
    const dziecko = m.figure({ at: [130, 150], scale: S, build: 'infant', pose: { torso: 104, head: 116, armNear: [170, 180], armFar: [176, 184], legNear: [-60, -110], legFar: [-70, -120] } });
    const lop = dziecko.at.shoulderBlades;
    const r = ratownik({ armFar: { to: [dziecko.at.chin[0] - 2, dziecko.at.chin[1] + 4], bend: 1 }, armNear: { to: [lop[0] - 4 - 10 * lift, lop[1] - 6 - 30 * lift], bend: 1 } }, ['armNear']);
    const P = r.parts;
    return [floor, krzeslo, P.legFar, P.armFar, P.torso, P.head, P.legNear, dziecko.svg, P.armNear, m.target(lop, 8), m.arrow([lop[0] + 2, lop[1] - 44], [lop[0] + 2, lop[1] - 12], { repeat: true }), liczba('×5')];
  }, { frames: 14, seconds: 1.1, still: 0.45 });
}

// Niemowlę na plecach na drugim przedramieniu, głowa nisko; uciśnięcia klatki piersiowej.
function klatka() {
  return m.animated((t) => {
    const p = m.keyed(t, [[0, 0], [0.4, 1, 'in'], [0.55, 1], [1, 0, 'out']]) * 4;
    const dziecko = m.figure({ at: [128, 152], scale: S, build: 'infant', facing: -1, pose: { torso: -104, head: -116, armNear: [-150, -170], armFar: [-160, -180], legNear: [60, 110], legFar: [70, 120] } });
    const mostek = dziecko.at.sternum;
    const r = ratownik({ armFar: { to: [dziecko.at.nape[0], dziecko.at.nape[1] + 6], bend: 1 }, armNear: { to: [mostek[0], mostek[1] - 6 + p], bend: 1 } }, ['armNear']);
    const P = r.parts;
    return [floor, krzeslo, P.legFar, P.armFar, P.torso, P.head, P.legNear, dziecko.svg, P.armNear, m.target(mostek, 7), m.arrow([mostek[0] + 30, mostek[1] - 40], [mostek[0] + 30, mostek[1] - 12], { repeat: true }), liczba('×5')];
  }, { frames: 14, seconds: 1.3, still: 0.45 });
}

function naZmiane() {
  const dziecko = m.figure({ at: [130, 150], scale: S, build: 'infant', pose: { torso: 104, head: 116, armNear: [170, 180], armFar: [176, 184], legNear: [-60, -110], legFar: [-70, -120] } });
  const r = ratownik({ armFar: { to: [dziecko.at.chin[0] - 2, dziecko.at.chin[1] + 4], bend: 1 }, armNear: [150, 120] });
  const P = r.parts;
  return [floor, krzeslo, P.legFar, P.armFar, P.torso, P.head, P.legNear, dziecko.svg, P.armNear, m.phone([246, 150], 64), m.label([246, 196], '112'), liczba('5 + 5')];
}

function rko() {
  const dziecko = m.figure({ at: [176, FLOOR - 8], scale: S, build: 'infant', pose: { torso: -90, head: -90, armNear: [92, 90], armFar: [92, 90], legNear: [90, 90], legFar: [90, 88], footNear: 0, footFar: 0 } });
  const mostek = dziecko.at.sternum;
  const r = m.figure({ at: [mostek[0] + 46, FLOOR - 50], scale: S, tone: 'b', facing: -1, pose: { torso: 52, head: 80, armNear: { to: [mostek[0] + 2, mostek[1] - 4], bend: 1 }, armFar: { to: [mostek[0] - 4, mostek[1] - 2], bend: 1 }, legNear: [176, -90], legFar: [184, -90], footNear: -90, footFar: -90 }, lit: ['armNear', 'armFar'] });
  const P = r.parts;
  return [floor, P.legFar, P.legNear, P.torso, P.head, dziecko.svg, P.armFar, P.armNear, m.target(mostek, 7), m.callout(dziecko.at.mouth, 'usta i nos', { dx: -6, dy: -86, anchor: 'end' }), liczba('5')];
}

arkusz({
  plik: '06-zadlawienie-niemowle.html',
  title: 'Zadławienie — niemowlę (do 1 roku)',
  lede: 'Niemowlę nagle nie może oddychać, płakać ani kaszleć, sinieje. Działaj od razu, siedząc albo klęcząc.',
  call: 'Niech ktoś od razu dzwoni 112. Jeśli jesteś sam — włącz głośnomówiący i działaj.',
  panels: [
    m.panel({ n: 1, title: '5 uderzeń w plecy, głowa nisko', text: 'Połóż niemowlę brzuszkiem na przedramieniu, głową w dół, podtrzymując żuchwę. Uderzaj nasadą dłoni między łopatki.', body: plecy() }),
    m.panel({ n: 2, title: '5 uciśnięć klatki piersiowej', text: 'Odwróć na plecy na drugim przedramieniu, głowa nadal nisko. Uciskaj dolną połowę mostka.', body: klatka() }),
    m.panel({ n: 3, title: 'Na zmianę 5 i 5', text: 'Powtarzaj, aż ciało obce wypadnie albo niemowlę straci przytomność. Ktoś dzwoni 112.', body: naZmiane() }),
    m.panel({ n: 4, kind: 'warn', title: 'Nie reaguje: 112 i RKO niemowlęcia', text: 'Połóż na twardym podłożu. Zacznij od 5 oddechów (usta na ustach i nosie), potem uciśnięcia dwoma kciukami z objęciem klatki.', body: rko() }),
  ],
  donts: ['Nie stosuj uciśnięć nadbrzusza u niemowlęcia.', 'Nie trzymaj niemowlęcia za nogi głową w dół.', 'Nie wkładaj palca na ślepo do ust.'],
  notes: ['Podtrzymuj żuchwę, nie uciskaj miękkich tkanek szyi.', 'Po zdarzeniu niemowlę powinien obejrzeć lekarz.'],
  source: ZRODLO_ERC,
  wybory: ['RKO niemowlęcia: najpierw 5 oddechów ratowniczych, uciśnięcia dwoma kciukami z objęciem klatki piersiowej, głębokość co najmniej 1/3 klatki — ERC 2025 (inne instytucje uczą dwóch palców; wybrano ERC).'],
  doSprawdzenia: ['Technika uciśnięć klatki piersiowej przy zadławieniu niemowlęcia (dwa palce czy dwa kciuki / nasada dłoni) — broszura ERC 2025 jej nie opisuje; rysunek pokazuje miejsce, nie technikę.'],
});
