// let vector = datos.map(i => i.antecedentes)[3].split("/")

function construir_popup(data, vector) {
  let html = '<table class="infobox">';

  html += `<tr><th colspan="2" class="cabecera">Nombre científico: ${data.nombre_cientifico}</th></tr>`;

  html += `<tr><td colspan="2" class="imagen">
    <img src="${data.url_imagen}">
    ${data.nombre_comun ? `<div class="autor">Nombre común: ${data.nombre_comun}</div>` : ''}
  </td></tr>`;

  html += `<tr><td>Autor</td><td> Pendiente </td></tr>`;
  html += `<tr><td>Fecha</td><td> Pendiente </td></tr>`;
  html += `<tr><td colspan="2" style="text-align:center;font-size:11px;"> © Todos los derechos reservados </td></tr>`;

  html += `<tr><th colspan="2" class="seccion">Taxonomía</th></tr>`;

  vector.forEach(item => {
    const partes = item.split(':');
    const clave = partes[0].trim();
    const valor = partes.slice(1).join(':').trim();  // join por si el valor tiene ":"
    html += `<tr><td>${clave}</td><td>${valor}</td></tr>`;
  });

  html += `<tr><th colspan="2" class="seccion">Ubicación</th></tr>`;
  html += `<tr><td colspan="2" style="text-align:center;font-size:11px;"> ${data.sitio} </td></tr>`;

  html += `<tr><td colspan="2" class="link"><a href="${data.url}" target="_blank"> Ver más en iNaturalist </a></td></tr>`;
  html += '</table>';

  return html;
}

// // Uso en Leaflet:
// const popupContent = `<div class="contenedor_popup">${construirPopup(data, vector)}</div>`;
// marker.bindPopup(popupContent);