/******************************************************
 *              CARGA DE CÁMARAS EN TIEMPO REAL
 ******************************************************/
async function cargarCamarasExport() {

    const url =
        "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/cameres-trafic-camaras-trafico/exports/json";
    const respuesta = await fetch(url);
    const datos = await respuesta.json(); // esto ya es un array plano

    console.log(datos)


    if (!Array.isArray(datos)) {
        console.error("Error: datos no es un array", datos);
        return { type: "FeatureCollection", features: [] };
    }

    const features = datos
        .map((f) => {
            if (!f.geo_point_2d || f.geo_point_2d.lat === undefined || f.geo_point_2d.lon === undefined)
                return null;

            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [f.geo_point_2d.lon, f.geo_point_2d.lat] // [lng, lat]
                },
                properties: {
                    url: f.url,
                    descripcio: f.descripcio || "Sin descripción",
                    id: f.idcamara || f.objectid || "",
                },
            };
        })
        .filter((f) => f !== null);

    return { type: "FeatureCollection", features };

}

async function cargarTransitoExport() {
    const url =
        "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/estat-transit-temps-real-estado-trafico-tiempo-real/exports/json";
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
        console.error("Error: datos no es un array", datos);
        return { type: "FeatureCollection", features: [] };
    }

    const features = datos
        .map((f) => {
            let lat, lng;

            // Coordenadas desde geo_point_2d
            if (f.geo_point_2d && f.geo_point_2d.lat !== undefined && f.geo_point_2d.lon !== undefined) {
                lat = f.geo_point_2d.lat;
                lng = f.geo_point_2d.lon;
            }
            // Si hay geometry.coordinates
            else if (f.geometry && f.geometry.coordinates) {
                lng = f.geometry.coordinates[0];
                lat = f.geometry.coordinates[1];
            }
            else {
                return null;
            }

            return {
                type: "Feature",
                geometry: { type: "Point", coordinates: [lng, lat] },
                properties: {
                    denominacion: f.descripcio || "Sin descripción",
                    estado: f.stat_traffic || "Desconocido",
                },
            };
        })
        .filter((f) => f !== null);

    return { type: "FeatureCollection", features };
}





/******************************************************
 *                  INICIALIZAR MAPA
 ******************************************************/
async function init() {
    // Crear mapa
    const mapa = L.map("contenedor").setView([39.4697, -0.3945], 13);

    // Capa base
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
        attribution:
            '<span class="datos">Fuentes del Portal de Datos Abiertos del Ayuntamiento de València</span>',
    }).addTo(mapa);




    // Cargar cámaras
    const camarasData = await cargarCamarasExport();

    const markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
    });

    L.geoJson(camarasData, {
        pointToLayer: (feature, latlng) => {
            const marker = L.marker(latlng, {
                icon: L.divIcon({
                    className: "custom-div-icon",
                    html: '<i class="fas fa-video" style="color:red;font-size:15px;"></i>',
                    iconSize: [1, 1],
                    iconAnchor: [1, 1],
                }),
            });

            marker.on("click", () => {
                const content = `
                    <div class="p-2">
                        <h3 class="font-bold mb-2">Cámara de tráfico:</h3>
                        <div class="flex justify-start p-2 gap-2">
                            <i class="fas fa-video text-red-500"></i>
                            <span>${feature.properties.descripcio}</span>
                        </div>
                        <div class="mt-2">
                            <a href="${feature.properties.url}" target="_blank" class="bg-blue-100 p-2">Ver video</a>
                        </div>
                    </div>
                `;
                document.getElementById("sidebar-content").innerHTML = content;
                document.getElementById("sidebar").style.width = "410px";
            });

            markers.addLayer(marker);
            return marker;
        },
    });

    mapa.addLayer(markers);

    // Geocoder
    L.Control.geocoder({
        geocoder: L.Control.Geocoder.nominatim({
            addressdetails: true,
            extratags: true,
        }),
    }).addTo(mapa);

    // Botón cerrar sidebar
    document
        .getElementById("closeSidebar")
        .addEventListener("click", () => {
            document.getElementById("sidebar").style.width = "0";
            document.getElementById("sidebar-content").innerHTML = "";
        });

    // Clic fuera sidebar
    mapa.on("click", (e) => {
        if (
            document.getElementById("sidebar").style.width === "0px" &&
            !e.originalEvent.target.closest("#sidebar")
        ) {
            document.getElementById("sidebar").style.width = "0";
            document.getElementById("sidebar-content").innerHTML = "";
        }
    });
}

// Añadir geocoder


// Iniciar mapa
init();
