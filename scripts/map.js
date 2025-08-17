document.addEventListener('DOMContentLoaded', function () {
    //map initializer
    const mapa = L.map('mapa').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    let geojsonLayer;
    let visaData;

    //countries style
    function estiloPorDefecto() {
        return {
            fillColor: '#ffffffff',
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    //countries that requiere visa
    const estiloResaltado = {
        fillColor: '#FF0000',
        weight: 2,
        opacity: 1,
        color: 'red',
        fillOpacity: 0.7
    };

    //load data through JSON
    Promise.all([
        fetch('scripts/visa_data.json').then(response => response.json()),
        fetch('scripts/custom.geo.json').then(response => response.json())
    ]).then(([visa, geojson]) => {
        visaData = visa;

        geojsonLayer = L.geoJson(geojson, {
            style: estiloPorDefecto,
            onEachFeature: function (feature, layer) {
                layer.on({
                    click: alHacerClicEnPais
                });
            }
        }).addTo(mapa);
    });

    //clickable countries
    function alHacerClicEnPais(e) {
        const paisSeleccionado = e.target.feature.properties.iso_a3;

        //reboot colors
        geojsonLayer.eachLayer(function (layer) {
            layer.setStyle(estiloPorDefecto());
        });

        //color countries that need visa.
        if (visaData[paisSeleccionado]) {
            const paisesQueRequierenVisa = visaData[paisSeleccionado];

            geojsonLayer.eachLayer(function (layer) {
                const codigoPaisActual = layer.feature.properties.iso_a3;
                if (paisesQueRequierenVisa.includes(codigoPaisActual)) {
                    layer.setStyle(estiloResaltado);
                }
            });
        }
    }
});