import { LitElement, html, css } from 'lit';
import { translate as t } from 'lit-translate';
import '@material/web/labs/card/outlined-card.js';

export class CharacterCard extends LitElement {
  static properties = {
    character: { type: Object }
  };

  static styles = css`
  
    md-outlined-card {
      width: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 0 10px rgba(0, 255, 170, 0.4);
      border-radius: 16px;
      background: #f0f8ff;
      border: 2px solid #00ff90;

    }

    md-outlined-card:hover {
      transform: scale(1.05) rotateX(2deg) rotateY(2deg);
      box-shadow: 0 0 24px #00ff90, 0 0 12px #9f0;
      cursor: pointer;
    }

    img {
      width: 100%;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }

    .box {
      padding: 12px;
      background: #ffffff;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }

    .label {
      font-weight: bold;
      color: #6a00ff;
    }

    .sub {
      margin-left: 12px;
      font-size: 0.85rem;
      color: #444;
    }

    p {
      margin: 2px 0;
      color: #222;
    }

    h3 {
      margin-top: 0;
      font-size: 1.1rem;
      color: #00a86b;
    }
  `;

  render() {
    const c = this.character;

    return html`
      <md-outlined-card>
        <img src=${c.image} alt=${c.name} loading="lazy" />
        <div class="box">
          <h3>${t('card.name')}: ${c.name}</h3>
          <p><span class="label">${t('card.status')}:</span> ${c.status}</p>
          <p><span class="label">${t('card.species')}:</span> ${c.species}</p>
          <p><span class="label">${t('card.gender')}:</span> ${c.gender}</p>

          <p><span class="label">${t('card.origin')}:</span> ${c.origin.name}</p>
          <p class="sub">${t('card.dimension')}: ${c.dimension_origen}</p>

          <p><span class="label">${t('card.location')}:</span> ${c.location.name}</p>
          <p class="sub">${t('card.dimension')}: ${c.dimension_ubicacion}</p>
        </div>
      </md-outlined-card>
    `;
  }
}

customElements.define('character-card', CharacterCard);
