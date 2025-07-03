import { crear_ejercito } from "./Ejercitos.js";
import { combatir } from "./Guerra_Logica.js";
 /* ----Creamos Ejercito A--------------------------------- */
const ejercito_a = crear_ejercito('ejercito_a');
 /* ----Creamos Ejercito B--------------------------------- */
const ejercito_b = crear_ejercito('ejercito_b');
 /* ----Usamos funcion Combatir pasando como parametros los objetos creados--------------------------------- */
combatir(ejercito_a,ejercito_b);