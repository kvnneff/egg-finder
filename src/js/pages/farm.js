/*global geoJSON*/
const Map = require('../components/map')
const navigation = require('../components/navigation')
const mapElement = document.body.querySelector('#map')

Map({ geoJSON, tooltips: true, element: mapElement })
navigation()
