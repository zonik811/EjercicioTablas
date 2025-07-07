import {setVidaSubmarino,setAtaqueSubmarino, actualizarFraccionesVida } from '../Datos_Base.js';

export function inicializar_formularios_configuracion() {
//form submarino html instancia
  const input_vida_submarino    = document.getElementById('vida-submarino');
  const input_ataque_submarino  = document.getElementById('ataque-submarino');
  const btn_guardar_submarino   = document.getElementById('btn-guardar-submarino');
  const toast_submarino         = new bootstrap.Toast(
    document.getElementById('toast-submarino')
  );
//asignar evento click boton guardar submarino
  btn_guardar_submarino.addEventListener('click', () => {
    //tomamos los valores de los inputs
    const vida   = +input_vida_submarino.value;
    const ataque = +input_ataque_submarino.value;

      setVidaSubmarino(vida);
      setAtaqueSubmarino(ataque);
      toast_submarino.show();          
 });

 
 //fracciones
  const form_fracciones        = document.getElementById('form-fraccion-vida');
  const btn_guardar_fracciones = document.getElementById('btn-guardar-fracciones');
  const toast_fracciones       = new bootstrap.Toast(
    document.getElementById('toast-fracciones')
  );

  btn_guardar_fracciones.addEventListener('click', () => {
    const fracciones  = {};
    let denominador   = null;

    form_fracciones.querySelectorAll('input[type="text"]').forEach(input => {
      const [num, den] = input.value.split('/').map(Number);
      if (num && den) {
        fracciones[input.name] = num;
        denominador = den;   
      }
    });

    if (denominador) {
      actualizarFraccionesVida(fracciones, denominador);
      toast_fracciones.show();      
    } else {
      alert('verificar fraccion');
    }
  });
}
