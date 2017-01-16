var React = require('react');
var Popover = require('react-bootstrap/lib/Popover');
var i18n = require('../../tools/i18n');
var Definition = require('../utils/definition');

var AcquisitionInfosPopover = React.createClass({
  displayName: 'AcquisitionInfosPopover',
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
    var popooverTitle = this.props.acquisitionId + ' - ' + i18n.get('taskingAcquisitionStatus-' + this.props.civProcSts);
    return (
        <Popover {...this.props} animation={false} className="acquisitionInfosPopover" bsStyle="primary" title={popooverTitle} >
          <ul>
            <Definition label={i18n.get('stereoMethod')} value={this.props.stereoMethod} />
            <Definition label={i18n.get('missionType')} value={this.props.missionType} />
            <Definition label={i18n.get('missionIndex')} value={this.props.missionIndex} />
          </ul>
        </Popover>
      );
  }
});

module.exports = AcquisitionInfosPopover;
