var React = require('react');
var i18n = require('../../tools/i18n');

var GeneralError = React.createClass({
  displayName: GeneralError,
  render: function() {
    return (
      <div className="system-general-error">
        <div className="alert alert-danger">{i18n.get('system-account-error')}</div>
      </div>
    );
  }

});

module.exports = GeneralError;
