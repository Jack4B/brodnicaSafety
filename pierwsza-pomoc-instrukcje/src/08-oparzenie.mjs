// 08 — Oparzenie termiczne: chłodzenie wodą.
import { m, liczba, arkusz, ZRODLO_ERC } from './wspolne.mjs';

const ramie = () => m.forearm({ at: [34, 176], length: 250, width: 52 });
const plomien = ([x, y]) => m.prop(`M${x} ${y}c-18 0-26-14-20-28c4 8 10 10 12 6c-2-12 4-24 14-30c-2 10 4 16 10 20c4-6 4-12 2-18c10 8 16 22 10 34c-4 10-14 16-28 16Z`, { fill: 'accent', tone: 'accent' });

function zrodlo() {
  const f = ramie();
  return [f.svg, m.patch(f.at.mid, 30, 14, { blisters: 3 }), plomien([150, 110]), m.forbid([150, 92], 30), m.arrow([200, 118], [268, 92], { bow: -10 }), liczba('STOP', [250, 54])];
}

function woda() {
  return m.animated((t) => {
    const f = ramie();
    const kran = [f.at.mid[0] - 10, 96];
    const off = t * 18;
    return [f.svg, m.patch(f.at.mid, 30, 14, { blisters: 3 }), m.tap(kran), m.drops([kran[0], kran[1] + 6 + off % 12], [f.at.top[0] - 4, f.at.top[1] - 6], { n: 5 }), liczba('20 min', [250, 54])];
  }, { frames: 8, seconds: 0.6, still: 0.5 });
}

function przykryj() {
  const f = ramie();
  const [x, y] = f.at.mid;
  return [f.svg, m.patch(f.at.mid, 30, 14, { blisters: 3 }), m.prop(m.box(x - 70, y - 32, 140, 64, 8), { fill: 'none', dashed: true }), m.callout([x, y - 32], 'folia spożywcza', { dx: 0, dy: -40, anchor: 'middle' }), liczba('luźno', [250, 54])];
}

function nie() {
  const lod = [86, 120], krem = [226, 120];
  return [m.prop(m.box(lod[0] - 26, lod[1] - 26, 52, 52, 8), { fill: 'soft' }), m.forbid(lod, 40, 'lód'), m.prop(`M${krem[0] - 30} ${krem[1] + 14}h52l8-8v-12l-8-8h-52Z`, { fill: 'soft' }), m.forbid(krem, 40, 'masło, maści, pasta'), liczba('NIE', [160, 54])];
}

arkusz({
  plik: '08-oparzenie.html',
  title: 'Oparzenie termiczne',
  lede: 'Chłodź od razu i długo. Woda zatrzymuje uszkadzanie skóry i zmniejsza ból — to najważniejsza pomoc przy oparzeniu.',
  call: 'Dzwoń 112 przy oparzeniu większym niż dłoń poszkodowanego, twarzy, dłoni, stóp, krocza lub stawów, przy oparzeniu chemicznym lub prądem, u dziecka i osoby starszej.',
  panels: [
    m.panel({ n: 1, title: 'Przerwij oparzenie', text: 'Odsuń od źródła ciepła, ugaś ogień. Przy porażeniu prądem najpierw wyłącz zasilanie.', body: zrodlo() }),
    m.panel({ n: 2, title: 'Chłodź bieżącą wodą 20 minut', text: 'Chłodna, czysta woda jak najszybciej. W tym czasie zdejmij pierścionki i zegarek.', body: woda() }),
    m.panel({ n: 3, title: 'Przykryj luźno, okryj poszkodowanego', text: 'Folia spożywcza położona luźno albo czysty opatrunek. Chłodź oparzenie, nie całego człowieka.', body: przykryj() }),
    m.panel({ n: 4, kind: 'dont', title: 'Bez lodu i domowych sposobów', text: 'Lód uszkadza skórę jeszcze bardziej. Masło, oleje, pasta do zębów i maści utrudniają leczenie.', body: nie() }),
  ],
  donts: ['Nie przekłuwaj pęcherzy.', 'Nie odrywaj przyklejonego ubrania.', 'Nie owijaj ciasno folią dookoła kończyny.'],
  notes: ['Oparzenie chemiczne: spłukuj obficie wodą, zdejmij skażone ubranie, chroń własne ręce.'],
  source: 'Wytyczne ERC 2025 (pierwsza pomoc) — chłodzenie co najmniej 20 minut; ATP 3-50.21 Survival (US Army, 2018) — chłodzenie wodą przez 20 minut; „Poradnik bezpieczeństwa” 2025',
  wybory: ['Czas chłodzenia: 20 minut (ERC). Niektóre instytucje podają „co najmniej 10 minut” — wybrano wersję ERC.'],
  doSprawdzenia: ['Zalecenie ERC 2025 co do czasu chłodzenia potwierdzić w pełnym tekście wytycznych pierwszej pomocy (polska broszura PRR tego rozdziału nie zawiera).'],
});
