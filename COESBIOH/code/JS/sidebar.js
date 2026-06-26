const mapa = document.getElementById("map");
const graficas = document.getElementById("graficas_entorno");

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    document.querySelectorAll(".acordion").forEach(acordion => {
        acordion.style.display = "none";  // Oculta todos los acordeones
    });
}


let sidebar_seleccion = null;


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

        sidebar_seleccion = this.dataset.seccion;
    });
});



const accordionTitles = document.querySelectorAll(".accordion-titulo");
accordionTitles.forEach(title => {
    title.addEventListener("click", function () {   
        const content = this.nextElementSibling; 
        const boton = this.querySelector(".accordion-button");

        if (content.style.display === "block") {
            content.style.display = "none"; 
            boton.classList.add("collapsed");
        } else {
            content.style.display = "block"; 
            boton.classList.remove("collapsed");
        }
    });
});


// Solo endemicas y lo de la NOM-059
document.querySelectorAll(".capa_i").forEach(li => {
    li.addEventListener("click", function(e) {
        const input = this.querySelector("input[type='checkbox']");
        const texto = this.querySelector("label");

        if (e.target !== input && e.target !== texto) {
            input.checked = !input.checked;  // Invierte el estado del checkbox
            input.dispatchEvent(new Event("change"));
        }
    });
});


