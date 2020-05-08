'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/tablespaces
const consultaTablespaces = (req, res) => {
	L.i('Listado del los Tablespaces KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e('No existe el destino Kweb indicado', nombreDestinoKweb);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaTablespaces((errorConsulta, tablespaces) => {
		if (errorConsulta) {
			L.e('Ocurrió un error al consultar los tablespaces', errorConsulta);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: tablespaces });
		}
	})
}


// GET /prtg/:nombreDestinoKweb/tablespaces
const consultaTablespacesPRTG = (req, res) => {
	L.i('Listado del los Tablespaces KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e('No existe el destino Kweb indicado', nombreDestinoKweb);
		let errorPRTG = new ErrorPRTG('No existe el destino Kweb indicado')
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaTablespaces((errorConsulta, tablespaces) => {
		if (errorConsulta) {
			L.e('Ocurrió un error al consultar los tablespaces', errorConsulta);
			let errorPRTG = new ErrorPRTG(errorConsulta.message)
			res.status(500).json(errorPRTG.formatoPRTG());
			return
		} 

		let canalesPRTG = [];
		tablespaces.forEach(tbs => {
			canalesPRTG = canalesPRTG.concat(tbs.formatoPRTG());
		})

		res.status(200).json({ prtg: { result: canalesPRTG } });
		
	})
}



module.exports = {
	consultaTablespaces,
	consultaTablespacesPRTG
}

