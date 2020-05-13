'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaCanal {

	/**
	 * Group 1.		estado			ok	
	 * Group 2.		nombre			KX40			
	 * Group 3.		mensajes		0
	 * Group 4.		bytes			0
	 * Group 5.		Enviado			12-05-2020 07:59
	 * Group 6.		Recibido		12-05-2020 07:56
	 * @param {*} match 
	 */
	constructor(match) {
		this.estado = match[1];
		this.nombre = match[2];
		this.mensajes = parseInt(match[3].replace(/\./g, ''));
		this.bytes = parseInt(match[4].replace(/\./g, ''));
		this.enviado = match[5];
		this.recibido = match[6];
	}


	formatoPRTG() {
		return [
			{
				"Channel": this.nombre,
				"Value": this.estado === 'ok' ? '1' : '2',
				"Unit": "Custom",
				"ValueLookup": 'prtg.standardlookups.yesno.stateyesok'
			},
			{
				"Channel": 'Mensajes ' + this.nombre,
				"Value": this.mensajes,
				"Unit": "Count",
			},
			{
				"Channel": 'Bytes ' + this.nombre,
				"Value": this.mensajes,
				"Unit": "BytesDisk",
			},
		]
	}
	
}

module.exports = RespuestaCanal;