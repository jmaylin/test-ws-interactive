/*global applicationConfiguration*/

var React = require('react');
var map = require('../../mapOl');
var Aoi = require('../GeoData/Aoi');

var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var i18n = require('../../tools/i18n');

var MissionsPlansTooltipModal = require('../modals/MissionsPlansTooltipModal');

var PlannedAcquisition = React.createClass({
  displayName: 'PlannedAcquisition',
  getInitialState: function() {
    return {
      aoiDisplayed: this.props.aoiAllDisplayed,
      polygon: map.aoiRevertToFeature(this.props.coordinates),
      infowindow: null,
      showMissionsPlansTooltipModal: false,
      aoiAllDisplayed: this.props.aoiAllDisplayed,
      order: this.props.order,
      highlightAoi: false,
      headerActive: false
    };
  },
  componentWillMount: function() {
    switch(this.props.subtype) {
      /*case 'acquisitionOrbits':
        delete this.props.informations.Downloading;
        break;
      case 'downloadingOrbits':
        delete this.props.informations.Acquisition;
        break;*/
      case 'acquisition':
        delete this.props.informations.Downloading;
        delete this.props.informations.Acquisition;
        break;
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.aoiAllDisplayed !== this.props.aoiAllDisplayed && nextProps.aoiAllDisplayed !== this.state.aoiDisplayed) {
      this.toggleAcquisition(nextProps.aoiAllDisplayed);
    }
    if (nextProps.order !== this.props.order) {
      //this.removePolygon();
      this.setState({
        aoiDisplayed: false,
        polygon: map.aoiToFeature(nextProps.coordinates),
        aoiAllDisplayed: this.props.aoiAllDisplayed
      });
    }
  },
  showHighlightAoi: function() {
    this.setState({highlightAoi: true});
  },
  hideHighlightAoi: function() {
    this.setState({highlightAoi: false});
  },
  toggleHighlightFromAoi: function() {
    this.setState({
      highlightAoi: !this.state.highlightAoi,
      headerActive: !this.state.headerActive
    });
  },
  removePolygon: function() {
    var tmpReturn = map.isOnMap(this.props.polygon, 'vectorSource');
    if(this.state.aoiDisplayed && tmpReturn) {
      map.RemoveFeature(this.state.polygon, 'vectorSource');
    }
  },
  componentWillUnmount: function() {
    this.removePolygon();
  },
  centerAcquisition: function(event) {
    event.preventDefault();
    event.stopPropagation();
    if(!this.state.aoiDisplayed) {
      this.setState({'aoiDisplayed': true});
      map.AddFeature(this.state.polygon, 'vectorSource', false, false);
    }
    map.setCenterWithFeature(this.state.polygon);
  },
  toggleAcquisitionHandler: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var tmpReturn = map.isOnMap(this.state.polygon, 'vectorSource');
    if(!this.state.aoiDisplayed && !tmpReturn) {
      map.AddFeature(this.state.polygon, 'vectorSource', false, false);
    } else {
      this.removePolygon();
    }
    this.setState({aoiDisplayed: !this.state.aoiDisplayed});
  },
  toggleAcquisition: function(display) {
    if(!this.state.aoiDisplayed) {
      map.AddFeature(this.state.polygon, 'vectorSource', false, false);
    } else {
      this.removePolygon();
    }
    this.setState({aoiDisplayed: display});
  },
  openMissionsPlansTooltipModalFromAoi: function() {
    this.setState({showMissionsPlansTooltipModal: true});
  },
  openMissionsPlansTooltipModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showMissionsPlansTooltipModal: true});
  },
  closeMissionsPlansTooltipModal: function() {
    this.setState({showMissionsPlansTooltipModal: false});
  },
  render: function() {
    var centerAcquisitionClass = 'center-aoi';
    var toggleAcquisitionClass = this.state.aoiDisplayed ? 'toggle-aoi active' : 'toggle-aoi';
    var infosAcquisitionClass = this.state.showMissionsPlansTooltipModal ? 'infos-aoi active' : 'infos-aoi';
    var icrHeaderStyle = this.state.headerActive ? applicationConfiguration.listStyles.highlight.bgColor : 'transparent';
    return (
      <div id={'element-to-scroll-' + this.props.id} className={'missions-plans-acquisition'} style={{'backgroundColor': icrHeaderStyle}}>
        <span className={'title'} onClick={this.props.toggleGeoData}>{'ICR #' + this.props.feature.properties.ICR}</span>
        <div className={'controls'}>
          <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('missions-plan-acquisition-center')}</Tooltip>}>
            <button type="button" onClick={this.centerAcquisition} className={centerAcquisitionClass}>{i18n.get('missions-plan-acquisition-center')}</button>
          </OverlayTrigger>
          <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('missions-plan-acquisition-toggle')}</Tooltip>} onMouseOver={this.showHighlightAoi} onMouseOut={this.hideHighlightAoi}>
            <button type="button" onClick={this.toggleAcquisitionHandler} className={toggleAcquisitionClass}>{i18n.get('missions-plan-acquisition-toggle')}</button>
          </OverlayTrigger>
          <button type="button" onClick={this.openMissionsPlansTooltipModal} className={infosAcquisitionClass}>{i18n.get('missions-plan-acquisition-infos')}</button>
          <MissionsPlansTooltipModal
            show={this.state.showMissionsPlansTooltipModal}
            onHide={this.closeMissionsPlansTooltipModal}
            informations={this.props.informations}
          />
          <Aoi
            key={'a'+this.props.id}
            refs={'r'+this.props.id}
            toggleAoi={this.toggleAcquisition}
            showInfos={this.openMissionsPlansTooltipModalFromAoi}
            menu={'acquisition'}
            from={'acquisition'}
            type={this.props.type}
            visible={this.state.aoiDisplayed}
            feature={this.state.polygon}
            highlight={this.state.highlightAoi}
            toggleHighlight={this.toggleHighlightFromAoi}
            scroll={this.props.id}
            openedOrbit={this.props.openedOrbit}
            openOrbit={this.props.openOrbit}
            idForScroll="additionnal-controls"
          />
        </div>
      </div>
    );
  }

});

module.exports = PlannedAcquisition;
