// PHC-1: CSS extracted to a const so it can be injected into shadow DOM,
//        preventing class names like .ph-header leaking into the page.
const PIHOLE_STYLES = `
  .pihole-card {
    padding: 12px 16px;
    font-family: var(--primary-font-family, sans-serif);
  }
  .ph-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .ph-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ph-title svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .ph-status {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .ph-status.on {
    background: rgba(var(--rgb-green-color, 3,169,77), 0.15);
    color: var(--success-color, #03a94d);
  }
  .ph-status.off {
    background: rgba(var(--rgb-red-color, 244,67,54), 0.15);
    color: var(--error-color, #f44336);
  }
  .ph-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
  .ph-hero-item {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 8px 10px;
  }
  .ph-hero-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }
  .ph-hero-value {
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
    line-height: 1.1;
  }
  .ph-hero-value.accent {
    color: var(--accent-color, #03a9f4);
  }
  .ph-hero-unit {
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 400;
  }
  .ph-divider {
    height: 0.5px;
    background: var(--divider-color);
    margin: 8px 0;
  }
  .ph-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--divider-color);
    border-radius: 6px;
    overflow: hidden;
  }
  .ph-stat {
    background: var(--card-background-color, var(--ha-card-background));
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
  }
  .ph-stat-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ph-stat-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

class PiholeCard extends HTMLElement {
  // PHC-1: attach shadow DOM so styles are scoped to this card only
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    if (!this.content) {
      const style = document.createElement('style');
      style.textContent = PIHOLE_STYLES;

      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.className = 'pihole-card';
      card.appendChild(this.content);

      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(card);
    }

    const c = this._config;
    const prefix = c.entity_prefix || 'sensor.pi_hole';
    const statusEntity = c.status_entity || 'binary_sensor.pi_hole_status';

    const get = (suffix) => {
      const s = hass.states[`${prefix}_${suffix}`];
      return s ? s.state : 'N/A';
    };

    const fmt = (val) => {
      const n = parseFloat(val);
      if (isNaN(n)) return val;
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
      return n.toLocaleString();
    };

    const statusState = hass.states[statusEntity];
    const isOn = statusState && statusState.state === 'on';
    const statusText = isOn ? 'Active' : 'Disabled';

    const adsBlocked = get('ads_blocked');
    const adsPct = parseFloat(get('ads_percentage_blocked'));
    const queries = get('dns_queries');
    const cached = get('dns_queries_cached');
    const forwarded = get('dns_queries_forwarded');
    const clients = get('dns_unique_clients');
    const domains = get('dns_unique_domains');
    const domainsBlocked = get('domains_blocked');
    const seenClients = get('seen_clients');

    this.content.innerHTML = `
      <div class="ph-header">
        <div class="ph-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
          ${c.title || 'Pi-hole'}
        </div>
        <div class="ph-status ${isOn ? 'on' : 'off'}">${statusText}</div>
      </div>

      <div class="ph-hero">
        <div class="ph-hero-item">
          <div class="ph-hero-label">Ads blocked</div>
          <div class="ph-hero-value accent">${fmt(adsBlocked)}</div>
        </div>
        <div class="ph-hero-item">
          <div class="ph-hero-label">Block rate</div>
          <div class="ph-hero-value accent">${isNaN(adsPct) ? adsPct : adsPct.toFixed(1)}<span class="ph-hero-unit"> %</span></div>
        </div>
      </div>

      <div class="ph-grid">
        <div class="ph-stat">
          <span class="ph-stat-label">DNS queries</span>
          <span class="ph-stat-value">${fmt(queries)}</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Cached</span>
          <span class="ph-stat-value">${fmt(cached)}</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Forwarded</span>
          <span class="ph-stat-value">${fmt(forwarded)}</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Blocklist size</span>
          <span class="ph-stat-value">${fmt(domainsBlocked)}</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Unique domains</span>
          <span class="ph-stat-value">${fmt(domains)}</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Clients (seen / unique)</span>
          <span class="ph-stat-value">${seenClients} / ${clients}</span>
        </div>
      </div>
    `;
  }

  // PHC-4: validate config and surface a clear error for bad input
  setConfig(config) {
    if (config.entity_prefix && typeof config.entity_prefix !== 'string') {
      throw new Error('pihole-card: entity_prefix must be a string.');
    }
    if (config.status_entity && typeof config.status_entity !== 'string') {
      throw new Error('pihole-card: status_entity must be a string.');
    }
    this._config = config;
  }

  getCardSize() {
    return 3;
  }

  // PHC-2: return null — no visual editor exists for this card
  static getConfigElement() {
    return null;
  }

  static getStubConfig() {
    return {
      title: 'Pi-hole',
      entity_prefix: 'sensor.pi_hole',
      status_entity: 'binary_sensor.pi_hole_status'
    };
  }
}

customElements.define('pihole-card', PiholeCard);

window.customCards = window.customCards || [];
// PHC-3: add documentationURL pointing to the actual repo
window.customCards.push({
  type: 'pihole-card',
  name: 'Pi-hole Card',
  description: 'Compact Pi-hole stats card',
  documentationURL: 'https://github.com/bangadrum/ha-cards/tree/main/pihole-card',
});
