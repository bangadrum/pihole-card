/**
 * scene-grid-card — a dense scene launcher for Home Assistant
 *
 * Installation:
 *   1. Copy this file to /config/www/scene-grid-card.js
 *   2. In HA → Settings → Dashboards → Resources, add:
 *        URL:  /local/scene-grid-card.js
 *        Type: JavaScript module
 *   3. Add the card to a dashboard (see example YAML below).
 *
 * Example card config:
 * ─────────────────────────────────────────────
 * type: custom:scene-grid-card
 * title: Scenes          # optional header
 * columns: 3             # tiles per row (default 3)
 * scenes:
 *   - entity: scene.morning_routine
 *     name: Morning
 *     icon: mdi:weather-sunrise
 *     color: "#f59e0b"
 *   - entity: scene.movie_night
 *     name: Movie
 *     icon: mdi:movie-open
 *     color: "#6366f1"
 *   - entity: scene.dinner
 *     name: Dinner
 *     icon: mdi:silverware-fork-knife
 *     color: "#ec4899"
 *   - entity: scene.bedtime
 *     name: Bedtime
 *     icon: mdi:weather-night
 *     color: "#64748b"
 *   - entity: scene.away
 *     name: Away
 *     icon: mdi:home-export-outline
 *     color: "#10b981"
 *   - entity: scene.party
 *     name: Party
 *     icon: mdi:party-popper
 *     color: "#f43f5e"
 * ─────────────────────────────────────────────
 */

const CARD_VERSION = "1.0.0";

/* ── Styles ──────────────────────────────────────────────────── */
const STYLES = `
  :host {
    --sgc-bg:          #1c1c1e;
    --sgc-surface:     #2c2c2e;
    --sgc-surface-hi:  #3a3a3c;
    --sgc-border:      rgba(255,255,255,.07);
    --sgc-text:        #f2f2f7;
    --sgc-sub:         #8e8e93;
    --sgc-radius:      10px;
    --sgc-accent:      #4f8ef7;
    font-family: "SF Pro Display", "Helvetica Neue", system-ui, sans-serif;
    display: block;
  }

  .card-wrapper {
    background: var(--sgc-bg);
    border-radius: var(--sgc-radius);
    padding: 12px;
    box-sizing: border-box;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 0 2px;
  }

  .card-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--sgc-sub);
    flex: 1;
  }

  .scene-grid {
    display: grid;
    grid-template-columns: repeat(var(--columns, 3), 1fr);
    gap: 6px;
  }

  .scene-tile {
    position: relative;
    background: var(--sgc-surface);
    border: 1px solid var(--sgc-border);
    border-radius: 8px;
    padding: 10px 8px 9px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    overflow: hidden;
    transition: background .15s, transform .1s, box-shadow .15s;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .scene-tile:hover {
    background: var(--sgc-surface-hi);
  }

  .scene-tile:active {
    transform: scale(.95);
  }

  /* Glow flash on activation */
  .scene-tile::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--tile-color, var(--sgc-accent));
    opacity: 0;
    transition: opacity .05s;
    pointer-events: none;
  }

  .scene-tile.fired::after {
    opacity: .22;
    transition: opacity 0s;
  }

  .scene-tile.fired {
    box-shadow: 0 0 12px 1px var(--tile-color, var(--sgc-accent));
    transition: box-shadow .05s, transform .1s;
  }

  .icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--tile-color-dim, rgba(79,142,247,.15));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform .15s;
  }

  .scene-tile:active .icon-wrap {
    transform: scale(.9);
  }

  ha-icon {
    --mdc-icon-size: 18px;
    color: var(--tile-color, var(--sgc-accent));
  }

  .scene-name {
    font-size: 11px;
    font-weight: 500;
    color: var(--sgc-text);
    text-align: center;
    line-height: 1.2;
    word-break: break-word;
    max-width: 100%;
  }

  /* Activated label */
  .activate-toast {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    background: var(--tile-color, var(--sgc-accent));
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s;
  }

  .activate-toast.show {
    opacity: .9;
  }

  .activate-toast ha-icon {
    --mdc-icon-size: 20px;
    color: #fff;
  }
`;

