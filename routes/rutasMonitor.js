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
		canales: require('controllers/controladorCanales'),
		procesos: require('controllers/controladorProcesos'),
		tareas: require('controllers/controladorTareas')
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


	// Canales
	app.route('/:nombreDestinoKweb/canales')
		.get(tryCatch(controladores.canales.consultaCanales));

	app.route('/prtg/:nombreDestinoKweb/canales')
		.get(tryCatch(controladores.canales.consultaCanalesPRTG));


	// Procesos
	app.route('/:nombreDestinoKweb/procesos')
		.get(tryCatch(controladores.procesos.consultaProcesos));

	app.route('/prtg/:nombreDestinoKweb/procesos')
		.get(tryCatch(controladores.procesos.consultaProcesosPRTG));


	// Tareas
	app.route('/:nombreDestinoKweb/tareas')
		.get(tryCatch(controladores.tareas.consultaTareas));

	app.route('/prtg/:nombreDestinoKweb/tareas')
		.get(tryCatch(controladores.tareas.consultaTareasPRTG));

	/* Middleware que se ejecuta tras no haberse hecho matching con ninguna ruta. */
	app.use((req, res, next) => {
		L.w(['Se descarta la transmisión porque el endpoint no existe', req.originalUrl]);
		res.status(404).json({ok: false, error: 'No existe la ruta'});
	});

};
