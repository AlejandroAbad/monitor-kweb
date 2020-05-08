'use strict';
const C = global.config;
const L = global.logger;


// GET /destinos
const listadoDestinosKweb = (req, res) => {
	L.i('Listado del los destinos KWEB');
	res.status(200).json({ ok: true, datos: C.destinos });
}

// GET /destinos/:nombreDestino
const consultaDestinoKweb = (req, res) => {
	L.i(['Consulta de destino KWEB', req.params.nombreDestino]);
	res.status(200).json({ ok: true, datos: C.destinos[req.params.nombreDestino] });
}

module.exports = {
	listadoDestinosKweb,
	consultaDestinoKweb
}