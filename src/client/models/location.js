const http = require('choo/http')
const concat = require('unique-concat')
const storage = require('../storage')

const initialState = {
  isSubmitting: false,
  isFetchingRecent: false,
  isSearching: false,
  collection: [],
  searchResults: null,
  searchQuery: null,
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
  state: initialState,
  // state: storedState ? storedState.locations : initialState,
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
    updateCollection: (farms, state) => {
      const collection = state.collection
      const updatedCollection = concat(collection, farms, (farm) => { return farm.farm_id })
      return Object.assign({}, state, { collection: updatedCollection })
    },
    updateCurrentFarm: (data, state) => {
      const collection = state.collection
      const farm = collection.find(farm => {
        return farm.farm_id === data.farm_id
      })

      if (!farm) {
        state.collection.push(farm)
      } else {
        Object.assign(farm, data)
      }

      return Object.assign({}, state, { collection })
    },
    updateSearchCriteria: (searchCriteria, state) => {
      return Object.assign({}, state, { searchCriteria })
    },
    isFetchingRecent: (boolean, state) => {
      return Object.assign({}, state, { isFetchingRecent: boolean })
    },
    isFetchingFarm: (boolean, state) => {
      return Object.assign({}, state, { isFetchingFarm: boolean })
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
          if (response.statusCode !== 200) {
            throw new Error(response)
          }
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
    search: (data, state, dispatch, done) => {
      const search = window.location.search
      dispatch('locations:isSearching', true, () => {
        dispatch('locations:updateSearchCriteria', search, () => {
          console.log(search)
          http.get(`/api/v1/location/search${search}`, (err, response) => {
            if (err) throw err
            if (response.statusCode !== 200) throw new Error('Something went wrong')
            dispatch('locations:isSearching', false, () => {
              console.log(response.body)
              const data = JSON.parse(response.body)
              dispatch('locations:updateCollection', data.collection.features, done)
            })
          })
        })
      })
    },
    getFarm: (farmId, state, dispatch, done) => {
      dispatch('locations:isFetchingFarm', true, () => {
        http.get(`/api/v1/farm/${farmId}`, (err, response) => {
          if (err) throw err
          if (response.statusCode !== 200) throw new Error('Something went wrong')
          dispatch('locations:isFetchingFarm', false, () => {
            const data = JSON.parse(response.body)
            dispatch('locations:updateCollection', [data.farm], done)
          })
        })
      })
    }
  }
}

module.exports = model
