import { crear_ejercito } from "./Ejercitos.js";
import { combatir } from "./Guerra_Logica.js";

const alfa = crear_ejercito('Alfa');
const bravo = crear_ejercito('Bravo');

combatir(alfa,bravo);