var sanitizeHTML = require('sanitize-html')

module.exports = function sanitize (req, res, next) {
  if (!req.body) return next()
  Object.keys(req.body).forEach(function (key) {
    var value = req.body[key]
    // Skip numbers and null values
    if (!parseInt(value, 10) && value !== null) {
      // The sanitizer won't strip encoded entities so we convert them here
      if (typeof value === 'string') {
        value = value.replace(/&gt;/gi, '>')
        value = value.replace(/&lt;/gi, '<')
        value = value.replace(/(&copy;|&quot;|&amp;)/gi, '')
      }
      req.body[key] = sanitizeHTML(value, {
        allowedTags: [],
        allowedAttributes: []
      })
    }
  })
  console.log('sanitized')
  return next()
}
