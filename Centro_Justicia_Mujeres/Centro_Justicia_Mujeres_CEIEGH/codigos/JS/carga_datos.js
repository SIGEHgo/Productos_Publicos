let aaa = [];
let aaaa = [];

function normalizarLista(items) {
    if (!Array.isArray(items)) return [];
    return items.filter(item => item && typeof item === "object");
}

async function cargarDiccionarioJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`No se pudo cargar ${url}: ${response.status}`);
    }

    const datos = await response.json();
    return normalizarLista(datos);
}

async function cargarDiccionariosAplicacion() {
    try {
        const [bbb, bbbb] = await Promise.all([
            cargarDiccionarioJson("outputs/Geojson Mapa/Pachuca de Soto 2022-2025 CJMH Indicadores.geojson"),
            cargarDiccionarioJson("outputs/Geojson Mapa/Mineral del Monte 2022-2025 CJMH Indicadores.geojson"),
        
        ]);
        console.log(bbb)
        console.log(bbbb)
        aaa = bbb;
        aaaa = bbbb;
        return true;
    } catch (error) {
        console.error("No fue posible cargar los diccionarios desde JSON:", error);
        aaa = [];
        aaaa = [];
        return false;
    }
}