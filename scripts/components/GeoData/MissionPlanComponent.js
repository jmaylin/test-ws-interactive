/*global applicationConfiguration*/

var React = require('react');
var Checkbox = require('../forms/checkbox');
var Orbit = require('./Orbit');
var PlannedAcquisition = require('./PlannedAcquisition');
var PlannedAcquisitionList = require('./PlannedAcquisitionList');

var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var i18n = require('../../tools/i18n');

var UiStateStore = require('../../stores/UiStateStore');
var CustomScrollbar = require('../../tools/customScrollbar');

var MissionPlanComponent = React.createClass({
  displayName: 'MissionPlanComponent',
  getInitialState: function() {
    var orbitStyle = {};
    if (this.props.type === 'orbit' || !this.props.feature.acquisitions) {
      orbitStyle = {
        cursor: 'default'
      };
    }
    return {
      geodataDisplayed: false,
      opened: false,
      //aoiAllDisplayedButton: this.props.type !== 'orbit',
      aoiAllDisplayedButton: this.props.feature.acquisitions,
      aoiAllDisplayed: false,
      orbitStyle: orbitStyle,
      highlightOrbit: false,
      headerActive: false
    };
  },
  componentWillMount: function() {
    UiStateStore.addHideListener(this.onHideAll);
  },
  componentWillUnmount: function() {
    UiStateStore.removeHideListener(this.onHideAll);
  },
  componentDidUpdate: function() {
    CustomScrollbar.refreshScrollbar();
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.order !== this.props.order) {
      this.setState({
        opened: false,
        aoiAllDisplayed: false,
        geodataDisplayed: false
      });
    }
  },
  showHighlightOrbit: function() {
    this.setState({highlightOrbit: true});
  },
  hideHighlightOrbit: function() {
    this.setState({highlightOrbit: false});
  },
  toggleHighlightFromOrbit: function() {
    this.setState({
      highlightOrbit: !this.state.highlightOrbit,
      headerActive: !this.state.headerActive
    });
  },
  onHideAll: function() {
    this.setState({
      'aoiAllDisplayed': false,
      'geodataDisplayed': false
    });
  },
  toggleAllAcquisitions: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({'aoiAllDisplayed': !this.state.aoiAllDisplayed});
  },
  prevent: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },
  render: function() {
    var geoData = this.getGeoData();
    if(this.props.type === 'acquisition') {
      return geoData;
    }

    var name = this.getFeatureName();
    var toggleAllAcquisitionsClass = this.state.aoiAllDisplayedButton ? this.state.aoiAllDisplayed ? 'toggle-all-aoi active' : 'toggle-all-aoi' : 'hidden';
    var componentClass = this.state.opened ? 'missions-plans-component opened' : 'missions-plans-component';
    var checkbox = null;
    var orbitHeaderStyle = this.state.headerActive ? applicationConfiguration.listStyles.highlight.bgColor : 'transparent';
    var orbitNameClass = this.state.headerActive ? ' highlighted' : '';
    switch (this.props.type) {
      case 'orbit':
        //checkbox = <Checkbox checked={this.state.geodataDisplayed} onChange={this.toggleGeoData} />;
        checkbox = this.props.feature.orbit.geometry ? <Checkbox checked={this.state.geodataDisplayed} onChange={this.toggleGeoData} showHighlightOrbit={this.showHighlightOrbit} hideHighlightOrbit={this.hideHighlightOrbit} /> : null;
        break;
      case 'acquisitionOrbits':
      case 'downloadingOrbits':
        checkbox = this.props.feature.orbit.geometry ? <Checkbox checked={this.state.geodataDisplayed} onChange={this.toggleGeoData} showHighlightOrbit={this.showHighlightOrbit} hideHighlightOrbit={this.hideHighlightOrbit} /> : null;
        break;
      default:
        checkbox = <Checkbox checked={this.state.geodataDisplayed} onChange={this.toggleGeoData} showHighlightOrbit={this.showHighlightOrbit} hideHighlightOrbit={this.hideHighlightOrbit} />;
        break;
    }
    return (
      <div className={componentClass} onClick={this.toggleOrbit} style={this.state.orbitStyle}>
        <div id={'element-to-scroll-' + this.props.id} className="missions-plans-component--orbit" style={{'backgroundColor': orbitHeaderStyle}}>
          <span className={'missions-plans-component--name' + orbitNameClass}>{name}</span>
          <div className={'controls'}>
            <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('missions-plan-toggle-all-acquisitions')}</Tooltip>}>
              <button type="button" onClick={this.toggleAllAcquisitions} className={toggleAllAcquisitionsClass}>{i18n.get('missions-plan-toggle-all-acquisitions')}</button>
            </OverlayTrigger>
            {checkbox}
          </div>
        </div>
        {geoData}
      </div>
    );
  },
  toggleGeoData: function() {
    this.setState({geodataDisplayed: !this.state.geodataDisplayed});
  },
  toggleOrbit: function() {
    //if (this.props.type !== 'orbit') {
    if (this.props.feature.acquisitions) {
      this.setState({opened: !this.state.opened});
    }
  },
  getGeoData: function() {
    var icrClass = this.state.opened ? '' : 'hidden';
    if(this.props.type === 'orbit') {
      return (
        <Orbit scroll={this.props.id} idForScroll="additionnal-controls" highlight={this.state.highlightOrbit} toggleHighlight={this.toggleHighlightFromOrbit} coordinates={this.props.feature.geometry.coordinates} type={this.props.subtype} informations={this.props.feature.properties} visible={this.state.geodataDisplayed}/>
      );
    } else if(this.props.type === 'acquisition') {
      return (
        <PlannedAcquisition
          coordinates={this.props.feature.geometry.coordinates[0]}
          informations={this.props.feature.properties}
          feature={this.props.feature}
          type={this.props.acqtype}
          subtype={this.props.type}
          aoiAllDisplayed={this.state.aoiAllDisplayed}
          onClick={this.prevent}
          opened={this.state.opened}
          openOrbit={this.toggleOrbit}
        />
      );
    } else if (this.props.feature.orbit.geometry) {
      var acq = null;
      if (this.props.feature.acquisitions) {
        acq = (
          <div className={icrClass}>
            <PlannedAcquisitionList
              id={this.props.id}
              acquisitions={this.props.feature.acquisitions}
              type={this.props.acqtype}
              subtype={this.props.type}
              aoiAllDisplayed={this.state.aoiAllDisplayed}
              order={this.props.order}
              onClick={this.prevent}
              opened={this.state.opened}
              openOrbit={this.toggleOrbit}
            />
          </div>
        );
      }
      return (
        <div>
          <Orbit scroll={this.props.id} idForScroll="additionnal-controls" highlight={this.state.highlightOrbit} toggleHighlight={this.toggleHighlightFromOrbit} coordinates={this.props.feature.orbit.geometry.coordinates} type={this.props.subtype} informations={this.props.feature.orbit.properties} visible={this.state.geodataDisplayed}/>
          {acq}
        </div>
      );
    } else {
      return (
        <div>
          <Orbit scroll={this.props.id} idForScroll="additionnal-controls" highlight={this.state.highlightOrbit} toggleHighlight={this.toggleHighlightFromOrbit} coordinates={false} type={this.props.subtype} informations={this.props.feature.orbit.properties} visible={this.state.geodataDisplayed}/>
          <div className={icrClass}>
            <PlannedAcquisitionList
              id={this.props.id}
              acquisitions={this.props.feature.acquisitions}
              type={this.props.acqtype}
              subtype={this.props.type}
              aoiAllDisplayed={this.state.aoiAllDisplayed}
              order={this.props.order}
              onClick={this.prevent}
              opened={this.state.opened}
              openOrbit={this.toggleOrbit}
            />
          </div>
        </div>
      );
    }
    /*return (
      <PlannedAcquisition
        coordinates={this.props.feature.geometry.coordinates[0]}
        informations={this.props.feature.properties}
        type={this.props.acqtype}
        visible={this.state.geodataDisplayed}
        onClick={this.prevent}
        opened={this.state.opened}
        openOrbit={this.toggleOrbit}
      />
    );*/
  },
  getFeatureName: function() {
    if(this.props.type === 'orbit') {
      return this.props.feature.properties.Orbit;
    } else if(this.props.type === 'acquisition') {
      return 'ICR #' + this.props.feature.properties.ICR;
    } else if(this.props.feature.orbit.geometry) {
      return this.props.feature.orbit.properties.Orbit;
    } else {
      switch(this.props.type) {
        case 'acquisitionOrbits':
          return this.props.feature.acquisitions[0].properties.Acquisition.Orbit;
        case 'downloadingOrbits':
          if (this.props.feature.acquisitions[0].properties.Downloading[0].Orbit === 1000000) {
            return i18n.get('missions-plan-orbit-unknown');
          }
          return this.props.feature.acquisitions[0].properties.Downloading[0].Orbit;
        default:
          return i18n.get('missions-plan-orbit-unknown');
      }
    }
  }
});

module.exports = MissionPlanComponent;
