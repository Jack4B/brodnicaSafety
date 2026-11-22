# Koncepcja — Gotowość Brodnica (Etap 1)

Status: **do akceptacji** · wersja 0.2 · 22.11.2026 (po researchu, patrz `docs/RESEARCH.md`)

**Zakres:** miasto Brodnica. **Charakter:** niekomercyjny, bez reklam, maksimum rzetelnej wiedzy.

Dokument rozwija `docs/konspekt.md` w konkretną strukturę treści, zakres MVP i decyzje techniczne.

## 1. Dla kogo i po co

Strona odpowiada na pytania mieszkańca Brodnicy w trzech sytuacjach:

| Sytuacja | Kto | Czego potrzebuje | Czas |
|---|---|---|---|
| **Teraz coś się dzieje** (syreny, brak prądu, ktoś krwawi) | każdy, często w stresie, słaby zasięg | jednej, jasnej instrukcji | 10–30 s |
| **Przygotowuję się** | rodzic, osoba samotna, opiekun seniora | checklisty, listy zakupów, plan | 5–30 min |
| **Chcę wiedzieć, skąd brać informacje** | każdy | oficjalne źródła, jak je śledzić | 1–2 min |

Projektujemy przede wszystkim pod pierwszą sytuację: telefon, słaby internet albo jego brak, duże przyciski, zero zbędnego czytania.

## 2. Zasady treści

1. **Najpierw działanie.** Każda strona zaczyna się od bloku „Najważniejsze w 30 sekund” (krótkie kroki w trybie rozkazującym). Szczegóły niżej.
2. **Źródło i data przy każdej sekcji.** Pole `updated` i `sources` w każdym pliku treści. Treść bez źródła nie trafia na stronę.
3. **Nie tworzymy własnej skali zagrożeń.** Pokazujemy tylko oficjalne stopnie alarmowe (ALFA, BRAVO, CHARLIE, DELTA oraz warianty CRP) z datą i linkiem do źródła.
4. **Dane lokalne tylko z oficjalnych źródeł.** Schrony, telefony, adresy: jeśli nie mamy potwierdzonej informacji, piszemy „w przygotowaniu” i linkujemy do źródła. Nigdy nie zgadujemy.
5. **Bez udawania urzędu.** Brak herbów i logotypów instytucji. Widoczny disclaimer w stopce.
6. **Anti-sloop.** Bez chatbota, bez generowania treści na żywo, bez „inteligentnych” rekomendacji. Teksty pisane i sprawdzane przez ludzi.
7. **Prosty język.** Zdania do ~15 słów, bez żargonu. Terminy (np. „miejsce doraźnego schronienia”) wyjaśnione przy pierwszym użyciu.

## 3. Mapa strony

| Adres | Strona | Zawartość | MVP |
|---|---|---|---|
| `/` | **Start** | stopnie alarmowe (**automatycznie z RCB**), „Alarm? Co robić teraz”, kafle do sekcji, 3 ostatnie komunikaty, „Pobierz offline” | ✅ |
| `/alarm/` | **Zagrożenia i alarm** | co robić przy alarmie, sygnały syren, zagrożenia z powietrza (ogólnie), oficjalne źródła i jak je śledzić | ✅ |
| `/komunikaty/` | Komunikaty | pełna lista komunikatów (z datą i źródłem) | ✅ |
| `/schrony/` | **Schronienia** | punkty schronienia w mieście (zbiór PSP), schemat mapy, jak się zachować, co zabrać | ✅ |
| `/plecak/` | **Plecak ewakuacyjny** | interaktywna checklista: podstawowy/rozszerzony × osoba/rodzina, zapis w telefonie | ✅ |
| `/pierwsza-pomoc/` | Pierwsza pomoc | lista procedur + apteczka | ✅ |
| `/pierwsza-pomoc/krwotok/` itd. | procedura | RKO, krwotok, oparzenia, zadławienie, pozycja boczna, kiedy dzwonić 112 | ✅ (5 procedur) |
| `/media/` | Prąd, woda, ciepło, paliwo | jedna strona z kotwicami: `#prad`, `#woda`, `#cieplo`, `#paliwo` | ✅ |
| `/lacznosc/` | Łączność awaryjna | sieć komórkowa przy przeciążeniu, SMS, radio, PMR/CB, plan kontaktu rodzinnego | ✅ |
| `/zagrozenia/…` | **Zagrożenia od A do Z** | osobna strona dla każdego tematu oficjalnego poradnika: pożar, powódź (Drwęca), blackout, atak z powietrza, CBRN, terroryzm, niepokojące zachowania, zagrożenia cyfrowe i dezinformacja, bezpieczeństwo w tłumie | ✅ (treść z Poradnika bezpieczeństwa) |
| `/przygotowanie/…` | **Przygotowanie** | plan rodzinny, zapasy domowe na 3 dni, osoby potrzebujące pomocy, zwierzęta, dom/szkoła/praca/samochód, higiena w kryzysie, zdrowie i emocje | ✅ |
| `/przetrwanie/` | **Przetrwanie w terenie** | woda (zdobywanie, uzdatnianie), ogień, schronienie improwizowane, orientacja bez GPS, ochrona przed zimnem; na podstawie ATP 3-50.21 | ✅ |
| `/kontakty/` | **Kontakty w Brodnicy** | numery alarmowe, Biuro Zarządzania Kryzysowego UM, SMS-Brodnica, sanepid, straż, media (po weryfikacji) | ✅ |
| `/szkolenia/` | Gdzie się nauczyć | kursy pierwszej pomocy, „Trenuj z wojskiem” (Toruń, Bydgoszcz), organizacje lokalne | ⏳ po MVP |
| `/offline/` | **Offline** | status zapisu w telefonie, „Dodaj do ekranu głównego”, poradnik do druku/PDF | ✅ |
| `/poradnik/` | Poradnik w jednym pliku | cała treść na jednej stronie, styl do druku | ✅ |

