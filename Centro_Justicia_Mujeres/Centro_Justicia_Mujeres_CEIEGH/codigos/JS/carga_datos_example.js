var diccionario = [];
var diccionario_sigeh = [];
var diccionario_capas_info = [];
var taxonomia = [];
var taxonomia_sigeh = [];
var catalog_cobertura_potencial = [];
var diccionariosListos = false;
var busqueda_lista=[]
const capasEnMapa = {};
const capasCobPotEnMapa = {};
var LeafIcon = L.Icon.extend({
    options: {
        
    }
});
var greenIcon = new LeafIcon({iconUrl: 'img/marker-icon-green.png'});
var grayIcon = new LeafIcon({iconUrl: 'img/marker-icon-grey.png'});
L.icon = function (options) {
    return new L.Icon(options);
};
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

function agregarCatalogo(capas, UI_id,input_id,inner_text,fetch_handler) {
    const contenedor = document.getElementById(UI_id);
    for(const key in capas){
        const capa=capas[key]
        const li = document.createElement('li');
        li.classList.add('capa_i');
        li.style.cursor = 'pointer'; 
        const div = document.createElement('div');
        div.classList.add('toggle');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `btn_${capa[input_id]}`;
    
        input.onchange = (e) => {
            e.stopPropagation(); 
            fetch_handler(capa, input);
        };
        const label = document.createElement('label');
        label.htmlFor = `btn_${capa[input_id]}`;
        div.appendChild(input);
        div.appendChild(label);
        const span = document.createElement('span');
        span.classList.add('capa_label');
        span.innerText = capa[inner_text];
        li.onclick = (e) => {
            if (e.target !== input && e.target !== label) {
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change'));
            }
        };
        li.appendChild(div);
        li.appendChild(span);
        contenedor.appendChild(li);
    };
}
function createTreeNode(contenedor, groupName, levelId) {
    const groupLi = document.createElement('li');
    groupLi.classList.add('tree-group');
    if (levelId) groupLi.dataset.group = levelId;

    const header = document.createElement('div');
    header.classList.add('tree-group-header');

    const expandBtn = document.createElement('span');
    expandBtn.classList.add('tree-expand-btn');
    expandBtn.innerHTML = '&#9654;';
    header.appendChild(expandBtn);

    const toggleDiv = document.createElement('div');
    toggleDiv.classList.add('toggle');
    const groupInput = document.createElement('input');
    groupInput.type = 'checkbox';
    groupInput.id = `grp_${levelId || groupName.replace(/\s+/g, '_')}`;
    const groupLabel = document.createElement('label');
    groupLabel.htmlFor = groupInput.id;
    toggleDiv.appendChild(groupInput);
    toggleDiv.appendChild(groupLabel);
    header.appendChild(toggleDiv);

    const groupSpan = document.createElement('span');
    groupSpan.classList.add('capa_label', 'tree-group-label');
    groupSpan.innerText = groupName;
    header.appendChild(groupSpan);

    const childrenUl = document.createElement('ul');
    childrenUl.classList.add('tree-children');
    childrenUl.style.display = 'none';

    groupLi.appendChild(header);
    groupLi.appendChild(childrenUl);
    contenedor.appendChild(groupLi);

    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = childrenUl.style.display === 'none';
        childrenUl.style.display = isHidden ? 'block' : 'none';
        expandBtn.innerHTML = isHidden ? '&#9660;' : '&#9654;';
    });

    groupLi._batchColor = null;

    groupInput.addEventListener('change', (e) => {
        e.stopPropagation();
        if (groupInput.checked) {
            groupLi._batchColor = [
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            ];
        } else {
            groupLi._batchColor = null;
        }
        groupLi.dataset.batchUpdating = 'true';
        const childCheckboxes = childrenUl.querySelectorAll('.tree-leaf input[type="checkbox"]');
        childCheckboxes.forEach(childInput => {
            childInput.checked = groupInput.checked;
            if (groupInput.checked && groupLi._batchColor) {
                childInput._batchColor = groupLi._batchColor;
            } else {
                childInput._batchColor = null;
            }
            childInput.dispatchEvent(new Event('change'));
        });
        delete groupLi.dataset.batchUpdating;
        groupInput.indeterminate = false;
    });

    return { groupLi, childrenUl, groupInput };
}

