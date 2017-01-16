var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');

var ParametersStore = require('../../stores/ParametersStore');
var SaveParametersModal = React.createClass({
  displayName: 'SaveParametersModal',
  getInitialState: function() {
    return {
      presetName: '',
      saveError: false
    };
  },
  componentWillMount: function() {
    ParametersStore.addSaveListener(this.onSave);
  },
  componentWillUnmount: function() {
    ParametersStore.removeSaveListener(this.onSave);
  },
  componentWillReceiveProps: function(nextProps) {
    var name = '';
    if (nextProps.saveType === 'update') {
      name = nextProps.presetName;
    }
    this.setState({presetName: name});
  },
  handleChange: function(e) {
    this.setState({presetName: e.target.value});
  },
  handleSubmit: function(event) {
    event.preventDefault();
    ParametersStore.save(this.state.presetName, this.props.type, this.props.currentConfiguration);
  },
  onSave: function(data) {
    this.props.onHide(ParametersStore.getPresetIndex(this.state.presetName, this.props.type));
    var newState = {
      presetName: '',
      saveError: false
    };
    if(!data.success) {
      newState.saveError = true;
    }
    this.setState(newState);
  },
  render: function() {
    var paramsExists = ParametersStore.paramsExists(this.state.presetName, this.props.type);
    var warningMessage = (paramsExists && this.props.saveType !== 'update') ? (
      <div className="alert alert-info">
        {i18n.get('save-parameters-same-name')}
      </div>
    ) : '';
    var errorMessage = this.state.saveError ? (
      <div className="alert alert-danger">
        {i18n.get('internal-error')}
      </div>
    ) : '';
    var inputName = '';
    var btnSubmit = '';
    if(this.props.saveType === 'save' || this.props.saveType === 'save-as') {
      inputName = <input type="text" className="control" name="presetName" placeholder="" ref="presetName" onChange={this.handleChange}/>;
      if (paramsExists) {
        btnSubmit = (
          <button type="submit" className="btn btn-primary btn-save-parameters btn-next" disabled>{i18n.get('save-set-parameters')}</button>
        );
      } else {
        btnSubmit = (
          <button type="submit" className="btn btn-primary btn-save-parameters btn-next">{i18n.get('save-set-parameters')}</button>
        );
      }
    } else {
      inputName = (
        <div>
          <input type="hidden" name="presetName" value={this.props.presetName}/>
          <span>{this.props.presetName}</span>
        </div>
      );
      btnSubmit = (
        <button type="submit" className="btn btn-primary btn-update-parameters btn-next">{i18n.get('update-set-parameters')}</button>
      );
    }
    return (

      <Modal {...this.props} className="modal-search save-parameters" bsStyle="primary" animation={false}>
        <form className='form-horizontal save-search-form' onSubmit={this.handleSubmit}>
          <div className="modal-header">
            <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h4 className="modal-search-title">{i18n.get('production-parameters-save-modal-title')}</h4>
            <div className="control-group">
              <label htmlFor="program" className="form-label">{i18n.get('production-parameters-preset-name')}</label>
              <div className="input-container">
                {inputName}
              </div>
            </div>
            {warningMessage}
            {errorMessage}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
            {btnSubmit}
           </div>
        </form>
      </Modal>
    );
  }
});

module.exports = SaveParametersModal;
