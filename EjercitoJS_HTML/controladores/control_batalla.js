
// Maneja el boton pelea y nueva batalla 

import { combatir } from '../motor/combate.js';
import { renderizar_resumen_ejercitos } from '../ui/tabla_resumen.js';
// inicializa el boton de batalla con los dos ejercitos  
export function inicializar_boton_batalla(obtener_ejercito_a, obtener_ejercito_b) {
// asigna boton pelea 
  const btn_fight  = document.querySelector('.fight-btn');
// asigna boton nueva batalla 
  const btn_nueva  = document.querySelector('.nueva-btn');

// Ocultamos boton de nueva nguerra con d-none 
  btn_nueva.classList.add('d-none');

// evento del botón pelear
  btn_fight.addEventListener('click', async () => {
    const ejercito_a = obtener_ejercito_a();
    const ejercito_b = obtener_ejercito_b();
// revisa que los ejercitos existan
    if (!ejercito_a || !ejercito_b) {alert('Primero crea los ejércitos'); return; }
// Deshabilitar el botón mientras la batalla está en curso
    btn_fight.disabled = true;
// evento del botón pelear
    await combatir(ejercito_a, ejercito_b, () =>
      renderizar_resumen_ejercitos(ejercito_a, ejercito_b)
    );

// Cuando termina batalla muestra boton pelea y quita propiedad d-none
    btn_nueva.classList.remove('d-none');
    btn_fight.disabled = false;
  });
}
