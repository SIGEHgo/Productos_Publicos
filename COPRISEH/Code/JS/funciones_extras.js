

function ajustar_mapa_suave(){
  const inicio = performance.now();
  (function paso(t){
    window.MapaCOPRISEH.mapa.invalidateSize();
    if (t - inicio < 250) requestAnimationFrame(paso);
  })(inicio);
}

function abrir_panel_filtros(){
  document.getElementById('filtros_panel').classList.remove('collapsed');
  document.getElementById('boton_filtros').classList.remove('show');
  ajustar_mapa_suave();
}

function cerrar_panel_filtros(){
  document.getElementById('filtros_panel').classList.add('collapsed');
  ajustar_mapa_suave();
}



document.getElementById('boton_filtros').addEventListener('click', function() {
  const panel = document.getElementById('filtros_panel');
    if (panel.classList.contains('collapsed')) {
        abrir_panel_filtros();
    } else {
        cerrar_panel_filtros();
    }
});

















////////////////////////////////////////
// Funciones para el panel de filtros //
////////////////////////////////////////

let PARAMETROS = [
  'Arsénico',
  'Cloro',
  'Cloruros',
  'Color',
  'Dureza Total',
  'Fluoruros',
  'Manganeso',
  'Nitritos',
  'pH',
  'Plomo',
  'Sólidos Totales',
  'Sulfatos',
  'Turbiedad'
];

// El generador recibe la misma lista usada por los filtros, evitando mantener
// una segunda definición de parámetros en reporte.js.
if (window.ReporteCOPRISEH) {
  window.ReporteCOPRISEH.configurarParametros(PARAMETROS);
}


const MOTIVOS = ['Alerta/Brote', 'Denuncia', 'Emergencias', 'Normal'];

const PROCEDENCIAS = [
  'Arroyo',
  'Deposito',
  'Drenaje',
  'Manantial',
  'Planta potabilizadora',
  'Pozo',
  'Toma domiciliaria'
];

function crearChip({ texto, atributo, conPunto = false, alCambiar }) {
  const chip = document.createElement('label');
  chip.className = 'chip checked';
  chip.dataset[atributo] = texto;

  const punto = conPunto ? '<span class="dot"></span>' : '';
  chip.innerHTML = `<input type="checkbox" checked>${punto}${texto}`;

  const checkbox = chip.querySelector('input');

  chip.addEventListener('click', (evento) => {
    // Evitamos el comportamiento nativo del label para controlar nosotros mismos el estado del checkbox.
    evento.preventDefault();

  
    checkbox.checked = !checkbox.checked;

    chip.classList.toggle('checked', checkbox.checked);

    if (alCambiar) {
      alCambiar();
    }
  });

  return chip;
}


function agregarChips({ contenedorId, opciones, atributo, conPunto = false, alCambiar }) {
  const contenedor = document.getElementById(contenedorId);

  opciones.forEach((opcion) => {
    const chip = crearChip({ texto: opcion, atributo, conPunto, alCambiar });
    contenedor.appendChild(chip);
  });
}


function construirChips() {
  agregarChips({
    contenedorId: 'chipsMotivo',
    opciones: MOTIVOS,
    atributo: 'motivo',
    conPunto: true,
    alCambiar: aplicarFiltros
  });

  agregarChips({
    contenedorId: 'chipsProcedencia',
    opciones: PROCEDENCIAS,
    atributo: 'procedencia',
    alCambiar: aplicarFiltros
  });

  // agregarChips({
  //   contenedorId: 'chipsParametros',
  //   opciones: PARAMETROS,
  //   atributo: 'parametro'
  //   // alCambiar: applyFilters
  // });
}

construirChips();




// Crea UN elemento de filtro tipo "checkbox" (casilla + ícono de color + texto).
function crearCheckItem({ texto, atributo, color, conForma = false, alCambiar }) {
  const item = document.createElement('label');
  item.className = 'check-item checked';
  item.dataset[atributo] = texto;

  // Si hay color, lo dejamos disponible para el CSS como variable --swatch
  if (color) {
    item.style.setProperty('--swatch', color);
  }

  // Ícono con la forma y el color del elemento (solo si se pide)
  const forma = conForma
    ? shapeSvg(texto, color).replace('class="mk ', 'class="swatch-shape mk ')
    : '';

  item.innerHTML = `
    <input type="checkbox" checked>
    <span class="check-box"></span>
    ${forma}
    <span>${texto}</span>
  `;

  const checkbox = item.querySelector('input');

  item.addEventListener('click', (evento) => {

    evento.preventDefault();


    checkbox.checked = !checkbox.checked;

    item.classList.toggle('checked', checkbox.checked);

    if (alCambiar) {
      alCambiar();
    }
  });

  return item;
}



