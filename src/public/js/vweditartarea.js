document.addEventListener('DOMContentLoaded', () => {

  const
    inpIdTarea = document.querySelector('#inpIdTarea'),
    inpDescripción = document.querySelector('#inpDescripción'),
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
        subcategoria = res.subcategoria;

      inpDescripción.value = descripcion;
      selEstado.value = estado;
      inpFechaDesde.value = fechaDesde;
      inpFechaHasta.value = fechaHasta;

      objDataOriginal = {
        descripcion,
        estado,
        fechaDesde,
        fechaHasta,
        idCategoria,
        subcategoria
      }

      const arrObjData = Object.keys(objDataOriginal);

      // arrObjData.forEach(key => {
      //   console.log(key);
      // });

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
              // console.log(res);
              const arrSubcategorias = res.subcategoria;

              arrSubcategorias.forEach(elem => {
                selSubcategoria.innerHTML += `<option value='${elem._id}'>${elem.nombre}</option>`
              });

              selSubcategoria.value = subcategoria;
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

  btnEditar.addEventListener('click', () => {

    const objDataNueva = {
      descripcion: inpDescripción.value,
      estado: selEstado.value,
      fechaDesde: inpFechaDesde.value,
      fechaHasta: inpFechaHasta.value,
      categoria: selCategoria.value,
      subcategoria: selSubcategoria.value,
    }

    const arrObjData = Object.keys(objDataOriginal);
    let objDataEnviar = { idTarea: inpIdTarea.value }

    arrObjData.forEach(key => {
      if (objDataOriginal[key] !== objDataNueva[key]) {
        objDataEnviar[key] = objDataNueva[key]
      }
    });

    console.log('Se enviará', objDataEnviar);

    postData('/tarea/editar', objDataEnviar)
      .then(res => {
        console.log(res);

        if (res) {
          Toast.fire({
            icon: 'success',
            title: `Tarea actualizada!`,
          });
        }
      });
  });

});