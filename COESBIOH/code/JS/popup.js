// let vector = datos.map(i => i.antecedentes)[3].split("/")

function construir_popup(data, vector) {
  let html = '<table class="infobox">';

  html += `<tr><th colspan="2" class="cabecera">Nombre científico: ${data.nombre_cientifico}</th></tr>`;

  html += `<tr><td colspan="2" class="imagen">
    ${
      data.url_imagen
        ? `<img src="${data.url_imagen}">`
        : `<div class="sin-imagen">Imagen no disponible</div>`
    }
    ${data.nombre_comun ? `<div class="autor">Nombre común: ${data.nombre_comun}</div>` : ""}
  </td></tr>`;

  html += data.fotografia ? `<tr><td>Fotografia:</td><td> Pendiente </td></tr>` : "";
  html += data.fecha ? `<tr><td>Fecha</td><td> ${data.fecha} </td></tr>` : "";
  html += data.fotografia ? `<tr><td colspan="2" style="text-align:center;font-size:11px;"> © Todos los derechos reservados </td></tr>` : "";

  html += `<tr><th colspan="2" class="seccion">Taxonomía</th></tr>`;

  vector.forEach(item => {
    const partes = item.split(':');
    const clave = partes[0].trim();
    const valor = partes.slice(1).join(':').trim();  // join por si el valor tiene ":"
    html += `<tr><td>${clave}</td><td>${valor}</td></tr>`;
  });

  html += (data.endemicas || data.NOM_059) ? `<tr><th colspan="2" class="seccion">Especie en riesgo</th></tr>` : "";
  html += data.endemicas ? `<tr><td colspan="2" style="text-align:center;font-size:11px;">${data.endemicas == 1 ? "Endémica: Si" : "No"}</td></tr>` : ``;
  html += data.NOM_059 ? `<tr><td colspan="2" style="text-align:center;font-size:11px;">NOM-059: ${data.NOM_059}</td></tr>` : ``;


  html += data.sitio ? `<tr><th colspan="2" class="seccion">Ubicación</th></tr>` : "";
  html += data.sitio ? `<tr><td colspan="2" style="text-align:center;font-size:11px;">${data.sitio}</td></tr>` : ``;

  html += data.url ? `<tr><td colspan="2" class="link"><a href="${data.url}" target="_blank"> Ver más en iNaturalist </a></td></tr>` : ``;
  html += '</table>';

  return html;
}

// // Uso en Leaflet:
// const popupContent = `<div class="contenedor_popup">${construirPopup(data, vector)}</div>`;
// marker.bindPopup(popupContent);