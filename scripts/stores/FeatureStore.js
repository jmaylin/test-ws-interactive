var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var ol = require('openlayers');
var mapOl = require('../mapOl');

var CHANGE_EVENT = 'change';
var CHANGE_QLEVENT = 'changeQL';

var FeatureStore = assign({}, EventEmitter.prototype, {
  initListener: function() {
    var map = mapOl.getMapObject();
    var mapDiv = document.getElementById('map');

    var oldFeature = false;
    var oldLayer = false;

    map.on('pointermove', function(evt) {
      if (evt.dragging) return;

      var layer = map.forEachLayerAtPixel(evt.pixel,
          function(layer) {
            return layer;
          });
      if (layer && !(layer.getSource() instanceof ol.source.WMTS)) {
        if (oldFeature) {
          FeatureStore.emitChange(oldFeature, false);
          mapDiv.style.cursor = '';
          oldFeature = false;
        }
        if (oldLayer && layer !== oldLayer) {
          FeatureStore.emitQLChange(oldLayer, false);
        }
        FeatureStore.emitQLChange(layer, true);
        oldLayer = layer;
        mapDiv.style.cursor = 'pointer';
      } else if (oldLayer) {
        FeatureStore.emitQLChange(oldLayer, false);
        mapDiv.style.cursor = '';
        oldLayer = false;
      }

      if (layer && !(layer.getSource() instanceof ol.source.ImageStatic)) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
              return feature;
            });
        if (feature) {
          if (oldFeature && feature !== oldFeature) {
            FeatureStore.emitChange(oldFeature, false);
          }
          FeatureStore.emitChange(feature, true);
          oldFeature = feature;
          mapDiv.style.cursor = 'pointer';
        } else if (oldFeature) {
          FeatureStore.emitChange(oldFeature, false);
          mapDiv.style.cursor = '';
          oldFeature = false;
        }
      }
    });

    var list = document.getElementById('control');
    list.addEventListener('mouseover', function(evt) {
      FeatureStore.emitQLChange(oldLayer, false);
      FeatureStore.emitChange(oldFeature, false);
    });
  },

  emitChange: function(_feature, _hover) {
    this.emit(CHANGE_EVENT, _feature, _hover);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function() {
    this.removeListener(CHANGE_EVENT);
  },

  emitQLChange: function(_feature, _hover) {
    this.emit(CHANGE_QLEVENT, _feature, _hover);
  },

  addQLChangeListener: function(callback) {
    this.on(CHANGE_QLEVENT, callback);
  },

  removeQLChangeListener: function() {
    this.removeListener(CHANGE_QLEVENT);
  }
});

FeatureStore.setMaxListeners(0);

module.exports = FeatureStore;
