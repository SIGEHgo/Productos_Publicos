// Estado actual de la selección
const seleccion = {
  reino:   null,
  orden:   null,
  familia: null,
  nombre:  null,
  busqueda: null, 
  riesgo: null,
  
  riesgo_reino:   null,
  riesgo_orden:   null,
  riesgo_familia: null,
  riesgo_nombre:  null,
};

// IDs de los selectores en el DOM
const selector_ids = {
  reino:   "selector_reino",
  orden:   "selector_orden",
  familia: "selector_familia",
  nombre:  "selector_nombre",
};

const selector_ids_riesgo = {
  reino:   "selector_reino_riesgo",
  orden:   "selector_orden_riesgo",
  familia: "selector_familia_riesgo",
  nombre:  "selector_nombre_riesgo",
};


function llenar_selector(id, valores, disabled = false) {
    const listaElement = document.getElementById(id);
    if (!listaElement) return;

    // Guardar el valor actual antes de limpiar
    const valorAnterior = listaElement.value;

    listaElement.innerHTML = "";                        // limpiar opciones anteriores

    const option = document.createElement("option");
    option.value = "Todos";
    option.text  = "Todos las opciones";
    listaElement.appendChild(option);

    valores.forEach(v => {
        if (!v) return;
        const option = document.createElement("option");
        if (typeof v === 'object' && v !== null && v.count !== undefined) {
            option.value = v.value;
            option.text  = `${v.value} (${v.count})`;
        } else {
            option.value = v;
            option.text  = v;
        }
        listaElement.appendChild(option);
    });

    listaElement.disabled = disabled;
    listaElement.value = "Todos";

    // --- Construir/actualizar el custom dropdown visual ---
    const wrapperId = id + "_wrapper";
    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = wrapperId;
        wrapper.className = "custom-select-wrapper";
        listaElement.parentNode.insertBefore(wrapper, listaElement.nextSibling);
    }

    // Limpiar contenido previo del wrapper
    wrapper.innerHTML = "";

    // Trigger (la parte visible que se ve como un select)
    const trigger = document.createElement("div");
    trigger.className = "custom-select-trigger" + (disabled ? " disabled-trigger" : "");
    trigger.textContent = "Todos las opciones";
    wrapper.appendChild(trigger);

    // Dropdown (el menú desplegable)
    const dropdown = document.createElement("div");
    dropdown.className = "custom-select-dropdown" + (disabled ? " disabled" : "");
    wrapper.appendChild(dropdown);

    // Opción "Todos"
    const todosOption = document.createElement("div");
    todosOption.className = "custom-select-option selected";
    todosOption.dataset.value = "Todos";
    todosOption.innerHTML = '<span>Todos las opciones</span>';
    dropdown.appendChild(todosOption);

    // Opciones del listado
    valores.forEach(v => {
        if (!v) return;
        const optDiv = document.createElement("div");
        optDiv.className = "custom-select-option";
        if (typeof v === 'object' && v !== null && v.count !== undefined) {
            optDiv.dataset.value = v.value;
            optDiv.innerHTML = `<span>${v.value}</span><span class="count-badge">${v.count}</span>`;
        } else {
            optDiv.dataset.value = v;
            optDiv.innerHTML = `<span>${v}</span>`;
        }
        dropdown.appendChild(optDiv);
    });

    // --- Eventos del custom dropdown ---

    // Abrir/cerrar al hacer click en el trigger
    trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        if (disabled) return;
        const isOpen = dropdown.classList.contains("open");
        // Cerrar todos los demás dropdowns abiertos
        document.querySelectorAll(".custom-select-dropdown.open").forEach(d => {
            if (d !== dropdown) d.classList.remove("open");
        });
        document.querySelectorAll(".custom-select-trigger.open").forEach(t => {
            if (t !== trigger) t.classList.remove("open");
        });
        if (isOpen) {
            dropdown.classList.remove("open");
            trigger.classList.remove("open");
        } else {
            dropdown.classList.add("open");
            trigger.classList.add("open");
        }
    });

    // Seleccionar opción
    dropdown.querySelectorAll(".custom-select-option").forEach(optDiv => {
        optDiv.addEventListener("click", function(e) {
            e.stopPropagation();
            if (disabled) return;
            const val = this.dataset.value;
            // Actualizar el select nativo
            listaElement.value = val;
            // Disparar evento change en el select nativo para que los listeners existentes funcionen
            listaElement.dispatchEvent(new Event("change"));
            // Cerrar dropdown
            dropdown.classList.remove("open");
            trigger.classList.remove("open");
            // Actualizar texto del trigger
            const textSpan = this.querySelector("span");
            trigger.textContent = textSpan ? textSpan.textContent : val;
            // Marcar opción como seleccionada
            dropdown.querySelectorAll(".custom-select-option").forEach(o => o.classList.remove("selected"));
            this.classList.add("selected");
        });
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", function cerrar(e) {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove("open");
            trigger.classList.remove("open");
        }
    }, { once: false });
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
    let reinos = [...new Set(diccionario.map(i => i.reino).filter(Boolean))].sort().map(r => ({
        value: r,
        count: diccionario.filter(i => i.reino === r).reduce((sum, i) => sum + (i.n || 0), 0)
    }));
    llenar_selector(selector_ids.reino, reinos, false);

    resetear_selector_desde("orden");
}

