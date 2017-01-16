/* global applicationConfiguration */
'use strict';

/*
 * Require
 */
var ol = require('openlayers');
var markerInfosPopover = require('components/popovers/markerInfosPopover');
var hexToRgba = require('tools/hexToRgba');


/*
 * CONFIG
 */
var configLayers = {
  url: applicationConfiguration.configLayers.url,
  layer: applicationConfiguration.configLayers.layer,
  matrixSet: applicationConfiguration.configLayers.matrixSet,
  format: applicationConfiguration.configLayers.format,
  projection: projection,
  wrapX: applicationConfiguration.configLayers.wrapX
}
var configView = {
  center: ol.proj.transform(applicationConfiguration.configView.center, 'EPSG:4326', 'EPSG:3857'),
  zoom: applicationConfiguration.configView.zoom
}
var configStyle = {
  basic: {
    Fill: {
      color: hexToRgba(applicationConfiguration.mapStyles.drawing.fillColor, applicationConfiguration.mapStyles.drawing.fillOpacity)
    },
    Stroke: {
      color: applicationConfiguration.mapStyles.drawing.strokeColor,
      width: applicationConfiguration.mapStyles.drawing.strokeWeight
    },
    Circle: {
      radius: applicationConfiguration.mapStyles.drawing.circleRadius,
      color: applicationConfiguration.mapStyles.drawing.circleColor
    }
  },
  drawingMode: {
    Fill: {
      color: hexToRgba(applicationConfiguration.mapStyles.drawing.fillColor, applicationConfiguration.mapStyles.drawing.fillOpacity)
    },
    Stroke: {
      color: applicationConfiguration.mapStyles.drawing.strokeColor,
      width: applicationConfiguration.mapStyles.drawing.strokeWeight
    },
    Circle: {
      radius: applicationConfiguration.mapStyles.drawing.circleRadius,
      color: applicationConfiguration.mapStyles.drawing.circleColor
    }
  },
  drawingLayer: {
    Fill: {
      color: hexToRgba(applicationConfiguration.mapStyles.drawing.fillColor, applicationConfiguration.mapStyles.drawing.fillOpacity)
    },
    Stroke: {
      color: applicationConfiguration.mapStyles.drawing.strokeColor,
      width: applicationConfiguration.mapStyles.drawing.strokeWeight
    },
    Circle: {
      radius: applicationConfiguration.mapStyles.drawing.circleRadius,
      color: applicationConfiguration.mapStyles.drawing.circleColor
    }
  },
  modifyMode: {
    Fill: {
      color: hexToRgba(applicationConfiguration.mapStyles.modify.fillColor, applicationConfiguration.mapStyles.modify.fillOpacity)
    },
    Stroke: {
      color: applicationConfiguration.mapStyles.modify.strokeColor,
      width: applicationConfiguration.mapStyles.modify.strokeWeight
    },
    Circle: {
      radius: applicationConfiguration.mapStyles.modify.circleRadius,
      color: applicationConfiguration.mapStyles.modify.circleColor
    }
  },
  highlight: {
    Fill: {
      color: hexToRgba(applicationConfiguration.mapStyles.highlight.fillColor, applicationConfiguration.mapStyles.highlight.fillOpacity)
    },
    Stroke: {
      color: applicationConfiguration.mapStyles.highlight.strokeColor,
      width: applicationConfiguration.mapStyles.highlight.strokeWeight
    },
    Circle: {
      radius: applicationConfiguration.mapStyles.highlight.circleRadius,
      color: applicationConfiguration.mapStyles.highlight.circleColor
    }
  },
  circle: {
    pleiades : {
      Fill: {
        color: hexToRgba(applicationConfiguration.mapStyles['visibility-circle-pleiades'].fillColor, applicationConfiguration.mapStyles['visibility-circle-pleiades'].fillOpacity)
      },
      Stroke: {
        color: applicationConfiguration.mapStyles['visibility-circle-pleiades'].strokeColor,
        width: applicationConfiguration.mapStyles['visibility-circle-pleiades'].strokeWeight
      },
      Circle: {
        radius: applicationConfiguration.mapStyles['visibility-circle-pleiades'].circleRadius,
        color: applicationConfiguration.mapStyles['visibility-circle-pleiades'].circleColor
      }
    },
    astroterra : {
      Fill: {
        color: hexToRgba(applicationConfiguration.mapStyles['visibility-circle-astroterra'].fillColor, applicationConfiguration.mapStyles['visibility-circle-astroterra'].fillOpacity)
      },
      Stroke: {
        color: applicationConfiguration.mapStyles['visibility-circle-astroterra'].strokeColor,
        width: applicationConfiguration.mapStyles['visibility-circle-astroterra'].strokeWeight
      },
      Circle: {
        radius: applicationConfiguration.mapStyles['visibility-circle-astroterra'].circleRadius,
        color: applicationConfiguration.mapStyles['visibility-circle-astroterra'].circleColor
      }
    }
  }
}



