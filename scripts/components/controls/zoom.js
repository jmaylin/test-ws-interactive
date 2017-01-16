var React = require('react');
var Pictos = require('components/utils/Pictos');

var ZoomControl = React.createClass({
  displayName: 'ZoomControl',
  zoomIn: function() {
    this.props.map.zoomIn();
  },
  zoomOut: function() {
    this.props.map.zoomOut();
  },
  zoomInitial: function() {
    this.props.map.zoomInitial();
  },
  render: function() {
    return (
      <div>
        <button type="button" onClick={this.zoomInitial} className="zoom-initial"><Pictos size="2rem" icon="earth" /></button>
        <button type="button" onClick={this.zoomIn} className="zoom-in"><Pictos size="1.5rem" icon="add" /></button>
        <button type="button" onClick={this.zoomOut} className="zoom-out"><Pictos size="1.5rem" icon="remove" /></button>
      </div>
    );
  }
});

module.exports = ZoomControl;
