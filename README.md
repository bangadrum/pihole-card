# ha-cards

Custom Lovelace cards for [Home Assistant](https://www.home-assistant.io/). Lightweight, dependency-free, and YAML-configured.

---

## Cards

### [scene-grid-card](https://github.com/bangadrum/ha-cards/blob/main/scene-grid-card)

[![version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](scene-grid-card/scene-grid-card.js) [![HA](https://img.shields.io/badge/HA-2024.1%2B-informational?style=flat-square)](https://www.home-assistant.io/)

A dense, tap-friendly grid for activating scenes. Fits far more scenes into a card than a standard entities card, with per-tile colour accents and an activation flash animation.

[![scene-grid-card preview](https://raw.githubusercontent.com/bangadrum/ha-cards/main/scene-grid-card/preview.png)](https://raw.githubusercontent.com/bangadrum/ha-cards/main/scene-grid-card/preview.png)

**Quick start:**

```yaml
type: custom:scene-grid-card
title: Scenes
columns: 3
scenes:
  - entity: scene.morning_routine
    name: Morning
    icon: mdi:weather-sunrise
    color: "#f59e0b"
  - entity: scene.movie_night
    name: Movie
    icon: mdi:movie-open
    color: "#6366f1"
  - entity: scene.bedtime
    name: Bedtime
    icon: mdi:weather-night
    color: "#8b5cf6"
```

→ [Full documentation](https://github.com/bangadrum/ha-cards/blob/main/scene-grid-card/README.md)

---

### [pihole-card](https://github.com/bangadrum/ha-cards/blob/main/pihole-card)

[![version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](pihole-card/pihole-card.js) [![HA](https://img.shields.io/badge/HA-2023.1%2B-informational?style=flat-square)](https://www.home-assistant.io/)

A compact, information-dense stats card for [Pi-hole](https://pi-hole.net/). Shows ads blocked, block rate, DNS query breakdown, blocklist size, and client counts — all in a single small card.

[![pihole-card preview](https://raw.githubusercontent.com/bangadrum/ha-cards/main/pihole-card/preview.png)](https://raw.githubusercontent.com/bangadrum/ha-cards/main/pihole-card/preview.png)

**Quick start:**

```yaml
type: custom:pihole-card
```

All values are read automatically from the standard Pi-hole integration entities. No extra config needed for a single Pi-hole instance.

→ [Full documentation](https://github.com/bangadrum/ha-cards/blob/main/pihole-card/README.md)

---

### [switch-port-card-pro-mono](https://github.com/bangadrum/ha-cards/blob/main/switch-port-card-pro-mono)

[![version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](switch-port-card-pro-mono/switch-port-card-pro-mono.js) [![HA](https://img.shields.io/badge/HA-2024.1%2B-informational?style=flat-square)](https://www.home-assistant.io/)

A restyled Lovelace card for SNMP-managed network switches, built on top of the [switch_port_card_pro](https://github.com/partach/switch_port_card_pro) integration. Displays live per-port status and traffic, bandwidth utilisation, and system info (CPU, memory, uptime, firmware, PoE draw) in a consistent dark UI.

**Requires:** [switch_port_card_pro integration](https://github.com/partach/switch_port_card_pro) — install it via HACS before adding this card.

**Quick start:**

```yaml
type: custom:switch-port-card-pro-mono
name: Network Switch
device: sensor.switch_192_168_1_1
total_ports: 24
sfp_start_port: 25
color_scheme: speed
```

Key features beyond the base card:

- Monospace port rows — traffic values update without causing layout shift
- `exclude_ports` — hide internal or virtual ports you don't want to see
- `port_labels` — replace port numbers with short labels (e.g. `6: LAN`, `7: WAN`)
- Restyled to share a consistent design language with the other cards in this repo

→ [Full documentation](https://github.com/bangadrum/ha-cards/blob/main/switch-port-card-pro-mono/README.md)

---

## Installation

### Manual

1. Download the `.js` file from the card's folder
2. Copy it to `/config/www/` on your HA instance
3. Go to **Settings → Dashboards → ⋮ → Resources** and add:

   | Field | Value |
   |-------|-------|
   | URL   | `/local/<filename>.js` |
   | Type  | JavaScript module |

4. Hard-reload your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)

### HACS

1. In HACS go to **Frontend → ⋮ → Custom repositories**
2. Add `https://github.com/bangadrum/ha-cards` with category **Lovelace**
3. Install the card(s) you want and reload

---

## Compatibility

| Card | Min HA version | Dependencies |
|------|---------------|--------------|
| scene-grid-card | 2024.1 | None |
| pihole-card | 2023.1 | [Pi-hole integration](https://www.home-assistant.io/integrations/pi_hole/) |
| switch-port-card-pro-mono | 2024.1 | [switch_port_card_pro integration](https://github.com/partach/switch_port_card_pro) |

All cards use vanilla Custom Elements v1 — no Lit, Polymer, or any other framework required.

---

## Contributing

Bug reports and pull requests are welcome. Please open an issue first before submitting significant changes.

---

## Licence

MIT © 2024 bangadrum
