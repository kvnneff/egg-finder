import superagent from 'superagent'

const agent = superagent.agent()
const account = {
  username: process.env.AUTH0_USERNAME,
  password: process.env.AUTH0_PASSWORD,
  connection: 'Username-Password-Authentication',
  grant_type: 'password',
  scope: 'openid',
  client_id: process.env.AUTH0_CLIENT_ID
}

export default function login (cb) {
  agent
    .post('https://' + process.env.AUTH0_DOMAIN + '/oauth/ro')
    .send(account)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end((err, res) => {
      if (err) throw err
      return cb(res.body)
    })
}
