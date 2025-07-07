import { agruparPorTipo } from '../motor/helpers.js';


 //funcion generar tabla de resumen
function generarTablaResumen(titulo, data) {
  const rows = Object.entries(data)
    .map(([t, n]) => `<tr><td>${t}</td><td>${n}</td></tr>`)
    .join('');

  return `
  <details>
    <summary>${titulo}</summary>
    <table class="tabla-estadisticas">
      <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </details>`;
}

 //funcion generar subgrupo
function generarSubgrupo(titulo, agrupado, campos = []) {
  let html = `<details><summary>${titulo}</summary>`;
  for (const tipo in agrupado) {
    const lista = agrupado[tipo];
    html += `
      <details>
        <summary>${tipo} — Cantidad: ${lista.length}</summary>
        <table class="tabla-estadisticas">
          <thead><tr>${campos.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>
            ${lista
              .map(
                obj =>
                  `<tr>${campos
                    .map(c => `<td>${obj[c] ?? ''}</td>`)
                    .join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </details>`;
  }
  html += `</details>`;
  return html;
}


 //funcion informe final
export function renderInformeFinal(stats, ganador) {
  const logDiv = document.getElementById('log-guerra');
  const resumen = document.createElement('div');

  resumen.innerHTML = `
    <details open>
      <summary><strong>Ganador: ${ganador.nombre}</strong></summary>

      <details open><summary>Estadísticas Final de la Guerra</summary>
        <ul>
          <li><strong>Golpes críticos:</strong> ${stats.golpes_criticos}</li>
          <li><strong>Daño total:</strong> ${stats.daño_total}</li>
          <li><strong>Pérdidas propias:</strong> ${stats.unidades_perdidas}</li>
          <li><strong>Unidades ilesas:</strong> ${stats.ilesas_stats.length}</li>
          <li><strong>Al médico/taller:</strong> ${stats.al_medico.size}</li>
        </ul>
      </details>

      ${generarTablaResumen('Tropas Eliminadas por Tipo', stats.eliminadas_tipo)}
      ${generarSubgrupo('Golpes Críticos',agruparPorTipo(stats.criticos_stats, 'atacanteTipo'),
        ['atacanteId', 'objetivoId', 'dañoBase', 'climaPct', 'dañoFinal', 'dañoReal', 'vidaAntes', 'vidaDespues', 'critico'])}
      ${generarSubgrupo(
        'Para el Médico / Taller',agruparPorTipo(stats.medico_stats, 'tipo'),
        ['id', 'vida', 'vidaMaxima'])}
      ${generarSubgrupo(
        'Tropas Ilesas',agruparPorTipo(stats.ilesas_stats, 'tipo'),
        ['id'])}
      ${generarSubgrupo(
        ' Tropas Perdidas',agruparPorTipo(stats.perdidas_stats, 'tipo'),
        ['id', 'turno'])}
      ${generarSubgrupo(
        'Tropas Vivas',agruparPorTipo(ganador.unidades_vivas(), 'tipoUnidad'),
        ['id', 'vidaMaxima', 'vida'])}
    </details>`;

  logDiv.appendChild(resumen);
}
