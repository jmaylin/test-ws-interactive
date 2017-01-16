var React = require('react');

var i18n = require('../../tools/i18n');
var AccountStore = require('../../stores/AccountStore');
var SubmitTaskingStore = require('../../stores/SubmitTaskingStore');
var RecipientChooser = require('./recipientChooser');

var NotificationRecipients = React.createClass({
  displayName: 'NotificationRecipients',
  getInitialState: function() {
    var initialState = {
      recipients: []
    };
    var responsibles = SubmitTaskingStore.getResponsibles();
    this.doAddRecipient(initialState.recipients, AccountStore.getUserEmail(), true, true, true, false);
    responsibles.forEach(function(email) {
      this.doAddRecipient(initialState.recipients, email, true, true, true, false);
    }, this);

    if (this.props.recipients) {
      initialState.recipients = this.setRecipients(this.props.recipients);
    }

    return initialState;
  },
  componentDidMount: function() {
    this.props.onChange(this.state.recipients);
  },
  componentWillReceiveProps: function(nextProps) {
    var recipients = this.setRecipients(nextProps.recipients);
    this.setState({recipients: recipients});
  },
  setRecipients: function(recipients) {
    var newState = [];
    recipients.forEach( function(recipient) {
      newState.push({
        email: recipient.email,
        acquisition: JSON.parse(recipient.acquisition),
        summary: JSON.parse(recipient.summary),
        end: JSON.parse(recipient.end),
        editable: JSON.parse(recipient.editable)
      });
    });
    return newState;
  },
  doAddRecipient: function(recipients, email, acquisition, summary, end, editable) {
    recipients.push({
      email: email,
      acquisition: acquisition,
      summary: summary,
      end: end,
      editable: editable
    });
  },
  addRecipientClicked: function() {
    var recipients = this.state.recipients;
    this.doAddRecipient(recipients, '', true, true, true, true);
    this.updateRecipients(recipients);
  },
  deleteRecipientClicked: function(index) {
    var recipients = this.state.recipients;
    recipients.splice(index, 1);
    this.updateRecipients(recipients);
  },
  acquisitionChanged: function(index) {
    var recipients = this.state.recipients;
    recipients[index].acquisition = !recipients[index].acquisition;
    this.updateRecipients(recipients);
  },
  summaryChanged: function(index) {
    var recipients = this.state.recipients;
    recipients[index].summary = !recipients[index].summary;
    this.updateRecipients(recipients);
  },
  endChanged: function(index) {
    var recipients = this.state.recipients;
    recipients[index].end = !recipients[index].end;
    this.updateRecipients(recipients);
  },
  addressChanged: function(index, name) {
    var recipients = this.state.recipients;
    recipients[index].email = name;
    this.updateRecipients(recipients);
  },
  updateRecipients: function(recipients) {
    this.props.onChange(recipients);
    this.setState({
      recipients: recipients
    });
  },
  allValid: function() {
    for (var i = 0; i < this.state.recipients.length; i++) {
      if(!this.refs['recipient' + i].isValid()) {
        return false;
      }
    }
    return true;
  },
  getRecipients() {
    return this.state.recipients;
  },
  render: function() {
    var tableClass = 'table table-striped table-hover table-condensed';
    var recipients = this.state.recipients.map(function(recipient, index) {
      //var editable = recipient.email ? false : true;
      //
      return (
        <RecipientChooser key={index} ref={'recipient' + index}
          recipient={recipient}
          onAddressChange={this.addressChanged.bind(this, index)}
          onAcquisitionChanged={this.acquisitionChanged.bind(this, index)}
          onSummaryChanged={this.summaryChanged.bind(this, index)}
          onEndChanged={this.endChanged.bind(this, index)}
          onDelete={this.deleteRecipientClicked.bind(this, index)}
        />
        );
    }, this);
    return (
      <div>
        <div className="col-md-12 form-group">
            <label className="col-md-12 control-label" >{i18n.get('notification-recipients')}</label>
            <div className="col-md-12">
              <table className={tableClass}>
              <thead>
                <tr>
                  <th>{i18n.get('address')}</th>
                  <th>{i18n.get('notification-acquisition')}</th>
                  <th>{i18n.get('notification-summary')}</th>
                  <th>{i18n.get('notification-end')}</th>
                </tr>
              </thead>
              <tbody>
              {recipients}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">
                    <button type="button" className="btn" onClick={this.addRecipientClicked}>{i18n.get('add-recipient')}</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
    </div>
      );
  }
});

module.exports = NotificationRecipients;
