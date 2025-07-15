
import { LitElement, html, css } from 'lit';
import { registerTranslateConfig, use, translate as t } from 'lit-translate';
// --- import lang ---
import es from '../i18n/es.js';
import en from '../i18n/en.js';
// --- imports ---
import { DataManager } from './data-manager.js';
import './filter-form.js';
import './character-card.js';
import '@material/web/labs/card/outlined-card.js';

// --- Configuracion lang , dejamos por defecto es ---
registerTranslateConfig({
  loader: lang => ({ es, en }[lang])
});
await use('es');

// --- COMPONENTE PRINCIAPL ---
export class RmApp extends LitElement {
    // --- STYLES ---
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      background: #f5f5f5;
      min-height: 100vh;
    }

    md-outlined-card.wrapper {
      padding: 1rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      max-width: 1200px;
      margin: auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    header h1 {
      font-size: 1.5rem;
      margin: 0;
    }

    select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    filter-form {
      display: block;
      margin-bottom: 2rem;
    }

    main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }
  `;

  // --- ARRAY PRINCIPAL ---

  characters = [];
// --- CARGA INICIAL ---
  firstUpdated() {
    this._load(); 
  }
// --- METODO LOAD CARGA LOS CARACTERES SEGUN EL FILTER APLICADO ---
  async _load(filters = {}) {
    this.characters = await DataManager.filter(filters);
    this.requestUpdate();
  }
// --- METODO CAMBIO DE LANG ---

  _changeLang(e) {
    use(e.target.value);
    this.requestUpdate();
  }
 // --- RENDER --- 

  render() {
    return html`
      <md-outlined-card class="wrapper">
        <header>
        <!-- TRAEMOS EL TITLE DEL LANG -->
          <h1>${t('title')}</h1>
          <!-- SELECT CUANDO CAMBIE EJECUTE METODO CHANGELANG POR LA OPCION  -->
          <select @change=${this._changeLang}>
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </header>
<!-- COMPONENTE FILTRO , CUANDO CORRA APPLY FILTERS , CORRA _LOAD CON LOS DATOS DE E  -->
        <filter-form @apply-filters=${e => this._load(e.detail)}></filter-form>
<!-- SECCION PRINCIPAL  -->
        <main>
        <!-- RECORREMOS CHARACTERS  -->
          ${this.characters.map(
            // --- CREAMOS UN CARD PERSONALIZADO POR CADA CHARACTER , PASANDO OBJETO JAVASCRIPT C  ---
            c => html`<character-card .character=${c}></character-card>`
          )}
        </main>
      </md-outlined-card>
    `;
  }
}

customElements.define('rm-app', RmApp);
