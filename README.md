# TuS Oppenau / HSG Renchtal – App-Update Spielplan & Google Maps

## Inhalt
- `index.html` – App-Oberfläche mit getrennten Spielplanfiltern
- `app.js` – Navigation und Darstellung der Spieltermine
- `spielplan.js` – aus den hochgeladenen BWHV-CSV-Spielplanexporten übernommene Termine
- `manifest.webmanifest` – App-Manifest
- `tus-hintergrund.jpg` – Vereins-Hintergrundbild
- `tus-oppenau-logo.png` – ausschließlich das TuS-Oppenau-Wappen für den roten Vereinsbereich
- `hsg-renchtal-logo.png` – das von dir gelieferte kombinierte Logo, ausschließlich für den grünen HSG-Renchtal-Bereich

## Neue Funktionen
- Deutlich getrennte Vereinsidentitäten: TuS Oppenau in Rot/Weiß, HSG Renchtal in Rot/Grün
- TuS-Oppenau-Wappen separat im Kopfbereich und bei den Herren
- HSG-Renchtal-Logo nur im Jugendbereich, bei HSG-Trainingszeiten und HSG-Spielplänen
- farblich getrennte Spielkarten: TuS rot, HSG grün
- Startseite im stärkeren TuS-Auftritt mit Rot-Weiß-Schwarz, markanter Vereinskopfzeile und Vereinsakzenten
- prominenter Bereich „Nächste Spiele“ mit den drei zeitlich nächsten Begegnungen aus dem Spielplan inklusive Gegner, Uhrzeit, Heim/Auswärts, Halle und Google-Maps-Route
- Spieltage getrennt nach TuS Oppenau und HSG Renchtal
- Filter nach Herren 1, Herren 2, A-, C-, D1-, D2-, D3-, E1-, E2- und E3-Jugend
- zusätzlicher Bereich für den D-Jugend-Sichtungsspielplan
- Datum, Anwurfzeit, Heim-/Auswärtsteam und Hallenadresse
- `Google Maps · Route` öffnet die Navigation zum konkreten Hallenstandort
- pro Mannschaft direkter Link zur passenden BWHV-Seite (soweit eine Mannschafts-ID vorliegt)
- bisherige Trainingszeiten, einschließlich Herren 1 und Herren 2, bleiben enthalten
- offizielle BWHV-Tabelleneinbindung bleibt erhalten

## Datenstand und wichtige Hinweise
Die Spieltermine wurden aus den CSV-Dateien übernommen, die im Chat bereitgestellt wurden. Enthalten sind 133 Spiel-/Turniereinträge vom 19.09.2026 bis 25.04.2027. Die Exportdateien enthalten Spieltermine und Hallenadressen, aber keine verlässlichen Endergebnisse; daher werden keine Spielstände erfunden oder angezeigt.

Die Spieltermine in `spielplan.js` sind ein Datenstand des hochgeladenen Exports und aktualisieren sich nicht selbstständig. Bei Spielverlegungen bitte den BWHV-Link der jeweiligen Mannschaft öffnen. Die Google-Maps-Links verwenden die im Export hinterlegte Hallenadresse.

## Installation auf GitHub Pages
1. ZIP-Datei entpacken.
2. Alle sechs Dateien aus dem Ordner in das Hauptverzeichnis des GitHub-Repositories `TuS-Oppenau-Handball-App` hochladen.
3. Vorhandene Dateien überschreiben.
4. Kurz warten und die App neu laden. Falls noch die alte Version erscheint, Browser/App vollständig schließen und erneut öffnen.

Wichtig: `tus-hintergrund.jpg` muss zusammen mit `index.html` im Hauptverzeichnis liegen. `spielplan.js` darf nicht fehlen.
