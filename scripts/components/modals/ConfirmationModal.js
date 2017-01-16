var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');

var ConfirmationModal = React.createClass({
  displayName: 'ConfirmationModal',
  render: function() {
    return (
      <Modal {...this.props} className="modal-confirmation" bsStyle="primary" animation={false}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.onCancel} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>{this.props.children}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-default btn-cancel cancel" onClick={this.props.onCancel}>{i18n.get('cancel')}</button>
          <button className="btn btn-primary btn-submit btn-next validate" onClick={this.props.onValidate}>{i18n.get('validate')}</button>
        </div>
      </Modal>
    );
  }
});

module.exports = ConfirmationModal;
