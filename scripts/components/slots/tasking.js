/*global applicationConfiguration*/

var React = require('react');
var Acquisition = require('./acquisition');
var OrderStore = require('../../stores/OrderStore');
var TaskingStore = require('../../stores/TaskingStore');
var TaskingActions = require('../../actions/TaskingActions');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Overlay = require('react-bootstrap/lib/Overlay');
var TaskingTooltipModal = require('../modals/TaskingTooltipModal');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var i18n = require('../../tools/i18n');
//var TaskingInfosPopover = require('../popovers/taskingInfosPopover');
var Aoi = require('../GeoData/Aoi');
var mapOl = require('../../mapOl');
var CustomScrollbar = require('../../tools/customScrollbar');
var Items = require('../utils/Items');
var Pictos = require('../utils/Pictos');
var timer = null;

function getTaskingInformations(taskingId) {
  return TaskingStore.getTaskingInformations(taskingId);
}

var Tasking = React.createClass({
  displayName: 'Tasking',
  getInitialState: function() {
    TaskingStore.setShowAoi(this.props.id, this.props.displayIcr);
    var tasking = getTaskingInformations(this.props.id);
    return {
      tasking: tasking,
      opened: true,
      acquisitionLoaded: false,
      acquisitionStatuses: {
        validated: false,
        proposed: false,
        rejected: false,
        refused: false,
        notAnalyzed: false
      },
      showTaskingTooltipModal: false,
      showAoi: this.props.displayIcr,
      icrCentered: false,
      displayStrip: false,
      toggleAllDatastrips: false,
      toggleAllStripsDisplayed: false,
      bookmark: this.props.bookmark,
      disableApply: false,
      infosBtnActif: false,
      highlightAoi: false,
      headerActive: false,
      orderDate: 'desc',
      orderCloud: null,
      feature: mapOl.aoiToFeature(tasking.aoi),
      page: 1,
      acquisitionIdentifiersList: [],
      menuTransparentAoiBool: false,
      datastripAoiValue: null
    };
  },
  componentDidMount: function() {
    TaskingStore.addUpdateListener(this.taskingUpdated);
    CustomScrollbar.refreshScrollbar();
    this.forceUpdate();
  },
  componentWillUnmount: function() {
    TaskingStore.removeUpdateListener(this.taskingUpdated);
  },
  componentDidUpdate: function() {
    CustomScrollbar.refreshScrollbar();
  },
  componentWillReceiveProps: function(nextProps) {
    TaskingStore.setShowAoi(this.props.id, nextProps.displayIcr);
    if (this.isMounted() && nextProps.id === this.props.id) {
      var tasking = getTaskingInformations(this.props.id);
      var newState = {
        tasking: tasking,
        showAoi: tasking.showAoi
      };
      this.setState(newState);
    }
    if (this.state.hideStrip === true) {
      this.toggleAllStrips();
    }
  },
  taskingUpdated: function(event) {
    if (this.isMounted() && event.taskingId === this.props.id) {
      var tasking = getTaskingInformations(this.props.id);
      var newState = {
        tasking: tasking,
        showAoi: tasking.showAoi,
      };
      if (event.eventType === 'acquisitionLoaded' ) {
        newState.acquisitionLoaded = true;
        newState.loading = false;
      }
      this.setState(newState);
    }
  },
  toggleBookmark: function(event) {
    event.preventDefault();
    event.stopPropagation();
    TaskingActions.toggleFavorite(this.props.id);
  },
  toggleAoi: function(event) {
    event.preventDefault();
    event.stopPropagation();
    TaskingStore.toggleShowAoi(this.props.id);
    this.setState({
      toggleAllDatastrips: false
    });
  },
  toggleAoiFromAoi: function() {
    TaskingStore.toggleShowAoi(this.props.id);
    this.setState({
      toggleAllDatastrips: false
    });
  },
  toggleCenterIcr: function(event) {
    event.preventDefault();
    event.stopPropagation();
    TaskingStore.setShowAoi(this.props.id, true);
    mapOl.setCenterWithFeature(this.state.feature)
  },
  headerClick: function() {
    this.setState({
      opened: !this.state.opened
    });
  },
  toggleFilters: function(acquisitionStatus) {
    var acquisitionStatuses = this.state.acquisitionStatuses;
    acquisitionStatuses[acquisitionStatus] = !acquisitionStatuses[acquisitionStatus];
    this.setState({
      acquisitionStatuses: acquisitionStatuses,
      disableApply: false
    });
  },
  applyFilters: function() {
    this.setState({
      loading: true,
      disableApply: true
    },
    function() {
      // on force le hide sur la tooltip du bouton "Apply filter"
      this.refs.overlayTriggerDelete.hide();
      TaskingActions.loadAcquisitions(this.props.id, this.state.acquisitionStatuses);
    });
  },
  toggleAllStrips: function() {
    this.setState({
      toggleAllDatastrips: !this.state.toggleAllStripsDisplayed,
      toggleAllStripsDisplayed: !this.state.toggleAllStripsDisplayed,
      displayStrip: !this.state.toggleAllStripsDisplayed,
      updateFromTasking: true
    });
  },
  endUpdateFromTasking: function() {
    this.setState({
      updateFromTasking: false
    });
  },
  showInfos: function() {
    this.setState({infosBtnActif: true});
  },
  hideInfos: function() {
    this.setState({infosBtnActif: false});
  },
  showHighlightAoi: function() {
    this.setState({highlightAoi: true});
  },
  hideHighlightAoi: function() {
    this.setState({highlightAoi: false});
  },
  taskingTooltipModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showTaskingTooltipModal: true});
  },
  openTaskingTooltipModalFromAoi: function() {
    this.setState({showTaskingTooltipModal: true});
  },
  closeTaskingTooltipModal: function() {
    this.setState({showTaskingTooltipModal: false});
  },
  toggleHighlightFromAoi: function() {
    this.setState({
      highlightAoi: !this.state.highlightAoi,
      headerActive: !this.state.headerActive
    });
  },
  toggleMenuTransparentAoi: function () {
    TaskingStore.toggleShowAoi(this.props.id, true);
    this.setState({
      toggleAllDatastrips: false,
      menuTransparentAoiBool: !this.state.menuTransparentAoiBool,
      datastripAoiValue: this.refs.transparentAoi.getOpacity()*100,
    });

    var that = this;
    clearTimeout(timer);
    setTimeout(function () {
      that.setState({
        menuTransparentAoiBool: false
      });
    }, 20000)
  },
  valueTransparenceAoi: function (_event) {
    this.refs.transparentAoi.setOpacity(_event.target.value);
    this.setState({
      datastripAoiValue: _event.target.value,
    })
    var that = this;
    clearTimeout(timer);
    setTimeout(function () {
      that.setState({
        menuTransparentAoiBool: false
      });
    }, 20000)
  },
  getDatastripAoiBtn: function () {
    return React.findDOMNode(this.refs.btnTransparenceAoi);
  },
  render: function() {
    OrderStore.setSourceIdsAllowedForProduction(this.state.tasking.orderId);
    var bookmarkTooltip = this.state.tasking.favorite ? i18n.get('remove-from-favorites') : i18n.get('add-to-favorites');
    var tooltipButtonClass = this.state.tasking.favorite ? 'favorite-toggle active' : 'favorite-toggle';
    var icrClass = this.state.opened ? 'icr opened' : 'icr';
    var icrContentClass = this.state.opened ? 'icr-content opened' : 'icr-content';
    var validatedToggleClass = this.state.acquisitionStatuses.validated ? 'validated active' : 'validated';
    var proposedToggleClass = this.state.acquisitionStatuses.proposed ? 'proposed active' : 'proposed';
    var rejectedToggleClass = this.state.acquisitionStatuses.rejected ? 'rejected active' : 'rejected';
    var refusedToggleClass = this.state.acquisitionStatuses.refused ? 'refused active' : 'refused';
    var notAnalyzedToggleClass = this.state.acquisitionStatuses.notAnalyzed ? 'notAnalyzed active' : 'notAnalyzed';
    var showAoiTooltip = this.state.showAoi ? i18n.get('tasking-hide-aoi') : i18n.get('tasking-show-aoi');
    var centerIcrTooltip = this.state.icrCentered ? i18n.get('tasking-center-map') : i18n.get('tasking-center-map');
    var moreInfoClass = this.state.infosBtnActif ? ' active' : '';

    var showIcrAoiButtonClass = this.state.feature ? this.state.showAoi ? 'icr-aoi active' : 'icr-aoi' : 'hidden';
    var centerIcrButtonClass = this.state.feature ? this.state.icrCentered ? 'center-map active' : 'center-map' : 'hidden';

    var toggleAllStripsButtonClass = this.state.tasking.acquisitionIdentifiersList.length ? this.state.toggleAllStripsDisplayed ? 'strip-all active' : 'strip-all' : 'hidden';

    var loader = this.state.loading ? (<div className="loader"></div>) : '';
    var acquisitionList = '';
    var noAcquisitionMessage = '';
    var loadMoreButton = '';
    var forceUpdateButton = '';
    var items = '';
    if(/*this.state.opened && */this.state.acquisitionLoaded) {
      if(this.state.tasking.acquisitionIdentifiersList.length) {
        acquisitionList = this.state.tasking.acquisitionIdentifiersList.map(function (acquisitionId) {
          return (
            <Acquisition
              key={acquisitionId}
              id={acquisitionId}
              taskingProcessSTS={this.state.tasking.process_sts}
              taskingStatus={this.state.tasking.status}
              taskingId={this.props.id}
              isVrs={this.state.tasking.isVrs}
              isDrs={this.state.tasking.isDrs}
              orderId={this.state.tasking.orderId}
              priority={this.state.tasking.product.priority}
              displayStrip={this.state.displayStrip}
              toggleAllDatastrips={this.state.toggleAllDatastrips}
              toggleAllStripsDisplayed={this.state.toggleAllStripsDisplayed}
              updateFromTasking={this.state.updateFromTasking}
              endUpdateFromTasking={this.endUpdateFromTasking} />
          );
        }, this);
        if (this.state.tasking.nbResults < this.state.tasking.totalResults) {
          loadMoreButton = (
            <OverlayTrigger placement='top' overlay={<Tooltip>{i18n.get('acquisitionsList-loadMore')}</Tooltip>}>
              <button type="button" className="btn-loadmore reverse" onClick={this.loadMore}>{i18n.get('acquisitionsList-loadMore')}</button>
            </OverlayTrigger>
          );
          if(this.state.loading) {
            loadMoreButton = (
              <div className="btn-loadmore loading reverse">{loader}{i18n.get('loading')}</div>
            );
          }
        }
        forceUpdateButton = (
          <OverlayTrigger placement='top' overlay={<Tooltip>{i18n.get('acquisitionsList-forceUpdate')}</Tooltip>}>
              <button type="button" className="btn-for-update reverse" onClick={this.forceUpdateFromWS}><Pictos size="2.5rem" icon="cached" styles={{fill: '#ffffff'}} />{i18n.get('taskingsList-forceUpdate')}</button>
          </OverlayTrigger>
        );
        if(this.state.loading) {
          forceUpdateButton = '';
        }
      }
      else {
        noAcquisitionMessage = (
          <div className='alert alert-warning'>
            <p>{i18n.get('no-acquisition')}</p>
          </div>
        );
      }
    }
    var icrHeaderActive = this.state.headerActive ? ' active' : '';
    var icrHeaderStyle = this.state.headerActive ? applicationConfiguration.listStyles.highlight.bgColor : 'transparent';
    var hideSortClass = this.state.tasking.acquisitionIdentifiersList.length ? '' : ' hidden';
    var orderDateAscClass = this.state.orderDate ? this.state.orderDate === 'asc' ? 'sort-asc active' : 'sort-asc' : 'sort-asc';
    var orderDateDescClass = this.state.orderDate ? this.state.orderDate === 'desc' ? 'sort-desc active' : 'sort-desc' : 'sort-desc';
    var orderCloudAscClass = this.state.orderCloud ? this.state.orderCloud === 'asc' ? 'sort-asc active' : 'sort-asc' : 'sort-asc';
    var orderCloudDescClass = this.state.orderCloud ? this.state.orderCloud === 'desc' ? 'sort-desc active' : 'sort-desc' : 'sort-desc';
    var footerClass = forceUpdateButton ? loadMoreButton ? 'icr-footer clearfix' : 'icr-footer active clearfix' : 'icr-footer active clearfix';
    return (
      <li className={icrClass} style={{display: this.props.display}}>
      <div id={'element-to-scroll-' + this.props.search + '-' + this.props.id} className={'icr-header' + icrHeaderActive} onClick={this.headerClick} style={{'backgroundColor': icrHeaderStyle}}>
        <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingStatus-' + this.state.tasking.process_sts)}</Tooltip>}>
          <span className={'status prog-status prog-status-' + this.state.tasking.status}></span>
        </OverlayTrigger>
        <span className="icr-name">{ this.props.id }</span>
        <div className="icr-controls">
          <div onClick={this.showModal} className="app-pie-wrapper" target={ this.props.id }>
          {loader}
          </div>
          <div className="app-pie" key='pie'></div>
          <OverlayTrigger placement='left' overlay={<Tooltip>{centerIcrTooltip}</Tooltip>}>
            <button className={centerIcrButtonClass} onClick={this.toggleCenterIcr}></button>
          </OverlayTrigger>
          <OverlayTrigger placement='left' overlay={<Tooltip>{showAoiTooltip}</Tooltip>} onMouseOver={this.showHighlightAoi} onMouseOut={this.hideHighlightAoi}>
            <button className={showIcrAoiButtonClass} ref='btnTransparenceAoi' onClick={this.toggleAoi} onDoubleClick={this.toggleMenuTransparentAoi} ></button>
          </OverlayTrigger>

           <Overlay container={this} show={this.state.menuTransparentAoiBool} target={this.getDatastripAoiBtn} placement='top'>
            <Tooltip className={'transparence'} >
              <button type="button" className={'close'} onClick={this.toggleMenuTransparentAoi} ><span>×</span></button>
              <div className={'transparence-title'}>{i18n.get('opacity')}</div>
              <span className={'transparence-span'}>0</span>
              <input type="range" value={this.state.datastripAoiValue} min={0} max={100} step={1} onChange={this.valueTransparenceAoi} />
              <span className={'transparence-span'}> 100%</span>
            </Tooltip>
          </Overlay>

          <OverlayTrigger placement='left' overlay={<Tooltip>{bookmarkTooltip}</Tooltip>}>
            <button className={tooltipButtonClass} onClick={this.toggleBookmark}>Favorite</button>
          </OverlayTrigger>
          {/*<OverlayTrigger placement='right' trigger='click' rootClose={true} overlay={<TaskingInfosPopover icr={this.props.id} onShow={this.showInfos} onHide={this.hideInfos} />}>
            <button className={'more-info' + moreInfoClass}>More info</button>
          </OverlayTrigger>*/}
          <button className={'more-info' + moreInfoClass} onClick={this.taskingTooltipModal}>More info</button>
          <TaskingTooltipModal
            show={this.state.showTaskingTooltipModal}
            onHide={this.closeTaskingTooltipModal}
            icr={this.props.id}>
            {i18n.get('search-will-be-deleted-warning')}
          </TaskingTooltipModal>
        </div>
      </div>
      <div className={icrContentClass}>
        <div className='filter-acquisition-bar'>

          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-Validated')}</Tooltip>}>
            <button type="button" className={'button ' + validatedToggleClass} disabled={this.state.loading} onClick={this.toggleFilters.bind(null, 'validated')}>1</button>
          </OverlayTrigger>
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-Proposed')}</Tooltip>}>
            <button type="button" className={'button ' + proposedToggleClass} disabled={this.state.loading} onClick={this.toggleFilters.bind(null, 'proposed')}>2</button>
          </OverlayTrigger>

          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-Rejected')}</Tooltip>}>
            <button type="button" className={'button ' + rejectedToggleClass} disabled={this.state.loading} onClick={this.toggleFilters.bind(null, 'rejected')}>3</button>
          </OverlayTrigger>

          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-Refused')}</Tooltip>}>
            <button type="button" className={'button ' + refusedToggleClass} disabled={this.state.loading} onClick={this.toggleFilters.bind(null, 'refused')}>4</button>
          </OverlayTrigger>

          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-Not_Analyzed')}</Tooltip>}>
            <button type="button" className={'button ' + notAnalyzedToggleClass} disabled={this.state.loading} onClick={this.toggleFilters.bind(null, 'notAnalyzed')}>5</button>
          </OverlayTrigger>

          <OverlayTrigger placement='right' ref="overlayTriggerDelete" overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-apply-tooltip')}</Tooltip>}>
            <button type="button" className={'btn-apply'} disabled={this.state.disableApply} onClick={this.applyFilters}>{i18n.get('taskingAcquisitionStatus-apply-button')}</button>
          </OverlayTrigger>

          <div className='filter-acquisition-bar-controls'>
            <span className={'acquisitions-sort sort-date' + hideSortClass}>
              <OverlayTrigger placement='right' overlay={<Tooltip>Date ASC</Tooltip>}>
                <button type="button" className={'button ' + orderDateAscClass} onClick={this.orderDate.bind(null, 'asc')}>1</button>
              </OverlayTrigger>
              <OverlayTrigger placement='right' overlay={<Tooltip>Date DESC</Tooltip>}>
                <button type="button" className={'button ' + orderDateDescClass} onClick={this.orderDate.bind(null, 'desc')}>2</button>
              </OverlayTrigger>
            </span>

            <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('datastrip-producted-aoi')}</Tooltip>}>
              <button type="button" onClick={this.toggleAllStrips} className={'button ' + toggleAllStripsButtonClass}>{i18n.get('datastrip-producted-aoi')}</button>
            </OverlayTrigger>

            <span className={'acquisitions-sort sort-cloud' + hideSortClass}>
              <OverlayTrigger placement='right' overlay={<Tooltip>Cloud ASC</Tooltip>}>
                <button type="button" className={'button ' + orderCloudAscClass} onClick={this.orderCloud.bind(null, 'asc')}>3</button>
              </OverlayTrigger>
              <OverlayTrigger placement='right' overlay={<Tooltip>Cloud DESC</Tooltip>}>
                <button type="button" className={'button ' + orderCloudDescClass} onClick={this.orderCloud.bind(null, 'desc')}>4</button>
              </OverlayTrigger>
            </span>
          </div>

          <Aoi
            key={'aoi'+this.props.id}
            ref='transparentAoi'
            showStrips={this.state.tasking.acquisitionIdentifiersList.length}
            toggleAllStrips={this.toggleAllStrips}
            toggleAoi={this.toggleAoiFromAoi}
            showInfos={this.openTaskingTooltipModalFromAoi}
            menu={'icr'}
            from={'aoi'}
            type={'tasking-'+this.state.tasking.status}
            visible={this.state.showAoi}
            feature={this.state.feature}
            highlight={this.state.highlightAoi}
            toggleHighlight={this.toggleHighlightFromAoi}
            scroll={this.props.search + '-' + this.props.id}
            openedAS={this.state.opened}
            openAS={this.headerClick}
            idForScroll='left'
          />
        </div>
        <ul className="acquisition-list">
          {acquisitionList}
        </ul>
        {noAcquisitionMessage}
        <div className={footerClass}>
          {forceUpdateButton}
          <Items visible={this.state.acquisitionLoaded} nbResults={this.state.tasking.nbResults} totalResults={this.state.tasking.totalResults} />
          {loadMoreButton}
        </div>
      </div>
    </li>
    );
  },
  updateAcquisitions: function(_date, _cloud) {
    this.setState({acquisition: TaskingStore.updateAcquisitions(this.props.id, _date, _cloud)});
  },
  orderDate: function(_order) {
    this.setState({
      orderDate: _order,
      orderCloud: null
    }, this.updateAcquisitions(_order, null));
  },
  orderCloud: function(_order) {
    this.setState({
      orderDate: null,
      orderCloud: _order
    }, this.updateAcquisitions(null, _order));
  },
  loadMore: function() {
    var page = this.state.page + 1;
    TaskingStore.loadAcquisitions(this.props.id, this.state.acquisitionStatuses, page);
    this.setState({
      loading: true,
      page: page
    });
  },
  forceUpdateFromWS: function() {
    var page = 1;
    TaskingStore.loadAcquisitions(this.props.id, this.state.acquisitionStatuses, page, true);
    this.setState({
      loading: true,
      page: page
    });
  }
});


module.exports = Tasking;
