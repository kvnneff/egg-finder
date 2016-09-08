const Test = require('tape')
const db = require('../../../server/db/locations')
const locationFixture = require('../../fixtures/location')

const testRunner = (server, done) => {
  db.init(server.db)

  Test('Location DB Queries', (t) => {
    server.db.createTable((err) => {
      if (err) throw err
      runTests(t, server, done)
    })
  })
}

const runTests = (t, server, done) => {
  const test = t.test
  t.plan(4)

  test('db.save(locations, cb) inserts a new location into the db', (t) => {
    t.plan(4)

    db.save(locationFixture(), (err, result) => {
      t.equal(err, null)
      db.find(result.user_id, (err, result) => {
        t.equal(err, null)
        server.db.reset((err, res) => {
          t.equal(err, null)
          t.equal(result.name, 'Mezzaluna Farms')
        })
      })
    })
  })

  test('db.find(id, cb) finds a location by its user_id', (t) => {
    t.plan(3)

    db.save(locationFixture(), (err, result) => {
      t.equal(err, null)
      db.find(result.user_id, (err, result) => {
        server.db.reset(() => {
          t.equal(err, null)
          t.equal(result.user_id, 'foo')
        })
      })
    })
  })

  test('db.remove(id, cb) remove a location by its id', (t) => {
    t.plan(5)

    db.save(locationFixture(), (err, result) => {
      t.equal(err, null)
      db.remove(result.user_id, (err, result) => {
        t.equal(err, null)
        t.equal(result.length, 1)
        db.find(result.user_id, (err, result) => {
          server.db.reset(() => {
            t.equal(err, null)
            t.equal(result, null)
          })
        })
      })
    })
  })

  test('db.findWithinRadius(latitude, longitude, radius, cb) locates locations within `radius`', (t) => {
    t.plan(3)

    db.save(locationFixture(), (err) => {
      t.equal(err, null)
      db.findWithinRadius(42.348636, -123.3425439, 6, (err, result) => {
        server.db.reset(() => {
          t.equal(err, null)
          t.equal(result[0].name, 'Mezzaluna Farms')
        })
      })
    })
  })

  return done()
}

module.exports = testRunner
