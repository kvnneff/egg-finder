/*global collection*/
import h from 'hyperscript'
import serialize from '@f/serialize-form'
import xhr from 'xhr'
import array from 'arrayify'
import Mapbox from '../mapbox'

var mapbox = Mapbox(collection)
mapbox.init('map')

var contactLinks = array(document.querySelectorAll('.Locations-listItem'))

contactLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    window.location = '/location/' + link.getAttribute('data-feature-id')
  })
})

function clickContact (e) {
  var linkEl = e.delegateTarget
  if (e.target.tagName === 'INPUT' ||
    e.target.tagName === 'TEXTAREA' ||
    e.target.tagName === 'BUTTON') return
  var containerEl = linkEl.querySelector('.Locations-contactContainer')
  if (containerEl.firstChild) {
    containerEl.removeChild(containerEl.firstChild)
    return
  }
  var openContactEls = array(document.body.querySelectorAll('.ContactForm'))
  openContactEls.forEach(function (el) {
    el.parentNode.removeChild(el)
  })
  var userID = e.target.getAttribute('data-user-id')
  var el = contactFormEl(userID)
  containerEl.appendChild(el)
}

function submitContact (e) {
  e.preventDefault()
  var json = serialize(e.target)
  var url = e.target.getAttribute('action')
  xhr({
    method: 'post',
    body: JSON.stringify(json),
    uri: url,
    headers: { 'Content-Type': 'application/json' }
  }, function (err, resp, body) {
    if (err) console.error('Error fetching url', err)
    if (resp.statusCode !== 200) {
      return console.err(resp)
    }
    var div = document.createElement('div')
    div.innerText = 'Your message was successfully sent.'
    e.target.parentNode.replaceChild(div, e.target)
  })
}

function contactFormEl (userID) {
  return h('div.ContactForm',
    h('form.ContactForm-form', {
      action: '/contact/' + userID,
      onsubmit: submitContact
    },
      h('div.Form-group.Form-group--vertical',
        h('label.Form-label', 'Your email address'),
        h('input.Form-input', {
          type: 'email',
          id: 'email',
          name: 'email'
        })
      ),
      h('div.Form-group.Form-group--vertical.Form-textareaGroup',
        h('label.Form-label', 'Your message'),
        h('textarea.Form-input', {
          id: 'message',
          name: 'message'
        })
      ),
      h('button.Button', { type: 'submit' }, 'Send message')
    )
  )
}
