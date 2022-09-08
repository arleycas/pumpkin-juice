document.addEventListener('DOMContentLoaded', () => {
  const
    selFiltroEstado = document.querySelector('#selFiltroEstado'),
    arrEstados = ['To Do', 'Doing', 'Done'];

  selFiltroEstado.addEventListener('change', (e) => {
    const estadoSelect = e.target.value;
    console.log(estadoSelect);

    if (estadoSelect === 'All') {
      window.location.href = '/tarea/lista/1'
      return;
    }
    window.location.href = `?estado=${estadoSelect}`;
  });

  if (window.location.search) {
    const
      queryString = window.location.search, // retorna algo como '?estado=Doing'
      urlParams = new URLSearchParams(queryString), // guarda todas las variables de la URL
      estado = urlParams.get('estado'); // se obtiene la que necesitamos

    if (arrEstados.includes(estado)) {
      selFiltroEstado.value = estado;
    }
  }
});
