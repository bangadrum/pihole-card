# NUT UPS Card

A Home Assistant custom Lovelace card for monitoring UPS devices via the [Network UPS Tools (NUT)](https://www.home-assistant.io/integrations/nut/) integration.

![NUT UPS Card preview](preview.png)

---

## Features

- **Status dot** — colour-coded online / on-battery / alarm indicator with animated ring glow
- **4-column stats strip** — battery charge, runtime, load, and input voltage, each with a 2 px accent bar
- **Battery bar** — visual fill gauge with green → amber → red colouring based on charge level
- **6-metric grid** — output voltage, battery voltage, load, battery temperature, ambient temperature, and calculated efficiency
- **Tap any value** — clicking a stat cell, battery bar, or metric fires the standard `hass-more-info` event, opening that sensor's history panel exactly as a built-in entity card does
- **HA theme aware** — all colours resolve through `var(--card-background-color)`, `var(--primary-text-color)`, etc., so the card adapts to light and dark themes automatically

---

## Installation

1. Copy `nut-ups-card.js` to `<config>/www/nut-ups-card.js`.
2. Add it as a Lovelace resource:
   **Settings → Dashboards → Resources → Add Resource**
   | Field | Value |
   |---|---|
   | URL | `/local/nut-ups-card.js` |
   | Type | JavaScript module |
3. Reload the browser.

---

## Configuration

```yaml
type: custom:nut-ups-card
name: Server Room UPS                     # optional, default "UPS"
status_entity:          sensor.ups_status
battery_charge_entity:  sensor.ups_battery_charge
battery_runtime_entity: sensor.ups_battery_runtime
battery_voltage_entity: sensor.ups_battery_voltage
input_voltage_entity:   sensor.ups_input_voltage
output_voltage_entity:  sensor.ups_output_voltage
load_entity:            sensor.ups_load
battery_temp_entity:    sensor.ups_battery_temperature
ambient_temp_entity:    sensor.ups_ambient_temperature
```

All entity keys are optional. Any cell whose entity is not configured (or returns `unavailable` / `unknown`) renders a `—` placeholder. The Efficiency cell is computed from output ÷ input voltage and has no entity of its own.

### Entity name conventions

The NUT integration creates entities named after the UPS device. If your device is called `ups`, the default entity IDs are:

| Config key | Default entity ID |
|---|---|
| `status_entity` | `sensor.ups_status` |
| `battery_charge_entity` | `sensor.ups_battery_charge` |
| `battery_runtime_entity` | `sensor.ups_battery_runtime` |
| `battery_voltage_entity` | `sensor.ups_battery_voltage` |
| `input_voltage_entity` | `sensor.ups_input_voltage` |
| `output_voltage_entity` | `sensor.ups_output_voltage` |
| `load_entity` | `sensor.ups_load` |
| `battery_temp_entity` | `sensor.ups_battery_temperature` |
| `ambient_temp_entity` | `sensor.ups_ambient_temperature` |

If your device has a different name (e.g. `apc`), substitute it in each entity ID accordingly.

---

## Tap-to-history

Every clickable area carries a `data-entity` attribute. A single delegated `click` listener on the shadow root walks up the DOM tree to find the nearest entity, then dispatches:

```js
new CustomEvent('hass-more-info', {
  detail:   { entityId },
  bubbles:  true,
  composed: true,   // crosses the shadow DOM boundary
})
```

This is the same mechanism used by all built-in Lovelace cards.

**Clickable areas:**

| Area | Entity opened |
|---|---|
| Battery stat cell | `battery_charge_entity` |
| Runtime stat cell | `battery_runtime_entity` |
| Load stat cell | `load_entity` |
| Input V stat cell | `input_voltage_entity` |
| Battery bar + percentage | `battery_charge_entity` |
| Runtime value | `battery_runtime_entity` |
| Output V metric | `output_voltage_entity` |
| Batt V metric | `battery_voltage_entity` |
| Load metric | `load_entity` |
| Batt Temp metric | `battery_temp_entity` |
| Ambient metric | `ambient_temp_entity` |
| Status text in sub-title | `status_entity` |
| Entity ID in footer | `status_entity` |

Cells without a configured entity are not interactive.

---

## Colour thresholds

| Metric | Green | Amber | Red |
|---|---|---|---|
| Battery charge | ≥ 50 % | 25 – 49 % | < 25 % |
| Load | ≤ 60 % | 61 – 80 % | > 80 % |
| Status dot | On Line | On Battery | Alarm / Fault / Overload |

---

## Changelog

### v1.1.0
- Added tap-to-history: clicking any value opens the sensor's more-info / history panel.
- Status text in header sub-title is now a tappable dashed-underline link.
- Footer entity ID is now tappable.

### v1.0.0
- Initial release.
