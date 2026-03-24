////////////////
///// Mapa /////
///////////////

// Leyenda de colores y pintar el mapa

function getGradientColor(startColor, endColor, percent) {
    // Strip the leading # if it's there
    startColor = startColor.replace(/^\s*#|\s*$/g, '');
    endColor = endColor.replace(/^\s*#|\s*$/g, '');

    // Convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (startColor.length === 3) {
        startColor = startColor.replace(/(.)/g, '$1$1');
    }
    if (endColor.length === 3) {
        endColor = endColor.replace(/(.)/g, '$1$1');
    }

    // Get colors
    const startRed = parseInt(startColor.substring(0, 2), 16);
    const startGreen = parseInt(startColor.substring(2, 4), 16);
    const startBlue = parseInt(startColor.substring(4, 6), 16);

    const endRed = parseInt(endColor.substring(0, 2), 16);
    const endGreen = parseInt(endColor.substring(2, 4), 16);
    const endBlue = parseInt(endColor.substring(4, 6), 16);

    // Calculate new color components
    let diffRed = endRed - startRed;
    let diffGreen = endGreen - startGreen;
    let diffBlue = endBlue - startBlue;

    diffRed = Math.round((diffRed * percent) + startRed);
    diffGreen = Math.round((diffGreen * percent) + startGreen);
    diffBlue = Math.round((diffBlue * percent) + startBlue);

    let diffRedStr = diffRed.toString(16);
    let diffGreenStr = diffGreen.toString(16);
    let diffBlueStr = diffBlue.toString(16);

    // Ensure 2 digits per color component
    if (diffRedStr.length === 1) diffRedStr = '0' + diffRedStr;
    if (diffGreenStr.length === 1) diffGreenStr = '0' + diffGreenStr;
    if (diffBlueStr.length === 1) diffBlueStr = '0' + diffBlueStr;

    return '#' + diffRedStr + diffGreenStr + diffBlueStr;
}

function getColor(d) {
    return getGradientColor('#fbdd9f', '#7a1d6e', d);       // getGradientColor('#00FF00', '#FF0000', d);
}


// Pasar el mouse sobre el mapa

// function highlightFeature(e) {
//     var layer = e.target;

//     layer.setStyle({
//         weight: 5,
//         color: '#666',
//         dashArray: '',
//         fillOpacity: 0.7
//     });

//     layer.bringToFront();
//     info.update(layer.feature.properties);
// }

// function resetHighlight(e) {
//     datos_capa.resetStyle(e.target);
//     info.update();
// }

// Mejora de Claude para evitar el caso que  resalte varias capas

let capaDestacada = null;

function highlightFeature(e) {
    // 1. Resetea la capa anterior ANTES de destacar la nueva
    if (capaDestacada) {
        datos_capa.resetStyle(capaDestacada);
    }

    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);

    // 2. Guarda la referencia
    capaDestacada = layer;
}

function resetHighlight(e) {
    datos_capa.resetStyle(e.target);
    info.update();
    capaDestacada = null;
}


// Click

function descargarFicha() {

  ficha = document.getElementById("ficha")
  ficha.querySelector("img").src = "Img/Popup_entorno_descargar.png"

  setTimeout(() => {
  
html2canvas(ficha, {
    scale: 3,
    useCORS: true
  }).then(canvas => {
    const link = document.createElement("a");
    link.download =  "CJMH_" + (columna_seleccionada().anio == "General" ? "2022-2024" : columna_seleccionada().anio) + "_" + (columna_seleccionada().violencia == "" ? "Todas las violencias" : columna_seleccionada().violencia) + "_" + (columna_seleccionada().modalidad == "" ? "Todas las modalidades" : columna_seleccionada().modalidad) + "_" + colonia_seleccionada_popup + ".png";
    link.href = canvas.toDataURL();
    link.click();
  });

}, 500);

}

let colonia_seleccionada_popup = "";

