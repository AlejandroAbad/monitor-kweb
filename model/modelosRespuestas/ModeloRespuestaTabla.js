'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaTabla {

	/**
	 * Group 1.		ESTADO		ok	
	 * Group 2.		NOMBRE		auftrag
	 * Group 3.		ENTRADAS ACTUAL		223
	 * Group 4.		ENTRADAS MAX.		30.000
	 * @param {*} match 
	 */

	constructor(match) {
		this.estado = match[1];
		this.nombre = match[2];
		this.entradas = parseInt(match[3].replace(/\./g, ''));
		this.entradasMaximo = parseInt(match[4].replace(/\./g, ''));
	}


	formatoPRTG() {
		return [
			{
				"Channel": this.nombre,
				"Value": this.entradas,
				"LimitMode": 1,
				"Unit": 'Custom',
				"CustomUnit": 'entradas',
				"LimitMaxWarning": this.entradasMaximo * 0.8,
				"LimitMaxError": this.entradasMaximo * 0.9
			}
		]
	}
	
}

module.exports = RespuestaTabla;