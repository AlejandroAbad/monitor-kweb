'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/tareas
const consultaTareas = (req, res) => {
	L.i('Listado del las Tareas KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e('No existe el destino Kweb indicado', nombreDestinoKweb);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaTareas((errorConsulta, tareas) => {
		if (errorConsulta) {
			L.e('Ocurrió un error al consultar las tareas', errorConsulta);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: tareas });
		}
	})
}


// GET /prtg/:nombreDestinoKweb/tareas
const consultaTareasPRTG = (req, res) => {
	L.i('Listado del las Tareas KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e('No existe el destino Kweb indicado', nombreDestinoKweb);
		let errorPRTG = new ErrorPRTG('No existe el destino Kweb indicado')
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaTareas((errorConsulta, tareas) => {
		if (errorConsulta) {
			L.e('Ocurrió un error al consultar las tareas', errorConsulta);
			let errorPRTG = new ErrorPRTG(errorConsulta.message)
			res.status(500).json(errorPRTG.formatoPRTG());
			return
		} 

		res.status(200).json({ prtg: { result: tareas.formatoPRTG() } });
		
	})
}



module.exports = {
	consultaTareas,
	consultaTareasPRTG
}

