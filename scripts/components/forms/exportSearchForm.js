var React = require('react');
var i18n = require('../../tools/i18n');
var SearchStore = require('../../stores/SearchStore');

var ExportSearchForm = React.createClass({
  displayName: 'ExportSearchForm',
  getInitialState: function() {
    var searchName = this.props.searchName;
    if (this.props.searchName === 'default-slot-favorites') {
      searchName = i18n.get('default-slot-favorites');
    }
    return {
      acquisitionStatuses: [
        {name: 'validated', selected: true, key: 'Validated'},
        {name: 'proposed', selected: false, key: 'Proposed'},
        {name: 'rejected', selected: false, key: 'Rejected'},
        {name: 'refused', selected: false, key: 'Refused'},
        {name: 'notAnalyzed', selected: false, key: 'Not_Analyzed'}
      ],
      validateAll: false,
      catalogInfos: true,
      exportLoading: false,
      searchName: searchName
    };
  },
  handleExportSearch: function() {
    this.setState({exportLoading: true});
    this.props.searchProcessing();
    SearchStore.exportSearch(this.props.searchName, this.state.acquisitionStatuses, this.state.catalogInfos, this.searchExported);
  },
  searchExported: function() {
    this.props.searchExported();
  },
  handleChangeStatus: function(event) {
    var newState = {
      acquisitionStatuses: this.state.acquisitionStatuses,
      validateAll: this.state.validateAll
    };
    newState.acquisitionStatuses[event.target.value].selected = event.target.checked;
    if (!event.target.checked) {
      newState.validateAll = event.target.checked;
    }
    this.setState(newState);
  },
  handleChangeAll: function(event) {
    var status = this.state.acquisitionStatuses;
    status.map(function(value, key) {
      status[key].selected = event.target.checked;
    });
    this.setState({
      acquisitionStatuses: status,
      validateAll: event.target.checked
    });
  },
  handleChangeCatalog: function(event) {
    var exportInfos = false;
    if (event.target.value === 'true') {
      exportInfos = true;
    }
    this.setState({catalogInfos: exportInfos});
  },
  render: function() {
    var that = this;
    var statusCheckboxes = this.state.acquisitionStatuses.map(function(value, key) {
      return (
        <div className="checkbox-inline">
          <label key={key} className="checkbox-container">
            <input
              type="checkbox"
              name="status[]"
              ref={key}
              checked={value.selected}
              value={key} onChange={that.handleChangeStatus}/> {i18n.getDictionnary('taskingAcquisitionStatus-' + value.key)}
          </label>
        </div>
      );
    });
    var statusChoises = (
      <div>
        {i18n.get('export-select-status')}
        <p>
          <label>
            <input
              type="checkbox"
              name="validate-all"
              checked={this.state.validateAll}
              onChange={this.handleChangeAll}/> {i18n.get('select-all')}
          </label>
        </p>
        <p>{statusCheckboxes}</p>
      </div>
    );
    var catalogChoise = (
      <div>
        {i18n.get('catalog-infos')}
        <div className="checkbox-inline">
          <label>
            {i18n.get('yes')} <input type="radio" name="catalog" value={true} checked={this.state.catalogInfos} onChange={this.handleChangeCatalog}/>
          </label>
        </div>
        <div className="checkbox-inline">
          <label>
            {i18n.get('no')} <input type="radio" name="catalog" value={false} onChange={this.handleChangeCatalog}/>
          </label>
        </div>
      </div>
    );
    var message = '';
    var actions = (
      <div className="button-group">
        <button type="button" className='btn btn-default btn-cancel' onClick={this.props.onHide}>Cancel</button>
        <button type="button" className='btn btn-primary btn-submit btn-next' onClick={this.handleExportSearch}>Export</button>
      </div>
    );
    if (this.state.exportLoading) {
      statusChoises = '';
      catalogChoise = '';
      message = (
        <div className="alert alert-info alert-loading">
          <div className="loader"></div>
          {i18n.get('loading-export')}
        </div>
      );
      actions = (
        <div className="button-group">
          <button type="button" className='btn btn-primary btn-submit btn-next' onClick={this.props.onHide}>Fermer</button>
        </div>
      );
    }
    return (
      <div>
        <div className="modal-body">
          <div className="title-edit-form">
            <div className='static'>
              <span className='display-title'><h3>{ i18n.get('search-name')} : {this.state.searchName}</h3></span>
            </div>
            <div className="form">
              {statusChoises}
              {catalogChoise}
              {message}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {actions}
        </div>
      </div>
    );
  }
});

module.exports = ExportSearchForm;
