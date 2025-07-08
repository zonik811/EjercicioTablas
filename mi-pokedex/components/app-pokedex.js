import './pokemon-item.js';
import './pokemon-list.js';
import './pokemon-card.js';

class AppPokedex extends HTMLElement {
  /* ---------- definimos constructor y iniciamos el shadodom en open ---------- */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  /* ---------- render ---------- */
  render() {
    /* html */
    this.shadowRoot.innerHTML = `
<style>
  /* -------- HOST GRID -------- */
  :host{
     /* modo grid */
    display:grid;
     /* -------- dispocicion de las columnas , la prima min 240 , 30% del ancho  max 320 , el resto lo toma la otra columna -------- */
    grid-template-columns: clamp(240px, 30%, 320px) 1fr; 
     /* -------- espaciado entre colunmnas -------- */
    gap:1rem;
     /* -------- toime todo el espacio de ancho del padre-------- */
    width:100%;
     /* -------- tamaño maximo -------- */
    max-width:1000px;
     /* -------- Fonts a usar  -------- */
    font-family:Arial,Helvetica,sans-serif;
  }

  /* -------- TARJETAS -------- */
  aside, section{
     /* -------- fondo blanco -------- */
    background:#fff;.
     /* -------- redondeamos bordes -------- */
    border-radius:8px;
     /* -------- tamaño minimo de altura -------- */
    min-height:300px;
     /* -------- padding interno -------- */
    padding:.75rem;
     /* -------- flexbox en vertical -------- */
    display:flex;
    flex-direction:column;
     /* -------- espacio entre aside y section -------- */
    gap:.5rem;
     /* -------- sombra -------- */
    box-shadow:0 2px 4px rgba(0,0,0,.1);
    box-sizing:border-box;
  }
   /* -------- flex nose estira  no se encoge -------- */
  aside{ flex:0 0 auto; }

  /* Responsive para moviles */
  @media (max-width:600px){
     /* se deja una sola columna -------- */
    :host{ grid-template-columns:1fr; }
 /* -------- aside ocupa todo el ancho maxima altura 50vh si sobrepasa coloca scroll -------- */
    aside{
      width:100%;
      max-height:50vh;
      overflow:auto;
    }
     /* -------- alinea al centro -------- */
    section{ align-items:center; }
  }
</style>
      <!-- LISTADO DE POKEMON -->
      <aside>
        <pokemon-list></pokemon-list>
      </aside>
      <!-- DETALLE DEL POKEMON -->
      <section>
        <pokemon-card></pokemon-card>
      </section>
    `;
  }

 
  bindEvents() {
     /* ---------- busca list y card ---------- */
    const list = this.shadowRoot.querySelector('pokemon-list');
    const card = this.shadowRoot.querySelector('pokemon-card');
/* agregamos evento pokemon-selected */
    list.addEventListener('pokemon-selected', ({ detail: { id } }) => {
       /* ---------- carga el pokemon seleccionado en la card segun su id ---------- */
      card.loadPokemon(id);
    });
  }
}

customElements.define('app-pokedex', AppPokedex);

