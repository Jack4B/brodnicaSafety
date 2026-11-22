# Gotowość Brodnica

Lekka strona informacyjno-edukacyjna dla mieszkańców Brodnicy o gotowości kryzysowej. Mobile first, działa offline, hosting CT8.

- Kontekst i zasady: [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md)
- Konspekt: [`docs/konspekt.md`](docs/konspekt.md)
- Koncepcja (etap 1): [`docs/CONCEPTS.md`](docs/CONCEPTS.md)
- Makiety (etap 2): [`design/makiety.html`](design/makiety.html), opis w [`docs/MAKIETY.md`](docs/MAKIETY.md)
- Research źródeł i licencji: [`docs/RESEARCH.md`](docs/RESEARCH.md)
- Źródła danych: [`docs/API.md`](docs/API.md)

## Dane

```bash
node scripts/fetch-stopnie.mjs                     # stopnie alarmowe (raport dobowy RCB)
node scripts/fetch-komunikaty.mjs                  # komunikaty: Urząd Miejski + sanepid Brodnica
node scripts/fetch-imgw.mjs                        # ostrzeżenia IMGW dla powiatu brodnickiego
node scripts/fetch-schrony.mjs --show-columns      # punkty schronienia PSP (dane.gov.pl), miasto Brodnica
```

Za proxy (np. w środowisku chmurowym) dodaj na początku `NODE_USE_ENV_PROXY=1`.

> Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów służb i władz.
