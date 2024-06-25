import { transit } from "./Data/TransitReal.js";
import { camaras } from "./Data/CamarasTransit.js";




var mapa = L.map('contenedor').setView([39.469714023341325, -0.3944883294626695],13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {}).addTo(mapa);

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


var segurityIcon = L.icon({
    iconUrl: 'segurity.png',
    iconSize:     [22, 35], 
    iconAnchor:   [22, 94],  
    popupAnchor:  [-3, -76] 
});



 var camarasTrafic =L.geoJson(camaras, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
           // radius: 8,
           // fillColor: "#82E0AA",
           // color: "#000",
          //  weight: 1,
          //  opacity: 1,
          // fillOpacity: 0.8,
           // border: 2,
          //  borderColor: "#3cd326",
            icon: segurityIcon
        });
    }

  

}).bindPopup(function (layer) {

    console.log(layer.feature.properties.descripcio);

    let popup = layer.feature.properties.url;
    let descripcion = layer.feature.properties.descripcio;

    return `<h1>${descripcion}</h1>
    <iframe src="${popup}" width="450" height="600" frameborder="0" allowfullscreen></iframe>`;

}).addTo(mapa);






var overlayMaps = {
   
    "Zonas con más transito": transito,
    "Visualizar Cámaras": camarasTrafic
}

L.control.layers(null, overlayMaps).addTo(mapa);













   
    




