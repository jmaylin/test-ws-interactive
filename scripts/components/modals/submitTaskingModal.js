var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var SubmitTasking = require('../forms/submitTasking');

var SubmitTaskingModal = React.createClass({
  displayName: 'SubmitTaskingModal',
  render: function() {
    return (
        <Modal {...this.props} className="modal-submit-tasking" bsStyle="primary" animation={false} backdrop='static'>
          <div className="modal-header">
            <button type="button" className="close" onClick={this.props.onHide} aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="submit-tasking-modal-title">Submit tasking</h4>
          </div>
          <div className="modal-body">
            <SubmitTasking onHide={this.props.onHide} onSubmitSuccess={this.props.onSubmitSuccess}/>
          </div>
        </Modal>
      );
  }
});

module.exports = SubmitTaskingModal;
