/*global describe, it*/
var assert = require('assert')
var sanitizeMiddleware = require('../../server/middleware/sanitize')

var req = {
  body: {
    test1: 'This is clean',
    test2: 'This <script>var isNot=true;</script> isnt!',
    test3: 'Im <b>technically</b> allowed.',
    test4: null,
    test5: 1,
    test6: 'This &lt;shouldnt&gt; work'
  }
}

describe('sanitizeHTML', function () {
  it('sanitizes XSS from req.body', function (done) {
    function next () {
      assert.equal(req.body.test1, 'This is clean')
      assert.equal(req.body.test2, 'This  isnt!')
      assert.equal(req.body.test3, 'Im technically allowed.')
      assert.equal(req.body.test4, null)
      assert.equal(req.body.test5, 1)
      assert.equal(req.body.test6, 'This  work')
      return done()
    }
    sanitizeMiddleware(req, {}, next)
  })
})
