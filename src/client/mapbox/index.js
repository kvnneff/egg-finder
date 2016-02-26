/*global L*/
var Emitter = require('component-emitter')

export default function Map (collection) {
  var geoJSON = collection
  var emitter = new Emitter()
  var locations
  var map

  function init (elementId) {
    L.mapbox.accessToken = process.env.MAPBOX_ACCESS_TOKEN
    map = L.mapbox.map(elementId, process.env.MAPBOX_PROJECT_ID)
    locations = L.mapbox.featureLayer()
    locations.on('click', (event) => {
      emitter.emit('click', event.layer.feature.id)
    })
    updateGeoJSON(geoJSON)
  }

  function resetColors () {
    geoJSON.features.forEach(item => {
      const { properties } = item
      properties['marker-color'] = properties['old-color'] || properties['marker-color']
    })
    locations.setGeoJSON(geoJSON)
  }

  function selectFeature (featureID) {
    const item = geoJSON.features.find((f) => {
      return f.properties.id === parseInt(featureID, 10)
    })
    if (!item) return
    const { properties, geometry } = item
    resetColors()
    properties['old-color'] = properties['marker-color']
    locations.setGeoJSON(geoJSON).addTo(map)
    locations.eachLayer(layer => {
      if (parseInt(layer.feature.id, 10) === parseInt(featureID, 10)) layer.bindPopup(layer.feature.tooltipContent).openPopup()
    })
    map.panTo([geometry.coordinates[1], geometry.coordinates[0]])
  }

  function setView (latitude, longitude, zoom) {
    map.setView([latitude, longitude], zoom)
  }

  function updateGeoJSON (geoJSON) {
    console.log(geoJSON)
    if (geoJSON.type && geoJSON.type === 'Feature') {
      addTooltip(geoJSON)
    } else {
      geoJSON.features.forEach(addTooltip)
    }
    locations.setGeoJSON(geoJSON).addTo(map)
    // if (!geoJSON.features.length) return
    locations.eachLayer(layer => {
      layer.bindPopup(layer.feature.tooltipContent)
    })
    map.fitBounds(locations.getBounds())
    map.setZoom(14)
  }

  function resizeMap () {
    if (map) map.invalidateSize()
  }

  function addTooltip (feature) {
    const properties = feature.properties
    feature.tooltipContent = `
      ${ properties.name }
      <ul>
        <li>${ properties.address }</li>
        <li>${ properties.city }</li>
      </ul>
      <p>${ properties.description } </p>`
    return feature
  }

  return {
    map,
    locations,
    init,
    setView,
    resizeMap,
    resetColors,
    selectFeature,
    updateGeoJSON
  }
}
