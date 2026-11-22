# Wdrożenie na CT8 i automatyczne aktualizacje

Strona to zwykłe pliki statyczne. Wdrożenie ma dwa etapy:

1. **Pierwsza instalacja** — paczka instalacyjna i skrypt `instaluj.sh` uruchomiony na serwerze CT8: tworzy poddomenę, wgrywa stronę, włącza SSL i sprawdza, czy działa.
2. **Automatyczne aktualizacje** — GitHub Actions (`.github/workflows/aktualizacja.yml`) co 3 godziny pobiera dane, testuje, buduje i wysyła stronę na CT8 (rsync przez SSH).

CT8 to darmowy hosting na serwerach MyDevil (FreeBSD, NGINX z obsługą `.htaccess`). Dokumentacja poleceń `devil`: [wiki.mydevil.net](https://wiki.mydevil.net/Strona_WWW/).

## 1. Paczka instalacyjna

Paczkę buduje polecenie:

```bash
npm run paczka      # → paczka/gotowosc-brodnica-ct8-RRRRMMDD-GGMM.tar.gz
```

Gotową paczkę można też pobrać z GitHuba: Actions → **Aktualizacja i wdrożenie** → **Run workflow** → po zakończeniu przebiegu sekcja **Artifacts** → `paczka-ct8`.

Zawartość:

| Plik | Co to jest |
|---|---|
| `public_html/` | gotowa strona (61 plików, ok. 1,2 MB) |
| `instaluj.sh` | instalator (źródło: `deploy/ct8/instaluj.sh`) |
| `htaccess-minimalny` | zapasowy `.htaccess`, gdy serwer zgłosi błąd 500 |
| `CZYTAJ.txt` | instrukcja w skrócie |
| `SHA256SUMS` | sumy kontrolne plików |

Adres strony nie jest znany przy budowie paczki. W plikach jest znacznik `https://adres-strony.invalid`, który instalator zamienia na właściwą domenę (linki kanoniczne, `sitemap.xml`, `robots.txt`).

## 2. Instalacja na nowej poddomenie

Potrzebne: konto na [ct8.pl](https://www.ct8.pl), login, hasło i nazwa serwera (panel.ct8.pl → Informacje o koncie, np. `s1.ct8.pl`).

```bash
scp gotowosc-brodnica-ct8-*.tar.gz LOGIN@sX.ct8.pl:      # na swoim komputerze
ssh LOGIN@sX.ct8.pl
tar xzf gotowosc-brodnica-ct8-*.tar.gz
cd gotowosc-brodnica-ct8-*/
sh instaluj.sh                     # → https://gotowosc.LOGIN.ct8.pl
```

Inna nazwa poddomeny: `sh instaluj.sh brodnica.LOGIN.ct8.pl`. Własna domena: dodaj ją najpierw w panelu CT8 i ustaw DNS, potem `sh instaluj.sh gotowosc-brodnica.pl`.

Co robi instalator (krok po kroku na ekranie):

1. `devil www add DOMENA php` — nowa strona WWW (typ php obsługuje pliki statyczne i `.htaccess`).
2. Kopiuje pliki do `~/domains/DOMENA/public_html`. Wcześniejsza zawartość trafia do `public_html.kopia-DATA` (stare kopie można usuwać ręcznie).
3. Wpisuje adres strony w pliki.
4. `devil www options DOMENA gzip on`, certyfikat Let's Encrypt (`devil ssl www add IP le le DOMENA`) i wymuszenie HTTPS (`sslonly on`).
5. Sprawdza odpowiedź strony. Gdy serwer odrzuci `.htaccess` (HTTP 500), wstawia wersję minimalną. Sprawdza też stronę błędu 404 (`errors/404.html` — tak CT8 obsługuje własne strony błędów).
6. Z opcją `--klucz` tworzy klucz SSH dla GitHub Actions (krok 3).

Nowa poddomena może potrzebować kilkunastu minut na DNS. Jeśli certyfikat SSL się nie udał, uruchom instalator jeszcze raz — można go uruchamiać wielokrotnie.

## 3. Automatyczne aktualizacje z GitHuba

### Klucz SSH

Najprościej: `sh instaluj.sh DOMENA --klucz` na serwerze. Skrypt tworzy klucz ed25519, dopisuje część publiczną do `~/.ssh/authorized_keys` (bez przekierowań i terminala), wypisuje klucz prywatny do skopiowania i usuwa go z serwera.

Albo na własnym komputerze:

```bash
ssh-keygen -t ed25519 -f ct8-deploy -N "" -C "gotowosc-brodnica deploy"
```

Zawartość `ct8-deploy.pub` dopisz na CT8 do `~/.ssh/authorized_keys`, a `ct8-deploy` wklej jako sekret (poniżej) i usuń z komputera.

### Sekrety i zmienne

Repozytorium → **Settings → Secrets and variables → Actions**. Instalator wypisuje gotowe wartości.

| Rodzaj | Nazwa | Przykład |
|---|---|---|
| Secret | `CT8_SSH_KEY` | klucz prywatny (z liniami BEGIN/END) |
| Secret | `CT8_HOST` | `s1.ct8.pl` |
| Secret | `CT8_USER` | `login` |
| Secret | `CT8_PATH` | `domains/gotowosc.login.ct8.pl/public_html` |
| Secret (opcja) | `CT8_KNOWN_HOSTS` | `s1.ct8.pl ssh-ed25519 AAAA…` — klucz serwera; bez niego pobierany przy każdym wdrożeniu |
| Variable | `SITE_URL` | `https://gotowosc.login.ct8.pl` (bez ukośnika na końcu) |
| Variable | `BASE_PATH` | `/` (zmień tylko, gdy strona leży w podkatalogu) |

Zabezpieczenia w workflow:

- wdrożenie tylko wtedy, gdy są **wszystkie** cztery sekrety `CT8_*`;
- `CT8_PATH` musi kończyć się na `/public_html` — `rsync --delete` nie dotknie nic poza katalogiem strony;
- wdrożenie tylko z **gałęzi domyślnej** — inne gałęzie tylko testują i budują;
- po wysłaniu workflow sprawdza odpowiedź strony; przy błędzie 500 wgrywa minimalny `.htaccess`.

### Gałąź domyślna

Zaplanowane uruchomienia (cron) GitHub wykonuje **tylko na gałęzi domyślnej**, a wdrożenie też działa tylko z niej. Ustaw gałąź z tym kodem jako domyślną (Settings → General → Default branch) albo scal ją do `main`.

### Pierwsze uruchomienie

Actions → **Aktualizacja i wdrożenie** → **Run workflow** (zaznacz „Pobierz też punkty schronienia”). W podsumowaniu przebiegu widać stan danych i odpowiedź strony.

## Harmonogram

| Kiedy | Co |
|---|---|
| co 3 godziny | stopnie alarmowe (RCB), ostrzeżenia IMGW, komunikaty UM Brodnica i sanepidu → test → build → wdrożenie |
| poniedziałek | dodatkowo punkty schronienia (PSP, dane.gov.pl) |
| każda zmiana w `content/`, `src/`, danych redakcji | test → build → wdrożenie (z gałęzi domyślnej) |
| ręcznie | to samo + paczka instalacyjna do pobrania |

Nowe dane są zapisywane w repozytorium (commit „Dane: aktualizacja automatyczna”). Gdy w tym czasie ktoś wypchnie zmiany, workflow dociąga je i ponawia zapis.

## Utrzymanie konta CT8

- **CT8 usuwa konto po 90 dniach bez logowania do panelu DevilWEB lub przez SSH** (regulamin ct8.pl). Zaloguj się na panel.ct8.pl co najmniej raz na 2 miesiące — najlepiej ustaw przypomnienie w kalendarzu. Logowania z GitHub Actions to też SSH, ale nie polegaj na tym.
- Trzymaj kopię paczki instalacyjnej poza serwerem — po usunięciu konta przywrócisz stronę w kilka minut.

## Gdy coś nie działa

- **Błąd 500** — serwer nie przyjął `.htaccess`. Instalator i workflow same wgrywają wersję minimalną; ręcznie: `cp htaccess-minimalny ~/domains/DOMENA/public_html/.htaccess`.
- **Brak certyfikatu SSL** — DNS nowej poddomeny jeszcze się nie rozszedł. Odczekaj i uruchom ponownie `sh instaluj.sh DOMENA`.
- **Źródło danych zmieniło format** — skrypt kończy się błędem, ale stare dane zostają, a strona pokazuje datę ostatniego odczytu i oznaczenie „błąd pobierania”. Błąd widać w Actions (czerwony krok). Parsery mają testy na zapisanych fragmentach stron (`tests/fixtures/`).
- **Wdrożenie odrzucone przez SSH** — sprawdź klucz w `~/.ssh/authorized_keys` i nazwę serwera w `CT8_HOST`.

## Ręcznie, bez GitHuba

```bash
npm run fetch && npm run fetch:schrony                      # dane
SITE_URL=https://gotowosc.LOGIN.ct8.pl npm test             # testy + build do dist/
rsync -rlz --delete dist/ LOGIN@sX.ct8.pl:domains/gotowosc.LOGIN.ct8.pl/public_html/
```
