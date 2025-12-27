# Pokédex

Ein interaktives Pokédex-Verzeichnis mit Live-Daten von der kostenlosen PokéAPI.

## Features

**Pokemon-Suche** – Suche nach Namen oder ID  
**Detaillierte Informationen** – Typ, Größe, Gewicht, Stats und mehr  
**Dynamische Typen-Farben** – Farbcodierung nach Pokémon-Typ  
**Favoriten-System** – Speichere deine Lieblings-Pokémon  
**Responsive Grid** – Optimiert für alle Bildschirmgrößen  

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **API:** [PokéAPI](https://pokeapi.co/) (kostenlos, keine Auth nötig)
- **Storage:** LocalStorage (für Favoriten)
- **Tools:** Git

## Live Demo

[Pokédex Live Demo](http://pokedex.vitali-banmann.de/)

## Projektstruktur

```
pokedex/
├── index.html          # Hauptseite
├── script.js           # App-Logik & API-Integration
├── styles.css          # Styling & Typ-Farben
├── assets/             # Icons & Grafiken
└── data/               # Lokale Daten (optional)
```

## API Integration

Die App nutzt die öffentliche **PokéAPI** ohne Authentifizierung:

```javascript
// Beispiel: Pokemon-Daten abrufen
fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then(response => response.json())
  .then(data => displayPokemon(data));
```

**API Endpoints:**
- `/pokemon/{id}` – Einzelnes Pokémon
- `/pokemon?limit=20&offset=0` – Pokémon-Liste (mit Paginierung)
- `/type/{type}` – Pokémon nach Typ filtern

## Features im Detail

### Suche
- **Nach Name:** Case-insensitive Suche
- **Nach ID:** Numerische Suche (1-1025+)

### Pokémon-Detailseite
- **Basis-Stats** – HP, Angriff, Verteidigung, etc.
- **Fähigkeiten** – Normale & versteckte Fähigkeiten
- **Glänzend-Varianten** – Shiny-Artwork verfügbar

## Autor

[Vitali Banmann](https://github.com/VitaliBanmann)

## Lizenz

MIT
