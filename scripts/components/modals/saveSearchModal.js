var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');
var SearchActions = require('../../actions/SearchActions');
var SearchStore = require('../../stores/SearchStore');

var SaveSearchModal = React.createClass({
  displayName: 'SaveSearchModal',
  getInitialState: function() {
    return {
      searchName: '',
      saveError: false,
      loading: false
    };
  },
  componentDidMount: function() {
    SearchStore.addSaveListener(this.searchSaved);
  },
  componentWillUnmount: function() {
    SearchStore.removeSaveListener(this.searchSaved);
  },
  searchSaved: function(data) {
    this.setState({loading: false});
    if(!data.success) {
      this.setState({saveError: true});
    }
  },
  handleChange: function(e) {
    this.setState({searchName: e.target.value});
  },
  handleSubmit: function(event) {
    this.setState({loading: true});
    event.preventDefault();
    if( (this.state.icrs !== null && this.state.icrs !== '' ) || (this.state.status.length !== 0 ) || (this.state.program !== null && this.state.program !== '' )) {
      var formData = {
        searchName: this.state.searchName
      };
      this.setState({searchName: ''});
      SearchActions.saveCurrentSearch(formData);
    }
  },
  getLoadingMessage: function() {
    var loadingMessage = '';
    if(this.state.loading) {
      loadingMessage = (
        <div className="alert alert-info alert-loading">
          {i18n.get('loading')}
          <div className="loader"></div>
        </div>
      );
    }
    return loadingMessage;
  },
  onHide: function() {
    this.setState({searchName: ''});
    this.props.onHide();
  },
  render: function() {
    var warningMessage = SearchStore.searchExists(this.state.searchName) ? (
      <div className="alert alert-info">
        {i18n.get('save-same-name')}
      </div>
    ) : '';
    var errorMessage = this.state.saveError ? (
      <div className="alert alert-danger">
        {i18n.get('internal-error')}
      </div>
    ) : '';
    var loadingMessage = this.getLoadingMessage();
    return (
      <Modal {...this.props} className="modal-search" bsStyle="primary" animation={false} onHide={this.onHide}>
        <form className='form-horizontal save-search-form' onSubmit={this.handleSubmit}>
          <div className="modal-header">
            <button type="button" className="close" onClick={this.onHide} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h4 className="modal-search-title">{i18n.get('save-new-search')}</h4>
            <div className="control-group">
              <label htmlFor="program" className="form-label">{i18n.get('search-name')}</label>
              <div className="input-container">
                <input type="text" className="control" name="searchName" placeholder="" ref="searchName" onChange={this.handleChange}/>
              </div>
            </div>
            {loadingMessage}
            {warningMessage}
            {errorMessage}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default btn-cancel" onClick={this.onHide}>{i18n.get('cancel')}</button>
            <button type="submit" className="btn btn-primary btn-submit btn-next" disabled={this.state.searchName === ''}>{i18n.get('save')}</button>
          </div>
        </form>
      </Modal>
    );
  }
});

module.exports = SaveSearchModal;
