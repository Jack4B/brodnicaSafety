# Wdrożenie na CT8 i automatyczne aktualizacje

Strona to zwykłe pliki statyczne (`dist/`). GitHub Actions (`.github/workflows/aktualizacja.yml`) co 3 godziny pobiera dane, uruchamia testy, buduje stronę i wysyła ją na CT8 przez SSH (rsync).

## 1. Konto i strona na CT8

1. Załóż konto na [ct8.pl](https://www.ct8.pl). Domyślny adres strony to `LOGIN.ct8.pl`.
2. Zaloguj się w panelu i sprawdź w „Informacje o koncie” nazwę serwera SSH (np. `s1.ct8.pl`).
3. Katalog strony to zwykle `domains/LOGIN.ct8.pl/public_html` (lub własna domena dodana w panelu „WWW”). Typ strony: **PHP/statyczna**.
4. Włącz certyfikat SSL (Let's Encrypt) w panelu „SSL”.

> Sprawdź w regulaminie CT8 wymagania dotyczące aktywności konta (np. okresowe logowanie do panelu) — nieaktywne darmowe konta mogą być usuwane.

## 2. Klucz SSH tylko do wdrożeń

Na własnym komputerze:

```bash
ssh-keygen -t ed25519 -f ct8-deploy -N "" -C "gotowosc-brodnica deploy"
```

- Zawartość `ct8-deploy.pub` dopisz na CT8 do `~/.ssh/authorized_keys` (zaloguj się raz hasłem: `ssh LOGIN@sX.ct8.pl`).
- Zawartość `ct8-deploy` (klucz prywatny) wklej jako sekret w GitHubie (krok 3). Potem usuń plik z komputera.

## 3. Sekrety i zmienne w GitHubie

Repozytorium → **Settings → Secrets and variables → Actions**.

| Rodzaj | Nazwa | Przykład |
|---|---|---|
| Secret | `CT8_SSH_KEY` | zawartość pliku `ct8-deploy` |
| Secret | `CT8_HOST` | `s1.ct8.pl` |
| Secret | `CT8_USER` | `login` |
| Secret | `CT8_PATH` | `domains/login.ct8.pl/public_html` |
| Variable | `SITE_URL` | `https://login.ct8.pl` (adres strony, bez ukośnika na końcu) |
| Variable | `BASE_PATH` | `/` (zmień tylko, gdy strona leży w podkatalogu) |

Bez sekretów workflow działa dalej, ale tylko pobiera dane, testuje i buduje — nie wysyła plików.

## 4. Gałąź domyślna

Zaplanowane uruchomienia (cron) GitHub wykonuje **tylko na gałęzi domyślnej**. Ustaw gałąź z tym kodem jako domyślną (Settings → General → Default branch) albo scal ją do `main`.

## 5. Pierwsze uruchomienie

Actions → **Aktualizacja i wdrożenie** → **Run workflow** (zaznacz „Pobierz też punkty schronienia”). Po kilku minutach strona jest na CT8, a w podsumowaniu przebiegu widać stan danych.

## Harmonogram

| Kiedy | Co |
|---|---|
| co 3 godziny | stopnie alarmowe (RCB), ostrzeżenia IMGW, komunikaty UM Brodnica i sanepidu → test → build → wdrożenie |
| poniedziałek | dodatkowo punkty schronienia (PSP, dane.gov.pl) |
| każda zmiana w `content/`, `src/`, danych redakcji | test → build → wdrożenie |

Nowe dane są zapisywane w repozytorium (commit „Dane: aktualizacja automatyczna”), więc historia zmian stopni i komunikatów jest zachowana.

## Gdy coś nie działa

- **Źródło zmieniło format** — skrypt kończy się błędem, ale stare dane zostają, a strona pokazuje datę ostatniego odczytu. Błąd widać w Actions (czerwony krok). Parsery mają testy na zapisanych fragmentach stron (`tests/fixtures/`).
- **Wdrożenie odrzucone przez SSH** — sprawdź klucz w `authorized_keys` i nazwę serwera w `CT8_HOST`.
- **Serwer nie czyta `.htaccess`** — strona działa, tracimy tylko nagłówki cache i przekierowanie na HTTPS.

## Ręcznie, bez GitHuba

```bash
npm run fetch && npm run fetch:schrony   # dane
npm test                                  # testy + build do dist/
rsync -rlz --delete dist/ LOGIN@sX.ct8.pl:domains/LOGIN.ct8.pl/public_html/
```
