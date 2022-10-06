document.addEventListener('DOMContentLoaded', () => {
  const
    inpDescripcion = document.querySelector('#inpDescripcion'),
    selCategoria = document.querySelector('#selCategoria'),
    selSubcategoria = document.querySelector('#selSubcategoria'),
    selEstado = document.querySelector('#selEstado'),
    inpFechaDesde = document.querySelector('#inpFechaDesde'),
    inpFechaHasta = document.querySelector('#inpFechaHasta'),
    btnNuevaTarea = document.querySelector('#btnNuevaTarea')
    ;

  // rellena ambos select de categorias
  getData('/categoria/get-all')
    .then(res => {
      // console.log(res);
      res.forEach(obj => {
        selCategoria.innerHTML += `<option value='${obj._id}'>${obj.categoria}</option>`;
      });
    });

  selCategoria.addEventListener('change', (e) => {
    const idCategoria = e.target.value;

    selSubcategoria.innerHTML = `<option selected value='' disabled>Selecciona una subcategoría</option>`;

    postData('/categoria/get-categoria', { idCategoria })
      .then(res => {
        console.log(res);
        const arrSubcategorias = res.subcategoria;

        arrSubcategorias.forEach(elem => {
          selSubcategoria.innerHTML += `<option value='${elem._id}'>${elem.nombre}</option>`
        });
      });

  });

  btnNuevaTarea.addEventListener('click', (e) => {
    cargarLoader();
    cleanFeedbacks();
    postData('/tarea/agregar', { descripcion: inpDescripcion.value, estado: selEstado.value, desdeHasta: [inpFechaDesde.value, inpFechaHasta.value], categoria: selCategoria.value, subcategoria: selSubcategoria.value })
      .then(res => {

        proccessResponse({
          res, inCaseValid: () => {
            // se envia id de la tarea para que sea animada como nueva tarea
            window.location.href = `/tarea/lista?anicard=${res.idTarea}`;
          }
        });
      });
  });
});