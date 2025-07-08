
const tpl = document.createElement('template');
tpl.innerHTML = /* html */`
<style>
  :host{
     /* ---------- COLOCAMOS POSICION RELATIVA PARA USAR BEFORE ---------- */
    position:relative;
     /* ---------- DEFINICION DE VARIABLES ---------- */
    --border:#555;     
    --metal:#ccc; 
    --metal-light:#ddd;  
    --metal-dark:#999;
 /* ---------- OCUPA ANCHIO TOTAL , REDONDEAMOS BORDES , AJUSTAMOS TAMAÑO , MARGIN , FONT  ---------- */
    display:block;

    border-radius:14px;
    overflow:hidden;
    width:min(100%,330px);
    margin:auto;
    font-family:'Segoe UI',Arial,Helvetica,sans-serif;
  }

  /* ---------- DEFINIMOS BEFORE ---------- */
  :host::before{
    content:''; position:absolute; inset:0;
    padding:4px; border-radius:14px;
    background:/* ---------- GRADIENTE ---------- */
      conic-gradient(
        from 0deg,
        transparent 0deg,
        var(--border) 90deg,
        #fff 120deg,
        var(--border) 180deg,
        transparent 270deg);
    background-size:200% 200%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor; mask-composite:exclude;
    animation:brillo 3s linear infinite;
  }
  @keyframes brillo{
    0%{background-position:0 0;} 100%{background-position:200% 200%;}
  }

 .card{
  position:relative; 
  border:2px solid var(--border);
  border-radius:10px;
  overflow:hidden;
  background:
    linear-gradient(145deg,
      var(--metal-light)  0%,
      var(--metal)        25%,
      var(--metal-dark)   50%,
      var(--metal)        75%,
      var(--metal-light) 100%),
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,.10) 0px,
      rgba(255,255,255,.10) 1px,
      transparent           1px,
      transparent           3px);
  background-size: 300% 300%, 100% 100%;
  box-shadow:0 4px 10px rgba(0,0,0,.18);
}
  /* ---------- DEFINIMOS BEFORE ---------- */
:host::before{
  content:'';
  position:absolute; inset:0;
  padding:4px; border-radius:14px;
  background:
    conic-gradient(
      from 0deg,
      transparent 0deg,
      var(--border) 90deg,
      #fff 120deg,
      var(--border) 180deg,
      transparent 270deg);
  background-size:200% 200%;
  z-index:5;               
  pointer-events:none; 
  -webkit-mask:linear-gradient(#000 0 0) content-box,
               linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
          mask-composite:exclude;
  animation:shine 3s linear infinite;
}


  header{
    display:flex;
    justify-content:space-between;
    align-items:center;
        padding:.5rem .75rem;
         font-weight:700;
         font-size:1.1rem;
         border-bottom:2px solid var(--border);
         text-transform:capitalize;}
  .hp{font-size:.9rem;}

  .art{display:flex;
    justify-content:center;
    border-bottom:2px solid var(--border);}
  .art img{width:60%;
    max-width:200px;
    height:auto;}

  table{width:100%;
    border-collapse:collapse;
    font-size:.8rem;
    margin-top:.25rem;}
  th,td{padding:.45rem .65rem;
    vertical-align:top;}
  th{width:40%;
    font-weight:600;
    text-align:left;}
  details{margin:.2rem 0;} summary{cursor:pointer;font-weight:600;}
  .loading,.error{padding:2rem;text-align:center;color:#666;}
  .error{color:#b00;}
</style>

<!-- CARGANDO -->
<div class="loading">Cargando…</div>

<!-- CARTA -->
<div class="card" hidden>
  <header>
    <span class="name"><slot name="name"></slot></span>
    <span class="hp"><span id="hp-top"></span> HP</span>
  </header>

  <div class="art"><img id="official" alt="artwork"></div>

  <table>
    <tbody>
      <tr><th>Tipo</th>              <td id="type"></td></tr>
      <tr><th>Habilidades</th>       <td id="abilities"></td></tr>
      <tr><th>Zonas de encuentro</th><td id="locations"></td></tr>
      <tr><th>Base XP</th>           <td id="xp"></td></tr>
      <tr><th>Altura</th>            <td id="height"></td></tr>
      <tr><th>Ataque</th>            <td id="atk"></td></tr>
      <tr><th>Defensa</th>           <td id="def"></td></tr>
      <tr><th>Velocidad</th>         <td id="spd"></td></tr>
    </tbody>
  </table>
</div>

<div class="error" hidden>NO SE ENCONTRÓ EL POKÉMON</div>
`;


