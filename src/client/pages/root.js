const h = require('choo/html')
const Topbar = require('../components/navigation')

const Root = (state, prevState, dispatch, content) => {
  return h`<div class="h-100">
    ${Topbar(state, prevState, dispatch)}
    ${content}
  </div>`
}

module.exports = Root
