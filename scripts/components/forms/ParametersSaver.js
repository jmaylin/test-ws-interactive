var React = require('react');
var i18n = require('../../tools/i18n');

var ParametersSaver = React.createClass({
  displayName: 'ParametersSaver',
  render: function() {
    var saveClass = this.props.saveVisible ? '' : ' hidden';
    var updateClass = this.props.updateVisible ? '' : ' hidden';
    var updateBtn = '';
    if (this.props.enableUpdate) {
      updateBtn = <button type="button" className="btn-modify" onClick={this.props.openSaveModal.bind(null, 'update')}>{i18n.get('update-set-parameters')}</button>;
    } else {
      updateBtn = <button type="button" disabled className="btn-modify" onClick={this.props.openSaveModal.bind(null, 'update')}>{i18n.get('update-set-parameters')}</button>;
    }
    return (
      <div>
        <div className={'save-set-parameters' + saveClass}>
          <button type="button" className="btn-save" onClick={this.props.openSaveModal.bind(null, 'save')}>{i18n.get('save-set-parameters')}</button>
        </div>
        <div className={'save-set-parameters' + updateClass}>
          <button type="button" className="btn-update" onClick={this.props.openSaveModal.bind(null, 'save-as')}>{i18n.get('save-as-set-parameters')}</button>
          <span className='save-set-parameters--or'>or</span>
          {updateBtn}
        </div>
      </div>
    );
  }

});

module.exports = ParametersSaver;