function createLeafItem(capa, parentGroupLi, childrenUl) {
    const li = document.createElement('li');
    li.classList.add('capa_i', 'tree-leaf');
    li.style.cursor = 'pointer';

    const div = document.createElement('div');
    div.classList.add('toggle');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `btn_${capa.ID}`;
    input._capaRef = capa;

    input.onchange = (e) => {
        e.stopPropagation();
        fetchCapaCobPot(capa, input);
        const parentGroup = li.closest('.tree-group');
        if (parentGroup && !parentGroup.dataset.batchUpdating) {
            const parentInput = parentGroup.querySelector('.tree-group-header > .toggle > input[type="checkbox"]');
            const siblingCheckboxes = parentGroup.querySelectorAll('.tree-children input[type="checkbox"]');
            const allChecked = Array.from(siblingCheckboxes).every(cb => cb.checked);
            const noneChecked = Array.from(siblingCheckboxes).every(cb => !cb.checked);
            if (allChecked) {
                parentInput.checked = true;
                parentInput.indeterminate = false;
            } else if (noneChecked) {
                parentInput.checked = false;
                parentInput.indeterminate = false;
            } else {
                parentInput.checked = false;
                parentInput.indeterminate = true;
            }
        }
    };

    const label = document.createElement('label');
    label.htmlFor = `btn_${capa.ID}`;
    div.appendChild(input);
    div.appendChild(label);

    const span = document.createElement('span');
    span.classList.add('capa_label');
    span.innerText = capa.nombre_cientifico;
    li.onclick = (e) => {
        if (e.target !== input && e.target !== label) {
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change'));
        }
    };
    li.appendChild(div);
    li.appendChild(span);
    childrenUl.appendChild(li);
}

function agregarCatalogoCobPot(capas, groupTitle, folder) {
    const contenedor = document.getElementById('cobertura_potencial_capas');

    const title = groupTitle || 'Anfibios';
    const folderName = folder || 'anfibios';

    const topNode = createTreeNode(contenedor, title, 'top_' + title.replace(/\s+/g, '_'));
    topNode.childrenUl.style.display = 'block';
    topNode.groupLi.querySelector('.tree-expand-btn').innerHTML = '&#9660;';

    const byOrden = {};
    for (const key in capas) {
        const capa = capas[key];
        capa._folder = folderName;
        const ord = capa.orden || 'Sin orden';
        if (!byOrden[ord]) byOrden[ord] = [];
        byOrden[ord].push(capa);
    }

    for (const [orden, itemsByOrden] of Object.entries(byOrden)) {
        const ordenNode = createTreeNode(topNode.childrenUl, orden, 'orden_' + orden.replace(/\s+/g, '_'));

        const byFamilia = {};
        itemsByOrden.forEach(capa => {
            const fam = capa.familia || 'Sin familia';
            if (!byFamilia[fam]) byFamilia[fam] = [];
            byFamilia[fam].push(capa);
        });

        for (const [familia, itemsByFamilia] of Object.entries(byFamilia)) {
            const familiaNode = createTreeNode(ordenNode.childrenUl, familia, 'fam_' + familia.replace(/\s+/g, '_'));

            itemsByFamilia.forEach(capa => {
                createLeafItem(capa, familiaNode.groupLi, familiaNode.childrenUl);
            });
        }
    }
}
var colorize = function(image, r, g, b) {
    var newImg = document.createElement('canvas');
    newImg.width = image.width;
    newImg.height = image.height;
    var newCtx = newImg.getContext('2d');
    newCtx.drawImage(image, 0, 0);
    var imageData = newCtx.getImageData(0, 0, image.width, image.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i+0] = r ; 
        data[i+1] = g ; 
        data[i+2] = b ; 
    }
    newCtx.putImageData(imageData, 0, 0);
    return newImg.toDataURL();
};
const imageBounds = [[19.5977581096916, -99.8595414298902], [21.3985207697463, -97.9849289101136]];

const cargarYColorear = (url, r, g, b,w=1) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = url;
    
    img.onload = function() {
        const urlColoreada = colorize(img, r, g, b);
        var leaflet_image=L.imageOverlay(urlColoreada, imageBounds, options={ opacity: w }).addTo(map);
        capasCobPotEnMapa[url] =leaflet_image
    };
};
async function fetchCapaCobPot(capa, boton){
    const idCapa = capa.ID;
    const folder = capa._folder || 'anfibios';
    const url = `https://d2iu2nm9wgefjc.cloudfront.net/dp_rp/${folder}/${idCapa}.png`;
    const isChecked = boton ? boton.checked : false;
    
    if (isChecked) {
        if (capasCobPotEnMapa[url]) return;
        let r, g, b;
        if (boton && boton._batchColor) {
            r = boton._batchColor[0];
            g = boton._batchColor[1];
            b = boton._batchColor[2];
        } else {
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
        }
        
        cargarYColorear(url, r, g, b, 0.5);
        map.fitBounds(imageBounds);
    } else {
        if (!capasCobPotEnMapa[url]) return;
        map.removeLayer(capasCobPotEnMapa[url]);
        delete capasCobPotEnMapa[url];
    }
}

