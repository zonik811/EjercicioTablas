export function renderizarCompositor() {
  // buscamos el elemento html
  const comp = document.getElementById('compositor');
  // Agregamos contenidos y style estatico
  comp.innerHTML = `
    <div class="tarjeta">
      <input type="text" placeholder="¿Qué estás pensaando?" style="width:100%;padding:8px;border-radius:20px;border:none;background:#3a3b3c;color:#e4e6eb;" />
      <div style="display:flex;justify-content:space-around;margin-top:8px;">
        <button style="background:none;border:none;color:#e4e6eb;cursor:pointer;">🎥 Video</button>
        <button style="background:none;border:none;color:#e4e6eb;cursor:pointer;">🖼️ Foto</button>
        <button style="background:none;border:none;color:#e4e6eb;cursor:pointer;">😊 Estado</button>
      </div>
    </div>`;
}
