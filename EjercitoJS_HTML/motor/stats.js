
import { tipo_unidad } from '../Datos_Base.js';

 //funcion crear stats
export function crearStats(ejercito) {
  const base = Object.fromEntries(tipo_unidad.map(t => [t, 0]));
  return {
    golpes_criticos   : 0,
    daño_total        : 0,
    unidades_perdidas : 0,
    sin_daño          : new Set(ejercito.unidades.map(u => u.id)),
    al_medico         : new Set(),
    eliminadas_tipo   : { ...base },
    criticos_stats    : [],
    medico_stats      : [],
    perdidas_stats    : [],
    ilesas_stats      : []
  };
}

 //funcion actualiza stats en turno
export function actualizarStatsAtaque(stats, ev, ejercitoAtk, ejercitoDef) {
  const sAtk = stats[ejercitoAtk.nombre];
  sAtk.daño_total += ev.dañoReal;
  if (ev.critico) {
    sAtk.golpes_criticos++;
    sAtk.criticos_stats.push(ev);
  }
  if (ev.objetivoVidaDespues === 0) {
    sAtk.eliminadas_tipo[ev.objetivoTipo]++;
  }
  const sDef = stats[ejercitoDef.nombre];
  sDef.sin_daño.delete(ev.objetivoId);
  if (ev.objetivoVidaDespues === 0) {
    sDef.unidades_perdidas++;
    sDef.perdidas_stats.push({ id: ev.objetivoId, tipo: ev.objetivoTipo, turno: ev.turno });
  }
}


 //funcion generar stats ganador
export function finalizarStatsGanador(ganador, statsG) {
  ganador.unidades.forEach(u => {
    if (u.vida > 0 && u.vida / u.vidaMaxima <= 0.3) {
      statsG.al_medico.add(u.id);
      statsG.medico_stats.push({ id: u.id, tipo: u.tipoUnidad, vida: u.vida, vidaMaxima: u.vidaMaxima });
    }
    if (statsG.sin_daño.has(u.id)) {
      statsG.ilesas_stats.push({ id: u.id, tipo: u.tipoUnidad });
    }
  });
}
