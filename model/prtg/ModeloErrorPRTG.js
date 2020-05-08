'use strict';
const C = global.config;
const L = global.logger;


class ErrorPRTG {
	
	constructor(mensaje) {
		this.mensaje = mensaje;
	}

	formatoPRTG() {
		return {
			prtg: {
				error: 1,
				text: mensaje
			}
		}
	}

}

module.exports = ErrorPRTG;