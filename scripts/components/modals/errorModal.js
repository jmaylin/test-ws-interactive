var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Alert = require('react-bootstrap/lib/Alert');

var ErrorModal = React.createClass({
  displayName: 'ErrorModal',
  render: function() {
    return (
      <Modal {...this.props} className="modal-search" bsStyle="primary" animation={false}>
        <div className="modal-header">
        </div>
        <div className="modal-body">
          <Alert bsStyle='danger' onDismiss={this.props.onHide}>
            {this.props.children}
          </Alert>
        </div>
        <div className="modal-footer">
          </div>
      </Modal>
    );
  }
});

module.exports = ErrorModal;
