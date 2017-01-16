/* global applicationConfiguration */
/* global applicationLanguage */
var React = require('react');
var AcquisitionStore = require('../../stores/AcquisitionStore');
var AccountStore = require('../../stores/AccountStore');
var OrderStore = require('../../stores/OrderStore');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var SubmitProductionModal = require('../modals/submitProductionModal');
var AcquisitionValidationModal = require('../modals/AcquisitionValidationModal');
//var AcquisitionInfosPopover = require('../popovers/acquisitionInfosPopover');
var i18n = require('../../tools/i18n');
var DRSConstants = require('../../constants/DrsConstants');
var Strip = require('./strip');
var CustomScrollbar = require('../../tools/customScrollbar');
var AcquisitionTooltipModal = require('../modals/AcquisitionTooltipModal');

var moment = require('moment');
moment.locale(applicationLanguage);

function getAcquisitionInformations(acquisitionId) {
  return AcquisitionStore.getAcquisitionInformations(acquisitionId);
}

var Acquisition = React.createClass({
  displayName: 'Acquisition',
  getInitialState: function() {
    return {
      acquisition: getAcquisitionInformations(this.props.id),
      opened: false,
      loaded: false,
      showSubmitProductionModal: false,
      showAcquisitionValidationModal: false,
      displayStrip: this.props.displayStrip,
      toggleAllDatastrips: this.props.toggleAllDatastrips,
      productionSubmitted: false,
      infosBtnActif: false,
      showAcquisitionTooltipModal: false,
      toggleAllASDatastrips: this.props.toggleAllASDatastrips,
      toggleAllStripsDisplayed: this.props.toggleAllStripsDisplayed,
      cropQL: false,
      datastripLoaded: false
    };
  },
  componentDidMount: function() {
    AcquisitionStore.addUpdateListener(this.acquisitionUpdated);
    CustomScrollbar.refreshScrollbar();
  },
  componentWillUnmount: function() {
    AcquisitionStore.removeUpdateListener(this.acquisitionUpdated);
  },
  componentDidUpdate: function() {
    CustomScrollbar.refreshScrollbar();
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.updateFromTasking) {
      this.setState({
        toggleAllASDatastrips: nextProps.toggleAllDatastrips,
        displayStrip: nextProps.toggleAllDatastrips,
        updateFromAcquisition: true
      });
      this.props.endUpdateFromTasking();
    }
  },
  acquisitionUpdated: function(event) {
    if (this.isMounted() && event.acquisitionId === this.props.id) {
      this.setState({acquisition: getAcquisitionInformations(this.props.id)});
    }
  },
  handleHeaderClick: function() {
    this.setState({
      opened: !this.state.opened,
      cropQL: !this.state.cropQL
    });
  },
  /*canSubmitProduction: function() {
    // a user can submit a production request if :
    // The tasking was made by a VRS
    // The tasking is of type Standard or priority (dedicated and urgent are produced automatically)
    // There are catalog segments on the acquisition
    // the user is autorized
    // and the acquisition is validated
    return this.props.isVrs
      && (this.props.priority === 'Standard' || this.props.priority === 'Priority')
      && this.state.acquisition.catalogStrips.length
      && AccountStore.userCanSubmitProduction()
      && OrderStore.catalogStripsAreValid(this.state.acquisition.catalogStrips.map(function (catalogStrip) {
        return catalogStrip.id;
      }))
      && this.state.acquisition.civProcSts === DRSConstants.acquisitionStatus.VALIDATED;
  },*/
  canSubmitProduction: function() {
    // Pour qu’un DataStrip puisse être produit à posteriori, il faut que :
    // l’utilisateur ait le droit de produire -> [-OK-]
    // l’ICR ait un N° de commande (élément ORDER_ID non vide) -> [-OK-]
    // le Statut de l’ICR soit ACTIVE_FULL ou ACTIVE_PROD (cette liste de Statut sera gérée en fichier de configuration) -> [-OK-]
    // le Statut du DataStrip soit Validated (cette liste [oui, pourra être une liste]de Statut sera géré en fichier de configuration) -> [-OK-]
    // l’identifiant des segments Catalogues (DS_xxx) ne soit pas dans une ligne de commande en réponse au getOrderDetails -> [-OK-]
    return !this.state.productionSubmitted
      && AccountStore.userCanSubmitProduction()
      && this.props.orderId !== ''
      && (applicationConfiguration.canSubmitProduction.allowedICRStatus.indexOf(this.props.taskingProcessSTS) !== -1)
      && (applicationConfiguration.canSubmitProduction.allowedDatastripStatus.indexOf(this.state.acquisition.civProcSts) !== -1)
      && !OrderStore.catalogStripsAreValid(this.state.acquisition.catalogStripsIdentifiers);
  },
  canValidateProposition: function() {
    return this.state.acquisition.civProcSts === DRSConstants.acquisitionStatus.PROPOSED;
  },
  showInfos: function() {
    this.setState({infosBtnActif: true});
  },
  hideInfos: function() {
    this.setState({infosBtnActif: false});
  },
  prevent: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },
  acquisitionTooltipModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showAcquisitionTooltipModal: true});
  },
  closeAcquisitionTooltipModal: function() {
    this.setState({showAcquisitionTooltipModal: false});
  },
  toggleAllASStrips: function(event) {
    if ((this.state.toggleAllASDatastrips && !this.state.opened) || this.state.opened) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({
      toggleAllASDatastrips: !this.state.toggleAllASDatastrips,
      displayStrip: !this.state.displayStrip,
      updateFromAcquisition: true
    });
  },
  endUpdateFromAcquisition: function() {
    this.setState({
      updateFromAcquisition: false
    });
  },
  showHighlightAllAoi: function() {
    this.setState({highlightAllAoi: true});
  },
  hideHighlightAllAoi: function() {
    this.setState({highlightAllAoi: false});
  },
  forceCrop: function() {
    this.setState({datastripLoaded: true});
  },
  render: function() {
    var acquisitionContentClass = this.state.opened ? 'acquisition-content opened' : 'acquisition-content';
    var cloudCoverage = this.state.acquisition.catalogStrips.length ? Math.round(100 - this.state.acquisition.catalogStrips[0].clearSkyRate) + '%' : '';
    var acquisitionDate = this.state.acquisition.catalogStrips.length ? moment(this.state.acquisition.catalogStrips[0].date).format('YYYY-MM-DD') : '';
    var acquisitionMainClass = this.state.opened ? 'acquisition opened' : 'acquisition';
    var segmentList = this.state.acquisition.catalogStrips.map(function (catalogStrip, index) {
      catalogStrip.civProcSts = '';
      if (this.state.opened) {
        var stripStatusTemp = OrderStore.getStripStatus(catalogStrip.id);
        catalogStrip.civProcSts = (stripStatusTemp || stripStatusTemp === 0) ? i18n.getDictionnary('itemCommercialStatus-' + stripStatusTemp) : '';
      }
      var reference = 'datastrip-' + index;
      return (
        <Strip
          key={catalogStrip.id}
          id={catalogStrip.id}
          ref={reference}
          acquisitionId={this.props.id}
          orderId={this.props.orderId}
          PsyXy={catalogStrip.PsyXy}
          civProcSts={this.state.acquisition.civProcSts}
          status={catalogStrip.civProcSts}
          date={catalogStrip.date}
          clearSkyRate={catalogStrip.clearSkyRate}
          aoi={catalogStrip.aoi}
          displayStrip={catalogStrip.aoiDisplayed}
          toggleAllDatastrips={this.state.toggleAllDatastrips}
          toggleAllASDatastrips={this.state.toggleAllASDatastrips}
          canSubmitProduction={this.canSubmitProduction()}
          openSubmitProductionModal={this.openSubmitProductionModalFromAoi}
          canValidateProposition={this.canValidateProposition()}
          openAcquisitionValidationModal={this.openAcquisitionValidationModalFromAoi}
          shadowAllASDatastrips={this.shadowAllASDatastrips}
          updateFromAcquisition={this.state.updateFromAcquisition}
          endUpdateFromAcquisition={this.endUpdateFromAcquisition}
          highlightAllAoi={this.state.highlightAllAoi}
          opened={this.state.opened}
          handleHeaderClick={this.handleHeaderClick}
          cropQL={this.state.cropQL}
          forceCrop={this.forceCrop}
          datastripLoaded={this.state.datastripLoaded}
          />
      );
    }, this);
    var possibleActions = '';
    if(this.canSubmitProduction()) {
      possibleActions = (
        <OverlayTrigger placement='left' ref="overlayTriggerSubmit" overlay={<Tooltip>{i18n.get('submit-production')}</Tooltip>}>
          <button type="button" className='prog-action submit-production' onClick={this.openSubmitProductionModal}>{i18n.get('submit-production')}</button>
        </OverlayTrigger>
      );
    }
    var validationParameters = this.getValidationParameters();
    if(this.canValidateProposition()) {
      possibleActions = (
        <OverlayTrigger placement='left' ref="overlayTriggerSubmit" overlay={<Tooltip>{i18n.get('accept-reject-proposition')}</Tooltip>}>
          <button type="button" className='prog-action proposed' onClick={this.openAcquisitionValidationModal}>{i18n.get('accept-reject-proposition')}</button>
        </OverlayTrigger>
      );
    }
    var status = this.state.acquisition.civProcSts.replace('Not analyzed', 'Not_Analyzed');
    var moreInfoClass = this.state.infosBtnActif ? ' active' : '';
    var toggleAllASStripsButtonClass = this.state.toggleAllASDatastrips ? 'strip-all active' : 'strip-all';
   return (
      <li className={acquisitionMainClass}>
        <div className="acquisition-header" onClick={this.handleHeaderClick}>
          <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('taskingAcquisitionStatus-' + status)}</Tooltip>}>
            <span className={'status acquisition-status-' + this.state.acquisition.status}></span>
          </OverlayTrigger>
          <span className="acquisition-name">{this.props.id}</span>
          <div className="acquisition-controls">

            <span className="acquisition-date">{acquisitionDate}<div className="date-info"></div></span>

            <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('acquisition-center-map')}</Tooltip>}>
              <button onClick={this.toggleCenterAcquisition} className='center-map'></button>
            </OverlayTrigger>
            <OverlayTrigger placement='right' overlay={<Tooltip>{i18n.get('datastrip-producted-aoi')}</Tooltip>} onMouseOver={this.showHighlightAllAoi} onMouseOut={this.hideHighlightAllAoi}>
              <button type="button" onClick={this.toggleAllASStrips} className={'button ' + toggleAllASStripsButtonClass}></button>
            </OverlayTrigger>

            <span className="cloud-coverage">{cloudCoverage}<div className="cloud-info"></div></span>

            {possibleActions}
            {/*<OverlayTrigger placement='right' trigger='click' rootClose={true} overlay={
              <AcquisitionInfosPopover acquisitionId={this.props.id} civProcSts={this.state.acquisition.civProcSts} stereoMethod={this.state.acquisition.stereoMethod} missionType={this.state.acquisition.missionType} missionIndex={this.state.acquisition.missionIndex} onShow={this.showInfos} onHide={this.hideInfos}
              />}>
              <button type="button" className={'more-info' + moreInfoClass} onClick={this.prevent}>More info</button>
            </OverlayTrigger>*/}
            <button type="button" className={'more-info' + moreInfoClass} onClick={this.acquisitionTooltipModal} >More info</button>
            <AcquisitionTooltipModal
              show={this.state.showAcquisitionTooltipModal}
              onHide={this.closeAcquisitionTooltipModal}
              acquisitionId={this.props.id} civProcSts={this.state.acquisition.civProcSts}
              stereoMethod={this.state.acquisition.stereoMethod}
              missionType={this.state.acquisition.missionType}
              missionIndex={this.state.acquisition.missionIndex}>
              {i18n.get('search-will-be-deleted-warning')}
            </AcquisitionTooltipModal>
          </div>
        </div>
        <div className={acquisitionContentClass}>
          <ul className="segment-list">
            {segmentList}
          </ul>
        </div>
        <SubmitProductionModal show={this.state.showSubmitProductionModal} elementId={this.props.id} orderId={this.props.orderId} taskingId={this.props.taskingId} progType={this.props.priority} onHide={this.closeSubmitProductionModal}/>
        <AcquisitionValidationModal show={this.state.showAcquisitionValidationModal} onHide={this.closeAcquisitionValidationModal} validationParameters={validationParameters} />
      </li>
    );
  },
  openSubmitProductionModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showSubmitProductionModal: true});
  },
  openSubmitProductionModalFromAoi: function() {
    this.setState({showSubmitProductionModal: true});
  },
  closeSubmitProductionModal: function(result) {
    this.setState({showSubmitProductionModal: false}, function() {
      // on force le hide sur la tooltip du bouton submit
      this.refs.overlayTriggerSubmit.hide();
    });
    if (result === true) {
      this.setState({productionSubmitted: true});
    }
  },
  openAcquisitionValidationModal: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showAcquisitionValidationModal: true});
  },
  openAcquisitionValidationModalFromAoi: function() {
    this.setState({showAcquisitionValidationModal: true});
  },
  closeAcquisitionValidationModal: function() {
    this.setState({showAcquisitionValidationModal: false}, function() {
      // on force le hide sur la tooltip du bouton submit
      this.refs.overlayTriggerSubmit.hide();
    });
  },
  getValidationParameters: function() {
    return {
      acquisitionId: this.props.id,
      icr: this.props.taskingId,
      datastripId: this.getFirstDatastripId(),
      action: null
    };
  },
  getFirstDatastripId: function() {
    return this.state.acquisition.catalogStrips[0].id;
  },
  toggleCenterAcquisition: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.refs['datastrip-0'].centerAoi(event);
  }
});

module.exports = Acquisition;
