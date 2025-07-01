import { Vida,Ataque } from "./Datos_Base.js";
import { flotante_aleatorio,entero_aleatorio } from "./Randomnizador.js";

export class Unidades{
constructor(tipo,id){
    this.id =id;
    this.tipo = tipo;
    this.hpmax=Vida[tipo];
    this.ataque_max=Ataque[tipo];
    this.hp=this.hpmax;
    this.fueGolpeada=false;
}

estaViva(){return this.hp>0};

atacar(objetivo){
    console.log(this.ataque_max);
    const daño_base = entero_aleatorio(1,this.ataque_max);
    const clima_afecta = flotante_aleatorio(0,0.30);
    const daño_calculado = Math.round(daño_base * (1-clima_afecta));
    const critico = daño_base === this.ataque_max;

    const hp_objetivo_antes= objetivo.hp;
    const daño_efect = Math.min(daño_calculado,hp_objetivo_antes);
    objetivo.hp = hp_objetivo_antes-daño_calculado;
    objetivo.fueGolpeada=true;

    return{
       atacante_id : this.id,
       atacante_tipo : this.tipo,
       objetivo_id : objetivo.id,
       daño_base,
       clima_afecta,
       daño_efectivo : daño_efect,
       critico 
    }
}

}