### Nawigacja (mobile)

- **Dolny pasek (5):** Start · Alarm · Schrony · Plecak · Więcej
- **Więcej:** Pierwsza pomoc, Prąd/woda/ciepło, Łączność, Komunikaty, Offline, O stronie
- **Nagłówek:** nazwa + stały przycisk **112** + wskaźnik „dostępne offline”
- Desktop (≥ 900 px): ta sama treść, nawigacja w lewej kolumnie, treść max ~680 px szerokości.

## 4. MVP (wersja 1.0)

**W zakresie:** strony oznaczone ✅ powyżej, PWA z zapisem całej strony offline, poradnik w jednym pliku (druk / „Zapisz jako PDF” z przeglądarki), wdrożenie na CT8.

**Poza MVP (później, jeśli będzie potrzeba):**
- interaktywna mapa (Leaflet) — na start schemat SVG + lista + link do oficjalnej mapy,
- gotowy plik PDF generowany automatycznie,
- wersje językowe (UA/EN),
- powiadomienia push (wymagają backendu i dyżuru — świadomie odrzucone na start),
- wyszukiwarka.

## 5. Model treści (łatwa ręczna edycja)

```
content/
  alarm.md            # front matter: title, summary, updated, sources[]
  schrony.md
  pierwsza-pomoc/krwotok.md ...
  media.md
  lacznosc.md
data/
  status.json         # { "stopien": "BRAVO", "zakres": "...", "od": "...", "zrodlo": "https://..." , "aktualizacja": "..." }
  komunikaty.json     # [{ "data", "tytul", "tresc", "waga": "info|wazne|pilne", "zrodlo" }]
  schrony.json        # [{ "nazwa", "adres", "typ": "schron|ukrycie|MDS", "zrodlo", "weryfikacja" }]
  plecak.json         # [{ "grupa", "nazwa", "poziom": "podst|rozsz", "dla": "wszyscy|rodzina" }]
```

Edycja = zmiana pliku Markdown/JSON → `npm run build` → wgranie `dist/` na CT8. Instrukcja krok po kroku powstanie w `docs/AKTUALIZACJA.md` (etap 8).

## 6. Decyzje techniczne (propozycja)

| Obszar | Propozycja | Dlaczego |
|---|---|---|
| Generowanie | Czysty HTML generowany małym skryptem Node (`build.mjs`), jedna zależność do Markdown | brak frameworka = mniej do psucia i aktualizowania, wynik to zwykłe pliki dla CT8 |
| CSS | Własny plik z tokenami (cel < 15 KB) zamiast Tailwind | przy ~12 stronach Tailwind dodaje narzędzia budowania bez zysku; tokeny i tak opisuje design system. **Do decyzji przy akceptacji.** |
| Fonty | systemowe (`system-ui`) | 0 KB, natychmiastowe renderowanie, dobra czytelność polskich znaków |
| JS | tylko: rejestracja Service Workera, checklista (localStorage), wskaźnik online/offline | cel < 5 KB; strona działa bez JS (poza zapisem checklisty) |
| Offline | Service Worker: przy pierwszej wizycie zapisuje **całą** stronę; HTML „network-first” z cache jako zapas, zasoby „cache-first”; wersjonowanie cache przy każdym buildzie | komunikaty świeże, gdy jest sieć; pełny dostęp, gdy jej nie ma |
| Hosting | CT8: statyczne pliki przez SFTP/rsync, `.htaccess` (nagłówki cache, `sw.js` bez cache), HTTPS z panelu CT8 | prosto i tanio |

