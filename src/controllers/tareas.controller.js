import Tarea from '../models/Tarea';
import Commons from '../routes/func/commons';

export const crearTarea = async (req, res) => {
  try {
    const
      { descripcion, categoria, subcategoria, estado, desdeHasta } = req.body;

    let objResponse = Commons.validateDataBackend({
      descripcion: {
        campo: 'descripcion',
        valor: descripcion,
        obli: true, // para ya no mandarlo desde el front
        idElem: '#inpDescripcion', // para ya no mardarlo desde el front
        idFeedback: '#feedBackDescripcion',
        validations: ['empty']
      },
      categoria: {
        campo: 'categoria',
        valor: categoria,
        obli: true,
        idElem: '#selCategoria',
        idFeedback: '#feedBackCategoria',
        validations: ['empty']
      },
      subcategoria: {
        campo: 'subcategoria',
        valor: subcategoria,
        obli: true,
        idElem: '#selSubcategoria',
        idFeedback: '#feedBackSubcategoria',
        validations: ['empty']
      },
      estado: {
        campo: 'estado',
        valor: estado,
        obli: true,
        idElem: '#selEstado',
        idFeedback: '#feedBackEstado',
        validations: ['empty']
      },
      fechaDesde: {
        campo: 'desde',
        valor: desdeHasta[0],
        obli: true,
        idElem: '#inpFechaDesde',
        idFeedback: '#feedBackFechaDesde',
        validations: ['empty']
      },
      fechaHasta: {
        campo: 'hasta',
        valor: desdeHasta[1],
        obli: true,
        idElem: '#inpFechaHasta',
        idFeedback: '#feedBackFechaHasta',
        validations: ['empty']
      }
    });

    if (objResponse.faltantes.length) {
      objResponse.isValid = false; // en realidad este no es tan necesario, ya que si objResponse.faltantes tiene algun objeto dentro ya se sabe que no se debe dejar pasar la información
      res.json(objResponse);
    }

    if (objResponse.faltantes.length === 0) { // valido
      const
        tarea = Tarea(req.body), // se le pasa el objeto con los datos para ser guardada
        tareaGuardada = await tarea.save();

      if (tareaGuardada) {
        objResponse.idTarea = tareaGuardada._id;
        req.flash('messageSuccess', 'Tarea agregada correctamente');
        res.json(objResponse);
      }

    }

  } catch (err) {
    console.log('Error', err);
  }
}

// const TareaController = {
//   crearTarea = async (req, res) => {
//     try {
//       const tarea = Tarea(req.body);
//       const tareaGuardada = await tarea.save();

//       console.log(tareaGuardada);

//     } catch (err) {
//       console.log('Error', err);
//     }
//   }
// }

// export default TareaController; 