function agregarCheckItems({ contenedorId, opciones, atributo, colores = {}, conForma = false, alCambiar }) {
  const contenedor = document.getElementById(contenedorId);

  opciones.forEach((opcion) => {
    const item = crearCheckItem({
      texto: opcion,
      atributo,
      color: colores[opcion],
      conForma,
      alCambiar
    });
    contenedor.appendChild(item);
  });
}


function construirCheckItems() {
  agregarCheckItems({
    contenedorId: 'chipsParametros',
    opciones: PARAMETROS,
    atributo: 'parametro',
    //colores: PARAMETRO_COLORS,
    //  conForma: true,
    alCambiar: aplicarFiltros
  });
}

construirCheckItems();




////////////////////////////////////////
// Datos y lógica de filtrado          //
////////////////////////////////////////


let datosCOPRISEH = [];


async function cargarDatos() {
 
  const respuesta = await fetch("Outputs/Layers/COPRISEH datos 2026 Hidalgo.json");
  datosCOPRISEH = await respuesta.json();
  document.getElementById('btnDescargarExcel').disabled = false;

  llenarSelect('selectRegion', datosCOPRISEH, 'Región');
  actualizarOpcionesMunicipios();

  aplicarFiltros();
  if (folioSearchInput.value.trim().length >= 2) buscarMuestrasPorFolio(folioSearchInput.value);
}

