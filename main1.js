import { transit } from "./Data/TransitReal.js";
import { camaras } from "./Data/CamarasTransit.js";

var mapa = L.map('contenedor').setView([39.469714023341325, -0.3944883294626695], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
    attribution: '<span class="datos">Fuentes del Portal de Datos Abiertos del Ayuntamiento de València</span>'
}).addTo(mapa);

console.log(mapa);

var transito = L.geoJson(transit, {
    color: "#3da3e8",
    fillColor: "white",
    fillOpacity: 0.5
}).bindPopup(function (layer) {
    console.log(layer.feature.properties);
    let popup = layer.feature.properties.denominacion;
    return `<div>Dirección: ${popup}</div>`;
}).addTo(mapa);

var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
});

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
            var content = `<h2>${descripcion}</h2>
                           <iframe src="${url}" width="260" height="370" frameborder="0" class="videos" allowfullscreen></iframe>`;
            document.getElementById('sidebar-content').innerHTML = content;
            sidebar.open('home');
        });

        markers.addLayer(marker);
        return marker;
    }
});

mapa.addLayer(markers);

var geocoder = L.Control.geocoder({
    geocoder: L.Control.Geocoder.nominatim({
        addressdetails: true,
        extratags: true
    })
}).addTo(mapa);

var sidebar = L.control.sidebar({
    container: 'sidebar',
    position: 'right'
}).addTo(mapa);

// Añadir una clase "collapsed" al sidebar para cerrarlo
document.querySelector('.leaflet-sidebar-tabs li:last-child a').addEventListener('click', function() {
    sidebar.close();
});

// Cierra el sidebar cuando se hace clic fuera del sidebar
mapa.on('click', function(e) {
    if (sidebar.isVisible() && !e.originalEvent.target.closest('.leaflet-sidebar')) {
        sidebar.close();
    }
});
