const h = require('choo/html')
const Auth0 = require('auth0-lock').default

const lock = new Auth0(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)

const Navigation = (state, prevState, dispatch) => {
  const isAuthenticated = state.user.idToken
  let button

  const signIn = () => {
    lock.show()
  }

  const signOut = () => {
    dispatch('user:signOut')
  }

  lock.on('authenticated', (authResult) => {
    lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) throw error
      dispatch('user:authenticated', {
        idToken: authResult.idToken,
        profile: JSON.stringify(profile)
      })
    })
  })

  if (isAuthenticated) {
    button = h`<a class="link dim white f6 f5-ns dib mr3 href="" title="Sign Out" onclick=${signOut}>Sign Out</a>`
  } else {
    button = h`<a class="link dim white f6 f5-ns dib mr3" href="" title="Sign In" onclick=${signIn}>Sign In</a>`
  }

  return h`<nav class="Navigation pa3 pa4-ns">
    <a class="link dim white b f6 f5-ns dib mr3" href="#" title="Home">Egg Finder</a>
    ${button}
    <a class="link dim white f6 f5-ns dib mr3" title="Create Listing" href="/create">Create</a>
  </nav>`
}

module.exports = Navigation
