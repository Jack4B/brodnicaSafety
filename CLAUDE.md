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

- Next.js (static export) lub czysty HTML + Tailwind
- Tailwind CSS
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
| 1. Koncepcja | ✅ v0.2 (po researchu), do akceptacji | `docs/CONCEPTS.md` |
| Research źródeł | ✅ | `docs/RESEARCH.md` |
| 2. Makiety mobile | ✅ v0.2, do akceptacji | `design/makiety.html`, `docs/MAKIETY.md` |
| 3. Akceptacja | ⏳ czeka na decyzje (lista w `docs/MAKIETY.md`) | |
| 4–8 | — | |

Zakres: **miasto Brodnica**. Charakter: **niekomercyjny**, maksimum rzetelnej wiedzy.

Źródła treści: rdzeń = oficjalny „Poradnik bezpieczeństwa” (gov.pl, materiały urzędowe — tekst bez zgody, ilustracje tylko za zgodą RCB); przetrwanie = ATP 3-50.21 (US Army, public release); pierwsza pomoc = PB + wytyczne ERC 2025 (tylko jako źródło). Szczegóły i licencje: `docs/RESEARCH.md`.

Skrypty danych (`scripts/`, bez zależności, wspólne `lib.mjs`):
- `fetch-stopnie.mjs` — stopnie alarmowe z raportu dobowego RCB (codziennie),
- `fetch-komunikaty.mjs` — UM Brodnica (Atom) + sanepid Brodnica,
- `fetch-imgw.mjs` — ostrzeżenia IMGW (TERYT 0402),
- `fetch-schrony.mjs` — punkty schronienia PSP, filtr: miasto Brodnica (pierwsze pobranie do wykonania).
Node fetch przez proxy w chmurze: `NODE_USE_ENV_PROXY=1`. gov.pl czasem zrywa połączenia — `fetchText` ponawia.

Zasada danych: telefon nie odpytuje API — dane pobierane przy buildzie do `data/*.json`, zawsze z `zrodlo` i datą. Gdy źródło zawiedzie, zostaje ostatnia dobra wersja; nigdy nie pokazujemy braku danych jako „brak zagrożeń”.

## Pamięć

1. Ten plik
2. `docs/solutions/`
3. `docs/CONCEPTS.md`

## Disclaimer

Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów.

---
*Ostatnia aktualizacja: 22 listopada 2026 (etapy 1–2 + research)*