function llenarSelect(selectId, datos, columna) {
  const select = document.getElementById(selectId);
  const valores = [...new Set(datos.map(registro => registro[columna]))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  valores.forEach(valor => {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = valor;
    select.appendChild(opcion);
  });
}

function actualizarOpcionesMunicipios(region = '') {
  const select = document.getElementById('selectMunicipio');
  select.innerHTML = '<option value="">Todos los municipios</option>';
  const datos = region
    ? datosCOPRISEH.filter(registro => registro['Región'] === region)
    : datosCOPRISEH;
  llenarSelect('selectMunicipio', datos, 'Municipio');
}

// Lee, dentro de un contenedor de chips, cuáles quedaron marcados (checked)
function obtenerSeleccionados(contenedorId, atributo) {
  const marcados = document
    .getElementById(contenedorId)
    .querySelectorAll('input[type="checkbox"]:checked');

  return Array.from(marcados).map(input => input.closest('label').dataset[atributo]);
}

// Dice si el valor de una columna cuenta como "con información" (ni NA, null ni vacío)
function tieneValor(valor) {
  return valor !== undefined && valor !== null && valor !== '' && valor !== 'NA';
}

// Filtra por Motivo (columna "Motivo")
function filtrarPorMotivo(datos, motivos) {
  const resultado = datos.filter(registro => motivos.includes(registro.Motivo));

  console.log('[Filtro Motivo] seleccionados:', motivos, '-> registros restantes:', resultado.length);
  return resultado;
}

// Filtra por Procedencia (columna "Procedencia_Muestra")
function filtrarPorProcedencia(datos, procedencias) {
  const resultado = procedencias.length
    ? datos.filter(registro => procedencias.includes(registro.Procedencia_Muestra))
    : datos;

  console.log('[Filtro Procedencia] seleccionados:', procedencias, '-> registros restantes:', resultado.length);
  return resultado;
}

// Filtra por Ubicación: región (columna "Región"), municipio (columna "Municipio")
function filtrarPorUbicacion(datos, region, municipio) {
  let resultado = datos;

  if (region) {
    resultado = resultado.filter(registro => registro['Región'] === region);
  }
  if (municipio) {
    resultado = resultado.filter(registro => registro.Municipio === municipio);
  }

  console.log(
    '[Filtro Ubicación] región:', region || 'todas', '| municipio:', municipio || 'todos',
    '-> registros restantes:', resultado.length
  );
  return resultado;
}

// Filtra por rango de fechas de toma (columna "Fecha_Toma")
function filtrarPorFecha(datos, desde, hasta) {
  let resultado = datos;

  if (desde) resultado = resultado.filter(registro => registro.Fecha_Toma >= desde);
  if (hasta) resultado = resultado.filter(registro => registro.Fecha_Toma <= hasta);

  console.log(
    '[Filtro Fecha] desde:', desde || 'sin límite', '| hasta:', hasta || 'sin límite',
    '-> registros restantes:', resultado.length
  );
  return resultado;
}

// Filtra por Parámetros: cada parámetro es el nombre exacto de una columna.
// Un registro pasa si tiene información en AL MENOS UNO de los parámetros marcados.
// Una sola función sirve para los 13 parámetros, no hace falta repetirla.
function filtrarPorParametros(datos, columnas) {
  const resultado = columnas.length
    ? datos.filter(registro => columnas.some(columna => tieneValor(registro[columna])))
    : datos;

  console.log('[Filtro Parámetros] columnas evaluadas:', columnas, '-> registros restantes:', resultado.length);
  return resultado;
}

function tieneParametroFueraDeLimite(registro, parametros) {
  return parametros.some(parametro => registro[`${parametro}_L`] === 'Fuera del límite');
}

// Estado filtros
function leerEstadoFiltros() {
  return {
    motivos: obtenerSeleccionados('chipsMotivo', 'motivo'),
    procedencias: obtenerSeleccionados('chipsProcedencia', 'procedencia'),
    parametros: obtenerSeleccionados('chipsParametros', 'parametro'),
    region: document.getElementById('selectRegion').value,
    municipio: document.getElementById('selectMunicipio').value,
    desde: document.getElementById('dateFrom').value,
    hasta: document.getElementById('dateTo').value,
    soloFueraDeLimite: document.getElementById('btnSoloFueraLimite').getAttribute('aria-pressed') === 'true',
  };
}

function obtenerDatosFiltrados(estado = leerEstadoFiltros()) {
  let datosFiltrados = datosCOPRISEH;
  datosFiltrados = filtrarPorMotivo(datosFiltrados, estado.motivos);
  datosFiltrados = filtrarPorProcedencia(datosFiltrados, estado.procedencias);
  datosFiltrados = filtrarPorUbicacion(datosFiltrados, estado.region, estado.municipio);
  datosFiltrados = filtrarPorFecha(datosFiltrados, estado.desde, estado.hasta);
  datosFiltrados = filtrarPorParametros(datosFiltrados, estado.parametros);
  if (estado.soloFueraDeLimite) {
    datosFiltrados = datosFiltrados.filter(registro =>
      tieneParametroFueraDeLimite(registro, estado.parametros)
    );
  }

  return datosFiltrados;
}

function aplicarFiltros() {
  const estado = leerEstadoFiltros();
  const datosFiltrados = obtenerDatosFiltrados(estado);

  actualizarIndicadorFiltroEspacial(estado);

  console.log('[Filtros combinados] total final:', datosFiltrados.length, 'de', datosCOPRISEH.length);

  renderizarMarcadores(datosFiltrados);
  actualizarIndicadores(datosFiltrados, estado.parametros);

  return datosFiltrados;
}

function aplicarFiltroEspacial(tipo, nombre) {
  if (!datosCOPRISEH.length || !nombre) return;

  const regionSelect = document.getElementById('selectRegion');
  const municipioSelect = document.getElementById('selectMunicipio');

  if (tipo === 'region') {
    if (!datosCOPRISEH.some(registro => registro['Región'] === nombre)) return;
    regionSelect.value = nombre;
    actualizarOpcionesMunicipios(nombre);
    municipioSelect.value = '';
  } else if (tipo === 'municipio') {
    const muestra = datosCOPRISEH.find(registro => registro.Municipio === nombre);
    regionSelect.value = muestra ? muestra['Región'] : '';
    actualizarOpcionesMunicipios(regionSelect.value);
    if (![...municipioSelect.options].some(opcion => opcion.value === nombre)) {
      const opcion = document.createElement('option');
      opcion.value = nombre;
      opcion.textContent = nombre;
      municipioSelect.appendChild(opcion);
    }
    municipioSelect.value = nombre;
  } else {
    return;
  }

  aplicarFiltros();
}

function actualizarIndicadorFiltroEspacial({ region, municipio }) {
  const filtro = document.getElementById('spatialFilter');
  const etiqueta = document.getElementById('spatialFilterLabel');
  const valor = municipio ? `Municipio: ${municipio}` : region ? `Región: ${region}` : '';
  etiqueta.textContent = valor;
  filtro.hidden = !valor;
}

function quitarFiltroEspacial() {
  window.MapaCOPRISEH.limpiarSeleccionPoligono();
  document.getElementById('selectRegion').value = '';
  actualizarOpcionesMunicipios();
  document.getElementById('selectMunicipio').value = '';
  aplicarFiltros();
}


////////////////////////////////////////
// Conexión con el mapa y la barra     //
////////////////////////////////////////

// Dibuja en el mapa los puntos de muestra que pasaron los filtros
function renderizarMarcadores(datos) {
  const { capaMarcadores, iconosMotivo } = window.MapaCOPRISEH;
  const motivosActivos = new Set();
  capaMarcadores.clearLayers();

  datos.forEach(registro => {
    if (!tieneValor(registro.Latitud) || !tieneValor(registro.Longitud) ||
        !Number.isFinite(Number(registro.Latitud)) || !Number.isFinite(Number(registro.Longitud))) return;

    const icono = iconosMotivo[registro.Motivo];
    const marcador = L.marker([Number(registro.Latitud), Number(registro.Longitud)], { icon: icono });
    marcador.bindTooltip("Folio: " + String(registro.Folio), { direction: 'top', offset: [0, -8] });
    if (icono) motivosActivos.add(registro.Motivo);
    marcador.on('click', () => abrirDetalleMuestra(registro));
    marcador.addTo(capaMarcadores);
  });

  actualizarLeyendaMarcadores(motivosActivos);
}

function actualizarLeyendaMarcadores(motivosActivos) {
  const { controlLeyendaMarcadores, iconosMotivo } = window.MapaCOPRISEH;
  const contenedor = controlLeyendaMarcadores.getContainer();
  const cuerpo = contenedor.querySelector('.leyenda-marcadores-body');
  const motivos = Object.keys(iconosMotivo).filter(motivo => motivosActivos.has(motivo));

  cuerpo.replaceChildren();
  contenedor.hidden = motivos.length === 0;
  if (!motivos.length) return;

  const lista = document.createElement('div');
  lista.className = 'leyenda-marcadores-lista';

  motivos.forEach(motivo => {
    const fila = document.createElement('div');
    fila.className = 'leyenda-marcadores-fila';

    const icono = document.createElement('img');
    icono.src = iconosMotivo[motivo].options.iconUrl;
    icono.alt = '';
    icono.setAttribute('aria-hidden', 'true');

    const etiqueta = document.createElement('span');
    etiqueta.textContent = motivo;

    fila.append(icono, etiqueta);
    lista.appendChild(fila);
  });

  cuerpo.appendChild(lista);
}

function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, caracter => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[caracter]);
}

