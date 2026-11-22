# API.md – Źródła danych dla Brodnica Alert

Dokumentacja potencjalnych źródeł danych do pobierania stanów gotowości, alertów, map schronień i zagrożeń z powietrza.  
**Uwaga:** Większość oficjalnych systemów w Polsce nie udostępnia publicznego, stabilnego API do alertów RCB. Dane schronień są publiczne (dane.gov.pl).

## 1. Punkty schronienia (oficjalne)

### dane.gov.pl – Punkty schronienia w Polsce
- **Źródło:** Komenda Główna Państwowej Straży Pożarnej
- **Link:** https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce
- **Format:** CSV / JSON (otwarte dane)
- **Zawartość:** ~82 000 punktów (schrony, ukrycia, miejsca doraźnego schronienia)
- **Licencja:** CC BY 4.0
- **Uwagi:** Najlepsze źródło do lokalnej kopii. Można pobrać i hostować samodzielnie (offline).
- **Projekty wykorzystujące:**
  - https://github.com/KGPSP/gdziesieukryc.pl
  - https://gdziesaschrony.pl
  - https://gdzie-schron.pl

### Geoportal.gov.pl
- Usługa „Schrony” w module Zarządzanie kryzysowe
- Opiera się na tych samych danych z dane.gov.pl

## 2. Alerty i komunikaty (RCB / RSO)

### Alert RCB
- Oficjalny system SMS (Rządowe Centrum Bezpieczeństwa)
- **Brak publicznego API** do pobierania alertów w czasie rzeczywistym
- Historia alertów dostępna na stronie RCB
- W planach: Cell Broadcast (przyszłość)

### Regionalny System Ostrzegania (RSO)
- Publiczny feed JSON (używany przez integracje)
- Przykład integracji: https://github.com/MatissowyMati/alert-rcb-hass
- Endpointy publiczne (TVP / RSO) – do weryfikacji aktualności

## 3. Mapy zagrożeń z powietrza (drony, rakiety)

### Zorya
- **Strona:** https://zorya.website
- **GitHub:** https://github.com/mhalaba/zorya
- Zbiera publiczne źródła: NEPTUN (OSINT), alarmy UA, ADS-B, RSO/RCB, media
- Ocenia poziom zagrożenia dla województw
- **Nieoficjalne** – nie zastępuje oficjalnych alertów

### Strażnik
- **Strona:** https://straznik.eu
- Łączy NEPTUN, RCB/RSO, ADS-B, PAŻP, media
- Open source
- **Nieoficjalne**

### NEPTUN (Ukraina)
- https://neptun.in.ua
- OSINT tracking zagrożeń powietrznych nad Ukrainą
- Używany przez Zorya i Strażnik

### Tryvoha.online (Ukraina)
- Publiczne API alertów powietrznych: https://tryvoha.online/api
- Endpointy: `/api/v1/alerts`, `/api/v1/regions` itp.
- Przydatne jako kontekst (zagrożenia nad Ukrainą)

## 4. Inne przydatne źródła

| Źródło | Typ | Uwagi |
|--------|-----|-------|
| IMGW | Pogoda / ostrzeżenia | Oficjalne API pogodowe |
| dane.gov.pl | Otwarte dane | Schronienia + inne zbiory |
| OpenStreetMap | Mapy | Do warstw mapowych |
| ADS-B (adsb.lol itp.) | Ruch lotniczy | Publiczne, do kontekstu |

## 5. Rekomendacje dla projektu Brodnica

1. **Schronienia** – pobierz zbiór z dane.gov.pl i hostuj lokalnie (offline + szybkość).
2. **Alerty RCB/RSO** – użyj publicznego feedu RSO (jeśli stabilny) + ręczna aktualizacja statusu na Dashboardzie.
3. **Zagrożenia z powietrza** – linkuj / osadzaj Zorya lub Strażnik (z wyraźnym oznaczeniem „nieoficjalne”).
4. **Offline** – wszystkie kluczowe dane (schronienia, checklisty, poradniki) muszą działać bez internetu.
5. **Disclaimer** – zawsze informuj, że oficjalne komunikaty (RCB, syreny, służby) mają priorytet.

## 6. Status API (stan na listopad 2026)

| Źródło | Publiczne API | Stabilność | Zalecenie |
|--------|---------------|------------|---------|
| dane.gov.pl (schronienia) | Tak (plik) | Wysoka | Użyj |
| Alert RCB | Nie | — | Ręcznie / SMS |
| RSO feed | Częściowo | Średnia | Sprawdź aktualność |
| Zorya / Strażnik | Nieoficjalne | Średnia | Link + disclaimer |
| Tryvoha / NEPTUN | Tak (UA) | Średnia | Kontekst |

---
*Dokument pomocniczy dla projektu Brodnica Alert.  
Ostatnia aktualizacja: 22 listopada 2026.*
