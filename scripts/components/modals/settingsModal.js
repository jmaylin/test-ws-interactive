var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var TabbedArea = require('react-bootstrap/lib/TabbedArea');
var TabPane = require('react-bootstrap/lib/TabPane');
var i18n = require('../../tools/i18n');
var SearchSettingForm = require('./searchSettingForm');
var SearchStore = require('../../stores/SearchStore');

function getSearches() {
  return SearchStore.getAll();
}

var SettingsModal = React.createClass({
  displayName: 'SettingsModal',
  getInitialState() {
    return {
      searches: getSearches()
    };
  },
  componentDidMount: function() {
    SearchStore.addSaveListener(this.searchSaved);
  },
  componentWillUnmount: function() {
    SearchStore.removeSaveListener(this.searchSaved);
  },
  searchSaved: function(data) {
    if(!data.success) {
      this.setState({saveError: true});
    }
  },
  handleChange: function(e) {
    this.setState({searchName: e.target.value});
  },
  handleTabChange(key) {
    this.setState({activeTab: key});
  },
  render: function() {
    var defaultSearchEditsForms = this.state.searches.defaults.map(function(search){
      return (
        <SearchSettingForm key={search.name} searchName={search.name} searchType={search.type} />
      );
    });
    var customSearchEditsForms = this.state.searches.custom.map(function(search){
      return (
        <SearchSettingForm key={search.name} searchName={search.name} searchType={search.type} />
      );
    });
    return (
      <Modal {...this.props} className="modal-search modal-settings" bsStyle="primary">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide}><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="settings-modal-title">{i18n.get('settings')}</h4>
          </div>
          <div className="modal-body">
              <TabbedArea animation={false}>
                <TabPane eventKey={1} tab={i18n.get('settings-search')}>
                  <ul className="saved-search">
                    {defaultSearchEditsForms}
                    {customSearchEditsForms}
                  </ul>
                </TabPane>
              </TabbedArea>
          </div>
          <div className="modal-footer">
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = SettingsModal;
