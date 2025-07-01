export const vida_submarino = 2500 ;
export const ataque_submarino = 500;
const referencia_vida_maxima =12;
const referencia_ataque_maximo =14;
const const_vida_unidades = {
    soldado_regular:2,
    soldado_profesional:3,
    soldado_elite:4,
    carroTanque:7,
    helicoptero:8,
    avion_combate:9,
    submarino:12
};
const const_ataque_unidades = {
    soldado_regular:1,
    soldado_profesional:2,
    soldado_elite:3,
    carroTanque:4,
    helicoptero:5,
    avion_combate:6,
    submarino:14
}
function construir_tabla(numeradores,denominador,referencia){
    const resultado ={};
    for (const tipo in numeradores){

        resultado[tipo]=Math.round((numeradores[tipo]/denominador)*referencia)
    }
    return resultado
}
export const Vida = construir_tabla(const_vida_unidades,referencia_vida_maxima,vida_submarino);
export const Ataque = construir_tabla(const_ataque_unidades,referencia_ataque_maximo,ataque_submarino);
export const tipo_unidad = Object.keys(Vida);