function al_cambiar_reino() {
    seleccion.busqueda = null;
    seleccion.riesgo = null;
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
        )].sort().map(o => ({
            value: o,
            count: diccionario.filter(i => i.reino === valor && i.orden === o).reduce((sum, i) => sum + (i.n || 0), 0)
        }));
        llenar_selector(selector_ids.orden, ordenes, false);
    }

    actualizar_mapa(datos = taxonomia);
}

function al_cambiar_orden() {
    seleccion.busqueda = null;
    seleccion.riesgo = null;
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
        )].sort().map(f => ({
            value: f,
            count: diccionario.filter(i => i.reino === seleccion.reino && i.orden === valor && i.familia === f).reduce((sum, i) => sum + (i.n || 0), 0)
        }));
        llenar_selector(selector_ids.familia, familias, false);
    }

    actualizar_mapa(datos = taxonomia);
}

function al_cambiar_familia() {
    seleccion.busqueda = null;
    seleccion.riesgo = null;
    document.getElementById("buscador").value = "";

    let valor = document.getElementById(selector_ids.familia).value;
    seleccion.familia = valor || null;
    resetear_selector_desde("nombre");

    if (valor && valor !== "Todos") {
        let nombres = diccionario
            .filter(i =>
                i.reino  === seleccion.reino &&
                i.orden  === seleccion.orden &&
                i.familia === valor &&
                i.nombre_cientifico
            )
            .map(i => ({ value: i.nombre_cientifico, count: i.n || 0 }))
            .sort((a, b) => a.value.localeCompare(b.value));
        llenar_selector(selector_ids.nombre, nombres, false);
    }

    actualizar_mapa(datos = taxonomia);
}

function al_cambiar_nombre() {
    seleccion.busqueda = null;
    seleccion.riesgo = null;
    document.getElementById("buscador").value = "";

    let valor = document.getElementById(selector_ids.nombre).value;
    seleccion.nombre = valor || null;
    actualizar_mapa(datos = taxonomia);
}




// Lo mismo pero para el otro apartado,  pero con algunas pequeñas modificaciones


function iniciar_filtros_riesgo() {
    let reinos = [...new Set(diccionario_sigeh.map(i => i.reino).filter(Boolean))].sort().map(r => ({
        value: r,
        count: diccionario_sigeh.filter(i => i.reino === r).reduce((sum, i) => sum + (i.n || 0), 0)
    }));
    llenar_selector(selector_ids_riesgo.reino, reinos, false);
    llenar_selector(selector_ids_riesgo.orden,   [], true);
    llenar_selector(selector_ids_riesgo.familia, [], true);
    llenar_selector(selector_ids_riesgo.nombre,  [], true);
}

function resetear_filtros_riesgo() {
    seleccion.riesgo_reino   = null;
    seleccion.riesgo_orden   = null;
    seleccion.riesgo_familia = null;
    seleccion.riesgo_nombre  = null;
    iniciar_filtros_riesgo();
}

