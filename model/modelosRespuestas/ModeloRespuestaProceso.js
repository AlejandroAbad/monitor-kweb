'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaProceso {

	/**
	 * Group 1.		estado		ok	
	 * Group 2.		cantidad	1
	 * Group 3.		nombre		HOST2WMW-plc_co
	 * Group 4.		minimo 		1
	 * Group 5.		maximo		1
	 * @param {*} match 
	 */
	constructor(match) {
		this.estado = match[1];
		this.cantidad = parseInt(match[2].replace(/\./g, ''));
		this.nombre = match[3];
		this.minimo = parseInt(match[4].replace(/\./g, ''));
		this.maximo = parseInt(match[5].replace(/\./g, ''));
	}


	formatoPRTG() {
		return [
			{
				"Channel": this.nombre,
				"Value": this.estado === 'ok' ? '1' : '0',
				"Unit": "Custom",
				"ValueLookup": 'prtg.standardlookups.yesno.stateyesok'
			}
		]
	}
	
}

module.exports = RespuestaProceso;