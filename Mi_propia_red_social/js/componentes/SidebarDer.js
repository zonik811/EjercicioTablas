export function renderizarSidebarDer() {
  /* buscamos en el html el sidebar-der */
  const aside = document.getElementById('sidebar-der');
/* Fetch a Users */
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(usuarios => {
      aside.innerHTML =
      /* Etiqueta h4 con estilo y texto */
        '<h4 style="color:#b0b3b8;padding:0 8px 6px;">Contactos</h4>' 
        + /* sumamos al html */
        usuarios
          .map(
            /* Mapeo de usuarios  */
            (u) => `
            <div class="contacto">
              <img src="https://i.pravatar.cc/32?u=${u.id}" alt="${u.name}">
              <span>${u.name.split(' ')[0]}</span>
            </div>`
          )
          .join('');
    })
    .catch((err) => {
      console.error('Error cargando contactos:', err);
      aside.innerHTML = '<p style="color:#e35;">No se pudieron cargar los contactos.</p>';
    });
}
