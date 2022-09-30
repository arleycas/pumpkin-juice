import { Router } from 'express';
import Tarea from '../models/Tarea';
import Categoria from '../models/Categoria';
import { crearTarea } from '../controllers/tareas.controller';
import Commons from './func/commons';

const router = Router();

// * nota: en src/app.js ya se definió que cada que se entre a estas rutas se ponde por defecto "/tarea" no hay que ponerlo en las rutas que se creen en este archivo 

// ** TAREAS

router.get('/', (req, res) => {
  res.render('index')
});

// render
router.get('/lista/:pag', async (req, res) => {
  try {
    const
      nDocumentos = await Tarea.count(), // 1. trae la cantidad de documentos (Tarea) que existen
      pag = req.params.pag;

    if (nDocumentos) {

      let arrPaginacion = getArrayPagination({ nDocumentos });

      const skipDocs = parseInt(`${pag - 1}0`); // ej si el user pide la pag 3 -> se resta 1 queda en 2 -> se le agrega 0 queda en 20, la consulta va a saltar 20 documentos ya que los de la página 3 son los documentos 21 al 30

      // * filtro ------------------------------------------
      // no hago la validación de data backend porque como son peticiones sincronas me queda mas facil con flash

      let arrObjTareas = null;
      let objFiltro = {};
      const objQueryURL = req.query;

      if (Object.keys(objQueryURL).length > 0) { // hay filtros

        if (objQueryURL.hasOwnProperty('estado')) objFiltro.estado = objQueryURL.estado.trim();

        if (objQueryURL.hasOwnProperty('rangoFechas')) {
          // vienen con formato AAAA-MM-DD
          const
            arrFecha = objQueryURL.rangoFechas.split(','),
            fechaInicio = arrFecha[0].trim(),
            fechaFin = arrFecha[1].trim();

          objFiltro = {
            'desdeHasta.1': {
              $gte: new Date(fechaInicio),
              $lt: new Date(fechaFin)
            }
          };
        }

        if (objQueryURL.hasOwnProperty('categoria')) objFiltro.categoria = objQueryURL.categoria.trim()
        // console.log('asi queda efiltro', objFiltro);
        // arrObjTareas = await Tarea.find(objFiltro).sort({ createdAt: 'descending' }).skip(skipDocs).limit(10).lean(); // Las tareas mas viejas van a apareciendo de primeras

        const nDocumentosFiltrados = await Tarea.find(objFiltro).count();
        arrPaginacion = getArrayPagination({ nDocumentos: nDocumentosFiltrados }); // se modifica paginación ya que hay filtros
        arrObjTareas = await Tarea.find(objFiltro).sort({ createdAt: 'descending' }).skip(skipDocs).limit(10).lean(); // Las tareas mas viejas van a apareciendo de primeras
      }

      if (Object.keys(objQueryURL).length === 0) { // no hay filtros
        arrObjTareas = await Tarea.find().sort({ createdAt: 'descending' }).skip(skipDocs).limit(10).lean();
      }

      // * Si no hay tareas se envia false
      if (arrObjTareas.length === 0) {
        res.render('tarea/vwlistatareas', { title: 'Lista tareas', hayTareas: false });
      }

      // console.log(arrObjTareas.length, arrObjData.length);
      //1. Se traen todas las tareas (pero como cada tarea tiene en cat y sub tiene es un código en vez de un nombre toca hacer un consulta para saber ese codigo que significa)
      let arrObjData = [];
      arrObjTareas.forEach(async obj => {

        const
          idCategoria = obj.categoria,
          idSubcatTarea = obj.subcategoria,
          objCategoria = await Categoria.findOne({ _id: idCategoria }).lean();

        // console.log('busca', objCategoria);

        // console.log('OBJETIFICADO!!!!', objCategoria);

        // console.log('esto', obj.subcategoria);
        // console.log('esto otro', objCategoria.subcategoria[0]._id.toString());
        // console.log('sirve?',);

        const dicEstadoIcon = {
          'Doing': { color: '#c99941', class: 'bx bxs-cog bx-spin' },
          'To Do': { color: '#c94173', class: 'bx bxs-hourglass bx-tada' },
          'Done': { color: '#043206', class: 'bx bx-check bx-flashing' }
        }

        await arrObjData.push({
          _id: obj._id,
          descripcion: obj.descripcion,
          estado: obj.estado,
          colorIcon: dicEstadoIcon[obj.estado].color,
          classIcon: dicEstadoIcon[obj.estado].class,
          categoria: objCategoria ? objCategoria.categoria : 'No existe categoría',
          subcategoria: objCategoria ? getNombreSubcategoria({ arrSubcat: objCategoria.subcategoria, idSubcatTarea }) : 'No existe subcategoria',
          fechaDesde: Commons.beautyDate(obj.desdeHasta[0]),
          fechaHasta: Commons.beautyDate(obj.desdeHasta[1]),
          fechaCreacion: Commons.beautyDate(obj.createdAt)
        });


        if (arrObjTareas.length === arrObjData.length) {
          res.render('tarea/vwlistatareas', { title: 'Lista tareas', arrObjData, arrPaginacion, hayTareas: true, cantTareasTotales: nDocumentos });
        }

        // console.log(arrObjCategorias);

      });
      return;
    }

    res.render('tarea/vwlistatareas', { title: 'Lista tareas', hayTareas: false });
    // res.render('tarea/vwlistatareas', { title: 'Lista tareas', arrObjData, arrPaginacion })

  } catch (err) {
    console.log('Error', err);
  }
});

