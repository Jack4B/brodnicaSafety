# Makiety — Gotowość Brodnica (Etap 2)

Status: **do akceptacji** · wersja 0.1 · 22.11.2026

Klikalne makiety mobile: [`design/makiety.html`](../design/makiety.html) (otwórz w przeglądarce, najlepiej w trybie telefonu).

| ID | Ekran | Kluczowe decyzje |
|---|---|---|
| E1 | Start | stopień alarmowy (oficjalny, z godziną i źródłem), jedna duża akcja „Alarm? Co robić teraz”, 6 kafli, komunikaty (IMGW automatycznie + ręczne), „Pobierz offline” |
| E2 | Alarm — co robić | blok „Najważniejsze w 30 sekund”, rysunki sygnałów syren, oficjalne źródła, nieoficjalne mapy (Zorya, Strażnik) tylko jako linki z etykietą |
| E3 | Plecak ewakuacyjny | checklista z dwoma przełącznikami (podstawowy/rozszerzony, osoba/rodzina), postęp zapisany w telefonie |
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

1. **Nazwa:** „Gotowość Brodnica” (rekomendacja) czy „Brodnica Alert”? „Alert” sugeruje oficjalny system ostrzegania i myli się z Alert RCB.
2. **Aktualizacja stopnia alarmowego i komunikatów:** kto i jak często? Bez dyżuru lepiej linkować do gov.pl niż pokazywać nieaktualny stan.
3. **Schrony:** tylko Brodnica czy cały powiat brodnicki (rekomendacja: powiat, Brodnica pierwsza)?
4. **CSS:** własny z tokenami (rekomendacja) czy Tailwind?
5. **Przegląd medyczny:** kto zatwierdzi procedury pierwszej pomocy?
6. **Adres:** subdomena CT8 czy własna domena?
