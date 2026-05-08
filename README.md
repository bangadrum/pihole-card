# ha-cards

A collection of custom Lovelace cards for [Home Assistant](https://www.home-assistant.io/).

All cards share a common dark design language with consistent theming, making them look great side-by-side on your dashboards.

![GitHub Repo stars](https://img.shields.io/github/stars/bangadrum/ha-cards?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/bangadrum/ha-cards)

## 🃏 Available Cards

### [NUT UPS Card](./nut-ups-card)
Monitor UPS devices via the [Network UPS Tools](https://www.home-assistant.io/integrations/nut/) integration.

**Features:**
- Battery charge percentage
- Runtime remaining
- Load percentage
- Voltage readings
- Temperature monitoring
- Calculated efficiency metrics
- Tap-to-history on all sensor values

### [Pi-hole Card](./pihole-card)
DNS-level ad blocking statistics from the [Pi-hole](https://www.home-assistant.io/integrations/pi_hole/) integration.

**Features:**
- Ads blocked counter
- Block rate percentage
- DNS query counts
- Cache statistics
- Unique domains tracked
- Client count display
- Compact two-column layout

### [Scene Grid Card](./scene-grid-card)
Organize and trigger scenes from your Home Assistant dashboard in a grid layout.

**Features:**
- Visual scene representation
- Quick scene activation
- Customizable grid layout
- Icon and color support

### [SMART Sniffer Card](./smart-sniffer-card)
Drive health dashboard for the [SMART Sniffer](https://github.com/DAB-LABS/smart-sniffer) integration.

**Features:**
- Color-coded drive health indicators
- Attention and health badges
- Click-through detail panel
- Full SMART diagnostics display
- Hover tooltips for quick info

### [Switch Port Card Pro Mono](./switch-port-card-pro-mono)
Professional monochrome-style switch port information display.

**Features:**
- Port status overview
- Traffic monitoring
- Compact monochrome design
- Easy port identification

## 🎨 Design System

All cards use a consistent token set for visual harmony across your dashboards:

| Token | Default (Dark) | Home Assistant Variable |
|-------|---------------|------------------------|
| --c-bg | #0d1117 | var(--card-background-color) |
| --c-surface | #161b22 | var(--secondary-background-color) |
| --c-border | rgba(255,255,255,0.09) | — |
| --c-text | #e6edf3 | var(--primary-text-color) |
| --c-muted | #8b949e | var(--secondary-text-color) |
| --c-ok | #3fb950 | — |
| --c-warn | #d29922 | — |
| --c-crit | #f85149 | — |
| --c-info | #58a6ff | — |

Tokens with HA variable fallbacks automatically adapt to light themes and custom themes.


## 📦 Installation
Manual Installation

1. Copy each card's `.js` file to your Home Assistant config directory:
   `<config>/www/ha-cards/<card-name>.js`

2. In Home Assistant go to **Settings → Dashboards → Resources** and add:

```
URL:  /local/name-of-card.js
Type: JavaScript module
```

3. Hard-refresh your browser.


## 📝 Configuration

Each card has its own configuration options. See the individual card's README.md file for detailed configuration examples:

- [NUT UPS Card Configuration](./nut-ups-card/README.md)
- [Pi-hole Card Configuration](./pihole-card/README.md)
- [Scene Grid Card Configuration](./scene-grid-card/README.md)
- [SMART Sniffer Card Configuration](./smart-sniffer-card/README.md)
- [Switch Port Card Pro Mono Configuration](./switch-port-card-pro-mono/README.md)

## 🌟 Common Features

All cards share these features:

- **Tap-to-History**: Tap any sensor value to view its history panel
- **Consistent Theming**: Unified `--c-*` CSS variable theming
- **Surface Headers**: Colored icon squares with clean headers
- **Stats Strips**: 4-column stats layout with 2px accent bars
- **Responsive Design**: Adapts to different screen sizes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Home Assistant](https://www.home-assistant.io/)
- [Lovelace Dashboard](https://www.home-assistant.io/dashboards/)
- [HACS](https://hacs.xyz/)

---

*Made with ❤️ for the Home Assistant community*
