var React = require('react');
var classNames = require('classnames');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var MissionPlanComponentList = require('./MissionPlanComponentList');
var MissionPlanService = require('../../services/MissionPlanService');
var CustomScrollbar = require('../../tools/customScrollbar');
var i18n = require('../../tools/i18n');

var MissionPlan = React.createClass({
  displayName: 'MissionPlan',
  getInitialState: function() {
    return {
      orbits: [],
      acquisitions: [],
      features: {},
      opened: false,
      listClass: '',
      order: false,
      classFilterAcquisition: true,
      classFilterDownloading: false
    };
  },
  componentWillMount: function() {
    var that = this;
    MissionPlanService.getGeoJson(this.props.filename, function(data) {
      if(typeof data === 'object' && !!data.features) {
        var features = data.features;
        var _orbits = [];
        var _acquisitions = [];
        var _features = {
          'acquisition': [],
          'downloading': []
        };
        features.forEach(function(feature) {
          if(feature.properties.ICR) {
            if (feature.properties.Acquisition.Orbit === 'NC' && feature.properties.Downloading.Orbit === 'NC') {
              _acquisitions.push(feature);
            } else {
              if (!_features.acquisition[feature.properties.Acquisition.Orbit]) {
                _features.acquisition[feature.properties.Acquisition.Orbit] = {};
                _features.acquisition[feature.properties.Acquisition.Orbit].orbit = {};
                _features.acquisition[feature.properties.Acquisition.Orbit].acquisitions = [];
              }
              _features.acquisition[feature.properties.Acquisition.Orbit].acquisitions.push(feature);

              feature.properties.Downloading.map(function(_props) {
                if (_props.Orbit === 'NC') {
                  _props.Orbit = 1000000;
                }
                if (!_features.downloading[_props.Orbit]) {
                  _features.downloading[_props.Orbit] = {};
                  _features.downloading[_props.Orbit].orbit = {};
                  _features.downloading[_props.Orbit].acquisitions = [];
                }
                if (_features.downloading[_props.Orbit].acquisitions.indexOf(feature)) {
                  _features.downloading[_props.Orbit].acquisitions.push(feature);
                }
              });
            }
          } else {
            if (!_features.acquisition[feature.properties.Orbit] && !_features.downloading[feature.properties.Orbit]) {
              //_orbits.push(feature);
              _features.acquisition[feature.properties.Orbit] = {};
              _features.acquisition[feature.properties.Orbit].orbit = feature;
            }
            if (_features.acquisition[feature.properties.Orbit]) {
              _features.acquisition[feature.properties.Orbit].orbit = feature;
            }
            if (_features.downloading[feature.properties.Orbit]) {
              _features.downloading[feature.properties.Orbit].orbit = feature;
            }
          }
        });
        that.setState({orbits: _orbits, acquisitions: _acquisitions, features: _features});
      }
      CustomScrollbar.refreshScrollbar();
    }).catch(function(e) {
      CustomScrollbar.refreshScrollbar();
      console.err('catch', e);
    });
  },
  componentDidUpdate: function() {
    CustomScrollbar.refreshScrollbar();
  },
  render: function() {
    var orbits = null;
    var acquisitions = null;
    var headerClass = classNames(
      'missions-plans--header',
      {opened: this.state.opened}
    );
    var downloadKml = (
      <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('missions-plans-download-kml')}</Tooltip>}>
        <button onClick={this.downloadKml} className='download-kml'>{i18n.get('missions-plans-download-kml')}</button>
      </OverlayTrigger>
    );
    var downloadLink = '';
    if(this.props.kmlAvailable) {
      downloadLink = ({downloadKml});
    }
    var content = null;
    var filters = null;
    var classAcquisition = this.state.classFilterAcquisition ? 'filter active' : 'filter';
    var classDownloading = this.state.classFilterDownloading ? 'filter active' : 'filter';
    if(this.state.opened) {

      orbits = this.state.orbits.length ? <MissionPlanComponentList station={this.props.station} satellite={this.props.satellite} features={this.state.orbits} type="orbit" subtype={'orbit-'+this.props.mission.toLowerCase()} /> : null;
      acquisitions = this.state.acquisitions.length ? <MissionPlanComponentList station={this.props.station} satellite={this.props.satellite} features={this.state.acquisitions} type="acquisition" subtype={'acquisition-'+this.props.mission.toLowerCase()} /> : null;
      var acquisitionOrbits = this.state.features.acquisition && this.state.classFilterAcquisition ? <MissionPlanComponentList order={this.state.order} station={this.props.station} satellite={this.props.satellite} features={this.state.features.acquisition} type="acquisitionOrbits" acqtype={'acquisition-'+this.props.mission.toLowerCase()} subtype={'orbit-'+this.props.mission.toLowerCase()} /> : null;
      var downloadingOrbits = this.state.features.downloading && this.state.classFilterDownloading ? <MissionPlanComponentList order={this.state.order} station={this.props.station} satellite={this.props.satellite} features={this.state.features.downloading} type="downloadingOrbits" acqtype={'acquisition-'+this.props.mission.toLowerCase()} subtype={'orbit-'+this.props.mission.toLowerCase()} /> : null;
      //var orderedOrbits = this.state.order ? (<div>{downloadingOrbits}{acquisitionOrbits}</div>) : (<div>{acquisitionOrbits}{downloadingOrbits}</div>);
      content = (
        <div>
          {acquisitionOrbits}
          {downloadingOrbits}
          {/*orderedOrbits*/}
          {acquisitions}
          {orbits}
        </div>
      );
      filters = (
        <div className='filter-acquisition-bar'>
          {i18n.get('mission-plans-filters-orbits')}
          <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('mission-plans-filters-acquisition-tooltip')}</Tooltip>}>
            <button onClick={this.filterByAcquisition} className={classAcquisition}>{i18n.get('mission-plans-filters-acquisition')}</button>
          </OverlayTrigger>
          <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('mission-plans-filters-downloading-tooltip')}</Tooltip>}>
            <button onClick={this.filterByDownloading} className={classDownloading}>{i18n.get('mission-plans-filters-downloading')}</button>
          </OverlayTrigger>
        </div>
      );
    }

    var planName = this.props.station + ' - ' + this.props.satellite;

    return (
      <div className="missions-plans--content">
        <div className={headerClass} onClick={this.headerClick}>
          <span className={'missions-plans--name ' + this.props.group}>{planName}</span>
          <span className="missions-plans--date">{this.props.update}</span>
          <div className="missions-plans--button-group">
            {/*orderOrbits*/}
            {downloadLink}
          </div>
        </div>
        {filters}
        {content}
      </div>
    );
  },
  headerClick: function() {
    this.setState({
      opened: !this.state.opened
    });
  },
  downloadKml: function(event) {
    event.preventDefault();
    event.stopPropagation();
    MissionPlanService.downloadKml(this.props.filename);
  },
  filterByAcquisition: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      classFilterAcquisition: true,
      classFilterDownloading: false
    });
  },
  filterByDownloading: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      classFilterAcquisition: false,
      classFilterDownloading: true
    });
  }

});

module.exports = MissionPlan;
