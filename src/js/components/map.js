/*global L*/
require('mapbox.js')

L.mapbox.accessToken = 'pk.eyJ1Ijoia3ZubmVmZiIsImEiOiJjaWlnODdxMGkwMjhqdTNrczBhY2ZqbG9iIn0.txFenT55A1VP9k7px4XDqA'

const locations = L.mapbox.featureLayer()

const Map = (state) => {
  const mapEl = state.element
  const toolTips = state.toolTips || false
  let geoJSON = state.geoJSON

  const map = L.mapbox.map(mapEl, 'mapbox.streets')

  if (!geoJSON.length) return map

  map.on('load', () => {
    geoJSON.forEach(addTooltip)
    locations
      .setGeoJSON(geoJSON)
      .addTo(map)
    map.fitBounds(locations.getBounds())
    map.setZoom(14)

    if (toolTips) {
      locations.eachLayer(layer => {
        layer.bindPopup(layer.feature.tooltipContent)
      })
    } else {
      locations.eachLayer(layer => {
        L.marker(layer.feature.geometry.coordinates.reverse()).addTo(map)
      })
    }
    map.invalidateSize()
  })

  return map
}

const addTooltip = (feature) => {
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

module.exports = Map
