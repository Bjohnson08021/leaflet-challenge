// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

var tectonicData = L.layerGroup();
var earthquakeData = L.layerGroup();

 // Create the base layers.
 var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
// adding layers
var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

var world = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var nightView = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
minZoom: 1,
maxZoom: 8,
format: 'jpg',
time: '',
tilematrixset: 'GoogleMapsCompatible_Level'
});

// Create a baseMaps object.
var baseMaps = {
  "Street Map": street,
  "Grayscale": grayscale,
  "World": world,
  "Night View": nightView
  
};

// Create an overlay object to hold our overlay.
var overlayMaps = {
  Earthquakes: earthquakeData,
  TectonicData: tectonicData
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [street, earthquakeData]
});

// Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
   //adjusting marker size setting colors
   function radius(magnitude) {
    return magnitude * 25000;
}
function markerColor(magnitude){
    if (magnitude >= 5) {
        return "red"
    }
    else if (magnitude >= 4) {
        return "orange"
    }
    else if (magnitude >= 3) {
        return "yellow"
    }
    else if (magnitude >=2){
        return "#93eaa8"
    }
    else if (magnitude >=1){
        return "#b1f2ff"
    }
    else {
        return "#949494"
    };
};
// Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  L.geoJSON(data, {
    pointToLayer: function(earthquakeDatas, latlng){
        return L.circle(latlng, {
            radius: radius(earthquakeDatas.properties.mag),
            color: markerColor(earthquakeDatas.properties.mag)
        });
    },
    onEachFeature: function(feature, layer){
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date and Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p>`);
    }
    }).addTo(earthquakeData);
    earthquakeData.addTo(myMap);

    d3.json(tectonicUrl).then(function (tecData) {
      L.geoJSON(tecData,{
        color: "orange", 
      }).addTo(tectonicData);
      tectonicData.addTo(myMap);   
    });
//console.log(tectonicUrl)
     // Set up the legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
        magnitude = [0, 1, 2, 3, 4, 5]
       labels=[]
        div.innerHTML += "<h1>Magnitude</h1>" 
    for (var i = 0; i<magnitude.length; i++){
      div.innerHTML += 
     
        '<i style="background:' + markerColor(magnitude[i]) + '"> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '</i><br>' : '+');

}

return div;
};


  // Adding the legend to the map
  legend.addTo(myMap);

  console.log("tectonic data", tectonicData)
  console.log("earthquake", earthquakeData)
  
  
  
});
//console.log(data.features)


 

  




 
  
  

  



 
