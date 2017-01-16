var React = require('react');
var classNames = require('classnames');
var i18n = require('../../tools/i18n');

var DismissableControl = React.createClass({
  displayName: 'DismissableControl',
  getDefaultProps: function() {
    return {
      active: false,
      className: '',
      baseClass: 'dismissable-control',
      hiddenClassName: 'hidden'
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if(!this.props.active && nextProps.active && nextProps.onShow) {
      nextProps.onShow();
    }
  },
  render: function() {
    var componentClassName = classNames(
      this.props.baseClass,
      this.props.className,
      {hidden: !this.props.active}
    );
    var headerAction = null;
    if (this.props.headerAction) {
      headerAction = this.props.headerAction;
    }
    var satellites = '';
    if (this.props.satellites) {
      var satellitesTmp = Object.keys(this.props.satellites).map(function(satellite, index) {
        return (<option key={'satellite' + index} value={satellite}>{satellite}</option>);
      });
      satellites = (
        <select onChange={this.props.onChangeSatellite} value={this.props.satelliteSelected}>
          <option value="default">{i18n.get('choose-captor')}</option>
          {satellitesTmp}
        </select>
      );
    }
    var stations = '';
    if (this.props.stations) {
      var stationsTmp = Object.keys(this.props.stations).map(function(station, index) {
        return (<option key={'station' + index} value={station}>{station}</option>);
      });
      stations = (
        <select onChange={this.props.onChangeStation} value={this.props.stationSelected}>
          <option value="default">{i18n.get('choose-station')}</option>
          {stationsTmp}
        </select>
      );
    }
    var loading = '';
    if (this.props.loading) {
      loading = (
        <div className={this.props.loading ? 'loading' : 'hidden'}>
          <div className="alert alert-loading alert-loading-min">
            <div className="loader"></div>
            {i18n.get('loading')}
          </div>
        </div>
      );
    }
    return (
      <div className={componentClassName}>
        <div className={this.props.baseClass + '-header'}>
          {this.props.title}
          <button type="button" className="close" onClick={this.props.onDismiss} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <div className="missions-plans--header-action">
            {satellites}
            {stations}
            {headerAction}
          </div>
        </div>
        <div className={componentClassName + '-content'}>
          {loading}
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = DismissableControl;
