import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './task-new.js';
import './task-list.js';

class AppMain extends PolymerElement {
  static get is() { return 'app-main'; }

  static get properties() {
    return {
       /* ----- definimo task , esperando un objeto con un valor de objeto item por defecto ----- */
      task: { type: Object, value: () => ({ items: [] }) }
    };
  }

  /* ----- cada vez que ingresa busca en localstorage task  ----- */
  connectedCallback() {
    super.connectedCallback();
    const saved = localStorage.getItem('task');
     /* ----- si task no es null entonces se lo asigna a task parseandolo de json a objeto ----- */
    if (saved) this.task = JSON.parse(saved);
  }

  /* ----- metodos internos ----- */
    /* ----- agregar tarea ----- */
  _addTask(e){
    /* ----- le hacemos trim para limpiar el texto ----- */
    const nombre = e.detail.trim();
    /* ----- agregar tarea con su nombre y estado ----- */
    this.push('task.items', { name:nombre, completed:false });
    /* ----- llamamos funcion reusable para guardar en local storage ----- */
    this._save();
  }
  /* ----- borrar tarea del storage ----- */
  _removeTask(e){
   /* ----- usamos splice , array , posicion a cortar ,cantidad de elementos a quitar  ----- */ 
    this.splice('task.items', e.detail, 1);
    this._save();
  }
  /* ----- marcar completado ----- */
  _Completar(e){
    const idx = e.detail;
    /* ----- traemos el valor y lo invertimos al que tenga  ----- */
    const val = !this.task.items[idx].completed;
/* ----- asignamos con el helper set ruta , valor a modificar  ----- */
    this.set(`task.items.${idx}.completed`, val);
    this._save();
  }
  /* ----- metodo reusable guardar----- */
  _save(){
    localStorage.setItem('task', JSON.stringify(this.task));
  }

  /* ----- plantilla ----- */
  static get template() {
    return html`
      <style>
        :host{display:block;max-width:420px;margin:auto;}
      </style>
    <!-- Muestra el input y boton Agregar,Cuando se hace clic lanza un CustomEvent'add-task' {detail: texto} on-add-task y delegamos a _addTask()-->
      <task-new   on-add-task="_addTask"></task-new>

      <!--Consulta localstorage task.items y lo dibuja en el dom -->
      <task-list  items="[[task.items]]"
                  on-remove-task="_removeTask"
                  on-complete-task="_Completar">
      </task-list>
    `;
  }
}

customElements.define(AppMain.is, AppMain);
