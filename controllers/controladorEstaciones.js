'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/estaciones
const consultaEstaciones = (req, res) => {
	L.i('Listado del las Estaciones KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e('No existe el destino Kweb indicado', nombreDestinoKweb);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaEstaciones((errorConsulta, estaciones) => {
		if (errorConsulta) {
			L.e('Ocurrió un error al consultar las estaciones', errorConsulta);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: estaciones });
		}
	})
}


// GET /prtg/:nombreDestinoKweb/tablespaces
const consultaEstacionesPRTG = (req, res) => {
	L.i('Listado del loslas Estaciones KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e('No existe el destino Kweb indicado', nombreDestinoKweb);
		let errorPRTG = new ErrorPRTG('No existe el destino Kweb indicado')
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaEstaciones((errorConsulta, estaciones) => {
		if (errorConsulta) {
			L.e('Ocurrió un error al consultar las estaciones', errorConsulta);
			let errorPRTG = new ErrorPRTG(errorConsulta.message)
			res.status(500).json(errorPRTG.formatoPRTG());
			return
		} 

		let canalesPRTG = [];
		estaciones.forEach(estacion => {
			canalesPRTG = canalesPRTG.concat(estacion.formatoPRTG());
		})

		res.status(200).json({ prtg: { result: canalesPRTG } });
		
	})
}



module.exports = {
	consultaEstaciones,
	consultaEstacionesPRTG
}

