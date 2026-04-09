// Estado actual de la selección
const seleccion = {
  reino:   null,
  orden:   null,
  familia: null,
  nombre:  null,
  busqueda: null, 
};

// IDs de los selectores en el DOM
const selector_ids = {
  reino:   "selector_reino",
  orden:   "selector_orden",
  familia: "selector_familia",
  nombre:  "selector_nombre",
};


function llenar_selector(id, valores, disabled = false) {
    const listaElement = document.getElementById(id);
    if (!listaElement) return;

    listaElement.innerHTML = "";                        // limpiar opciones anteriores

    const option = document.createElement("option");
    option.value = "Todos";
    option.text  = "Todos las opciones";
    listaElement.appendChild(option);

    valores.forEach(v => {
        if (!v) return;
        const option = document.createElement("option");
        option.value = v;
        option.text  = v;
        listaElement.appendChild(option);
    });

    listaElement.disabled = disabled;
    listaElement.value = "Todos";
}



function resetear_selector_desde(desde) {
  const niveles = ["orden", "familia", "nombre"];
  const idx     = niveles.indexOf(desde);
  if (idx === -1) return;

  for (let i = idx; i < niveles.length; i++) {
    const nivel = niveles[i];
    seleccion[nivel] = null;
    llenar_selector(selector_ids[nivel], [], true);  // vacío y bloqueado
  }
}



function iniciar_filtros() {
    let reinos = [...new Set(diccionario.map(i => i.reino).filter(Boolean))].sort();
    llenar_selector(selector_ids.reino, reinos, false);

    resetear_selector_desde("orden");
}

function al_cambiar_reino() {
    seleccion.busqueda = null;
    document.getElementById("buscador").value = "";

    let valor = document.getElementById(selector_ids.reino).value;
    seleccion.reino = valor || null;
    resetear_selector_desde("orden");

    if (valor && valor !== "Todos") {
        let ordenes = [...new Set(
            diccionario
                .filter(i => i.reino === valor)
                .map(i => i.orden)
                .filter(Boolean)
        )].sort();
        llenar_selector(selector_ids.orden, ordenes, false);
    }

    actualizar_mapa();
}

function al_cambiar_orden() {
    seleccion.busqueda = null;
    document.getElementById("buscador").value = "";

    let valor = document.getElementById(selector_ids.orden).value;
    seleccion.orden = valor || null;
    resetear_selector_desde("familia");

    if (valor && valor !== "Todos") {
        let familias = [...new Set(
            diccionario
                .filter(i => i.reino === seleccion.reino && i.orden === valor)
                .map(i => i.familia)
                .filter(Boolean)
        )].sort();
        llenar_selector(selector_ids.familia, familias, false);
    }

    actualizar_mapa();
}

function al_cambiar_familia() {
    seleccion.busqueda = null;
    document.getElementById("buscador").value = "";

    let valor = document.getElementById(selector_ids.familia).value;
    seleccion.familia = valor || null;
    resetear_selector_desde("nombre");

    if (valor && valor !== "Todos") {
        let nombres = [...new Set(
            diccionario
                .filter(i =>
                    i.reino  === seleccion.reino &&
                    i.orden  === seleccion.orden &&
                    i.familia === valor
                )
                .map(i => i.nombre_cientifico)
                .filter(Boolean)
        )].sort();
        llenar_selector(selector_ids.nombre, nombres, false);
    }

    actualizar_mapa();
}

function al_cambiar_nombre() {
    seleccion.busqueda = null;
    document.getElementById("buscador").value = "";

    let valor = document.getElementById(selector_ids.nombre).value;
    seleccion.nombre = valor || null;
    actualizar_mapa();
}


function generar_datos_filtrados() {

    if (seleccion.busqueda) {
        return datos.filter(i => i.nombre_comun === seleccion.busqueda);
    }

  let datos_filtrados = datos.filter((i) => {
    if (seleccion.reino && seleccion.reino !== "Todos" && i.reino !== seleccion.reino) return false;
    if (seleccion.orden && seleccion.orden !== "Todos" && i.orden !== seleccion.orden) return false;
    if (seleccion.familia && seleccion.familia !== "Todos" && i.familia !== seleccion.familia) return false;
    if (seleccion.nombre && seleccion.nombre !== "Todos" && i.nombre_cientifico !== seleccion.nombre) return false;
  return true;
});

  console.log(
    `Reino: ${seleccion.reino ?? "Todos"} | ` +
      `Orden: ${seleccion.orden ?? "Todos"} | ` +
      `Familia: ${seleccion.familia ?? "Todos"} | ` +
      `Nombre: ${seleccion.nombre ?? "Todos"} | ` +
      `Registros: ${datos_filtrados.length}`,
  );

  return datos_filtrados;
}







