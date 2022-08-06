# Guia para desarrollador

**Proyecto web PBS (cliente compensar)**

## Donde encontrar archivos y funcionalidades

- [Datatable] Configuración en _js/config.js_

**Nav**
Las varaibles de los IFs, vienen del archivo _lib/handlebars.js_
La función en el .hbs funciona así: _{{funcion parametro_de_funcion}}_

## Funcionalidad del algoritmo

**Login**

Login --> Valida si es efectivo en _lib/passport.js_ y envia a _routes/user.js_
Si en BD tiene PER CESTADO LOGUEO = 'LOGUEO' --> render a _view/sesiónDuplicada_
Si en BD tiene PER CESTADO LOGUEO = 'CAMBIARPASS' --> render a _view/cambiarPass_
De lo contrario --> render a _views/Inicio_ (ingreso normal)

**Notifiacaiones**

**_Campanita (masivas)_**

(front) Icono campana y Modal se encuentran en _partials/nav.hbs_
El código front, se encuentra en _js/nav.js_

**_Alerta inicio de sesion_**

(front) El modal está en _views/pbs/inicio.hbs_
El código del front está en _js/inicio.js_

**Middlewares**

Si nos fijamos en el archivo de rutas _routes/pbs.js_ a las rutas que hacen render, se les pasa como argumento la función que está en _lib/auth.js_
Ojo: Hay que importar el archivo auth.js en pbs.js

---

Por Arley Castro RPA 2021 😎

--------------------------------- DEsde aquí lo de pumpkin

# FAQ

### ¿Como ejecutar el proyecto?

Ya que se debe usar Babel, el comando ya no es _node src/index.js_ sino _npx babel-node src/index_
Ya está en start, entonces solo usar npm run start

## Para que sirve cada dependencia

- [express] Crear el servidor
- [express-handlebars] La forma de integrar un motor de plantillas en express (por ejemplo HBS)
- [mongoose] Permite conectarnos a la BD y modelar los datos
- [morgan] Ver por consola las peticiones que le llegan al servidor
- [npm i -D @babel/core @babel/cli @babel/node @babel/preset-env nodemon] Compilador que convierte codigo JS moderno a código que entiendan todos los modulos de node, digamos ya podría usar import en los archivos del proyecto sin que ocurran conflictos

## Que hace el archivo

- [.babelrc] Configuración de Babel
- [src/database.js] Crea la conexión a mongodb (recordar ejecutar mongod primero en el pc)

## Estructura

### _src/_

### _src/routes/_

- [_index.routes.js_] Es para no tener que tener las rutas en el archivo index principal

### _src/models/_

Acá se definen los modelos de datos de la base de datos

### _src/views/_

- [_partials_] Aquí estan los trozos de código HTML que quiero que estén por defecto en el main.hbs (por ejemplo el sidebar), dentro del main.hbs se llaman {{> fichero.hbs}}. Por defecto el handlebars, sabe que estos archivos se encuentra en una carpeta llamada _partials_, esto se puede configurar en _src/app.js_ en el objeto "exphbs", se le crea una nueva propiedad: "partialsDir: path.join(app.get('views'), 'partials o carpeta nueva')"

## TODO

- Importante: En /categoria/editar hacer, algo para poder agregarle una subcategoria al a categoria que ella seleccione
- Una notita, con una frase o algo interesante diaria diferente?
- Que las tareas tengan un rango tipo (fecha de inicio, fecha finalización)
- Estado: Doing, Todo, DONE etc
- En el apartado de configuración que le pueda cambiar el tema. Temas de Bootswatch

Complementar ambos
https://www.youtube.com/watch?v=I-MhmB5B6Zk&t=1870s&ab_channel=FaztCode Con Mongo
https://www.youtube.com/watch?v=qJ5R9WTW0_E Con MySQL (quede en 1 h)

## PREGUNTAS TODO

- Si nana borra una categoria o subcategoria la cual este asociada a una o mas tareas, que debe pasar?
  posibilidad 1) Eliminar todas las tareas asociadas a esa cat o subcat
  posibilidad 2) No dejar eliminar la cat o subcat, hasta que ya no hayan tareas asociadas
