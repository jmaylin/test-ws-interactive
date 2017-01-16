var React = require('react');
var validator = require('email-validator');

var Checkbox = require('./checkbox');

var RecipientChooser = React.createClass({
  displayName: 'RecipientChooser',
  getInitialState: function() {
    return {
      editing: this.props.recipient.email === '',
      email: this.props.recipient.email
    };
  },
  startEditing: function() {
    this.setState({editing: true}, function() {
      var node = this.refs.title.getDOMNode();
      node.focus();
      node.select();
    });
  },
  cancelEditing: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      editing: false,
      email: this.props.recipient.email
    });
  },
  editingStopped: function() {
    this.setState({
      editing: false
    }, function() {
      this.props.onAddressChange(this.state.email);
    });
  },
  onAddressChange: function(event) {
    this.setState({
      email: event.target.value
    });
  },
  isValid: function() {
    return validator.validate(this.state.email);
  },
  render: function() {
    var formClass = this.state.editing ? 'static' : 'hidden';
    var staticClass = this.state.editing ? 'hidden' : 'button-group-recipient-chooser';
    var editButtonClass = this.props.recipient.editable ? 'btn-edit' : 'hidden';
    var deleteButtonClass = this.props.recipient.editable ? 'btn-delete' : 'hidden';
    var lineClass = this.isValid() ? '' : 'danger';
    return (
       <tr className={lineClass}>
        <td>
          <div className={staticClass}>
            <span className='display-title'>{this.state.email}</span>
            <button type="button" className={editButtonClass} onClick={this.startEditing}>Update</button>
            <button type="button" className={deleteButtonClass} onClick={this.props.onDelete}>Delete</button>
          </div>
          <div className={formClass}>
            <input className='edit-title' ref="title" onChange={this.onAddressChange} type='text' name='title-save-search' placeholder={this.state.email} value={this.state.email} />
            <div className="button-group button-group-recipient-chooser">
              <button type="button" className='btn-validate' onClick={this.editingStopped}>Save</button>
              <button type="button" className='btn-cancel' onClick={this.cancelEditing}>Cancel</button>
            </div>
          </div>
        </td>
        <td>
          <Checkbox checked={this.props.recipient.acquisition} onChange={this.props.onAcquisitionChanged}/>
        </td>
        <td>
          <Checkbox checked={this.props.recipient.summary} onChange={this.props.onSummaryChanged}/>
        </td>
        <td>
          <Checkbox checked={this.props.recipient.end} onChange={this.props.onEndChanged}/>
        </td>
      </tr>
    );
  }
});

module.exports = RecipientChooser;
