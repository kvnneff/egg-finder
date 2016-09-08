/*global describe, it, afterEach*/
var assert = require('assert')
var clone = require('component-clone')
var users = require('../../server/db/user')
var UserModel = require('../../server/models/user')

var userData = {
  authID: 'foo',
  nickname: 'bar'
}

describe('UserModel Model', function () {
  afterEach(function (done) {
    users.removeAll(function (err) {
      if (err) return done(err)
      return done()
    })
  })

  describe('UserModel(attributes)', function () {
    it('returns a new UserModel', function () {
      var user = UserModel(clone(userData))
      assert.equal(user.nickname, 'bar')
    })
  })

  describe('UserModel#save(cb)', function () {
    it('inserts a new user into the database', function (done) {
      var user = UserModel(clone(userData))
      user.save(function (err, result) {
        assert.equal(err, null)
        UserModel.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.authID, 'foo')
          assert.equal(result.nickname, 'bar')
          done()
        })
      })
    })
  })
  describe('UserModel.findByID(id, cb)', function () {
    it('returns a user with `id`', function (done) {
      var user = UserModel(clone(userData))
      user.save(function (err, result) {
        assert.equal(err, null)
        UserModel.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.authID, 'foo')
          assert.equal(result.nickname, 'bar')
          done()
        })
      })
    })
  })
  describe('UserModel#remove(cb)', function () {
    it('removes a user from the database', function (done) {
      var user = UserModel(clone(userData))
      user.save(function (err, result) {
        assert.equal(err, null)
        UserModel.findByID(result, function (err, result) {
          assert.equal(err, null)
          assert.equal(result.nickname, 'bar')
          var id = result.id
          user.remove(function (err, result) {
            assert.equal(err, null)
            assert.equal(result, 1)
            UserModel.findByID(id, function (err, result) {
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
