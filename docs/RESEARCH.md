# Research — źródła treści i danych

Stan na: **22.11.2026** · zakres: **miasto Brodnica** · charakter: **niekomercyjny**

Dokument zbiera, skąd bierzemy wiedzę i dane, na jakich zasadach możemy je wykorzystać i co da się aktualizować automatycznie. Uzupełnia `docs/API.md`.

---

## 1. Najważniejsze ustalenia

1. **Stopnie alarmowe aktualizują się automatycznie.** Codzienny „Raport dobowy” RCB zawiera sekcję „STOPNIE ALARMOWE” z listą obowiązujących stopni. Skrypt `scripts/fetch-stopnie.mjs` ją odczytuje (sprawdzone na żywych danych).
2. **Rdzeniem treści jest oficjalny „Poradnik bezpieczeństwa” (MSWiA, MON, RCB, 2025).** gov.pl: „korzystanie z materiałów urzędowych opublikowanych w serwisie Gov.pl nie wymaga zgody”. Ma 24 tematy, listę plecaka i procedury pierwszej pomocy. To daje nam „maksimum wiedzy” z pewnego źródła.
3. **Sygnały alarmowe zmieniły się w 2025 r.** Rozporządzenie MSWiA z 14.05.2025 dodało m.in. **alarm wizualny (żółty trójkąt)** i **sygnał ćwiczebny (ciągły dźwięk przez 1 minutę)**. Makieta E2 wymaga aktualizacji.
4. **Komunikaty lokalne też da się pobierać automatycznie.** Są dwa źródła: kanał Atom Urzędu Miejskiego i komunikaty sanepidu w Brodnicy o jakości wody. Skrypt `scripts/fetch-komunikaty.mjs` działa.
5. **Treści wojskowe i survivalowe:** amerykański podręcznik **ATP 3-50.21 „Survival” (US Army, 2018)** jest dopuszczony do publicznego rozpowszechniania bez ograniczeń. Jako dzieło rządu federalnego USA nie jest chroniony prawem autorskim w USA. Nadaje się na bazę działu „Przetrwanie w terenie” (woda, ogień, schronienie, sygnalizacja, orientacja).
6. **Ilustracje:** nie znalazłem kompletu nowoczesnych ilustracji pierwszej pomocy po polsku na otwartej licencji. Rekomendacja: **własne, proste piktogramy SVG** rysowane według tekstu oficjalnego poradnika, plus link do oficjalnego PDF. Szczegóły w §4.

---

## 2. Stopnie alarmowe — automatyczna aktualizacja

