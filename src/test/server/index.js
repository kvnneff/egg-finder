require('dotenv').config({ silent: true })
const server = require('../../server')
const LocationsDB = require('./unit/db-locations')
const LocationsModel = require('./unit/model-locations')
const RouteGeocoder = require('./integration/route-geocoder')
const RouteLocation = require('./integration/route-location')

let count = 0

const done = () => {
  count++
  if (count === 3) return closeServer()
}

const closeServer = () => {
  setTimeout(() => {
    server.close()
    process.exit()
  }, 2000)
}

server.emitter.on('ready', () => {
  LocationsDB(server, done)
  LocationsModel(server, done)
  RouteGeocoder(server, done)
  RouteLocation(server, done)
})
