# React Native – Field Notes

Podstawowa aplikacja mobilna stworzona w **React Native (Expo)**.  
Aplikacja pozwala dodawać notatki ze zdjęciem lub plikiem, przeglądać je, edytować oraz wysyłać dane do API.
Projekt powstał w ramach zadania „Field Notes”.

---

## Funkcje aplikacji

### Widoki (3)
1. **Lista Notatek** – `app/(tabs)/index.tsx`  
   Wyświetla wszystkie dodane notatki (tytuł, data, zdjęcie/ikonka pliku).
2. **Dodaj** – `app/(tabs)/upload.tsx`  
   Formularz: tytuł, opis + wybór zdjęcia albo pliku z urządzenia. Po dodaniu wykonuje też request do API.
3. **Edycja / Szczegóły** – `app/(tabs)/files.tsx`  
   Można zobaczyć szczegóły notatki, edytować dane oraz usunąć wpis.

---

## Funkcja natywna

Aplikacja korzysta z:
1. **wyboru zdjęcia** z galerii (expo-image-picker) 
2. **wyboru pliku** (expo-document-picker)  
Wybrałam to, bo pasuje do tematu „Field Notes” — można dodać zdjęcie albo dokument do wpisu.
---

## Integracja z API

Aplikacja wysyła dane metodą **POST** do:
https://jsonplaceholder.typicode.com/posts

Po dodaniu notatki dane są wysyłane do API.

---

## Stan aplikacji

Stan przechowywany lokalnie w prostym store (components/Note.tsx):
- dodanie notatki,  
- usunięcie,  
- edycja.


---

## Dostępność
Zastosowane elementy:  
- `accessibilityRole`, `accessibilityLabel`   
- rozmiary przycisków ~48px  
- walidacja danych (Alert)

---

## Edge Cases

- brak internetu - komunikat + pominięcie requestu  
- brak tytułu - blokada zapisu + komunikat  
- możliwość anulowania edycji

---

## Struktura projektu
1. Struktura:
   ```bash
   app/  
      ├─ _layout.tsx  
      └─ (tabs)/
         ├─ _layout.tsx  
         ├─ index.tsx      # lista notatek  
         ├─ upload.tsx     # dodawanie, API, offline  
         └─ files.tsx      # edycja / podgląd / usuwanie  
   components/  
   └─ Note.tsx           # prosty store eventowy

---

## Jak uruchomić

1. Zainstaluj zależności:
   ```bash
   npm install
2. Uruchom Expo:
   ```bash
   npx expo start


Zeskanuj kod QR w aplikacji Expo Go (Android/iOS) lub użyj emulatora.

## Jak przetestować

Dodawanie notatki: zakładka Upload - wpisz dane - wybierz zdjęcie lub plik - zapisz

Szczegóły: zakładka Files - kliknij „Details”

Edycja: zakładka Files - „Edit” - zapisz

Usuwanie: zakładka Files - „Delete”

Offline: wyłącz internet(jeśli jest używane Expo Go najlepiej włączyć tryb samolotowy, samo wyłączenie Wi-Fi może nie wystarczyć) i spróbuj dodać notatkę - pokaże się komunikat

## Definition of Done
- [x] 3–4 kompletne widoki zgodne z opisem.
- [x] Użyta co najmniej **1 natywna funkcja**.
- [x] Integracja z **API** (co najmniej 1 żądanie).
- [x] Czytelny UI + podstawowa dostępność.
- [x] Aktualizacja `README.md` z opisem funkcji i sposobem testowania.
- [x] Min. 3 logiczne commity.
