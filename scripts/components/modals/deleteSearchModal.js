var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');
var SearchActions = require('../../actions/SearchActions');
var SearchStore = require('../../stores/SearchStore');

var DeleteSearchModal = React.createClass({
  displayName: 'DeleteSearchModal',
  getInitialState: function() {
    return {
      searchName: this.props.search,
      deleteError: false
    };
  },
  componentDidMount: function() {
    SearchStore.addDeleteListener(this.searchDeleted);
  },
  componentWillUnmount: function() {
    SearchStore.removeDeleteListener(this.searchDeleted);
  },
  searchDeleted: function(data) {
    /*if(!data.success) {
      this.setState({deleteError: true});
    }*/
  },
  handleSubmit: function(event) {
    event.preventDefault();
    SearchActions.deleteSearch(this.props.search);
  },
  render: function() {
    var errorMessage = this.state.deleteError ? (
      <div className="alert alert-danger">
        {i18n.get('internal-error')}
      </div>
    ) : '';
    return (
        <Modal {...this.props} className="modal-search" bsStyle="primary" animation={false}>
          <form className='form-horizontal delete-search-form' onSubmit={this.handleSubmit}>
            <div className="modal-header">
              <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
              <div className="modal-body">
              <h4 className="modal-search-title">{i18n.get('delete-search')}</h4>
              <div className="control-group">
                {i18n.get('delete-search-confirmation')} <b>{this.props.search}</b> ?
              </div>
              {errorMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
              <button type="submit" className="btn btn-primary btn-submit btn-next">{i18n.get('delete-search-button')}</button>
            </div>
          </form>
        </Modal>
      );
  }
});

module.exports = DeleteSearchModal;