function getArrayPagination(data) {
  const { nDocumentos } = data;

  let nPaginacion = 0;
  const
    nstring = nDocumentos.toString(), // 2. para obtener su ultimo caracter en pto (3) y quitarle caracteres en pto (4) 
    ultimoChar = nstring[nstring.length - 1], // 3. para punto (5.1)
    sinelultimo = nstring.slice(0, -1); // 4. devuelve el string-numero sin el ultimo caracter

  if (ultimoChar === '0') {
    // 5.1. Si es 0, quiere decir que es un número por ej 10, 20, 30 etc
    // si esto pasa la páginación es simplemente ese número pero si en ultimo caracter
    // ya que cada página consta de 10 registros por lo que si hay por ej 20 (habrán 2 páginas no más)
    nPaginacion = sinelultimo;
  } else {

    if (sinelultimo.length) {
      // 5.2. si entra aquí quiere decir que el nString tiene dos caracteres, por lo tanto es un número mayor a 9 (pero no es 10 por validación de pto 5.1)
      // si por ejemplo es 11, quiere decir que hay dos páginas, por lo tanto la paginación queda en 2
      nPaginacion = parseInt(sinelultimo) + 1;
    } else {
      // 5.3. si entra aquí quiere decir que hay menos de 10 documentos (o 10, pero 10 no entra aquí por la validación del pto 5.1)
      // entonces la páginación solo es 1
      nPaginacion = 1;
    }
  }

  let arrPaginacion = [];

  for (let i = 0; i < nPaginacion; i++) {
    arrPaginacion.push(i + 1);
  }

  return arrPaginacion;
}

function getNombreSubcategoria(data) {
  // arrSubcat: Es el listado de subcategorias guardadas en documento categoria (con id y nombre)
  // idSubcatTarea: Es el id que está guardado en la tarea
  const { arrSubcat, idSubcatTarea } = data;
  let res = null;

  arrSubcat.forEach(subcat => {
    if (subcat._id.toString() === idSubcatTarea) res = subcat.nombre;
  });

  if (res === null) {
    return `No existe subcategoria ${idSubcatTarea}`
  }

  return res;
}

// render
router.get('/agregar', (req, res) => {
  res.render('tarea/vwagregartarea')
});

// render
router.get('/editar/:idTarea', async (req, res) => {

  const { idTarea } = req.params;

  try {
    const tarea = await Tarea.findById(idTarea).lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
    res.render('tarea/vweditartarea', { objTarea: tarea });
  } catch (error) {
    console.log('Error', err);
  }
});