// Funciones para el mapa

var capa_actual = {
    heat:    null,   
    cluster: null,   
    markers: null,   
};

function limpiar_capas() {
    if (capa_actual.heat)    { map.removeLayer(capa_actual.heat); map.removeControl(legend);  capa_actual.heat = null; }
    if (capa_actual.cluster) { map.removeLayer(capa_actual.cluster); capa_actual.cluster = null; }
    if (capa_actual.markers) { map.removeLayer(capa_actual.markers); capa_actual.markers = null; }

    if (miniMap) { miniMap.remove(); miniMap = null; }
}

function dibujar_heatmap(datos) {
    let heatData = datos.map(i => [i.latitude, i.longitude, 1]);
    if (heatData.length > 1000) {
        capa_actual.heat = L.heatLayer(heatData, { radius: 25 }).addTo(map);
    } else {
        capa_actual.heat = L.heatLayer(heatData, { radius: 25, blur: 15, minOpacity: 0.4 }).addTo(map);
    }
    legend.addTo(map);
}


let miniMap = null;
function dibujar_heatmap_minimapa(datos) {

    if (miniMap) {
        miniMap.remove();
        miniMap = null;
    }

    let osm2 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 15
    });
    
    let heatData = datos.map(i => [i.latitude, i.longitude, 1]);
    let heatMini = heatData.length > 1000
        ? L.heatLayer(heatData, { radius: 10 })
        : L.heatLayer(heatData, { radius: 12, blur: 5, minOpacity: 0.4 });

    let miniLayers = L.layerGroup([osm2, heatMini]);

    miniMap  = new L.Control.MiniMap(miniLayers, {
        toggleDisplay: true,
        zoomLevelOffset: -3
    }).addTo(map);    

}

function dibujar_cluster(datos) {
    let grupo = L.markerClusterGroup();
    datos.forEach(i => {
        if (i.latitude && i.longitude) {
            let marker = L.marker([i.latitude, i.longitude]);
            if (i.nombre_cientifico) {
                let vector = i.antecedentes ? i.antecedentes.split("/") : [];
                let popupContent = `<div class="contenedor_popup">${construir_popup(i, vector)}</div>`;
                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    maxHeight: 450
                });
                marker.bindTooltip(i.nombre_cientifico);
            }
            grupo.addLayer(marker);
        }
    });
    capa_actual.cluster = grupo;
    map.addLayer(grupo);
}

// function dibujar_marcadores(datos) {
//     let capaMarcadores = L.layerGroup();
//     datos.forEach(i => {
//         if (i.latitude && i.longitude) {
//             let marker = L.marker([i.latitude, i.longitude]);
//             if (i.nombre_cientifico) {
//                 marker.bindPopup(`<b>${i.nombre_cientifico}</b>`);
//             }
//             capaMarcadores.addLayer(marker);
//         }
//     });
//     capa_actual.markers = capaMarcadores;
//     map.addLayer(capaMarcadores);
// }


function dibujar_marcadores(datos) {
    let capaMarcadores = L.markerClusterGroup();
    datos.forEach(i => {
        if (i.latitude && i.longitude) {
            let marker = L.marker([i.latitude, i.longitude]);
            if (i.nombre_cientifico) {
                let vector = i.antecedentes ? i.antecedentes.split("/") : [];
                let popupContent = `<div class="contenedor_popup">${construir_popup(i, vector)}</div>`;
                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    maxHeight: 600
                });
                marker.bindTooltip(i.nombre_cientifico);
            }
            capaMarcadores.addLayer(marker);
        }
    });
    capa_actual.markers = capaMarcadores;
    map.addLayer(capaMarcadores);
}

