require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({32:[function(require,module,exports){
'use strict';

var array = require('arrayify');

var contactLinks = array(document.querySelectorAll('.Locations-listItem'));

contactLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    var id = link.getAttribute('data-feature-id');
    window.location = '/location/' + id;
  });
});

},{"arrayify":10}]},{},[32]);