function abrirDetalleMuestra(registro) {
  // Guardamos una copia de la muestra activa para que el botón reporte siempre
  // use el registro que abrió este detalle y no uno de un marcador anterior.
  window.muestraSeleccionada = registro ? { ...registro } : null;
  const motivo = tieneValor(registro.Motivo) ? registro.Motivo : '';
  // const badge = document.getElementById('detailBadge');
  const strip = document.getElementById('detailStrip');

  // badge.textContent = motivo || '—';
  // badge.dataset.motivo = motivo;
  strip.dataset.motivo = motivo;
  document.getElementById('detailId').textContent = tieneValor(registro.Folio)
    ? `Folio ${registro.Folio}` : '';
  document.getElementById('detailBody').innerHTML = crearContenidoDetalle(registro);
  const botonDescarga = document.querySelector('#detailBody .detail-download');
  if (window.ReporteCOPRISEH) {
    window.ReporteCOPRISEH.configurarParametros(PARAMETROS);
    window.ReporteCOPRISEH.actualizarEstadoBoton(botonDescarga, window.muestraSeleccionada);
  }
  document.getElementById('detailPanel').classList.add('open');
  document.getElementById('detailPanel').setAttribute('aria-hidden', 'false');
  document.getElementById('scrim').classList.add('show');
}

