// /*global describe, it, afterEach*/
// var assert = require('assert')
// var redis = require('redis')
// var geo = require('../../server/geo')
//
// const client = redis.createClient()
//
// afterEach((done) => {
//   geo.removeAll()
//   done()
// })
//
// describe('initialize(client)', () => {
//   it('initializes the geo client', () => {
//     const geoClient = geo.initialize(client)
//     assert(geoClient)
//   })
// })
//
// describe('validateAddress(addressString, cb)', () => {
//   it('returns an error if address is invalid', (done) => {
//     geo.validateAddress('123 FooBar Lane, Somewhere', (err) => {
//       assert(err)
//       assert(err.message === 'Unable to locate that address.')
//       done()
//     })
//   })
//   it('returns a geoJSON object if the address is valid', (done) => {
//     const address = '14299 Williams Hwy, Williams, OR'
//     geo.validateAddress(address, (err, res) => {
//       assert.equal(err, null)
//       assert.equal(res.properties.city, 'Williams')
//       assert.equal(res.properties.zipcode, '97544')
//       assert.equal(res.properties.streetNumber, '14299')
//       assert.equal(res.properties.streetName, 'Williams Highway')
//       done()
//     })
//   })
// })
//
// describe('addLocation(key, coords, cb)', () => {
//   it('adds a new location to the store', (done) => {
//     geo.addLocation('Foo', {
//       latitude: 10,
//       longitude: 20
//     }, (err, reply) => {
//       assert.equal(err, null)
//       geo.getLocation('Foo', (err, reply) => {
//         assert.equal(err, null)
//         assert.equal(reply.latitude.toString().split('.')[0], 10)
//         assert.equal(reply.longitude.toString().split('.')[0], 20)
//         done()
//       })
//     })
//   })
// })
//
// describe('removeLocation(key, cb)', () => {
//   it('removes a location from the store', (done) => {
//     geo.addLocation('Foo', {
//       latitude: 10,
//       longitude: 20
//     }, (err, reply) => {
//       assert.equal(err, null)
//       geo.getLocation('Foo', (err, reply) => {
//         assert.equal(err, null)
//         geo.removeLocation('Foo', (err, reply) => {
//           assert.equal(err, null)
//           geo.getLocation('Foo', (err, reply) => {
//             assert.equal(err, null)
//             assert.equal(reply, null)
//             done()
//           })
//         })
//       })
//     })
//   })
// })
//
// describe('updateLocation(key, coords, cb)', () => {
//   it('updates a location in the store', (done) => {
//     geo.addLocation('Foo', {
//       latitude: 10,
//       longitude: 20
//     }, (err, reply) => {
//       assert.equal(err, null)
//       geo.updateLocation('Foo', {
//         latitude: 30.6,
//         longitude: 40
//       }, (err, reply) => {
//         assert.equal(err, null)
//         geo.getLocation('Foo', (err, reply) => {
//           assert.equal(err, null)
//           assert.equal(reply.latitude.toString().split('.')[0], 30)
//           assert.equal(reply.longitude.toString().split('.')[0], 40)
//           done()
//         })
//       })
//     })
//   })
// })
//
// describe('nearby(coords, distance, options, cb)', () => {
//   it('finds nearby locations sorted by distance', (done) => {
//     const locations = {
//       'Williams': { latitude: 42.2187, longitude: -123.2739 },
//       'Provolt': { latitude: 42.2873, longitude: -123.2303 },
//       'Murphy': { latitude: 42.3475, longitude: -123.3323 }
//     }
//     const latitude = 42.2656
//     const longitude = -123.2476
//     geo.addLocations(locations, (err, reply) => {
//       assert.equal(err, null)
//       geo.nearby(latitude, longitude, 50, (err, reply) => {
//         assert.equal(err, null)
//         assert.equal(reply.length, 3)
//         assert.equal(reply[0].distance.toString().substring(0, 3), 1.7)
//         assert.equal(reply[1].distance.toString().substring(0, 3), 3.5)
//         assert.equal(reply[2].distance.toString().substring(0, 3), 7.1)
//         done()
//       })
//     })
//   })
// })
