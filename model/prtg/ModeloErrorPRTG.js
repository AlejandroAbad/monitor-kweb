'use strict';
//const C = global.config;
//const L = global.logger;


class ErrorPRTG {
	
	constructor(mensaje) {
		this.mensaje = mensaje;
	}

	formatoPRTG() {
		return {
			ok: false,
			error: this.mensaje,
			prtg: {
				error: 1,
				text: this.mensaje
			}
		}
	}

}

module.exports = ErrorPRTG;