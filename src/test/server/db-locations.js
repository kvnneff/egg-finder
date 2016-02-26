/*global describe, it, afterEach, beforeEach*/
var assert = require('assert')
var clone = require('component-clone')
var users = require('../../server/db/user')
var locations = require('../../server/db/locations')

var location = {
  authID: 'foo',
  name: 'Mezzaluna Farms',
  address1: 'address1',
  address2: 'address2',
  isPublic: true,
  zipcode: 90210,
  state: 'OR',
  city: 'Williams',
  available: true,
  price: 5,
  latitude: 42.2163097,
  longitude: -123.3672834
}

describe('Location DB Queries', function () {
  var locationObject = {}

  afterEach(function (done) {
    locations.removeAll(function (err) {
      if (err) return done(err)
      return done()
    })
  })

  beforeEach(function (done) {
    locationObject = clone(location)
    done()
  })

  describe('locations.save(locations, cb)', function () {
    it('inserts a new locations into the database', function (done) {
      locations.save(locationObject, function (err, result) {
        assert.equal(err, null)
        locations.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert(result)
          done()
        })
      })
    })
  })
  describe('locations.findByID(id, cb)', function () {
    it('locates a locations by id', function (done) {
      locations.save(locationObject, function (err, result) {
        assert.equal(err, null)
        locations.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert(result)
          done()
        })
      })
    })
  })
  describe('locations.findWithinRadius(latitude, longitude, radius, cb)', function () {
    it('locates locations within `radius`', function (done) {
      locations.save(locationObject, function (err, result) {
        assert.equal(err, null)
        locations.findWithinRadius(42.348636, -123.3425439, 6, function (err, result) {
          assert.equal(err, null)
          done()
        })
      })
    })
  })
  describe('locations.remove(locations, cb)', function () {
    it('removes a locations from the database', function (done) {
      locations.save(locationObject, function (err, result) {
        assert.equal(err, null)
        locations.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.city, 'Williams')
          var id = result.id
          locations.remove(id, function (err, result) {
            assert.equal(err, null)
            assert.equal(result, 1)
            locations.findByID(id, function (err, result) {
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
