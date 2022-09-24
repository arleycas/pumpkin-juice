document.addEventListener('DOMContentLoaded', () => {
  const
    btnToggleEstado = document.querySelector('#btnToggleEstado'),
    selFiltroEstado = document.querySelector('#selFiltroEstado'),
    contFiltroEstado = document.querySelector('#contFiltroEstado'),
    arrEstados = ['To Do', 'Doing', 'Done'],
    btnToggleRangoFechas = document.querySelector('#btnToggleRangoFechas'),
    inpFechaInicio = document.querySelector('#inpFechaInicio'),
    inpFechaFin = document.querySelector('#inpFechaFin'),
    btnToggleCategorias = document.querySelector('#btnToggleCategorias'),
    selFiltroCategoria = document.querySelector('#selFiltroCategoria'),
    btnQuitarFiltros = document.querySelector('#btnQuitarFiltros'),
    btnFiltrar = document.querySelector('#btnFiltrar'),
    modalFiltro = document.querySelector('#modalFiltro'),
    dotFiltro = document.querySelector('#dotFiltro')
    ;

  let savedFilterData = {};

  btnToggleEstado.addEventListener('click', (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      contFiltroEstado.classList.remove('display_none');
    }

    if (isChecked === false) {
      contFiltroEstado.classList.add('display_none');
    }

  });

  btnToggleRangoFechas.addEventListener('click', (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      document.querySelector('#contFiltroFechas').classList.remove('display_none');
    }

    if (isChecked === false) {
      document.querySelector('#contFiltroFechas').classList.add('display_none');
    }

  });

  getData('/categoria/get-all')
    .then(res => {
      // console.log(res);
      res.forEach(obj => {
        selFiltroCategoria.innerHTML += `<option value='${obj._id}'>${obj.categoria}</option>`;
      });
      ocultarLoader();
    });

  btnToggleCategorias.addEventListener('click', (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      document.querySelector('#contFiltroCategoria').classList.remove('display_none');
    }

    if (isChecked === false) {
      document.querySelector('#contFiltroCategoria').classList.add('display_none');
    }

  });

  btnFiltrar.addEventListener('click', (e) => {

    // * Nota: la validación esta desde el front por que desde el back me mamó gallo

    let queryURL = '';

    if (btnToggleEstado.checked) {

      if (!selFiltroEstado.value) {
        Toast.fire({ icon: 'error', title: 'Selecciona un estado' });
        e.preventDefault();
        return;
      }
      queryURL += `&estado=${selFiltroEstado.value}`;
    }

    if (btnToggleRangoFechas.checked) {
      if (!inpFechaInicio.value || !inpFechaFin.value) {
        Toast.fire({ icon: 'error', title: 'No dejes ninguna fecha vacia!' });
        e.preventDefault();
        return;
      }

      const
        fi = new Date(`${inpFechaInicio.value} 23:59:59`),
        ff = new Date(`${inpFechaFin.value} 23:59:59`);

      if (fi > ff) {
        Toast.fire({ icon: 'error', title: `La fecha "Desde" no puede ser mayor a la fecha "Hasta"` });
        e.preventDefault();
        return;
      }

      queryURL += `&rangoFechas=${inpFechaInicio.value},${inpFechaFin.value}`;
    }

    if (btnToggleCategorias.checked) {
      if (!selFiltroCategoria.value) {
        Toast.fire({ icon: 'info', title: 'Selecciona una categoría' });
        e.preventDefault();
        return;
      }

      queryURL += `&categoria=${selFiltroCategoria.value}`;
    }

    // console.log('QUERY URL:', queryURL);
    window.location.href = `?${queryURL}`;

  });
  // selFiltroEstado.addEventListener('change', (e) => {
  //   const estadoSelect = e.target.value;
  //   console.log(estadoSelect);

  //   if (estadoSelect === 'All') {
  //     window.location.href = '/tarea/lista/1'
  //     return;
  //   }
  //   window.location.href = `?estado=${estadoSelect}`;
  // });

  if (window.location.search) {
    // * configura el modal de filtros, para que se pongan los que envió el usuario al backend
    const
      queryString = window.location.search, // retorna algo como '?estado=Doing'
      urlParams = new URLSearchParams(queryString), // guarda todas las variables de la URL
      estado = urlParams.get('estado'),
      rangoFechas = urlParams.get('rangoFechas'),
      categoria = urlParams.get('categoria')
      ;
    let cantFiltros = 0;

    if (estado) {
      if (arrEstados.includes(estado)) {
        selFiltroEstado.value = estado;
        savedFilterData.estado = estado;
        cantFiltros++;
      }
      btnToggleEstado.click();
    }

    if (rangoFechas) {
      const
        arrFecha = rangoFechas.split(','),
        fechaInicio = arrFecha[0].trim(),
        fechaFin = arrFecha[1].trim();

      inpFechaInicio.value = fechaInicio;
      inpFechaFin.value = fechaFin;
      savedFilterData.fechaInicio = fechaInicio;
      savedFilterData.fechaFin = fechaFin;
      cantFiltros++;
      btnToggleRangoFechas.click();
    }

    if (categoria) {
      setTimeout(() => { selFiltroCategoria.value = categoria }, 2000);
      savedFilterData.categoria = categoria;
      cantFiltros++;
      btnToggleCategorias.click();
    }

    if (cantFiltros > 0) {
      document.querySelectorAll('.btn-dot').forEach(dot => dot.classList.remove('display_none')); // muestra los dot
      dotFiltro.innerHTML = cantFiltros;
    };

    // * Se pone el filtro en cada href de la paginación
    document.querySelectorAll('.page-item-num a').forEach(link => {
      link.href += queryString;
    });
  }

  dotFiltro.addEventListener('click', (e) => {
    // por si le da click al dot queriendole dar click al boton que abre el modal de filtros 
    e.target.previousElementSibling.click();
  });

  // * modal
  modalFiltro.addEventListener('hidden.bs.modal', (e) => {

    // * en caso de que cierren el modal del filtro y hayan hecho algún cambio sin darle en el botón "filtrar"
    if (Object.keys(savedFilterData).length > 0) {

      // deschequear todos los checks
      document.querySelectorAll('#modalFiltro .form-check-input').forEach(elem => {
        if (elem.checked === true) { elem.click() }
      });

      if (savedFilterData.hasOwnProperty('estado')) {
        selFiltroEstado.value = savedFilterData.estado;
        if (btnToggleEstado.checked === false) btnToggleEstado.click();
      }

      if (savedFilterData.hasOwnProperty('fechaInicio')) {
        inpFechaInicio.value = savedFilterData.fechaInicio;
        inpFechaFin.value = savedFilterData.fechaFin;
        if (btnToggleRangoFechas.checked === false) btnToggleRangoFechas.click();
      }

      if (savedFilterData.hasOwnProperty('categoria')) {
        selFiltroCategoria.value = savedFilterData.categoria;
        if (btnToggleCategorias.checked === false) btnToggleCategorias.click();
      }

    }

    // oculta el menucito de opciones flotante
    document.querySelector('.btn-toggle-list').classList.remove('active-list');
  });

  btnQuitarFiltros.addEventListener('click', (e) => {
    window.location.href = '/tarea/lista/1'
    return;
  });

});
