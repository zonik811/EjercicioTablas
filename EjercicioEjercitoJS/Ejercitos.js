import { tipo_unidad,Vida } from "./Datos_Base.js";
import { entero_aleatorio } from "./Randomnizador.js";
import { Unidades } from "./Unidades.js";

const rango_cantidad = {
    soldado_regular:[500,1000],
    soldado_profesional:[500,1000],
    soldado_elite:[200,300],
    carroTanque:[50,100],
    helicoptero:[30,50],
    avion_combate:[75,50],
    submarino:[1,2]
}

export class Ejercitos{
    constructor(nombre,unidades=[]){
        this.nombre = nombre;
        this.unidades = unidades;
    }



unidades_vivas(){
     return this.unidades.filter(unidad =>unidad.estaViva());}

estaVivo(){ 
    return this.unidades_vivas().length > 0 ;}

contar_vivas(){ 
    return this.unidades_vivas().length;}

}


export function crear_ejercito(nombre){
    const unidades=[];
    let id_global=1;

    for(const tipo of tipo_unidad){
        const [min,max]=rango_cantidad[tipo];
        const cantidad = entero_aleatorio(min,max);

        for (let i =0 ; i < cantidad ; i++){
         unidades.push(new Unidades(tipo,id_global++));
        }
    }
    return new Ejercitos(nombre,unidades);

}