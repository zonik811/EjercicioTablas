export class DataManager {
    // --- GUARDAR PERSONAJES ---
  static personajes = [];
  // --- GUARDAR DIMENSIONES EN MAP , CLAVE VALOR ---
  static dimensiones = new Map(); 

 // --- METODO GETALL PARA TRAER TODOS LOS PERSONAJES ---
  static async getAll() {
    // --- VERIFICAMOS SI YA AHI PERSONAJES CARGADOS Y LOS DEVOLVEMOS ---
    if (this.personajes.length) return this.personajes;
   // --- INICIAMOS EN PAGINA 1---
    let page = 1;
    // --- CICLO HASTA QUE SEA FALSE ---
    while (true) {
        // --- FETCH AL API POR PAGINA ---
      const res  = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const json = await res.json();
      // --- CREAMOS LOTE , USAMOS PROMISE ALL PARA HACER EL PARALELO EL FETCH , RECORREMOS CON MAP LOS PERSONAJES DE LA PAGINA ---
      const lote = await Promise.all(json.results.map(async p => {
        // --- USAMOS GET DIMENSION PARA OBTENER CON LA URL LA DIMENSIONES ---
        const dimension_origen   = await this.getDimension(p.origin.url);
        const dimension_ubicacion = await this.getDimension(p.location.url);
        // --- RETORNAMOIS P ORIGINAL Y LAS DIMENSIONES DE P  ---
        return {
          ...p,
          dimension_origen,
          dimension_ubicacion
        };
      }));
      // --- CARGAMOS PERSONAJE CON SUS DIMENSIONES AL LOTE ---
      this.personajes.push(...lote);
      // --- SI NO AHI SIGUENTE TERMINA ---
      if (!json.info.next) break;
      // --- AUMENTAMOS LA PAGINA ---
      page++;
    }
// --- DEVOLVEMOS PERSONAJES ---
    return this.personajes;
  }

// --- RECIBIMOS STATUS Y ORIGIN ---
  static async filter({ status, origin } = {}) {
    
// --- SI NO AHI PERSONAJES CARGADOS LOS CARGA  ---
    const data = await this.getAll();

// --- FILTRO SOBRE LA DATA ---
    return data.filter(c => {
        
// --- REVISAMOS EL STATUS CON EL STATUS DE C EN MINUZCULA ---
      const okStatus = status ? c.status.toLowerCase() === status : true;
      const okOrigin = origin ? c.origin.name.toLowerCase().includes(origin.toLowerCase()): true;
      return okStatus && okOrigin;
    });
  }

// --- OBTENER DIMENSION , RECIBE URL DE LA DIMENSION Y LA CONSULTA  ---
  static async getDimension(url) {
    // --- SI NO LLEGA URL VALIDA ENVIA DESCOCIDO  ---
    if (!url) return 'unknown';
    
    if (this.dimensiones.has(url)) return this.dimensiones.get(url);

    try {
      const res = await fetch(url);
      const json = await res.json();
      const dim = json.dimension || 'unknown';
      this.dimensiones.set(url, dim);
      return dim;
    } catch {
      return 'unknown';
    }
  }
}