router.post('/getTarea', async (req, res) => {
  const { idTarea } = req.body;

  // console.log('idTareaaaa', idTarea);
  try {
    const tarea = await Tarea.findById(idTarea).lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
    // con exec, trae el objeto ese de mongoose
    res.json(tarea);

  } catch (error) {
    console.log('Error', err);
  }
});

router.post('/agregar', crearTarea);

router.post('/editar', async (req, res) => {
  const { idTarea, objDataOriginal, objDataNueva } = req.body;

  try {

    let objResponse = Commons.validateDataBackend({
      descripcion: {
        campo: 'Descripción',
        valor: objDataNueva.descripcion,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#inpDescripcion', // para ya no mardarlo desde el front
        idFeedback: '#feedBackDescripcion',
        validations: ['empty']
      },
      estado: {
        campo: 'Estado',
        valor: objDataNueva.estado,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selEstado', // para ya no mardarlo desde el front
        idFeedback: '#feedBackEstado',
        validations: ['empty']
      },
      fechaDesde: {
        campo: 'Fecha desde',
        valor: objDataNueva.fechaDesde,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#inpFechaDesde', // para ya no mardarlo desde el front
        idFeedback: '#feedBackFechaDesde',
        validations: ['empty']
      },
      fechaHasta: {
        campo: 'Fecha hasta',
        valor: objDataNueva.fechaHasta,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#inpFechaHasta', // para ya no mardarlo desde el front
        idFeedback: '#feedBackFechaHasta',
        validations: ['empty']
      },
      idCategoria: {
        campo: 'Categoría',
        valor: objDataNueva.idCategoria,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selCategoria', // para ya no mardarlo desde el front
        idFeedback: '#feedBackCategoria',
        validations: ['empty']
      },
      idSubcategoria: {
        campo: 'Subcategoría',
        valor: objDataNueva.idSubcategoria,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selSubcategoria', // para ya no mardarlo desde el front
        idFeedback: '#feedBackSubcategoria',
        validations: ['empty']
      },
    });

    if (objResponse.faltantes.length) {
      objResponse.isValid = false; // en realidad este no es tan necesario, ya que si objResponse.faltantes tiene algun objeto dentro ya se sabe que no se debe dejar pasar la información
      res.json(objResponse);
    }

    if (objResponse.faltantes.length === 0) { // valido
      objResponse.isValid = true;
      console.log('Tarea nueva', objDataNueva);

      const
        objUpdate = {
          descripcion: objDataNueva.descripcion,
          estado: objDataNueva.estado,
          desdeHasta: [objDataNueva.fechaDesde, objDataNueva.fechaHasta],
          categoria: objDataNueva.idCategoria,
          subcategoria: objDataNueva.idSubcategoria
        },
        tarea = await Tarea.findByIdAndUpdate(idTarea, objUpdate);

      // const arrObjTareas = await Tarea.find().lean();

      console.log(tarea);

      req.flash('messageSuccess', `Tarea actualizada correctamente`);
      res.json(objResponse);
      // const tareaGuardada = await tarea.updateOne({ _id: req.body.idTarea }, { descripcion: req.body.descripcion, estado: req.body.estado });
      // console.log(tareaGuardada);
    }

  } catch (err) {
    console.log('Error', err);
  }
});

router.post('/eliminar', async (req, res, next) => {
  // console.log(req.body);
  const { idTarea } = req.body;

  console.log('si llega', idTarea);
  try {
    const tarea = await Tarea.findOneAndDelete({ _id: idTarea });
    console.log('tarea eliminada', tarea);

    // console.log(arrObjTareas);
    res.json({ done: true });

    // const tareaGuardada = await tarea.updateOne({ _id: req.body.idTarea }, { descripcion: req.body.descripcion, estado: req.body.estado });

    // console.log(tareaGuardada);

  } catch (err) {
    console.log('Error', err);
  }
});


// * INFORME

// render
router.get('/informe', (req, res) => {
  res.render('tarea/vwinformetarea')
});


