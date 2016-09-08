const http = require('choo/http')

const model = {
  effects: {
    submit: (data, state, dispatch, done) => {
      dispatch('locations:isSubmitting', true, () => {
        http.post('/api/v1/location', {
          json: data,
          headers: {
            'Authorization': `Bearer ${state.user.idToken}`
          }
        }, (err, response) => {
          if (err) throw err
          if (response.statusCode !== 200) throw new Error(response)
          dispatch('locations:isSubmitting', false, () => {
            dispatch('locations:submitSuccess', done)
          })
        })
      })
    }
  }
}

module.exports = model
