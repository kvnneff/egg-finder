const h = require('choo/html')
const Topbar = require('../components/navigation')

const Root = (state, prevState, dispatch, content) => {
  return h`<div>
    ${Topbar(state, prevState, dispatch)}
    <div class="">
      ${content}
    </div>
  </div>`
}

module.exports = Root
