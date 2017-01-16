var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Definition = require('../utils/definition');
var i18n = require('../../tools/i18n');

var StripTooltipModal = React.createClass({
  displayName: 'StripTooltipModal',
  getInitialState: function() {
    return null;
  },
  render: function() {
    var modalTitle = i18n.get('segment-informations');
    return (
      <Modal {...this.props} className="modal-tooltip" bsStyle="primary" animation={true} onHide={this.props.onHide}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h2><span className="hightlight">{modalTitle}</span></h2>
          <span>{this.props.imageInfos.properties['http://adm.i3.com/ont/scene#name']}</span>
        </div>
        <div className="modal-body">
            <div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-detailled-informations')}</h4></div>
              <ul>
                <Definition label={i18n.get('PsyXy')} value={this.props.PsyXy} />
                <Definition label={i18n.get('civProcSts')} value={this.props.civProcSts} />
                <Definition label={i18n.get('export-bubble-datastrip-satellite')} value={this.props.imageInfos.properties['http://adm.i3.com/ont/remoteSensing#vehicle']} />
                <Definition label={i18n.get('date')} value={this.props.date} />
                <Definition label={i18n.get('clearSkyRate')} value={this.props.clearSkyRate} />
                <Definition label={i18n.get('export-bubble-datastrip-incidence-angle')} value={this.props.imageInfos.properties['http://adm.i3.com/ont/scene#incidenceAngle'] + '°'} />
                <Definition label={i18n.get('export-bubble-datastrip-cloud-cover')} value={this.props.imageInfos.properties['http://adm.i3.com/ont/scene#cloudCover'] + '%'} />
                <Definition label={i18n.get('export-bubble-datastrip-sun-azimut')} value={this.props.imageInfos.properties['http://adm.i3.com/ont/remoteSensing#sunAzimuth'] + '°'} />
                <Definition label={i18n.get('export-bubble-datastrip-sun-elevation')} value={this.props.imageInfos.properties['http://adm.i3.com/ont/remoteSensing#sunElevation'] + '°'} />
              </ul>
            </div>
        </div>
        <div className="modal-footer">

        </div>
      </Modal>
    );
  }
});

module.exports = StripTooltipModal;