function clicFeature(e) {
  var propiedades = e.target.feature.properties;
  colonia_seleccionada_popup = propiedades.Localidad_correcion;

  let cuentas = cuentas_para_popup();
  let col = columna_seleccionada().columna;


//   const popupContent = `
// <div id="ficha" class="contenedor_popup" style="width: 250px; aspect-ratio: 100 / 143; background: rgb(246, 210, 211); position: relative;">
//     <img src="Img/Popup_entorno.png" alt="" style="width: 100%; height: auto;">
//     <div class="texto_popup" style="position: absolute; top: 58%; left: 15%;">
//         <span class="resaltado">${propiedades.Localidad_correcion} - ${columna_seleccionada().anio == "General" ? "2022-2024" : columna_seleccionada().anio}</span>
//     </div>
//     <div class="texto_popup" style="position: absolute; top: 63%; left: 15%;">
//         <span class="resaltado">Colonia:</span> <strong>${propiedades[col]} usuarias (${((propiedades[col] / cuentas.total_anio) * 100 || 0).toFixed(2)}% del total municipal)</strong>
//     </div>
//     <div class="texto_popup" style="position: absolute; top: 68%; left: 15%;">
//         <span class="resaltado">Municipio:</span> <strong>${cuentas.total_anio} usuarias</strong>
//     </div>
//     <div class="texto_popup" style="position: absolute; top: 73%; left: 15%;">
//         <span class="resaltado">${columna_seleccionada().violencia == "" ? "Violencia todas" : columna_seleccionada().violencia}:</span> <strong>${cuentas.total_violencia == 0 ? `${cuentas.total_anio} usuarias en el municipio` : `${cuentas.total_violencia} usuarias en el municipio`}</strong>
//     </div>
//     <div class="texto_popup" style="position: absolute; top: 78%; left: 15%;">
//         <span class="resaltado">${columna_seleccionada().modalidad == "" ? "Modalidad todas" : columna_seleccionada().modalidad}:</span> <strong>${cuentas.total_modalidad == 0 ? `${cuentas.total_anio} usuarias en el municipio` : `${cuentas.total_modalidad} usuarias en el municipio`}</strong>
//     </div>
//     <div class="texto_popup" style="position: absolute; top: 91%; left: 50%;">
//         <button class="boton_ficha" onclick="descargarFicha()">Descargar ficha</button>
//     </div>
// </div>
// `;


  const popupContent = `
<div id="ficha" class="contenedor_popup" style="background: rgb(246, 210, 211); position: relative;">
    <img src="Img/Popup_entorno_boton_new.png" alt="" style="width: 100%; height: auto;">
    <div style="position: absolute; top: 37%; left: 28%; right: 26%; text-align: center;">
            <div class="texto_popup_titulo">
                <span>${propiedades.Localidad_correcion} </span>
            </div>
            <div class="texto_popup_anio">
                <span>${columna_seleccionada().anio == "General" ? "2022-2024" : columna_seleccionada().anio}</span>
            </div>
        </div>
        <div class="texto_popup" style="position: absolute; top: 61%; left: 27%;">
            <span class="resaltado">Número de usuarias en la colonia:</span> <strong>${propiedades[col]} </strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 65%; left: 27%;">
            <strong>(${((propiedades[col] / cuentas.total_anio) * 100 || 0).toFixed(2)}% del total municipal)</strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 71%; left: 27%;">
            <span class="resaltado">Total de usuarias en el municipio:</span> <strong>${cuentas.total_anio}</strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 77%; left: 27%;">
            <span class="resaltado">${columna_seleccionada().violencia == "" ? "Todos los tipos de violencia" : columna_seleccionada().violencia}:</span> <strong>${cuentas.total_violencia == 0 ? `${cuentas.total_anio}` : `${cuentas.total_violencia} usuarias`}</strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 81%; left: 27%;">
            <strong>${columna_seleccionada().violencia == "" ? "usuarias (total municipal)" : "(total municipal)"}</strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 87%; left: 27%;">
            <span class="resaltado">${columna_seleccionada().modalidad == "" ? "Todos los tipos de modalidad" : columna_seleccionada().modalidad}:</span> <strong>${cuentas.total_modalidad == 0 ? `${cuentas.total_anio}` : `${cuentas.total_modalidad} usuarias`}</strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 91%; left: 27%;">
             <strong>${columna_seleccionada().modalidad == "" ? "usuarias (total municipal)" : "(total municipal)"}</strong>
        </div>
        <div class="texto_popup" style="position: absolute; top: 85%; left: 78%;">
            <button class="boton_ficha" onclick="descargarFicha()">Descargar ficha</button>
      </div>
</div>
`;



  

//   ficha_descargar.innerHTML = `
// <div class="contenedor_popup" style="width: 600px; aspect-ratio: 100 / 66; background: rgb(246, 210, 211); position: relative;">
//     <img src="Img/Popup_entorno_descargar.png" alt="" style="width: 100%; height: auto;">
//     <div style="position: absolute; top: 37%; left: 28%; right: 26%; text-align: center;">
//             <div class="texto_popup_titulo">
//                 <span>${propiedades.Localidad_correcion} </span>
//             </div>
//             <div class="texto_popup_anio">
//                 <span>${columna_seleccionada().anio == "General" ? "2022-2024" : columna_seleccionada().anio}</span>
//             </div>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 61%; left: 27%;">
//             <span class="resaltado">Numero de usuarias en la colonia:</span> <strong>${propiedades[col]} </strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 65%; left: 27%;">
//             <strong>(${((propiedades[col] / cuentas.total_anio) * 100 || 0).toFixed(2)}% del total municipal)</strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 71%; left: 27%;">
//             <span class="resaltado">Total de usuarias en el municipio:</span> <strong>${cuentas.total_anio}</strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 77%; left: 27%;">
//             <span class="resaltado">${columna_seleccionada().violencia == "" ? "Todos los tipos de violencia" : columna_seleccionada().violencia}:</span> <strong>${cuentas.total_violencia == 0 ? `${cuentas.total_anio}` : `${cuentas.total_violencia} usuarias`}</strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 81%; left: 27%;">
//             <strong>${columna_seleccionada().violencia == "" ? "usuarias (total municipal)" : "(total municipal)"}</strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 87%; left: 27%;">
//             <span class="resaltado">${columna_seleccionada().modalidad == "" ? "Todos los tipos de modalidad" : columna_seleccionada().modalidad}:</span> <strong>${cuentas.total_modalidad == 0 ? `${cuentas.total_anio}` : `${cuentas.total_modalidad} usuarias`}</strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 91%; left: 27%;">
//              <strong>${columna_seleccionada().modalidad == "" ? "usuarias (total municipal)" : "(total municipal)"}</strong>
//         </div>
//         <div class="texto_popup" style="position: absolute; top: 85%; left: 78%;">
//             <button class="boton_ficha" onclick="descargarFicha()">Descargar ficha</button>
//       </div>
// </div>
// `;

e.target.bindPopup(popupContent).openPopup();
}



