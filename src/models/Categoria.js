import { Schema, model, version, Types } from 'mongoose';

// Schema: Definimos que queremos guardar dentro de mongodb
// model: Para colocarle un nombre a nuestro conjunto de propiedades que queremos guardar (nombre de la tabla)
const categoriaSchema = new Schema({
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  subcategoria: [new Schema({
    nombre: String
  })],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
}, {
  timestamps: true, // esto es para saber su createdAt y updatedAt,
  versionKey: false, // es una cosa interna que crea automaticamente que no interesa tenerla
  collection: 'cl_categoria', // nombre de la collection
});

export default model('Categoria', categoriaSchema);