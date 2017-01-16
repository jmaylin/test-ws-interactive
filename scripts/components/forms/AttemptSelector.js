var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var moment = require('moment');

var i18n = require('../../tools/i18n');
var SubmitTaskingStore = require('../../stores/SubmitTaskingStore');

var AttemptSelector = React.createClass({
  displayName: 'AttemptSelector',
  getInitialState: function() {
    return {
      selectedIndex: null,
      attempts: [],
      error: null,
      loading: true
    };
  },
  componentDidMount: function() {
    SubmitTaskingStore.addChangeAttemptsListener(this.updateAttempts);
  },
  componentWillUnmount: function() {
    SubmitTaskingStore.removeChangeAttemptsListener(this.updateAttempts);
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.props.incidenceAngle !== nextProps.incidenceAngle) {
      // a change in incidence angle means we have to reselect a period
      this.setState({
        selectedIndex: null,
        attempts: [],
        error: null,
        loading: true
      }, this.getProgCapacity(nextProps));
    } else {
      this.getProgCapacity(nextProps);
    }
  },
  getProgCapacity: function(_props) {
    if (_props.show) {
      SubmitTaskingStore.getProgCapacity(_props.incidenceAngle);
    }
  },
  updateAttempts: function() {
    var newState = {
      error: SubmitTaskingStore.getProgCapacityError(),
      attempts: SubmitTaskingStore.getAttempts(),
      isModalOpen: SubmitTaskingStore.getAttempts().length >= 0,
      loading: false
    };
    this.setState(newState);
  },
  rowClicked: function(index) {
    this.setState({selectedIndex: index});
  },
  radioClicked: function() {
    // do nothing, the rowClicked will handle it
  },
  validateChoice: function() {
    if(!this.state.error) {
      var acquisitionPeriod = {
        start: moment(this.state.attempts[this.state.selectedIndex].period.start).toDate(),
        end: moment(this.state.attempts[this.state.selectedIndex].period.end).toDate()
      };
      this.props.onSelectionChange(acquisitionPeriod);
    }
    this.props.onHide();
  },
  render: function() {
    var attempts = this.state.attempts.map(function(attempt, index) {
      var boundClick = this.rowClicked.bind(this, index);
      var checked = this.state.selectedIndex === index;
      return (
          <tr key={index} onClick={boundClick}>
            <td><input type="radio" name="attemptRadio" value={index} checked={checked} onChange={this.radioClicked}/></td>
            <td>{attempt.instrumentName}</td>
            <td>{attempt.incidenceMin}</td>
            <td>{attempt.incidence}</td>
            <td>{moment(attempt.deadline).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>{moment(attempt.period.start).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>{moment(attempt.period.end).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
        );
    }, this);

    var errorMessage = '';
    if(this.state.error !== null) {
      errorMessage = (<div className="alert alert-danger">
        {this.state.error}
      </div>);
    }

    var loadingMessage = '';
    var tableClass = 'table table-striped table-hover table-condensed';
    if(this.state.loading) {
      loadingMessage = this.getLoadingMessage();
    }

    var attemptsTable = '';
    if(this.state.attempts.length) {
      attemptsTable = (
        <table className={tableClass}>
          <thead>
            <tr>
              <th>#</th>
              <th>{i18n.get('attempt-instrument-name')}</th>
              <th>{i18n.get('attempt-incidence-min')}</th>
              <th>{i18n.get('attempt-incidence-max')}</th>
              <th>{i18n.get('attempt-deadline')}</th>
              <th>{i18n.get('attempt-period-start')}</th>
              <th>{i18n.get('attempt-period-end')}</th>
            </tr>
          </thead>
          {attempts}
        </table>
      );
    }
    else {
      if(!this.state.loading) {
        attemptsTable = (
          <div className="alert alert-info">
        {i18n.get('no-available-attempt')}
      </div>
          );
      }
    }

    return (
       <Modal {...this.props} className="modal-attempt-selector" bsStyle="primary" animation={false} enforceFocus={false}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.onHide} aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 className="modal-title" id="modal-attempt-selector">{i18n.get('choose-attempt')}</h4>
        </div>
        <div className="modal-body">
          {loadingMessage}
          {errorMessage}
          {attemptsTable}
          <div className="modal-footer">
            <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
            <button type="submit" className="btn btn-primary btn-submit" onClick={this.validateChoice}>{i18n.get('ok')}</button>
          </div>
        </div>
      </Modal>
    );
  },
  getLoadingMessage: function() {
    var loadingMessage = (
      <div className="alert alert-loading">
        <div className="loader"></div>
        {i18n.get('loading')}
      </div>
    );
    return loadingMessage;
  }
});

module.exports = AttemptSelector;
