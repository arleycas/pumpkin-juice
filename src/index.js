import app from './app';
import './database';

// * Este archivo es solo para iniciar el servidor, la configuración del servidor está en src/app.js

// * starting the server
app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () => {
  console.log('\(@^0^@)/ Servidor en puerto', app.get('port'));
});