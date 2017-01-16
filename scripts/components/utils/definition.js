var React = require('react');
var moment = require('moment');

var Definition = React.createClass({
  displayName: 'Definition',
  render: function() {
    var displayedValue = this.props.date ? moment(this.props.value).format(this.props.dateFormat) : this.props.value;
    return (
      <li className={this.props.value ? '' : 'hidden'}>
        <span className="definition-label">{this.props.label} : </span><span className="definition-value">{displayedValue}</span>
      </li>
    );
  }
});

module.exports = Definition;
