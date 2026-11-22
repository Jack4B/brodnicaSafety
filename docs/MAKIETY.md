# Makiety — Gotowość Brodnica (Etap 2)

Status: **do akceptacji** · wersja 0.2 · 22.11.2026 (po researchu)

Klikalne makiety mobile: [`design/makiety.html`](../design/makiety.html) (otwórz w przeglądarce, najlepiej w trybie telefonu).

| ID | Ekran | Kluczowe decyzje |
|---|---|---|
| E1 | Start | stopnie alarmowe **automatycznie z raportu RCB** (z informacją, czego dotyczą w Brodnicy), jedna duża akcja „Alarm? Co robić teraz”, 6 kafli, komunikaty (IMGW, UM Brodnica, sanepid — automatycznie), „Pobierz offline” |
| E2 | Alarm — co robić | blok „Najważniejsze w 30 sekund”, sygnały wg rozporządzenia z 2025 r. (alarm, odwołanie, ćwiczenia, żółty trójkąt), oficjalne źródła (Alert RCB, RSO, SMS-Brodnica), nieoficjalne mapy tylko jako linki z etykietą |
| E3 | Plecak ewakuacyjny | checklista z dwoma przełącznikami (podstawowy = Poradnik bezpieczeństwa, rozszerzony = ATP 3-50.21), źródło przy każdej pozycji, postęp zapisany w telefonie |
| E4 | Schronienia | dane z oficjalnego zbioru PSP (dane.gov.pl), schemat SVG offline, lista z typem obiektu, zasady w schronie |
| E5 | Procedura pierwszej pomocy | wezwanie 112 na górze, kroki, status przeglądu medycznego |
| E6 | Offline | potwierdzenie zapisu, „Dodaj do ekranu głównego”, PDF i wersja do druku |

Wspólne elementy: nagłówek z przyciskiem **112**, pasek „Dostępne offline”, dolna nawigacja (Start · Alarm · Schrony · Plecak · Więcej), disclaimer w stopce.

**Desktop (≥ 900 px):** ta sama treść; dolny pasek zamienia się w lewą kolumnę nawigacji, treść max ~680 px. Makieta desktop powstanie po akceptacji wersji mobilnej.

## Design system (szkic)

- Kolory z międzynarodowego znaku obrony cywilnej: granat (marka, akcje), pomarańcz (znak, offline). Czerwień wyłącznie dla 112 i „pilne”. Bursztyn = „ważne”, zieleń = „zrobione/zapisane”. Pełna wersja jasna i ciemna.
- Czcionki systemowe (0 KB). Skala: 30/26/17/16/13 px. Cele dotyku ≥ 44 px, wiersze checklisty ≥ 52 px.
- Komponenty: przycisk główny / sygnałowy / obrysowany, chip (informacja, ważne, pilne, zapisano), karta, lista kroków, checklista, rozwijana sekcja, kafel.
- Dane przykładowe oznaczone ramką „PRZYKŁAD” i nigdy niepublikowane w tej formie.

## Do decyzji

Rozstrzygnięte po researchu: stopnie alarmowe i komunikaty **automatycznie**, zakres **miasto Brodnica**, charakter **niekomercyjny**, plecak i porady oparte na źródłach rządowych i wojskowych.

Otwarte:
1. **Nazwa:** „Gotowość Brodnica” (rekomendacja) czy „Brodnica Alert”?
2. **Automatyczne aktualizacje:** GitHub Actions (rekomendacja) czy cron na CT8?
3. **Ilustracje pierwszej pomocy:** własne piktogramy SVG (rekomendacja) + prośba do RCB o zgodę na ilustracje z poradnika.
4. **CSS:** własny z tokenami (rekomendacja) czy Tailwind?
5. **Przegląd medyczny:** kto zatwierdzi procedury pierwszej pomocy?
6. **Adres:** subdomena CT8 czy własna domena?
7. **Kontakt z Urzędem Miejskim** (syreny, miejsca doraźnego schronienia, numery awaryjne MPWiK i ciepłownictwa): wysyłasz Ty? Projekt maila jest w `docs/RESEARCH.md` §8.
