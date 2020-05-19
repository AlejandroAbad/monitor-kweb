'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/tablas
const consultaTablas = (req, res) => {
	L.i('Listado de Tablas KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb], destinoKweb.nombre);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaTablas((errorConsulta, tablas) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar las tablas', errorConsulta], destinoKweb.nombre);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: tablas });
		}
	})
}


// GET /prtg/:nombreDestinoKweb/tablas
const consultaTablasPRTG = (req, res) => {
	L.i('Listado de Tablas KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb], destinoKweb.nombre);
		let errorPRTG = new ErrorPRTG('No existe el destino Kweb indicado')
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaTablas((errorConsulta, tablas) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar las tablas', errorConsulta], destinoKweb.nombre);
			let errorPRTG = new ErrorPRTG(errorConsulta.message)
			res.status(500).json(errorPRTG.formatoPRTG());
			return
		} 

		let canalesPRTG = [];
		tablas.forEach(tabla => {
			canalesPRTG = canalesPRTG.concat(tabla.formatoPRTG());
		})

		res.status(200).json({ prtg: { result: canalesPRTG } });
		
	})
}



module.exports = {
	consultaTablas,
	consultaTablasPRTG
}