router.get('/getYears', async (req, res) => {
  // const { idTarea } = req.body;

  // console.log('idTareaaaa', idTarea);

  try {
    const listaTareas = await Tarea.find().lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
    // con exec, trae el objeto ese de mongoose
    // res.json(tarea);

    // console.log(listaTareas);

    let arrAnosSinFiltrar = [];

    listaTareas.forEach(obj => {
      arrAnosSinFiltrar.push(obj.updatedAt.getFullYear());
    });

    let arrAnos = arrAnosSinFiltrar.filter((item, index) => {
      return arrAnosSinFiltrar.indexOf(item) === index;
    });

    res.json(arrAnos)

  } catch (error) {
    console.log('Error', err);
  }
});

router.get('/getMonths', async (req, res) => {
  // const { idTarea } = req.body;

  // console.log('idTareaaaa', idTarea);

  try {
    const listaTareas = await Tarea.find().lean(), // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
      dicMes = {
        0: { num: 0, nombre: 'Enero' },
        1: { num: 1, nombre: 'Febrero' },
        2: { num: 2, nombre: 'Marzo' },
        3: { num: 3, nombre: 'Abril' },
        4: { num: 4, nombre: 'Mayo' },
        5: { num: 5, nombre: 'Junio' },
        6: { num: 6, nombre: 'Julio' },
        7: { num: 7, nombre: 'Agosto' },
        8: { num: 8, nombre: 'Septiembre' },
        9: { num: 9, nombre: 'Octubre' },
        10: { num: 10, nombre: 'Noviembre' },
        11: { num: 11, nombre: 'Diciembre' },
      };

    // console.log(listaTareas);

    let arrMesesSinFiltrar = [];

    listaTareas.forEach(obj => {
      arrMesesSinFiltrar.push(obj.updatedAt.getMonth());
    });

    // console.log(arrMesesSinFiltrar);

    const arrMeses = arrMesesSinFiltrar.filter((item, index) => {
      return arrMesesSinFiltrar.indexOf(item) === index;
    });

    let arrRes = [];

    arrMeses.forEach(mes => {
      arrRes.push(dicMes[mes]);
    });

    res.json(arrRes)

  } catch (error) {
    console.log('Error', err);
  }
});

router.post('/getTareasInforme', async (req, res) => {
  const { ano, mes } = req.body;

  console.log('data', req.body);
  try {

    let objResponse = Commons.validateDataBackend({
      ano: {
        campo: 'Año',
        valor: ano,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selAno', // para ya no mardarlo desde el front
        idFeedback: '#feedBackAno',
        validations: ['empty']
      },
      mes: {
        campo: 'Mes',
        valor: mes,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selMes', // para ya no mardarlo desde el front
        idFeedback: '#feedBackMes',
        validations: ['empty']
      }
    });

    if (objResponse.faltantes.length) {
      objResponse.isValid = false; // en realidad este no es tan necesario, ya que si objResponse.faltantes tiene algun objeto dentro ya se sabe que no se debe dejar pasar la información
      res.json(objResponse);
    }

    if (objResponse.faltantes.length === 0) { // valido
      objResponse.isValid = true;

      const arrObjTareas = await Tarea.find({
        createdAt: {
          $gte: new Date(ano, mes, 1),
          $lt: new Date(ano, mes, 31)
        }
      }).lean();

      let arrObjData = [];
      arrObjTareas.forEach(async obj => {
        // console.log(obj);
        const
          objCategoria = await Categoria.findOne({ _id: obj.categoria }).lean(),
          idSubcatTarea = obj.subcategoria;

        // console.log(objCategoria);
        arrObjData.push({
          _id: obj._id,
          descripcion: obj.descripcion,
          estado: obj.estado,
          categoria: objCategoria.categoria,
          subcategoria: getNombreSubcategoria({ arrSubcat: objCategoria.subcategoria, idSubcatTarea }),
          fechaDesde: obj.desdeHasta[0],
          fechaHasta: obj.desdeHasta[1]
        });

        if (arrObjTareas.length === arrObjData.length) {
          objResponse.data = arrObjData;
          res.json(objResponse);
        }
      });

    }

  } catch (error) {
    console.log('Error', error);
  }
});

// router.get('/getTodasTareas', async (req, res) => {
// });

// router.post('/tarea/add', crearTarea);



export default router;