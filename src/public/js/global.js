// * getData -> Petifciones GET, recibe como parametro solo una ruta. Ej: getData('/prueba')
const getData = async (route) => {
  try {
    let res = await fetch(route);
    let json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    return json;
  } catch (err) {
    console.error(err);
    Toast.fire({
      icon: 'error',
      title: `Error en getData(): ${(err.status, err.statusText)}`,
    });
  }
};

// * postData -> Peticiones POST, recibe como parámetro una ruta y un Json. Ej: postData('/prueba', {data: 'data'})
const postData = async (route, data = {}) => {
  try {
    let res = await fetch(route, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    return json;
  } catch (err) {
    console.log(err);
  }
};

// * Toast -> Pequeñas alertas, si modificas esto se modifican TODAS
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end', // * Posicion
  showConfirmButton: false,
  timer: 4000, // * Time
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

// * mensajeSuccess -> Muestra una alerta tomando el nombre de '<div id="messageSuccess" data-message="{{success}}"></div>'
// * --- ver en views/partials/messages.hbs
const messageFlash = () => {
  let message = '';
  const
    messageSuccess = document.getElementById('messageSuccess'),
    messageInfo = document.getElementById('messageInfo'),
    messageWarning = document.getElementById('messageWarning'),
    messageError = document.getElementById('messageError');
  if (messageSuccess) {
    message = messageSuccess.dataset.message;
    Toast.fire({ icon: 'success', title: message });
  } else if (messageInfo) {
    message = messageInfo.dataset.message;
    Toast.fire({ icon: 'info', title: message });
  } else if (messageWarning) {
    message = messageWarning.dataset.message;
    Toast.fire({ icon: 'warning', title: message });
  } else if (messageError) {
    message = messageError.dataset.message;
    Toast.fire({ icon: 'error', title: message });
  }
};

function cargarLoader(texto = null) {
  document.querySelector('#contLoader').style.display = 'flex';
  if (texto) document.querySelector('#textLoader').innerHTML = texto;
}

function ocultarLoader() {
  document.querySelector('#contLoader').style.display = 'none';
}

function cleanFeedbacks() {
  document.querySelectorAll('.feedback_box').forEach(elem => {
    elem.innerHTML = '';
  });

  document.querySelectorAll('.inp_invalid').forEach(elem => {
    elem.classList.remove('inp_invalid');
  });
}

function proccessResponse(data) {

  const { res, inCaseValid } = data;

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
    inCaseValid();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  messageFlash();
});