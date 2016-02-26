var mailer = require('nodemailer')
var mailConnectionString = process.env.MAIL_CONNECTION_STRING
var transporter = mailer.createTransport(mailConnectionString)

transporter.verify(function (err) {
  if (err) throw err
})

module.exports = transporter
