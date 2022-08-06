import { connect } from 'mongoose';

// función que se llama solita, todo para poder poner el async xD
(async () => {

  try {

    // const db = await connect('mongodb://localhost/db_pumpkinjuice'); // conexión local
    const db = await connect('mongodb+srv://sponge_nana:die2022$@cluster0.hz1ld.mongodb.net/db_pumpkinjuice?retryWrites=true&w=majority'); // conexión Mongo Atlas
    console.log('DB conectada a', db.connection.name);
  } catch (err) {
    console.log('Error', err)
  }

})();