/*
 * OPENLAYERS
 *
 * Describe :
 */
// Export object
var MapTools = function() {};
// Init map variable
var map;
var projection = ol.proj.get(configLayers.matrixSet);
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(19);
var matrixIds = new Array(19);
for (var z = 0; z < 19; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}

var vectorSource = new ol.source.Vector({
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});


var vectorOrbit = new ol.source.Vector({
});

var orbitLayer = new ol.layer.Vector({
  source: vectorOrbit
});


var stationCircle = new ol.source.Vector({
});

var stationCircleLayer = new ol.layer.Vector({
  source: stationCircle
});


var vectorCustomLayer = new ol.source.Vector({
});

var customLayer = new ol.layer.Vector({
  source: vectorCustomLayer
});

var drawCollection = new ol.Collection();
var vectorDrawing = new ol.source.Vector({features: drawCollection})

var stylesFeature = {
  basic: new ol.style.Style({
    fill: new ol.style.Fill({
      color: configStyle.basic.Fill.color
    }),
    stroke: new ol.style.Stroke({
      color: configStyle.basic.Stroke.color,
      width: configStyle.basic.Stroke.width
    })
  }),
  drawingMode: new ol.style.Style({
    fill: new ol.style.Fill({
      color: configStyle.drawingMode.Fill.color
    }),
    stroke: new ol.style.Stroke({
      color: configStyle.drawingMode.Stroke.color,
      width: configStyle.drawingMode.Stroke.width
    })
  }),
  drawingLayer: new ol.style.Style({
    fill: new ol.style.Fill({
      color: configStyle.drawingLayer.Fill.color
    }),
    stroke: new ol.style.Stroke({
      color: configStyle.drawingLayer.Stroke.color,
      width: configStyle.drawingLayer.Stroke.width
    })
  }),
  modifyMode: new ol.style.Style({
    fill: new ol.style.Fill({
      color: configStyle.modifyMode.Fill.color
    }),
    stroke: new ol.style.Stroke({
      color: configStyle.modifyMode.Stroke.color,
      width: configStyle.modifyMode.Stroke.width
    })
  }),
  highlight: new ol.style.Style({
    fill: new ol.style.Fill({
      color: configStyle.highlight.Fill.color
    }),
    stroke: new ol.style.Stroke({
      color: configStyle.highlight.Stroke.color,
      width: configStyle.highlight.Stroke.width
    })
  })
}


var drawOverlay = new ol.layer.Vector({
  source: vectorDrawing,
  style: stylesFeature.drawingLayer
});

var view = new ol.View({
  center: configView.center,
  zoom: configView.zoom
});

/*
 * fn : initialize
 * describe :
 */
MapTools.prototype.initialize = function(_selector) {
  map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        opacity: 1,
        source: new ol.source.WMTS({
          url: configLayers.url,
          layer: configLayers.layer,
          matrixSet: configLayers.matrixSet,
          format: configLayers.format,
          projection: projection,
          tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          style: stylesFeature.basic,
          wrapX: configLayers.wrapX,
          crossOrigin: 'anonymous'
        })
      }),
      drawOverlay,
      stationCircleLayer,
      vectorLayer,
      customLayer,
      orbitLayer
    ],
    target: _selector,
    controls: [],
    view: view
  });


  this.addEventClick();
  this.addEventMouseMove();
};


var mapDiv = document.getElementById('map');

/*
 * DRAW PART
 */
// VARIABLE
var draw = false;
var modify = false;

