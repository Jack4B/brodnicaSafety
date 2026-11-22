// 07 — Tamowanie krwotoku: ucisk bezpośredni.
import { m, FLOOR, floor, liczba, lezacy, arkusz, opatrunek, dlonie, ZRODLO_ERC } from './wspolne.mjs';

const ramie = () => m.forearm({ at: [34, 168], length: 250, width: 52 });

function wezwij() {
  const f = ramie();
  return [f.svg, m.patch(f.at.mid, 26, 12), m.callout(f.at.mid, 'rana', { dx: -10, dy: 50, anchor: 'middle' }), m.phone([70, 84], 56), m.label([140, 84], 'rękawiczki'), liczba('112')];
}

function ucisk() {
  return m.animated((t) => {
    const p = m.keyed(t, [[0, 0], [0.5, 4], [1, 0]]);
    const f = ramie();
    const [x, y] = f.at.mid;
    return [f.svg, m.patch(f.at.mid, 26, 12), opatrunek([x, y]), dlonie([x, y - 8 + p]), m.arrow([x + 52, y - 66], [x + 52, y - 26], { repeat: true }), liczba('MOCNO', [250, 54])];
  }, { frames: 10, seconds: 1.0, still: 0.5 });
}

function warstwa() {
  const f = ramie();
  const [x, y] = f.at.mid;
  return [f.svg, m.patch(f.at.mid, 26, 12), opatrunek([x, y], { warstwy: 3 }), dlonie([x, y - 22]), m.callout([x + 30, y - 10], 'nie zdejmuj', { dx: 40, dy: 30 }), liczba('+1')];
}

// Krwotok z kończyny, którego ucisk nie zatrzymuje: opaska na udzie powyżej rany (rana na podudziu).
function opaska() {
  const ofiara = lezacy(176);
  const [kx, ky] = ofiara.at.kneeNear;
  const rana = ofiara.at.shinNear;
  const pas = ofiara.at.thighNear;
  return [floor, ofiara.svg, m.patch(rana, 14, 7), `<g transform="rotate(0 ${pas[0]} ${pas[1]})">${m.prop(m.box(pas[0] - 6, pas[1] - 14, 12, 26, 3), { fill: 'accent', tone: 'accent' })}</g>`, m.callout(pas, 'powyżej rany', { dx: -24, dy: -70, anchor: 'middle' }), m.callout(rana, 'rana', { dx: 20, dy: -60 }), liczba('14:35', [250, 54]), m.label([250, 74], 'zapisz godzinę', { tone: 'accent' })];
}

arkusz({
  plik: '07-krwotok.html',
  title: 'Tamowanie krwotoku',
  lede: 'Obfity krwotok może zabić w kilka minut. Najważniejsze jest mocne, nieprzerwane uciskanie rany.',
  call: 'Dzwoń 112 albo każ to zrobić osobie obok. Jeśli masz — załóż rękawiczki.',
  panels: [
    m.panel({ n: 1, title: 'Dzwoń 112, załóż rękawiczki', text: 'Zadbaj o własne bezpieczeństwo. Połóż poszkodowanego — łatwiej uciskać i mniej ryzyka omdlenia.', body: wezwij() }),
    m.panel({ n: 2, title: 'Uciskaj ranę mocno, bezpośrednio', text: 'Przyłóż opatrunek albo czystą tkaninę i uciskaj dłońmi. Nie odrywaj, żeby sprawdzić.', body: ucisk() }),
    m.panel({ n: 3, title: 'Przesiąka? Dołóż warstwę', text: 'Nie zdejmuj pierwszego opatrunku. Dołóż kolejny i uciskaj mocniej, potem owiń mocno bandażem.', body: warstwa() }),
    m.panel({ n: 4, kind: 'warn', title: 'Kończyna dalej krwawi: opaska uciskowa', text: 'Opaska powyżej rany na udzie lub ramieniu, dokręć do zatrzymania krwawienia. Zapisz godzinę, nie luzuj.', body: opaska() }),
  ],
  donts: ['Nie odrywaj opatrunku, żeby sprawdzić ranę.', 'Nie zakładaj opaski na szyję ani tułów.', 'Nie wyjmuj ciała obcego wbitego w ranę — uciskaj obok niego.'],
  notes: ['Blady, spocony poszkodowany: połóż go i unieś nogi ok. 30 cm, okryj (poradnik rządowy).', 'Apteczkę w miejscach publicznych i zakładach pracy oznacza znak E003 według PN-EN ISO 7010 (biały krzyż na zielonym tle). Opaskę uciskową rząd zaleca mieć w domowej apteczce.'],
  source: ZRODLO_ERC,
  wybory: ['Ucisk bezpośredni jako podstawa, opaska uciskowa przy krwotoku z kończyny, którego ucisk nie zatrzymuje, z zapisaniem godziny — ERC 2025 i „Poradnik bezpieczeństwa” 2025.'],
  doSprawdzenia: ['Odległość opaski od rany (często podawane 5–7 cm) — nie umieszczono liczby, bo polskie źródła mówią tylko „powyżej rany”.'],
});
