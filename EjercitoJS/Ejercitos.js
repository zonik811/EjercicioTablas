import { tipo_unidad }           from './Datos_Base.js';
import { entero_aleatorio }      from './Randomnizador.js';
import { Unidades }              from './Unidades.js';
 /* ----Creamos Constante de Rangos Por Uniudad--------------------------------- */
const rangos_permitidos = {
  soldado_regular     : [500, 1000],
  soldado_profesional : [500, 1000],
  soldado_elite       : [200,  300],
  carroTanque         : [ 50,  100],
  helicoptero         : [ 30,   50],
  avion_combate       : [ 50,   75],   
  submarino           : [  1,    2]
};
 /* ----Creamos Clase Ejercitos-------------------------------- */
export class Ejercitos {

 /* ----Creamos Contructor--------------------------------- */
  constructor(nombre, unidades = []) {
    this.nombre   = nombre;
    this.unidades = unidades;
  }
 /* ----Creamos Funcion para   unidades vivas--------------------------------- */
  unidades_vivas() { 
    return this.unidades.filter(unidad => unidad.estaViva());
 }
  /* ----Creamos funcion Para Saber si sigue vivo mirando que en unidades vivas alla almenos 1 --------------------------------- */
  ejercito_vivo() { 
    return this.unidades_vivas().length > 0;
 }
  /* ----Creamos funcion Para Saber cuantas unidades siguen vivas midiendo el array  --------------------------------- */
  contar_vivas(){
     return this.unidades_vivas().length; 
    }
}
  /* ----Creamos funcion Para Crear un Ejercito --------------------------------- */
export function crear_ejercito(nombre) {

  const unidades = [];
    /* ----Creamos variable para inicializar el ID  --------------------------------- */
  let id = 1;
  /* ----Ciclo For recorre tipo_unidad  --------------------------------- */
  for (const tipo of tipo_unidad) {
  /* ----asigna a min y max los valores de rangos_permitidos por tipo  --------------------------------- */
    const [min, max] = rangos_permitidos[tipo];
  /* ----Crea una constante n que obtendra un valor aleatorio entre min y max del rango permitido para ese tipo  --------------------------------- */
    const n = entero_aleatorio(min, max);
  /* ----ciclo for para crear la n cantidad de Objetos de cada tipo , aumentando su id de forma progresiva --------------------------------- */
    for (let i = 0; i < n; i++) unidades.push(new Unidades(tipo, id++));
  }
  return new Ejercitos(nombre, unidades);
}
