var React = require('react');
var TaskingService = require('../../services/TaskingService');
var i18n = require('../../tools/i18n');
var SearchActions = require('../../actions/SearchActions');
var DrsConstants = require('../../constants/DrsConstants');

var SubmitTaskingValidation = React.createClass({
  displayName: 'SubmitTaskingValidation',
  getInitialState: function() {
    return {
      loading: true,
      result: {}
    };
  },
  componentWillMount: function() {
    TaskingService.submitTasking(this.props.mode, this.submitDone);
  },
  submitDone: function(result){
    var newState = {
      loading: false,
      result: result
    };
    this.setState(newState);

    if(newState.result.success == true) {
      this.props.onSubmitSuccess();

      var searchData = {
        icr_list: this.state.result.tasking.taskingId,
        taskingStatus: [],
        program: '',
        mission: '',
        type: DrsConstants.searchType.UNSAVED
      };

      SearchActions.newUnsavedSearch(searchData);

    }
  },
  render: function() {
    var loadingMessage = this.getLoadingMessage();
    var resultMessage = this.getResultMessage();
    var buttonToolbar = this.getButtonToolbar();

    return (
      <div className="submit-tasking-result">
        {loadingMessage}
        {resultMessage}
        {buttonToolbar}
      </div>

    );
  },
  getLoadingMessage: function() {
    var loadingMessage = '';
    if(this.state.loading) {
      loadingMessage = (
        <div className="alert alert-loading">
          <div className="loader"></div>
          {i18n.get('loading')}
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
      return (
        <div className="alert alert-success">
          {i18n.getParam('tasking-created', this.state.result.tasking.taskingId)}
        </div>
      );
    }
    if(this.state.result.tasking !== null) {

      var message = this.state.result.tasking.MSG_LIST.MSG.map(function(value) {
        return (
          <div className={'alert msg-' + value.KIND.toLowerCase()}>
            <strong>{value.KIND}</strong> - {value.LABEL}
          </div>
        );
      })

      return (
        <div>
          <strong>{i18n.getParam('tasking-created-error', this.state.result.tasking.taskingId)}</strong>
          {message}
        </div>
      );
    }
    return (
      <div className="alert alert-danger">
        <strong>{i18n.getParam('internal-error')}</strong>
      </div>
    );
  },
  getButtonToolbar: function() {
    var toolbar = '';
    if(!this.state.loading) {
      toolbar = (
        <div className="step-button-group">
          <button type="submit" className="btn btn-primary btn-success" onClick={this.props.onHide}>{i18n.get('close')}</button>
        </div>
      );
    }
    return toolbar;
  }
});

module.exports = SubmitTaskingValidation;
