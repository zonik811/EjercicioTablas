
import { LitElement, html } from 'lit';
import { translate as t } from 'lit-translate';
// --- IMPORT MATERIAL ---
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/button/filled-button.js';

export class FilterForm extends LitElement {
    // --- PROPIEDADES DE LA CLASE ---
  static properties = {
    origin: { state: true },
    status: { state: true }
  };
  // --- METODO APPLY ---
    _apply() {
        // --- EVENTO PERSONALIZADO ---
    this.dispatchEvent(
      new CustomEvent('apply-filters', {
        // --- PASAMOS LOS VALORES DE ORIGIN Y STATUS SI SON VALIDOS ---
        detail: { origin: this.origin || '', status: this.status || '' },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
    <!-- USAMOS MATERIAL TEXTFIELD , EN LABEL BUSCAMOS EN EL LANG ORIGIN , @INPUT LISTENER QUE GUARDAR EL VALOR DEL TARJET EN ORIGIN-->
      <md-outlined-text-field label="${t('filter.origin')}" @input=${e => (this.origin = e.target.value)}>
      </md-outlined-text-field>
    <!-- USAMOS MATERIAL SELECT , EN LABEL BUSCAMOS EN EL LANG STATUS , @CHANGUE LISTENER QUE GUARDAR EL VALOR DEL TARJET EN STATUS-->
      <md-outlined-select label="${t('filter.status')}" @change=${e => (this.status = e.target.value)}>
        <md-select-option value="alive">${t('status.alive')}</md-select-option>
        <md-select-option value="dead">${t('status.dead')}</md-select-option>
        <md-select-option value="unknown">${t('status.unknown')}</md-select-option>
      </md-outlined-select>
<!-- USAMOS MATERIAL BUTTON , CUANDO @CLICK EJECUTAMOS _APPLY PARA LOS FILTROS -->
      <md-filled-button @click=${this._apply}>
        ${t('filter.search')}
      </md-filled-button>
    `;
  }


}
customElements.define('filter-form', FilterForm);
