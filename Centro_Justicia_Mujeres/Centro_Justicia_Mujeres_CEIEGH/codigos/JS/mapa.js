var map = L.map('map').setView([20.09004, -98.7679], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.simpleMapScreenshoter().addTo(map);

// Leyenda de colores y pintar el mapa
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  const div = L.DomUtil.create(
    "div",
    "info_tablero_seg legend legend_seguridad"
  );
  colors = ["#fadd9e", "#f9a279", "#ee7370", "#e14e71", "#da3778", "#b6257a", "#7a1d6e"];
  //colors = colors.reverse();

  // Create the gradient background
  const gradient = "linear-gradient(to right, " + colors.join(", ") + ")";

  // Add title and gradient
  div.innerHTML =
    "<strong>" +
    "Atención a mujeres" +
    "</strong><br>" +
    '<div style="height: 10px; background: ' +
    gradient +
    ';"></div>';


  div.innerHTML +=
    '<div style="display: flex; justify-content: space-between;">' +
    '<span>Baja</span>' +
    '<span>Alta</span>' +
    "</div>";


  div.style.backgroundColor = "rgb(255, 255, 255)"; // gris claro
  div.style.padding = "10px";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
  div.style.fontSize = "13px";
  return div;
};

legend.addTo(map);


// Control de información arriba derecha
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
}

info.update = function (props) {
    this._div.innerHTML = '<h6>' +"Municipio: " + "<b>"+ (document.getElementById("selector_municipio").value.replace(/_/g, " "))  +"</b>"+ '</h6>' +  
    '<h6>' +"Año: " + "<b>"+ (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio)  +"</b>"+ '</h6>' +  
    '<h6>' + "Tipo de violencia: " + "<b>" + (columna_seleccionada().violencia === "" ? "Todas" : columna_seleccionada().violencia.replace("Violencia ", ""))  + "</b></h6>" +
    '<h6>' + "Tipo de modalidad: " + "<b>" + (columna_seleccionada().modalidad === "" ? "Todas" : columna_seleccionada().modalidad.replace("Modalidad ", "")) + "</b></h6>" +
    '<h6>' + "Usuarias: " + "<b>" + (cuentas_para_popup().total_modalidad_tipo).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "</b></h6>" +
    (props ?
       "Colonia: " +  '<b>' + props.Localidad_correcion + '</b><br />' 
        //"<p style='font-size: xx-small'>Clic en la localidad para más información.</p>"  + "Valor: " + props[columna_seleccionada()]
        : "Selecciona una colonia");
}

info.addTo(map);





// Obtener valores máximo y mínimo de la columna seleccionada
let minMaxGlobal = null;