| | |
|---|---|
| Źródło | [RCB — Raport dobowy](https://www.gov.pl/web/rcb/raport-dobowy3), aktualizowany codziennie |
| Metoda | odczyt HTML (RCB nie udostępnia API ani RSS). Sekcja zaczyna się akapitem `STOPNIE ALARMOWE …`, a kolejne akapity to stopnie |
| Skrypt | `scripts/fetch-stopnie.mjs` → `data/stopnie.json` |
| Bezpiecznik | gdy sekcji nie ma, dane **nie są nadpisywane**, a skrypt kończy się błędem. Strona pokazuje datę ostatniego udanego odczytu |
| Częstotliwość | raz dziennie (np. 9:00) + przebudowa strony |

**Odczyt z 22.11.2026** (do 30.11.2026):

| Stopień | Obszar | Dla Brodnicy |
|---|---|---|
| BRAVO (2.) | cały kraj — zarz. nr 47 z 25.08.2026 | dotyczy |
| BRAVO-CRP (2.) | cały kraj — zarz. nr 50 z 25.08.2026 | dotyczy |
| CHARLIE (3.) | obszary linii kolejowych PKP PLK i LHS — zarz. nr 48 | dotyczy terenów kolejowych w mieście |
| BRAVO (2.) | polska infrastruktura energetyczna za granicą — zarz. nr 49 | nie dotyczy mieszkańców |

Opis znaczenia stopni: [RCB — Stopnie alarmowe](https://www.gov.pl/web/rcb/stopnie-alarmowe2). Stopnie są przede wszystkim sygnałem dla służb i administracji. Strona powinna mówić wprost, co to oznacza dla mieszkańca: więcej kontroli, zakaz wstępu osób postronnych do szkół, obowiązek zgłaszania porzuconych bagaży.

Odrzucone alternatywy: strony gmin przepisujące komunikaty RCB (opóźnienia, różne daty), serwisy nieoficjalne.

---

## 3. Sygnały alarmowe (stan prawny)

Źródło: [Rozporządzenie MSWiA z 14 maja 2025 r. w sprawie alarmów i komunikatów ostrzegawczych, Dz.U. 2025 poz. 645](https://api.sejm.gov.pl/eli/acts/DU/2025/645/text.pdf), [RCB — Sygnały alarmowe](https://www.gov.pl/web/rcb/sygnaly-alarmowe3). RCB udostępnia nagrania WAV obu sygnałów.

| Sygnał | Jak brzmi / wygląda |
|---|---|
| **Ogłoszenie alarmu** (dla ludności) | modulowany dźwięk syreny przez **3 minuty** albo trzykrotne „Uwaga! Uwaga! Uwaga! Ogłaszam alarm…” |
| **Odwołanie alarmu** | ciągły (jednostajny) dźwięk przez **3 minuty** albo „Uwaga! ×3 Odwołuję alarm…” |
| **Alarm ćwiczebny / treningowy** | ciągły dźwięk przez **1 minutę** |
| Alarm dla straży pożarnej | 3× wzrastający i opadający dźwięk z 30-sekundowymi przerwami (nie dotyczy ludności, ale warto go znać, żeby się nie pomylić) |
| **Alarm wizualny** | **żółty równoboczny trójkąt skierowany podstawą do dołu** na obiektach publicznych lub w mediach; zdjęcie znaku = odwołanie |

Kanały komunikatów ostrzegawczych według rozporządzenia: **aplikacja RSO**, prasa i strony internetowe, radio i TV oraz operatorzy komórkowi, **Alert RCB** (SMS). Aplikacja RSO nadal jest oficjalnym kanałem (§3 rozporządzenia). To wyjaśnia wątpliwość z `docs/API.md`.

---

## 4. Treści — źródła i licencje

### 4.1 Rdzeń: oficjalne publikacje państwowe

| Materiał | Co zawiera | Zasady użycia | Jak używamy |
|---|---|---|---|
| **[Poradnik bezpieczeństwa](https://www.gov.pl/web/poradnikbezpieczenstwa)** (MSWiA/MON/RCB, nr 1/2025, ISBN 978-83-976775-0-0) | 24 tematy (lista niżej), checklisty, zapasy, plecak, pierwsza pomoc; PDF PL/EN/UA/LT, pliki do druku, plakaty, wersja w PJM | [gov.pl — Prawa autorskie](https://www.gov.pl/web/gov/prawa-autorskie): materiały urzędowe bez zgody; utwory osób trzecich wymagają zgody. Materiały urzędowe są też wyłączone z ochrony (art. 4 pkt 2 pr. aut.) | **tekst**: opracowujemy i cytujemy ze źródłem; **ilustracje**: nie kopiujemy bez pisemnej zgody RCB (mogą być utworem agencji); **PDF**: link + opcjonalna kopia offline |
| [Poradnik na czas kryzysu i wojny „Bądź gotowy!”](https://www.gov.pl/web/rcb/poradnik-na-czas-kryzysu-i-wojny2) (RCB) | starszy poradnik RCB, m.in. pierwsza pomoc, plecak | jw. | uzupełnienie |
| [RCB — Stopnie alarmowe, Sygnały alarmowe, Raport dobowy](https://www.gov.pl/web/rcb) | stan prawny i bieżący | jw. | dane automatyczne + wyjaśnienia |
| [Rozporządzenie 2025 poz. 645](https://api.sejm.gov.pl/eli/acts/DU/2025/645/text.pdf) | sygnały alarmowe | akt prawny, bez ochrony | wprost |

**Tematy oficjalnego poradnika** (mapują się 1:1 na naszą strukturę, patrz `CONCEPTS.md`): przygotowanie, wspólne bezpieczeństwo (OLiOC, NGO), zdrowie i emocje, osoby potrzebujące szczególnej pomocy, zwierzęta, otoczenie (dom, szkoła, praca, samochód), sygnały i komunikaty, ewakuacja, tłum, schronienia, pożar, powódź, blackout, atak z powietrza, CBRN, niepokojące zachowania, terroryzm, zagrożenia cyfrowe, pierwsza pomoc, higiena w kryzysie, plan na kryzys.

**Kluczowe liczby z poradnika** (do użycia w treściach):
- zapasy domowe na **minimum 3 dni**,
- woda: **minimum 3 litry na osobę na dobę**,
- RKO: **30 uciśnięć : 2 wdechy**, głębokość **5–6 cm**, tempo **2 uciśnięcia na sekundę**; można uciskać bez wdechów,
- krwotok z kończyny: opaska uciskowa powyżej rany na ramieniu lub udzie, **zapisz godzinę**; blady i spocony poszkodowany → unieś nogi ok. **30 cm**.

### 4.2 Pierwsza pomoc — materiały z otwartą lub niekomercyjną licencją

| Materiał | Licencja | Ocena |
|---|---|---|
| [Zintegrowana Platforma Edukacyjna — „Udzielanie pierwszej pomocy”](https://zpe.gov.pl/a/udzielanie-pierwszej-pomocy/D16WNaj1B) (MEN) | CC BY 4.0 (część materiałów), inne CC BY-SA 3.0; część grafik z Freepika, czyli **nie** CC | dobre źródło polskich tekstów i ćwiczeń; licencję trzeba sprawdzać **dla każdej ilustracji osobno** |
| [Szkoła Policji w Katowicach — Poradnik dla słuchacza kursu pierwszej pomocy](https://spkatowice.policja.gov.pl/download/363/217654/PoradnikUPP20.pdf) | CC BY-NC-SA 3.0 PL | **pasuje do niekomercyjnego charakteru**: wolno adaptować z podaniem autora i na tej samej licencji. Sprawdzić zgodność z wytycznymi ERC 2025 |
| [Szkoła Policji w Katowicach — RKO i AED](https://spkatowice.policja.gov.pl/download/363/127802/23-RKO-i-AED.pdf) (2014) | CC BY-NC-ND 3.0 PL | tylko w całości, bez zmian; nieaktualne wytyczne → raczej nie |
| [Polska Rada Resuscytacji — wytyczne ERC 2025 (PL)](https://www.prc.krakow.pl/wp-content/uploads/2025/10/WytResusc_net.pdf), broszura „Resuscytacja dla każdego” | wszelkie prawa zastrzeżone | **źródło merytoryczne i link**, bez kopiowania grafik |
| [FEMA — „You Are the Help Until Help Arrives”](https://www.ready.gov/sites/default/files/2020-07/until-help-arrives-web-tutorial.pdf), [piktogramy USFA](https://www.usfa.fema.gov/gallery/pictographs/911-first-aid.html) | prace rządu USA, ale część zdjęć może należeć do osób trzecich | piktogramy do weryfikacji pojedynczo |
| Wikimedia Commons | różne CC | brak spójnego, nowoczesnego zestawu. Pojedyncze pliki (np. BruceBlaus, CC BY-SA 4.0) można wykorzystać po sprawdzeniu strony pliku |

**Rekomendacja dla ilustracji:** rysujemy **własny zestaw ok. 12 piktogramów SVG** w stylu strony: RKO, pozycja boczna, ucisk rany, opaska uciskowa, zadławienie, oparzenie, AED, 112, schron, syrena, plecak, woda. Zalety: spójny wygląd, kilka KB, działa offline, jasna licencja (udostępniamy je na CC BY-SA 4.0). Merytorycznie opieramy je na tekście oficjalnego poradnika i wytycznych ERC 2025. Przegląd zrobi ratownik.

Równolegle warto **zapytać RCB o zgodę na wykorzystanie ilustracji z poradnika** (projekt maila w §8). Pozytywna odpowiedź oszczędzi pracy.

### 4.3 Wojsko, survival, bushcraft

| Materiał | Status | Do czego |
|---|---|---|
| **[ATP 3-50.21 Survival](https://irp.fas.org/doddir/army/atp3-50-21.pdf)** (US Army, IX 2018) | „Approved for public release; distribution is unlimited”; dzieło rządu USA (17 U.S.C. §105). Oryginał: [armypubs.army.mil](https://armypubs.army.mil) | dział „Przetrwanie w terenie”: uzdatnianie wody, rozpalanie ognia, schronienie improwizowane, sygnalizacja, orientacja bez GPS, ochrona przed zimnem. **Tłumaczymy i skracamy, podajemy źródło** |
| [FM 3-05.70 / FM 21-76 Survival](https://irp.fas.org/doddir/army/fm21-76-1.pdf) | starsze wydania tego samego; część skanów na archive.org ma zastrzeżenia praw | tylko jako uzupełnienie, ATP 3-50.21 jest aktualniejszy |
| [MON — „Trenuj z wojskiem”](https://www.gov.pl/web/obrona-narodowa/trenuj-z-wojskiem-po-raz-szosty-startuje-kolejna-edycja-otwartych-sobotnich-szkolen-wojskowych) | bezpłatne 8-godzinne sobotnie szkolenia dla osób 15–65 lat: pierwsza pomoc w warunkach polowych, przetrwanie, schronienie, reagowanie na alarmy | **link i zachęta**; najbliżej Brodnicy: Toruń i Bydgoszcz (8 Kujawsko-Pomorska Brygada OT). Terminy 2026 do sprawdzenia |
| [Szwecja — „Om krisen eller kriget kommer” (2024)](https://www.mcf.se/en/advice-for-individuals/the-brochure-in-case-of-crisis-or-war/download-and-order-the-brochure-in-case-of-crisis-or-war/) | licencja niejasna | tylko inspiracja i porównanie list |
| Wskazówki ekspertów WOT w mediach ([TVP](https://warszawa.tvp.pl/96044764/plecak-ewakuacyjny-bije-rekordy-popularnosci-ekspert-wot-wyjasnia-co-musi-sie-w-nim-znalezc), [Strefa Obrony](https://strefaobrony.pl/wyposazenie-plecaka-ewakuacyjnego-radio-plus-latarka-to-dopiero-poczatek/ar/c1p2-27904809)) | artykuły prasowe | tylko fakty ze źródłem (np. plecak na ok. 72 h). Rada „plecak nie powinien wyglądać jak wojskowy” ([Pomorska](https://pomorska.pl/tak-nalezy-spakowac-plecak-ewakuacyjny-i-zachowywac-sie-w-czasie-ostrzalu-te-informacje-w-poradniku-badz-gotowy/ar/c1-16275147)) |

Odrzucone: harcerskie podręczniki bez jasnej licencji, sklepy „survivalowe” (treści sprzedażowe), skany z Scribd.

### 4.4 Plecak ewakuacyjny — lista robocza

Baza: oficjalna lista z „Poradnika bezpieczeństwa” (wersja **podstawowa**). Rozszerzenie: pozycje z praktyki wojskowej i survivalowej (wersja **rozszerzona**). Dane: `data/plecak.json`; przy każdej pozycji jest źródło.

---

## 5. Dane lokalne — miasto Brodnica

### 5.1 Potwierdzone

| Co | Dane | Źródło |
|---|---|---|
| Urząd Miejski | ul. Kamionka 23, 87-300 Brodnica · centrala **56 493 03 00** | [portal.brodnica.pl — telefony](https://www.portal.brodnica.pl/strona-3344-telefony.html) |
| **Biuro Bezpieczeństwa i Zarządzania Kryzysowego** UM | tel. **56 493 03 57**, 56 498 32 26 · pok. 311 | jw. |
| **SMS-Brodnica** (powiadomienia miejskie, m.in. o zagrożeniach) | bezpłatne; zapis SMS-em na **503 340 503** (treść np. `brodnicaogolny`) lub przez formularz | [sms.brodnica.pl](https://sms.brodnica.pl/) |
| Aktualności miasta — kanał Atom | `https://www.portal.brodnica.pl/aktualnosci.xml` | automatycznie (`fetch-komunikaty.mjs`) |
| Sanepid — komunikaty o jakości wody i kąpielisk | lista na gov.pl | [PSSE Brodnica — komunikaty](https://www.gov.pl/web/psse-brodnica/komunikaty), automatycznie |
| Państwowa Straż Pożarna | Komenda Powiatowa PSP w Brodnicy; odsyła do aplikacji „Schrony” | [gov.pl/web/kppsp-brodnica](https://www.gov.pl/web/kppsp-brodnica) |
| Punkty schronienia | zbiór KG PSP (dane z 10.11.2026), filtr: miejscowość Brodnica | `fetch-schrony.mjs` (pierwsze pobranie do wykonania) |
| Ostrzeżenia pogodowe | IMGW, TERYT 0402 | `fetch-imgw.mjs` |
| Wodociągi | Miejskie Przedsiębiorstwo Wodociągów i Kanalizacji Sp. z o.o., ul. Ustronie 2A | rejestry publiczne |

### 5.2 Do weryfikacji telefonicznej lub mailowej (nie publikujemy przed potwierdzeniem)

- numer **pogotowia wodociągowego** MPWiK Brodnica (strona mpwik.pl nie odpowiada),
- **ciepłownictwo**: czy nadal działa PEC w Brodnicy, numer awaryjny,
- **szpital i SOR**: źródła podają sprzeczne adresy (ul. Wiejska 9 / ul. Żwirki i Wigury 1). Sprawdzić na [mapie SOR pacjent.gov.pl](https://pacjent.gov.pl),
- **lokalizacje syren** i terminy testów: zapytać Biuro ZK UM,
- **miejsca doraźnego schronienia (MDS)** i punkty zbiórki do ewakuacji: zapytać Biuro ZK UM,
- **defibrylatory AED**: OpenStreetMap (`emergency=defibrillator`) + aplikacja Staying Alive. Zapytanie Overpass z tego środowiska nie przeszło (zerwane połączenie), do ponowienia.

Numery ogólnopolskie: **112** (alarmowy), 999 (pogotowie), 998 (straż), 997 (policja), 991 (awarie energetyczne), 992 (pogotowie gazowe). Dla osób niesłyszących: aplikacja **Alarm112** (wymieniona w poradniku).

---

## 6. Automatyzacja — jak to uruchomić produkcyjnie

| Zadanie | Skrypt | Częstotliwość |
|---|---|---|
| Stopnie alarmowe (RCB) | `fetch-stopnie.mjs` | codziennie |
| Ostrzeżenia IMGW | `fetch-imgw.mjs` | co 1–3 h |
| Komunikaty: UM Brodnica + sanepid | `fetch-komunikaty.mjs` | co 1–3 h |
| Schrony (PSP) | `fetch-schrony.mjs` | raz w miesiącu |

**Rekomendacja:** zaplanowany workflow **GitHub Actions** (cron) uruchamia skrypty, buduje stronę i wgrywa ją na CT8 przez SFTP (hasło w GitHub Secrets). Dla publicznego repozytorium jest to darmowe i nie zależy od wersji Node na CT8. Alternatywa: cron na CT8, jeśli Node jest tam dostępny (do sprawdzenia).

Zasada bezpieczeństwa danych: gdy źródło nie odpowiada lub zmieni format, **zostaje ostatnia dobra wersja**, a strona pokazuje „stan na: …”. Nigdy nie pokazujemy pustego stanu jako „brak zagrożeń”.

---

## 7. Wpływ na projekt

- **Zakres:** miasto Brodnica (schrony, komunikaty, kontakty). Informacje ogólnopolskie (stopnie, sygnały) są pokazane z perspektywy mieszkańca miasta.
- **Struktura treści** rozszerzona do pełnej listy tematów poradnika + dział „Przetrwanie w terenie” (szczegóły w `CONCEPTS.md`).
- **Makiety:** E1 (stopnie z automatu, 4 pozycje, „dla Brodnicy”), E2 (nowe sygnały, w tym ćwiczebny i wizualny), E3 (woda 3 l/os/dobę, rozszerzenie wojskowo-survivalowe), E4 (zakres: miasto).

---

## 8. Projekty wiadomości

**Do RCB** (kontakt: [gov.pl/web/poradnikbezpieczenstwa/kontakt](https://www.gov.pl/web/poradnikbezpieczenstwa/kontakt)):

> Temat: Prośba o zgodę na wykorzystanie ilustracji z „Poradnika bezpieczeństwa” w niekomercyjnym serwisie edukacyjnym
>
> Dzień dobry, przygotowujemy niekomercyjną stronę informacyjno-edukacyjną dla mieszkańców Brodnicy o przygotowaniu na sytuacje kryzysowe. Strona działa offline i nie zawiera reklam. Chcielibyśmy wykorzystać ilustracje z „Poradnika bezpieczeństwa” (nr 1/2025), z podaniem źródła i linkiem do gov.pl. Czy ilustracje są materiałem urzędowym, czy utworem osób trzecich? Jeśli to drugie, czy możemy otrzymać zgodę na niekomercyjne wykorzystanie? Z góry dziękujemy.

**Do Biura Bezpieczeństwa i Zarządzania Kryzysowego UM Brodnica:**

> Dzień dobry, tworzymy niekomercyjny poradnik internetowy dla mieszkańców Brodnicy. Prosimy o informacje, które możemy opublikować: lokalizacje syren i terminy testów, miejsca doraźnego schronienia i punkty zbiórki do ewakuacji, numery awaryjne MPWiK i ciepłownictwa. Chętnie pokażemy stronę przed publikacją.
