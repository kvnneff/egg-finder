const bel = require('bel')

const success = (message) => {
  return bel`<div class='bg-washed-green dark-green pa3 ba b--dark-green'>
    ${message}
  </div>` 
}

const messages = {
  success
}

module.exports = messages
