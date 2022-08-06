document.addEventListener('DOMContentLoaded', () => {
  const
    inpNuevaCategoria = document.querySelector('#inpNuevaCategoria'),
    inpNuevaSubcategoria = document.querySelector('#inpNuevaSubcategoria'),
    btnAgregarCategoria = document.querySelector('#btnAgregarCategoria')
    ;

  btnAgregarCategoria.addEventListener('click', (e) => {
    cargarLoader();
    cleanFeedbacks();

    postData('/categoria/agregar-categoria', { categoria: inpNuevaCategoria.value, subcategoria: inpNuevaSubcategoria.value })
      .then(res => {
        console.log(res)

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


  function cleanFeedbacks() {
    document.querySelectorAll('.feedback_box').forEach(elem => {
      elem.innerHTML = '';
    });
  }
});