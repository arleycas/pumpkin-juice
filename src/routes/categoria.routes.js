import { Router } from 'express';
import Categoria from '../models/Categoria';
import Tarea from '../models/Tarea';
import Commons from './func/commons';

const router = Router();

// render
router.get('/agregar', async (req, res) => {

  // const { idTarea } = req.params;

  try {
    res.render('categoria/vwagregarcategoria', { objTarea: 'tarea' });
  } catch (error) {
    console.log('Error', error);
  }
});

// render
router.get('/editar', async (req, res) => {

  // const { idTarea } = req.params;

  try {
    res.render('categoria/vweditarcategorias', { objTarea: 'tarea' });
  } catch (error) {
    console.log('Error', error);
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

    // * validación datos
    // TODO, enviar un objeto al front con:
    // -- ids de los inputs con las fallas
    // -- mensajes de la falla
    // ya ya xD, llorón

    // ej de lo que va en objResponse.faltantes
    // {
    //   input: '#este',
    //   msgs: ['falta rellenar', 'debe ser de tantos caracteres', 'debe contener tal cosa']
    // }

    let objResponse = Commons.validateDataBackend({
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
    });

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

  } catch (error) {
    console.log('Error', error);
  }
});

router.post('/editar-categoria', async (req, res) => {
  // todo, validar strings que vienen del front
  const
    { idCategoria, categoriaNueva, categoriaVieja } = req.body,
    filter = { _id: idCategoria },
    update = { categoria: categoriaNueva },
    resUpdateCategoria = await Categoria.findOneAndUpdate(filter, update);

  console.log(resUpdateCategoria);

  req.flash('messageSuccess', `Nombre de categoría actualizado de <span style="color: #9f0000">${categoriaVieja}</span> a <span style="color: #42A9DF">${categoriaNueva}</span>`);
  res.json(true);

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

    console.log('se actualizó', updateCategoria);
    const updateCategoria = await Categoria.findOneAndUpdate(filter, update);
    res.json(true);


    res.json(true);


  } catch (error) {
    console.log('Error', error);
  }
});

router.get('/get-all', async (req, res) => {
  try {
    const arrObjCategorias = await Categoria.find().lean(); // .lean al parecer es para convertir el objeto en un JSON y ya que solo con el .find tra un objeto Mongoose al parecer
    // const tareaGuardada = await tarea.save();
    // console.log(arrObjCategorias);
    // res.render('tarea/vwlistatareas', { title: 'Lista tareas', listaTareas: })

    res.json(arrObjCategorias)

  } catch (error) {
    console.log('Error', error);
  }
});

router.post('/get-categoria', async (req, res) => {
  const { idCategoria } = req.body;

  // console.log(req.body.idCategoria);
  try {
    const objCategoria = await Categoria.findOne({ _id: idCategoria }).lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien
    res.json(objCategoria);
  } catch (error) {
    console.log('Error', error);
  }
});

router.post('/get-categoria-all', async (req, res) => {
  let { categoria } = req.body;
  categoria = categoria.trim();
  // console.log(req.body.idCategoria);
  try {

    if (categoria) {
      const arrObjCategoria = await Categoria.find({ categoria: { $regex: categoria, $options: 'i' } }).limit(5).lean(); // lean lo trae al objeto en POJO (Plain old JavaScript objects), lo cual es más rapido y el HBS lo lee bien

      // const borrar = await Categoria.find({
      //   subcategoria: {
      //     $elemMatch: {
      //       nombre: 'capacitación de habilidades blandas'
      //     }
      //   }
      // }).limit(1);
      // console.log('aver', borrar);

      res.json(arrObjCategoria);
      return;
    }

    res.json(false);

  } catch (error) {
    console.log('Error', error);
  }
});

router.post('/eliminar-categoria', async (req, res) => {

  try {
    const { idCategoria } = req.body;
    console.log(idCategoria);

    let objResponse = Commons.validateDataBackend({
      categoria: {
        campo: 'listado categorías',
        valor: idCategoria,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#selConfigCategoria', // para ya no mardarlo desde el front
        idFeedback: '#feedBackConfigCategoria',
        validations: ['empty']
      }
    });

    if (objResponse.faltantes.length) {
      objResponse.isValid = false; // en realidad este no es tan necesario, ya que si objResponse.faltantes tiene algun objeto dentro ya se sabe que no se debe dejar pasar la información
      res.json(objResponse);
    }

    if (objResponse.faltantes.length === 0) { // valido
      objResponse.isValid = true;

      const
        objTareasEliminadas = await Tarea.deleteMany({ categoria: idCategoria }),
        categoriaModelElimnar = await Categoria.findByIdAndDelete({ _id: idCategoria }).exec();

      // console.log('Eliminado?', categoriaModelElimnar);
      req.flash('messageSuccess', `Categoría <span style="color: #9f0000">${categoriaModelElimnar.categoria}</span> eliminada junto con <span style="color: #9f0000">${objTareasEliminadas.deletedCount}</span> tareas asociadas`);
      res.json(objResponse);

      // console.log('Elimina?', categoriaModelElimnar); // Si elimina devuelve el objeto eliminado 
    }

  } catch (error) {
    console.log('Error', error);
  }
});

router.post('/eliminar-subcategoria', async (req, res) => {

  const { idCategoria, idSubcategoria } = req.body;

  const objCategoria = await Categoria.findById(idCategoria).lean(); // 1. Busca el documento 'Categoria'

  const arrSubcategorias = objCategoria.subcategoria; //2. Saca el array de las subcategorias de ese documento (pto 1)

  // console.log('categoria', objCategoria);
  console.log('arr subcategorias en db', arrSubcategorias);

  const nuevoArrSubcategorias = arrSubcategorias.filter(obj => obj._id.toString() !== idSubcategoria);

  console.log('nuevo arr como queda', nuevoArrSubcategorias);

  const
    filter = { _id: idCategoria },
    update = { subcategoria: nuevoArrSubcategorias },
    updateCategoria = await Categoria.findOneAndUpdate(filter, update), // Elimina subcategoria de ese documento 'Categoria'
    objTareasEliminadas = await Tarea.deleteMany({ subcategoria: idSubcategoria }); // Elimina tareas con esa subcategoria

  req.flash('messageSuccess', `Subcategoría <span style="color: #9f0000">${objCategoria.categoria}</span> eliminada junto con <span style="color: #9f0000">${objTareasEliminadas.deletedCount}</span> tareas asociadas`);
  res.json(true);

});

router.get('/prueba-flash', async (req, res) => {

  // const { idTarea } = req.params;

  try {
    req.flash('success', 'Categoría agregada correctamente');
    res.redirect('/tarea/agregar');
  } catch (error) {
    console.log('Error', error);
  }
});

// ? Dejar estas funciónes como global en un archivo import?
function cleanString(str) {

  str = str.replace(/ +(?= )/g, ''); // quita si ponen más de un espacio
  str = str.trim();
  str = str.toLowerCase();

  return str;
}

export default router;
