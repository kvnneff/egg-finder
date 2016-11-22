const jwt = require('jsonwebtoken')

const defaultUser = {
  user_id: '1234',
  name: 'Foo',
  sub: '1234'
}

const getToken = (tokenUser) => {
  tokenUser = tokenUser || defaultUser
  const tokenSecret = new Buffer(process.env.AUTH0_SECRET, 'base64')
  const tokenOptions = { audience: process.env.AUTH0_CLIENT_ID }
  const token = jwt.sign(tokenUser, tokenSecret, tokenOptions)
  return token
}

module.exports = getToken
