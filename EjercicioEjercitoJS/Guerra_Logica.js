import { tipo_unidad } from "./Datos_Base.js";
import { elejir_aleatorio } from "./Randomnizador.js";

function crear_stats(ejercito){
    const vacio_por_tipo = Object.fromEntries(
        tipo_unidad.map(t =>[t,0])
    );
 return{
    golpes_criticos :0,
    daño_efectivo_total:0,
    eliminadas_por_tipo: {vacio_por_tipo},
    perdidas : 0,
    sindaño: new Set(ejercito.unidades.map(u =>u.id)),
    medico : new Set()
 };
}

export function combatir(ejercito_a,ejercito_b){
    const stats ={
        [ejercito_a.nombre]: crear_stats(ejercito_a),
        [ejercito_b.nombre]: crear_stats(ejercito_b)
    };
    let atacante = Math.random()<0.5 ? ejercito_a: ejercito_b;
    let defensor = atacante === ejercito_a ? ejercito_b : ejercito_a;
    let turno=1;

    while(ejercito_a.estaVivo() && ejercito_b.estaVivo()){

        console.groupCollapsed(`# Turno ${turno} - ${atacante.nombre} ataca `);

        const dañoTipo = {};

        for(const unid of atacante.unidades_vivas()){
            if(!defensor.estaVivo()) break;

            const obj=elejir_aleatorio(defensor.unidades_vivas());
            const ev=unid.atacar(obj);

            const sAtk = stats[atacante.nombre];
            sAtk.daño_efectivo_total += ev.daño_efectivo_total;
            if(ev.critico ) sAtk.golpes_criticos++;

            const sDef = stats[defensor.nombre];
            if(obj.hp===0){
                sDef.perdidas++;
                sAtk.eliminadas_por_tipo[obj.tipo] += 1;
            }
            sDef.sindaño.delete(obj.id);

            dañoTipo[unid.tipo]=(dañoTipo[unid.tipo] || 0)+ev.daño_efectivo_total;
        }

        for(const [tipo,dmgTotal] of Object.entries(dañoTipo)){
            console.groupCollapsed(`${tipo} - daño total: ${dmgTotal} `);
            console.groupEnd();
        }

        console.groupEnd();

        console.log(`Turno ${turno}  | ` +
            `${ejercito_a.nombre}:${ejercito_a.contar_vivas()} unidades vivas  |`+
            `${ejercito_b.nombre}:${ejercito_b.contar_vivas()} unidades vivas  |`);


        const mostrarVida= ej =>{
            const vidaTotal = ej.unidades_vivas().reduce((s,u)=>s+u.hp,0);
            const vidaTipo={};
            ej.unidades_vivas().forEach(u=>{
               vidaTipo[u.tipo] = (vidaTipo[u.tipo] || 0)+u.hp;
            });
            console.log(`${ej.nombre} - vida total: ${vidaTotal} `);
            console.table(vidaTipo);
        };
        mostrarVida(ejercito_a);
        mostrarVida(ejercito_b);

        [atacante,defensor]= [defensor,atacante];
        turno++;

        


    }



    const ganador = ejercito_a.estaVivo() ? ejercito_a:ejercito_b;
    const stWin = stats[ganador.nombre];

    ganador.unidades_vivas().forEach(u=>{
        if (u.hp / u.hpMax <= 0.3) stWin.medico.add(u.id);
    });

    console.log(`Victora para :  ${ganador.nombre} `);

    console.group(`Estadisticas finales - ` +ganador.nombre);
    console.log('Golpes Criticos : ',stWin.golpes_criticos);
    console.log('Daño Efectivo Total: ',stWin.daño_efectivo_total);
    console.log('Unidades perdidas : ',stWin.perdidas);
    console.log('Unidades Sin daño : ',stWin.sindaño.size);
    console.log('Al Medico / Taller : ',stWin.medico.size);
    console.table(stWin.eliminadas_por_tipo);
    console.groupEnd();
}