'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/procesos
const consultaProcesos = (req, res) => {
	L.i('Listado del los Procesos KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb]);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaProcesos((errorConsulta, procesos) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar los procesos', errorConsulta]);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: procesos });
		}
	})
}


// GET /prtg/:nombreDestinoKweb/procesos
const consultaProcesosPRTG = (req, res) => {
	L.i('Listado del los Procesos KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb]);
		let errorPRTG = new ErrorPRTG('No existe el destino Kweb indicado')
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaProcesos((errorConsulta, procesos) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar los procesos', errorConsulta]);
			let errorPRTG = new ErrorPRTG(errorConsulta.message)
			res.status(500).json(errorPRTG.formatoPRTG());
			return
		} 

		let canalesPRTG = [];
		procesos.forEach(proc => {
			canalesPRTG = canalesPRTG.concat(proc.formatoPRTG());
		})

		res.status(200).json({ prtg: { result: canalesPRTG } });
		
	})
}



module.exports = {
	consultaProcesos,
	consultaProcesosPRTG
}

