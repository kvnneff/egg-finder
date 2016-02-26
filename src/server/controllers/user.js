var Failure = require('failure')
var UserModel = require('../models/user')

function logout (req, res) {
  req.session.destroy()
  req.logout()
  res.redirect('/')
}

function displayLogin (req, res, next) {
  var message = req.session.message || null
  if (message) req.session.message = null
  res.render('login', { message: message, user: req.user })
}

function displaySignUp (req, res, next) {
  var message = req.session.message || null
  if (message) req.session.message = null
  res.render('signup', { message: message })
}

function displayNewPassword (req, res, next) {
  var token = req.query.token
  var message = req.session.message || null
  if (message) req.session.message = null
  res.render('new-password', { message: message, token: token })
}

function displayValidateEmail (req, res, next) {
  res.render('validate-email')
}

function displayPasswordReset (req, res, next) {
  var message = req.session.message || null
  if (message) req.session.message = null
  res.render('reset-password', { message: message })
}

function resetPassword (req, res, next) {
  UserModel.findByEmail(req.body.email, function (err, user) {
    if (err) return next(err)
    if (!user) {
      return next(Failure('Email address not found.', {
        type: 'StatusError',
        status: 400
      }))
    }
    user.initPasswordReset(function (err) {
      if (err) return next(err)
      res.send({ message: 'Email sent.' })
    })
  })
}

function submitNewPassword (req, res, next) {
  UserModel.findByResetToken(req.params.token, function (err, user) {
    if (err) throw err
    if (!user) res.send({ error: 'Password reset token not found' })
    user.updatePassword(req.body.password, function (err) {
      if (err) throw err
      res.send(200)
    })
  })
}

function signIn (req, res, next) {
  if (req.user) return res.redirect('/')
  req.session.message = {
    type: 'error',
    text: 'Invalid email address or password.'
  }
  return res.redirect('/login')
}

function register (req, res, next) {
  var body = req.body
  UserModel.register(UserModel({
    email: body.email,
    password: body.password
  }), function (err, user) {
    if (err) return next(err)
    res.redirect('/')
  })
}

function verify (req, res, next) {
  var token = req.query.token
  UserModel.verifyToken(token, function (err, user) {
    if (err) throw err
    req.session.message = {
      type: 'notice',
      text: 'Thank you for verifying your email.  Please sign in.'
    }
    res.redirect('/login')
  })
}

function handleNewPassword (req, res, next) {
  var token = req.query.token
  UserModel.findByResetToken(token, function (err, user) {
    if (err) return next(err)
    if (!user) res.send({ error: 'Password reset token not found' })
    user.updatePassword(req.body.password, function (err) {
      if (err) return next(err)
      req.session.message = {
        type: 'success',
        text: 'Your password has been successfully reset.'
      }
      res.redirect('/login')
    })
  })
}

module.exports = {
  logout: logout,
  register: register,
  verify: verify,
  signIn: signIn,
  resetPassword: resetPassword,
  submitNewPassword: submitNewPassword,
  displayLogin: displayLogin,
  displaySignUp: displaySignUp,
  displayNewPassword: displayNewPassword,
  displayValidateEmail: displayValidateEmail,
  displayPasswordReset: displayPasswordReset,
  handleNewPassword: handleNewPassword
}
