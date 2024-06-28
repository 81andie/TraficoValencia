import { transit } from "./Data/TransitReal.js";
import { camaras } from "./Data/CamarasTransit.js";




var mapa = L.map('contenedor').setView([39.469714023341325, -0.3944883294626695],13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
    attribution: '<span class="datos">Datos cedidos por el Portal de Datos Abiertos del Ayuntamiento de València</span'
}).addTo(mapa);

console.log(mapa);

var transito = L.geoJson(transit, {
    color: "blue",
    fillColor: "white",
    fillOpacity: 0.5

}).bindPopup(function (layer) {

    console.log(layer.feature.properties);

    let popup = layer.feature.properties.denominacion;


    return `<div>Dirección: ${popup}</div>`;


}).addTo(mapa);






var camarasTrafic = L.geoJson(camaras, {
    pointToLayer: function (feature, latlng) {
        // Crear un ícono basado en un div
        var customIcon = L.divIcon({
            className: 'custom-div-icon', // Clase personalizada para el ícono
            html: '<i class="fas fa-video" style="font-size: 18px; color: red;"></i>', // HTML del ícono
            iconSize: [20, 20], // Tamaño del ícono
            iconAnchor: [10, 10] // Anclaje del ícono
        });

        // Crear un marcador con el ícono personalizado
        var marker = L.marker(latlng, {
            icon: customIcon
        }).bindTooltip('<i class="fas fa-video" style="font-size: 18px; color: red;"></i>', {
            className: 'leaflet-tooltip-div-icon',
            permanent: true,
            direction: 'center'
        });

        return marker;
    }
  

}).bindPopup(function (layer) {

    console.log(layer.feature.properties.descripcio);

    let popup = layer.feature.properties.url;
    let descripcion = layer.feature.properties.descripcio;

    return `<h1>${descripcion}</h1>
    <iframe src="${popup}" width="450" height="600" frameborder="0" allowfullscreen></iframe>`;

}).addTo(mapa);




var overlayMaps = {
    "<div class='linea'></div><span>Zonas con más transito</span><br><span class='legend-item'>Zona dónde se concentra la mayor concentración de tráfico</span>": transito,
    '<i class="fas fa-video" style="font-size: 18px; color: red;"></i><span> Visualizar Cámaras</span><br><span class="legend-item">Visualización y lugar de todas las cámaras de tráfico</span>': camarasTrafic
};

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(mapa);

// Estilos para las leyendas dentro del control de capas
var style = document.createElement('style');
style.innerHTML = `
    .leaflet-control-layers-overlays label span {
        display: flex;
        padding: 5px;
        margin-bottom: 5px;
        align-items: center;
        gap:15px;
        font-size: 16px;
    }
    .leaflet-control-layers-overlays label span.legend-item {
        margin-left: 10px;
        font-size: 16px;
        color: #666;
    }
`;
document.head.appendChild(style);

// Añadir control de escala
L.control.scale().addTo(mapa);






v











   
    




