import { Router } from 'express';
import Tarea from '../models/Tarea';
import Categoria from '../models/Categoria';
import { crearTarea } from '../controllers/tareas.controller';
import Commons from './func/commons';
import moment from 'moment/moment';

const router = Router();

// * nota: en src/app.js ya se definió que cada que se entre a estas rutas se ponde por defecto "/tarea" no hay que ponerlo en las rutas que se creen en este archivo 

// ** TAREAS

// render
router.get('/lista', async (req, res) => {
  res.render('tarea/vwlistatareas', { title: 'Lista tareas' });
});

router.get('/getAllTareas', async (req, res) => {
  try {
    let
      cantTareas = await Tarea.count(), // 1. trae la cantidad de documentos (Tarea) que existen
      arrObjTareas = null,
      objFiltro = {};

    if (cantTareas) {
      const objQueryURL = req.query; // filtros de url (tipo /something?color1=red&color2=blue)

      // * hay filtros
      if (Object.keys(objQueryURL).length > 0) {

        if (objQueryURL.hasOwnProperty('estado')) objFiltro.estado = objQueryURL.estado.trim();

        if (objQueryURL.hasOwnProperty('rangoFechas')) {
          // vienen con formato AAAA-MM-DD
          const
            arrFecha = objQueryURL.rangoFechas.split(','),
            fechaInicio = arrFecha[0].trim(),
            fechaFin = arrFecha[1].trim();

          console.log('fechaInicio', fechaInicio);
          console.log('fechaFin', fechaFin);

          if (fechaInicio === fechaFin) {
            objFiltro = { 'desdeHasta.1': `${fechaInicio}T00:00:00.000+00:00` }
          }

          if (fechaInicio != fechaFin) {
            objFiltro = {
              'desdeHasta.1': {
                $gte: new Date(`${fechaInicio}T00:00:00`),
                $lt: new Date(`${fechaFin}T23:59:59`)
              }
            }
          }

        }

        if (objQueryURL.hasOwnProperty('categoria')) objFiltro.categoria = objQueryURL.categoria.trim()

        cantTareas = await Tarea.find(objFiltro).count();
        arrObjTareas = await Tarea.find(objFiltro).sort({ createdAt: 'descending' }).lean(); // Las tareas mas viejas van a apareciendo de primeras
      }

      // * no hay filtros
      if (Object.keys(objQueryURL).length === 0) {
        arrObjTareas = await Tarea.find().sort({ createdAt: 'descending' }).lean();
      }

      // como cada tarea en cat y sub tiene es un código en vez de un nombre toca hacer un consulta para saber ese codigo que significa

      if (arrObjTareas.length) {
        let arrObjData = [];
        arrObjTareas.forEach(async obj => {

          const
            idCategoria = obj.categoria,
            idSubcatTarea = obj.subcategoria,
            objCategoria = await Categoria.findOne({ _id: idCategoria }).lean();

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
            fechaDesde: moment(obj.desdeHasta[0]).utc().format("MMM D/YY"),
            fechaHasta: moment(obj.desdeHasta[1]).utc().format("MMM D/YY"),
            fechaCreacion: moment(obj.createdAt).utc().format("MMM D/YY")
          });


          if (arrObjTareas.length === arrObjData.length) {
            // res.render('tarea/vwlistatareas', { title: 'Lista tareas', arrObjData, hayTareas: true, cantTareas });
            res.json({ arrObjData, cantTareas });
          }
        });
      }

      if (arrObjTareas.length === 0) {
        // no hay tareas
        res.json({ cantTareas });
      }

      return;
    }

    // se envia cantidad de tareas en 0
    res.json({ cantTareas });

  } catch (err) {
    console.log('Error', err);
  }
});

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
    // * raw
    const tarea = await Tarea.findById(idTarea).lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
    // con exec, trae el objeto ese de mongoose

    // * cooked (procesado)
    const
      idCategoria = tarea.categoria,
      idSubcatTarea = tarea.subcategoria,
      objCategoria = await Categoria.findOne({ _id: idCategoria }).lean(),
      dicEstadoIcon = {
        'Doing': { color: '#c99941', class: 'bx bxs-cog bx-spin' },
        'To Do': { color: '#c94173', class: 'bx bxs-hourglass bx-tada' },
        'Done': { color: '#043206', class: 'bx bx-check bx-flashing' }
      },
      procesado = {
        _id: tarea._id,
        descripcion: tarea.descripcion,
        estado: tarea.estado,
        colorIcon: dicEstadoIcon[tarea.estado].color,
        classIcon: dicEstadoIcon[tarea.estado].class,
        categoria: objCategoria ? objCategoria.categoria : 'No existe categoría',
        subcategoria: objCategoria ? getNombreSubcategoria({ arrSubcat: objCategoria.subcategoria, idSubcatTarea }) : 'No existe subcategoria',
        fechaDesde: Commons.beautyDate(tarea.desdeHasta[0]),
        fechaHasta: Commons.beautyDate(tarea.desdeHasta[1]),
        fechaCreacion: Commons.beautyDate(tarea.createdAt)
      };

    res.json({ raw: tarea, cooked: procesado });

  } catch (error) {
    console.log('Error', error);
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
          fechaDesde: moment(obj.desdeHasta[0]).utc().format("MMM D/YY"),
          fechaHasta: moment(obj.desdeHasta[1]).utc().format("MMM D/YY"),
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