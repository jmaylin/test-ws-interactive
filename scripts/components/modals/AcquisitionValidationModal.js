var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var assign = require('object-assign');

var i18n = require('../../tools/i18n');
var DrsConstants = require('../../constants/DrsConstants');
var AcquisitionValidationService = require('../../services/AcquisitionValidationService');

var AcquisitionValidationModal = React.createClass({
  displayName: 'AcquisitionValidationModal',
  getInitialState: function() {
    return {
      error: false,
      loading: false,
      choiceMade: false,
      message: ''
    };
  },
  render: function() {

    var message = '';
    if(this.state.loading) {
      message = (
        <div className="alert alert-loading">
          <div className="loader"></div>
            {i18n.get('loading')}
        </div>
      );
    }
    else if(this.state.error) {
        message = (<div className="alert alert-danger">
          {i18n.get(this.state.message)}
        </div>);
      }
    else if(this.state.message){
      message = (<div className="alert alert-success">
        {i18n.get(this.state.message)}
      </div>);
    }

    return (
     <Modal {...this.props} className="modal-search acquisition-validation-question" bsStyle="primary" animation={false}>
        <form className='form-horizontal save-search-form' onSubmit={this.handleSubmit}>
          <div className="modal-header">
            <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h4 className="modal-search-title">{i18n.get('acquisition-validation-question')}</h4>
            {message}
          </div>
          <div className="modal-footer">
            {this.getToolbar()}
          </div>
        </form>
      </Modal>
    );
  },
  validationHandler: function(choice) {
    var parameters = assign(this.props.validationParameters, {action: choice});
    this.setState({loading: true});
    AcquisitionValidationService.setStatus(parameters, this.validationDone);
  },
  getToolbar: function () {
    if(!this.state.choiceMade && !this.state.loading) {
      return (
        <div>
        <button type="button" className="btn btn-reject" onClick={this.validationHandler.bind(this, DrsConstants.acquisitionValidation.REJECT)}>
          {i18n.get('acquisition-validation-reject')}
        </button>
        <button type="button" className="btn btn-submit" onClick={this.validationHandler.bind(this, DrsConstants.acquisitionValidation.VALIDATE)}>
          {i18n.get('acquisition-validation-accept')}
        </button>
        </div>
      );
    }
  },
  validationDone: function(data) {
    var newState = {
      choiceMade: data.success,
      loading: false,
      message: data.message,
      error: !data.success
    };
    this.setState(newState);
  }

});

module.exports = AcquisitionValidationModal;
