# CLAUDE.md

## Projekt

**Nazwa:** Brodnica Alert / Gotowość Brodnica  
**Cel:** Lekka strona informacyjno-edukacyjna dla mieszkańców Brodnicy o gotowości kryzysowej.  
**Hosting:** CT8 (na początek)

## Kluczowe wymagania

- Mobile first
- Lekka (szybka na słabym internecie)
- Offline / PWA + możliwość pobrania poradnika
- Maksymalna intuicyjność UX
- Nowoczesny, czysty UI
- Anti-sloop (minimalne AI w interfejsie)
- Treści łatwe do ręcznej aktualizacji (Markdown/JSON)

## Stack

- Czysty HTML generowany skryptem Node (bez frameworka i zależności)
- Własny CSS z tokenami (decyzja z 22.11.2026 zamiast Tailwind)
- Service Worker (PWA)
- Dane: Markdown / JSON
- Hosting: CT8

## Sekcje

- Dashboard
- Zagrożenia i komunikaty
- Schronienia
- Plecak ewakuacyjny
- Pierwsza pomoc i apteczka
- Łączność awaryjna
- Media (prąd, paliwo, ciepło, woda)
- Edukacja / poradniki
- Offline download

## Zasady pracy

- Zawsze mobile first
- Małe, testowalne kroki
- Po każdym etapie aktualizuj ten plik
- Nie dodawaj zbędnych funkcji
- Priorytet: szybkość, czytelność, offline

## Status etapów

| Etap | Status | Gdzie |
|---|---|---|
| 1. Koncepcja | ✅ | `docs/CONCEPTS.md` |
| Research źródeł | ✅ | `docs/RESEARCH.md` |
| 2. Makiety mobile | ✅ | `design/makiety.html`, `docs/MAKIETY.md` |
| 3. Akceptacja | ✅ 22.11.2026: nazwa „Gotowość Brodnica”, GitHub Actions, zakres miasto, własne ilustracje | |
| 4. Design system | ✅ | `docs/DESIGN.md`, `src/assets/style.css` |
| 5. Kod (v1.1) | ✅ 45 stron, PWA offline, rysunki medic + Health Icons | `src/`, `content/` |
| 6. Testy | ✅ jednostkowe + build + e2e offline (Playwright) | `tests/` |
| 7. Wdrożenie CT8 | ⏳ paczka + instalator gotowe (poddomena, SSL, test 500), czeka na konto i sekrety CT8 | `deploy/ct8/`, `scripts/paczka.sh`, `docs/WDROZENIE.md` |
| 8. Dokumentacja treści | ✅ | `docs/AKTUALIZACJA.md` |

## Decyzje techniczne (obowiązujące)

- **Zero zależności.** Generator `src/build.mjs` (Node ≥ 20) + własny parser Markdown `src/lib/md.mjs`. Bez Tailwind — własny CSS z tokenami (~20 KB).
- **Treści:** `content/**/*.md` z front matter (`title`, `lead`, `kolejnosc`, `ikona`, `aktualizacja`, `przeglad`, `zrodla`). Składnia rozszerzeń: `docs/AKTUALIZACJA.md`.
- **Strony generowane z danych:** start, stopnie, komunikaty, schrony, plecak, offline, poradnik (do druku), więcej — `src/templates.mjs`.
- **PWA:** `src/sw.template.js` → `dist/sw.js` z listą wszystkich plików; HTML network-first (4 s), reszta cache-first.
- **Rysunki pierwszej pomocy:** skill medic → arkusze `pierwsza-pomoc-instrukcje/` (9) → panele SVG w `src/illustrations/medic/` + style `src/assets/medic.css` (skrypt `scripts/ilustracje-medic.mjs`). Paleta: granat #1F2A44, beż, czerwień #C8102E; biała karta w obu motywach. Decyzja użytkownika 22.11.2026: jedna paleta dla ikon i rysunków, bez Wikimedii.
- **Ikony pierwszej pomocy:** Health Icons (CC0) z `pierwsza-pomoc-ikony/svg/`, pole `ikona-hi` w front matter. `--danger` = #C8102E.
- **Prawo i normy w treściach:** art. 4–6 ustawy o PRM, art. 162 kk (`content/pierwsza-pomoc/index.md`), znaki PN-EN ISO 7010 E003/E004/E010.
- **Schematy własne** (syreny, flagi, orientacja, ogień): SVG w `src/illustrations/`, kolory przez klasy CSS.
- **Automatyzacja:** GitHub Actions co 3 h (RCB, IMGW, UM, sanepid), schrony co tydzień; commit danych do repo; rsync na CT8 tylko z gałęzi domyślnej, `CT8_PATH` musi kończyć się na `/public_html`.
- **CT8:** NGINX z emulacją `.htaccess` (błąd składni → 500, wtedy `deploy/ct8/htaccess-minimalny`); HTTPS przez `devil www options DOMENA sslonly on`, nie przez `.htaccess`; strony błędów w `errors/`. Konto usuwane po 90 dniach bez logowania.
- **Przegląd kodu 22.11.2026:** naprawione: IMGW nie zeruje ostrzeżeń przy błędzie API, źródło komunikatów z błędem zostaje na liście, SW nie gubi plików przy aktualizacji, Markdown (kod w linku, CRLF/BOM), testy z BASE_PATH. Ustawa o PRM: tekst jednolity Dz.U. 2026 poz. 141; kk: Dz.U. 2026 poz. 1342.