function al_cambiar_reino_riesgo() {
    let valor = document.getElementById(selector_ids_riesgo.reino).value;
    seleccion.riesgo_reino   = valor !== "Todos" ? valor : null;
    seleccion.riesgo_orden   = null;
    seleccion.riesgo_familia = null;
    seleccion.riesgo_nombre  = null;

    llenar_selector(selector_ids_riesgo.orden,   [], true);
    llenar_selector(selector_ids_riesgo.familia, [], true);
    llenar_selector(selector_ids_riesgo.nombre,  [], true);

    if (valor && valor !== "Todos") {
        let ordenes = [...new Set(
            diccionario_sigeh
                .filter(i => i.reino === valor)
                .map(i => i.orden)
                .filter(Boolean)
        )].sort().map(o => ({
            value: o,
            count: diccionario_sigeh.filter(i => i.reino === valor && i.orden === o).reduce((sum, i) => sum + (i.n || 0), 0)
        }));
        llenar_selector(selector_ids_riesgo.orden, ordenes, false);
    }

    modo_actual = null;
    actualizar_mapa(datos = taxonomia);
}

function al_cambiar_orden_riesgo() {
    let valor = document.getElementById(selector_ids_riesgo.orden).value;
    seleccion.riesgo_orden   = valor !== "Todos" ? valor : null;
    seleccion.riesgo_familia = null;
    seleccion.riesgo_nombre  = null;

    llenar_selector(selector_ids_riesgo.familia, [], true);
    llenar_selector(selector_ids_riesgo.nombre,  [], true);

    if (valor && valor !== "Todos") {
        let familias = [...new Set(
            diccionario_sigeh
                .filter(i => i.reino === seleccion.riesgo_reino && i.orden === valor)
                .map(i => i.familia)
                .filter(Boolean)
        )].sort().map(f => ({
            value: f,
            count: diccionario_sigeh.filter(i => i.reino === seleccion.riesgo_reino && i.orden === valor && i.familia === f).reduce((sum, i) => sum + (i.n || 0), 0)
        }));
        llenar_selector(selector_ids_riesgo.familia, familias, false);
    }

    modo_actual = null;
    actualizar_mapa(datos = taxonomia);
}

function al_cambiar_familia_riesgo() {
    let valor = document.getElementById(selector_ids_riesgo.familia).value;
    seleccion.riesgo_familia = valor !== "Todos" ? valor : null;
    seleccion.riesgo_nombre  = null;

    llenar_selector(selector_ids_riesgo.nombre, [], true);

    if (valor && valor !== "Todos") {
        let nombres = diccionario_sigeh
            .filter(i =>
                i.reino   === seleccion.riesgo_reino  &&
                i.orden   === seleccion.riesgo_orden  &&
                i.familia === valor &&
                i.nombre_cientifico
            )
            .map(i => ({ value: i.nombre_cientifico, count: i.n || 0 }))
            .sort((a, b) => a.value.localeCompare(b.value));
        llenar_selector(selector_ids_riesgo.nombre, nombres, false);
    }

    modo_actual = null;
    actualizar_mapa(datos = taxonomia);
}

function al_cambiar_nombre_riesgo() {
    let valor = document.getElementById(selector_ids_riesgo.nombre).value;
    seleccion.riesgo_nombre = valor !== "Todos" ? valor : null;
    modo_actual = null;
    actualizar_mapa(datos = taxonomia);
}


let busqueda_general = {
    busqueda_general: null,
    reino: null,
    orden: null,
    familia: null,
    nombre: null,
    reino_length: 0,
    orden_length: 0,
    familia_length: 0,
    nombre_length: 0
}

