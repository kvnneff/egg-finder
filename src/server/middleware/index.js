const jwt = require('express-jwt')
const sanitize = require('./sanitize')
const error = require('./error')

const authRequired = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
})

const auth = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID,
  credentialsRequired: false
})

module.exports = {
  authRequired,
  sanitize,
  error,
  auth
}
