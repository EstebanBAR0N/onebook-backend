const http = require('http');
const app = require('./app');

// normalise le port, entre la variable d'environnement PORT et un port par défaut
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// gère les erreurs (bon affichage suivant l'erreur)
const errorHandler = (error) => {
  if (error.syscall != 'listen') {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privilages.');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
    default:
      throw error;
  }
};

// création du serveur http
const server = http.createServer(app);

// mise à l'écoute du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
