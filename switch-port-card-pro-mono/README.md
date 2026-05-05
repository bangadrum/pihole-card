# switch-port-card-pro-mono

A restyled Home Assistant Lovelace card for the [switch_port_card_pro](https://github.com/partach/switch_port_card_pro) integration. Displays live port status, traffic, and system info for SNMP-managed network switches, with a dark UI built to match a consistent card design language across a dashboard.

---

## Dependency

This card requires the **Switch Port Card Pro** integration by [partach](https://github.com/partach/switch_port_card_pro), which handles all SNMP communication and creates the entities the card reads from.

Install the integration first via HACS:

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=partach&repository=switch_port_card_pro)

After installing and rebooting, add the integration under **Settings → Devices & Services → Add Integration → Switch Port Card Pro**. You will be prompted for your switch IP address and SNMP community string.

---

## Installation

1. Copy `switch-port-card-pro-mono.js` into your `config/www/` directory.
2. In Home Assistant go to **Settings → Dashboards → Resources** and add:

```
URL:  /local/switch-port-card-pro-mono.js
Type: JavaScript module
```

3. Hard-refresh your browser.

---

## Usage

Add the card to a dashboard via YAML or the visual editor. Minimum config:

```yaml
type: custom:switch-port-card-pro-mono
device: sensor.switch_192_168_1_1
```

Full example:

```yaml
type: custom:switch-port-card-pro-mono
name: Network Switch
device: sensor.switch_192_168_1_1
total_ports: 24
sfp_start_port: 25
color_scheme: heatmap
ports_per_row: 12
row2: rx_tx_live
row3: speed
show_total_bandwidth: true
max_bandwidth_gbps: 10
show_port_type_labels: true
exclude_ports: [1, 2]
port_labels:
  6: LAN
  7: WAN
system_boxes:
  cpu: true
  memory: true
  uptime: true
  hostname: true
  poe: true
  firmware: true
```

---

## Configuration reference

### Core

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `type` | string | — | Must be `custom:switch-port-card-pro-mono` |
| `name` | string | `Network Switch` | Title shown in the card header |
| `device` | string | — | Device entity from the integration, e.g. `sensor.switch_192_168_1_1` |
| `entity` | string | — | Fallback entity if device detection fails |

### Ports

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `total_ports` | number | `8` | Total number of ports to display |
| `sfp_start_port` | number | `9` | Port index at which SFP/fiber ports begin |
| `ports_per_row` | number | `8` | How many ports to show per row |
| `layout_mode` | string | `linear` | Port layout. Options: `linear`, `even_top`, `odd_top` |
| `port_size` | string | `medium` | Tile size. Options: `xsmall`, `small`, `medium`, `large`, `xlarge` |
| `exclude_ports` | list | `[]` | Port numbers to hide entirely, e.g. `[1, 2]` |
| `port_labels` | map | `{}` | Replace a port number with a custom label. See [Port labels](#port-labels) |
| `hide_unused_port` | boolean | `false` | Hide ports that have been inactive longer than `hide_unused_port_hours` |
| `hide_unused_port_hours` | number | `24` | Inactivity threshold in hours for `hide_unused_port` |

### Port rows

Each port tile can show up to three rows of information. `row2` and `row3` are configurable.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `row2` | string | `rx_tx_live` | Content of the second row |
| `row3` | string | `speed` | Content of the third row. Set to `none` to disable |

Row value options: `rx_tx_live`, `rx_tx_lifetime`, `speed`, `vlan`, `name`, `interface`, `custom`, `none`

### Colour scheme

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `color_scheme` | string | `speed` | How port tiles are coloured. Options: `speed`, `heatmap`, `vlan` |

**`speed`** — colour by negotiated link speed (green = 1G, blue = 10G, orange = 100M, etc.)

**`heatmap`** — colour by current traffic intensity relative to the busiest port (green → red)

**`vlan`** — colour by VLAN ID, each VLAN gets a distinct hue

### Bandwidth gauge

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `show_total_bandwidth` | boolean | `true` | Show the thin bandwidth bar below the header and the total in the header |
| `max_bandwidth_gbps` | number | `100` | Switch uplink capacity in Gbps, used to scale the gauge |

### System info boxes

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `system_boxes.cpu` | boolean | `true` | Show CPU usage |
| `system_boxes.memory` | boolean | `true` | Show memory usage |
| `system_boxes.uptime` | boolean | `true` | Show uptime |
| `system_boxes.hostname` | boolean | `true` | Show hostname / model |
| `system_boxes.poe` | boolean | `true` | Show total PoE draw |
| `system_boxes.firmware` | boolean | `true` | Show firmware version |
| `system_boxes.custom` | boolean | `true` | Show custom system OID value |

### Custom OID labels

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `custom_text` | string | `Custom Value` | Label for the custom system OID box |
| `custom_port_text` | string | `Custom Port Val.` | Label shown in the port tooltip for the custom per-port OID |

### Display

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `compact_mode` | boolean | `false` | Reduce padding and font sizes for smaller dashboards |
| `show_port_type_labels` | boolean | `true` | Show "Copper" and "Fiber" section headings above each group |
| `truncate_text` | boolean | `true` | Clip long text in port tiles with ellipsis |

---

## Port labels

Use `port_labels` to replace the port number shown on a tile with a short descriptive label. All underlying logic (traffic, entity lookup, heatmap, exclude) continues to use the real port number — the label is display-only.

```yaml
port_labels:
  6: LAN
  7: WAN
  25: Uplink
```

Labels longer than 4 characters are automatically scaled down in font size to fit the tile. The real port number is always visible in the hover tooltip.

---

## Exclude ports

Use `exclude_ports` to completely hide specific port numbers from the card. Useful when a device exposes internal or virtual ports you don't need to see.

```yaml
exclude_ports: [1, 2]
```

---

## SNMP setup

Your switch must have SNMP enabled. You will typically need to configure:

- SNMP enabled (v2c recommended)
- A community string (default is usually `public`)
- The HA server IP as a trap destination

Refer to your switch manufacturer's documentation for the exact steps. The integration's setup wizard will prompt for the IP and community string.

If automatic port detection does not work (SNMP OID support varies by manufacturer), set `total_ports` manually in the card config.

---

## Entity naming

The integration creates entities following this pattern, where the device name derives from the switch IP:

| Entity | Description |
|--------|-------------|
| `sensor.<device>_port_<n>_status` | Per-port state and attributes |
| `sensor.<device>_total_bandwidth` | Aggregate switch bandwidth |
| `sensor.<device>_system_cpu` | CPU usage |
| `sensor.<device>_system_memory` | Memory usage |
| `sensor.<device>_firmware` | Firmware version |
| `sensor.<device>_hostname` | Switch hostname / model |
| `sensor.<device>_uptime` | Uptime |

---

## Credits

Built on top of the [switch_port_card_pro](https://github.com/partach/switch_port_card_pro) integration and card by [partach](https://github.com/partach/switch_port_card_pro).
