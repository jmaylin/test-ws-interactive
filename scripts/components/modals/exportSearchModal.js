var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var i18n = require('../../tools/i18n');
var ExportSearchForm = require('../forms/exportSearchForm');
var SearchStore = require('../../stores/SearchStore');

var ExportSearchModal = React.createClass({
  displayName: 'ExportSearchModal',
  getInitialState() {
    return {
      searchName: this.props.search
    };
  },
  componentDidMount: function() {
    SearchStore.addExportListener(this.searchExported);
  },
  componentWillUnmount: function() {
    SearchStore.removeExportListener(this.searchExported);
  },
  searchExported: function(data) {
    if(!data.success) {
      this.setState({exportError: true});
    }
  },
  render: function() {
    return (
      <Modal {...this.props} className="modal-search modal-export" bsStyle="primary" onHide={this.props.onHide}>
        <div className="modal-content" style={{minWidth: 500+'px'}}>
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide}><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="settings-modal-title">{i18n.get('export-search')}</h4>
          </div>
          <ExportSearchForm
            key={this.props.search}
            searchName={this.props.search}
            searchType={this.props.type}
            onHide={this.props.onHide}
            searchExported={this.props.searchExported}
            searchProcessing={this.props.searchProcessing} />
        </div>
      </Modal>
    );
  }
});

module.exports = ExportSearchModal;
