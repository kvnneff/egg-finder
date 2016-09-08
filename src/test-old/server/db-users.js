/*global describe, it, afterEach*/
var assert = require('assert')
var user = require('../../server/db/user')

afterEach(function (done) {
  user.removeAll(function (err) {
    if (err) return done(err)
    return done()
  })
})

describe('User DB Queries', function () {
  describe('user.save(user, cb)', function () {
    it('inserts a new user into the database', function (done) {
      user.save({ authID: 'Foo', nickname: 'bar' }, function (err, result) {
        assert.equal(err, null)
        user.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.nickname, 'bar')
          done()
        })
      })
    })
  })
  describe('user.findByID(id, cb)', function () {
    it('locates a user by id', function (done) {
      user.save({ authID: 'Foo', nickname: 'bar' }, function (err, result) {
        assert.equal(err, null)
        user.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.nickname, 'bar')
          done()
        })
      })
    })
  })
  describe('user.remove(user, cb)', function () {
    it('removes a user from the database', function (done) {
      user.save({ authID: 'Foo', nickname: 'bar' }, function (err, result) {
        assert.equal(err, null)
        user.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.nickname, 'bar')
          var id = result.id
          user.remove(id, function (err, result) {
            assert.equal(err, null)
            assert.equal(result, 1)
            user.findByID(id, function (err, result) {
              assert.equal(err, null)
              assert.equal(result, null)
              done()
            })
          })
        })
      })
    })
  })
})
