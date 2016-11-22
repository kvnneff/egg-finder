const Test = require('tape')
const LocationModel = require('../../../server/models/location')
const locationFixture = require('../../fixtures/location')
const Emitter = require('component-emitter')

const dbSpy = () => {
  const emitter = new Emitter()

  const save = (data, cb) => {
    emitter.emit('save', data)
    return cb(null, data)
  }

  const remove = (user_id, cb) => {
    emitter.emit('remove', user_id)
    return cb(null, user_id)
  }

  const find = (user_id, cb) => {
    emitter.emit('find', user_id)
    return cb(null, user_id)
  }

  const findWithinRadius = (latitude, longitude, radius, cb) => {
    emitter.emit('findWithinRadius', latitude, longitude, radius)
    return cb(null, [])
  }

  return {
    find,
    save,
    remove,
    emitter,
    findWithinRadius
  }
}

module.exports = (server, done) => {
  Test('LocationModel', (t) => {
    const test = t.test
    t.plan(6)

    test('LocationModel(db, geo) returns a model creation function', (t) => {
      t.plan(1)
      const Location = LocationModel({ placeHolder: 'foo' })
      t.equal(Location.db.placeHolder, 'foo')
    })

    test('Location(attributes) returns a new model', (t) => {
      t.plan(1)
      const Location = LocationModel()
      const location = Location(locationFixture())
      t.equal(location.attributes.zipcode, 97544)
    })

    test('Location#save(cb) calls Location.db.save method', (t) => {
      t.plan(2)
      const spy = dbSpy()
      const locationData = locationFixture()
      const Location = LocationModel(spy)
      const location = Location(locationData)

      spy.emitter.on('save', (data) => {
        t.equal(data.user_id, locationData.user_id)
      })

      location.save((err) => {
        t.equal(err, null)
      })
    })

    test('Location#remove(cb) calls Location.db.remove method', (t) => {
      t.plan(2)
      const spy = dbSpy()
      const locationData = locationFixture()
      const Location = LocationModel(spy)
      const location = Location(locationData)

      spy.emitter.on('remove', (user_id) => {
        t.equal(user_id, locationData.user_id)
      })

      location.remove((err) => {
        t.equal(err, null)
      })
    })

    test('Location.find(cb) calls Location.db.find method', (t) => {
      t.plan(2)
      const spy = dbSpy()
      const Location = LocationModel(spy)

      spy.emitter.on('find', (user_id) => {
        t.equal(user_id, 'foo')
      })

      Location.find('foo', (err) => {
        t.equal(err, null)
      })
    })

    test('Location.findWithinRadius(lat, lng, radius, cb) calls Location.db.findWithinRadius method', (t) => {
      t.plan(4)
      const spy = dbSpy()
      const Location = LocationModel(spy)
      const latitude = 1
      const longitude = 2
      const radius = 3

      spy.emitter.on('findWithinRadius', (lat, lng, rad) => {
        t.equal(lat, latitude)
        t.equal(lng, longitude)
        t.equal(rad, radius)
      })

      Location.findWithinRadius(latitude, longitude, radius, (err) => {
        t.equal(err, null)
      })
    })
  })
  done()
}
