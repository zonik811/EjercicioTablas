
const tpl = document.createElement('template');
tpl.innerHTML = /* html */`
<style>

  :host{
    display:flex;
    align-items:center;
    gap:.75rem;

    background:
      linear-gradient(135deg,
        #d7dde5   0%,
        #eff3f7  25%,
        #b0b7c1  50%,
        #eff3f7  75%,
        #d7dde5 100%),
      repeating-linear-gradient(
        90deg,
        rgba(255,255,255,.12) 0px,
        rgba(255,255,255,.12) 2px,
        transparent            2px,
        transparent            4px);

    border-radius:8px;
    padding:.5rem .75rem;
    font-size:.9rem;
    cursor:pointer;
    transition:filter .25s, background .25s;
  }

  :host(:not([selected]):hover){
    filter:brightness(1.08);
  }
  :host([selected]){
    background:
      linear-gradient(135deg,
        #d4af37  0%,
        #fff6c4 25%,
        #c9981a 50%,
        #fff6c4 75%,
        #d4af37 100%),
      repeating-linear-gradient(
        90deg,
        rgba(255,255,255,.2) 0px,
        rgba(255,255,255,.2) 2px,
        transparent           2px,
        transparent           4px);
    animation:goldMove 10s linear infinite;
  }
  @keyframes goldMove{
    0%   { background-position:0 0, 0 0; }
    100% { background-position:400% 0, 0 0; }
  }

  .thumb{
    width:40px;height:40px;object-fit:contain;
    background:#fff;border-radius:50%;border:2px solid #ccc;
  }
  .info{
    flex:1;display:flex;flex-direction:column;line-height:1.1;
  }
  .name{font-weight:600;text-transform:capitalize;}
  .type{font-size:.7rem;color:#555;text-transform:capitalize;}
  .star{
    font-size:1.3rem; line-height:1; cursor:pointer;
    user-select:none; transition:color .2s; color:#aaa; 
  }
  .star.fav{ color:#EBA400; } 
</style>

<img class="thumb">
<div class="info">
  <span class="name"></span>
  <span class="type"></span>
</div>
<span class="star" title="Marcar favorito">☆</span>
`;

class PokemonItem extends HTMLElement {
  static get observedAttributes(){
    return ['name','img','type','favorite','selected'];
  }

  constructor(){
    super();
    this.attachShadow({ mode:'open' }).appendChild(tpl.content.cloneNode(true));

    this.$img   = this.shadowRoot.querySelector('.thumb');
    this.$name  = this.shadowRoot.querySelector('.name');
    this.$type  = this.shadowRoot.querySelector('.type');
    this.$star  = this.shadowRoot.querySelector('.star');
  }

  connectedCallback(){
    this.addEventListener('click', e=>{
      if (e.target === this.$star) return; 
      this.parentElement?.querySelectorAll('pokemon-item[selected]').forEach(el => el.removeAttribute('selected'));
      this.setAttribute('selected','');
      this.dispatchEvent(new CustomEvent('pokemon-selected',{
        detail:{ id:this.idPokemon }, bubbles:true, composed:true
      }));
    });
    this.$star.addEventListener('click', e=>{
      e.stopPropagation();
      const newState = !this.$star.classList.contains('fav');
      this.setAttribute('favorite', newState);
      this.dispatchEvent(new CustomEvent('favorite-toggled',{
        detail:{ id:this.idPokemon, fav:newState },
        bubbles:true, composed:true
      }));
    });
  }

  attributeChangedCallback(attr, _, newVal){
    switch(attr){
      case 'name': this.$name.textContent = newVal; break;
      case 'img' : this.$img.src = newVal; break;
      case 'type': this.$type.textContent = newVal; break;
      case 'favorite': {
        const fav = newVal === 'true' || newVal === '' || newVal === true;
        this.$star.textContent = fav ? '★' : '☆';
        this.$star.classList.toggle('fav', fav);
      } break;
    }
  }

  set pid(val){ this.idPokemon = val; }
}

customElements.define('pokemon-item', PokemonItem);
