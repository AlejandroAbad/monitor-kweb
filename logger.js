'use strict';
const C = global.config;
let L = {};

const fs = require('fs');
const util = require('util');


const TRACE = 'TRC';
const DEBUG = 'DBG';
const INFO = 'INF';
const WARN = 'WRN';
const ERROR = 'ERR';
const FATAL = 'DIE';


const _obtenerFicheroLog = (timestamp, esParaDump) => {
	let fecha = Date.toShortDate(timestamp);
	if (esParaDump) fecha += '.' + Date.toShortTime(timestamp);
	return C.dumpdir + '/' + fecha + (esParaDump ? '.dump' : '.log');
}

const grabarLog = (evento) => {

	let categoria = evento.categoria.padStart(15)
	let hora = Date.toShortTime(evento.timestamp)
	let mensaje = hora + '|' + evento.level + '|' + categoria + '|' + JSON.stringify(evento.datos)

	console.log(mensaje)

}

const logGeneral = (datos, nivel, categoria) => {
	if (!Array.isArray(datos)) datos = [datos];

	let evento = {
		categoria: categoria || 'server',
		level: nivel || INFO,
		datos: datos,
		timestamp: new Date()
	}
	grabarLog(evento);
};



const dump = (err, req) => {

	let message = (new Date).toUTCString() + '\n\n'
	message += err.stack


	if (req) {
		message += '\n\nPETICIÓN HTTP\n=============\n'
		message += 'IP: ' + req.ip + ' (' + req.protocol + ')\n'
		message += req.method + ' ' + req.originalUrl + ' HTTP/' + req.httpVersion + '\n'
		message += util.inspect(req.headers) + '\n\n'
		message += util.inspect(req.body)
	}

	fs.appendFileSync(_obtenerFicheroLog(new Date(), true), message, (errorEscrituraFichero) => {
		if (errorEscrituraFichero) {
			console.error('### ERROR GENERANDO FICHERO DE DUMP');
			console.error(errorEscrituraFichero);
		}
	})

	console.log('DUMP GENERADO: ' + _obtenerFicheroLog(new Date(), true))
	console.log(message)

}


let _generaCategoriaLog = (categoria) => categoria;

L = {
	t: (datos, categoria) => logGeneral(datos, TRACE, _generaCategoriaLog(categoria)),
	d: (datos, categoria) => logGeneral(datos, DEBUG, _generaCategoriaLog(categoria)),
	i: (datos, categoria) => logGeneral(datos, INFO, _generaCategoriaLog(categoria)),
	w: (datos, categoria) => logGeneral(datos, WARN, _generaCategoriaLog(categoria)),
	e: (datos, categoria) => logGeneral(datos, ERROR, _generaCategoriaLog(categoria)),
	f: (datos, categoria) => logGeneral(datos, FATAL, _generaCategoriaLog(categoria)),
	dump: dump
};


module.exports = L;
