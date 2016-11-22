const h = require('choo/html')
const Root = require('./root')
const LocationMap = require('../components/map')

const findFarm = (farmId, collection) => {
  return collection.find(farm => {
    return farm.id === farmId
  })
}

const Farm = (state, prevState, dispatch) => {
  const farmId = state.params.farmId
  const farmCollection = state.farmCollection
  const farm = findFarm(farmId, farmCollection)

  const el = h`<div class="FarmPage h-100 relative">
    <div class="pa3 mw6 z-5 left-2 top-2 relative bg-black-30">
      <div class="pa2 bg-light-gray">
        <div class="pa3 bg-white black">
          ${farm.name}
        </div>
      </div>
    </div>
  </div>`

  return Root(state, prevState, dispatch, el)
}

module.exports = Farm
