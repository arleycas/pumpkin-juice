import { Schema, model, version } from 'mongoose';

// Schema: Definimos que queremos guardar dentro de mongodb
// model: Para colocarle un nombre a nuestro conjunto de propiedades que queremos guardar (nombre de la tabla)

const tareaSchema = new Schema({
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  estado: { type: String, trim: true },
  desdeHasta: [Date, Date],
  categoria: String,
  subcategoria: String,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
}, {
  timestamps: true, // esto es para saber su createdAt y updatedAt,
  versionKey: false, // es una cosa interna que crea automaticamente que no interesa tenerla
  collection: 'cl_tarea', // nombre de la collection
});

export default model('Tarea', tareaSchema);