/*
 * fn : setFeatureStyle
 * describe :
 */
MapTools.prototype.setFeatureStyle = function(_feature, _mode) {

  var rgba = null;
  if (_feature.isCustomOpacity !== undefined) {
    rgba = hexToRgba(applicationConfiguration.mapStyles[_mode].fillColor, _feature.isCustomOpacity);
  } else {
    if (applicationConfiguration.mapStyles[_mode].fillColor !== undefined) {
      rgba = hexToRgba(applicationConfiguration.mapStyles[_mode].fillColor, applicationConfiguration.mapStyles[_mode].fillOpacity);
    }
  }


  var featureStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: rgba
    }),
    stroke: new ol.style.Stroke({
      color: applicationConfiguration.mapStyles[_mode].strokeColor,
      width: applicationConfiguration.mapStyles[_mode].strokeWeight
    })
  });
  _feature.setStyle(featureStyle);

  return _feature;
};

/*
 * fn : setOpacityToFeature
 * describe :
 */
MapTools.prototype.setOpacityToFeature = function(_feature, _layerName, _opacity) {
  var style = _feature.getStyle();
  var fill = style.getFill();
  var color = fill.b.substring(fill.b.indexOf('(') + 1, fill.b.lastIndexOf(')')).split(/,\s*/)
  color[3] = _opacity/100;
  fill.b = 'rgba('+color.toString()+')';
  var featureStyle = new ol.style.Style({
    fill: fill,
    stroke: style.getStroke()
  });

  _feature.isCustomOpacity = color[3];

  _feature.setStyle(featureStyle);
};

/*
 * fn : getOpacityOfFeature
 * describe :
 */
MapTools.prototype.getOpacityOfFeature = function(_feature, _mode) {
  if (_feature.isCustomOpacity !== undefined) {
    return _feature.isCustomOpacity;
  } else {
    return applicationConfiguration.mapStyles[_mode].fillOpacity;
  }
};

/*
 * fn : AddDrawInteraction
 * describe :
 */
MapTools.prototype.AddDrawInteraction = function(_type, _maxPoints, _geometryFunction) {
  this.RemoveDrawInteraction();

  var drawingControl = document.getElementById('map');

  drawingControl.style.cursor = 'crosshair';


  var that = this;
  draw = false;
  return new Promise(function(resolve, reject) {
    draw = new ol.interaction.Draw({
      features: drawCollection,
      type: /** @type {ol.geom.GeometryType} */ (_type),
      geometryFunction: _geometryFunction,
      style: stylesFeature.drawingMode,
      maxPoints: _maxPoints
    });

    draw.on('drawend', function (_e3) {
      drawOverlay.setStyle(stylesFeature.drawingLayer);
      that.drawEnd(_e3, resolve, reject);
    });

    map.addInteraction(draw);
  });
};

/*
 * fn : drawEnd
 * describe :
 */
MapTools.prototype.drawEnd = function(_e3, resolve, reject) {
  var feature = _e3.feature;
  map.removeInteraction(draw);
  draw = false;

  var drawingControl = document.getElementById('map');

  drawingControl.style.cursor = '';
  resolve(feature);
};

/*
 * fn : RemoveDrawInteraction
 * describe :
 */
MapTools.prototype.RemoveDrawInteraction = function() {
  vectorDrawing.clear()
  map.removeInteraction(draw);
  draw = false;
  return true;
};

/*
 * fn : DrawinRectangle
 * describe :
 */
MapTools.prototype.DrawingRectangle = function() {
    return this.AddDrawInteraction('LineString', 2, function (coordinates, geometry) {
      if (!geometry) {
        geometry = new ol.geom.Polygon(null);
      }
      var start = coordinates[0];
      var end = coordinates[1];
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start]
      ]);
      return geometry;
    });
};

/*
 * fn : DrawingPolygon
 * describe :
 */
MapTools.prototype.DrawingPolygon = function() {
  return this.AddDrawInteraction('Polygon', null, null);
};

/*
 * fn : togglingModifingPolygon
 * describe :
 */
MapTools.prototype.togglingModifingPolygon = function(_feature) {
  if (!modify) {
    this.setModifingPolygon(_feature);
  } else {
    this.removeModifingPolygon();
  }
};

