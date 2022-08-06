import Tarea from '../models/Tarea';

export const crearTarea = async (req, res) => {
  try {
    const tarea = Tarea(req.body); // se le pasa el objeto con los datos para ser guardada
    const tareaGuardada = await tarea.save();

    console.log(tareaGuardada);

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