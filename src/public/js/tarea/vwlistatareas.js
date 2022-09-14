document.addEventListener('DOMContentLoaded', () => {
  const
    phraseRandom = document.querySelector('#phraseRandom'),
    contCardTareas = document.querySelector('#contCardTareas'),
    btnBackPag = document.querySelector('#btnBackPag'),
    btnNextPag = document.querySelector('#btnNextPag');
  let nPagActual = 1;

  // * manejador de la url de este modulo
  if (window.location.pathname.length) {
    const
      arrUrl = window.location.pathname.split('/');
    nPagActual = parseInt(arrUrl[arrUrl.length - 1]);
    const
      cantPaginas = document.querySelectorAll('.page-item-num').length,
      nPagBack = nPagActual - 1,
      nPagNext = nPagActual + 1,
      btnPage = document.querySelector(`#pag${nPagActual}`);

    // * si la pagina actual no tiene cards, entonces que me envie a la anterior página
    if (document.querySelectorAll('.card').length === 0) {
      window.location.href = `/tarea/lista/${nPagActual - 1}`;
    }

    // * (manejador de variables de URL) comprueba si hay alguna card nueva creada que necesite ser animada
    if (window.location.search) {
      const
        queryString = window.location.search, // retorna algo como '?anicard=1234'
        urlParams = new URLSearchParams(queryString), // guarda todas las variables de la URL
        idCard = urlParams.get('anicard'), // se obtiene la que necesitamos
        card = document.querySelector(`#cardId${idCard}`);

      if (idCard) {
        if (card) document.querySelector(`#cardId${idCard}`).classList.add('animate__rubberBand'); // anima la card
        window.history.pushState({}, document.title, "/tarea/lista/1"); // limpia la url en el caso de que le den F5 no se vuelva a animar la card (y no refresca la página)
      }

    }

    // * gestiona el nav de paginación (botones next y back)
    btnPage.classList.add('active');
    btnBackPag.querySelector('a').href = `/tarea/lista/${nPagBack}`;
    btnNextPag.querySelector('a').href = `/tarea/lista/${nPagNext}`;

    if (nPagBack === 0) {
      btnBackPag.classList.add('disabled');
    }

    if (nPagNext > cantPaginas) {
      btnNextPag.classList.add('disabled');
    }
  }

  contCardTareas.addEventListener('click', (e) => {

    if (e.target && e.target.classList.contains('btn_eliminar_tarea')) {
      e.stopPropagation();

      const
        target = e.target.tagName.toLowerCase() === 'button' ? e.target : e.target.parentElement,
        idTarea = target.getAttribute('data-id');

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
              console.log(res);

              if (res) {
                console.log(target.parentElement.parentElement);
                target.parentElement.parentElement.classList.add('animate__bounceOutLeft'); // apunta a la 'card'
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
      if (padre.classList.contains('btn_eliminar_tarea')) {
        padre.click();
      }
    }
  });

  // * frase random

  phraseRandom.innerHTML = window.getRandomNaniPhrase();


});