/**
 * NUT UPS Card — Home Assistant Custom Card  v1.1.0
 * Monitors UPS devices via the Network UPS Tools (NUT) integration.
 *
 * Install: copy to <config>/www/nut-ups-card.js
 * Register: Settings → Dashboards → Resources → /local/nut-ups-card.js (module)
 *
 * Config example:
 *   type: custom:nut-ups-card
 *   name: Server Room UPS
 *   status_entity:          sensor.ups_status
 *   battery_charge_entity:  sensor.ups_battery_charge
 *   battery_runtime_entity: sensor.ups_battery_runtime
 *   battery_voltage_entity: sensor.ups_battery_voltage
 *   input_voltage_entity:   sensor.ups_input_voltage
 *   output_voltage_entity:  sensor.ups_output_voltage
 *   load_entity:            sensor.ups_load
 *   battery_temp_entity:    sensor.ups_battery_temperature
 *   ambient_temp_entity:    sensor.ups_ambient_temperature
 */

const VERSION = '1.1.0';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const NUT_STYLES = `
:host {
  --c-bg:      var(--card-background-color,      #0d1117);
  --c-surface: var(--secondary-background-color, #161b22);
  --c-border:  rgba(255,255,255,0.09);
  --c-text:    var(--primary-text-color,         #e6edf3);
  --c-muted:   var(--secondary-text-color,       #8b949e);
  --c-dim:     rgba(255,255,255,0.04);
  --c-ok:      #3fb950;
  --c-warn:    #d29922;
  --c-crit:    #f85149;
  --c-info:    #58a6ff;
  --radius:    12px;
  --radius-sm: 8px;
  font-family: 'Noto Sans','Roboto','Helvetica Neue',Arial,sans-serif;
  display: block;
}
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Card shell ── */
.card {
  background: var(--c-bg);
  border-radius: var(--radius);
  overflow: hidden;
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid var(--c-border);
}

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px 11px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-surface);
}
.header-left  { display: flex; align-items: center; gap: 10px; }
.header-icon  {
  width: 30px; height: 30px;
  background: #1d4ed8;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.header-icon svg { width: 17px; height: 17px; fill: #fff; }
.header-title { font-size: 14px; font-weight: 500; letter-spacing: .03em; }
.header-sub   { font-size: 11px; color: var(--c-muted); }

/* Clicking the status entity in the header sub opens more-info */
.header-sub .entity-link {
  cursor: pointer;
  border-bottom: 1px dashed var(--c-muted);
  transition: color .15s, border-color .15s;
}
.header-sub .entity-link:hover { color: var(--c-text); border-color: var(--c-text); }

.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--c-muted);
  flex-shrink: 0;
  transition: background .3s, box-shadow .3s;
}
.status-dot.online  { background: var(--c-ok);   box-shadow: 0 0 0 3px rgba(63,185,80,.18); }
.status-dot.battery { background: var(--c-warn);  box-shadow: 0 0 0 3px rgba(210,153,34,.18); }
.status-dot.alarm   { background: var(--c-crit);  box-shadow: 0 0 0 3px rgba(248,81,73,.18);
                       animation: alarm-blink 1.4s ease-in-out infinite; }
@keyframes alarm-blink { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Clickable value cells ── */
/* Any element with [data-entity] becomes a tap target */
[data-entity] {
  cursor: pointer;
  transition: background .15s;
}
[data-entity]:hover { background: rgba(255,255,255,.04); }

/* ── Stats strip ── */
.stats {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  border-bottom: 1px solid var(--c-border);
}
.stat {
  padding: 11px 14px;
  border-right: 1px solid var(--c-border);
  position: relative;
  overflow: hidden;
}
.stat:last-child { border-right: none; }
.stat-val {
  font-size: 22px; font-weight: 500;
  letter-spacing: -.02em; line-height: 1;
  margin-bottom: 3px;
}
.stat-val.ok      { color: var(--c-ok);   }
.stat-val.warn    { color: var(--c-warn);  }
.stat-val.crit    { color: var(--c-crit);  }
.stat-val.info    { color: var(--c-info);  }
.stat-val.neutral { color: var(--c-text);  }
.stat-unit { font-size: 12px; font-weight: 400; color: var(--c-muted); }
.stat-lbl {
  font-size: 9px; color: var(--c-muted);
  letter-spacing: .07em; text-transform: uppercase;
}
.stat-bar {
  position: absolute; bottom: 0; left: 0;
  height: 2px; border-radius: 0 2px 0 0;
  transition: width .5s ease;
}
.stat-bar.ok   { background: var(--c-ok);   }
.stat-bar.warn { background: var(--c-warn);  }
.stat-bar.crit { background: var(--c-crit);  }
.stat-bar.info { background: var(--c-info);  }

/* ── Battery section ── */
.battery {
  padding: 12px 18px;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  gap: 14px;
}
.batt-visual {
  display: flex; align-items: center; gap: 2px;
  flex-shrink: 0;
}
.batt-body {
  width: 50px; height: 22px;
  border: 1.5px solid var(--c-border);
  border-radius: 4px;
  padding: 2px;
  background: var(--c-surface);
}
.batt-nub {
  width: 4px; height: 9px;
  background: var(--c-border);
  border-radius: 0 2px 2px 0;
}
.batt-fill {
  height: 100%;
  border-radius: 2px;
  transition: width .5s ease, background .4s ease;
}
.batt-fill.ok   { background: var(--c-ok);   }
.batt-fill.warn { background: var(--c-warn);  }
.batt-fill.crit { background: var(--c-crit);  }
.batt-fill.info { background: var(--c-info);  }
.batt-info { flex: 1; min-width: 0; }
.batt-pct  {
  font-size: 20px; font-weight: 500;
  letter-spacing: -.02em; line-height: 1;
}
.batt-pct .u { font-size: 12px; font-weight: 400; color: var(--c-muted); }
.batt-lbl  {
  font-size: 9px; color: var(--c-muted);
  letter-spacing: .07em; text-transform: uppercase; margin-top: 2px;
}
.runtime     { text-align: right; flex-shrink: 0; }
.runtime-val {
  font-size: 18px; font-weight: 500;
  letter-spacing: -.01em; line-height: 1;
  color: var(--c-info);
}
.runtime-lbl {
  font-size: 9px; color: var(--c-muted);
  letter-spacing: .07em; text-transform: uppercase;
  margin-top: 2px; text-align: right;
}

/* ── Metrics grid ── */
.metrics {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 1px;
  background: var(--c-border);
}
.metric {
  background: var(--c-bg);
  padding: 10px 14px;
}
.metric-lbl {
  font-size: 9px; color: var(--c-muted);
  letter-spacing: .07em; text-transform: uppercase;
  margin-bottom: 3px;
}
.metric-val {
  font-size: 16px; font-weight: 500;
  letter-spacing: -.01em; line-height: 1;
}
.metric-val .u { font-size: 11px; font-weight: 400; color: var(--c-muted); }
.metric-val.ok      { color: var(--c-ok);   }
.metric-val.warn    { color: var(--c-warn);  }
.metric-val.crit    { color: var(--c-crit);  }
.metric-val.neutral { color: var(--c-text);  }
.metric-bar {
  margin-top: 5px; height: 2px;
  background: rgba(255,255,255,.07);
  border-radius: 1px; overflow: hidden;
}
.metric-bar-fill {
  height: 100%; border-radius: 1px;
  transition: width .5s ease;
}
.metric-bar-fill.ok   { background: var(--c-ok);   }
.metric-bar-fill.warn { background: var(--c-warn);  }
.metric-bar-fill.crit { background: var(--c-crit);  }

/* ── Footer ── */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  border-top: 1px solid var(--c-border);
}
.footer-lbl {
  font-size: 10px; color: var(--c-muted);
  letter-spacing: .05em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
`;

