# smart-sniffer-card

A Home Assistant Lovelace card for monitoring drive health via the [SMART Sniffer](https://github.com/DAB-LABS/smart-sniffer) integration.

![GitHub last commit](https://img.shields.io/github/last-commit/bangadrum/ha-cards/smart-sniffer-card)

## 📋 Overview

The SMART Sniffer Card provides a visual dashboard for monitoring the health status of drives connected to your system. It displays color-coded drive indicators with attention and health badges, along with detailed SMART diagnostics on click-through.

## ✨ Features

- **Color-coded drive chips**: Visual health indicators at a glance
- **Attention badges**: Highlights drives requiring attention
- **Health status badges**: Quick health assessment per drive
- **Click-through detail panel**: Access full SMART diagnostics
- **Hover tooltips**: Quick information without opening panels
- **Tap-to-history**: Tap any sensor value to view its history

## 🎨 Design

This card follows the ha-cards design system with consistent theming:

- Surface header with colored icon square
- 4-column stats strip with 2px accent bars
- Dark theme optimized for Home Assistant dashboards
- Adapts to light themes and custom themes via CSS variables

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
