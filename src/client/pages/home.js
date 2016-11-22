const h = require('choo/html')
const serialize = require('form-serialize')
const qs = require('qs')
const Root = require('./root')
const Search = require('../components/search')

const Home = (state, prevState, dispatch) => {
  const doSearch = (event) => {
    event.preventDefault()
    const data = serialize(event.target, { hash: true })
    const params = qs.stringify(data)
    const location = `/search?${params}`
    window.location.href = location
  }

  const el = h`<div class="Home">
    <div class="tc pa3 mw6 center">
      <h1 class="f1">Nest Box</h1>
      <h2>Find eggs being sold by small farms near you</h2>

      <div class="w5 center">
        <div class="mb3">
          ${Search({ onSubmit: doSearch })}
        </div>
      </div>
    </div>
  </div>`

  return Root(state, prevState, dispatch, el)
}

module.exports = Home