function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clicFeature,
        touchend:  resetHighlight         // Para telefono
    });
}


/// Columna

function columna_seleccionada() {
  let anio = document.getElementById("selector_anio").value;
  let violencia = document.getElementById("selector_violencia").value;
  let modalidad = document.getElementById("selector_modalidad").value;

  let columna_seleccionada = `${anio}_${violencia}_${modalidad}`;
  columna_seleccionada = columna_seleccionada.replace(/_+/g, "_").replace(/_$/, "");

  let anio_seleccionado = anio;
  let violencia_seleccionada = `${anio}_${violencia}`;
  let modalidad_seleccionada = `${anio}_${modalidad}`;
  //console.log("Columna seleccionada:", columna_seleccionada);
  return {
    columna: columna_seleccionada,
    anio: anio,
    violencia: violencia,
    modalidad: modalidad,
    violencia_anio: violencia_seleccionada,
    modalidad_anio: modalidad_seleccionada
  };
}




// Cuentas para el popup
function cuentas_para_popup() {
  let total_modalidad_tipo = datos.features.map(feature => feature.properties[columna_seleccionada().columna]).filter(v => v !== null && v !== undefined).reduce((a, b) => a + b, 0);
  let total_anio = datos.features.map(feature => feature.properties[columna_seleccionada().anio]).filter(v => v !== null && v !== undefined).reduce((a, b) => a + b, 0);
  let total_modalidad = datos.features.map(feature => feature.properties[columna_seleccionada().modalidad_anio]).filter(v => v !== null && v !== undefined).reduce((a, b) => a + b, 0);
  let total_violencia = datos.features.map(feature => feature.properties[columna_seleccionada().violencia_anio]).filter(v => v !== null && v !== undefined).reduce((a, b) => a + b, 0);
  return {
    total_modalidad_tipo: total_modalidad_tipo,
    total_anio: total_anio,
    total_modalidad: total_modalidad,
    total_violencia: total_violencia
  };
}


function valores_maximo_minimo_columna(columna) {
  let valores = datos.features.map(feature => feature.properties[columna]).filter(v => v !== null && v !== undefined);

  let max_valor = Math.max(...valores);
  let min_valor = Math.min(...valores);

  return {
    max: max_valor,
    min: min_valor
  };
}


