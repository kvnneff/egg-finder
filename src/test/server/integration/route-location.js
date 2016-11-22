const needle = require('needle')
const Test = require('tape')
const locationFixture = require('../../fixtures/location')
const getToken = require('../../utils/token')


const requestOptions = {
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
}

const baseURI = 'http://localhost:8080/api/v1'

const Location = (server, done) => {
  Test('/location', (t) => {
    const test = t.test
    t.plan(6)

    test('GET /location/:user_id returns the location of :user_id', (t) => {
      t.plan(5)
      const uri = `${baseURI}/location`
      needle.post(uri, locationFixture(), requestOptions, (err, response) => {
        t.equal(err, null)
        t.ok(response.body)
        needle.get(`${uri}/1234`, requestOptions, (err, response) => {
          t.equal(err, null)
          server.db.reset((err, res) => {
            t.equal(err, null)
            t.equal(response.body.name, 'Mezzaluna Farms')
          })
        })
      })
    })

    test('POST /location returns an error if unauthenticated', (t) => {
      t.plan(3)
      const uri = `${baseURI}/location`
      needle.post(uri, locationFixture(), (err, response) => {
        const body = response.body
        t.equal(err, null)
        t.ok(body.error)
        t.equal(body.error.message, 'No authorization token was found')
      })
    })

    test('POST /location creates a new location and returns it', (t) => {
      t.plan(3)
      const uri = `${baseURI}/location`
      needle.post(uri, locationFixture(), requestOptions, (err, response) => {
        t.equal(err, null)
        server.db.reset((err, res) => {
          t.equal(err, null)
          t.ok(response.body)
        })
      })
    })

    test('DELETE /location/:user_id destroys the associated location', (t) => {
      t.plan(8)
      const uri = `${baseURI}/location`
      needle.post(uri, locationFixture(), requestOptions, (err, response) => {
        t.equal(err, null)
        t.ok(response.body)
        needle.delete(`${uri}/1234`, null, requestOptions, (err, response) => {
          t.equal(err, null)
          t.equal(response.statusCode, 200)
          needle.get(`${uri}/1234`, requestOptions, (err, response) => {
            t.equal(err, null)
            server.db.reset((err, res) => {
              t.equal(err, null)
              t.ok(response.body.message)
              t.equal(response.body.message, 'No location found')
            })
          })
        })
      })
    })

    test('GET /location/search finds a location by its name', (t) => {
      t.plan(6)
      const locationData = locationFixture()
      const uri = `${baseURI}/location`
      const query = `type=name&search_text=${locationData.name}`
      needle.post(uri, locationFixture(), requestOptions, (err, response) => {
        t.equal(err, null)
        t.ok(response.body)
        needle.get(`${uri}/search?${query}`, {}, (err, response) => {
          t.equal(err, null)
          server.db.reset((err, res) => {
            t.equal(err, null)
            t.ok(response.body.collection)
            t.equal(response.body.collection.features.length, 1)
          })
        })
      })
    })

    test('GET /location/search finds a location by its address', (t) => {
      t.plan(6)
      const locationData = locationFixture()
      const uri = `${baseURI}/location`
      const query = `type=address&search_text=${locationData.city}, ${locationData.state}`
      needle.post(uri, locationFixture(), requestOptions, (err, response) => {
        t.equal(err, null)
        t.ok(response.body)
        needle.get(`${uri}/search?${query}`, {}, (err, response) => {
          t.equal(err, null)
          server.db.reset((err, res) => {
            t.equal(err, null)
            t.ok(response.body.collection)
            t.equal(response.body.collection.features.length, 1)
          })
        })
      })
    })

    done()
  })
}

module.exports = Location
