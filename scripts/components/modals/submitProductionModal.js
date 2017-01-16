var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');

var ProductionParameters = require('../forms/productionParameters');
var SubmitProductionValidation = require('../forms/SubmitProductionValidation');

var returnFromModal = false;

var SubmitProductionModal = React.createClass({
  displayName: 'SubmitProductionModal',
  getInitialState: function() {
    return {
      showForm: true,
      close: true
    };
  },
  submitProduction: function() {
    this.setState({showForm: false});
  },
  render: function() {
    var modalContent = '';
    if(this.state.showForm) {
      modalContent = (<ProductionParameters
                mode="post-production"
                itemId={this.props.elementId}
                orderId={this.props.orderId}
                taskingId={this.props.taskingId}
                progType={this.props.progType}
                nextStep={this.submitProduction}
                onHide={this.hideModal}
                previousStep={null} />);
    }
    else {
      modalContent = (<SubmitProductionValidation
                itemId={this.props.itemId}
                orderId={this.props.orderId}
                taskingId={this.props.taskingId}
                onReturn={this.returnModal}
                onHide={this.hideModal}
                close={this.close}
                canSubmitProduction={!this.state.close} />);
    }
    return (
      <Modal {...this.props} className="modal-submit-tasking" animation={false} keyboard={this.state.close} backdrop={this.state.close} onHide={this.props.onHide}>
        <Modal.Header closeButton={this.state.close}>
          <h4 className="modal-title" id="submit-tasking-modal-title">Submit Production</h4>
        </Modal.Header>
        <div className="modal-body">
          {modalContent}
        </div>
        <div className="modal-footer">
        </div>
      </Modal>
    );
  },
  returnModal: function(result) {
    returnFromModal = result;
  },
  hideModal: function() {
    this.setState({showForm: true});
    this.setState({close: true});
    this.props.onHide(returnFromModal);
  },
  close: function() {
    this.setState({close: false});
  }
});

module.exports = SubmitProductionModal;