function pintar_por_columna(feature) {
  let columna = columna_seleccionada().columna;

  if (!minMaxGlobal) {
    minMaxGlobal = valores_maximo_minimo_columna(columna);
  }

  let valor = feature.properties[columna];

  if (valor === null || valor === undefined) {
    return {
      fillColor: "#ccc",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  let porcentaje = (valor - minMaxGlobal.min) / (minMaxGlobal.max - minMaxGlobal.min) || null;

  return {
    fillColor: getColor(porcentaje),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: '3',
    fillOpacity: 0.7,
  };
}




datos_capa = L.geoJSON(datos, {
    style: pintar_por_columna,
    onEachFeature: onEachFeature
});
datos_capa.addTo(map);



// Popup
function actualizarMapa() {
  minMaxGlobal = null;           
  datos_capa.setStyle(pintar_por_columna);
  info.update();

  document.getElementById("periodo_texto_front").textContent = "Año: " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
  document.getElementById("periodo_texto_back").textContent = "Municipio: " + cuentas_para_popup().total_anio.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " usuarias";

  document.getElementById("violencia_texto_front").textContent = "Tipo de violencia: " + (columna_seleccionada().violencia == "" ? "Todas" : columna_seleccionada().violencia.replace("Violencia ", ""));
  document.getElementById("violencia_texto_back").textContent = (columna_seleccionada().violencia == "" ? "Violencia Todas" : columna_seleccionada().violencia) + ": " + (cuentas_para_popup().total_violencia == 0 ? cuentas_para_popup().total_anio.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : cuentas_para_popup().total_violencia).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " usuarias";
  
  document.getElementById("modalidad_texto_front").textContent = "Tipo de modalidad: " + (columna_seleccionada().modalidad == "" ? "Todas" : columna_seleccionada().modalidad.replace("Modalidad ", ""));
  document.getElementById("modalidad_texto_back").textContent = (columna_seleccionada().modalidad == "" ? "Modalidad Todas" : columna_seleccionada().modalidad) + ": " + (cuentas_para_popup().total_modalidad == 0 ? cuentas_para_popup().total_anio.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : cuentas_para_popup().total_modalidad).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " usuarias";
}

let colonia_buscada = "";

function actualizar_municipio() {
  datos = opciones[document.getElementById("selector_municipio").value];
  map.removeLayer(datos_capa);

  datos_capa = L.geoJSON(datos, {
    style: pintar_por_columna,
    onEachFeature: onEachFeature,
  });
  datos_capa.addTo(map);
  
  actualizarMapa();
  actualizar_grafica();

  const caja = datos_capa.getBounds();
  const caja_margen = caja.pad(3.5); 
  map.fitBounds(caja);
  map.setMaxBounds(caja_margen);

  // Buscador de colonias
  let colonias_lista = datos.features.map((feature) => feature.properties.Localidad_correcion).sort();
  const listaElement = document.getElementById("lista");
  listaElement.innerHTML = ""; // Limpiar las opciones anteriores
  colonias_lista.forEach((colonia) => {
    const option = document.createElement("option");
    option.value = colonia;
    listaElement.appendChild(option);
  });
  colonia_buscada = "";
  document.getElementById("buscador").value = "";
  document.getElementById("boton_descargar_reporte").style.display = "none"; // Ocultar el botón de descarga al cambiar de municipio
}



document.getElementById("selector_municipio").addEventListener("change", actualizar_municipio);
document.getElementById("selector_anio").addEventListener("change", actualizarMapa);
document.getElementById("selector_violencia").addEventListener("change", actualizarMapa);
document.getElementById("selector_modalidad").addEventListener("change", actualizarMapa);


function actualizar_grafica() {

  let interes = datos.features.some(feature => 
    feature.properties.Localidad_correcion === colonia_buscada
  );

  if (interes) {
    actualizador_anio_grafica.data.datasets[0].data = anio_datos_colonia_grafico(colonia_buscada).map(d => d.v);
    actualizador_anio_grafica.data.labels = anio_datos_colonia_grafico(colonia_buscada).map(d => d.l);
    actualizador_anio_grafica.options.plugins.title.text = "Usuarias atendidas por año";
    actualizador_anio_grafica.options.plugins.subtitle.text = " Colonia: " + colonia_buscada + ", " + document.getElementById("selector_municipio").value.replace(/_/g, " ") + " · " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
    actualizador_anio_grafica.update();

    actualizador_violencia_grafica.data.datasets[0].data = violencia_datos_colonia_grafico(colonia_buscada).map(d => d.v);
    actualizador_violencia_grafica.data.labels = violencia_datos_colonia_grafico(colonia_buscada).map(d => d.l);
    actualizador_violencia_grafica.options.plugins.title.text = "Tipos de violencia registrados";
    actualizador_violencia_grafica.options.plugins.subtitle.text = " Colonia: " + colonia_buscada + ", " + document.getElementById("selector_municipio").value.replace(/_/g, " ") + " · " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
    actualizador_violencia_grafica.update();

    actualizador_modalidad_grafica.data.datasets[0].data = modalidad_datos_colonia_grafico(colonia_buscada).map(d => d.v);
    actualizador_modalidad_grafica.data.labels = modalidad_datos_colonia_grafico(colonia_buscada).map(d => d.l);
    actualizador_modalidad_grafica.options.plugins.title.text = "Modalidades registradas";
    actualizador_modalidad_grafica.options.plugins.subtitle.text = " Colonia: " + colonia_buscada + ", " + document.getElementById("selector_municipio").value.replace(/_/g, " ") +  " · " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
    actualizador_modalidad_grafica.update();
  }else {
    actualizador_anio_grafica.data.datasets[0].data = anio_datos_grafico().map(d => d.v);
    actualizador_anio_grafica.data.labels = anio_datos_grafico().map(d => d.l);
    actualizador_anio_grafica.options.plugins.title.text = columna_seleccionada().anio == "General" ? "Usuarias atendidas por año" : "Mujeres usuarias por colonia ";
    actualizador_anio_grafica.options.plugins.subtitle.text = document.getElementById("selector_municipio").value.replace(/_/g, " ")  + " · " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
    actualizador_anio_grafica.update();

    actualizador_violencia_grafica.data.datasets[0].data = existe_violencia_seleccionada().map(d => d.v);
    actualizador_violencia_grafica.data.labels = existe_violencia_seleccionada().map(d => d.l);
    actualizador_violencia_grafica.options.plugins.title.text = columna_seleccionada().violencia === "" ? "Tipos de violencia registrados" : "Violencia" + columna_seleccionada().violencia.toLowerCase().replace("violencia", "") + " por colonia";
    actualizador_violencia_grafica.options.plugins.subtitle.text = document.getElementById("selector_municipio").value.replace(/_/g, " ")  + " · " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
    actualizador_violencia_grafica.update();

    actualizador_modalidad_grafica.data.datasets[0].data = existe_modalidad_seleccionada().map(d => d.v);
    actualizador_modalidad_grafica.data.labels = existe_modalidad_seleccionada().map(d => d.l);
    actualizador_modalidad_grafica.options.plugins.title.text = columna_seleccionada().modalidad === "" ? "Modalidades registradas" : "Modalidad" + columna_seleccionada().modalidad.toLowerCase().replace("modalidad", "") + " por colonia";
    actualizador_modalidad_grafica.options.plugins.subtitle.text = document.getElementById("selector_municipio").value.replace(/_/g, " ")  + " · " + (columna_seleccionada().anio === "General" ? "2022-2025" : columna_seleccionada().anio);
    actualizador_modalidad_grafica.update();
  }
};

document.getElementById("selector_anio").addEventListener("change", actualizar_grafica);
document.getElementById("selector_violencia").addEventListener("change", actualizar_grafica);
document.getElementById("selector_modalidad").addEventListener("change", actualizar_grafica);


document.getElementById("buscador").addEventListener("change", function() {
  colonia_buscada = this.value;
  buscar_en_mapa(colonia_buscada);
  actualizar_grafica();
  datos_reporte(colonia_buscada)

  // Mostrar / ocultar botón de descarga
  let boton_download = document.getElementById("boton_descargar_reporte");
  
  let existe = datos.features.some(feature => feature.properties.Localidad_correcion === colonia_buscada);

  if (boton_download) {
    boton_download.style.display = existe ? "block" : "none";      
    boton_download.onclick = () => descargarReporteColonia(colonia_buscada);
  }
  
});

// Limitar vista, zoom y centrado al cargar el mapa
map.setMinZoom(11);















// Una de mis ideas es hacer uso del buscador de la barra lateral para actualizar las graficas del entorno de graficas como en la diapositiva
// De hecho ya estan las funciones para las grafucas que son violencia_datos_colonia_grafico(colonia), modalidad_datos_colonia_grafico(colonia) y anio_datos_colonia_grafico(colonia)
// Lo intente una vez pero fallo porque estaba teniendo problemas en la interaccion en el mapa se comenzo a trabar.
// Lo que hice fue lo siguiente 


// actualizar_graficas(

//   if (busqueda_colonia === "") {
//     actualizador_anio_grafica.data.datasets[0].data = anio_datos_grafico().map(d => d.v);
//     actualizador_anio_grafica.data.labels = anio_datos_grafico().map(d => d.l);
//     actualizador_anio_grafica.update();

//     actualizador_violencia_grafica.data.datasets[0].data = existe_violencia_seleccionada().map(d => d.v);
//     actualizador_violencia_grafica.data.labels = existe_violencia_seleccionada().map(d => d.l);
//     actualizador_violencia_grafica.update();

//     actualizador_modalidad_grafica.data.datasets[0].data = existe_modalidad_seleccionada().map(d => d.v);
//     actualizador_modalidad_grafica.data.labels = existe_modalidad_seleccionada().map(d => d.l);
//     actualizador_modalidad_grafica.update();
//   } else {
//     actualizador_anio_grafica.data.datasets[0].data = anio_datos_grafico(busqueda_colonia).map(d => d.v);
//     actualizador_anio_grafica.data.labels = anio_datos_grafico(busqueda_colonia).map(d => d.l);
//     actualizador_anio_grafica.update();

//     actualizador_violencia_grafica.data.datasets[0].data = violencia_datos_colonia_grafico(busqueda_colonia).map(d => d.v);
//     actualizador_violencia_grafica.data.labels = violencia_datos_colonia_grafico(busqueda_colonia).map(d => d.l);
//     actualizador_violencia_grafica.update();

//     actualizador_modalidad_grafica.data.datasets[0].data = modalidad_datos_colonia_grafico(busqueda_colonia).map(d => d.v);
//     actualizador_modalidad_grafica.data.labels = modalidad_datos_colonia_grafico(busqueda_colonia).map(d => d.l);
//     actualizador_modalidad_grafica.update();
//   }
// );


// document.getElementById("selector_anio").addEventListener("change", actualizar_graficas);
// document.getElementById("selector_violencia").addEventListener("change", actualizar_graficas);
// document.getElementById("selector_modalidad").addEventListener("change", actualizar_graficas);

// let busqueda_colonia;
// document.getElementById("buscador").addEventListener("change", function() {
//   let busqueda_colonia = this.value;
//   buscar_en_mapa(busqueda_colonia);
//   console.log("Busqueda de colonia para graficas:", busqueda_colonia);
//   actualizar_graficas();
// });