function generar_datos_filtrados(datos) {
    busqueda_general.busqueda_general = seleccion.busqueda

    if (seleccion.busqueda) {
        const busqueda = seleccion.busqueda

        const existe = datos.find(
            i => (i.nombre_comun ?? "").trim().toLowerCase() === busqueda.trim().toLowerCase()
        );

        if (existe) {
            return datos.filter(
                i => (i.nombre_comun ?? "").trim().toLowerCase() === busqueda.trim().toLowerCase()
            );
        }

        busqueda_general.busqueda_general = "Busqueda general";
        //console.log("Imprimiendo busqueda general: ", busqueda_general.busqueda_general, " | ", seleccion.busqueda);

        let datos_fil = datos.filter(
            i =>(i.nombre_comun ?? "").trim().toLowerCase().includes(busqueda.trim().toLowerCase())
        );

        busqueda_general.reino   = [...new Set(datos_fil.map(i => i.reino).filter(Boolean))].sort();
        busqueda_general.orden   = [...new Set(datos_fil.map(i => i.orden).filter(Boolean))].sort();
        busqueda_general.familia = [...new Set(datos_fil.map(i => i.familia).filter(Boolean))].sort();
        busqueda_general.nombre  = [...new Set(datos_fil.map(i => i.nombre_cientifico).filter(Boolean))].sort();

        busqueda_general.reino_length   = busqueda_general.reino.length;
        busqueda_general.orden_length   = busqueda_general.orden.length;
        busqueda_general.familia_length = busqueda_general.familia.length;
        busqueda_general.nombre_length  = busqueda_general.nombre.length;
       
        return datos_fil;
    }

   if (sidebar_seleccion === "riesgo") {
    let resultado;

    if (!seleccion.riesgo || seleccion.riesgo.length === 0) {
        resultado = taxonomia_sigeh;
    } else {
        console.log(`Evaluando ${seleccion.riesgo}`);
        resultado = taxonomia_sigeh.filter(i => {

            // criterios NOM-059
            const coincideNom059 = seleccion.riesgo.some(criterio =>
                criterio !== "endemicas" &&
                i.NOM_059 === criterio
            );

            if (seleccion.riesgo.includes("endemicas")) {

                // Si no hay criterios NOM, solo validar endémicas
                const hayNom059 = seleccion.riesgo.some(
                    c => c !== "endemicas"
                );

                if (!hayNom059) {
                    return i.endemicas == 1;
                }

                return i.endemicas == 1 && coincideNom059;
            }

            return coincideNom059;
        });
    }

    // Filtro taxonómico adicional para Especies en Riesgo
    resultado = resultado.filter(i => {
        if (seleccion.riesgo_reino   && seleccion.riesgo_reino   !== "Todos" && i.reino            !== seleccion.riesgo_reino)   return false;
        if (seleccion.riesgo_orden   && seleccion.riesgo_orden   !== "Todos" && i.orden            !== seleccion.riesgo_orden)   return false;
        if (seleccion.riesgo_familia && seleccion.riesgo_familia !== "Todos" && i.familia          !== seleccion.riesgo_familia) return false;
        if (seleccion.riesgo_nombre  && seleccion.riesgo_nombre  !== "Todos" && i.nombre_cientifico !== seleccion.riesgo_nombre)  return false;
        return true;
    });

    return resultado;
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
        capa_actual.heat = L.heatLayer(heatData, { radius: 25,
            pane: 'heatmapPane'
         }).addTo(map);
    } else {
        capa_actual.heat = L.heatLayer(heatData, { radius: 25, blur: 15, minOpacity: 0.4,
            pane: 'heatmapPane'
         }).addTo(map);
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
    if (seleccion.riesgo && seleccion.riesgo.length > 0)          return "orden"; 
    if (seleccion.nombre  && seleccion.nombre  !== "Todos")        return "nombre";
    if (seleccion.familia && seleccion.familia !== "Todos")        return "familia";
    if (seleccion.orden   && seleccion.orden   !== "Todos")        return "orden";
  return "reino";
}




// La idea de modo actual, lo añadio la IA por que el mapa se actualiza cada vez que se cambia el zoom, lo que hace que se vuelva a dibujar el heatmap o cluster aunque no sea necesario. Con esta variable, solo se redibuja si el modo de visualización cambia (por ejemplo, de heatmap a cluster), evitando redibujos innecesarios al hacer zoom dentro del mismo modo.

let datos_filtrados = null;
let modo_actual = null; // "heat" | "cluster" | "markers"

function actualizar_mapa(datos) {
    datos_filtrados = generar_datos_filtrados(datos = datos);
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


function llenar_lista_busqueda(items) {
    const listaElement = document.getElementById("lista");
    if (!listaElement) return;

    listaElement.innerHTML = "";

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.nombre_comun;
        if (item.n) {
            option.label = `${item.nombre_cientifico} (${item.n})`;
        }
        listaElement.appendChild(option);
    });
}

function actualizar_sugerencias_busqueda(valor) {
    let valor_lim = valor.trim().toLowerCase();

    if (!valor_lim) {
        llenar_lista_busqueda(busqueda_lista);
        return;
    }

    let coincidencias = busqueda_lista.filter(item =>
        (item.nombre_comun ?? "").trim().toLowerCase().includes(valor_lim)
    );
    llenar_lista_busqueda(coincidencias);
}

