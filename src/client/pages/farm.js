const h = require('choo/html')
const sf = require('sheetify')
const Root = require('./root')
const FarmMap = require('../components/map')

const mapStyle = sf`
  :host {
    position: relative;
    max-width: 100%;
    width: 100%;
    height: 200px;
    overflow-x: hidden;
  }
  #map {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
    max-height: 800px;
    border-top: 1px solid #E2E2E2;
  }
  `

const Farm = (state, prevState, dispatch) => {
  const collection = state.locations.collection
  const farm_id = parseInt(state.params.farm_id, 10)
  const farm = collection.find(farm => { return farm.properties.farm_id === farm_id })

  if (!farm) {
    getFarm(farm_id, dispatch)()

    return h`<div class="FarmPage">
      Loading
    </div>`
  }

  const properties = farm.properties

  const el = h`<div class="FarmPage" onload=${getFarm(farm_id, dispatch)}>
    <div class="mw7 center pa3 bg-white black">
      <h1 class="f2 ma0">${properties.name}</h1>
      <h2 class="f4 fw4 gray mt0">${address(properties)}</h2>
      <div class="mv3">
        ${FarmMap({ geoJSON: farm, style: mapStyle })}
      </div>
      <div class="cf mv3">
        <div class="fl w-75">
          <p class="mt0">
            <h2 class="mt0">Contact this Farm</h2>
            ${properties.email ? emailLink(properties.email) : ''}
            ${properties.phone ? h`<span>${properties.phone}</span>` : ''}
          </p>
          <p>
            <h2 class="mt0">About this Farm</h2>
            ${properties.description}
          </p>
          <p>
            <ul class="list pa0 mt0">
              <li>
                ${properties.organic ? checkmark() : ''}
                Organic
              </li>
              <li>
                ${properties.free_range ? checkmark() : ''}
                Free-range
              </li>
            </ul>
          </p>
        </div>
        <div class="fl w-25">
          <div class="w-100 tc bg-black-05 pa3">
            <h3 class="mt0">Status</h3>
            ${properties.available ? 'Available' : 'Unavailable'}
          </div>
        </div>
      </div>
    </div>
  </div>`

  return Root(state, prevState, dispatch, el)
}

const emailLink = (emailAddress) => {
  return h`<a href="mailto:${emailAddress}">${emailAddress}</a>`
}

const checkmark = () => {
  return h`<i class="fa fa-check" aria-hidden="true"></i>`
}

const address = (properties) => {
  const { street, city, state, zipcode } = properties
  return h`<ul class="list ma0 pa0">
    ${street ? h`<li>${street}</li>` : ''}
    <li>${city}, ${state} ${zipcode ? zipcode : ''}</li>
  </ul>`
}

const getFarm = (id, dispatch) => {
  return () => {
    dispatch('locations:getFarm', id)
  }
}

module.exports = Farm
