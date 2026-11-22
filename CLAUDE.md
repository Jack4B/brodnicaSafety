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
| 1. Koncepcja | ✅ gotowa, do akceptacji | `docs/CONCEPTS.md` |
| 2. Makiety mobile | ✅ v0.1, do akceptacji | `design/makiety.html`, `docs/MAKIETY.md` |
| 3. Akceptacja | ⏳ czeka na decyzje (lista w `docs/MAKIETY.md`) | |
| 4–8 | — | |

Źródła danych: `docs/API.md` (opis) + decyzje w `docs/CONCEPTS.md` §8. Skrypty: `scripts/fetch-schrony.mjs` (PSP, dane.gov.pl), `scripts/fetch-imgw.mjs` (IMGW). Node fetch przez proxy w chmurze: `NODE_USE_ENV_PROXY=1`.

Zasada danych: telefon nie odpytuje API — dane pobierane przy buildzie do `data/*.json`, zawsze z `zrodlo` i datą.

## Pamięć

1. Ten plik
2. `docs/solutions/`
3. `docs/CONCEPTS.md`

## Disclaimer

Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów.

---
*Ostatnia aktualizacja: 22 listopada 2026 (etapy 1–2)*
