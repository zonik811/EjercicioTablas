import { Vida, Ataque }                          from './Datos_Base.js';
import { entero_aleatorio, flotante_aleatorio }  from './Randomnizador.js';
/* ----Creamos Clase Unidades--------------------------------- */
export class Unidades {
/* ----Creamos Constructor de la clase--------------------------------- */
  constructor(tipoUnidad, id) {
    this.id     = id;
    this.tipoUnidad   = tipoUnidad;
    this.vidaMaxima  = Vida[tipoUnidad]; 
    this.ataqueMaximo = Ataque[tipoUnidad];   
    this.vida     = this.vidaMaxima;    
    this.fueGolpeada = false;
  }
/* ----Creamos Funcion para saber si sigue viva--------------------------------- */
  estaViva() {
     return this.vida > 0; 
    }
/* ----Creamos funcion atacar objetivo--------------------------------- */
atacar(objetivo) {
/* ----calculamos el daño base--------------------------------- */
  const dañoBase  = entero_aleatorio(1, this.ataqueMaximo);
/* ----calculamos el factor clima que va afectar el ataque--------------------------------- */
  const clima    = flotante_aleatorio(0, 0.30);
  /* ----calculamos el daño final redondeando el resultado de daño base por el porcentaje de clima--------------------------------- */
  const dañoFinal = Math.round(dañoBase * (1 - clima));
  /* ----calculamos si es un ataque critico de la forma que miramos si el ataque maximo es igual al daño final--------------------------------- */
  /* ----Podria ser calculado const critico  = clima === 0; --------------------------------- */
  const critico  = dañoFinal === this.ataqueMaximo;
  /* ----Guardamos la vida del objetivo antes de atacarlo--------------------------------- */
  const vidaAntes  = objetivo.vida;    
  /* ----Calculamos el daño real que se le aplica al objetivo--------------------------------- */                  
  const dañoReal  = Math.min(dañoFinal, vidaAntes);
  /* ----Modificamos la vida del objetivo--------------------------------- */
  objetivo.vida    = vidaAntes - dañoReal;
  /* ----Activamos el Flag de que fue golpeado--------------------------------- */
  objetivo.fueGolpeada = true;
  /* ----Retornamos los datos para la tabla --------------------------------- */
  return {
    atacanteId   : this.id,
    objetivoId   : objetivo.id,
    atacanteTipo : this.tipoUnidad,
    objetivoTipo : objetivo.tipoUnidad,
    dañoBase,
     /* ----Se Usa el Tofixed para redondear a 0 unidades--------------------------------- */
    climaPct     : +(clima * 100).toFixed(0),
    dañoFinal,
    dañoReal,
    vidaAntes,                                     
    vidaDespues    : objetivo.vida,                   
    critico
  };
}


}
