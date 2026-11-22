# Gotowość Brodnica

Niekomercyjny poradnik dla mieszkańców Brodnicy o gotowości kryzysowej: co robić przy alarmie, 221 punktów schronienia w mieście, plecak ewakuacyjny, pierwsza pomoc (ERC 2025), zagrożenia, przygotowanie domu, przetrwanie w terenie. Mobile first, działa offline (PWA), bez reklam i śledzenia.

Stopnie alarmowe, ostrzeżenia IMGW i komunikaty miejskie aktualizują się automatycznie (GitHub Actions, co 3 godziny).

## Szybki start

```bash
npm test          # testy + build do dist/ (Node ≥ 20, bez zależności)
npm run serve     # podgląd: http://localhost:8080
```

## Dokumentacja

| Plik | Co zawiera |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | stan projektu, decyzje, komendy |
| [`docs/AKTUALIZACJA.md`](docs/AKTUALIZACJA.md) | jak edytować treści, komunikaty i ilustracje |
| [`docs/WDROZENIE.md`](docs/WDROZENIE.md) | CT8, sekrety, harmonogram aktualizacji |
| [`docs/RESEARCH.md`](docs/RESEARCH.md) | źródła, licencje, dane lokalne |
| [`docs/CONCEPTS.md`](docs/CONCEPTS.md), [`docs/MAKIETY.md`](docs/MAKIETY.md), [`docs/DESIGN.md`](docs/DESIGN.md) | koncepcja, makiety, design system |

## Struktura

```
content/   treści (Markdown)          data/      dane (JSON; część automatycznie)
src/       generator, szablony, CSS,  scripts/   pobieranie danych, ikony, podgląd
           JS, Service Worker,        tests/     testy jednostkowe, builda i offline
           ilustracje SVG             .github/   automatyczna aktualizacja i wdrożenie
```

> Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów służb i władz.
