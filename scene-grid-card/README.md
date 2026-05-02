# scene-grid-card

A dense, tap-friendly scene launcher card for [Home Assistant](https://www.home-assistant.io/) dashboards. Fits more scenes in less space than a standard entities card, with per-tile colour accents and a satisfying activation flash.

![scene-grid-card preview](https://via.placeholder.com/640x200/1c1c1e/f2f2f7?text=scene-grid-card)

---

## Features

- **Dense grid layout** — 3 columns by default, fully configurable
- **Per-tile colour accents** — icon, glow, and background tinted per scene
- **Activation feedback** — tap flash and glow animation on trigger
- **Debounced taps** — rapid double-taps won't fire the scene twice
- **Auto-naming** — falls back to `friendly_name` from HA state, then the entity ID
- **Optional header** — omit `title` to save vertical space
- **YAML-only config** — no GUI editor dependency

---

## Installation

### Manual

1. Copy `scene-grid-card.js` into your HA config's web directory:

   ```
   /config/www/scene-grid-card.js
   ```

2. In Home Assistant, go to **Settings → Dashboards → Resources** and add a new resource:

   | Field | Value |
   |-------|-------|
   | URL   | `/local/scene-grid-card.js` |
   | Type  | JavaScript module |

3. Hard-reload your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to pick up the new resource.

### HACS (manual repository)

1. In HACS, go to **Frontend → Custom repositories**
2. Add the repository URL and select category **Lovelace**
3. Install **Scene Grid Card** and reload

---

## Configuration

Add the card to any dashboard via the YAML editor:

```yaml
type: custom:scene-grid-card
title: Scenes        # optional — omit to hide the header
columns: 3           # tiles per row (default: 3)
scenes:
  - entity: scene.morning_routine
    name: Morning
    icon: mdi:weather-sunrise
    color: "#f59e0b"
  - entity: scene.movie_night
    name: Movie
    icon: mdi:movie-open
    color: "#6366f1"
  - entity: scene.dinner
    name: Dinner
    icon: mdi:silverware-fork-knife
    color: "#ec4899"
  - entity: scene.bedtime
    name: Bedtime
    icon: mdi:weather-night
    color: "#8b5cf6"
```

### Options

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `type` | string | ✅ | — | Must be `custom:scene-grid-card` |
| `scenes` | list | ✅ | — | List of scene objects (see below) |
| `title` | string | | *(none)* | Header text shown above the grid |
| `columns` | number | | `3` | Number of tiles per row |

### Scene object

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `entity` | string | ✅ | — | Scene entity ID, e.g. `scene.movie_night` |
| `name` | string | | HA `friendly_name` | Label shown below the icon |
| `icon` | string | | `mdi:palette` | Any `mdi:` icon name |
| `color` | string | | `#4f8ef7` | Hex colour for the tile accent |

---

## Examples

### 4-column layout without a header

```yaml
type: custom:scene-grid-card
columns: 4
scenes:
  - entity: scene.bright
    name: Bright
    icon: mdi:brightness-7
    color: "#fbbf24"
  - entity: scene.dim
    name: Dim
    icon: mdi:brightness-3
    color: "#6366f1"
  - entity: scene.reading
    name: Reading
    icon: mdi:book-open-variant
    color: "#0ea5e9"
  - entity: scene.off
    name: Off
    icon: mdi:power
    color: "#64748b"
```

### Minimal — no names, icons, or colours specified

```yaml
type: custom:scene-grid-card
scenes:
  - entity: scene.morning_routine
  - entity: scene.movie_night
  - entity: scene.bedtime
```

Names, icons, and colours will fall back to HA defaults.

---

## Comparison

| | Entities card | Scene Grid Card |
|---|---|---|
| Rows per scene | 1 full row (~48 px) | ~70 px per **row of 3** |
| Colour per scene | ✗ | ✅ |
| Activation feedback | ✗ | ✅ |
| Custom icons | ✅ | ✅ |
| Tap to activate | ✅ | ✅ |

---

## Browser & HA compatibility

Tested on Home Assistant 2024.x and above. Requires a browser with support for Custom Elements v1 (all modern browsers). Does not require Lit, Polymer, or any other framework.

---

## Contributing

Bug reports and pull requests are welcome. Please open an issue first for any significant changes.

---

## Licence

MIT © 2024
