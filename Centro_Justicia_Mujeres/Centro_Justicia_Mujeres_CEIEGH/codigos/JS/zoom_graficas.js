function FullscreenGrafica(containerId, obtenerChart) {
    const container = document.getElementById(containerId);
    const btn = container.querySelector('.fullscreenBtn');
    const icon = btn.querySelector('i');

    function toggle() {
        const expandido = container.classList.toggle('grafica-expandida');
        icon.classList.toggle('fa-expand', !expandido);
        icon.classList.toggle('fa-compress', expandido);
        setTimeout(() => obtenerChart().resize(), 100);
    }

    btn.addEventListener('click', toggle);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && container.classList.contains('grafica-expandida')) {
            toggle();
        }
    });
}

FullscreenGrafica('anio_grafica_container', () => actualizador_anio_grafica);
FullscreenGrafica('violencia_grafica_container', () => actualizador_violencia_grafica);
FullscreenGrafica('modalidad_grafica_container', () => actualizador_modalidad_grafica);