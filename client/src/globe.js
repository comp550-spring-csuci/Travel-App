function randomColorization() {
    return '#'+ Math.floor( Math.random() * 16777215).toString(16);
}

function clickPoint() {
    window.location.href = `http://wikipedia.com/`
}


const jsonData =    [
{ 'lat': 34.0522, 'lng': -118.2437, "pointLabel": "Los Angeles",  'color': randomColorization()}, // Los Angeles
{ 'lat': 51.5074, 'lng': 0.1278, "pointLabel": "London", 'color': randomColorization() }, // London 
{ 'lat': 40.7128, 'lng': -74.0060, "pointLabel": "New York", 'color': randomColorization()   } // New York
]





fetch('https://api.api-ninjas.com/v1/city?name=Los Angeles', {
    method: 'GET',
    headers: {
    'X-Api-Key': 'bF8RzcvVlY/Bg+Fwi59pCw==oA0aXRxj5HCWiK2h',
    }
    })
    .then(response => response.json()).then(locations => {
    
    const myGlobe = new Globe(document.getElementById("newGlobe"))
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .showGraticules(true)  
    .pointsData(jsonData)
    .pointColor(d => d.color)
    .pointLabel(d => d.pointLabel)
    .labelText(d => d.color)
    .labelDotRadius(0.5)
    .pointAltitude(0.3)
    .pointRadius(.5)
    .onPointClick(clickPoint)
    // .onPointHover()
    .arcsData(jsonData)

    .arcStartLat(jsonData[0]['lat'])
    .arcStartLng(jsonData[0]['lng'])
    .arcEndLat(jsonData[1]['lat'])
    .arcEndLng(jsonData[1]['lng'])
    .arcDashLength(.02)
    .arcDashGap(.05)
    .arcDashAnimateTime(() => Math.random() * 4000 +500)





//     fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_populated_places_simple.geojson').then(response => response.json()).then(locations => {
//         const newGlobe = new Globe(document.getElementById("newGlobe"))
//             .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
//             .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
//   .labelsData(locations.features)
//   .labelLat(d => d.properties.latitude)
//   .labelLng(d => d.properties.longitude)
//   .labelText(d => d.properties.name)
//   .labelSize(d => Math.sqrt(d.properties.pop_max) * 4e-4)
//   .labelDotRadius(d => Math.sqrt(d.properties.pop_max) * 4e-4)
  
//   .labelColor(() => 'rgba(255, 165, 0, 0.75)')
//   .labelResolution(2)
            

//     })


   
})
