var React = require('react');
var moment = require('moment');

var i18n = require('../../tools/i18n');
var AttemptSelector = require('./AttemptSelector');

var AcquisitionPeriodComplex = React.createClass({
  displayName: 'AcquisitionPeriodComplex',
  getInitialState: function() {
    return {
      attemptSelected: false,
      acquisitionPeriod: {
        start: null,
        end: null
      },
      showAttemptSelectorModal: false
    };
  },
  attemptSelected: function(acquisitionPeriod) {
    this.setState({
      attemptSelected: true,
      acquisitionPeriod: acquisitionPeriod
    });
  },
  getPeriod() {
    return this.state.acquisitionPeriod;
  },
  getValues() {
    return false;
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.props.incidenceAngle !== nextProps.incidenceAngle) {
      // a change in incidence angle means we have to reselect a period
      this.setState({
        attemptSelected: false,
        acquisitionPeriod: {
          start: null,
          end: null
        }
      });
    }
  },
  render: function() {
    var buttonDisabled = this.props.incidenceAngle === null || isNaN(this.props.incidenceAngle);

    var readOnlyPickers = '';
    if(this.state.attemptSelected) {
      var startDate = moment(this.state.acquisitionPeriod.start).format('YYYY-MM-DD HH:mm:ss');
      var endDate = moment(this.state.acquisitionPeriod.end).format('YYYY-MM-DD HH:mm:ss');
      readOnlyPickers = (
        <div className="col-md-12 nopaddingleft">
          <table className="table table-striped table-condensed ">
            <thead>
              <tr>
                <th>{i18n.get('attempt-period-start')}</th>
                <th>{i18n.get('attempt-period-end')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{startDate}</td>
                <td>{endDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <div className={this.props.inError ? 'col-md-12 has-error' : 'col-md-12'}>
        <label className="control-label" >{i18n.get('acquisition-period')}</label>
        {readOnlyPickers}
        <div className="col-md-12 nopaddingleft">
          <button type="button" className="margintopbtn btn" disabled={buttonDisabled} onClick={this.openAttemptSelectorModal}>{i18n.get('choose-attempt')}</button>
          <AttemptSelector show={this.state.showAttemptSelectorModal} onHide={this.closeAttemptSelectorModal} incidenceAngle={this.props.incidenceAngle} onSelectionChange={this.attemptSelected}/>
        </div>
      </div>
    );
  },
  openAttemptSelectorModal: function() {
    this.setState({showAttemptSelectorModal: true});
  },
  closeAttemptSelectorModal: function() {
    this.setState({showAttemptSelectorModal: false});
  }
});

module.exports = AcquisitionPeriodComplex;
