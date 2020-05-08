'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaTablespaces {

	/**
	 * Group 1.		ok	
	 * Group 2.		APPLICATION
	 * Group 3.		262.144
	 * Group 4.		0
	 * Group 5.		2
	 * Group 6.		0
	 * Group 7.		NO
	 * @param {*} match 
	 */
	constructor(match) {
		this.estado = match[1];
		this.nombre = match[2];
		this.espacioTotal = parseInt(match[3].replace(/\./g, ''));
		this.espacioMaximo = parseInt(match[4].replace(/\./g, ''));
		this.porcentajeUso = parseInt(match[5]);
		this.porcentajeMaximoUso = parseInt(match[6]);
		this.autoextend = (match[7] === 'NO') ? false : true;
	}


	formatoPRTG() {
		return [
			{
				"Channel": this.nombre,
				"Value": this.porcentajeUso,
				"LimitMode": 1,
				"Unit": "Percent",
				"LimitMaxError": this.porcentajeMaximoUso || 90
			}
		]
	}
	
}

module.exports = RespuestaTablespaces;