/*global localStorage*/

const save = state => {
  state = Object.assign({}, state)
  localStorage.setItem('state', JSON.stringify(state))
}

const get = () => {
  let value = localStorage.getItem('state')
  if (value === null) return value
  return JSON.parse(value)
}

module.exports = { save, get }
