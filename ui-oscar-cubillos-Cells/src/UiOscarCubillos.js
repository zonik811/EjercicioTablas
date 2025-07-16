import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './ui-oscar-cubillos.css.js';

export class UiOscarCubillos extends LitElement {
  static get properties() {
    return {
      dogImage: { type: String }
    };
  }

  constructor() {
    super();
    this.dogImage = '';
  }

  static get styles() {
    return [
      styles,
      getComponentSharedStyles('ui-oscar-cubillos-shared-styles'),
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchDog();
  }

  async _fetchDog() {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      this.dogImage = data.message;
    } catch (error) {
      console.error('Error al obtener el perrito:', error);
      this.dogImage = '';
    }
  }

  render() {
    return html`
      <h3>Perrito del dia</h3>
      ${this.dogImage
        ? html`<img src="${this.dogImage}" alt="Perrito" />`
        : html`<p>Cargando perrito...</p>`}
      <button @click="${this._fetchDog}">
        Ver otro perrito
      </button>
      <slot></slot>
    `;
  }
}