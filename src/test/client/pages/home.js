const Test = require('tape')
const event = require('synthetic-dom-events')
const Emitter = require('component-emitter')
const Home = require('../../../client/pages/home')

const emitter = new Emitter()

const dispatch = (msg, data) => {
  emitter.emit(msg, data)
}

Test('Home Page', (t) => {
  const test = t.test
  t.plan(3)

  test('returns a div', (t) => {
    t.plan(1)
    const homeEl = Home({}).querySelector('.Home')
    t.equal(homeEl.tagName, 'DIV')
  })

  test('displays Search component', (t) => {
    t.plan(1)
    const homeEl = Home()
    t.ok(homeEl.querySelector('.Search'))
  })

  test('dispatches locations:search when Search form is submitted', (t) => {
    t.plan(2)
    const homeEl = Home({}, {}, dispatch)

    emitter.on('locations:search', (data) => {
      emitter.off()
      t.ok(data)
      t.equal(data.type, 'name')
    })

    homeEl
      .querySelector('.Search')
      .dispatchEvent(event('submit'))
  })
})
