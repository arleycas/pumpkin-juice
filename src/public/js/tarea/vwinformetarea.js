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
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'EXCEL',
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
      console.log(res);

      let listaAnos = '';
      res.forEach(ano => {
        listaAnos += `<option value='${ano}'>${ano}</option>`;
      });

      selAno.innerHTML += listaAnos;

    });

  getData('/tarea/getMonths')
    .then(res => {
      console.log(res);

      let listaMeses = '';
      res.forEach(obj => {
        listaMeses += `<option value='${obj.num}'>${obj.nombre}</option>`;
      });

      selMes.innerHTML += listaMeses;

    });

  btnBuscar.addEventListener('click', (e) => {
    cargarLoader();

    postData('/tarea/getTareasInforme', { ano: selAno.value, mes: selMes.value })
      .then(res => {
        console.log('res fechas xd', res);

        if (res) {

          let contenidoTabla = '';

          res.forEach(obj => {
            contenidoTabla += `
            <tr>
              <td>${obj.descripcion}</td>
              <td>${obj.categoria}</td>
              <td>${obj.subcategoria}</td>
              <td>${obj.estado}</td>
              <td>${beautyDate(obj.fecha)}</td>
            </tr>
            `;
          });

          tblInforme.destroy();
          bodyTabla.innerHTML = contenidoTabla;
          tblInforme = new DataTable('#tblInforme', configDatatable);
          ocultarLoader();
        }
      });
  });


  function beautyDate(strDate) {
    const
      arrDateTime = strDate.split('T'),
      arrDate = arrDateTime[0].split('-'),
      year = arrDate[0],
      month = arrDate[1],
      day = arrDate[2],
      objMonth = {
        '01': 'Ene',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Abr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Ago',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dic',
      };

    return `${objMonth[month]} ${day} de ${year}`;
  }



});