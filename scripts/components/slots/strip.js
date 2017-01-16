/*global applicationConfiguration*/

var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Overlay = require('react-bootstrap/lib/Overlay');
var Tooltip = require('react-bootstrap/lib/Tooltip');
//var StripPopover = require('../popovers/stripPopover');
var AcquisitionStore = require('../../stores/AcquisitionStore');
var DatastripStore = require('../../stores/DatastripStore');
var i18n = require('../../tools/i18n');
var mapOl = require('../../mapOl');
var Aoi = require('../GeoData/Aoi');
var Quicklook = require('../GeoData/Quicklook');
var StripTooltipModal = require('../modals/StripTooltipModal');
var timer = null;

var Strip = React.createClass({
  displayName: 'Strip',
  getInitialState: function() {
    var mapObjects = {
      quicklooksCropped: [],
      quicklooks: [],
      catalogAoi: [],
      taskingDetailsAoi: null
    };
    return {
      imageInfos: DatastripStore.getDatastripInformations(this.props.id),
      mapObjects: this.prepareMapObjects(DatastripStore.getDatastripInformations(this.props.id), mapObjects),
      taskingDetailscatalogAoiDisplayed: this.props.displayStrip,
      civProcSts: this.props.civProcSts,
      status: this.props.status,
      orderId: this.props.orderId,
      quicklookCropped: false,
      quicklookCroppedLoading: false,
      quicklookCroppedLoaded: false,
      quicklookCroppedDisplayed: false,
      infosBtnActif: false,
      showStripTooltipModal: false,
      highlightAoi: false,
      highlightAoiCatalog: false,
      headerActive: false,
      datastripProductedAoiBool: false,
      datastripProductedAoiValue: null,
      datastripCatalogAoiBool: false,
      datastripCatalogAoiValue: null
    };
  },
  componentDidMount: function() {
    DatastripStore.addUpdateListener(this.datastripLoaded);
    this.forceUpdate();
    DatastripStore.emitUpdate(this.props.id);
  },
  componentWillUnmount: function() {
    DatastripStore.removeUpdateListener(this.datastripLoaded);
    if(this.state.quicklookDisplayed) {
      mapOl.removeLayer(this.state.mapObjects.quicklooks);
    }
    if(this.state.quicklookCroppedDisplayed) {
      mapOl.removeLayer(this.state.mapObjects.quicklooksCropped);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var newState = {};
    if (nextProps.updateFromAcquisition) {
      newState.taskingDetailscatalogAoiDisplayed = nextProps.toggleAllASDatastrips;
      AcquisitionStore.toggleDatastripDisplay(this.props.acquisitionId, this.props.id, nextProps.toggleAllASDatastrips);
      this.props.endUpdateFromAcquisition();
    }
    if (nextProps.highlightAllAoi) {
      this.showHighlightAoi();
    } else {
      this.hideHighlightAoi();
    }
    if (nextProps.cropQL && nextProps.datastripLoaded && !this.state.quicklookCropped && this.state.imageInfos.properties) {
      var imageUrl = this.state.imageInfos.properties['http://adm.i3.com/ont/proxy/image#overlayMercator'];
      var imageWithCurrentProtocol = imageUrl.replace('http:', location.protocol);
      DatastripStore.cropQL(this.props.id, this.props.acquisitionId, imageWithCurrentProtocol, this.state.mapObjects, this.setQuicklooksCropped);
      newState.quicklookCroppedLoading = true;
      newState.quicklookCropped = true;
    }
    this.setState(newState);
  },
  datastripLoaded: function(event) {
    if (this.isMounted() && event.datastripId === this.props.id) {
      this.setState({
        imageInfos: DatastripStore.getDatastripInformations(this.props.id),
        mapObjects: this.updateMapObjects(DatastripStore.getDatastripInformations(this.props.id), this.state.mapObjects)
      }, this.props.forceCrop);
    }
  },
  prepareMapObjects: function(datastrip, mapObjects) {
    var croppedAoi = [];
    for (var i = 0; i < this.props.aoi.length; i++) {
      croppedAoi.push([this.props.aoi[i][0], this.props.aoi[i][1]]);
    }
    mapObjects.croppedAoi = croppedAoi;
    mapObjects.taskingDetailsAoi = mapOl.aoiToFeature(croppedAoi);
    return mapObjects;
  },
  updateMapObjects: function(datastrip, mapObjects) {
    if(datastrip.loaded && !datastrip.error) {
      mapObjects.catalogAoi = mapOl.aoiRevertToFeature(datastrip.geometry.coordinates[0]);
      var imageUrl = datastrip.properties['http://adm.i3.com/ont/proxy/image#overlayMercator'];
      var imageWithCurrentProtocol = imageUrl.replace('http:', location.protocol);
      mapObjects.quicklooks = mapOl.createImageLayer(imageWithCurrentProtocol, mapObjects.catalogAoi);
    }
    return mapObjects;
  },
  setQuicklooksCropped: function(data) {
    var imageWithCurrentProtocol = data.croppedImageUrl.replace('http:', location.protocol);
    var mapObjects = this.state.mapObjects;
    mapObjects.quicklooksCropped = mapOl.createImageLayer(imageWithCurrentProtocol, mapObjects.taskingDetailsAoi);
    this.setState({
      mapObjects: mapObjects,
      quicklookCroppedLoading: false,
      quicklookCroppedLoaded: data.success
    });
  },
  toggleQuicklook: function() {
    this.setState({
      quicklookDisplayed: !this.state.quicklookDisplayed,
      datastripProductedAoiBool: false,
      datastripCatalogAoiBool: false
    });
  },
  toggleQuicklookCropped: function() {
    this.setState({
      quicklookCroppedDisplayed: !this.state.quicklookCroppedDisplayed,
      datastripProductedAoiBool: false,
      datastripCatalogAoiBool: false
    });
  },
  toggleCatalogAoi: function() {
    // "AOI Catalogue"
    this.setState({
      catalogAoiDisplayed: !this.state.catalogAoiDisplayed,
      datastripProductedAoiBool: false,
      datastripCatalogAoiBool: false
    });
  },
  toggleTaskingDetailsAoi: function() {
    // "AOI Produite"
    var display = AcquisitionStore.toggleDatastripDisplay(this.props.acquisitionId, this.props.id);
    this.setState({
      taskingDetailscatalogAoiDisplayed: display,
      datastripProductedAoiBool: false
    });
  },
  showInfos: function() {
    this.setState({infosBtnActif: true});
  },
  hideInfos: function() {
    this.setState({infosBtnActif: false});
  },
  stripTooltipModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showStripTooltipModal: true});
  },
  openStripTooltipModal: function() {
    this.setState({showStripTooltipModal: true});
  },
  closeStripTooltipModal: function() {
    this.setState({showStripTooltipModal: false});
  },
  centerAoi: function(event) {
    event.preventDefault();
    event.stopPropagation();
    AcquisitionStore.toggleDatastripDisplay(this.props.acquisitionId, this.props.id, true);
    this.setState({
      taskingDetailscatalogAoiDisplayed: true,
      datastripProductedAoiBool: false,
      datastripCatalogAoiBool: false
    });
    mapOl.setCenterWithFeature(this.state.mapObjects.taskingDetailsAoi);
  },
  showHighlightAoi: function() {
    this.setState({highlightAoi: true});
  },
  hideHighlightAoi: function() {
    this.setState({highlightAoi: false});
  },
  showHighlightAoiCatalog: function() {
    this.setState({highlightAoiCatalog: true});
  },
  hideHighlightAoiCatalog: function() {
    this.setState({highlightAoiCatalog: false});
  },
  toggleHighlightFromAoi: function() {
    this.setState({
      highlightAoi: !this.state.highlightAoi,
      headerActive: !this.state.headerActive
    });
  },
  toggleHighlightFromAoiCatalog: function() {
    this.setState({
      highlightAoiCatalog: !this.state.highlightAoiCatalog,
      headerActive: !this.state.headerActive
    });
  },
  toggleMenuTransparentDatastripProductedAoi: function () {
    var display = AcquisitionStore.toggleDatastripDisplay(this.props.acquisitionId, this.props.id, true);
    this.setState({
      taskingDetailscatalogAoiDisplayed: display,
      datastripProductedAoiBool: !this.state.datastripProductedAoiBool,
      datastripProductedAoiValue: this.refs.productedAoi.getOpacity()*100,
      datastripCatalogAoiBool: false
    });

    var that = this;
    clearTimeout(timer);
    timer = setTimeout(function(){
      that.setState({
        datastripProductedAoiBool: false
      });
    }, 10000)
  },
  valueTransparenceChangeProductedAoi: function (_event) {
    this.refs.productedAoi.setOpacity(_event.target.value);
    this.setState({
      datastripProductedAoiValue: _event.target.value,
    })
    clearTimeout(timer);
    var that = this;
    timer = setTimeout(function(){
      that.setState({
        datastripProductedAoiBool: false
      });
    }, 10000)
  },
  getDatastripProductedAoiBtn: function () {
    return React.findDOMNode(this.refs.datastripProductedAoi);
  },
  toggleMenuTransparentCatalogAoi: function () {
    this.setState({
      catalogAoiDisplayed: true,
      datastripCatalogAoiBool: !this.state.datastripCatalogAoiBool,
      datastripCatalogAoiValue: this.refs.catalogAoi.getOpacity()*100,
      datastripProductedAoiBool: false
    });

    var that = this;
    clearTimeout(timer);
    setTimeout(function () {
      that.setState({
        datastripCatalogAoiBool: false
      });
    }, 20000)
  },
  valueTransparenceCatalogAoi: function (_event) {
    this.refs.catalogAoi.setOpacity(_event.target.value);
    this.setState({
      datastripCatalogAoiValue: _event.target.value,
    })
    var that = this;
    clearTimeout(timer);
    setTimeout(function () {
      that.setState({
        datastripCatalogAoiBool: false
      });
    }, 20000)
  },
  getDatastripCatalogAoiBtn: function () {
    return React.findDOMNode(this.refs.datastripCatalogAoi);
  },
  /*  Aoi should get civProcSts in type to get the right color from .ini file */
  render: function() {
    var buttonShown = this.state.imageInfos.loaded && !this.state.imageInfos.error;
    var imageInfos = this.state.imageInfos.loaded ? this.state.imageInfos : {properties: ''};
    var catalogAoiButtonClass = buttonShown ? this.state.catalogAoiDisplayed ? 'aoi-segment active' : 'aoi-segment ' : 'hidden-block';
    var taskingDetailsAoiButtonClass = this.state.taskingDetailscatalogAoiDisplayed ? 'aoi-producted active' : 'aoi-producted';
    var quicklookButtonClass = buttonShown ? this.state.quicklookDisplayed ? 'quicklook active' : 'quicklook' : 'hidden-block';

    var quicklookCroppedButtonClass = this.state.quicklookCroppedLoaded ? this.state.quicklookCroppedDisplayed ? 'quicklook-cropped active' : 'quicklook-cropped' : 'hidden-block';
    var loader = '';
    if (this.state.quicklookCroppedLoading) {
      loader = (
        <div className="loader-wrapper">
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('loading-crop-quicklook')}</Tooltip>}>
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          </OverlayTrigger>
        </div>
      );
    }

    var status = this.props.status.toLowerCase().replace(' ', '-');
    var statusForAoi = this.props.civProcSts.toLowerCase().replace(' ', '-');
    var bubbleInfo = this.props.status ?
      <OverlayTrigger placement='right' overlay={<Tooltip>{this.props.status}</Tooltip>}>
        <span className={'status strip-status-' + status}></span>
      </OverlayTrigger>
    :
      ''
    ;
    var moreInfoClass = this.state.infosBtnActif ? ' active' : '';
    var icrHeaderStyle = this.state.headerActive ? applicationConfiguration.listStyles.highlight.bgColor : 'transparent';

    return (
      <li id={'element-to-scroll-' + this.props.id} className={'segment'} style={{'backgroundColor': icrHeaderStyle}}>
        {bubbleInfo}
        <OverlayTrigger placement='right' overlay={<Tooltip>{this.props.id}</Tooltip>}>
          <span className="segment-name">{this.props.id}</span>
        </OverlayTrigger>
        <div className="segment-controls">
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('datastrip-center-map')}</Tooltip>}>
            <button type="button" onClick={this.centerAoi} className='center-map'></button>
          </OverlayTrigger>
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('datastrip-producted-aoi')}</Tooltip>} onMouseOver={this.showHighlightAoi} onMouseOut={this.hideHighlightAoi}>
            <button type="button" ref='datastripProductedAoi' onClick={this.toggleTaskingDetailsAoi} onDoubleClick={this.toggleMenuTransparentDatastripProductedAoi} className={taskingDetailsAoiButtonClass}>{i18n.get('datastrip-producted-aoi')}</button>
          </OverlayTrigger>

          <Overlay container={this} show={this.state.datastripProductedAoiBool} target={this.getDatastripProductedAoiBtn} placement='top'>
            <Tooltip className={'transparence'} >
              <button type="button" className={'close'} onClick={this.toggleMenuTransparentDatastripProductedAoi} ><span>×</span></button>
              <div className={'transparence-title'}>{i18n.get('opacity')}</div>
              <span className={'transparence-span'}>0</span>
              <input type="range" value={this.state.datastripProductedAoiValue} min={0} max={100} step={1} onChange={this.valueTransparenceChangeProductedAoi} />
              <span className={'transparence-span'}> 100%</span>
            </Tooltip>
          </Overlay>

          {loader}
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('producted-quicklook')}</Tooltip>}>
            <button type="button" onClick={this.toggleQuicklookCropped} className={quicklookCroppedButtonClass}>{i18n.get('producted-quicklook')}</button>
          </OverlayTrigger>
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('datastrip-aoi')}</Tooltip>} onMouseOver={this.showHighlightAoiCatalog} onMouseOut={this.hideHighlightAoiCatalog}>
            <button type="button" ref='datastripCatalogAoi' onClick={this.toggleCatalogAoi} onDoubleClick={this.toggleMenuTransparentCatalogAoi} className={catalogAoiButtonClass}>{i18n.get('datastrip-aoi')} - affiche le "wktFootprint" du catalogue</button>
          </OverlayTrigger>

          <Overlay container={this} show={this.state.datastripCatalogAoiBool} target={this.getDatastripCatalogAoiBtn} placement='top'>
            <Tooltip className={'transparence'} >
              <button type="button" className={'close'} onClick={this.toggleMenuTransparentCatalogAoi} ><span>×</span></button>
              <div className={'transparence-title'}>{i18n.get('opacity')}</div>
              <span className={'transparence-span'}>0</span>
              <input type="range" value={this.state.datastripCatalogAoiValue} min={0} max={100} step={1} onChange={this.valueTransparenceCatalogAoi} />
              <span className={'transparence-span'}> 100%</span>
            </Tooltip>
          </Overlay>

          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('quicklook')}</Tooltip>}>
            <button type="button" onClick={this.toggleQuicklook} className={quicklookButtonClass}>{i18n.get('quicklook')}</button>
          </OverlayTrigger>

          <button className={'more-info' + moreInfoClass} onClick={this.stripTooltipModal}>More info</button>
          <StripTooltipModal
            {...this.props}
            imageInfos={imageInfos}
            show={this.state.showStripTooltipModal}
            onHide={this.closeStripTooltipModal}>
            {i18n.get('search-will-be-deleted-warning')}
          </StripTooltipModal>
          <Aoi
            key={'a'+this.props.id}
            ref='productedAoi'
            refs={'r'+this.props.id}
            showToggleQL={buttonShown}
            toggleQuicklookCropped={this.toggleQuicklookCropped}
            toggleAoi={this.toggleTaskingDetailsAoi}
            showInfos={this.openStripTooltipModal}
            menu={'acquired'}
            from={'aoi'}
            type={'datastrip-producted-'+statusForAoi}
            visible={this.state.taskingDetailscatalogAoiDisplayed}
            feature={this.state.mapObjects.taskingDetailsAoi}
            canSubmitProduction={this.props.canSubmitProduction}
            openSubmitProductionModal={this.props.openSubmitProductionModal}
            canValidateProposition={this.props.canValidateProposition}
            openAcquisitionValidationModal={this.props.openAcquisitionValidationModal}
            highlight={this.state.highlightAoi}
            toggleHighlight={this.toggleHighlightFromAoi}
            scroll={this.props.id}
            openedAS={this.props.opened}
            openAS={this.props.handleHeaderClick}
            idForScroll="left"
            loaded={buttonShown}
          />
          <Quicklook
            key={'qq'+this.props.id}
            showToggleQL={buttonShown}
            toggleQuicklookCropped={this.toggleQuicklookCropped}
            toggleAoi={this.toggleTaskingDetailsAoi}
            showInfos={this.openStripTooltipModal}
            menu={'acquired'}
            from={'aoi'}
            type={'datastrip-producted-'+statusForAoi}
            visible={this.state.quicklookCroppedDisplayed}
            feature={this.state.mapObjects.quicklooksCropped}
            canSubmitProduction={this.props.canSubmitProduction}
            openSubmitProductionModal={this.props.openSubmitProductionModal}
            canValidateProposition={this.props.canValidateProposition}
            openAcquisitionValidationModal={this.props.openAcquisitionValidationModal}
            highlight={this.state.highlightAoi}
            toggleHighlight={this.toggleHighlightFromAoi}
            scroll={this.props.id}
            openedAS={this.props.opened}
            openAS={this.props.handleHeaderClick}
            idForScroll="left"
            loaded={buttonShown}
          />
          <Aoi
            key={'aa'+this.props.id}
            ref='catalogAoi'
            toggleQuicklook={this.toggleQuicklook}
            toggleAoi={this.toggleCatalogAoi}
            showInfos={this.openStripTooltipModal}
            menu={'catalog'}
            from={'aoi'}
            type={'datastrip-'+statusForAoi}
            visible={this.state.catalogAoiDisplayed}
            feature={this.state.mapObjects.catalogAoi}
            highlight={this.state.highlightAoiCatalog}
            toggleHighlight={this.toggleHighlightFromAoiCatalog}
            scroll={this.props.id}
            openedAS={this.props.opened}
            openAS={this.props.handleHeaderClick}
            idForScroll='left'
            loaded={buttonShown}
          />
          <Quicklook
            key={'q'+this.props.id}
            toggleQuicklook={this.toggleQuicklook}
            toggleAoi={this.toggleCatalogAoi}
            showInfos={this.openStripTooltipModal}
            menu={'catalog'}
            from={'aoi'}
            type={'datastrip-'+statusForAoi}
            visible={this.state.quicklookDisplayed}
            feature={this.state.mapObjects.quicklooks}
            highlight={this.state.highlightAoiCatalog}
            toggleHighlight={this.toggleHighlightFromAoiCatalog}
            scroll={this.props.id}
            openedAS={this.props.opened}
            openAS={this.props.handleHeaderClick}
            idForScroll="left"
            loaded={buttonShown}
          />
        </div>
      </li>
    );
  }
});

module.exports = Strip;
