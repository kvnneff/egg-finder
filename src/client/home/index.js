var array = require('arrayify')

var contactLinks = array(document.querySelectorAll('.Locations-listItem'))

contactLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    var id = link.getAttribute('data-feature-id')
    window.location = '/location/' + id
  })
})
