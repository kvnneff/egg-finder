/*global describe, it, afterEach, beforeEach*/
var assert = require('assert')
var clone = require('component-clone')
var locations = require('../../server/db/locations')
var Location = require('../../server/models/locations')

var locationData = {
  authID: 'foo',
  name: 'Mezzaluna Farms',
  address1: '14299 Williams Hwy',
  address2: '',
  isPublic: true,
  zipcode: 97544,
  state: 'OR',
  city: 'Williams',
  available: true,
  price: 5
}

describe('Location Model', function () {
  var locationObject = {}

  afterEach(function (done) {
    locations.removeAll(function (err) {
      if (err) return done(err)
      return done()
    })
  })

  beforeEach(function (done) {
    locationObject = clone(locationData)
    done()
  })

  describe('Location(attributes)', function () {
    it('returns a new Location', function () {
      var location = Location(locationObject)
      assert.equal(location.zipcode, 97544)
    })
  })

  describe('Location#save(cb)', function () {
    it('inserts a new location into the database', function (done) {
      var location = Location(locationObject)
      location.save(function (err, result) {
        assert.equal(err, null)
        Location.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.authID, 'foo')
          assert.equal(result.name, 'Mezzaluna Farms')
          assert.equal(result.address1, '14299 Williams Hwy')
          assert.equal(result.address2, '')
          assert.equal(result.isPublic, true)
          assert.equal(result.zipcode, 97544)
          assert.equal(result.state, 'OR')
          assert.equal(result.city, 'Williams')
          assert.equal(result.available, true)
          assert.equal(result.price, '$5.00')
          assert.equal(result.latitude, 42.2870598)
          assert.equal(result.longitude, -123.2297626)
          done()
        })
      })
    })
  })
  describe('Location.findByID(id, cb)', function () {
    it('returns a location with `id`', function (done) {
      var location = Location(locationObject)
      location.save(function (err, result) {
        assert.equal(err, null)
        Location.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.authID, 'foo')
          assert.equal(result.name, 'Mezzaluna Farms')
          assert.equal(result.address1, '14299 Williams Hwy')
          assert.equal(result.address2, '')
          assert.equal(result.isPublic, true)
          assert.equal(result.zipcode, 97544)
          assert.equal(result.state, 'OR')
          assert.equal(result.city, 'Williams')
          assert.equal(result.available, true)
          assert.equal(result.price, '$5.00')
          assert.equal(result.latitude, 42.2870598)
          assert.equal(result.longitude, -123.2297626)
          done()
        })
      })
    })
  })
  describe('Location.findByAuthID(authID, cb)', function () {
    it('returns a location with `authID`', function (done) {
      var location = Location(locationObject)
      location.save(function (err, result) {
        assert.equal(err, null)
        Location.findByAuthID(locationObject.authID, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.authID, 'foo')
          assert.equal(result.name, 'Mezzaluna Farms')
          assert.equal(result.address1, '14299 Williams Hwy')
          assert.equal(result.address2, '')
          assert.equal(result.isPublic, true)
          assert.equal(result.zipcode, 97544)
          assert.equal(result.state, 'OR')
          assert.equal(result.city, 'Williams')
          assert.equal(result.available, true)
          assert.equal(result.price, '$5.00')
          assert.equal(result.latitude, 42.2870598)
          assert.equal(result.longitude, -123.2297626)
          done()
        })
      })
    })
  })
  describe('Location.findWithinRadius(latitude, longitude, radius, cb)', function () {
    it('returns locations within `radius`', function (done) {
      var location = Location(locationObject)
      location.save(function (err, result) {
        assert.equal(err, null)
        Location.findWithinRadius(42.348636, -123.3425439, 6, function (err, result) {
          assert.equal(err, null)
          done()
        })
      })
    })
  })
  describe('Location#remove(cb)', function () {
    it('removes a location from the database', function (done) {
      var location = Location(locationObject)
      location.save(function (err, result) {
        assert.equal(err, null)
        Location.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.city, 'Williams')
          var id = result.id
          location.remove(function (err, result) {
            assert.equal(err, null)
            assert.equal(result, 1)
            Location.findByID(id, function (err, result) {
              assert.equal(err, null)
              assert.equal(result, null)
              done()
            })
          })
        })
      })
    })
  })
})
