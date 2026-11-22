// 04 — Pozycja boczna bezpieczna.
import { m, S, FLOOR, floor, liczba, arkusz, ZRODLO_ERC } from './wspolne.mjs';

// Widok z góry: postać w widoku z przodu = leżąca na plecach widziana z góry. Ratownik klęczy po prawej stronie rysunku.
const zGory = (pose, lit = []) => m.figure({ at: [124, 136], scale: S, view: 'front', face: false, pose, lit });
const podpis = m.label([124, 254], 'widok z góry', { tone: 'mid' });

function reka() {
  const f = zGory({ armR: [90, 0] }, ['armR']);
  return [f.svg, m.target(f.at.elbowR, 8), m.callout(f.at.handR, 'dłoń do góry', { dx: 30, dy: 60 }), podpis, liczba('90°')];
}

function policzekKolano() {
  const f0 = zGory({ armR: [90, 0] });
  const policzek = [f0.at.head[0] + 9, f0.at.head[1] + 6];
  const f = zGory({ armR: [90, 0], armL: { to: policzek, bend: 1 }, legL: [196, 150] }, ['armL', 'legL']);
  return [f.svg, m.target(policzek, 7), m.callout(f.at.kneeL, 'kolano w górę', { dx: 70, dy: 40 }), m.callout(policzek, 'dłoń przy policzku', { dx: 50, dy: 60 }), podpis, liczba('2')];
}

function obrot() {
  const f0 = zGory({ armR: [90, 0] });
  const f = zGory({ armR: [90, 0], armL: { to: [f0.at.head[0] + 9, f0.at.head[1] + 6], bend: 1 }, legL: [196, 150] });
  return [f.svg, m.arrow([f.at.kneeL[0] - 6, f.at.kneeL[1] + 8], [f.at.kneeL[0] + 96, f.at.kneeL[1] - 6], { bow: 26 }), m.callout(f.at.kneeL, 'ciągnij za kolano', { dx: 60, dy: 56 }), podpis, liczba('do siebie', [244, 54])];
}

// Pozycja końcowa: widok z przodu obrócony o 90° = osoba leży na boku twarzą do patrzącego.
function koncowa() {
  const glowa = [70, FLOOR - 30];
  const f = m.figure({ at: [176, FLOOR - 20], scale: S, view: 'front', pose: { torso: -90, head: -100, armR: { to: [glowa[0] + 8, FLOOR - 8], bend: -1 }, armL: [-100, -92], legL: [92, 90], legR: [140, 88] }, lit: ['armR', 'legR'] });
  return [floor, f.svg, m.callout(f.at.kneeR, 'kolano zgięte', { dx: 30, dy: -50 }), m.callout([f.at.head[0] - 8, f.at.head[1] + 10], 'usta w dół', { dx: -10, dy: -70, anchor: 'middle' }), liczba('112')];
}

arkusz({
  plik: '04-pozycja-boczna.html',
  title: 'Pozycja boczna bezpieczna',
  lede: 'Dla osoby nieprzytomnej, która oddycha prawidłowo i nie ma urazu. Język i wydzieliny nie zablokują dróg oddechowych.',
  call: 'Dzwoń 112. Sprawdzaj oddech przez cały czas do przyjazdu pogotowia.',
  panels: [
    m.panel({ n: 1, title: 'Bliższą rękę ułóż pod kątem prostym', text: 'Uklęknij obok. Rękę po twojej stronie odsuń pod kątem prostym, zgiętą w łokciu, dłonią do góry.', body: reka() }),
    m.panel({ n: 2, title: 'Dalsza dłoń przy policzku, kolano w górę', text: 'Dalszą rękę przełóż przez klatkę i przyłóż grzbiet dłoni do policzka. Dalszą nogę zegnij, stopa płasko.', body: policzekKolano() }),
    m.panel({ n: 3, title: 'Przeturlaj do siebie, ciągnąc za kolano', text: 'Przytrzymując dłoń przy policzku, ciągnij za zgięte kolano, aż poszkodowany obróci się na bok.', body: obrot() }),
    m.panel({ n: 4, kind: 'warn', title: 'Odegnij głowę, sprawdzaj oddech', text: 'Głowa odgięta, usta skierowane w dół, górna noga zgięta. Gdy przestanie oddychać prawidłowo — na plecy i RKO.', body: koncowa() }),
  ],
  donts: ['Nie układaj w pozycji bezpiecznej, gdy oddech jest nieprawidłowy — wtedy RKO (arkusz 02).', 'Nie ruszaj osoby po urazie (wypadek, upadek z wysokości), jeśli nic jej nie grozi.', 'Nie zostawiaj poszkodowanego samego.'],
  notes: ['Kobieta w zaawansowanej ciąży: ułóż na lewym boku.'],
  source: ZRODLO_ERC,
  wybory: ['Kryteria (obniżona przytomność, prawidłowy oddech, brak urazu) według ERC 2025, „Pozycja bezpieczna”. Polska nazwa w poradniku rządowym: „pozycja boczna ustalona”.'],
  doSprawdzenia: ['Kolejne ruchy układania (kroki 1–3) nie są rozpisane w broszurze ERC 2025 — przyjęto standardowy sposób z kursów KPP.'],
});
