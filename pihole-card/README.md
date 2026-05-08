# pihole-card

A compact Pi-hole statistics card for Home Assistant Lovelace dashboards. Displays the most important DNS and blocking metrics in a clean, information-dense layout matching the `ha-cards` design language.

![pihole-card preview](./preview.png)

---

## Dependency

This card requires the Home Assistant Pi-hole integration:

- https://www.home-assistant.io/integrations/pi_hole/

[![Open Pi-hole Integration Documentation](https://my.home-assistant.io/badges/integrations.svg)](https://my.home-assistant.io/redirect/integration/?domain=pi_hole)

Ensure the integration is configured and the required sensors exist before adding the card.

---

## Installation

1. Copy `pihole-card.js` into your `config/www/` directory.
2. In Home Assistant go to **Settings → Dashboards → Resources** and add:

```text
URL:  /local/pihole-card.js
Type: JavaScript module
```

3. Hard-refresh your browser.

---

## Usage

Minimum configuration:

```yaml
type: custom:pihole-card
```

Example configuration:

```yaml
type: custom:pihole-card
name: Pi-hole

ads_blocked_entity: sensor.pi_hole_ads_blocked
ads_percentage_entity: sensor.pi_hole_ads_percentage_blocked
dns_queries_entity: sensor.pi_hole_dns_queries
cached_queries_entity: sensor.pi_hole_dns_queries_cached
forwarded_queries_entity: sensor.pi_hole_dns_queries_forwarded
unique_clients_entity: sensor.pi_hole_dns_unique_clients
unique_domains_entity: sensor.pi_hole_dns_unique_domains
domains_blocked_entity: sensor.pi_hole_domains_blocked
status_entity: binary_sensor.pi_hole_status
```

---

## Features

- Large blocked ads counter
- DNS query statistics grid
- Active / disabled status badge
- Automatic number shortening for large values
- Responsive compact layout
- Fully theme-aware styling

---

## Configuration reference

| Key | Type | Description |
|-----|------|-------------|
| `type` | string | Must be `custom:pihole-card` |
| `name` | string | Card title |
| `ads_blocked_entity` | string | Ads blocked sensor |
| `ads_percentage_entity` | string | Percentage blocked sensor |
| `dns_queries_entity` | string | Total DNS queries sensor |
| `cached_queries_entity` | string | Cached queries sensor |
| `forwarded_queries_entity` | string | Forwarded queries sensor |
| `unique_clients_entity` | string | Unique client count sensor |
| `unique_domains_entity` | string | Unique domain count sensor |
| `domains_blocked_entity` | string | Blocklist domain count sensor |
| `status_entity` | string | Pi-hole enabled / disabled status sensor |

---

## Notes

- The card is designed for the official Home Assistant Pi-hole integration.
- Missing entities are hidden automatically where possible.
- Styling adapts automatically to Home Assistant themes.
