const http = require('choo/http')
const qs = require('qs')
const storage = require('../storage')

const initialState = {
  isSubmitting: false,
  isFetchingRecent: false,
  isSearching: false,
  collection: [],
  searchResults: null,
  recent: [],
  formErrors: {
    name: '',
    phone: '',
    is_public: '',
    available: '',
    price: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    description: ''
  }
}

const storedState = storage.get()

const model = {
  namespace: 'locations',
  state: storedState ? storedState.locations : initialState,
  reducers: {
    formErrors: (data, state) => {
      const errors = Object.assign(state.formErrors, data)
      return Object.assign({}, state, errors)
    },
    isSubmitting: (boolean, state) => {
      return Object.assign({}, state, { isSubmitting: boolean })
    },
    submitSuccess: (data, state) => {
      return state
    },
    updateRecent: (data, state) => {
      return Object.assign({}, state, { recent: data })
    },
    updateSearchResults: (searchResults, state) => {
      return Object.assign({}, state, { searchResults })
    },
    isFetchingRecent: (boolean, state) => {
      return Object.assign({}, state, { isFetchingRecent: boolean })
    },
    isSearching: (boolean, state) => {
      return Object.assign({}, state, { isSearching: boolean })
    }
  },
  effects: {
    submit: (data, state, dispatch, done) => {
      dispatch('locations:isSubmitting', true, () => {
        http.post('/api/v1/location', { json: data }, (err, response) => {
          if (err) throw err
          if (response.statusCode !== 200) throw new Error(response)
          dispatch('locations:isSubmitting', false, () => {
            dispatch('locations:submitSuccess', done)
          })
        })
      })
    },
    getRecent: (data, state, dispatch, done) => {
      dispatch('locations:isFetchingRecent', true, () => {
        http.get('/api/v1/location/recent', {}, (err, response) => {
          if (err) throw err
          if (response.statusCode !== 200) throw new Error('Something went wrong')
          dispatch('locations:isFetchingRecent', false, () => {
            const data = JSON.parse(response.body)
            dispatch('locations:updateRecent', data.collection, done)
          })
        })
      })
    },
    findWithinRadius: (data, state, dispatch, done) => {
      const params = qs.stringify(data)
      dispatch('locations:isSearching', true, () => {
        http.get(`/api/v1/location/search_radius?${params}`, (err, response) => {
          if (err) throw err
          if (response.statusCode !== 200) throw new Error('Something went wrong')
          dispatch('locations:isSearching', false, () => {
            const data = JSON.parse(response.body)
            console.log(data)
            dispatch('locations:updateSearchResults', data.collection, done)
          })
        })
      })
    },
    findByName: (data, state, dispatch, done) => {
      const params = qs.stringify(data)
      dispatch('locations:isSearching', true, () => {
        http.get(`/api/v1/location/search_name?${params}`, (err, response) => {
          if (err) throw err
          if (response.statusCode !== 200) throw new Error('Something went wrong')
          dispatch('locations:isSearching', false, () => {
            const data = JSON.parse(response.body)
            console.log(response.body)
            dispatch('locations:updateSearchResults', data.collection, done)
          })
        })
      })
    }
  }
}

module.exports = model
