// Creamos un componente Web 
export class TarjetaPublicacion extends HTMLElement {
  // Atributos
  static observedAttributes = ['titulo', 'cuerpo', 'usuario', 'id-publicacion'];
// Constructor
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._comentarios          = null; 
    this._cantidadComentarios  = 0;
  }

// Inicia Callback
  connectedCallback() {
    this.renderizar();    
    this.cargarCantidadComentarios(); 
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.classList.contains('boton-comentarios')) {
        this.cambiarVisibilidadComentarios();
      }
    });
  }
// finaliza Callback
// Inicia 
  attributeChangedCallback() {
    if (this.isConnected) this.renderizar();
  }
// finaliza

// Inicia Cargar Cantidad de comentarios
  cargarCantidadComentarios() {
    const id = this.getAttribute('id-publicacion');
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then((res) => res.json())
      .then((comentarios) => {
        this._comentarios         = comentarios;
        this._cantidadComentarios = comentarios.length;
        this.actualizarTextoBoton();
      })
      .catch((err) => console.error('Error cargando comments:', err));
  }
// Actualizar Texto de boton ver numero de comentarios
  actualizarTextoBoton() {
    const btn = this.shadowRoot.querySelector('.boton-comentarios');
    if (btn) btn.textContent = `Ver comentarios (${this._cantidadComentarios})`;
  }
// ver comentarios
  cambiarVisibilidadComentarios() {
    // Selecionamos caja y boton 
    const caja  = this.shadowRoot.querySelector('.lista-comentarios');
    const boton = this.shadowRoot.querySelector('.boton-comentarios');

    if (caja.style.display === 'none') {
      // inyectar comentarios 
      if (caja.childElementCount === 0 && this._comentarios) {
        this._comentarios.forEach((c) => {
          caja.insertAdjacentHTML(
            'beforeend',
            `
            <div class="comentario">
              <img src="https://i.pravatar.cc/32?u=${encodeURIComponent(c.email)}" alt="${c.email}">
              <div class="texto">
                <strong>Usuario: ${c.email}</strong>
                <p>Mensaje : ${c.body}</p>
              </div>
            </div>`
          );
        });
      }
      caja.style.display = 'block';
      boton.textContent  = `Ocultar comentarios (${this._cantidadComentarios})`;
    } else {
      caja.style.display = 'none';
      boton.textContent  = `Ver comentarios (${this._cantidadComentarios})`;
    }
  }

// Renderizamos la tarjeta
  renderizar() {
    const titulo  = this.getAttribute('titulo');
    const cuerpo  = this.getAttribute('cuerpo');
    const usuario = JSON.parse(this.getAttribute('usuario')); 
    this.shadowRoot.innerHTML = `
      <style>
        @import '../../estilos.css';
      </style>
      <article class="tarjeta">
        <div class="cabecera-tarjeta">
          <img src="https://i.pravatar.cc/40?u=${usuario.id}"">
          <h4>${usuario.name}</h4>
        </div>

        <div class="titulo-publicacion">${titulo}</div>
        <div class="cuerpo-publicacion">${cuerpo}</div>

        <button class="boton-comentarios">Ver comentarios</button>
        <div class="lista-comentarios" style="display:none;"></div>
      </article>
    `;
  }
}

customElements.define('tarjeta-publicacion', TarjetaPublicacion);
