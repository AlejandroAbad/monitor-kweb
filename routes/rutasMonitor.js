'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

// Helpers
const tryCatch = require('routes/tryCatchWrapper');



module.exports = (app) => {

	const controladores = {
		destinos: require('controllers/controladorConsultaDestinos'),
		filesystems: require('controllers/controladorFilesystems'),
		tablespaces: require('controllers/controladorTablespaces'),
		estaciones: require('controllers/controladorEstaciones'),
		tablas: require('controllers/controladorTablas'),
	}


	// Destinos
	app.route('/destinos')
		.get(tryCatch(controladores.destinos.listadoDestinosKweb));
	app.route('/destinos/:nombreDestino')
		.get(tryCatch(controladores.destinos.consultaDestinoKweb));


	// Filesystems
	app.route('/:nombreDestinoKweb/filesystems')
		.get(tryCatch(controladores.filesystems.consultaFilesystems));

	app.route('/prtg/:nombreDestinoKweb/filesystems')
		.get(tryCatch(controladores.filesystems.consultaFilesystemsPRTG));


	// Tablespaces
	app.route('/:nombreDestinoKweb/tablespaces')
		.get(tryCatch(controladores.tablespaces.consultaTablespaces));

	app.route('/prtg/:nombreDestinoKweb/tablespaces')
		.get(tryCatch(controladores.tablespaces.consultaTablespacesPRTG));


	// Estaciones
	app.route('/:nombreDestinoKweb/estaciones')
		.get(tryCatch(controladores.estaciones.consultaEstaciones));

	app.route('/prtg/:nombreDestinoKweb/estaciones')
		.get(tryCatch(controladores.estaciones.consultaEstacionesPRTG));


	// Tablas
	app.route('/:nombreDestinoKweb/tablas')
		.get(tryCatch(controladores.tablas.consultaTablas));

	app.route('/prtg/:nombreDestinoKweb/tablas')
		.get(tryCatch(controladores.tablas.consultaTablasPRTG));


	/* Middleware que se ejecuta tras no haberse hecho matching con ninguna ruta. */
	app.use((req, res, next) => {
		L.w(['Se descarta la transmisión porque el endpoint no existe', req.originalUrl]);
		res.status(404).json({ok: false, error: 'No existe la ruta'});
	});

};
