'use strict';
//const C = global.config;
const L = global.logger;

// Modelos
const DestinoKweb = require('model/ModeloDestinoKweb');
const ErrorPRTG = require('model/prtg/ModeloErrorPRTG');

// GET /:nombreDestinoKweb/filesystems
const consultaFilesystems = (req, res) => {
	L.i('Listado del los filesystems KWEB');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb]);
		res.status(404).json({ ok: false, error: 'No existe el desino Kweb indicado' });
		return;
	}

	destinoKweb.consultaFilesystems((errorConsulta, filesystems) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar los filesystems', errorConsulta]);
			res.status(500).json({ ok: false, error: errorConsulta });
		} else {
			res.status(200).json({ ok: true, datos: filesystems });
		}
	})
}


const consultaFilesystemsPRTG = (req, res) => {
	L.i('Listado del los filesystems KWEB para PRTG');

	let nombreDestinoKweb = req.params.nombreDestinoKweb;

	let destinoKweb = DestinoKweb.desdeNombre(nombreDestinoKweb);

	if (!destinoKweb) {
		L.e(['No existe el destino Kweb indicado', nombreDestinoKweb]);
		let errorPRTG = new ErrorPRTG('No existe el desino Kweb indicado');
		res.status(404).json(errorPRTG.formatoPRTG());
		return;
	}

	destinoKweb.consultaFilesystems((errorConsulta, filesystems) => {
		if (errorConsulta) {
			L.e(['Ocurrió un error al consultar los filesystems', errorConsulta]);
			let errorPRTG = new ErrorPRTG(errorConsulta.message);
			res.status(500).json(errorPRTG.formatoPRTG());
			return;
		}

		let canalesPRTG = [];

		filesystems.forEach(filesystem => {
			canalesPRTG = canalesPRTG.concat(filesystem.formatoPRTG());
		})

		res.status(200).json({ prtg: { result: canalesPRTG } });

	})

}


module.exports = {
	consultaFilesystems,
	consultaFilesystemsPRTG
}

