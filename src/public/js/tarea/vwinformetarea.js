document.addEventListener('DOMContentLoaded', () => {
  const
    selAno = document.querySelector('#selAno'),
    selMes = document.querySelector('#selMes'),
    bodyTabla = document.querySelector('#bodyTabla'),
    btnBuscar = document.querySelector('#btnBuscar'),
    configDatatable = {
      // options
      responsive: 'true',
      dom: '<"centerTopDataTable"lf>rt<"centerTopDataTable"ip>B',
      iDisplayLength: 5,
      aLengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, 'All'],
      ],
      columns: [
        { "width": "50%" },
        null,
        null,
        null,
        null
      ],
      buttons: [
        {
          extend: 'excelHtml5',
          text: `Excel <i class='bx bxs-download' ></i>`,
          titleAttr: 'Exportar a Excel',
          className: 'green darken-4',
        },
      ],
      language: {
        lengthMenu: 'Mostrar _MENU_ registros',
        zeroRecords: 'No se encontraron resultados',
        info: 'Registros en total - _TOTAL_',
        infoEmpty: '0 registros',
        infoFiltered: '(filtrado de un total de MAX registros)',
        sSearch: 'Buscar:',
        oPaginate: {
          sFirst: 'Primero',
          sLast: 'Último',
          sNext: 'Siguiente',
          sPrevious: 'Anterior',
        },
        sProcessing: 'Procesando...',
      },
    };


  let tblInforme = new DataTable('#tblInforme', configDatatable);

  getData('/tarea/getYears')
    .then(res => {
      // console.log(res);
      let listaAnos = '';
      res.forEach(ano => {
        listaAnos += `<option value='${ano}'>${ano}</option>`;
      });

      selAno.innerHTML += listaAnos;

    });

  getData('/tarea/getMonths')
    .then(res => {
      // console.log(res);
      let listaMeses = '';
      res.forEach(obj => {
        listaMeses += `<option value='${obj.num}'>${obj.nombre}</option>`;
      });

      selMes.innerHTML += listaMeses;

    });

  btnBuscar.addEventListener('click', (e) => {
    cargarLoader();
    cleanFeedbacks();

    postData('/tarea/getTareasInforme', { ano: selAno.value, mes: selMes.value })
      .then(res => {
        proccessResponse({
          res, inCaseValid: () => {

            console.log('Si entra');
            if (res) {
              let contenidoTabla = '';

              res.data.forEach(obj => {
                contenidoTabla += `
                <tr>
                  <td>${obj.descripcion}</td>
                  <td>${obj.categoria}</td>
                  <td>${obj.subcategoria}</td>
                  <td>${obj.estado}</td>
                  <td>${obj.fechaDesde} ~ ${obj.fechaHasta}</td>
                </tr>
                `;
              });

              tblInforme.destroy();
              bodyTabla.innerHTML = contenidoTabla;
              tblInforme = new DataTable('#tblInforme', configDatatable);
              ocultarLoader();
            }
          }
        });
        ocultarLoader();
      });
  });

});