/*
 * fn : setModifingPolygon
 * describe :
 */
MapTools.prototype.setModifingPolygon = function(_feature, callback) {
  if (!modify) {
    modify = new ol.interaction.Modify({
      features: drawCollection,
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      }
    });
    drawOverlay.setStyle(stylesFeature.modifyMode);
    map.addInteraction(modify);
  }
};

/*
 * fn : removeModifingPolygon
 * describe :
 */
MapTools.prototype.removeModifingPolygon = function() {
  if (modify) {
    drawOverlay.setStyle(stylesFeature.drawingLayer);
    map.removeInteraction(modify);
    modify = false;
  }
};

/*
 * fn : setCenter
 * describe :
 */
MapTools.prototype.setCenterWithFeature = function(_feature) {
  var polygon = /** @type {ol.geom.SimpleGeometry} */ (_feature.getGeometry());
  var size = /** @type {ol.Size} */ (map.getSize());
  view.fit(
      polygon,
      size,
      {
        padding: [250, 150, 150, 600],
        nearest: true
      }
  );
};


/*
 * fn : setCenter
 * describe :
 */
MapTools.prototype.setCenter = function(_coordinatesArr) {
  var center = ol.proj.transform(_coordinatesArr, 'EPSG:4326', 'EPSG:4326');
  map.getView().setCenter(center);
};


/*
 * fn : zoomIn
 * describe :
 */
MapTools.prototype.zoomIn = function() {
  var view = map.getView();
  var zoom = view.getZoom();
  view.setZoom(zoom + 1);
};


/*
 * fn : zoomOut
 * describe :
 */
MapTools.prototype.zoomOut = function() {
  var view = map.getView();
  var zoom = view.getZoom();
  view.setZoom(zoom - 1);
};


/*
 * fn : zoomOut
 * describe :
 */
MapTools.prototype.zoomInitial = function() {
  var view = map.getView();
  view.setZoom(configView.zoom);
  view.setCenter(ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857'));
};

/*
 *
 */
MapTools.prototype.getLatLng = function(_lat, _lng) {
  return new ol.geom.Point(ol.proj.transform([_lat, _lng], 'EPSG:4326', 'EPSG:3857'));
};

/*
 * MARKER
 */
// Object of marker active
var objectMarkers = {}
// Object of PopOver marker active
var objectMarkersPopOver = {}
// Object of PopOver infos active
var objectInfosPopOver = {}

/*
 * fn : Marker
 * describe : Create and return the marker with the color defined in config file,
 *            if the color is not in config file, take the default color.
 */
MapTools.prototype.Marker = function(_point, _type, _name) {

  // Creation of feature with arguments
  var name = this.MarkerName(_name);
  var type = this.MarkerName(_type);

  var feartureToReturn = new ol.Feature({
    type: 'marker',
    name: name,
    geometry: _point
  });

  var style = this.styleMarker(type);

  // Set style to the feature
  feartureToReturn.setStyle(style);

  return feartureToReturn;
};

MapTools.prototype.styleMarker = function(_name) {
  // Search color in config file
  // WARNING _name is transform in lower case
  var colorSvg = applicationConfiguration.mapStyles.marker[_name];
  if (colorSvg == undefined) {
    colorSvg = applicationConfiguration.mapStyles.marker.default.color;
  } else {
    colorSvg = colorSvg.color;
  }

  // Create Image to set svg path
  var customSvg = new Image();
  customSvg.src = 'data:image/svg+xml,' + escape('<svg version="1.1" id="Marker_Layer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><path fill="'+colorSvg+'" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/><circle fill="#FFFFFF" cx="15" cy="10.677" r="3.291"/></svg>');

  // Ol Style
  var style = new ol.style.Style({
    image: new ol.style.Icon({
      img: customSvg,
      imgSize:[30,30],
      anchor: [0.5, 1]
    })
  });

  return style;
};

/*
 * fn : MarkerName
 * description : transform and return name for the marker
 */
MapTools.prototype.MarkerName = function(_name) {
  return _name.toLowerCase().replace(' ', '_');
}

// Add Marker
MapTools.prototype.addMarker = function(markerFeature, center, _popOverInfo) {
  var name = this.MarkerName(markerFeature.get("name"))

  if (_popOverInfo != null) {

    var element = markerInfosPopover.getPopOver(name, _popOverInfo);

    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: true
    });

    objectMarkersPopOver[name] = popup;
  }

  objectMarkers[name] = markerFeature;

  this.AddFeature(markerFeature, 'vectorSource', center, false);
};

