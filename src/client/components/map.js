/*global L*/
require('mapbox.js')
const h = require('choo/html')
const sf = require('sheetify')

sf('mapbox.js/theme/style.css')

L.mapbox.accessToken = 'pk.eyJ1Ijoia3ZubmVmZiIsImEiOiJjaWlnODdxMGkwMjhqdTNrczBhY2ZqbG9iIn0.txFenT55A1VP9k7px4XDqA'

const defaultStyle = sf`
  :host {
    position: absolute;
    max-width: 100%;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  #map {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
    max-height: 800px;
    border-top: 1px solid #E2E2E2;
  }
  `

const mapEl = h`<div id="map" class="absolute"></div>`
const map = L.mapbox.map(mapEl, 'mapbox.streets')
const locations = L.mapbox.featureLayer()

const Map = (state) => {
  const toolTips = state.toolTips || false
  let geoJSON = state.geoJSON
  console.log(geoJSON)
  if (!Array.isArray(geoJSON) && !geoJSON.features) {
    geoJSON = { features: [ geoJSON ] }
  } else if (Array.isArray(geoJSON)) {
    geoJSON = { features: geoJSON }
  }

  if (geoJSON && !map._loaded) {
    map.on('load', () => {
      if (geoJSON.features.length) {
        geoJSON.features.forEach(addTooltip)
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
      }

      map.invalidateSize()
    })
  } else if (geoJSON.features.length && map._loaded) {
    locations
      .setGeoJSON(geoJSON)
      .addTo(map)

    locations.eachLayer(layer => {
      L.marker(layer.feature.geometry.coordinates.reverse()).addTo(map)
    })

    map.setView(geoJSON.features[0].geometry.coordinates, 9)
    map.invalidateSize()
  }

  return h`<div class="${state.style || defaultStyle}">${mapEl}</div>`
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
