'use strict';
const C = global.config;
//const L = global.logger;
//const K = global.constants;



const DestinoKweb = {};

/**
 * Trata de crear el objeto del destino Kweb en base al nombre del mismo.
 * En caso de que el sistema Kweb no exista, se devuelve null.
 *
 * @param {*} nombreDestinoKweb
 * @param {*} callback
 */
DestinoKweb.desdeNombre = (nombreDestinoKweb) => {

	let datosConfiguracion = C.destino(nombreDestinoKweb);

	if (!datosConfiguracion) {
		return null;
	}

	let nombreClase = 'ModeloDestinoKweb' + datosConfiguracion.versionKnapp;
	let ModeloDestinoKweb = require('model/modelosDestinoKweb/' + nombreClase);

	return new ModeloDestinoKweb(nombreDestinoKweb, datosConfiguracion);
}



module.exports = DestinoKweb;
