document.addEventListener('DOMContentLoaded', () => {

  const
    inpIdTarea = document.querySelector('#inpIdTarea'),
    inpDescripcion = document.querySelector('#inpDescripcion'),
    selEstado = document.querySelector('#selEstado'),
    inpFechaDesde = document.querySelector('#inpFechaDesde'),
    inpFechaHasta = document.querySelector('#inpFechaHasta'),
    selCategoria = document.querySelector('#selCategoria'),
    selSubcategoria = document.querySelector('#selSubcategoria'),
    btnEditar = document.querySelector('#btnEditar');
  let objDataOriginal = {}

  postData('/tarea/getTarea', { idTarea: inpIdTarea.value })
    .then(res => {
      console.log(res);

      const
        descripcion = res.descripcion,
        estado = res.estado,
        fechaDesde = res.desdeHasta[0] ? res.desdeHasta[0].split('T')[0] : '',
        fechaHasta = res.desdeHasta[1] ? res.desdeHasta[1].split('T')[0] : '',
        idCategoria = res.categoria,
        idSubcategoria = res.subcategoria;

      inpDescripcion.value = descripcion;
      selEstado.value = estado;
      inpFechaDesde.value = fechaDesde;
      inpFechaHasta.value = fechaHasta;

      objDataOriginal = {
        descripcion,
        estado,
        fechaDesde,
        fechaHasta,
        idCategoria,
        idSubcategoria
      }

      // rellena ambos select de categorias
      getData('/categoria/get-all')
        .then(res => {
          // console.log(res);
          res.forEach(obj => {
            selCategoria.innerHTML += `<option value='${obj._id}'>${obj.categoria}</option>`;
          });
          selCategoria.value = idCategoria;

          postData('/categoria/get-categoria', { idCategoria })
            .then(res => {
              console.log('esto traigoo', res);

              if (res) {
                const arrSubcategorias = res.subcategoria;

                arrSubcategorias.forEach(elem => {
                  selSubcategoria.innerHTML += `<option value='${elem._id}'>${elem.nombre}</option>`
                });

                selSubcategoria.value = idSubcategoria;
              }
            });

        });

      // formato que acepta input de fecha: '2022-04-12'
    });

  selCategoria.addEventListener('change', (e) => {
    const idCategoria = e.target.value;

    selSubcategoria.innerHTML = '<option selected disabled>Selecciona una subcategoría</option>';

    postData('/categoria/get-categoria', { idCategoria })
      .then(res => {
        // console.log(res);
        const arrSubcategorias = res.subcategoria;

        arrSubcategorias.forEach(elem => {
          selSubcategoria.innerHTML += `<option value='${elem._id}'>${elem.nombre}</option>`
        });
      });
  });

  btnEditar.addEventListener('click', (e) => {

    const objDataNueva = {
      descripcion: inpDescripcion.value,
      estado: selEstado.value,
      fechaDesde: inpFechaDesde.value,
      fechaHasta: inpFechaHasta.value,
      idCategoria: selCategoria.value,
      idSubcategoria: selSubcategoria.value,
    }

    // TODO, esto deberia ir en el backend
    // const arrObjData = Object.keys(objDataOriginal);
    // arrObjData.forEach(key => {
    //   if (objDataOriginal[key] !== objDataNueva[key]) {
    //     objDataEnviar[key] = objDataNueva[key]
    //   }
    // });

    postData('/tarea/editar', { idTarea: inpIdTarea.value, objDataOriginal, objDataNueva })
      .then(res => {
        console.log(res);

        proccessResponse({
          res,
          inCaseValid: () => { window.location.href = '' }
        });

        // if (res) {
        //   Toast.fire({
        //     icon: 'success',
        //     title: `Tarea actualizada!`,
        //   });
        // }
      });
  });

});