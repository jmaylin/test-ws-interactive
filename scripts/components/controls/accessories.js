var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var assign = require('object-assign');

var SettingsModal = require('../modals/settingsModal');
var ToggleButton = require('../utils/ToggleButton');
var UiStateStore = require('../../stores/UiStateStore');
var UiStateActions = require('../../actions/UiStateActions');
var i18n = require('../../tools/i18n');
var VisibilityCirclesContainer = require('../GeoData/VisibilityCirclesContainer');
var StationMarkersContainer = require('../GeoData/StationMarkersContainer');
var AccountStore = require('../../stores/AccountStore');

var Accessories = React.createClass({
  displayName: 'Accessories',
  getInitialState: function() {
    var initialState = {showSettingsModal: false};
    initialState.receivingStations = AccountStore.getAllReceivingStations();
    initialState.stationsWithMasks = initialState.receivingStations.filter(function(station) {
      return station.maskGml !== '' && station.maskGml !== undefined;
    });
    initialState.stationsPositions = initialState.receivingStations;
    return assign(initialState, UiStateStore.getDisplayStatus());
  },
  componentWillMount: function() {
    UiStateStore.addChangeListener(this.onUiChange);
  },
  componentWillUnmount: function() {
    UiStateStore.removeChangeListener(this.onUiChange);
  },
  render: function() {
    return (
      <div className="accessories-control">
        {<ToggleButton baseClass="action visibility-circles" enabled={this.state.stationsWithMasks.length !== 0} active={this.state.visibilityCircles} onChange={this.onVisibilityCirclesChange}>
          {i18n.get('toggle-visibility-circles')}
        </ToggleButton>}
        <ToggleButton baseClass="action stations-positions" enabled={this.state.receivingStations.length !== 0} active={this.state.stationsPositions} onChange={this.onStationsPositionsChange}>
          {i18n.get('toggle-stations-positions')}
        </ToggleButton>
        <ToggleButton baseClass="action missions-plans" active={this.state.missionsPlans} onChange={this.onMissionsPlansChange}>
          {i18n.get('toggle-mission-plans')}
        </ToggleButton>
        <ToggleButton baseClass="action custom-layers" active={this.state.customLayers} onChange={this.onCustomLayersChange}>
          {i18n.get('toggle-custom-layers')}
        </ToggleButton>
        <OverlayTrigger placement='bottom' ref="overlayTriggerSettings" overlay={<Tooltip>{i18n.get('settings')}</Tooltip>}>
          <button type="button" className="settings-help search-settings" onClick={this.openSettingsModal}>{i18n.get('settings')}</button>
        </OverlayTrigger>

        <button type="button" className="settings-help about hidden">Tool 6</button>
        <VisibilityCirclesContainer visible={this.state.visibilityCircles} stations={this.state.stationsWithMasks} />
        <StationMarkersContainer visible={this.state.stationsPositions} stations={this.state.receivingStations} />
        <SettingsModal show={this.state.showSettingsModal} onHide={this.closeSettingsModal}/>
      </div>
    );
  },
  openSettingsModal: function() {
    this.setState({showSettingsModal: true});
  },
  closeSettingsModal: function() {
    this.setState({
      showSettingsModal: false
    }, function() {
      // on force le hide sur la tooltip du bouton settings
      this.refs.overlayTriggerSettings.hide();
    });
  },
  onVisibilityCirclesChange: function() {
    UiStateActions.toggleVisibilityCircles();
  },
  onStationsPositionsChange: function() {
    UiStateActions.toggleStationsPositions();
  },
  onMissionsPlansChange: function() {
    UiStateActions.toggleMissionsPlans();
  },
  onCustomLayersChange: function() {
    UiStateActions.toggleCustomLayers();
  },
  onUiChange: function() {
    this.setState(UiStateStore.getDisplayStatus());
  }
});

module.exports = Accessories;
