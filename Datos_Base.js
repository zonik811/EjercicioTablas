// Vida y ataque del submarino (valores iniciales)
export const configuracionSubmarino = {
  vida: 2500,
  ataque: 500
};

// -------------------- Referencias para fracciones --------------------
let referencia_vida_maxima   = 12;
const referencia_ataque_maximo = 14;

// -------------------- Fracción de vida por tipo de unidad --------------------
let vida_const = {
  soldado_regular     :  2,
  soldado_profesional :  3,
  soldado_elite       :  4,
  carroTanque         :  7,
  helicoptero         :  8,
  avion_combate       : 10,
  submarino           : 12
};

export const imagenesUnidad = {
  soldado_regular: "img/soldado_regular.png",
  soldado_profesional: "img/soldado_profesional.png",
  soldado_elite: "img/soldado_elite.png",
  carroTanque: "img/carro_tanque.png",
  helicoptero: "img/helicoptero.png",
  avion_combate: "img/avion_combate.png",
  submarino: "img/submarino.png"
};

// -------------------- Fracción de ataque por tipo de unidad --------------------
const ataque_const = {
  soldado_regular     :  1,
  soldado_profesional :  2,
  soldado_elite       :  3,
  carroTanque         :  4,
  helicoptero         :  5,
  avion_combate       :  6,
  submarino           : 14
};

// -------------------- Función para construir tabla de vida/ataque --------------------
function construir(numerador, denominador, referencia) {
  const tabla_referencia = {};
  for (const tipoUnidad in numerador) {
    tabla_referencia[tipoUnidad] = Math.round((numerador[tipoUnidad] / denominador) * referencia);
  }
  return tabla_referencia;
}

// -------------------- Refrescar valores cuando cambie el submarino --------------------
function recalcularTablas() {
  Vida = construir(vida_const, referencia_vida_maxima, configuracionSubmarino.vida);
  Ataque = construir(ataque_const, referencia_ataque_maximo, configuracionSubmarino.ataque);
}

// -------------------- Se actualizan dinámicamente desde el formulario --------------------
let Vida   = construir(vida_const, referencia_vida_maxima, configuracionSubmarino.vida);
let Ataque = construir(ataque_const, referencia_ataque_maximo, configuracionSubmarino.ataque);

// -------------------- Funciones públicas --------------------
export function getVida()   { return Vida; }
export function getAtaque() { return Ataque; }

export function setVidaSubmarino(nuevaVida) {
  configuracionSubmarino.vida = nuevaVida;
  recalcularTablas();
}

export function setAtaqueSubmarino(nuevoAtaque) {
  configuracionSubmarino.ataque = nuevoAtaque;
  recalcularTablas();
}

// -------------------- Actualizar fracciones de vida desde el formulario --------------------
export function actualizarFraccionesVida(nuevosNumeradores, nuevoDenominador) {
  if (!nuevoDenominador || nuevoDenominador === 0) return;

  for (const tipo in nuevosNumeradores) {
    if (!isNaN(nuevosNumeradores[tipo])) {
      vida_const[tipo] = nuevosNumeradores[tipo];
    }
  }

  referencia_vida_maxima = nuevoDenominador;
  recalcularTablas();
}

// Para listar tipos de unidad disponibles
export const tipo_unidad = Object.keys(vida_const);
