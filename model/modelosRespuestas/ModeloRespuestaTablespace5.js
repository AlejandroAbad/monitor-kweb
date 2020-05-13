'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaTablespaces {

	/**
	 * Group 1.		estado			ok	
	 * Group 2.		nombre			APPLICATION
	 * Group 3.		free			3225024
	 * Group 4.		kbytes			3380200
	 * Group 5.		usado			155176
	 * Group 6.		free			3225024
	 * Group 7.		maxSize			134217664
	 * Group 8.		usado% 			0
	 * Group 9.		maxusado%		0
	 * Group 10.	autoextend		NO|YES
	 * 
	 * Nota: porcentajeUso es el espacio RECLAMADO usado. Si autoextend = OFF, este es el porcentaje de uso.
	 * Cuando autoextend está activado, deberemos usar porcentajeMaximoUso - ya es el porcentaje de espacio usado con respecto al máximo que puede llegar a crecer el tablespace.
	 * 
	 * @param {*} match 
	 */
	constructor(match) {

		this.autoextend = (match[10] === 'NO') ? false : true;

		

		this.estado = match[1];
		this.nombre = match[2];

		this.espacioTotal = parseInt(match[5].replace(/\./g, ''));
		this.espacioMaximo = this.autoextend ? parseInt(match[7]) : parseInt(match[4])

		this.porcentajeUso = parseInt(match[8]);
		this.porcentajeMaximoUso = parseInt(match[9]);
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