// Construye las filas y la tabla de parámetros según las columnas del registro.
function crearContenidoDetalle(registro) {
  const mostrar = valor => tieneValor(valor) ? escaparHtml(valor) : '—';
  const campos = [
    ['Motivo', registro.Motivo],
    ['Procedencia', registro.Procedencia_Muestra],
    ['Sitio exacto', registro.Sitio_Exacto],
    ['Fecha', window.ReporteCOPRISEH.formatearFecha(registro.Fecha_Toma)],
    ['Responsable', registro.Nombre_Responsable_Toma_Muestra],
    ['Región', registro['Región']],
    ['Municipio', registro.Municipio],
    ['Localidad', registro.Localidad],
    ['Coordenadas', tieneValor(registro.Latitud) && tieneValor(registro.Longitud)
      ? `${registro.Latitud}, ${registro.Longitud}` : null]
  ];
  const parametros = Object.keys(registro)
    .filter(columna => !columna.endsWith('_L') &&
      Object.prototype.hasOwnProperty.call(registro, `${columna}_L`) && tieneValor(registro[columna]))
    .map(columna => `<tr><td><span>${escaparHtml(columna)}</span><small>${escaparHtml(registro[columna])}</small></td><td>${mostrar(registro[`${columna}_L`])}</td></tr>`)
    .join('');

  return `
    ${campos.map(([etiqueta, valor]) => `<div class="detail-row"><div class="dl">${etiqueta}</div><div class="dv">${mostrar(valor)}</div></div>`).join('')}
    <section class="detail-parameters">
      <h3>Parámetros</h3>
      <table>
        <thead><tr><th>Parámetro</th><th>Condición</th></tr></thead>
        <tbody>${parametros || '<tr><td colspan="2">Sin parámetros disponibles</td></tr>'}</tbody>
      </table>
    </section>
    <button class="detail-download" type="button" disabled>Descargar reporte</button>`;
}

function cerrarDetalleMuestra() {
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('detailPanel').setAttribute('aria-hidden', 'true');
  document.getElementById('scrim').classList.remove('show');
  window.muestraSeleccionada = null;
}

document.getElementById('btnCloseDetail').addEventListener('click', cerrarDetalleMuestra);
document.getElementById('scrim').addEventListener('click', cerrarDetalleMuestra);

// Actualiza los números de la barra superior según los datos ya filtrados
function actualizarIndicadores(datos, parametros) {
  document.getElementById('valorIndicador1').textContent = datos.length;
  document.getElementById('valorIndicador2').textContent = parametros.length;
  document.getElementById('valorIndicador3').textContent = new Set(datos.map(r => r.Municipio)).size;
  document.getElementById('valorIndicador4').textContent = new Set(datos.map(r => r['Región'])).size;
  document.getElementById('valorIndicador5').textContent = datos.filter(registro =>
    tieneParametroFueraDeLimite(registro, parametros)
  ).length;
}


////////////////////////////////////////
// Eventos del panel de filtros        //
////////////////////////////////////////

// Vuelve a marcar todos los chips y vacía selects/fechas (estado inicial)
function limpiarFiltros() {
  window.MapaCOPRISEH.limpiarSeleccionPoligono();
  document
    .querySelectorAll('#chipsMotivo input, #chipsProcedencia input, #chipsParametros input')
    .forEach(input => {
      input.checked = true;
      input.closest('label').classList.add('checked');
    });

  const filtroFueraDeLimite = document.getElementById('btnSoloFueraLimite');
  filtroFueraDeLimite.setAttribute('aria-pressed', 'false');
  filtroFueraDeLimite.classList.remove('checked');

  document.getElementById('selectRegion').value = '';
  actualizarOpcionesMunicipios();
  document.getElementById('selectMunicipio').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';

  aplicarFiltros();
}

