var React = require('react');

var DateField = require('./dateField');
var i18n = require('../../tools/i18n');

var AcquisitionPeriodSimple = React.createClass({
  displayName: 'AcquisitionPeriodSimple',
  getInitialState: function() {
    return {
      startDate: this.props.start,
      startEndDate: this.props.startEnd,
      //startEndDate: this.props.start,
      endDate: this.props.end
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var maxEnd = new Date(nextProps.maxEnd);
    var startEndDate = new Date(this.state.startEndDate);
    if (startEndDate > maxEnd) {
      startEndDate = maxEnd;
    } else {
      startEndDate = new Date(this.state.startDate);
      startEndDate.setDate(startEndDate.getDate() + 1);
    }
    this.setState({startEndDate: startEndDate});
  },
  changeStartDate: function(newValue) {
    this.setState({startDate: newValue});
    var startEndDate = new Date(newValue);
    startEndDate.setDate(startEndDate.getDate() + 1);
    this.setState({startEndDate: startEndDate});
  },
  changeEndDate: function(newValue) {
    this.setState({endDate: newValue});
  },
  getPeriod() {
    return {
      start: this.refs.dateFieldStart.getValue().value,
      end: this.refs.dateFieldEnd.getValue().value
    };
  },
  getValues() {
    return {
      start: this.refs.dateFieldStart.getValue(),
      end: this.refs.dateFieldEnd.getValue()
    };
  },
  render: function() {
    return (
      <div className={this.props.inError ? 'form-group has-error col-md-12' : 'form-group col-md-12'}>
        <label className="col-md-12 control-label" >{i18n.get('acquisition-period')}</label>
        <div className="col-md-4">
          <DateField onSelect={this.changeStartDate} ref="dateFieldStart" key="start" value={this.state.startDate} type="start" min={new Date()} max={this.props.maxStart} />
        </div>
        <div className="col-md-4">
          <DateField onSelect={this.changeEndDate} ref="dateFieldEnd" key="end" value={this.state.endDate} type="end" min={this.state.startEndDate} max={this.props.maxEnd} />
        </div>
      </div>
    );
  }
});

module.exports = AcquisitionPeriodSimple;
