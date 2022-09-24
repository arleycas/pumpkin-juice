const Commons = {};

Commons.isEmpty = (val) => {
  if (val.length < 1) return true;
  if (val === null) return true;
  if (val === undefined) return true;

  return false;
}

Commons.validateDataBackend = (objRevision) => {

  let objResponse = { isValid: true, faltantes: [] };
  // console.log('objRevision', objRevision);
  // 1. se recorre cada obj del obj revisión (cada objeto representa un elemento de formulario)
  for (const property in objRevision) {
    // console.log(`${property}: ${objRevision[property]}`);
    if (Object.hasOwnProperty.call(objRevision, property)) {
      const element = objRevision[property];
      let objFaltante = { idInput: element.idElem, idFeedback: element.idFeedback, msgs: [] };

      // 2. cada objeto del formulario tiene un array que dice que validaciones hay que hacercele (si está vacio, en un futuro si es un correo, o si debe ser númerico etc)
      // si llega a fallar una validación, se rellena el objResponse.faltantes con un objeto indicando el input y los mensajes indicando que falta
      element.validations.forEach(key => {

        switch (key) {
          case 'empty':
            if (Commons.isEmpty(element.valor))
              objFaltante.msgs.push('Te falta este campo ♥')
            break;

          case 'numeric':
            if (true)
              objFaltante.msgs.push('Este campo debe ser númerico 😋')
            break;

          default:
            break;
        }
      });

      if (objFaltante.msgs.length) {
        objResponse.faltantes.push(objFaltante);
      }
    }
  }

  return objResponse;
}

Commons.beautyDate = (date) => {
  // transforma objeto de tipo date de JS en string de fecha bonita
  const
    rawDate = new Date(date),
    objMonths = {
      0: 'ene',
      1: 'feb',
      2: 'mar',
      3: 'abr',
      4: 'may',
      5: 'jun',
      6: 'jul',
      7: 'ago',
      8: 'sep',
      9: 'oct',
      10: 'nov',
      11: 'dic',
    },
    day = rawDate.getDate(),
    month = rawDate.getMonth(),
    year = rawDate.getFullYear();

  return `${day} ${objMonths[month]} ${year}`;
}

export default Commons;