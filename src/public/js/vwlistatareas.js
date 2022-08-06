document.addEventListener('DOMContentLoaded', () => {
  // let myModal = new bootstrap.Modal(document.querySelector('#modalEditarTarea'), options)
  const
    btnBackPag = document.querySelector('#btnBackPag'),
    btnNextPag = document.querySelector('#btnNextPag');
  let nPagActual = 1;

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

  document.querySelectorAll('.btn_eliminar_tarea').forEach(btn => {

    btn.addEventListener('click', (e) => {
      const
        target = e.target.tagName.toLowerCase() === 'button' ? e.target : e.target.parentElement,
        idTarea = target.getAttribute('data-id');

      console.log(idTarea);


      Swal.fire({
        title: '¿Segura?',
        text: "Se perderá la tarea por siempre",
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

    });
  });




});