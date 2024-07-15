import { transit } from "./Data/TransitReal.js";
import { camaras } from "./Data/CamarasTransit.js";


//https://tile.openstreetmap.org/{z}/{x}/{y}.png?

var mapa = L.map('contenedor').setView([39.469714023341325, -0.3944883294626695], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
    attribution: '<span class="datos">Fuentes del Portal de Datos Abiertos del Ayuntamiento de València</span'
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

//tengo los marcadores que tienen que tener cluster
//tengo el geojson
//no muestro el geojson, muestro el cluster

var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
});


var camarasTrafic = L.geoJson(camaras, {
    pointToLayer: function (feature, latlng) {
        // Crear un ícono basado en un div
        var customIcon = L.divIcon({
            className: 'custom-div-icon', // Clase personalizada para el ícono
            html: '<i class="fas fa-video" style="font-size: 15px; color: red;"></i>', // HTML del ícono
            iconSize: [1, 1], // Tamaño del ícono
            iconAnchor: [1, 1] // Anclaje del ícono
        });



        // Crear un marcador con el ícono personalizado
        var marker = L.marker(latlng, {
            icon: customIcon
        });

        let url = feature.properties.url;
        let descripcion = feature.properties.descripcio;
    
        var popup = L.popup()
            .setContent(`<h1>${descripcion}</h1>
        <iframe src="${url}" width="410" height="300" frameborder="0" class="videos" allowfullscreen></iframe>`);

        marker.bindPopup(popup)

        markers.addLayer(marker);

        return marker;
    }


}).bindPopup(function (layer) {

    console.log(layer.feature.properties.descripcio);

    
    return ;


});



mapa.addLayer(markers);




var geocoder = L.Control.geocoder({
    geocoder: L.Control.Geocoder.nominatim({
        addressdetails: true, // Obtener detalles adicionales de la dirección
        extratags: true // Obtener etiquetas adicionales de la ubicación (si es compatible)
    })
}).addTo(mapa);







var overlayMaps = {
    "<div class='linea'></div><span>Zonas con más transito</span><br><span class='legend-item'>Zona dónde se concentra la mayor concentración de tráfico</span>": transito,
    '<i class="fas fa-video" style="font-size: 18px; color: red;"></i><span> Visualizar Cámaras</span><br><span class="legend-item">Visualización y lugar de todas las cámaras de tráfico</span>': markers
};

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(mapa);

// Estilos para las leyendas dentro del control de capas
var style = document.createElement('style');
style.innerHTML = `
    .leaflet-control-layers-overlays label span {
        display: flex;
       padding: 2px;
        align-items: center;
        font-size: 1rem;
        gap: 2px;
    }
    .leaflet-control-layers-overlays label span.legend-item {
      

        color: #666;
    }
`;
document.head.appendChild(style);

// Añadir control de escala
L.control.scale().addTo(mapa);





























