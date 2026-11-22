# Jak aktualizować treści

Treści to pliki Markdown w `content/`, dane w `data/`. Po zmianie: `npm test` (lub commit na GitHubie — workflow zbuduje i wdroży sam).

## Struktura

```
content/
  alarm.md                    → /alarm/
  pierwsza-pomoc/index.md     → /pierwsza-pomoc/  (wstęp działu; podstrony listują się same)
  pierwsza-pomoc/rko.md       → /pierwsza-pomoc/rko/
data/
  komunikaty.json             ← komunikaty wpisywane ręcznie
  plecak.json                 ← lista plecaka (ręcznie)
  stopnie.json, komunikaty-auto.json, ostrzezenia-imgw.json, schrony.json  ← automatycznie, nie edytuj
src/illustrations/*.svg       ← ilustracje
```

## Nagłówek pliku

```markdown
---
title: Silny krwotok
lead: Jedno zdanie pod tytułem.
kolejnosc: 3                    # kolejność w dziale
ikona: aid                      # ikona na liście (nazwy w src/lib/icons.mjs)
aktualizacja: 2026-11-22        # data sprawdzenia treści — zmieniaj przy każdej weryfikacji
przeglad: przegląd ratownika — 2026-12-01, Jan Kowalski   # opcjonalnie
zrodla:
- Nazwa źródła | https://adres
---
```

**Zasada:** każda strona ma źródła i datę sprawdzenia. Treści bez źródła nie publikujemy.

## Składnia

| Zapis | Efekt |
|---|---|
| `## Nagłówek` | sekcja |
| `1. **Czynność.** Wyjaśnienie` | numerowany krok (pogrubienie = tytuł kroku) |
| `- punkt` | lista |
| `**pogrubienie**`, `[link](/schrony/)` | jak w Markdown; linki wewnętrzne zaczynaj od `/` |
| `{{tel:112}}` | numer do kliknięcia |
| `> [!WAZNE] Tytuł` + kolejne linie `> treść` | ramka: `WAZNE`, `INFO`, `UWAGA`, `112`, `PORADA` |
| `::: szybko` … `:::` | blok „Najważniejsze w 30 sekund” (można dać własny tytuł po `szybko`) |
| `{{ilustracja:nazwa\|Podpis}}` | rysunek z `src/illustrations/nazwa.svg` |
| `{{audio:plik.mp3\|Podpis}}` | odtwarzacz z `src/assets/audio/` |
| tabela z `\|` | tabela przewijana na telefonie |

## Komunikat ręczny

`data/komunikaty.json`:

```json
[
  {
    "data": "2026-12-01",
    "tytul": "Przerwa w dostawie wody, ul. Przykładowa",
    "tresc": "W godz. 8–14. Beczkowóz przy szkole nr 1.",
    "waga": "wazne",
    "zrodlo": "MPWiK Brodnica",
    "url": "https://…",
    "wazne_do": "2026-12-01"
  }
]
```

`waga`: `info`, `wazne` albo `pilne`. Po dacie `wazne_do` komunikat znika sam.

## Ilustracje

**Pierwsza pomoc** — ilustracje z Wikimedia Commons na otwartych licencjach (CC0, CC BY-SA), przekolorowane na paletę strony. Opis każdej (plik na Commons, autor, licencja, tekst alternatywny, kadr) jest w `src/illustrations/open/licencje.json`. Aby dodać nową:

1. Znajdź na Commons ilustrację na licencji CC0, CC BY lub CC BY-SA. Sprawdź, czy technika jest zgodna z aktualnymi wytycznymi ERC.
2. Pobierz ją w standardowym rozmiarze miniatury (np. `Special:FilePath/NAZWA?width=960`), zapisz jako `KLUCZ.png` w dowolnym katalogu.
3. Dopisz wpis do `licencje.json` (`plik`, `autor`, `licencja`, `alt`, opcjonalnie `kadr` [lewo, góra, prawo, dół] jako ułamki i `czerwien: true`, jeśli czerwona strzałka ma zostać).
4. `python3 scripts/ilustracje-paleta.py KATALOG` (wymaga Pillow) — powstanie `KLUCZ.webp` w palecie strony.
5. W treści: `{{ilustracja:KLUCZ|Podpis}}`. Autor i licencja dopiszą się pod ilustracją automatycznie.

**Schematy własne** (syreny, flagi, orientacja, ogień) — pliki SVG w `src/illustrations/`, `viewBox` ok. 320×200. Kolory tylko przez klasy (działają w jasnym i ciemnym motywie): `skin`, `lr` (ratownik), `lv` (poszkodowany), `lk` (dłoń), `arrow`/`arrow-f` (czerwona strzałka), `accent`, `lbl`/`lbl-b` (podpisy), `ground`, `surface`, `muted-s`, `water`, `red`, `star`. Podgląd: `npm test`, potem `npm run serve`.

## Przed publikacją treści medycznych

1. Porównaj z aktualnymi wytycznymi ERC (broszura PRR „Resuscytacja dla każdego”).
2. Daj do przeglądu ratownikowi lub lekarzowi i wpisz to w polu `przeglad`.
3. Zmień `aktualizacja` na dzień sprawdzenia.
