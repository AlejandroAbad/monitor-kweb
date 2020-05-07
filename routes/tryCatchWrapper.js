'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

const tryCatch = (funcionControlador) => {
	let controlador = (req, res) => {
		try {
			funcionControlador(req, res);
		} catch (excepcion) {
			L.f(['Ocurrió un error al ejecutar la petición', excepcion])
			res.status(500).json({ ok: false, error: 'Ocurrió un error al ejecutar la petición'})
			L.dump(excepcion, req)
			return;
		}
	}
	return controlador;
}


module.exports = tryCatch;