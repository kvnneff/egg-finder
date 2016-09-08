/*global L*/
require('mapbox.js')
const h = require('choo/html')
const sf = require('sheetify')

sf('mapbox.js/theme/style.css')

L.mapbox.accessToken = 'pk.eyJ1Ijoia3ZubmVmZiIsImEiOiJjaWlnODdxMGkwMjhqdTNrczBhY2ZqbG9iIn0.txFenT55A1VP9k7px4XDqA'

const style = sf`
  :host {
    width: 100%;
    height: 200px;
  }`

const mapEl = h`<div class="${style}"></div>`
const map = L.mapbox.map(mapEl, 'mapbox.streets')

const Map = (state) => {
  const searchResults = state.searchResults
  if (searchResults) {
    map
      // .setView(searchResults.features[0].geometry.coordinates.reverse(), 9)
      .featureLayer.setGeoJSON(searchResults)
  }

  return h`<div>${mapEl}</div>`
}

module.exports = Map
