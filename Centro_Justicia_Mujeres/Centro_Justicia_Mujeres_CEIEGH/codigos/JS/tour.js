// La funcion de esperar elemento lo hizo claude por el motivo de que el tour no funcionaba como queria en el apartado de ficha, lo que se me hace ineresante es el uso de
// MutationObserver es como un callback de dash, quedo al pendiente de investigar mas

function esperarElemento(selector, { timeout = 5000, root = document } = {}) {
  return new Promise((resolve, reject) => {
    const existente = root.querySelector(selector);
    if (existente) {
      resolve(existente);
      return;
    }

    const observer = new MutationObserver(() => {
      const elemento = root.querySelector(selector);
      if (elemento) {
        observer.disconnect();
        clearTimeout(temporizador);
        resolve(elemento);
      }
    });

    observer.observe(root, { childList: true, subtree: true });

    const temporizador = setTimeout(() => {
      observer.disconnect();
      const elemento = root.querySelector(selector);
      if (elemento) {
        resolve(elemento);
      } else {
        reject(new Error(`Tiempo de espera agotado buscando "${selector}"`));
      }
    }, timeout);
  });
}


function abrirPopupColonia(nombreColonia) {
  return new Promise((resolve, reject) => {
    if (typeof datos_capa === "undefined" || !datos_capa) {
      reject(new Error("El mapa todavía no está listo (datos_capa no existe)."));
      return;
    }

    let capaEncontrada = null;
    datos_capa.eachLayer(function (layer) {
      if (
        layer.feature &&
        layer.feature.properties.Localidad_correcion === nombreColonia
      ) {
        capaEncontrada = layer;
      }
    });

    if (!capaEncontrada) {
      reject(new Error(`No se encontró la colonia "${nombreColonia}" en el mapa.`));
      return;
    }

    capaEncontrada.fire("click");

    esperarElemento("#ficha")
      .then((ficha) => {

        setTimeout(() => resolve(ficha), 300);
      })
      .catch(reject);
  });
}


async function startDashboardTour() {
  document.querySelectorAll(".sidebar-link")[0].click();

  const seleccion_municipio_tour = document.getElementById("selector_municipio");
  seleccion_municipio_tour.value = "Pachuca_de_Soto";
  document.getElementById("selector_anio").value = "2025";
  document.getElementById("selector_violencia").value = "Violencia Psicologica";
  document.getElementById("selector_modalidad").value = "Modalidad Familiar";
  seleccion_municipio_tour.dispatchEvent(new Event("change", { bubbles: true }));


  let elementoFicha = null;
  try {
    elementoFicha = await abrirPopupColonia("CENTRO (Colonia)");
    elementoFicha.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.warn("No se pudo preparar la ficha de la colonia para el tour:", error);
  }


  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: document.querySelector("#sidebar"),
        intro:
          "Menú lateral, puedes navegar por las diferentes secciones del sitio web.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('a[data-seccion="mapa"]'),
        intro:
          "Al seleccionar esta sección, se abrirá el mapa interactivo.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector("#map"),
        intro:
          "El mapa muestra el porcentaje de mujeres en situación de violencia de género que son usuarias del CJMH.",
        position: "left",
      },
      {
        element: document.querySelector(".info"),
        intro:
          "Aquí se muestran los datos seleccionados para generar el mapa: tipo de violencia, modalidad, año y municipio. La información corresponde a las personas afectadas según estos criterios. ",
        position: "left",
      },
      {
        element: document.querySelector(".legend_seguridad"),
        intro:
          "La paleta de colores muestra la cantidad de usuarias en cada colonia. Colores más fuertes indican una mayor cantidad de usuarias",
        position: "left",
      },
      {
        element: elementoFicha || document.querySelector("#ficha"),
        intro: "Ficha de la colonia seleccionada",
        position: "left",
      },
      {
        element: document.querySelector('a[data-seccion="capas"]'),
        intro:
          "Al seleccionar esta seccion, se mostrarán las diferentes capas de información disponibles en el mapa.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector("#capas-contenido"),
        intro: "Podemos seleccionar diferentes filtros para consultar la información.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('a[data-seccion="graficas"]'),
        intro: "Al seleccionar esta seccion, se mostrarán las graficas de información disponibles en el sitio web.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('#graficas_entorno'),
        intro: "Entorno de graficas, las cuales se actualizan de acuerdo a la selección de los filtros.",
        position: "left",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('#fullscreenBtn'),
        intro: "Permite visualizar la grafica en pantalla completa.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('a[data-seccion="busqueda"]'),
        intro: "Al seleccionar esta seccion, se nos permitirá buscar una colonia en específico. La busqueda nos mostrará la información de la colonia en el mapa y en las graficas.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('#busqueda-contenido'),
        intro: "Ejemplo de colonia buscada:",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('#boton_descargar_reporte'),
        intro: "Descarga de reporte:",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('a[data-seccion="informacion"]'),
        intro: "Al seleccionar esta seccion, se desplegará un panel con información sobre los datos, la metodología y sobre lo mostrado en el sitio web.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
      {
        element: document.querySelector('a[data-seccion="tour"]'),
        intro: "Este botón permite iniciar el tour nuevamente.",
        position: "right",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
      },
    ],
    showBullets: true,
    showProgress: true,
    showStepNumbers: true,
    stepNumbersOfLabel: "de",
    exitOnEsc: true,
    exitOnOverlayClick: true,
    nextLabel: "Siguiente",
    prevLabel: "Anterior",
    skipLabel: "Omitir tour",
    doneLabel: "Entendido",
  });

  // Linea para saber cual es la seleccion del sidebar
  // document.querySelectorAll('.sidebar-link.active')[0].dataset.seccion

  // Simular clic
  // document.querySelectorAll(".sidebar-link")[2].click()

  tour.onbeforechange(function (targetElement) {
    if (!targetElement) return;

    const seccion = targetElement.dataset?.seccion || targetElement.id;
    //console.log("Sección actual del tour:", seccion);

    switch (seccion) {
      case "mapa":
        document.querySelectorAll(".sidebar-link")[0].click(); // Le hacemos click a la seccion de mapa
        break;

      case "ficha":
        if (!document.getElementById("ficha")) {
          abrirPopupColonia("CENTRO (Colonia)").catch((err) =>
            console.warn("No se pudo reabrir la ficha durante el tour:", err)
          );
        }
        break;

      case "capas":
        document.querySelectorAll(".sidebar-link")[1].click();
        break;

      case "graficas":
        document.querySelectorAll(".sidebar-link")[3].click();
        break;

      case "busqueda":
        document.querySelectorAll(".sidebar-link")[2].click();

        let simular_busqueda = document.getElementById("buscador");
        simular_busqueda.value = "AMPLIACIÓN SANTA JULIA (Colonia)";
        simular_busqueda.dispatchEvent(new Event("change", { bubbles: true }));

        break;
    }
  });

  tour.start();
}