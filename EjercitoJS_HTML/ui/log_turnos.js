import { imagenesUnidad } from '../Datos_Base.js';
export function agregarTurnoAlLog
(
  turno,
  fases,
  eventos_tipo,
  ejA,
  ejB,
  actualizarResumen
) 
{
 //buscamos el div
  const logDiv = document.getElementById('log-guerra');
  //Calculamos los turnos para agrupar de 10 en 10 
  const gIni = Math.floor((turno - 1) / 10) * 10 + 1;
  const gFin = gIni + 9;
  const groupId = `grupo-${gIni}-${gFin}`;
 //Buscamos el group div
  let groupDiv = document.getElementById(groupId);
   //si lo encuentra

  if (!groupDiv) {
     //Buscamos el group div
    logDiv.insertAdjacentHTML(
      'beforeend',
      `<details class="grupo-turnos">
         <summary><strong>Turnos ${gIni} – ${gFin}</strong></summary>
         <div id="${groupId}" class="bloque-turnos"></div>
       </details>`
    );
    groupDiv = document.getElementById(groupId);
  }
 //Contruimos el turno
  let html = '';
  fases.forEach(({ eventosAgrupados, dañoTotal, criticos, eliminadas }, idx) => 
    {
    const nombre = idx === 0 ? ejA.nombre : ejB.nombre;
    html += `
      <details class="subturno-log">
        <summary><strong>${nombre} ataca</strong></summary>
        ${renderEventos(eventosAgrupados)}
        <div class="resumen-turno-fase">
          <strong>Resumen:</strong> Daño: <strong>${dañoTotal}</strong> —
           Eliminados: <strong>${eliminadas}</strong> —
           Críticos: <strong>${criticos}</strong>
        </div>
      </details>`;
  });
   //Buscamos el group div

  groupDiv.insertAdjacentHTML(
    'beforeend',
    `<details class="turno-log">
       <summary><strong>Turno ${turno}</strong></summary>
       ${html}
     </details>`
  );

  //Mostramos en Consola
  console.groupCollapsed(`Turno ${turno}`);
  for (const [tipo, lista] of Object.entries(eventos_tipo)) {
    console.groupCollapsed(`${tipo} — ${lista.length} ataques`);
    console.table(
      lista.map(ev => ({
        atacanteId: ev.atacanteId,
        objetivoId: ev.objetivoId,
        dañoReal: ev.dañoReal,
        critico: ev.critico ? 'Critico' : 'No Critico'
      }))
    );
    console.groupEnd();
  }
  console.groupEnd();

   //Actualizamos el centro
  actualizarResumen?.(ejA, ejB);
}

//Termina Funcion


//Inicia Helper

function renderEventos(eventosAgrupados) {
  let salida = '';
  for (const tipo in eventosAgrupados) {
    const lista = eventosAgrupados[tipo];
    const img = imagenesUnidad[tipo] || '';
    salida += `
      <details class="subtipo-log">
        <summary>
          <img src="${img}" width="20" class="me-1" />
          <strong>${tipo}</strong> — ${lista.length} ataques
        </summary>
        <table class="mini-log-tabla">
          <thead>
            <tr><th>Atacante</th><th>Objetivo</th><th>Daño</th><th>Crítico</th></tr>
          </thead>
          <tbody>
            ${lista
              .map(
                ev => `<tr>
                  <td>${ev.atacanteTipo} #${ev.atacanteId}</td>
                  <td>${ev.objetivoTipo} #${ev.objetivoId}</td>
                  <td>${ev.dañoReal}</td>
                  <td>${ev.critico ? 'Sí' : 'No'}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </details>`;
  }
  return salida;
}
