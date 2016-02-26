var Failure = require('failure')
var bcrypt = require('bcrypt')
var uuid = require('node-uuid')
var Joi = require('joi')
var mailer = require('../mailer')
var db = require('../db/user')
var tokendb = require('../db/token')

/**
 * Validation schema for user object
 */

var UserSchema = Joi.object().keys({
  id: Joi.number().empty(null),
  password: Joi.string().min(6).empty(null),
  email: Joi.string().required(),
  email_verified: Joi.boolean().empty(false)
})

function User (data) {
  var id = data.id || null
  var password = data.password
  var email = data.email
  var email_verified = data.email_verified || false

  /**
   * Save `user` to data store if the user doesn't exist, else
   * update the user in the data store with attributes from `user`.
   * The resulting user id will be passed as the second argument to
   * the provided callback.
   * @param  {Function} cb   Callback
   * @return {Function}
   */
  function save (cb) {
    if (!password) return saveToDB()
    bcrypt.hash(password, 8, function (err, hash) {
      if (err) throw err
      password = hash
      var json = toJSON()
      json.password = password
      return saveToDB(json)
    })

    function saveToDB (json) {
      validate(function (err, result) {
        if (err) return cb(err)
        db.save(json, function (err, result) {
          if (err) return cb(err)
          id = result
          return cb(null, result)
        })
      })
    }
  }

  /**
   * Remove `user` from the data store
   * @param  {Function} cb   Callback function
   */
  function remove (cb) {
    db.remove(id, function (err, numRemoved) {
      if (err) return cb(err)
      return cb(null, numRemoved)
    })
  }

  function toJSON () {
    return {
      id: id,
      email: email,
      email_verified: email_verified
    }
  }

  function validate (cb) {
    Joi.validate(toJSON(), UserSchema, function (err, user) {
      if (err) {
        return cb(Failure(err.message, {
          type: 'StatusError',
          status: 400
        }))
      }
      return cb(null, user)
    })
  }

  function validEmail (cb) {
    db.validEmail(id, function (err) {
      if (err) return cb(err)
      return cb(null)
    })
  }

  function sendNewUserEmail (cb) {
    var token = uuid.v4()
    var link = 'http://' + process.env.HOSTNAME + '/verify?token=' + token
    var mailOptions = {
      from: 'Kevin Neff <kvnneff@gmail.com>',
      to: email,
      subject: 'Please confirm your Email account',
      text: 'Hello!\n\nThank you for registering with Egg Finder.  Please click on the following link to verify your email and complete the registration:\n\n' + link
    }

    mailer.sendMail(mailOptions, function (err, response) {
      if (err) return cb(err)
      tokendb.save(id, token, function (err) {
        if (err) return cb(err)
        return cb()
      })
    })
  }

  function matchPassword (pw, cb) {
    bcrypt.compare(pw, password, function (err, res) {
      if (err) return cb(err)
      return cb(null, res)
    })
  }

  function updatePassword (pw, cb) {
    if (!pw) throw new Error('expected a password')
    bcrypt.hash(pw, 8, function (err, hash) {
      if (err) throw err
      pw = hash
      db.updatePassword(id, pw, function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    })
  }

  function initPasswordReset (cb) {
    var resetPasswordToken = uuid.v4()
    db.initPasswordReset(id, resetPasswordToken, function (err, result) {
      if (err) return cb(err)
      var link = 'http://' + process.env.HOSTNAME + '/new-password?token=' + resetPasswordToken
      var mailOptions = {
        from: 'Kevin Neff <kvnneff@gmail.com>',
        to: result.email,
        subject: 'Egg Finder Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n' + link + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }

      mailer.sendMail(mailOptions, function (err, response) {
        if (err) return cb(err)
        return cb(null)
      })
    })
  }

  function contact (fromEmail, message, cb) {
    var mailOptions = {
      from: 'Kevin Neff <kvnneff@gmail.com>',
      to: email,
      subject: 'You\'ve received a message on Egg Finder',
      text: message
    }
    mailer.sendMail(mailOptions, function (err, response) {
      if (err) return cb(err)
      return cb(err)
    })
  }

  return {
    id: id,
    email: email,
    remove: remove,
    contact: contact,
    save: save,
    sendNewUserEmail: sendNewUserEmail,
    validEmail: validEmail,
    matchPassword: matchPassword,
    initPasswordReset: initPasswordReset,
    updatePassword: updatePassword
  }
}

User.verifyToken = function verifyToken (token, cb) {
  if (!token) {
    return cb(Failure('Expected a token', {
      type: 'StatusError',
      status: 400
    }))
  }

  tokendb.findByToken(token, function (err, res) {
    if (err) return cb(err)
    if (!res) {
      return cb(Failure('Token does not exist', {
        type: 'StatusError',
        status: 400
      }))
    }

    User.findById(res.user_id, function (err, user) {
      if (err) return cb(err)
      tokendb.remove(user.id, function (err) {
        if (err) return cb(err)
        user.validEmail(function (err) {
          if (err) return cb(err)
          return cb(null, user)
        })
      })
    })
  })
}

/**
 * Find a user by their `id`
 * @param  {Number|String}   id Id of user to locate
 * @param  {Function} cb Callback
 */
User.findById = function findById (id, cb) {
  db.findById(id, function (err, doc) {
    if (err) return cb(err)
    if (doc === null) return cb(null, null)
    return cb(null, User(doc))
  })
}

User.findByEmail = function findByEmail (email, cb) {
  db.findByEmail(email, function (err, doc) {
    if (err) return cb(err)
    if (doc === null) return cb(null)
    return cb(null, User(doc))
  })
}

User.findByResetToken = function findByResetToken (token, cb) {
  db.findByResetToken(token, function (err, doc) {
    if (err) return cb(err)
    if (doc === null) return cb(null)
    return cb(null, User(doc))
  })
}

User.findAll = function findAll (cb) {
  db.findAll(function (err, result) {
    if (err) return cb(err)
    return cb(null, result)
  })
}

User.register = function register (user, cb) {
  User.findByEmail(user.email, function (err, result) {
    if (err) return cb(err)
    if (result) {
      return cb(Failure('Email address already exists.', {
        type: 'StatusError',
        status: 400
      }))
    }
    user.save(function (err) {
      if (err) return cb(err)
      user.sendNewUserEmail(function (err) {
        if (err) return cb(err)
        return cb(null, user)
      })
    })
  })
}

module.exports = User
