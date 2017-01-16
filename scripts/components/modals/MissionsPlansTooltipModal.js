var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');

var MissionsPlansTooltipModal = React.createClass({
  displayName: 'MissionsPlansTooltipModal',
  render: function() {
    var modalTitle = this.props.informations.ICR;
    var subcontent = '';
    var subcontentTmp = '';
    var subArray = [];
    var content = Object.keys(this.props.informations).map(function (key) {
      if (typeof this.props.informations[key] === 'object') {
        var sub = Object.keys(this.props.informations[key]).map(function (cle) {
          if (key === 'Downloading') {
            var dl = Object.keys(this.props.informations[key][0]).map(function (index) {
              var value = this.props.informations[key][0][index];
              if (value === 1000000) {
                value = 'NC';
              }
              return (
                <li key={index}><b>{index} :</b> {value}</li>
              );
            }, this);
            return dl;
          }
          return (
            <li key={cle}><b>{cle} :</b> {this.props.informations[key][cle]}</li>
          );
        }, this);
        subcontentTmp = (
          <div className="modal-body--dumping">
            <div className="underligne"><h4 className="subtitle">{key}</h4></div>
            <ul>
              {sub}
            </ul>
          </div>
        );
        subArray.push(subcontentTmp);
        return null;
      }
      return (
        <li key={key}><b>{key} :</b> {this.props.informations[key]}</li>
      );
    }, this);
    if (subArray.length > 0) {
      subcontent = subArray.map(function (val) {
        return val;
      });
    }
    return (
      <Modal {...this.props} className="modal-tooltip missions-plans" bsStyle="primary" animation={true} onHide={this.props.onHide}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h2><span className="hightlight">{i18n.get('modal-tooltip-taskingId')} : </span>{modalTitle}</h2>
        </div>
        <div className="modal-body">
          <div className="modal-body--dumping">
            <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-detailled-informations')}</h4></div>
            <ul>
              {content}
            </ul>
          </div>
          {subcontent}
        </div>
        <div className="modal-footer"></div>
      </Modal>
    );
  }
});

module.exports = MissionsPlansTooltipModal;
