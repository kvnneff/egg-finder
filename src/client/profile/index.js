var hint = require('hint').maximumWidth = 350
var telFormat = require('tel-format')
var Mask = require('vanilla-masker')

Mask(document.querySelector('[name="price"]')).maskMoney({
  precision: 2,
  separator: '.',
  delimiter: ','
})
telFormat()
