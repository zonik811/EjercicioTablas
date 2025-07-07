import { tipo_unidad }      from './Datos_Base.js';
import { elegir_aleatorio } from './Randomnizador.js';
import { imagenesUnidad } from "./Datos_Base.js";

/* ----------------------------------------------------------------------------------------- */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/* ----------------------------------------------------------------------------------------- */
/* Creamos stats  */
function crear_stats(ejercito) {
  const base = Object.fromEntries(tipo_unidad.map(tipo => [tipo, 0]));
  return {
    golpes_criticos : 0,
    daño_total      : 0,
    unidades_perdidas: 0,
    sin_daño        : new Set(ejercito.unidades.map(unidad => unidad.id)),
    al_medico       : new Set(),
    eliminadas_tipo : { ...base },
    criticos_stats    : [],
    medico_stats   : [],
    perdidas_stats    : [],
    ilesas_stats      : []
  };
}

/* ----------------------------------------------------------------------------------------- */
function renderInformeFinal(statsGanador, ganador) {
  const logDiv = document.getElementById("log-guerra");
  const resumen = document.createElement("div");

  resumen.innerHTML = `
    <details open>
      <summary><strong>🏆 El Ganador es ${ganador.nombre}</strong></summary>
      
      <details open><summary>📊 Estadísticas Finales</summary>
        <ul>
          <li><strong>Golpes Críticos:</strong> ${statsGanador.golpes_criticos}</li>
          <li><strong>Daño total:</strong> ${statsGanador.daño_total}</li>
          <li><strong>Pérdidas propias:</strong> ${statsGanador.unidades_perdidas}</li>
          <li><strong>Unidades ilesas:</strong> ${statsGanador.ilesas_stats.length}</li>
          <li><strong>Al médico/taller:</strong> ${statsGanador.al_medico.size}</li>
        </ul>
      </details>

      ${generarTablaResumen('🪖 Tropas Eliminadas por Tipo', statsGanador.eliminadas_tipo)}
      ${generarSubgrupo('💥 Golpes Críticos', agruparPorTipo(statsGanador.criticos_stats, 'atacanteTipo'), [
  'atacanteId', 'objetivoId', 'dañoBase', 'climaPct', 'dañoFinal', 'dañoReal', 'vidaAntes', 'vidaDespues', 'critico'
])}
      ${generarSubgrupo('🛠️ Para el Médico / Taller', agruparPorTipo(statsGanador.medico_stats, 'tipo'), ['id', 'vida', 'vidaMaxima'])}
      ${generarSubgrupo('🛡️ Tropas Ilesas', agruparPorTipo(statsGanador.ilesas_stats, 'tipo'), ['id'])}
      ${generarSubgrupo('💀 Tropas Perdidas', agruparPorTipo(statsGanador.perdidas_stats, 'tipo'), ['id', 'turno'])}

      ${generarSubgrupo('🏅 Tropas Vivas', agruparPorTipo(ganador.unidades_vivas(), 'tipoUnidad'), ['id', 'vidaMaxima', 'vida'])}
    </details>
  `;

  logDiv.appendChild(resumen);
}
function generarTablaResumen(titulo, data) {
  let rows = '';
  for (const tipo in data) {
    rows += `<tr><td>${tipo}</td><td>${data[tipo]}</td></tr>`;
  }

  return `
    <details>
      <summary>${titulo}</summary>
      <table class="tabla-estadisticas">
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </details>
  `;
}

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
            ${lista.map(obj =>
              `<tr>${campos.map(c => `<td>${obj[c] ?? ''}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      </details>
    `;
  }
  html += `</details>`;
  return html;
}


/* ----------------------------------------------------------------------------------------- */
/* Ficha inicial para cada ejercito */
function ficha_inicial(ejercito) {
  const vida_total_inicial = ejercito.unidades.reduce((s, u) => s + u.vidaMaxima, 0);
  console.group(`${ejercito.nombre} — Reporte Inicial -- Vida Inicial: ${vida_total_inicial}`);
  const resumen = {};

  ejercito.unidades.forEach(unidad => {
    (resumen[unidad.tipoUnidad] ||= { unidades: 0, vidaAcum: 0 });
    resumen[unidad.tipoUnidad].unidades += 1;
    resumen[unidad.tipoUnidad].vidaAcum += unidad.vidaMaxima;
  });
  console.table(
    Object.entries(resumen).map(([tipo, r]) => ({
      tipo,
      unidades : r.unidades,
      vidaTotal: r.vidaAcum
    }))
  );
  console.groupEnd();
}


/* Funcion Reusable para agrupar por tipos de evento  */

function agruparPorTipo(arrayEventos, claveTipo = 'tipo') {
  const mapa = {};
  for (const ev of arrayEventos) {
    const tipo = ev[claveTipo];         
    (mapa[tipo] ||= []).push(ev);            
  }
  return mapa;                                
}


async function faseDeAtaqueVisual(atacante, defensor, stats, turno, eventos_tipo) {
  const eventosAgrupados = {};
  let logHTML = `<details class="subturno-log">
    <summary><strong>${atacante.nombre} ataca</strong></summary>`;

  let dañoTotalTurno = 0;
  let criticosTurno = 0;
  let eliminadasTurno = 0;

  for (const unidadAtaque of atacante.unidades_vivas()) {
    if (!defensor.ejercito_vivo()) break;

    const objetivoAtacar = elegir_aleatorio(defensor.unidades_vivas());
    const ev = unidadAtaque.atacar(objetivoAtacar);

    ev.turno = turno;
    ev.atacanteId = unidadAtaque.id;
    ev.atacanteTipo = unidadAtaque.tipoUnidad;
    ev.objetivoId = objetivoAtacar.id;
    ev.objetivoTipo = objetivoAtacar.tipoUnidad;

    (eventosAgrupados[unidadAtaque.tipoUnidad] ||= []).push(ev);
    (eventos_tipo[unidadAtaque.tipoUnidad] ||= []).push(ev);

    const statsAtaque = stats[atacante.nombre];
    statsAtaque.daño_total += ev.dañoReal;
    dañoTotalTurno += ev.dañoReal;

    if (ev.critico) {
      statsAtaque.golpes_criticos++;
      statsAtaque.criticos_stats.push(ev);
      criticosTurno++;
    }

    if (objetivoAtacar.vida === 0) {
      statsAtaque.eliminadas_tipo[objetivoAtacar.tipoUnidad]++;
      eliminadasTurno++;
    }

    const statsDefensa = stats[defensor.nombre];
    statsDefensa.sin_daño.delete(objetivoAtacar.id);
    if (objetivoAtacar.vida === 0) {
      statsDefensa.unidades_perdidas++;
      statsDefensa.perdidas_stats.push({ id: objetivoAtacar.id, tipo: objetivoAtacar.tipoUnidad, turno });
    }
  }

  for (const tipo in eventosAgrupados) {
    const lista = eventosAgrupados[tipo];
    const imagenSrc = imagenesUnidad[tipo] || "";

    logHTML += `
      <details class="subtipo-log">
        <summary>
          <img src="${imagenSrc}" alt="${tipo}" width="20" height="20" style="vertical-align: middle; margin-right: 6px;">
          <strong>${tipo}</strong> — ${lista.length} ataques
        </summary>
        <table class="mini-log-tabla">
          <thead>
            <tr>
              <th>Atacante</th>
              <th>Objetivo</th>
              <th>Daño</th>
              <th>Crítico</th>
            </tr>
          </thead>
          <tbody>`;
    for (const ev of lista) {
      logHTML += `
            <tr>
              <td>${ev.atacanteTipo} #${ev.atacanteId}</td>
              <td>${ev.objetivoTipo} #${ev.objetivoId}</td>
              <td>${ev.dañoReal}</td>
              <td>${ev.critico ? '⚡ Sí' : 'No'}</td>
            </tr>`;
    }
    logHTML += `
          </tbody>
        </table>
      </details>`;
  }

  logHTML += `
    <div class="resumen-turno-fase">
      <strong>Resumen:</strong> 💥 Daño: <strong>${dañoTotalTurno}</strong> — 🪖 Enemigos eliminados: <strong>${eliminadasTurno}</strong> — ⚡ Críticos: <strong>${criticosTurno}</strong>
    </div>
  </details>`;

  return logHTML;
}


function agregarTurnoAlLog(turno, logHTML, eventos_tipo, ejercitoA, ejercitoB, actualizarResumen) {
  const logDiv = document.getElementById("log-guerra");

  const grupoInicio = Math.floor((turno - 1) / 10) * 10 + 1;
  const grupoFin = grupoInicio + 9;
  const grupoId = `grupo-${grupoInicio}-${grupoFin}`;

  let grupoDiv = document.getElementById(grupoId);
  if (!grupoDiv) {
    logDiv.innerHTML += `
      <details class="grupo-turnos">
        <summary><strong>Turnos ${grupoInicio} – ${grupoFin}</strong></summary>
        <div id="${grupoId}" class="bloque-turnos"></div>
      </details>`;
    grupoDiv = document.getElementById(grupoId);
  }

  grupoDiv.innerHTML += `
    <details class="turno-log">
      <summary><strong>Turno ${turno}</strong></summary>
      ${logHTML}
    </details>`;

  console.groupCollapsed(`Turno ${turno}`);

  for (const [tipo, lista] of Object.entries(eventos_tipo)) {
    console.groupCollapsed(`${tipo} — ${lista.length} ataques`);
    console.table(lista.map(ev => ({
      atacanteId : ev.atacanteId,
      objetivoId : ev.objetivoId,
      dañoBase   : ev.dañoBase,
      climaPct   : ev.climaPct,
      dañoFinal  : ev.dañoFinal,
      dañoReal   : ev.dañoReal,
      vidaAntes  : ev.vidaAntes,
      vidaDespues: ev.vidaDespues,
      critico    : ev.critico ? '⚡ Critico' : 'No'
    })));
    const total = lista.reduce((s, ev) => s + ev.dañoReal, 0);
    console.log('💥 Daño total del tipo:', total);
    console.groupEnd();
  }

  const vida_total = ejercito =>
    ejercito.unidades_vivas().reduce((s, u) => s + u.vida, 0);

  console.log(
    `Resumen: ${ejercitoA.nombre}: ${ejercitoA.contar_vivas()} vivas (${vida_total(ejercitoA)} vida) — ` +
    `${ejercitoB.nombre}: ${ejercitoB.contar_vivas()} vivas (${vida_total(ejercitoB)} vida)`
  );

  console.groupEnd();

  if (actualizarResumen) actualizarResumen(ejercitoA, ejercitoB);
}





/* ----------------------------------------------------------------------------------------- */
export async function combatir(ejercitoA, ejercitoB,actualizarResumen) {
  const stats = { [ejercitoA.nombre]: crear_stats(ejercitoA),
                  [ejercitoB.nombre]: crear_stats(ejercitoB) };

  console.clear();
  console.log(`Comienza la batalla entre ${ejercitoA.nombre} y ${ejercitoB.nombre}`);
  ficha_inicial(ejercitoA);
  ficha_inicial(ejercitoB);
    /* -----------------------------Se Elije con Random de 50% quien inicia mayor a 0.5 A , menor B ----------------------------------------- */
  let atacante = Math.random() < 0.5 ? ejercitoA : ejercitoB;
    /* -----------------------------Se elije el que no este asignado como Atacante Si A es Atacante , Coloca a B , si no A --------------------------------- */
  let defensor = atacante === ejercitoA ? ejercitoB : ejercitoA;
  console.log(`Ataca primero ${atacante.nombre}\n`);
    /* -----------------------------Inicializar Turno ----------------------------------------- */
  let turno = 1;
  /* --------------------------Mientras ambos ejercitos esten vivos correra el while----------------------------- */
while (ejercitoA.ejercito_vivo() && ejercitoB.ejercito_vivo()) {
  const eventos_tipo = {};
  let logHTML = "";

  // FASE A ataca a B
  logHTML += await faseDeAtaqueVisual(ejercitoA, ejercitoB, stats, turno, eventos_tipo);

  // Si B ya no está vivo, igual mostramos el turno antes de salir
  if (!ejercitoB.ejercito_vivo()) {
    agregarTurnoAlLog(turno, logHTML, eventos_tipo, ejercitoA, ejercitoB, actualizarResumen);
    break;
  }

  // FASE B ataca a A
  logHTML += await faseDeAtaqueVisual(ejercitoB, ejercitoA, stats, turno, eventos_tipo);

  // Mostrar el resumen visual y en consola del turno completo
  agregarTurnoAlLog(turno, logHTML, eventos_tipo, ejercitoA, ejercitoB, actualizarResumen);

  await sleep(2000);
  turno++;
}


  /* -------------------------------Termina Turno while----------------------------------------- */
  /* ----------------------------------------------------------------------------------------- */
  /* fin de batalla */
  const ganador = ejercitoA.ejercito_vivo() ? ejercitoA : ejercitoB;
  const statsGanador     = stats[ganador.nombre];

  /* ----------------------------------------------------------------------------------------- */
  ganador.unidades.forEach(u => {
    if (u.vida > 0 && u.vida / u.vidaMaxima <= 0.3) {
      statsGanador.al_medico.add(u.id);
      statsGanador.medico_stats.push({ id: u.id, tipo: u.tipoUnidad, vida: u.vida, vidaMaxima: u.vidaMaxima });
    }
    if (statsGanador.sin_daño.has(u.id)) statsGanador.ilesas_stats.push({ id: u.id, tipo: u.tipoUnidad });
  });
  /* ----------------------------------------------------------------------------------------- */

  console.log(`\n El Ganador es ${ganador.nombre}!`);
renderInformeFinal(statsGanador, ganador);
  /* ----------------------------------------------------------------------------------------- */
  /* ----------------------------Inicia Grupo Stats Final-------------------------------------- */
  console.group('Estadísticas finales');
  console.log('Golpes críticos   :', statsGanador.golpes_criticos);
  console.log('Daño total        :', statsGanador.daño_total);
  console.log('Perdidas propias  :', statsGanador.unidades_perdidas);
  console.log('Unidades ilesas   :', statsGanador.ilesas_stats.length);
  console.log('Al médico/taller  :', statsGanador.al_medico.size);
  /* ------------------------Tropas Eliminadas por tipo-------------------------------------------- */
  console.groupCollapsed('Tropas eliminadas por tipo');
  console.table(statsGanador.eliminadas_tipo);
  console.groupEnd();
  /* --------------------------Golpes Criticos------------------------------------------------- */
  console.groupCollapsed('Golpes Críticos');
for (const [tipo, lista] of Object.entries( agruparPorTipo(statsGanador.criticos_stats, 'atacanteTipo') )) {
  console.groupCollapsed(`Tipo : ${tipo} — Cantidad de Golpes Criticos ${lista.length}`);
  console.table(lista);
  console.groupEnd();
}
console.groupEnd();

  /* -------------------------Tropas Al Medico -------------------------------------------------- */
console.groupCollapsed('Para el medico / taller');
for (const [tipo, lista] of Object.entries( agruparPorTipo(statsGanador.medico_stats, 'tipo') )) {
  console.groupCollapsed(`Tipo : ${tipo} - Cantidad : ${lista.length}`);
  console.table(lista);
  console.groupEnd();
}
console.groupEnd();

  /* ------------------------Tropas Ilesas----------------------------------------------- */
  console.groupCollapsed('Tropas Ilesas');
for (const [tipo, lista] of Object.entries( agruparPorTipo(statsGanador.ilesas_stats, 'tipo') )) {
  console.groupCollapsed(`Tipo : ${tipo} — Cantidad :  ${lista.length}`);
  console.table(lista);
  console.groupEnd();
}
console.groupEnd();
  /* ------------------------Tropas Perdidas---------------------------------------------------- */
console.groupCollapsed('Tropas Perdidas');
for (const [tipo, lista] of Object.entries( agruparPorTipo(statsGanador.perdidas_stats, 'tipo') )) {
  console.groupCollapsed(`Tipo : ${tipo} — Cantidad :  ${lista.length}`);
  console.table(lista);
  console.groupEnd();
}
console.groupEnd();

/* ---------------------------------- Tropas Vivas agrupadas ---------------------------------- */
console.groupCollapsed('Tropas vivas');
for (const [tipo, lista] of Object.entries(agruparPorTipo( ganador.unidades_vivas(), 'tipoUnidad' ))) {
  console.groupCollapsed(`• ${tipo} — ${lista.length} supervivientes`);
  console.table(
    lista.map(unidad => ({
      id        : unidad.id,
      vidaMax   : unidad.vidaMaxima,
      vidaActual: unidad.vida
    }))
  );
  console.groupEnd();
}

console.groupEnd();
  

  console.groupEnd(); 
  /* -------------------------------Fin Estaditisticas finales-------------------------------------- */
}
