# Design system — Gotowość Brodnica

Źródło prawdy: `src/assets/style.css` (tokeny na górze pliku). Makiety: `design/makiety.html`.

## Zasady

- **Mobile first.** Od 900 px nawigacja w lewej kolumnie, treść do ~760 px szerokości.
- **Lekkość.** Czcionki systemowe, ikony SVG w jednym sprite, jeden plik CSS i jeden JS z hashem. Cała strona offline < 1,5 MB.
- **Czytelność w stresie.** Tekst 17 px, cele dotyku ≥ 44 px (wiersze list ≥ 56 px), blok „Najważniejsze w 30 sekund” na górze stron instrukcji.
- **Kolor niesie znaczenie, nie dekorację.** Zawsze też tekst lub ikona — nie sam kolor.

## Kolory

| Token | Rola |
|---|---|
| `--brand` granat | marka, przyciski, linki, kroki |
| `--signal` pomarańcz | znak obrony cywilnej, „zapisz offline”, fokus klawiatury |
| `--danger` czerwień | wyłącznie 112, „pilne”, strzałki na ilustracjach |
| `--warn` bursztyn | „ważne”, dostępność ograniczona |
| `--ok` zieleń | zrobione, zapisane, całodobowo |
| `--bg`, `--surface`, `--ink`, `--muted`, `--line` | tła i tekst |

Wersja ciemna przez `prefers-color-scheme: dark` — każdy token ma odpowiednik.

## Komponenty

przycisk (`btn-primary`, `btn-signal`, `btn-ghost`), kafel (`tile`), karta (`card`), lista linków (`links`), chip (`chip-info/wazne/pilne/ok`), ramka (`callout-wazne/info/uwaga/112/porada`), kroki (`ol.steps`), blok szybki (`quick`), checklista (`check`), lista miejsc (`place`), ilustracja (`figure.illu`), odtwarzacz (`audio`), tabela (`table`).

## Ilustracje

Piktogramy liniowe: grube kreski z zaokrąglonymi końcami. Ratownik w kolorze `--illu-cloth`, poszkodowany `--illu-cloth2`, skóra `--illu-skin`, ruch i nacisk — czerwone strzałki. Licencja CC BY-SA 4.0.
