document.addEventListener('DOMContentLoaded', () => {
  cargarLoader();
  const
    selConfigCategoria = document.querySelector('#selConfigCategoria'),
    tableSubcategorias = document.querySelector('#tableSubcategorias'),
    bodyTableSubcategorias = document.querySelector('#bodyTableSubcategorias'),
    btnEditarCategoria = document.querySelector('#btnEditarCategoria'),
    btnEliminarCategoria = document.querySelector('#btnEliminarCategoria')
    ;

  // rellena ambos select de categorias
  getData('/categoria/get-all')
    .then(res => {
      // console.log(res);
      res.forEach(obj => {
        selConfigCategoria.innerHTML += `<option value='${obj._id}'>${obj.categoria}</option>`;
      });
      ocultarLoader();
    });

  selConfigCategoria.addEventListener('change', (e) => {
    const idCategoria = e.target.value;

    postData('/categoria/get-categoria', { idCategoria })
      .then(res => {
        //arma la tabla de subcategorías
        const arrSubcategorias = res.subcategoria;

        console.log(arrSubcategorias);

        bodyTableSubcategorias.innerHTML = '';

        if (arrSubcategorias.length) {

          arrSubcategorias.forEach(subcategoria => {

            bodyTableSubcategorias.innerHTML += `
              <tr>
                <th scope='row'>${subcategoria.nombre}</th>
                <td><button type='button' class='btn btn-primary btn_abrir_editor_subcategoria' data-idcat='${res._id}' data-idsubcat='${subcategoria._id}' data-value='${subcategoria.nombre}'>Editar</button></td>
                <td><button type='button' class='btn btn-primary btn_eliminar_subcategoria' data-idcat='${res._id}' data-idsubcat='${subcategoria._id}' data-nombre='${subcategoria.nombre}'>Eliminar</button></td>
              </tr>
              `;
          });
        }

        btnEditarCategoria.disabled = false;
        btnEliminarCategoria.disabled = false;
      });

  });

  btnEditarCategoria.addEventListener('click', (e) => {

    console.log(selConfigCategoria.options[selConfigCategoria.selectedIndex]);
    const
      idCategoria = selConfigCategoria.value,
      categoriaVieja = selConfigCategoria.options[selConfigCategoria.selectedIndex].text;

    Swal.fire({
      title: 'Edita el nombre de la categoría',
      input: 'text',
      inputLabel: '(*￣3￣)╭',
      inputValue: categoriaVieja,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar',
      inputValidator: (categoriaNueva) => {
        if (!categoriaNueva) {
          return 'Debes escribir algo!'
        } else {
          postData('/categoria/editar-categoria', { idCategoria, categoriaNueva, categoriaVieja })
            .then(res => {
              console.log(res);
              window.location.href = '';
            });
        }
      }
    });
  });

  btnEliminarCategoria.addEventListener('click', () => {

    Swal.fire({
      title: '¿Segura?',
      html: `Si eliminas la categoria <span class='txt-danger'>${selConfigCategoria.options[selConfigCategoria.selectedIndex].text}</span> se borrarán todas las tareas asociadas a esta`,
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

        cargarLoader();
        const idCategoria = selConfigCategoria.value;

        postData('/categoria/eliminar-categoria', { idCategoria })
          .then(res => {

            proccessResponse({
              res,
              inCaseValid: () => { window.location.href = '' }
            });
          });
      }
    });


  });

  // * listeners de los botones que estan en la tabla de subcategorias (editar y eliminar)
  tableSubcategorias.addEventListener('click', (e) => {

    if (e.target && e.target.classList.contains('btn_abrir_editor_subcategoria')) {

      const
        btn = e.target,
        idCategoria = btn.getAttribute('data-idcat'),
        idSubcategoria = btn.getAttribute('data-idsubcat'),
        subcategoriaVieja = btn.getAttribute('data-value');


      Swal.fire({
        title: 'Edita el nombre de la subcategoría',
        input: 'text',
        inputLabel: '(*￣3￣)╭',
        inputValue: subcategoriaVieja,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        cancelButtonText: 'Cancelar',
        inputValidator: (subcategoriaNueva) => {
          if (!subcategoriaNueva) {
            return 'Debes escribir algo!'
          } else {
            postData('/categoria/editar-subcategoria', { idCategoria, subcategoriaVieja, subcategoriaNueva })
              .then(res => {
                console.log(res);
                selConfigCategoria.dispatchEvent(new Event('change'));
                selConfigCategoria.value = idCategoria;
                Toast.fire({
                  icon: 'success',
                  title: `Nombre de subcategoría actualizado de <span style="color: #9f0000">${subcategoriaVieja}</span> a <span style="color: #42A9DF">${subcategoriaNueva}</span>`,
                });
              });
          }
        }
      });
    }

    if (e.target && e.target.classList.contains('btn_eliminar_subcategoria')) {

      const
        btn = e.target,
        idCategoria = btn.getAttribute('data-idcat'),
        idSubcategoria = btn.getAttribute('data-idsubcat'),
        nombreSubCat = btn.getAttribute('data-nombre');

      // console.log(idCategoria);
      // console.log('subcate', idSubcategoria);

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

          postData('/categoria/eliminar-subcategoria', { idCategoria, idSubcategoria })
            .then(res => {
              console.log(res);
              window.location.href = '';
            });
        }
      });
    }

  });
});
