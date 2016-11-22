const Test = require('tape')
const event = require('synthetic-dom-events')
const Emitter = require('component-emitter')
const Navigation = require('../../../client/components/navigation')

const emitter = new Emitter()

const dispatch = (msg, data) => {
  emitter.emit(msg, data)
}

Test('Navigation', (t) => {
  const test = t.test
  t.plan(4)

  test('returns a div', (t) => {
    t.plan(1)
    const navigationEl = Navigation()
    t.equal(navigationEl.tagName, 'NAV')
  })

  test('displays Sign In button if user is not signed in', (t) => {
    t.plan(1)
    const navigationEl = Navigation()
    t.equal(navigationEl.children[1].innerText, 'Sign In')
  })

  test('displays Sign Out button if user is signed in', (t) => {
    t.plan(1)
    const navigationEl = Navigation({ user: { idToken: '1234' } })
    t.equal(navigationEl.children[1].innerText, 'Sign Out')
  })

  test('dispatches user:signOut if Sign Out button is clicked', (t) => {
    t.plan(1)
    const navigationEl = Navigation({ user: { idToken: '1234' } }, {}, dispatch)
    emitter.on('user:signOut', () => {
      emitter.off()
      t.ok(true)
    })
    navigationEl.children[1].dispatchEvent(event('click'))
  })

  // test('shows Auth0 Lock when Sign In button is clicked', (t) => {
  //   t.plan(1)
  //   const navigationEl = Navigation({}, {}, dispatch)
  //   navigationEl.children[1].dispatchEvent(event('click'))
  //   t.ok(document.querySelector('.auth0-lock-container'))
  // })
})
