'use strict';
//const C = global.config;
const L = global.logger;

// Externas
const request = require('request')

// Modelos
const RespuestaFilesystem = require('model/modelosRespuestas/ModeloRespuestaFilesystem');
const RespuestaTablespace = require('model/modelosRespuestas/ModeloRespuestaTablespace');
const RespuestaEstacion = require('model/modelosRespuestas/ModeloRespuestaEstacion');


const ENDPOINTS = {
	AUTH: '/kweb/auth',
	FILESYSTEMS: '/kweb/agents/page?kweb:agents.disks_expanded=true#kweb_agents_disks',
	TABLESPACES: '/kweb/agents/page?kweb:agents.oracletablespaces_expanded=true#kweb_agents_oracletablespaces',
	ESTACIONES: '/kweb/agents/page?kweb:agents.stations_expanded=true#kweb_agents_stations'
}

const REGEX = {
	TITULO_LOGIN: /<title>(.*)LOGIN/,
	FILESYSTEMS: /<tr [a-zA-Z0-9=\'\"\:\s\.\_\/]*><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><img [a-zA-Z0-9=\'\"\:\s\.\_\/]*><img src=\"\/kweb\/img\/ico\-([a-zA-Z0-9\/\-\.]*)\.gif\" [a-zA-Z0-9=\'\"\:\s\.\_\/]*><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([a-zA-z0-9\/\_]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([0-9]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([0-9]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([0-9]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([0-9]*)%<\/div><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([0-9]*)%<\/div><\/td><\/tr>/g,
	TABLESPACES: /<tr [a-zA-Z0-9=\'\"\:\s\.\_\/]*><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><img [a-zA-Z0-9=\'\"\:\s\.\_\/]*><img src=\"\/kweb\/img\/ico\-([a-zA-Z0-9\/\-\.]*)\.gif\" [a-zA-Z0-9=\'\"\:\s\.\_\/]*><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>\*([a-zA-z0-9\/\_]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([0-9\.]*)<\/div><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([0-9\.]*)<\/div><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([0-9\.]*)%<\/div><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([0-9\.]*)%<\/div><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([a-zA-Z0-9]*)<\/span><\/td><\/tr>/g,
	ESTACIONES: /<tr [a-zA-Z0-9=\'\"\:\s\.\_\/]*><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><img [a-zA-Z0-9=\'\"\:\s\.\_\/]*><img src=\"\/kweb\/img\/ico\-([a-zA-Z0-9\/\-\.]*)\.gif\" [a-zA-Z0-9=\'\"\:\s\.\_\/]*><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([a-zA-z0-9]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><span>([a-zA-z0-9\s]*)<\/span><\/td><td [a-zA-Z0-9=\'\"\:\s\.\_\/]*><div [a-zA-Z0-9=\'\"\:\s\.\_\/]*>([a-zA-Z0-9\/\_\s]*)<\/div><\/td><\/tr>/g,
}


class ModeloDestinoKweb6 {
	constructor(nombreDestino, configuracionDestino) {

		this.versionKnapp = 6;
		this.nombre = nombreDestino;

		this.urlBase = configuracionDestino.urlBase;
		this.usuario = configuracionDestino.usuario;
		this.password = configuracionDestino.password;

	}

	_generarSolicitudAutenticacion() {
		let solicitudAutenticacion = new URLSearchParams();
		solicitudAutenticacion.append('action', 'login');
		solicitudAutenticacion.append('loginUser', this.usuario);
		solicitudAutenticacion.append('loginPassword', this.password);
		return solicitudAutenticacion;
	}

	_generarParametrosDeLlamadaAutenticacion() {
		return {
			followAllRedirects: true,
			uri: this.urlBase + ENDPOINTS.AUTH,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': '*/*',
				'Accept-Enconding': 'gzip, deflate, br',
				'Connection': 'close'
			},
			body: this._generarSolicitudAutenticacion().toString()
		}
	}

	_generarParametrosDeLlamada(endpoint) {
		return {
			followAllRedirects: true,
			uri: this.urlBase + endpoint,
			method: 'GET',
			headers: {
				'Cookie': this.cookieAutenticacion,
				'Accept': '*/*',
				'Accept-Enconding': 'gzip, deflate, br',
				'Connection': 'close'
			}
		}
	}

	_renovarCookieAutenticacion(callback) {

		let parametrosLlamada = this._generarParametrosDeLlamadaAutenticacion();

		L.t(['Realizando petición de autenticacion al sistema Kweb', parametrosLlamada]);

		request(parametrosLlamada, (errorLlamada, respuestaHttp, cuerpoHttp) => {

			if (errorLlamada) {
				L.e(['Ocurrió un error en la llamada al sistema Kweb', errorLlamada]);
				callback(errorLlamada, false);
				return;
			}

			if (respuestaHttp.statusCode !== 200) {
				L.e(['La llamada no retornó un codigo de respuesta HTTP 200', respuestaHttp.statusCode]);
				callback(new Error('KWeb retornó un error de respuesta: ' + respuestaHttp.statusCode), null);
				return;
			}



			if (REGEX.TITULO_LOGIN.test(cuerpoHttp)) {
				L.e(['La llamada no consiguió autenticarse - Credenciales no válidas']);
				callback(new Error('Credenciales incorrectas'), false);
			} else {
				this.cookieAutenticacion = respuestaHttp.req.path.substring(7).toUpperCase();
				callback(null, true);
			}
		});
	}


	consultaFilesystems(callback) {

		this._renovarCookieAutenticacion((errorAutenticacion, estoyAutenticado) => {
			if (errorAutenticacion) {
				callback(errorAutenticacion, null);
				return;
			}

			let parametrosLlamada = this._generarParametrosDeLlamada(ENDPOINTS.FILESYSTEMS);

			request(parametrosLlamada, (errorLlamada, respuestaHttp, cuerpoHttp) => {

				if (errorLlamada) {
					L.e(['Ocurrió un error en la llamada al sistema Kweb', errorLlamada]);
					callback(errorLlamada, null);
					return;
				}

				if (respuestaHttp.statusCode !== 200) {
					L.e(['La llamada no retornó un codigo de respuesta HTTP 200', respuestaHttp.statusCode]);
					callback(new Error('KWeb retornó un error de respuesta: ' + respuestaHttp.statusCode), null);
					return;
				}

				cuerpoHttp = cuerpoHttp.replace(/\n*/g, '');
				let match = REGEX.FILESYSTEMS.exec(cuerpoHttp);

				let filesystems = [];

				while (match != null) {
					let respuestaFilesystem = new RespuestaFilesystem(match);
					filesystems.push(respuestaFilesystem);
					match = REGEX.FILESYSTEMS.exec(cuerpoHttp);
				}

				callback(null, filesystems);
			})
		})
	}


	consultaTablespaces(callback) {

		this._renovarCookieAutenticacion((errorAutenticacion, estoyAutenticado) => {
			if (errorAutenticacion) {
				callback(errorAutenticacion, null);
				return;
			}

			let parametrosLlamada = this._generarParametrosDeLlamada(ENDPOINTS.TABLESPACES);

			request(parametrosLlamada, (errorLlamada, respuestaHttp, cuerpoHttp) => {

				if (errorLlamada) {
					L.e(['Ocurrió un error en la llamada al sistema Kweb', errorLlamada]);
					callback(errorLlamada, null);
					return;
				}

				if (respuestaHttp.statusCode !== 200) {
					L.e(['La llamada no retornó un codigo de respuesta HTTP 200', respuestaHttp.statusCode]);
					callback(new Error('KWeb retornó un error de respuesta: ' + respuestaHttp.statusCode), null);
					return;
				}

				cuerpoHttp = cuerpoHttp.replace(/\n/g, '');
				let match = REGEX.TABLESPACES.exec(cuerpoHttp);

				let tablespaces = [];

				while (match != null) {
					let respuestaTablespace = new RespuestaTablespace(match);
					tablespaces.push(respuestaTablespace);
					match = REGEX.TABLESPACES.exec(cuerpoHttp);
				}

				callback(null, tablespaces);
			})
		})
	}

	consultaEstaciones(callback) {
		this._renovarCookieAutenticacion((errorAutenticacion, estoyAutenticado) => {
			if (errorAutenticacion) {
				callback(errorAutenticacion, null);
				return;
			}

			let parametrosLlamada = this._generarParametrosDeLlamada(ENDPOINTS.ESTACIONES);

			request(parametrosLlamada, (errorLlamada, respuestaHttp, cuerpoHttp) => {

				if (errorLlamada) {
					L.e(['Ocurrió un error en la llamada al sistema Kweb', errorLlamada]);
					callback(errorLlamada, null);
					return;
				}

				if (respuestaHttp.statusCode !== 200) {
					L.e(['La llamada no retornó un codigo de respuesta HTTP 200', respuestaHttp.statusCode]);
					callback(new Error('KWeb retornó un error de respuesta: ' + respuestaHttp.statusCode), null);
					return;
				}

				cuerpoHttp = cuerpoHttp.replace(/\n/g, '');
				console.log(cuerpoHttp);
				let match = REGEX.ESTACIONES.exec(cuerpoHttp);



				let estaciones = [];

				while (match != null) {
					let respuestaEstacion = new RespuestaEstacion(match);
					estaciones.push(respuestaEstacion);
					match = REGEX.ESTACIONES.exec(cuerpoHttp);
				}

				callback(null, estaciones);
			})
		})
	}

}

module.exports = ModeloDestinoKweb6;