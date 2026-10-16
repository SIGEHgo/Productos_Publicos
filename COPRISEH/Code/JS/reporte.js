/*
 * Generador de reportes COPRISEH en PDF.
 *
 * Responsabilidades de este archivo:
 *   1. Preparar la información de una sola muestra y cruzarla con el diccionario.
 *   2. Resolver y cargar logos/mapas sin acoplar el diseño a su ubicación de origen.
 *   3. Dibujar un PDF A1 de dos páginas con jsPDF, siguiendo el archivo de referencia.
 *   4. Atender el botón .detail-download creado dinámicamente por funciones_extras.js.
 *
 * Puntos de ajuste habituales:
 *   - Colores, medidas, tipografía y posiciones: objeto DISENO.
 *   - Parámetros: se reciben desde PARAMETROS en funciones_extras.js.
 *   - Columnas y nombres de los mapas: resolverRutaImagen().
 *   - Estados: obtenerEstadoCumplimiento(). Solo se reconocen los estados que usa
 *     actualmente la base: "Límite permisible", "Fuera del límite" y "Pendiente".
 *
 * No se comparan valores numéricos con límites. La columna *_L ya contiene la
 * evaluación de la muestra; si su valor no es conocido, el resultado es pendiente.
 */
(function (window, document) {
  'use strict';

  const RUTAS = {
    diccionario: 'Outputs/Layers/Diccionario.json',
    imagenes: 'https://d1kmr0gm277e0b.cloudfront.net',
    iconosMotivo: 'Img/Markes Icon',
    logotipoPlaneacion: 'Img/Logotipo_Planeacion.png',
    logotipoSalud: 'Img/Logotipo_Salud.png'
  };

  // Mantiene el orden y los nombres visibles de la leyenda del mapa.
  const MOTIVOS_LEYENDA = [
    { motivo: 'Normal', archivo: 'green.png' },
    { motivo: 'Denuncia', archivo: 'orange.png' },
    { motivo: 'Alerta/Brote', archivo: 'red.png' },
    { motivo: 'Emergencias', archivo: 'violet.png' }
  ];

  // Paleta y geometría derivadas del reporte COPRISEH Lalo.pdf.
  // Las posiciones están en mm sobre una página A1 vertical (594 x 841 mm).
  const DISENO = {
    pagina: { ancho: 594, alto: 841 },
    margen: 36,
    colores: {
      guinda: [98, 17, 50],       // Guinda institucional empleado en el PDF.
      oro: [179, 142, 93],       // Filetes y etiquetas institucionales.
      texto: [39, 35, 36],
      secundario: [98, 90, 92],
      borde: [220, 213, 208],
      separador: [231, 226, 222],
      fondo: [248, 245, 243],
      blanco: [255, 255, 255],
      cumple: [36, 112, 77]      // Verde usado para cumplimiento en la referencia alterna.
    },
    pie: { lineaY: 814, bandaY: 834, bandaAlto: 7 },
    tabla: {
      encabezadoAlto: 30,
      continuacionEncabezadoAlto: 19,
      // Tamaños de lectura pensados para una hoja A1 y su vista ajustada al visor.
      filaMinima: 31,
      columnas: [142, 106, 142, 132],
      tamanoEncabezado: 24,
      tamanoCelda: 28
    }
  };

  let parametrosConfigurados = [];
  let diccionario = [];
  let generacionEnCurso = false;
  const cacheImagenes = new Map();

  // El catálogo es una lista de objetos {Parametros, Unidades, Limites permisibles}.
  // Si no puede cargarse, se permite generar el PDF con límites/unidades vacíos.
  const diccionarioListo = cargarDiccionario();

  function cargarDiccionario() {
    return fetch(RUTAS.diccionario)
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        return respuesta.json();
      })
      .then(datos => {
        diccionario = Array.isArray(datos) ? datos : [];
        return diccionario;
      })
      .catch(error => {
        console.warn('[Reporte COPRISEH] No se pudo cargar el diccionario; se omiten unidades y límites:', error);
        diccionario = [];
        return diccionario;
      });
  }

  /**
   * Devuelve una forma comparable de una etiqueta; conserva aparte el texto
   * original para mostrarlo en el PDF. Esto absorbe acentos/espacios distintos
   * sin suponer nombres de columnas que no estén en el registro.
   */
  function normalizarClave(valor) {
    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLocaleLowerCase('es-MX');
  }

  /**
   * Convierte valores ausentes de la base en una cadena vacía para su presentación.
   * El cero numérico es un valor medido válido; "Pendiente" no es una medición.
   */
  function valorDisponible(valor) {
    if (valor === null || valor === undefined) return false;
    if (typeof valor === 'number') return Number.isFinite(valor);
    if (typeof valor !== 'string') return Boolean(valor);
    const texto = valor.trim();
    if (!texto) return false;
    return !['na', 'n/a', 'null', 'undefined', 'pendiente', '—', '-'].includes(normalizarClave(texto));
  }

  function textoSeguro(valor, reemplazo = '—') {
    return valorDisponible(valor) ? String(valor).trim() : reemplazo;
  }

  // "Pendiente" es un límite de referencia válido (por ejemplo, Cloruros),
  // aunque no sea un valor numérico medido. Se preserva al mostrar el diccionario.
  function textoDeReferencia(valor) {
    if (valor === null || valor === undefined) return '—';
    const texto = String(valor).trim();
    if (!texto || ['na', 'n/a', 'null', 'undefined'].includes(normalizarClave(texto))) return '—';
    return texto;
  }

  /** Busca una columna sin ignorar el nombre real que se usará para consultarla. */
  function buscarClave(objeto, nombre) {
    if (!objeto || typeof objeto !== 'object') return undefined;
    if (Object.prototype.hasOwnProperty.call(objeto, nombre)) return nombre;
    const claveNormalizada = normalizarClave(nombre);
    return Object.keys(objeto).find(clave => normalizarClave(clave) === claveNormalizada);
  }

  /** Formatea fechas ISO como en la referencia (por ejemplo, "19 de enero de 2026"). */
  function formatearFecha(valor) {
    if (!valorDisponible(valor)) return '—';
    const original = String(valor).trim();
    const iso = original.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const fecha = iso
      ? new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])))
      : new Date(original);
    if (Number.isNaN(fecha.getTime())) return original;
    try {
      return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
      }).format(fecha);
    } catch (_) {
      return original;
    }
  }

  /**
   * Traduce exclusivamente los valores de estado documentados en los datos/R.
   * "cumple", "no cumple" y cualquier estado desconocido se representan con
   * iconos vectoriales; así no dependemos de que Helvetica tenga el glifo ✓.
   */
  function obtenerEstadoCumplimiento(valor) {
    const estado = normalizarClave(valor);
    if (estado === 'limite permisible') return 'cumple';
    if (estado === 'fuera del limite') return 'no-cumple';
    return 'pendiente';
  }

  function crearIndiceDiccionario(filasDiccionario) {
    const indice = new Map();
    (Array.isArray(filasDiccionario) ? filasDiccionario : []).forEach(fila => {
      if (!fila || typeof fila !== 'object') return;
      const clave = buscarClave(fila, 'Parametros');
      if (clave && valorDisponible(fila[clave])) indice.set(normalizarClave(fila[clave]), fila);
    });
    return indice;
  }

  /**
   * Prepara una fila por parámetro medido en el registro seleccionado.
   * La lista PARAMETROS y el sufijo _L proceden de la estructura real del proyecto.
   * Los límites y unidades vienen del diccionario; sin coincidencia se dejan vacíos.
   */
  function construirFilasResultados(registro, listaParametros, filasDiccionario) {
    const indiceDiccionario = crearIndiceDiccionario(filasDiccionario);
    return (Array.isArray(listaParametros) ? listaParametros : [])
      .map(nombreParametro => {
        const claveValor = buscarClave(registro, nombreParametro);
        if (!claveValor || !valorDisponible(registro[claveValor])) return null;

        const filaDiccionario = indiceDiccionario.get(normalizarClave(nombreParametro));
        const claveUnidad = filaDiccionario && buscarClave(filaDiccionario, 'Unidades');
        const claveLimite = filaDiccionario && buscarClave(filaDiccionario, 'Limites permisibles');
        const claveEstado = buscarClave(registro, `${nombreParametro}_L`);
        const unidad = claveUnidad ? textoSeguro(filaDiccionario[claveUnidad], '') : '';
        const valorMedido = String(registro[claveValor]).trim();

        return {
          parametro: String(nombreParametro),
          valor: [valorMedido, unidad].filter(Boolean).join(' '),
          limites: claveLimite ? textoDeReferencia(filaDiccionario[claveLimite]) : '—',
          estado: obtenerEstadoCumplimiento(claveEstado ? registro[claveEstado] : null)
        };
      })
      .filter(Boolean);
  }

  /** Separa y normaliza todos los campos que utiliza la composición visual. */
  function prepararDatosReporte(registro, listaParametros, filasDiccionario) {
    const latitud = buscarClave(registro, 'Latitud');
    const longitud = buscarClave(registro, 'Longitud');
    const coordenadas = latitud && longitud && valorDisponible(registro[latitud]) && valorDisponible(registro[longitud])
      ? `${String(registro[latitud]).trim()}, ${String(registro[longitud]).trim()}`
      : '—';

    const tomar = nombre => {
      const clave = buscarClave(registro, nombre);
      return clave ? registro[clave] : null;
    };

    return {
      folio: textoSeguro(tomar('Folio'), 'sin-folio'),
      datosMuestra: {
        motivo: textoSeguro(tomar('Motivo')),
        procedencia: textoSeguro(tomar('Procedencia_Muestra')),
        sitio: textoSeguro(tomar('Sitio_Exacto')),
        fecha: formatearFecha(tomar('Fecha_Toma')),
        responsable: textoSeguro(tomar('Nombre_Responsable_Toma_Muestra')),
        medidos: textoSeguro(tomar('Medidos')),
        dentro: textoSeguro(tomar('Dentro')),
        fuera: textoSeguro(tomar('Fuera'))
      },
      ubicacion: {
        region: textoSeguro(tomar('Región')),
        municipio: textoSeguro(tomar('Municipio')),
        localidad: textoSeguro(tomar('Localidad')),
        coordenadas
      },
      resultados: construirFilasResultados(registro, listaParametros, filasDiccionario)
    };
  }

  /**
   * Único punto que resuelve la ubicación de los mapas. Para migrar a AWS basta
   * con cambiar esta función para devolver URL firmadas o rutas del bucket.
   */
  function resolverRutaImagen(folio, nivel) {
    const nivelesValidos = new Set(['A', 'B', 'C']);
    if (!nivelesValidos.has(nivel)) throw new Error(`Nivel de mapa no válido: ${nivel}`);
    const folioSeguro = encodeURIComponent(String(folio).trim());
    return `${RUTAS.imagenes}/${nivel}/${folioSeguro}_${nivel}.png`;
  }

  /** Carga una ruta local como JPEG comprimido para reducir el tamaño del PDF. */
  function cargarImagen(ruta) {
    if (cacheImagenes.has(ruta)) return cacheImagenes.get(ruta);

    const promesa = fetch(ruta)
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}: ${ruta}`);
        return respuesta.blob();
      })
      .then(blob => new Promise((resolve, reject) => {
        const urlTemporal = URL.createObjectURL(blob);
        const imagen = new Image();
        imagen.onload = () => {
          try {
            const lienzo = document.createElement('canvas');
            lienzo.width = imagen.naturalWidth;
            lienzo.height = imagen.naturalHeight;
            const contexto = lienzo.getContext('2d');
            if (!contexto) throw new Error('No fue posible crear el lienzo de imagen.');
            // El fondo blanco conserva la transparencia de los logos sobre el papel.
            contexto.fillStyle = '#ffffff';
            contexto.fillRect(0, 0, lienzo.width, lienzo.height);
            contexto.drawImage(imagen, 0, 0);
            const dataUrl = lienzo.toDataURL('image/jpeg', 0.9);
            URL.revokeObjectURL(urlTemporal);
            resolve({ dataUrl, ancho: lienzo.width, alto: lienzo.height });
          } catch (error) {
            URL.revokeObjectURL(urlTemporal);
            reject(error);
          }
        };
        imagen.onerror = () => {
          URL.revokeObjectURL(urlTemporal);
          reject(new Error(`No se pudo decodificar la imagen: ${ruta}`));
        };
        imagen.src = urlTemporal;
      }))
      .catch(error => {
        // La falta de uno de los mapas/logos no cancela la generación completa.
        console.warn(`[Reporte COPRISEH] Imagen no disponible: ${ruta}`, error);
        return null;
      });

    cacheImagenes.set(ruta, promesa);
    return promesa;
  }

  /** Carga las tres imágenes geográficas en paralelo, manteniendo su orden A/B/C. */
  async function cargarMapas(folio) {
    const niveles = ['A', 'B', 'C'];
    const imagenes = await Promise.all(niveles.map(async nivel => ({
      nivel,
      imagen: await cargarImagen(resolverRutaImagen(folio, nivel))
    })));
    return imagenes;
  }

  /** Carga los iconos directamente desde las definiciones activas de mapa.js. */
  async function cargarIconosMotivoLeyenda() {
    const iconosMotivo = window.MapaCOPRISEH?.iconosMotivo || {};
    return Promise.all(MOTIVOS_LEYENDA.map(async ({ motivo, archivo }) => {
      const iconoConfigurado = iconosMotivo[motivo];
      const rutaConfigurada = iconoConfigurado?.options?.iconUrl;
      let imagen = rutaConfigurada ? await cargarImagen(rutaConfigurada) : null;

      // Conserva la leyenda disponible cuando el CDN de Leaflet no responda.
      if (!imagen) imagen = await cargarImagen(`${RUTAS.iconosMotivo}/${archivo}`);
      return { motivo, imagen };
    }));
  }

  function obtenerConstructorJsPDF() {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    return JsPDF || null;
  }

  /**
   * Carga jsPDF bajo demanda si el primer script CDN no llegó a inicializarse.
   * Se prueban dos orígenes CDN ya compatibles con la arquitectura del sitio;
   * no se descarga ni se instala código en el repositorio.
   */
  async function cargarJsPDF() {
    const disponible = obtenerConstructorJsPDF();
    if (disponible) return disponible;

    const fuentes = [
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js',
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js'
    ];
    let ultimoError;

    for (const url of fuentes) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
          document.head.appendChild(script);
        });
        const constructor = obtenerConstructorJsPDF();
        if (constructor) return constructor;
        throw new Error(`El recurso se cargó, pero no publicó jsPDF: ${url}`);
      } catch (error) {
        ultimoError = error;
        console.warn(`[Reporte COPRISEH] Falló la carga de jsPDF desde ${url}`, error);
      }
    }

    throw new Error(`No se pudo cargar jsPDF desde los CDN configurados. ${ultimoError?.message || ''}`);
  }

  function establecerColor(doc, tipo, color) {
    const rgb = DISENO.colores[color];
    if (!rgb) return;
    if (tipo === 'relleno') doc.setFillColor(...rgb);
    else if (tipo === 'linea') doc.setDrawColor(...rgb);
    else doc.setTextColor(...rgb);
  }

  /** Dibuja una imagen dentro de una caja sin cambiar su relación de aspecto. */
  function dibujarImagenAjustada(doc, imagen, x, y, ancho, alto) {
    if (!imagen) return false;
    const escala = Math.min(ancho / imagen.ancho, alto / imagen.alto);
    const dibujadoAncho = imagen.ancho * escala;
    const dibujadoAlto = imagen.alto * escala;
    const dibujadoX = x + (ancho - dibujadoAncho) / 2;
    const dibujadoY = y + (alto - dibujadoAlto) / 2;
    doc.addImage(imagen.dataUrl, 'JPEG', dibujadoX, dibujadoY, dibujadoAncho, dibujadoAlto, undefined, 'FAST');
    return true;
  }

  function dibujarLogosYPortada(doc, datos, logos) {
    const { margen, colores } = DISENO;
    // Cabecera blanca con los dos logotipos que ya utiliza la aplicación.
    const planeacion = logos[0];
    const salud = logos[1];
    if (planeacion) dibujarImagenAjustada(doc, planeacion, margen, 18, 158, 33);
    else {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(23); establecerColor(doc, 'texto', 'guinda');
      doc.text('PLANEACIÓN', margen, 35);
    }
    doc.setDrawColor(...colores.borde);
    doc.setLineWidth(0.35);
    doc.line(207, 20, 207, 50);
    if (salud) dibujarImagenAjustada(doc, salud, 224, 18, 133, 33);
    else {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(23); establecerColor(doc, 'texto', 'guinda');
      doc.text('SALUD', 224, 35);
    }

    // Banda principal, línea dorada y bloque de folio.
    doc.setFillColor(...colores.guinda);
    doc.rect(0, 66, DISENO.pagina.ancho, 128, 'F');
    doc.setFillColor(...colores.oro);
    doc.rect(0, 192, DISENO.pagina.ancho, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setCharSpace?.(2.2);
    doc.setTextColor(...colores.oro);
    doc.text('REPORTE', margen, 101);
    doc.setCharSpace?.(0);

    doc.setFont('helvetica', 'bold');
    const lineasTitulo = ['Monitoreo de indicadores', 'microbiológicos y fisicoquímicos'];
    const tamanoTituloSolicitado = 72;
    doc.setFontSize(tamanoTituloSolicitado);
    // El título termina antes del recuadro del folio, con un margen de seguridad.
    // Si cambia el texto, reducimos solo lo necesario para conservarlo en dos líneas.
    const anchoMaximoTitulo = 436 - margen - 16;
    const anchoTitulo = Math.max(...lineasTitulo.map(linea => doc.getTextWidth(linea)));
    const tamanoTitulo = Math.min(
      tamanoTituloSolicitado,
      tamanoTituloSolicitado * anchoMaximoTitulo / anchoTitulo
    );
    doc.setFontSize(tamanoTitulo);
    doc.setTextColor(...colores.blanco);
    doc.text(lineasTitulo, margen, 135, { lineHeightFactor: 1.12 });

    doc.setDrawColor(...colores.blanco);
    doc.setLineWidth(0.55);
    doc.rect(436, 95, 122, 68);
    doc.setFontSize(19);
    doc.setTextColor(...colores.oro);
    doc.setCharSpace?.(2.1);
    doc.text('FOLIO', 456, 114);
    doc.setCharSpace?.(0);
    doc.setFontSize(68);
    doc.setTextColor(...colores.blanco);
    const folio = String(datos.folio);
    doc.text(folio, 456, 148, { maxWidth: 82 });
  }

  function dibujarTituloSeccion(doc, titulo, x, y) {
    const { colores } = DISENO;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(31);
    doc.setTextColor(...colores.guinda);
    doc.setCharSpace?.(1.4);
    doc.text(titulo.toLocaleUpperCase('es-MX'), x, y);
    doc.setCharSpace?.(0);
    doc.setFillColor(...colores.oro);
    doc.rect(x, y + 8, 21, 1.3, 'F');
  }

  /**
   * Dibuja una fila de etiqueta/valor con texto dinámico y cortes de línea seguros.
   * Los valores extensos se envuelven en su propia columna, sin invadir la etiqueta.
   */
  function dibujarCampo(doc, etiqueta, valor, x, y, ancho, opciones = {}) {
    const { colores } = DISENO;
    const etiquetaAncho = opciones.etiquetaAncho ?? ancho * 0.48;
    const valorAncho = ancho - etiquetaAncho - 8;
    const altoFila = opciones.altoFila ?? 31;
    const tamEtiqueta = opciones.tamanoEtiqueta ?? 22;
    const tamValor = opciones.tamanoValor ?? 27;
    const lineas = doc.splitTextToSize(textoSeguro(valor), valorAncho);
    const altoTexto = Math.max(4.2, lineas.length * tamValor * 0.36);
    const centro = y + altoFila / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(tamEtiqueta);
    doc.setTextColor(...colores.secundario);
    doc.text(etiqueta.toLocaleUpperCase('es-MX'), x, centro + 1.1, { maxWidth: etiquetaAncho });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(tamValor);
    doc.setTextColor(...colores.texto);
    const primerBaseline = centro - altoTexto / 2 + tamValor * 0.28;
    doc.text(lineas, x + etiquetaAncho + 8 + valorAncho, primerBaseline, {
      align: 'right', lineHeightFactor: 1.05, maxWidth: valorAncho
    });

    if (!opciones.sinSeparador) {
      doc.setDrawColor(...colores.separador);
      doc.setLineWidth(0.28);
      doc.line(x, y + altoFila - 1.5, x + ancho, y + altoFila - 1.5);
    }
  }

  function dibujarFichaMuestra(doc, datos) {
    const x = DISENO.margen;
    const y = 216;
    const ancho = DISENO.pagina.ancho - DISENO.margen * 2;
    const alto = 186;
    const mitad = x + ancho / 2;
    const { colores } = DISENO;

    doc.setFillColor(...colores.fondo);
    doc.setDrawColor(...colores.borde);
    doc.setLineWidth(0.4);
    doc.rect(x, y, ancho, alto, 'FD');
    doc.setDrawColor(...colores.separador);
    doc.line(mitad, y, mitad, y + alto);
    dibujarTituloSeccion(doc, 'Datos de la muestra', x + 21, y + 27);

    const altoFila = 31.5;
    const inicioFilas = y + 46;
    const anchoColumna = ancho / 2 - 40;
    const izquierda = [
      ['Motivo', datos.datosMuestra.motivo],
      ['Procedencia', datos.datosMuestra.procedencia],
      ['Sitio exacto', datos.datosMuestra.sitio],
      ['Fecha', datos.datosMuestra.fecha]
    ];
    const derecha = [
      ['Responsable', datos.datosMuestra.responsable],
      ['Parámetros medidos', datos.datosMuestra.medidos],
      ['Dentro de norma', datos.datosMuestra.dentro],
      ['Fuera de norma', datos.datosMuestra.fuera]
    ];

    izquierda.forEach((campo, indice) => dibujarCampo(
      doc, campo[0], campo[1], x + 21, inicioFilas + indice * altoFila,
      anchoColumna, { altoFila, etiquetaAncho: 111 }
    ));
    derecha.forEach((campo, indice) => dibujarCampo(
      doc, campo[0], campo[1], mitad + 21, inicioFilas + indice * altoFila,
      anchoColumna, { altoFila, etiquetaAncho: 119 }
    ));
  }

  function medirAltoFila(doc, fila, anchoColumnas, base) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(DISENO.tabla.tamanoCelda);
    const lineas = [fila.parametro, fila.valor, fila.limites].map((texto, indice) =>
      doc.splitTextToSize(String(texto), anchoColumnas[indice] - 20).length || 1
    );
    const altoTexto = Math.max(...lineas) * DISENO.tabla.tamanoCelda * 0.36 + 9;
    return Math.max(DISENO.tabla.filaMinima, altoTexto, base || 0);
  }

  function dibujarEncabezadoTabla(doc, x, y, encabezadoAlto) {
    const anchos = DISENO.tabla.columnas;
    const etiquetas = ['PARÁMETRO', 'VALOR', 'LÍMITES PERMISIBLES', 'DENTRO DE NORMA'];
    doc.setFillColor(...DISENO.colores.guinda);
    doc.rect(x, y, anchos.reduce((total, ancho) => total + ancho, 0), encabezadoAlto, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(DISENO.tabla.tamanoEncabezado);
    doc.setTextColor(...DISENO.colores.blanco);

    let inicio = x;
    etiquetas.forEach((etiqueta, indice) => {
      const mitad = inicio + anchos[indice] / 2;
      doc.text(etiqueta, indice === 0 ? inicio + 15 : mitad, y + encabezadoAlto / 2 + 1.7, {
        align: indice === 0 ? 'left' : 'center', maxWidth: anchos[indice] - 12
      });
      inicio += anchos[indice];
    });
  }

  /** Traza el símbolo de estado con vectores, compatible con las fuentes estándar de jsPDF. */
  function dibujarSimboloEstado(doc, estado, centroX, centroY) {
    if (estado === 'cumple') {
      const color = DISENO.colores.cumple;
      doc.setDrawColor(...color);
      doc.setLineWidth(1.15);
      doc.setLineCap?.('round');
      doc.line(centroX - 3.3, centroY, centroX - 0.8, centroY + 2.6);
      doc.line(centroX - 0.8, centroY + 2.6, centroX + 4.2, centroY - 3.2);
      doc.setLineCap?.('butt');
      return;
    }
    doc.setDrawColor(...DISENO.colores.guinda);
    doc.setLineWidth(0.9);
    if (estado === 'no-cumple') {
      doc.line(centroX - 2.7, centroY - 2.7, centroX + 2.7, centroY + 2.7);
      doc.line(centroX + 2.7, centroY - 2.7, centroX - 2.7, centroY + 2.7);
    } else {
      doc.line(centroX - 3.2, centroY, centroX + 3.2, centroY);
    }
  }

  function dibujarFilaTabla(doc, fila, x, y, alto, indice) {
    const anchos = DISENO.tabla.columnas;
    const anchoTotal = anchos.reduce((total, ancho) => total + ancho, 0);
    if (indice % 2 === 1) {
      doc.setFillColor(...DISENO.colores.fondo);
      doc.rect(x, y, anchoTotal, alto, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(DISENO.tabla.tamanoCelda);
    doc.setTextColor(...DISENO.colores.texto);
    const celdas = [fila.parametro, fila.valor, fila.limites];
    let inicio = x;
    celdas.forEach((texto, columna) => {
      const lineas = doc.splitTextToSize(String(texto), anchos[columna] - 20);
      const altoTexto = lineas.length * DISENO.tabla.tamanoCelda * 0.36;
      const baseline = y + (alto - altoTexto) / 2 + DISENO.tabla.tamanoCelda * 0.28;
      if (columna === 2 && String(texto).startsWith('≤')) {
        dibujarLimiteConVector(doc, String(texto), inicio + anchos[columna] / 2, baseline);
      } else {
        doc.text(lineas, columna === 0 ? inicio + 15 : inicio + anchos[columna] / 2, baseline, {
          align: columna === 0 ? 'left' : 'center', lineHeightFactor: 1.05,
          maxWidth: anchos[columna] - 20
        });
      }
      inicio += anchos[columna];
    });
    dibujarSimboloEstado(doc, fila.estado, inicio + anchos[3] / 2, y + alto / 2);

    doc.setDrawColor(...DISENO.colores.separador);
    doc.setLineWidth(0.28);
    doc.line(x, y + alto, x + anchoTotal, y + alto);
  }

  /** Dibuja el carácter ≤ con trazos para no depender de su disponibilidad en Helvetica. */
  function dibujarLimiteConVector(doc, texto, centroX, baseline) {
    const resto = texto.replace(/^≤\s*/u, '');
    const anchoSigno = 4.5;
    const espacio = resto ? 1.5 : 0;
    const anchoResto = resto ? doc.getTextWidth(resto) : 0;
    const inicioX = centroX - (anchoSigno + espacio + anchoResto) / 2;
    const puntaX = inicioX + 0.6;
    const extremoX = inicioX + 3.5;
    const centroY = baseline - 1.6;
    doc.setDrawColor(...DISENO.colores.texto);
    doc.setLineWidth(0.38);
    doc.line(extremoX, centroY - 1.6, puntaX, centroY);
    doc.line(puntaX, centroY, extremoX, centroY + 1.6);
    doc.line(puntaX + 0.1, centroY + 2.3, extremoX, centroY + 2.3);
    if (resto) doc.text(resto, inicioX + anchoSigno + espacio, baseline);
  }

  function dibujarCabeceraCompacta(doc, folio) {
    const { colores } = DISENO;
    doc.setFillColor(...colores.guinda);
    doc.rect(0, 0, DISENO.pagina.ancho, 43, 'F');
    doc.setFillColor(...colores.oro);
    doc.rect(0, 42, DISENO.pagina.ancho, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...colores.oro);
    doc.setCharSpace?.(1.7);
    doc.text('REPORTE', DISENO.margen, 25);
    doc.setCharSpace?.(0);
    const tituloCompacto = 'Monitoreo de indicadores microbiológicos y fisicoquímicos';
    const tamanoCompactoSolicitado = 34;
    doc.setFontSize(tamanoCompactoSolicitado);
    // El texto ocupa una sola línea y deja espacio para el bloque del folio.
    const inicioTitulo = 105;
    const inicioFolio = 490;
    const anchoMaximoCompacto = inicioFolio - inicioTitulo - 15;
    const anchoCompacto = doc.getTextWidth(tituloCompacto);
    const tamanoCompacto = Math.min(
      tamanoCompactoSolicitado,
      tamanoCompactoSolicitado * anchoMaximoCompacto / anchoCompacto
    );
    doc.setFontSize(tamanoCompacto);
    doc.setTextColor(...colores.blanco);
    doc.text(tituloCompacto, inicioTitulo, 25);
    doc.setFontSize(20);
    doc.setTextColor(...colores.oro);
    doc.setCharSpace?.(1.6);
    doc.text('FOLIO', inicioFolio, 25);
    doc.setCharSpace?.(0);
    doc.setFontSize(34);
    doc.setTextColor(...colores.blanco);
    doc.text(String(folio), 558, 25, { align: 'right', maxWidth: 37 });
  }

  /**
   * La tabla crece con los parámetros medidos y puede continuar en páginas
   * adicionales. Cada continuación repite la cabecera compacta y los nombres.
   */
  function dibujarResultados(doc, datos) {
    let paginaEsContinuacion = false;
    let y = 454;
    let indiceFila = 0;
    const x = DISENO.margen;
    const anchoTotal = DISENO.tabla.columnas.reduce((total, ancho) => total + ancho, 0);
    const filas = datos.resultados.length ? datos.resultados : [{
      parametro: 'Sin resultados medidos disponibles', valor: '—', limites: '—', estado: 'pendiente'
    }];

    dibujarTituloSeccion(doc, 'Resultados', x, 431);
    dibujarEncabezadoTabla(doc, x, y, DISENO.tabla.encabezadoAlto);
    y += DISENO.tabla.encabezadoAlto;

    filas.forEach(fila => {
      const alto = medirAltoFila(doc, fila, DISENO.tabla.columnas, DISENO.tabla.filaMinima);
      const limiteInferior = DISENO.pie.lineaY - 5;
      if (y + alto > limiteInferior) {
        doc.addPage('a1', 'portrait');
        paginaEsContinuacion = true;
        dibujarCabeceraCompacta(doc, datos.folio);
        dibujarTituloSeccion(doc, 'Resultados (continuación)', x, 67);
        y = 86;
        dibujarEncabezadoTabla(doc, x, y, DISENO.tabla.continuacionEncabezadoAlto);
        y += DISENO.tabla.continuacionEncabezadoAlto;
      }
      dibujarFilaTabla(doc, fila, x, y, alto, indiceFila);
      y += alto;
      indiceFila += 1;
    });
    return paginaEsContinuacion;
  }

  function dibujarTarjetaUbicacion(doc, ubicacion) {
    const x = 196;
    const y = 123;
    const ancho = 362;
    const alto = 147;
    const { colores } = DISENO;
    doc.setFillColor(...colores.fondo);
    doc.setDrawColor(...colores.borde);
    doc.setLineWidth(0.4);
    doc.rect(x, y, ancho, alto, 'FD');
    dibujarTituloSeccion(doc, 'Ubicación', x + 18, y + 24);
    const campos = [
      ['Región', ubicacion.region],
      ['Municipio', ubicacion.municipio],
      ['Localidad', ubicacion.localidad],
      ['Coordenadas', ubicacion.coordenadas]
    ];
    const altoFila = 25.5;
    const inicio = y + 39;
    campos.forEach((campo, indice) => dibujarCampo(
      doc, campo[0], campo[1], x + 18, inicio + indice * altoFila,
      ancho - 36, { altoFila, etiquetaAncho: 127, tamanoValor: 27 }
    ));
  }

  function dibujarSlotMapa(doc, mapa, x, y, ancho, alto) {
    const { colores } = DISENO;
    doc.setFillColor(...colores.fondo);
    doc.rect(x, y, ancho, alto, 'F');
    const disponible = dibujarImagenAjustada(doc, mapa.imagen, x, y, ancho, alto);
    if (!disponible) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(26);
      doc.setTextColor(...colores.secundario);
      doc.text(`Mapa ${mapa.nivel} no disponible`, x + ancho / 2, y + alto / 2, { align: 'center' });
    }
    doc.setDrawColor(...colores.borde);
    doc.setLineWidth(0.45);
    doc.rect(x, y, ancho, alto, 'S');
    // Etiqueta institucional del nivel geográfico A, B o C.
    doc.setFillColor(...colores.guinda);
    doc.rect(x + 1, y + 1, 21, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(...colores.blanco);
    doc.text(mapa.nivel, x + 11.5, y + 14.5, { align: 'center' });
  }

  /** Añade la simbología en una sola fila dentro del espacio bajo el mapa C. */
  function dibujarLeyendaCartografica(doc, iconosMotivo, motivoSeleccionado) {
    const tamanoTexto = 18;
    const tamanoAclaracion = 18;
    const altoIcono = 12;
    const anchoIcono = altoIcono * (25 / 41);
    const altoCuadro = 5.5;
    const separacionSimboloTexto = 3;
    const separacionElementos = 10;
    const { colores } = DISENO;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(tamanoTexto);
    const elementos = [
      { tipo: 'zona', etiqueta: 'Zona de muestreo' },
      { tipo: 'aclaracion', etiqueta: 'Motivo:' }
    ]
      .concat(iconosMotivo
        .filter(({ motivo }) => {
          const motivoNormalizado = normalizarClave(motivo);
          const seleccionadoNormalizado = normalizarClave(motivoSeleccionado);
          return motivoNormalizado === seleccionadoNormalizado || (
            seleccionadoNormalizado === 'emergencia' && motivoNormalizado === 'emergencias'
          );
        })
        .map(({ motivo, imagen }) => ({ tipo: 'marcador', etiqueta: motivo, imagen })));
    const anchos = elementos.map(elemento => {
      const tieneSimbolo = elemento.tipo !== 'aclaracion';
      const anchoSimbolo = elemento.tipo === 'zona' ? altoCuadro : anchoIcono;
      doc.setFont('helvetica', elemento.tipo === 'aclaracion' ? 'bold' : 'normal');
      doc.setFontSize(elemento.tipo === 'aclaracion' ? tamanoAclaracion : tamanoTexto);
      return (tieneSimbolo ? anchoSimbolo + separacionSimboloTexto : 0)
        + doc.getTextWidth(elemento.etiqueta);
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(tamanoTexto);
    const anchoContenido = anchos.reduce((total, ancho) => total + ancho, 0)
      + elementos.slice(0, -1).reduce((total, elemento) => (
        total + (elemento.tipo === 'aclaracion' ? 4 : separacionElementos)
      ), 0);
    const xInicio = (DISENO.pagina.ancho - anchoContenido) / 2;
    const altoPanel = 28;
    const yPanel = 764;
    const centroY = yPanel + altoPanel / 2;

    // El fondo blanco también se integra con el blanco de los iconos PNG.
    doc.setFillColor(...colores.blanco);
    doc.setDrawColor(...colores.borde);
    doc.setLineWidth(0.4);
    doc.rect(xInicio - 5, yPanel, anchoContenido + 10, altoPanel, 'FD');

    let x = xInicio;
    elementos.forEach((elemento, indice) => {
      if (elemento.tipo === 'aclaracion') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(tamanoAclaracion);
        doc.setTextColor(0, 0, 0);
        doc.text(elemento.etiqueta, x, centroY + 2.1);
        x += doc.getTextWidth(elemento.etiqueta);
      } else if (elemento.tipo === 'zona') {
        doc.setFontSize(tamanoTexto);
        // El rectángulo B se dibuja sin relleno y con contorno rojo.
        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(0.8);
        doc.rect(x, centroY - altoCuadro / 2, altoCuadro, altoCuadro, 'S');
        x += altoCuadro + separacionSimboloTexto;
      } else {
        const altoDibujado = elemento.imagen
          ? altoIcono
          : altoCuadro;
        const anchoDibujado = elemento.imagen
          ? anchoIcono
          : altoCuadro;
        if (elemento.imagen) {
          doc.addImage(
            elemento.imagen.dataUrl,
            'JPEG',
            x,
            centroY - altoDibujado / 2,
            anchoDibujado,
            altoDibujado,
            undefined,
            'FAST'
          );
        } else {
          doc.setFillColor(...colores.secundario);
          doc.circle(x + altoCuadro / 2, centroY, altoCuadro / 2, 'F');
        }
        x += anchoDibujado + separacionSimboloTexto;
      }

      if (elemento.tipo !== 'aclaracion') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(tamanoTexto);
        doc.setTextColor(...colores.texto);
        doc.text(elemento.etiqueta, x, centroY + 2.1);
        x += doc.getTextWidth(elemento.etiqueta);
      }
      if (indice < elementos.length - 1) {
        x += elemento.tipo === 'aclaracion' ? 4 : separacionElementos;
      }
    });
  }

  function dibujarPaginaUbicacion(doc, datos, mapas, iconosMotivo) {
    doc.addPage('a1', 'portrait');
    dibujarCabeceraCompacta(doc, datos.folio);
    dibujarSlotMapa(doc, mapas[0], DISENO.margen, 123, 146, 146);
    dibujarTarjetaUbicacion(doc, datos.ubicacion);
    // Las áreas de B y C siguen exactamente la proporción de los originales:
    // B es 2:1 (3000 × 1500) y C es 3:1 (4500 × 1500). Así se aprovecha
    // el ancho disponible y se evita dejar franjas vacías o deformar el mapa.
    const xMapas = DISENO.margen;
    const anchoMapa = DISENO.pagina.ancho - DISENO.margen * 2;
    const altoMapaB = anchoMapa / 2;
    const altoMapaC = anchoMapa / 3;
    const yMapaB = 287;
    const yMapaC = yMapaB + altoMapaB + 19;
    dibujarSlotMapa(doc, mapas[1], xMapas, yMapaB, anchoMapa, altoMapaB);
    dibujarSlotMapa(doc, mapas[2], xMapas, yMapaC, anchoMapa, altoMapaC);
    dibujarLeyendaCartografica(doc, iconosMotivo, datos.datosMuestra.motivo);
  }

  function dibujarPie(doc, datos, numeroPagina, totalPaginas) {
    const { colores, pie } = DISENO;
    doc.setDrawColor(...colores.separador);
    doc.setLineWidth(0.35);
    doc.line(0, pie.lineaY, DISENO.pagina.ancho, pie.lineaY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...colores.secundario);
    doc.text(`Folio ${datos.folio}`, DISENO.margen, pie.lineaY + 11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Página ${numeroPagina} de ${totalPaginas}`, DISENO.pagina.ancho - DISENO.margen, pie.lineaY + 11, { align: 'right' });
    doc.setFillColor(...colores.guinda);
    doc.rect(0, pie.bandaY, DISENO.pagina.ancho, pie.bandaAlto, 'F');
  }

  function sanearNombreArchivo(valor) {
    return String(valor).normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '_').replace(/^_+|_+$/g, '') || 'sin_folio';
  }

  /**
   * Compone el documento y devuelve tanto jsPDF como los datos normalizados.
   * Mantener esta función separada permite inspeccionar o guardar el PDF desde
   * otros flujos sin duplicar la preparación, la carga de imágenes ni el diseño.
   */
  async function construirDocumentoReporte(registro) {
    if (!registro || typeof registro !== 'object') throw new Error('No hay una muestra seleccionada.');
    const claveFolio = buscarClave(registro, 'Folio');
    if (!claveFolio || !valorDisponible(registro[claveFolio])) throw new Error('La muestra no tiene un folio válido.');

    const JsPDF = await cargarJsPDF();
    await diccionarioListo;
    const datos = prepararDatosReporte(registro, parametrosConfigurados, diccionario);
    const [logos, mapas, iconosMotivo] = await Promise.all([
      Promise.all([cargarImagen(RUTAS.logotipoPlaneacion), cargarImagen(RUTAS.logotipoSalud)]),
      cargarMapas(datos.folio),
      cargarIconosMotivoLeyenda()
    ]);

    // La referencia emplea una sans geométrica similar a Montserrat. Se usa la
    // Helvetica estándar de jsPDF para no añadir una fuente con licencia incierta;
    // si el proyecto incorpora un TTF autorizado, puede registrarse con addFileToVFS
    // y addFont aquí para acercar también la tipografía del PDF.
    const doc = new JsPDF({
      orientation: 'portrait', unit: 'mm', format: 'a1', compress: true, putOnlyUsedFonts: true
    });

    dibujarLogosYPortada(doc, datos, logos);
    dibujarFichaMuestra(doc, datos);
    dibujarResultados(doc, datos);
    dibujarPaginaUbicacion(doc, datos, mapas, iconosMotivo);

    const totalPaginas = doc.getNumberOfPages();
    for (let indice = 1; indice <= totalPaginas; indice += 1) {
      doc.setPage(indice);
      dibujarPie(doc, datos, indice, totalPaginas);
    }

    return { doc, datos };
  }

  /** Descarga el documento final con un nombre descriptivo basado en el folio. */
  async function generarReporte(registro) {
    const { doc, datos } = await construirDocumentoReporte(registro);
    doc.save(`Reporte_COPRISEH_Folio_${sanearNombreArchivo(datos.folio)}.pdf`);
    return { folio: datos.folio, paginas: doc.getNumberOfPages(), filas: datos.resultados.length };
  }

  function actualizarEstadoBoton(boton, registro) {
    if (!boton) return;
    const claveFolio = buscarClave(registro, 'Folio');
    const tieneFolio = Boolean(claveFolio && valorDisponible(registro[claveFolio]));
    boton.disabled = !tieneFolio || generacionEnCurso;
    if (tieneFolio) boton.dataset.folio = String(registro[claveFolio]);
    boton.title = !tieneFolio
      ? 'La muestra no tiene un folio válido.'
      : 'Descargar el reporte PDF de esta muestra.';
  }

  async function atenderDescarga(evento) {
    const boton = evento.target.closest && evento.target.closest('.detail-download');
    if (!boton) return;
    evento.preventDefault();
    if (boton.disabled || generacionEnCurso) return;

    // Se copia el objeto al iniciar para que un cambio posterior de selección no
    // mezcle datos mientras se descargan las imágenes o se construye el archivo.
    const seleccion = window.muestraSeleccionada;
    if (!seleccion || String(seleccion.Folio) !== String(boton.dataset.folio)) {
      actualizarEstadoBoton(boton, null);
      console.error('[Reporte COPRISEH] La muestra visible ya no coincide con el folio del botón.');
      return;
    }
    const snapshot = { ...seleccion };
    generacionEnCurso = true;
    boton.disabled = true;
    boton.textContent = 'Generando reporte…';
    try {
      const resultado = await generarReporte(snapshot);
      console.info(`[Reporte COPRISEH] PDF descargado para folio ${resultado.folio} (${resultado.filas} filas).`);
    } catch (error) {
      console.error('[Reporte COPRISEH] No se pudo generar el reporte:', error);
      window.alert(`No fue posible generar el reporte. ${error.message || 'Revisa la conexión y vuelve a intentarlo.'}`);
    } finally {
      generacionEnCurso = false;
      // El panel puede haber cambiado de muestra mientras terminaba la descarga.
      const botonActual = document.querySelector('.detail-download');
      if (botonActual) {
        botonActual.textContent = 'Descargar reporte';
        actualizarEstadoBoton(botonActual, window.muestraSeleccionada);
      }
    }
  }

  document.addEventListener('click', atenderDescarga);

  // API pequeña para la integración del panel y para revisar la transformación.
  window.ReporteCOPRISEH = {
    configurarParametros(lista) {
      parametrosConfigurados = Array.isArray(lista) ? [...lista] : [];
    },
    formatearFecha,
    actualizarEstadoBoton,
    prepararDatosReporte,
    construirFilasResultados,
    resolverRutaImagen,
    construirDocumentoReporte,
    generarReporte
  };
})(window, document);
