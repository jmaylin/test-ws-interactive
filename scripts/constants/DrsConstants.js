var keyMirror = require('keymirror');
var i18n = require('../tools/i18n');

module.exports = {
  searchActions: keyMirror({
    NEW: null,
    SAVE: null,
    FIRST_LOAD: null,
    DELETE_UNSAVED: null,
    LOAD: null,
    DELETE: null,
    EDIT: null,
    UPDATE: null,
    RENAME: null,
    FREEZE: null
  }),
  searchType: keyMirror({
    UNSAVED: null,
    DEFAULT: null,
    CUSTOM: null
  }),
  datastripActions: keyMirror({
    PRELOAD: null
  }),
  defaultSearches: {
    CURRENT_TASKING_SEARCH: 'default-slot-current',
    FAVORITE_TASKING_SEARCH: 'default-slot-favorites'
  },
  icrActions: keyMirror({
    TOGGLE_FAVORITE: null,
    FAVORITE_CHANGE: null,
    ACQUISITION_LOAD: null,
    ORDER_LOAD: null
  }),
  progStatus: {
    ACTIVE: i18n.get('taskingStatus-active'), // (ACTIVE_PROG, ACTIVE_PROD, ACTIVE_FULL)
    CURRENT: i18n.get('taskingStatus-current'), //(NOT_STUDIED, IN_PROGRESS, CONF_WAITING)
    SUSPENDED: i18n.get('taskingStatus-SUSPENDED'), //(SUSPENDED)
    CANCELED: i18n.get('taskingStatus-CANCELED'), //(CANCELED)
    COMPLETED: i18n.get('taskingStatus-COMPLETED'), //(COMPLETED)
    DELETED: i18n.get('taskingStatus-DELETED') //(DELETED)
  },
  stationUsage: {
    USAGE_DRS: 'drs',
    USAGE_DRS4VRS: 'drs4vrs',
    USAGE_VRS_GAP_FILLING: 'vrs-gf',
    USAGE_VRS_PROJECT: 'vrs-prj'
  },
  stationType: {
    TYPE_RECEIVING: 'Receiving',
    TYPE_PROCESSING: 'Processing'
  },
  taskingParameters: {
    DEFAULT_INCIDENCE_ANGLE: 33,
    DEFAULT_CLOUD_COVERAGE: 15,
    MAX_INCIDENCE_ANGLE: 52,
    MIN_ANGLE_PLEIADES: 3,
    MIN_ANGLE_ASTROTERRA: 3
  },
  acquisitionStatus: {
    NOT_ANALYZED: 'Not_Analyzed',
    PROPOSED: 'Proposed',
    REFUSED: 'Refused',
    REJECTED: 'Rejected',
    VALIDATED: 'Validated'
  },
  uiActions: keyMirror({
    TOGGLE_VISIBILITY_CIRCLES: null,
    TOGGLE_STATIONS_POSITION: null,
    TOGGLE_MISSIONS_PLANS: null,
    TOGGLE_CUSTOM_LAYERS: null,
    HIDE_ALL: null
  }),
  acquisitionValidation: {
    VALIDATE: 'validate',
    REJECT: 'reject'
  },
  productionParameters: keyMirror({
    ADD: null,
    DELETE: null
  }),
  parametersActions: keyMirror({
    NEW: null,
    SAVE: null,
    FIRST_LOAD: null,
    LOAD: null,
    DELETE: null,
    EDIT: null,
    UPDATE: null
  })
};
