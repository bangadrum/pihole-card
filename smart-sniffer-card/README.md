# smart-sniffer-card

A Home Assistant Lovelace card for monitoring drive health using the SMART Sniffer integration. Displays drive health, attention indicators, and quick-access diagnostics in a compact dashboard layout.

---

## Dependency

This card requires the SMART Sniffer integration:

- https://github.com/DAB-LABS/smart-sniffer

[![Open SMART Sniffer Repository](https://img.shields.io/badge/GitHub-SMART%20Sniffer-181717?logo=github)](https://github.com/DAB-LABS/smart-sniffer)

Ensure the integration is installed and drive entities are available before adding the card.

---

## Installation

1. Copy `smart-sniffer-card.js` into your `config/www/` directory.
2. In Home Assistant go to **Settings → Dashboards → Resources** and add:

```text
URL:  /local/smart-sniffer-card.js
Type: JavaScript module
```

3. Hard-refresh your browser.

---

## Usage

Minimum configuration:

```yaml
type: custom:smart-sniffer-card
drives:
  - sensor.nvme_drive_health
```

Example configuration:

```yaml
type: custom:smart-sniffer-card
title: Storage Health

drives:
  - sensor.nvme_drive_1_health
  - sensor.nvme_drive_2_health
  - sensor.sata_drive_1_health
```

---

## Features

- Colour-coded drive health indicators
- Attention badges for failing or warning drives
- Click-through entity diagnostics
- Hover tooltips and quick status visibility
- Theme-aware styling
- Compact dashboard layout

---

## Configuration reference

| Key | Type | Description |
|-----|------|-------------|
| `type` | string | Must be `custom:smart-sniffer-card` |
| `title` | string | Optional card title |
| `drives` | list | SMART drive health entities |

---

## Notes

- Designed for SMART Sniffer entities and diagnostics.
- Clicking values opens standard Home Assistant entity history panels.
- The card automatically adapts to Home Assistant themes.
