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
	 * Group 7.		NO|YES
	 * 
	 * Nota: porcentajeUso es el espacio RECLAMADO usado. Si autoextend = OFF, este es el porcentaje de uso.
	 * Cuando autoextend está activado, deberemos usar porcentajeMaximoUso - ya es el porcentaje de espacio usado con respecto al máximo que puede llegar a crecer el tablespace.
	 * 
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
				"Value": this.autoextend ? this.porcentajeMaximoUso : this.porcentajeUso,
				"LimitMode": 1,
				"Unit": "Percent",
				"LimitMaxError": 90
			}
		]
	}
	
}

module.exports = RespuestaTablespaces;