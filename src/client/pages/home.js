const h = require('choo/html')
const sf = require('sheetify')
const Root = require('./root')
const Search = require('../components/search')
const LocationMap = require('../components/map')

const Home = (state, prevState, dispatch) => {
  const recent = state.locations.recent
  const searchResults = state.locations.searchResults

  const getRecent = () => {
    dispatch('locations:getRecent')
  }

  const doAddressSearch = (event) => {
    event.preventDefault()
    const query = event.target.children[0].value
    const radius = 50
    dispatch('locations:findWithinRadius', { query, radius })
  }

  const doNameSearch = (event) => {
    event.preventDefault()
    const query = event.target.children[0].value
    dispatch('locations:findByName', { query })
  }

  const el = h`<div class="Home" onload=${getRecent}>
    <div class="tc pa3 mw6 center">
      <h1 class="f1">Nest Box</h1>
      <h2>Find eggs being sold by small farms near you</h2>

      <div class="w5 center">
        <div class="mb3">
          ${Search({ onSubmit: doNameSearch })}
        </div>
      </div>
    </div>
  </div>`

  return Root(state, prevState, dispatch, el)
}

const Location = (state, dispatch) => {
  const viewItem = (itemId) => {
    return () => {
      return dispatch('location', { location: `/location/${itemId}` })
    }
  }

  return h`<li class="Locations-listItem" onclick="${viewItem(state.id)}">
    <div class="Locations-columnContainer">
      <div class="Locations-listItemLeftCol">
        <h4>${state.name}</h4>
        <span class="Locations-address">${state.address}</span>
        <div class="Locations-cityState">${state.city}, ${state.state}</div>
      </div>
      <div class="Locations-listItemRightCol">
        <ul class="Locations-tagSet">
          ${state.available
            ? h`<li class="Locations-tag">In stock</li>`
            : ''
          }
          ${state.organic
            ? h`<li class="Locations-tag">Organic</li>`
            : ''
          }
          ${state.freeRange
            ? h`<li class="Locations-tag">Free Range</li>`
            : ''
          }
        </ul>
      </div>
    </div>
    <div class="Locations-description">${state.description}</div>
  </li>`
}

module.exports = Home