/* ─── Card element ────────────────────────────────────────────────────────── */
class NutUpsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
  }

  static getConfigElement() { return document.createElement('nut-ups-card-editor'); }

  static getStubConfig() {
    return {
      name: 'UPS',
      status_entity:          '',
      battery_charge_entity:  '',
      battery_runtime_entity: '',
      battery_voltage_entity: '',
      input_voltage_entity:   '',
      output_voltage_entity:  '',
      load_entity:            '',
      battery_temp_entity:    '',
      ambient_temp_entity:    '',
    };
  }

  setConfig(config) {
    if (config.name && typeof config.name !== 'string')
      throw new Error('nut-ups-card: name must be a string.');
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  /* ── History / more-info ────────────────────────────────────────────────
   * Fires the standard HA `hass-more-info` event that the frontend listens
   * for to open the entity's history/more-info dialog — the same thing that
   * happens when you tap a value in a built-in entity card.
   * `composed: true` + `bubbles: true` ensures it propagates through the
   * shadow DOM boundary up to the HA root event bus.
   */
  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail:   { entityId },
      bubbles:  true,
      composed: true,
    }));
  }

  /* ── Helpers ── */
  _state(entityId) {
    if (!entityId || !this._hass) return null;
    const s = this._hass.states[entityId];
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    return s.state;
  }

  _num(entityId) {
    const s = this._state(entityId);
    if (s === null) return null;
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  _fmt(entityId, decimals = 1) {
    const n = this._num(entityId);
    if (n === null) return '—';
    return decimals === 0 ? String(Math.round(n)) : n.toFixed(decimals);
  }

  _fmtRuntime(entityId) {
    const n = this._num(entityId);
    if (n === null) return '—';
    if (n < 60)   return `${Math.round(n)}s`;
    const m = Math.floor(n / 60);
    if (m < 60)   return `${m}m`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  }

  _timeAgo(lastChanged) {
    if (!lastChanged) return '';
    const diff = (Date.now() - new Date(lastChanged).getTime()) / 1000;
    if (diff < 60)   return `${Math.round(diff)}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    return `${Math.round(diff / 3600)}h ago`;
  }

  _statusDotClass(statusText) {
    if (!statusText) return '';
    const s = statusText.toLowerCase();
    if (s.includes('on line') || s === 'online') return 'online';
    if (s.includes('on battery'))                return 'battery';
    if (s.includes('alarm') || s.includes('fault') || s.includes('overload')) return 'alarm';
    return '';
  }

  _chargeClass(pct) {
    if (pct === null) return 'info';
    if (pct < 25)     return 'crit';
    if (pct < 50)     return 'warn';
    return 'ok';
  }

  _loadClass(pct) {
    if (pct === null) return 'neutral';
    if (pct > 80)     return 'crit';
    if (pct > 60)     return 'warn';
    return 'ok';
  }

  /* ── Render ── */
  _render() {
    const c    = this._config;
    const root = this.shadowRoot;
    root.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = NUT_STYLES;
    root.appendChild(style);

    if (!this._hass) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div style="padding:24px 18px;text-align:center;color:var(--c-muted);font-size:12px;">Connecting…</div>`;
      root.appendChild(card);
      return;
    }

    /* ── Data ── */
    const name        = c.name || 'UPS';
    const statusState = this._hass.states[c.status_entity];
    const statusText  = statusState ? statusState.state : null;
    const dotClass    = this._statusDotClass(statusText);

    const charge      = this._num(c.battery_charge_entity);
    const load        = this._num(c.load_entity);
    const inputV      = this._fmt(c.input_voltage_entity,  0);
    const outputV     = this._fmt(c.output_voltage_entity, 0);
    const battV       = this._fmt(c.battery_voltage_entity, 1);
    const battTemp    = this._fmt(c.battery_temp_entity,   1);
    const ambTemp     = this._fmt(c.ambient_temp_entity,   1);
    const runtime     = this._fmtRuntime(c.battery_runtime_entity);
    const runtimeSecs = this._num(c.battery_runtime_entity);

    const chargePct   = charge !== null ? Math.round(charge) : null;
    const loadPct     = load   !== null ? Math.round(load)   : null;
    const chargeClass = this._chargeClass(charge);
    const loadClass   = this._loadClass(load);

    const effVal = (inputV !== '—' && outputV !== '—')
      ? Math.round(parseFloat(outputV) / parseFloat(inputV) * 100) + ''
      : '—';
    const effUnit = effVal !== '—' ? '%' : '';

    const lastChanged = statusState ? statusState.last_changed : null;

    /* ── Card ── */
    const card = document.createElement('div');
    card.className = 'card';

    /* Header — status entity shown in sub-title, clickable */
    const statusSpan = c.status_entity
      ? `<span class="entity-link" data-entity="${c.status_entity}">${statusText || c.status_entity}</span>`
      : (statusText || '');

    card.innerHTML = `
      <div class="header">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24">
              <path d="M8 2v4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0
                2-2V8a2 2 0 0 0-2-2h-2V2h-2v4h-4V2H8zm-2 6h12v12H6V8zm4
                2v4H8l4 6v-4h2l-4-6z"/>
            </svg>
          </div>
          <div>
            <div class="header-title">${name}</div>
            <div class="header-sub">Network UPS Tools${statusText ? ' · ' + statusSpan : ''}</div>
          </div>
        </div>
        <div class="status-dot ${dotClass}"></div>
      </div>`;

    /* Stats strip — each cell is clickable if an entity is configured */
    const ei = (entity) => entity ? `data-entity="${entity}"` : '';

    card.innerHTML += `
      <div class="stats">
        <div class="stat" ${ei(c.battery_charge_entity)}>
          <div class="stat-val ${chargeClass}">
            ${chargePct !== null ? chargePct : '—'}<span class="stat-unit">${chargePct !== null ? '%' : ''}</span>
          </div>
          <div class="stat-lbl">Battery</div>
          ${charge !== null ? `<div class="stat-bar ${chargeClass}" style="width:${charge}%"></div>` : ''}
        </div>
        <div class="stat" ${ei(c.battery_runtime_entity)}>
          <div class="stat-val info">${runtime}</div>
          <div class="stat-lbl">Runtime</div>
          ${runtimeSecs !== null ? `<div class="stat-bar info" style="width:${Math.min(runtimeSecs / 3600 * 100, 100)}%"></div>` : ''}
        </div>
        <div class="stat" ${ei(c.load_entity)}>
          <div class="stat-val ${loadClass}">
            ${loadPct !== null ? loadPct : '—'}<span class="stat-unit">${loadPct !== null ? '%' : ''}</span>
          </div>
          <div class="stat-lbl">Load</div>
          ${load !== null ? `<div class="stat-bar ${loadClass}" style="width:${Math.min(load, 100)}%"></div>` : ''}
        </div>
        <div class="stat" ${ei(c.input_voltage_entity)}>
          <div class="stat-val neutral">
            ${inputV}<span class="stat-unit">${inputV !== '—' ? 'V' : ''}</span>
          </div>
          <div class="stat-lbl">Input V</div>
        </div>
      </div>`;

    /* Battery bar — clickable on charge and runtime */
    card.innerHTML += `
      <div class="battery">
        <div class="batt-visual" ${ei(c.battery_charge_entity)}>
          <div class="batt-body">
            <div class="batt-fill ${chargeClass}" style="width:${charge !== null ? charge : 0}%"></div>
          </div>
          <div class="batt-nub"></div>
        </div>
        <div class="batt-info" ${ei(c.battery_charge_entity)}>
          <div class="batt-pct">${chargePct !== null ? chargePct : '—'}<span class="u">%</span></div>
          <div class="batt-lbl">Battery Charge</div>
        </div>
        <div class="runtime" ${ei(c.battery_runtime_entity)}>
          <div class="runtime-val">${runtime}</div>
          <div class="runtime-lbl">Remaining</div>
        </div>
      </div>`;

    /* Metrics grid — each cell clickable */
    const metrics = [
      { lbl: 'Output V',   entity: c.output_voltage_entity,  val: outputV,  unit: outputV  !== '—' ? 'V'  : '', cls: 'neutral', bar: false },
      { lbl: 'Batt V',     entity: c.battery_voltage_entity, val: battV,    unit: battV    !== '—' ? 'V'  : '', cls: 'neutral', bar: false },
      { lbl: 'Load',       entity: c.load_entity,
        val: loadPct !== null ? String(loadPct) : '—',
        unit: loadPct !== null ? '%' : '', cls: loadClass, bar: true, barPct: load !== null ? Math.min(load, 100) : 0 },
      { lbl: 'Batt Temp',  entity: c.battery_temp_entity,    val: battTemp, unit: battTemp !== '—' ? '°C' : '', cls: 'neutral', bar: false },
      { lbl: 'Ambient',    entity: c.ambient_temp_entity,     val: ambTemp,  unit: ambTemp  !== '—' ? '°C' : '', cls: 'neutral', bar: false },
      { lbl: 'Efficiency', entity: null,                       val: effVal,   unit: effUnit,                      cls: 'neutral', bar: false },
    ];

    card.innerHTML += `
      <div class="metrics">
        ${metrics.map(m => `
          <div class="metric" ${m.entity ? `data-entity="${m.entity}"` : ''}>
            <div class="metric-lbl">${m.lbl}</div>
            <div class="metric-val ${m.cls}">${m.val}<span class="u">${m.unit}</span></div>
            ${m.bar ? `<div class="metric-bar"><div class="metric-bar-fill ${m.cls}" style="width:${m.barPct}%"></div></div>` : ''}
          </div>`).join('')}
      </div>`;

    /* Footer — click timestamp area to open status more-info */
    card.innerHTML += `
      <div class="footer">
        <span class="footer-lbl" ${ei(c.status_entity)}>${c.status_entity || 'nut-ups-card'}</span>
        <span class="footer-lbl">${this._timeAgo(lastChanged)}</span>
      </div>`;

    root.appendChild(card);

    /* ── Event delegation: single listener on the shadow root ──────────────
     * Walks up from the clicked target looking for the nearest [data-entity]
     * ancestor (stopping at the card boundary), then fires hass-more-info.
     * Using delegation means no listeners are leaked across re-renders.
     */
    root.addEventListener('click', (e) => {
      let el = e.target;
      while (el && el !== root) {
        if (el.dataset && el.dataset.entity) {
          this._moreInfo(el.dataset.entity);
          return;
        }
        el = el.parentElement;
      }
    });
  }

  getCardSize() { return 4; }
}

customElements.define('nut-ups-card', NutUpsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'nut-ups-card',
  name:             'NUT UPS Card',
  description:      `UPS monitoring via Network UPS Tools (v${VERSION})`,
  documentationURL: 'https://github.com/bangadrum/ha-cards/tree/main/nut-ups-card',
  preview:          false,
});

console.info(
  `%c NUT-UPS-CARD %c v${VERSION} `,
  'background:#1d4ed8;color:#fff;font-weight:700;padding:2px 4px;border-radius:3px 0 0 3px',
  'background:#0d1117;color:#58a6ff;font-weight:500;padding:2px 4px;border-radius:0 3px 3px 0'
);
