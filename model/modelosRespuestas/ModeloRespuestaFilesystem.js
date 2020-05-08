'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaFilesystem {

	/**
	 * Group 1.		ok
	 * Group 2.		/
	 * Group 3.		2086912
	 * Group 4.		1677516
	 * Group 5.		409396
	 * Group 6.		20
	 * Group 7.		90
	 * @param {*} match 
	 */
	constructor(match) {
		this.estado = match[1];
		this.puntoMontaje = match[2];
		this.espacioTotal = parseInt(match[3]);
		this.espacioLibre = parseInt(match[4]);
		this.espacioOcupado = parseInt(match[5]);
		this.porcentajeUso = parseInt(match[6]);
		this.umbralAlerta = parseInt(match[7]);
	}


	formatoPRTG() {
		return [
			{
				"Channel": "Uso de " + this.puntoMontaje,
				"Value": this.porcentajeUso,
				"LimitMode": 1,
				"Unit": "Percent",
				"LimitMaxError": this.umbralAlerta,
				"LimitMaxWarning": Math.max(0, this.umbralAlerta - 10)
			},
			{
				"Channel": "Bytes libres en " + this.puntoMontaje,
				"Value": this.espacioLibre,
				"Unit": "BytesDisk"
			},
			{
				"Channel": "Bytes total en " + this.puntoMontaje,
				"Value": this.espacioTotal,
				"Unit": "BytesDisk"
			}
		]
	}
	
}

module.exports = RespuestaFilesystem;