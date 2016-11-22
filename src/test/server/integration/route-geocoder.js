const needle = require('needle')
const Test = require('tape')

const baseURI = 'http://localhost:8080/api/v1'

const Geocoder = (server, done) => {
  Test('/geocode', (t) => {
    const test = t.test
    t.plan(1)

    test('returns the coordinates of a given address', (t) => {
      t.plan(2)

      const uri = `${baseURI}/geocode?type=address&search_text=5285 Williams Hwy, Williams, OR`

      needle.get(uri, (err, response) => {
        t.equal(err, null)
        t.ok(response.body.result)
      })
    })

    done()
  })
}

module.exports = Geocoder
