const Auth0 = require('auth0-js')

const auth0 = new Auth0({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  callbackURL: process.env.AUTH0_CALLBACK_URL
})

const registerForm = document.querySelector('.register-form')

const submitForm = (email) => {
  auth0.requestMagicLink({
    email
  }, (err) => {
    if (err) {
      console.error(err.error_description)
      return
    }

    const div = document.createElement('div')
    div.innerHTML = '<p>An email has been sent to your address with a link that will allow you to sign in.'
    document.querySelector('.register-success').appendChild(div)
  })
}

  auth0.signup({
    connection: 'Username-Password-Authentication',
    username,
    password,
    sso: true,
    auto_login: true
  }, (err) => {
    if (err) console.error(`something went wrong: ${err.message}`)
    console.log('success signup')
  })
} 

registerForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const email = event.target.querySelector('#email').value
  submitForm(email)
})
