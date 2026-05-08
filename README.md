# ha-cards

A collection of custom Lovelace cards for [Home Assistant](https://www.home-assistant.io/).

All cards share a common dark design language — `--c-*` CSS variable theming, a surface header with a coloured icon square, a 4-column stats strip with 2 px accent bars, and tap-to-history on every sensor value.

---

## Cards

### [NUT UPS Card](./nut-ups-card/)

Monitor UPS devices via the [Network UPS Tools](https://www.home-assistant.io/integrations/nut/) integration.

Shows battery charge, runtime, load, voltages, temperatures, and calculated efficiency. All values are tappable and open the sensor's history panel.

---

### [Pi-hole Card](./pihole-card/)

DNS-level ad blocking stats from the [Pi-hole](https://www.home-assistant.io/integrations/pi_hole/) integration.

Displays ads blocked, block rate, DNS query counts, cache stats, unique domains, and client counts in a compact two-column layout.

---

### [SMART Sniffer Card](./smart-sniffer-card/)

Drive health dashboard for the [SMART Sniffer](https://github.com/DAB-LABS/smart-sniffer) integration.

Colour-coded drive chips with attention and health badges, a click-through detail panel with full SMART diagnostics, and hover tooltips.

---

### [MythTV Card](./mythtv-card/)

Full MythTV backend dashboard — active recordings, LiveTV streams, upcoming schedule, recent library, and storage groups. Collapsible sections with conflict detection banners.

---

## Installation (all cards)

1. Copy the card's `.js` file to `<config>/www/`.
2. **Settings → Dashboards → Resources → Add Resource**
   - URL: `/local/<card-name>.js`
   - Type: **JavaScript module**
3. Reload the browser.
4. Add the card to a dashboard with `type: custom:<card-name>`.

See each card's `README.md` for full configuration options.

---

## Design system

All cards use the same token set so they sit consistently side-by-side:

| Token | Default (dark) | Source |
|---|---|---|
| `--c-bg` | `#0d1117` | `var(--card-background-color)` |
| `--c-surface` | `#161b22` | `var(--secondary-background-color)` |
| `--c-border` | `rgba(255,255,255,0.09)` | — |
| `--c-text` | `#e6edf3` | `var(--primary-text-color)` |
| `--c-muted` | `#8b949e` | `var(--secondary-text-color)` |
| `--c-ok` | `#3fb950` | — |
| `--c-warn` | `#d29922` | — |
| `--c-crit` | `#f85149` | — |
| `--c-info` | `#58a6ff` | — |

Tokens with HA variable fallbacks adapt automatically to light themes and custom themes.
