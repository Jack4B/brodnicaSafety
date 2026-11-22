# Źródła i status arkuszy

> **Do weryfikacji przez osobę z uprawnieniami KPP/ratownika.** Arkusze są materiałem edukacyjnym, nie poradą medyczną i nie zastępują kursu pierwszej pomocy.

## Wytyczne

| Skrót | Dokument |
|---|---|
| **ERC 2025** | Europejska Rada Resuscytacji, wytyczne 2025 — polskie wydanie Polskiej Rady Resuscytacji „Resuscytacja dla każdego według Wytycznych Europejskiej Rady Resuscytacji 2025” (2026), https://www.prc.krakow.pl/wp-content/uploads/2026/04/Broszura-ERC-2025-i.pdf |
| **PB 2025** | „Poradnik bezpieczeństwa” (MSWiA, MON, RCB), nr 1/2025, https://www.gov.pl/web/poradnikbezpieczenstwa |
| **ATP 3-50.21** | US Army, „Survival” (2018) — chłodzenie oparzeń, https://armypubs.army.mil |
| **PRM / kk** | ustawa o Państwowym Ratownictwie Medycznym (tekst jednolity Dz.U. 2026 poz. 141, sprawdzony 22.11.2026) art. 4–6; Kodeks karny (Dz.U. 2026 poz. 1342) art. 162 — blok „Podstawa prawna” na każdym arkuszu |
| **PN-EN ISO 7010** | znaki bezpieczeństwa: E010 (AED), E003 (pierwsza pomoc) — wzmianki w arkuszach 03 i 07 |
| **medic** | skill https://github.com/zenbakiak/medic, `references/procedures.md` — punkty oznaczone „Varies” rozstrzygnięto na korzyść ERC |

## Arkusze

| Arkusz | Oparty na | Wybory (gdzie wytyczne się różnią) | DO SPRAWDZENIA |
|---|---|---|---|
| 01 Ocena | ERC 2025 (BLS dorośli: ocena reakcji, udrożnienie, oddech ≤ 10 s, 112 na głośnomówiącym); PB 2025 | 112 (ERC dla Polski wymienia też 999) | — |
| 02 RKO dorosły | ERC 2025: 5–6 cm, 100–120/min, 30 : 2, przerwa < 10 s, same uciśnięcia u nieprzeszkolonych | — | — |
| 03 AED | ERC 2025: elektrody pod prawym obojczykiem i na lewym boku, nikt nie dotyka, powrót do RKO, po AED tylko gdy ≤ 1 min | — | — |
| 04 Pozycja boczna | ERC 2025 „Pozycja bezpieczna” (kryteria: obniżona przytomność, prawidłowy oddech, brak urazu); PB 2025 („pozycja boczna ustalona”) | — | kolejne ruchy układania (kroki 1–3) — broszura ERC ich nie rozpisuje; przyjęto standardowy sposób z kursów KPP |
| 05 Zadławienie — dorosły | ERC 2025 „Zadławienie”: kaszel, 5 uderzeń w plecy, 5 uciśnięć nadbrzusza, na zmianę; utrata przytomności → RKO | kolejność: najpierw plecy (ERC) | — |
| 06 Zadławienie — niemowlę | ERC 2025 (RKO dzieci: 5 oddechów na początek, uciśnięcia dwoma kciukami z objęciem klatki, ≥ 1/3 głębokości) | technika RKO niemowlęcia: dwa kciuki (ERC), nie dwa palce | technika uciśnięć klatki **przy zadławieniu** niemowlęcia (dwa palce / dwa kciuki / nasada dłoni) — broszura ERC jej nie opisuje; rysunek pokazuje miejsce, nie technikę |
| 07 Krwotok | ERC 2025 (ucisk bezpośredni), PB 2025 (opatrunek uciskowy, opaska powyżej rany, zapisz godzinę, uniesienie nóg ok. 30 cm przy wstrząsie) | — | odległość opaski od rany (w niektórych źródłach 5–7 cm) — celowo bez liczby |
| 08 Oparzenie | ATP 3-50.21 (20 min chłodzenia wodą); ERC (pierwsza pomoc) — chłodzenie ≥ 20 min; PB 2025 (opatrunki na oparzenia) | 20 min (ERC) zamiast „co najmniej 10 min” | potwierdzić czas chłodzenia w pełnym tekście wytycznych ERC 2025 „First Aid” (polska broszura nie zawiera tego rozdziału) |
| 09 Anafilaksja | ERC 2025, rozdz. „Pierwsza pomoc” (adrenalina domięśniowo w zewnętrzną część uda, powtórzenie po 5 min, pozycja siedząca lub leżąca) | — | czas przytrzymania autostrzykawki zależy od modelu (3–10 s) — według ulotki |

## Do weryfikacji przed publikacją

1. Cały komplet — przegląd przez ratownika medycznego lub instruktora KPP.
2. Punkty z kolumny „DO SPRAWDZENIA”.
3. Rysunki: pozy figur są schematyczne (piktogramy). Sprawdzić zwłaszcza arkusz 04 (widok z góry i pozycja końcowa) oraz 06 (ułożenie niemowlęcia na przedramieniu).

## Technika

- Arkusze generowane skryptami `src/*.mjs` z kitem skilla medic (`~/.claude/skills/medic/kit/body.mjs`, inna ścieżka: zmienna `MEDIC_KIT`).
- Wspólna paleta, skala postaci (26 px na głowę), linia podłogi i położenie dużej liczby: `src/wspolne.mjs`.
- Budowanie wszystkiego (HTML animowany, PNG statyczny przez `scripts/shot.sh` z `MEDIC_FREEZE=0.5`, `index.html`): `node src/zbuduj.mjs`.
- Repozytorium skilla medic nie zawiera pliku licencji — przed publicznym rozpowszechnianiem arkuszy (zawierają style i kształty figur z kitu) warto zapytać autora o zgodę.
