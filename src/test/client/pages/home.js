const Test = require('tape')
const event = require('synthetic-dom-events')
const Emitter = require('component-emitter')
const Home = require('../../../client/pages/home')

const emitter = new Emitter()

const locationsFixture = () => {
  return [{
    id: 1,
    name: 'Foo',
    address: '555 Some Road',
    city: 'Williams',
    state: 'OR',
    available: true,
    organic: true,
    freeRange: true
  }]
}

const dispatch = (msg, data) => {
  emitter.emit(msg, data)
}

Test('Home Page', (t) => {
  const test = t.test
  t.plan(3)

  test('returns a div with class Home', (t) => {
    t.plan(2)
    const homeEl = Home({}).querySelector('.Home')
    t.equal(homeEl.classList[0], 'Home')
    t.equal(homeEl.tagName, 'DIV')
  })

  test('displays a list of locations', (t) => {
    t.plan(1)
    const homeEl = Home({ locations: locationsFixture() })
    const listEl = homeEl.querySelector('.Home-locations')
    t.equal(listEl.children.length, 1)
  })

  test('dispatches route change if item is clicked', (t) => {
    t.plan(1)

    emitter.on('location', (data) => {
      emitter.off()
      document
        .querySelector('.Locations-listItem')
        .parentElement.removeChild(itemEl)
      t.equal(data.location, '/location/1')
    })
    const homeEl = Home({
      locations: locationsFixture()
    }, {}, dispatch)
    const listEl = homeEl.querySelector('.Home-locations')
    const itemEl = listEl.children[0]
    const ev = event('click')

    document.body.appendChild(itemEl)

    itemEl.dispatchEvent(ev)
  })
})
