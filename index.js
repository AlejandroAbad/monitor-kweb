'use strict';
require('app-module-path').addPath(__dirname);

require('globals');
const C = global.config;
const L = global.logger;


process.on('uncaughtException', (excepcionNoControlada) => {
	L.dump(excepcionNoControlada)
	process.exit(1)
})



L.i('**** ARRANCANDO MONITOR K-WEB v1.0.0 ****');


const HTTP = require('http');
let app = require('express')();
let cors = require('cors');
app.use(cors());
app.disable('x-powered-by');
app.disable('etag');
app.use(require('body-parser').json({ extended: true }));

// Carga de rutas
let rutasHTTP = require('routes/rutasMonitor');
rutasHTTP(app);



try {
	HTTP.createServer(app).listen(C.http.puerto, () => {
		L.i(["Servidor HTTP a la escucha en el puerto", C.http.puerto]);
	}).on('error', (err) => {
		L.f("Ocurrió un error al arrancar el servicio HTTP");
		L.f(err);
		process.exit(1);
	});
} catch (excepcionArranqueServidorHTTP) {
	L.f("Ocurrió un error al arrancar el servicio HTTP");
	L.f(excepcionArranqueServidorHTTP);
	process.exit(1);
}
