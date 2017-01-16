var React = require('react');
var map = require('../../mapOl');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var DrsConstants = require('../../constants/DrsConstants');
var progStatus = DrsConstants.progStatus;
var i18n = require('../../tools/i18n');
var Select2 = require('../utils/Select2');
var AccountStore = require('../../stores/AccountStore');
var SearchStore = require('../../stores/SearchStore');
var SearchActions = require('../../actions/SearchActions');
var CustomScrollbar = require('../../tools/customScrollbar');

var SearchControl = React.createClass({
  displayName: 'SearchControl',
  getInitialState: function() {
    var allMissionTypes = AccountStore.getAvailableMissionTypes();
    return {
      loading: false,
      advancedSearchOn: false,
      editing: false,
      icrs: '',
      status: [],
      program: '',
      name: '',
      availableMissionList: allMissionTypes,
      selectedMissionList: allMissionTypes,
      shapeDrawn: AccountStore.getDrawnShape() !== null,
      type: DrsConstants.searchType.UNSAVED,
      hideSearchClass: false,
      inputWidth: 270
    };
  },
  componentDidMount: function() {
    AccountStore.addChangeListener(this.shapeChange);
    SearchStore.addSearchEditListener(this.searchEdit);
    SearchStore.addUnsavedSearchStartListener(this.searchStarted);
    SearchStore.addUnsavedSearchStopListener(this.searchDone);

    CustomScrollbar.initScrollbar();
    document.addEventListener('scrollableContentUpdated', function () {
      CustomScrollbar.refreshScrollbar();
    }, false);

    window.setTimeout(this.initSizeSearchInput, 500);
  },
  componentWillUnmount: function() {
    AccountStore.removeChangeListener(this.shapeChange);
    SearchStore.removeSearchEditListener(this.searchEdit);
    SearchStore.removeUnsavedSearchStartListener(this.searchStarted);
    SearchStore.removeUnsavedSearchStopListener(this.searchDone);
  },
  componentDidUpdate: function() {
    window.setTimeout(CustomScrollbar.refreshScrollbar, 250);
    this.sizeSearchInput();
  },
  initSizeSearchInput: function() {
    this.state.inputWidth = $('.basic-search').width() - 213;
    this.forceUpdate();
  },
  sizeSearchInput: function() {
    this.state.inputWidth = $('.basic-search').width() - 213;
  },
  searchStarted: function() {
    // if (this.state.shapeDrawn) {
    //   AccountStore.showEditableShapeButton();
    //   var shape = AccountStore.getDrawnShape();
    //   shape.overlay.setMap(null);
    //   shape.overlay.editable = false;
    //   map.addAoi(shape.overlay, 'drawing', false);
    //   AccountStore.setDrawnShape(shape);
    // }
    AccountStore.showEditableShapeButton();
    this.setState({loading: true});
  },
  searchDone: function() {
    this.setState({loading: false});
  },
  shapeChange: function() {
    this.setState({shapeDrawn: AccountStore.getDrawnShape() !== null});
  },
  searchEdit: function(search) {
    this.setState({
      advancedSearchOn: true,
      editing: true,
      name: search.name,
      icrs: search.parameters.icr_list,
      selectedMissionList: search.parameters.mission,
      program: search.parameters.program,
      type: DrsConstants.searchType.CUSTOM,
      aoi: search.parameters.aoi,
      status: (!search.parameters.status) ? [] : search.parameters.status
    }, function() {
      window.setTimeout(CustomScrollbar.refreshScrollbar, 250);
    });
  },
  cancelEdition: function() {
    var allMissionTypes = AccountStore.getAvailableMissionTypes();
    this.setState({
      editing: false,
      icrs: '',
      status: [],
      program: '',
      name: '',
      availableMissionList: allMissionTypes,
      selectedMissionList: allMissionTypes,
      shapeDrawn: AccountStore.getDrawnShape() !== null,
      aoi: '',
      type: DrsConstants.searchType.UNSAVED
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var icrs = this.state.icrs;

    if(
      (this.state.icrs !== null && this.state.icrs !== '' ) ||
      (this.state.status.length !== 0 ) ||
      (this.state.program !== null && this.state.program !== '' ) ||
      this.state.shapeDrawn
      ) {
      var formData = {
        'icr_list': icrs,
        taskingStatus: this.state.status,
        program: this.state.program,
        mission: this.state.selectedMissionList,
        type: this.state.type
      };
      if(!this.state.editing) {
        var coordinates = [];
        var currentShape = AccountStore.getDrawnShape();
        if (currentShape) {
          coordinates = map.getCoordinates(currentShape);
        }

        var aoi = "";
        for (var i = 0; i < coordinates.length-1; i++) {
          aoi += " " + coordinates[i][1] + " " + coordinates[i][0];
        }

        formData.aoi = aoi;
        formData.name = DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH;
        SearchActions.newUnsavedSearch(formData);
      }
      else {
        SearchActions.updateSearch(this.state.name, formData);
      }
    }

    CustomScrollbar.scrollTo('top', {callbacks: false}, 'left');

  },
  toggleAdvancedSearch: function() {
    this.setState({advancedSearchOn: !this.state.advancedSearchOn});
  },
  handleChangeIcrs: function(e) {
    this.setState({icrs: e.target.value});
  },
  handleChangeProgram: function(e) {
    this.setState({program: e.target.value});
  },
  handleChangeStatus: function (e, selections) {
    this.setState({
      status: selections
    });
  },
  handleChangeMissionType: function () {
    var checkboxes = this.refs.missionCheckboxes.getDOMNode().querySelectorAll('input');
    var checked = [];
    for (var i = 0, length = checkboxes.length; i < length; i++) {
      if (checkboxes[i].checked) {
        checked.push(checkboxes[i].value);
      }
    }
    this.setState({
      selectedMissionList: checked
    });
    if (checked.length === 0) {
      this.setState({
        hideSearchClass: true
      });
    } else {
      this.setState({
        hideSearchClass: false
      });
    }
  },
  render: function() {
    var progStatusOptionsData = Object.keys(progStatus).map(function (key) {
      return {id: key, text: progStatus[key]};
    });

    var hasSearchParams = (this.state.icrs !== null && this.state.icrs !== '' ) || (this.state.status.length !== 0 ) || (this.state.program !== null && this.state.program !== '' );
    var searchBoutonTitle = i18n.get('search');
    if(!hasSearchParams) {
      searchBoutonTitle = i18n.get('refine-search');
    }
    var that = this;
    var missionCheckboxes = this.state.availableMissionList.map(function(index) {
      var missionLabel = index.replace('Astroterra', 'Spot 6/7');
      return (
        <label key={index} className="checkbox-container">
          <input
            type="checkbox"
            name="mission[]"
            ref={index}
            defaultChecked={true}
            value={index} onChange={that.handleChangeMissionType}/>
          {missionLabel}
        </label>
      );
    });

    var shapeMessage = '';
    var editingMessage = '';
    if(this.state.editing) {
      editingMessage = (
        <div className="control-group">
          <span className="search-edit-title">{i18n.getParam('currently-editing-search', this.state.name)}</span>
        </div>
      );
      shapeMessage = this.state.aoi ? i18n.get('edit-search-aoi') : '';
    }
    else {
      shapeMessage = this.state.shapeDrawn ? i18n.get('use-drawn-shape') : i18n.get('search-draw-help');
    }
    var searchBoutonText = this.state.editing ? i18n.get('update-and-search') : i18n.get('search');
    var submitClass = this.state.hideSearchClass ? 'disabled' : '';
    var missionTypeSelect = this.state.hideSearchClass ?
      (
        <div className="alert alert-warning">
          <p>{i18n.get('mission-type-select')}</p>
        </div>
      ) : '';
    var inputStyle = {
      width: this.state.inputWidth + 'px'
    };
    return (
      <form acceptCharset="utf-8" className="search-form" onSubmit={this.handleSubmit}>
        <div className="basic-search">
          <label htmlFor="icr-search">{i18n.get('search')}</label>
          <input type="text" style={inputStyle} name="icr-search" placeholder={i18n.get('icr-identifiers')} value={this.state.icrs} onChange={this.handleChangeIcrs}/>
          <OverlayTrigger placement='right' overlay={<Tooltip>{searchBoutonTitle}</Tooltip>}>
            <button type="submit" className={this.state.loading ? 'loading' : ''} disabled={submitClass}>{i18n.get('ok')}</button>
          </OverlayTrigger>
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('more-filters')}</Tooltip>}>
          <button type="button" className={this.state.advancedSearchOn ? 'js-expand-search opened' : 'js-expand-search'} onClick={this.toggleAdvancedSearch}>+</button>
          </OverlayTrigger>
        </div>
        <div className={this.state.advancedSearchOn ? 'advanced-search opened' : 'advanced-search'}>
          {editingMessage}
          <div className="control-group">
            <label htmlFor="program" className="form-label">{i18n.get('mission-type')}</label>
            <div className="input-container" ref="missionCheckboxes">
              {missionCheckboxes}
            </div>
            {missionTypeSelect}
          </div>
          <div className="control-group">
            <label htmlFor="tasking-status" className="form-label">{i18n.get('tasking-status')}</label>
            <div className="input-container select-container">
              <Select2
                  id="the-hidden-input-id"
                  dataSet={progStatusOptionsData}
                  onSelection={this.handleChangeStatus}
                  placeholder="Select some options"
                  multiple={true}
                  dropdownCssClass="search-status"
              />
            </div>
          </div>
          <div className="control-group">
            <label htmlFor="program" className="form-label">{i18n.get('program')}</label>
            <div className="input-container">
              <input type="text" className="control" name="program" placeholder="" ref="status" value={this.state.program} onChange={this.handleChangeProgram}/>
            </div>
          </div>
          <div className="control-group">
            {shapeMessage}
          </div>
          <div className="button-group">
            <OverlayTrigger placement='right' overlay={<Tooltip>{searchBoutonTitle}</Tooltip>}>
              <button type="submit" className={this.state.loading ? 'search loading' : 'search'} disabled={submitClass}>{searchBoutonText}</button>
            </OverlayTrigger>
            <button type="cancel" className={this.state.editing ? 'cancel-edition' : 'hidden'} onClick={this.cancelEdition}>{i18n.get('cancel-edition')}</button>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = SearchControl;
