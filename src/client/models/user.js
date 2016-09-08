const storage = require('../storage')

const initialState = {
  idToken: null,
  profile: null
}

const storedState = storage.get()

const model = {
  namespace: 'user',
  state: storedState ? storedState.user : initialState,
  reducers: {
    authenticated: (data, state) => {
      return Object.assign({}, state, {
        idToken: data.idToken,
        profile: data.profile
      })
    },
    signOut: (data, state) => {
      return Object.assign({}, state, {
        idToken: null,
        profile: null
      })
    }
  }
}

module.exports = model
