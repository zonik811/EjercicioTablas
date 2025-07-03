import { tipo_unidad }      from './Datos_Base.js';
import { elegir_aleatorio } from './Randomnizador.js';
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



/* ----------------------------------------------------------------------------------------- */
export function combatir(ejercitoA, ejercitoB) {
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
  /* -----------------------------Inicia Turno ----------------------------------------- */
  /* ----------------------------------------------------------------------------------------- */
    const eventos_tipo = {}; 
    console.groupCollapsed(`Turno ${turno} — Ataca ${atacante.nombre}`);
  /* --------------------------------Ataque de todas las tropas vivas--------------------------------------------- */
    for (const unidadAtaque of atacante.unidades_vivas()) {
      /* -------------------------------si ya no esta vivo termina----------------------------------------- */
      if (!defensor.ejercito_vivo()) break;
/* -------------------------------elejimos aleatoriamente el objetivo del array unidades vivas ----------------------------------------- */
      const objetivoAtacar = elegir_aleatorio(defensor.unidades_vivas());
      /* -------------------------------Evento atacar----------------------------------------- */
      const ev  = unidadAtaque.atacar(objetivoAtacar);
      /* -------------------------------Guardamos turno----------------------------------------- */
      ev.turno  = turno;
      /* -------------------------------Guardamos evento----------------------------------------- */
      (eventos_tipo[unidadAtaque.tipoUnidad] ||= []).push(ev);

      /* stats atacante */
      const statsAtaque = stats[atacante.nombre];
      statsAtaque.daño_total += ev.dañoReal;
      if (ev.critico) {
        statsAtaque.golpes_criticos++;
        statsAtaque.criticos_stats.push(ev);
      }
      if (objetivoAtacar.vida === 0) statsAtaque.eliminadas_tipo[objetivoAtacar.tipoUnidad]++;

      /* stats defensor */
      const statsDefensa = stats[defensor.nombre];
      statsDefensa.sin_daño.delete(objetivoAtacar.id);
      if (objetivoAtacar.vida === 0) {
        statsDefensa.unidades_perdidas++;
        statsDefensa.perdidas_stats.push({ id: objetivoAtacar.id, tipo: objetivoAtacar.tipoUnidad, turno });
      }
    }
  /* ----------------------------------------------------------------------------------------- */
    /* Tabla Detalle Por Tipo en Cada Turno */
    for (const [tipo, lista] of Object.entries(eventos_tipo)) {
      console.groupCollapsed(`${tipo} — ${lista.length} ataques`);
      console.table(
        lista.map(ev => ({
          atacanteId : ev.atacanteId,
          objetivoId : ev.objetivoId,
          dañoBase   : ev.dañoBase,
          climaPct   : ev.climaPct,
          dañoFinal  : ev.dañoFinal,
          dañoReal   : ev.dañoReal,
          vidaAntes  : ev.vidaAntes,
          vidaDespues: ev.vidaDespues,
          critico    : ev.critico ? 'Critico' : 'No Critico'
        }))
      );
      const total = lista.reduce((s, ev) => s + ev.dañoReal, 0);
      console.log('Daño total del tipo:', total);
      console.groupEnd();
    }
    console.groupEnd(); 
  /* ----------------------------------------------------------------------------------------- */
    /* resumen turno por ejercito unidades vivas , vida_total*/
    const vida_total = ejercito => ejercito.unidades_vivas().reduce((s, u) => s + u.vida, 0);
    console.log(
      `Turno ${turno} ||
       ${ejercitoA.nombre}: ${ejercitoA.contar_vivas()} Unidades Vivas. || ${vida_total(ejercitoA)} Vida Restante // ` +
      `${ejercitoB.nombre}: ${ejercitoB.contar_vivas()} Unidades Vivas. || ${vida_total(ejercitoB)} Vida Restante`
    );
/* -------------------------------Cambiamos roles----------------------------------------- */
    [atacante, defensor] = [defensor, atacante];
   /* -------------------------------fin del turno aumenta el contador----------------------------------------- */ 
    turno++;
  /* -------------------------------Termina Turno while----------------------------------------- */
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
