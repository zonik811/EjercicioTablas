import { sleep } from './helpers.js';
import { crearStats, finalizarStatsGanador } from './stats.js';
import { faseDeAtaque }          from './fase_ataque.js';
import { agregarTurnoAlLog }     from '../ui/log_turnos.js';
import { renderInformeFinal }    from '../ui/informe_final.js';
import { fichaInicialConsole }   from '../ui/ficha_inicial.js';

export async function combatir(ejA, ejB, actualizarResumen) {
    
 //creamos stats
  const stats = { [ejA.nombre]: crearStats(ejA), [ejB.nombre]: crearStats(ejB) };

  console.clear();
  console.log(`Comienza la batalla entre ${ejA.nombre} y ${ejB.nombre}`);
  
 //creamos fichas en consola
  fichaInicialConsole(ejA); fichaInicialConsole(ejB);

  let turno = 1;
  while (ejA.ejercito_vivo() && ejB.ejercito_vivo()) {
    const eventos = {};

 //ataque1
    const fase1 = faseDeAtaque(ejA, ejB, stats, turno);
    Object.assign(eventos, fase1.eventosAgrupados);
    if (!ejB.ejercito_vivo()) {
      agregarTurnoAlLog(turno, [fase1], eventos, ejA, ejB, actualizarResumen);
      break;
    }
 //ataque2
    const fase2 = faseDeAtaque(ejB, ejA, stats, turno);
    Object.assign(eventos, fase2.eventosAgrupados);
 //Agregamos al log
    agregarTurnoAlLog(turno, [fase1, fase2], eventos, ejA, ejB, actualizarResumen);
    await sleep(2000);
    turno++;
  }

  const ganador       = ejA.ejercito_vivo() ? ejA : ejB;
  const statsGanador  = stats[ganador.nombre];
  finalizarStatsGanador(ganador, statsGanador);
  renderInformeFinal(statsGanador, ganador);
}
