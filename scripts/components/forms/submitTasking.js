var React = require('react');
var GeneralParameters = require('./generalParameters');
var TechnicalParameters = require('./technicalParameters');
var ProductionParameters = require('./productionParameters');
var SubmitTaskingValidation = require('./SubmitTaskingValidation');
var SubmitTaskingStore = require('../../stores/SubmitTaskingStore');
var AccountStore = require('../../stores/AccountStore');
var i18n = require('../../tools/i18n');

var SubmitTasking = React.createClass({
  displayName: 'SubmitTasking',
  getInitialState: function() {
    return {
      step: 1,
      contract: SubmitTaskingStore.getGeneralParameters().contract
    };
  },
  nextStep: function() {
    this.setState({step: this.state.step + 1});
  },
  previousStep: function() {
    this.setState({step: this.state.step - 1});
  },
  onContractChange: function(contract){
    this.setState({
      contract: contract
    });
  },
  preventClick: function(event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  },
  render: function() {
    var stepContent = '';
    var tablistClass = 'nav nav-tabs';
    switch (this.state.step) {
      case 1 :
        stepContent = (<GeneralParameters
                  onContractChange={this.onContractChange}
                  nextStep={this.nextStep}
                  onHide={this.props.onHide}
                  previousStep={this.previousStep} />);
        break;
      case 2 :
        stepContent = (<TechnicalParameters
                  nextStep={this.nextStep}
                  haveNextStep={this.state.contract === 'DRS' || !AccountStore.userCanSubmitProduction() ? false : true}
                  onHide={this.props.onHide}
                  previousStep={this.previousStep} />);
        break;
      case 3 :
        if(this.state.contract === 'DRS' || !AccountStore.userCanSubmitProduction()) {
          tablistClass = 'hidden';
          stepContent = (<SubmitTaskingValidation
                  mode='DRS'
                  nextStep={this.nextStep}
                  onHide={this.props.onHide}
                  onSubmitSuccess={this.props.onSubmitSuccess}
                  previousStep={this.previousStep} />);
        }
        else {
          stepContent = (<ProductionParameters
                  progType={SubmitTaskingStore.getSelectedProgType()}
                  nextStep={this.nextStep}
                  onHide={this.props.onHide}
                  previousStep={this.previousStep} />);
        }
        break;
      case 4:
        tablistClass = 'hidden';
        stepContent = (<SubmitTaskingValidation
                mode='VRS'
                nextStep={this.nextStep}
                onHide={this.props.onHide}
                onSubmitSuccess={this.props.onSubmitSuccess}
                previousStep={this.previousStep} />);
        break;
    }
    var step1Class = this.state.step === 1 ? 'active' : '';
    var step2Class = this.state.step === 2 ? 'active' : '';
    var step3Class = 'hidden';
    if(this.state.contract !== 'DRS' && this.state.contract) {
      step3Class = this.state.step === 3 ? 'active last' : '';
    }
    else {
      step2Class = step2Class + ' last';
    }
    return (
     <div className="submit-tasking">
       <ul className={tablistClass} role="tablist">
          <li role="presentation" className={step1Class}><a href="#" onClick={this.preventClick}>{i18n.get('general-parameters')}</a></li>
          <li role="presentation" className={step2Class}><a href="#" onClick={this.preventClick}>{i18n.get('acquisition-parameters')}</a></li>
          <li role="presentation" className={step3Class}><a href="#" onClick={this.preventClick}>{i18n.get('production-parameters')}</a></li>
        </ul>
        <div className="tab-content">
          {stepContent}
        </div>
     </div>
    );
  }
});

module.exports = SubmitTasking;
