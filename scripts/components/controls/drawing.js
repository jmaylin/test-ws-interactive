var React = require('react');
var map = require('../../mapOl');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var AccountStore = require('../../stores/AccountStore');
var SearchStore = require('../../stores/SearchStore');
var i18n = require('../../tools/i18n');
var SubmitTaskingModal = require('../modals/submitTaskingModal');
var ConfirmationModal = require('../modals/ConfirmationModal');
var ShapeUploader = require('../utils/ShapeUploader');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var DrsConstants = require('../../constants/DrsConstants');

var polygonTemp = null;

var drawingControl = React.createClass({
  displayName: 'drawingControl',
  getInitialState: function() {
    return {
      rectangle: false,
      polygon: false,
      drawing: false,
      shape: null,
      showSubmitTaskingModal: false,
      showSearchDeleteConfirmationModal: false,
      shapeEditable: false,
      shapeEditActive: false,
      compute: false
    };
  },
  componentDidMount: function() {
    AccountStore.addShapeListener(this.showShapeEditableButton);
  },
  showShapeEditableButton: function() {
    map.removeModifingPolygon();
    this.setState({
      shapeEditable: true,
      shapeEditActive: false
    });
  },
  componentDidUnmount: function() {
    AccountStore.removeShapeListener();
  },
  getCompute: function(_feature) {
    if (_feature != undefined) {
      var compute = {
        type: _feature.getGeometry().getType(),
        area: map.formatArea(_feature) + ' km²',
        width: map.formatWidth(_feature) + ' km',
        height: map.formatHeight(_feature) + ' km',
        visible: true
      };

      this.setState({
        compute: compute
      });
      AccountStore.updateCoordinates(compute);
    } else if (!_feature) {var compute = {
        type: null,
        area: false,
        width: false,
        height: false,
        visible: false
      };

      this.setState({
        compute: compute
      });
      AccountStore.updateCoordinates(compute);
    }
  },
  drawingDone: function(_feature) {
    this.getCompute(_feature);
    AccountStore.setDrawnShape(_feature);

    this.setState({
      shapeEditActive: false,
      rectangle: false,
      polygon: false,
      drawing: false,
      shape: _feature
    });

    this.getCompute(this.state.feature)
    this.modifyDrawnShape(_feature);
  },
  drawRectangle: function() {
    var drawing = this.state.drawing ? this.state.rectangle ? false : true : true;
    var that = this;
    if (drawing) {
      map.DrawingRectangle().then(function (_feature) {
        that.drawingDone(_feature);
        that.getCompute(_feature);
        that.setState({feature: _feature})
      });
      if (polygonTemp) {
        polygonTemp.setMap(null);
      }
    }
    this.setState({
      shapeEditActive: false,
      rectangle: drawing,
      polygon: false,
      drawing: drawing,
      shape: null
    });
  },
  drawPolygon: function() {
    var drawing = this.state.drawing ? this.state.polygon ? false : true : true;
    var that = this;
    if (drawing) {
      map.DrawingPolygon().then(function (_feature) {
        that.getCompute(_feature);
        that.drawingDone(_feature);
        that.setState({feature: _feature});
      });
    } else {
      if (polygonTemp) {
        polygonTemp.setMap(null);
      }
    }
    this.setState({
      shapeEditActive: false,
      rectangle: false,
      polygon: drawing,
      drawing: drawing,
      shape: null
    });
  },
  deleteDrawnShape: function() {
    if (this.state.shape) {
      map.removeModifingPolygon();
      map.RemoveFeature(this.state.shape, 'drawOverlay');
      this.setState({
        rectangle: false,
        polygon: false,
        drawing: false,
        shape: null,
        shapeEditActive: false
      }, function() {
        this.refs.overlayTriggerDelete.hide();
      });

      this.getCompute()
    }
    AccountStore.setDrawnShape(null);
  },
  fileProcessed: function(_featureArr) {

    this.setState({
      rectangle: false,
      polygon: false,
      drawing: false,
      shape: _featureArr[0],
      shapeEditActive: true
    });
    this.getCompute(_featureArr[0])
    this.modifyDrawnShape(_featureArr[0]);
  },
  render: function() {
    var rectangleBtnClass = this.state.rectangle ? 'button-rectangle active' : 'button-rectangle';
    var polygonBtnClass = this.state.polygon ? 'button-polygon active' : 'button-polygon';
    var submitTaskingButton = null;
    if(AccountStore.userCanSubmitTasking()) {
      submitTaskingButton = (
        <OverlayTrigger placement='bottom' ref="overlayTriggerSubmit" overlay={this.state.shape === null ? <span /> : <Tooltip>{i18n.get('button-submit-tasking-tooltip')}</Tooltip>}>
          <button type="button" onClick={this.openSearchDeleteConfirmationModal} className="submit-tasking" disabled={this.state.shape === null}>{i18n.get('button-submit-tasking')}</button>
        </OverlayTrigger>
      );
    }
    var editClass = this.state.shapeEditActive ? 'button-modify active' : 'button-modify';
    return (
      <div>
        {/*<span className="toolbar-title">{i18n.get('define-aoi-help')}</span>*/}
        <OverlayTrigger placement='bottom' overlay={<Tooltip>{i18n.get('click-to-enable')}</Tooltip>}>
          <button type="button" onClick={this.drawRectangle} className={rectangleBtnClass}>{i18n.get('rectangle')}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>{i18n.get('click-to-enable')}</Tooltip>}>
          <button type="button" onClick={this.drawPolygon} className={polygonBtnClass}>{i18n.get('polygon')}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>{i18n.get('upload-kml')}</Tooltip>}>
          <ShapeUploader onFileSelected={this.deleteDrawnShape} onFileProcessed={this.fileProcessed}/>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' ref="overlayTriggerEdit" overlay={<Tooltip>{i18n.get('modify-aoi')}</Tooltip>}>
          <button type="button" onClick={() => this.modifyDrawnShape(this.state.feautre)} disabled={this.state.shape === null} className={editClass}>{i18n.get('modify-aoi')}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' ref="overlayTriggerDelete" overlay={<Tooltip>{i18n.get('delete-aoi')}</Tooltip>}>
          <button type="button" onClick={this.deleteDrawnShape} disabled={this.state.shape === null} className="button-delete">{i18n.get('delete-aoi')}</button>
        </OverlayTrigger>
        {submitTaskingButton}
        <SubmitTaskingModal show={this.state.showSubmitTaskingModal && AccountStore.userCanSubmitTasking()} onHide={this.closeSubmitTaskingModal} onSubmitSuccess={this.onSubmitSuccess} />
        <ConfirmationModal show={this.state.showSearchDeleteConfirmationModal} onValidate={this.openSubmitTaskingModal} onCancel={this.hideSearchDeleteConfirmationModal} onHide={this.closeConfirmationModal}>
          {i18n.get('search-will-be-deleted-warning')}
        </ConfirmationModal>
      </div>
    );
  },
  openSubmitTaskingModal: function() {
    this.setState({showSubmitTaskingModal: true});
    this.hideSearchDeleteConfirmationModal();
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.DELETE_UNSAVED
    });
  },
  closeSubmitTaskingModal: function() {
    this.setState({showSubmitTaskingModal: false}, function() {
      this.refs.overlayTriggerSubmit.hide();
    });
  },
  closeConfirmationModal: function() {
    this.state.showSearchDeleteConfirmationModal = false;
  },
  openSearchDeleteConfirmationModal: function() {
    var hasSearch = SearchStore.getCurrentSearchResults().ran;
    if(hasSearch) {
      this.setState({showSearchDeleteConfirmationModal: true});
    } else {
      this.openSubmitTaskingModal();
    }
  },
  hideSearchDeleteConfirmationModal: function() {
    this.setState({showSearchDeleteConfirmationModal: false});
  },
  onSubmitSuccess: function() {
    this.state.shape.overlay.setMap(null);
    this.state.shape.overlay.editable = false;
    map.addAoi(this.state.shape.overlay, 'drawing', false);
    AccountStore.setDrawnShape(this.state.shape);
    this.setState({
      shapeEditable: true,
      shapeEditActive: false
    });
  },
  setModifingPolygon: function (_feature) {
    map.setModifingPolygon();

    var that = this;
    map.featureOnChange(_feature, function (_evt) {
      that.getCompute(_feature);
    })

    this.setState({
      shapeEditable: true,
      shapeEditActive: true
    }, function() {
      this.refs.overlayTriggerEdit.hide();
    });

  },
  removeModifyDrawShape: function () {
    map.removeModifingPolygon();

    this.setState({
      shapeEditable: false,
      shapeEditActive: false
    }, function() {
      this.refs.overlayTriggerEdit.hide();
    });

  },
  modifyDrawnShape: function(_feature) {

    var that = this;
    var featureTmp = _feature ? _feature : this.state.feature;

    if (!this.state.shapeEditActive) {
      this.setModifingPolygon(featureTmp);
    } else {
      this.removeModifyDrawShape();
    }

  }
});

module.exports = drawingControl;
