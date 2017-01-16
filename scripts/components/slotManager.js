/**
 * @jsx React.DOM
 */
var React = require('react');
var Slot = require('./slots/slot');

var SearchStore = require('../stores/SearchStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var DrsConstants = require('../constants/DrsConstants');
var SearchActions = require('../actions/SearchActions');
var Promise = require('es6-promise').Promise;

/**
 * Retrieve the current Search data from the SearchStore
 */
function getAllSearches() {
  return SearchStore.getAll();
}

var slotManager = React.createClass({
  displayName: 'SlotManager',
  getInitialState: function() {
    return getAllSearches();
  },

  componentDidMount: function() {
    SearchStore.addInitializedListener(this._onInitialized);
    SearchStore.addChangeListener(this._onChange);
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.FIRST_LOAD
    });
  },

  componentWillUnmount: function() {
    SearchStore.removeInitializedListener(this._onInitialized);
    SearchStore.removeChangeListener(this._onChange);
  },

  render: function() {

    var defaultSlots = this.state.defaults.map(function (slot, index) {
      return (
        <Slot key={index} name={slot.name} type={slot.type} export={slot.export} exportProcessing={slot.exportProcessing} exportDate={slot.exportParameters.date} />
      );
    });
    var customSlots = this.state.custom.map(function (slot) {
      return (
        <Slot key={slot.name + slot.type} name={slot.name} type={slot.type} export={slot.export} exportProcessing={slot.exportProcessing} exportDate={slot.exportParameters.date} />
      );
    });
    return (
      <div className="slot-manager">
          <div className="default-slots slots-type">
            {defaultSlots}
          </div>
          <div className="custom-slots slots-type">
            {customSlots}
          </div>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the SearchStore
   */
  _onChange: function() {

    this.setState(getAllSearches());
  },

  /**
   * Event handler for 'initialized' events coming from the SearchStore
   */
  _onInitialized: function() {
    this.setState(getAllSearches(), function() {
      // get the list of search to preload
      var searchToPreload = [];
      this.state.defaults.map(function (slot) {
        if(!slot.frozen && !slot.loaded) {
          searchToPreload.push(slot);
        }
      });
      this.state.custom.map(function (slot) {
        if(!slot.frozen && !slot.loaded) {
          searchToPreload.push(slot);
        }
      });

      // then load them one by one
      searchToPreload.reduce(function(chain, search) {
        // Once the previous step promise is done...
        return chain.then(function() {
          // ... execute the next identification step
          return SearchActions.loadSearch(search.name, search.type);
        });
      }, Promise.resolve());
    });
  }

});

module.exports = slotManager;
