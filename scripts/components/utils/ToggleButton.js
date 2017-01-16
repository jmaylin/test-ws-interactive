var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var classNames = require('classnames');

var ToggleButton = React.createClass({
  getDefaultProps: function() {
    return {
      baseClass: '',
      enabled: true,
      activeClass: 'active',
      active: false,
      onChange: function() {}
    };
  },
  render: function() {
    var buttonClassName = classNames(
      this.props.baseClass,
      function(obj){ return obj.props.active ? obj.props.activeClass : ''; }(this),
      {hidden: !this.props.enabled}
    );
    return (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{this.props.children}</Tooltip>}>
        <button type="button" className={buttonClassName} onClick={this.props.onChange}>{this.props.children}</button>
      </OverlayTrigger>
    );
  }

});

module.exports = ToggleButton;
