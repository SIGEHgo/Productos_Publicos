/**
 * reporte_grafica.js
 * Genera un reporte PDF para la colonia buscada en el entorno de gráficas.
 * Depende de: jsPDF (window.jspdf.jsPDF) cargado vía CDN en index.html
 * Usa las funciones ya definidas en funciones_extras.js:
 *   - anio_datos_colonia_grafico(colonia)
 *   - violencia_datos_colonia_grafico(colonia)
 *   - modalidad_datos_colonia_grafico(colonia)
 *   - cuentas_para_popup()
 *   - columna_seleccionada()
 */

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
  const anio       = columna_seleccionada().anio;
  const anioLabel  = anio === "General" ? "2022-2024" : anio;

  const datosAnio      = anio_datos_colonia_grafico(colonia)      || [];
  const datosViolencia = violencia_datos_colonia_grafico(colonia) || [];
  const datosModalidad = modalidad_datos_colonia_grafico(colonia) || [];

  const totalColonia   = datosAnio.reduce((s, d) => s + (d.v || 0), 0);
  const cuentas        = cuentas_para_popup();
  const totalMunicipio = cuentas.total_anio || 0;
  const pctMunicipio   = totalMunicipio > 0
    ? ((totalColonia / totalMunicipio) * 100).toFixed(1)
    : "0.0";

  const violenciaMax = datosViolencia.length
    ? datosViolencia.reduce((a, b) => (b.v > a.v ? b : a), datosViolencia[0])
    : { l: "—", v: 0 };
  const modalidadMax = datosModalidad.length
    ? datosModalidad.reduce((a, b) => (b.v > a.v ? b : a), datosModalidad[0])
    : { l: "—", v: 0 };

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
  doc.text("Diagnóstico de Violencia de Género", margen, 16);
  doc.text(`Colonia: ${colonia}  ·  Período ${anioLabel}`, margen, 22);

  // Sello "CJMH" a la derecha
  doc.setFillColor(...dorado);
  doc.roundedRect(W - 36, 4, 22, 20, 3, 3, "F");
  doc.setTextColor(...vino);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CJMH", W - 25, 15, { align: "center" });

  y = 34;

  // ══════════════════════════════════════════════════════════════════════════
  // TARJETAS DE RESUMEN
  // ══════════════════════════════════════════════════════════════════════════
  const tarjetas = [
    { titulo: "Casos en la colonia", valor: txt(totalColonia), sub: anioLabel },
    { titulo: "% del municipio",     valor: pctMunicipio + "%", sub: `de ${totalMunicipio} usuarias` },
    { titulo: "Tipo más frecuente",  valor: violenciaMax.l,     sub: `~${violenciaMax.v} registros` },
    { titulo: "Modalidad principal", valor: modalidadMax.l,     sub: `~${modalidadMax.v} registros` },
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
    doc.setFontSize(6);
    doc.text(t.titulo, x + tarjW / 2, y + 3.8, { align: "center" });

    doc.setTextColor(...vino);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(txt(t.valor), x + tarjW / 2, y + 14, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
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

      // Barra de nivel (última columna visual)
      const nivel = fila[fila.length - 1];
      const nivelColor = nivel === "Alto"
        ? [183, 28, 28]
        : nivel === "Medio"
          ? [230, 150, 50]
          : [72, 153, 77];
      const badgeX = margen + colWidths[0] + colWidths[1] + colWidths[2] + 2;
      doc.setFillColor(...nivelColor);
      doc.roundedRect(badgeX, startY + 1.5, 18, 4, 1, 1, "F");
      doc.setTextColor(...blanco);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text(nivel, badgeX + 9, startY + 4.5, { align: "center" });

      startY += filaH;
    });

    // Borde exterior
    doc.setDrawColor(...vino);
    doc.setLineWidth(0.3);
    doc.rect(margen, startY - filas.length * filaH - 14, W - margen * 2, filas.length * filaH + 14);

    return startY + 4;
  }

  // ── Clasificar nivel ───────────────────────────────────────────────────────
  function clasificarNivel(valor, datos) {
    if (!datos.length) return "Sin registro";
    const max = Math.max(...datos.map(d => d.v || 0));
    if (max === 0) return "Sin registro";
    const pct = valor / max;
    if (pct >= 0.6) return "Alto";
    if (pct >= 0.25) return "Medio";
    if (valor > 0) return "Bajo";
    return "Sin registro";
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. Distribución por año
  // ══════════════════════════════════════════════════════════════════════════
  // Título de sección
  doc.setFillColor(...vino);
  doc.rect(margen, y, W - margen * 2, 7, "F");
  doc.setTextColor(...blanco);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("1. Distribución por año", margen + 3, y + 5);
  y += 7;

  // Tabla manual (sin niveles)
  const encAnio = ["Año", "Casos registrados", "Variación"];
  const cwAnio  = [30, 80, 60];
  const filaH   = 7;

  doc.setFillColor(...dorado);
  doc.rect(margen, y, W - margen * 2, filaH, "F");
  doc.setTextColor(...blanco);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  let xc = margen + 2;
  encAnio.forEach((e, i) => { doc.text(e, xc, y + 5); xc += cwAnio[i]; });
  y += filaH;

  datosAnio.forEach((d, idx) => {
    const bg = idx % 2 === 0 ? grisClaro : blanco;
    doc.setFillColor(...bg);
    doc.rect(margen, y, W - margen * 2, filaH, "F");
    doc.setTextColor(...negro);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    xc = margen + 2;
    const variacion = idx === 0 ? "Año base" : `↑ +${(((d.v - datosAnio[0].v) / (datosAnio[0].v || 1)) * 100).toFixed(0)}%`;
    [d.l, txt(d.v), variacion].forEach((cel, i) => {
      doc.text(cel, xc, y + 5);
      xc += cwAnio[i];
    });
    y += filaH;
  });
  doc.setDrawColor(...vino);
  doc.setLineWidth(0.3);
  doc.rect(margen, y - datosAnio.length * filaH - 7, W - margen * 2, datosAnio.length * filaH + 7);
  y += 6;

  // ══════════════════════════════════════════════════════════════════════════
  // 2. Distribución por tipo de violencia
  // ══════════════════════════════════════════════════════════════════════════
  const filasViolencia = datosViolencia.map(d => [
    d.l,
    txt(d.v),
    d.v > 0 ? d.v : 0,
    clasificarNivel(d.v, datosViolencia)
  ]);

  y = dibujarTabla(
    "2. Distribución por tipo de violencia",
    filasViolencia,
    ["Tipo de violencia", "Frecuencia", "Casos", "Nivel"],
    [60, 40, 40, 30]
    , y
  );

  // ══════════════════════════════════════════════════════════════════════════
  // 3. Distribución por tipo de modalidad
  // ══════════════════════════════════════════════════════════════════════════
  const filasModalidad = datosModalidad.map(d => [
    d.l,
    txt(d.v),
    d.v > 0 ? d.v : 0,
    clasificarNivel(d.v, datosModalidad)
  ]);

  y = dibujarTabla(
    "3. Distribución por tipo de modalidad",
    filasModalidad,
    ["Modalidad", "Frecuencia", "Casos", "Nivel"],
    [60, 40, 40, 30],
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
  doc.text("Fuente: Centro de Justicia para las Mujeres de Hidalgo (CJMH)", margen, pageH - 5);

  doc.setTextColor(...dorado);
  doc.text(`Colonia: ${colonia}  ·  Datos aproximados  ·  Período: ${anioLabel}`, W - margen, pageH - 5, { align: "right" });

  // ── Guardar ───────────────────────────────────────────────────────────────
  const nombreArchivo = `CJMH_Reporte_${colonia.replace(/\s+/g, "_")}_${anioLabel}.pdf`;
  doc.save(nombreArchivo);
}
