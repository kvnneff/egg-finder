require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Map;
/*global L*/
var Emitter = require('component-emitter');

function Map(collection) {
  var geoJSON = collection;
  var emitter = new Emitter();
  var locations;
  var map;

  function init(elementId) {
    L.mapbox.accessToken = "pk.eyJ1Ijoia3ZubmVmZiIsImEiOiJjaWlnODdxMGkwMjhqdTNrczBhY2ZqbG9iIn0.txFenT55A1VP9k7px4XDqA";
    map = L.mapbox.map(elementId, "kvnneff.og4efkm2");
    locations = L.mapbox.featureLayer();
    locations.on('click', function (event) {
      emitter.emit('click', event.layer.feature.id);
    });
    updateGeoJSON(geoJSON);
  }

  function resetColors() {
    geoJSON.features.forEach(function (item) {
      var properties = item.properties;

      properties['marker-color'] = properties['old-color'] || properties['marker-color'];
    });
    locations.setGeoJSON(geoJSON);
  }

  function selectFeature(featureID) {
    var item = geoJSON.features.find(function (f) {
      return f.properties.id === parseInt(featureID, 10);
    });
    if (!item) return;
    var properties = item.properties;
    var geometry = item.geometry;

    resetColors();
    properties['old-color'] = properties['marker-color'];
    locations.setGeoJSON(geoJSON).addTo(map);
    locations.eachLayer(function (layer) {
      if (parseInt(layer.feature.id, 10) === parseInt(featureID, 10)) layer.bindPopup(layer.feature.tooltipContent).openPopup();
    });
    map.panTo([geometry.coordinates[1], geometry.coordinates[0]]);
  }

  function setView(latitude, longitude, zoom) {
    map.setView([latitude, longitude], zoom);
  }

  function updateGeoJSON(geoJSON) {
    console.log(geoJSON);
    if (geoJSON.type && geoJSON.type === 'Feature') {
      addTooltip(geoJSON);
    } else {
      geoJSON.features.forEach(addTooltip);
    }
    locations.setGeoJSON(geoJSON).addTo(map);
    // if (!geoJSON.features.length) return
    locations.eachLayer(function (layer) {
      layer.bindPopup(layer.feature.tooltipContent);
    });
    map.fitBounds(locations.getBounds());
    map.setZoom(14);
  }

  function resizeMap() {
    if (map) map.invalidateSize();
  }

  function addTooltip(feature) {
    var properties = feature.properties;
    feature.tooltipContent = '\n      ' + properties.name + '\n      <ul>\n        <li>' + properties.address + '</li>\n        <li>' + properties.city + '</li>\n      </ul>\n      <p>' + properties.description + ' </p>';
    return feature;
  }

  return {
    map: map,
    locations: locations,
    init: init,
    setView: setView,
    resizeMap: resizeMap,
    resetColors: resetColors,
    selectFeature: selectFeature,
    updateGeoJSON: updateGeoJSON
  };
}

},{"component-emitter":14}],14:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],10:[function(require,module,exports){
'use strict'

/**
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api private
 */

module.exports = function toArray(collection, options) {
  if (typeof collection === 'string') return (options && options.query ? toArray(document.querySelectorAll(collection)) : [collection])
  if (typeof collection === 'undefined') return []
  if (collection === null) return [null]
  if (typeof window != 'undefined' && collection === window) return [window]
  if (Array.isArray(collection)) return collection.slice()
  if (typeof collection.length != 'number') return [collection]
  if (typeof collection === 'function') return [collection]
  if (collection.length === 0) return []
  var arr = []
  for (var i = 0; i < collection.length; i++) {
    if (collection.hasOwnProperty(i) || i in collection) {
      arr.push(collection[i])
    }
  }
  if (arr.length === 0) return [collection]
  return arr
}
},{}]},{},[]);