// Remove Marker
MapTools.prototype.removeMarker = function(markerFeature) {
  var name = this.MarkerName(markerFeature.get("name"));
  delete objectMarkers[name];
  this.RemoveFeature(markerFeature, 'vectorSource');
};

function findElementInArrayOfPopup(_type, _name) {
  var element = false;
  var objectTpm = false;

  switch(_type) {
    case 'marker':
      objectTpm = objectMarkersPopOver
      break;
    case 'stationCircle':
      objectTpm = objectInfosPopOver
      break;
  }
  if (objectTpm) {
    for (marker in objectTpm) {
      if (marker == _name) {
        element = objectTpm[marker];
      }
    }
  }

  return element;
}

MapTools.prototype.popUpVisible = function(evt, _feature, _layer, _type) {
  var coordinate = evt.coordinate;
  mapDiv.style.cursor = 'pointer';
  if (this.isOnMap(_feature, _layer)) {
    var name = this.MarkerName(_feature.get("name"));

    var element = findElementInArrayOfPopup(_type, name);

    if (element) {
      if (element.visible !== true) {
        if (element.visible == undefined) {
          element.setPosition(coordinate);
        }
        map.addOverlay(element);
        element.visible = true;
      }
    }
  }
}

MapTools.prototype.popUpHidden = function(_feature, _layer, _type) {
  if (this.isOnMap(_feature, _layer)) {
    mapDiv.style.cursor = '';
    var name = this.MarkerName(_feature.get("name"));

    var element = findElementInArrayOfPopup(_type, name);

    if (element) {
      if (element.visible === true) {
        map.removeOverlay(element);
        element.visible = false;
      }
    }
  }
}

MapTools.prototype.InfoWindow = function(_id, _infos) {
  if (_infos != null) {

    var name = this.MarkerName(_id);
    var element = markerInfosPopover.getPopOver(name, _infos);

    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: true
    });

    objectInfosPopOver[name] = popup;
  }
};

MapTools.prototype.getLayer = function(_layerName) {
  switch(_layerName) {
    case 'vectorOrbit':
      return vectorOrbit;
    case 'vectorSource':
      return vectorSource;
    case 'drawOverlay':
      return vectorDrawing;
    case 'customLayer':
      return customLayer;
    case 'stationCircleLayer':
      return stationCircle;
    case 'stationCircle':
      return stationCircle;
  }
};



/*
 * fn : isOnMap
 * describe :
 */
MapTools.prototype.isOnMap = function(_feature, _layerName) {
  var vectoreTmp = this.getLayer(_layerName)
  var featuresTmp = vectoreTmp.getFeatures();
  for (var i = 0; i < featuresTmp.length; i++) {
    if (featuresTmp[i] === _feature){
      return true;
    }
  }
};

/*
 * fn : layerIsOnMap
 * describe :
 */
MapTools.prototype.layerIsOnMap = function(_layer) {
  var bool = false;
  map.getLayers().forEach(function (_lyr) {
    if (_lyr === _layer)  {
      bool = true;
    }
  });
  return bool;
};

/*
 * fn : Feature
 * describe :
 */
MapTools.prototype.Feature = function(_obj) {
  return new ol.Feature(_obj);
};

/*
 * fn : AddFeature
 * describe :
 */
MapTools.prototype.AddFeature = function(_feature, _layer, _center, _highlight) {
  if (_feature) {
    if (_highlight) {
      _feature.setStyle(stylesFeature.highlight);
    }
    var vectorTmp = this.getLayer(_layer);
    vectorTmp.addFeature(_feature);
    if (_center) {
      this.setCenterWithFeature(_feature)
    }
  }
};

/*
 * fn : RemoveFeature
 * describe :
 */
MapTools.prototype.RemoveFeature = function(_feature, _layer) {
  if (_feature) {
    var vectorTmp = this.getLayer(_layer);
    vectorTmp.removeFeature(_feature);
  }
};

