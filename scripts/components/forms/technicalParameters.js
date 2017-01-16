var React = require('react');
var moment = require('moment');
var Alert = require('react-bootstrap/lib/Alert');

var i18n = require('../../tools/i18n');
var castToFloat = require('../../tools/castToFloat');
var SmartSelect = require('./smartSelect');
var AcquisitionPeriodSimple = require('./acquisitionPeriodSimple');
var AcquisitionPeriodComplex = require('./acquisitionPeriodComplex');
var DumpingParameters = require('./dumpingParameters');
var NotificationRecipients = require('./notificationRecipients');
var SubmitTaskingStore = require('../../stores/SubmitTaskingStore');
var DrsConstants = require('../../constants/DrsConstants');
var ParametersChooser = require('./ParametersChooser');
var ParametersSaver = require('./ParametersSaver');

var TechnicalParameters = React.createClass({
  displayName: 'TechnicalParameters',
  getInitialState: function() {
    return SubmitTaskingStore.getTechnicalParameters();
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var newState = this.checkFieldsValidity();
    if(newState.hasError) {
      this.setState(newState);
    }
    else {
      // add to state the missing informations

      newState.acquisitionPeriod = this.refs.acquisitionPeriod.getPeriod();
      if(SubmitTaskingStore.getSelectedContract() === 'DRS') {
        newState.dumpingParameters = this.refs.dumpingParameters.getSelectedCouples();
      }
      else {
        newState.dumpingParameters = null;
      }
      newState.notificationRecipients = this.refs.notificationRecipients.getRecipients();
      this.setState(newState, this.saveParameters);

    }
  },

  saveParameters: function() {
    var that = this;
    this.setState({
      loading: true
    }, function() {
      SubmitTaskingStore.saveTechnicalParameters(this.state, function(data){
        var newState = {loading: false};
        if(data.success) {
          newState.internalError = false;
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
  },

  checkFieldsValidity: function() {

    var newState = {};
    newState.hasError = false;
    newState.progTypeError = false;
    newState.stereoModeError = false;
    newState.bhError = false;
    newState.incidenceAngleError = false;
    newState.maxCloudCoverageError = false;
    newState.acquisitionPeriodError = false;
    newState.dumpingParametersError = false;
    newState.notificationRecipientsError = false;

    if(!this.state.progType) {
      newState.progTypeError = true;
      newState.hasError = true;
      // if no progType no need to check the rest
      return newState;
    }
    if(!this.state.stereoMode) {
      newState.stereoModeError = true;
      newState.hasError = true;
    }

    if(this.state.stereoMode !== 'NONE') {
      if (this.state.minBh >= this.state.maxBh) {
        newState.bhError = true;
        newState.hasError = true;
      }
    }
    var mission = SubmitTaskingStore.getSelectedMission();
    var minAngle;
    if(mission === 'Pleiades') {
      minAngle = DrsConstants.taskingParameters.MIN_ANGLE_PLEIADES;
    }
    else {
      minAngle = DrsConstants.taskingParameters.MIN_ANGLE_ASTROTERRA;
    }
    if(this.state.maxIncidenceAngle < minAngle) {
      newState.incidenceAngleError = true;
      newState.hasError = true;
    }

    if(this.state.maxCloudCoverage === null || this.state.maxCloudCoverage === '' || this.state.maxCloudCoverage > 100) {
      newState.maxCloudCoverageError = true;
      newState.hasError = true;
    }

    var acquisitionPeriod = this.refs.acquisitionPeriod.getPeriod();
    if(!acquisitionPeriod.start || !acquisitionPeriod.end) {
      newState.acquisitionPeriodError = true;
      newState.hasError = true;
    }

    if(SubmitTaskingStore.getSelectedContract() === 'DRS') {
      if(!this.refs.dumpingParameters.allValid()) {
        newState.dumpingParametersError = true;
        newState.hasError = true;
      }
    }

    if(!this.refs.notificationRecipients.allValid()) {
      newState.notificationRecipientsError = true;
      newState.hasError = true;
    }

    return newState;
  },
  dismissAlert: function() {
    this.setState({alertVisible: false});
  },
  /**
   * Called when a preset is selected in the ParametersChooser
   */
  updateConfiguration: function(newConfiguration) {
    newConfiguration.showSaveModal = false;
    newConfiguration.enableUpdate = false;
    newConfiguration.stereoModeOptions = this.state.stereoModeAllOptions;
    this.setState(newConfiguration);
  },
  render: function() {
    var params = SubmitTaskingStore.getGeneralParameters();
    var translationKey = '';
    if (this.state.alertVisible && params.mission.length > 1 && this.state.progType.length > 1) {
      translationKey = params.mission + '-' + this.state.progType;
      var constraintsMessage = (
        <Alert bsStyle="info" className="alert" onDismiss={this.dismissAlert}>
          <div dangerouslySetInnerHTML={{__html: i18n.get(translationKey.toLowerCase())}}/>
        </Alert>
      );
    }
    var internalError = '';
    if(this.state.internalError) {
      internalError = (<div className="alert alert-danger">
        {i18n.get('internal-error')}
      </div>);
    }
    var errorMessage = '';
    if (this.state.hasError) {
      errorMessage = (
      <div className="col-sm-12 alert alert-danger">
        {i18n.get('fill-mandatory-fields')}
      </div>
      );
    }
    var progTypeErrorMessage = '';
    var additionnalFields = '';
    if(this.state.progType && !this.state.progTypeOptionsStatus[this.state.progType]) {
      progTypeErrorMessage = i18n.get('progType-unavailable');
    }
    else if (this.state.progType && !this.state.progTypeOptionsParametersStatus[this.state.progType]) {
      progTypeErrorMessage = i18n.get('progType-incompatible-options');
    }
    if(progTypeErrorMessage !== '') {
      progTypeErrorMessage = (
      <div className="alert alert-danger">
        {progTypeErrorMessage}
      </div>
      );
    }

    var submitButton = <button type="button" className="btn btn-primary btn-submit btn-next" onClick={this.handleSubmit}>{i18n.get('next')}</button>;
    if (!this.props.haveNextStep) {
      submitButton = <button type="button" className="btn btn-primary btn-submit btn-next" onClick={this.handleSubmit}>{i18n.get('button-submit-tasking')}</button>;
    }
    if(this.state.loading) {
      submitButton = (
        <div className="btn btn-primary btn-submit btn-loading">{i18n.get('loading')}</div>
      );
    }

    var stereoModeDiv = '';
    var bhDiv = '';
    var angleDiv = '';
    var cloudCoverageDiv = '';
    var acquisitionPeriodSelector = '';
    if(this.state.progType && progTypeErrorMessage === '') {
      stereoModeDiv = (
        <div className="col-md-12 nopadding">
          <div className={this.state.stereoModeError ? 'col-md-6 has-error' : 'col-md-6'}>
            <SmartSelect name="stereoMode"
              className="form-control" label={i18n.get('stereoMode')}
              value={this.state.stereoMode}
              options={this.state.stereoModeOptions}
              onChange={this.stereoModeChanged} />
          </div>
        </div>
      );


      if(this.state.stereoMode !== 'NONE') {
        // base sur hauteur
        // Can only be set for an acquisition method different of NONE
        bhDiv = (
          <div className="col-md-12 nopadding">
            <div className={this.state.bhError ? 'has-error col-md-6' : 'col-md-6'}>
              <label className="col-md-12 control-label" htmlFor="minBh">{i18n.get('minBh')}</label>
              <div className="col-md-12 nopadding">
                <input name="minBh" type="number" placeholder={i18n.get('minBh')} value={this.state.minBh} step="0.1" onChange={this.minBhChanged} className="form-control input-md" />
              </div>
            </div>
            <div className={this.state.bhError ? 'has-error col-md-6' : 'col-md-6'}>
              <label className="col-md-12 control-label" htmlFor="maxBh">{i18n.get('maxBh')}</label>
              <div className="col-md-12 nopadding">
                <input name="maxBh" type="number" placeholder={i18n.get('maxBh')} value={this.state.maxBh} min={this.state.minBh} step="0.1" onChange={this.maxBhChanged} className="form-control input-md" />
              </div>
            </div>
          </div>
        );
      }

      var minAngle = DrsConstants.taskingParameters.MIN_ANGLE_PLEIADES;
      var mission = SubmitTaskingStore.getSelectedMission();

      if(mission !== 'Pleiades') {
        minAngle = DrsConstants.taskingParameters.MIN_ANGLE_ASTROTERRA;
      }
      angleDiv = (
        <div className={this.state.incidenceAngleError ? 'has-error col-md-6' : 'col-md-6'} >
          <label className="control-label" htmlFor="maxIncidenceAngle">{i18n.get('max-incidence-angle')}</label>
          <div className="col-md-12 nopadding">
            <input name="maxIncidenceAngle" type="number" placeholder={i18n.get('max-incidence-angle')} value={this.state.maxIncidenceAngle} min={minAngle} max={DrsConstants.taskingParameters.MAX_INCIDENCE_ANGLE} step="0.1" onChange={this.maxIncidenceAngleChanged} className="form-control input-md" />
          </div>
        </div>
      );

      if(this.state.progType !== 'dedicated') {
        cloudCoverageDiv = (
          <div className={this.state.maxCloudCoverageError ? 'has-error col-md-6' : 'col-md-6'}>
            <label className=" control-label" htmlFor="maxCloudCoverage">{i18n.get('max-cloud-coverage')}</label>
            <div className="col-md-12 nopadding">
              <input name="maxCloudCoverage" type="number" placeholder={i18n.get('max-cloud-coverage')} value={this.state.maxCloudCoverage} min="0" max="100" step="1" onChange={this.maxCloudCoverageChanged} className="form-control input-md" />
            </div>
          </div>
        );
        this.state.acquisitionPeriod.startEnd = moment().add(1, 'days').toDate();
        var maxStartDate = null;
        var maxEndDate = null;
        if (this.refs.acquisitionPeriod) {
          var pikaValues = this.refs.acquisitionPeriod.getValues();
          maxStartDate = pikaValues.start;
          maxEndDate = pikaValues.end;
        }
        // Si la prog est de type "Urgent", on limite la saisie aux 7 prochains jours
        if(this.state.progType === 'urgent') {
          maxStartDate = moment().add(6, 'days').toDate();
          maxEndDate = moment().add(7, 'days').toDate();
        }
        acquisitionPeriodSelector = <AcquisitionPeriodSimple ref='acquisitionPeriod' inError={this.state.acquisitionPeriodError} start={this.state.acquisitionPeriod.start} end={this.state.acquisitionPeriod.end} startEnd={this.state.acquisitionPeriod.startEnd} maxStart={maxStartDate} maxEnd={maxEndDate}/>;
      }
      else {
        acquisitionPeriodSelector = <AcquisitionPeriodComplex ref='acquisitionPeriod' inError={this.state.acquisitionPeriodError} incidenceAngle={this.state.maxIncidenceAngle}/>;
      }

      var dumpingParameters = '';
      if(SubmitTaskingStore.getSelectedContract() === 'DRS') {
        dumpingParameters = <DumpingParameters mission={mission} ref='dumpingParameters' selectedCouples={this.state.dumpingParameters} onChange={this.dumpingParametersChanged} />;
      }
      additionnalFields = (
        <div className='additionnal-fields form-group'>
          {stereoModeDiv}
          {bhDiv}
          <div className="col-md-12 nopadding">
            {angleDiv}{cloudCoverageDiv}
          </div>
          {acquisitionPeriodSelector}
          {dumpingParameters}
          <NotificationRecipients ref='notificationRecipients' recipients={this.state.notificationRecipients} onChange={this.notificationRecipientsChanged} />
        </div>
      );
    }
    var parametersSaverComponent = '';
    if (this.state.progType && this.state.progType.length > 1) {
      parametersSaverComponent = <ParametersSaver enableUpdate={this.state.enableUpdate} saveVisible={this.state.saveVisible} updateVisible={this.state.updateVisible} openSaveModal={this.openSaveModal} />;
    }
    return (
      <form className="form-horizontal form-submit-tasking technical-parameters">
        <ParametersChooser ref='parametersChooser' saveVisible={this.state.saveVisible} updateVisible={this.state.updateVisible} showSave={this.showSave} showUpdate={this.showUpdate} saveType={this.state.saveType} showSaveModal={this.state.showSaveModal} closeSaveModal={this.closeSaveModal} type='programmation' mission={params.mission} organism={params.organism} onChange={this.updateConfiguration} currentConfiguration={this.getCurrentConfiguration()} />
        <div className='form-group'>
          <div className={this.state.progTypeError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="progType"
              className="form-control" label={i18n.get('progType')}
              value={this.state.progType}
              options={this.state.progTypeOptions}
              onChange={this.progTypeChanged} />
          </div>
        </div>
        {constraintsMessage}
        {internalError}
        {progTypeErrorMessage}
        {additionnalFields}
        {parametersSaverComponent}
        {errorMessage}
        <div className="step-button-group">
          <button type="button" className="btn btn-default btn-submit btn-prev" onClick={this.props.previousStep}>{i18n.get('previous')}</button>
          <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
          {submitButton}
        </div>
      </form>
    );
  },
  showUpdate: function() {
    this.setState({
      saveVisible: false,
      updateVisible: true
    });
  },
  showSave: function() {
    this.setState({
      saveVisible: true,
      updateVisible: false
    });
  },
  openSaveModal: function(_type) {
    this.setState({
      showSaveModal: true,
      saveType: _type
    });
  },
  closeSaveModal: function() {
    this.setState({showSaveModal: false});
  },
  /**
   * Events methods
   */
  progTypeChanged: function(event) {
    var newState = {
      progType: event.target.value,
      alertVisible: true
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.saveVisible = false;
      newState.updateVisible = true;
    } else {
      newState.saveVisible = true;
      newState.updateVisible = false;
    }
    if(newState.progType === 'dedicated') {
      newState.stereoModeOptions = this.state.stereoModeDedicatedOptions;
      newState.stereoMode = 'NONE';
    }
    else {
      newState.stereoModeOptions = this.state.stereoModeAllOptions;
    }
    this.setState(newState);
  },
  stereoModeChanged: function(event) {
    var newState = {
      stereoMode: event.target.value
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  minBhChanged: function(event) {
    var newState = {
      minBh: castToFloat(event.target.value)
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  maxBhChanged: function(event) {
    var newState = {
      maxBh: castToFloat(event.target.value)
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  maxIncidenceAngleChanged: function(event) {
    var minAngle = DrsConstants.taskingParameters.MIN_ANGLE_PLEIADES;
    var maxAngle = DrsConstants.taskingParameters.MAX_INCIDENCE_ANGLE;
    var mission = SubmitTaskingStore.getSelectedMission();
    if(mission !== 'Pleiades') {
      minAngle = DrsConstants.taskingParameters.MIN_ANGLE_ASTROTERRA;
    }
    var value = event.target.value;
    if (value > maxAngle) {
      value = maxAngle.toString();
    }
    if (value < minAngle) {
      value = minAngle.toString();
    }
    var newState = {
      maxIncidenceAngle: castToFloat(value)
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  maxCloudCoverageChanged: function(event) {
    var value = event.target.value;
    if (value > 100) {
      value = '100';
    }
    if (value < 0) {
      value = '0';
    }
    var newState = {
      maxCloudCoverage: castToFloat(value)
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  dumpingParametersChanged: function(value) {
    var newState = {
      dumpingParameters: value
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  notificationRecipientsChanged: function(recipients) {
    var newState = {
      notificationRecipients: recipients
    };
    if (this.refs.parametersChooser.getCurrentPreset()) {
      newState.enableUpdate = true;
    }
    this.setState(newState);
  },
  getCurrentConfiguration: function() {
    var current = this.state;
    var params = SubmitTaskingStore.getGeneralParameters();
    current.mission = params.mission;
    current.organism = params.organism;

    return current;
  }
});

module.exports = TechnicalParameters;
