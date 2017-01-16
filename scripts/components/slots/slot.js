/* global applicationConfiguration */
var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var slug = require('slug');

var Tasking = require('./tasking');
var SearchStore = require('../../stores/SearchStore');
var SearchActions = require('../../actions/SearchActions');
var i18n = require('../../tools/i18n');
var DrsConstants = require('../../constants/DrsConstants');
var mapOl = require('../../mapOl');
var Aoi = require('../GeoData/Aoi');
var DeleteSearchModal = require('../modals/deleteSearchModal');
var ExportSearchModal = require('../modals/exportSearchModal');
var LaunchDownloadModal = require('../modals/launchDownloadModal');
var CustomScrollbar = require('../../tools/customScrollbar');
var Items = require('../utils/Items');
var Pictos = require('../utils/Pictos');

function getSearch(searchName, searchType) {
  return SearchStore.getSearch(searchName, searchType);
}

var Slot = React.createClass({
  displayName: 'Slot',
  getInitialState: function() {
    var refresh = applicationConfiguration.export.refresh * 1000;
    var interval = false;
    if (this.props.exportProcessing) {
      interval = setInterval(this.getProcessingExport, refresh);
    }
    return {
      showDeleteModal: false,
      displayIcrs: false,
      displaySearchAoi: false,
      centerSearch: false,
      highlightAoi: false,
      showExportModal: false,
      searchExported: this.props.export,
      searchProcessing: this.props.exportProcessing,
      launchDownload: false,
      interval: interval,
      downloadError: false,
      exportDate: this.props.exportDate,
      showAoi: false,
      highlight: false,
      page: 1,
      taskingIdentifiersList: [],
      loading: false,
      loaded: false
     };
  },
  componentDidMount: function() {
    this.setState(getSearch(this.props.name, this.props.type), function() {
      SearchStore.addChangeListener(this.searchChange, this.props.name);
    });
    CustomScrollbar.refreshScrollbar();
  },
  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this.searchChange);
  },
  componentDidUpdate: function() {
    document.activeElement.blur();
    CustomScrollbar.refreshScrollbar();
  },
  getProcessingExport: function() {
    SearchStore.getSearchFromDatabase(this.props.name, this.testProcessing);
  },
  testProcessing: function(search) {
    if (!search.exportProcessing) {
      clearInterval(this.state.interval);
      this.searchExported();
    }
  },
  searchChange: function(searchName) {
    if (this.props.name == searchName) {
      var search = getSearch(this.props.name, this.props.type);
      if(search) {
        search.loading = false;
        search.loaded = true;
        this.setState(search);
      } else {
        this.setState({
          loading: false,
          loaded: true
        });
      }
    }
  },
  showHighlightAoi: function() {
    this.setState({highlightAoi: true});
  },
  hideHighlightAoi: function() {
    this.setState({highlightAoi: false});
  },
  toggleHighlight: function() {
    return true;
  },
  headerClick: function() {
    if(!this.state.loaded) {
      this.setState({
        opened: !this.state.opened,
        loading: true
      },
      function() {
        SearchActions.loadSearch(this.props.name, this.props.type);
      });
    }
    else {
      this.setState({
        opened: !this.state.opened
      });
    }
  },
  allAoiHandler: function() {
    if(!this.state.loaded) {
      this.setState({
        loading: true
      },
      function() {
        SearchActions.loadSearch(this.props.name, this.props.type);
      });
    }
  },
  editSearch: function(event){
    event.preventDefault();
    event.stopPropagation();
    SearchActions.editSearch(this.props.name);
  },
  deleteButtonClicked: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },
  toggleDisplayIcrs: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.state.displayIcrs = !this.state.displayIcrs;
    this.allAoiHandler();
    this.forceUpdate();
  },
  toggleSearchCenter: function(event) {
    event.preventDefault();
    event.stopPropagation();
    //this.state.centerSearch = !this.state.centerSearch;
    this.forceUpdate();
    this.state.displaySearchAoi = true;
    mapOl.setCenterWithFeature(this.state.feature);
  },
  exportSearch: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showExportModal: true});
  },
  closeExportModal: function() {
    this.setState({showExportModal: false});
  },
  searchProcessing: function() {
    this.setState({
      searchExported: false,
      searchProcessing: true
    });
  },
  searchExported: function() {
    SearchStore.getSearchFromDatabase(this.props.name, this.searchExportedCallback);
    this.setState({
      searchExported: true,
      searchProcessing: false,
      launchDownload: true,
      showExportModal: false
    });
  },
  searchExportedCallback: function(search) {
    this.setState({
      exportDate: search.exportParameters.date
    });
  },
  downloadSearch: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({launchDownload: true});
  },
  render: function() {

    var deletable = this.props.type !== DrsConstants.searchType.DEFAULT;
    var isFavorite = this.props.type === DrsConstants.searchType.DEFAULT && this.props.name === 'default-slot-favorites';
    var slotId = isFavorite ? 'favorites' : slug(this.props.name);
    var slotContentClass = this.state.opened ? 'slot-content opened' : 'slot-content';
    var slotMainClass = this.state.opened ? 'slot opened' : 'slot';
    var loader = this.state.loading ? (<div className="loader"></div>) : '';
    var slotName = this.props.type.toUpperCase() === DrsConstants.searchType.CUSTOM ? this.props.name : i18n.get(this.props.name);
    var errorMessage = '';
    if(this.state.loaded && !this.state.success) {
      errorMessage = (<div className="loading-error">
            {this.state.message}
          </div>);
    }
    var exportSearch = (
      <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('export-search')}</Tooltip>}>
        <button type="button" className={'export-search'} onClick={this.exportSearch}>{i18n.get('export-search-button')}</button>
      </OverlayTrigger>
    );
    if (this.state.searchProcessing) {
      exportSearch = (
        <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('loading-export')}</Tooltip>}>
          <div className="export-loader-container">
            <div className="export-search-loader"></div>
            <div className="loader"></div>
          </div>
        </OverlayTrigger>
      );
    }
    var downloadSearch = '';
    if (this.state.searchExported) {
      downloadSearch = (
        <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('download-search')}</Tooltip>}>
          <button type="button" className={'download-search'} onClick={this.downloadSearch}>{i18n.get('download-search-button')}</button>
        </OverlayTrigger>
      );
    }
    var centerButton = '';
    if(this.state.feature) {
      centerButton = (
        <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('center-search-map')}</Tooltip>}>
          <button type="button" className={this.state.centerSearch? 'center-search active': 'center-search'} onClick={this.toggleSearchCenter}>{i18n.get('center-search-button')}</button>
        </OverlayTrigger>
      );
    }
    var searchAoiButton = '';
    if(this.state.feature) {
      searchAoiButton = (
        <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('show-search-aoi')}</Tooltip>} onMouseOver={this.showHighlightAoi} onMouseOut={this.hideHighlightAoi}>
          <button type="button" className={this.state.displaySearchAoi? 'show-search-aoi active': 'show-search-aoi'} onClick={this.toggleDisplaySearchAoi}>{i18n.get('show-search-aoi-button')}</button>
        </OverlayTrigger>
      );
    }
    var showAllAoiButton = '';
    //if(this.props.type !== DrsConstants.searchType.DEFAULT) {
      showAllAoiButton = (
        <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('show-all-aois')}</Tooltip>}>
          <button type="button" className={this.state.displayIcrs? 'show-all-aoi active': 'show-all-aoi'} onClick={this.toggleDisplayIcrs}>{i18n.get('show-all-aoi-button')}</button>
        </OverlayTrigger>
      );
    //}
    var forceUpdateButton = '';
    if (this.state.loaded && this.state.opened && !isFavorite) {
      forceUpdateButton = (
        <OverlayTrigger placement='top' overlay={<Tooltip>{i18n.get('taskingsList-forceUpdate')}</Tooltip>}>
          <button type="button" className="btn-for-update" onClick={this.forceUpdateFromWS}><Pictos size="2.5rem" icon="cached"/>{i18n.get('taskingsList-forceUpdate')}</button>
        </OverlayTrigger>
      );
      if(this.state.loading) {
        forceUpdateButton = '';
      }
    }
    var forceUpdateButtonPicto = '';
    if (this.state.loaded && this.state.opened && !isFavorite) {
      forceUpdateButtonPicto = (
        <OverlayTrigger placement='top' overlay={<Tooltip>{i18n.get('taskingsList-forceUpdate')}</Tooltip>}>
          <button type="button" className="btn-force-update" onClick={this.forceUpdateFromWS}><Pictos size="2.5rem" icon="cached"/></button>
        </OverlayTrigger>
      );
      if(this.state.loading) {
        forceUpdateButtonPicto = '';
      }
    }
    var loadMoreButton = '';
    if (this.state.loaded && this.state.nbResults < this.state.totalResults) {
      loadMoreButton = (
        <OverlayTrigger placement='top' overlay={<Tooltip>{i18n.get('taskingsList-loadMore')}</Tooltip>}>
          <button type="button" className="btn-loadmore" onClick={this.loadMore}>{i18n.get('taskingsList-loadMore')}</button>
        </OverlayTrigger>
      );
      if(this.state.loading) {
        loadMoreButton = (
          <div className="btn-loadmore loading">{loader}{i18n.get('loading')}</div>
        );
      }
    }
    var icrList = [];
    for (var i = 0; i < this.state.taskingIdentifiersList.length; i++) {
      var icr = this.state.taskingIdentifiersParams[this.state.taskingIdentifiersList[i]];
      icrList.push(<Tasking key={i} id={icr.name} search={this.props.name} displayIcr={this.state.displayIcrs} bookmark={isFavorite} display={icr.display} />);
    };
    return (
      <div className={slotMainClass} id={slotId}>
        <div className="slot-header" onClick={this.headerClick}>
          <span className="slot-name">{ slotName }</span>
          <div className="slot-controls">
            <div className="app-pie-wrapper" target={ this.props.name }>
              {loader}
            </div>
            <div className="app-pie" id={ 'pie-' + this.props.name }></div>
            {forceUpdateButtonPicto}
            {exportSearch}
            {downloadSearch}
            {centerButton}
            {searchAoiButton}
            {showAllAoiButton}
            <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('delete-search-button')}</Tooltip>}>
              <button type="button" onClick={this.openDeleteModal} className={deletable ? 'delete-search' : 'hidden'}>{i18n.get('delete-search-button')}</button>
            </OverlayTrigger>
          </div>
        </div>
        <div className={slotContentClass}>
          {errorMessage}
          <ul className="icr-list">
            {icrList}
          </ul>
          <div className={this.state.loaded && this.state.opened && !this.state.isFavorite ? 'btn-toolbar' : 'hidden'}>
            {forceUpdateButton}
            <Items visible={this.state.loaded && this.state.opened && !this.state.isFavorite} nbResults={this.state.nbResults} totalResults={this.state.totalResults} />
            {loadMoreButton}
          </div>
        </div>
        <DeleteSearchModal search={this.props.name} show={this.state.showDeleteModal} onHide={this.closeDeleteModal}/>
        <ExportSearchModal
          search={this.props.name}
          type={this.props.type}
          show={this.state.showExportModal}
          onHide={this.closeExportModal}
          exportSearch={this.exportSearch}
          searchExported={this.searchExported}
          searchProcessing={this.searchProcessing}/>
        <LaunchDownloadModal search={this.props.name} show={this.state.launchDownload} onHide={this.closeDownloadModal} date={this.state.exportDate} error={this.state.downloadError}/>
        <Aoi
          key={'aoi'+this.props.id}
          id={'aoi'+this.props.id}
          type={'search'}
          visible={this.state.displaySearchAoi}
          feature={this.state.feature}
          highlight={this.state.highlightAoi}
          scroll={this.props.id}
          idForScroll='left'
          toggleHighlight={this.toggleHighlight}
        />
      </div>
    );
  },
  toggleDisplaySearchAoi: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({displaySearchAoi: !this.state.displaySearchAoi});
  },
  openDeleteModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showDeleteModal: true});
  },
  closeDeleteModal: function() {
    this.setState({showDeleteModal: false});
  },
  closeDownloadModal: function() {
    this.setState({
      launchDownload: false,
      downloadError: false
    });
  },
  loadMore: function() {
    var page = this.state.page + 1;
    SearchStore.loadSearch(this.props.name, this.props.type, page);
    this.setState({
      loading: true,
      page: page
    });
  },
  forceUpdateFromWS: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var page = 1;
    SearchStore.loadSearch(this.props.name, this.props.type, page, true);
    this.setState({
      loading: true,
      page: page
    });
  }
});

module.exports = Slot;