/*
 * fn : featureOnChange
 * describe :
 */
MapTools.prototype.featureOnChange = function(_feature, callback) {
  _feature.on('change', function(evt) {
    callback(evt)
  });
};

/*
 * fn : highlighttFeature
 * describe :
 */
MapTools.prototype.highlightFeature = function(_feature, _layer) {
  if (_feature) {
    _feature.setStyle(stylesFeature.highlight);
  }
};

/*
 * fn : unHighlightFeature
 * describe :
 */
MapTools.prototype.unHighlightFeature = function(_feature, _mode, _layer) {
  if (_feature) {
    _feature = this.setFeatureStyle(_feature, _mode);
  }
};

/*
 * fn : getGeometry
 * describe :
 */
MapTools.prototype.getGeometry = function(_feature) {
  return _feature.getGeometry();
};

/*
 * fn : getAois
 * describe :
 */
MapTools.prototype.getAois = function(geometries, _aois) {

  if (geometries !== undefined) {

    for (var i = 0; geometries.length > i; i++) {

      switch (geometries[i].type) {

        case 'Polygon':
          _aois.push(geometries[i].coordinates);
          break;

        case 'MultiPolygon':
          var coordinates = [];
          for (var j = 0; j < geometries[i].coordinates.length; j++) {
            if (geometries[i].coordinates[j].length === 1) {
              coordinates.push(geometries[i].coordinates[j]);
            } else if (geometries[i].coordinates[j].length > 1) {
              for (var k = 0; k < geometries[i].coordinates[j].length; k++) {
                var coord = geometries[i].coordinates[j][k];
                coordinates.push([coord]);
              }
            }
          }
          _aois = _aois.concat(coordinates);
          break;

        case 'GeometryCollection':
          this.getAois(geometries[i], _aois);
          break;
      }
    }
  }

  return _aois;

};

/*
 * fn : addAoiFromKml
 * describe :
 */
MapTools.prototype.addAoiFromKml = function(_feature, _layer, _center) {

  this.RemoveDrawInteraction();
  this.removeModifingPolygon();

  var aois = this.getAois(_feature.geometry.geometries, []);
  var geomMultiPolygon = new ol.geom.MultiPolygon(aois);
  geomMultiPolygon.transform('EPSG:4326', 'EPSG:3857');
  var aoisCoordinates = geomMultiPolygon.getCoordinates();

  var tabFeature = [];
  for (var i = 0; i < aoisCoordinates.length; i++) {
    var featureTmp = new ol.Feature({
      geometry: new ol.geom.Polygon(aoisCoordinates[i])
    });
    this.AddFeature(featureTmp, _layer, _center, false)
  }

  return tabFeature;
};

/*
 * fn : aoiToFeature
 * describe :
 */
MapTools.prototype.aoiToFeature = function(_aoi) {
  var polyCoords = [];
  for (var i in _aoi) {
    var c = _aoi[i];
    polyCoords.push(ol.proj.transform([parseFloat(c[1]), parseFloat(c[0])], 'EPSG:4326', 'EPSG:3857'));
  }

  var featureTmp = new ol.Feature({
    geometry: new ol.geom.Polygon([polyCoords])
  })
  featureTmp.setId()

  return featureTmp;
};

/*
 * fn : aoiToFeatureFromString
 * describe :
 */
MapTools.prototype.aoiToFeatureFromString = function(_aoi) {
  _aoi = $.trim(_aoi);
  var aoiTmp = _aoi.split(' ');
  var aoi = [];
  for (var i = 1; i < aoiTmp.length; i+=2) {
    aoi.push([parseFloat(aoiTmp[i-1]), parseFloat(aoiTmp[i])]);
  }
  var feature = this.aoiToFeature(aoi);

  return feature;
};

/*
 * fn : aoiRevertToFeature
 * describe :
 */
MapTools.prototype.aoiRevertToFeature = function(_aoi) {
  var polyCoords = [];
  for (var i in _aoi) {
    var c = _aoi[i];
    polyCoords.push(ol.proj.transform([parseFloat(c[0]), parseFloat(c[1])], 'EPSG:4326', 'EPSG:3857'));
  }

  var featureTmp = new ol.Feature({
    geometry: new ol.geom.Polygon([polyCoords])
  })
  featureTmp.setId()

  return featureTmp;
};

