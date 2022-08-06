import { Router } from 'express';
import Tarea from '../models/Tarea';
import Categoria from '../models/Categoria';
import { crearTarea } from '../controllers/tareas.controller';

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
      nDocumentos = await Tarea.count(), // 1. trae todos los documentos que existen
      pag = req.params.pag;

    let nPaginacion = 0;
    const
      nstring = nDocumentos.toString(), // 2. para quitarle caracteres en pto (4) y también obtener su ultimo caracter en pto (3)
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

    const
      skipDocs = parseInt(`${pag - 1}0`), // ej si el user pide la pag 3 -> se resta 1 queda en 2 -> se le agrega 0 queda en 20, la consulta va a saltar 20 documentos ya que los de la página 3 son los documentos 21 al 30
      arrObjTareas = await Tarea.find().skip(skipDocs).limit(10).lean();

    console.log('cant tareas', arrObjTareas.length);

    let arrObjData = [];
    arrObjTareas.forEach(async obj => {

      const
        idCategoria = obj.categoria,
        objCategoria = await Categoria.findOne({ _id: idCategoria }).lean();

      // console.log(objCategoria);

      // console.log('OBJETIFICADO!!!!', objCategoria);

      // console.log('esto', obj.subcategoria);
      // console.log('esto otro', objCategoria.subcategoria[0]._id.toString());
      // console.log('sirve?',);

      arrObjData.push({
        _id: obj._id,
        descripcion: obj.descripcion,
        estado: obj.estado,
        categoria: objCategoria.categoria,
        subcategoria: objCategoria.subcategoria.filter(sub => sub._id.toString() === obj.subcategoria)[0].nombre
      });

      if (arrObjTareas.length === arrObjData.length) {
        res.render('tarea/vwlistatareas', { title: 'Lista tareas', arrObjData, arrPaginacion })
      }

      // console.log(arrObjCategorias);

    });

    // res.render('tarea/vwlistatareas', { title: 'Lista tareas', arrObjData, arrPaginacion })

  } catch (err) {
    console.log('Error', err);
  }
});

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

  console.log('idTareaaaa', idTarea);

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
  // console.log(req.body);
  const { idTarea } = req.body;

  try {
    const tarea = await Tarea.findByIdAndUpdate(idTarea, req.body);

    const arrObjTareas = await Tarea.find().lean();

    console.log(arrObjTareas); // TODO, como hacer render? no funciona

    res.json({ done: true });
    // const tareaGuardada = await tarea.updateOne({ _id: req.body.idTarea }, { descripcion: req.body.descripcion, estado: req.body.estado });

    // console.log(tareaGuardada);

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



// router.get('/getTodasTareas', async (req, res) => {
// });

// router.post('/tarea/add', crearTarea);



export default router;