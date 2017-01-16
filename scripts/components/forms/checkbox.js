var React = require('react');

var Checkbox = React.createClass({
  displayName: 'Checkbox',
  getInitialState: function() {
    return {
    };
  },
  getDefaultProps: function() {
    return {
      options: []
    };
  },
  /*checkboxChanged: function() {

  },*/
  render: function() {
    var label = this.props.label ? this.props.label : '';
    var iconClass = this.props.checked ? 'icon-checked' : 'icon-unchecked';
    return (
       <label className="checkbox">
          <input type="checkbox" {...this.props} className="custom-checkbox" />
          <span className="icons">
            <span className={iconClass} onMouseOver={this.props.showHighlightOrbit} onMouseOut={this.props.hideHighlightOrbit}></span>
          </span>
          {label}
        </label>
      );
  }
});

module.exports = Checkbox;
