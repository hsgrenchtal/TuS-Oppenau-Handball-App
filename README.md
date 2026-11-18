# TuS Oppenau / HSG Renchtal – Aktuelles, Benachrichtigungen & Organigramm

## Neu in dieser Version
- Bereich „Aktuelles & Ankündigungen“ mit Einträgen aus `aktuelles.json`.
- Opt-in für Browser-Benachrichtigungen.
- Neue Ankündigungen werden während geöffneter App erkannt (Prüfung ca. jede Minute).
- Organigramm mit veröffentlichten Ansprechpartnern der TuS-Handballabteilung.
- HSG Renchtal mit den in der bisherigen Vereinskommunikation genannten Ansprechpartnern Marius Huber und Thomas Hirt.
- Die bisherigen Mannschaften, Trainingszeiten, Spielpläne, Google-Maps-Funktionen, Sponsoren und Logos bleiben enthalten.

## Neue Ankündigung veröffentlichen
Die GitHub-Pages-App ist eine statische Website. Neue Mitteilungen werden über `aktuelles.json` gepflegt:
1. `aktuelles.json` im GitHub-Repository öffnen.
2. Ein Objekt in das Array `announcements` einfügen.
3. Speichern / Committen. Nach Veröffentlichung erscheint der Beitrag in der App.

Beispiel:
```json
{
  "id": "2026-11-18-hallensperrung",
  "date": "2026-11-18",
  "club": "TuS Oppenau",
  "category": "WICHTIG",
  "title": "Training fällt aus",
  "text": "Das Training am Freitag entfällt wegen einer Hallensperrung.",
  "url": "",
  "active": true
}
```
Erlaubte `club`-Werte: `TuS Oppenau` oder `HSG Renchtal`. `active:false` blendet einen Beitrag aus.

## Wichtiger Hinweis zu Benachrichtigungen
Diese Version kann Browser-Benachrichtigungen nach ausdrücklicher Freigabe auslösen, wenn die App geöffnet ist und neue Einträge im Feed entdeckt werden. Eine echte Push-Nachricht, die auch bei vollständig geschlossener App zugestellt wird, ist mit GitHub Pages allein nicht möglich. Dafür braucht es zusätzlich einen Push-Server / Push-Dienst und eine serverseitige Verwaltung der Geräte-Abonnements. Diese Funktion wird hier nicht vorgetäuscht.

Auf iPhones ist die Unterstützung von Web-Benachrichtigungen abhängig von iOS-Version und davon, ob die Website als Web-App zum Home-Bildschirm hinzugefügt wurde.

## Ansprechpartner / Organigramm
Die TuS-Funktionen und Kontaktdaten wurden von der offiziellen Handball-Website übernommen:
- Vorstand / Kontakte: https://www.handballoppenau.de/Verein/Vorstand/
- Kontakte: https://www.handballoppenau.de/Verein/Kontakte/

Die HSG-Ansprechpartner Marius Huber und Thomas Hirt wurden als HSG-Leitung übernommen; weitere Zuständigkeiten und Kontaktdaten bitte durch den Verein ergänzen oder bestätigen.

## Installation
1. ZIP entpacken.
2. Alle Dateien im Ordner in das Hauptverzeichnis des GitHub-Repositories `TuS-Oppenau-Handball-App` hochladen.
3. Vorhandene Dateien überschreiben.
4. App neu laden.


## Aktualisierung Hintergrund und Vereinsfarben
Das Hintergrundbild wurde durch die bereitgestellte hochformatige TuS-Grafik ersetzt. Die starke schwarze Überblendung wurde reduziert, damit Rot, Weiß und das Vereinsmotiv sichtbar bleiben. TuS-Bereiche bleiben rot/weiß, HSG-Bereiche rot/grün. Der Organigramm-/Ansprechpartner-Bereich ist bis zur bestätigten offiziellen Vereinsstruktur nicht enthalten.


Logo-Update: Das TuS-Oppenau-Vereinswappen wurde durch das vom Verein bereitgestellte Bild ersetzt. Der äußere weiße Bildhintergrund wurde transparent gemacht; die weißen Flächen innerhalb des Wappens bleiben erhalten.


Trainingszeiten: Beim Antippen einer Mannschaft wird ausschließlich deren Trainingszeit bzw. werden alle Trainingszeiten dieser Mannschaft angezeigt. Über „Alle Trainingszeiten anzeigen“ kehrt man zur Gesamtübersicht zurück.
