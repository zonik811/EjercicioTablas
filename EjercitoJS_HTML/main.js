import { inicializar_formularios_configuracion } from './ui/formularios_configuracion.js';
import { inicializar_botones_ejercitos }        from './controladores/control_ejercitos.js';
import { inicializar_boton_batalla }            from './controladores/control_batalla.js';

let ejercito_a = null;
let ejercito_b = null;

document.addEventListener('DOMContentLoaded', () => {
  inicializar_formularios_configuracion();

  inicializar_botones_ejercitos({
    cuando_se_crean: (a, b) => 
      {
       ejercito_a = a; 
       ejercito_b = b; 
      }
  });

  inicializar_boton_batalla(
    () => ejercito_a,
    () => ejercito_b
  );
});
