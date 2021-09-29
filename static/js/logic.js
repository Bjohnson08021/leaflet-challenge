// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});
//console.log(data.features)

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date and Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p>`);
  }
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
        }
    }


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng){
        return L.circle(latlng, {
            radius: radius(earthquakeData.properties.mag),
            color: markerColor(earthquakeData.properties.mag)
        });
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);


function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  
  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
  

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


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

}



  

}