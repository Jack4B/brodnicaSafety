#!/bin/sh
# Instalator strony „Gotowość Brodnica” na CT8 (serwery MyDevil, FreeBSD).
# Uruchom NA SERWERZE CT8, w rozpakowanym katalogu paczki:
#
#   sh instaluj.sh                         # poddomena gotowosc.LOGIN.ct8.pl
#   sh instaluj.sh brodnica.LOGIN.ct8.pl   # inna nazwa poddomeny
#   sh instaluj.sh DOMENA --klucz          # dodatkowo klucz SSH dla GitHub Actions
#
# Co robi:
#   1. dodaje stronę WWW (typ php — obsługuje pliki statyczne i .htaccess),
#   2. kopiuje pliki do ~/domains/DOMENA/public_html (stara zawartość → kopia zapasowa),
#   3. wpisuje adres strony w linki kanoniczne, mapę strony i robots.txt,
#   4. włącza kompresję, certyfikat Let's Encrypt i wymuszenie HTTPS,
#   5. sprawdza, czy strona odpowiada; gdy serwer odrzuci .htaccess (błąd 500), wstawia wersję minimalną,
#   6. opcjonalnie tworzy klucz SSH do automatycznych aktualizacji z GitHuba.
# Skrypt można uruchamiać wielokrotnie (np. przy aktualizacji paczki).
set -eu

TU=$(cd "$(dirname "$0")" && pwd)
LOGIN=$(id -un)
ZNACZNIK='https://adres-strony.invalid'

DOMENA=""
KLUCZ=nie
for a in "$@"; do
  case "$a" in
    --klucz) KLUCZ=tak ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) DOMENA=$a ;;
  esac
done
[ -n "$DOMENA" ] || DOMENA="gotowosc.$LOGIN.ct8.pl"
DOMENA=$(printf '%s' "$DOMENA" | tr 'A-Z' 'a-z')

info() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
ok()   { printf '    ok: %s\n' "$*"; }
uwaga(){ printf '    \033[33mUWAGA:\033[0m %s\n' "$*"; }
blad() { printf '\n\033[31mBŁĄD:\033[0m %s\n' "$*" >&2; exit 1; }

# --- kontrola ---
case "$DOMENA" in
  *[!a-z0-9.-]*|.*|*.|*..*) blad "Niepoprawna nazwa domeny: $DOMENA" ;;
esac
command -v devil >/dev/null 2>&1 || blad "Brak polecenia devil — uruchom skrypt na serwerze CT8 (ssh $LOGIN@sX.ct8.pl)."
[ -f "$TU/public_html/index.html" ] && [ -f "$TU/public_html/sw.js" ] || blad "Brak plików strony w $TU/public_html — rozpakuj całą paczkę."

CEL="$HOME/domains/$DOMENA/public_html"
SERWER=$(hostname)
echo "Gotowość Brodnica — instalacja"
echo "  konto:   $LOGIN"
echo "  serwer:  $SERWER"
echo "  adres:   https://$DOMENA"
echo "  katalog: $CEL"

# --- 1. strona WWW ---
info "1/6 Strona WWW"
if devil www list 2>/dev/null | awk '{print $1}' | grep -qx "$DOMENA"; then
  ok "strona $DOMENA już istnieje"
else
  devil www add "$DOMENA" php || blad "Nie udało się dodać strony. Sprawdź limit stron w panelu CT8 (panel.ct8.pl → Strony WWW)."
  ok "dodano stronę $DOMENA (typ php)"
fi
[ -d "$CEL" ] || mkdir -p "$CEL"

