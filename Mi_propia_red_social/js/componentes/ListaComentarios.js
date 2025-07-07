// creamos listaComentarios
export class ListaComentarios extends HTMLElement {
  // atributos
  static observedAttributes = ['id-publicacion'];

  connectedCallback() {
    const id = this.getAttribute('id-publicacion');
// fetch a los comments del post con id x
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then((res) => res.json())
      .then((comentarios) => {
        this.innerHTML = comentarios
          .map(
            (c) => `
            <div class="comentario">
              <img src="https://i.pravatar.cc/32?u=${encodeURIComponent(c.email)}" alt="${c.email}">
              <div class="texto">
                <strong>${c.email}</strong>
                <p>${c.body}</p>
              </div>
            </div>`
          )
          .join('');
      })
      .catch((err) => {
        console.error('Error cargando comentarios:', err);
      });
  }

}
// fin del componente , lo definimos
customElements.define('lista-comentarios', ListaComentarios);
