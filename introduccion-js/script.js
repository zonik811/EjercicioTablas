// Declaro Variables Con su valor Inicial
let numero = 10;
let texto = "Hola mundo";
let booleano = true;
let indefinido;
let nulo = null;
let bigInt = 1234567890123456789012345678901234567890n;
let simbolo = Symbol("simbolo1");

// Primer grupo de consola
console.groupCollapsed("Primer grupo - Valores iniciales");

console.log("Número:", numero);
console.error("Texto :", texto);
console.debug("Booleano:", booleano);
console.warn("Indefinido:", indefinido);
console.info("Nulo:", nulo);
console.log("BigInt:", bigInt);
console.debug("Símbolo:", simbolo);

console.groupEnd();

// Cambiando los valores
numero = 20;
texto = "Texto 2";
booleano = false;
indefinido = "Definido";
nulo = "123456";
bigInt = 99999999999999999999999999999n;
simbolo = Symbol("Simbolo2");

// Segundo grupo de consola con otros métodos
console.groupCollapsed("Segundo grupo - Valores modificados");

console.debug("Número:", numero);
console.warn("Texto:", texto);
console.error("Booleano:", booleano);
console.info("Indefinido:", indefinido);
console.log("Nulo:", nulo);
console.error("BigInt:", bigInt);
console.warn("Símbolo:", simbolo);

console.groupEnd();