function nivel_activo() {
    if (seleccion.busqueda)                                         return "orden"; // comportamiento igual que orden: heat → cluster
    if (seleccion.nombre  && seleccion.nombre  !== "Todos")        return "nombre";
    if (seleccion.familia && seleccion.familia !== "Todos")        return "familia";
    if (seleccion.orden   && seleccion.orden   !== "Todos")        return "orden";
  return "reino";
}




// let datos_filtrados = null;

// function actualizar_mapa() {
//     datos_filtrados = generar_datos_filtrados();  
//     let nivel = nivel_activo();
//     console.log(`Nivel activo: ${nivel} | Registros: ${datos_filtrados.length}`);

//     limpiar_capas();
//     renderizar_segun_zoom(nivel);
// }

// function renderizar_segun_zoom(nivel) {
//     if (!datos_filtrados) return;
//     let zoom = map.getZoom();

//     if (nivel === "reino") {
//         dibujar_heatmap(datos_filtrados);

//     } else if (nivel === "orden") {
//         if (zoom < 14) {
//             dibujar_heatmap(datos_filtrados);
//         } else {
//             dibujar_cluster(datos_filtrados);
//         }

//     } else {
//         dibujar_marcadores(datos_filtrados);
//     }
// }


// La idea de modo actual, lo añadio la IA por que el mapa se actualiza cada vez que se cambia el zoom, lo que hace que se vuelva a dibujar el heatmap o cluster aunque no sea necesario. Con esta variable, solo se redibuja si el modo de visualización cambia (por ejemplo, de heatmap a cluster), evitando redibujos innecesarios al hacer zoom dentro del mismo modo.

let datos_filtrados = null;
let modo_actual = null; // "heat" | "cluster" | "markers"

function actualizar_mapa() {
    datos_filtrados = generar_datos_filtrados();
    modo_actual = null; // Fuerza redibujo al cambiar selección
    let nivel = nivel_activo();
    console.log(`Nivel activo: ${nivel} | Registros: ${datos_filtrados.length}`);

    renderizar_segun_zoom(nivel);
    info.update();
}

function renderizar_segun_zoom(nivel) {
    if (!datos_filtrados) return;
    let zoom = map.getZoom();

    let modo_deseado;

    if (nivel === "reino") {
        modo_deseado = "heat";

    } else if (nivel === "orden") {
        modo_deseado = zoom < 14 ? "heat" : "cluster";

    } else {
        modo_deseado = "markers";
    }

    // Solo redibuja si el modo cambió
    if (modo_deseado === modo_actual) return;

    limpiar_capas();
    modo_actual = modo_deseado;

    if (modo_deseado === "heat")    dibujar_heatmap(datos_filtrados);
    if (modo_deseado === "cluster") dibujar_cluster(datos_filtrados);
    if (modo_deseado === "cluster") dibujar_heatmap_minimapa(datos_filtrados);
    if (modo_deseado === "markers") dibujar_marcadores(datos_filtrados);
}






/////////////////////////
///  Generar busqueda ///
/////////////////////////

let busqueda_lista = [... new Set(datos.map(i => i.nombre_comun).filter(Boolean).sort())];
const listaElement = document.getElementById("lista");
busqueda_lista.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    listaElement.appendChild(option);
}); 

document.getElementById("buscador").addEventListener("input", function () {
  const valor = this.value.trim();
  
  if (busqueda_lista.includes(valor)) {
    seleccion.busqueda = valor;
    iniciar_filtros();  
    
    seleccion.reino   = null;
    seleccion.orden   = null;
    seleccion.familia = null;
    seleccion.nombre  = null;
  } else {
    seleccion.busqueda = null;
  }

  modo_actual = null;
  actualizar_mapa();
});

/////////////
/// Modal ///
/////////////

// La linea del modal lo hizo la IA para abrir desde otro html 
document.addEventListener("DOMContentLoaded", () => {

    fetch("code/modal_informacion.html")
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


// Para iniciar el proceso 
document.addEventListener("DOMContentLoaded", () => {
    iniciar_filtros();

    document.getElementById(selector_ids.reino)
        .addEventListener("change", al_cambiar_reino);

    document.getElementById(selector_ids.orden)
        .addEventListener("change", al_cambiar_orden);

    document.getElementById(selector_ids.familia)
        .addEventListener("change", al_cambiar_familia);

    document.getElementById(selector_ids.nombre)
        .addEventListener("change", al_cambiar_nombre);
});

