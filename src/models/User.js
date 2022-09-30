import { Schema, model, version, Types } from 'mongoose';

// Schema: Definimos que queremos guardar dentro de mongodb
// model: Para colocarle un nombre a nuestro conjunto de propiedades que queremos guardar (nombre de la tabla)
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  lastLogin: Date
}, {
  timestamps: true, // esto es para saber su createdAt y updatedAt,
  versionKey: false, // es una cosa interna que crea automaticamente que no interesa tenerla
  collection: 'cl_user', // nombre de la collection
});

export default model('User', userSchema);