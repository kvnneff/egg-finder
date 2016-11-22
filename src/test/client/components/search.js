const Test = require('tape')
const event = require('synthetic-dom-events')
const Search = require('../../../client/components/search')

Test('Search', (t) => {
  const test = t.test
  t.plan(2)

  test('returns a form', (t) => {
    t.plan(1)
    const searchEl = Search()
    t.equal(searchEl.tagName, 'FORM')
  })

  test('executes onSubmit function when form is submitted', (t) => {
    t.plan(1)
    const searchEl = Search({
      onSubmit: (e) => {
        t.ok(e)
      }
    })
    searchEl.dispatchEvent(event('submit'))
  })
})
