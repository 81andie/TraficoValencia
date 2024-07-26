import { transit } from "./Data/TransitReal.js";
import { camaras } from "./Data/CamarasTransit.js";





document.getElementById('closeSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('main-content').style.marginLeft = '0';
});




// Inicializar el mapa
var mapa = L.map('contenedor').setView([39.469714023341325, -0.3944883294626695], 13);

// Añadir capa de mapa base
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
    attribution: '<span class="datos">Fuentes del Portal de Datos Abiertos del Ayuntamiento de València</span>'
}).addTo(mapa);

// Añadir datos de tránsito
var transito = L.geoJson(transit, {
    color: "#3da3e8",
    fillColor: "white",
    fillOpacity: 0.5
}).bindPopup(function (layer) {
    let popup = layer.feature.properties.denominacion;
    return `<div>Dirección: ${popup}</div>`;
}).addTo(mapa);

// Inicializar grupo de marcadores
var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
});

// Añadir cámaras de tráfico
var camarasTrafic = L.geoJson(camaras, {
    pointToLayer: function (feature, latlng) {
        var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<i class="fas fa-video" style="font-size: 15px; color: red;"></i>',
            iconSize: [1, 1],
            iconAnchor: [1, 1]
        });

        var marker = L.marker(latlng, { icon: customIcon });

        marker.on('click', function() {
            var url = feature.properties.url;
            var descripcion = feature.properties.descripcio;
            var angulo = feature.properties.angulo;
            var coordenadas = feature.properties.geo_point_2d.lon;
            var coordenadas1 = feature.properties.geo_point_2d.lat;

            var content = `
                <div class="containerInfo_camara">
                    <h3>Lugar de la cámara:</h3>
                    <h2>${descripcion}</h2>
                </div>
                <div class="containerInfo_angulo">
                    <h3>Angulo:</h3>
                    <h2>${angulo}</h2>
                </div>

                <div class="containerInfo_angulo">
                    <h3>Coordenadas 2d:</h3>
                    <h2>Lon:${coordenadas}</h2>
                    <h2>Lat:${coordenadas1}</h2>
                </div>
                <iframe src="${url}" width="480px" overflow="hidden" height="560" frameborder="0" allowfullscreen></iframe>`;
                document.getElementById('sidebar-content').innerHTML = content;
                document.getElementById('sidebar').style.width = '480px'; // Abre el sidebar
               
            
          
        });

        markers.addLayer(marker);
        return marker;
    }
});

mapa.addLayer(markers);

// Añadir geocoder
var geocoder = L.Control.geocoder({
    geocoder: L.Control.Geocoder.nominatim({
        addressdetails: true,
        extratags: true
    })
}).addTo(mapa);



mapa.on('click', function(e) {
    if (document.getElementById('sidebar').style.width === '0px' && !e.originalEvent.target.closest('#sidebar')) {
        document.getElementById('sidebar').style.width = '0';
        document.getElementById('main-content').style.marginLeft = '0';
    }
});


