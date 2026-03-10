const mapa = document.getElementById("map");
const graficas = document.getElementById("graficas_entorno");

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    document.querySelectorAll(".acordion").forEach(acordion => {
        acordion.style.display = "none";  // Oculta todos los acordeones
    });
}
document.querySelectorAll(".sidebar-link").forEach(link => {
    link.addEventListener("click", function () {

        console.log("Se ha seleccionado:", this.dataset.seccion);
        let seccion = this.dataset.seccion;

        event.preventDefault();                                                                 // Evita el comportamiento predeterminado del enlace

        let sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');                                              // Asegura que la barra se expanda al hacer clic en un enlace
        }
        document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));  // Elimina la clase "active" de todos los enlaces
        this.classList.add("active");                                                           // Añadir la clase "active" al enlace clicado


        let acordion_seleccionado = document.getElementById(seccion + "-contenido");
        document.querySelectorAll(".acordion").forEach(acordion => {
            acordion.style.display = "none";  // Oculta todos los acordeones
        });
        acordion_seleccionado.style.display = "block"; // Muestra el acordeón seleccionado

        if (seccion === "graficas") {
            mapa.style.display = "none";
            graficas.style.display = "block";
        } else if (seccion === "mapa") {
            graficas.style.display = "none";
            mapa.style.display = "block";
        }

    });
});





