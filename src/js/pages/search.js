/*global geoJSON*/
const Map = require('../components/map')
const searchForm = require('../components/search-form')
const classes = require('component-classes')

const mapElement = document.body.querySelector('#map')
const mobileSearchButton = document.body.querySelector('#mobile-search-button')
const mobileSearchForm = document.body.querySelector('#mobile-search-form') 
const mobileSearchCloseButton = document.body.querySelector('#mobile-search-close-button')

searchForm()

Map({ geoJSON, tooltips: true, element: mapElement })

mobileSearchButton.addEventListener('click', (e) => {
  e.preventDefault()
  classes(mobileSearchForm).remove('dn')
})

mobileSearchCloseButton.addEventListener('click', (e) => {
  e.preventDefault()
  classes(mobileSearchForm).add('dn')
})