## Komendy

```bash
npm test              # testy jednostkowe + build + test zbudowanej strony
npm run serve         # podgląd dist/ na :8080
node tests/e2e-offline.mjs   # test offline w przeglądarce (Playwright)
npm run fetch         # dane: stopnie, IMGW, komunikaty (w chmurze: NODE_USE_ENV_PROXY=1)
npm run fetch:schrony # punkty schronienia PSP
npm run paczka        # paczka instalacyjna CT8 → paczka/*.tar.gz (instalator: deploy/ct8/instaluj.sh)
```

Zakres: **miasto Brodnica**. Charakter: **niekomercyjny**, maksimum rzetelnej wiedzy.

Źródła treści: rdzeń = oficjalny „Poradnik bezpieczeństwa” (gov.pl, materiały urzędowe); pierwsza pomoc = wytyczne ERC 2025 (broszura PRR 04.2026) + PB; przetrwanie = ATP 3-50.21 (US Army). Szczegóły i licencje: `docs/RESEARCH.md`.

Zasada danych: telefon nie odpytuje API — dane pobierane przy buildzie do `data/*.json`, zawsze z `zrodlo` i datą. Gdy źródło zawiedzie, zostaje ostatnia dobra wersja; nigdy nie pokazujemy braku danych jako „brak zagrożeń”.

## Materiały dodatkowe (22.11.2026)

- `pierwsza-pomoc-ikony/` — 34 ikony Health Icons (CC0), filled 48 px, #C8102E, równe marginesy; skrypt `scripts/ikony-healthicons.mjs`.
- `pierwsza-pomoc-instrukcje/` — 8 arkuszy instrukcji (skill medic): HTML animowane, `png/` do druku, `index.html`, `ZRODLA.md` (punkty DO SPRAWDZENIA); budowanie `node pierwsza-pomoc-instrukcje/src/zbuduj.mjs` (wymaga skilla w `~/.claude/skills/medic`).
- Ustalenie: ERC 2025 — RKO niemowlęcia dwoma kciukami z objęciem klatki (poprawione na stronie).

## Otwarte

- przegląd treści medycznych przez ratownika/lekarza (pole `przeglad` w plikach `content/pierwsza-pomoc/`),
- potwierdzenie w UM Brodnica: syreny, MDS, numery awaryjne MPWiK i ciepłownictwa, SOR (projekt maila: `docs/RESEARCH.md` §8),
- zgoda RCB na ilustracje z Poradnika (opcjonalnie),
- mapa AED (OpenStreetMap/Overpass — z chmury nie działało),
- sekrety CT8 i ustawienie gałęzi domyślnej.

## Pamięć

1. Ten plik
2. `docs/solutions/`
3. `docs/CONCEPTS.md`

## Disclaimer

Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów.

---
*Ostatnia aktualizacja: 22 listopada 2026 (v1.1: rysunki medic, przegląd kodu, paczka CT8)*
