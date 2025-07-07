import { TarjetaPublicacion } from './TarjetaPublicacion.js';
// Definimos clase Feed 
export class Feed {

  // Constructor del Feed
  constructor(nodoRaiz) {
    this.raiz     = nodoRaiz;
    this.pagina   = 0;
    this.limite   = 10;
    this.cargando = false;
    this.usuarios = new Map();
    this.observer = null;
    this.inicializar();
  }
// Funcion Inicializar
  inicializar() {
    // llamamos funcion CargarUsuarios
    this.cargarUsuarios()
      // Despues de cargar usuarios CargarPublicaciones
      .then(() => this.cargarPublicaciones())
      //scroll infinito
      .then(() => {
        this.observer = new IntersectionObserver(
          (entradas) => {
            if (entradas[0].isIntersecting) this.cargarPublicaciones();
          },
          { rootMargin: '150px' }
        );
        this.observer.observe(document.querySelector('.loader'));
      })
      .catch(console.error); // Manejo de errores global
  }
// Fin de Funcion

// Funcion Cargar Usuarios
  cargarUsuarios() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((datos) => {
        datos.forEach((u) => this.usuarios.set(u.id, u));
      });
  }

// Funcion Cargar Publicaciones
  cargarPublicaciones() {
    if (this.cargando) return Promise.resolve(); 
    this.cargando = true;
// Consultar en post desde un inicio y limite (0) y (10) = 0 
    const inicio = this.pagina * this.limite;
    const url    = `https://jsonplaceholder.typicode.com/posts?_start=${inicio}&_limit=${this.limite}`;

    return fetch(url)
    // Guardamos respuesta en Res forma json
      .then((res) => res.json())
    // Generar 5 historias con ID aleatorio entre 0 y 1000
      .then((publicaciones) => {
        publicaciones.forEach((p) => this.agregarTarjeta(p));

        this.pagina++;
        this.cargando = false;
        // si longitud ya es 0 entonces no ahi mas publicaciones
        if (publicaciones.length === 0) {
          const loader = document.querySelector('.loader');
          loader.textContent = 'No hay más publicaciones';
          if (this.observer) this.observer.disconnect();
        }
      })
      // Manejamos error 
      .catch((err) => {
        console.error(err);
        this.cargando = false;
      });
  }
// fin funcion Cargar 
// Render de cada post
  agregarTarjeta(publicacion) {
    const usuario = this.usuarios.get(publicacion.userId);
    const tarjeta = new TarjetaPublicacion();
    tarjeta.setAttribute('titulo',  publicacion.title);
    tarjeta.setAttribute('cuerpo',  publicacion.body);
    tarjeta.setAttribute('id-publicacion', publicacion.id);
    tarjeta.setAttribute('usuario', JSON.stringify(usuario));
    this.raiz.appendChild(tarjeta);
  }
}
