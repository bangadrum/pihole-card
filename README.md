# pihole-card

A compact, information-dense [Pi-hole](https://pi-hole.net/) stats card for [Home Assistant](https://www.home-assistant.io/) Lovelace dashboards.

![Pi-hole Card Preview](https://raw.githubusercontent.com/your-username/pihole-card/main/preview.png)

---

## Features

- At-a-glance view of all key Pi-hole metrics in a single small card
- Prominent ads blocked count and block rate percentage
- Compact stats grid for DNS queries, cache hits, forwarded queries, blocklist size, unique domains, and client counts
- Active / Disabled status badge
- Large numbers automatically shortened (e.g. `88,038` → `88.0K`)
- Fully theme-aware — respects your HA accent colour, dark/light mode, and card background variables

---

## Preview

| Active | Disabled |
|--------|----------|
| Status badge shown in green | Status badge shown in red |

---

## Requirements

- Home Assistant 2023.x or later
- [Pi-hole integration](https://www.home-assistant.io/integrations/pi_hole/) configured and working
- The following entities available in HA:

| Entity | Description |
|--------|-------------|
| `sensor.pi_hole_ads_blocked` | Total ads blocked |
| `sensor.pi_hole_ads_percentage_blocked` | Block rate (%) |
| `sensor.pi_hole_dns_queries` | Total DNS queries |
| `sensor.pi_hole_dns_queries_cached` | Cached DNS queries |
| `sensor.pi_hole_dns_queries_forwarded` | Forwarded DNS queries |
| `sensor.pi_hole_dns_unique_clients` | Unique DNS clients |
| `sensor.pi_hole_dns_unique_domains` | Unique domains seen |
| `sensor.pi_hole_domains_blocked` | Blocklist size |
| `sensor.pi_hole_seen_clients` | Total seen clients |
| `binary_sensor.pi_hole_status` | Pi-hole on/off status |

---

## Installation

### Manual

1. Download [`pihole-card.js`](https://raw.githubusercontent.com/your-username/pihole-card/main/pihole-card.js)
2. Copy it to your Home Assistant config directory:
   ```
   /config/www/pihole-card.js
   ```
3. Add it as a Lovelace resource. Go to **Settings → Dashboards → ⋮ (menu) → Resources** and click **Add Resource**:
   - **URL:** `/local/pihole-card.js`
   - **Resource type:** JavaScript module
4. Reload your browser

### HACS (manual repository)

1. In HACS, go to **Frontend → ⋮ → Custom repositories**
2. Add `https://github.com/your-username/pihole-card` as a **Lovelace** repository
3. Install **Pi-hole Card** from HACS
4. Reload your browser

---

## Usage

Add the card to any Lovelace dashboard via the UI or YAML:

```yaml
type: custom:pihole-card
```

### Full configuration example

```yaml
type: custom:pihole-card
title: Pi-hole
entity_prefix: sensor.pi_hole
status_entity: binary_sensor.pi_hole_status
```

---

## Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `Pi-hole` | Card title shown in the header |
| `entity_prefix` | `string` | `sensor.pi_hole` | Prefix shared by all Pi-hole sensor entities |
| `status_entity` | `string` | `binary_sensor.pi_hole_status` | Entity used for the Active / Disabled badge |

### Multiple Pi-hole instances

If you have more than one Pi-hole configured in HA (e.g. a secondary instance named `pi_hole_2`), create a separate card for each and adjust the prefix:

```yaml
type: custom:pihole-card
title: Pi-hole (secondary)
entity_prefix: sensor.pi_hole_2
status_entity: binary_sensor.pi_hole_2_status
```

---

## Troubleshooting

**Card shows `N/A` for all values**  
Check that the Pi-hole integration is set up and that the entities listed in the Requirements section exist in your HA instance. Go to **Developer Tools → States** and search for `pi_hole` to confirm.

**Card doesn't appear after installing**  
Clear your browser cache or do a hard reload (`Ctrl+Shift+R` / `Cmd+Shift+R`). In some setups you may also need to restart HA after adding a new Lovelace resource.

**Entity prefix doesn't match**  
If your entities are named differently (e.g. `sensor.pihole_ads_blocked` without the underscore), set `entity_prefix: sensor.pihole` in your card config.

---

## Contributing

Pull requests and issues are welcome. Please open an issue first for significant changes so we can discuss the approach.

---

## License

[MIT](LICENSE)
