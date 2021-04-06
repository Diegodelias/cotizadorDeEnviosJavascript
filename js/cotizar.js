function Envio(origenlat, origenlon, destinolat, destinolon, pesoMax, valor) {
	this.origenlat = origenlat;
	this.origenlon = origenlon;
	this.destinolat = destinolat;
	this.destinolon = destinolon;
	this.pesoMax = pesoMax;
	this.valor = valor;
}

function UI() {}

Envio.prototype.cotizarEnvio = function() {
	//apartir de atributos

	let distancia = parseInt(
		distanciaEntreProvincias(this.origenlat, this.origenlon, this.destinolat, this.destinolon)
	);

	let cantidad;
	const base = 500;
	const pesomax = this.pesoMax;

	switch (true) {
		case distancia < 50:
			cantidad = base;

			break;
		case distancia > 50 && distancia < 350:
			cantidad = base + base * 0.25; /**25% */

			break;
		case distancia > 350 && distancia < 800:
			cantidad = base + base * 0.3; /**30% */

			break;

		case distancia > 800:
			cantidad = base + base * 0.4; /**40% */

			break;
		default:
			cantidad = base;
	}

	switch (true) {
		case pesomax <= 1:
			cantidad = cantidad;

			break;
		case pesomax > 1 && pesomax <= 5:
			cantidad = cantidad + cantidad * 0.1; /**10% */

			break;
		case pesomax > 5 && pesomax <= 10:
			cantidad = cantidad + cantidad * 0.2; /**20% */

			break;

		case pesomax > 10 && pesomax <= 15:
			cantidad = cantidad + cantidad * 0.3; /**30% */

			break;

		case pesomax > 15 && pesomax <= 20:
			cantidad = cantidad + cantidad * 0.4; /**40% */

			break;

		case distancia > 20 && pesomax <= 25:
			cantidad = cantidad + cantidad * 0.5; /**50% */

			break;
		default:
			cantidad = base;
	}
	console.log('peso max' + pesomax);
	console.log('distancia' + distancia);
	console.log('cantidad' + cantidad);
	return cantidad;

};

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
};
UI.prototype.llenarOpcionesOrigen = () => {
	const origen = document.querySelector('#origen');
	let respuesta;
	const provincias = fetch('./provincias.json', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	})
		.then(function(response) {
			return response.json();
		})
		.then(function(myJson) {
			for (const [ indice, provincia ] of myJson.provincias.entries()) {
				let option = document.createElement('option');
				option.value = indice + 1;
				option.textContent = provincia.nombre;
				option.setAttribute('latitud', provincia.centroide.lat);
				option.setAttribute('longitud', provincia.centroide.lon);
				origen.appendChild(option);
			}

			respuesta = myJson;
		});
};

UI.prototype.llenarOpcionesDestino = () => {
	const destino = document.querySelector('#destino');
	let respuesta;
	const provincias = fetch('./provincias.json', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	})
		.then(function(response) {
			return response.json();
		})
		.then(function(myJson) {
			for (const [ indice, provincia ] of myJson.provincias.entries()) {
				let option = document.createElement('option');
				option.value = indice + 1;
				option.textContent = provincia.nombre;
        option.setAttribute('latitud', provincia.centroide.lat);
				option.setAttribute('longitud', provincia.centroide.lon);
				destino.appendChild(option);
			}

			respuesta = myJson;
		});
};
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
	const div = document.createElement('div');
	if (tipo === 'error') {
		div.classList.add('mensaje', 'error');
	} else {
		div.classList.add('mensaje', 'correcto');
	}

	div.classList.add('mensaje', 'mt-10');

	div.textContent = mensaje;

	const contenedor = document.querySelector('#cotizar-envio');
	contenedor.insertBefore(div, document.querySelector('#resultado'));

	setTimeout(() => {
		div.remove();
	}, 3000);
};

