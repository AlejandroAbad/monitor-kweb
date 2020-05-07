'use strict';
//const C = global.config;
//const L = global.logger;
//const K = global.constants;

// Externos
const dateFormat = require('dateformat');



dateFormat.masks.shortDate = 'yyyymmdd';
dateFormat.masks.shortTime = 'HHMMss.l';


/**
 * Date.prototype.toShortDate
 * Devuelve una representación del objeto Date en formato corto (yyyymmdd).
 * 
 * Date() -> 'yyyymmdd'
 */
if (!Date.toShortDate) {
	Date.toShortDate = (date) => {
		if (!date || !date instanceof Date || isNaN(date)) date = new Date();
		return dateFormat(date, "shortDate")
	}
}


/**
 * Date.prototype.toShortTime
 * Devuelve una representación del objeto Date en formato corto (HHMMss.sss).
 * Date() -> 'HHMMss.sss'
 */
if (!Date.toShortTime) {
	Date.toShortTime = (date) => {
		if (!date || !date instanceof Date || isNaN(date)) date = new Date();
		return dateFormat(date, "shortTime")
	}
}

