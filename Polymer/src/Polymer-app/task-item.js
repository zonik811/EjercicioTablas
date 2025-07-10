import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class TaskItem extends PolymerElement {
  static get is(){ return 'task-item'; }

  static get properties(){
    return { item:Object };
  }
/* ----- Metodo Eliminar----- */
  _eliminar(e){
    this.dispatchEvent(new CustomEvent('eliminar',{
      bubbles:true, 
      composed:true
    }));
  }
/* ----- Metodo Completar----- */
  _completar(){
    this.dispatchEvent(new CustomEvent('completar',{
      bubbles:true, composed:true
    }));
  }

/* ----- Metodo clase dinamica que revisa si c es tru o false si es true le marca completada si no  ''----- */
  _classedinamica(c){ return c ? 'completada' : ''; }

  static get template(){
    return html`
<style>
  .tarea{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px 14px;
    background:#ffffff;
    border:1px solid #e1e4e8;
    border-radius:6px;
    box-shadow:0 1px 3px rgba(0,0,0,.08);
    cursor:pointer;
    transition:background .2s, transform .2s, opacity .3s;
  }
  
  /* —— efecto al pasar el mouse —— */
  .tarea:hover{
    transform:scale(1.02);
  }

  /* —— efecto de completada —— */
  .completada{
    background:#ccffc9; 
    color:#6b7280;
    opacity:0.7;                 
    transform:scale(0.97);    
  }
  /* línea tachada con ::after para que se anime */
  .completada::after{
    content:'';
    position:absolute;
    inset:0;                    
    border-top:2px solid #9ca3af;
    transform-origin:left;
    transform:scaleX(0);
    animation:slash .3s forwards;
    pointer-events:none;
  }
  @keyframes slash{
    to{ transform:scaleX(1); }
  }

  button{
    background:none;
    border:none;
    color:#e11d48;
    font-weight:700;
    cursor:pointer;
    font-size:18px;
  }
  input[type=checkbox]{
    pointer-events:none;
    margin-right:8px;
    accent-color:#2563eb;
  }
</style>



      <div class$="tarea [[_classedinamica(item.completed)]]" on-click="_completar">
        <span>
          <input type="checkbox" checked$="[[item.completed]]">
          [[item.name]]
        </span>
        <button on-click="_eliminar">X</button>
      </div>
    `;
  }
}

customElements.define(TaskItem.is, TaskItem);
