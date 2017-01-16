var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');
var SearchStore = require('../../stores/SearchStore');
var moment = require('moment');

var LaunchDownloadModal = React.createClass({
  displayName: 'LaunchDownloadModal',
  getInitialState: function() {
    var searchName = this.props.search;
    if (this.props.search === 'default-slot-favorites') {
      searchName = i18n.get('default-slot-favorites');
    }
    return {
      searchName: searchName,
      downloadError: this.props.error,
      errorMessage: '',
      date: this.props.date
    };
  },
  componentDidMount: function() {
    //SearchStore.addDownloadListener(this.searchDownloaded);
  },
  componentWillUnmount: function() {
    //SearchStore.removeDownloadListener(this.searchDownloaded);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      downloadError: nextProps.error,
      date: nextProps.date
    });
    /*console.log(this.props.date);
    console.log(nextProps);*/
  },
  searchDownloaded: function(data) {
    if(!data.success) {
      this.setState({
        downloadError: true,
        errorMessage: i18n.get(data.message)
      });
    }
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.props.onHide();
    SearchStore.downloadKml(this.props.search, this.searchDownloaded);
  },
  render: function() {
    var errorMessage = this.state.downloadError ? (
      <div className="alert alert-danger">
        {this.state.errorMessage}
      </div>
    ) : '';
    return (
        <Modal {...this.props} className="modal-search" bsStyle="primary" animation={false}>
          <form className='form-horizontal download-search-form'>
            <div className="modal-header">
              <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
              <div className="modal-body">
              <h4 className="modal-search-title">{i18n.get('download-search')}</h4>
              <div className="control-group">
                <p>{i18n.get('download-search-confirmation')} <b>{this.state.searchName}</b> ?</p>
                <p><i>{i18n.get('download-search-date')} {moment(this.state.date, 'YYYYMMDD').format('YYYY-MM-DD')}</i></p>
              </div>
              {errorMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default btn-cancel" onClick={this.props.onHide}>{i18n.get('cancel')}</button>
              <button type="submit" className="btn btn-primary btn-submit btn-next" onClick={this.handleSubmit}>{i18n.get('download-search-button')}</button>
            </div>
          </form>
        </Modal>
      );
  }
});

module.exports = LaunchDownloadModal;