class PokemonCard extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this.$loading   = this.shadowRoot.querySelector('.loading');
    this.$error     = this.shadowRoot.querySelector('.error');
    this.$card      = this.shadowRoot.querySelector('.card');
    this.$header    = this.shadowRoot.querySelector('header');
    this.$art       = this.shadowRoot.querySelector('.art');
    this.$table     = this.shadowRoot.querySelector('table');
    this.$nameSlot  = this.shadowRoot.querySelector('slot[name="name"]');
    this.$hpTop     = this.shadowRoot.getElementById('hp-top');
    this.$abilities = this.shadowRoot.getElementById('abilities');
    this.$locations = this.shadowRoot.getElementById('locations');
    this.$official  = this.shadowRoot.getElementById('official');
  }

  /* ---------- carga y render ---------- */
  async loadPokemon(id){
    this.$loading.hidden=false; this.$error.hidden=true; this.$card.hidden=true;
    [this.$header,this.$art,this.$table].forEach(el=>el.hidden=true);

    try{
      const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r=>r.json())
      const mainType = data.types[0].type.name;
      const palette = {
        grass:'#78C850', fire:'#F08030', water:'#6890F0',
        bug:'#A8B820', normal:'#A8A878', poison:'#A040A0',
        electric:'#F8D030', ground:'#E0C068', fairy:'#EE99AC',
        fighting:'#C03028', psychic:'#F85888', rock:'#B8A038',
        ghost:'#705898', ice:'#98D8D8', dragon:'#7038F8',
        dark:'#705848', steel:'#B8B8D0'
      };
      const base = palette[mainType] || '#888';
      this.style.setProperty('--border', base);
      this.style.setProperty('--metal', base);
      this.$nameSlot.innerHTML = data.name;
      this.$hpTop.textContent  = data.stats.find(s=>s.stat.name==='hp')?.base_stat ?? '';
      this.$header.hidden=false;

      /* DIBUJO */
      this.$official.src = data.sprites.other['official-artwork'].front_default
                        || data.sprites.front_default;
      this.$art.hidden=false;

      /* TIPO */
      const stat = n=> data.stats.find(s=>s.stat.name===n)?.base_stat ?? '—';
      this.shadowRoot.getElementById('type').textContent =
        data.types.map(t=>t.type.name).join(' / ');

      /* SKILLS */
      this.$abilities.innerHTML = (await Promise.all(
        data.abilities.map(async ({ability})=>{
          const info = await fetch(ability.url).then(r=>r.json());
          const ent  = info.effect_entries.find(e=>e.language.name==='es')
                   ?? info.effect_entries.find(e=>e.language.name==='en');
          const desc = ent ? ent.short_effect || ent.effect : '';
          return `<details><summary>${ability.name}</summary><p>${desc}</p></details>`;
        })
      )).join('');

      /* ZONAS */
      const enc = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`).then(r=>r.json());
      this.$locations.innerHTML = enc.length
        ? '<ul style="margin:.25rem 0;padding-left:1rem;">'
          + enc.slice(0,6).map(e=>`<li>${e.location_area.name.replace(/-/g,' ')}</li>`).join('')
          + '</ul>'
        : '— No hay datos —';

      /*  STATS*/
      this.shadowRoot.getElementById('xp').textContent     = data.base_experience;
      this.shadowRoot.getElementById('height').textContent = `${data.height} cm`;
      this.shadowRoot.getElementById('atk').textContent    = stat('attack');
      this.shadowRoot.getElementById('def').textContent    = stat('defense');
      this.shadowRoot.getElementById('spd').textContent    = stat('speed');

      /* MOSTRAR */
      this.$table.hidden=false; this.$loading.hidden=true; this.$card.hidden=false;

    }catch(err){
      console.error(err);
      this.$loading.hidden=true; this.$error.hidden=false;
    }
  }
}

customElements.define('pokemon-card', PokemonCard);
