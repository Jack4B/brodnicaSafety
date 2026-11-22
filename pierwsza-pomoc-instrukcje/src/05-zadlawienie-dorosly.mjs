// 05 — Zadławienie: dorosły i dziecko powyżej 1 roku.
import { m, S, FLOOR, STAND, floor, liczba, lezacy, kleczacy, arkusz, ZRODLO_ERC } from './wspolne.mjs';

function rozpoznaj() {
  const gardlo = m.figure({ at: [150, STAND], scale: S, pose: { head: 8 } }).at.throat;
  const ofiara = m.figure({ at: [150, STAND], scale: S, pose: { head: 8, armNear: [138, -22], armFar: [146, -14] } });
  return [floor, ofiara.svg, m.target(gardlo, 17), m.callout(ofiara.at.mouth, 'nie mówi, nie kaszle', { dx: 40, dy: 34 }), liczba('?')];
}

function plecy() {
  return m.animated((t) => {
    const lift = m.keyed(t, [[0, 1], [0.45, 0, 'in'], [0.6, 0], [1, 1, 'out']]);
    const ofiara = m.figure({ at: [186, STAND], scale: S, pose: { torso: 62, head: 80, armNear: [150, 120], armFar: [160, 130], legNear: [176, 184], legFar: [186, 176] } });
    const lopatki = ofiara.at.shoulderBlades;
    const r = m.figure({ at: [150, STAND], scale: S, tone: 'b', pose: { torso: 8, head: 30, armNear: { to: [lopatki[0] - 6 - 14 * lift, lopatki[1] - 14 - 34 * lift], bend: 1 }, armFar: [100, 80], legNear: [170, 184], legFar: [196, 178] }, lit: ['armNear'] });
    const P = r.parts;
    const dlon = r.at.handNear;
    return [floor, P.legFar, P.torso, P.head, P.legNear, P.armFar, ofiara.svg, P.armNear, m.target(lopatki, 10), m.arrow([dlon[0] + 16, dlon[1] - 22], [lopatki[0] + 6, lopatki[1] - 14], { bow: 8, repeat: true }), liczba('×5')];
  }, { frames: 14, seconds: 1.1, still: 0.45 });
}

function nadbrzusze() {
  return m.animated((t) => {
    const pull = m.keyed(t, [[0, 0], [0.4, 1, 'in'], [0.55, 1], [1, 0, 'out']]);
    const ofiara = m.figure({ at: [170, STAND], scale: S, pose: { torso: 14 - 3 * pull, head: 24 + 10 * pull, armNear: [140, 100], armFar: [150, 110] } });
    const pkt = ofiara.at.upperAbdomen;
    const r = m.figure({ at: [138, STAND + 2], scale: S, tone: 'b', pose: { torso: 12, head: 14, armNear: { to: [pkt[0] + 8 - 7 * pull, pkt[1] + 3 - 8 * pull], bend: -1 }, armFar: { to: [pkt[0] + 6 - 7 * pull, pkt[1] + 8 - 8 * pull], bend: -1 }, legNear: [166, 186], legFar: [196, 180] }, lit: ['armNear'] });
    const P = r.parts, V = ofiara.parts;
    return [floor, P.legFar, P.armFar, P.torso, P.head, P.legNear, V.armFar, V.legFar, V.torso, V.head, V.legNear, P.armNear, V.armNear, m.arrow([pkt[0] + 50, pkt[1] + 30], [pkt[0] + 20, pkt[1] - 2], { bow: 8, repeat: true }), m.callout(ofiara.at.navel, 'nad pępkiem', { dx: 30, dy: 44 }), liczba('×5')];
  }, { frames: 14, seconds: 1.2, still: 0.4 });
}

function utrata() {
  return m.animated((t) => {
    const down = m.keyed(t, [[0, 0], [0.5, 1], [1, 0]]) * 6;
    const ofiara = lezacy(196);
    const mostek = ofiara.at.sternum;
    const r = kleczacy(mostek[0] + 40, { pochylenie: 35 + down * 0.9, glowa: 60 + down * 0.9, rekaBliz: [mostek[0] + 2, mostek[1] - 8 + down], rekaDal: [mostek[0] - 3, mostek[1] - 6 + down], lit: ['armNear', 'armFar'] });
    const P = r.parts;
    return [floor, P.legFar, P.legNear, P.torso, P.head, ofiara.svg, P.armFar, P.armNear, m.target(mostek, 9), m.arrow([mostek[0] - 30, mostek[1] - 60], [mostek[0] - 30, mostek[1] - 16], { both: true }), liczba('112')];
  }, { frames: 12, seconds: 0.55, still: 0.5 });
}

arkusz({
  plik: '05-zadlawienie-dorosly.html',
  title: 'Zadławienie — dorosły i dziecko powyżej 1 roku',
  lede: 'Ktoś nagle nie może mówić, kaszleć ani oddychać, często łapie się za szyję. Drogi oddechowe są zatkane.',
  call: 'Niech ktoś od razu dzwoni 112. Sam dzwoń, gdy jesteś sam, a pierwsze serie nie pomagają.',
  panels: [
    m.panel({ n: 1, title: 'Zapytaj: „Zadławiłeś się?”', text: 'Nie może mówić, kaszleć ani oddychać — pomóż. Kaszle skutecznie — tylko zachęcaj do kaszlu.', body: rozpoznaj() }),
    m.panel({ n: 2, title: '5 uderzeń między łopatki', text: 'Stań z boku, nieco z tyłu. Podtrzymaj klatkę, pochyl mocno do przodu, uderzaj nasadą dłoni.', body: plecy() }),
    m.panel({ n: 3, title: '5 uciśnięć nadbrzusza', text: 'Stań z tyłu, obejmij. Pięść nad pępkiem, druga dłoń na niej, pociągnij do siebie i ku górze. Na zmianę 5 i 5.', body: nadbrzusze() }),
    m.panel({ n: 4, kind: 'warn', title: 'Traci przytomność: 112 i RKO', text: 'Połóż na ziemi, dzwoń 112, zacznij RKO 30 : 2. Przed oddechami usuń z ust tylko to, co widać.', body: utrata() }),
  ],
  donts: ['Nie wkładaj palca na ślepo do ust — możesz wepchnąć ciało obce głębiej.', 'Nie stosuj uciśnięć nadbrzusza u niemowlęcia ani u kobiety w widocznej ciąży — u nich uciśnięcia klatki piersiowej.', 'Nie uderzaj w plecy, gdy ktoś kaszle skutecznie.'],
  notes: ['Po uciśnięciach nadbrzusza poszkodowany powinien zostać zbadany przez lekarza.'],
  source: ZRODLO_ERC,
  wybory: ['Kolejność: najpierw uderzenia w plecy, potem uciśnięcia nadbrzusza, na zmianę 5 i 5 — ERC 2025 (w tym punkcie wytyczne innych instytucji historycznie się różniły; wybrano ERC).'],
});