/* ── Helper: hex → dim rgba ───────────────────────────────────── */
function hexToDim(hex, alpha = 0.15) {
  // SGC-1 / SGC-2: guard against missing, non-hex, or 3-char hex values
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
    return `rgba(79,142,247,${alpha})`;
  }
  let c = hex.replace("#", "");
  if (c.length === 3) c = c[0]+c[0] + c[1]+c[1] + c[2]+c[2]; // #rgb → #rrggbb
  if (c.length !== 6) return `rgba(79,142,247,${alpha})`;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(79,142,247,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Custom Element ───────────────────────────────────────────── */
class SceneGridCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._firing = new Set();
  }

  static getConfigElement() {
    // Visual editor hook — return null to use YAML only
    return null;
  }

  static getStubConfig() {
    return {
      title: "Scenes",
      columns: 3,
      scenes: [
        { entity: "scene.example", name: "Example", icon: "mdi:lightbulb", color: "#f59e0b" },
      ],
    };
  }

  setConfig(config) {
    if (!config.scenes || !Array.isArray(config.scenes)) {
      throw new Error("scene-grid-card: 'scenes' must be a list of scene objects.");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    const wasNull = this._hass === null;
    this._hass = hass;
    // SGC-3: re-render once hass arrives so _friendlyName() can resolve HA state
    if (wasNull) this._render();
  }

  /* ── Build DOM ─────────────────────────────────────────────── */
  _render() {
    const { title, scenes, columns = 3 } = this._config;

    const style = document.createElement("style");
    style.textContent = STYLES;

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    if (title) {
      const header = document.createElement("div");
      header.className = "card-header";
      const titleEl = document.createElement("div");
      titleEl.className = "card-title";
      titleEl.textContent = title;
      header.appendChild(titleEl);
      wrapper.appendChild(header);
    }

    const grid = document.createElement("div");
    grid.className = "scene-grid";
    grid.style.setProperty("--columns", String(columns));

    scenes.forEach((scene) => {
      const tile = this._makeTile(scene);
      grid.appendChild(tile);
    });

    wrapper.appendChild(grid);

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);
  }

  _makeTile(scene) {
    const color = scene.color || "#4f8ef7";
    const dimColor = hexToDim(color, 0.16);
    const name = scene.name || this._friendlyName(scene.entity);
    const icon = scene.icon || "mdi:palette";

    const tile = document.createElement("div");
    tile.className = "scene-tile";
    tile.style.setProperty("--tile-color", color);
    tile.style.setProperty("--tile-color-dim", dimColor);
    tile.title = `Activate: ${name}`;

    // Icon circle
    const iconWrap = document.createElement("div");
    iconWrap.className = "icon-wrap";
    const haIcon = document.createElement("ha-icon");
    haIcon.setAttribute("icon", icon);
    iconWrap.appendChild(haIcon);

    // Label
    const label = document.createElement("div");
    label.className = "scene-name";
    label.textContent = name;

    // Toast checkmark overlay
    const toast = document.createElement("div");
    toast.className = "activate-toast";
    const checkIcon = document.createElement("ha-icon");
    checkIcon.setAttribute("icon", "mdi:check");
    toast.appendChild(checkIcon);

    tile.appendChild(iconWrap);
    tile.appendChild(label);
    tile.appendChild(toast);

    tile.addEventListener("click", () => this._activateScene(scene, tile, toast));

    return tile;
  }

  /* ── Activate ──────────────────────────────────────────────── */
  _activateScene(scene, tile, toast) {
    if (!this._hass) return;
    if (this._firing.has(scene.entity)) return;

    this._firing.add(scene.entity);

    // Visual flash
    tile.classList.add("fired");
    toast.classList.add("show");

    this._hass.callService("scene", "turn_on", { entity_id: scene.entity });

    setTimeout(() => {
      tile.classList.remove("fired");
      toast.classList.remove("show");
      this._firing.delete(scene.entity);
    }, 700);
  }

  /* ── Helpers ───────────────────────────────────────────────── */
  _friendlyName(entityId) {
    if (!entityId) return "Scene";
    if (this._hass?.states?.[entityId]?.attributes?.friendly_name) {
      return this._hass.states[entityId].attributes.friendly_name;
    }
    return entityId.replace("scene.", "").replace(/_/g, " ");
  }

  /* Required by HA for card sizing */
  getCardSize() {
    const rows = Math.ceil((this._config.scenes?.length || 1) / (this._config.columns || 3));
    return rows + (this._config.title ? 1 : 0);
  }
}

customElements.define("scene-grid-card", SceneGridCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "scene-grid-card",
  name: "Scene Grid Card",
  description: "A dense grid of scene launcher tiles.",
  preview: false,
  documentationURL: "https://github.com/bangadrum/ha-cards/tree/main/scene-grid-card",
});

console.info(
  `%c SCENE-GRID-CARD %c v${CARD_VERSION} `,
  "background:#4f8ef7;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px",
  "background:#1c1c1e;color:#f2f2f7;font-weight:400;border-radius:0 3px 3px 0;padding:2px 6px"
);
