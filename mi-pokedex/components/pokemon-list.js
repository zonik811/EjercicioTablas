import './pokemon-item.js';

const PLANTILLA  = document.createElement('template');
PLANTILLA.innerHTML = /* html */`
  <style>
    :host{
      /* flexbox de forma vertical */
      display:flex;
      flex-direction:column;
      /* separacion interna  */
      gap:.5rem;
      /* font  */
      font-family:Arial,Helvetica,sans-serif;
    }

    /* ---------- barra de filtro ---------- */
    .filter{
      /* flexbox separacion interna alineado al centro  */
      display:flex;
      gap:.5rem;
      align-items:center;
      flex-wrap:wrap;
    }
    .filter button{
      /* separacion interna  */
      padding:.35rem .75rem;
      border:none;
      border-radius:6px;
       /* color de fondo claro  */
      background:#e3ecff;
      font-weight:600;
      transition:background .2s;
    }
     /* color mas oscuro */
    .filter button.active{ background:#a4c4ff; }
    select{
      padding:.35rem .5rem;
      border-radius:6px;
      border:1px solid #a4c4ff;
      background:#fff;
      font-weight:600;
    }

    /* ---------- lista & paginación ---------- */
    .items{
      display:flex;
      flex-direction:column;
      gap:.5rem;
    }
    .pagination{
      display:flex;
      justify-content:space-between;
      margin-top:.25rem;
    }
    .pagination button{
      flex:1;
      padding:.3rem 0;
      border:none;
      border-radius:6px;
      background:#d4e2ff;
      cursor:pointer;
      font-weight:600;
    }
    .pagination button[disabled]{opacity:.4;cursor:not-allowed;}
  </style>

   <!-- FILTRO FAVORITOS Y TODOS -->
  <div class="filter">
  <!-- DEJAMOS ACTIVO POR DEFECTO ALL -->
    <button id="btn-all" class="active">Todos</button>
    <button id="btn-fav">Favoritos</button>
   <!-- FILTRO POR TIPO -->  
    <label style="display:flex;align-items:center;gap:.25rem;">
      <span>Tipo:</span>
      <select id="type-select">
        <option value="">— Todos —</option>
      </select>
    </label>
  </div>
  <!-- LISTADO -->
  <div class="items"></div>

  <!-- PAGINACION -->
  <div class="pagination">
    <button id="prev">‹ Anterior</button>
    <span id="info" style="flex:1;text-align:center;"></span>
    <button id="next">Siguiente ›</button>
  </div>
`;

class PokemonList extends HTMLElement {

  constructor(){
    super();
     /* CLONAMOS LA PLANTILLA */
    this.attachShadow({mode:'open'}).appendChild(PLANTILLA.content.cloneNode(true));
     /* GUARDAMOS REFERENCIAS */
    this.$items   = this.shadowRoot.querySelector('.items');
    this.$info    = this.shadowRoot.querySelector('#info');
    this.$prev    = this.shadowRoot.querySelector('#prev');
    this.$next    = this.shadowRoot.querySelector('#next');
    this.$btnAll  = this.shadowRoot.querySelector('#btn-all');
    this.$btnFav  = this.shadowRoot.querySelector('#btn-fav');
    this.$select  = this.shadowRoot.querySelector('#type-select');

    /* TAMAÑO POR PAGINA DE POKEMONS */
    this.pageSize   = 10;
    /* PAGINA ACTUAL */
    this.current    = 1;
    /* LISTADO POKEMONS */
    this.pokemons   = [];
    /* AGREGAR AL LOCALSTORAGE LOS FAVORITOS SI NO AHI NADA LA CREA VACIA */
    this.favorites  = new Set(JSON.parse(localStorage.getItem('pokedex_favs') || '[]'));

     /* FILTRO CONFIGURADO EN ALL POR DEFECTO */
    this.filterMode = 'all';
    this.filterType = ''; 

    /* EVENTOS DE CLICK DE PAGINACION CON GOTO */
    this.$prev.addEventListener('click', ()=> this.goto(this.current-1));
    this.$next.addEventListener('click', ()=> this.goto(this.current+1));
    /* EVENTOS DE FILTROS CAMBIAMOS CON SET MODE EL FILTRO*/
    this.$btnAll.addEventListener('click', ()=> this.setMode('all'));
    this.$btnFav.addEventListener('click', ()=> this.setMode('fav'));
    /* EVENTOS SELECT CUANDO CAMBIA EL TIPO DEL FILTRO SI NO LO DEJA EN ALL */
    this.$select.addEventListener('change', ()=> {
      const val = this.$select.value;
      this.filterType = val;
      this.setMode(val ? 'type' : 'all');
    });

    /* EVENTOS  SELECIONADO */
    this.$items.addEventListener('pokemon-selected', e => this.forward(e));
     /* EVENTO FAVORITO */
    this.$items.addEventListener('favorite-toggled', e => this.favoritos(e));
  }
    /* CUANDO CARGA EL DOOM CARGA EL LOAD */
  connectedCallback(){ this.load(); }

