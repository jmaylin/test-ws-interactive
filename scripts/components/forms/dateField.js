var React = require('react');
var Pikaday = require('pikaday');

//var picker;

var DateField = React.createClass({
  displayName: 'DateField',
  getInitialState: function() {
    return {
      picker: null
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.min) {
      this.state.picker.setMinDate(nextProps.min);
      if(this.state.picker.getDate() < nextProps.min) {
        this.state.picker.setDate(nextProps.min, true);
      }
    }
    if(nextProps.max) {
      this.state.picker.setMaxDate(nextProps.max);
      if(this.state.picker.getDate() > nextProps.max) {
        this.state.picker.setDate(nextProps.max, true);
      }
    }
    else {
      this.state.picker.setMaxDate(null);
    }
  },
  shouldComponentUpdate: function() {
    return false;
  },
  componentWillMount: function() {
    this.initPicker(this.props);
  },
  componentDidMount: function() {
    this.initPicker(this.props);
  },
  componentWillUnmount: function() {
    this.state.picker.destroy();
  },
  initPicker: function(props) {
    var options = {
      field: React.findDOMNode(this.refs.datepicker),
      onSelect: props.onSelect
    };
    if (props.min) {
      options.minDate = props.min;
    }
    if (props.max) {
      options.maxDate = props.max;
    }
    var picker = new Pikaday(options);
    picker.setDate(props.value, true);
    this.setState({picker: picker});
  },
  render: function() {
    return (
       <input type="text" ref="datepicker" className="datepicker form-control"/>
    );
  },
  getValue: function() {
    return {
      value: this.state.picker.getDate()
    };
  }
});

module.exports = DateField;