UI.prototype.mostrarResultado = (total, envio) => {
	const div = document.createElement('div');
	const { pesoMax } = envio;
	div.classList.add('mt-10');

	div.innerHTML = `
  <p class="header">A pagar </p>

  <p class="font-bold"> Total a pagar:  <span class="font-normal"> ${total}  pesos</span>  </p>

  `;

	const resultadoDiv = document.querySelector('#resultado');

	const spinner = document.querySelector('#cargando');
	spinner.style.display = 'block';

	setTimeout(() => {
		spinner.style.display = 'none';
		resultadoDiv.appendChild(div);
	}, 3000);
};

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
	ui.llenarOpcionesOrigen(); //llena select con trpovincias
	ui.llenarOpcionesDestino();
	detectarCheckbox();
});

eventListeners();
function eventListeners() {
	const contenedor = document.querySelector('#cotizar-envio');
	contenedor.addEventListener('submit', cotizarEnvio);
}

function cotizarEnvio(e) {
	e.preventDefault();

	const origen = document.querySelector('#origen').value;
	const destino = document.querySelector('#destino').value;
	console.log(origen);

 
	const origenlat = document.getElementsByTagName('option')[parseInt(origen)].getAttribute('latitud');
	const origenlon = document.getElementsByTagName('option')[parseInt(origen)].getAttribute('longitud');
	const destinolat = document.getElementsByTagName('option')[parseInt(destino)].getAttribute('latitud');
	const destinolon = document.getElementsByTagName('option')[parseInt(destino) ].getAttribute('longitud');
	console.log(origenlat);

	console.log(origenlon);

	console.log(destinolat);

	console.log(destinolon);



	const peso = document.querySelector('#peso').value;
	const tipo = document.querySelector('input[name="tipo"]:checked').value;
	const mercancia = document.querySelector('#mercancia').value;

	console.log('pesooo' + peso);

	if (tipo === 'no' ) {
		if (origen <= 0 || destino <= 0 || peso === '' || tipo === '' ) {
			ui.mostrarMensaje('todos los campos son obligatorios', 'error');
			return;
		} else {

      
    }
	}

	if (tipo === 'si'   ) {
		if (origen <= 0 ||origen <= 0|| peso === '' || tipo === '' || mercancia === '' ) {
			ui.mostrarMensaje('todos los campos son obligatorios', 'error');
			return;
		}
	}

	ui.mostrarMensaje('cotizando...', 'exito');

	//ocultar cotizaciones previas

	const resultados = document.querySelector('#resultado div');

	if (resultados != null) {
		resultados.remove();
	}

	const envio = new Envio(
		parseFloat(origenlat),
		parseFloat(origenlon),
		parseFloat(destinolat),
		parseFloat(destinolon),
		parseInt(peso),
		mercancia
	);

	const total = envio.cotizarEnvio();

	ui.mostrarResultado(total, envio);
}

function distanciaEntreProvincias(lat1, lon1, lat2, lon2) {
	//capturar latitud y id de atributo del option en el html
	//dejar solo numero entero
	var lat2 = parseInt(lat2);
	var lon2 = parseInt(lon2);

	//la pampa
	var lat1 = parseInt(lat1);
	var lon1 = parseInt(lon1);

	var R = 6371; // km
	//has a problem with the .toRad() method below.
	var x1 = lat2 - lat1;
	var dLat = x1.toRad();
	var x2 = lon2 - lon1;
	var dLon = x2.toRad();
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;

	return d;
}

function detectarCheckbox() {
	const valorMercancia = document.querySelector('#valorMercancia');
	valorMercancia.classList.add('hidden');
	let radios = document.querySelectorAll('input[type=radio][name="tipo"]');
	radios.forEach((radio) =>
		radio.addEventListener('change', () => {
			console.log(radio.value);

			if (radio.value === 'si') {
				valorMercancia.classList.remove('hidden');
				valorMercancia.classList.add('mostrar');
			}

			if (radio.value === 'no') {
				valorMercancia.classList.remove('mostrat');
				valorMercancia.classList.add('hidden');
			}
		})
	);
}
