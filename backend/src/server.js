const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

pool
  .testConnection()
  .then((result) => {
    console.log(`Base de datos conectada. Hora del servidor: ${result.now}`);
  })
  .catch((error) => {
    console.error(`No se pudo conectar a la base de datos: ${error.message}`);
  });
