document.addEventListener('DOMContentLoaded', () => {
  const
    inpNuevaCategoria = document.querySelector('#inpNuevaCategoria'),
    btnClearInpNuevaCategoria = document.querySelector('#btnClearInpNuevaCategoria'),
    inpNuevaSubcategoria = document.querySelector('#inpNuevaSubcategoria'),
    btnAgregarCategoria = document.querySelector('#btnAgregarCategoria')
    ;

  const InputList = {
    createList: function (data) {
      const
        { input, arrObjetos, dataSpan } = data,
        newItemsList = document.createElement('div');

      newItemsList.classList.add('option_list_box');
      newItemsList.innerHTML = arrObjetos.map(obj => `<span data-${dataSpan.dataElement}='${obj[dataSpan.valueDataElement]}' class='option_item'>${obj[dataSpan.innerSpan]}</span>`).join('');
      newItemsList.addEventListener('click', (e) => {
        if (e.target && e.target.tagName === 'SPAN') {
          input.value = e.target.innerHTML.trim();
          input.setAttribute('data-idcat', e.target.getAttribute(`data-${dataSpan.dataElement}`));
          newItemsList.remove();
          // optionsList.classList.add('display_none');
        }
      });

      input.insertAdjacentElement('afterend', newItemsList); // lo agrega debajo del input de busqueda
    },
    deleteList: function (input) {
      if (input.nextElementSibling.classList.contains('option_list_box'))
        input.nextElementSibling.remove();
    },
    getItemList: function (data) {
      let { keyCode, itemSelected, ultimaPositionItem, itemsList } = data;
      itemsList = [...itemsList]; // asi se convierte en array ya que es una lista de Nodos

      if (keyCode === 'ArrowDown' && itemSelected === undefined) return itemsList[0];

      if (keyCode === 'ArrowUp' && itemSelected === undefined) return itemsList[ultimaPositionItem]; //ultimo del array

      if (keyCode === 'ArrowDown' && itemSelected !== undefined) {
        let proximaPosition = itemsList.indexOf(itemSelected) + 1;

        if (proximaPosition > ultimaPositionItem) return itemsList[0];
        if (proximaPosition <= ultimaPositionItem) return itemsList[proximaPosition];
      }

      if (keyCode === 'ArrowUp' && itemSelected !== undefined) {
        let proximaPosition = itemsList.indexOf(itemSelected) - 1;

        if (proximaPosition === -1) return itemsList[ultimaPositionItem];
        if (proximaPosition >= 0) return itemsList[proximaPosition];
      }
    },
    initInput: function (data) {

      let { input, callbackPeticion, validar } = data;

      // console.log('si no mando validar', data.hasOwnProperty(validar));

      if (data.hasOwnProperty(validar) === false) { validar = true; }

      input.addEventListener('keyup', (e) => {

        const
          keyCode = e.code, // codigo (no es numero)
          keyWich = e.which, // numero
          valorInput = e.target.value;

        // * se activa solo cuando sean teclas alfa-numéricas
        if ((keyWich >= 48 && keyWich <= 90) || keyCode === 'Backspace' || keyCode === 'Space') {

          if (validar) {
            callbackPeticion();
          }
        }

        // * captura cuando sean las teclas arrowUp/Down
        if (keyCode === 'ArrowUp' || keyCode === 'ArrowDown') {

          if (input.nextElementSibling.classList.contains('option_list_box')) { // valida si lo que hay next to el input es una lista de opciones
            const
              itemsList = input.nextElementSibling.querySelectorAll('.option_item'), // nextsibling, siempre va a a ser la lista de opciones
              ultimaPositionItem = itemsList.length - 1;
            let
              itemSelected = [...itemsList].filter(item => item.classList.contains('item_selected'))[0], // devuelve array con el span seleccionado (por eso el [0] ya que siempre va a ser 1), si devuelve vacio es porque no hay ninguno seleccionado
              nextItem = this.getItemList({ keyCode, itemSelected, ultimaPositionItem, itemsList });

            itemsList.forEach(item => item.classList.remove('item_selected'));
            nextItem.classList.add('item_selected');
          }

        }

        if (keyCode === 'Enter') {
          const itemSelected = input.nextElementSibling.querySelectorAll('.item_selected')[0]; // nextsibling, siempre va a a ser la lista de opciones
          input.setAttribute('data-idcat', itemSelected.getAttribute('data-idcat'));
          input.value = itemSelected.innerHTML.trim();
          this.deleteList(input);
        }
      });

    }
  }

  InputList.initInput({
    input: inpNuevaCategoria,
    callbackPeticion: () => {
      postData('/categoria/get-categoria-all', { categoria: inpNuevaCategoria.value.trim() })
        .then(res => {
          // console.log(res);
          if (res) {
            inpNuevaCategoria.setAttribute('data-idcat', '');
            InputList.deleteList(inpNuevaCategoria);
            InputList.createList({
              input: inpNuevaCategoria,
              arrObjetos: res,
              dataSpan: {
                dataElement: 'idcat',
                valueDataElement: '_id', // key del objeto que trae DB
                innerSpan: 'categoria' // key del objeto que trae DB
              }
            });
          }

          if (!res) {
            inpNuevaCategoria.setAttribute('data-idcat', '');
            InputList.deleteList(inpNuevaCategoria);
          }

        });
    }
  });

  InputList.initInput({
    input: inpNuevaSubcategoria,
    validar: inpNuevaCategoria.getAttribute('data-idcat'),
    callbackPeticion: () => {

      if (inpNuevaSubcategoria.value) {
        postData('/categoria/get-categoria', { idCategoria: inpNuevaCategoria.getAttribute('data-idcat') })
          .then(res => {
            // console.log(res);
            if (res) {
              InputList.deleteList(inpNuevaSubcategoria);

              const
                arrSubcategorias = res.subcategoria,
                arrObjResult = arrSubcategorias.filter(obj => obj.nombre.includes(inpNuevaSubcategoria.value.trim()))

              InputList.createList({
                input: inpNuevaSubcategoria,
                arrObjetos: arrObjResult,
                dataSpan: {
                  dataElement: 'idsubcat',
                  valueDataElement: '_id', // key del objeto que trae DB
                  innerSpan: 'nombre' // key del objeto que trae DB
                }
              });
            }

            if (!res) {
              // inpNuevaCategoria.setAttribute('data-idcat', '');
              InputList.deleteList(inpNuevaSubcategoria);
            }

          });
      }

      if (!inpNuevaSubcategoria.value) {
        InputList.deleteList(inpNuevaSubcategoria);
      }


    }
  })

  btnClearInpNuevaCategoria.addEventListener('click', (e) => {
    inpNuevaCategoria.value = '';
    // optionsList.classList.add('display_none');
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