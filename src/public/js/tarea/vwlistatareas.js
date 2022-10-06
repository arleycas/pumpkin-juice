document.addEventListener('DOMContentLoaded', () => {
  const
    phraseRandom = document.querySelector('#phraseRandom'),
    contTareas = document.querySelector('#contTareas'),
    modalDetalleTarea = new bootstrap.Modal(document.getElementById('modalDetalleTarea')),
    contBotonesModal = document.querySelector('#contBotonesModal'),
    btnEditarTarea = document.querySelector('#btnEditarTarea'),
    btnEliminarTarea = document.querySelector('#btnEliminarTarea');


  // * manejador de la url de este modulo
  if (window.location.pathname.length) {

    // * (manejador de variables de URL) comprueba si hay alguna card nueva creada que necesite ser animada
    if (window.location.search) {
      const
        queryString = window.location.search, // retorna algo como '?anicard=1234'
        urlParams = new URLSearchParams(queryString), // guarda todas las variables de la URL
        idCard = urlParams.get('anicard'), // se obtiene la que necesitamos
        card = document.querySelector(`#cardId${idCard}`);

      if (idCard) {
        if (card) document.querySelector(`#cardId${idCard}`).classList.add('animate__rubberBand'); // anima la card
        window.history.pushState({}, document.title, "/tarea/lista"); // limpia la url en el caso de que le den F5 no se vuelva a animar la card (y no refresca la página)
      }

    }
  }

  contTareas.addEventListener('click', (e) => {

    const
      idCard = e.target.id,
      idTarea = idCard.replace('cardId', ''),
      loaderDetalleTarea = document.querySelector('#modalDetalleTarea .second-loader'),
      bodyCard = document.querySelector('#modalDetalleTarea .modal-body')
      ;

    if (e.target && e.target.classList.contains('card')) {
      modalDetalleTarea.show();

      postData('/tarea/getTarea', { idTarea })
        .then(res => {
          // console.log(res.cooked);
          const
            resTarea = res.cooked,
            detEstado = document.querySelector('#detEstado'),
            detDescripcion = document.querySelector('#detDescripcion'),
            detCategoria = document.querySelector('#detCategoria'),
            detSubcategoria = document.querySelector('#detSubcategoria'),
            detFechaDH = document.querySelector('#detFechaDH')
            ;

          // rellena el modal con los datos de la tarea
          detEstado.innerHTML = `<i class='${resTarea.classIcon}' style='color: ${resTarea.colorIcon}'></i> ${resTarea.estado}`;
          detDescripcion.innerHTML = resTarea.descripcion;
          detCategoria.innerHTML = resTarea.categoria;
          detSubcategoria.innerHTML = resTarea.subcategoria;
          detFechaDH.innerHTML = `<i class='bx bxs-calendar'></i> ${resTarea.fechaDesde} ~ ${resTarea.fechaHasta}`;
          btnEditarTarea.href = `/tarea/editar/${resTarea._id}`;
          btnEliminarTarea.setAttribute('data-id', resTarea._id);

          loaderDetalleTarea.classList.add('display_none'); // oculta
          bodyCard.classList.remove('display_none'); // muestra
        });

    }

  });

  contBotonesModal.addEventListener('click', (e) => {

    if (e.target && e.target.id === 'btnEliminarTarea') {

      const idTarea = e.target.getAttribute('data-id');
      console.log(idTarea);

      Swal.fire({
        title: '¿Segura?',
        text: "Se perderá la tarea por siempre",
        icon: '',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3c4d5e',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrala!',
        imageUrl: '/img/5e535aa1d871310896104715_peep-77.svg',
        imageWidth: 150,
        focusCancel: true
      }).then((result) => {
        if (result.isConfirmed) {

          postData('/tarea/eliminar', { idTarea })
            .then(res => {
              // console.log(res);

              if (res) {

                document.querySelector(`#cardId${idTarea}`).classList.add('animate__bounceOutLeft');
                modalDetalleTarea.hide();
                setTimeout(() => {
                  window.location.href = `/tarea/lista/${nPagActual}`
                }, 500);
              }
            });
        }
      });

    }

    // ** en caso de que le den click al icono dentro de botón eliminar
    if (e.target && e.target.tagName === 'I') {
      const padre = e.target.parentElement;
      if (padre.id === 'btnEliminarTarea') {
        padre.click();
      }
    }

  });

  // * frase random
  phraseRandom.innerHTML = window.getRandomNaniPhrase();

});