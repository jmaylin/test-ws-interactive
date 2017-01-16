var React = require('react');
var Popover = require('react-bootstrap/lib/Popover');
var i18n = require('../../tools/i18n');
var Definition = require('../utils/definition');

var StripPopover = React.createClass({
  displayName: 'StripPopover',
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    this.props.onShow();
  },
  componentWillUnmount: function() {
    this.props.onHide();
  },

  render: function() {
    return (
        <Popover {...this.props} animation={false} className="stripPopover" bsStyle="primary" title={i18n.get('segment-informations')} >
          <ul>
            <Definition label={i18n.get('PsyXy')} value={this.props.PsyXy} />
            <Definition label={i18n.get('civProcSts')} value={this.props.civProcSts} />
            <Definition label={i18n.get('date')} value={this.props.date} />
            <Definition label={i18n.get('clearSkyRate')} value={this.props.clearSkyRate} />
          </ul>
        </Popover>
      );
  }
});

module.exports = StripPopover;
