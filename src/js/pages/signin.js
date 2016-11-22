const signIn = require('../components/signin')
const messages = require('../components/messages')

const signInEl = document.querySelector('.signin-form')
const signInMessageEl = document.querySelector('.signin-message')

const onSignInSuccess = (profile, id_token, access_token, state) => {
  const successMessageEl = messages.success('An email was sent successfully! Check your inbox.')
  signInMessageEl.appendChild(successMessageEl)
}

const onSignInError = (err) => {
  console.log('error', err)
}

signIn({
  signInEl,
  onSuccess: onSignInSuccess,
  onError: onSignInError
})

