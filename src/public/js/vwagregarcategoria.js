document.addEventListener('DOMContentLoaded', () => {
  const
    inpNuevaCategoria = document.querySelector('#inpNuevaCategoria'),
    btnClearInpNuevaCategoria = document.querySelector('#btnClearInpNuevaCategoria'),
    inpNuevaSubcategoria = document.querySelector('#inpNuevaSubcategoria'),
    btnAgregarCategoria = document.querySelector('#btnAgregarCategoria'),
    optionsList = document.querySelector('#optionsList')
    ;

  optionsList.addEventListener('click', (e) => {

    if (e.target && e.target.tagName === 'SPAN') {
      inpNuevaCategoria.value = e.target.innerHTML.trim();
      optionsList.classList.add('display_none');
    }
  });

  inpNuevaCategoria.addEventListener('keyup', (e) => {
    const valorInput = e.target.value;

    postData('/categoria/get-categoria-all', { categoria: valorInput })
      .then(res => {
        // console.log(res);
        if (res) {

          let listaOpciones = '';
          optionsList.classList.remove('display_none');
          res.forEach(obj => {
            // console.log(obj.categoria);
            listaOpciones += `
              <span class='option_item'>${obj.categoria}</span>
            `;
          });

          optionsList.innerHTML = listaOpciones;
        }

        if (!res) {
          optionsList.innerHTML = '';
          optionsList.classList.add('display_none');
        }

      });
  });

  btnClearInpNuevaCategoria.addEventListener('click', (e) => {
    inpNuevaCategoria.value = '';
    optionsList.classList.add('display_none');
  });

  btnAgregarCategoria.addEventListener('click', (e) => {
    cargarLoader();
    cleanFeedbacks();

    postData('/categoria/agregar-categoria', { categoria: inpNuevaCategoria.value, subcategoria: inpNuevaSubcategoria.value })
      .then(res => {
        proccessResponse({ res, inCaseValid: () => { window.location.href = ''; } });
        ocultarLoader();
      });
  });

});