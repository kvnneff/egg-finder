const h = require('choo/html')
const Root = require('./root')
const Search = require('../components/search')
const LocationMap = require('../components/map')

const SearchResults = (state, prevState, dispatch) => {
  const collection = state.locations.collection

  if (state.locations.searchCriteria !== window.location.search) {
    dispatch('locations:search')
    return h`<div>Loading</div>`
  }

  const el = h`<div class="SearchPage h-100 relative">
    ${LocationMap({ geoJSON: collection })}
    <div class="pa3 mw6 z-5 left-2 top-2 relative bg-black-30">
      <div class="pa2 bg-light-gray">
        <div class="pa3 bg-white black">
          ${Search({})}
          ${collection.length
            ? Results({ collection })
            : 'No locations found'}
        </div>
      </div>
    </div>
  </div>`

  return Root(state, prevState, dispatch, el)
}

const Results = (state) => {
  return h`<ul class="list pa0">
    ${state.collection.map(location => {
      return Location({ location })
    })}
  </ul>`
}

const Location = (state) => {
  const location = state.location.properties

  return h`<li class="">
    <div class="">
      <div class="">
        <h4><a href="/farm/${location.farm_id}">${location.name}</a></h4>
        <span class="">${location.address}</span>
        <div class="">${location.city}, ${location.state}</div>
      </div>
      <div class="">
        <ul class="list pa0">
          ${location.available
            ? h`<li class="">In stock</li>`
            : ''
          }
          ${location.organic
            ? h`<li class="">Organic</li>`
            : ''
          }
          ${location.freeRange
            ? h`<li class="">Free Range</li>`
            : ''
          }
        </ul>
      </div>
    </div>
    <div class="">${location.description}</div>
  </li>`
}

module.exports = SearchResults
