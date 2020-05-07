'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

// Helpers
const tryCatch = require('routes/tryCatchWrapper');



module.exports = (app) => {

	const controladores = {
		destinos: require('controllers/controladorConsultaDestinos')
	}


	// Destinos
	app.route('/destinos')
		.get(tryCatch(controladores.destinos.listadoDestinosKweb));
	app.route('/destinos/:nombreDestino')
		.get(tryCatch(controladores.destinos.consultaDestinoKweb));



	/* Middleware que se ejecuta tras no haberse hecho matching con ninguna ruta. */
	app.use((req, res, next) => {
		L.w(['Se descarta la transmisión porque el endpoint no existe', req.originalUrl]);
		res.status(404).json({ok: false, error: 'No existe la ruta'});
	});

};