// Buscador de colonias
let colonias_lista = datos.features.map(feature => feature.properties.Localidad_correcion).sort();
const listaElement = document.getElementById("lista");
colonias_lista.forEach(colonia => {
  const option = document.createElement("option");
  option.value = colonia;
  listaElement.appendChild(option);
});


function buscar_en_mapa(nombre_colonia) {
  datos_capa.eachLayer(function(layer) {
    if (layer.feature.properties.Localidad_correcion.toLowerCase() === nombre_colonia.toLowerCase()) {
      map.fitBounds(layer.getBounds(), { maxZoom: 15 });
      layer.fire('click');
    }
  });
}


//////////////////////////////////
/// Idea de la funcion general ///
/////////////////////////////////

/// Ejemplo modalidad, nos preguntamos si hay modalidad seleccionada

// Si
// Se genera una grafica apartir de anio_modalidad donde vamos a considerar el top 5 de colonias con mas casos en esa modalidad, donde en el eje X van las colonias y en el Y la frecuencia de casos

// No
// Se generar una grafica apartir de filtrar todas auqellas que dicen anio_modalidad, se suman los valores de cada modalidad, de esta manera el eje X tendremos el tipo de modalidad y en el Y la frecuencia total de casos en esa modalidad


// Codigo que nos sirvio de base para hacer la funcion general

// const columnas_geojson = Object.keys(datos.features[0].properties);
// const columnas_patron_filtro = "General"; 
// const columnas_nombres = columnas_geojson.filter(columna => columna.includes(columnas_patron_filtro));

// const filtracion_datos = datos.features.map(feature => {
//   return Object.fromEntries(
//     columnas_nombres.map(columna => [columna, feature.properties[columna]])
//   );
// });

// const sumar_columnas = filtracion_datos.reduce((acc, curr) => {
//   columnas_nombres.forEach(columna => {
//     if (!acc[columna]) {
//       acc[columna] = 0;
//     }
//     acc[columna] += curr[columna] || 0;
//   });
//   return acc;
// }, {});



const columnas_geojson = Object.keys(datos.features[0].properties);




function existe_modalidad_seleccionada() {
  let datos_modalidad_grafico;
  const modalidad = columna_seleccionada().modalidad;

  if (modalidad !== "") {
    const columnas_patron_filtro = columna_seleccionada().modalidad_anio;

    const filtracion_datos = datos.features.map(feature => ({
      l: feature.properties["Localidad_correcion"],
      v: feature.properties[columnas_patron_filtro]
    }));

    datos_modalidad_grafico = filtracion_datos
      .sort((a, b) => b.v - a.v)
      .slice(0, 10);

  } else {
    const columnas_patron_filtro = columna_seleccionada().anio + "_Modalidad";
    const columnas_nombres = columnas_geojson.filter(columna =>
      columna.includes(columnas_patron_filtro) && !columna.endsWith("Violencia")
    );

    const acumulado = datos.features.reduce((acc, feature) => {
      columnas_nombres.forEach(columna => {
        acc[columna] = (acc[columna] || 0) + (feature.properties[columna] || 0);
      });
      return acc;
    }, {});

    datos_modalidad_grafico = columnas_nombres.map(columna => ({
      l: columna.replace(/^\d+_/, '').replace("Modalidad ", "").replace("General_", ""),
      v: acumulado[columna]
    }));
  }

  return datos_modalidad_grafico;
}



function existe_violencia_seleccionada() {
  let datos_violencia_grafico;
  const violencia = columna_seleccionada().violencia;

  if (violencia !== "") {
    const columnas_patron_filtro = columna_seleccionada().violencia_anio;

    const filtracion_datos = datos.features.map(feature => ({
      l: feature.properties["Localidad_correcion"],
      v: feature.properties[columnas_patron_filtro]
    }));

    datos_violencia_grafico = filtracion_datos
      .sort((a, b) => b.v - a.v)
      .slice(0, 10);

  } else {
    const columnas_patron_filtro = columna_seleccionada().anio + "_Violencia";
    const columnas_nombres = columnas_geojson.filter(columna =>
      columna.includes(columnas_patron_filtro) && !columna.includes("Modalidad")
    );

    const acumulado = datos.features.reduce((acc, feature) => {
      columnas_nombres.forEach(columna => {
        acc[columna] = (acc[columna] || 0) + (feature.properties[columna] || 0);
      });
      return acc;
    }, {});

    datos_violencia_grafico = columnas_nombres.map(columna => ({
      l: columna.replace(/^\d+_/, '').replace("Violencia ", "").replace("General_", ""),
      v: acumulado[columna]
    }));
  }

  return datos_violencia_grafico;
}

