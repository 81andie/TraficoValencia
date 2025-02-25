import { transit } from "./Data/TransitReal.js";
import { camaras } from "./Data/CamarasTransit.js";




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

        marker.on('click', function () {
            var url = feature.properties.url;
            var descripcion = feature.properties.descripcio;
           
            var content = `
            <div  class="p-2">
              <h3 class="font-bold mb-2">Leyenda:</h3>
               <div class="legend-item flex items-center mb-2">
             <div class="ml-4 w-5 h-5 bg-blue-500 border border-black mr-2"></div>
             <span>Líneas azules: Representan el tráfico</span>
              </div>
              </div>
          
                <div class="w-96 ml-2">
                 <h3 class="font-bold">Lugar de la cámara:</h3>
                  <div class="flex justify-start p-2 gap-2 ml-2">
                    <i class="fas fa-video text-red-500"></i>
                    <h2>${descripcion}</h2>
                  </div>          
                </div>
                
                <div class="flex mt-5 w-full justify-center">
                 <a href="${url}" class="bg-blue-100 p-2" target="_blank">Ver video</a>
                </div>

               `;
            document.getElementById('sidebar-content').innerHTML = content;
            document.getElementById('sidebar').style.width = '410px'; // Abre el sidebar

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


document.getElementById('closeSidebar').addEventListener('click', function () {
    // Cierra el sidebar
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('main-content').style.marginLeft = '0';

    // Limpia el contenido del sidebar
    document.getElementById('sidebar-content').innerHTML = '';
});



mapa.on('click', function (e) {
    if (document.getElementById('sidebar').style.width === '0px' && !e.originalEvent.target.closest('#sidebar')) {
        document.getElementById('sidebar').style.width = '0';
        document.getElementById('main-content').style.marginLeft = '0';
        document.getElementById('sidebar-content').innerHTML = '';
    }
});


