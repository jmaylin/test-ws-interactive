/* global applicationConfiguration */
var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var assign = require('object-assign');

var Tasking = require('./slots/tasking');
var SaveSearchModal = require('./modals/saveSearchModal');
var i18n = require('../tools/i18n');

var SearchStore = require('../stores/SearchStore');
var SearchActions = require('../actions/SearchActions');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var DrsConstants = require('../constants/DrsConstants');
var Items = require('./utils/Items');

function getCurrentSearchResults() {
  return SearchStore.getCurrentSearchResults();
}

var ResultManager = React.createClass({
  displayName: 'ResultManager',
  getInitialState: function() {
    var initialState = {
      showSaveModal: false,
      displayIcrs: false,
      page: 1,
      taskingIdentifiersList: [],
      loading: false,
      ran: false
    };
    return assign(initialState, getCurrentSearchResults());
  },
  componentDidMount: function() {
    SearchStore.addChangeListener(this._onChange);
    SearchStore.addSaveListener(this.searchSaved);
    SearchStore.addUnsavedSearchStartListener(this.searchStarted);
    SearchStore.addUnsavedSearchStopListener(this.searchDone);
  },
  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this._onChange);
    SearchStore.removeSaveListener(this.searchSaved);
    SearchStore.removeUnsavedSearchStartListener(this.searchStarted);
    SearchStore.removeUnsavedSearchStopListener(this.searchDone);
  },
  searchStarted: function() {
    this.setState({
      loading: true,
      ran: false,
      page: 1
    });
  },
  searchDone: function() {
    this.setState({
      loading: false
    });
  },
  searchSaved: function(data) {
    if(data.success) {
      this.setState({showSaveModal: false});
    }
  },
  _onChange: function(searchName) {
    if (searchName == DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH) {
      var search = getCurrentSearchResults();
      if(search) {
        search.loading = false;
        this.setState(search);
      } else {
        this.setState({
          loading: false
        });
      }
    }
  },
  toggleResults: function(){

  },
  deleteCurrentSearchResult: function() {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.DELETE_UNSAVED
    });
  },
  allAoiHandler: function() {
    if(!this.state.ran) {
      this.setState({
        loading: true
      },
      function() {
        SearchActions.loadSearch(DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH, DrsConstants.searchType.DEFAULT);
      });
    }
  },
  toggleDisplayIcrs: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({toggleAllIcrs: true});
    this.state.displayIcrs = !this.state.displayIcrs;
    this.forceUpdate();
  },
  render: function() {
    /*var taskingListItems = '';
    if(this.state.ran && !this.state.loading) {
      console.log(this.state.taskingIdentifiersList.length, this.state.taskingIdentifiersList)
      taskingListItems = this.state.taskingIdentifiersList.map(function (icr, index) {
        icr = this.state.taskingIdentifiersParams[icr];
       return (
         <Tasking key={index} id={icr.name} displayIcr={this.state.displayIcrs} toggleAllIcrs={this.state.toggleAllIcrs} bookmark={false} display={icr.display}/>
       );
      }, this);
    }*/
    var icrList = [];
    for (var i = 0; i < this.state.taskingIdentifiersList.length; i++) {
      var icr = this.state.taskingIdentifiersParams[this.state.taskingIdentifiersList[i]];
      icrList.push(<Tasking key={i} id={icr.name} displayIcr={this.state.displayIcrs} bookmark={false} display={icr.display} />);
    }
    var message = '';
    var showAllAoiButton = (
      <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('show-all-aois')}</Tooltip>}>
        <button type="button" className={this.state.displayIcrs? 'show-all-aoi active': 'show-all-aoi'} onClick={this.toggleDisplayIcrs}>{i18n.get('show-all-aoi-button')}</button>
      </OverlayTrigger>
    );
    if(this.state.message) {
      message = (
        <div className={this.state.success ? 'alert alert-info' : 'alert alert-danger'}>{this.state.message}</div>
      );
    }
    var loadMoreButton = '';
    if (this.state.ran) {
      if (this.state.nbResults < this.state.totalResults) {
        loadMoreButton = (
          <OverlayTrigger placement='top' overlay={<Tooltip>{i18n.get('taskingsList-loadMore')}</Tooltip>}>
            <button type="button" className="btn-loadmore loadmore-in-search" onClick={this.loadMore}>{i18n.get('taskingsList-loadMore')}</button>
          </OverlayTrigger>
        );
      }
    }
    return (
      <div>
        <div className={/*this.state.loading ? 'hidden' : */this.state.ran ? '' : 'hidden'}>
          {message}
          <div className="result-header" onClick={this.toggleResults}>
            <Items visible={!this.state.loading} nbResults={this.state.nbResults} totalResults={this.state.totalResults} />
            <button className="remove-results" onClick={this.deleteCurrentSearchResult}>{i18n.get('remove')}</button>
            <button className="save-results" onClick={this.openSaveModal}>{i18n.get('save')}</button>
            {showAllAoiButton}
          </div>
          <ul className="icr-list result-content" id="search-results">
            {icrList}
          </ul>
          <div className={this.state.loading ? 'hidden' : 'clearfix'}>
            {loadMoreButton}
          </div>
          <SaveSearchModal show={this.state.showSaveModal} onHide={this.closeSaveModal}/>
        </div>
        <div className={this.state.loading ? 'result-loading' : 'hidden'}>
          <div className="alert alert-loading alert-loading-min">
            <div className="loader"></div>
            {i18n.get('loading')}
          </div>
        </div>
      </div>
    );
  },
  openSaveModal: function() {
    this.setState({showSaveModal: true});
  },
  closeSaveModal: function() {
    this.setState({showSaveModal: false});
  },
  loadMore: function() {
    var page = this.state.page + 1;
    SearchStore.loadSearch(DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH, DrsConstants.searchType.DEFAULT, page);
    this.setState({
      loading: true,
      page: page
    });
  }
});

module.exports = ResultManager;

