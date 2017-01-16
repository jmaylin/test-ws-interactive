var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Popover = require('react-bootstrap/lib/Popover');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var DrsConstants = require('../../constants/DrsConstants');
var i18n = require('../../tools/i18n');
var SearchStore = require('../../stores/SearchStore');
var SearchActions = require('../../actions/SearchActions');
var DeleteSearchModal = require('../modals/deleteSearchModal');

function getFrozenStatus(searchName, searchType) {
  var search = SearchStore.getSearch(searchName, searchType);
  if(search) {
    return search.frozen;
  }
  return false;
}

var SearchSettingForm = React.createClass({
  displayName: 'SearchSettingForm',
  getInitialState: function() {
    return {
      searchName: this.props.searchName,
      newName: this.props.searchType === DrsConstants.searchType.CUSTOM ? this.props.searchName : i18n.get(this.props.searchName),
      editing: false,
      frozen: getFrozenStatus(this.props.searchName, this.props.searchType),
      showDeleteModal: false,
      saveButton: true
    };
  },
  toggleFreeze: function() {
    var that = this;
    SearchActions.toggleFreeze(this.state.searchName, this.props.searchType, function() {
      that.setState({frozen: !that.state.frozen});
    });
  },
  startEditing: function() {
    this.setState({editing: true}, function() {
      var node = this.refs.title.getDOMNode();
      node.focus();
      node.select();
    });
  },
  cancelEditing: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.refs.warningMessage.hide();
    this.refs.warningMessageChangeName.hide();
    this.setState({
      editing: false,
      newName: this.state.searchName,
      saveButton: true
    });
  },
  editingStopped: function() {
    var that = this;
    SearchActions.rename(this.state.searchName, this.state.newName, function() {
      that.refs.warningMessage.hide();
      that.setState({
        editing: false,
        searchName: that.state.newName
      });
    });
  },
  handleChangeName: function(e) {
    var saveButton = true;
    if(e.target.value !== this.state.searchName && SearchStore.searchExists(e.target.value)) {
      this.refs.warningMessageChangeName.show();
      saveButton = false;
    }
    else {
      this.refs.warningMessageChangeName.hide();
      saveButton = true;
    }
    this.setState({
      newName: e.target.value,
      saveButton: saveButton
    });
  },
  render: function() {
    var titleClass = this.state.editing ? 'title editing' : 'title';
    var editable = this.props.searchType === DrsConstants.searchType.CUSTOM;
    var deletable = this.props.searchType === DrsConstants.searchType.CUSTOM;
    var freezeButtonText = this.state.frozen ? i18n.get('unfreeze-search') : i18n.get('freeze-search');
    var freezeButtonClass = this.state.frozen ? 'freeze-charge' : 'freeze-charge freeze';
    var saveButtonClass = this.state.saveButton ? 'validate-icon' : 'validate-icon hidden';
    return (
      <li className="search-edit-settings">
        <div className="title-edit-form">
          <div className='save-icon'>Save</div>
          <div className={titleClass}>
            <div className='static'>
              <span className='display-title'>{this.state.newName}</span>
              <button type="button" className={editable ? 'edit-icon' : 'hidden'} onClick={this.startEditing}>Rename</button>
            </div>
            <div className="form">
              <OverlayTrigger trigger='manual' ref="warningMessageChangeName" placement='bottom' overlay={<Popover >{i18n.get('save-same-name')}</Popover>}>
                <input className='edit-title' ref="title" onChange={this.handleChangeName} type='text' name='title-save-search' placeholder={this.state.newName} value={this.state.newName} />
              </OverlayTrigger>
              <div className="button-group">
                <button type="button" className={saveButtonClass} onClick={this.editingStopped}>Save</button>
                <button type="button" className='cancel-icon' onClick={this.cancelEditing}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className='left-buttons'>
          <OverlayTrigger ref="warningMessage" placement='bottom' overlay={<Tooltip >{i18n.get('freeze-tooltip')}</Tooltip>}>
            <button className={freezeButtonClass} onClick={this.toggleFreeze}>{freezeButtonText}</button>
          </OverlayTrigger>
          <button onClick={this.openDeleteModal} className={deletable ? 'delete-icon hidden' : 'hidden'}>Delete</button>
        </div>
        <DeleteSearchModal search={this.state.newName} show={this.state.showDeleteModal} onHide={this.closeDeleteModal}/>

      </li>
    );
  },
  openDeleteModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showDeleteModal: true});
  },
  closeDeleteModal: function() {
    this.setState({showDeleteModal: false});
  }
});

module.exports = SearchSettingForm;
