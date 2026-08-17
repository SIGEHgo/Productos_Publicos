var map = L.map('map').setView([20.47875, -98.88702], 9);
map.createPane('heatmapPane');
map.createPane('otrasCapas');
map.getPane('heatmapPane').style.zIndex = 500;
map.getPane('heatmapPane').style.pointerEvents = 'none';

map.getPane('otrasCapas').style.zIndex = 400;
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

hidalgo = L.geoJSON(hidalgo, {
  style: {
      color: 'gray',
      opacity: 0.5,
      weight: 1,
      fillColor: 'gray',
      fillOpacity: 0.1
  }
});

hidalgo.addTo(map);


let legend = L.control({position: 'bottomright'});


legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info_tablero_seg legend legend_seguridad"),
        colors = ["blue", "cyan", "lime", "yellow", "red"];

    // Crear el gradiente
    var gradient = "linear-gradient(to right, " + colors.join(", ") + ")";
    // Estilos adicionales para el contenedor de la leyenda
    div.style.backgroundColor = "rgb(255, 255, 255)"; // gris claro
    div.style.padding = "10px";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
    div.style.fontSize = "13px";

    // Agregar el contenido con el gradiente y etiquetas alineadas
    div.innerHTML =
        '<strong>Simbología</strong><br>' +
        '<div style="width: 10vw; height: 10px; background: ' + gradient + '; margin-bottom: 4px;"></div>' +
        '<div style="display: flex; justify-content: space-between; font-size: 12px;">' +
        '<span>Baja</span><span>Alta</span>' +
        '</div>';

    return div;
};


// Control de información arriba derecha
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
}

info.update = function () {
  let contenido = "";
  

  if (seleccion.riesgo_reino && seleccion.riesgo_reino !== "Todos" && sidebar_seleccion !== "mapa" && sidebar_seleccion !== "busqueda") {
    contenido += "<h5 style='justify-self: center;'>Especies en riesgo</h5><h6>Reino: <b>" + seleccion.riesgo_reino + "</b></h6>";
  }
  if (seleccion.riesgo_orden && seleccion.riesgo_orden !== "Todos" && sidebar_seleccion !== "mapa" && sidebar_seleccion !== "busqueda") {
    contenido += "<h6>Orden: <b>" + seleccion.riesgo_orden + "</b></h6>";
  }
  if (seleccion.riesgo_familia && seleccion.riesgo_familia !== "Todos" && sidebar_seleccion !== "mapa" && sidebar_seleccion !== "busqueda") { 
    contenido += "<h6>Familia: <b>" + seleccion.riesgo_familia + "</b></h6>";
  }
  if (seleccion.riesgo_nombre && seleccion.riesgo_nombre !== "Todos" && sidebar_seleccion !== "mapa" && sidebar_seleccion !== "busqueda") {
    contenido += "<h6>Nombre científico: <b>" + seleccion.riesgo_nombre + "</b></h6>";
  }



  

  if (seleccion.reino && seleccion.reino !== "Todos") {
    contenido += "<h5 style='justify-self: center;'>Avistamientos</h5><h6>Reino: <b>" + seleccion.reino + "</b></h6>";
  }
  if (seleccion.orden && seleccion.orden !== "Todos") {
    contenido += "<h6>Orden: <b>" + seleccion.orden + "</b></h6>";
  }
  if (seleccion.familia && seleccion.familia !== "Todos") {
    contenido += "<h6>Familia: <b>" + seleccion.familia + "</b></h6>";
  }
  if (seleccion.nombre && seleccion.nombre !== "Todos") {
    contenido += "<h6>Nombre científico: <b>" + seleccion.nombre + "</b></h6>";
  }

  if (!contenido) {
    if (seleccion.busqueda !== null) {
      if (busqueda_lista.some((item) => item.nombre_comun === seleccion.busqueda)) {
        const TaxonomiaBusqueda = busqueda_lista.find((x) => x.nombre_comun == seleccion.busqueda,);
        //console.log(TaxonomiaBusqueda);
        contenido = "<h5 style='justify-self: center;'>Avistamientos</h5><h6><i>Busqueda: <b>" + seleccion.busqueda + "</b></i></h6>";
        if (TaxonomiaBusqueda)
          contenido += `<h6>Reino: <b>${TaxonomiaBusqueda.reino}</b></h6>
            <h6>Orden: <b>${TaxonomiaBusqueda.orden}</b></h6>
            <h6>Familia: <b>${TaxonomiaBusqueda.familia}</b></h6>
            <h6>Nombre científico: <b>${TaxonomiaBusqueda.nombre_cientifico}</b></h6>`;
      } else{
        contenido = "<h5 style='justify-self: center;'>Avistamientos</h5><h6><i>Busqueda: <b>" + seleccion.busqueda + "</b></i></h6>" +
        "<h6>Reino: <b>" + (busqueda_general.reino_length > 3 ? busqueda_general.reino_length : busqueda_general.reino.join(', ')) + "</b></h6>" +
        "<h6>Orden: <b>" + (busqueda_general.orden_length > 3 ? busqueda_general.orden_length : busqueda_general.orden.join(', ')) + "</b></h6>" +
        "<h6>Familia: <b>" + (busqueda_general.familia_length > 3 ? busqueda_general.familia_length : busqueda_general.familia.join(', ')) + "</b></h6>" +
        "<h6>Nombre científico: <b>" + (busqueda_general.nombre_length > 3 ? busqueda_general.nombre_length : busqueda_general.nombre.join(', ')) + "</b></h6>";
      }
    } else {
        contenido =
          `<h5 style='justify-self: center;'>${
            document.querySelectorAll(".sidebar-link.active")[0].dataset
              .seccion == "riesgo"
              ? "Especies en riesgo"
              : "Avistamientos"
          }</h5>` + "<h6><i>Todos los reinos</i></h6>";
      }
  }

    

  contenido +=
    "<h6>Observaciones en visualización: <b>" +
    FeaturesVisibles((datos_filtrados = datos_filtrados)) +
    "</b></h6>";

  this._div.innerHTML = contenido;
};

info.addTo(map);

function FeaturesVisibles(datos_filtrados) {
    if (!datos_filtrados) return 0;

    const bounds = map.getBounds();
    
    datos_visibles = datos_filtrados.filter((i) => {
        const lat = i.latitude
        const lng = i.longitude

    return bounds.contains([lat, lng]);
  });

  return datos_visibles.length; 

}

map.on("zoomend dragend", function() { info.update(); });

// Limitar vista, zoom y centrado al cargar el mapa
const caja = hidalgo.getBounds();
const caja_margen = caja.pad(3.5); 
map.fitBounds(caja);
map.setMaxBounds(caja_margen);
map.setMinZoom(9);





map.on('zoomend', function () {
    if (nivel_activo() === "orden") {
        renderizar_segun_zoom("orden");
    }
});

actualizar_mapa(datos = taxonomia);