 /* FETCH AL POKEAPI SIN LIMITE */
  async load(){
    const base = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
                         .then(r => r.json());
 /* USAMSO PROMISE ALL PARA ESPERAR QUE TRAIGA PARA CADA POKEMON SU DATO */
    this.pokemons = await Promise.all(
      base.results.map(async (pokemon, idx) => {
        const id = idx + 1;
        const data  = await fetch(pokemon.url).then(r=>r.json());
/* SACAMOS PARA CADA POKEMON SU ID , NOMBRE , TIPO Y IMG URL */
        return {
          id,
          name : pokemon.name,
          type : data.types[0].type.name,
          img  : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        };
      })
    );
/* POBLAMOS EL SELECT  */
    this.populateTypeSelect();
    /* ACTUALIZAMOS LAS PAGINAS */
    this.updatePages();
  }
/* EVENTOS DE CLICK DE PAGINA */
  populateTypeSelect(){
    /* SACAMOS DE CADA POKEMON SU TIPO Y QUITAMOS LOS DUPLICADOS Y LO VOLVEMOS ARRAY NUEVAMENTE */
    const types = [...new Set(this.pokemons.map(p=>p.type))].sort();
    types.forEach(t=>{
      /* RECORRE TYPES Y LLENA UN OPTION POR CADA TIPO */
      const opt = document.createElement('option');
      opt.value = t;
       /* VOLVEMOS LA PRIMERA LETRA MAYUSCULA */
      opt.textContent = t[0].toUpperCase() + t.slice(1);
       /* AGREGAMOS LA OPCION AL SELECT*/
      this.$select.appendChild(opt);
    });
  }

  /* FILTRO Y PAGINADO */
  setMode(mode){
      /*GUARDA FILTRO ACTUALÑ */
    this.filterMode = mode;
      /* RESALTA EL BOTON COLOCANDOLO ACTIVO */
    this.$btnAll.classList.toggle('active', mode==='all');
    this.$btnFav.classList.toggle('active', mode==='fav');
    if(mode !== 'type'){ this.$select.value = ''; }
      /* REINICIAMOIS PAGINA */
    this.current = 1;
      /* REGENERAMOS PAGINADO */
    this.updatePages();
  }
/* USAMOS EL GET PARA CUANDOS E USE THIS.FILTEREDLIST CORRA ESTE EVENTO */
  get filteredList(){
    /* CAMBIAMOS EL FILTER MODE DEPENDIENDO FAVORITOS O POR TIPO */
    switch(this.filterMode){
      case 'fav':
        return this.pokemons.filter(p=> this.favorites.has(p.id));
      case 'type':
        return this.pokemons.filter(p=> p.type === this.filterType);
      default:
        return this.pokemons;
    }
  }
/* PAGINADO */
  updatePages(){
    /* MIRAMOS LA CANTIDAD TOTAL EN LA LISTA FILTRADA DE POKEMONS */
    const total = this.filteredList.length;
    /* CALCULAMOS EL TOTAL DE PAGINAS REDONDEANDO HACIA ARRIBA*/
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    /* SI LA PAGINA ACTUAL ES MAYOR A LAS PAGINAS TOTALES LA PONEMOS EN LA ULTIMA */
    if(this.current > this.totalPages) this.current = this.totalPages;
    this.renderPage();
  }
/* RENDERIZADO DE LA PAGINA */
  renderPage(){
   /* CALCULAMOS LA POSICION DE LA PAGINA */ 
    const start = (this.current-1)*this.pageSize;
    /* CREAMOS UN SUBARREGLO CON LOS POKEMOS POR PAGINA */
    const page  = this.filteredList.slice(start, start+this.pageSize);

    /* RENDERIAMOS CADA POKEMON CON EL ITEM POKEMON-ITEM */
    this.$items.textContent = '';
    page.forEach(p=>{
      const item = document.createElement('pokemon-item');
      item.setAttribute('pid',   p.id);
      item.setAttribute('name',  p.name);
      item.setAttribute('img',   p.img);
      item.setAttribute('type',  p.type);
      item.setAttribute('favorite', this.favorites.has(p.id));
      item.pid = p.id;
      this.$items.appendChild(item);
    });

    /* ACTUALIZA EL PAGINADOR APRA INDICAR LA PAGINA  */
    this.$info.textContent  = `Página ${this.current} / ${this.totalPages}`;
    /* DESACTIVILITA PREV SI ES PAGINA 1 */
    this.$prev.disabled     = (this.current===1);
    /* DESACTIVILITA NEXT SI ES PAGINA FINAL */
    this.$next.disabled     = (this.current===this.totalPages);
  }

  goto(n){
    if(n<1 || n>this.totalPages) return;
    this.current = n;
    this.renderPage();
  }

  forward(evt){
    /* ENVIAMOS UN EVENTO DE TIPO POKEMON-SELECTED EN EL APP-POKEDEX LA USA EL BINDING */
    this.dispatchEvent(new CustomEvent('pokemon-selected',{
      /* ENVIAMOS EL DETALLE TAL CUAL , BUBBLES NOS PERMITE SUBIRLO AL DOM , COMPOSED NOS PERMITE SALIR DEL SHADOW AL POKEDEX DOM */
      detail:evt.detail, bubbles:true, composed:true
    }));
  }
/* FAVORITOS */
  favoritos(evt){
    /* GUARDAMOS ID Y FAV DEL EVENTO */
    const { id, fav } = evt.detail;
    /* SI ES FAVORITO AGREGAMOS AL SET O LO QUITAMOS */
    fav ? this.favorites.add(id) : this.favorites.delete(id);
    /* ACTUALIZAMOS EL LOCALSTORAGE CON LOS FAVORITOS */
    localStorage.setItem('pokedex_favs', JSON.stringify([...this.favorites]));
    /* SI EL FILTRO ES FAVORITOS O TODOS ACTUALIZAMOS LAS PAGINAS */
    if(this.filterMode !== 'all') this.updatePages();
  }
}

customElements.define('pokemon-list', PokemonList);
