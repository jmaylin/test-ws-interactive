var React = require('react');
var AccountStore = require('../../stores/AccountStore');
var i18n = require('../../tools/i18n');
var map = require('../../mapOl');

var ShowCoordinates = React.createClass({
  displayName: 'ShowCoordinates',
  getInitialState: function() {
    var that = this;
    map.getCurrentPos(function (_posArray) {
      that.setState({currentPos: _posArray[0]+', '+_posArray[1]});
    });
    return {
      type: false,
      currentPos: true,
      area: false,
      width: false,
      height: false,
      visible: true
    };
  },
  componentDidMount: function() {
    AccountStore.addCoordinatesListener(this.updateCoordinates);
  },
  componentDidUnmount: function() {
    AccountStore.removeCoordinatesListener();
  },
  updateCoordinates: function(compute) {
    this.setState(compute);
  },
  render: function() {
    var currentPos = this.state.currentPos ? <span className="coordinates-currentPos" id="myposition">{i18n.get('current-position')} : {this.state.currentPos}</span> : '';
    var area = this.state.area ? <span className="coordinates-area">{i18n.get('compute-area')} : {this.state.area}</span> : '';
    var width = this.state.width ? <span className="coordinates-width">{i18n.get('compute-width')} : {this.state.width}</span> : '';
    var height = this.state.height ? <span className="coordinates-height">{i18n.get('compute-height')} : {this.state.height}</span> : '';
    return (
      <span className="coordinates">
        {currentPos}
        {area}
        {width}
        {height}
      </span>
    );
  }
});

module.exports = ShowCoordinates;
