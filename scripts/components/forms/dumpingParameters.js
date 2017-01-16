var React = require('react');

var i18n = require('../../tools/i18n');
var AccountStore = require('../../stores/AccountStore');
var SmartSelect = require('./smartSelect');

var DumpingParameters = React.createClass({
  displayName: 'DumpingParameters',
  getInitialState: function() {
    var initialState = {
      receivingStationsAvailable: AccountStore.getReceivingStationsforMission(this.props.mission)
    };

    if(initialState.receivingStationsAvailable.length) {
      var options = [];
      var receivingAcronyms = [];
      var processingOptions = {};
      var totalProcessingOptionsAvailable = 0;
      initialState.receivingStationsAvailable.forEach(function(station) {
        options.push({
          receiving: station.acronym,
          processing: station.processingStations
        });
        receivingAcronyms.push(station.acronym);
        processingOptions[station.acronym] = station.processingStations;
        totalProcessingOptionsAvailable += station.processingStations.length;
      });

      initialState.allReceivingAcronyms = receivingAcronyms;
      initialState.allProcessingOptions = processingOptions;
      initialState.availableReceivingAcronyms = receivingAcronyms;
      initialState.availableProcessingOptions = processingOptions;
      initialState.selectedCouples = [];
      initialState.totalProcessingOptionsAvailable = totalProcessingOptionsAvailable;
      // select the first two couples
      initialState.selectedCouples.push({'receiving': options[0].receiving, 'processing': options[0].processing[0]});
      if(options.length > 1) {
        initialState.selectedCouples.push({'receiving': options[1].receiving, 'processing': options[1].processing[0]});
      }
    }

    if (this.props.selectedCouples) {
      initialState.selectedCouples = this.setCouples(this.props.selectedCouples);
    }

    return initialState;
  },

  componentDidMount: function() {
    this.props.onChange(this.state.selectedCouples);
  },

  componentWillReceiveProps: function(nextProps) {
    var selectedCouples = this.setCouples(nextProps.selectedCouples);
    this.setState({selectedCouples: selectedCouples});
  },

  setCouples: function(selectedCouples) {
    var newState = [];
    selectedCouples.forEach( function(couple) {
      newState.push({
        receiving: couple.receiving,
        processing: couple.processing
      });
    });
    return newState;
  },

  selectCouple: function(state, receivingAcronym, processingAcronym) {
    var newState = state;
    // add to selection
    newState.selectedCouples.push({'receiving': receivingAcronym, 'processing': processingAcronym});
    return newState;
  },

  addCouple: function() {
    var selectedCouples = this.state.selectedCouples;
    var defaultSelection = this.state.availableReceivingAcronyms[0];
    selectedCouples.push({'receiving': defaultSelection, 'processing': this.state.availableProcessingOptions[defaultSelection][0]});
     this.updateSelection(selectedCouples);
  },

  deleteCouple: function(index) {
    var selectedCouples = this.state.selectedCouples;
    selectedCouples.splice(index, 1);
    this.updateSelection(selectedCouples);
  },

  receivingStationChange: function(index, event) {
    var selectedCouples = this.state.selectedCouples;
    selectedCouples[index].receiving = event.target.value;
    selectedCouples[index].processing = this.state.availableProcessingOptions[event.target.value][0];
    this.updateSelection(selectedCouples);
  },

  processingStationChange: function(index, event) {
    var selectedCouples = this.state.selectedCouples;
    selectedCouples[index].processing = event.target.value;
    this.updateSelection(selectedCouples);
  },

  updateSelection: function(selectedCouples) {
    this.props.onChange(selectedCouples);
    this.setState({
      selectedCouples: selectedCouples
    });
  },

  allValid: function() {
    for (var i = 0; i < this.state.selectedCouples.length; i++) {
      if(this.isDuplicate(i, this.state.selectedCouples[i])) {
        return false;
      }
    }
    return true;
  },

  getSelectedCouples() {
    return this.state.selectedCouples;
  },

  isDuplicate: function(originalIndex, originalCouple) {
    var couple;
    for (var index = 0; index < this.state.selectedCouples.length; index++) {
      couple = this.state.selectedCouples[index];
      if(index !== originalIndex && couple.processing === originalCouple.processing && couple.receiving === originalCouple.receiving) {
        return true;
      }
    }
    return false;
  },
  render: function() {
    var dumpingParameters = '';
    dumpingParameters = this.state.selectedCouples.map(function(couple, index) {
      var button = '';
      var lineClass = '';
      if (index > 0) {
        button = <button type="button" className="btn btn-default btn-cancel" onClick={this.deleteCouple.bind(null, index)}>{i18n.get('remove')}</button>;
      }
      if(this.isDuplicate(index, couple)) {
        lineClass = 'danger';
      }
      return (
        <tr key={index} className={lineClass}>
          <td>
            <SmartSelect name={'receiving' + index}
              className="form-control"
              value={couple.receiving}
              label={i18n.get('receiving-station')}
              disableLabel
              options={this.state.availableReceivingAcronyms}
              onChange={this.receivingStationChange.bind(this, index)}
              />
          </td>
          <td>
            <SmartSelect name={'processing' + index}
              className="form-control"
              value={couple.processing}
              label={i18n.get('processing-station')}
              disableLabel
              options={this.state.availableProcessingOptions[couple.receiving]}
              onChange={this.processingStationChange.bind(this, index)}
              />
          </td>
          <td>{button}</td>
        </tr>
      );
    }, this);

    var tableClass = 'table table-striped table-hover table-condensed';
    var buttonDisabled = false;
    var buttonClass = 'btn';
    if(this.state.selectedCouples.length === this.state.totalProcessingOptionsAvailable) {
      buttonDisabled = true;
      buttonClass = 'hidden';
    }
    var errorMessage = '';
    if(!this.state.receivingStationsAvailable.length) {
      tableClass += ' hidden';
      errorMessage = (<div className="alert alert-danger">
        {i18n.get('internal-error')}
      </div>);
    }
    return (
       <div className="form-group col-md-12">
        <label className="col-md-12 control-label" >{i18n.get('dumping-parameters')}</label>
        <div className="col-md-8">
          {errorMessage}
          <table className={tableClass}>
            <thead>
              <tr>
                <th>{i18n.get('receiving-station')}</th>
                <th>{i18n.get('processing-station')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dumpingParameters}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">
                  <button type="button" className={buttonClass} disabled={buttonDisabled} onClick={this.addCouple}>{i18n.get('add-couple')}</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      );
  }
});

module.exports = DumpingParameters;
