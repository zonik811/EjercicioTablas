import { imagenesUnidad } from '../Datos_Base.js';

// Genera la tabla para ambos ejércitos
export function renderizar_resumen_ejercitos(ejercito_a, ejercito_b) {
  const contenedor = document.getElementById('info-ejercitos');
  contenedor.innerHTML =
    construir_tabla(ejercito_a) + construir_tabla(ejercito_b);
}

function construir_tabla(ejercito) {
  const acumulado = {};

  ejercito.unidades.forEach(u => {
    const tipo = u.tipoUnidad;
    if (!acumulado[tipo]) {
      acumulado[tipo] = {
        cantidad: 0,
        vida_unidad: u.vidaMaxima,
        ataque_unidad: u.ataqueMaximo,
        vida_total: 0
      };
    }
    acumulado[tipo].cantidad++;
    acumulado[tipo].vida_total += u.vida;
  });

  const filas = Object.entries(acumulado).map(([tipo, datos]) => `
    <tr>
      <td><img src="${imagenesUnidad[tipo]}" width="24"> ${tipo}</td>
      <td>${datos.cantidad}</td>
      <td>${datos.vida_unidad}</td>
      <td>${datos.ataque_unidad}</td>
      <td>${datos.vida_total}</td>
    </tr>
  `).join('');

  const vida_total_ejercito = Object.values(acumulado)
    .reduce((s, d) => s + d.vida_total, 0);

  return `
    <h4>${ejercito.nombre}</h4>
    <table class="tabla-ejercito">
      <thead>
        <tr><th>Tipo</th><th>#</th><th>Vida</th><th>Ataque</th><th>Vida total</th></tr>
      </thead>
      <tbody>${filas}</tbody>
      <tfoot>
        <tr><td colspan="4">Vida total</td><td>${vida_total_ejercito}</td></tr>
      </tfoot>
    </table>
  `;
}
