
 //funcion generar tabla de resumen
export const sleep = ms => new Promise(r => setTimeout(r, ms));


 //funcion que agrupa por clave tipo
export function agruparPorTipo(arr, clave = 'tipo') {
  return arr.reduce((mapa, obj) => {
    (mapa[obj[clave]] ||= []).push(obj);
    return mapa;
  }, {});
}
