'use strict';
//const C = global.config;
//const L = global.logger;

class RespuestaProceso {

	constructor(tareasTotal, tareasError) {
		this.tareasTotal = tareasTotal;
		this.tareasError = tareasError;
	}


	formatoPRTG() {
		return [
			{
				"Channel": 'Tareas',
				"Value": this.tareasTotal,
				"Unit": "Count",
			},
			{
				"Channel": 'Tareas error',
				"Value": this.tareasError,
				"Unit": "Count",
				"LimitMode": 1,
				"LimitMaxError": 1
			}
		]
	}
	
}

module.exports = RespuestaProceso;