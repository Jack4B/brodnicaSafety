// Konfiguracja serwisu: nazwa, adres, nawigacja. Zmieniaj tutaj, nie w szablonach.

export const SITE = {
  name: 'Gotowość Brodnica',
  tagline: 'poradnik dla mieszkańców',
  description: 'Niekomercyjny poradnik dla mieszkańców Brodnicy: co robić przy alarmie, schrony w mieście, plecak ewakuacyjny, pierwsza pomoc, brak prądu i wody. Działa bez internetu.',
  lang: 'pl',
  // Adres docelowy (do linków kanonicznych). Można nadpisać zmienną SITE_URL w buildzie.
  url: process.env.SITE_URL || 'https://gotowosc-brodnica.ct8.pl',
  // Ścieżka bazowa, gdy strona nie leży w katalogu głównym domeny (np. „/poradnik/”).
  base: (process.env.BASE_PATH || '/').replace(/\/?$/, '/'),
  themeColor: '#1D3F8F',
};

// Pełna nawigacja (lewa kolumna na komputerze, strona „Więcej” na telefonie).
export const NAV = [
  { path: '/', label: 'Start', icon: 'home' },
  { path: '/alarm/', label: 'Alarm — co robić', icon: 'siren' },
  { path: '/stopnie-alarmowe/', label: 'Stopnie alarmowe', icon: 'shield' },
  { path: '/komunikaty/', label: 'Komunikaty', icon: 'bell' },
  { path: '/schrony/', label: 'Schrony w Brodnicy', icon: 'shelter' },
  { path: '/plecak/', label: 'Plecak ewakuacyjny', icon: 'bag' },
  { path: '/pierwsza-pomoc/', label: 'Pierwsza pomoc', icon: 'aid' },
  { path: '/zagrozenia/', label: 'Zagrożenia', icon: 'alert' },
  { path: '/przygotowanie/', label: 'Przygotowanie', icon: 'check' },
  { path: '/przetrwanie/', label: 'Przetrwanie w terenie', icon: 'flame' },
  { path: '/lacznosc/', label: 'Łączność awaryjna', icon: 'radio' },
  { path: '/kontakty/', label: 'Telefony i kontakty', icon: 'phone' },
  { path: '/offline/', label: 'Offline i druk', icon: 'down' },
  { path: '/o-stronie/', label: 'O stronie i źródła', icon: 'info' },
];

// Dolny pasek na telefonie (5 pozycji).
export const TABS = [
  { path: '/', label: 'Start', icon: 'home' },
  { path: '/alarm/', label: 'Alarm', icon: 'siren' },
  { path: '/schrony/', label: 'Schrony', icon: 'shelter' },
  { path: '/pierwsza-pomoc/', label: 'Pomoc', icon: 'aid' },
  { path: '/wiecej/', label: 'Więcej', icon: 'menu' },
];

// Kafle na stronie głównej.
export const TILES = [
  { path: '/schrony/', label: 'Schrony', hint: 'najbliższe miejsca', icon: 'shelter' },
  { path: '/plecak/', label: 'Plecak ewakuacyjny', hint: 'lista do odhaczania', icon: 'bag' },
  { path: '/pierwsza-pomoc/', label: 'Pierwsza pomoc', hint: 'RKO, krwotok, zadławienie', icon: 'aid' },
  { path: '/zagrozenia/blackout/', label: 'Brak prądu', hint: 'blackout', icon: 'bolt' },
  { path: '/zagrozenia/', label: 'Zagrożenia', hint: 'pożar, powódź, atak z powietrza', icon: 'alert' },
  { path: '/kontakty/', label: 'Telefony', hint: 'numery alarmowe i miejskie', icon: 'phone' },
  { path: '/przygotowanie/', label: 'Przygotuj dom', hint: 'zapasy, plan rodzinny', icon: 'check' },
  { path: '/przetrwanie/', label: 'Przetrwanie', hint: 'woda, ogień, schronienie', icon: 'flame' },
];