async function fetchCapa(capa, boton) {
    const idCapa = capa.nombre_capa;
    const estilos = capa.estilos;
    const campoEstilo = capa.campo_fill_color;

    const tipoGeom = capa.tipo_geometria;
    
    if (capasEnMapa[idCapa]) {
        map.removeLayer(capasEnMapa[idCapa]);
        delete capasEnMapa[idCapa];
        return;
    }
    
    try {
        const response = await fetch(`assets/capas_informacion/${idCapa}.geojson`);
        if (!response.ok) throw new Error("No se encontró el archivo");
        const data = await response.json();
        let nuevaCapa;
        if (tipoGeom === 'POINT') {
            nuevaCapa = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: idCapa=='plagas'?greenIcon : grayIcon });
                },
                onEachFeature: (feature, layer) => {
                    if (feature.properties) {
                        layer.bindPopup(Object.entries(feature.properties)
                            .map(([k, v]) => v ? `<b>${k}:</b> ${v}` : '')
                            .join("<br>"));
                    }
                }
            });
        }
        else{
            nuevaCapa = L.geoJSON(data, {
                pane:'otrasCapas',
                onEachFeature: (feature, layer) => {
                    if (feature.properties && tipoGeom !== 'POINT') {
                        layer.bindPopup(Object.entries(feature.properties)
                            .map(([k, v]) => v ? `<b>${k}:</b> ${v}` : '')
                            .join("<br>"));
                    }
                },
                style: function(feature) {
                    const color_i = feature.properties[campoEstilo] 
                        ? estilos.filter((item) => item.clases === feature.properties[campoEstilo])[0].color 
                        : '#3388ff';
                    return {
                        fillColor: color_i,
                        fillOpacity: 0.8,
                        color: color_i,
                        opacity: 1,
                        weight: 3
                    }
                }
            });}

        nuevaCapa.addTo(map);
        capasEnMapa[idCapa] = nuevaCapa;
        boton.disabled = false;
        boton.style.backgroundColor = "#add8e6";

    } catch (err) {
        console.error("Error cargando la capa:", err);
        boton.disabled = false;
    }
}

async function cargarDiccionariosAplicacion() {
    try {
        const [diccionarioAvistamientos, datosTaxonomia, diccionarioRiesgo, datosTaxonomiaSigeh, catalogoCapasInfo, catalogoAnfibios, catalogoAves] = await Promise.all([
            cargarDiccionarioJson("assets/avistamientos/diccionario_COESBIOH_junio.json"),
            cargarDiccionarioJson("assets/avistamientos/taxonomia_COESBIOH_junio.json"),
            cargarDiccionarioJson("assets/especies_riesgo/diccionario_sigeh.json"),
            cargarDiccionarioJson("assets/especies_riesgo/taxonomia_sigeh.json"),
            cargarDiccionarioJson("assets/capas_informacion/catalogo.json"),
            cargarDiccionarioJson("assets/cobertura_potencial/anfibios.json"),
            cargarDiccionarioJson("assets/cobertura_potencial/aves.json")
        ]);
        diccionario = diccionarioAvistamientos;
        diccionario_sigeh = diccionarioRiesgo;
        taxonomia = datosTaxonomia;
        taxonomia_sigeh = datosTaxonomiaSigeh;
        diccionario_capas_info = catalogoCapasInfo;
        catalog_cobertura_potencial = catalogoAnfibios;
        diccionariosListos = true;
        busqueda_lista = [...new Set(datosTaxonomia.map(i => i.nombre_comun).filter(Boolean).sort())];
        agregarCatalogo(diccionario_capas_info, 'capas_info_extra','nombre_capa','nombre_explicito',fetchCapa);
        agregarCatalogoCobPot(catalogoAnfibios, 'Anfibios', 'anfibios');
        agregarCatalogoCobPot(catalogoAves, 'Aves', 'aves');
        return true;
    } catch (error) {
        console.error("No fue posible cargar los diccionarios desde JSON:", error);
        diccionario = [];
        diccionario_sigeh = [];
        taxonomia = [];
        taxonomia_sigeh = [];
        diccionariosListos = false;
        return false;
    }
}
