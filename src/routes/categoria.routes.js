import { Router } from 'express';
import Categoria from '../models/Categoria';

const router = Router();



// render
router.get('/agregar', async (req, res) => {

  // const { idTarea } = req.params;

  try {
    res.render('categoria/vwagregarcategoria', { objTarea: 'tarea' });
  } catch (error) {
    console.log('Error', err);
  }
});

// render
router.get('/editar', async (req, res) => {

  // const { idTarea } = req.params;

  try {
    res.render('categoria/vweditarcategorias', { objTarea: 'tarea' });
  } catch (error) {
    console.log('Error', err);
  }
});

router.post('/agregar-categoria', async (req, res) => {

  // console.log(req);
  console.log(req.body);

  try {

    const
      categoria = cleanString(req.body.categoria),
      subcategoria = cleanString(req.body.subcategoria);

    console.log('categoria', categoria);
    console.log('subcategoria', subcategoria);

    let objRevision = {
      categoria: {
        campo: 'categoria',
        valor: categoria,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#inpNuevaCategoria', // para ya no mardarlo desde el front
        idFeedback: '#feedBackNuevaCategoria',
        validations: ['empty']
      },
      subcategoria: {
        campo: 'subcategoria',
        valor: subcategoria,
        obli: true,
        idElem: '#inpNuevaSubcategoria',
        idFeedback: '#feedBackNuevaSubcategoria',
        validations: ['empty']
      }
    }

    // * validación datos
    // TODO, enviar un objeto al front con:
    // -- ids de los inputs con las fallas
    // -- mensajes de la falla
    // ya ya xD, llorón

    let
      objResponse = { isValid: true, faltantes: [] };

    // ej de lo que va en objResponse.faltantes
    // {
    //   input: '#este',
    //   msgs: ['falta rellenar', 'debe ser de tantos caracteres', 'debe contener tal cosa']
    // }

    // 1. se recorre cada obj del obj revisión (cada objeto representa un elemento de formulario)
    for (const property in objRevision) {
      console.log(`${property}: ${objRevision[property]}`);

      if (Object.hasOwnProperty.call(objRevision, property)) {
        const element = objRevision[property];
        let objFaltante = { idInput: element.idElem, idFeedback: element.idFeedback, msgs: [] };

        // 2. cada objeto del formulario tiene un array que dice que validaciones hay que hacercele (si está vacio, en un futuro si es un correo, o si debe ser númerico etc)
        // si llega a fallar una validación, se rellena el objResponse.faltantes con un objeto indicando el input y los mensajes indicando que falta
        element.validations.forEach(key => {

          switch (key) {
            case 'empty':
              if (isEmpty(element.valor))
                objFaltante.msgs.push('Te falta rellenar este campo ♥')
              break;

            case 'prueba':
              if (true)
                objFaltante.msgs.push('Prueba pa sabe 😋')
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

    if (objResponse.faltantes.length) {
      objResponse.isValid = false; // en realidad este no es tan necesario, ya que si objResponse.faltantes tiene algun objeto dentro ya se sabe que no se debe dejar pasar la información
      res.json(objResponse);
    }

    if (objResponse.faltantes.length === 0) { // valido
      objResponse.isValid = true;

      const categoriaModel = await Categoria.find({ categoria }).lean(); // 1. lo busca (devuelve un array de objetos)

      console.log(categoriaModel);
      if (categoriaModel.length) {
        // 1.1. Si lo encuentra, hace update
        const filter = { categoria: categoriaModel[0].categoria };
        // console.log('filtro', filter);
        categoriaModel[0].subcategoria.push({ nombre: subcategoria });
        const update = { subcategoria: categoriaModel[0].subcategoria };
        // console.log('actualización', update);
        const updateCategoria = await Categoria.findOneAndUpdate(filter, update);

        console.log('Se actualizó', updateCategoria);
        req.flash('messageSuccess', 'Categoría agregada correctamente');
        res.json(objResponse);
        // res.redirect('/categoria/gestionar');
      } else {
        // 1.2. Si no lo encuentra, lo inserta

        const objNuevo = {
          categoria,
          subcategoria: { nombre: subcategoria }
        }

        const insert = Categoria(objNuevo); // se le pasa el objeto con los datos para ser guardada
        const insertCategoria = await insert.save();

        console.log('Se insertó', insertCategoria);
        req.flash('messageSuccess', 'Categoría agregada correctamente');
        res.json(objResponse);
        // res.redirect('/categoria/gestionar');
      }

      // console.log(categoriaModel);

      // const
      //   categoria = Categoria(req.body), // se le pasa el objeto con los datos para ser guardada
      //   categoriaGuardada = await categoria.save();

      // res.json({ msg: 'Agregado' })

      // console.log(categoriaGuardada);
    }

  } catch (err) {
    console.log('Error', err);
  }
});

router.post('/editar-categoria', async (req, res) => {
  // nada aun xd
});

router.post('/editar-subcategoria', async (req, res) => {

  console.log(req.body);

  try {

    const { idCategoria, subcategoriaVieja, subcategoriaNueva } = req.body;

    const objCategoria = await Categoria.findById(idCategoria).lean();

    console.log('obj categoría', objCategoria);


    const arrSubcategorias = objCategoria.subcategoria;

    const ObjSubcateEncontrada = arrSubcategorias.find(obj => obj.nombre === subcategoriaVieja);

    console.log('ObjSubcateEncontrada ---->', ObjSubcateEncontrada);
    const indice = arrSubcategorias.findIndex(x => x.nombre === subcategoriaVieja); // obtenemos el indice donde está la subcategoría a editar
    console.log('indice', indice);

    // ------------------
    // const indice = arrSubcategorias.indexOf(subcategoriaVieja); 

    console.log('viejo arr', arrSubcategorias);
    let nuevoArrSucategorias = arrSubcategorias.filter((item) => item.nombre !== subcategoriaVieja) // creamos un nuevo array sin la categoria vieja

    console.log('nuevo Arr', nuevoArrSucategorias);
    nuevoArrSucategorias.splice(indice, 0, { _id: ObjSubcateEncontrada._id, nombre: subcategoriaNueva }); // le insertamos el nuevo obj subcategoria, con splice para que quede en la misma posición que estaba la anterior subcategoria https://kervin.blog/como-insertar-un-elemento-en-una-posicion-especifica-en-javascript

    console.log('nuevo arr a insertar', nuevoArrSucategorias);


    const
      filter = { _id: idCategoria },
      update = { subcategoria: nuevoArrSucategorias };

    const updateCategoria = await Categoria.findOneAndUpdate(filter, update);

    console.log('se actualizó', updateCategoria); // TODO, quedé!! ya actualizá perfecto :) YUJUUUUUU gunciona 27 mayo

    //TODO, ahora arreglar las listas de select de subcategoría para que traiga el valor dependiendo del id y no en si del valor

  } catch (err) {
    console.log('Error', err);
  }
});

router.get('/get-all', async (req, res) => {
  try {
    const arrObjCategorias = await Categoria.find().lean(); // .lean al parecer es para convertir el objeto en un JSON y ya que solo con el .find tra un objeto Mongoose al parecer
    // const tareaGuardada = await tarea.save();
    // console.log(arrObjCategorias);
    // res.render('tarea/vwlistatareas', { title: 'Lista tareas', listaTareas: })

    res.json(arrObjCategorias)

  } catch (err) {
    console.log('Error', err);
  }
});

router.post('/get-categoria', async (req, res) => {
  const { idCategoria } = req.body;

  // console.log(req.body.idCategoria);
  try {
    const objCategoria = await Categoria.findOne({ _id: idCategoria }).lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
    res.json(objCategoria);
  } catch (error) {
    console.log('Error', err);
  }
});

router.post('/eliminar-categoria', async (req, res) => {

  try {
    const { idCategoria } = req.body;
    console.log(idCategoria);

    let objRevision = {
      categoria: {
        campo: 'listado categorías',
        valor: idCategoria,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selConfigCategoria', // para ya no mardarlo desde el front
        idFeedback: '#feedBackConfigCategoria',
        validations: ['empty']
      }
    }

    let
      objResponse = { isValid: true, faltantes: [] };

    // 1. se recorre cada obj del obj revisión (cada objeto representa un elemento de formulario)
    for (const property in objRevision) {
      console.log(`${property}: ${objRevision[property]}`);

      if (Object.hasOwnProperty.call(objRevision, property)) {
        const element = objRevision[property];
        let objFaltante = { idInput: element.idElem, idFeedback: element.idFeedback, msgs: [] };

        // 2. cada objeto del formulario tiene un array que dice que validaciones hay que hacercele (si está vacio, en un futuro si es un correo, o si debe ser númerico etc)
        // si llega a fallar una validación, se rellena el objResponse.faltantes con un objeto indicando el input y los mensajes indicando que falta
        element.validations.forEach(key => {

          switch (key) {
            case 'empty':
              if (isEmpty(element.valor))
                objFaltante.msgs.push('Selecciona una opción pofavo ♥')
              break;

            case 'prueba':
              if (true)
                objFaltante.msgs.push('Prueba pa sabe 😋')
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

    if (objResponse.faltantes.length) {
      objResponse.isValid = false; // en realidad este no es tan necesario, ya que si objResponse.faltantes tiene algun objeto dentro ya se sabe que no se debe dejar pasar la información
      res.json(objResponse);
    }


    if (objResponse.faltantes.length === 0) { // valido
      objResponse.isValid = true;

      const categoriaModelElimnar = await Categoria.findByIdAndDelete({ _id: idCategoria }).exec();
      // console.log('Eliminado?', categoriaModelElimnar);
      req.flash('messageSuccess', `Categoría <span style="color: #9f0000">${categoriaModelElimnar.categoria}</span> eliminada correctamente`);
      res.json(objResponse);

      // console.log('Elimina?', categoriaModelElimnar); // Si elimina devuelve el objeto eliminado
    }


  } catch (err) {
    console.log('Error', err);
  }
});

router.get('/prueba-flash', async (req, res) => {

  // const { idTarea } = req.params;

  try {
    req.flash('success', 'Categoría agregada correctamente');
    res.redirect('/tarea/agregar');
  } catch (error) {
    console.log('Error', err);
  }
});

// ? Dejar estas funciónes como global en un archivo import?
function cleanString(str) {

  str = str.replace(/ +(?= )/g, ''); // quita si ponen más de un espacio
  str = str.trim();
  str = str.toLowerCase();

  return str;
}

function validateField(key, value) {

  switch (key) {
    case 'empty':
      return isEmpty(value);
      break;

    default:
      break;
  }
}

function isEmpty(val) {

  if (val.length < 1) return true;
  if (val === null) return true;
  if (val === undefined) return true;

  return false;
}

export default router;
