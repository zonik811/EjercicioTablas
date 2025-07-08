import { Feed } from './componentes/Feed.js';
import { renderizarSidebarDer }   from './componentes/SidebarDer.js';
import { renderizarHistorias }    from './componentes/Historia.js';
import { renderizarCompositor }   from './componentes/Compositor.js';

document.addEventListener('DOMContentLoaded', async () => {

  await renderizarSidebarDer();
  await renderizarHistorias();
  renderizarCompositor();
  const raiz   = document.getElementById('raiz');
  new Feed(raiz);
});