# --- 2. pliki ---
info "2/6 Pliki strony"
case "$CEL" in "$HOME"/domains/*/public_html) ;; *) blad "Nieoczekiwany katalog docelowy: $CEL" ;; esac
if [ -n "$(ls -A "$CEL" 2>/dev/null)" ]; then
  KOPIA="$HOME/domains/$DOMENA/public_html.kopia-$(date +%Y%m%d-%H%M%S)"
  mv "$CEL" "$KOPIA"
  mkdir -p "$CEL"
  ok "poprzednia zawartość przeniesiona do $KOPIA"
fi
cp -R "$TU/public_html/." "$CEL/"
chmod -R u=rwX,go=rX "$CEL"
ok "skopiowano $(find "$CEL" -type f | wc -l | tr -d ' ') plików"

# --- 3. adres strony ---
info "3/6 Adres strony w plikach"
N=0
for f in $(grep -rl "$ZNACZNIK" "$CEL" 2>/dev/null || true); do
  sed "s#$ZNACZNIK#https://$DOMENA#g" "$f" > "$f.tmp" && mv "$f.tmp" "$f" && chmod 644 "$f"
  N=$((N + 1))
done
ok "wpisano https://$DOMENA w $N plikach"

# --- 4. kompresja, SSL, HTTPS ---
info "4/6 Kompresja i certyfikat SSL"
devil www options "$DOMENA" gzip on >/dev/null 2>&1 && ok "kompresja GZIP włączona" || uwaga "nie udało się włączyć GZIP (strona działa bez tego)"
IP=""
if command -v host >/dev/null 2>&1; then IP=$(host -t A "$DOMENA" 2>/dev/null | awk '/has address/ {print $NF; exit}'); fi
if [ -z "$IP" ] && command -v drill >/dev/null 2>&1; then IP=$(drill "$DOMENA" A 2>/dev/null | awk '$4 == "A" {print $5; exit}'); fi
SSL=nie
if [ -z "$IP" ]; then
  uwaga "domena jeszcze nie ma wpisu DNS. Za kilka-kilkanaście minut uruchom ponownie: sh instaluj.sh $DOMENA"
elif devil ssl www list 2>/dev/null | grep -q "$DOMENA"; then
  SSL=tak; ok "certyfikat dla $DOMENA już jest"
elif devil ssl www add "$IP" le le "$DOMENA"; then
  SSL=tak; ok "certyfikat Let's Encrypt dodany ($IP)"
else
  uwaga "certyfikat się nie udał (DNS mógł się jeszcze nie rozejść). Ponów później: devil ssl www add $IP le le $DOMENA"
fi
if [ "$SSL" = tak ]; then
  devil www options "$DOMENA" sslonly on >/dev/null 2>&1 && ok "wymuszone HTTPS" || uwaga "nie udało się wymusić HTTPS"
fi

# --- 5. sprawdzenie ---
info "5/6 Sprawdzenie strony"
PROTO=http; [ "$SSL" = tak ] && PROTO=https
kod() {
  if command -v curl >/dev/null 2>&1; then curl -s -o /dev/null -m 20 -w '%{http_code}' "$1" 2>/dev/null || echo 000
  else fetch -q -o /dev/null -T 20 "$1" >/dev/null 2>&1 && echo 200 || echo 000; fi
}
K=$(kod "$PROTO://$DOMENA/")
if [ "$K" = 500 ]; then
  uwaga "serwer odrzucił .htaccess (błąd 500) — wstawiam wersję minimalną"
  cp "$TU/htaccess-minimalny" "$CEL/.htaccess" && chmod 644 "$CEL/.htaccess"
  K=$(kod "$PROTO://$DOMENA/")
fi
case "$K" in
  200) ok "strona odpowiada: $PROTO://$DOMENA/ (HTTP 200)" ;;
  000) uwaga "brak odpowiedzi — DNS nowej poddomeny może potrzebować kilkunastu minut" ;;
  *)   uwaga "strona zwraca HTTP $K — sprawdź w przeglądarce: $PROTO://$DOMENA/" ;;
esac
K404=$(kod "$PROTO://$DOMENA/nie-ma-takiej-strony/")
[ "$K404" = 404 ] && ok "strona błędu 404 działa"

# --- 6. klucz do automatycznych aktualizacji ---
info "6/6 Automatyczne aktualizacje (GitHub Actions)"
if [ "$KLUCZ" = tak ] && ! command -v ssh-keygen >/dev/null 2>&1; then
  uwaga "brak ssh-keygen — utwórz klucz na swoim komputerze (docs/WDROZENIE.md, krok 2)"
elif [ "$KLUCZ" = tak ]; then
  umask 077
  mkdir -p "$HOME/.ssh"
  TMPK="$HOME/.ssh/gotowosc-deploy-$$"
  ssh-keygen -q -t ed25519 -N "" -C "gotowosc-brodnica github-actions" -f "$TMPK"
  printf 'no-agent-forwarding,no-port-forwarding,no-pty,no-X11-forwarding %s\n' "$(cat "$TMPK.pub")" >> "$HOME/.ssh/authorized_keys"
  chmod 600 "$HOME/.ssh/authorized_keys"
  echo
  echo "---- CT8_SSH_KEY (skopiuj CAŁOŚĆ razem z liniami BEGIN/END do sekretu w GitHubie) ----"
  cat "$TMPK"
  echo "---- koniec klucza ----"
  rm -f "$TMPK" "$TMPK.pub"
  ok "klucz publiczny dopisany do ~/.ssh/authorized_keys, prywatny usunięty z serwera"
else
  echo "    (pominięto — aby utworzyć klucz: sh instaluj.sh $DOMENA --klucz)"
fi
HOSTKEY=$(cut -d' ' -f1-2 /etc/ssh/ssh_host_ed25519_key.pub 2>/dev/null || true)
if [ -n "$HOSTKEY" ]; then KNOWN="$SERWER $HOSTKEY"; else KNOWN="(zostaw puste)"; fi

cat <<EOF

=====================================================================
 Gotowe: $PROTO://$DOMENA/
=====================================================================
 Ustawienia w GitHubie (Settings → Secrets and variables → Actions):

   Secret    CT8_HOST         $SERWER
   Secret    CT8_USER         $LOGIN
   Secret    CT8_PATH         domains/$DOMENA/public_html
   Secret    CT8_SSH_KEY      (klucz z kroku 6, opcja --klucz)
   Secret    CT8_KNOWN_HOSTS  $KNOWN
   Variable  SITE_URL         https://$DOMENA

 Pamiętaj: CT8 usuwa konto po 90 dniach bez logowania do panelu
 lub przez SSH. Zaloguj się na panel.ct8.pl co najmniej raz na 2 miesiące.
EOF
