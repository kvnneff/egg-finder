const Auth0 = require('auth0-js')

/**
 * Initialize Sign In
 */

const init = ({ signInEl, onSuccess, onError }) => {
  const auth0 = new Auth0({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  })

  signInEl.addEventListener('submit', (event) => {
    event.preventDefault()
    const email = signInEl.querySelector('#email').value
    
    auth0.requestMagicLink({
      email
    }, (err, profile, id_token, access_token, state) => {
      if (err) return onError(err)
      if (onSuccess) onSuccess(profile, id_token, access_token, state)
    })
  })
}

module.exports = init
