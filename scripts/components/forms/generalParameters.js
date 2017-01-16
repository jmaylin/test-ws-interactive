var React = require('react');
var i18n = require('../../tools/i18n');
var SmartSelect = require('./smartSelect');
var AccountStore = require('../../stores/AccountStore');
var SubmitTaskingStore = require('../../stores/SubmitTaskingStore');


var optionValues = {
  missionType: [],
  contract: [],
  organisms: [],
  taskingGroups: [],
  market: []
};

var GeneralParameters = React.createClass({
  displayName: 'GeneralParameters',
  getInitialState: function() {
    var initialState = SubmitTaskingStore.getGeneralParameters();
    return initialState;
  },
  componentWillMount: function() {
    this.initOptionValues();
  },
  initOptionValues: function() {
    optionValues.missionType = [];
    AccountStore.getAvailableMissionTypes().map(function(missionType){
      var missionLabel = missionType.replace('Astroterra', 'Spot 6/7');
      optionValues.missionType.push({value: missionType, text: missionLabel});
    });
    optionValues.contract = AccountStore.getContractOptions();
    optionValues.organisms = AccountStore.getOrganismsOptions();
    optionValues.taskingGroups = AccountStore.getTaskingGroupOptions();
    optionValues.market = AccountStore.getMarketOptions();
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var that = this;
    var newState = this.checkMandatoryFields();
    newState.internalError = false;
    if(newState.hasError) {
      this.setState(newState);
    }
    else {
      this.setState({
        loading: true,
        hasError: false
      }, function() {
        SubmitTaskingStore.saveGeneralParameters(this.state, function(data){
          newState.loading = false;
          if(data.success) {
            that.setState(newState, function() {
              that.props.nextStep();
            });
          }
          else {
            newState.internalError = true;
            that.setState(newState);
          }
        });
      });
    }
  },
  checkMandatoryFields: function() {
    var newState = {};
    newState.missionError = false;
    newState.contractError = false;
    newState.organismError = false;
    newState.marketError = false;
    newState.dspError = false;
    newState.referenceError = false;
    newState.programError = false;
    newState.commentError = false;
    newState.hasError = false;
    if(!this.state.mission) {
      newState.missionError = true;
      newState.hasError = true;
    }
    if(!this.state.contract) {
      newState.contractError = true;
      newState.hasError = true;
    }
    if(!this.state.organism) {
      newState.organismError = true;
      newState.hasError = true;
    }
    if(!this.state.market) {
      newState.marketError = true;
      newState.hasError = true;
    }
    if(!this.state.dsp) {
      newState.dspError = true;
      newState.hasError = true;
    }
    if(!this.state.reference) {
      newState.referenceError = true;
      newState.hasError = true;
    }
    return newState;
  },
  missionChanged: function(event) {
    var newState = {
      mission: event.target.value
    };
    // When the user select a mission (Pleiades / Astroterra), compute the contract options based on stations parameters autorized for this user
    if(newState.mission) {
      newState.contractOptions = optionValues.contract[newState.mission];
      if(newState.contractOptions.length ===1) {
        newState.contract = newState.contractOptions[0].value;
        this.notifyContractUpdate(newState.contract);
      }
      newState.organismOptions = optionValues.organisms[newState.mission].options;
      if (!this.state.organism) {
        newState.organism = optionValues.organisms[newState.mission].default;
      }
      newState.taskingGroupOptions = optionValues.taskingGroups[newState.mission].options;
      if (!this.state.taskingGroup) {
        newState.taskingGroup = optionValues.taskingGroups[newState.mission].default;
      }
      if (!this.state.dsp) {
        newState.dsp = this.computeDefaultDsp(newState.contract, newState.mission);
      }
    }
    else {
     newState.contractOptions = [];
     newState.contract = null;
    }
    this.setState(newState);
  },
  computeDefaultDsp: function(contract, mission) {
    var minDSP;
    if(contract === 'DRS') {
      minDSP = AccountStore.getDrsMinDSP(mission);
    }
    else {
      minDSP = AccountStore.getDspProfile(contract, mission);
    }
    return minDSP;
  },
  computeDSPOptions: function() {
    var contract = this.state.contract;
    var mission = this.state.mission;
    var minDSP;
    var options = [];
    if(!contract || !mission) {
      return options;
    }
    if(contract === 'DRS') {
      minDSP = AccountStore.getDrsMinDSP(mission);
    }
    else {
      minDSP = AccountStore.getDspProfile(contract, mission);
    }
    if(minDSP === 'DSP1') {
      options = [
        {value: 'DSP1', text: 'DSP1'},
        {value: 'DSP2', text: 'DSP2'},
        {value: 'DSP3', text: 'DSP3'}
      ];
    }
    else if(minDSP === 'DSP2') {
      options = [
        {value: 'DSP2', text: 'DSP2'},
        {value: 'DSP3', text: 'DSP3'}
      ];
    }
    else if(minDSP === 'DSP3') {
      options = [
        {value: 'DSP3', text: 'DSP3'}
      ];
    }
    return options;
  },
  contractChanged: function(event) {
    if(event.target.value) {
      var newState = {contract: event.target.value};
      newState.dsp = this.computeDefaultDsp(event.target.value, this.state.mission);
      this.setState(newState, this.notifyContractUpdate);
    }
  },
  notifyContractUpdate: function(contract) {
    contract = contract || this.state.contract;
    this.props.onContractChange(contract);
  },
  dspChanged: function(event) {
    if(event.target.value) {
      var newState = {dsp: event.target.value};
      this.setState(newState);
    }
  },
  organismChanged: function(event) {
    if(event.target.value) {
      var newState = {organism: event.target.value};
      this.setState(newState);
    }
  },
  taskingGroupChanged: function(event) {
    if(event.target.value) {
      var newState = {taskingGroup: event.target.value};
      this.setState(newState);
    }
  },
  marketChanged: function(event) {
    if(event.target.value) {
      var newState = {market: event.target.value};
      this.setState(newState);
    }
  },
  referenceChanged: function(event) {
    this.setState({referenceError: false});
    if(event.target.value.length <=20) {
      var newState = {reference: event.target.value};
      this.setState(newState);
    }
  },
  programChanged: function(event) {
    if(event.target.value.length <=20) {
      var newState = {program: event.target.value};
      this.setState(newState);
    }
  },
  commentChanged: function(event) {
    var newState = {comment: event.target.value};
    this.setState(newState);
  },
  render: function() {
    var missionSelected = this.state.mission !== null && this.state.mission !== '';
    var incorrectMission = missionSelected && this.state.contractOptions.length === 0;
    var incorrectMissionMessage = incorrectMission ? (
      <div className="alert alert-danger">
        {i18n.get('station-configuration-incomplete')}
      </div>
      ) : '';
    var errorMessage = '';
    if(this.state.internalError) {
      errorMessage = (<div className="alert alert-danger">
        {i18n.get('internal-error')}
      </div>);
    }
    else if (this.state.hasError) {
      errorMessage = (
      <div className="alert alert-danger">
        {i18n.get('fill-mandatory-fields')}
      </div>
      );
    }
    var dspOptions = this.computeDSPOptions();

    var submitButton = <button type="button" className="btn btn-primary btn-submit btn-next" onClick={this.handleSubmit}>{i18n.get('next')}</button>;
    if(this.state.loading) {
      submitButton = (
        <div className="btn btn-primary btn-submit btn-loading">{i18n.get('loading')}</div>
      );
    }

    var additionnalFields = '';
    if(missionSelected && !incorrectMission) {
      additionnalFields = (
          <div className='additionnal-fields form-group'>

              <div className={this.state.contractError ? 'col-sm-6 has-error' : 'col-sm-6'}>
                <SmartSelect name="contract"
                  disabled={!missionSelected || incorrectMission}
                  className="form-control" label={i18n.get('contract')}
                  value={this.state.contract}
                  options={this.state.contractOptions}
                  onChange={this.contractChanged} />
              </div>
              <div className={this.state.dspError ? 'col-sm-6 has-error' : 'col-sm-6'}>
                <SmartSelect name="dsp"
                  disabled={!missionSelected || incorrectMission}
                  className="form-control" label={i18n.get('dsp-profile')}
                  hideIfNoChoice
                  value={this.state.dsp}
                  options={dspOptions}
                  onChange={this.dspChanged} />
              </div>
              <div className={this.state.organismError ? 'col-sm-6 has-error' : 'col-sm-6'}>
                <SmartSelect name="organism"
                  disabled={!missionSelected || incorrectMission}
                  className="form-control" label={i18n.get('organism')}
                  value={this.state.organism}
                  options={this.state.organismOptions}
                  onChange={this.organismChanged} />
              </div>
              <div className={this.state.taskingGroupError ? 'col-sm-6 has-error' : 'col-sm-6'}>
                <SmartSelect name="taskingGroup"
                  disabled={!missionSelected || incorrectMission}
                  className="form-control" label={i18n.get('taskingGroup-label')}
                  hideIfNoChoice
                  value={this.state.taskingGroup}
                  options={this.state.taskingGroupOptions}
                  onChange={this.taskingGroupChanged} />
              </div>
              <div className={this.state.marketError ? 'col-sm-6 has-error' : 'col-sm-6'}>
                <SmartSelect name="market"
                  disabled={!missionSelected || incorrectMission}
                  className="form-control" label={i18n.get('market')}
                  value={this.state.market}
                  options={optionValues.market}
                  onChange={this.marketChanged} />
              </div>


            <div className={this.state.referenceError ? 'col-sm-6 has-error' : 'col-sm-6'}>
              <label className="control-label" htmlFor="reference">{i18n.get('client-reference')}</label>
              <div className="col-md-12 nopadding">
                <input name="reference" type="text" value={this.state.reference} onChange={this.referenceChanged} className="form-control input-md" />
              </div>
            </div>

            <div className="col-sm-6">
              <label className="control-label" htmlFor="program">{i18n.get('program')}</label>
              <div className="col-md-12 nopadding">
                <input name="program" type="text" value={this.state.program} onChange={this.programChanged} className="form-control input-md" />
              </div>
            </div>

            <div className="col-sm-12">
              <label className="control-label" htmlFor="comment">{i18n.get('comment')}</label>
              <div className="textarea-col col-md-12 nopadding">
                <textarea className="form-control" name="comment" value={this.state.comment} onChange={this.commentChanged}/>
              </div>
            </div>
          </div>
        );
    }

    return (
      <form className="form-horizontal form-submit-tasking general-parameters">
        <div className="form-group">
          <div className={this.state.missionError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="mission"
              className="form-control"
              label={i18n.get('mission-type')}
              value={this.state.mission}
              options={optionValues.missionType}
              onChange={this.missionChanged} />
          </div>
        </div>
        {incorrectMissionMessage}
        {additionnalFields}
        {errorMessage}
        <div className="step-button-group">
          <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
          {submitButton}
        </div>
      </form>
      );
  }
});

module.exports = GeneralParameters;
