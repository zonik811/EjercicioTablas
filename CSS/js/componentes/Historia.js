export async function renderizarHistorias() {
  const contenedor = document.getElementById('historias');

  // Generar 5 historias con ID aleatorio entre 0 y 1000
  const historias = Array.from({ length: 5 }, (_, i) => {
    const idAleatorio = Math.floor(Math.random() * 1000);
    return {
      id: idAleatorio,
      title: `Foto ${i + 1}`,
      url: `https://picsum.photos/id/${idAleatorio}/100/100`
    };
  });
// Generar div para cada historia
  contenedor.innerHTML = historias.map(f => `
    <div class="historia">
      <img src="${f.url}" alt="${f.title}">
      <span>${f.title}</span>
    </div>
  `).join('');
}