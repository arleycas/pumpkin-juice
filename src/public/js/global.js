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

  const { res } = data;

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

    ocultarLoader();
  }

  if (res.isValid) {
    if (data.hasOwnProperty('inCaseValid')) {
      data.inCaseValid();
    }
  }
}

window.getRandomNaniPhrase = () => {

  const arrPhrases = [
    'Ando caminando con un flow violento 😎',
    'Increible! 😮',
    'Fantabulástico!',
    'Como te decimos, J.K. Rowling?',
    'No te duele la manito? 😧',
    'Un dulcecito al Dev no le caería mal 🤐',
    'No olvides tomar aguita ♥',
    'Dato curioso: Esta app vale millones! 🤯',
    'Tu peco coco siempre te piensa 🙈',
    'Ten un lindo día 🥰',
    'Señorita apague las luces que no está usando! 😠',
    'Si, efectivamente estoy programada en el lenguaje del amor 💞',
    'Oye, para donde tan guapa?',
    'El Dev quiere alitas 🤤',
    'Esos crespitos se te ven muy lindos, solo digo',
    'Soy transeconómico, soy un millonario atrapado en el cuerpo de un pobre 😩',
    'El dinero no me hace feliz... me hace falta 💸',
    'Me gustaría ser pobre por un dia, porque esto de serlo a diario me tiene 🥴',
    'Me quedé sin ideas... 😶',
    'Si soy UNA app, entonces... soy una niña? 🤔',
    '♪ Hoy no recuerdo... como podía... sin conocerla.. pasar mi vida ♫',
    'Sabes que? Mejor llama a Saúl 😪',
    'Me dicen el Jeisenber',
    'Error grave bip bip... mentiras! bromita 🙈',
    'Y recuerden amigos, formato BN no es formato "bien" 🤣',
    '90% libre de bugs!',
    'Esta grasa no se quita 💅',
    'Volviste! 🤗',
    'Made in... la cueva del Dev',
    'Es un hecho, Bogotá queda a 3 horas de Bogotá 😪',
    'Arlita y Nano... a no asi no era',
    'Pecadito andante 🥺',
    'Mira mira! un popodrilo 🐊',
    'Es verdad que el amor es como el papel higienico 🧻?...'
  ]

  const
    nElements = arrPhrases.length - 1, // ya que la cantidad de elementos no cuadre con la cantidad de indices xD
    nRandom = Math.floor(Math.random() * (nElements - 0 + 1)) + 0;
  return arrPhrases[nRandom];
}

// * detecta si la pagina está desde un dispositivo mobil
// mejor meter la función en window!!!
window.isMobileOrTablet = () => {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

// * Dev function
window.consoleMobile = (str) => {
  const consoleMobile = document.querySelector('#mobilConsole');
  consoleMobile.classList.remove('display_none');
  consoleMobile.innerHTML = str;
}

document.addEventListener('DOMContentLoaded', () => {
  messageFlash();
});