function anio_datos_grafico() {
  let datos_grafico;
  const columnas_patron_filtro = columna_seleccionada().anio;

  if (columnas_patron_filtro !== "General") {

    datos_grafico = datos.features
      .map(feature => ({
        l: feature.properties["Localidad_correcion"],
        v: feature.properties[columnas_patron_filtro]
      }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 10);
    } else {
    columnas_nombres = columnas_geojson.filter(columna =>
      !columna.includes("Violencia") && !columna.includes("Modalidad") && !columna.includes("Localidad_correcion") && !columna.includes("General") && !columna.includes("_")
    );

    const acumulado = datos.features.reduce((acc, feature) => {
      columnas_nombres.forEach(columna => {
        acc[columna] = (acc[columna] || 0) + (feature.properties[columna] || 0);
      });
      return acc;
    }, {});
    datos_grafico = columnas_nombres.map(columna => ({
      l: columna.replace(/^\d+_/, ''),
      v: acumulado[columna]
    }));
  }

  return datos_grafico;
}


/// Funciones para grafico de cuando se selecciona una colonia

function violencia_datos_colonia_grafico(colonia) {
  const columnas_patron_filtro = columna_seleccionada().anio + "_Violencia";

  const columnas_nombres = columnas_geojson.filter(columna =>
    columna.includes(columnas_patron_filtro) && !columna.includes("Modalidad")
  );

  const feature = datos.features.find(
    feature => feature.properties.Localidad_correcion === colonia
  );

  if (!feature) return null;

  const acumulado = columnas_nombres.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

  const datos_grafico = columnas_nombres.map(columna => ({
    l: columna.replace(/^\d+_/, '').replace("Violencia ", "").replace("General_", ""),
    v: acumulado[columna]
  }));

  return datos_grafico;
}

function modalidad_datos_colonia_grafico(colonia) {
  const columnas_patron_filtro = columna_seleccionada().anio + "_Modalidad";
  const columnas_nombres = columnas_geojson.filter(columna =>
    columna.includes(columnas_patron_filtro) && !columna.endsWith("Violencia")
  );

  const feature = datos.features.find(
    feature => feature.properties.Localidad_correcion === colonia
  );

  if (!feature) return null;

  const acumulado = columnas_nombres.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

  const datos_grafico = columnas_nombres.map(columna => ({
    l: columna.replace(/^\d+_/, '').replace("Modalidad ", "").replace("General_", ""),
    v: acumulado[columna]
  }));
  return datos_grafico;
}

function anio_datos_colonia_grafico(colonia) {

  const columnas_nombres = columnas_geojson.filter(columna =>
    !columna.includes("Violencia") &&
    !columna.includes("Modalidad") &&
    !columna.includes("Localidad_correcion") &&
    !columna.includes("General") &&
    !columna.includes("_")
  );

  const feature = datos.features.find(
    feature => feature.properties.Localidad_correcion === colonia
  );

  if (!feature) return null;

  const acumulado = columnas_nombres.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

  const datos_grafico = columnas_nombres.map(columna => ({
    l: columna.replace(/^\d+_/, ''),
    v: acumulado[columna]
  }));

  return datos_grafico;
}



function datos_reporte(colonia) {

  const feature = datos.features.find(
    feature => feature.properties.Localidad_correcion === colonia
  );

  if (!feature) return null;

  let casos_colonia_general = feature.properties.General
  let casos_total_general = datos.features.map(feature => feature.properties["General"]).filter(v => v !== null && v !== undefined).reduce((a, b) => a + b, 0);

  let porcentaje_repecto_municipio = ((casos_colonia_general/casos_total_general)*100).toFixed(2)


  const columnas_general = columnas_geojson.filter(columna =>
    !columna.includes("Violencia") && !columna.includes("Modalidad") && !columna.includes("Localidad_correcion")
  );

  const columnas_violencia = columnas_geojson.filter(columna =>
    columna.includes("Violencia") && !columna.includes("Modalidad")
  );

  const columnas_modalidad = columnas_geojson.filter(columna =>
    columna.includes("Modalidad") && !columna.includes("Violencia")
  );

  const acumulado_general = columnas_general.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

   const acumulado_violencia = columnas_violencia.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

  const acumulado_modalidad = columnas_modalidad.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});


  


  //////////////
  let columnas_violencia_general = columnas_violencia.filter(columna =>columna.includes("General"))
  let violencia_top_acumulado = columnas_violencia_general.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

  let violecia_top = columnas_violencia_general.map(columna => ({
    l: columna.replace(/^\d+_/, '').replace("Violencia ", "").replace("General_", ""),
    v: violencia_top_acumulado[columna]
  })).sort((a, b) => b.v - a.v).slice(0, 1);



  let columnas_modalidad_general = columnas_modalidad.filter(columna =>columna.includes("General"))
  let modalidad_top_acumulado = columnas_modalidad_general.reduce((acc, columna) => {
    acc[columna] = feature.properties[columna];
    return acc;
  }, {});

  let modalidad_top = columnas_modalidad_general.map(columna => ({
    l: columna.replace(/^\d+_/, '').replace("Modalidad ", "").replace("General_", ""),
    v: modalidad_top_acumulado[columna]
  })).sort((a, b) => b.v - a.v).slice(0, 1);

  //////////////

  


  let generales = transformarAcumulado_general(acumulado_general);
  let violencia = transformarAcumulado_violencia(acumulado_violencia);
  let modalidad = transformarAcumulado_modalidad(acumulado_modalidad);

  
  // datos_reporte(colonia_buscada).distribuccion_modalidad.data.sort((a, b) => b.General - a.General);
  return {
    casos_colonia_general: casos_colonia_general,
    casos_total_municipio: casos_total_general,
    porcentaje_colonia: porcentaje_repecto_municipio,
    violencia_mas_frecuente: violecia_top.map(d => d.l)[0],
    violencia_mas_frecuente_valor: violecia_top.map(d => d.v)[0],
    modalidad_mas_frecuente: modalidad_top.map(d => d.l)[0],
    modalidad_mas_frecuente_valor: modalidad_top.map(d => d.v)[0],
    datos_generales: generales,
    distribuccion_violencia: violencia,
    distribuccion_modalidad: modalidad,
  };
}