### Budżety wydajności

- pierwsze wejście: **< 100 KB** transferu (HTML + CSS + JS),
- cała strona zapisana offline: **< 1 MB**,
- LCP < 2 s na „Slow 4G”, Lighthouse ≥ 95 we wszystkich kategoriach,
- obrazy tylko gdy niosą informację (SVG inline, brak zdjęć dekoracyjnych).

## 7. Ryzyka

| Ryzyko | Jak ograniczamy |
|---|---|
| Nieaktualne informacje są gorsze niż brak informacji | data przy każdej sekcji; komunikaty starsze niż 7 dni oznaczone jako archiwalne; stopień alarmowy z datą „stan na” |
| Strona mylona z oficjalnym kanałem | nazwa bez słowa „Alert” (patrz pytania), brak symboli urzędów, disclaimer, wyraźne linki do RCB/gov.pl |
| Błędy w treściach medycznych | procedury na podstawie aktualnych wytycznych (ERC), przegląd przez ratownika/lekarza przed publikacją |
| Nieprawdziwe dane o schronach | tylko dane z oficjalnych źródeł z datą weryfikacji |

## 8. Źródła danych (na podstawie `docs/API.md` i `docs/RESEARCH.md`)

Zasada: **telefon nigdy nie odpytuje zewnętrznych API.** Dane pobieramy przy budowaniu strony (lub z crona na CT8), zapisujemy w `data/*.json` i publikujemy jako zwykłe pliki. Dzięki temu strona działa offline, nie zależy od dostępności źródeł i nie ma problemów z CORS.

| Źródło | Do czego | Jak | Status |
|---|---|---|---|
| **KG PSP — Punkty schronienia w Polsce** (dane.gov.pl, zbiór 28058, CC BY 4.0) | lista schronów, ukryć i MDS | `scripts/fetch-schrony.mjs` → `data/schrony.json` (filtr: miasto Brodnica) | ✅ wybrane; skrypt gotowy, pierwsze pobranie do wykonania |
| **IMGW-PIB — ostrzeżenia meteo** (`danepubliczne.imgw.pl/api/data/warningsmeteo`) | komunikaty pogodowe dla powiatu (TERYT 0402) | `scripts/fetch-imgw.mjs` → `data/ostrzezenia-imgw.json` | ✅ działa (22.11.2026: brak ostrzeżeń) |
| **RCB — Raport dobowy** | stopnie alarmowe | `scripts/fetch-stopnie.mjs` → `data/stopnie.json`, codziennie; przy błędzie zostaje ostatni stan | ✅ działa |
| **UM Brodnica — kanał Atom** + **PSSE Brodnica** | komunikaty lokalne (filtr: bezpieczeństwo, media, woda w mieście) | `scripts/fetch-komunikaty.mjs` → `data/komunikaty-auto.json` | ✅ działa |
| Alert RCB | najważniejsze alerty | brak publicznego API → informujemy, że SMS przychodzi sam | informacja |
| Aplikacja RSO | komunikaty regionalne | oficjalny kanał wg rozporządzenia z 2025 r.; feed nieudokumentowany → polecamy aplikację, nie pobieramy | informacja |
| SMS-Brodnica | powiadomienia miejskie | polecamy zapis (503 340 503) | informacja |
| Zorya, Strażnik | mapy zagrożeń z powietrza | **tylko link** z etykietą „nieoficjalne”; bez osadzania (ciężkie, nie działają offline) | ✅ jako link |
| NEPTUN, Tryvoha | zagrożenia nad Ukrainą | pomijamy: mało przydatne dla mieszkańca Brodnicy, ryzyko szumu | ❌ |
| OpenStreetMap | mapa | tylko jeśli po MVP zdecydujemy się na Leaflet | ⏳ |

Każdy plik w `data/` zawiera pola `zrodlo`, `licencja` (jeśli dotyczy), `dane_z` i `pobrano`, które strona pokazuje użytkownikowi. Licencja CC BY 4.0 wymaga podania źródła: robimy to przy liście schronów.

Uwagi:
- Pola ostrzeżeń IMGW (`nazwa_zdarzenia`, `teryt` itd.) trzeba potwierdzić przy pierwszym realnym ostrzeżeniu — dziś API zwraca „Brak ostrzeżeń”.
- Kolumny CSV ze schronami skrypt rozpoznaje po nazwach; przy pierwszym uruchomieniu użyć `--show-columns` i sprawdzić mapowanie zapisane w `kolumny_zrodlowe`.

## 9. Pytania do akceptacji

Zebrane w `docs/MAKIETY.md` (sekcja „Do decyzji”).
