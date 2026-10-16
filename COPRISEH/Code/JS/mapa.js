const mapa = L.map('mapa', { maxZoom: 18, minZoom: 9 }).setView([20.09, -98.76], 8);

// Limitar vista, zoom y centrado al cargar el mapa
const caja = L.latLngBounds(
    [19.59775810969162, -99.85954142989016], // Sur-Oeste
    [21.398520769746316, -97.98492891011364] // Norte-Este
);
const caja_margen = caja.pad(3.5); 
mapa.fitBounds(caja);
mapa.setMaxBounds(caja_margen);

const mapaPredeterminado = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const mapaSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
  }
);

const crearIconoMarcador = (color) => L.icon({
  iconUrl: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconosMotivo = {
  Normal: crearIconoMarcador('green'),
  Denuncia: crearIconoMarcador('orange'),
  'Alerta/Brote': crearIconoMarcador('red'),
  Emergencia: crearIconoMarcador('violet'),
  Emergencias: crearIconoMarcador('violet')
};

const estilosHoverPoligono = {
  region: {
    color: '#4D0D25',
    weight: 3,
    opacity: 1,
    fillColor: '#621132',
    fillOpacity: 0.15
  },
  municipio: {
    color: '#7A1B2E',
    weight: 1.8,
    opacity: 1,
    fillColor: '#B38E5D',
    fillOpacity: 0.18
  }
};

const estilosSeleccionPoligono = {
  region: {
    color: '#3D091D',
    weight: 3.5,
    opacity: 1,
    fillColor: '#621132',
    fillOpacity: 0.22,
    dashArray: '5 4'
  },
  municipio: {
    color: '#7A1B2E',
    weight: 2.2,
    opacity: 1,
    fillColor: '#B38E5D',
    fillOpacity: 0.24
  }
};

let poligonoSeleccionado = null;
let poligonoEnHover = null;

function configurarInteraccionPoligono(layer, grupo, tipo, alSeleccionar) {
  layer.on('mouseover', () => {
    if (poligonoEnHover && poligonoEnHover.layer !== layer) {
      if (poligonoSeleccionado?.layer === poligonoEnHover.layer) {
        poligonoEnHover.layer.setStyle(estilosSeleccionPoligono[poligonoEnHover.tipo]);
      } else {
        poligonoEnHover.grupo.resetStyle(poligonoEnHover.layer);
      }
    }

    poligonoEnHover = { layer, grupo, tipo };
    const estilo = poligonoSeleccionado?.layer === layer
      ? estilosSeleccionPoligono[tipo]
      : estilosHoverPoligono[tipo];
    layer.setStyle(estilo);
    layer.bringToFront();
  });

  layer.on('mouseout', () => {
    // Ignorar un mouseout atrasado si el cursor ya está sobre otro polígono.
    if (poligonoEnHover?.layer !== layer) return;

    poligonoEnHover = null;
    if (poligonoSeleccionado?.layer === layer) {
      layer.setStyle(estilosSeleccionPoligono[tipo]);
    } else {
      grupo.resetStyle(layer);
    }
  });

  layer.on('click', () => {
    if (poligonoSeleccionado && poligonoSeleccionado.layer !== layer) {
      poligonoSeleccionado.grupo.resetStyle(poligonoSeleccionado.layer);
    }

    poligonoSeleccionado = { layer, grupo, tipo };
    layer.setStyle(estilosSeleccionPoligono[tipo]);
    layer.bringToFront();
    alSeleccionar();
  });
}

function limpiarSeleccionPoligono() {
  if (!poligonoSeleccionado) return;
  poligonoSeleccionado.grupo.resetStyle(poligonoSeleccionado.layer);
  poligonoSeleccionado = null;
}

const capaRegiones = L.geoJSON(null, {
  style: {
    color: '#621132',
    weight: 2,
    opacity: 0.85,
    fillColor: '#621132',
    fillOpacity: 0.03,
    dashArray: '5 4'
  },
  onEachFeature: (feature, layer) => {
    const nombre = feature.properties?.['Región'];
    if (nombre) {
      layer.bindTooltip(nombre);
      configurarInteraccionPoligono(layer, capaRegiones, 'region', () => {
        aplicarFiltroEspacial('region', nombre);
      });
    }
  }
});

const capaMunicipios = L.geoJSON(null, {
  style: {
    color: '#B38E5D',
    weight: 0.8,
    opacity: 0.8,
    fillColor: '#B38E5D',
    fillOpacity: 0.05
  },
  onEachFeature: (feature, layer) => {
    const nombre = feature.properties?.Municipio;
    if (nombre) {
      layer.bindTooltip(nombre);
      configurarInteraccionPoligono(layer, capaMunicipios, 'municipio', () => {
        aplicarFiltroEspacial('municipio', nombre);
      });
    }
  }
});

// Capa agrupada donde se dibujan las muestras que pasan los filtros
const capaMarcadores = L.markerClusterGroup().addTo(mapa);

const controlLeyendaMarcadores = L.control({ position: 'bottomleft' });
controlLeyendaMarcadores.onAdd = () => {
  const contenedor = L.DomUtil.create('div', 'leaflet-control leyenda-marcadores');
  contenedor.hidden = true;
  contenedor.setAttribute('role', 'group');
  contenedor.setAttribute('aria-label', 'Leyenda de motivos de muestra');

  const encabezado = L.DomUtil.create('button', 'layers-head', contenedor);
  encabezado.type = 'button';
  encabezado.setAttribute('aria-expanded', 'true');
  encabezado.setAttribute('aria-controls', 'leyendaMarcadoresBody');
  encabezado.innerHTML = 'Motivo de la muestra <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const cuerpo = L.DomUtil.create('div', 'layers-body leyenda-marcadores-body', contenedor);
  cuerpo.id = 'leyendaMarcadoresBody';
  L.DomEvent.disableClickPropagation(contenedor);
  return contenedor;
};
controlLeyendaMarcadores.addTo(mapa);

// API compartida con funciones_extras.js para mantener explícitas las dependencias del mapa.
window.MapaCOPRISEH = {
  mapa,
  capaMarcadores,
  iconosMotivo,
  controlLeyendaMarcadores,
  limpiarSeleccionPoligono
};

// IconLayers cambia únicamente el mapa base; las capas geográficas se controlan abajo.
const controlCapas = L.control.iconLayers([
  { title: 'Predeterminado', layer: mapaPredeterminado, icon: 'Img/mapa-base-predeterminado.svg' },
  { title: 'Satélite', layer: mapaSatelite, icon: 'Img/mapa-base-satelite.svg' }
], { position: 'bottomright', maxLayersInRow: 2 }).addTo(mapa);

document.getElementById('iconLayersMount').appendChild(controlCapas.getContainer());

function mantenerOrdenCapasBase() {
  const fila = controlCapas.getContainer().querySelector('.leaflet-iconLayers-layersRow');
  if (!fila) return;

  const celdas = new Map([...fila.children].map(celda => [celda.dataset.layerid, celda]));
  [mapaPredeterminado, mapaSatelite].forEach(capa => {
    const celda = celdas.get(String(L.stamp(capa)));
    if (celda) fila.appendChild(celda);
  });
}

mantenerOrdenCapasBase();
controlCapas.on('activelayerchange', mantenerOrdenCapasBase);

const controlesCapas = [
  ['layerRegiones', capaRegiones],
  ['layerMunicipios', capaMunicipios]
];

controlesCapas.forEach(([id, capa]) => {
  const control = document.getElementById(id);
  control.addEventListener('change', evento => {
    if (evento.target.checked) capa.addTo(mapa);
    else {
      if (poligonoSeleccionado?.grupo === capa) limpiarSeleccionPoligono();
      mapa.removeLayer(capa);
    }
  });

  if (control.checked) capa.addTo(mapa);
});

function cargarCapaGeoJSON(ruta, capa) {
  fetch(ruta)
    .then(respuesta => {
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      return respuesta.json();
    })
    .then(datos => capa.addData(datos))
    .catch(error => console.error(`No se pudo cargar ${ruta}:`, error));
}

cargarCapaGeoJSON('Outputs/Layers/Region.geojson', capaRegiones);
cargarCapaGeoJSON('Outputs/Layers/Municipios.geojson', capaMunicipios);


