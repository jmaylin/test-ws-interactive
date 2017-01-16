var React = require('react');
var i18n = require('../../tools/i18n');

var SmartSelect = React.createClass({
  displayName: 'SmartSelect',
  getInitialState: function() {
    return {
    };
  },
  getDefaultProps: function() {
    return {
      options: [],
      hideIfNoChoice: false,
      forceDisplay: false,
      overrideNullValue: false
    };
  },
  componentDidMount: function() {
    if(this.props.options.length === 1 && !this.props.forceDisplay) {
      // launch a fake "onChange" event to allow components to initialize based on the value
      var value = typeof this.props.options[0] === 'string' ? this.props.options[0] : this.props.options[0].value;
      var fakeEvent = {
        target: {
          value: value
        }
      };
      this.props.onChange(fakeEvent);
    }
  },
  render: function() {
    var options = '';
    var label = '';
    if(this.props.label && !this.props.disableLabel) {
      label = <label htmlFor={this.props.name} >{this.props.label}</label>;
    }

    var componentContent = '';
    if(this.props.options.length === 1 && !this.props.forceDisplay) {
      var valueText = typeof this.props.options[0] === 'string' ? this.props.options[0] : this.props.options[0].text;
      componentContent = (<span className="fake-value">{valueText}</span>);
    }
    else {
      options = this.props.options.map(function(option, index) {
        if(typeof option === 'string') {
          return <option key={index} value={option}>{option}</option>;
        }
        return <option key={index} value={option.value}>{option.text}</option>;
      });

      var overrideValue = this.props.value;
      if(this.props.overrideNullValue) {
        overrideValue = this.props.value === null ? ' ' : this.props.value;
      }

      componentContent = (<select {...this.props} value={overrideValue}>
            <option value=" " >{i18n.get('choose-option')}</option>
            {options}
          </select>);
    }

    var componentClassName = 'super-smart-select';

    var styles = {};
    if(this.props.hideIfNoChoice && this.props.options.length <= 1) {
      styles.visibility = 'hidden';
    }


    return (
      <div className={componentClassName} style={styles}>
        {label}
        {componentContent}
      </div>
      );
  }
});

module.exports = SmartSelect;
