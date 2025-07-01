export function entero_aleatorio(minimo,maximo){
    return Math.floor(Math.random()*(maximo-minimo+1)+minimo);
}

export function flotante_aleatorio(minimo,maximo){
    return Math.random() * (maximo-minimo)+minimo;
}
export function elejir_aleatorio(array1){
    const idx= Math.floor(Math.random()* array1.length);
    return array1[idx]
}
