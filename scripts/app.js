/* global applicationConfiguration*/
/*eslint-disable no-unused-vars*/
var React = require('react');

var map = require('./mapOl');

var MainControl = require('./components/controls/mainControl');
var AccessoriesControl = require('./components/controls/accessories');
var FullscreenControl = require('./components/controls/fullscreen');
var DrawingControl = require('./components/controls/drawing');
var ZoomControl = require('./components/controls/zoom');
var MissionsPlansControl = require('./components/controls/MissionsPlansControl');
var CustomLayersControl = require('./components/controls/CustomLayersControl');

var GeneralError = require('./components/errors/generalError');
var GeneralError = require('./components/errors/generalError');
var AccountStore = require('./stores/AccountStore');
var FeatureStore = require('./stores/FeatureStore');

function setup() {
  map.initialize('map');

  React.render(
    <div className="gmap-custom-controls">
      <div id="main-control" className="main-control custom-control-container fake-top">
        <div id='main-toggle'>
          <MainControl />
          <div id="search-container"></div>
          <div id="icr-search-results"></div>
          <div id="slotmanager-container"></div>
        </div>
      </div>
      <div id="drawing-control" className="drawing-control custom-control-container">
        <div className="drawing-control-wrapper">
          <DrawingControl map={map}/>
        </div>
      </div>

      <div id="accessories-control" className="custom-control-container fake-top">
        <div className="accessories-control-wrapper">
          <AccessoriesControl map={map} />
        </div>
      </div>
      <div id="fullscreen-control" className="custom-control-container fullscreen-control">
        <FullscreenControl map={map} />
      </div>
      <div id="zoom-control" className="custom-control-container zoom-control">
        <ZoomControl map={map} />
      </div>
      <div id="additionnal-controls" className="scrollable" data-scrollclass="mCS-dir-rtl" data-scrolloffset="185">
        <div id="missions-plans">
          <MissionsPlansControl />
        </div>
        <div id="custom-layers">
          <CustomLayersControl />
        </div>
      </div>
    </div>,
    document.getElementById('control')
  );

  var drawingControl = document.getElementById('drawing-control');
  var drawingControlWrapper = document.querySelector('.drawing-control-wrapper');
  drawingControl.style.width = (drawingControlWrapper.offsetWidth + 2)+"px";

  var accessoriesControl = document.getElementById('accessories-control');
  var accessoriesControlWrapper = document.querySelector('.accessories-control-wrapper');
  accessoriesControl.style.width = (accessoriesControlWrapper.offsetWidth + 10)+"px";
}

function generalError() {
  React.render(
      <GeneralError />,
      document.getElementById('map')
  );
}

if(AccountStore.accountIsValid()) {
  setup();
}
else {
  generalError();
}

FeatureStore.initListener();