/*
 * fn : createFeatureFromGmlString
 * describe :
 */
MapTools.prototype.createFeatureFromGmlString = function(_string, _name, _id) {
  var tabTmp = _string.split(' ');

  var polyCoords = [];
  for (var i = 0; i < tabTmp.length; i++) {
    var tmp = tabTmp[i].split(',');
    polyCoords.push(ol.proj.transform([parseFloat(tmp[1]), parseFloat(tmp[0])], 'EPSG:4326', 'EPSG:3857'));
  }

  var featureToReturn = new ol.Feature({
    type: 'stationCircle',
    name: _id,
    geometry: new ol.geom.Polygon([polyCoords])
  });

  var featureStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: configStyle.circle[_name].Fill.color
    }),
    stroke: new ol.style.Stroke({
      color: configStyle.circle[_name].Stroke.color,
      width: configStyle.circle[_name].Stroke.width
    })
  })


  featureToReturn.setStyle(featureStyle);

  return featureToReturn;
};

/*
 * fn : transformCoordinates
 * describe :
 */
MapTools.prototype.transformCoordinates = function(_coordinates) {
  var prev0 = null;
  var index = 0;

  var polyCoords = [[], []];
  for (var i = 0; i < _coordinates.length; i++) {
    if (prev0 == null) {prev0 = _coordinates[i][0]}
    if(parseFloat(_coordinates[i][0]) > prev0) {
      index = 1;
    }
    prev0 = parseFloat(_coordinates[i][0]);
    polyCoords[index].push(ol.proj.transform([parseFloat(_coordinates[i][0]), parseFloat(_coordinates[i][1])], 'EPSG:4326', 'EPSG:3857'));
  }

  return polyCoords;
};

/*
 * fn : createLineStringFromCoordinates
 * describe :
 */
MapTools.prototype.createLineStringFromCoordinates = function(_coordinates) {
  return new ol.Feature({
    geometry: new ol.geom.MultiLineString(this.transformCoordinates(_coordinates)),
    name: 'Line'
  })
};

/*
 * fn : addAoi
 * describe :
 */
MapTools.prototype.addAoi = function(_aoi, _mode, _center, _highlight) {
  var featureTmp = this.aoiToFeature(_aoi);

  // Set feature style
  featureTmp = this.setFeatureStyle(featureTmp, _mode);

  this.AddFeature(featureTmp, 'vectorSource', _center, _highlight)

  return featureTmp;
};

/*
 * fn : removeAoi
 * describe :
 */
MapTools.prototype.removeAoi = function(_feature) {
  this.RemoveFeature(_feature, 'vectorSource')
};

MapTools.prototype.geomPoint = function(_lat, _lng) {
  return new ol.geom.Point(ol.proj.transform([parseFloat(_lng), parseFloat(_lat)], 'EPSG:4326', 'EPSG:3857'));
};

var wgs84Sphere = new ol.Sphere(6378137);
MapTools.prototype.formatArea = function(_feature) {
  var polygon = _feature.getGeometry();
  var sourceProj = map.getView().getProjection();
  var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326'));
  var coordinates = geom.getLinearRing(0).getCoordinates();
  var area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100);
  } else {
    output = (Math.round(area * 100) / 100);
  }
  return output;
};

MapTools.prototype.getCoordinates = function(_feature) {
  var polygon = _feature.getGeometry();
  var sourceProj = map.getView().getProjection();
  var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326'));
  var coordinates = geom.getLinearRing(0).getCoordinates();

  return coordinates;
};

MapTools.prototype.getBounds = function(_feature) {
  var polygon = _feature.getGeometry();
  var extent = polygon.getExtent();

  var bottomLeft = ol.extent.getBottomLeft(extent);
  var bottomRight = ol.extent.getBottomRight(extent);
  var topLeft = ol.extent.getTopLeft(extent);
  var topRight = ol.extent.getTopRight(extent);

  return [topLeft, topRight, bottomLeft, bottomRight];
};