/////////////
/// Modal ///
/////////////

// La linea del modal lo hizo la IA para abrir desde otro html 
document.addEventListener("DOMContentLoaded", () => {

    fetch("codigos/modal_informacion.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("contenedor-modales").innerHTML = html;
        })
        .catch(err => {
            console.error("Error cargando el modal:", err);
        });

});


document.addEventListener("click", (e) => {

  if (e.target.closest("#btnInformacion")) {
    e.preventDefault();

    const modal = new bootstrap.Modal(
      document.getElementById("modalInformacion")
    );
    modal.show();
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }

});












// Funciones hechas con Claude por que no le se todavia tanto a la manipulacion de datos con JS

function transformarAcumulado_general(obj) {
  const periodos = Object.keys(obj)
    .filter(k => !k.includes('_'))
    .sort((a, b) => {
      if (a === 'General') return -1;
      if (b === 'General') return 1;
      return a.localeCompare(b);
    });

  const data = periodos.map(periodo => [
    periodo,
    obj[periodo],
    obj[`${periodo}_Edad`],
    obj[`${periodo}_Mes`],
  ]).map(row => row.map(cell => cell === 'General' ? '2022-2024' : cell));

  return { data, periodos };
}







function transformarAcumulado_violencia(obj) {
  const rows = {};
  const periodosSet = new Set();

  for (const [key, value] of Object.entries(obj)) {
    const sep = key.indexOf('_');
    const periodo = key.slice(0, sep);
    const tipo    = key.slice(sep + 1).replace('Violencia ', '');

    periodosSet.add(periodo);
    if (!rows[tipo]) rows[tipo] = {};
    rows[tipo][periodo] = value;
  }

  const periodos = [...periodosSet].sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });
  
  const data = Object.entries(rows).map(([tipo, vals]) => {
    return [tipo, ...periodos.map(p => vals[p] ?? 0)];
  });

  return { data, periodos };
}


function transformarAcumulado_modalidad(obj) {
  const rows = {};
  const periodosSet = new Set();

  for (const [key, value] of Object.entries(obj)) {
    const sep = key.indexOf('_');
    const periodo = key.slice(0, sep);
    const tipo    = key.slice(sep + 1).replace('Modalidad ', '');

    periodosSet.add(periodo);
    if (!rows[tipo]) rows[tipo] = {};
    rows[tipo][periodo] = value;
  }

  const periodos = [...periodosSet].sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

  const data = Object.entries(rows).map(([tipo, vals]) => {
    return [tipo, ...periodos.map(p => vals[p] ?? 0)];
  });

  return { data, periodos};
}