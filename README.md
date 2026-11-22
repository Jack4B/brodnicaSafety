# Gotowość Brodnica

Lekka strona informacyjno-edukacyjna dla mieszkańców Brodnicy o gotowości kryzysowej. Mobile first, działa offline, hosting CT8.

- Kontekst i zasady: [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md)
- Konspekt: [`docs/konspekt.md`](docs/konspekt.md)
- Koncepcja (etap 1): [`docs/CONCEPTS.md`](docs/CONCEPTS.md)
- Makiety (etap 2): [`design/makiety.html`](design/makiety.html), opis w [`docs/MAKIETY.md`](docs/MAKIETY.md)
- Źródła danych: [`docs/API.md`](docs/API.md)

## Dane

```bash
NODE_USE_ENV_PROXY=1 node scripts/fetch-imgw.mjs                    # ostrzeżenia IMGW dla powiatu brodnickiego
NODE_USE_ENV_PROXY=1 node scripts/fetch-schrony.mjs --show-columns  # schrony PSP (dane.gov.pl), powiat brodnicki
```

`NODE_USE_ENV_PROXY=1` potrzebne tylko za proxy (np. w środowisku chmurowym).

> Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów służb i władz.
