
export function entero_aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function flotante_aleatorio(min, max) {
  return Math.random() * (max - min) + min;
}
export function elegir_aleatorio(array) {         
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}
