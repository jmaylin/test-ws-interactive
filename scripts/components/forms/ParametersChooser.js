var React = require('react');
var i18n = require('../../tools/i18n');

var ParametersStore = require('../../stores/ParametersStore');
var SaveParametersModal = require('../modals/saveParametersModal');

var SmartSelect = require('./smartSelect');

var ParametersChooser = React.createClass({
  displayName: 'ParametersChooser',
  getInitialState: function() {
    return {
      showSaveModal: false,
      currentPreset: null,
      avalaiblePresets: ParametersStore.getAll(),
      saveType: ''
    };
  },
  componentWillMount: function() {
    ParametersStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ParametersStore.removeChangeListener(this._onChange);
  },
  componentWillReceiveProps: function(nextProps) {
    var newState = {};
    if (nextProps.showSaveModal !== this.props.showSaveModal) {
      newState.showSaveModal = nextProps.showSaveModal;
    }
    if (this.state.currentPreset) {
      if (nextProps.updateVisible !== this.props.updateVisible) {
        this.props.showUpdate();
      }
    } else {
      if (nextProps.saveVisible !== this.props.saveVisible) {
        this.props.showSave();
      }
    }
    this.setState(newState);
  },
  getCurrentPreset() {
    return this.state.currentPreset;
  },
  render: function() {
    var presetsOptions = [];
    if (this.state.avalaiblePresets.params[this.props.type]) {
      this.state.avalaiblePresets.params[this.props.type].forEach(function(preset, index) {
        if (this.props.type !== 'programmation' || (preset.parameters.mission === this.props.mission && preset.parameters.organism === this.props.organism)) {
          presetsOptions.push({
            value: index,
            text: preset.name
          });
        }
      }, this);
    }

    var loadButton = null;
    var deleteButton = null;
    if(this.state.currentPreset) {
      loadButton = <button type="button" className="btn-load col-sm-12" onClick={this.loadPreset}>{i18n.get('load')}</button>;
      deleteButton = <div className="parameter-chooser-deleted pull-right" onClick={this.deletePreset}>{this.state.avalaiblePresets.params[this.props.type][this.state.currentPreset].name}</div>;
    }

    var chooserClass = ' hidden';
    if (this.state.avalaiblePresets.params[this.props.type] && this.state.avalaiblePresets.params[this.props.type].length > 0) {
      chooserClass = '';
    }

    var presetName = '';
    if (this.state.avalaiblePresets.params[this.props.type][this.state.currentPreset]) {
      presetName = this.state.avalaiblePresets.params[this.props.type][this.state.currentPreset].name;
    }

    return (
      <div className={'parameter-chooser row' + chooserClass}>
        <div className="col-sm-8 col-md-offset-2">
          <div className="col-sm-9">
            <label htmlFor="presetChooser" className="parameter-chooser-label col-sm-12">{i18n.get('production-parameters-preset-choose')}</label>
          </div>
          <SmartSelect name="presetChooser"
                className="form-control col-sm-9"
                value={this.state.currentPreset}
                options={presetsOptions}
                forceDisplay
                overrideNullValue
                label=''
                onChange={this.updateSelectedPreset} />
          <div className="parameter-chooser-load col-sm-3">
            {loadButton}
          </div>
          <div className="col-sm-9 no-padding">
            {deleteButton}
          </div>
          <SaveParametersModal
            presetName={presetName}
            show={this.state.showSaveModal}
            showUpdate={this.showUpdate}
            saveType={this.props.saveType}
            onHide={this.closeSaveModal}
            type={this.props.type}
            currentConfiguration={this.props.currentConfiguration}
          />
        </div>
      </div>
    );
  },
  showUpdate: function() {
    this.props.showUpdate();
  },
  openSaveModal: function() {
    this.setState({showSaveModal: true});
  },
  closeSaveModal: function(index) {
    this.setState({
      showSaveModal: false,
      currentPreset: (typeof index !== 'object' ) ? index : this.state.currentPreset
    }, this.props.closeSaveModal);
  },
  updateSelectedPreset: function(event) {
    this.setState({currentPreset: event.target.value !== ' ' ? event.target.value : null });
    if (event.target.value !== ' ') {
      this.props.showUpdate();
    } else {
      this.props.showSave();
    }
  },
  deletePreset: function() {
    ParametersStore.delete(this.state.avalaiblePresets.params[this.props.type][this.state.currentPreset].name, this.props.type);
    this.setState({currentPreset: null});
    this.props.showSave();
  },

  loadPreset: function() {
    if(this.state.currentPreset) {
      this.props.onChange(this.state.avalaiblePresets.params[this.props.type][this.state.currentPreset].parameters);
    }
  },

  _onChange: function() {
    this.setState({avalaiblePresets: ParametersStore.getAll()});
  }

});

module.exports = ParametersChooser;
