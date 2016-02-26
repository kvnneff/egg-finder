/*global describe, it*/
import assert from 'assert'
import * as map from '../../../client/redux/map'

describe('Map Sync Actions', () => {
  describe('clientLocationRequest()', () => {
    it('creates an action to request the clients location', () => {
      const expectedAction = {
        type: map.CLIENT_LOCATION_REQUEST
      }
      assert.deepEqual(map.clientLocationRequest(), expectedAction)
    })
  })
  describe('clientLocationReceived()', () => {
    it('creates an action to request the clients location', () => {
      const expectedAction = {
        type: map.CLIENT_LOCATION_RECEIVED,
        position: 'foo'
      }
      assert.deepEqual(map.clientLocationReceived('foo'), expectedAction)
    })
  })
  describe('clientLocationError()', () => {
    it('creates an action to show the map', () => {
      const expectedAction = {
        type: map.CLIENT_LOCATION_ERROR
      }
      assert.deepEqual(map.clientLocationError(), expectedAction)
    })
  })
  describe('setGeoJson()', () => {
    it('creates an action to set `geojson` on map state', () => {
      const expectedAction = {
        type: map.SET_GEO_JSON,
        geojson: { 'foo': 'bar' }
      }
      assert.deepEqual(map.setGeoJson({ 'foo': 'bar' }), expectedAction)
    })
  })
  describe('setMapViewing()', () => {
    it('creates an action to show the map', () => {
      const expectedAction = {
        type: map.SHOW_MAP,
        value: true
      }
      assert.deepEqual(map.setMapViewing(), expectedAction)
    })
  })
  describe('setCurrentFeature()', () => {
    it('creates an action to set the current feature', () => {
      const expectedAction = {
        type: map.SET_CURRENT_FEATURE,
        id: 'foo'
      }
      assert.deepEqual(map.setCurrentFeature('foo'), expectedAction)
    })
  })
  describe('hideMap()', () => {
    it('creates an action to hide the map', () => {
      const expectedAction = {
        type: map.SHOW_MAP,
        value: false
      }
      assert.deepEqual(map.hideMap(), expectedAction)
    })
  })
})
