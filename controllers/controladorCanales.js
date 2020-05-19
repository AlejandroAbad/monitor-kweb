'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/canales
const consultaCanales = (req, res) => {
	L.i('Listado del los Canales KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb], destinoKweb.nombre);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaCanales((errorConsulta, canales) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar los canales', errorConsulta], destinoKweb.nombre);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: canales });
		}
	})
}


// GET /prtg/:nombreDestinoKweb/canales
const consultaCanalesPRTG = (req, res) => {
	L.i('Listado del los Canales KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb], destinoKweb.nombre);
		let errorPRTG = new ErrorPRTG('No existe el destino Kweb indicado')
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaCanales((errorConsulta, canales) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar los canales', errorConsulta], destinoKweb.nombre);
			let errorPRTG = new ErrorPRTG(errorConsulta.message)
			res.status(500).json(errorPRTG.formatoPRTG());
			return
		} 

		let canalesPRTG = [];
		canales.forEach(canal => {
			canalesPRTG = canalesPRTG.concat(canal.formatoPRTG());
		})

		res.status(200).json({ prtg: { result: canalesPRTG } });
		
	})
}



module.exports = {
	consultaCanales,
	consultaCanalesPRTG
}

