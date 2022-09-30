import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import indexRoutes from './routes/index.routes';
import tareaRoutes from './routes/tarea.routes';
import categoriaRoutes from './routes/categoria.routes';
import authenticationRoutes from './routes/authentication.routes';
import morgan from 'morgan';
import flash from 'connect-flash';
import session from 'express-session';

const app = express();

// express por defecto piensa que las vistas estan en la raíz, por eso con esto se le dice donde están
app.set('views', path.join(__dirname, 'views'));

const exphbs = create({
  defaultLayout: 'main', // aqui le decimos el nombre de nuestro archivo hbs principal
  layoutsDir: path.join(app.get('views'), 'layouts'), // aquí le decimos donde está nuestro archivo hbs principal (se pone dentro de una carpeta, ya que esto recibe es una carpeta)
  partialsDir: path.join(app.get('views'), 'partials'), // aqui estan los pedazos que html que vamos a utilizar
  extname: '.hbs',
  helpers: require('./lib/handlebars')
});

// con esta configuración lo que hacemos es que cuando el usuario visite cualquier página del aplicativo
// siempre lo envia a main.hbs, lo que hacen las rutas (ej: reder('sidebar')) es traer el hbs, y pegarlos donde está el {{{body}}}
app.engine('.hbs', exphbs.engine);

app.set('view engine', '.hbs');

// * middleware
app.use(session({
  secret: 'pumpkinsession',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash()); // para los mensajes después de un redirect
app.use(morgan('dev')); // esto es para ver las rutas en nuestra consola (eso de 'dev' es algo predeterminado)
app.use(express.urlencoded({ extended: false })); // para que acepte string y cosas sencillas en las peticiones
app.use(express.json()); // para que acepte Jsons en las peticiones

// * variables globales
// Aquí se ponen variables que queremos acceder desde cualquier parte
// nota: al parecer si se pone este código después de las rutas, ya no sirve el req.flash idk why
app.use((req, res, next) => {
  app.locals.messageSuccess = req.flash('messageSuccess');
  app.locals.messageInfo = req.flash('messageInfo');
  app.locals.messageWarning = req.flash('messageWarning');
  app.locals.messageError = req.flash('messageError');
  app.locals.user = req.user;
  next();
});

// * rutas
// Aqui le decimos donde se encuentran los archivos de (routes/talturas.js)
// por cada archivo de ruta que se cree, aquí se debe poner un .use(tal)

// ojo, en cada archivo poner el export router o si no da error
app.use(indexRoutes); // Le digo que utilice las rutas que creé en index.routes.js - Para acceder es: http://localhost:4000/ruta
app.use('/tarea', tareaRoutes); // Le digo que utilice las rutas que creé en tarea.routes.js para acceder se tiene que hacer: http://localhost:4000/tarea/ruta
app.use('/categoria', categoriaRoutes); // Le digo que utilice las rutas que creé en categoria.routes.js para acceder se tiene que hacer: http://localhost:4000/categoria/ruta
app.use(authenticationRoutes); // Le digo que utilice las rutas que creé en index.routes.js


// * public
// aqui le decimos donde están nuestros archivos estaticos de la página
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../node_modules/boxicons/')));
app.use(express.static(path.join(__dirname, '../node_modules/sweetalert2/dist')));

// * error
app.use((req, res) => {
  res.status(404).render('error/err404', { title: 'Error 404' });
});

export default app;