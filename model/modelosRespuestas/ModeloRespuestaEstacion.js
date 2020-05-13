'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaTablespaces {

	/**
	 * Group 1.		ESTADO 			ok	
	 * Group 2.		NOMBRE			M01
	 * Group 3.		ESTADO2			OK
	 * Group 4.		DESACTIVADA		No
	 * @param {*} match 
	 */
	constructor(match) {
		this.estado = match[1];
		this.nombre = match[2];
		this.estado2 = match[3];
		this.desactivada = match[4] !== 'Nein';
	}


	formatoPRTG() {
		return [
			{
				"Channel": this.nombre,
				"Value": this.estado === 'ok' ? '1' : '2',
				"Unit": "Custom",
				"ValueLookup": 'prtg.standardlookups.yesno.stateyesok'
			}
		]
	}
	
}

module.exports = RespuestaTablespaces;