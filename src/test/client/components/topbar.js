const Test = require('tape')
const event = require('synthetic-dom-events')
const Emitter = require('component-emitter')
const Topbar = require('../../../client/components/topbar')

const emitter = new Emitter()

const dispatch = (msg, data) => {
  emitter.emit(msg, data)
}

Test('Login Button', (t) => {
  const test = t.test
  t.plan(1)

  test('returns a div with class Topbar', (t) => {
    t.plan(2)
    const topbarEl = Topbar()
    t.equal(topbarEl.classList[0], 'Topbar')
    t.equal(topbarEl.tagName, 'DIV')
  })

  // test('displays a list of locations', (t) => {
  //   t.plan(1)
  //   const homeEl = Home({ locations: locationsFixture() })
  //   const listEl = homeEl.querySelector('.Home-locations')
  //   t.equal(listEl.children.length, 1)
  // })
  //
  // test('dispatches route change if item is clicked', (t) => {
  //   t.plan(1)
  //
  //   emitter.on('location', (data) => {
  //     emitter.off()
  //     document
  //       .querySelector('.Locations-listItem')
  //       .parentElement.removeChild(itemEl)
  //     t.equal(data.location, '/location/1')
  //   })
  //   const homeEl = Home({
  //     locations: locationsFixture()
  //   }, {}, dispatch)
  //   const listEl = homeEl.querySelector('.Home-locations')
  //   const itemEl = listEl.children[0]
  //   const ev = event('click')
  //
  //   document.body.appendChild(itemEl)
  //
  //   itemEl.dispatchEvent(ev)
  // })
})
