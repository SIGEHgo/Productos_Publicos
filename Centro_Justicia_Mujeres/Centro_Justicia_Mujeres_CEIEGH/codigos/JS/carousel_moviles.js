(function () {
    const $contenedor = $('#graficas_entorno_inferior');
    const graficasEntorno = document.getElementById('graficas_entorno');
    const mqMobile = window.matchMedia('(max-width: 767px)');
    let slickActivo = false;

    function resizeCharts() {
        [actualizador_anio_grafica, actualizador_violencia_grafica, actualizador_modalidad_grafica]
            .forEach(chart => chart && chart.resize());
    }

    function activarCarrusel() {
        if (slickActivo) return;
        $contenedor.slick({
            infinite: false,      // evita clonar slides (y duplicar IDs de <canvas>)
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true,
            adaptiveHeight: false
        });
        slickActivo = true;
        setTimeout(resizeCharts, 150);
    }

    function desactivarCarrusel() {
        if (!slickActivo) return;
        $contenedor.slick('unslick');   // devuelve el DOM a su estado original
        slickActivo = false;
        setTimeout(resizeCharts, 150);
    }

    // Reajusta cuando cambia de slide
    $contenedor.on('afterChange', () => setTimeout(resizeCharts, 100));

    // Reajusta cuando la sección "Gráficas" se vuelve visible
    // (sin tocar sidebar.js)
    new MutationObserver(() => {
        if (graficasEntorno.style.display !== 'none' && slickActivo) {
            setTimeout(() => {
                $contenedor.slick('setPosition');
                resizeCharts();
            }, 100);
        }
    }).observe(graficasEntorno, { attributes: true, attributeFilter: ['style'] });

    // Activar/desactivar según el ancho de pantalla
    function evaluarBreakpoint(e) {
        e.matches ? activarCarrusel() : desactivarCarrusel();
    }
    evaluarBreakpoint(mqMobile);
    mqMobile.addEventListener('change', evaluarBreakpoint);
})();