// Maneja el boton nuevo ejercito 
import { crear_ejercito }              from '../Ejercitos.js';
import { renderizar_resumen_ejercitos } from '../ui/tabla_resumen.js';

export function inicializar_botones_ejercitos({ cuando_se_crean }) {
 // asigna boton crear   
  const btn_crear = document.querySelector('.crear-btn');
  const btn_nueva = document.querySelector('.nueva-btn');
// evento al  boton crear 
  btn_crear.addEventListener('click', () => {
    const ejercito_a = crear_ejercito('Ejército A');
    const ejercito_b = crear_ejercito('Ejército B');
// muestra en pantalla el resumen inicial
    renderizar_resumen_ejercitos(ejercito_a, ejercito_b);
// agrega hijos al log-guerra 
    document.getElementById('log-guerra').innerHTML = '';

    cuando_se_crean?.(ejercito_a, ejercito_b);
  });
// boton nueva guerra que recarga  pagina
  btn_nueva.addEventListener('click', () => location.reload());
}
