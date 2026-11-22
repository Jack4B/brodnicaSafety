#!/usr/bin/env bash
# Buduje paczkę instalacyjną na CT8: paczka/gotowosc-brodnica-ct8-RRRRMMDD-GGMM.tar.gz
# Adres strony nie jest znany przy budowie — w plikach jest znacznik, który instaluj.sh
# zamienia na właściwą domenę.
set -euo pipefail
cd "$(dirname "$0")/.."
ZNACZNIK='https://adres-strony.invalid'

SITE_URL="$ZNACZNIK" BASE_PATH=/ npm test >/dev/null
NAZWA="gotowosc-brodnica-ct8-$(date +%Y%m%d-%H%M)"
rm -rf paczka/gotowosc-brodnica-ct8-*
mkdir -p "paczka/$NAZWA"
cp -R dist "paczka/$NAZWA/public_html"
cp deploy/ct8/instaluj.sh deploy/ct8/htaccess-minimalny deploy/ct8/CZYTAJ.txt "paczka/$NAZWA/"
chmod 755 "paczka/$NAZWA/instaluj.sh"
( cd "paczka/$NAZWA" && find public_html instaluj.sh htaccess-minimalny -type f -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS )
tar -C paczka -czf "paczka/$NAZWA.tar.gz" "$NAZWA"
echo "paczka/$NAZWA.tar.gz ($(du -h "paczka/$NAZWA.tar.gz" | cut -f1), $(find "paczka/$NAZWA/public_html" -type f | wc -l) plików strony)"
