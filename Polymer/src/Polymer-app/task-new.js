import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class TaskNew extends PolymerElement {
  static get is(){ return 'task-new'; }

  static get properties(){
    return { nuevaTarea:{ type:String, value:'' } };
  }

  _agregar(){
    const nombre = this.nuevaTarea.trim();
    this.dispatchEvent(new CustomEvent('add-task',{
      detail:nombre, 
      bubbles:true, 
      composed:true
    }));
    this.nuevaTarea = '';
  }


  static get template(){
    return html`
<style>
  .fila{
    display:flex;
    gap:8px;
    margin-bottom:20px;
  }
  input{
    flex:1;
    padding:10px 12px;
    border:1px solid #e1e4e8;
    border-radius:6px;
    background:#ffffff;
    font-size:15px;
  }
  button{
    padding:10px 18px;
    background:#2563eb;
    color:#ffffff;
    border:none;
    border-radius:6px;
    cursor:pointer;
    font-weight:600;
  }
  button:hover{
    background:#1e4ecb;
  }
</style>



      <div class="fila">
        <input  value="{{nuevaTarea::input}}"
                placeholder="Escribe una nueva tarea">
        <button on-click="_agregar">Agregar</button>
      </div>
    `;
  }
}

customElements.define(TaskNew.is, TaskNew);
