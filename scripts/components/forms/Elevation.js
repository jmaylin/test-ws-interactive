var React = require('react');
var i18n = require('../../tools/i18n');
var Checkbox = require('./checkbox');

var conf = applicationConfiguration.submitProduction.elevation;

var Elevation = React.createClass({
  displayName: 'Elevation',
  getInitialState: function() {
    return {
      bestChecked: Number.isInteger(parseInt(this.props.value)) ? false : true,
      elevationValue: Number.isInteger(parseInt(this.props.value)) ? this.props.value : null,
      elevationDisabled: Number.isInteger(parseInt(this.props.value)) ? false : true,
      elevationActive: Number.isInteger(parseInt(this.props.value)) ? true : false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var newState = {
      bestChecked: Number.isInteger(parseInt(nextProps.value)) ? false : true,
      elevationValue: Number.isInteger(parseInt(nextProps.value)) ? nextProps.value : null,
      elevationDisabled: Number.isInteger(parseInt(nextProps.value)) ? false : true,
      elevationActive: Number.isInteger(parseInt(nextProps.value)) ? true : false
    };
    this.setState(newState);
  },
  componentDidMount: function() {
    if (!Number.isInteger(parseInt(this.props.value))) {
      var fakeEvent = {
        target: {
          value: ''
        }
      };
      this.props.onChange(fakeEvent);
    }
  },
  onChangedEnd: function(newState) {
    var value = newState.bestChecked ? '' : newState.elevationValue;
    var fakeEvent = {
      target: {
        value: value
      }
    };
    this.props.onChange(fakeEvent);
  },
  onCheckboxChanged: function(event) {
    var newState = {
      bestChecked: !this.state.bestChecked,
      elevationDisabled: !this.state.bestChecked ? false : !this.state.elevationDisabled,
      elevationValue: this.state.bestChecked ? 0 : this.state.elevationValue
    };
    this.setState(newState, this.onChangedEnd(newState));
  },
  elevationValueChanged: function(event) {
    var min = conf.min;
    var max = conf.max;
    var value = parseInt(event.target.value);
    if (isNaN(value)) {
      value = ' ';
    } else {
      if (value > max) {
        value = parseInt(max);
      }
      if (value < min) {
        value = parseInt(min);
      }
    }
    var newState = {
      elevationValue: value,
      bestChecked: false,
      elevationDisabled: false
    };
    this.setState(newState, this.onChangedEnd(newState));
  },
  elevationFocus: function() {
    this.setState({elevationActive: true});
  },
  elevationBlur: function() {
    this.setState({elevationActive: false});
  },
  render: function() {
    var inputClass = this.state.elevationDisabled ? 'form-control input-md disabled' : 'form-control input-md';
    var inputValue = this.state.elevationValue === ' ' ? null : this.state.elevationValue;
    var inputActive = this.state.elevationActive ? ' active' : '';

    return (
      <div>
        <label htmlFor="prodElevation">{this.props.label}</label>
        <div>
          <div className="col-sm-5 elevation-best">
            <Checkbox checked={this.state.bestChecked} onChange={this.onCheckboxChanged} label={i18n.get('elevation-default')} />
          </div>
          <div className="col-sm-1 elevation-or">
            {i18n.get('elevation-or')}
          </div>
          <div className="col-sm-6 nopadding">
            <input className={inputClass + inputActive} name="prodElevation" type="number" placeholder={i18n.get('elevation-placeholder')} value={inputValue} min={conf.min} max={conf.max} step="1" onChange={this.elevationValueChanged} onFocus={this.elevationFocus} onBlur={this.elevationBlur} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Elevation;
