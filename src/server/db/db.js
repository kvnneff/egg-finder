var pg = require('pg')
var url = process.env.DATABASE_URL

module.exports = {
  query: function (text, values, cb) {
    pg.connect(url, function (err, client, done) {
      if (err) return cb(err)
      client.query(text, values, function (err, result) {
        done()
        if (err) return cb(err)
        cb(null, result)
      })
    })
  }
}
