  /* ----------------------------contante Valores Referencia Maxima------------------------------------- */
export const vida_submarino   = 2500;
export const ataque_submarino =   500;
/* ------------------------------constante Valor Maximo Fraccion-------------------------------------------------- */
const referencia_vida_maxima   = 12;
const referencia_ataque_maximo = 14;
  /* ----------------------------Lista de constante vida fraccion segun unidad------------------------------- */
const vida_const = {
  soldado_regular     :  2,
  soldado_profesional :  3,
  soldado_elite       :  4,
  carroTanque         :  7,
  helicoptero         :  8,
  avion_combate       : 10,   
  submarino           : 12
};
  /* --------------------------Lista de constante ataque fraccion segun unidad------------------------------------------ */
const ataque_const = {
  soldado_regular     :  1,
  soldado_profesional :  2,
  soldado_elite       :  3,
  carroTanque         :  4,
  helicoptero         :  5,
  avion_combate       :  6,
  submarino           : 14
};
  /* ------------------------Funcion construir que crea una tabla_referencia que contiene en cada valor un tipo de unidad---------------------------------------------------- */
function construir(numerador, denominador, referencia) {
  const tabla_referencia = {};
  for (const tipoUnidad in numerador) {
    tabla_referencia[tipoUnidad] = Math.round((numerador[tipoUnidad] / denominador) * referencia);
  }
  return tabla_referencia;
}
  /* ------------------------Creamos tabla de constantes vida--------------------------------- */
export const Vida   = construir(vida_const,   referencia_vida_maxima,   vida_submarino);
  /* -------------------------Creamos tabla de constantes Ataque--------------------------------- */
export const Ataque = construir(ataque_const, referencia_ataque_maximo, ataque_submarino);
  /* ------------------------Creamos una lista de Tipo Unidad de referencia------------------------------- */
export const tipo_unidad = Object.keys(Vida);
