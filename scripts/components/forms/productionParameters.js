var React = require('react');
var SmartSelect = require('./smartSelect');
var Elevation = require('./Elevation');
var i18n = require('../../tools/i18n');
var Checkbox = require('./checkbox');
var ProductionConfiguration = require('../../tools/productionConfiguration');
var SubmitTaskingStore = require('../../stores/SubmitTaskingStore');
var ParametersChooser = require('./ParametersChooser');
var ParametersSaver = require('./ParametersSaver');
var config = new ProductionConfiguration();


var ProductionParameters = React.createClass({
  displayName: 'ProductionParameters',
  getInitialState: function() {
    return {
      prodPriority: null,
      prodPriorityError: false,
      prodProcessingLevel: null,
      prodProcessingLevelError: false,
      prodCompressionImage: null,
      prodCompressionImageError: false,
      prodImageFormat: null,
      prodImageFormatError: false,
      prodLicence: null,
      prodLicenceError: false,
      prodPixelCoding: null,
      prodPixelCodingError: false,
      prodProductFormat: null,
      prodProductFormatError: false,
      prodProjectionCode: null,
      prodProjectionCodeError: false,
      prodElevation: null,
      prodElevationError: false,
      prodSpectralProcessing: null,
      prodSpectralProcessingError: false,
      prodStereoMode: null,
      prodStereoModeError: false,
      prodRadiometricAdaptation: null,
      prodRadiometricAdaptationError: false,
      prefix: '',
      mustChooseProjectionCode: false,
      mustChooseRadiometricAdaptation: false,
      saveVisible: true,
      updateVisible: false
    };
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var newState = this.checkFieldsValidity();
    if(newState.hasError) {
      this.setState(newState);
    }
    else {

      // add to state the missing informations
      this.setState(newState, function(){
        if(this.props.mode === 'post-production') {
          SubmitTaskingStore.savePostProductionParameters(this.props.itemId, this.state);
        }
        else {
          SubmitTaskingStore.saveProductionParameters(this.state);
        }
        this.props.nextStep();
      });
    }
  },
  mustCheckValidity: function() {
    // only check if a value was set or for progtype urgent & dedicated
    if(this.state.valueUpdated ||
      this.props.progType.toLowerCase() === 'urgent' ||
      this.props.progType.toLowerCase() === 'dedicated') {
      return true;
    }
    return false;
  },
  checkFieldsValidity: function() {
    var newState = {};
    newState.hasError = false;
    newState.prodPriorityError = false;
    newState.prodProcessingLevelError = false;
    newState.prodCompressionImageError = false;
    newState.prodImageFormatError = false;
    newState.prodLicenceError = false;
    newState.prodPixelCodingError = false;
    newState.prodProductFormatError = false;
    newState.prodProjectionCodeError = false;
    newState.prodElevationError = false;
    newState.prodSpectralProcessingError = false;
    newState.prodStereoModeError = false;
    newState.prodRadiometricAdaptationError = false;
    if(!this.mustCheckValidity()) {
      return newState;
    }
    if(!this.state.prodPriority) {
      newState.prodPriorityError = true;
      newState.hasError = true;
    }
    if(!this.state.prodProcessingLevel) {
      newState.prodProcessingLevelError = true;
      newState.hasError = true;
    }
    if(this.state.mustChooseProjectionCode && !this.state.prodProjectionCode) {
      newState.prodProjectionCodeError = true;
      newState.hasError = true;
    }
    if(this.state.mustChooseElevation && (this.state.prodElevation === false || this.state.prodElevation === null)) {
      newState.prodElevationError = true;
      newState.hasError = true;
    }

    if(!this.state.prodCompressionImage) {
      newState.prodCompressionImageError = true;
      newState.hasError = true;
    }
    if(!this.state.prodImageFormat) {
      newState.prodImageFormatError = true;
      newState.hasError = true;
    }
    if(!this.state.prodLicence) {
      newState.prodLicenceError = true;
      newState.hasError = true;
    }
    if(!this.state.prodPixelCoding) {
      newState.prodPixelCodingError = true;
      newState.hasError = true;
    }
    if(!this.state.prodProductFormat) {
      newState.prodProductFormatError = true;
      newState.hasError = true;
    }

    if(!this.state.prodSpectralProcessing) {
      newState.prodSpectralProcessingError = true;
      newState.hasError = true;
    }
    if(!this.state.prodStereoMode) {
      newState.prodStereoModeError = true;
      newState.hasError = true;
    }
    if(this.state.mustChooseRadiometricAdaptation && !this.state.prodRadiometricAdaptation) {
      newState.prodRadiometricAdaptationError = true;
      newState.hasError = true;
    }
    return newState;
  },
  prodPriorityChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodPriority: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodProcessingLevelChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodProcessingLevel: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true,
        mustChooseProjectionCode: event.target.value === 'ORTHO',
        mustChooseElevation: event.target.value === 'PROJECTED'
      };
      if(!newState.mustChooseProjectionCode) {
        newState.prodProjectionCode = null;
      }
      if(!newState.mustChooseElevation) {
        newState.prodElevation = null;
      }
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodCompressionImageChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodCompressionImage: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodImageFormatChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodImageFormat: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodLicenceChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodLicence: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodPixelCodingChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodPixelCoding: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true,
        mustChooseRadiometricAdaptation: event.target.value === '16'
      };
      if(!newState.mustChooseRadiometricAdaptation) {
        newState.prodRadiometricAdaptation = null;
      }
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodProductFormatChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodProductFormat: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodProjectionCodeChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodProjectionCode: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodElevationChanged: function(event) {
    if(event.target.value !== false && event.target.value !== null) {
      var newState = {
        prodElevation: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodSpectralProcessingChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodSpectralProcessing: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodStereoModeChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodStereoMode: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prodRadiometricAdaptationChanged: function(event) {
    if(event.target.value) {
      var newState = {
        prodRadiometricAdaptation: event.target.value !== ' ' ? event.target.value : null,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  prefixChanged: function(event) {
    if(event.target.value.length <=20) {
      var newState = {
        prefix: event.target.value,
        valueUpdated: true
      };
      if (this.refs.parametersChooser.getCurrentPreset()) {
        newState.enableUpdate = true;
      }
      this.setState(newState);
    }
  },
  /**
   * Called when a preset is selected in the ParametersChooser
   */
  updateConfiguration: function(newConfiguration) {
    newConfiguration.showSaveModal = false;
    newConfiguration.enableUpdate = false;
    switch (newConfiguration.prodProcessingLevel) {
      case 'ORTHO' :
        newConfiguration.mustChooseProjectionCode = true;
        newConfiguration.mustChooseElevation = false;
        break;
      case 'PRIMARY' :
        newConfiguration.mustChooseProjectionCode = false;
        newConfiguration.mustChooseElevation = false;
        break;
      case 'PROJECTED' :
        newConfiguration.mustChooseProjectionCode = false;
        newConfiguration.mustChooseElevation = true;
        break;
      default :
        newConfiguration.mustChooseProjectionCode = false;
        newConfiguration.mustChooseElevation = false;
        break;
    }
    switch (newConfiguration.prodPixelCoding) {
      case '8' :
        newConfiguration.mustChooseRadiometricAdaptation = false;
        break;
      case '16' :
        newConfiguration.mustChooseRadiometricAdaptation = true;
        break;
      default :
        newConfiguration.mustChooseRadiometricAdaptation = false;
        break;
    }
    this.setState(newConfiguration);
  },
  render: function() {
     var errorMessage = '';
    if (this.state.hasError) {
      errorMessage = (
      <div className="col-sm-12 alert alert-danger">
        {i18n.get('fill-mandatory-fields')}
      </div>
      );
    }
    var projectionCodeDiv = null;
    if(this.state.mustChooseProjectionCode) {
      projectionCodeDiv = (
        <div className={this.state.prodProjectionCodeError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodProjectionCode"
              className="form-control" label={i18n.get('product-projectionCode')}
              value={this.state.prodProjectionCode}
              overrideNullValue
              options={config.getProdProjectionCodeOptions()}
              onChange={this.prodProjectionCodeChanged} />
          </div>
      );
    }
    var elevationDiv = null;
    if(this.state.mustChooseElevation) {
      elevationDiv = (
        <div className={this.state.prodElevationError ? 'col-sm-6 has-error' : 'col-sm-6'}>
          <Elevation name="prodElevation"
            className="form-control"
            label={i18n.get('product-elevation')}
            value={this.state.prodElevation}
            onChange={this.prodElevationChanged} />
        </div>
      );
    }
    var radiometricAdaptationDiv = null;
    if(this.state.mustChooseRadiometricAdaptation) {
      radiometricAdaptationDiv = (
        <div className={this.state.prodRadiometricAdaptationError ? 'col-sm-6 has-error' : 'col-sm-6'}>
          <SmartSelect name="prodRadiometricAdaptation"
            className="form-control" label={i18n.get('product-radiometricAdaptation')}
            value={this.state.prodRadiometricAdaptation}
            overrideNullValue
            options={config.getProdRadiometricAdaptationOptions()}
            onChange={this.prodRadiometricAdaptationChanged} />
        </div>
      );
    }
    var buttonToolbar = this.getButtonToolbar();
    return (
       <form className="form-horizontal form-submit-tasking production-parameters">
        <ParametersChooser ref='parametersChooser' saveVisible={this.state.saveVisible} updateVisible={this.state.updateVisible} showSave={this.showSave} showUpdate={this.showUpdate} saveType={this.state.saveType} showSaveModal={this.state.showSaveModal} closeSaveModal={this.closeSaveModal} type='production' onChange={this.updateConfiguration} currentConfiguration={this.getCurrentConfiguration()} />
        <div className="form-group">
          <div className={this.state.prodProcessingLevelError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodProcessingLevel"
              className="form-control" label={i18n.get('product-processingLevel')}
              value={this.state.prodProcessingLevel}
              overrideNullValue
              options={config.getProdProcessingLevelOptions()}
              onChange={this.prodProcessingLevelChanged} />
          </div>
          {projectionCodeDiv}
          {elevationDiv}
        </div>
        <div className="form-group">

          <div className={this.state.prodSpectralProcessingError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodSpectralProcessing"
              className="form-control" label={i18n.get('product-spectralProcessing')}
              value={this.state.prodSpectralProcessing}
              overrideNullValue
              options={config.getProdSpectralProcessingOptions()}
              onChange={this.prodSpectralProcessingChanged} />
          </div>

          <div className={this.state.prodStereoModeError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodStereoMode"
              className="form-control" label={i18n.get('product-stereoMode')}
              value={this.state.prodStereoMode}
              overrideNullValue
              options={config.getProdStereoModeOptions()}
              onChange={this.prodStereoModeChanged} />
          </div>
        </div>
        <div className="form-group">
          <div className={this.state.prodProductFormatError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodProductFormat"
              className="form-control" label={i18n.get('product-productFormat')}
              value={this.state.prodProductFormat}
              overrideNullValue
              options={config.getProdProductFormatOptions()}
              onChange={this.prodProductFormatChanged} />
          </div>
        </div>
        <div className="form-group">
          <div className={this.state.prodImageFormatError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodImageFormat"
              className="form-control" label={i18n.get('product-imageFormat')}
              value={this.state.prodImageFormat}
              overrideNullValue
              options={config.getProdImageFormatOptions()}
              onChange={this.prodImageFormatChanged} />
          </div>
          <div className={this.state.prodCompressionImageError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodCompressionImage"
              className="form-control" label={i18n.get('product-compressionImage')}
              value={this.state.prodCompressionImage}
              overrideNullValue
              options={config.getProdCompressionImageOptions()}
              onChange={this.prodCompressionImageChanged} />
          </div>
          <div className={this.state.prodPixelCodingError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodPixelCoding"
              className="form-control" label={i18n.get('product-pixelCoding')}
              value={this.state.prodPixelCoding}
              overrideNullValue
              options={config.getProdPixelCodingOptions()}
              onChange={this.prodPixelCodingChanged} />
          </div>
          {radiometricAdaptationDiv}
        </div>
        <div className="form-group">
          <div className={this.state.prodPriorityError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodPriority"
              className="form-control" label={i18n.get('product-priority')}
              value={this.state.prodPriority}
              overrideNullValue
              options={config.getProdPriorityOptions()}
              onChange={this.prodPriorityChanged} />
          </div>

          <div className={this.state.prodLicenceError ? 'col-sm-6 has-error' : 'col-sm-6'}>
            <SmartSelect name="prodLicence"
              className="form-control" label={i18n.get('product-licence')}
              value={this.state.prodLicence}
              overrideNullValue
              options={config.getProdLicenceOptions()}
              onChange={this.prodLicenceChanged} />
          </div>

          <div className='col-sm-6 col-sm-offset-6'>
            <label htmlFor='prefix'>{i18n.get('product-deliveryNamePrefix')}</label>
            <input name="prefix" type="text" value={this.state.prefix} maxLength="20" onChange={this.prefixChanged} className="form-control input-md" />
          </div>
        </div>
        <ParametersSaver showUpdate={this.showUpdate} enableUpdate={this.state.enableUpdate} saveVisible={this.state.saveVisible} updateVisible={this.state.updateVisible} openSaveModal={this.openSaveModal} />
        {errorMessage}
        {buttonToolbar}
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
  getButtonToolbar: function() {
    var toolbar = '';
    if(this.props.mode === 'post-production') {
      toolbar = (
        <div className="step-button-group">
          <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
          <button type="button" className="btn btn-primary btn-submit" onClick={this.handleSubmit}>{i18n.get('button-submit-production')}</button>
        </div>
      );
    }
    else {
      toolbar = (
        <div className="step-button-group">
          <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
          <button type="button" className="btn btn-default btn-submit btn-prev" onClick={this.props.previousStep}>{i18n.get('previous')}</button>
          <button type="button" className="btn btn-primary btn-submit" onClick={this.handleSubmit}>{i18n.get('button-submit-tasking')}</button>
        </div>
      );
    }

    return toolbar;
  },
  getCurrentConfiguration: function() {
    return {
      prodPriority: this.state.prodPriority,
      prodProcessingLevel: this.state.prodProcessingLevel,
      prodCompressionImage: this.state.prodCompressionImage,
      prodImageFormat: this.state.prodImageFormat,
      prodLicence: this.state.prodLicence,
      prodPixelCoding: this.state.prodPixelCoding,
      prodProductFormat: this.state.prodProductFormat,
      prodProjectionCode: this.state.prodProjectionCode,
      prodElevation: this.state.prodElevation,
      prodSpectralProcessing: this.state.prodSpectralProcessing,
      prodStereoMode: this.state.prodStereoMode,
      prodRadiometricAdaptation: this.state.prodRadiometricAdaptation,
      prefix: this.state.prefix,
      mustChooseProjectionCode: this.state.mustChooseProjectionCode,
      mustChooseElevation: this.state.mustChooseElevation,
      mustChooseRadiometricAdaptation: this.state.mustChooseRadiometricAdaptation
    };
  }

});

module.exports = ProductionParameters;
