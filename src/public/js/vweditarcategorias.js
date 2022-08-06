document.addEventListener('DOMContentLoaded', () => {
  const
    selConfigCategoria = document.querySelector('#selConfigCategoria'),
    bodyTableSubcategorias = document.querySelector('#bodyTableSubcategorias'),
    btnEditarCategoria = document.querySelector('#btnEditarCategoria'),
    btnEliminarCategoria = document.querySelector('#btnEliminarCategoria'),
    tableSubcategorias = document.querySelector('#tableSubcategorias')
    ;

  // rellena ambos select de categorias
  getData('/categoria/get-all')
    .then(res => {
      // console.log(res);
      res.forEach(obj => {
        selConfigCategoria.innerHTML += `<option value='${obj._id}'>${obj.categoria}</option>`;
      });
    });

  selConfigCategoria.addEventListener('change', (e) => {
    const idCategoria = e.target.value;

    console.log(idCategoria);

    postData('/categoria/get-categoria', { idCategoria })
      .then(res => {
        console.log(res);

        //arma la tabla de subcategorías
        const arrSubcategorias = res.subcategoria;

        bodyTableSubcategorias.innerHTML = '';

        arrSubcategorias.forEach(subcategoria => {

          bodyTableSubcategorias.innerHTML += `
              <tr>
                <th scope='row'>${subcategoria.nombre}</th>
                <td><button type='button' class='btn btn-primary btn_abrir_editor_subcategoria' data-idcat='${res._id}' data-value='${subcategoria.nombre}'>Editar</button></td>
                <td><button type='button' class='btn btn-primary btn_eliminar_subcategoria' data-idcat='${res._id}' data-nombre='${subcategoria.nombre}'>Eliminar</button></td>
              </tr>
              `;
        });

      });

  });

  btnEditarCategoria.addEventListener('click', (e) => {
    Swal.fire({
      title: 'Edita el nombre de la categoría',
      input: 'text',
      inputLabel: '(*￣3￣)╭',
      inputValue: subcategoriaVieja,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir algo!'
        } else {
          postData('/categoria/editar-subcategoria', { idCategoria, subcategoriaVieja, subcategoriaNueva: value })
            .then(res => {
              console.log(res)
              ocultarLoader();
            });
        }
      }
    });
  });

  btnEliminarCategoria.addEventListener('click', () => {

    const idCategoria = selConfigCategoria.value;

    postData('/categoria/eliminar-categoria', { idCategoria })
      .then(res => {

        if (res.isValid === false) {

          const arrFaltantes = res.faltantes;

          arrFaltantes.forEach(obj => {
            if (obj.msgs.length) {
              document.querySelector(obj.idInput).classList.add('inp_invalid'); // colorea el input
            }

            obj.msgs.forEach(msg => { // rellena los mensajes de error
              document.querySelector(obj.idFeedback).innerHTML += `${msg}<br>`;
            })
          });
        }

        if (res.isValid) {
          window.location.href = '';
        }

        ocultarLoader();
      });
  });

  // * listeners de los botones que estan en la tabla de subcategorias (editar y eliminar)
  tableSubcategorias.addEventListener('click', (e) => {

    if (e.target && e.target.classList.contains('btn_abrir_editor_subcategoria')) {

      const
        btn = e.target,
        idCategoria = btn.getAttribute('data-idcat'),
        subcategoriaVieja = btn.getAttribute('data-value');

      Swal.fire({
        title: 'Edita el nombre de la subcategoría',
        input: 'text',
        inputLabel: '(*￣3￣)╭',
        inputValue: subcategoriaVieja,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes escribir algo!'
          } else {
            // creo que esto de naranja ya está xD, REVISAR
            // TODO, si se actualizan las categorias o subcategorías aquí, se deberían actualizar las de todos las tareas creadas?
            // TODO, creo que es mejor en vez de guardar las categorías o subcategorias, guardar es el id
            // TODO, así que en vez de traer en nombre en si se trae es el id 
            postData('/categoria/editar-subcategoria', { idCategoria, subcategoriaVieja, subcategoriaNueva: value })
              .then(res => {
                console.log(res)
                ocultarLoader();
              });
          }
        }
      });
    }

    if (e.target && e.target.classList.contains('btn_eliminar_subcategoria')) {

      const
        btn = e.target,
        idCategoria = btn.getAttribute('data-idcat'),
        nombreSubCat = btn.getAttribute('data-nombre');

      console.log(idCategoria);

      Swal.fire({
        title: '¿Segura?',
        html: `Si eliminas la subcategoria <span class='txt-danger'>${nombreSubCat}</span> se borrarán todas las tareas asociadas a esta`,
        icon: '',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrala!',
        imageUrl: '/img/5e535aa1d871310896104715_peep-77.svg',
        imageWidth: 150
      }).then((result) => {
        if (result.isConfirmed) {

          // postData('/tarea/eliminar', { idTarea })
          //   .then(res => {
          //     console.log(res);

          //     if (res) {
          //       console.log(target.parentElement.parentElement);
          //       target.parentElement.parentElement.classList.add('animate__bounceOutLeft'); // apunta a la 'card'
          //       setTimeout(() => {
          //         window.location.href = `/tarea/lista/${nPagActual}`
          //       }, 500);
          //     }
          //   });
        }
      });
    }

  });
});
