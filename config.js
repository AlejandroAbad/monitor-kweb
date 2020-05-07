'use strict';
let C = {};

const verificarDestinosKweb = (config) => {
	if (!config.destinos) {
		console.error("No se ha definido el nodo de destinos KWEB (destinos)");
		process.exit(1);
	}

	for (let destinoKweb in config.destinos) {
		if (!verificarDestinoKweb(config.destinos[destinoKweb])) {
			console.error("El destino KWEB definido como [" + destinoKweb + "] es inválido");
			console.error(config.destinos[destinoKweb]);
			process.exit(1);
		}

	}
};

const verificarDestinoKweb = (kweb) => {
	return (kweb.urlBase && kweb.usuario && kweb.password && kweb.tipo);
};

const verificarHttp = (config) => {
	if (!config.http) {
		console.error("No se ha definido el nodo HTTP (http)");
		process.exit(1);
	}
	if (!config.http.puerto) {
		console.error("No se ha definido el puerto para HTTP (http.puerto)");
		process.exit(1);
	}
};


const _verificadorConfiguracion = {
	verificarDestinosKweb,
	verificarDestinoKweb,
	verificarHttp
};


const FICHERO_CONFIGURACION = process.env.CONFIG_FILE || 'config.json';
try {
	C = require(FICHERO_CONFIGURACION);

	// Verificando la configuración mínima.
	// Los siguientes métodos detienen la ejecución en caso de fallo

	_verificadorConfiguracion.verificarDestinosKweb(C);
	_verificadorConfiguracion.verificarHttp(C);

} catch (excepcion) {
	console.error("**** NO SE ENCUENTRA EL FICHERO DE CONFIGURACIÓN O NO ES VÁLIDO");
	console.error(excepcion);
	process.exit(1);
}



C.destino = (nombreDestino) => {
	if (nombreDestino && C.destinos[nombreDestino]) {
		return C.destinos[nombreDestino];
	}
	return null;
}


module.exports = C;