MapTools.prototype.formatWidth = function(_feature) {
  var extent = this.getBounds(_feature);
  var length = wgs84Sphere.haversineDistance(
    ol.proj.transform(extent[0], 'EPSG:3857', 'EPSG:4326'),
    ol.proj.transform(extent[1], 'EPSG:3857', 'EPSG:4326'));
  //length = Math.round(line.getLength() * 100) / 100;

  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100);
  } else {
    output = (Math.round(length * 100) / 100);
  }
  return output;
};

MapTools.prototype.formatHeight = function(_feature) {
  var extent = this.getBounds(_feature);
  var length = wgs84Sphere.haversineDistance(
    ol.proj.transform(extent[0], 'EPSG:3857', 'EPSG:4326'),
    ol.proj.transform(extent[2], 'EPSG:3857', 'EPSG:4326'));
  //length = Math.round(line.getLength() * 100) / 100;

  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100);
  } else {
    output = (Math.round(length * 100) / 100);
  }
  return output;
};


MapTools.prototype.getMapObject = function() {
  return map;
};


MapTools.prototype.Polygon = function() {
  return true;
};

MapTools.prototype.clickFilter = function(_type, feature) {
  switch(_type) {
    case 'marker':
        break;
    default:
  }
};

MapTools.prototype.hoverFilter = function(evt, _type, feature, hover) {
  switch(_type) {
    case 'marker':
        if (hover) {
          this.popUpVisible(evt, feature, 'vectorSource', _type);
        } else {
          this.popUpHidden(feature, 'vectorSource', _type);
          // Reset oldFeature to avoid looping
          oldFeature = false;
        }
        break;
      case 'stationCircle':
        if (hover) {
          this.popUpVisible(evt, feature, 'stationCircle', _type);
        } else {
          this.popUpHidden(feature, 'stationCircle', _type);
          // Reset oldFeature to avoid looping
          oldFeature = false;
        }
        break;
    default:
  }
};

MapTools.prototype.addEventClick = function() {
  // display popup on click
  var that = this;
  map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });
    if (feature) {
      that.clickFilter(feature.get("type") ,feature)
    } else {

    }
  });
};

// Use to hidde feature
var oldFeature = false;
MapTools.prototype.addEventMouseMove = function() {
  var that = this;
  map.on('pointermove', function(evt) {
    if (evt.dragging) return;

    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });
    if (oldFeature) {
      that.hoverFilter(evt, oldFeature.get("type") ,oldFeature, false);
      oldFeature = false;
    }
    if (feature) {
      that.hoverFilter(evt, feature.get("type") ,feature, true);
      oldFeature = feature;
    }
  });
}

MapTools.prototype.getCurrentPos = function(callback) {
  //this.MouseMove();
  map.on("pointermove", function (_evt) {
      var coordinateTmp = ol.proj.transform(_evt.coordinate, 'EPSG:3857', 'EPSG:4326')
      var normalizeWorlds = Math.floor((coordinateTmp[0] + 180) / 360)
      var lng = coordinateTmp[0] - (normalizeWorlds * 360);
      var lat = coordinateTmp[1];
      callback([lng.toFixed(2), lat.toFixed(2)])
  });
};

MapTools.prototype.KmlLayerToFeature = function(_url) {
  var vectorTmp = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: _url,
      format: new ol.format.KML()
    })
  });

  return vectorTmp;
};

MapTools.prototype.addLayer = function(_layer) {
  map.addLayer(_layer);
};

MapTools.prototype.removeLayer = function(_layer) {
  map.removeLayer(_layer);
};

MapTools.prototype.createImageLayer = function(_url, _feature) {
  var geometry = _feature.getGeometry();
  var vectorTmp = new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: _url,
      imageExtent: geometry.getExtent()
    })
  });

  return vectorTmp;
};

MapTools.prototype.createMenuOverlay = function(_element) {
  var menu = new ol.Overlay({
    element: _element
  });

  return menu;
};

MapTools.prototype.addOverlay = function(_overlay, _pos) {
  map.addOverlay(_overlay);
  _overlay.setPosition(_pos);
};

MapTools.prototype.removeOverlay = function(_overlay) {
  map.removeOverlay(_overlay);
};

// Eports Times
module.exports = new MapTools();
