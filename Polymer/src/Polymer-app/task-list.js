import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import './task-item.js';

class TaskList extends PolymerElement {
  static get is(){ return 'task-list'; }
/* ----- definimos propiedad tipo array----- */
  static get properties(){
    return { items:{ type:Array, value:() => [] } };
  }
/* ----- Metodo Eliminar----- */
  _emitEliminar(e){    
    this.dispatchEvent(new CustomEvent('remove-task',{
      detail:e.model.index, 
      bubbles:true,
      composed:true
    }));
  }
/* ----- Metodo Completar----- */
  _emitCompletar(e){
    this.dispatchEvent(new CustomEvent('complete-task',{
      detail:e.model.index, 
      bubbles:true, 
      composed:true
    }));
  }

  static get template(){
    return html`
<style>
  .lista{
    display:flex;
    flex-direction:column;
    gap:10px;
  }
  .vacio{
    text-align:center;
    color:#6b7280;
    font-style:italic;
    margin-top:12px;
  }
</style>

<!-- Usamos Dom-if para mostrar si esta vacio items -->
      <template is="dom-if" if="[[!items.length]]">
        <div class="vacio">No hay tareas aún</div>
      </template>

<!-- Usamos Dom-repeat para mostrar items por su index -->
      <div class="lista">
        <template is="dom-repeat" items="[[items]]" as="item" index-as="index">
          <task-item item="[[item]]"
                     on-eliminar="_emitEliminar"
                     on-completar="_emitCompletar">
          </task-item>
        </template>
      </div>
    `;
  }
}

customElements.define(TaskList.is, TaskList);
