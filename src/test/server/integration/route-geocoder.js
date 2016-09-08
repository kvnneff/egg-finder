const needle = require('needle')
const Test = require('tape')
const getToken = require('../../utils/token')

const baseURI = 'http://localhost:8080/api/v1'

const requestOptions = {
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
}

const Geocoder = (server, done) => {
  Test('/geocode', (t) => {
    const test = t.test
    t.plan(1)

    test('returns the coordinates of a given address', (t) => {
      t.plan(2)
      const address = 'address=220 Nickerson, Seattle, WA'
      const uri = `${baseURI}/geocode`

      needle.post(uri, address, requestOptions, (err, response) => {
        t.equal(err, null)
        t.ok(response.body.result)
      })
    })

    done()
  })
}

module.exports = Geocoder
