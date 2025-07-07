//funcion Imprimir Consola
export function fichaInicialConsole(ejercito) {
 //sumatoria de vida de unidades   
  const vidaTotal = ejercito.unidades.reduce((s, u) => s + u.vidaMaxima, 0);
  //Iinicia console group mostrando nombre y vida total
  console.group(
    `${ejercito.nombre} — Reporte Inicial | Vida total del ejercito: ${vidaTotal}`
  );
//ciclo for que recorre las unidades en el ejercito segun unidad , suma las unidades y va recopilando la vida maxima
  const resumen = {};
  ejercito.unidades.forEach(u => {
    (resumen[u.tipoUnidad] ||= { unidades: 0, vida: 0 });
    resumen[u.tipoUnidad].unidades++;
    resumen[u.tipoUnidad].vida += u.vidaMaxima;
  });
//imprime tabla en consola
  console.table(
    Object.entries(resumen).map(([tipo, r]) => ({
      tipo,
      unidades: r.unidades,
      vidaTotal: r.vida
    }))
  );
  console.groupEnd();
}
