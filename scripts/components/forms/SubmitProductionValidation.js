var React = require('react');
var TaskingService = require('../../services/TaskingService');
var i18n = require('../../tools/i18n');

var returnFromModal = false;

var SubmitProductionValidation = React.createClass({
  displayName: 'SubmitProductionValidation',
  getInitialState: function() {
    this.props.close();
    return {
      loading: true,
      result: {}
    };
  },
  componentWillMount: function() {
    if (this.props.canSubmitProduction) {
      TaskingService.submitProduction(this.props.itemId, this.props.orderId, this.props.taskingId, this.submitDone);
    }
  },
  submitDone: function(result){
    var newState = {
      loading: false,
      result: result
    };
    this.setState(newState);
  },
  render: function() {
    var loadingMessage = this.getLoadingMessage();
    var resultMessage = this.getResultMessage();
    var buttonToolbar = this.getButtonToolbar();
    this.props.onReturn(returnFromModal);

    return (
      <div>
        <div className="submit-tasking-result">
          {loadingMessage}
          {resultMessage}
        </div>
        {buttonToolbar}
      </div>
    );
  },
  getLoadingMessage: function() {
    var loadingMessage = '';
    if(this.state.loading) {
      loadingMessage = (
        <div className="alert alert-info alert-loading">
          {i18n.get('loading')}
          <div className="loader"></div>
        </div>
      );
    }
    return loadingMessage;
  },
  getResultMessage: function() {
    var resultMessage = '';
    if(this.state.loading) {
      return resultMessage;
    }
    if(this.state.result.success) {
      resultMessage = (
        <div className="alert alert-success">
          {i18n.get('submit-production-success')}
        </div>
      );
      returnFromModal = true;
    } else {
      resultMessage = (
        <div className="alert alert-danger">
          {i18n.get(this.state.result.message)}
        </div>
      );
    }
    return resultMessage;
  },
  getButtonToolbar: function() {
    var toolbar = '';
    if(!this.state.loading) {
      toolbar = (
        <div className="step-button-group pull-right margtop">
          <button type="submit" className="btn btn-primary btn-submit" onClick={this.props.onHide}>{i18n.get('close')}</button>
        </div>
      );
    }
    return toolbar;
  }

});

module.exports = SubmitProductionValidation;
