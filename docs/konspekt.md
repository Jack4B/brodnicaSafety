# Konspekt: Strona informacyjno-edukacyjna dla mieszkańców Brodnicy  
**Nazwa robocza:** Brodnica Alert / Gotowość Brodnica

## 1. Cel

Nowoczesna, lekka strona informacyjno-edukacyjna dla mieszkańców Brodnicy i okolic.  
Zawiera praktyczne informacje o przygotowaniu na sytuacje kryzysowe (stany podwyższone, zagrożenia z powietrza, przerwy w dostawach mediów, ewakuacja itp.).

**Główne założenia:**
- Mobile first
- Maksymalnie lekka (szybka na słabym internecie)
- Możliwość pobrania całej strony / poradnika offline
- Intuicyjny UX
- Nowoczesny, czysty UI
- Minimalne użycie AI w interfejsie (anti-sloop)
- Hosting na początek: CT8

## 2. Główne sekcje

### Dashboard (strona główna)
- Aktualny poziom gotowości / status (ręcznie aktualizowany)
- Szybkie linki do najważniejszych rzeczy
- Ostatnie komunikaty
- Przycisk „Pobierz poradnik offline”

### Zagrożenia i komunikaty
- Stany podwyższone / alarmy
- Możliwe zagrożenia z powietrza (rakiety, drony) – ogólne informacje + jak reagować
- Źródła oficjalnych komunikatów (RCB, wojewoda, gmina)
- Jak śledzić komunikaty

### Schronienia
- Lista / mapa miejsc schronień w Brodnicy i okolicach
- Jak się zachować w schronie
- Co zabrać ze sobą

### Plecak ewakuacyjny
- Lista rzeczy (checklista)
- Wersje: podstawowa / rozszerzona
- Dla rodziny / dla osoby samotnej

### Pierwsza pomoc i apteczka
- Podstawowe procedury (resuscytacja, krwotoki, oparzenia itp.)
- Zawartość apteczki domowej i ewakuacyjnej
- Kiedy wzywać pomoc

### Łączność awaryjna
- One (sieć komórkowa)
- Krótkofalówki (PMR, CB)
- Częstotliwości awaryjne
- Aplikacje i sposoby offline

### Media i infrastruktura
- Prąd elektryczny (awarie, agregaty, powerbanki)
- Paliwa (magazynowanie, oszczędzanie)
- Ciepło (ogrzewanie awaryjne, izolacja)
- Woda
- Naprawy sprzętowe (podstawowe)

### Edukacja
- Artykuły / poradniki
- Checklistsy
- Materiały do pobrania (PDF)

### Offline
- Przycisk „Pobierz całą stronę / poradnik”
- Service Worker (PWA)
- Statyczne pliki gotowe do zapisania

## 3. Wymagania techniczne

- Mobile first
- Lekka (minimalny JS, szybkie ładowanie)
- PWA / możliwość offline
- Responsywna
- Dostępna (kontrast, semantyka)
- Hosting CT8 (statyczna strona lub lekki backend)
- Możliwość ręcznej aktualizacji treści (prosty CMS lub pliki JSON/Markdown)

## 4. Stack (propozycja)

- **Frontend:** Next.js (static export) lub czysty HTML + Tailwind + lekki JS
- **Styling:** Tailwind CSS
- **Offline:** Service Worker + PWA
- **Dane:** Pliki Markdown / JSON (łatwe do edycji)
- **Hosting:** CT8 (statyczne pliki)
- **Mapa:** Lekka (np. Leaflet lub statyczna)

## 5. Etapy realizacji

1. Koncepcja i struktura treści
2. Makiety (mobile + desktop)
3. Akceptacja makiet
4. Design system
5. Implementacja (mobile first)
6. Testy (responsywność, dostępność, offline)
7. Wdrożenie na CT8
8. Dokumentacja aktualizacji treści

## 6. Zasady UX/UI

- Maksymalna intuicyjność
- Duże, czytelne elementy
- Szybki dostęp do najważniejszych informacji
- Minimalne animacje
- Czysty, nowoczesny wygląd
- Anti-sloop (bez zbędnych chatbotów i generowania treści na żywo)

## 7. Disclaimer

Strona ma charakter informacyjno-edukacyjny. Nie zastępuje oficjalnych komunikatów służb i władz. W sytuacji zagrożenia należy kierować się komunikatami oficjalnymi.