document.getElementById('btnClearFilters').addEventListener('click', limpiarFiltros);
document.getElementById('btnClearSpatialFilter').addEventListener('click', quitarFiltroEspacial);
document.getElementById('btnDescargarExcel').addEventListener('click', function () {
  const datosFiltrados = obtenerDatosFiltrados();
  const hoja = XLSX.utils.json_to_sheet(datosFiltrados, {
    header: Object.keys(datosCOPRISEH[0] || {})
  });
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Muestras');
  XLSX.writeFile(libro, 'Indicadores-Microbiológicos-Fisicoquímicos-filtradas.xlsx');
});
document.getElementById('btnSoloFueraLimite').addEventListener('click', function () {
  const activo = this.getAttribute('aria-pressed') !== 'true';
  this.setAttribute('aria-pressed', String(activo));
  this.classList.toggle('checked', activo);
  aplicarFiltros();
});

const folioSearchInput = document.getElementById('folioSearchInput');
const folioSearchResults = document.getElementById('folioSearchResults');

function buscarMuestrasPorFolio(consulta) {
  const texto = consulta.trim().toLocaleLowerCase('es-MX');
  folioSearchResults.replaceChildren();

  if (texto.length < 2) {
    folioSearchResults.classList.remove('show');
    return;
  }

  const coincidencias = datosCOPRISEH
    .filter(registro => tieneValor(registro.Folio) &&
      String(registro.Folio).toLocaleLowerCase('es-MX').includes(texto))
    .slice(0, 20);

  if (!coincidencias.length) {
    const vacio = document.createElement('div');
    vacio.className = 'search-empty';
    vacio.textContent = `Sin coincidencias para "${consulta.trim()}".`;
    folioSearchResults.appendChild(vacio);
  } else {
    coincidencias.forEach(registro => {
      const resultado = document.createElement('button');
      resultado.type = 'button';
      resultado.className = 'search-result-item';

      const titulo = document.createElement('span');
      titulo.className = 'sr-title';
      titulo.textContent = `Folio ${registro.Folio}`;

      const meta = document.createElement('span');
      meta.className = 'sr-meta';
      meta.textContent = [
        ['Municipio', registro.Municipio],
        ['Motivo', registro.Motivo],
        ['Procedencia', registro.Procedencia_Muestra]
      ]
        .filter(([, valor]) => tieneValor(valor))
        .map(([etiqueta, valor]) => `${etiqueta}: ${valor}`)
        .join(', ');

      resultado.append(titulo, meta);
      resultado.addEventListener('click', () => {
        const latitud = Number(registro.Latitud);
        const longitud = Number(registro.Longitud);
        if (tieneValor(registro.Latitud) && tieneValor(registro.Longitud) &&
            Number.isFinite(latitud) && Number.isFinite(longitud)) {
          window.MapaCOPRISEH.mapa.setView([latitud, longitud], 18);
        }
        abrirDetalleMuestra(registro);
        folioSearchInput.value = String(registro.Folio);
        folioSearchResults.classList.remove('show');
      });
      folioSearchResults.appendChild(resultado);
    });
  }

  folioSearchResults.classList.add('show');
}

folioSearchInput.addEventListener('input', () => buscarMuestrasPorFolio(folioSearchInput.value));
folioSearchInput.addEventListener('focus', () => {
  if (folioSearchInput.value.trim().length >= 2) folioSearchResults.classList.add('show');
});
document.addEventListener('click', evento => {
  if (!evento.target.closest('.map-search')) folioSearchResults.classList.remove('show');
});

function configurarPanelColapsable(panel, boton) {
  boton.addEventListener('click', function () {
    const colapsado = panel.classList.toggle('collapsed');
    this.setAttribute('aria-expanded', String(!colapsado));
  });
}

configurarPanelColapsable(document.getElementById('layersPanel'), document.getElementById('layersToggle'));
const contenedorLeyenda = window.MapaCOPRISEH.controlLeyendaMarcadores.getContainer();
configurarPanelColapsable(contenedorLeyenda, contenedorLeyenda.querySelector('.layers-head'));

// Al cambiar de región, el select de municipio solo muestra los municipios de esa región
document.getElementById('selectRegion').addEventListener('change', function () {
  actualizarOpcionesMunicipios(this.value);
  aplicarFiltros();
});
document.getElementById('selectMunicipio').addEventListener('change', aplicarFiltros);
document.getElementById('dateFrom').addEventListener('change', aplicarFiltros);
document.getElementById('dateTo').addEventListener('change', aplicarFiltros);

cargarDatos();