function inicializar_busqueda() {
  
    if (!Array.isArray(taxonomia) || taxonomia.length === 0) return;

    const listaElement = document.getElementById("lista");
    if (!listaElement) return;

    actualizar_sugerencias_busqueda("");
    // listaElement.innerHTML = "";
    
    // busqueda_lista.forEach(item => {
    //     const option = document.createElement("option");
    //     option.value = item.nombre_comun;
    //     if (item.n) {
    //         option.label = `${item.nombre_cientifico} (${item.n})`;
    //     }
    //     listaElement.appendChild(option);
    // });

    const buscador = document.getElementById("buscador");
    if (!buscador) return;

 
    buscador.addEventListener("input", function () {
        const valor = this.value;
        actualizar_sugerencias_busqueda(valor);
        if (busqueda_lista.some(item => item.nombre_comun.trim().toLowerCase().includes(valor.trim().toLowerCase())) && valor.length > 3) {
            seleccion.busqueda = valor;
            iniciar_filtros();

            seleccion.reino   = null;
            seleccion.orden   = null;
            seleccion.familia = null;
            seleccion.nombre  = null;
            seleccion.riesgo  = null;
        } else {
            seleccion.busqueda = null;
        }

        modo_actual = null;
        actualizar_mapa(datos = taxonomia);
    });


}

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


// Checkbocxes de Riesgo, para saber cuales estan activos y filtrar mapa

function actualizar_riesgo() {

    let activos = [];

    if (document.getElementById("checkbox_endemicas").checked) {
        activos.push("endemicas");
    }
    
    document.querySelectorAll("[data-nombre]").forEach(checkbox => {
        if (checkbox.checked) {
            activos.push(checkbox.dataset.nombre);
        }
    });

    if (activos.length > 0) {
        seleccion.riesgo = activos;
        seleccion.busqueda = null;
        seleccion.reino    = null;
        seleccion.orden    = null;
        seleccion.familia  = null;
        seleccion.nombre   = null;
        document.getElementById("buscador").value = "";
        iniciar_filtros();
    } else {
        seleccion.riesgo = null;
    }

    modo_actual = null;
    actualizar_mapa(datos = taxonomia);



}










// Para iniciar el proceso 
document.addEventListener("DOMContentLoaded", async () => {
    const cargados = await cargarDiccionariosAplicacion();
    if (!cargados) {
        console.error("No se pudieron cargar los datos JSON para inicializar la aplicación.");
        return;
    }

    iniciar_filtros();
    inicializar_busqueda();

    document.getElementById(selector_ids.reino)
        .addEventListener("change", al_cambiar_reino);

    document.getElementById(selector_ids.orden)
        .addEventListener("change", al_cambiar_orden);

    document.getElementById(selector_ids.familia)
        .addEventListener("change", al_cambiar_familia);

    document.getElementById(selector_ids.nombre)
        .addEventListener("change", al_cambiar_nombre);


    // Selectores de Riesgo
    iniciar_filtros_riesgo();

    document.getElementById(selector_ids_riesgo.reino)
        .addEventListener("change", al_cambiar_reino_riesgo);

    document.getElementById(selector_ids_riesgo.orden)
        .addEventListener("change", al_cambiar_orden_riesgo);

    document.getElementById(selector_ids_riesgo.familia)
        .addEventListener("change", al_cambiar_familia_riesgo);

    document.getElementById(selector_ids_riesgo.nombre)
        .addEventListener("change", al_cambiar_nombre_riesgo);

    // Actualizar cuando hacemos click en los checkboxes de riesgo
    document.getElementById("checkbox_endemicas").addEventListener("change", actualizar_riesgo);
    document.querySelectorAll("[data-nombre]").forEach(checkbox => {
        checkbox.addEventListener("change", actualizar_riesgo);
    });


    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", function () {
            const seccion = this.dataset.seccion;

            if (seccion === "riesgo") {
                seleccion.riesgo   = [];
                seleccion.busqueda = null;
                seleccion.reino    = null;
                seleccion.orden    = null;
                seleccion.familia  = null;
                seleccion.nombre   = null;
                document.getElementById("buscador").value = "";
                iniciar_filtros();
                modo_actual = null;
                actualizar_riesgo();
                actualizar_mapa(datos = taxonomia);

            } else if (seccion === "mapa") {
                seleccion.riesgo = null;
                modo_actual = null;
                actualizar_mapa(datos = taxonomia);
            }
        });
    });

    generar_datos_filtrados(datos = taxonomia);
    actualizar_mapa(datos = taxonomia);
});
