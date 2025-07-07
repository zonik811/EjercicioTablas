// src/motor/fase_ataque.js
import { elegir_aleatorio } from '../Randomnizador.js';
import { actualizarStatsAtaque } from './stats.js';

/**
 * Ejecuta una fase: un ejército ataca al otro.
 * Devuelve resumen para la UI.
 */
export function faseDeAtaque(ejercitoAtacante, ejercitoDefensor, stats, turno) {
  const eventosAgrupados = {};
  let dañoTotal = 0, criticos = 0, eliminadas = 0;

  for (const unidad of ejercitoAtacante.unidades_vivas()) {
    if (!ejercitoDefensor.ejercito_vivo()) break;

    const objetivo = elegir_aleatorio(ejercitoDefensor.unidades_vivas());
    const ev = unidad.atacar(objetivo);

    Object.assign(ev, {
      turno,
      atacanteId   : unidad.id,
      atacanteTipo : unidad.tipoUnidad,
      objetivoId   : objetivo.id,
      objetivoTipo : objetivo.tipoUnidad,
      objetivoVidaDespues: objetivo.vida
    });

    (eventosAgrupados[unidad.tipoUnidad] ||= []).push(ev);

    actualizarStatsAtaque(stats, ev, ejercitoAtacante, ejercitoDefensor);

    dañoTotal   += ev.dañoReal;
    if (ev.critico) criticos++;
    if (objetivo.vida === 0) eliminadas++;
  }

  return { eventosAgrupados, dañoTotal, criticos, eliminadas };
}
