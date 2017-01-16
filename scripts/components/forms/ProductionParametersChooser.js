var React = require('react');
var i18n = require('../../tools/i18n');

var ParametersStore = require('../../stores/ParametersStore');
var SaveParametersModal = require('../modals/saveParametersModal');

var SmartSelect = require('./smartSelect');

var ProductionParametersChooser = React.createClass({
  displayName: 'ProductionParametersChooser',
  getInitialState: function() {
    return {
      showSaveModal: false,
      currentPreset: null,
      avalaiblePresets: ParametersStore.getAll()
    };
  },
  componentWillMount: function() {
    ParametersStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ParametersStore.removeChangeListener(this._onChange);
  },
  render: function() {
    var presetsOptions = this.state.avalaiblePresets.params.production.map(function(preset, index) {
      return {
        value: index,
        text: preset.name
      };
    });

    var loadButton = null;
    var deleteButton = null;
    if(this.state.currentPreset) {
      loadButton = <button type="button" className="btn-load" onClick={this.loadPreset}>{i18n.get('load')}</button>;
      deleteButton = <button type="button" className="btn-delete" onClick={this.deletePreset}>{i18n.get('delete')}</button>;
    }

    return (
      <div className="parameter-chooser form-group">
        <div className="col-sm-6">
          <SmartSelect name="presetChooser"
                className="form-control"
                value={this.state.currentPreset}
                options={presetsOptions}
                forceDisplay
                overrideNullValue
                label={i18n.get('production-parameters-preset-choose')}
                onChange={this.updateSelectedPreset} />
          {loadButton}
          {deleteButton}
          <SaveParametersModal show={this.state.showSaveModal} onHide={this.closeSaveModal} type='production' currentConfiguration={this.props.currentConfiguration} />
        </div>
      </div>
    );
  },
  openSaveModal: function() {
    this.setState({showSaveModal: true});
  },
  closeSaveModal: function(index) {
    this.setState({
      showSaveModal: false,
      currentPreset: (typeof index !== 'object' ) ? index : this.state.currentPreset
    });
  },
  updateSelectedPreset: function(event) {
    this.setState({currentPreset: event.target.value !== ' ' ? event.target.value : null });
  },
  deletePreset: function() {
    ParametersStore.delete(this.state.avalaiblePresets.params.production[this.state.currentPreset].name, this.state.avalaiblePresets.params.production[this.state.currentPreset].type);
    this.setState({currentPreset: null});
  },

  loadPreset: function() {
    if(this.state.currentPreset) {
      this.props.onChange(this.state.avalaiblePresets.params.production[this.state.currentPreset].parameters);
    }
  },

  _onChange: function() {
    this.setState({avalaiblePresets: ParametersStore.getAll()});
  }

});

module.exports = ProductionParametersChooser;
