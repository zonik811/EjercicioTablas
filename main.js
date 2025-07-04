import { crear_ejercito } from "./Ejercitos.js";
import { combatir } from "./Guerra_Logica.js";
import { setVidaSubmarino, setAtaqueSubmarino, actualizarFraccionesVida } from "./Datos_Base.js";

let ejercitoA = null;
let ejercitoB = null;

import { imagenesUnidad } from "./Datos_Base.js";


// ───────────────────────────────────────────────────────────────
// Configurar inputs del submarino y fracciones
// ───────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const inputVida = document.getElementById("vida-submarino");
  const inputAtaque = document.getElementById("ataque-submarino");

  // Valores iniciales visibles
  inputVida.value = 2500;
  inputAtaque.value = 500;

  inputVida.addEventListener("change", () => {
    const valor = parseInt(inputVida.value);
    if (!isNaN(valor)) {
      setVidaSubmarino(valor);
      console.log("Vida submarino actualizada:", valor);
    }
  });

  inputAtaque.addEventListener("change", () => {
    const valor = parseInt(inputAtaque.value);
    if (!isNaN(valor)) {
      setAtaqueSubmarino(valor);
      console.log("Ataque submarino actualizado:", valor);
    }
  });

  // ──────────────── Formulario de fracción de vida ────────────────
  const formFraccion = document.getElementById("form-fraccion-vida");
  const inputs = formFraccion.querySelectorAll('input[type="text"]');

  inputs.forEach(input => {
    input.addEventListener('change', () => {
      const nuevasFracciones = {};
      let nuevoDenominador = null;

      inputs.forEach(campo => {
        const nombre = campo.name;
        const partes = campo.value.split('/');
        if (partes.length === 2) {
          const numerador = parseInt(partes[0]);
          const denominador = parseInt(partes[1]);
          if (!isNaN(numerador) && !isNaN(denominador) && denominador !== 0) {
            nuevasFracciones[nombre] = numerador;
            nuevoDenominador = denominador; 
          }
        }
      });

      if (nuevoDenominador !== null) {
        actualizarFraccionesVida(nuevasFracciones, nuevoDenominador);
        console.log("Fracciones de vida actualizadas:", nuevasFracciones, "Denominador:", nuevoDenominador);
      }
    });
  });
});

export function renderizarResumenEjercitos() {
  const htmlA = generarTablaEjercito("Ejército A", ejercitoA.unidades);
  const htmlB = generarTablaEjercito("Ejército B", ejercitoB.unidades);
  document.getElementById("info-ejercitos").innerHTML = `${htmlA}${htmlB}`;
}


// ───────────────────────────────────────────────────────────────
// Botón: Crear Ejércitos
// ───────────────────────────────────────────────────────────────
function generarTablaEjercito(nombre, unidades) {
  const resumen = {};

  unidades.forEach(u => {
    if (!resumen[u.tipoUnidad]) {
      resumen[u.tipoUnidad] = {
        cantidad: 0,
             vida: u.vidaMaxima,
      ataque: u.ataqueMaximo,
        vidaTotal: 0
      };
    }
    resumen[u.tipoUnidad].cantidad += 1;
    resumen[u.tipoUnidad].vidaTotal += u.vida;
  });

  let html = `<h4>${nombre} - Unidades Iniciales :</h4>`;
  html += `<table class="tabla-ejercito">
    <thead>
      <tr>
        <th>Unidad</th>
        <th>Cantidad</th>
        <th>Vida</th>
        <th>Ataque</th>
        <th>Vida Total</th>
      </tr>
    </thead>
    <tbody>`;
  
for (const tipo in resumen) {
  const imagenSrc = imagenesUnidad[tipo] || "";
  html += `
    <tr>
      <td style="display: flex; align-items: center; gap: 6px;">
        <img src="${imagenSrc}" alt="${tipo}" width="24" height="24">
        ${tipo}
      </td>
      <td>${resumen[tipo].cantidad}</td>
      <td>${resumen[tipo].vida}</td>
      <td>${resumen[tipo].ataque}</td>
      <td>${resumen[tipo].vidaTotal}</td>
    </tr>
  `;
}

   // Calcular la vida total del ejército sumando los vidaTotal por tipo
  const vidaTotalEjercito = Object.values(resumen).reduce((sum, r) => sum + r.vidaTotal, 0);

  html += `
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" style="text-align: right;"><strong>Vida Total del ${nombre}:</strong></td>
        <td><strong>${vidaTotalEjercito}</strong></td>
      </tr>
    </tfoot>
  </table>`;
  return html;
}

document.querySelector(".crear-btn").addEventListener("click", () => {
  ejercitoA = crear_ejercito("Ejército A");
  ejercitoB = crear_ejercito("Ejército B");

renderizarResumenEjercitos();

  document.getElementById("log-guerra").innerHTML = ''; // limpiar log si lo hay
});

// ───────────────────────────────────────────────────────────────
// Botón: Iniciar Batalla
// ───────────────────────────────────────────────────────────────
document.querySelector(".fight-btn").addEventListener("click", () => {
  if (!ejercitoA || !ejercitoB) {
    alert("Primero crea los ejércitos");
    return;
  }
  combatir(ejercitoA, ejercitoB,renderizarResumenEjercitos);
});

// ───────────────────────────────────────────────────────────────
// Botón: Nueva Simulación (Recargar página)
// ───────────────────────────────────────────────────────────────
document.querySelector(".nueva-btn").addEventListener("click", () => {
  location.reload();
});
