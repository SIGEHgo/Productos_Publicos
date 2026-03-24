function descargarReporteColonia(colonia) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;   // ancho A4
  const margen = 14;
  let y = 0;       // cursor vertical

  // ── Paleta de colores institucional ──────────────────────────────────────
  const vino       = [98,  17,  50];
  const dorado     = [179, 142, 93];
  const rosado     = [243, 194, 213];
  const grisClaro  = [245, 245, 245];
  const blanco     = [255, 255, 255];
  const negro      = [30,  30,  30];

  // ── Datos de la colonia ───────────────────────────────────────────────────

  let interes = datos_reporte(colonia);

  let casos_colonia_general = interes.casos_colonia_general;
  let casos_total_municipio = interes.casos_total_municipio;
  let porcentaje_colonia = interes.porcentaje_colonia;


  let violencia_mas_frecuente = interes.violencia_mas_frecuente;
  let violencia_mas_frecuente_valor = interes.violencia_mas_frecuente_valor;

  let modalidad_mas_frecuente = interes.modalidad_mas_frecuente;
  let modalidad_mas_frecuente_valor = interes.modalidad_mas_frecuente_valor;

  /// Para grafica

  const datosAnio = anio_datos_colonia_grafico(colonia) || [];

  // ── Helper: texto seguro (evita undefined/null) ───────────────────────────
  const txt = v => (v === null || v === undefined ? "0" : String(v));

  // ══════════════════════════════════════════════════════════════════════════
  // ENCABEZADO
  // ══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(...vino);
  doc.rect(0, 0, W, 28, "F");

  doc.setTextColor(...blanco);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Reporte Estadístico", margen, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Mujeres en situación de violencia de género", margen, 16);
  doc.text(`${colonia}`, margen, 22);


  const logoHeight = 10;
  const widthPlaneacion = (1035 / 178) * logoHeight;
  const widthCJMH = (1023 / 370) * (logoHeight + 4);

  const separacion = 3;
  const xCJMH = W - widthCJMH - margen;
  const xPlaneacion = xCJMH - widthPlaneacion - separacion;
  const yLogo = (28 - logoHeight) / 2;

  doc.addImage("Img/Logo_Planeacion_Dorado.png", "PNG", xPlaneacion, yLogo, widthPlaneacion, logoHeight);
  doc.addImage("Img/Logo_CJMH_Dorado.png", "PNG", xCJMH, (yLogo - 1.5), widthCJMH, (logoHeight + 4));



  y = 34;

  // ══════════════════════════════════════════════════════════════════════════
  // TARJETAS DE RESUMEN
  // ══════════════════════════════════════════════════════════════════════════
  const tarjetas = [
    { titulo: "Usuarias en la colonia", valor: txt(casos_colonia_general), sub: "2022-2024" },
    { titulo: "% respecto al municipio", valor: porcentaje_colonia + "%", sub: `de ${casos_total_municipio} usuarias` },
    { titulo: "Violencia más frecuente", valor: violencia_mas_frecuente,     sub: `${violencia_mas_frecuente_valor} registros` },
    { titulo: "Modalidad más frecuente", valor: modalidad_mas_frecuente,     sub: `${modalidad_mas_frecuente_valor} registros` },
  ];

  const tarjW  = (W - margen * 2 - 6) / 4;
  const tarjH  = 22;
  const tarjX0 = margen;

  tarjetas.forEach((t, i) => {
    const x = tarjX0 + i * (tarjW + 2);
    doc.setFillColor(...rosado);
    doc.roundedRect(x, y, tarjW, tarjH, 2, 2, "F");
    doc.setFillColor(...vino);
    doc.rect(x, y, tarjW, 5, "F");

    doc.setTextColor(...blanco);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(t.titulo, x + tarjW / 2, y + 3.8, { align: "center" });

    doc.setTextColor(...vino);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(txt(t.valor), x + tarjW / 2, y + 14, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...negro);
    doc.text(t.sub, x + tarjW / 2, y + 19, { align: "center" });
  });

  y += tarjH + 8;

  // ══════════════════════════════════════════════════════════════════════════
  // Helper: dibujar tabla simple
  // ══════════════════════════════════════════════════════════════════════════
  function dibujarTabla(titulo, filas, encabezados, colWidths, startY) {
    // Título de sección
    doc.setFillColor(...vino);
    doc.rect(margen, startY, W - margen * 2, 7, "F");
    doc.setTextColor(...blanco);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(titulo, margen + 3, startY + 5);
    startY += 7;

    const filaH = 7;

    // Encabezado de columnas
    doc.setFillColor(...dorado);
    doc.rect(margen, startY, W - margen * 2, filaH, "F");
    doc.setTextColor(...blanco);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    let xCursor = margen + 2;
    encabezados.forEach((enc, i) => {
      doc.text(enc, xCursor, startY + 5);
      xCursor += colWidths[i];
    });
    startY += filaH;

    // Filas de datos
    filas.forEach((fila, rowIdx) => {
      const bg = rowIdx % 2 === 0 ? grisClaro : blanco;
      doc.setFillColor(...bg);
      doc.rect(margen, startY, W - margen * 2, filaH, "F");

      doc.setTextColor(...negro);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      xCursor = margen + 2;
      fila.forEach((celda, i) => {
        doc.text(txt(celda), xCursor, startY + 5);
        xCursor += colWidths[i];
      });

      startY += filaH;
    });

    // Borde exterior
    doc.setDrawColor(...vino);
    doc.setLineWidth(0.3);
    doc.rect(margen, startY - filas.length * filaH - 14, W - margen * 2, filas.length * filaH + 14);

    return startY + 4;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. Distribución por año
  // ══════════════════════════════════════════════════════════════════════════
  let distribuccion_general = interes.datos_generales.data;
  let encabezado_general = ["Año", "Usuarias", "Edad Promedio", "Mes más frecuente"]

  y = dibujarTabla(
    "1. Datos Generales",
    distribuccion_general,
    encabezado_general,
    [60, 40, 40, 40]
    , y
  );

  
  console.log(distribuccion_general);

  // ══════════════════════════════════════════════════════════════════════════
  // 2. Distribución por tipo de violencia
  // ══════════════════════════════════════════════════════════════════════════
  
  let distribuccion_violencia = interes.distribuccion_violencia.data
  let distribuccion_violencia_periodos = interes.distribuccion_violencia.periodos
  let encabezado_violencia = ["Tipo de violencia "].concat(distribuccion_violencia_periodos)
  encabezado_violencia[1] = "2022-2024"



  y = dibujarTabla(
    "2. Distribución por tipo de violencia",
    distribuccion_violencia,
    encabezado_violencia,
    [60, 30, 30, 30, 30]
    , y
  );

  // ══════════════════════════════════════════════════════════════════════════
  // 3. Distribución por tipo de modalidad
  // ══════════════════════════════════════════════════════════════════════════

  let distribuccion_modalidad = interes.distribuccion_modalidad.data
  let distribuccion_modalidad_periodos = interes.distribuccion_modalidad.periodos
  let encabezado_modalidad = ["Modalidad"].concat(distribuccion_modalidad_periodos)
  encabezado_modalidad[1] = "2022-2024"
  

  y = dibujarTabla(
    "3. Distribución por tipo de modalidad",
    distribuccion_modalidad,
    encabezado_modalidad,
    [60, 30, 30, 30, 30],
    y
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PIE DE PÁGINA
  // ══════════════════════════════════════════════════════════════════════════
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(...vino);
  doc.rect(0, pageH - 12, W, 12, "F");

  doc.setTextColor(...blanco);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Fuente: Centro de Justicia para Mujeres del Estado de Hidalgo (CJMH)", margen, pageH - 5);

  // ── Guardar ───────────────────────────────────────────────────────────────
  // const url = doc.output('bloburl');
  // window.open(url);

  const nombreArchivo = `CJMH_Reporte_${colonia}.pdf`;
  doc.save(nombreArchivo);
}







// //// Idea pendiente
// var vegetables = ["parsnip", "potato"];
// var moreVegs = ["celery", "beetroot"];

// // Merge the second array into the first one
// // Equivalent to vegetables.push('celery', 'beetroot');
// Array.prototype.push.apply(vegetables, moreVegs);

// console.log(vegetables); // ['parsnip', 'potato', 'celery', 'beetroot']