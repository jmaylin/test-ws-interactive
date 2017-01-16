/*global applicationConfiguration*/

var React = require('react');
var ol = require('openlayers');
var mapOl = require('../../mapOl');

var CustomScrollbar = require('../../tools/customScrollbar');

var conf = applicationConfiguration.mapStyles.wheelnav;

var CircleMenu = React.createClass({
  displayName: 'CircleMenu',
  getInitialState: function() {
    return {
      wheelnavLoaded: false,
      menuOverlay: null,
      element: null,
      visible: false,
      wheel: null
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.feature) {
      if (!this.state.wheelnavLoaded && this.props.feature.On) {
        // AOI : conditions selon le type de menu
        var fromAoi = nextProps.from === 'aoi';
        var menuAoi = (nextProps.menu === 'icr' && conf.icr.displayMenu) || (nextProps.menu === 'catalog' && conf.quicklookCatalog.displayMenu) || (nextProps.menu === 'acquired' && conf.quicklookProducted.displayMenu);
        var testAoi = fromAoi && menuAoi;

        // Acquisition : conditions selon le type de menu
        var fromAcquisition = nextProps.from === 'acquisition';
        var menuAcquisition = conf.missionplans.acquisition.displayMenu;
        var testAcquisition = fromAcquisition && menuAcquisition;

        if (testAoi || testAcquisition) {
          this.initListeners();
          this.initWheelnav();
        } else if (nextProps.from === 'orbit') {
          this.initListeners();
        }
      }
    }
  },

  render: function() {
    return null;
  },

  addMenu: function(event) {
    var that = this;
    var wheel = this.state.wheel;

    if (this.props.from === 'aoi' && !this.props.openedAS) {
      this.props.openAS();
    }

    if (this.props.from === 'acqusition' && !this.props.openedOrbit) {
      this.props.openOrbit();
    }

    var options = {
      callbacks: false,
      scrollInertia: 1000
    };
    CustomScrollbar.scrollTo('#element-to-scroll-'+this.props.scroll, options, this.props.idForScroll);

    switch (this.props.menu) {
      case 'icr':
        var wheelArray = [];
        if (conf.icr.showInfos) {
          wheelArray.push('imgsrc:/img/app/static/menu-infos.png');
          var indexshowInfos = wheelArray.length - 1;
        }
        if (conf.icr.toggleAoi) {
          wheelArray.push('imgsrc:/img/app/static/menu-hide-aoi-icr.png');
          var indextoggleAoi = wheelArray.length - 1;
        }
        if (conf.icr.toggleAllDatastripsAoi && this.props.showStrips) {
          wheelArray.push('imgsrc:/img/app/static/menu-toggle-all-datastrips.png');
          var indexAllAoi = wheelArray.length - 1;
        }

        wheel.createWheel(wheelArray);

        if (conf.icr.showInfos) {
          wheel.navItems[indexshowInfos].navigateFunction = function () {
            that.removeMenu();
            that.props.showInfos();
          };
        }
        if (conf.icr.toggleAoi) {
          wheel.navItems[indextoggleAoi].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleAoi();
            that.props.removeFeature();
          };
        }
        if (conf.icr.toggleAllDatastripsAoi && this.props.showStrips) {
          wheel.navItems[indexAllAoi].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleAllStrips();
          };
        }

        wheel.navItems[0].selected = false;
        break;
      case 'catalog':
        var wheelArray = [];
        if (conf.aoiCatalog.showInfos) {
          wheelArray.push('imgsrc:/img/app/static/menu-infos.png');
          var indexshowInfos = wheelArray.length - 1;
        }
        if (conf.aoiCatalog.toggleAoi) {
          wheelArray.push('imgsrc:/img/app/static/menu-hide-aoi-catalog.png');
          var indextoggleAoi = wheelArray.length - 1;
        }
        if (conf.aoiCatalog.toggleQuicklook) {
          wheelArray.push('imgsrc:/img/app/static/menu-toggle-ql-catalog.png');
          var indextoggleQuicklook = wheelArray.length - 1;
        }

        wheel.createWheel(wheelArray);

        if (conf.aoiCatalog.showInfos) {
          wheel.navItems[indexshowInfos].navigateFunction = function () {
            that.removeMenu();
            that.props.showInfos();
          };
        }
        if (conf.aoiCatalog.toggleAoi) {
          wheel.navItems[indextoggleAoi].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleAoi();
            that.props.removeFeature();
          };
        }
        if (conf.aoiCatalog.toggleQuicklook) {
          wheel.navItems[indextoggleQuicklook].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleQuicklook();
          };
        }

        wheel.navItems[0].selected = false;
        break;
      case 'acquired':
        var wheelArray = [];
        if (conf.aoiProducted.showInfos) {
          wheelArray.push('imgsrc:/img/app/static/menu-infos.png');
          var indexshowInfos = wheelArray.length - 1;
        }
        if (conf.aoiProducted.toggleAoi) {
          wheelArray.push('imgsrc:/img/app/static/menu-hide-aoi-catalog.png');
          var indextoggleAoi = wheelArray.length - 1;
        }
        if (conf.aoiProducted.toggleQuicklook && this.props.showToggleQL) {
          wheelArray.push('imgsrc:/img/app/static/menu-toggle-ql-catalog.png');
          var indextoggleQuicklook = wheelArray.length - 1;
        }
        if (conf.aoiProducted.submitProduction && this.props.canSubmitProduction) {
          wheelArray.push('imgsrc:/img/app/static/menu-submit-production.png');
          var indexsubmitProduction = wheelArray.length - 1;
        }
        if (conf.aoiProducted.acquisitionValidation && this.props.canValidateProposition) {
          wheelArray.push('imgsrc:/img/app/static/menu-submit-validation.png');
          var indexacquisitionValidation = wheelArray.length - 1;
        }

        wheel.createWheel(wheelArray);

        if (conf.aoiProducted.showInfos) {
          wheel.navItems[indexshowInfos].navigateFunction = function () {
            that.removeMenu();
            that.props.showInfos();
          };
        }
        if (conf.aoiProducted.toggleAoi) {
          wheel.navItems[indextoggleAoi].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleAoi();
            that.props.removeFeature();
          };
        }
        if (conf.aoiProducted.toggleQuicklook && this.props.showToggleQL) {
          wheel.navItems[indextoggleQuicklook].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleQuicklookCropped();
          };
        }
        if (conf.aoiProducted.submitProduction && this.props.canSubmitProduction) {
          wheel.navItems[indexsubmitProduction].navigateFunction = function () {
            that.removeMenu();
            that.props.openSubmitProductionModal();
          };
        }
        if (conf.aoiProducted.acquisitionValidation && this.props.canValidateProposition) {
          wheel.navItems[indexacquisitionValidation].navigateFunction = function () {
            that.removeMenu();
            that.props.openAcquisitionValidationModal();
          };
        }

        wheel.navItems[0].selected = false;
        break;
      case 'acquisition':
        var wheelArray = [];
        if (conf.missionplans.acquisition.showInfos) {
          wheelArray.push('imgsrc:/img/app/static/menu-infos.png');
          var indexshowInfos = wheelArray.length - 1;
        }
        if (conf.missionplans.acquisition.toggleAoi) {
          wheelArray.push('imgsrc:/img/app/static/menu-hide-aoi-catalog.png');
          var indextoggleAoi = wheelArray.length - 1;
        }

        wheel.createWheel(wheelArray);

        if (conf.missionplans.acquisition.showInfos) {
          wheel.navItems[indexshowInfos].navigateFunction = function () {
            that.removeMenu();
            that.props.showInfos();
          };
        }
        if (conf.missionplans.acquisition.toggleAoi) {
          wheel.navItems[indextoggleAoi].navigateFunction = function () {
            that.removeMenu();
            that.props.toggleAoi();
          };
        }

        wheel.navItems[0].selected = false;
        break;
    }

    var menuOverlay = this.state.menuOverlay;
    if (menuOverlay === null) {
      menuOverlay = mapOl.createMenuOverlay(this.state.element);
    }

    mapOl.addOverlay(menuOverlay, event.coordinate);
    this.setState({
      menuOverlay: menuOverlay,
      visible: true,
      wheel: wheel
    });
  },

  removeMenu: function() {
    mapOl.removeOverlay(this.state.menuOverlay);
    this.setState({visible: false});
  },

  initWheelnav: function() {
    var that = this;

    var div = document.createElement('div');

    div.className = 'circleMenu';
    div.id = 'wheelDiv'+this.props.feature.On;
    div.style.position = 'absolute';
    div.style.cursor = 'pointer';
    div.style.width = '120px';
    div.style.height = '120px';
    div.style.left = '-60px';
    div.style.top = '-60px';

    div.addEventListener('mouseleave', function() {
      that.removeMenu();
    });
    div.addEventListener('mouseup', function() {
      that.removeMenu();
    });

    var ele = document.getElementById('control');
    ele.appendChild(div);

    var wheel = new wheelnav("wheelDiv"+this.props.feature.On);

    wheel.animatetime = 0;
    wheel.wheelRadius = 60;
    wheel.titleWidth = 24;
    wheel.titleHeight = 24;
    wheel.clickModeRotate = false;
    wheel.spreaderEnable = true;

    wheel.slicePathFunction = slicePath().DonutSlice;
    wheel.slicePathCustom = slicePath().DonutSliceCustomization();
    wheel.slicePathCustom.minRadiusPercent = 0.25;
    wheel.sliceInitPathFunction = slicePath().DonutSlice;
    wheel.sliceInitPathCustom = slicePath().DonutSliceCustomization();
    wheel.sliceInitPathCustom.minRadiusPercent = 0.25;
    wheel.sliceHoverPathFunction = slicePath().DonutSlice;
    wheel.sliceHoverPathCustom = slicePath().DonutSliceCustomization();
    wheel.sliceHoverPathCustom.minRadiusPercent = 0.25;
    wheel.sliceSelectedPathFunction = slicePath().DonutSlice;
    wheel.sliceSelectedPathCustom = slicePath().DonutSliceCustomization();
    wheel.sliceSelectedPathCustom.minRadiusPercent = 0.25;

    wheel.spreaderInTitle = icon.cross;
    wheel.spreaderOutTitle = icon.cross;
    wheel.titleAttr = { fill: "#FFF" };
    wheel.titleSelectedAttr = { fill: "#FFF" };
    wheel.titleHoverAttr = { fill: "#FFF" };
    wheel.sliceHoverAttr = { fill: "#22b1ec" };
    wheel.spreaderPathInAttr = { fill: 'none', 'stroke-width': 0 };
    wheel.spreaderPathOutAttr = { fill: 'none', 'stroke-width': 0 };
    wheel.spreaderTitleInAttr = { fill: '#000' };
    wheel.spreaderTitleOutAttr = { fill: '#000' };
    wheel.colors = ['#282a2b', '#515151', '#333333', '#565758'];

    this.setState({
      wheelnavLoaded: true,
      wheel: wheel,
      element: div
    });
  },

  initListeners: function() {
    var that = this;
    var mapTmp = mapOl.getMapObject();

    mapTmp.on('click', function(evt) {
      var layer = mapTmp.forEachLayerAtPixel(evt.pixel,
          function(layer) {
            return layer;
          });
      if (layer && !(layer.getSource() instanceof ol.source.WMTS)) {
        if (layer && layer.get("type") == undefined) {
          if (layer == that.props.feature) {
            if (!that.state.visible) {
              that.addMenu(evt);
            }
          }
        }
      }
      if (layer && !(layer.getSource() instanceof ol.source.ImageStatic)) {
        var feature = mapTmp.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
              return feature;
            });
        if (feature && feature.get("type") == undefined) {
          if (feature == that.props.feature) {
            if (!that.state.visible) {
              that.addMenu(evt);
            }
          }
        }
      }
    });
  }

});

module.exports = CircleMenu;
