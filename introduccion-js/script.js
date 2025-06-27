
let numero = 10;
let texto = "Hola mundo";
let booleano = true;
let indefinido;
let nulo = null;
let bigInt = 123456789012n;
let simbolo = Symbol("simbolo1");


console.groupCollapsed("Primer grupo - Valores iniciales");
console.log("Número:", numero);
console.error("Texto :", texto);
console.debug("Booleano:", booleano);
console.warn("Indefinido:", indefinido);
console.info("Nulo:", nulo);
console.log("BigInt:", bigInt);
console.debug("Símbolo:", simbolo);

console.groupEnd();
numero = 20;
texto = "Texto 2";
booleano = false;
indefinido = "Definido";
nulo = "123456";
bigInt = 99999999999999999999999999999n;
simbolo = Symbol("Simbolo2");

console.groupCollapsed("Segundo grupo - Valores modificados");

console.table({
  Numero: numero,
  Texto: texto,
  Booleano: booleano,
  Indefinido: indefinido,
  Nulo: nulo,
  BigInt: bigInt,
  Simbolo: simbolo
});

console.groupEnd();
